import { Component, ElementRef, Input, OnInit, ViewChild, } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { NavigationPages } from '../../../types/navigation-pages.types';
import { authPages, noAuthPages } from '../../../constants/pages.const';

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
export class HeaderComponent implements OnInit {
  @ViewChild('sideBar') sideBar!: ElementRef;

  @Input() pageName!: string;

  currentPage: string = '';
  userIsAuthenticated = false;

  pages!: NavigationPages[];
  openNav: boolean = false;

  ngOnInit(): void {
    this.userIsAuthenticated = !!localStorage.getItem('token');
    this.pages = this.userIsAuthenticated ? authPages : noAuthPages
  }

  toggleOpenNav() {
    this.openNav = !this.openNav;
    if (this.openNav) {
      this.sideBar.nativeElement.focus();
    }
  }
}
