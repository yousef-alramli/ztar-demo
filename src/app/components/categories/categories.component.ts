import { Component } from '@angular/core';

import { CategoryDetailsComponent } from './category-details/category-details.component';
import { CategoryPageComponent } from './category-page/category-page.component';

import { CategoryData } from '../../types/firestoreData.types';


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CategoryPageComponent,
    CategoryDetailsComponent,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

  selectedCategory!: CategoryData | undefined;

  onCategorySelect(category: CategoryData | undefined) {
    this.selectedCategory = category;
  }
};
