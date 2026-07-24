import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../services/audio-service';
import { LanguageService } from '../../services/language';

interface CommandOutput {
  command: string;
  response: string;
  isError?: boolean;
}

@Component({
  selector: 'app-terminal',
  imports: [FormsModule],
  templateUrl: './terminal.html',
  styleUrl: './terminal.css',
})
export class Terminal implements AfterViewChecked {
  @ViewChild('terminalContainer') private terminalContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('cmdInput') private cmdInput!: ElementRef<HTMLInputElement>;

  inputCommand = '';
  history: CommandOutput[] = [
    {
      command: 'welcome',
      response: 'Sistema MACS OS v4.2 [Cyber-Core Iniciado]\nEscribe "help" o presiona uno de los botones para explorar mi perfil.',
    },
  ];

  isMatrixMode = false;

  quickCommands = ['help', 'skills', 'projects', 'experience', 'sudo hire', 'clear'];

  constructor(
    public audioService: AudioService,
    public langService: LanguageService
  ) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.terminalContainer) {
        this.terminalContainer.nativeElement.scrollTop = this.terminalContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  runCommand(cmdString?: string) {
    const rawCmd = cmdString || this.inputCommand;
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    this.audioService.playTerminalTick();

    let response = '';
    let isError = false;

    switch (cmd) {
      case 'help':
        response = `Comandos Disponibles:
  - help: Muestra esta lista de comandos.
  - skills: Lista el Stack Tecnológico principal.
  - projects: Resumen de proyectos SaaS & IA desarrollados.
  - experience: Historial de experiencia laboral (MULTICENTER, INTECRUZ).
  - contact: Información directa de correo y LinkedIn.
  - matrix: Activa/desactiva el modo Matrix cibernético.
  - clear: Limpia la pantalla de la terminal.
  - sudo hire: Ejecuta el protocolo especial de contratación.`;
        break;

      case 'skills':
        response = `STACK TECNOLÓGICO:
  • Frontend: JavaScript, TypeScript, Angular, React, Next.js, Vue 3
  • Backend: Laravel (PHP Core), Node.js, NestJS, REST APIs, Microservicios
  • Cloud & DevOps: AWS Cloud, AWS Lambdas, DigitalOcean, Linux Servers
  • Mobile: Flutter, Dart
  • IA & DB: OpenAI/LLMs, SQL Server, Docker`;
        break;

      case 'projects':
        response = `PROYECTOS DESTACADOS:
  1. Sistema MIP [SaaS Industrial]
  2. Círculo Rojo Web [Sistema de Gestión & Cobros] -> circulorojo.com.bo
  3. Círculo Rojo App [App Móvil Nativa iOS/Android]
  4. Coach Virtual [Motor de IA Asistido por LLMs] -> coachvirtualfis.netlify.app
  5. Veterinaria SaaS & Control de Asistencia Enterprise`;
        break;

      case 'experience':
        response = `EXPERIENCIA PROFESIONAL:
  • 2026 - Presente | MULTICENTER [Backend Developer]
    - Diseño y despliegue del módulo de Puntos de Fidelización de Clientes.
  • 2025 - 2026 | INTECRUZ [Full Stack Developer]
    - Soluciones de software end-to-end, automatización e integración de APIs.`;
        break;

      case 'contact':
        response = `CONTACTO DIRECTO:
  • Correo: mangelcs2003@gmail.com
  • LinkedIn: linkedin.com/in/miguel-cesary
  • Estado: 🟢 Disponible para Nuevos Proyectos & Consultoría IA`;
        break;

      case 'matrix':
        this.isMatrixMode = !this.isMatrixMode;
        response = this.isMatrixMode
          ? 'PROTOCOL MATRIX: ACTIVADO. Bienvenido a la realidad cuántica.'
          : 'PROTOCOL MATRIX: DESACTIVADO. Retornando a la terminal estándar.';
        break;

      case 'clear':
        this.history = [];
        this.inputCommand = '';
        return;

      case 'sudo hire':
      case 'hire':
        response = `🚀 PROTOCOLO DE CONTRATACIÓN EJECUTADO CON ÉXITO:
  - Candidato: Miguel Angel Cesary Sorioco
  - Rol: Full Stack AI Engineer
  - Status: Listo para integrarse a tu equipo o proyecto industrial.
  Enviando correo a mangelcs2003@gmail.com...`;
        window.location.href = 'mailto:mangelcs2003@gmail.com?subject=Oferta%20de%20Trabajo%20/%20Proyecto';
        break;

      default:
        isError = true;
        response = `Comando no reconocido: "${rawCmd}". Escribe "help" para ver las opciones disponibles.`;
        break;
    }

    this.history.push({
      command: rawCmd,
      response,
      isError,
    });

    this.inputCommand = '';
  }

  focusInput() {
    if (this.cmdInput) {
      this.cmdInput.nativeElement.focus();
    }
  }
}
