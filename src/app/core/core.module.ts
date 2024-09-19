import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { FormComponent } from './form/form.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { PageLoginComponent } from './page-login/page-login.component';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    FormComponent,
    HeaderComponent,
    MenuComponent,
    PageLoginComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule
  ]
})
export class CoreModule { }
