import { Component, Inject } from '@angular/core';
import {
  MatDialogClose,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { ErrorModalData } from '../../../types/modal.types';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss'
})
export class ErrorModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ErrorModalData) { }

  onConfirm() {
    this.data.confirmButton?.action();
  }

}
