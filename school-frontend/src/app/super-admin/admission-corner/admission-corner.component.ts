import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-admission-corner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admission-corner.component.html',
  styleUrl: './admission-corner.component.scss'
})
export class AdmissionCornerComponent {
  readonly baseUrl = 'http://localhost:5000';

  @Input() enquiries: any[] = [];
  @Input() classes: any[]   = [];
  @Input() activeModal: string | null = null;
  @Input() isSaving = false;

  @Output() approve  = new EventEmitter<{ id: number; status: string }>();
  @Output() admit    = new EventEmitter<{ enquiryId: number; classId: number; section: string }>();
  @Output() setModal = new EventEmitter<string | null>();

  selectedEnquiry = signal<any | null>(null);

  // ── Filter state ────────────────────────────────────────
  searchText    = '';
  filterStatus  = '';   // '', 'pending', 'approved', 'rejected'
  filterClass   = '';

  studentForm = { class_id: 0, section: 'A' };

  // ── Derived filtered list ───────────────────────────────
  get filteredEnquiries(): any[] {
    const q  = this.searchText.toLowerCase().trim();
    return this.enquiries.filter(e => {
      if (e.status === 'approved') return false;
      const matchSearch =
        !q ||
        e.student_name?.toLowerCase().includes(q) ||
        e.parent_name?.toLowerCase().includes(q)  ||
        e.email?.toLowerCase().includes(q)        ||
        e.contact?.includes(q);
      const matchStatus = !this.filterStatus || e.status === this.filterStatus;
      const matchClass  = !this.filterClass  || e.class_applied === this.filterClass;
      return matchSearch && matchStatus && matchClass;
    });
  }

  get uniqueClasses(): string[] {
    return [...new Set(this.enquiries.filter(e => e.status !== 'approved').map(e => e.class_applied).filter(Boolean))];
  }

  get pendingCount():  number { return this.enquiries.filter(e => e.status === 'pending').length; }
  get rejectedCount(): number { return this.enquiries.filter(e => e.status === 'rejected').length; }

  clearFilters(): void {
    this.searchText   = '';
    this.filterStatus = '';
    this.filterClass  = '';
  }

  get hasActiveFilter(): boolean {
    return !!(this.searchText || this.filterStatus || this.filterClass);
  }

  openAdmitModal(enquiry: any): void {
    this.selectedEnquiry.set(enquiry);
    if (this.classes.length > 0) {
      this.studentForm.class_id = this.classes[0].id;
    }
    this.studentForm.section = 'A';
    this.setModal.emit('admit-student');
  }

  submitAdmit(): void {
    const enquiry = this.selectedEnquiry();
    if (enquiry) {
      this.admit.emit({
        enquiryId: enquiry.id,
        classId:   Number(this.studentForm.class_id),
        section:   this.studentForm.section
      });
    }
  }
}
