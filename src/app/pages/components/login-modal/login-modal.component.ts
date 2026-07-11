import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Injectable } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import {LoginComponent} from '../login/login.component';

@Component({
  selector: 'app-login-modal',
  templateUrl: 'login-modal.component.html',
  imports: [ReactiveFormsModule, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonTitle, IonToolbar],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginModalComponent   {
name!: string;

 
constructor(private modalCtrl: ModalController, private loginModarl: LoginComponent) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.loginModarl.doLogin();
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }
}