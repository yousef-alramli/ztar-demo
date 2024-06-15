import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { authPages, noAuthPages } from '../../../constants/pages.const';

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
export class FooterComponent implements OnInit {
  pages!: NavigationPages[];

  ngOnInit(): void {
    const auth: string | null = localStorage.getItem('token');
    this.pages = auth ? authPages : noAuthPages
  }
}
