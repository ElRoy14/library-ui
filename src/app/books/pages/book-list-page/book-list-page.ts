import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { filter, finalize, Observable, switchMap } from 'rxjs';
import { Book, BookRequest } from '../../models/book';
import { BookService } from '../../services/book.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogService } from '../../../Shared/confirm-dialog/confirm-dialog.service';
import { BookFormDialog, BookFormDialogData } from '../../components/book-form-dialog/book-form-dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-book-list-page',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatProgressSpinnerModule, MatIcon],
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
