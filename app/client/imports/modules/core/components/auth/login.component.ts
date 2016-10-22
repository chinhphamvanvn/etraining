import { Component } from '@angular/core';
import {InjectUser} from "angular2-meteor-accounts-ui";
import template from './login.component.html';

@Component({
    moduleId: module.id,
    selector: 'core-login',
    template,
    styleUrls: ['login-buttons.scss']
})

@InjectUser('user')
export class LoginComponent {

    constructor() {
    }

    logout() {
    	Meteor.logout();
  	}
}
