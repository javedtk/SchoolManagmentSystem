import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ClassesComponent } from './classes/classes.component';
import { ServicesComponent } from './services/services.component';
import { FacultyComponent } from './faculty/faculty.component';
import { AdmissionComponent } from './admission/admission.component';
import { EventsComponent } from './events/events.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CareerComponent } from './career/career.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    HomeComponent,
    AboutUsComponent,
    ClassesComponent,
    ServicesComponent,
    FacultyComponent,
    AdmissionComponent,
    EventsComponent,
    GalleryComponent,
    CareerComponent,
    AchievementsComponent,
    ContactUsComponent,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss'
})
export class PublicLayout implements OnInit {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  activeTab = signal<string>('home');

  // Dynamic Data signals
  classes = signal<any[]>([]);
  faculty = signal<any[]>([]);
  events = signal<any[]>([]);
  achievements = signal<any[]>([]);
  albums = signal<any[]>([]);
  jobs = signal<any[]>([]);
  activeAlbum = signal<any | null>(null);

  // CMS Page Content signals
  cmsAbout = signal<any>({ title: '', content: '' });
  cmsServices = signal<any>({ title: '', content: '' });
  cmsAdmissionInfo = signal<any>({ title: '', content: '' });

  contactSuccess = signal<string | null>(null);
  contactError = signal<string | null>(null);
  contactLoading = signal<boolean>(false);

  // Admission Enquiry
  admissionSuccess = signal<string | null>(null);
  admissionError = signal<string | null>(null);
  admissionLoading = signal<boolean>(false);

  // Job Application
  activeJob = signal<any | null>(null);
  selectedResumeFile: File | null = null;
  jobSuccess = signal<string | null>(null);
  jobError = signal<string | null>(null);
  jobLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadAllPublicData();
  }

  setTab(tab: string): void {
    this.activeTab.set(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.activeAlbum.set(null);
    this.activeJob.set(null);
    
    // Clear forms messages
    this.contactSuccess.set(null);
    this.contactError.set(null);
    this.admissionSuccess.set(null);
    this.admissionError.set(null);
    this.jobSuccess.set(null);
    this.jobError.set(null);
  }

  loadAllPublicData(): void {
    // 1. Load Classes
    this.api.get<any[]>('/public/classes').subscribe(res => this.classes.set(res));
    
    // 2. Load Faculty
    this.api.get<any[]>('/public/faculty').subscribe(res => this.faculty.set(res));

    // 3. Load Events
    this.api.get<any[]>('/public/events').subscribe(res => this.events.set(res));

    // 4. Load Achievements
    this.api.get<any[]>('/public/achievements').subscribe(res => this.achievements.set(res));

    // 5. Load Gallery Albums
    this.api.get<any[]>('/public/gallery/albums').subscribe(res => this.albums.set(res));

    // 6. Load Job vacancies
    this.api.get<any[]>('/public/career/jobs').subscribe(res => this.jobs.set(res));

    // 7. Load CMS Content
    this.api.get<any>('/public/cms/about').subscribe({
      next: res => this.cmsAbout.set(res),
      error: () => this.cmsAbout.set({ title: 'About Aether Academy', content: 'Academic Excellence & Holistic Character Development Since 2010.' })
    });
    this.api.get<any>('/public/cms/services').subscribe({
      next: res => this.cmsServices.set(res),
      error: () => this.cmsServices.set({ title: 'Modern Facilities', content: 'Science Lab, Tech Hubs, Smart Classrooms, Gymnasium.' })
    });
    this.api.get<any>('/public/cms/admission_info').subscribe({
      next: res => this.cmsAdmissionInfo.set(res),
      error: () => this.cmsAdmissionInfo.set({ title: 'Admission Guide', content: 'Enrollment Open. Evaluate process details.' })
    });
  }

  viewAlbum(albumId: number): void {
    this.api.get<any>(`/public/gallery/albums/${albumId}`).subscribe(res => {
      this.activeAlbum.set(res);
    });
  }

  openJobApplication(job: any): void {
    this.activeJob.set(job);
    this.jobSuccess.set(null);
    this.jobError.set(null);
  }

  onResumeSelected(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedResumeFile = fileList[0];
    }
  }

  submitContactForm(formValues: any, componentInstance?: any): void {
    this.contactLoading.set(true);
    this.contactSuccess.set(null);
    this.contactError.set(null);

    setTimeout(() => {
      this.contactLoading.set(false);
      this.contactSuccess.set('Thank you for contacting us! Our team will get back to you shortly.');
      if (componentInstance) {
        componentInstance.clearForm();
      }
    }, 1500);
  }

  submitAdmissionEnquiry(event: { form: any; photo: File | null }, componentInstance?: any): void {
    this.admissionLoading.set(true);
    this.admissionSuccess.set(null);
    this.admissionError.set(null);

    const formData = new FormData();
    formData.append('student_name', event.form.student_name);
    formData.append('parent_name', event.form.parent_name);
    formData.append('contact', event.form.contact);
    formData.append('email', event.form.email);
    formData.append('class_applied', event.form.class_applied);
    formData.append('transport_mode', event.form.transport_mode);
    if (event.photo) {
      formData.append('student_photo', event.photo);
    }

    this.api.post<any>('/public/admissions/enquiry', formData).subscribe({
      next: () => {
        this.admissionLoading.set(false);
        this.admissionSuccess.set('Your admission enquiry has been submitted successfully! We have sent a confirmation email to you.');
        if (componentInstance) {
          componentInstance.clearForm();
        }
      },
      error: (err) => {
        this.admissionLoading.set(false);
        this.admissionError.set(err.error?.message || 'Submission failed. Please check your network connection.');
      }
    });
  }

  submitJobApplication(formValues: any, componentInstance?: any): void {
    if (!this.selectedResumeFile) {
      this.jobError.set('Please upload your resume (PDF/DOCX).');
      return;
    }

    this.jobLoading.set(true);
    this.jobSuccess.set(null);
    this.jobError.set(null);

    const formData = new FormData();
    formData.append('job_id', this.activeJob()?.id.toString() || '');
    formData.append('applicant_name', formValues.applicant_name);
    formData.append('email', formValues.email);
    formData.append('phone', formValues.phone);
    formData.append('cover_letter', formValues.cover_letter);
    formData.append('resume', this.selectedResumeFile);

    // Call public careers endpoint
    this.api.post<any>('/public/career/apply', formData).subscribe({
      next: () => {
        this.jobLoading.set(false);
        this.jobSuccess.set('Application submitted successfully! Our recruiters will reach out to you.');
        this.selectedResumeFile = null;
        if (componentInstance) {
          componentInstance.clearForm();
        }
      },
      error: (err) => {
        this.jobLoading.set(false);
        this.jobError.set(err.error?.message || 'Failed to submit application. Please try again.');
      }
    });
  }

  navigateToPortal(): void {
    const role = this.auth.getRole();
    if (this.auth.isAuthenticated() && role) {
      this.router.navigate([`/${role}/dashboard`]);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
