import { Component, Input, Output, EventEmitter, signal, computed, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-admin-manage-students',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './manage-students.component.html',
  styleUrl: './manage-students.component.scss'
})
export class ManageStudentsComponent implements OnChanges {
  readonly baseUrl = 'http://localhost:5000';
  selectedPhotoFile: File | null = null;

  @Input() students: any[] = [];
  @Input() classes: any[] = [];
  @Input() activeModal: string | null = null;
  @Input() isSaving = false;

  @Output() save = new EventEmitter<{ studentId: number | null; formValues: any }>();
  @Output() delete = new EventEmitter<number>();
  @Output() setModal = new EventEmitter<string | null>();

  currentPage = signal<number>(1);
  pageSize = signal<number>(5);

  studentsSignal = signal<any[]>([]);
  searchTextSignal = signal<string>('');
  filterStatusSignal = signal<string>('');

  get searchText(): string { return this.searchTextSignal(); }
  set searchText(val: string) {
    this.searchTextSignal.set(val);
    this.currentPage.set(1);
  }

  get filterStatus(): string { return this.filterStatusSignal(); }
  set filterStatus(val: string) {
    this.filterStatusSignal.set(val);
    this.currentPage.set(1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['students']) {
      this.studentsSignal.set(this.students || []);
    }
  }

  get activeCount(): number {
    return this.studentsSignal().filter(s => (s.User?.status || '').toLowerCase() === 'active').length;
  }

  get inactiveCount(): number {
    return this.studentsSignal().filter(s => (s.User?.status || '').toLowerCase() === 'inactive').length;
  }

  filteredStudents = computed(() => {
    const students = this.studentsSignal();
    const q = this.searchTextSignal().toLowerCase().trim();
    const st = this.filterStatusSignal();

    return students.filter(s => {
      const matchesSearch =
        !q ||
        s.admission_no?.toLowerCase().includes(q) ||
        s.User?.name?.toLowerCase().includes(q) ||
        s.User?.email?.toLowerCase().includes(q) ||
        s.parent_name?.toLowerCase().includes(q) ||
        (s.Class ? `${s.Class.name}-${s.section}` : '').toLowerCase().includes(q);

      const matchesStatus =
        !st || (s.User?.status || '').toLowerCase() === st;

      return matchesSearch && matchesStatus;
    });
  });

  paginatedStudents = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredStudents().slice(start, start + this.pageSize());
  });

  get hasActiveFilter(): boolean {
    return !!this.searchTextSignal() || !!this.filterStatusSignal();
  }

  clearFilters(): void {
    this.searchTextSignal.set('');
    this.filterStatusSignal.set('');
    this.currentPage.set(1);
  }

  selectedStudent = signal<any | null>(null);
  pendingToggleStudent = signal<any | null>(null);

  studentForm = {
    name: '',
    email: '',
    admission_no: '',
    class_id: 0,
    section: 'A',
    dob: '',
    gender: 'Male',
    parent_name: '',
    parent_contact: '',
    address: '',
    transport_mode: 'Walking'
  };

  generateAdmissionNumber(): string {
    const currentYear = new Date().getFullYear();
    const prefix = `ADM${currentYear}`;

    // Filter out existing matching admission numbers
    const matchNums = this.studentsSignal()
      .map(s => s.admission_no || '')
      .filter(val => val.toUpperCase().startsWith(prefix))
      .map(val => {
        const suffix = val.substring(prefix.length);
        const parsed = parseInt(suffix, 10);
        return isNaN(parsed) ? 0 : parsed;
      });

    const nextSeq = matchNums.length > 0 ? Math.max(...matchNums) + 1 : 1;
    return `${prefix}${String(nextSeq).padStart(3, '0')}`;
  }

  onPhotoSelected(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedPhotoFile = fileList[0];
    }
  }

  openStudentModal(student: any = null): void {
    this.selectedStudent.set(student);
    this.selectedPhotoFile = null;
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
        address: student.address || '',
        transport_mode: student.transport_mode || 'Walking'
      };
    } else {
      this.studentForm = {
        name: '', email: '', admission_no: this.generateAdmissionNumber(),
        class_id: this.classes.length > 0 ? this.classes[0].id : 0,
        section: 'A', dob: '', gender: 'Male', parent_name: '', parent_contact: '', address: '',
        transport_mode: 'Walking'
      };
    }
    this.setModal.emit('student');
  }

  viewStudentDetail(student: any): void {
    this.selectedStudent.set(student);
    this.setModal.emit('view-student');
  }

  triggerConfirmToggle(student: any): void {
    this.pendingToggleStudent.set(student);
    this.setModal.emit('confirm-toggle');
  }

  confirmToggleAction(): void {
    const student = this.pendingToggleStudent();
    if (student) {
      this.delete.emit(student.id);
    }
  }

  submitStudent(): void {
    const student = this.selectedStudent();
    this.save.emit({
      studentId: student ? student.id : null,
      formValues: {
        ...this.studentForm,
        student_photo: this.selectedPhotoFile
      }
    });
  }
}
