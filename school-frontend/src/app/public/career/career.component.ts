import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-career',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './career.component.html',
  styleUrl: './career.component.scss'
})
export class CareerComponent {
  @Input() jobs: any[] = [];
  @Input() activeJob: any | null = null;
  @Input() jobLoading = false;
  @Input() jobSuccess: string | null = null;
  @Input() jobError: string | null = null;

  @Output() selectJob = new EventEmitter<any>();
  @Output() closeJob = new EventEmitter<void>();
  @Output() submitApplication = new EventEmitter<any>();
  @Output() resumeSelected = new EventEmitter<any>();

  selectedJobForDetails = signal<any | null>(null);

  openApplyModal(job: any): void {
    this.selectedJobForDetails.set(null);
    this.selectJob.emit(job);
  }

  jobForm = {
    applicant_name: '',
    email: '',
    phone: '',
    cover_letter: ''
  };

  onSubmit(): void {
    this.submitApplication.emit(this.jobForm);
  }

  onFileSelected(event: any): void {
    this.resumeSelected.emit(event);
  }

  clearForm(): void {
    this.jobForm = {
      applicant_name: '',
      email: '',
      phone: '',
      cover_letter: ''
    };
  }
}
