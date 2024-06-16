import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

import Spy = jasmine.Spy;

import { AuthService } from './auth.service';
import { ModalService } from '../modal/modal.service';
import * as firebaseAuth from 'firebase/auth';
import { mockFirestore } from '../firebase/firestor.mock';

describe('AuthService', () => {
  let service: AuthService;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const modalSpy = jasmine.createSpyObj('ModalService', ['openCustomModal']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        AuthService,
        { provide: ModalService, useValue: modalSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(AuthService);
    modalServiceSpy = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    service.firebase = mockFirestore() as typeof service.firebase;

    (service.firebase.getAuth as Spy).and.returnValue({} as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    let loginForm: FormGroup;

    beforeEach(() => {
      loginForm = new FormGroup({
        email: new FormControl('test@example.com', [Validators.required, Validators.email]),
        password: new FormControl('password123', Validators.required)
      });

      (service.firebase.getAuth as Spy).and.returnValue({} as any);
      (service.firebase.signInWithEmailAndPassword  as Spy).and.callFake((auth, email, password): Promise<firebaseAuth.UserCredential> => {
        if (email === 'test@example.com' && password === 'password123') {
          return Promise.resolve({
            user: {
              getIdTokenResult: () => Promise.resolve({ token: 'testToken' })
            }
          }) as any;
        } else {
          return Promise.reject({ code: 'auth/invalid-credential' });
        }
      });
    });

    it('should login successfully and navigate to home', fakeAsync (() => {
      service.login(loginForm);
      tick();
      expect(localStorage.getItem('token')).toBe('testToken');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
    }));

    it('should show alert on invalid credentials', fakeAsync(() => {
      spyOn(window, 'alert');
      loginForm.setValue({ email: 'wrong@example.com', password: 'wrongpassword' });

      service.login(loginForm);
      tick();
      expect(window.alert).toHaveBeenCalledWith('Wrong email or password');
    }));
  });

  describe('signup', () => {
    let signupForm: FormGroup;

    beforeEach(() => {
      signupForm = new FormGroup({
        firstName: new FormControl('John', Validators.required),
        lastName: new FormControl('Doe'),
        email: new FormControl('john.doe@example.com', [Validators.required, Validators.email]),
        password: new FormControl('Password1!', [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_])[A-Za-z\d!@#$%^&*()\-_]{8,}$/)
        ]),
        confirmPassword: new FormControl('Password1!', Validators.required),
      });

      (service.firebase.createUserWithEmailAndPassword as Spy).and.callFake((auth, email, password): Promise<firebaseAuth.UserCredential> => {
        if (email === 'john.doe@example.com' && password === 'Password1!') {
          return Promise.resolve({
            user: {
              updateProfile: () => Promise.resolve()
            }
          }) as any;
        } else {
          return Promise.reject({ code: 'auth/email-already-in-use' });
        }
      });
      (service.firebase.updateProfile as Spy).and.returnValue(Promise.resolve() as any);
    });

    it('should sign up successfully and show success modal',fakeAsync (() => {
      service.signup(signupForm);
      tick();

      expect(modalServiceSpy.openCustomModal).toHaveBeenCalledWith({
        header: 'Account created',
        message: 'Your account created successfully',
        cancelButton: { action: jasmine.any(Function) }
      });
    }));

    it('should show alert on email already in use', fakeAsync (() => {
      spyOn(window, 'alert');
      signupForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'Password1!',
        confirmPassword: 'Password1!'
      });

      service.signup(signupForm);
      tick();
      expect(window.alert).toHaveBeenCalledWith('This email already exists');
    }));
  });
});
