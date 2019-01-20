import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { LoginPhonePage } from '../pages/login-phone/login-phone';

import { CustomerPage } from '../pages/customer/customer';
import { InvoicePage } from '../pages/invoice/invoice';
import { ReportPage } from '../pages/report/report';
import { TabsPage } from '../pages/tabs/tabs';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { StorageServiceModule } from 'angular-webstorage-service';
import { ApiStorageService } from '../services/apiStorageService';

import { ApiAuthService } from '../services/apiAuthService';
import { ApiImageService } from '../services/apiImageService';

import { ApiResourceService } from '../services/apiResourceServices';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from '../interceptors/requestInterceptor';
import { ResponseInterceptor } from '../interceptors/responseInterceptor';

import { SQLite } from '@ionic-native/sqlite';
import { ApiSqliteService } from '../services/apiSqliteService';


@NgModule({
  declarations: [
    MyApp,
    LoginPhonePage,
    CustomerPage,
    InvoicePage,
    ReportPage,
    TabsPage,
    HomePage,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StorageServiceModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPhonePage,
    CustomerPage,
    InvoicePage,
    ReportPage,
    TabsPage,
    HomePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    InAppBrowser,
    ApiAuthService,
    ApiImageService,
    ApiStorageService,
    ApiSqliteService,
    ApiResourceService,
    RequestInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler, 
      useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
