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
      btnHire: 'CONTRATAR'
    },
    tech: {
      title: 'Tech Stack',
      desc: 'Tecnologías de vanguardia para arquitecturas robustas.'
    },
    experience: {
      title: 'Experiencia Profesional',
      period1: '2022 - Presente',
      desc1: 'Liderando la optimización de procesos internos y plataformas de e-commerce mediante arquitecturas escalables. Implementación de microservicios y mejora continua del rendimiento del sistema.',
      period2: '2020 - 2022',
      desc2: 'Desarrollo de soluciones personalizadas para clientes industriales, automatización de flujos de trabajo y creación de aplicaciones móviles de alto impacto.'
    },
    projects: {
      title: 'Proyectos Destacados',
      desc: 'Sistemas escalables con enfoque en la experiencia de usuario.',
      detailsBtn: 'Ver Detalles',
      proj1Desc: 'Pest Control SaaS para gestión industrial avanzada con reportería en tiempo real.',
      proj2Desc: 'Aplicación móvil nativa para la gestión de comunidades y fidelización de clientes.',
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
      btnHire: 'HIRE ME'
    },
    tech: {
      title: 'Tech Stack',
      desc: 'Cutting-edge technologies for robust architectures.'
    },
    experience: {
      title: 'Professional Experience',
      period1: '2022 - Present',
      desc1: 'Leading the optimization of internal processes and e-commerce platforms using scalable architectures. Microservices implementation and continuous system performance improvements.',
      period2: '2020 - 2022',
      desc2: 'Development of custom solutions for industrial clients, workflow automation, and creation of high-impact mobile applications.'
    },
    projects: {
      title: 'Featured Projects',
      desc: 'Scalable systems with a focus on user experience.',
      detailsBtn: 'View Details',
      proj1Desc: 'Pest Control SaaS for advanced industrial management with real-time reporting.',
      proj2Desc: 'Native mobile application for community management and client loyalty.',
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
