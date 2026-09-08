import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-timetable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.scss'
})
export class TimetableComponent {
  @Input() timetable: any[] = [];

  readonly daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  get uniqueDays(): string[] {
    // Only return days that have scheduled slots, ordered by typical week flow
    return this.daysOfWeek.filter(day => this.timetable.some(entry => entry.day === day));
  }

  getSlotsForDay(day: string): any[] {
    // Filter by day and sort chronologically by period number
    return this.timetable
      .filter(entry => entry.day === day)
      .sort((a, b) => Number(a.period_no) - Number(b.period_no));
  }

  expandedDays: { [key: string]: boolean } = {};

  toggleDay(day: string): void {
    this.expandedDays[day] = !this.isDayExpanded(day);
  }

  isDayExpanded(day: string): boolean {
    if (this.expandedDays[day] === undefined) {
      this.expandedDays[day] = true;
    }
    return this.expandedDays[day];
  }
}
