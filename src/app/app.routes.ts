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

  // Wild route
  {
    path: '**',
    redirectTo: 'login',
  },
];
