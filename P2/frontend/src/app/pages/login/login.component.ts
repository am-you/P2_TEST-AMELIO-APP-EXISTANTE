import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { TokenService } from '../../core/service/token.service';
import { Login } from '../../core/models/Login';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  loading = false;
  errorMessage = '';
  token: string | null = null;

  // Am.Yo : formulaire login + password obligatoires
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  // Am.Yo : appelle /api/login, stocke le token ou l'erreur
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.token = null;
    if (this.loginForm.invalid) {
      return;
    }
    const credentials: Login = {
      login: this.loginForm.get('login')?.value,
      password: this.loginForm.get('password')?.value
    };
    this.loading = true;
    this.userService.login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (token) => {
          // Am.Yo : garde le JWT puis ouvre la liste des étudiants
          this.loading = false;
          this.token = token;
          this.tokenService.save(token);
          this.router.navigate(['/students']);
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage = this.readServerError(error);
        }
      });
  }

  // Am.Yo : vide le formulaire et les messages
  onReset(): void {
    this.submitted = false;
    this.loading = false;
    this.errorMessage = '';
    this.token = null;
    this.loginForm.reset();
  }

  // Am.Yo : lit le message d'erreur renvoyé par le back
  private readServerError(error: HttpErrorResponse): string {
    const body = error.error;
    if (typeof body === 'string' && body.trim()) {
      try {
        const parsed = JSON.parse(body) as { message?: string; detail?: string };
        return parsed.message || parsed.detail || body;
      } catch {
        return body;
      }
    }
    if (body && typeof body === 'object') {
      const details = body as { message?: string; detail?: string };
      return details.message || details.detail || 'Authentication failed';
    }
    return 'Authentication failed';
  }
}
