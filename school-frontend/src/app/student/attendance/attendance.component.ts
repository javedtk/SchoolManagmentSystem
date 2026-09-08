import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {
  @Input() attendanceReport: any = { percentage: 100, summary: {}, records: [] };

  private _searchDate: string = '';
  get searchDate(): string { return this._searchDate; }
  set searchDate(val: string) {
    this._searchDate = val;
    this.currentPage = 1;
  }

  private _selectedStatus: string = 'all';
  get selectedStatus(): string { return this._selectedStatus; }
  set selectedStatus(val: string) {
    this._selectedStatus = val;
    this.currentPage = 1;
  }

  currentPage: number = 1;
  pageSize: number = 10;

  get filteredRecords(): any[] {
    const records = this.attendanceReport?.records || [];
    return records.filter((r: any) => {
      const matchStatus = this.selectedStatus === 'all' || r.status === this.selectedStatus;
      const matchDate = !this.searchDate || r.date === this.searchDate;
      return matchStatus && matchDate;
    });
  }

  get paginatedRecords(): any[] {
    const list = this.filteredRecords;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return list.slice(startIndex, startIndex + this.pageSize);
  }

  clearFilters(): void {
    this.searchDate = '';
    this.selectedStatus = 'all';
    this.currentPage = 1;
  }
}
