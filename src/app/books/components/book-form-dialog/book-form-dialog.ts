import { Component, inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Book, BookRequest } from '../../models/book';

export interface BookFormDialogData {
  book?: Book;
}

@Component({
  selector: 'app-book-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './book-form-dialog.html',
  styleUrl: './book-form-dialog.scss'
})
export class BookFormDialog {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly dialogRef = inject<MatDialogRef<BookFormDialog, BookRequest>>(MatDialogRef);
  private readonly data = inject<BookFormDialogData>(MAT_DIALOG_DATA);

  protected readonly isEdit = !!this.data.book;

  protected readonly form = this.formBuilder.group({
    title: [this.data.book?.title ?? '', [Validators.required, Validators.maxLength(200)]],
    description: [this.data.book?.description ?? '', Validators.maxLength(2000)],
    pageCount: [this.data.book?.pageCount ?? 1, [Validators.required, Validators.min(1)]],
    excerpt: [this.data.book?.excerpt ?? '', Validators.maxLength(2000)],
    publishDate: this.formBuilder.control<Date | null>(
      this.data.book ? new Date(this.data.book.publishDate) : null,
      Validators.required
    )
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { publishDate, ...values } = this.form.getRawValue();

    this.dialogRef.close({
      ...values,
      publishDate: formatDate(publishDate!, 'yyyy-MM-dd', 'en-US')
    });
  }
}
