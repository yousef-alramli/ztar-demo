import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from "@angular/router";

import { map } from "rxjs";

import { BOOKS_PATH } from "../constants/firestore.const";

import { ModalService } from "../services/modal/modal.service";
import { FirebaseService } from "../services/firebase/firebase.service";

import { CustomModalData } from "../types/modal.types";
import { DocData } from "../types/firestoreData.types";

export const bookDetailsResolver: ResolveFn<DocData> = (
  route: ActivatedRouteSnapshot,
) => {
  const router = inject(Router);
  const firebaseService = inject(FirebaseService);
  const openModal = inject(ModalService).openCustomModal;

  const modalData: CustomModalData = {
    header: 'Oops!',
    message: 'Can\'t find id, you can try again later',
    cancelButton: {
      action: () => router.navigate(['books']),
      text: 'Confirm'
    }
  };

  const bookId = route.paramMap.get('id')!;
  return firebaseService.getDocById(bookId, BOOKS_PATH).pipe(map(data => {
    if (!data.data()) {
      openModal(modalData)
    }
    return data.data() as DocData;
  }));
};