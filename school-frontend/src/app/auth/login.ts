import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  errorMsg = signal<string | null>(null);
  loading = signal<boolean>(false);

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMsg.set('Please enter both email and password.');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading.set(false);
        const role = res.user.role;
        // Redirect based on role
        if (role === 'super_admin') {
          this.router.navigate(['/super_admin/dashboard']);
        } else if (role === 'teacher') {
          this.router.navigate(['/teacher/dashboard']);
        } else if (role === 'student') {
          this.router.navigate(['/student/dashboard']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err.error?.message || 'Login failed. Invalid email or password.');
      }
    });
  }
}
