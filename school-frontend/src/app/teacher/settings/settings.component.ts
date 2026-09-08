import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-teacher-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  profile = signal<any>(null);
  loading = signal<boolean>(false);
  errorMsg = signal<string | null>(null);
  successMsg = signal<string | null>(null);

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  showCurrent = signal<boolean>(false);
  showNew = signal<boolean>(false);
  showConfirm = signal<boolean>(false);

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.api.get<any>('/auth/profile').subscribe({
      next: (res) => {
        this.profile.set(res);
      },
      error: () => {
        this.errorMsg.set('Failed to load profile details.');
      }
    });
  }

  submitPasswordChange(): void {
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      this.errorMsg.set('All password fields are required.');
      this.successMsg.set(null);
      return;
    }

    if (newPassword !== confirmPassword) {
      this.errorMsg.set('New password and confirm password do not match.');
      this.successMsg.set(null);
      return;
    }

    if (newPassword.length < 6) {
      this.errorMsg.set('Password must be at least 6 characters long.');
      this.successMsg.set(null);
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);
    this.successMsg.set(null);

    this.auth.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMsg.set('Your password has been successfully updated.');
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err.error?.message || 'Failed to update password. Please check your current password.');
      }
    });
  }
}
