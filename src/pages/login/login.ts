import {Component} from '@angular/core';
// import {bootstrap} from '@angular/platform-browser-dynamic';
import 'rxjs/Rx'
import {BackandService} from '../../providers/backandService'
import {ramjet} from 'ramjet';
import { SignupPage } from '../pages/signup/signup';

declare var flip: any;

import $ from 'jquery';

@Component({
    templateUrl: 'login.html',
    selector: 'page-login',
})
export class LoginPage {
    
    username:string = 'test@angular2.com';
    password:string = 'angular2';
    auth_type:string = "N/A";
    is_auth_error:boolean = false;
    auth_status:string = null;
    loggedInUser: string = '';
    signUpActive: boolean = false;
    loginActive: boolean = true;

    oldPassword: string = '';
    newPassword: string = '';
    confirmNewPassword: string = '';

  email:string = '';
  firstName:string = '';
  lastName:string = '';
  signUpPassword: string = '';
  confirmPassword: string = '';

    constructor(public backandService:BackandService) { 
        this.auth_type = backandService.getAuthType();
        this.auth_status = backandService.getAuthStatus();
        this.loggedInUser = backandService.getUsername();
    }


    public getAuthTokenSimple() {

        this.auth_type = 'Token';
        var $obs = this.backandService.getAuthTokenSimple(this.username, this.password);
        $obs.subscribe(
            data => {
                this.auth_status = 'OK';
                this.is_auth_error = false;
                this.loggedInUser = this.username;
                this.username = '';
                this.password = '';
            },
            err => {
                var errorMessage = this.backandService.extractErrorMessage(err);

                this.auth_status = `Error: ${errorMessage}`;
                this.is_auth_error = true;
                this.backandService.logError(err)
            },
            () => console.log('Finish Auth'));
    }

    public useAnonymousAuth() {
        this.backandService.useAnonymousAuth();
        this.auth_status = 'OK';
        this.is_auth_error = false;
        this.auth_type = 'Anonymous';
        this.loggedInUser = 'Anonymous';
    }

    public signOut() {
        this.auth_status = null;
        this.backandService.clearAuthTokenSimple();
    }


 ionViewDidLoad() {
     $('.scroll-content').ready(() => {
         $('.scroll-content')[0].style["overflow-y"] = "hidden";
        console.log('',$('.scroll-content')[0]);
     });
 }


    public changePassword() {
        if (this.newPassword != this.confirmNewPassword){
            alert('Passwords should match');
            return;
        }
        var $obs = this.backandService.changePassword(this.oldPassword, this.newPassword);
        $obs.subscribe(
            data => {
                alert('Password changed');
                this.oldPassword = this.newPassword = this.confirmNewPassword = '';
            },
            err => {
                this.backandService.logError(err)
            },
            () => console.log('Finish change password'));
    }

    public showSignUp() {
        var vm = this;
        vm.signUpActive = true;
        $(document).ready(() => {
                          let first:HTMLElement = document.getElementById('page-login');
      let second:HTMLElement = document.getElementById('page-signup');
      console.log("a",first);
      console.log("b",second);      
      // vm.showSignup = true;
      // b.classList.remove('hidden');

  var container = document.querySelector(".city-container"),
    elms = document.querySelectorAll(".city-animated");
flip(elms,
  function(){ // called when we should make the DOM change
    first.parentNode.insertBefore(
      second,
      first
    );
  },

  {callback: function(){ // called when the animations finish
    console.log("Animations have finished");
    vm.loginActive = false;
  }}
);

        });
    }

     public showLogin() {
         var vm = this;
         vm.loginActive = true;
        $(document).ready(() => {
                          let first:HTMLElement = document.getElementById('page-login');
      let second:HTMLElement = document.getElementById('page-signup');
      console.log("a",first);
      console.log("b",second);      
      // vm.showSignup = true;
      // b.classList.remove('hidden');
setTimeout(() => {
  var container = document.querySelector(".city-container"),
    elms = document.querySelectorAll(".city-animated");
flip(elms,
  function(){ // called when we should make the DOM change
    first.parentNode.insertBefore(
      first,
      second
    );
  },

  {callback: function(){ // called when the animations finish
    console.log("Animations have finished");
    vm.signUpActive = false;
  }}
);
},100);
        });


    }

     public signUp() {
    if (this.signUpPassword != this.confirmPassword){
      alert('Passwords should match');
      return;
    }
    var $obs = this.backandService.signUp(this.email, this.signUpPassword, this.confirmPassword, this.firstName, this.lastName);
    $obs.subscribe(                
      data => {
          alert('Sign up succeeded');
          this.email = this.signUpPassword = this.confirmPassword = this.firstName = this.lastName = '';
      },
      err => {
          this.backandService.logError(err)
      },
      () => console.log('Finish Auth'));
  }

  public socialSignin(provider) {
    var $obs = this.backandService.socialAuth(provider, false);
    $obs.subscribe(                
        data => {
            console.log('Sign up succeeded with:' + provider);           
        },
        err => {
            this.backandService.logError(err)
        },
        () => console.log('Finish Auth'));
  }

  public inAppSocial(provider) {
    var $obs = this.backandService.inAppSocial(provider);
    $obs.subscribe(                
        data => {
            console.log('Sign up succeeded with:' + provider);           
        },
        err => {
            this.backandService.logError(err)
        },
        () => console.log('Finish Auth'));
  }

}