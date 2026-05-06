import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  // não tem token → redireciona
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // verifica se o token esta expirado
  if (isTokenExpired(token)) {
    localStorage.removeItem('token');
    router.navigate(['/login']);
    return false;
  }

  return true;
};

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() > payload.exp * 1000;
  } catch {
    return true; // token malformado → trata como expirado
  }
}