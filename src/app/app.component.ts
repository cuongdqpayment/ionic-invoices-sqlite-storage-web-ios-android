import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { TabsPage } from '../pages/tabs/tabs';
// import { LoginPhonePage } from '../pages/login-phone/login-phone';
// import { HomePage } from '../pages/home/home';
import { InvoicePage } from '../pages/invoice/invoice';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any; // = InvoicePage;
  isWeb: boolean = false;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      
      statusBar.styleDefault();
      splashScreen.hide();

      if (  platform.is('mobileweb') 
         || platform.platforms()[0] == 'core'){
        //version web
        this.isWeb = true;
      }

      this.rootPage = InvoicePage;

    });
  }
}

