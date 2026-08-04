import { Component, computed } from '@angular/core';
import { ThreeDTilt } from '../../directives/three-d-tilt';
import { ScrollReveal } from '../../directives/scroll-reveal';
import { LanguageService } from '../../services/language';
import { AudioService } from '../../services/audio-service';
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
    public audioService: AudioService
  ) {}

  openModal(proj: ExtendedProject) {
    this.audioService.playSwoosh();
    this.selectedProject = proj;
  }

  closeModal() {
    this.selectedProject = null;
  }

  projects = computed<ExtendedProject[]>(() => {
    const t = this.langService.t();
    return [
      {
        title: 'Sistema MIP',
        category: 'SaaS',
        categoryClass: 'bg-primary/90 text-on-primary',
        description: t.projects.proj1Desc,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGDGY4byOd0HsPBGmKAs1UzZjSa9Tr93AUt6m4NgGvM-v9wEkokDe_D116zuUL4_edraLxbyp9_ePIyILz_zInzcY__TkUcAAJJrSehs-kPnFsooKm33GzIrJDrYtxYEoJc4hsUfoVafsNHfRK4fESAQ-aSMyMYgOiDSdrxs1cElCFbDmkgb1WLROpFQqF3qcSihYGB1oUHa5-mGyjqJwZKOqfGVc6GatXmcxSq2DZvI5IuHl2aj2f0JWpd0ZVOnhbhDtC1SW6k9o',
        icons: ['database', 'cloud_done'],
        architectureDetails: 'Arquitectura SaaS multitenant con procesamiento asíncrono de reportes industriales y paneles de telemetría en tiempo real.',
        keyFeatures: ['Gestión multitenant', 'Reportería en tiempo real', 'Panel de alertas avanzadas', 'Exportación de datos PDF/Excel'],
        techStackBadges: ['Laravel', 'Vue 3', 'Node.js', 'PostgreSQL', 'Redis']
      },
      {
        title: 'Círculo Rojo (Web)',
        category: 'SYSTEM',
        categoryClass: 'bg-secondary/90 text-on-secondary',
        description: t.projects.proj2WebDesc,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBITgj8r0zbphqhSuXJIhTOL4yfJX4e3O-6-qxcru9k_30AvZp801MSHqkS3oyn9WiyawtgbyH7NFEooysvAhuxyR_mnoOJuDbLS1W_6God7jcQEnVTudSpPGFxXuKfXABgb9-2vPV3nvLbYisvQUXI_u4LiL93t2qQbJLGl1Pnn6jMhSYM-7XnfATkLpmJS4l5Mb0H03Jjo1EO1yB-xqMCZf4WHdVaA2sKOG65bp-xRqfI0WUhhcn32fS_7bvzltfHrQwoioFQkwM',
        icons: ['computer', 'dns'],
        link: 'https://circulorojo.com.bo/',
        architectureDetails: 'Plataforma web de administración centralizada conectada con microservicios REST para gestión de miembros, transacciones y facturación.',
        keyFeatures: ['Administración de cobros', 'Control de miembros y roles', 'Dashboard estadístico', 'Conexión con pasarelas de pago'],
        techStackBadges: ['Laravel', 'Node.js', 'REST API', 'MySQL', 'TailwindCSS']
      },
      {
        title: 'Círculo Rojo (App)',
        category: 'MOBILE',
        categoryClass: 'bg-secondary/90 text-on-secondary',
        description: t.projects.proj2AppDesc,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBITgj8r0zbphqhSuXJIhTOL4yfJX4e3O-6-qxcru9k_30AvZp801MSHqkS3oyn9WiyawtgbyH7NFEooysvAhuxyR_mnoOJuDbLS1W_6God7jcQEnVTudSpPGFxXuKfXABgb9-2vPV3nvLbYisvQUXI_u4LiL93t2qQbJLGl1Pnn6jMhSYM-7XnfATkLpmJS4l5Mb0H03Jjo1EO1yB-xqMCZf4WHdVaA2sKOG65bp-xRqfI0WUhhcn32fS_7bvzltfHrQwoioFQkwM',
        icons: ['smartphone', 'bolt'],
        link: 'https://apps.apple.com/br/app/circulo-rojo/id6759011308',
        architectureDetails: 'Aplicación nativa móvil con soporte iOS/Android optimizada para baja latencia, notificaciones push en tiempo real y credencial digital.',
        keyFeatures: ['Fidelización por puntos', 'Credencial QR digital', 'Notificaciones Push inteligentes', 'Sincronización offline'],
        techStackBadges: ['Flutter', 'Dart', 'Firebase Push', 'REST API']
      },
      {
        title: 'Coach Virtual',
        category: 'AI ENGINE',
        categoryClass: 'bg-tertiary-container text-on-tertiary-container',
        description: t.projects.proj3Desc,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1jIBsuYuP13OyxVrPxdi6SuVPODTFbO7AZU9o8jt4Ws--Cw6gTiWEeq5ShSnS07CfLC_2Mw1U-4OqRxC2WeAXu4AgMk2z6VbZNFx7FP6kayldm2z_8Gf9WOAXWB3NZ1Z2WXmQRClTRfB7CvzGW0_KnDPxQKOaaNazD8JO23WWntiq9dhnioTzPKRcuaCP8zcAnT_BpYRxpcmluMmBCL-m_18H_NMjNCsSU7TzS3MYEEcZS4Z29H_MVJ6lfK5OdSxviKa2qLm_-Is',
        icons: ['psychology', 'auto_awesome'],
        borderClass: 'border-primary/30',
        isFeatured: true,
        link: 'https://coachvirtualfis.netlify.app/',
        architectureDetails: 'Motor de Inteligencia Artificial impulsado por integración con OpenAI GPT-4 y arquitecturas RAG para retroalimentación adaptativa.',
        keyFeatures: ['Integración con OpenAI / LLMs', 'Algoritmos adaptativos', 'Interacción en tiempo real', 'Análisis de progreso'],
        techStackBadges: ['React', 'Next.js', 'OpenAI API', 'Node.js', 'TypeScript']
      },
      {
        title: 'Multipuntos Multicenter',
        category: 'FINTECH & LOYALTY',
        categoryClass: 'bg-primary/90 text-on-primary font-bold',
        description: t.projects.proj4Desc,
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67e0e84b80?q=80&w=1200&auto=format&fit=crop',
        icons: ['stars', 'account_balance_wallet'],
        borderClass: 'border-primary/40',
        isFeatured: true,
        link: 'https://www.multicenter.com/multipuntos',
        architectureDetails: 'Arquitectura distribuida en microservicios backend desarrollados con NestJS y despliegue serverless en AWS Lambdas para la gestión transaccional de puntos de fidelización, reglas dinámicas de conversión y conciliación.',
        keyFeatures: ['Sistema de Acumulación y Canje de Puntos', 'Microservicios Backend en NestJS', 'Despliegue Serverless con AWS Lambdas', 'Reglas y Tasas de Conversión Dinámicas', 'Procesamiento Masivo y Conciliación'],
        techStackBadges: ['NestJS', 'TypeScript', 'Node.js', 'AWS Lambdas', 'Docker', 'PostgreSQL', 'SQL Server']
      },
      {
        title: 'Control de Asistencia',
        category: 'ENTERPRISE',
        categoryClass: 'bg-primary/90 text-on-primary',
        description: t.projects.proj5Desc,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChs2UrgNmWyPiKkVL5Xf7E2SpXq_UY67DjFKshkfgvxPH7Mt_NgOoriuXvpXxpYFuGMpQ02OrZXmncfxiobcSfKcNrmhdUNgawYh0EHGRV2FbXVqkqqjG4giNAXufqFyVirNA3qZpnW7PeTtbeKqyLV2QRX6X8EQ2AxEKxF6pUh_mefxT05RcfRNM0Q-VUDF3j9pXzrqqfHMurOdkrAjO6T__Z9eZ6QhIGOVV1WEvBZHYQ2AA-GPY8xyWNsVDIaebpJB69ABR1i9Q',
        icons: ['fingerprint'],
        architectureDetails: 'Sistema corporativo con biometría avanzada, geolocalización GPS y generación automática de planillas de asistencia.',
        keyFeatures: ['Validación biométrica', 'Marcación GPS en tiempo real', 'Reportes de nómina', 'Módulo de justificaciones'],
        techStackBadges: ['PHP', 'JavaScript', 'SQL Server', 'REST API']
      }
    ];
  });
}
