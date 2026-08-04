import { Component } from '@angular/core';
import { ThreeD } from '../three-d/three-d';
import { ScrollReveal } from '../../directives/scroll-reveal';
import { LanguageService } from '../../services/language';
import { AudioService } from '../../services/audio-service';

@Component({
  selector: 'app-hero',
  imports: [ThreeD, ScrollReveal],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  copiedEmail = false;

  constructor(
    public langService: LanguageService,
    public audioService: AudioService
  ) {}

  copyEmail() {
    this.audioService.playClick();
    navigator.clipboard.writeText('mangelcs2003@gmail.com');
    this.copiedEmail = true;
    setTimeout(() => {
      this.copiedEmail = false;
    }, 2000);
  }
}
