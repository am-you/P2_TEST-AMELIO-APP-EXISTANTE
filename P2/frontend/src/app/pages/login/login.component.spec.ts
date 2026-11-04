import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginComponent } from './login.component';
import { UserService } from '../../core/service/user.service';
import { TokenService } from '../../core/service/token.service';

// Am.Yo : login réussi, erreur serveur, formulaire invalide
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const userService = { login: jest.fn() };

  beforeEach(async () => {
    sessionStorage.clear();
    userService.login.mockReset();
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not call the API when the form is empty', () => {
    component.onSubmit();
    expect(userService.login).not.toHaveBeenCalled();
  });

  it('stores the JWT and opens the student list', () => {
    userService.login.mockReturnValue(of('jwt-token'));
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.loginForm.setValue({ login: 'am.test1', password: 'password' });

    component.onSubmit();

    expect(TestBed.inject(TokenService).getToken()).toBe('jwt-token');
    expect(navigate).toHaveBeenCalledWith(['/students']);
  });

  it('shows the server message, a raw error, or a default', () => {
    component.loginForm.setValue({ login: 'am.test1', password: 'password' });

    userService.login.mockReturnValue(throwError(() => new HttpErrorResponse({ error: '{"message":"Invalid credentials"}' })));
    component.onSubmit();
    expect(component.errorMessage).toBe('Invalid credentials');

    userService.login.mockReturnValue(throwError(() => new HttpErrorResponse({ error: '{"detail":"missing"}' })));
    component.onSubmit();
    expect(component.errorMessage).toBe('missing');

    userService.login.mockReturnValue(throwError(() => new HttpErrorResponse({ error: 'bad request' })));
    component.onSubmit();
    expect(component.errorMessage).toBe('bad request');

    userService.login.mockReturnValue(throwError(() => new HttpErrorResponse({ error: { detail: 'nope' } })));
    component.onSubmit();
    expect(component.errorMessage).toBe('nope');

    userService.login.mockReturnValue(throwError(() => new HttpErrorResponse({ error: {} })));
    component.onSubmit();
    expect(component.errorMessage).toBe('Authentication failed');
  });

  it('clears the form', () => {
    component.loginForm.setValue({ login: 'am.test1', password: 'password' });
    component.submitted = true;
    component.errorMessage = 'x';
    component.token = 'jwt';

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(component.token).toBeNull();
    expect(component.loginForm.value.login).toBeNull();
  });
});
