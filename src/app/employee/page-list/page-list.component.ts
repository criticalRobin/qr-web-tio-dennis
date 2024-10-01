import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { FormComponent } from '../form/form.component';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { environment } from 'src/environments/environment.development';

export interface IEmployee {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}

@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css'],
})
export class PageListComponent {
  data: IEmployee[] = [
    {
      id: 1,
      firstName: 'Juan',
      lastName: 'Torres',
      phoneNumber: '0945123564',
      address: 'Ambato',
    },
    {
      id: 2,
      firstName: 'Mateo',
      lastName: 'Vazques',
      phoneNumber: '0945123564',
      address: 'Ambato',
    },
    {
      id: 3,
      firstName: 'Pedro',
      lastName: 'Messi',
      phoneNumber: '0945123564',
      address: 'Ambato',
    },
    {
      id: 4,
      firstName: 'Emilio',
      lastName: 'Obando',
      phoneNumber: '0945123564',
      address: 'Ambato',
    },
    {
      id: 5,
      firstName: 'Diego',
      lastName: 'Cadme',
      phoneNumber: '0945123564',
      address: 'Ambato',
    },
    {
      id: 6,
      firstName: 'Edder',
      lastName: 'Naranjo',
      phoneNumber: '0945123564',
      address: 'Ambato',
    },
    {
      id: 7,
      firstName: 'Paul',
      lastName: 'Vela',
      phoneNumber: '0945123564',
      address: 'Ambato',
    },
  ];
  metaDataColumns: MetaDataColumn[] = [
    { field: 'id', title: 'ID' },
    { field: 'firstName', title: 'NOMBRE' },
    { field: 'lastName', title: 'APELLIDO' },
    { field: 'phoneNumber', title: 'TELÉFONO' },
    { field: 'address', title: 'DIRECCIÓN' },
  ];
  keypadButtons: KeypadButton[] = [
    {
      icon: 'cloud_download',
      tooltip: 'EXPORTAR',
      color: 'accent',
      action: 'DOWNLOAD',
    },
    { icon: 'add', tooltip: 'AGREGAR', color: 'primary', action: 'NEW' },
  ];
  records: IEmployee[] = [];
  totalRecords = this.data.length;
  currentPage = 0;
  bottomSheet: MatBottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.records = [...this.data];
    this.changePage(this.currentPage);
  }

  delete(id: number) {
    const position = this.data.findIndex((ind) => ind.id === id);
    this.records = this.data.splice(position, 1);
    this.loadEmployees();
  }

  openForm(row: any | null = null) {
    const options = {
      panelClass: 'panel-container',
      disableClose: true,
      data: row,
    };
    const reference: MatDialogRef<FormComponent> = this.dialog.open(
      FormComponent,
      options
    );

    reference.afterClosed().subscribe((response) => {
      if (!response) {
        return;
      }
      if (response.id) {
        const index = this.data.findIndex(
          (employee) => employee.id === response.id
        );
        if (index !== -1) {
          this.data[index] = response;
        }
        this.totalRecords = this.data.length;
        this.loadEmployees();
        this.showMessage('Registro actualizado');
      } else {
        const newEmployee = { ...response, id: this.data.length + 1 };
        this.data.push(newEmployee);
        this.totalRecords = this.data.length;
        this.loadEmployees();
        this.showMessage('Registro exitoso');
      }
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet('Lista de Empleados', 'empleados', this.data);
        break;
      case 'NEW':
        this.openForm();
        break;
    }
  }

  showBottomSheet(title: string, fileName: string, data: any) {
    this.bottomSheet.open(DownloadComponent);
  }

  showMessage(message: string, duration: number = 5000) {
    this.snackBar.open(message, '', { duration });
  }

  changePage(page: number) {
    const pageSize = environment.PAGE_SIZE;
    const skip = pageSize * page;
    this.data = this.records.slice(skip, skip + pageSize);
  }

  editRecord(record: any) {
    const dialogRef = this.dialog.open(FormComponent, {
      data: record,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.data.findIndex((r) => r.id === result.id);
        if (index !== -1) {
          this.data[index] = result;
          this.loadEmployees();
        }
      }
    });
  }
}
