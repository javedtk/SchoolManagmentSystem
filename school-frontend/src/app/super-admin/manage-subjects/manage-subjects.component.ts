import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-manage-subjects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-subjects.component.html',
  styleUrl: './manage-subjects.component.scss'
})
export class ManageSubjectsComponent {
  @Input() subjects: any[] = [];
  @Input() classes: any[] = [];
  @Input() activeModal: string | null = null;

  @Output() save = new EventEmitter<{ subjectId: number | null; formValues: any }>();
  @Output() delete = new EventEmitter<number>();
  @Output() setModal = new EventEmitter<string | null>();

  selectedSubject = signal<any | null>(null);

  subjectForm = {
    name: '',
    code: '',
    class_id: 0
  };

  // ── Filter state ────────────────────────────────────────
  searchText = '';

  // ── Derived filtered list ───────────────────────────────
  get filteredSubjects(): any[] {
    const q = this.searchText.toLowerCase().trim();
    return this.subjects.filter(s => {
      const className = s.Class ? `${s.Class.name}-${s.Class.section}` : 'unassigned';
      const matchSearch =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.code?.toLowerCase().includes(q) ||
        className.toLowerCase().includes(q);
      return matchSearch;
    });
  }

  clearFilters(): void {
    this.searchText = '';
  }

  get hasActiveFilter(): boolean {
    return !!this.searchText;
  }

  openSubjectModal(sub: any = null): void {
    this.selectedSubject.set(sub);
    if (sub) {
      this.subjectForm = {
        name: sub.name,
        code: sub.code,
        class_id: sub.class_id || 0
      };
    } else {
      this.subjectForm = { name: '', code: '', class_id: this.classes.length > 0 ? this.classes[0].id : 0 };
    }
    this.setModal.emit('subject');
  }

  submitSubject(): void {
    const sub = this.selectedSubject();
    this.save.emit({
      subjectId: sub ? sub.id : null,
      formValues: this.subjectForm
    });
  }
}
