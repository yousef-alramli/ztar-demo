import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../services/auth/auth.service';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceStub: Partial<AuthService>;

  beforeEach(async () => {
    authServiceStub = {
      signup: jasmine.createSpy('signup')
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SignupComponent],
      providers: [
        { provide: AuthService, useValue: authServiceStub }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.signupForm;
    expect(form).toBeDefined();
    expect(form.get('firstName')?.value).toBe('');
    expect(form.get('lastName')?.value).toBe('');
    expect(form.get('email')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');
    expect(form.get('confirmPassword')?.value).toBe('');
  });

  it('should validate form and set formErrors if invalid', () => {
    component.formErrors = {};
    component.onSignup();
    expect(component.formErrors).toEqual({
      firstName: 'This field is required',
      email: 'This field is required',
      password: 'This field is required',
      confirmPassword: 'This field is required',
    });
  });

  it('should call AuthService.signup if form is valid', () => {
    component.signupForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!'
    });

    component.onSignup();
    expect(component.formErrors).toEqual({});
    expect(authServiceStub.signup).toHaveBeenCalledWith(component.signupForm);
  });

  it('should not call AuthService.signup if form is invalid', () => {
    component.signupForm.setValue({
      firstName: '',
      lastName: '',
      email: 'invalid-email',
      password: 'short',
      confirmPassword: 'short'
    });

    component.onSignup();
    expect(authServiceStub.signup).not.toHaveBeenCalled();
  });
});
