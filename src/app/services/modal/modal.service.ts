import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CustomModalComponent } from '../../components/shared/custom-modal/custom-modal.component';

import { CustomModalData } from '../../types/modal.types';

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  constructor(public dialog: MatDialog) { };

  openCustomModal = (modalData: CustomModalData) => {
    this.dialog.open(CustomModalComponent, {
      data: modalData,
    }).afterClosed()
      .subscribe(() => {
        if (modalData?.cancelButton?.action) {
          modalData.cancelButton.action()
        }
      });
  }
}
