import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, from } from 'rxjs';

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
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { BOOKS_PATH, CATEGORIES_PATH } from '../constants/firestore.const';
import { environment } from '../../environments/environment';

import { CategoryData, DocData, QueryData, UpdateDocData } from '../types/firestoreData.types';
import { RegistryForm } from '../types/registry.types';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore: Firestore;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.firestore = getFirestore(app);
  }

  allCategories!: {[key: string]: CategoryData};
  authorsCount: number = 0;
  booksCount: number = 0;
  categoriesCount: number = 0;

  login(loginForm: FormGroup) {
    const { email, password } = loginForm.value as RegistryForm;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email as string, password as string)
      .then((userCredential) => {
        console.log('userCredential >>> ', userCredential);
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-credential') {
          alert('Wrong email or password');
        } else {
          alert('Oops, some error occurred please try again later');
        }
      });
  }

  signup(signupForm: FormGroup) {
    const { email, password } = signupForm.value as RegistryForm;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email as string, password as string)
      .then((userCredential) => {

        // update the displayName of the user
        console.log();
        updateProfile(userCredential.user, {
          displayName: `${signupForm.value.firstName} ${signupForm.value.lastName || ''}`,
        });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          alert('This email already exists');
        } else {
          alert('Oops, some error occurred please try again later');
        }
      });

  }

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

    const customQuery = query(col, ...filters);

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

  addMultipleDocs(data: { [key: string]: string }[], collectionName: string): void {
    const batch = writeBatch(this.firestore);
    data.forEach(data => {
      const docRef = doc(collection(this.firestore, collectionName));
      batch.set(docRef, data);
    })
    batch.commit();
  }
}
