import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { StudentListComponent } from './student-list.component';
import { StudentService } from '../../core/service/student.service';
import { TokenService } from '../../core/service/token.service';
import { Student } from '../../core/models/Student';

const student: Student = {
  id: 3,
  firstName: 'Lea',
  lastName: 'Martin',
  email: 'lea.martin@test.fr',
  created_at: '',
  updated_at: '',
};

// Am.Yo : liste, erreur, suppression, déconnexion
describe('StudentListComponent', () => {
  let component: StudentListComponent;
  const api = {
    findAll: jest.fn(() => of([student])),
    delete: jest.fn(() => of(undefined)),
  };

  beforeEach(async () => {
    sessionStorage.clear();
    api.findAll.mockClear();
    api.delete.mockClear();
    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        provideRouter([]),
        { provide: StudentService, useValue: api },
      ],
    }).compileComponents();
  });

  function create(): void {
    const fixture: ComponentFixture<StudentListComponent> = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('loads the students', () => {
    create();
    expect(component.students).toEqual([student]);
    expect(component.loading).toBe(false);
  });

  it('shows a server error', () => {
    api.findAll.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ error: 'down', status: 500 })));
    create();
    expect(component.errorMessage).toBe('down');
  });

  it('deletes a student and reloads, or shows the error', () => {
    create();
    component.onDelete(student);
    expect(api.delete).toHaveBeenCalledWith(3);
    expect(api.findAll).toHaveBeenCalledTimes(2);

    api.delete.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ error: { message: 'nope' }, status: 400 })));
    component.onDelete(student);
    expect(component.errorMessage).toBe('nope');
  });

  it('clears the token and goes back to login', () => {
    create();
    TestBed.inject(TokenService).save('jwt-token');
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    component.onLogout();

    expect(TestBed.inject(TokenService).isLoggedIn()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
