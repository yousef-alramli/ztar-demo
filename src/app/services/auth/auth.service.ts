import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import * as firebaseAuth from "firebase/auth";

import { RegistryForm } from '../../types/registry.types';
import { ModalService } from '../modal/modal.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private modalService: ModalService,
    private router: Router,
  ) { }

  firebase = firebaseAuth;

  login(loginForm: FormGroup) {
    const { email, password } = loginForm.value as RegistryForm;
    const auth = this.firebase.getAuth();

    this.firebase.signInWithEmailAndPassword(auth, email as string, password as string)
      .then((userCredential) => {
        userCredential.user.getIdTokenResult().then(data => {
          localStorage.setItem('token', data.token);
        });

        this.router.navigate(['home']);
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-credential') {
          alert('Wrong email or password');
        } else {
          alert('Oops, some error occurred please try again later');
        }
      });
  }

  signup(signupForm: FormGroup) {
    const { email, password } = signupForm.value as RegistryForm;
    const auth = this.firebase.getAuth();

    this.firebase.createUserWithEmailAndPassword(auth, email as string, password as string)
      .then((userCredential) => {

        this.firebase.updateProfile(userCredential.user, {
          displayName: `${signupForm.value.firstName} ${signupForm.value.lastName || ''}`.trim(),
        });

        this.modalService.openCustomModal({
          header: 'Account created',
          message: 'Your account created successfully',
          cancelButton: {
            action: () => this.router.navigate(['login']),
          },
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
