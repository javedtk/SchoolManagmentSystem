import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() isPublic: boolean = true;
  @Output() tabChanged = new EventEmitter<string>();

  setTab(tab: string): void {
    this.tabChanged.emit(tab);
  }
}
