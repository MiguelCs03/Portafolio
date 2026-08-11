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
      badge: 'MIGUEL ANGEL CESARY • FULL STACK DEVELOPER',
      subtitle: 'INGENIERO DE SISTEMAS | 2 AÑOS DE EXPERIENCIA | FULL STACK DEVELOPER',
      titleLine1: 'SOLUCIONES INTELIGENTES,',
      titleGlow: 'ARQUITECTURAS ROBUSTAS.',
      desc: '2 años de experiencia profesional diseñando y desarrollando aplicaciones web, móviles y microservicios escalables con NestJS, Angular, Node.js, Laravel, AWS y Flutter.',
      btnProjects: 'EXPLORAR PROYECTOS',
      btnHire: 'CONTACTAR AHORA'
    },
    tech: {
      title: 'Tech Stack',
      desc: 'Tecnologías de vanguardia para arquitecturas robustas.'
    },
    experience: {
      title: 'Experiencia Profesional',
      period1: '2025 - Presente',
      desc1: 'Desarrollador Full Stack a cargo del diseño, desarrollo frontend en Angular y despliegue del módulo transaccional de Multipuntos Multicenter. Microservicios con NestJS, AWS Lambdas y optimización de base de datos SQL Server.',
      period2: '2024 - 2025',
      desc2: 'Desarrollador Full Stack a cargo de la creación de aplicaciones web y móviles de extremo a extremo, desarrollo de APIs REST, automatización y plataformas empresariales con PHP, Laravel, Vue.js, React y Flutter.'
    },
    projects: {
      title: 'Proyectos Destacados',
      desc: 'Sistemas transaccionales, móviles y web desarrollados con estándares de calidad y alto rendimiento.',
      detailsBtn: 'Ver Detalles',
      previewBtn: 'Previsualizar',
      proj1Desc: 'Pest Control SaaS para gestión industrial avanzada con reportería en tiempo real.',
      proj2WebDesc: 'Sistema de gestión web para administración de clientes, cobros y control de comunidad.',
      proj2AppDesc: 'Aplicación móvil nativa en Flutter para fidelización de clientes y credencial digital QR.',
      proj3Desc: 'Entrenamiento asistido por IA con integración de LLMs para aprendizaje adaptativo.',
      proj4Desc: 'Ecosistema de microservicios transaccionales de lealtad y puntos para Multicenter.',
      proj5Desc: 'Sistema empresarial con biometría y reportes de geolocalización.'
    },
    contact: {
      title: '¿Listo para colaborar?',
      desc: 'Envíame un mensaje directo. Me llegará una notificación de inmediato a mi correo personal.',
      labelName: 'Nombre Completo',
      labelEmail: 'Correo Electrónico',
      labelMsg: 'Mensaje',
      placeholderMsg: 'Hola Miguel, me gustaría conversar sobre...',
      btnSend: 'ENVIAR MENSAJE AL CORREO',
      sendingBtn: 'ENVIANDO MENSAJE...',
      validationName: 'Por favor ingresa tu nombre.',
      validationEmail: 'Ingresa un correo electrónico válido.',
      validationMsg: 'Por favor escribe un mensaje.',
      sentTitle: '¡Mensaje Enviado!',
      sentDesc: 'Tu mensaje se ha enviado exitosamente a mangelcs2003@gmail.com. Te responderé muy pronto.'
    },
    footer: {
      copyright: '© 2026 Miguel Angel Cesary Sorioco • Full Stack Developer'
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
      badge: 'MIGUEL ANGEL CESARY • FULL STACK DEVELOPER',
      subtitle: 'SYSTEMS ENGINEER | 2 YEARS OF EXPERIENCE | FULL STACK DEVELOPER',
      titleLine1: 'INTELLIGENT SOLUTIONS,',
      titleGlow: 'ROBUST ARCHITECTURES.',
      desc: '2 years of professional experience designing and developing web apps, mobile apps, and scalable microservices with NestJS, Angular, Node.js, Laravel, AWS, and Flutter.',
      btnProjects: 'EXPLORE PROJECTS',
      btnHire: 'CONTACT NOW'
    },
    tech: {
      title: 'Tech Stack',
      desc: 'Cutting-edge technologies for robust architectures.'
    },
    experience: {
      title: 'Professional Experience',
      period1: '2025 - Present',
      desc1: 'Full Stack Developer in charge of designing, building Angular web interfaces, and deploying the Multicenter Loyalty Points module. Microservices with NestJS, AWS Lambdas, and SQL Server database optimization.',
      period2: '2024 - 2025',
      desc2: 'Full Stack Developer in charge of building end-to-end web and mobile apps, REST APIs, automation, and enterprise platforms with PHP, Laravel, Vue.js, React, and Flutter.'
    },
    projects: {
      title: 'Featured Projects',
      desc: 'Transactional, mobile, and web systems built with high performance and quality standards.',
      detailsBtn: 'View Details',
      previewBtn: 'Preview Website',
      proj1Desc: 'Pest Control SaaS for advanced industrial management with real-time reporting.',
      proj2WebDesc: 'Web management system for customer administration, billing, and community control.',
      proj2AppDesc: 'Native Flutter mobile application for customer loyalty and QR digital credentials.',
      proj3Desc: 'AI-assisted coaching featuring LLM integration for adaptive learning.',
      proj4Desc: 'Loyalty points transactional microservices ecosystem for Multicenter.',
      proj5Desc: 'Enterprise system featuring biometrics and geolocation reports.'
    },
    contact: {
      title: 'Ready to collaborate?',
      desc: "Send me a direct message. I will receive an instant notification in my personal email inbox.",
      labelName: 'Full Name',
      labelEmail: 'Email Address',
      labelMsg: 'Message',
      placeholderMsg: 'Hi Miguel, I would like to talk about...',
      btnSend: 'SEND MESSAGE TO EMAIL',
      sendingBtn: 'SENDING MESSAGE...',
      validationName: 'Please enter your name.',
      validationEmail: 'Enter a valid email address.',
      validationMsg: 'Please write a message.',
      sentTitle: 'Message Sent!',
      sentDesc: 'Your message was sent successfully to mangelcs2003@gmail.com. I will reply shortly.'
    },
    footer: {
      copyright: '© 2026 Miguel Angel Cesary Sorioco • Full Stack Developer'
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

