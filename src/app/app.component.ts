import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login'
import {BackandService} from '../providers/backandService'

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = LoginPage;

  constructor(platform: Platform, private backandService:BackandService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      backandService.setIsMobile(platform.is('mobile'));
      backandService.setAppName('city365');
      backandService.setSignUpToken('003c790f-b393-41b5-97c0-86b95d6de568');
      backandService.setAnonymousToken('26a0fc36-be26-433f-ba84-8c4e67610b97');
    });
  }
}
