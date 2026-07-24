import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NeuralBg } from './components/neural-bg/neural-bg';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { Terminal } from './components/terminal/terminal';
import { TechStack } from './components/tech-stack/tech-stack';
import { Experience } from './components/experience/experience';
import { Projects } from './components/projects/projects';
import { Contact } from './components/contact/contact';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    NeuralBg,
    Header,
    Hero,
    Terminal,
    TechStack,
    Experience,
    Projects,
    Contact,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('portfolio');
  isLoading = true;
  showPreloader = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Start fading out at 150ms
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 150);

    // Completely unmount preloader container at 550ms (after 400ms transition)
    setTimeout(() => {
      this.showPreloader = false;
      this.cdr.detectChanges();
    }, 550);
  }
}
