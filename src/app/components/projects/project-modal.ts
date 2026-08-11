import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  isPrivate?: boolean;
  privateNote?: string;
  link?: string;
  linkText?: string;
  allowIframe?: boolean;
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

  showWebPreview = false;
  isPreviewLoading = true;
  safeLinkUrl: SafeResourceUrl | null = null;

  constructor(
    public audioService: AudioService,
    public langService: LanguageService,
    private sanitizer: DomSanitizer
  ) {}

  onClose() {
    this.audioService.playClick();
    this.showWebPreview = false;
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }

  openWebPreview() {
    if (this.project?.link) {
      this.audioService.playSwoosh();
      this.safeLinkUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.project.link);
      this.showWebPreview = true;
      this.isPreviewLoading = true;

      setTimeout(() => {
        this.isPreviewLoading = false;
      }, 1600);
    }
  }

  closeWebPreview() {
    this.audioService.playClick();
    this.showWebPreview = false;
  }
}
