import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-list-page',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './book-list-page.html',
  styleUrl: './book-list-page.scss'
})
export class BookListPage implements OnInit {
  private readonly bookService = inject(BookService);

  protected readonly books = signal<Book[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.bookService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(books => this.books.set(books));
  }
}
