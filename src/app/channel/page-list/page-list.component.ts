import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { FormComponent } from '../form/form.component';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { environment } from 'src/environments/environment.development';
import { IChannel } from '../interfaces/channel.interface';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { ChannelService } from '../services/channel.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css'],
})
export class PageListComponent {
  metarecordsColumns: MetaDataColumn[] = [
    { field: 'id', title: 'ID' },
    { field: 'name', title: 'CANAL' },
    { field: 'extension', title: 'EXTENSIÓN' },
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
  records: IChannel[] = [];
  totalRecords = 0;
  currentPage = 0;
  bottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  channelSrv = inject(ChannelService);
  sharedSrv = inject(SharedService);

  constructor() {
    this.loadChannels();
  }

  loadChannels() {
    this.sharedSrv.loadData(() => this.channelSrv.getChannels(), this);
  }

  tryGetObject(channel: IChannel) {
    console.log(channel);
  }

  delete(id: number) {
    this.sharedSrv.delete(
      id,
      () => this.channelSrv.deleteChannel(id),
      () => this.loadChannels()
    );
  }

  openForm(row: IChannel | null = null) {
    this.sharedSrv.openForm(row, FormComponent).subscribe((response) => {
      if (!response) return;

      if (response.id) {
        this.channelSrv.updateChannel(response.id, response).subscribe({
          next: () => {
            this.loadChannels();
            this.sharedSrv.showMessage('Edición exitosa');
          },
          error: (err) => console.error(err),
        });
      } else {
        this.channelSrv.createChannel(response).subscribe({
          next: () => {
            this.loadChannels();
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
        this.showBottomSheet('Lista de Canales', 'canales', this.records);
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
