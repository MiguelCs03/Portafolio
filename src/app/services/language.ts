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
      subtitle: 'MIGUEL ANGEL CESARY SORIOCO | INGENIERO DE SISTEMAS | FULL STACK DEVELOPER',
      title: 'SOLUCIONES INTELIGENTES,',
      titleGlow: 'POTENCIADAS POR IA.',
      desc: 'Especialista en Laravel, Vue 3, Node.js & Flutter. Creando arquitecturas escalables con integración de IA para la próxima generación de software.',
      btnProjects: 'VER PROYECTOS',
      btnHire: 'CONTÁCTAME'
    },
    tech: {
      title: 'Tech Stack',
      desc: 'Tecnologías de vanguardia para arquitecturas robustas.'
    },
    experience: {
      title: 'Experiencia Profesional',
      period1: '2026 - Presente',
      desc1: 'Desarrollador Backend encargado del diseño y despliegue del nuevo módulo de Puntos de Fidelización de Clientes. Optimización de base de datos SQL Server y flujos transaccionales seguros.',
      period2: '2025 - 2026',
      desc2: 'Desarrollador Full Stack a cargo de la creación de soluciones de software de extremo a extremo, automatización de flujos de trabajo e integraciones de API modernas.'
    },
    projects: {
      title: 'Proyectos Destacados',
      desc: 'Sistemas escalables con enfoque en la experiencia de usuario.',
      detailsBtn: 'Ver Detalles',
      proj1Desc: 'Pest Control SaaS para gestión industrial avanzada con reportería en tiempo real.',
      proj2WebDesc: 'Sistema de gestión web actualizado para administración de clientes, cobros y control de comunidad.',
      proj2AppDesc: 'Aplicación móvil nativa para fidelización de clientes y gestión de comunidades, desarrollada en INTECRUZ.',
      proj3Desc: 'Entrenamiento asistido por IA con integración de LLMs para aprendizaje adaptativo.',
      proj4Desc: 'Ecosistema completo para clínicas veterinarias, control de stock y fichas clínicas.',
      proj5Desc: 'Sistema empresarial con biometría y reportes de geolocalización.'
    },
    contact: {
      title: '¿Listo para el siguiente nivel?',
      desc: 'Si buscas una arquitectura de software robusta o integrar IA en tus procesos, hablemos de cómo puedo ayudarte.',
      labelName: 'Nombre Completo',
      labelEmail: 'Correo Electrónico',
      labelMsg: 'Mensaje',
      placeholderMsg: 'Cuéntame sobre tu proyecto...',
      btnSend: 'ENVIAR MENSAJE',
      validationName: 'El nombre es requerido.',
      validationEmail: 'Ingresa un correo electrónico válido.',
      validationMsg: 'El mensaje es requerido.',
      sentTitle: '¡Mensaje Enviado!',
      sentDesc: 'Gracias por ponerte en contacto. Te responderé lo antes posible.'
    },
    footer: {
      copyright: '© 2026 Miguel Angel Cesary Sorioco • Full Stack AI Engineer'
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
      subtitle: 'MIGUEL ANGEL CESARY SORIOCO | SYSTEMS ENGINEER | FULL STACK DEVELOPER',
      title: 'INTELLIGENT SOLUTIONS,',
      titleGlow: 'POWERED BY AI.',
      desc: 'Specialist in Laravel, Vue 3, Node.js & Flutter. Creating scalable architectures with AI integrations for the next software generation.',
      btnProjects: 'VIEW PROJECTS',
      btnHire: 'CONTACT ME'
    },
    tech: {
      title: 'Tech Stack',
      desc: 'Cutting-edge technologies for robust architectures.'
    },
    experience: {
      title: 'Professional Experience',
      period1: '2026 - Present',
      desc1: 'Backend Developer in charge of the design and deployment of the new Customer Loyalty Points module. Database optimization (SQL Server) and secure transactional workflows.',
      period2: '2025 - 2026',
      desc2: 'Full Stack Developer in charge of building end-to-end custom software solutions, workflow automation, and modern API integrations.'
    },
    projects: {
      title: 'Featured Projects',
      desc: 'Scalable systems with a focus on user experience.',
      detailsBtn: 'View Details',
      proj1Desc: 'Pest Control SaaS for advanced industrial management with real-time reporting.',
      proj2WebDesc: 'Updated web management system for customer administration, billing, and community control.',
      proj2AppDesc: 'Native mobile application for customer loyalty and community management, built at INTECRUZ.',
      proj3Desc: 'AI-assisted coaching featuring LLM integration for adaptive learning.',
      proj4Desc: 'Complete ecosystem for veterinary clinics, stock control, and clinical charts.',
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
