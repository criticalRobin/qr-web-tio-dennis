import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { FormComponent } from '../form/form.component';
import { environment } from 'src/environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IAgency } from '../interfaces/agency.interface';
import { AgencyService } from '../services/agency.service';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';

@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css'],
})
export class PageListComponent {
  private readonly agencySrv: AgencyService = inject(AgencyService);

  metarecordsColumns: MetaDataColumn[] = [
    { field: 'id', title: 'ID' },
    { field: 'name', title: 'AGENCIA' },
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
  records: IAgency[] = [];
  totalRecords = 0;
  currentPage = 0;
  bottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.loadAgencies();
  }

  loadAgencies() {
    this.agencySrv.getAgencies().subscribe({
      next: (res: IAgency[]) => {
        this.records = res;
        this.totalRecords = res.length;
        this.changePage(0);
      },
      error: (err) => console.error(err),
    });
  }

  tryGetObject(agency: IAgency) {
    console.log(agency);
  }

  delete(id: number) {
    this.agencySrv.deleteAgency(id).subscribe({
      next: () => {
        this.loadAgencies();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  openForm(row: IAgency | null = null) {
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
        const agency: IAgency = response;

        this.agencySrv.updateAgency(response.id, agency).subscribe({
          next: () => {
            this.loadAgencies();
          },
          error: (err) => {
            console.error(err);
          },
        });

        this.showMessage('Edición exitosa');
      } else {
        const newAgency = { ...response };
        this.agencySrv.createAgency(newAgency).subscribe({
          next: () => {
            this.loadAgencies();
          },
          error: (err) => {
            console.error(err);
          },
        });

        this.showMessage('Registro exitoso');
      }
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet('Lista de Agencias', 'agencias', this.records);
        break;
      case 'NEW':
        this.openForm();
        break;
    }
  }

  showBottomSheet(title: string, fileName: string, records: any) {
    this.bottomSheet.open(DownloadComponent);
  }

  showMessage(message: string, duration: number = 5000) {
    this.snackBar.open(message, '', { duration });
  }

  changePage(page: number) {
    const pageSize = environment.PAGE_SIZE;
    const skip = pageSize * page;
    this.records = this.records.slice(skip, skip + pageSize);
    this.currentPage = page;
  }
}
