import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { StudentService } from './student.service';
import { Student } from '../models/Student';

const student: Student = {
  id: 3,
  firstName: 'Lea',
  lastName: 'Martin',
  email: 'lea.martin@test.fr',
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
};

// Am.Yo : les cinq appels /api/students
describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('creates, lists, reads, updates, and deletes', () => {
    const request = { firstName: 'Lea', lastName: 'Martin', email: 'lea.martin@test.fr' };

    service.create(request).subscribe((created) => expect(created).toEqual(student));
    service.findAll().subscribe((list) => expect(list).toEqual([student]));
    service.findById(3).subscribe((found) => expect(found).toEqual(student));
    service.update(3, request).subscribe((updated) => expect(updated).toEqual(student));
    service.delete(3).subscribe((result) => expect(result).toBeNull());

    const expected = [
      ['POST', '/api/students', student],
      ['GET', '/api/students', [student]],
      ['GET', '/api/students/3', student],
      ['PUT', '/api/students/3', student],
      ['DELETE', '/api/students/3', null],
    ] as const;
    for (const [method, url, body] of expected) {
      const call = httpMock.expectOne((request) => request.method === method && request.url === url);
      call.flush(body);
    }
  });
});
