import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-manage-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-timetable.component.html',
  styleUrl: './manage-timetable.component.scss'
})
export class ManageTimetableComponent {
  @Input() classes: any[] = [];
  @Input() subjects: any[] = [];
  @Input() teachers: any[] = [];
  
  private _timetableEntries: any[] = [];
  @Input()
  set timetableEntries(val: any[]) {
    this._timetableEntries = val;
    // Populate form slots if we are in edit mode
    if (this.activeModal === 'timetable' && this.selectedTeacher) {
      this.populateSlotsFromEntries(val);
    }
  }
  get timetableEntries(): any[] {
    return this._timetableEntries;
  }

  @Input() selectedClassId: number | null = null;
  @Input() selectedTeacherId: number | null = null;
  @Input() activeModal: string | null = null;

  @Output() classSelected = new EventEmitter<number | null>();
  @Output() teacherSelected = new EventEmitter<number | null>();
  @Output() save = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();
  @Output() setModal = new EventEmitter<string | null>();

  slots: any[] = [];
  selectedTeacher: any = null;
  newTimetableTeacherId: number | null = null;
  readonly daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  openViewTimetable(teacher: any): void {
    this.selectedTeacher = teacher;
    this.teacherSelected.emit(teacher.id);
    this.expandedDays = {};
    this.setModal.emit('view-timetable');
  }

  openEditTimetable(teacher: any): void {
    this.selectedTeacher = teacher;
    this.teacherSelected.emit(teacher.id);
    this.slots = []; // Clear current slots, waiting to be populated from input getter
    this.setModal.emit('timetable');
  }

  openAddTimetableModal(): void {
    this.selectedTeacher = null;
    this.newTimetableTeacherId = null;
    this.slots = [];
    const defaultClassId = this.classes.length > 0 ? this.classes[0].id : 0;
    const classSubjects = this.getSubjectsForClass(defaultClassId);
    const defaultSubjectId = classSubjects.length > 0 ? classSubjects[0].id : 0;
    this.slots = [
      {
        day: 'Monday',
        period_no: 1,
        start_time: '08:30 AM',
        end_time: '09:20 AM',
        class_id: defaultClassId,
        subject_id: defaultSubjectId,
        teacher_id: null
      }
    ];
    this.setModal.emit('timetable');
  }

  onTeacherChange(event: any): void {
    if (this.newTimetableTeacherId) {
      const teacherId = Number(this.newTimetableTeacherId);
      const teacher = this.teachers.find(t => t.id === teacherId);
      if (teacher) {
        this.selectedTeacher = teacher;
        this.teacherSelected.emit(teacherId);
        this.slots.forEach(s => s.teacher_id = teacherId);
      }
    }
  }

  populateSlotsFromEntries(entries: any[]): void {
    if (entries && entries.length > 0) {
      this.slots = entries.map(e => ({
        id: e.id,
        day: e.day,
        period_no: Number(e.period_no),
        start_time: e.start_time,
        end_time: e.end_time,
        class_id: e.class_id,
        subject_id: e.subject_id,
        teacher_id: e.teacher_id
      }));
    } else {
      const defaultClassId = this.classes.length > 0 ? this.classes[0].id : 0;
      const classSubjects = this.getSubjectsForClass(defaultClassId);
      const defaultSubjectId = classSubjects.length > 0 ? classSubjects[0].id : 0;
      this.slots = [
        {
          day: 'Monday',
          period_no: 1,
          start_time: '08:30 AM',
          end_time: '09:20 AM',
          class_id: defaultClassId,
          subject_id: defaultSubjectId,
          teacher_id: this.selectedTeacher ? this.selectedTeacher.id : 0
        }
      ];
    }
  }

  addSlotRow(): void {
    const lastSlot = this.slots[this.slots.length - 1];
    const defaultClassId = lastSlot ? lastSlot.class_id : (this.classes.length > 0 ? this.classes[0].id : 0);
    const defaultTeacherId = this.selectedTeacher ? this.selectedTeacher.id : 0;
    const classSubjects = this.getSubjectsForClass(defaultClassId);
    const defaultSubjectId = classSubjects.length > 0 ? classSubjects[0].id : 0;

    this.slots.push({
      day: lastSlot ? lastSlot.day : 'Monday',
      period_no: lastSlot ? Number(lastSlot.period_no) + 1 : 1,
      start_time: lastSlot ? lastSlot.start_time : '08:30 AM',
      end_time: lastSlot ? lastSlot.end_time : '09:20 AM',
      class_id: defaultClassId,
      subject_id: defaultSubjectId,
      teacher_id: defaultTeacherId
    });
  }

  removeSlotRow(index: number): void {
    if (this.slots.length > 1) {
      this.slots.splice(index, 1);
    } else {
      alert('You must have at least one slot in the form.');
    }
  }

  getSubjectsForClass(classId: any): any[] {
    const id = Number(classId);
    return this.subjects.filter(sub => sub.class_id === id);
  }

  onSlotClassChange(slot: any): void {
    const classSubjects = this.getSubjectsForClass(slot.class_id);
    slot.subject_id = classSubjects.length > 0 ? classSubjects[0].id : 0;
  }

  get uniqueDays(): string[] {
    return this.daysOfWeek.filter(day => this.timetableEntries.some(entry => entry.day === day));
  }

  getSlotsForDay(day: string): any[] {
    return this.timetableEntries
      .filter(entry => entry.day === day)
      .sort((a, b) => Number(a.period_no) - Number(b.period_no));
  }

  submitTimetable(): void {
    const mappedSlots = this.slots.map(s => ({
      class_id: Number(s.class_id),
      day: s.day,
      period_no: Number(s.period_no),
      subject_id: Number(s.subject_id),
      teacher_id: this.selectedTeacher ? Number(this.selectedTeacher.id) : null,
      start_time: s.start_time,
      end_time: s.end_time
    }));
    this.save.emit(mappedSlots);
  }

  expandedDays: { [key: string]: boolean } = {};

  toggleDay(day: string): void {
    this.expandedDays[day] = !this.isDayExpanded(day);
  }

  isDayExpanded(day: string): boolean {
    if (this.expandedDays[day] === undefined) {
      this.expandedDays[day] = true;
    }
    return this.expandedDays[day];
  }
}
