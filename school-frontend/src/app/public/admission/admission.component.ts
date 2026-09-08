import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-admission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admission.component.html',
  styleUrl: './admission.component.scss'
})
export class AdmissionComponent {
  @Input() cmsAdmissionInfo: any = { title: '', content: '' };
  @Input() admissionLoading = false;
  @Input() admissionSuccess: string | null = null;
  @Input() admissionError: string | null = null;

  @Output() submitEnquiry = new EventEmitter<any>();

  admissionForm = {
    student_name: '',
    parent_name: '',
    contact: '',
    email: '',
    class_applied: 'Grade 9',
    transport_mode: 'Walking'
  };

  selectedPhotoFile: File | null = null;

  onPhotoSelected(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedPhotoFile = fileList[0];
    }
  }

  onSubmit(): void {
    this.submitEnquiry.emit({
      form: this.admissionForm,
      photo: this.selectedPhotoFile
    });
  }

  clearForm(): void {
    this.admissionForm = {
      student_name: '',
      parent_name: '',
      contact: '',
      email: '',
      class_applied: 'Grade 9',
      transport_mode: 'Walking'
    };
    this.selectedPhotoFile = null;
  }
}
