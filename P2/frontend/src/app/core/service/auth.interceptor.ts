import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from './token.service';

// Am.Yo : ajoute Authorization Bearer sur les appels /api protégés
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenService).getToken();
  const isPublic = req.url.includes('/api/login') || req.url.includes('/api/register');
  if (!token || isPublic) {
    return next(req);
  }
  return next(req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }));
};
