import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  @Output() updatePassword = new EventEmitter<any>();

  passwordForm = {
    currentPassword: '',
    newPassword: ''
  };

  submitPasswordChange(): void {
    this.updatePassword.emit({
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword
    });
    this.passwordForm = { currentPassword: '', newPassword: '' };
  }
}
