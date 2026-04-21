import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { routes } from '../../app.routes';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Não autenticado (token inválido/expirado)
      if (error.status === 401){

        if(!req.url.includes('/auth/login')){
          localStorage.removeItem('token');
          router.navigate(['/login']);
        }
      }

      // Sem permissão
      if(error.status === 403){
        console.error('Acesso negado');
      }

      // API fora do ar / erro de rede
      if(error.status === 0){
        console.error('Erro de conexão com o servidor');
      }

      // Erro interno do servidor
      if(error.status >= 500){
        console.error('Erro interno do servidor');
      }

      return throwError(() => error);
    })
  );
};
