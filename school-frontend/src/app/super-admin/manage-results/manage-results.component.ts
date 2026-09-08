import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-admin-manage-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-results.component.html',
  styleUrl: './manage-results.component.scss'
})
export class ManageResultsComponent {
  private readonly tokenService = inject(TokenService);
  @Input() exams: any[] = [];
  @Input() classes: any[] = [];
  @Input() studentResults: any[] = [];
  @Input() activeModal: string | null = null;
  @Input() selectedExamId: number | null = null;
  @Input() selectedClassId: number | null = null;

  @Output() filterChanged = new EventEmitter<{ examId: number | null; classId: number | null }>();
  @Output() saveExam = new EventEmitter<any>();
  @Output() setModal = new EventEmitter<string | null>();
  @Output() emailReport = new EventEmitter<number>();

  examForm = {
    name: '',
    academic_year: '2026-2027',
    start_date: '',
    end_date: ''
  };

  viewingStudent: any | null = null;

  openStudentBreakdown(student: any): void {
    this.viewingStudent = student;
  }

  closeStudentBreakdown(): void {
    this.viewingStudent = null;
  }

  get groupedStudents(): any[] {
    const groups: { [key: number]: any } = {};
    
    for (const res of this.studentResults) {
      const studentId = res.student_id;
      if (!groups[studentId]) {
        groups[studentId] = {
          student_id: studentId,
          studentName: res.Student?.User?.name || 'N/A',
          admissionNo: res.Student?.admission_no || 'N/A',
          profileImage: res.Student?.User?.profile_image,
          totalObtained: 0,
          maxTotal: 0,
          subjects: []
        };
      }
      
      const marksObtained = Number(res.marks_obtained) || 0;
      const maxMarks = Number(res.max_marks) || 0;
      
      groups[studentId].totalObtained += marksObtained;
      groups[studentId].maxTotal += maxMarks;
      groups[studentId].subjects.push({
        subjectName: res.Subject?.name || 'N/A',
        subjectCode: res.Subject?.code || 'N/A',
        marksObtained: marksObtained,
        maxMarks: maxMarks,
        grade: res.grade || 'N/A'
      });
    }
    
    return Object.values(groups).map((group: any) => {
      const percentage = group.maxTotal > 0 ? (group.totalObtained / group.maxTotal) * 100 : 0;
      let grade = 'F';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B';
      else if (percentage >= 60) grade = 'C';
      else if (percentage >= 50) grade = 'D';
      else if (percentage >= 40) grade = 'E';
      
      return {
        ...group,
        overallGrade: grade
      };
    });
  }

  onExamChange(event: any): void {
    const val = event.target.value;
    const examId = val === 'null' || !val ? null : Number(val);
    this.filterChanged.emit({ examId, classId: this.selectedClassId });
  }

  onClassChange(event: any): void {
    const val = event.target.value;
    const classId = val === 'null' || !val ? null : Number(val);
    this.filterChanged.emit({ examId: this.selectedExamId, classId });
  }

  openExamModal(): void {
    this.examForm = {
      name: '',
      academic_year: '2026-2027',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0]
    };
    this.setModal.emit('exam');
  }

  submitExam(): void {
    this.saveExam.emit(this.examForm);
  }

  getDownloadUrl(studentId: number): string {
    const token = this.tokenService.getToken() || '';
    return `http://localhost:5000/api/results/student/${studentId}/exam/${this.selectedExamId}/download?token=${token}`;
  }
}
