import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import {LoginComponent} from './pages/login/login.component';
import {StudentListComponent} from './pages/students/student-list.component';
import {StudentDetailComponent} from './pages/students/student-detail.component';
import {StudentFormComponent} from './pages/students/student-form.component';
import {AppComponent} from './app.component';
import {authGuard} from './core/service/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  // Am.Yo : écran de connexion
  {
    path: 'login',
    component: LoginComponent
  },
  // Am.Yo : pages étudiants, JWT obligatoire
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/new',
    component: StudentFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/:id',
    component: StudentDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/:id/edit',
    component: StudentFormComponent,
    canActivate: [authGuard]
  }

];
