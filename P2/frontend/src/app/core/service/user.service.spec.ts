import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';

// Am.Yo : register et login vers l'API
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('posts the registration and reads the login token as text', () => {
    const user = { firstName: 'Am', lastName: 'Test', login: 'am.test1', password: 'password' };
    const credentials = { login: 'am.test1', password: 'password' };

    service.register(user).subscribe();
    service.login(credentials).subscribe((token) => expect(token).toBe('jwt-token'));

    const registerCall = httpMock.expectOne('/api/register');
    const loginCall = httpMock.expectOne('/api/login');
    expect(registerCall.request.method).toBe('POST');
    expect(loginCall.request.responseType).toBe('text');
    registerCall.flush({});
    loginCall.flush('jwt-token');
  });
});
