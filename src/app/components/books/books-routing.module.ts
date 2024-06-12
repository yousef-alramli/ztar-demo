import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BooksComponent } from './books.component';
import { BookDetailsComponent } from './book-details/book-details.component';

import { bookDetailsResolver } from '../../resolvers/book-details.resolver';

const routes: Routes = [
  {
    path: '',
    component: BooksComponent,
  },
  {
    path: ':id',
    component: BookDetailsComponent,
    resolve: {
      details: bookDetailsResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule { }
