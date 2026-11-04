import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { StudentFormComponent } from './student-form.component';
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

// Am.Yo : création vide, création, modification
describe('StudentFormComponent', () => {
  const api = {
    findById: jest.fn(() => of(student)),
    create: jest.fn(() => of(student)),
    update: jest.fn(() => of(student)),
  };

  afterEach(() => {
    api.findById.mockReset();
    api.create.mockReset();
    api.update.mockReset();
    api.findById.mockReturnValue(of(student));
    api.create.mockReturnValue(of(student));
    api.update.mockReturnValue(of(student));
  });

  async function setup(id: string | null): Promise<StudentFormComponent> {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [StudentFormComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } },
        },
        { provide: StudentService, useValue: api },
      ],
    }).compileComponents();
    const fixture: ComponentFixture<StudentFormComponent> = TestBed.createComponent(StudentFormComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('does not save an empty form', async () => {
    const component = await setup(null);
    component.onSubmit();
    expect(api.create).not.toHaveBeenCalled();
    expect(component.studentId).toBeNull();
  });

  it('creates a student and opens the list', async () => {
    const component = await setup(null);
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.studentForm.setValue({ firstName: 'Lea', lastName: 'Martin', email: 'lea.martin@test.fr' });

    component.onSubmit();

    expect(api.create).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/students']);
  });

  it('shows a create error', async () => {
    api.create.mockReturnValue(throwError(() => new HttpErrorResponse({ error: 'taken', status: 400 })));
    const component = await setup(null);
    component.studentForm.setValue({ firstName: 'Lea', lastName: 'Martin', email: 'lea.martin@test.fr' });

    component.onSubmit();

    expect(component.errorMessage).toBe('taken');
    expect(component.loading).toBe(false);
  });

  it('loads the student and updates it', async () => {
    const component = await setup('3');
    expect(component.studentForm.value.firstName).toBe('Lea');
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    component.studentForm.patchValue({ lastName: 'Bernard' });
    component.onSubmit();

    expect(api.update).toHaveBeenCalledWith(3, {
      firstName: 'Lea',
      lastName: 'Bernard',
      email: 'lea.martin@test.fr',
    });
    expect(navigate).toHaveBeenCalledWith(['/students']);
  });

  it('shows an error when the student to edit is missing', async () => {
    api.findById.mockReturnValue(throwError(() => new HttpErrorResponse({ error: { message: 'missing' }, status: 404 })));
    const component = await setup('9');
    expect(component.errorMessage).toBe('missing');
  });
});
