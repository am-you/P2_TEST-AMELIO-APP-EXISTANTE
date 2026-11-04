import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, StudentRequest } from '../models/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private httpClient: HttpClient) { }

  // Am.Yo : POST /api/students
  create(student: StudentRequest): Observable<Student> {
    return this.httpClient.post<Student>('/api/students', student);
  }

  // Am.Yo : GET /api/students
  findAll(): Observable<Student[]> {
    return this.httpClient.get<Student[]>('/api/students');
  }

  // Am.Yo : GET /api/students/{id}
  findById(id: number): Observable<Student> {
    return this.httpClient.get<Student>(`/api/students/${id}`);
  }

  // Am.Yo : PUT /api/students/{id}
  update(id: number, student: StudentRequest): Observable<Student> {
    return this.httpClient.put<Student>(`/api/students/${id}`, student);
  }

  // Am.Yo : DELETE /api/students/{id}
  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`/api/students/${id}`);
  }
}
