import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

import { FirebaseService } from '../../services/firebase.service';

import { BOOKS_PATH } from '../../constants/firestore.const';
import { BookData } from '../../types/firestoreData.types';
import { Observable, Subscriber, Subscription } from 'rxjs';

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
  getBooksSubscribe!: Subscription;

  ngOnInit(): void {
    const allBooks: BookData[] = [];

    this.getBooksSubscribe = this.firebaseService.getMultipleDocs(BOOKS_PATH, { customLimit: 10 }).subscribe(booksDoc => {
      booksDoc.docs.forEach(book => {
        allBooks.push({ ...book.data(), id: book.id } as BookData);
      });
      this.books = allBooks;
    })
  }

  ngOnDestroy(): void {
    this.getBooksSubscribe.unsubscribe();
  }
}
