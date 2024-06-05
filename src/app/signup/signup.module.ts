import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SignupComponent } from './signup.component';

import { signupRoutes } from './signup.routes';

@NgModule({
  declarations: [
    SignupComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(signupRoutes),
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SignupModule { }
