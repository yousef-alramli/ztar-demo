import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RegistryForm } from '../../../types/registry.types';
import { validateForm } from '../../../utils/formValidation';
import { CATEGORIES_PATH } from '../../../constants/firestore.const';

import { FirebaseService } from '../../../services/firebase/firebase.service';

import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [
    FooterComponent,
    FormsModule,
    HeaderComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.scss'
})
export class CategoryCreateComponent {

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
  ) { }

  createForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  formErrors: RegistryForm = {};

  onSave() {
    this.formErrors = validateForm(this.createForm);
    if (Object.keys(this.formErrors).length) {
      return;
    }

    this.firebaseService.addDoc({ value: this.createForm.value.name?.toLowerCase() as string }, CATEGORIES_PATH)
      .subscribe(() => {
        this.router.navigate(['categories']);
      });

  }
}
