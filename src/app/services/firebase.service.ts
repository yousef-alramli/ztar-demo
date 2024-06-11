import { Injectable, OnInit } from '@angular/core';

import {
  addDoc,
  collection,
  doc,
  Firestore,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
  writeBatch,
  limit,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

import { environment } from '../../environments/environment';

import { DocData, QueryData, UpdateDocData } from '../types/firestoreData.types';
import { BOOKS_PATH, CATEGORIES_PATH } from '../constants/firestore.const';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore: Firestore;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.firestore = getFirestore(app);
  }

  authorsCount: number = 0;
  booksCount: number = 0;
  categoriesCount: number = 0;

  addDoc(docData: DocData, collectionName: string): void {
    addDoc(collection(this.firestore, collectionName), docData).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
  }

  setDoc(docData: UpdateDocData, collectionName: string): void {
    setDoc(doc(this.firestore, collectionName, docData.id), docData).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
  }

  getDocById(id: string, collectionName: string): void {
    getDoc(doc(this.firestore, collectionName, id)).then(data => {
      console.log(data.data());
    });
  }

  getMultipleDocs(
    collectionName: string,
    { fieldToFilter, operator, value, customLimit }: QueryData
  ): Observable<QuerySnapshot<DocumentData, DocumentData>> {
    const col = collection(this.firestore, collectionName);
    const filters = [];

    if (fieldToFilter && operator && value) {
      filters.push(where(fieldToFilter, operator, value));
  }

    if (customLimit) {
      filters.push(limit(customLimit));
    }

    const customQuery = query(col, ...filters );

    return from(getDocs(customQuery));
  }

  getCount(collectionName: string): void {
    const coll = collection(this.firestore, collectionName);
    from(getCountFromServer(coll)).subscribe(data => {
      if (collectionName === BOOKS_PATH) {
        this.booksCount = data.data().count;
      } else if (collectionName === CATEGORIES_PATH) {
        this.categoriesCount = data.data().count;
      }
    });
  }

  addMany(data: { [key: string]: string }[], collectionName: string): void {
    const batch = writeBatch(this.firestore);
    data.forEach(data => {
      const docRef = doc(collection(this.firestore, collectionName));
      batch.set(docRef, data);
    })
    batch.commit();
  }
}
