import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';

// Am.Yo : inscription envoyée seulement si le formulaire est valide
describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  const userService = { register: jest.fn(() => of({})) };

  beforeEach(async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => undefined);
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.restoreAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not register an empty form', () => {
    component.onSubmit();
    expect(userService.register).not.toHaveBeenCalled();
  });

  it('registers a complete user and can reset the form', () => {
    component.registerForm.setValue({
      firstName: 'Am',
      lastName: 'Test',
      login: 'am.test1',
      password: 'password',
    });

    component.onSubmit();

    expect(userService.register).toHaveBeenCalledWith({
      firstName: 'Am',
      lastName: 'Test',
      login: 'am.test1',
      password: 'password',
    });
    expect(window.alert).toHaveBeenCalled();

    component.onReset();
    expect(component.submitted).toBe(false);
  });
});
