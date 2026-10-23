import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const snackBar = inject(MatSnackBar);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      snackBar.open(getErrorMessage(error.status), 'Cerrar', { duration: 5000 });
      return throwError(() => error);
    })
  );
};

function getErrorMessage(status: number): string {
  switch (status) {
    case 0:
      return 'No se pudo conectar con el servidor.';
    case 400:
      return 'Los datos enviados no son válidos.';
    case 404:
      return 'El registro solicitado no existe.';
    case 502:
    case 504:
      return 'El servicio externo no está disponible. Intenta de nuevo.';
    default:
      return 'Ocurrió un error inesperado.';
  }
}
