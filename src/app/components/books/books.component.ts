import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

import { FirebaseService } from '../../services/firebase/firebase.service';

import { BOOKS_PATH, CATEGORIES_PATH } from '../../constants/firestore.const'
  ;
import { BookData, CategoryData, QueryData } from '../../types/firestoreData.types';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit, OnDestroy {

  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
  ) { };

  books: BookData[] = [];
  displayColumns = ['number', 'title', 'year', 'numOfBooks'];
  selectedCategory: string = '';

  getBooksSubscribe!: Subscription;
  getCategoriesSubscribe!: Subscription;

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    if (!this.firebaseService.allCategories.length) {
      this.getCategoriesSubscribe = this.firebaseService.getMultipleDocs(CATEGORIES_PATH, {}).subscribe(categoriesDoc => {
        const allCategories: CategoryData[] = [];

        categoriesDoc.docs.forEach(category => {
          allCategories.push({ ...category.data(), id: category.id } as CategoryData);
        });

        this.firebaseService.allCategories = allCategories;
      });
    }
  }

  getBooks(id: string) {
    const customFilters: QueryData = {
      whereQuery: [
        {
          fieldToFilter: 'category',
          operator: '==',
          value: id
        },
      ]
    };
    this.getBooksSubscribe = this.firebaseService.getMultipleDocs(BOOKS_PATH, customFilters).subscribe(booksDoc => {
      const allBooks: BookData[] = [];

      booksDoc.docs.forEach(book => {
        allBooks.push({
          ...book.data(),
          id: book.id,
        } as BookData);
      });

      this.books = allBooks;
    });
  }

  redirectToDetails(id: string) {
    this.router.navigate(['/books/' + id],)
  }

  ngOnDestroy(): void {
    this.getBooksSubscribe?.unsubscribe();
    this.getCategoriesSubscribe?.unsubscribe();
  }

}
