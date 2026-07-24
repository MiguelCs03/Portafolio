import { Component } from '@angular/core';
import { ThreeDTilt } from '../../directives/three-d-tilt';
import { ScrollSpin } from '../../directives/scroll-spin';
import { LanguageService } from '../../services/language';

interface Skill {
  name: string;
  icon: string;
}

interface TechCategory {
  title: string;
  icon: string;
  isFeatured?: boolean;
  skills: Skill[];
}

@Component({
  selector: 'app-tech-stack',
  imports: [ThreeDTilt, ScrollSpin],
  templateUrl: './tech-stack.html',
  styleUrl: './tech-stack.css',
})
export class TechStack {
  categories: TechCategory[] = [
    {
      title: 'Frontend / UI',
      icon: 'terminal',
      skills: [
        { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
        { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
        { name: 'React / Next.js', icon: 'devicon-react-original colored' },
        { name: 'Angular', icon: 'devicon-angularjs-plain colored' },
        { name: 'Vue 3 / Nuxt', icon: 'devicon-vuejs-plain colored' }
      ]
    },
    {
      title: 'Backend / APIs',
      icon: 'dns',
      skills: [
        { name: 'Laravel / PHP', icon: 'devicon-laravel-plain colored' },
        { name: 'PHP Core', icon: 'devicon-php-plain colored' },
        { name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
        { name: 'NestJS', icon: 'devicon-nestjs-plain colored' }
      ]
    },
    {
      title: 'Mobile Apps',
      icon: 'smartphone',
      skills: [
        { name: 'Flutter', icon: 'devicon-flutter-plain colored' },
        { name: 'Dart', icon: 'devicon-dart-plain colored' }
      ]
    },
    {
      title: 'Cloud & Serverless',
      icon: 'cloud_done',
      isFeatured: true,
      skills: [
        { name: 'AWS Cloud', icon: 'devicon-amazonwebservices-original colored' },
        { name: 'DigitalOcean', icon: 'devicon-digitalocean-original colored' },
        { name: 'Linux', icon: 'devicon-linux-plain' },
        { name: 'AWS Lambdas', icon: 'devicon-amazonwebservices-plain colored' },
        { name: 'Edge Workers', icon: 'devicon-amazonwebservices-plain' }
      ]
    },
    {
      title: 'Arquitectura & AI',
      icon: 'psychology',
      skills: [
        { name: 'Microservicios', icon: 'devicon-docker-plain colored' },
        { name: 'OpenAI / LLMs', icon: 'devicon-python-plain colored' }
      ]
    }
  ];

  constructor(public langService: LanguageService) {}
}
