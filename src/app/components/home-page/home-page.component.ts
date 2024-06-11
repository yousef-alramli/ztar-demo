import { Component, OnInit } from '@angular/core';

import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

import { FirebaseService } from '../../services/firebase.service';

import { BOOKS_PATH, CATEGORIES_PATH } from '../../constants/firestore.const';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
  ],
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.firebaseService.getCount(BOOKS_PATH);
    this.firebaseService.getCount(CATEGORIES_PATH);
  }

}
