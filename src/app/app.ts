import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NeuralBg } from './components/neural-bg/neural-bg';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
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

  ngOnInit() {
    // Start fading out at 2 seconds
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);

    // Completely unmount preloader container at 2.6 seconds (after 600ms transition)
    setTimeout(() => {
      this.showPreloader = false;
    }, 2600);
  }
}
