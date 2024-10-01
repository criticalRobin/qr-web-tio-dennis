import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { FormComponent } from '../form/form.component';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { environment } from 'src/environments/environment.development';

export interface IQR {
  id: number;
  description: string;
}

@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css'],
})
export class PageListComponent {
  data: IQR[] = [
    {
      id: 1,
      description: 'Queja 1',
    },
    {
      id: 2,
      description: 'Queja 2',
    },
    {
      id: 3,
      description: 'Pregunta 1',
    },
    {
      id: 4,
      description: 'Pregunta 2',
    },
    {
      id: 5,
      description: 'Queja 3',
    },
    {
      id: 6,
      description: 'Queja 4',
    },
    {
      id: 7,
      description: 'Pregunta 3',
    },
    {
      id: 8,
      description: 'Pregunta 4',
    },
  ];
  metaDataColumns: MetaDataColumn[] = [
    { field: 'id', title: 'ID' },
    { field: 'description', title: 'DECRIPCIÓN' },
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
  records: IQR[] = [];
  totalRecords = this.data.length;
  currentPage = 0;
  bottomSheet: MatBottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.loadQRs();
  }

  loadQRs() {
    this.records = [...this.data];
    this.changePage(this.currentPage);
  }

  delete(id: number) {
    const position = this.data.findIndex((ind) => ind.id === id);
    this.records = this.data.splice(position, 1);
    this.loadQRs();
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
        this.loadQRs();
        this.showMessage('Registro actualizado');
      } else {
        const newQR = { ...response, id: this.data.length + 1 };
        this.data.push(newQR);
        this.totalRecords = this.data.length;
        this.loadQRs();
        this.showMessage('Registro exitoso');
      }
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet(
          'Lista de Preguntas y Respuestas',
          'qr',
          this.data
        );
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
          this.loadQRs();
        }
      }
    });
  }
}
