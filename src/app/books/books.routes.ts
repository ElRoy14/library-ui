import { Routes } from '@angular/router';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/book-list-page/book-list-page').then(m => m.BookListPage),
    title: 'Libros'
  }
];
