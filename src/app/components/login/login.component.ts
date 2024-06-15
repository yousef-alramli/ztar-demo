import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { RegistryForm } from '../../types/registry.types';

import { validateForm } from '../../utils/formValidation';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private authService: AuthService) { }

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

    this.authService.login(this.loginForm);
  }
}
