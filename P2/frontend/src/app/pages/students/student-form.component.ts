import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../shared/material.module';
import { StudentService } from '../../core/service/student.service';
import { StudentRequest } from '../../core/models/Student';
import { readServerError } from '../../core/service/http-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-student-form',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './student-form.component.html',
  standalone: true
})
export class StudentFormComponent implements OnInit {
  private studentService = inject(StudentService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  studentForm: FormGroup = new FormGroup({});
  studentId: number | null = null;
  submitted = false;
  loading = false;
  errorMessage = '';

  // Am.Yo : formulaire vide, ou prérempli si on modifie
  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.studentId = Number(id);
    this.loading = true;
    this.studentService.findById(this.studentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (student) => {
          this.loading = false;
          this.studentForm.patchValue(student);
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage = readServerError(error);
        }
      });
  }

  get form() {
    return this.studentForm.controls;
  }

  // Am.Yo : POST si création, PUT si modification
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (this.studentForm.invalid) {
      return;
    }
    const request: StudentRequest = {
      firstName: this.studentForm.get('firstName')?.value,
      lastName: this.studentForm.get('lastName')?.value,
      email: this.studentForm.get('email')?.value
    };
    this.loading = true;
    const call = this.studentId === null
      ? this.studentService.create(request)
      : this.studentService.update(this.studentId, request);
    call.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/students']),
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage = readServerError(error);
        }
      });
  }
}
