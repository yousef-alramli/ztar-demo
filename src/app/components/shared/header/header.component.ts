import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { navigationPages } from '../../../constants/pages.const';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  pages = navigationPages;
}
