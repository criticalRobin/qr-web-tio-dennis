import { Component, inject } from '@angular/core';
import { FormComponent } from '../form/form.component';
import { environment } from 'src/environments/environment.development';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';

export interface IFollowUp {
  id: number;
  qrId: string;
  description: string;
  client: string;
  employee: string;
}

@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css'],
})
export class PageListComponent {
  data: IFollowUp[] = [
    {
      id: 1,
      qrId: 'QR12345',
      description: 'Descripción del seguimiento 1',
      client: 'Cliente A',
      employee: 'Empleado X',
    },
    {
      id: 2,
      qrId: 'QR67890',
      description: 'Descripción del seguimiento 2',
      client: 'Cliente B',
      employee: 'Empleado Y',
    },
    {
      id: 3,
      qrId: 'QR11121',
      description: 'Descripción del seguimiento 3',
      client: 'Cliente C',
      employee: 'Empleado Z',
    },
    {
      id: 4,
      qrId: 'QR22233',
      description: 'Descripción del seguimiento 4',
      client: 'Cliente D',
      employee: 'Empleado W',
    },
    {
      id: 5,
      qrId: 'QR44455',
      description: 'Descripción del seguimiento 5',
      client: 'Cliente E',
      employee: 'Empleado V',
    },
    {
      id: 6,
      qrId: 'QR66677',
      description: 'Descripción del seguimiento 6',
      client: 'Cliente F',
      employee: 'Empleado U',
    },
    {
      id: 7,
      qrId: 'QR88899',
      description: 'Descripción del seguimiento 7',
      client: 'Cliente G',
      employee: 'Empleado T',
    },
    {
      id: 8,
      qrId: 'QR101112',
      description: 'Descripción del seguimiento 8',
      client: 'Cliente H',
      employee: 'Empleado S',
    },
    {
      id: 9,
      qrId: 'QR131415',
      description: 'Descripción del seguimiento 9',
      client: 'Cliente I',
      employee: 'Empleado R',
    },
    {
      id: 10,
      qrId: 'QR161718',
      description: 'Descripción del seguimiento 10',
      client: 'Cliente J',
      employee: 'Empleado Q',
    },
  ];
  metaDataColumns: MetaDataColumn[] = [
    { field: 'id', title: 'ID' },
    { field: 'qrId', title: 'QRID' },
    { field: 'description', title: 'DECRIPCIÓN' },
    { field: 'client', title: 'CLIENTE' },
    { field: 'employee', title: 'EMPLEADO' },
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
  records: IFollowUp[] = [];
  totalRecords = this.data.length;
  currentPage = 0;
  bottomSheet: MatBottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.loadFolowUps();
  }

  loadFolowUps() {
    this.records = [...this.data];
    this.changePage(this.currentPage);
  }

  delete(id: number) {
    const position = this.data.findIndex((ind) => ind.id === id);
    this.records = this.data.splice(position, 1);
    this.loadFolowUps();
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
        const index = this.data.findIndex((qr) => qr.id === response.id);
        if (index !== -1) {
          this.data[index] = response;
        }
        this.totalRecords = this.data.length;
        this.loadFolowUps();
        this.showMessage('Registro actualizado');
      } else {
        const newFollowUp = { ...response, id: this.data.length + 1 };
        this.data.push(newFollowUp);
        this.totalRecords = this.data.length;
        this.loadFolowUps();
        this.showMessage('Registro exitoso');
      }
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet('Lista de Seguimiento', 'qr', this.data);
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
          this.loadFolowUps();
        }
      }
    });
  }
}
