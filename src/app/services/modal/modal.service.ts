import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ErrorModalComponent } from '../../components/shared/error-modal/error-modal.component';

import { ErrorModalData } from '../../types/modal.types';

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  constructor(public dialog: MatDialog) { };

  openErrorModal = (modalData: ErrorModalData, onClose: () => void) => {
    this.dialog.open(ErrorModalComponent,{
      data: modalData,
    }).afterClosed()
    .subscribe(() => {
      onClose();
    });
  }
}
