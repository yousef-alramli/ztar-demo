import { Routes } from '@angular/router';

export const routes: Routes = [
  // Unauthorized
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'signup',
    loadChildren: () => import('./components/signup/signup.module').then(m => m.SignupModule),
  },

  // Authorized
  {
    path: 'home',
    loadChildren: () => import('./components/home-page/home-page.module').then(m => m.HomePageModule),
  },
  {
    path: 'books',
    loadChildren: () => import('./components/books/books.module').then(m => m.BooksModule),
  },
  {
    path: 'categories',
    loadChildren: () => import('./components/categories/categories.module').then(m => m.CategoriesModule),
  },

  // Wild route
  {
    path: '**',
    redirectTo: 'login',
  },
];
