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
  progress = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Increment progress counter smooth over 1.5s
    const progressInterval = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 5;
        this.cdr.detectChanges();
      }
    }, 75);

    // Start fading out preloader overlay at 1800ms (> 1.5s)
    setTimeout(() => {
      clearInterval(progressInterval);
      this.progress = 100;
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 1800);

    // Completely unmount preloader container at 2500ms
    setTimeout(() => {
      this.showPreloader = false;
      this.cdr.detectChanges();
    }, 2500);
  }
}
