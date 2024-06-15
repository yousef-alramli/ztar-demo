import { Injectable } from '@angular/core';

import { Observable, from, map } from 'rxjs';

import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  getAggregateFromServer,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  QueryConstraint,
  QuerySnapshot,
  startAfter,
  sum,
  where,
  writeBatch,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

import { BOOKS_PATH, CATEGORIES_PATH } from '../../constants/firestore.const';
import { environment } from '../../../environments/environment';

import { CategoryData, DocData, QueryData, WhereQuery } from '../../types/firestoreData.types';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore: Firestore;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.firestore = getFirestore(app);
  }

  allCategories: CategoryData[] = [];
  authorsCount: number = 0;
  booksCount: number = 0;
  categoriesCount: number = 0;

  addDoc(docData: DocData, collectionName: string): Observable<DocumentData> {
    return from(addDoc(collection(this.firestore, collectionName), docData));
  }

  getDocById(id: string, collectionName: string): Observable<DocumentSnapshot<DocumentData, DocumentData>> {
    return from(getDoc(doc(this.firestore, collectionName, id)));
  }

  getMultipleDocs(
    collectionName: string,
    { whereQuery, customLimit, startAfterDoc }: QueryData
  ): Observable<QuerySnapshot<DocumentData, DocumentData>> {

    const col = collection(this.firestore, collectionName);
    const filters: QueryConstraint[] = [];

    if (whereQuery?.length) {
      whereQuery.forEach(({ fieldToFilter, operator, value }) => {
        filters.push(where(fieldToFilter, operator, value));
      })
    }

    if (customLimit) {
      filters.push(limit(customLimit));
      if (startAfterDoc) {
        filters.push(startAfter(startAfterDoc));
      }
    }

    const customQuery = query(col, ...filters);

    return from(getDocs(customQuery));
  }

  deleteCategory(id: string): Observable<void> {
    const batch = writeBatch(this.firestore);

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
      batch.delete(doc(this.firestore, CATEGORIES_PATH, id));

      BookDocs.docs.forEach(book => {
        batch.delete(book.ref);
      });

      batch.commit()
    }));
  }

  getCategoriesCount(whereQuery: WhereQuery[] = []): void {
    const col = collection(this.firestore, CATEGORIES_PATH);
    const filters: QueryConstraint[] = [];
    if (whereQuery?.length) {
      whereQuery.forEach(({ fieldToFilter, operator, value }) => {
        filters.push(where(fieldToFilter, operator, value));
      });
    }

    from(getCountFromServer(query(col, ...filters))).subscribe(data => {
      this.categoriesCount = data.data().count;
    });
  }

  getBooksCount(): void {
    const col = collection(this.firestore, BOOKS_PATH);
    from(getAggregateFromServer(col, {
      totalBooks: sum('numberOfBooks'),
    })).subscribe(data => {
      this.booksCount = data.data().totalBooks;
    });
  }

  updateMultipleDocs(data: { [key: string]: string | number }[]): Observable<void> {
    const batch = writeBatch(this.firestore);
    data.forEach(data => {
      const docRef = doc(this.firestore, data['collectionName'] as string, data['id'] as string);
      batch.set(docRef, data);
    });
    return from(batch.commit());
  }
}
