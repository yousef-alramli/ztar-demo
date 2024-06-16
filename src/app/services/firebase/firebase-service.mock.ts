import { FirebaseService } from "./firebase.service";
import * as Firestore from 'firebase/firestore';

export function mockFirebaseService(): FirebaseService {
  return {
    firebaseFirestore: {} as typeof Firestore,
    firestoreDb: {} as Firestore.Firestore,
    allCategories: [],
    authorsCount: 0,
    booksCount: 0,
    categoriesCount: 0,

    addDoc: jasmine.createSpy('addDoc'),
    getDocById: jasmine.createSpy('getDocById'),
    getMultipleDocs: jasmine.createSpy('getMultipleDocs'),
    deleteCategory: jasmine.createSpy('deleteCategory'),
    getCategoriesCount: jasmine.createSpy('getCategoriesCount'),
    getBooksCount: jasmine.createSpy('getBooksCount'),
    updateMultipleDocs: jasmine.createSpy('updateMultipleDocs'),
  };
}
