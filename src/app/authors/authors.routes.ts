import { Routes } from '@angular/router';

export const AUTHORS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/author-list-page/author-list-page').then(m => m.AuthorListPage),
    title: 'Autores'
  }
];
