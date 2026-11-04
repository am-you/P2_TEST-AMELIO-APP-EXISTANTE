import { TestBed } from '@angular/core/testing';
import { provideRouter, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { TokenService } from './token.service';

// Am.Yo : laisse passer avec un JWT, sinon renvoie vers /login
describe('authGuard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('allows the page when a token is stored', () => {
    TestBed.inject(TokenService).save('jwt-token');

    const allowed = TestBed.runInInjectionContext(() => authGuard(null as never, null as never));

    expect(allowed).toBe(true);
  });

  it('redirects to /login without a token', () => {
    const result = TestBed.runInInjectionContext(() => authGuard(null as never, null as never));

    expect(result).toBeInstanceOf(UrlTree);
    expect(String(result)).toBe('/login');
  });
});
