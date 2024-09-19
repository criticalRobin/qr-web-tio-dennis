import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ContainerComponent } from './container/container.component';
import { TableComponent } from './table/table.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { DownloadComponent } from './download/download.component';
import { KeyPadButtonComponent } from './key-pad-button/key-pad-button.component';


@NgModule({
  declarations: [
    ContainerComponent,
    TableComponent,
    PaginatorComponent,
    DownloadComponent,
    KeyPadButtonComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    ContainerComponent,
    TableComponent,
    PaginatorComponent,
    DownloadComponent,
    KeyPadButtonComponent
  ]
})
export class SharedModule { }
