import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

// Am.Yo : JWT gardé dans la session
describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    sessionStorage.clear();
    service = TestBed.inject(TokenService);
  });

  it('saves, reads, then forgets the token', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getToken()).toBeNull();

    service.save('jwt-token');

    expect(service.getToken()).toBe('jwt-token');
    expect(service.isLoggedIn()).toBe(true);

    service.clear();

    expect(service.isLoggedIn()).toBe(false);
  });
});
