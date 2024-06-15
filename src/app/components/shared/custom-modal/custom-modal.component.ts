import { Component, Inject } from '@angular/core';
import {
  MatDialogClose,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

import { CustomModalData } from '../../../types/modal.types';

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  imports: [
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './custom-modal.component.html',
  styleUrl: './custom-modal.component.scss'
})
export class CustomModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CustomModalData) { }

  onCancel() {
    if (this.data.cancelButton?.action) {
      this.data.cancelButton.action();
    }
  }
}
