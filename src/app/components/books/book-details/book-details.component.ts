import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BookData } from '../../../types/firestoreData.types';

import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
  ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) { }

  bookDetails!: BookData;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(book => {
      this.bookDetails = book['details'] as BookData;
    });
  }
}
