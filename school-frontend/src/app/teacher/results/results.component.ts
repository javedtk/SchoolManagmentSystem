import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  @Input() exams: any[] = [];
  @Input() classSubjects: any[] = [];
  @Input() marksRecords: any[] = [];
  @Input() selectedClassId: number | null = null;
  @Input() selectedSubjectId: number | null = null;
  @Input() selectedExamId: number | null = null;

  @Output() filterChanged = new EventEmitter<{ examId: number | null; classId: number | null; subjectId: number | null }>();
  @Output() submit = new EventEmitter<any>();

  onExamChange(event: any): void {
    const val = event.target.value;
    const examId = val === 'null' || !val ? null : Number(val);
    this.filterChanged.emit({ examId, classId: this.selectedClassId, subjectId: this.selectedSubjectId });
  }

  onClassSubjectChange(event: any): void {
    const val = event.target.value;
    if (!val) {
      this.filterChanged.emit({ examId: this.selectedExamId, classId: null, subjectId: null });
      return;
    }
    const [classId, subjectId] = val.split(':').map(Number);
    this.filterChanged.emit({ examId: this.selectedExamId, classId, subjectId });
  }

  submitMarks(): void {
    this.submit.emit();
  }
}
