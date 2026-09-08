import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  @Input() albums: any[] = [];
  @Input() activeAlbum: any | null = null;

  @Output() selectAlbum = new EventEmitter<number>();
  @Output() closeAlbum = new EventEmitter<void>();

  previewImageUrl: string | null = null;

  openPreview(url: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.previewImageUrl = url;
  }

  closePreview(): void {
    this.previewImageUrl = null;
  }
}
