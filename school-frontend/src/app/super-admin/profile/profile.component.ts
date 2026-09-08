import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly apiService = inject(ApiService);

  @Input() currentUser: any = null;
  @Output() updatePassword = new EventEmitter<any>();

  currentUserDetails = signal<any | null>(null);
  name = signal<string>('');
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  isSubmittingDetails = signal<boolean>(false);
  alertMessage = signal<{ text: string; type: 'success' | 'error' } | null>(null);

  passwordForm = {
    currentPassword: '',
    newPassword: ''
  };

  ngOnInit(): void {
    if (this.currentUser) {
      this.name.set(this.currentUser.name || '');
    }
    this.loadProfileDetails();
  }

  loadProfileDetails(): void {
    this.apiService.get<any>('/auth/profile').subscribe({
      next: (res) => {
        if (res && res.user) {
          this.currentUserDetails.set(res.user);
          this.name.set(res.user.name || '');
        }
      },
      error: (err) => {
        console.error('Failed to load profile details:', err);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  submitDetailsUpdate(): void {
    if (!this.name().trim()) {
      this.alertMessage.set({ text: 'Full Name is required.', type: 'error' });
      return;
    }

    this.isSubmittingDetails.set(true);
    this.alertMessage.set(null);

    const formData = new FormData();
    formData.append('name', this.name().trim());
    if (this.selectedFile()) {
      formData.append('profile_image', this.selectedFile()!);
    }

    this.authService.updateProfile(formData).subscribe({
      next: (res) => {
        this.isSubmittingDetails.set(false);
        this.selectedFile.set(null);
        this.loadProfileDetails();
        this.alertMessage.set({ text: 'Profile details updated successfully.', type: 'success' });
        setTimeout(() => this.alertMessage.set(null), 5000);
      },
      error: (err) => {
        this.isSubmittingDetails.set(false);
        this.alertMessage.set({ text: err.error?.message || 'Failed to update profile.', type: 'error' });
      }
    });
  }

  submitPasswordChange(): void {
    this.updatePassword.emit({
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword
    });
    this.passwordForm = { currentPassword: '', newPassword: '' };
  }
}
