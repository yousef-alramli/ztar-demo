import { Injectable } from '@angular/core';

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { RegistryForm } from '../../types/registry.types';
import { FormGroup } from '@angular/forms';
import { ModalService } from '../modal/modal.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private modalService: ModalService,
    private router: Router,
  ) { }


  login(loginForm: FormGroup) {
    const { email, password } = loginForm.value as RegistryForm;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email as string, password as string)
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
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email as string, password as string)
      .then((userCredential) => {
        updateProfile(userCredential.user, {
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
