import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FirebaseService } from './services/firebase/firebase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.firebaseService.getBooksCount();
    this.firebaseService.getCategoriesCount();
  }
}
