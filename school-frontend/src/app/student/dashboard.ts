import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

import { OverviewComponent } from './dashboard/overview.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { ResultsComponent } from './results/results.component';
import { FeeReceiptComponent } from './fee-receipt/fee-receipt.component';
import { TimetableComponent } from './timetable/timetable.component';
import { SettingsComponent } from './settings/settings.component';
import { UserGuideComponent } from './user-guide/user-guide.component';
import { HeaderComponent } from '../shared/header/header.component';
import { CustomAlertComponent } from '../shared/custom-alert/custom-alert.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OverviewComponent,
    AttendanceComponent,
    AssignmentsComponent,
    ResultsComponent,
    FeeReceiptComponent,
    TimetableComponent,
    SettingsComponent,
    UserGuideComponent,
    HeaderComponent,
    CustomAlertComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class StudentDashboard implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  activeTab = signal<string>('dashboard');

  // Student Stats
  stats = signal<any>({ attendancePercentage: 100, pendingFees: 0, className: 'Unassigned', pendingAssignments: 0 });
  charts = signal<any>({ attendance: [], assignments: [], fees: [], performance: [] });
  upcomingEvents = signal<any[]>([]);
  latestResults = signal<any[]>([]);

  // Lists
  attendanceReport = signal<any>({ percentage: 100, summary: {}, records: [] });
  assignments = signal<any[]>([]);
  studentSubmissions = signal<any[]>([]);
  results = signal<any[]>([]);
  feeStatus = signal<any[]>([]);
  timetable = signal<any[]>([]);

  // Homework file uploads
  selectedAssignmentId = signal<number | null>(null);
  selectedHomeworkFile: File | null = null;
  submitLoading = signal<boolean>(false);

  // Fee payments details
  selectedFeeStructureId = signal<number | null>(null);
  payAmount = signal<number>(0);
  payLoading = signal<boolean>(false);

  // Dialog overlays
  activeModal = signal<string | null>(null);

  // Security Credentials


  // Notifications banner
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
    else if (tab === 'attendance') this.loadAttendanceReport();
    else if (tab === 'assignments') this.loadAssignmentsAndSubmissions();
    else if (tab === 'results') this.loadResults();
    else if (tab === 'fees') this.loadFeeDetails();
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
      this.upcomingEvents.set(res.upcomingEvents);
      this.latestResults.set(res.latestResults);
      if (res.charts) this.charts.set(res.charts);
    });
  }

  loadAttendanceReport(): void {
    this.api.get<any>('/attendance/report').subscribe(res => this.attendanceReport.set(res));
  }

  loadAssignmentsAndSubmissions(): void {
    // 1. Get assignments for class
    this.api.get<any[]>('/assignments').subscribe(res => this.assignments.set(res));
    // 2. Get student submissions
    this.api.get<any[]>('/assignments/student/submissions').subscribe(res => this.studentSubmissions.set(res));
  }

  loadResults(): void {
    this.api.get<any[]>('/results/student').subscribe(res => this.results.set(res));
  }

  loadFeeDetails(): void {
    this.api.get<any[]>('/fees/student/status').subscribe(res => this.feeStatus.set(res));
  }

  loadTimetable(): void {
    const classId = this.auth.currentUser()?.profile?.class_id || this.auth.currentProfile()?.class_id;
    if (classId) {
      this.api.get<any[]>(`/timetable/class/${classId}`).subscribe(res => this.timetable.set(res));
    } else {
      // Lazy load profile to fetch class_id if missing
      this.api.get<any>('/auth/profile').subscribe(res => {
        const cId = res.profile?.class_id;
        if (cId) {
          this.api.get<any[]>(`/timetable/class/${cId}`).subscribe(t => this.timetable.set(t));
        }
      });
    }
  }

  // SUBMIT HOMEWORK WORK
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
    if (!assignmentId) {
      this.showNotify('No active assignment selected.', 'error');
      return;
    }
    
    if (!this.selectedHomeworkFile) {
      alert('Please upload a file.');
      return;
    }

    this.submitLoading.set(true);
    const formData = new FormData();
    formData.append('assignment_id', assignmentId.toString());
    formData.append('file', this.selectedHomeworkFile);

    this.api.post<any>(`/assignments/${assignmentId}/submit`, formData).subscribe({
      next: () => {
        this.submitLoading.set(false);
        this.showNotify('Homework submitted successfully.');
        this.activeModal.set(null);
        this.loadAssignmentsAndSubmissions();
      },
      error: () => {
        this.submitLoading.set(false);
        this.showNotify('Failed to upload homework.', 'error');
      }
    });
  }

  hasSubmitted(assignmentId: number): boolean {
    return this.studentSubmissions().some(s => s.assignment_id === assignmentId);
  }

  getSubmissionStatus(assignmentId: number): string {
    const sub = this.studentSubmissions().find(s => s.assignment_id === assignmentId);
    return sub ? sub.status : 'unsubmitted';
  }

  getSubmissionRemarks(assignmentId: number): string {
    const sub = this.studentSubmissions().find(s => s.assignment_id === assignmentId);
    return sub ? (sub.remarks || 'No remarks yet.') : 'N/A';
  }

  // FEE BILL PAY
  openPayModal(structure: any): void {
    this.selectedFeeStructureId.set(structure.id);
    this.payAmount.set(structure.amount);
    this.activeModal.set('pay-fee');
  }

  processPayment(): void {
    this.payLoading.set(true);
    const paymentBody = {
      fee_structure_id: this.selectedFeeStructureId(),
      amount_paid: this.payAmount(),
      payment_mode: 'Online'
    };

    this.api.post<any>('/fees/pay', paymentBody).subscribe({
      next: () => {
        this.payLoading.set(false);
        this.showNotify('Fee payment processed. Receipt generated and emailed to your inbox.');
        this.activeModal.set(null);
        this.loadFeeDetails();
      },
      error: () => {
        this.payLoading.set(false);
        this.showNotify('Payment gateway timeout. Please try again.', 'error');
      }
    });
  }

  downloadReceiptUrl(paymentId: number): string {
    return `http://localhost:5000/api/fees/payments/${paymentId}/receipt`;
  }

  downloadReportCardUrl(examId: number): string {
    const studentId = this.auth.getProfileId();
    return `http://localhost:5000/api/results/student/${studentId}/exam/${examId}/download`;
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
