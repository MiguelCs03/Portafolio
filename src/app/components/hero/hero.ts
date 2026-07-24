import { Component } from '@angular/core';
import { ThreeD } from '../three-d/three-d';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-hero',
  imports: [ThreeD],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  constructor(public langService: LanguageService) {}
}
