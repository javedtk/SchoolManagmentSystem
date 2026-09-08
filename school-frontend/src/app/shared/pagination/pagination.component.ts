import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  private _totalItems = signal(0);
  private _pageSize = signal(10);
  private _currentPage = signal(1);

  @Input() set totalItems(value: number) {
    this._totalItems.set(value);
  }
  get totalItems() { return this._totalItems(); }

  @Input() set pageSize(value: number) {
    this._pageSize.set(value || 10);
  }
  get pageSize() { return this._pageSize(); }

  @Input() set currentPage(value: number) {
    this._currentPage.set(value || 1);
  }
  get currentPage() { return this._currentPage(); }

  @Output() pageChange = new EventEmitter<number>();

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this._totalItems() / this._pageSize()));
  });

  pages = computed(() => {
    const total = this.totalPages();
    const current = this._currentPage();
    const range: number[] = [];
    
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
      if (i >= 1 && i <= total) {
        range.push(i);
      }
    }
    return range;
  });

  onPageClick(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
