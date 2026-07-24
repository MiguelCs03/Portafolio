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

  constructor(public langService: LanguageService) {}

  onSubmit() {
    if (this.name && this.email && this.message) {
      console.log('Contacto enviado:', { name: this.name, email: this.email, message: this.message });
      this.submitted = true;
      
      // Reset form after a delay
      setTimeout(() => {
        this.name = '';
        this.email = '';
        this.message = '';
        this.submitted = false;
      }, 5000);
    }
  }
}
