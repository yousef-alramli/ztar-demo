// import { TestBed } from '@angular/core/testing';

// import { FirebaseService } from './firebase.service';

// describe('FirebaseService', () => {
//   let service: FirebaseService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(FirebaseService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FirebaseService } from './firebase.service';
import * as Firestore from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';

import Spy = jasmine.Spy;

import { mockFirestore } from './firestor.mock';

describe('FirebaseService', () => {
  let service: FirebaseService;
  let firestoreMock: typeof Firestore;

  beforeEach(() => {
    firestoreMock = mockFirestore() as typeof Firestore;

    TestBed.configureTestingModule({
      providers: [
        FirebaseService,
        { provide: Firestore, useValue: firestoreMock },
      ],
    });

    service = TestBed.inject(FirebaseService);

    // Initialize the Firebase app (this is required for some Firebase methods)
    initializeApp(environment.firebase);
    service.firebaseFirestore = firestoreMock;
    service.firestoreDb = Firestore.getFirestore();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a document to a collection', () => {
    const docData = { value: 'Test' };
    const collectionName = 'testCollection';
    const mockDocRef = { id: '1' };

    (firestoreMock.addDoc as Spy).and.returnValue(Promise.resolve(mockDocRef));
    (firestoreMock.collection as Spy).and.returnValue({});

    service.addDoc(docData, collectionName).subscribe(result => {
      expect(result).toEqual(mockDocRef);
    });

    expect(firestoreMock.addDoc).toHaveBeenCalledWith({} as any, docData);
    expect(firestoreMock.collection).toHaveBeenCalledWith(service.firestoreDb as any, collectionName);
  });

  it('should get a document by id', () => {
    const id = '1';
    const collectionName = 'testCollection';
    const mockDocSnapshot = { data: () => ({ name: 'Test' }) };

    (firestoreMock.getDoc as Spy).and.returnValue(Promise.resolve(mockDocSnapshot));
    (firestoreMock.doc as Spy).and.returnValue({ data: 'doc data' });

    service.getDocById(id, collectionName).subscribe(result => {
      expect(result).toEqual(mockDocSnapshot as any);
    });

    expect(firestoreMock.getDoc).toHaveBeenCalledWith({ data: 'doc data' } as any);
    expect(firestoreMock.doc).toHaveBeenCalledWith(service.firestoreDb as any, collectionName, id);
  });

  it('should get multiple documents from a collection', () => {
    const collectionName = 'testCollection';
    const mockQuerySnapshot = { docs: [{ id: '1', data: () => ({ name: 'Test' }) }] };

    (firestoreMock.getDocs as Spy).and.returnValue(Promise.resolve(mockQuerySnapshot));
    (firestoreMock.query as Spy).and.returnValue({ data: 'query data' });
    (firestoreMock.collection as Spy).and.returnValue({ data: 'collection data' });

    service.getMultipleDocs(collectionName, {}).subscribe(result => {
      expect(result).toEqual(mockQuerySnapshot as any);
    });

    expect(firestoreMock.getDocs).toHaveBeenCalledWith({ data: 'query data' } as any);
    expect(firestoreMock.query).toHaveBeenCalledWith({ data: 'collection data' } as any);
    expect(firestoreMock.collection).toHaveBeenCalledWith(service.firestoreDb as any, collectionName,);
  });

  it('should delete a category and associated books', () => {
    const id = '1';
    const mockQuerySnapshot = { docs: [{ ref: { id: 'book1' } }, { ref: { id: 'book2' } }] };

    (firestoreMock.getDocs as Spy).and.returnValue(Promise.resolve(mockQuerySnapshot));
    (firestoreMock.writeBatch as Spy).and.returnValue({
      delete: jasmine.createSpy('delete'),
      commit: jasmine.createSpy('commit').and.returnValue(Promise.resolve()),
    });

    service.deleteCategory(id).subscribe(() => {
      expect(firestoreMock.writeBatch(service.firestoreDb as any).delete).toHaveBeenCalledWith(jasmine.any(Object));
      expect(firestoreMock.writeBatch(service.firestoreDb as any).commit).toHaveBeenCalled();
    });
  });

  it('should get the categories count', fakeAsync (() => {
    const mockCountResult = { data: () => ({ count: 5 }) };

    (firestoreMock.getCountFromServer as Spy).and.returnValue(Promise.resolve(mockCountResult));
    (firestoreMock.query as Spy).and.returnValue({ data: 'query data' });
    (firestoreMock.collection as Spy).and.returnValue({ data: 'collection data' });

    service.getCategoriesCount();

    expect(firestoreMock.getCountFromServer).toHaveBeenCalledWith({ data: 'query data' } as any);
    expect(firestoreMock.query).toHaveBeenCalledWith({ data: 'collection data' } as any);

    tick();
    expect(service.categoriesCount).toEqual(5);
  }));

  it('should get the books count',fakeAsync (() => {
    const mockAggregateResult = { data: () => ({ totalBooks: 10 }) };

    (firestoreMock.sum as Spy).and.returnValue(mockAggregateResult);
    (firestoreMock.getAggregateFromServer as Spy).and.returnValue(Promise.resolve(mockAggregateResult));

    service.getBooksCount();

    tick(100);
    expect(service.booksCount).toBe(10);
  }));

  it('should update multiple documents', (done) => {
    const data = [
      { collectionName: 'testCollection', id: '1', name: 'Updated Test' },
    ];

    (firestoreMock.doc as Spy).and.returnValue({ data: 'doc data' });
    (firestoreMock.writeBatch as Spy).and.returnValue({
      set: jasmine.createSpy('set'),
      commit: jasmine.createSpy('commit').and.returnValue(Promise.resolve()),
    });

    service.updateMultipleDocs(data).subscribe(() => {
      // @ts-ignore
      expect(firestoreMock.writeBatch(service.firestoreDb as any).set).toHaveBeenCalledWith({ data: 'doc data' } as any, data[0]);
      expect(firestoreMock.writeBatch(service.firestoreDb as any).commit).toHaveBeenCalled();
      done();
    });
  });
});