import { Component, Input, Output, EventEmitter, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SocketService } from '../../core/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly auth = inject(AuthService);
  private readonly socket = inject(SocketService);

  @Input() isPublic: boolean = false;
  @Input() title: string = '';
  @Input() activeTab: string = 'home';
  @Input() user: any = null;

  @Output() tabChanged = new EventEmitter<string>();
  @Output() logoutClicked = new EventEmitter<void>();
  @Output() navigatePortal = new EventEmitter<void>();

  notifications: any[] = [];
  showDropdown = false;
  private socketSub: Subscription | null = null;

  ngOnInit(): void {
    if (this.user) {
      this.loadNotifications();
      this.subscribeToNotifications();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeNotifications();
  }

  private loadNotifications(): void {
    try {
      const saved = localStorage.getItem(`aether_notifications_${this.user.id}`);
      if (saved) {
        this.notifications = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load notifications from localStorage:', e);
    }
  }

  private saveNotifications(): void {
    try {
      localStorage.setItem(`aether_notifications_${this.user.id}`, JSON.stringify(this.notifications));
    } catch (e) {
      console.warn('Failed to save notifications to localStorage:', e);
    }
  }

  private subscribeToNotifications(): void {
    this.unsubscribeNotifications();
    
    if (this.user.role === 'super_admin') {
      this.socketSub = new Subscription();

      const enquirySub = this.socket.on('new-admission-enquiry').subscribe({
        next: (enquiry: any) => {
          this.addNotification({
            id: `enquiry_${enquiry.id}_${Date.now()}`,
            title: 'New Admission Enquiry',
            description: `${enquiry.student_name} has applied for class ${enquiry.class_applied}.`,
            student_photo: enquiry.student_photo || null,
            time: new Date(),
            read: false
          });
        }
      });
      this.socketSub.add(enquirySub);

      const feeSub = this.socket.on('new-fee-payment').subscribe({
        next: (payment: any) => {
          this.addNotification({
            id: `fee_${payment.id}_${Date.now()}`,
            title: 'New Fee Payment Submitted',
            description: `${payment.student_name} submitted a payment of $${payment.amount_paid} for ${payment.category}.`,
            time: new Date(),
            read: false
          });
        }
      });
      this.socketSub.add(feeSub);
    }
  }

  private unsubscribeNotifications(): void {
    if (this.socketSub) {
      this.socketSub.unsubscribe();
      this.socketSub = null;
    }
  }

  private addNotification(notif: any): void {
    const exists = this.notifications.some(n => n.title === notif.title && n.description === notif.description && (Date.now() - new Date(n.time).getTime() < 5000));
    if (!exists) {
      this.notifications.unshift(notif);
      if (this.notifications.length > 50) {
        this.notifications = this.notifications.slice(0, 50);
      }
      this.saveNotifications();
    }
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  toggleNotifications(event: MouseEvent): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  markAsRead(notif: any): void {
    notif.read = true;
    this.saveNotifications();
  }

  clearAll(): void {
    this.notifications = [];
    this.saveNotifications();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showDropdown = false;
  }

  setTab(tab: string): void {
    this.tabChanged.emit(tab);
  }

  onLogout(): void {
    this.logoutClicked.emit();
  }

  onNavigatePortal(): void {
    this.navigatePortal.emit();
  }
}
