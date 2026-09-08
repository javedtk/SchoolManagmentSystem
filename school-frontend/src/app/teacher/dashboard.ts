import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { OverviewComponent } from './dashboard/overview.component';
import { AssignedClassComponent } from './assigned-class/assigned-class.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { ResultsComponent } from './results/results.component';
import { TimetableComponent } from './timetable/timetable.component';
import { SettingsComponent } from './settings/settings.component';
import { UserGuideComponent } from './user-guide/user-guide.component';
import { HeaderComponent } from '../shared/header/header.component';
import { CustomAlertComponent } from '../shared/custom-alert/custom-alert.component';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OverviewComponent,
    AssignedClassComponent,
    AttendanceComponent,
    AssignmentsComponent,
    ResultsComponent,
    TimetableComponent,
    SettingsComponent,
    UserGuideComponent,
    HeaderComponent,
    CustomAlertComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class TeacherDashboard implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  activeTab = signal<string>('dashboard');

  // Teacher Stats
  stats = signal<any>({ assignedClasses: 0, assignedSubjects: 0, totalStudents: 0, pendingGrading: 0 });
  todayTimetable = signal<any[]>([]);
  classSubjects = signal<any[]>([]);

  // Lists
  students = signal<any[]>([]);
  assignments = signal<any[]>([]);
  submissions = signal<any[]>([]);
  exams = signal<any[]>([]);
  timetable = signal<any[]>([]);

  // Selection states
  selectedClassId = signal<number | null>(null);
  selectedSubjectId = signal<number | null>(null);
  selectedExamId = signal<number | null>(null);
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  selectedAssignmentId = signal<number | null>(null);

  // Forms Binding Models
  assignmentForm = { class_id: 0, subject_id: 0, title: '', description: '', due_date: '' };
  selectedAttachmentFile: File | null = null;

  gradeForm = { remarks: '' };

  // Attendance marking records
  attendanceRecords: any[] = [];

  // Marks entering records
  marksRecords = signal<any[]>([]);

  // Dialog modall
  activeModal = signal<string | null>(null);
  selectedEntity = signal<any | null>(null);

  // Security credentials change


  // Alerts notification banner
  alertMsg = signal<{ type: string; text: string } | null>(null);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardStats();
    }
  }

  setTab(tab: string): void {
    this.activeTab.set(tab);
    this.alertMsg.set(null);
    this.activeModal.set(null);

    if (tab === 'dashboard') this.loadDashboardStats();
    else if (tab === 'classes') this.loadClassSubjects();
    else if (tab === 'attendance') this.loadClassSubjects();
    else if (tab === 'assignments') this.loadAssignmentsAndClasses();
    else if (tab === 'results') this.loadExamsAndClasses();
    else if (tab === 'timetable') this.loadTimetable();
  }

  showNotify(text: string, type: string = 'success'): void {
    this.alertMsg.set({ type, text });
    setTimeout(() => this.alertMsg.set(null), 15000);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  // Load Helpers
  loadDashboardStats(): void {
    this.api.get<any>('/common/dashboard').subscribe(res => {
      this.stats.set(res.stats);
      this.todayTimetable.set(res.todayTimetable);
      this.classSubjects.set(res.classSubjects);
    });
  }

  loadClassSubjects(): void {
    this.api.get<any>('/common/dashboard').subscribe(res => {
      this.classSubjects.set(res.classSubjects);
    });
  }

  loadTimetable(): void {
    const teacherId = this.auth.getProfileId();
    if (teacherId) {
      this.api.get<any[]>(`/timetable/teacher`).subscribe(res => this.timetable.set(res));
    }
  }

  viewTimetable(): void {
    this.loadTimetable();
    this.activeModal.set('view-timetable');
  }

  loadAssignmentsAndClasses(): void {
    this.api.get<any[]>('/assignments').subscribe(res => this.assignments.set(res));
    this.loadClassSubjects();
  }

  loadExamsAndClasses(): void {
    this.api.get<any[]>('/results/exams').subscribe(res => this.exams.set(res));
    this.loadClassSubjects();
  }

  // MY CLASSES & STUDENT LIST
  onClassSelectedForStudents(classId: number): void {
    this.selectedClassId.set(classId);
    this.api.get<any[]>(`/admin/students?class_id=${classId}`).subscribe(res => {
      this.students.set(res);
    });
  }

  // ATTENDANCE MARKING
  loadAttendanceSheet(): void {
    const classId = this.selectedClassId();
    const date = this.selectedDate();
    if (!classId || !date) return;

    // First check if attendance has already been marked for this date
    this.api.get<any[]>(`/attendance/history?class_id=${classId}&date=${date}`).subscribe(history => {
      this.api.get<any[]>(`/admin/students?class_id=${classId}`).subscribe(students => {
        this.attendanceRecords = students.map(student => {
          const pastRecord = history.find(h => h.student_id === student.id);
          return {
            student_id: student.id,
            student_name: student.User?.name,
            admission_no: student.admission_no,
            class_id: classId,
            date: date,
            status: pastRecord ? pastRecord.status : 'present'
          };
        });
      });
    });
  }

  submitAttendance(): void {
    this.api.post<any>('/attendance/mark', { attendanceRecords: this.attendanceRecords }).subscribe({
      next: () => this.showNotify('Attendance record submitted successfully.'),
      error: () => this.showNotify('Failed to submit attendance.', 'error')
    });
  }

  // ASSIGNMENTS CRUD & GRADING
  openAssignmentModal(): void {
    this.assignmentForm = {
      class_id: this.classSubjects().length > 0 ? this.classSubjects()[0].class_id : 0,
      subject_id: this.classSubjects().length > 0 ? this.classSubjects()[0].subject_id : 0,
      title: '',
      description: '',
      due_date: ''
    };
    this.selectedAttachmentFile = null;
    this.activeModal.set('assignment');
  }

  onAttachmentSelected(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedAttachmentFile = fileList[0];
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
      this.showNotify('Assignment posted.');
      this.activeModal.set(null);
      this.loadAssignmentsAndClasses();
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
    this.api.put<any>(`/assignments/submissions/${sub.id}/grade`, this.gradeForm).subscribe(() => {
      this.showNotify('Submission remarks saved.');
      this.activeModal.set(null);
      // reload submissions
      this.viewSubmissions(Number(this.selectedAssignmentId()));
    });
  }

  deleteAssignment(id: number): void {
    if (confirm('Are you sure you want to delete this assignment?')) {
      this.api.delete<any>(`/assignments/${id}`).subscribe(() => {
        this.showNotify('Assignment deleted.');
        this.loadAssignmentsAndClasses();
      });
    }
  }

  // RESULTS ENTERING
  loadMarksSheet(): void {
    const classId = this.selectedClassId();
    const examId = this.selectedExamId();
    const subjectId = this.selectedSubjectId();
    if (!classId || !examId || !subjectId) return;

    // Fetch existing results
    this.api.get<any[]>(`/results/class-results?class_id=${classId}&exam_id=${examId}`).subscribe(results => {
      this.api.get<any[]>(`/admin/students?class_id=${classId}`).subscribe(students => {
        const records = students.map(student => {
          // Find if there is a marks entry for this student and subject
          const pastRecord = results.find(r => r.student_id === student.id && r.subject_id === Number(subjectId));
          return {
            student_id: student.id,
            student_name: student.User?.name,
            admission_no: student.admission_no,
            exam_id: Number(examId),
            subject_id: Number(subjectId),
            marks_obtained: pastRecord ? pastRecord.marks_obtained : 0,
            max_marks: pastRecord ? pastRecord.max_marks : 100
          };
        });
        this.marksRecords.set(records);
      });
    });
  }

  submitMarks(): void {
    this.api.post<any>('/results/enter-marks', { marksRecords: this.marksRecords() }).subscribe({
      next: () => this.showNotify('Student marks entered/updated successfully.'),
      error: (err) => this.showNotify(err.error?.message || 'Failed to submit marks.', 'error')
    });
  }

  // CHANGE PASSWORD
  changePassword(formData: any): void {
    this.auth.changePassword(formData).subscribe({
      next: () => {
        this.showNotify('Password updated.');
      },
      error: (err) => this.showNotify(err.error?.message || 'Failed to update password.', 'error')
    });
  }
}
