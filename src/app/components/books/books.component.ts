import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { Observable, Subscriber, Subscription } from 'rxjs';

import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

import { FirebaseService } from '../../services/firebase.service';

import { BOOKS_PATH, CATEGORIES_PATH } from '../../constants/firestore.const';
import { BookData, CategoryData, DocData } from '../../types/firestoreData.types';
import { categories } from '../../services/data';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    MatTableModule,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit, OnDestroy {

  constructor(private firebaseService: FirebaseService) { };

  books: BookData[] = [];
  displayColumns = ['number', 'title', 'category', 'year'];
  getBooksSubscribe!: Subscription;

  ngOnInit(): void {
    this.getBooksSubscribe = this.firebaseService.getMultipleDocs(BOOKS_PATH, { customLimit: 10 }).subscribe(booksDoc => {
      const allBooks: BookData[] = [];

      booksDoc.docs.forEach(book => {
        // const category = this.firebaseService.allCategories[book.data()['category']].value;
        allBooks.push({
          ...book.data(),
          id: book.id,
          // category,
        } as BookData);
      });
      this.books = allBooks;
    });
  }

  ngOnDestroy(): void {
    this.getBooksSubscribe.unsubscribe();
  }

}
