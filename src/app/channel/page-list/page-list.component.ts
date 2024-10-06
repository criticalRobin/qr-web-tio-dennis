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

  constructor() {
    this.loadChannels();
  }

  loadChannels() {
    this.channelSrv.getChannels().subscribe({
      next: (res: IChannel[]) => {
        this.records = res;
        this.totalRecords = res.length;
        this.changePage(0);
      },
      error: (err) => console.error(err),
    });
  }

  tryGetObject(channel: IChannel) {
    console.log(channel);
  }

  delete(id: number) {
    this.channelSrv.deleteChannel(id).subscribe({
      next: () => {
        this.loadChannels();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  openForm(row: IChannel | null = null) {
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
        const channel: IChannel = response;

        this.channelSrv.updateChannel(response.id, channel).subscribe({
          next: () => {
            this.loadChannels();
          },
          error: (err) => {
            console.error(err);
          },
        });

        this.showMessage('Edición exitosa');
      } else {
        const newChannel = { ...response };
        this.channelSrv.createChannel(newChannel).subscribe({
          next: () => {
            this.loadChannels();
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
