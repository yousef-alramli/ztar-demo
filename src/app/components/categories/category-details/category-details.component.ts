import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';

import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';

import { FirebaseService } from '../../../services/firebase/firebase.service';

import { CommonObj } from '../../../types/common-object';
import { BookData, CategoryData } from '../../../types/firestoreData.types';

import { BOOKS_PATH, CATEGORIES_PATH } from '../../../constants/firestore.const';


@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [
    FooterComponent,
    FormsModule,
    HeaderComponent,
    MatTableModule,
  ],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent implements OnInit, OnDestroy {

  @Input() categoryData!: CategoryData;
  @Output() resetCategory = new EventEmitter();

  constructor(private firebaseService: FirebaseService) { }

  getBooksSubscribe!: Subscription;

  displayColumns = ['number', 'title', 'year', 'numOfBooks'];
  books: BookData[] = [];
  editedDocs: CommonObj[] = [];
  booksColName: string = BOOKS_PATH;
  categoriesColName: string = CATEGORIES_PATH;

  ngOnInit(): void {
    this.getBooksSubscribe = this.firebaseService.getMultipleDocs(
      BOOKS_PATH,
      {
        whereQuery: [{
          fieldToFilter: 'category',
          operator: '==',
          value: this.categoryData.id as string,
        }]
      }
    ).subscribe(BooksDoc => {
      const allBooks: BookData[] = [];

      BooksDoc.docs.forEach(book => {
        allBooks.push({ ...book.data(), id: book.id } as BookData);
      });

      this.books = allBooks;
    });
  }

  addToEdited(doc: CommonObj, collectionName: string) {
    doc['collectionName'] = collectionName;
    this.editedDocs.push(doc);
  }

  onSave() {
    this.firebaseService.updateMultipleDocs(this.editedDocs).subscribe(() => {
      this.resetCategory.emit();
    });
  }

  ngOnDestroy(): void {
    this.getBooksSubscribe.unsubscribe();
  }

}
