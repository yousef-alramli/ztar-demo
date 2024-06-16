import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { of } from 'rxjs';
import Spy = jasmine.Spy;

import { CategoryCreateComponent } from './category-create.component';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CATEGORIES_PATH } from '../../../constants/firestore.const';
import { mockFirebaseService } from '../../../services/firebase/firebase-service.mock';

describe('CategoryCreateComponent', () => {
  let component: CategoryCreateComponent;
  let fixture: ComponentFixture<CategoryCreateComponent>;
  const firebaseService = mockFirebaseService();
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: FirebaseService, useValue: firebaseService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create the category create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.createForm).toBeTruthy();
    expect(component.createForm.get('name')?.value).toBe('');
  });

  it('should validate form and set errors on invalid form submission', () => {
    spyOn(component, 'onSave').and.callThrough();
    component.onSave();
    expect(component.onSave).toHaveBeenCalled();
    expect(Object.keys(component.formErrors).length).toBeGreaterThan(0);
  });

  it('should call addDoc and navigate on valid form submission', () => {
    component.createForm.setValue({ name: 'New Category' });
    (firebaseService.addDoc as Spy).and.returnValue(of({}));

    component.onSave();
    expect(component.formErrors).toEqual({});
    expect(firebaseService.addDoc).toHaveBeenCalledWith({ value: 'new category' }, CATEGORIES_PATH);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['categories']);
  });
});