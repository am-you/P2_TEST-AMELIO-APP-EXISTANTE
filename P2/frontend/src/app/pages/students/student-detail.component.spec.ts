import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { StudentDetailComponent } from './student-detail.component';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

const student: Student = {
  id: 3,
  firstName: 'Lea',
  lastName: 'Martin',
  email: 'lea.martin@test.fr',
  created_at: '',
  updated_at: '',
};

// Am.Yo : détail, suppression, étudiant introuvable
describe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;
  const api = {
    findById: jest.fn(() => of(student)),
    delete: jest.fn(() => of(undefined)),
  };

  beforeEach(async () => {
    api.findById.mockReset();
    api.findById.mockReturnValue(of(student));
    api.delete.mockReset();
    api.delete.mockReturnValue(of(undefined));
    await TestBed.configureTestingModule({
      imports: [StudentDetailComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '3' }) } } },
        { provide: StudentService, useValue: api },
      ],
    }).compileComponents();
  });

  function create(): void {
    const fixture: ComponentFixture<StudentDetailComponent> = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('loads the student from the url', () => {
    create();
    expect(component.student?.email).toBe('lea.martin@test.fr');
    expect(component.loading).toBe(false);
  });

  it('shows an error and ignores delete when nobody is loaded', () => {
    api.findById.mockReturnValue(throwError(() => new HttpErrorResponse({ error: 'missing', status: 404 })));
    create();
    expect(component.errorMessage).toBe('missing');

    component.onDelete();
    expect(api.delete).not.toHaveBeenCalled();
  });

  it('deletes then returns to the list, or shows the error', () => {
    create();
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    component.onDelete();
    expect(navigate).toHaveBeenCalledWith(['/students']);

    api.delete.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ error: { message: 'nope' }, status: 400 })));
    component.onDelete();
    expect(component.errorMessage).toBe('nope');
  });
});
