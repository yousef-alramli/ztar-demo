import { Component } from '@angular/core';

import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

import { FirebaseService } from '../../services/firebase/firebase.service';

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
export class HomePageComponent {
  constructor(public firebaseService: FirebaseService) { }
}
