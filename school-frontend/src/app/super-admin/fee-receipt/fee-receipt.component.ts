import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../core/services/token.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-admin-fee-receipt',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './fee-receipt.component.html',
  styleUrl: './fee-receipt.component.scss'
})
export class FeeReceiptComponent {
  private readonly tokenService = inject(TokenService);
  @Input() feeStructures: any[] = [];
  @Input() payments: any[] = [];
  @Input() classes: any[] = [];
  @Input() activeModal: string | null = null;
  @Input() verifyingPaymentId: number | null = null;

  @Output() saveStructure = new EventEmitter<any>();
  @Output() deleteStructure = new EventEmitter<number>();
  @Output() setModal = new EventEmitter<string | null>();
  @Output() verifyPayment = new EventEmitter<number>();

  private _selectedClassFilter: number = 0;
  get selectedClassFilter(): number { return this._selectedClassFilter; }
  set selectedClassFilter(val: number) {
    this._selectedClassFilter = val;
    this.currentPage = 1;
  }

  private _selectedStatusFilter: string = 'all';
  get selectedStatusFilter(): string { return this._selectedStatusFilter; }
  set selectedStatusFilter(val: string) {
    this._selectedStatusFilter = val;
    this.currentPage = 1;
  }

  private _searchQuery: string = '';
  get searchQuery(): string { return this._searchQuery; }
  set searchQuery(val: string) {
    this._searchQuery = val;
    this.currentPage = 1;
  }

  selectedScreenshotUrl: string | null = null;
  currentPage: number = 1;
  pageSize: number = 10;

  get filteredPayments(): any[] {
    let list = this.payments || [];

    // Class Filter
    const classId = Number(this.selectedClassFilter);
    if (classId) {
      list = list.filter(p => p.Student?.class_id === classId);
    }

    // Status Filter
    if (this.selectedStatusFilter === 'verified') {
      list = list.filter(p => p.verified);
    } else if (this.selectedStatusFilter === 'pending') {
      list = list.filter(p => !p.verified);
    }

    // Search Query Filter
    const query = this.searchQuery?.trim().toLowerCase();
    if (query) {
      list = list.filter(p => {
        const studentName = p.Student?.User?.name?.toLowerCase() || '';
        const receiptNo = p.receipt_no?.toLowerCase() || '';
        return studentName.includes(query) || receiptNo.includes(query);
      });
    }

    return list;
  }

  get paginatedPayments(): any[] {
    const list = this.filteredPayments;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return list.slice(startIndex, startIndex + this.pageSize);
  }

  openScreenshotModal(url: string, event: Event): void {
    event.stopPropagation();
    this.selectedScreenshotUrl = url;
  }

  closeScreenshotModal(): void {
    this.selectedScreenshotUrl = null;
  }

  feeStructureForm = {
    class_id: 0,
    category: 'Tuition Fee',
    amount: 1200,
    due_date: '2026-09-01',
    academic_year: '2026-2027'
  };

  openFeeStructureModal(): void {
    this.feeStructureForm = {
      class_id: this.classes.length > 0 ? this.classes[0].id : 0,
      category: 'Tuition Fee',
      amount: 1200,
      due_date: '2026-09-01',
      academic_year: '2026-2027'
    };
    this.setModal.emit('feeStructure');
  }

  submitFeeStructure(): void {
    this.saveStructure.emit({
      class_id: Number(this.feeStructureForm.class_id),
      category: this.feeStructureForm.category,
      amount: Number(this.feeStructureForm.amount),
      due_date: this.feeStructureForm.due_date,
      academic_year: this.feeStructureForm.academic_year
    });
  }

  downloadReceiptUrl(paymentId: number): string {
    const token = this.tokenService.getToken() || '';
    return `http://localhost:5000/api/fees/payments/${paymentId}/receipt?token=${token}`;
  }
}
