import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-manage-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-events.component.html',
  styleUrl: './manage-events.component.scss'
})
export class ManageEventsComponent {
  @Input() events: any[] = [];
  @Input() activeModal: string | null = null;
  @Input() uploadProgress: number | null = null;

  @Output() save = new EventEmitter<{ eventId: number | null; formValues: any }>();
  @Output() delete = new EventEmitter<number>();
  @Output() setModal = new EventEmitter<string | null>();

  selectedEvent = signal<any | null>(null);
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  eventForm = {
    title: '',
    description: '',
    event_date: '',
    category: 'Academics',
    organized_by: 'Internal',
    organizer_name: 'Aether Academy',
    place: ''
  };

  onOrganizedByChange(): void {
    if (this.eventForm.organized_by === 'Internal') {
      this.eventForm.organizer_name = 'Aether Academy';
    } else {
      this.eventForm.organizer_name = '';
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  openEventModal(event: any = null): void {
    this.selectedEvent.set(event);
    this.selectedFile = null;
    this.imagePreview = event && event.image ? 'http://localhost:5000/' + event.image : null;

    if (event) {
      this.eventForm = {
        title: event.title || '',
        description: event.description || '',
        event_date: event.event_date || '',
        category: event.category || 'Academics',
        organized_by: event.organized_by || 'Internal',
        organizer_name: event.organizer_name || (event.organized_by === 'Internal' ? 'Aether Academy' : ''),
        place: event.place || ''
      };
    } else {
      this.eventForm = {
        title: '',
        description: '',
        event_date: new Date().toISOString().split('T')[0],
        category: 'Academics',
        organized_by: 'Internal',
        organizer_name: 'Aether Academy',
        place: ''
      };
    }
    this.setModal.emit('event');
  }

  submitEvent(): void {
    const e = this.selectedEvent();
    if (this.eventForm.organized_by === 'Internal') {
      this.eventForm.organizer_name = 'Aether Academy';
    }

    const formData = new FormData();
    formData.append('title', this.eventForm.title);
    formData.append('description', this.eventForm.description);
    formData.append('event_date', this.eventForm.event_date);
    formData.append('category', this.eventForm.category);
    formData.append('organized_by', this.eventForm.organized_by);
    formData.append('organizer_name', this.eventForm.organizer_name);
    formData.append('place', this.eventForm.place);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (this.imagePreview === null) {
      formData.append('image', '');
    }

    this.save.emit({
      eventId: e ? e.id : null,
      formValues: formData
    });
  }
}
