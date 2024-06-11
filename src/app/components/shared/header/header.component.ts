import { Component, ElementRef, Input, OnInit, ViewChild,  } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

import { navigationPages } from '../../../constants/pages.const';

import { NavigationPages } from '../../../types/navigation-pages.types';

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

  @Input() pageName!:string;

  currentPage: string = '';

  ngOnInit(): void {
  }

  pages: NavigationPages[] = navigationPages;
  openNav: boolean = false;

  toggleOpenNav() {
    this.openNav = !this.openNav;
    if (this.openNav) {
      this.sideBar.nativeElement.focus();
    }
  }
}
