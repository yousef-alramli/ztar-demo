import { Routes } from '@angular/router';
import { authGuardGuard } from './services/auth-guard/auth-guard.guard';
import { noAuthGuard } from './services/no-auth-guard/no-auth.guard';

export const routes: Routes = [
  // Unauthorized
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule),
    canActivate: [noAuthGuard],
  },
  {
    path: 'signup',
    loadChildren: () => import('./components/signup/signup.module').then(m => m.SignupModule),
    canActivate: [noAuthGuard],
  },

  // Authorized
  {
    path: 'home',
    loadChildren: () => import('./components/home-page/home-page.module').then(m => m.HomePageModule),
  },
  {
    path: 'books',
    loadChildren: () => import('./components/books/books.module').then(m => m.BooksModule),
    canActivate: [authGuardGuard],
  },
  {
    path: 'categories',
    loadChildren: () => import('./components/categories/categories.module').then(m => m.CategoriesModule),
    canActivate: [authGuardGuard],
  },

  // Wild route
  {
    path: '**',
    redirectTo: 'home',
  },
];
