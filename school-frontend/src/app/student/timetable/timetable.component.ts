import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-timetable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.scss'
})
export class TimetableComponent {
  @Input() timetable: any[] = [];

  readonly daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  get uniqueDays(): string[] {
    return this.daysOfWeek.filter(day => this.timetable.some(entry => entry.day === day));
  }

  getSlotsForDay(day: string): any[] {
    return this.timetable
      .filter(entry => entry.day === day)
      .sort((a, b) => Number(a.period_no) - Number(b.period_no));
  }
}
