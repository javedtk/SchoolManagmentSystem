import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { isPlatformBrowser } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { CustomAlertComponent } from '../../shared/custom-alert/custom-alert.component';

@Component({
  selector: 'app-admin-manage-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomAlertComponent],
  templateUrl: './manage-gallery.component.html',
  styleUrl: './manage-gallery.component.scss'
})
export class ManageGalleryComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly api = inject(ApiService);

  albums = signal<any[]>([]);
  selectedAlbum = signal<any | null>(null);
  activeModal = signal<string | null>(null);
  editingAlbumId = signal<number | null>(null);
  mediaUploadProgress = signal<number | null>(null);

  // Custom Confirmation Dialog State
  confirmDialog = signal<{
    message: string;
    onConfirm: () => void;
    title?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
  } | null>(null);

  // New/Edit Album Form
  albumForm = {
    title: '',
    description: ''
  };
  albumCoverFile: File | null = null;

  // New Media Form
  mediaForm = {
    caption: '',
    type: 'image'
  };
  mediaFile: File | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAlbums();
    }
  }

  loadAlbums(): void {
    this.api.get<any[]>('/admin/gallery/albums').subscribe(res => {
      this.albums.set(res);
    });
  }

  viewAlbum(albumId: number): void {
    this.api.get<any>(`/admin/gallery/albums/${albumId}`).subscribe(res => {
      this.selectedAlbum.set(res);
    });
  }

  closeAlbumView(): void {
    this.selectedAlbum.set(null);
    this.loadAlbums();
  }

  openAlbumModal(): void {
    this.editingAlbumId.set(null);
    this.albumForm = { title: '', description: '' };
    this.albumCoverFile = null;
    this.activeModal.set('album');
  }

  openEditAlbumModal(album: any, event: MouseEvent): void {
    event.stopPropagation(); // Prevent navigation to album details
    this.editingAlbumId.set(album.id);
    this.albumForm = {
      title: album.title,
      description: album.description || ''
    };
    this.albumCoverFile = null;
    this.activeModal.set('album');
  }

  onCoverFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.albumCoverFile = event.target.files[0];
    }
  }

  createAlbum(): void {
    const formData = new FormData();
    formData.append('title', this.albumForm.title);
    formData.append('description', this.albumForm.description);
    if (this.albumCoverFile) {
      formData.append('cover_image', this.albumCoverFile);
    }

    const editId = this.editingAlbumId();
    if (editId) {
      this.api.put<any>(`/admin/gallery/albums/${editId}`, formData).subscribe(() => {
        this.activeModal.set(null);
        this.loadAlbums();
      });
    } else {
      this.api.post<any>('/admin/gallery/albums', formData).subscribe(() => {
        this.activeModal.set(null);
        this.loadAlbums();
      });
    }
  }

  deleteAlbum(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.confirmDialog.set({
      title: 'Delete Album',
      message: 'Delete this album and all its media files?',
      type: 'warning',
      onConfirm: () => {
        this.api.delete<any>(`/admin/gallery/albums/${id}`).subscribe(() => {
          this.loadAlbums();
        });
      }
    });
  }

  // Media
  openMediaModal(): void {
    this.mediaForm = { caption: '', type: 'image' };
    this.mediaFile = null;
    this.activeModal.set('media');
  }

  onMediaFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.mediaFile = event.target.files[0];
    }
  }

  uploadMedia(): void {
    const album = this.selectedAlbum();
    if (!album || !this.mediaFile) return;

    const formData = new FormData();
    formData.append('file', this.mediaFile);
    formData.append('caption', this.mediaForm.caption);
    formData.append('type', this.mediaForm.type);

    this.mediaUploadProgress.set(0);
    let currentPercent = 0;
    const progressInterval = setInterval(() => {
      if (currentPercent < 90) {
        currentPercent += Math.floor(Math.random() * 15) + 5;
        if (currentPercent > 90) currentPercent = 90;
        this.mediaUploadProgress.set(currentPercent);
      }
    }, 80);

    this.api.postWithProgress(`/admin/gallery/albums/${album.id}/media`, formData).subscribe({
      next: (evt) => {
        if (evt.type === HttpEventType.UploadProgress) {
          if (evt.total) {
            const percent = Math.round((100 * evt.loaded) / evt.total);
            if (percent > currentPercent) {
              currentPercent = percent;
              this.mediaUploadProgress.set(currentPercent);
            }
          }
        } else if (evt.type === HttpEventType.Response) {
          clearInterval(progressInterval);
          this.mediaUploadProgress.set(100);

          setTimeout(() => {
            this.mediaUploadProgress.set(null);
            this.activeModal.set(null);
            this.viewAlbum(album.id); // Reload details
          }, 300);
        }
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.mediaUploadProgress.set(null);
        alert(err.error?.message || 'Failed to upload media.');
      }
    });
  }

  deleteMedia(mediaId: number): void {
    this.confirmDialog.set({
      title: 'Delete Media',
      message: 'Delete this media item?',
      type: 'warning',
      onConfirm: () => {
        this.api.delete<any>(`/admin/gallery/media/${mediaId}`).subscribe(() => {
          const album = this.selectedAlbum();
          if (album) {
            this.viewAlbum(album.id);
          }
        });
      }
    });
  }
}
