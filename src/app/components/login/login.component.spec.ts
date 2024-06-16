import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth/auth.service';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate email and password fields', () => {
    let email = component.loginForm.controls['email'];
    let password = component.loginForm.controls['password'];

    email.setValue('');
    password.setValue('');
    expect(email.valid).toBeFalsy();
    expect(password.valid).toBeFalsy();

    email.setValue('invalid-email');
    expect(email.valid).toBeFalsy();

    email.setValue('valid@example.com');
    password.setValue('validpassword');
    expect(email.valid).toBeTruthy();
    expect(password.valid).toBeTruthy();
  });

  it('should call authService.login when form is valid', () => {
    spyOn(component, 'onLogin').and.callThrough();

    component.loginForm.controls['email'].setValue('valid@example.com');
    component.loginForm.controls['password'].setValue('validpassword');
    component.onLogin();

    expect(component.onLogin).toHaveBeenCalled();
    expect(authServiceSpy.login).toHaveBeenCalledWith(component.loginForm);
  });

  it('should not call authService.login when form is invalid', () => {
    spyOn(component, 'onLogin').and.callThrough();

    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    component.onLogin();

    expect(component.onLogin).toHaveBeenCalled();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });
});
