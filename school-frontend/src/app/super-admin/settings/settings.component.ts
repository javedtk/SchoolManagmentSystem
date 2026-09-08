import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  @Input() settingsForm = {
    school_name:    '',
    school_email:   '',
    school_phone:   '',
    school_address: '',
    academic_year:  ''
  };

  @Output() save           = new EventEmitter<any>();
  @Output() updatePassword = new EventEmitter<any>();

  // Internal sidebar active section
  activeSection: 'profile' | 'password' = 'profile';

  // Password form
  passwordForm = {
    currentPassword:  '',
    newPassword:      '',
    confirmPassword:  ''
  };

  passwordError   = '';
  passwordSuccess = false;

  submitSettings(): void {
    this.save.emit(this.settingsForm);
  }

  submitPassword(): void {
    this.passwordError   = '';
    this.passwordSuccess = false;

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordError = 'New password and confirm password do not match.';
      return;
    }
    if (this.passwordForm.newPassword.length < 6) {
      this.passwordError = 'New password must be at least 6 characters.';
      return;
    }

    this.updatePassword.emit({
      currentPassword: this.passwordForm.currentPassword,
      newPassword:     this.passwordForm.newPassword
    });

    this.passwordSuccess = true;
    this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
  }
}
