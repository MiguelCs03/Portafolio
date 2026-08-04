import { Injectable, computed, signal } from '@angular/core';

const translations = {
  es: {
    nav: {
      tech: 'Tech',
      experience: 'Experiencia',
      projects: 'Proyectos',
      contact: 'Contacto',
      resume: 'Resume'
    },
    hero: {
      badge: 'MIGUEL ANGEL CESARY • FULL STACK & CLOUD ARCHITECT',
      subtitle: 'INGENIERO DE SISTEMAS | ARQUITECTO BACKEND & DESARROLLADOR FULL STACK',
      titleLine1: 'SOLUCIONES INTELIGENTES,',
      titleGlow: 'ARQUITECTURAS ROBUSTAS.',
      desc: 'Especializado en NestJS, Node.js, Laravel, AWS Serverless y Flutter. Diseño y desarrollo sistemas de alto rendimiento, microservicios e integración de IA.',
      btnProjects: 'EXPLORAR PROYECTOS',
      btnHire: 'CONTACTAR AHORA'
    },
    tech: {
      title: 'Tech Stack',
      desc: 'Tecnologías de vanguardia para arquitecturas robustas.'
    },
    experience: {
      title: 'Experiencia Profesional',
      period1: '2026 - Presente',
      desc1: 'Desarrollador Backend a cargo del diseño y despliegue del módulo transaccional de Multipuntos Multicenter. Microservicios con NestJS, AWS Lambdas y optimización de base de datos SQL Server.',
      period2: '2025 - 2026',
      desc2: 'Desarrollador Full Stack a cargo de la creación de soluciones de software de extremo a extremo, automatización de flujos de trabajo e integraciones de API modernas.'
    },
    projects: {
      title: 'Proyectos Destacados',
      desc: 'Sistemas transaccionales y escalables con enfoque en la experiencia de usuario.',
      detailsBtn: 'Ver Detalles',
      previewBtn: 'Previsualizar',
      proj1Desc: 'Pest Control SaaS para gestión industrial avanzada con reportería en tiempo real.',
      proj2WebDesc: 'Sistema de gestión web actualizado para administración de clientes, cobros y control de comunidad.',
      proj2AppDesc: 'Aplicación móvil nativa para fidelización de clientes y gestión de comunidades, desarrollada en INTECRUZ.',
      proj3Desc: 'Entrenamiento asistido por IA con integración de LLMs para aprendizaje adaptativo.',
      proj4Desc: 'Ecosistema de microservicios transaccionales de lealtad y puntos para Multicenter.',
      proj5Desc: 'Sistema empresarial con biometría y reportes de geolocalización.'
    },
    contact: {
      title: '¿Listo para impulsar tu proyecto?',
      desc: 'Hablemos sobre arquitecturas escalables, microservicios o soluciones con Inteligencia Artificial.',
      labelName: 'Nombre Completo',
      labelEmail: 'Correo Electrónico',
      labelMsg: 'Mensaje',
      placeholderMsg: 'Cuéntame sobre tu proyecto o consulta...',
      btnSend: 'ENVIAR MENSAJE',
      validationName: 'El nombre es requerido.',
      validationEmail: 'Ingresa un correo electrónico válido.',
      validationMsg: 'El mensaje es requerido.',
      sentTitle: '¡Mensaje Enviado!',
      sentDesc: 'Gracias por ponerte en contacto. Te responderé lo antes posible.'
    },
    footer: {
      copyright: '© 2026 Miguel Angel Cesary Sorioco • Full Stack & Cloud Engineer'
    }
  },
  en: {
    nav: {
      tech: 'Tech',
      experience: 'Experience',
      projects: 'Projects',
      contact: 'Contact',
      resume: 'Resume'
    },
    hero: {
      badge: 'MIGUEL ANGEL CESARY • FULL STACK & CLOUD ARCHITECT',
      subtitle: 'SYSTEMS ENGINEER | BACKEND ARCHITECT & FULL STACK DEVELOPER',
      titleLine1: 'INTELLIGENT SOLUTIONS,',
      titleGlow: 'ROBUST ARCHITECTURES.',
      desc: 'Specialized in NestJS, Node.js, Laravel, AWS Serverless & Flutter. Designing high-performance scalable systems, microservices & AI integrations.',
      btnProjects: 'EXPLORE PROJECTS',
      btnHire: 'CONTACT NOW'
    },
    tech: {
      title: 'Tech Stack',
      desc: 'Cutting-edge technologies for robust architectures.'
    },
    experience: {
      title: 'Professional Experience',
      period1: '2026 - Present',
      desc1: 'Backend Developer in charge of designing and deploying the Multicenter Loyalty Points module. Microservices with NestJS, AWS Lambdas, and SQL Server database optimization.',
      period2: '2025 - 2026',
      desc2: 'Full Stack Developer in charge of building end-to-end custom software solutions, workflow automation, and modern API integrations.'
    },
    projects: {
      title: 'Featured Projects',
      desc: 'Transactional and scalable systems with a focus on user experience.',
      detailsBtn: 'View Details',
      previewBtn: 'Preview Website',
      proj1Desc: 'Pest Control SaaS for advanced industrial management with real-time reporting.',
      proj2WebDesc: 'Updated web management system for customer administration, billing, and community control.',
      proj2AppDesc: 'Native mobile application for customer loyalty and community management, built at INTECRUZ.',
      proj3Desc: 'AI-assisted coaching featuring LLM integration for adaptive learning.',
      proj4Desc: 'Loyalty points transactional microservices ecosystem for Multicenter.',
      proj5Desc: 'Enterprise system featuring biometrics and geolocation reports.'
    },
    contact: {
      title: 'Ready for the next level?',
      desc: "If you're looking for a robust software architecture or AI integrations in your processes, let's talk about how I can help.",
      labelName: 'Full Name',
      labelEmail: 'Email Address',
      labelMsg: 'Message',
      placeholderMsg: 'Tell me about your project...',
      btnSend: 'SEND MESSAGE',
      validationName: 'Name is required.',
      validationEmail: 'Enter a valid email address.',
      validationMsg: 'Message is required.',
      sentTitle: 'Message Sent!',
      sentDesc: 'Thanks for getting in touch. I will respond to you as soon as possible.'
    },
    footer: {
      copyright: '© 2026 Miguel Angel Cesary Sorioco • Full Stack AI Engineer'
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<'es' | 'en'>('es');

  t = computed(() => {
    const lang = this.currentLang();
    return translations[lang];
  });

  toggleLanguage() {
    this.currentLang.set(this.currentLang() === 'es' ? 'en' : 'es');
  }
}
