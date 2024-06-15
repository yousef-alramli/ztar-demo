import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { validateForm } from '../../utils/formValidation';

import { RegistryForm } from '../../types/registry.types';

import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  constructor(private authService: AuthService) { }

  signupForm = new FormGroup({
    firstName: new FormControl<string>('', [Validators.required]),
    lastName: new FormControl<string>(''),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_])[A-Za-z\d!@#$%^&*()\-_]{8,}$/),
    ]),
    confirmPassword: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
  });

  formErrors: RegistryForm = {};

  /**
   * Handle user signup
   */
  onSignup() {
    this.formErrors = validateForm(this.signupForm, true);

    if (Object.keys(this.formErrors).length) {
      return;
    }

    this.authService.signup(this.signupForm);
  }
}
