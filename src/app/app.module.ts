import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { IconService } from './core/services/icon.service';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

const options = environment.firebaseConfig;

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(options),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private iconService: IconService) {}
}
