import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { map } from "rxjs";

import { DocumentData, DocumentSnapshot } from 'firebase/firestore';

import { BOOKS_PATH } from "../constants/firestore.const";

import { ModalService } from "../services/modal/modal.service";
import { FirebaseService } from "../services/firebase/firebase.service";
import { ErrorModalData } from "../types/modal.types";

export const bookDetailsResolver: ResolveFn<DocumentSnapshot<DocumentData, DocumentData>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const openModal = inject(ModalService).openErrorModal;
  const modalData: ErrorModalData = {
    header: 'Oops',
    message: 'Can\'t find id, you can try again later',
  };

  const bookId = route.paramMap.get('id')!;
  return inject(FirebaseService).getDocById(bookId, BOOKS_PATH).pipe(map(data => {
    console.log('dataaaa >>>', data.data());
    if (!data.data()) {
      openModal(modalData, () => console.log('close'))
    }
    return data
  }));
};