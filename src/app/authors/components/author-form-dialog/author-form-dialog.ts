import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Book } from '../../../books/models/book';
import { BookService } from '../../../books/services/book.service';
import { Author, AuthorRequest } from '../../models/author';

export interface AuthorFormDialogData {
  author?: Author;
}

@Component({
  selector: 'app-author-form-dialog',
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './author-form-dialog.html',
  styleUrl: './author-form-dialog.scss'
})
export class AuthorFormDialog {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly dialogRef = inject<MatDialogRef<AuthorFormDialog, AuthorRequest>>(MatDialogRef);
  private readonly data = inject<AuthorFormDialogData>(MAT_DIALOG_DATA);

  protected readonly isEdit = !!this.data.author;
  protected readonly books = toSignal(inject(BookService).getAll(), { initialValue: [] as Book[] });

  protected readonly form = this.formBuilder.group({
    firstName: [this.data.author?.firstName ?? '', [Validators.required, Validators.maxLength(100)]],
    lastName: [this.data.author?.lastName ?? '', [Validators.required, Validators.maxLength(100)]],
    idBook: this.formBuilder.control<number | null>(this.data.author?.idBook ?? null, Validators.required)
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { idBook, ...values } = this.form.getRawValue();
    this.dialogRef.close({ ...values, idBook: idBook! });
  }
}
