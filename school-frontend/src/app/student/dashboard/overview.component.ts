import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentChartsComponent } from './student-charts.component';

@Component({
  selector: 'app-student-overview',
  standalone: true,
  imports: [CommonModule, StudentChartsComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  @Input() stats: any = { attendancePercentage: 100, pendingFees: 0, className: 'Unassigned', pendingAssignments: 0 };
  @Input() charts: any = { attendance: [], assignments: [], fees: [], performance: [] };
  @Input() upcomingEvents: any[] = [];
  @Input() latestResults: any[] = [];
}
