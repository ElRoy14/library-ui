import { Routes } from '@angular/router';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/book-list-page/book-list-page').then(m => m.BookListPage),
    title: 'Libros'
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/book-detail-page/book-detail-page').then(m => m.BookDetailPage),
    title: 'Detalle del libro'
  }
];
