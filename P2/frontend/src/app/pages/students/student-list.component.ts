import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { StudentService } from '../../core/service/student.service';
import { TokenService } from '../../core/service/token.service';
import { Student } from '../../core/models/Student';
import { readServerError } from '../../core/service/http-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-student-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './student-list.component.html',
  standalone: true
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  students: Student[] = [];
  loading = false;
  errorMessage = '';

  // Am.Yo : charge la liste au démarrage de la page
  ngOnInit(): void {
    this.load();
  }

  // Am.Yo : GET la liste, affiche l'erreur serveur sinon
  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.studentService.findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (students) => {
          this.loading = false;
          this.students = students;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage = readServerError(error);
        }
      });
  }

  // Am.Yo : DELETE puis recharge la liste
  onDelete(student: Student): void {
    this.studentService.delete(student.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.load(),
        error: (error: HttpErrorResponse) => {
          this.errorMessage = readServerError(error);
        }
      });
  }

  // Am.Yo : oublie le JWT et revient au login
  onLogout(): void {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }
}
