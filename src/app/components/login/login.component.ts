import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { RegistryForm } from '../../types/registry.types';
import { validateForm } from '../../utils/formValidation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  constructor() {}

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

    const { email, password } = this.loginForm.value as RegistryForm;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email as string, password as string)
      .then((userCredential) => {
        console.log('userCredential >>> ', userCredential);
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-credential') {
          alert('Wrong email or password');
        } else {
          alert('Oops, some error occurred please try again later');
        }
      });
  }
}
