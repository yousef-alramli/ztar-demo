import { Injectable } from '@angular/core';

import { Observable, from, map } from 'rxjs';

import * as Firestore from 'firebase/firestore';

import { DocumentData, DocumentSnapshot, QuerySnapshot, QueryConstraint } from 'firebase/firestore'; // exporting types

import { initializeApp } from 'firebase/app';

import { BOOKS_PATH, CATEGORIES_PATH } from '../../constants/firestore.const';
import { environment } from '../../../environments/environment';

import { CategoryData, DocData, QueryData, WhereQuery } from '../../types/firestoreData.types';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firebaseFirestore: typeof Firestore; // using this way becasue of unit test
  firestoreDb: Firestore.Firestore;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.firebaseFirestore = Firestore;
    this.firestoreDb = Firestore.getFirestore(app);
  }

  allCategories: CategoryData[] = [];
  authorsCount: number = 0;
  booksCount: number = 0;
  categoriesCount: number = 0;

  addDoc(docData: DocData, collectionName: string): Observable<DocumentData> {
    return from(this.firebaseFirestore.addDoc(this.firebaseFirestore.collection(this.firestoreDb, collectionName), docData));
  }

  getDocById(id: string, collectionName: string): Observable<DocumentSnapshot<DocumentData, DocumentData>> {
    return from(this.firebaseFirestore.getDoc(this.firebaseFirestore.doc(this.firestoreDb, collectionName, id)));
  }

  getMultipleDocs(
    collectionName: string,
    { whereQuery, customLimit, startAfterDoc }: QueryData
  ): Observable<QuerySnapshot<DocumentData, DocumentData>> {

    const col = this.firebaseFirestore.collection(this.firestoreDb, collectionName);
    const filters: QueryConstraint[] = [];

    if (whereQuery?.length) {
      whereQuery.forEach(({ fieldToFilter, operator, value }) => {
        filters.push(this.firebaseFirestore.where(fieldToFilter, operator, value));
      })
    }

    if (customLimit) {
      filters.push(this.firebaseFirestore.limit(customLimit));
      if (startAfterDoc) {
        filters.push(this.firebaseFirestore.startAfter(startAfterDoc));
      }
    }

    const customQuery = this.firebaseFirestore.query(col, ...filters);

    return from(this.firebaseFirestore.getDocs(customQuery));
  }

  deleteCategory(id: string): Observable<void> {
    const batch = this.firebaseFirestore.writeBatch(this.firestoreDb);

    return this.getMultipleDocs(
      BOOKS_PATH,
      {
        whereQuery: [{
          fieldToFilter: 'category',
          operator: '==',
          value: id,
        }],
      }
    ).pipe(map(BookDocs => {
      batch.delete(this.firebaseFirestore.doc(this.firestoreDb, CATEGORIES_PATH, id));

      BookDocs.docs.forEach(book => {
        batch.delete(book.ref);
      });

      batch.commit()
    }));
  }

  getCategoriesCount(whereQuery: WhereQuery[] = []): void {
    const col = this.firebaseFirestore.collection(this.firestoreDb, CATEGORIES_PATH);
    const filters: QueryConstraint[] = [];
    if (whereQuery?.length) {
      whereQuery.forEach(({ fieldToFilter, operator, value }) => {
        filters.push(this.firebaseFirestore.where(fieldToFilter, operator, value));
      });
    }

    from(this.firebaseFirestore.getCountFromServer(this.firebaseFirestore.query(col, ...filters))).subscribe(data => {
      this.categoriesCount = data.data().count;
    });
  }

  getBooksCount(): void {
    const col = this.firebaseFirestore.collection(this.firestoreDb, BOOKS_PATH);
    from(this.firebaseFirestore.getAggregateFromServer(col, {
      totalBooks: this.firebaseFirestore.sum('numberOfBooks'),
    })).subscribe(data => {
      this.booksCount = data.data().totalBooks;
    });
  }

  updateMultipleDocs(data: { [key: string]: string | number }[]): Observable<void> {
    const batch = this.firebaseFirestore.writeBatch(this.firestoreDb);
    data.forEach(data => {
      const docRef = this.firebaseFirestore.doc(this.firestoreDb, data['collectionName'] as string, data['id'] as string);
      batch.set(docRef, data);
    });
    return from(batch.commit());
  }
}
