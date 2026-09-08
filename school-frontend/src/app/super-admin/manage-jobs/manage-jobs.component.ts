import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { CustomAlertComponent } from '../../shared/custom-alert/custom-alert.component';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-admin-manage-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomAlertComponent],
  templateUrl: './manage-jobs.component.html',
  styleUrl: './manage-jobs.component.scss'
})
export class ManageJobsComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly api = inject(ApiService);
  private readonly tokenService = inject(TokenService);

  subTab = signal<string>('listings'); // 'listings' or 'applications'
  jobs = signal<any[]>([]);
  applications = signal<any[]>([]);
  activeModal = signal<string | null>(null);

  selectedJob = signal<any | null>(null);

  // Custom Confirmation Dialog State
  confirmDialog = signal<{
    message: string;
    onConfirm: () => void;
    title?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
  } | null>(null);

  jobForm = {
    title: '',
    description: '',
    requirements: '',
    location: 'On-site',
    type: 'Full-time',
    status: 'active'
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadJobs();
      this.loadApplications();
    }
  }

  loadJobs(): void {
    this.api.get<any[]>('/admin/jobs').subscribe(res => {
      this.jobs.set(res);
    });
  }

  loadApplications(): void {
    this.api.get<any[]>('/admin/job-applications').subscribe(res => {
      this.applications.set(res);
    });
  }

  setSubTab(tab: string): void {
    this.subTab.set(tab);
    if (tab === 'listings') {
      this.loadJobs();
    } else {
      this.loadApplications();
    }
  }

  openJobModal(job: any = null): void {
    this.selectedJob.set(job);
    if (job) {
      this.jobForm = {
        title: job.title || '',
        description: job.description || '',
        requirements: job.requirements || '',
        location: job.location || 'On-site',
        type: job.type || 'Full-time',
        status: job.status || 'active'
      };
    } else {
      this.jobForm = {
        title: '',
        description: '',
        requirements: '',
        location: 'On-site',
        type: 'Full-time',
        status: 'active'
      };
    }
    this.activeModal.set('job');
  }

  submitJob(): void {
    const job = this.selectedJob();
    if (job) {
      this.api.put<any>(`/admin/jobs/${job.id}`, this.jobForm).subscribe(() => {
        this.activeModal.set(null);
        this.loadJobs();
      });
    } else {
      this.api.post<any>('/admin/jobs', this.jobForm).subscribe(() => {
        this.activeModal.set(null);
        this.loadJobs();
      });
    }
  }

  deleteJob(id: number): void {
    this.confirmDialog.set({
      title: 'Delete Job Listing',
      message: 'Are you sure you want to delete this job listing?',
      type: 'warning',
      onConfirm: () => {
        this.api.delete<any>(`/admin/jobs/${id}`).subscribe(() => {
          this.loadJobs();
        });
      }
    });
  }

  updateApplicationStatus(applicationId: number, status: string): void {
    this.api.put<any>(`/admin/job-applications/${applicationId}/status`, { status }).subscribe(() => {
      this.loadApplications();
    });
  }

  getResumeUrl(resumePath: string): string {
    if (!resumePath) return '#';
    const filename = resumePath.split('/').pop();
    const token = this.tokenService.getToken() || '';
    return `http://localhost:5000/api/admin/job-applications/resumes/${filename}?token=${token}`;
  }
}
