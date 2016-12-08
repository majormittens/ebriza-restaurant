import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import 'rxjs/Rx';

declare var flip: any;

/*
  Generated class for the Test page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-test',
  templateUrl: 'test.html'
})
export class TestPage {

    showSignup:boolean = true;
    showLogin:boolean = true;

  constructor(public navCtrl: NavController) {
    // fetch stuff
    this.showSignup = true;
    this.showLogin = true;
  }

  ionViewDidLoad() {
    console.log('Hello TestPage Page');
      // this.showSignup = true;
    
    let vm = this;
    setTimeout(() => {
      let a:HTMLElement = document.getElementById('a');
      let b:HTMLElement = document.getElementById('b');
      console.log("a",a);
      console.log("b",b);      
      // vm.showSignup = true;
      // b.classList.remove('hidden');
setTimeout(() => {
  var container = document.querySelector(".container"),
    elms = document.querySelectorAll(".notifications");
flip(elms,
  function(){ // called when we should make the DOM change
    container.insertBefore(
      b,
      a
    );
  },

  {callback: function(){ // called when the animations finish
    alert("Animations have finished");
  }}
);
},100);


// ...then hide the original elements for the duration of the transition
//  vm.showLogin = false;
//  vm.showSignup = false;
    },5000);
  }

}
