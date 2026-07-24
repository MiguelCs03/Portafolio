import { Component, computed } from '@angular/core';
import { ScrollReveal } from '../../directives/scroll-reveal';
import { LanguageService } from '../../services/language';

interface WorkExperience {
  role: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  isCurrent?: boolean;
}

@Component({
  selector: 'app-experience',
  imports: [ScrollReveal],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience {
  constructor(public langService: LanguageService) {}

  experiences = computed<WorkExperience[]>(() => {
    const t = this.langService.t();
    return [
      {
        role: 'Backend Developer',
        company: 'MULTICENTER',
        period: t.experience.period1,
        description: t.experience.desc1,
        technologies: ['Laravel', 'SQL Server', 'REST APIs'],
        isCurrent: true,
      },
      {
        role: 'Full Stack Developer',
        company: 'INTECRUZ',
        period: t.experience.period2,
        description: t.experience.desc2,
        technologies: ['Flutter', 'Node.js', 'Firebase'],
        isCurrent: false,
      }
    ];
  });
}
