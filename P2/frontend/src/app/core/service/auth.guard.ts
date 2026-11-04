import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from './token.service';

// Am.Yo : bloque la page et renvoie vers /login sans JWT
export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  if (tokenService.isLoggedIn()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
