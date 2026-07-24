import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AudioService } from '../../services/audio-service';
import { LanguageService } from '../../services/language';

export interface ExtendedProject {
  title: string;
  category: string;
  categoryClass: string;
  description: string;
  imageUrl: string;
  icons: string[];
  borderClass?: string;
  isFeatured?: boolean;
  link?: string;
  architectureDetails?: string;
  keyFeatures?: string[];
  techStackBadges?: string[];
}

@Component({
  selector: 'app-project-modal',
  imports: [],
  templateUrl: './project-modal.html',
})
export class ProjectModal {
  @Input() project: ExtendedProject | null = null;
  @Output() close = new EventEmitter<void>();

  constructor(
    public audioService: AudioService,
    public langService: LanguageService
  ) {}

  onClose() {
    this.audioService.playClick();
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }
}
