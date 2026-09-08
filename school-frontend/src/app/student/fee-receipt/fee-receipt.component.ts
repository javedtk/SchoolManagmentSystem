import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-student-fee-receipt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fee-receipt.component.html',
  styleUrl: './fee-receipt.component.scss'
})
export class FeeReceiptComponent {
  private readonly api = inject(ApiService);
  private readonly tokenService = inject(TokenService);

  @Input() feeStatus: any[] = [];

  get hasPayments(): boolean {
    return this.feeStatus && this.feeStatus.some(item => item.payments && item.payments.length > 0);
  }

  @Output() reload = new EventEmitter<void>();

  activeModal = signal<string | null>(null);
  selectedFeeStructureId = signal<number | null>(null);
  payAmount = signal<number>(0);
  payLoading = signal<boolean>(false);

  paymentMode: string = 'QR Code';
  amountPaid: number = 0;
  selectedFile: File | null = null;

  openPayModal(item: any): void {
    this.selectedFeeStructureId.set(item.feeStructure.id);
    this.payAmount.set(item.feeStructure.amount);
    this.amountPaid = item.balance;
    this.paymentMode = 'QR Code';
    this.selectedFile = null;
    this.activeModal.set('pay-fee');
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  processPayment(): void {
    if (this.amountPaid <= 0) {
      alert('Please enter a valid paid amount.');
      return;
    }
    if (!this.selectedFile) {
      alert('Please attach a payment receipt screenshot.');
      return;
    }

    this.payLoading.set(true);
    const formData = new FormData();
    formData.append('fee_structure_id', String(this.selectedFeeStructureId()));
    formData.append('amount_paid', String(this.amountPaid));
    formData.append('payment_mode', this.paymentMode);
    formData.append('screenshot', this.selectedFile);

    this.api.post<any>('/fees/pay', formData).subscribe({
      next: () => {
        this.payLoading.set(false);
        this.activeModal.set(null);
        this.selectedFile = null;
        this.reload.emit();
      },
      error: (err) => {
        this.payLoading.set(false);
        alert(err.error?.message || 'Payment submission failed. Please try again.');
      }
    });
  }

  downloadReceiptUrl(paymentId: number): string {
    const token = this.tokenService.getToken() || '';
    return `http://localhost:5000/api/fees/payments/${paymentId}/receipt?token=${token}`;
  }
}
