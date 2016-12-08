import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { CrudPage } from '../pages/crud/crud';
import { TabsPage } from '../pages/tabs/tabs';
import { BackandService } from '../providers/backandService';
import { TestPage } from '../pages/test/test';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    CrudPage,
    TabsPage,
    TestPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    CrudPage,    
    TabsPage,
    TestPage
  ],
  providers: [BackandService]
})
export class AppModule {}
