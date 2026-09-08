import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  @Input() events: any[] = [];
  selectedEvent = signal<any | null>(null);

  viewDetails(event: any): void {
    this.selectedEvent.set(event);
  }

  closeDetails(): void {
    this.selectedEvent.set(null);
  }
}
