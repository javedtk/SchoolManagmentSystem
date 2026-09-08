import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-student-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.scss'
})
export class AssignmentsComponent {
  private readonly api = inject(ApiService);

  @Input() assignments: any[] = [];
  @Input() studentSubmissions: any[] = [];

  @Output() reload = new EventEmitter<void>();

  activeModal = signal<string | null>(null);
  selectedAssignmentId = signal<number | null>(null);
  selectedHomeworkFile: File | null = null;
  submitLoading = signal<boolean>(false);

  openSubmitModal(assignmentId: number): void {
    this.selectedAssignmentId.set(assignmentId);
    this.selectedHomeworkFile = null;
    this.activeModal.set('submit-homework');
  }

  onHomeworkFileSelected(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedHomeworkFile = fileList[0];
    }
  }

  submitHomework(): void {
    const assignmentId = this.selectedAssignmentId();
    if (!assignmentId || !this.selectedHomeworkFile) return;

    this.submitLoading.set(true);
    const formData = new FormData();
    formData.append('assignment_id', assignmentId.toString());
    formData.append('file', this.selectedHomeworkFile);

    this.api.post<any>(`/assignments/${assignmentId}/submit`, formData).subscribe({
      next: () => {
        this.submitLoading.set(false);
        this.activeModal.set(null);
        this.reload.emit();
      },
      error: () => {
        this.submitLoading.set(false);
        alert('Failed to submit homework file.');
      }
    });
  }

  hasSubmitted(assignmentId: number): boolean {
    return this.studentSubmissions.some(s => s.assignment_id === assignmentId);
  }

  getSubmissionStatus(assignmentId: number): string {
    const sub = this.studentSubmissions.find(s => s.assignment_id === assignmentId);
    return sub ? sub.status : 'unsubmitted';
  }

  getSubmissionRemarks(assignmentId: number): string {
    const sub = this.studentSubmissions.find(s => s.assignment_id === assignmentId);
    return sub ? (sub.remarks || 'No remarks yet.') : 'N/A';
  }

  get totalAssignmentsCount(): number {
    return this.assignments?.length || 0;
  }

  get submittedCount(): number {
    return this.assignments?.filter(a => this.hasSubmitted(a.id)).length || 0;
  }

  get pendingCount(): number {
    return Math.max(0, this.totalAssignmentsCount - this.submittedCount);
  }
}
