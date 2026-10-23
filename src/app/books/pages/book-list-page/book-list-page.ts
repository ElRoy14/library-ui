import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, finalize, Observable, switchMap } from 'rxjs';
import { ConfirmDialogService } from '../../../Shared/confirm-dialog/confirm-dialog.service';
import { BookFormDialog, BookFormDialogData } from '../../components/book-form-dialog/book-form-dialog';
import { Book, BookRequest } from '../../models/book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-list-page',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './book-list-page.html',
  styleUrl: './book-list-page.scss'
})
export class BookListPage implements OnInit {
  private readonly bookService = inject(BookService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly books = signal<Book[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.bookService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(books => this.books.set(books));
  }

  protected addBook(): void {
    this.openFormDialog()
      .pipe(
        filter((request): request is BookRequest => !!request),
        switchMap(request => this.bookService.create(request))
      )
      .subscribe(created => {
        this.books.update(books => [created, ...books]);
        this.notify('Libro agregado.');
      });
  }

  protected editBook(book: Book): void {
    this.openFormDialog(book)
      .pipe(
        filter((request): request is BookRequest => !!request),
        switchMap(request => this.bookService.update(book.id, request))
      )
      .subscribe(updated => {
        this.books.update(books =>
          books.map(current => (current.id === book.id ? updated : current))
        );
        this.notify('Libro actualizado.');
      });
  }

  protected deleteBook(book: Book): void {
    this.confirmDialog
      .confirm({ title: 'Eliminar libro', message: `¿Seguro que deseas eliminar "${book.title}"?` })
      .pipe(
        filter(Boolean),
        switchMap(() => this.bookService.delete(book.id))
      )
      .subscribe(() => {
        this.books.update(books => books.filter(current => current.id !== book.id));
        this.notify('Libro eliminado.');
      });
  }

  private openFormDialog(book?: Book): Observable<BookRequest | undefined> {
    return this.dialog
      .open<BookFormDialog, BookFormDialogData, BookRequest>(BookFormDialog, {
        data: { book },
        width: '560px'
      })
      .afterClosed();
  }

  private notify(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}
