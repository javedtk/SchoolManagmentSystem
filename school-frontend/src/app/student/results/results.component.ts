import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-student-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  private readonly auth = inject(AuthService);
  private readonly tokenService = inject(TokenService);

  @Input() results: any[] = [];

  downloadReportCardUrl(examId: number): string {
    const studentId = this.auth.getProfileId();
    const token = this.tokenService.getToken() || '';
    return `http://localhost:5000/api/results/student/${studentId}/exam/${examId}/download?token=${token}`;
  }
}
