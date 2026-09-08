import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-manage-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-teachers.component.html',
  styleUrl: './manage-teachers.component.scss'
})
export class ManageTeachersComponent {
  @Input() teachers: any[] = [];
  @Input() activeModal: string | null = null;

  @Output() save = new EventEmitter<{ teacherId: number | null; formValues: any }>();
  @Output() delete = new EventEmitter<number>();
  @Output() setModal = new EventEmitter<string | null>();

  selectedTeacher = signal<any | null>(null);
  pendingToggleTeacher = signal<any | null>(null);

  teacherForm = {
    name: '',
    email: '',
    employee_id: '',
    designation: '',
    qualification: '',
    joining_date: '',
    bio: ''
  };

  // ── Filter state ────────────────────────────────────────
  searchText    = '';
  filterStatus  = '';   // '', 'active', 'inactive'

  // ── Derived filtered list ───────────────────────────────
  get filteredTeachers(): any[] {
    const q = this.searchText.toLowerCase().trim();
    return this.teachers.filter(t => {
      const matchSearch =
        !q ||
        t.User?.name?.toLowerCase().includes(q) ||
        t.User?.email?.toLowerCase().includes(q) ||
        t.employee_id?.toLowerCase().includes(q) ||
        t.designation?.toLowerCase().includes(q) ||
        t.qualification?.toLowerCase().includes(q);
        
      const status = (t.User?.status || '').toLowerCase();
      const matchStatus =
        !this.filterStatus ||
        (this.filterStatus === 'active' && status === 'active') ||
        (this.filterStatus === 'inactive' && status !== 'active');
        
      return matchSearch && matchStatus;
    });
  }

  get activeCount(): number {
    return this.teachers.filter(t => (t.User?.status || '').toLowerCase() === 'active').length;
  }

  get inactiveCount(): number {
    return this.teachers.filter(t => (t.User?.status || '').toLowerCase() !== 'active').length;
  }

  clearFilters(): void {
    this.searchText   = '';
    this.filterStatus = '';
  }

  get hasActiveFilter(): boolean {
    return !!(this.searchText || this.filterStatus);
  }

  openTeacherModal(teacher: any = null): void {
    this.selectedTeacher.set(teacher);
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
    this.setModal.emit('teacher');
  }

  viewTeacherDetail(teacher: any): void {
    this.selectedTeacher.set(teacher);
    this.setModal.emit('view-teacher');
  }

  triggerConfirmToggle(teacher: any): void {
    this.pendingToggleTeacher.set(teacher);
    this.setModal.emit('confirm-toggle-teacher');
  }

  confirmToggleAction(): void {
    const t = this.pendingToggleTeacher();
    if (t) {
      this.delete.emit(t.id);
    }
  }

  submitTeacher(): void {
    const t = this.selectedTeacher();
    this.save.emit({
      teacherId: t ? t.id : null,
      formValues: this.teacherForm
    });
  }
}
