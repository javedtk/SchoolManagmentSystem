import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  @Input() stats: any = { assignedClasses: 0, assignedSubjects: 0, totalStudents: 0, pendingGrading: 0 };
  @Input() todayTimetable: any[] = [];
  @Output() viewWeekly = new EventEmitter<void>();
}
