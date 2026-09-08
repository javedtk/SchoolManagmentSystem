import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-alert.component.html',
  styleUrl: './custom-alert.component.scss'
})
export class CustomAlertComponent {
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() title: string | null = null;
  @Input() message: string = '';
  @Input() isModal: boolean = false;
  @Input() showCancel: boolean = false;
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  get icon(): string {
    switch (this.type) {
      case 'success': return 'check_circle';
      case 'error': return 'cancel';
      case 'warning': return 'warning';
      case 'info':
      default: return 'info';
    }
  }

  onCancel(): void {
    this.close.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
