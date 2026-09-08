import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardChartsComponent } from './dashboard-charts.component';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, DashboardChartsComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  @Input() stats: any = { students: 0, teachers: 0, classes: 0, feesCollected: 0, feesPending: 0, pendingAdmissions: 0, jobApplications: 0 };
  @Input() charts: any = { genderRatio: [], enrollmentTrend: [], attendanceRate: 100 };
}
