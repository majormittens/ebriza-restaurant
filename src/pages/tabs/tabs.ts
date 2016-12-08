import { Component } from '@angular/core';

import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { CrudPage } from '../crud/crud';
import { TestPage } from '../test/test';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = LoginPage;
  tab2Root: any = SignupPage;
  tab3Root: any = TestPage;

  constructor() {

  }
}
