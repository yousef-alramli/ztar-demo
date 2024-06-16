import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import Spy = jasmine.Spy;

import { FirebaseService } from '../../services/firebase/firebase.service';
import { BooksComponent } from './books.component';
import { BookData } from '../../types/firestoreData.types';
import { mockFirebaseService } from '../../services/firebase/firebase-service.mock';
import { BOOKS_PATH, CATEGORIES_PATH } from '../../constants/firestore.const';

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockBookDetails: BookData = {
    category: 'Test Category',
    id: '1',
    numberOfBooks: 5,
    Publisher: 'Test publisher',
    title: 'Test Book',
    year: 1992,
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: FirebaseService, useValue: mockFirebaseService() },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ details: mockBookDetails }),
          }
        },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
  });

  it('', () => {
    expect(true).toBeTrue();
  })
  it('should create the books component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCategories on init', () => {
    spyOn(component, 'getCategories');
    const categoriesDoc = { docs: [{ data: () => ({ value: 'Category 1' }), id: '1' }] } as any;
    (component.firebaseService.getMultipleDocs as Spy).and.returnValue(of(categoriesDoc));

    component.ngOnInit();
    console.log('=====>>>>>>>>');
    expect(component.getCategories).toHaveBeenCalled();
  });

  it('should fetch categories if not already loaded', () => {
    const categoriesDoc = { docs: [{ data: () => ({ value: 'Category 1' }), id: '1' }] } as any;
    (component.firebaseService.getMultipleDocs as Spy).and.returnValue(of(categoriesDoc));

    component.getCategories();

    expect(component.firebaseService.getMultipleDocs).toHaveBeenCalledWith(CATEGORIES_PATH, {});
    expect(component.firebaseService.allCategories.length).toBe(1);
    expect(component.firebaseService.allCategories[0]).toEqual({ value: 'Category 1', id: '1' });
  });

  it('should fetch books for selected category', () => {
    const booksDoc = { docs: [{ data: () => (mockBookDetails), id: '1' }] } as any;
    (component.firebaseService.getMultipleDocs as Spy).and.returnValue(of(booksDoc));

    component.getBooks('categoryId');
    expect(component.firebaseService.getMultipleDocs).toHaveBeenCalledWith(BOOKS_PATH, {
      whereQuery: [{ fieldToFilter: 'category', operator: '==', value: 'categoryId' }]
    });
    expect(component.books.length).toBe(1);
    expect(component.books[0]).toEqual({ ...mockBookDetails, id: '1' });
  });

  it('should navigate to book details', () => {
    component.redirectToDetails('bookId');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/books/bookId']);
  });

  it('should unsubscribe on destroy', () => {
    component.getBooksSubscribe = new Observable().subscribe();
    component.getCategoriesSubscribe = new Observable().subscribe();

    spyOn(component.getBooksSubscribe, 'unsubscribe');
    spyOn(component.getCategoriesSubscribe, 'unsubscribe');

    component.ngOnDestroy();
    expect(component.getBooksSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.getCategoriesSubscribe.unsubscribe).toHaveBeenCalled();
  });
});