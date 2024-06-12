import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from "@angular/router";

import { map } from "rxjs";

import { BOOKS_PATH } from "../constants/firestore.const";

import { ModalService } from "../services/modal/modal.service";
import { FirebaseService } from "../services/firebase/firebase.service";

import { ErrorModalData } from "../types/modal.types";
import { DocData } from "../types/firestoreData.types";

export const bookDetailsResolver: ResolveFn<DocData> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const openModal = inject(ModalService).openErrorModal;
  const modalData: ErrorModalData = {
    header: 'Oops!',
    message: 'Can\'t find id, you can try again later',
  };

  const bookId = route.paramMap.get('id')!;
  return inject(FirebaseService).getDocById(bookId, BOOKS_PATH).pipe(map(data => {

    if (!data.data()) {
      openModal(modalData, () => router.navigate(['books']))
    }
    return data.data() as DocData;
  }));
};