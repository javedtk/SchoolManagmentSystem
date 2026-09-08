import {
  Component, Input, OnChanges, AfterViewInit,
  SimpleChanges, ViewChild, ElementRef, OnDestroy,
  PLATFORM_ID, inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Chart, ChartConfiguration, ChartType,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-charts.component.html',
  styleUrl:  './dashboard-charts.component.scss'
})
export class DashboardChartsComponent implements AfterViewInit, OnChanges, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  @Input() stats: any  = {};
  @Input() charts: any = { genderRatio: [], attendanceRate: 100, enrollmentTrend: [] };

  // Canvas refs
  @ViewChild('genderPie')       genderPieRef!:       ElementRef<HTMLCanvasElement>;
  @ViewChild('attendanceDough') attendanceDoughRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('feeBar')          feeBarRef!:          ElementRef<HTMLCanvasElement>;
  @ViewChild('studentLine')     studentLineRef!:     ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryPolar')   categoryPolarRef!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('examRadar')       examRadarRef!:       ElementRef<HTMLCanvasElement>;
  @ViewChild('jobFunnel')       jobFunnelRef!:       ElementRef<HTMLCanvasElement>;
  @ViewChild('enrollmentBar')   enrollmentBarRef!:   ElementRef<HTMLCanvasElement>;

  private chartInstances: Chart[] = [];
  private initialized = false;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initialized = true;
      this.buildAllCharts();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (isPlatformBrowser(this.platformId) && this.initialized) {
      this.destroyAll();
      this.buildAllCharts();
    }
  }

  ngOnDestroy(): void {
    this.destroyAll();
  }

  private destroyAll(): void {
    this.chartInstances.forEach(c => c.destroy());
    this.chartInstances = [];
  }

  private make<T extends ChartType>(
    ref: ElementRef<HTMLCanvasElement>,
    cfg: ChartConfiguration<T>
  ): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const chart = new Chart(ref.nativeElement, cfg as any);
    this.chartInstances.push(chart);
  }

  private buildAllCharts(): void {
    const s  = this.stats  || {};
    const ch = this.charts || {};

    /* ── 1. Gender Distribution — Doughnut ── */
    const genderData   = (ch.genderRatio ?? []) as { name: string; value: number }[];
    const genderLabels = genderData.length ? genderData.map(g => g.name) : ['Male', 'Female', 'Other'];
    const genderVals   = genderData.length ? genderData.map(g => g.value) : [0, 0, 0];
    this.make(this.genderPieRef, {
      type: 'doughnut',
      data: {
        labels: genderLabels,
        datasets: [{ data: genderVals,
          backgroundColor: ['#16a34a', '#0e7490', '#7c3aed'],
          borderWidth: 0, hoverOffset: 8 }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '72%',
        plugins: { legend: { position: 'bottom', labels: { color: '#475569', font: { size: 12 } } } } }
    });

    /* ── 2. Attendance Rate — Doughnut ── */
    const att = ch.attendanceRate ?? 100;
    this.make(this.attendanceDoughRef, {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent'],
        datasets: [{ data: [att, 100 - att],
          backgroundColor: ['#22c55e', '#e2e8f0'],
          borderWidth: 0, hoverOffset: 6 }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '78%',
        plugins: { legend: { display: false } } }
    });

    /* ── 3. Fee Collection vs Pending — Horizontal Bar ── */
    this.make(this.feeBarRef, {
      type: 'bar',
      data: {
        labels: ['Fees Collected', 'Fees Outstanding'],
        datasets: [{
          label: 'Amount ($)',
          data: [s.feesCollected ?? 0, s.feesPending ?? 0],
          backgroundColor: ['rgba(22,163,74,0.85)', 'rgba(245,158,11,0.85)'],
          borderRadius: 8, borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { color: '#f1f5f9' }, ticks: { color: '#475569' } },
                  y: { grid: { display: false }, ticks: { color: '#475569' } } }
      }
    });

    /* ── 4. Student Enrollment Trend — Line ── */
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendData = ch.enrollmentTrend?.length
      ? ch.enrollmentTrend
      : months.map((_, i) => Math.max(1, Math.round((s.students ?? 1) * (0.6 + 0.04 * i))));
    this.make(this.studentLineRef, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Students',
          data: trendData,
          borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.08)',
          pointBackgroundColor: '#16a34a', pointRadius: 4,
          tension: 0.4, fill: true
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: '#f1f5f9' }, ticks: { color: '#475569' } },
          y: { grid: { color: '#f1f5f9' }, ticks: { color: '#475569' }, beginAtZero: true }
        }
      }
    });

    /* ── 5. Resource Distribution — Polar Area ── */
    this.make(this.categoryPolarRef, {
      type: 'polarArea',
      data: {
        labels: ['Teachers', 'Classes', 'Subjects', 'Events', 'Albums'],
        datasets: [{
          data: [s.teachers ?? 0, s.classes ?? 0, s.subjects ?? 0, s.events ?? 0, s.albums ?? 0],
          backgroundColor: [
            'rgba(22,163,74,0.7)', 'rgba(14,116,144,0.7)',
            'rgba(124,58,237,0.7)', 'rgba(180,83,9,0.7)',
            'rgba(225,29,72,0.7)'
          ]
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#475569', font: { size: 11 } } } },
        scales: { r: { grid: { color: '#e2e8f0' }, ticks: { backdropColor: 'transparent', color: '#94a3b8' } } }
      }
    });

    /* ── 6. Academic Performance Radar ── */
    this.make(this.examRadarRef, {
      type: 'radar',
      data: {
        labels: ['Attendance', 'Pass Rate', 'Assignments', 'Participation', 'Exams', 'Projects'],
        datasets: [{
          label: 'Current Year',
          data: [att, 85, 78, 90, 82, 75],
          borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.15)',
          pointBackgroundColor: '#16a34a', pointRadius: 4, borderWidth: 2
        }, {
          label: 'Last Year',
          data: [78, 80, 72, 85, 76, 70],
          borderColor: '#0e7490', backgroundColor: 'rgba(14,116,144,0.1)',
          pointBackgroundColor: '#0e7490', pointRadius: 4, borderWidth: 2
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#475569', font: { size: 11 } } } },
        scales: { r: { min: 0, max: 100,
          grid: { color: '#e2e8f0' },
          ticks: { backdropColor: 'transparent', color: '#94a3b8', stepSize: 20 },
          pointLabels: { color: '#475569', font: { size: 11 } }
        } }
      }
    });

    /* ── 7. Job Pipeline — Vertical Bar ── */
    this.make(this.jobFunnelRef, {
      type: 'bar',
      data: {
        labels: ['Open', 'Applications', 'Shortlisted', 'Interviewed', 'Hired'],
        datasets: [{
          label: 'Candidates',
          data: [
            s.openJobs ?? 0, s.jobApplications ?? 0,
            Math.round((s.jobApplications ?? 0) * 0.4),
            Math.round((s.jobApplications ?? 0) * 0.2),
            Math.round((s.jobApplications ?? 0) * 0.1)
          ],
          backgroundColor: [
            'rgba(124,58,237,0.8)', 'rgba(67,56,202,0.8)',
            'rgba(14,116,144,0.8)', 'rgba(22,163,74,0.8)',
            'rgba(5,46,22,0.9)'
          ],
          borderRadius: 8, borderSkipped: false
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#475569' } },
          y: { grid: { color: '#f1f5f9' }, ticks: { color: '#475569' }, beginAtZero: true }
        }
      }
    });

    /* ── 8. Admission Enquiries vs Converted — Grouped Bar ── */
    this.make(this.enrollmentBarRef, {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          {
            label: 'Enquiries',
            data: [
              (s.pendingAdmissions ?? 0) + (s.students ?? 0),
              Math.round(((s.pendingAdmissions ?? 0) + (s.students ?? 0)) * 0.9),
              Math.round(((s.pendingAdmissions ?? 0) + (s.students ?? 0)) * 1.1),
              (s.pendingAdmissions ?? 0) + (s.students ?? 0)
            ],
            backgroundColor: 'rgba(14,116,144,0.8)', borderRadius: 6, borderSkipped: false
          },
          {
            label: 'Admitted',
            data: [
              s.students ?? 0,
              Math.round((s.students ?? 0) * 0.85),
              Math.round((s.students ?? 0) * 1.15),
              s.students ?? 0
            ],
            backgroundColor: 'rgba(22,163,74,0.85)', borderRadius: 6, borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#475569', font: { size: 11 } } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#475569' } },
          y: { grid: { color: '#f1f5f9' }, ticks: { color: '#475569' }, beginAtZero: true }
        }
      }
    });
  }
}
