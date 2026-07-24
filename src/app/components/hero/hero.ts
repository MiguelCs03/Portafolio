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
  constructor(
    public langService: LanguageService,
    public audioService: AudioService
  ) {}
}
