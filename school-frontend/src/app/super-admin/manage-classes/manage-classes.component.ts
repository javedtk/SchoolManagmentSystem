import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-manage-classes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-classes.component.html',
  styleUrl: './manage-classes.component.scss'
})
export class ManageClassesComponent {
  @Input() classes: any[] = [];
  @Input() teachers: any[] = [];
  @Input() activeModal: string | null = null;

  @Output() save = new EventEmitter<{ classId: number | null; formValues: any }>();
  @Output() delete = new EventEmitter<number>();
  @Output() setModal = new EventEmitter<string | null>();

  selectedClass = signal<any | null>(null);

  classForm = {
    name: '',
    section: '',
    class_teacher_id: 0,
    capacity: 30
  };

  // ── Filter state ────────────────────────────────────────
  searchText = '';

  // ── Derived filtered list ───────────────────────────────
  get filteredClasses(): any[] {
    const q = this.searchText.toLowerCase().trim();
    return this.classes.filter(c => {
      const matchSearch =
        !q ||
        c.name?.toLowerCase().includes(q) ||
        c.section?.toLowerCase().includes(q) ||
        c.ClassTeacher?.User?.name?.toLowerCase().includes(q);
      return matchSearch;
    });
  }

  clearFilters(): void {
    this.searchText = '';
  }

  get hasActiveFilter(): boolean {
    return !!this.searchText;
  }

  openClassModal(cls: any = null): void {
    this.selectedClass.set(cls);
    if (cls) {
      this.classForm = {
        name: cls.name,
        section: cls.section,
        class_teacher_id: cls.class_teacher_id || 0,
        capacity: cls.capacity || 30
      };
    } else {
      this.classForm = { name: '', section: '', class_teacher_id: this.teachers.length > 0 ? this.teachers[0].id : 0, capacity: 30 };
    }
    this.setModal.emit('class');
  }

  submitClass(): void {
    const cls = this.selectedClass();
    this.save.emit({
      classId: cls ? cls.id : null,
      formValues: this.classForm
    });
  }
}
