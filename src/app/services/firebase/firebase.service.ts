import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, from } from 'rxjs';

import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  QuerySnapshot,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { BOOKS_PATH, CATEGORIES_PATH } from '../../constants/firestore.const';
import { environment } from '../../../environments/environment';

import { CategoryData, DocData, QueryData, UpdateDocData } from '../../types/firestoreData.types';
import { RegistryForm } from '../../types/registry.types';

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

        updateProfile(userCredential.user, {
          displayName: `${signupForm.value.firstName} ${signupForm.value.lastName || ''}`.trim(),
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

  getDocById(id: string, collectionName: string): Observable<DocumentSnapshot<DocumentData, DocumentData>> {
    return from(getDoc(doc(this.firestore, collectionName, id)));
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

  // addMultipleBooks(): void {
  //   const batch = writeBatch(this.firestore);
  //   data1.forEach(data => {
  //     const docRef = doc(collection(this.firestore, CATEGORIES_PATH, '/3cCFfMIIZZLKzQXiELJb', BOOKS_PATH));
  //     batch.set(docRef, data);
  //   })
  //   data2.forEach(data => {
  //     const docRef = doc(collection(this.firestore, CATEGORIES_PATH, categories[1].value, BOOKS_PATH));
  //     batch.set(docRef, data);
  //   })
  //   data3.forEach(data => {
  //     const docRef = doc(collection(this.firestore, CATEGORIES_PATH, categories[2].value, BOOKS_PATH));
  //     batch.set(docRef, data);
  //   })
  //   data4.forEach(data => {
  //     const docRef = doc(collection(this.firestore, CATEGORIES_PATH, categories[3].value, BOOKS_PATH));
  //     batch.set(docRef, data);
  //   })
  //   data5.forEach(data => {
  //     const docRef = doc(collection(this.firestore, CATEGORIES_PATH, categories[4].value, BOOKS_PATH));
  //     batch.set(docRef, data);
  //   })
  //   data6.forEach(data => {
  //     const docRef = doc(collection(this.firestore, CATEGORIES_PATH, categories[5].value, BOOKS_PATH));
  //     batch.set(docRef, data);
  //   })
  //   data7.forEach(data => {
  //     const docRef = doc(collection(this.firestore, CATEGORIES_PATH, categories[6].value, BOOKS_PATH));
  //     batch.set(docRef, data);
  //   })
  //   data8.forEach(data => {
  //     const docRef = doc(collection(this.firestore, CATEGORIES_PATH, categories[7].value, BOOKS_PATH));
  //     batch.set(docRef, data);
  //   })
  //   data9.forEach(data => {
  //     const docRef = doc(collection(this.firestore, CATEGORIES_PATH, categories[8].value, BOOKS_PATH));
  //     batch.set(docRef, data);
  //   })
  //   batch.commit();
  // }
}
