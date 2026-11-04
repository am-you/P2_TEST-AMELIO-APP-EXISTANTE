import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from './auth.interceptor';
import { TokenService } from './token.service';

// Am.Yo : ajoute Bearer sauf sur login et register
describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('adds the token on a protected call', () => {
    TestBed.inject(TokenService).save('jwt-token');

    http.get('/api/students').subscribe();

    const request = httpMock.expectOne('/api/students');
    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    request.flush([]);
  });

  it('skips login, register, and calls without a token', () => {
    http.post('/api/login', {}).subscribe();
    http.post('/api/register', {}).subscribe();
    http.get('/api/students').subscribe();

    for (const url of ['/api/login', '/api/register', '/api/students']) {
      const request = httpMock.expectOne(url);
      expect(request.request.headers.has('Authorization')).toBe(false);
      request.flush({});
    }
  });
});
