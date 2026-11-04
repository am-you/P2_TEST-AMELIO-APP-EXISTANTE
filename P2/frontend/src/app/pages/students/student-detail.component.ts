import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';
import { readServerError } from '../../core/service/http-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-student-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './student-detail.component.html',
  standalone: true
})
export class StudentDetailComponent implements OnInit {
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  student: Student | null = null;
  loading = false;
  errorMessage = '';

  // Am.Yo : charge l'étudiant dont l'id est dans l'URL
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.studentService.findById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (student) => {
          this.loading = false;
          this.student = student;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage = readServerError(error);
        }
      });
  }

  // Am.Yo : DELETE puis retour à la liste
  onDelete(): void {
    if (!this.student) {
      return;
    }
    this.studentService.delete(this.student.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/students']),
        error: (error: HttpErrorResponse) => {
          this.errorMessage = readServerError(error);
        }
      });
  }
}
