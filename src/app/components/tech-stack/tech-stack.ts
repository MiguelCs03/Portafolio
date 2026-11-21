import { Component, computed, signal } from '@angular/core';
import { ScrollReveal } from '../../directives/scroll-reveal';
import { ThreeDTilt } from '../../directives/three-d-tilt';
import { AudioService } from '../../services/audio-service';
import { LanguageService } from '../../services/language';

interface Skill {
  name: string;
  icon: string;
  level: string;
  usage: string;
}

interface TechCategory {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  icon: string;
  spanClass: string;
  accent: 'cyan' | 'blue' | 'purple' | 'gold';
  isFeatured?: boolean;
  skills: Skill[];
}

@Component({
  selector: 'app-tech-stack',
  imports: [ThreeDTilt, ScrollReveal],
  templateUrl: './tech-stack.html',
  styleUrl: './tech-stack.css',
})
export class TechStack {
  readonly selectedSkill = signal<Skill | null>(null);

  readonly categories: TechCategory[] = [
    {
      id: 'frontend',
      code: 'LAYER_01',
      title: 'Frontend / UI',
      subtitle: 'Interfaces reactivas & WebGL',
      icon: 'terminal',
      spanClass: 'md:col-span-3 lg:col-span-5',
      accent: 'cyan',
      skills: [
        {
          name: 'Angular',
          icon: 'devicon-angularjs-plain colored',
          level: 'Avanzado',
          usage: 'Frontend modular en Multipuntos Multicenter y este portafolio 3D.',
        },
        {
          name: 'TypeScript',
          icon: 'devicon-typescript-plain colored',
          level: 'Avanzado',
          usage: 'Tipado estricto de extremo a extremo entre frontend y microservicios.',
        },
        {
          name: 'React / Next.js',
          icon: 'devicon-react-original colored',
          level: 'Intermedio+',
          usage: 'Aplicaciones web rápidas con SSR y componentes reutilizables.',
        },
        {
          name: 'Vue 3 / Nuxt',
          icon: 'devicon-vuejs-plain colored',
          level: 'Avanzado',
          usage: 'Plataformas administrativas empresariales desarrolladas en Intecruz.',
        },
        {
          name: 'JavaScript',
          icon: 'devicon-javascript-plain colored',
          level: 'Avanzado',
          usage: 'Base sólida ESNext, rendimiento DOM, Web APIs y Three.js.',
        },
      ],
    },
    {
      id: 'backend',
      code: 'LAYER_02',
      title: 'Backend / APIs',
      subtitle: 'Microservicios & Datos',
      icon: 'dns',
      spanClass: 'md:col-span-3 lg:col-span-4',
      accent: 'blue',
      skills: [
        {
          name: 'NestJS',
          icon: 'devicon-nestjs-plain colored',
          level: 'Avanzado',
          usage: 'Microservicios transaccionales en Multicenter y API JWT + Prisma en Render.',
        },
        {
          name: 'Node.js',
          icon: 'devicon-nodejs-plain colored',
          level: 'Avanzado',
          usage: 'APIs REST de alto rendimiento, workers y automatización.',
        },
        {
          name: 'Laravel / PHP',
          icon: 'devicon-laravel-plain colored',
          level: 'Avanzado',
          usage: 'Backend completo de Círculo Rojo Web, cobros y control de roles.',
        },
        {
          name: 'PostgreSQL / SQL',
          icon: 'devicon-postgresql-plain colored',
          level: 'Avanzado',
          usage: 'Optimización SQL Server, MySQL y PostgreSQL serverless en Neon.',
        },
      ],
    },
    {
      id: 'mobile',
      code: 'LAYER_03',
      title: 'Mobile Apps',
      subtitle: 'iOS & Android nativo',
      icon: 'smartphone',
      spanClass: 'md:col-span-2 lg:col-span-3',
      accent: 'purple',
      skills: [
        {
          name: 'Flutter',
          icon: 'devicon-flutter-plain colored',
          level: 'Avanzado',
          usage: 'App móvil Círculo Rojo publicada en App Store con credencial QR.',
        },
        {
          name: 'Dart',
          icon: 'devicon-dart-plain colored',
          level: 'Avanzado',
          usage: 'Arquitectura limpia, manejo de estado y animaciones a 60fps.',
        },
      ],
    },
    {
      id: 'cloud',
      code: 'LAYER_04',
      title: 'Cloud & Serverless',
      subtitle: 'Alta disponibilidad 99.9%',
      icon: 'cloud_done',
      spanClass: 'md:col-span-4 lg:col-span-7',
      accent: 'cyan',
      isFeatured: true,
      skills: [
        {
          name: 'AWS Cloud',
          icon: 'devicon-amazonwebservices-original colored',
          level: 'Avanzado',
          usage: 'Infraestructura en la nube, almacenamiento, IAM y despliegue seguro.',
        },
        {
          name: 'AWS Lambdas',
          icon: 'devicon-amazonwebservices-plain colored',
          level: 'Avanzado',
          usage: 'Funciones serverless para procesamiento transaccional de puntos.',
        },
        {
          name: 'DigitalOcean',
          icon: 'devicon-digitalocean-original colored',
          level: 'Intermedio+',
          usage: 'Droplets Linux, proxies inversos Nginx y despliegue continuo.',
        },
        {
          name: 'Linux',
          icon: 'devicon-linux-plain',
          level: 'Avanzado',
          usage: 'Administración de servidores, bash scripting, logs y monitoreo.',
        },
        {
          name: 'Edge / Vercel & Render',
          icon: 'devicon-vercel-original',
          level: 'Avanzado',
          usage: 'Despliegue full-stack desacoplado con CI/CD automático desde Git.',
        },
      ],
    },
    {
      id: 'architecture',
      code: 'LAYER_05',
      title: 'Arquitectura & AI',
      subtitle: 'Escalabilidad & Automatización',
      icon: 'psychology',
      spanClass: 'md:col-span-6 lg:col-span-5',
      accent: 'gold',
      skills: [
        {
          name: 'Microservicios & Docker',
          icon: 'devicon-docker-plain colored',
          level: 'Avanzado',
          usage: 'Contenedores reproducibles, colas, conciliación y desacoplamiento.',
        },
        {
          name: 'Prisma ORM',
          icon: 'devicon-prisma-original',
          level: 'Avanzado',
          usage: 'Modelado de datos tipado y migraciones sobre Neon PostgreSQL.',
        },
        {
          name: 'OpenAI / LLMs',
          icon: 'devicon-python-plain colored',
          level: 'Intermedio+',
          usage: 'Integración de asistentes inteligentes y flujos adaptativos con IA.',
        },
      ],
    },
  ];

  readonly allSkills = computed(() => this.categories.flatMap((c) => c.skills));

  constructor(
    public langService: LanguageService,
    private readonly audioService: AudioService,
  ) {}

  selectSkill(skill: Skill): void {
    this.audioService.playClick();
    if (this.selectedSkill()?.name === skill.name) {
      this.selectedSkill.set(null);
      return;
    }
    this.selectedSkill.set(skill);
  }

  onCardPointerMove(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement | null;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }
}
