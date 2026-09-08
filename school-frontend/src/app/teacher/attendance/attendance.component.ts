import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {
  @Input() classSubjects: any[] = [];
  @Input() attendanceRecords: any[] = [];
  @Input() selectedClassId: number | null = null;
  @Input() selectedDate: string = new Date().toISOString().split('T')[0];

  @Output() classChanged = new EventEmitter<number | null>();
  @Output() dateChanged = new EventEmitter<string>();
  @Output() submit = new EventEmitter<any>();

  onClassChange(event: any): void {
    const val = event.target.value;
    const classId = val === 'null' || !val ? null : Number(val);
    this.classChanged.emit(classId);
  }

  onDateChange(event: any): void {
    const val = event.target.value;
    this.dateChanged.emit(val);
  }

  submitAttendance(): void {
    this.submit.emit();
  }
}
