import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { validateForm } from '../utils/formValidation';
import { registryForm } from '../types/registry.types';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm = new FormGroup({
    firstName: new FormControl<string>('', [ Validators.required]),
    lastName: new FormControl<string>(''),
    email: new FormControl<string>('', [ Validators.required ,Validators.email]),
    password: new FormControl<string>('', [ Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
  });

  formErrors: registryForm = {};

  /**
   * Handle user signup
   */
  onSignup() {
    this.formErrors = validateForm(this.signupForm);

    if (Object.keys(this.formErrors).length) {
      return;
    }

    const {email, password} = this.signupForm.value as {[key: string]: string}
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('userCredential >>>', userCredential);
        

        // update the displayName of the user
        updateProfile(userCredential.user, {
          displayName: `${this.signupForm.controls.firstName} ${this.signupForm.controls.lastName || ''}`,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log('error >>>',errorCode, );
        console.log('errorMessage >>>',errorMessage, );
        
        
        if(error.code === 'auth/email-already-in-use'){
          alert('This email already exists');
        } else {
          alert('Oops, some error occurred please try again later');
        }
      });
  }
}
