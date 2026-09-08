import { Routes } from '@angular/router';
import { PublicLayout } from './public/public-layout';
import { Login } from './auth/login';
import { SuperAdminDashboard } from './super-admin/dashboard';
import { TeacherDashboard } from './teacher/dashboard';
import { StudentDashboard } from './student/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public Landing Page
  { path: '', component: PublicLayout },
  
  // Auth Login Portal
  { path: 'auth/login', component: Login },

  // Super Admin Dashboard
  {
    path: 'super_admin/dashboard',
    component: SuperAdminDashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['super_admin'] }
  },

  // Teacher Dashboard
  {
    path: 'teacher/dashboard',
    component: TeacherDashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['teacher'] }
  },

  // Student Dashboard
  {
    path: 'student/dashboard',
    component: StudentDashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['student'] }
  },

  // Catch-all Redirect to Landing
  { path: '**', redirectTo: '' }
];
