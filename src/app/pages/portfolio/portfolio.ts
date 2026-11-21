import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NeuralBg } from '../../components/neural-bg/neural-bg';
import { Header } from '../../components/header/header';
import { LaptopScroll } from '../../components/laptop-scroll/laptop-scroll';
import { Terminal } from '../../components/terminal/terminal';
import { TechStack } from '../../components/tech-stack/tech-stack';
import { Experience } from '../../components/experience/experience';
import { Projects } from '../../components/projects/projects';
import { Contact } from '../../components/contact/contact';
import { Footer } from '../../components/footer/footer';
import { AnalyticsService } from '../../services/analytics';

@Component({
  selector: 'app-portfolio',
  imports: [NeuralBg, Header, LaptopScroll, Terminal, TechStack, Experience, Projects, Contact, Footer],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements OnInit {
  isLoading = true;
  showPreloader = true;
  progress = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private analytics: AnalyticsService,
  ) {}

  ngOnInit() {
    this.analytics.init();

    const progressInterval = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 5;
        this.cdr.detectChanges();
      }
    }, 75);

    setTimeout(() => {
      clearInterval(progressInterval);
      this.progress = 100;
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 1800);

    setTimeout(() => {
      this.showPreloader = false;
      this.cdr.detectChanges();
    }, 2500);
  }
}
