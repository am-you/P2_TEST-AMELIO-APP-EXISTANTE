import { Injectable } from '@angular/core';

const TOKEN_KEY = 'authToken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // Am.Yo : garde le JWT dans la session du navigateur
  save(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  // Am.Yo : relit le JWT, ou null si personne n'est connecté
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  // Am.Yo : oublie le JWT
  clear(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  // Am.Yo : vrai seulement si un JWT est stocké
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
