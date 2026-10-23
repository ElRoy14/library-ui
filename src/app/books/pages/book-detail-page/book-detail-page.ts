import { Component, inject, input, numberAttribute, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { BookDetails } from '../../models/book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-detail-page',
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './book-detail-page.html',
  styleUrl: './book-detail-page.scss'
})
export class BookDetailPage implements OnInit {
  private readonly bookService = inject(BookService);

  readonly id = input.required({ transform: numberAttribute });

  protected readonly book = signal<BookDetails | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.bookService
      .getDetails(this.id())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(book => this.book.set(book));
  }
}
