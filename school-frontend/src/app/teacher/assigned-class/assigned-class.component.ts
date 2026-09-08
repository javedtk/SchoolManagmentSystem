import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-assigned-class',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assigned-class.component.html',
  styleUrl: './assigned-class.component.scss'
})
export class AssignedClassComponent {
  @Input() classSubjects: any[] = [];
  @Input() students: any[] = [];

  @Output() classSelected = new EventEmitter<number>();

  onClassChange(event: any): void {
    const val = event.target.value;
    if (val) {
      this.classSelected.emit(Number(val));
    }
  }
}
