import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, finalize, Observable, of, switchMap } from 'rxjs';
import { ConfirmDialogService } from '../../../Shared/confirm-dialog/confirm-dialog.service';
import { AuthorFormDialog, AuthorFormDialogData } from '../../components/author-form-dialog/author-form-dialog';
import { Author, AuthorRequest } from '../../models/author';
import { AuthorService } from '../../services/author.service';

@Component({
  selector: 'app-author-list-page',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './author-list-page.html',
  styleUrl: './author-list-page.scss'
})
export class AuthorListPage implements OnInit {
  private readonly authorService = inject(AuthorService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly columns = ['name', 'booksCount', 'actions'];
  protected readonly authors = signal<Author[]>([]);
  protected readonly loading = signal(true);
  private readonly localAuthorIds = signal(new Set<number>());
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);

  protected readonly pagedAuthors = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.authors().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.authorService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(authors => this.authors.set(authors));
  }

  protected changePage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected addAuthor(): void {
    this.openFormDialog()
      .pipe(
        filter((request): request is AuthorRequest => !!request),
        switchMap(request => this.authorService.create(request))
      )
      .subscribe(created => {
        const author = { ...created, id: this.nextLocalId() };
        this.localAuthorIds.update(ids => new Set(ids).add(author.id));
        this.authors.update(authors => [author, ...authors]);
        this.pageIndex.set(0);
        this.notify('Autor agregado.');
      });
  }

  protected editAuthor(author: Author): void {
    this.openFormDialog(author)
      .pipe(
        filter((request): request is AuthorRequest => !!request),
        switchMap(request =>
          this.isLocal(author)
            ? of({ ...author, ...request, fullName: `${request.firstName} ${request.lastName}` })
            : this.authorService.update(author.id, request)
        )
      )
      .subscribe(updated => {
        this.authors.update(authors =>
          authors.map(current => (current.id === author.id ? { ...updated, id: author.id } : current))
        );
        this.notify('Autor actualizado.');
      });
  }

  protected deleteAuthor(author: Author): void {
    this.confirmDialog
      .confirm({ title: 'Eliminar autor', message: `¿Seguro que deseas eliminar a "${author.fullName}"?` })
      .pipe(
        filter(Boolean),
        switchMap(() => (this.isLocal(author) ? of(undefined) : this.authorService.delete(author.id)))
      )
      .subscribe(() => {
        this.authors.update(authors => authors.filter(current => current.id !== author.id));
        this.localAuthorIds.update(ids => {
          const remaining = new Set(ids);
          remaining.delete(author.id);
          return remaining;
        });
        this.keepPageInRange();
        this.notify('Autor eliminado.');
      });
  }

  private openFormDialog(author?: Author): Observable<AuthorRequest | undefined> {
    return this.dialog
      .open<AuthorFormDialog, AuthorFormDialogData, AuthorRequest>(AuthorFormDialog, {
        data: { author },
        width: '560px'
      })
      .afterClosed();
  }

  private keepPageInRange(): void {
    const lastPage = Math.max(0, Math.ceil(this.authors().length / this.pageSize()) - 1);
    if (this.pageIndex() > lastPage) {
      this.pageIndex.set(lastPage);
    }
  }

  private notify(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }

  private isLocal(author: Author): boolean {
    return this.localAuthorIds().has(author.id);
  }

  private nextLocalId(): number {
    return Math.max(0, ...this.authors().map(author => author.id)) + 1;
  }
}
