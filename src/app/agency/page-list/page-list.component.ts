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
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css'],
})
export class PageListComponent {
  private readonly agencySrv: AgencyService = inject(AgencyService);
  private readonly sharedSrv = inject(SharedService);

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
    this.sharedSrv.loadData(() => this.agencySrv.getAgencies(), this);
  }

  tryGetObject(agency: IAgency) {
    console.log(agency);
  }

  delete(id: number) {
    this.sharedSrv.delete(
      id,
      () => this.agencySrv.deleteAgency(id),
      () => this.loadAgencies()
    );
  }

  openForm(row: IAgency | null = null) {
    this.sharedSrv.openForm(row, FormComponent).subscribe((response) => {
      if (!response) return;

      if (response.id) {
        this.agencySrv.updateAgency(response.id, response).subscribe({
          next: () => {
            this.loadAgencies();
            this.sharedSrv.showMessage('Edición exitosa');
          },
          error: (err) => console.error(err),
        });
      } else {
        this.agencySrv.createAgency(response).subscribe({
          next: () => {
            this.loadAgencies();
            this.sharedSrv.showMessage('Registro exitoso');
          },
          error: (err) => console.error(err),
        });
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

  changePage(page: number) {
    const pageSize = environment.PAGE_SIZE;
    const skip = pageSize * page;
    this.records = this.records.slice(skip, skip + pageSize);
    this.currentPage = page;
  }
}
