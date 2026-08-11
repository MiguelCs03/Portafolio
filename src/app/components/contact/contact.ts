import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrollReveal } from '../../directives/scroll-reveal';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, ScrollReveal],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  name: string = '';
  email: string = '';
  message: string = '';
  submitted: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string | null = null;
  copiedEmail: boolean = false;

  constructor(public langService: LanguageService) {}

  copyEmail() {
    navigator.clipboard.writeText('mangelcs2003@gmail.com');
    this.copiedEmail = true;
    setTimeout(() => {
      this.copiedEmail = false;
    }, 2500);
  }

  getMailtoLink(): string {
    const subject = encodeURIComponent(`Contacto desde Portafolio - ${this.name || 'Mensaje'}`);
    const body = encodeURIComponent(`Nombre: ${this.name}\nCorreo: ${this.email}\n\nMensaje:\n${this.message}`);
    return `mailto:mangelcs2003@gmail.com?subject=${subject}&body=${body}`;
  }

  async onSubmit() {
    if (!this.name || !this.email || !this.message) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    try {
      const response = await fetch('https://formsubmit.co/ajax/mangelcs2003@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          message: this.message,
          _subject: `Portfolio Contact: ${this.name}`,
          _template: 'table'
        })
      });

      if (response.ok) {
        this.submitted = true;
        this.name = '';
        this.email = '';
        this.message = '';
      } else {
        throw new Error('No se pudo enviar el mensaje.');
      }
    } catch (err) {
      console.error('Error enviando formulario:', err);
      // Fallback to mailto automatically or show error message
      this.errorMessage = 'Hubo un inconveniente al enviar por la API. Puedes enviarme un correo haciendo clic abajo:';
      window.location.href = this.getMailtoLink();
    } finally {
      this.isSubmitting = false;
    }
  }

  resetForm() {
    this.submitted = false;
    this.errorMessage = null;
  }
}

