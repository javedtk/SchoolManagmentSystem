import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { SocketService } from '../core/services/socket.service';
import { HttpEventType } from '@angular/common/http';

import { OverviewComponent } from './dashboard/overview.component';
import { AdmissionCornerComponent } from './admission-corner/admission-corner.component';
import { ManageTeachersComponent } from './manage-teachers/manage-teachers.component';
import { ManageClassesComponent } from './manage-classes/manage-classes.component';
import { ManageSubjectsComponent } from './manage-subjects/manage-subjects.component';
import { ManageStudentsComponent } from './manage-students/manage-students.component';
import { ManageTimetableComponent } from './manage-timetable/manage-timetable.component';
import { FeeReceiptComponent } from './fee-receipt/fee-receipt.component';
import { ManageEventsComponent } from './manage-events/manage-events.component';
import { ManageGalleryComponent } from './manage-gallery/manage-gallery.component';
import { ManageResultsComponent } from './manage-results/manage-results.component';
import { ManageJobsComponent } from './manage-jobs/manage-jobs.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UserGuideComponent } from './user-guide/user-guide.component';
import { HeaderComponent } from '../shared/header/header.component';
import { CustomAlertComponent } from '../shared/custom-alert/custom-alert.component';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OverviewComponent,
    AdmissionCornerComponent,
    ManageTeachersComponent,
    ManageClassesComponent,
    ManageSubjectsComponent,
    ManageStudentsComponent,
    ManageTimetableComponent,
    FeeReceiptComponent,
    ManageEventsComponent,
    ManageGalleryComponent,
    ManageResultsComponent,
    ManageJobsComponent,
    SettingsComponent,
    ProfileComponent,
    UserGuideComponent,
    HeaderComponent,
    CustomAlertComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class SuperAdminDashboard implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly socket = inject(SocketService);

  activeTab = signal<string>('dashboard');

  // Stats data
  stats = signal<any>({ students: 0, teachers: 0, classes: 0, feesCollected: 0, feesPending: 0, pendingAdmissions: 0, jobApplications: 0 });
  charts = signal<any>({ genderRatio: [], enrollmentTrend: [], attendanceRate: 100 });

  // Operations Lists
  enquiries = signal<any[]>([]);
  teachers = signal<any[]>([]);
  classes = signal<any[]>([]);
  subjects = signal<any[]>([]);
  students = signal<any[]>([]);
  exams = signal<any[]>([]);
  feeStructures = signal<any[]>([]);
  payments = signal<any[]>([]);
  events = signal<any[]>([]);
  albums = signal<any[]>([]);
  jobs = signal<any[]>([]);
  applications = signal<any[]>([]);
  cmsPages = signal<any[]>([]);
  verifyingPaymentId = signal<number | null>(null);
  eventUploadProgress = signal<number | null>(null);

  // Modal Control States
  activeModal = signal<string | null>(null);
  selectedEntity = signal<any | null>(null);
  studentSaving = signal<boolean>(false);
  studentAdmitting = signal<boolean>(false);
  
  // Selection Helpers
  selectedClassId = signal<number | null>(null);
  selectedExamId = signal<number | null>(null);
  selectedStudentId = signal<number | null>(null);
  selectedTeacherId = signal<number | null>(null);

  // Forms Binding Models
  teacherForm = { name: '', email: '', employee_id: '', designation: '', qualification: '', joining_date: '', bio: '' };
  studentForm = { name: '', email: '', admission_no: '', class_id: 0, section: 'A', dob: '', gender: 'Male', parent_name: '', parent_contact: '', address: '' };
  classForm = { name: '', section: '', class_teacher_id: 0, capacity: 30 };
  subjectForm = { name: '', code: '', class_id: 0 };
  examForm = { name: '', academic_year: '2026-2027', start_date: '', end_date: '' };
  feeStructureForm = { class_id: 0, category: '', amount: 0, due_date: '', academic_year: '2026-2027' };
  eventForm = { title: '', description: '', event_date: '', category: 'Academics' };
  albumForm = { title: '', description: '' };
  mediaForm = { type: 'image', caption: '' };
  jobForm = { title: '', description: '', requirements: '', location: 'On-site', type: 'Full-time', status: 'active' };
  cmsForm = { title: '', content: '' };
  settingsForm = { school_name: '', school_email: '', school_phone: '', school_address: '', academic_year: '' };
  
  // Timetable and Results entry forms
  timetableForm = { class_id: 0, day: 'Monday', period_no: 1, subject_id: 0, teacher_id: 0, start_time: '08:30 AM', end_time: '09:20 AM' };
  timetableEntries = signal<any[]>([]);
  
  marksRecords: any[] = [];
  studentResults = signal<any[]>([]);

  // Password modification model
  passwordForm = { currentPassword: '', newPassword: '' };
  passwordMsg = signal<string | null>(null);

  // General Notification Alert
  alertMsg = signal<{ type: string; text: string } | null>(null);
  
  // Custom Confirmation Dialog State
  confirmDialog = signal<{
    message: string;
    onConfirm: () => void;
    title?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
  } | null>(null);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardStats();
      this.setupNotifications();
    }
  }

  setupNotifications(): void {
    this.socket.on('new-admission-enquiry').subscribe({
      next: (enquiry: any) => {
        // Show real-time info alert message
        this.showNotify(
          `New Admission Enquiry: ${enquiry.student_name} has applied for ${enquiry.class_applied}!`,
          'info'
        );

        // Auto-refresh enquiries if the admin is currently viewing admissions
        if (this.activeTab() === 'admissions') {
          this.loadAdmissions();
        }

        // Auto-refresh overview counts if the admin is currently on the dashboard
        if (this.activeTab() === 'dashboard') {
          this.loadDashboardStats();
        }
      }
    });

    this.socket.on('new-fee-payment').subscribe({
      next: (payment: any) => {
        this.showNotify(
          `New Fee Payment: ${payment.student_name} submitted $${payment.amount_paid} for ${payment.category}!`,
          'info'
        );

        // Auto-refresh fee payments if the admin is currently viewing fees
        if (this.activeTab() === 'fees') {
          this.loadFeesAndClasses();
        }

        // Auto-refresh overview counts if the admin is currently on the dashboard
        if (this.activeTab() === 'dashboard') {
          this.loadDashboardStats();
        }
      }
    });

    this.socket.on('new-job-application').subscribe({
      next: (app: any) => {
        this.showNotify(
          `New Job Application: ${app.applicant_name} has applied for ${app.job_title || 'a role'}!`,
          'info'
        );

        if (this.activeTab() === 'jobs') {
          this.loadJobs();
          this.loadJobApplications();
        }

        if (this.activeTab() === 'dashboard') {
          this.loadDashboardStats();
        }
      }
    });
  }

  setTab(tab: string): void {
    this.activeTab.set(tab);
    this.alertMsg.set(null);
    
    // Load relevant tab data dynamically
    if (tab === 'dashboard') this.loadDashboardStats();
    else if (tab === 'admissions') this.loadAdmissions();
    else if (tab === 'teachers') this.loadTeachers();
    else if (tab === 'classes') this.loadClassesAndTeachers();
    else if (tab === 'subjects') this.loadSubjectsAndClasses();
    else if (tab === 'students') this.loadStudentsAndClasses();
    else if (tab === 'timetable') {
      this.loadClasses();
      this.loadTeachers();
      this.loadAllSubjectsForTimetable();
    }
    else if (tab === 'exams') this.loadExams();
    else if (tab === 'fees') this.loadFeesAndClasses();
    else if (tab === 'events') this.loadEvents();
    else if (tab === 'gallery') this.loadGallery();
    else if (tab === 'jobs') this.loadJobs();
    else if (tab === 'applications') this.loadJobApplications();
    else if (tab === 'cms') this.loadCMSPages();
    else if (tab === 'settings') this.loadSettings();
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
    // Primary dashboard stats
    this.api.get<any>('/common/dashboard').subscribe(res => {
      this.stats.update(s => ({ ...s, ...res.stats }));
      this.charts.set(res.charts);
    });
    // Additional counts loaded in parallel for extra stat cards
    this.api.get<any[]>('/admin/subjects').subscribe(res =>
      this.stats.update(s => ({ ...s, subjects: res.length }))
    );
    this.api.get<any[]>('/admin/events').subscribe(res => {
      this.events.set(res);
      this.stats.update(s => ({ ...s, events: res.length }));
    });
    this.api.get<any[]>('/admin/jobs').subscribe(res => {
      this.jobs.set(res);
      this.stats.update(s => ({ ...s, openJobs: res.filter((j: any) => j.status === 'active').length }));
    });
    this.api.get<any[]>('/results/exams').subscribe(res => {
      this.exams.set(res);
      this.stats.update(s => ({ ...s, exams: res.length }));
    });
    this.api.get<any[]>('/admin/gallery/albums').subscribe(res => {
      this.albums.set(res);
      this.stats.update(s => ({ ...s, albums: res.length }));
    });
  }

  loadAdmissions(): void {
    this.api.get<any[]>('/admin/admissions/enquiries').subscribe(res => this.enquiries.set(res));
    this.loadClasses();
  }

  loadTeachers(): void {
    this.api.get<any[]>('/admin/teachers').subscribe(res => this.teachers.set(res));
  }

  loadClasses(): void {
    this.api.get<any[]>('/admin/classes').subscribe(res => this.classes.set(res));
  }

  loadClassesAndTeachers(): void {
    this.loadClasses();
    this.loadTeachers();
  }

  loadSubjectsAndClasses(): void {
    this.api.get<any[]>('/admin/subjects').subscribe(res => this.subjects.set(res));
    this.loadClasses();
  }

  loadStudentsAndClasses(): void {
    this.api.get<any[]>('/admin/students').subscribe(res => this.students.set(res));
    this.loadClasses();
  }

  loadExams(): void {
    this.api.get<any[]>('/results/exams').subscribe(res => this.exams.set(res));
    this.loadClasses();
  }

  loadFeesAndClasses(): void {
    this.api.get<any[]>('/fees/structures').subscribe(res => this.feeStructures.set(res));
    this.api.get<any[]>('/fees/payments').subscribe(res => this.payments.set(res));
    this.loadClasses();
  }

  loadEvents(): void {
    this.api.get<any[]>('/admin/events').subscribe(res => this.events.set(res));
  }

  loadGallery(): void {
    this.api.get<any[]>('/admin/gallery/albums').subscribe(res => this.albums.set(res));
  }

  loadJobs(): void {
    this.api.get<any[]>('/admin/jobs').subscribe(res => this.jobs.set(res));
  }

  loadJobApplications(): void {
    this.api.get<any[]>('/admin/job-applications').subscribe(res => this.applications.set(res));
  }

  loadCMSPages(): void {
    this.api.get<any[]>('/admin/cms').subscribe(res => this.cmsPages.set(res));
  }

  loadSettings(): void {
    this.api.get<any>('/admin/settings').subscribe(res => {
      this.settingsForm = {
        school_name: res.school_name || '',
        school_email: res.school_email || '',
        school_phone: res.school_phone || '',
        school_address: res.school_address || '',
        academic_year: res.academic_year || '2026-2027'
      };
    });
  }

  // ADMISSIONS ACTIONS
  approveEnquiry(id: number, status: string): void {
    this.api.put<any>(`/admin/admissions/enquiries/${id}`, { status }).subscribe(() => {
      this.showNotify(`Enquiry status updated to ${status}.`);
      this.loadAdmissions();
    });
  }

  openAdmitModal(enquiry: any): void {
    this.selectedEntity.set(enquiry);
    this.activeModal.set('admit-student');
    if (this.classes().length > 0) {
      this.studentForm.class_id = this.classes()[0].id;
    }
    this.studentForm.section = 'A';
  }

  admitStudent(event?: { enquiryId: number; classId: number; section: string }): void {
    const enquiryId = event ? event.enquiryId : this.selectedEntity()?.id;
    const classId = event ? event.classId : this.studentForm.class_id;
    const section = event ? event.section : this.studentForm.section;
    this.studentAdmitting.set(true);
    this.api.post<any>(`/admin/admissions/enquiries/${enquiryId}/convert`, {
      class_id: classId,
      section: section
    }).subscribe({
      next: () => {
        this.studentAdmitting.set(false);
        this.showNotify('Enquiry successfully converted to active student profile.');
        this.activeModal.set(null);
        this.loadAdmissions();
        this.loadStudentsAndClasses();
      },
      error: (err) => {
        this.studentAdmitting.set(false);
        this.showNotify(err.error?.message || 'Failed to admit candidate.', 'error');
      }
    });
  }

  // TEACHER CRUD
  openTeacherModal(teacher: any = null): void {
    this.selectedEntity.set(teacher);
    if (teacher) {
      this.teacherForm = {
        name: teacher.User?.name || '',
        email: teacher.User?.email || '',
        employee_id: teacher.employee_id,
        designation: teacher.designation || '',
        qualification: teacher.qualification || '',
        joining_date: teacher.joining_date || '',
        bio: teacher.bio || ''
      };
    } else {
      this.teacherForm = { name: '', email: '', employee_id: '', designation: '', qualification: '', joining_date: '', bio: '' };
    }
    this.activeModal.set('teacher');
  }

  saveTeacher(event?: { teacherId: number | null; formValues: any }): void {
    const teacherId = event ? event.teacherId : this.selectedEntity()?.id;
    const form = event ? event.formValues : this.teacherForm;
    if (teacherId) {
      this.api.put<any>(`/admin/teachers/${teacherId}`, form).subscribe(() => {
        this.showNotify('Teacher profile updated successfully.');
        this.activeModal.set(null);
        this.loadTeachers();
      });
    } else {
      this.api.post<any>('/admin/teachers', form).subscribe({
        next: () => {
          this.showNotify('Teacher profile created. Default password: teacher123');
          this.activeModal.set(null);
          this.loadTeachers();
        },
        error: (err) => this.showNotify(err.error?.message || 'Failed to create teacher.', 'error')
      });
    }
  }

  deleteTeacher(id: number): void {
    const teacher = this.teachers().find(t => t.id === id);
    if (!teacher) return;
    const isCurrentlyActive = (teacher.User?.status || '').toLowerCase() === 'active';

    if (isCurrentlyActive) {
      this.api.delete<any>(`/admin/teachers/${id}`).subscribe(() => {
        this.showNotify('Teacher profile deactivated.');
        this.activeModal.set(null);
        this.loadTeachers();
      });
    } else {
      this.api.put<any>(`/admin/teachers/${id}`, { status: 'active' }).subscribe(() => {
        this.showNotify('Teacher profile activated successfully.');
        this.activeModal.set(null);
        this.loadTeachers();
      });
    }
  }

  // CLASSES CRUD
  openClassModal(cls: any = null): void {
    this.selectedEntity.set(cls);
    if (cls) {
      this.classForm = {
        name: cls.name,
        section: cls.section,
        class_teacher_id: cls.class_teacher_id || 0,
        capacity: cls.capacity || 30
      };
    } else {
      this.classForm = { name: '', section: '', class_teacher_id: this.teachers().length > 0 ? this.teachers()[0].id : 0, capacity: 30 };
    }
    this.activeModal.set('class');
  }

  saveClass(event?: { classId: number | null; formValues: any }): void {
    const classId = event ? event.classId : this.selectedEntity()?.id;
    const form = event ? event.formValues : this.classForm;
    if (classId) {
      this.api.put<any>(`/admin/classes/${classId}`, form).subscribe(() => {
        this.showNotify('Class details updated.');
        this.activeModal.set(null);
        this.loadClassesAndTeachers();
      });
    } else {
      this.api.post<any>('/admin/classes', form).subscribe(() => {
        this.showNotify('Class created successfully.');
        this.activeModal.set(null);
        this.loadClassesAndTeachers();
      });
    }
  }

  deleteClass(id: number): void {
    this.confirmDialog.set({
      title: 'Delete Class',
      message: 'Delete this class? This action cannot be undone.',
      type: 'warning',
      onConfirm: () => {
        this.api.delete<any>(`/admin/classes/${id}`).subscribe(() => {
          this.showNotify('Class deleted.');
          this.loadClassesAndTeachers();
        });
      }
    });
  }

  // SUBJECT CRUD
  openSubjectModal(sub: any = null): void {
    this.selectedEntity.set(sub);
    if (sub) {
      this.subjectForm = {
        name: sub.name,
        code: sub.code,
        class_id: sub.class_id || 0
      };
    } else {
      this.subjectForm = { name: '', code: '', class_id: this.classes().length > 0 ? this.classes()[0].id : 0 };
    }
    this.activeModal.set('subject');
  }

  saveSubject(event?: { subjectId: number | null; formValues: any }): void {
    const subjectId = event ? event.subjectId : this.selectedEntity()?.id;
    const form = event ? event.formValues : this.subjectForm;
    if (subjectId) {
      this.api.put<any>(`/admin/subjects/${subjectId}`, form).subscribe(() => {
        this.showNotify('Subject updated.');
        this.activeModal.set(null);
        this.loadSubjectsAndClasses();
      });
    } else {
      this.api.post<any>('/admin/subjects', form).subscribe(() => {
        this.showNotify('Subject added successfully.');
        this.activeModal.set(null);
        this.loadSubjectsAndClasses();
      });
    }
  }

  deleteSubject(id: number): void {
    this.confirmDialog.set({
      title: 'Delete Subject',
      message: 'Delete this subject?',
      type: 'warning',
      onConfirm: () => {
        this.api.delete<any>(`/admin/subjects/${id}`).subscribe(() => {
          this.showNotify('Subject deleted.');
          this.loadSubjectsAndClasses();
        });
      }
    });
  }

  // STUDENT CRUD
  openStudentModal(student: any = null): void {
    this.selectedEntity.set(student);
    if (student) {
      this.studentForm = {
        name: student.User?.name || '',
        email: student.User?.email || '',
        admission_no: student.admission_no,
        class_id: student.class_id || 0,
        section: student.section || 'A',
        dob: student.dob || '',
        gender: student.gender || 'Male',
        parent_name: student.parent_name || '',
        parent_contact: student.parent_contact || '',
        address: student.address || ''
      };
    } else {
      this.studentForm = {
        name: '', email: '', admission_no: '',
        class_id: this.classes().length > 0 ? this.classes()[0].id : 0,
        section: 'A', dob: '', gender: 'Male', parent_name: '', parent_contact: '', address: ''
      };
    }
    this.activeModal.set('student');
  }

  saveStudent(event?: { studentId: number | null; formValues: any }): void {
    const studentId = event ? event.studentId : this.selectedEntity()?.id;
    const form = event ? event.formValues : this.studentForm;
    this.studentSaving.set(true);

    let reqBody: any;
    if (form.student_photo instanceof File) {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== 'student_photo' && form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });
      formData.append('student_photo', form.student_photo);
      reqBody = formData;
    } else {
      reqBody = { ...form };
      delete reqBody.student_photo;
    }

    if (studentId) {
      this.api.put<any>(`/admin/students/${studentId}`, reqBody).subscribe({
        next: () => {
          this.studentSaving.set(false);
          this.showNotify('Student profile updated.');
          this.activeModal.set(null);
          this.loadStudentsAndClasses();
        },
        error: (err) => {
          this.studentSaving.set(false);
          this.showNotify(err.error?.message || 'Failed to update student profile.', 'error');
        }
      });
    } else {
      this.api.post<any>('/admin/students', reqBody).subscribe({
        next: () => {
          this.studentSaving.set(false);
          this.showNotify('Student registered. Default password: student123');
          this.activeModal.set(null);
          this.loadStudentsAndClasses();
        },
        error: (err) => {
          this.studentSaving.set(false);
          this.showNotify(err.error?.message || 'Failed to register student.', 'error');
        }
      });
    }
  }

  deleteStudent(id: number): void {
    const student = this.students().find(s => s.id === id);
    if (!student) return;
    const isCurrentlyActive = (student.User?.status || '').toLowerCase() === 'active';

    if (isCurrentlyActive) {
      this.api.delete<any>(`/admin/students/${id}`).subscribe(() => {
        this.showNotify('Student profile deactivated.');
        this.activeModal.set(null);
        this.loadStudentsAndClasses();
      });
    } else {
      this.api.put<any>(`/admin/students/${id}`, { status: 'active' }).subscribe(() => {
        this.showNotify('Student profile activated successfully.');
        this.activeModal.set(null);
        this.loadStudentsAndClasses();
      });
    }
  }

  // TIMETABLE ACTIONS
  onTimetableClassSelected(): void {
    const classId = this.selectedClassId();
    if (classId) {
      this.api.get<any[]>(`/timetable/class/${classId}`).subscribe(res => {
        this.timetableEntries.set(res);
      });
      this.loadAllSubjectsForTimetable();
    }
  }

  onTimetableTeacherSelected(): void {
    const teacherId = this.selectedTeacherId();
    if (teacherId) {
      this.api.get<any[]>(`/timetable/teacher/${teacherId}`).subscribe(res => {
        this.timetableEntries.set(res);
      });
      this.loadAllSubjectsForTimetable();
    }
  }

  loadAllSubjectsForTimetable(): void {
    this.api.get<any[]>('/admin/subjects').subscribe(res => {
      this.subjects.set(res);
    });
  }

  refreshTimetable(): void {
    if (this.selectedClassId()) {
      this.onTimetableClassSelected();
    } else if (this.selectedTeacherId()) {
      this.onTimetableTeacherSelected();
    }
  }

  openTimetableModal(): void {
    if (!this.selectedClassId() && !this.selectedTeacherId()) {
      alert('Please select a class or teacher first.');
      return;
    }
    this.timetableForm = {
      class_id: this.selectedClassId() ? Number(this.selectedClassId()) : (this.classes().length > 0 ? this.classes()[0].id : 0),
      day: 'Monday',
      period_no: 1,
      subject_id: this.subjects().length > 0 ? this.subjects()[0].id : 0,
      teacher_id: this.selectedTeacherId() ? Number(this.selectedTeacherId()) : (this.teachers().length > 0 ? this.teachers()[0].id : 0),
      start_time: '08:30 AM',
      end_time: '09:20 AM'
    };
    this.activeModal.set('timetable');
  }

  saveTimetableEntry(formValues?: any): void {
    const form = formValues || this.timetableForm;
    if (Array.isArray(form)) {
      if (form.length === 0) {
        this.showNotify('No timetable slots to save.', 'info');
        this.activeModal.set(null);
        return;
      }
      const teacherId = this.selectedTeacherId();
      if (teacherId) {
        this.api.put<any>(`/timetable/teacher/${teacherId}`, form).subscribe({
          next: () => {
            this.showNotify('Teacher timetable updated successfully.');
            this.activeModal.set(null);
            setTimeout(() => this.refreshTimetable(), 0);
          },
          error: (err) => {
            this.showNotify(err.error?.message || 'Conflict detected in timetable.', 'error');
          }
        });
      } else {
        this.api.post<any>('/timetable', form).subscribe({
          next: () => {
            this.showNotify('All timetable slots saved successfully.');
            this.activeModal.set(null);
            setTimeout(() => this.refreshTimetable(), 0);
          },
          error: (err) => {
            this.showNotify(err.error?.message || 'Conflict detected in one or more slots.', 'error');
          }
        });
      }
    } else {
      this.api.post<any>('/timetable', form).subscribe({
        next: () => {
          this.showNotify('Timetable slot added.');
          this.activeModal.set(null);
          setTimeout(() => this.refreshTimetable(), 0);
        },
        error: (err) => this.showNotify(err.error?.message || 'Conflict detected in slot.', 'error')
      });
    }
  }

  deleteTimetableSlot(id: number): void {
    this.confirmDialog.set({
      title: 'Remove Timetable Slot',
      message: 'Remove this timetable slot?',
      type: 'warning',
      onConfirm: () => {
        this.api.delete<any>(`/timetable/${id}`).subscribe(() => {
          this.showNotify('Slot removed.');
          this.refreshTimetable();
        });
      }
    });
  }

  // EXAMS AND RESULTS
  openExamModal(): void {
    this.examForm = { name: '', academic_year: '2026-2027', start_date: '', end_date: '' };
    this.activeModal.set('exam');
  }

  saveExam(formValues?: any): void {
    const form = formValues || this.examForm;
    this.api.post<any>('/results/exams', form).subscribe(() => {
      this.showNotify('Exam term created.');
      this.activeModal.set(null);
      this.loadExams();
    });
  }

  onClassOrExamSelectedForResults(): void {
    const classId = this.selectedClassId();
    const examId = this.selectedExamId();
    if (classId && examId) {
      // Fetch results for this class and exam
      this.api.get<any[]>(`/results/class-results?class_id=${classId}&exam_id=${examId}`).subscribe(res => {
        this.studentResults.set(res);
      });
    }
  }

  emailReportCard(studentId: number): void {
    const examId = this.selectedExamId();
    if (!examId) return;
    this.api.post<any>(`/results/student/${studentId}/exam/${examId}/email`, {}).subscribe({
      next: (res) => this.showNotify(res.message || 'Report card emailed to parent.'),
      error: (err) => this.showNotify(err.error?.message || 'Failed to email report card.', 'error')
    });
  }

  downloadReportCardUrl(studentId: number): string {
    const examId = this.selectedExamId();
    return `http://localhost:5000/api/results/student/${studentId}/exam/${examId}/download`;
  }

  // FEES OPERATIONS
  openFeeStructureModal(): void {
    this.feeStructureForm = {
      class_id: this.classes().length > 0 ? this.classes()[0].id : 0,
      category: 'Tuition Fee',
      amount: 1200,
      due_date: '2026-09-01',
      academic_year: '2026-2027'
    };
    this.activeModal.set('feeStructure');
  }

  saveFeeStructure(formValues?: any): void {
    const form = formValues || this.feeStructureForm;
    this.api.post<any>('/fees/structures', form).subscribe(() => {
      this.showNotify('Fee billing structure defined.');
      this.activeModal.set(null);
      this.loadFeesAndClasses();
    });
  }

  deleteFeeStructure(id: number): void {
    this.confirmDialog.set({
      title: 'Delete Billing Structure',
      message: 'Delete this billing structure?',
      type: 'warning',
      onConfirm: () => {
        this.api.delete<any>(`/fees/structures/${id}`).subscribe(() => {
          this.showNotify('Structure deleted.');
          this.loadFeesAndClasses();
        });
      }
    });
  }

  downloadReceiptUrl(paymentId: number): string {
    return `http://localhost:5000/api/fees/payments/${paymentId}/receipt`;
  }

  verifyPayment(paymentId: number): void {
    this.verifyingPaymentId.set(paymentId);
    this.api.put<any>(`/fees/payments/${paymentId}/verify`, {}).subscribe({
      next: (res) => {
        this.verifyingPaymentId.set(null);
        this.showNotify(res.message || 'Payment verified successfully.');
        this.loadFeesAndClasses();
      },
      error: (err) => {
        this.verifyingPaymentId.set(null);
        this.showNotify(err.error?.message || 'Verification failed.', 'error');
      }
    });
  }

  // PUBLIC SITE EVENTS CRUD
  openEventModal(evt: any = null): void {
    this.selectedEntity.set(evt);
    if (evt) {
      this.eventForm = { title: evt.title, description: evt.description, event_date: evt.event_date, category: evt.category || 'Academics' };
    } else {
      this.eventForm = { title: '', description: '', event_date: '2026-06-30', category: 'Academics' };
    }
    this.activeModal.set('event');
  }

  saveEvent(event?: { eventId: number | null; formValues: any }): void {
    const eventId = event ? event.eventId : this.selectedEntity()?.id;
    const form = event ? event.formValues : this.eventForm;
    
    this.eventUploadProgress.set(0);
    let currentPercent = 0;
    const progressInterval = setInterval(() => {
      if (currentPercent < 90) {
        currentPercent += Math.floor(Math.random() * 15) + 5;
        if (currentPercent > 90) currentPercent = 90;
        this.eventUploadProgress.set(currentPercent);
      }
    }, 80);

    const obs$ = eventId
      ? this.api.putWithProgress(`/admin/events/${eventId}`, form)
      : this.api.postWithProgress('/admin/events', form);

    obs$.subscribe({
      next: (evt) => {
        if (evt.type === HttpEventType.UploadProgress) {
          if (evt.total) {
            const percent = Math.round((100 * evt.loaded) / evt.total);
            if (percent > currentPercent) {
              currentPercent = percent;
              this.eventUploadProgress.set(currentPercent);
            }
          }
        } else if (evt.type === HttpEventType.Response) {
          clearInterval(progressInterval);
          this.eventUploadProgress.set(100);

          setTimeout(() => {
            this.eventUploadProgress.set(null);
            this.showNotify(eventId ? 'Event updated.' : 'Event announcement posted.');
            this.activeModal.set(null);
            this.loadEvents();
          }, 300);
        }
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.eventUploadProgress.set(null);
        this.showNotify(err.error?.message || 'Failed to save event.', 'error');
      }
    });
  }

  deleteEvent(id: number): void {
    this.confirmDialog.set({
      title: 'Delete Event Listing',
      message: 'Delete event listing?',
      type: 'warning',
      onConfirm: () => {
        this.api.delete<any>(`/admin/events/${id}`).subscribe(() => {
          this.showNotify('Event deleted.');
          this.loadEvents();
        });
      }
    });
  }

  // GALLERY MANAGEMENT
  openAlbumModal(): void {
    this.albumForm = { title: '', description: '' };
    this.activeModal.set('album');
  }

  saveAlbum(): void {
    this.api.post<any>('/admin/gallery/albums', this.albumForm).subscribe(() => {
      this.showNotify('Album created.');
      this.activeModal.set(null);
      this.loadGallery();
    });
  }

  // SETTINGS & SYSTEM CONFIG
  saveSettings(formValues?: any): void {
    const form = formValues || this.settingsForm;
    this.api.put<any>('/admin/settings', form).subscribe(() => {
      this.showNotify('School system preferences updated.');
    });
  }

  // PROFILE PASSWORD CHANGE
  changePassword(formValues?: any): void {
    const form = formValues || this.passwordForm;
    this.passwordMsg.set(null);
    this.auth.changePassword(form).subscribe({
      next: (res) => {
        this.showNotify('Password updated.');
        this.passwordForm = { currentPassword: '', newPassword: '' };
      },
      error: (err) => this.showNotify(err.error?.message || 'Failed to update password.', 'error')
    });
  }
}
