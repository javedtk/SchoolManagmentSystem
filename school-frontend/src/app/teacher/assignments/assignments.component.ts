import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-teacher-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.scss'
})
export class AssignmentsComponent {
  private readonly api = inject(ApiService);

  @Input() assignments: any[] = [];
  @Input() classSubjects: any[] = [];

  @Output() reload = new EventEmitter<void>();

  activeModal = signal<string | null>(null);
  selectedEntity = signal<any | null>(null);
  selectedAssignmentId = signal<number | null>(null);
  submissions = signal<any[]>([]);
  selectedClassId = signal<number | null>(null);

  assignmentForm = {
    class_id: 0,
    subject_id: 0,
    title: '',
    description: '',
    due_date: ''
  };
  selectedAttachmentFile: File | null = null;
  gradeForm = { remarks: '' };

  uniqueClasses(): any[] {
    const classesMap = new Map<number, any>();
    for (const cs of this.classSubjects) {
      if (cs.Class) {
        classesMap.set(cs.Class.id, cs.Class);
      }
    }
    return Array.from(classesMap.values());
  }

  filteredAssignments(): any[] {
    const classId = this.selectedClassId();
    if (!classId) {
      return this.assignments;
    }
    return this.assignments.filter(a => a.Class?.id === classId);
  }

  onClassFilterChange(event: any): void {
    const val = event.target.value;
    if (val) {
      this.selectedClassId.set(Number(val));
    } else {
      this.selectedClassId.set(null);
    }
  }


  openAssignmentModal(): void {
    if (this.classSubjects.length > 0) {
      this.assignmentForm = {
        class_id: this.classSubjects[0].class_id,
        subject_id: this.classSubjects[0].subject_id,
        title: '',
        description: '',
        due_date: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16) // 1 week default
      };
    } else {
      this.assignmentForm = { class_id: 0, subject_id: 0, title: '', description: '', due_date: '' };
    }
    this.selectedAttachmentFile = null;
    this.activeModal.set('assignment');
  }

  onAttachmentSelected(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedAttachmentFile = fileList[0];
    }
  }

  onClassSubjectChange(event: any): void {
    const val = event.target.value;
    if (val) {
      const [classId, subjectId] = val.split(':').map(Number);
      this.assignmentForm.class_id = classId;
      this.assignmentForm.subject_id = subjectId;
    }
  }

  saveAssignment(): void {
    const formData = new FormData();
    formData.append('class_id', this.assignmentForm.class_id.toString());
    formData.append('subject_id', this.assignmentForm.subject_id.toString());
    formData.append('title', this.assignmentForm.title);
    formData.append('description', this.assignmentForm.description);
    formData.append('due_date', this.assignmentForm.due_date);
    if (this.selectedAttachmentFile) {
      formData.append('attachment', this.selectedAttachmentFile);
    }

    this.api.post<any>('/assignments', formData).subscribe(() => {
      this.activeModal.set(null);
      this.reload.emit();
    });
  }

  viewSubmissions(assignmentId: number): void {
    this.selectedAssignmentId.set(assignmentId);
    this.api.get<any[]>(`/assignments/${assignmentId}/submissions`).subscribe(res => {
      this.submissions.set(res);
      this.activeModal.set('submissions');
    });
  }

  openGradeModal(sub: any): void {
    this.selectedEntity.set(sub);
    this.gradeForm = { remarks: sub.remarks || '' };
    this.activeModal.set('grade');
  }

  saveGrade(): void {
    const sub = this.selectedEntity();
    if (!sub) return;
    this.api.put<any>(`/assignments/submissions/${sub.id}/grade`, this.gradeForm).subscribe(() => {
      this.activeModal.set(null);
      const assId = this.selectedAssignmentId();
      if (assId) {
        this.viewSubmissions(assId);
      }
    });
  }

  deleteAssignment(id: number): void {
    if (confirm('Are you sure you want to delete this assignment?')) {
      this.api.delete<any>(`/assignments/${id}`).subscribe(() => {
        this.reload.emit();
      });
    }
  }
}
