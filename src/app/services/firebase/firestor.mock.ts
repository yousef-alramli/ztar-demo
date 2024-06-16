import * as firestore from 'firebase/firestore';
import * as firebaseAuth from "firebase/auth";

export function mockFirestore(): Partial<typeof firestore> & Partial<typeof firebaseAuth> {
  return {
    addDoc: jasmine.createSpy('addDoc'),
    collection: jasmine.createSpy('collection'),
    writeBatch: jasmine.createSpy('writeBatch'),
    getCountFromServer: jasmine.createSpy('getCountFromServer'),
    getAggregateFromServer: jasmine.createSpy('getAggregateFromServer'),
    sum: jasmine.createSpy('sum'),
    createUserWithEmailAndPassword: jasmine.createSpy('createUserWithEmailAndPassword'),
    deleteDoc: jasmine.createSpy('deleteDoc'),
    doc: jasmine.createSpy('doc'),
    getAuth: jasmine.createSpy('getAuth'),
    getDoc: jasmine.createSpy('getDoc'),
    getDocs: jasmine.createSpy('getDocs'),
    query: jasmine.createSpy('query'),
    setDoc: jasmine.createSpy('setDoc'),
    signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword'),
    updateProfile: jasmine.createSpy('updateProfile'),
    where: jasmine.createSpy('where'),
  };
}
