import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { navigationPages } from '../../../constants/pages.const';

import { NavigationPages } from '../../../types/navigation-pages.types';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  pages: NavigationPages[] = navigationPages;
}
