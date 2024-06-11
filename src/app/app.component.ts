import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseService } from './services/firebase.service';
import { CATEGORIES_PATH } from './constants/firestore.const';
import { CategoryData } from './types/firestoreData.types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  constructor(private firebaseService: FirebaseService) { };

  ngOnInit(): void {
    this.firebaseService.getMultipleDocs(CATEGORIES_PATH, {}).subscribe(categoriesDoc => {
      const allCategories: { [key: string]: CategoryData } = {};

      categoriesDoc.docs.forEach(book => {
        allCategories[book.id] = book.data() as CategoryData;
      });

      this.firebaseService.allCategories = allCategories;
    });
  }
}
