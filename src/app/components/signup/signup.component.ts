import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { validateForm } from '../../utils/formValidation';
import { RegistryForm } from '../../types/registry.types';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
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
    console.log(this.signupForm.get('password')?.errors);

    if (Object.keys(this.formErrors).length) {
      return;
    }

    const { email, password } = this.signupForm.value as RegistryForm;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email as string, password as string)
      .then((userCredential) => {

        // update the displayName of the user
        console.log();
        updateProfile(userCredential.user, {
          displayName: `${this.signupForm.value.firstName} ${this.signupForm.value.lastName || ''}`,
        });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          alert('This email already exists');
        } else {
          alert('Oops, some error occurred please try again later');
        }
      });
  }
}
