import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FirebaseService } from '../../services/firebase/firebase.service';

import { RegistryForm } from '../../types/registry.types';

import { validateForm } from '../../utils/formValidation';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private firestoreService: FirebaseService) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  formErrors: RegistryForm = {};

  onLogin() {
    this.formErrors = validateForm(this.loginForm);
    if (Object.keys(this.formErrors).length) {
      return;
    }

    this.firestoreService.login(this.loginForm);
  }
}
