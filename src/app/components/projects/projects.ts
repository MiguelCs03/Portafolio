import { Component, computed } from '@angular/core';
import { ThreeDTilt } from '../../directives/three-d-tilt';
import { ScrollReveal } from '../../directives/scroll-reveal';
import { LanguageService } from '../../services/language';
import { AudioService } from '../../services/audio-service';
import { AnalyticsService } from '../../services/analytics';
import { ProjectModal, ExtendedProject } from './project-modal';

@Component({
  selector: 'app-projects',
  imports: [ThreeDTilt, ScrollReveal, ProjectModal],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  selectedProject: ExtendedProject | null = null;

  constructor(
    public langService: LanguageService,
    public audioService: AudioService,
    private analytics: AnalyticsService,
  ) {}

  openModal(proj: ExtendedProject) {
    this.audioService.playSwoosh();
    this.analytics.track('project_view', proj.title);
    this.selectedProject = proj;
  }

  closeModal() {
    this.selectedProject = null;
  }

  projects = computed<ExtendedProject[]>(() => {
    const t = this.langService.t();
    return [
      {
        title: 'Multipuntos Multicenter',
        category: 'FINTECH & LOYALTY',
        categoryClass: 'bg-primary/90 text-on-primary font-bold',
        description: t.projects.proj4Desc,
        imageUrl:
          'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
        icons: ['stars', 'account_balance_wallet'],
        borderClass: 'border-primary/40',
        isFeatured: true,
        link: 'https://www.multicenter.com/multipuntos',
        linkText: 'Visitar Multicenter',
        allowIframe: false,
        architectureDetails:
          'Arquitectura Full Stack distribuida con microservicios backend desarrollados en NestJS y frontend modular en Angular, junto con despliegue serverless en AWS Lambdas para la gestión transaccional de puntos de fidelización, reglas dinámicas de conversión y conciliación.',
        keyFeatures: [
          'Sistema de Acumulación y Canje de Puntos',
          'Frontend Modular en Angular',
          'Microservicios Backend en NestJS',
          'Despliegue Serverless con AWS Lambdas',
          'Reglas y Tasas de Conversión Dinámicas',
        ],
        techStackBadges: [
          'NestJS',
          'Angular',
          'TypeScript',
          'Node.js',
          'AWS Lambdas',
          'Docker',
          'PostgreSQL',
          'SQL Server',
        ],
      },
      {
        title: 'Círculo Rojo (Web)',
        category: 'SYSTEM & ADMIN',
        categoryClass: 'bg-secondary/90 text-on-secondary font-bold',
        description: t.projects.proj2WebDesc,
        imageUrl:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        icons: ['computer', 'dns'],
        link: 'https://circulorojo.com.bo/',
        linkText: 'Visitar Círculo Rojo',
        allowIframe: true,
        architectureDetails:
          'Plataforma web de administración centralizada conectada con microservicios REST para gestión de miembros, transacciones y facturación.',
        keyFeatures: [
          'Administración de cobros',
          'Control de miembros y roles',
          'Dashboard estadístico',
          'Conexión con pasarelas de pago',
        ],
        techStackBadges: ['Laravel', 'Node.js', 'REST API', 'MySQL', 'TailwindCSS'],
      },
      {
        title: 'Círculo Rojo (App Móvil)',
        category: 'MOBILE FLUTTER',
        categoryClass: 'bg-secondary/90 text-on-secondary font-bold',
        description: t.projects.proj2AppDesc,
        imageUrl:
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop',
        icons: ['smartphone', 'bolt'],
        link: 'https://apps.apple.com/br/app/circulo-rojo/id6759011308',
        linkText: 'Ver en App Store',
        allowIframe: false,
        architectureDetails:
          'Aplicación nativa móvil desarrollada con Flutter/Dart optimizada para baja latencia, notificaciones push en tiempo real y credencial digital QR.',
        keyFeatures: [
          'Fidelización por puntos',
          'Credencial QR digital',
          'Notificaciones Push inteligentes',
          'Sincronización offline',
        ],
        techStackBadges: ['Flutter', 'Dart', 'Firebase Push', 'REST API', 'iOS / Android'],
      },
      {
        title: 'Coach Virtual',
        category: 'AI ENGINE',
        categoryClass: 'bg-tertiary-container text-on-tertiary-container font-bold',
        description: t.projects.proj3Desc,
        imageUrl:
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        icons: ['psychology', 'auto_awesome'],
        borderClass: 'border-primary/30',
        isFeatured: true,
        link: 'https://coachvirtualfis.netlify.app/',
        linkText: 'Probar Coach Virtual',
        allowIframe: true,
        architectureDetails:
          'Motor de Inteligencia Artificial impulsado por integración con OpenAI GPT-4 y arquitecturas RAG para retroalimentación adaptativa.',
        keyFeatures: [
          'Integración con OpenAI / LLMs',
          'Algoritmos adaptativos',
          'Interacción en tiempo real',
          'Análisis de progreso',
        ],
        techStackBadges: ['React', 'Next.js', 'OpenAI API', 'Node.js', 'TypeScript'],
      },
      {
        title: 'Sistema MIP',
        category: 'EMPRESA PRIVADA',
        categoryClass: 'bg-amber-500/90 text-black font-bold',
        description:
          'Pest Control SaaS para gestión industrial avanzada con reportería en tiempo real. Sistema desarrollado para empresa privada con infraestructura multitenant restringida.',
        imageUrl:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
        icons: ['database', 'lock'],
        isPrivate: true,
        privateNote:
          'Sistema desarrollado exclusivamente para una empresa privada. Por políticas de confidencialidad y acceso restringido, la plataforma no cuenta con demostración pública.',
        architectureDetails:
          'Arquitectura SaaS multitenant privada con procesamiento asíncrono de reportes industriales y paneles de telemetría en tiempo real.',
        keyFeatures: [
          'Gestión multitenant privada',
          'Reportería en tiempo real',
          'Panel de alertas avanzadas',
          'Exportación de datos PDF/Excel',
        ],
        techStackBadges: ['Laravel', 'Vue 3', 'Node.js', 'PostgreSQL', 'Redis'],
      },
    ];
  });
}
