import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { routes } from '../../app.routes';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const notify = inject(NotificationService); // adicione

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        if (!req.url.includes('/auth/login')) {
          localStorage.removeItem('token');
          router.navigate(['/login']);
          notify.error('Sessão expirada. Faça login novamente.');
        }
      }

      if (error.status === 403) {
        notify.error('Você não tem permissão para realizar essa ação.');
      }

      if (error.status === 400) {
        notify.error('Dados inválidos');
      }

      if (error.status === 0) {
        notify.error('Sem conexão com o servidor. Verifique sua internet.');
      }

      if (error.status >= 500) {
        notify.error('Erro interno do servidor. Tente novamente mais tarde.');
      }

      return throwError(() => error);
    })
  );
};
