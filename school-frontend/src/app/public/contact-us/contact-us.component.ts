import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  @Input() contactLoading = false;
  @Input() contactSuccess: string | null = null;
  @Input() contactError: string | null = null;

  @Output() submitContact = new EventEmitter<any>();

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  onSubmit(): void {
    this.submitContact.emit(this.contactForm);
  }

  clearForm(): void {
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}
