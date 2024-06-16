import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogClose, MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CustomModalComponent } from './custom-modal.component';
import { CustomModalData } from '../../../types/modal.types';

describe('CustomModalComponent', () => {
  let component: CustomModalComponent;
  let fixture: ComponentFixture<CustomModalComponent>;
  let dialogRef: MatDialogRef<CustomModalComponent>;

  const mockModalData: CustomModalData = {
    header: 'Test Header',
    message: 'Test Message',
    confirmButton: {
      text: 'Confirm',
      action: jasmine.createSpy('confirmAction')
    },
    cancelButton: {
      text: 'Cancel',
      action: jasmine.createSpy('cancelAction')
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockModalData },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomModalComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct header and message', () => {
    const headerElement = fixture.debugElement.query(By.css('.modal-header')).nativeElement;
    const messageElement = fixture.debugElement.query(By.css('.modal-message')).nativeElement;

    expect(headerElement.textContent).toBe(mockModalData.header);
    expect(messageElement.textContent).toBe(mockModalData.message);
  });

  it('should call confirm action on confirm button click', () => {
    const confirmButton = fixture.debugElement.query(By.css('.app-button')).nativeElement;
    confirmButton.click();

    expect(mockModalData.confirmButton!.action).toHaveBeenCalled();
  });

  it('should call cancel action on cancel button click', () => {
    const cancelButton = fixture.debugElement.query(By.css('.revert-colors')).nativeElement;
    cancelButton.click();

    expect(mockModalData.cancelButton!.action).toHaveBeenCalled();
  });

  it('should call the cancel action when onCancel is invoked', () => {
    component.onCancel();
    expect((mockModalData.cancelButton as { action: () => void }).action).toHaveBeenCalled();
  });
});
