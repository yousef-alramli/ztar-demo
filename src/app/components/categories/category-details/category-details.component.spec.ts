import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { Observable, of } from 'rxjs';

import Spy = jasmine.Spy;

import { CommonObj } from '../../../types/common-object';
import { CategoryData } from '../../../types/firestoreData.types';
import { BOOKS_PATH } from '../../../constants/firestore.const';
import { CategoryDetailsComponent } from './category-details.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { mockFirebaseService } from '../../../services/firebase/firebase-service.mock';

describe('CategoryDetailsComponent', () => {
  let component: CategoryDetailsComponent;
  let fixture: ComponentFixture<CategoryDetailsComponent>;
  const firebaseService = mockFirebaseService();

  const categoryData: CategoryData = {
    id: 'category1',
    value: 'Category 1'
  };

  const booksDoc = {
    docs: [
      { data: () => ({ category: 'cat_1', title: 'Book 1', year: 2021, numberOfBooks: 10 }), id: 'book1' },
      { data: () => ({ category: 'cat_2', title: 'Book 2', year: 2020, numberOfBooks: 5 }), id: 'book2' }
    ]
  };

  beforeEach(async () => {
    (firebaseService.getMultipleDocs as Spy).and.returnValue(of(booksDoc));

    await TestBed.configureTestingModule({
      imports: [FormsModule, MatTableModule],
      providers: [
        { provide: FirebaseService, useValue: firebaseService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryDetailsComponent);
    component = fixture.componentInstance;
    component.categoryData = categoryData;
    component.getBooksSubscribe = new Observable().subscribe();
  });

  it('should create the category details component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch books on init based on categoryData', () => {
    component.ngOnInit();
    expect(firebaseService.getMultipleDocs).toHaveBeenCalledWith(BOOKS_PATH, {
      whereQuery: [{
        fieldToFilter: 'category',
        operator: '==',
        value: categoryData.id as string
      }]
    });
    expect(component.books.length).toEqual(2);
    expect(component.books[0]).toEqual({ category: 'cat_1', title: 'Book 1', year: 2021, numberOfBooks: 10, id: 'book1' });
  });

  it('should add edited document to editedDocs array', () => {
    const doc: CommonObj = { id: 'doc1', data: 'some data' };
    component.addToEdited(doc, BOOKS_PATH);
    expect(component.editedDocs.length).toBe(1);
    expect(component.editedDocs[0]).toEqual({ ...doc, collectionName: BOOKS_PATH });
  });

  it('should update documents and emit resetCategory on save', () => {
    const spyResetCategory = spyOn(component.resetCategory, 'emit');
    (firebaseService.updateMultipleDocs as Spy).and.returnValue(of({}));

    component.editedDocs = [{ id: 'doc1', data: 'some data', collectionName: BOOKS_PATH }];
    component.onSave();

    expect(firebaseService.updateMultipleDocs).toHaveBeenCalledWith(component.editedDocs);
    expect(spyResetCategory).toHaveBeenCalled();
  });

  it('should unsubscribe from getBooksSubscribe on destroy', () => {
    spyOn(component.getBooksSubscribe, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.getBooksSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
