import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { AudioService } from '../../services/audio-service';
import { LanguageService } from '../../services/language';
import { LaptopRig, createLaptopRig } from './laptop-scene';

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

@Component({
  selector: 'app-laptop-scroll',
  imports: [],
  templateUrl: './laptop-scroll.html',
  styleUrl: './laptop-scroll.css',
})
export class LaptopScroll implements AfterViewInit, OnDestroy {
  @ViewChild('stageSection', { static: true }) stageRef!: ElementRef<HTMLElement>;
  @ViewChild('canvasHost', { static: true }) canvasHostRef!: ElementRef<HTMLDivElement>;

  copiedEmail = false;

  readonly scrollProgress = signal(0);

  readonly heroOpacity = computed(() => clamp01(1 - this.scrollProgress() / 0.22));
  readonly screenTitleOpacity = computed(() => {
    const p = this.scrollProgress();
    const fadeIn = clamp01((p - 0.18) / 0.12);
    const fadeOut = clamp01(1 - (p - 0.42) / 0.1);
    return fadeIn * fadeOut;
  });
  readonly explodedOpacity = computed(() => {
    const p = this.scrollProgress();
    const fadeIn = clamp01((p - 0.48) / 0.12);
    const fadeOut = clamp01(1 - (p - 0.8) / 0.1);
    return fadeIn * fadeOut;
  });
  readonly activeLayer = computed(() => {
    const p = this.scrollProgress();
    if (p < 0.6) return 0;
    if (p < 0.71) return 1;
    return 2;
  });

  readonly layers = [
    {
      index: '01',
      title: 'Pantalla · Angular & Flutter',
      stack: 'Angular 21 · TypeScript · Tailwind · Flutter',
      desc: 'Interfaces modulares reactivas, apps móviles multiplataforma y renderizado 3D fluido.',
    },
    {
      index: '02',
      title: 'Placa · NestJS & PostgreSQL',
      stack: 'NestJS · Node.js · Laravel · Neon / SQL Server',
      desc: 'Microservicios transaccionales, APIs REST seguras, JWT, Prisma ORM y reglas de negocio.',
    },
    {
      index: '03',
      title: 'Chasis · AWS & Cloud Deploy',
      stack: 'AWS Lambda · Docker · Vercel · Render',
      desc: 'Infraestructura serverless escalable, CI/CD automatizado y 99.9% de disponibilidad.',
    },
  ];

  private rig: LaptopRig | null = null;
  private rafId = 0;
  private targetProgress = 0;
  private currentProgress = 0;
  private pointerX = 0;
  private pointerY = 0;
  private smoothPointerX = 0;
  private smoothPointerY = 0;
  private dragX = 0;
  private dragY = 0;
  private isDragging = false;
  private lastDragPos = { x: 0, y: 0 };
  private isDesktop = true;

  constructor(
    public langService: LanguageService,
    public audioService: AudioService,
  ) {}

  ngAfterViewInit(): void {
    this.isDesktop = window.innerWidth >= 1024;
    if (this.isDesktop) {
      this.rig = createLaptopRig(this.canvasHostRef.nativeElement);
    }
    this.updateTargetProgress();

    const startTime = performance.now();
    const tick = (now: number) => {
      this.rafId = requestAnimationFrame(tick);
      if (!this.rig || !this.isDesktop) return;

      this.currentProgress += (this.targetProgress - this.currentProgress) * 0.085;
      this.smoothPointerX += (this.pointerX - this.smoothPointerX) * 0.08;
      this.smoothPointerY += (this.pointerY - this.smoothPointerY) * 0.08;

      if (!this.isDragging) {
        this.dragX *= 0.94;
        this.dragY *= 0.94;
      }

      if (Math.abs(this.currentProgress - this.scrollProgress()) > 0.0015) {
        this.scrollProgress.set(Number(this.currentProgress.toFixed(4)));
      }

      const elapsed = (now - startTime) * 0.001;
      this.rig.update(
        this.currentProgress,
        this.smoothPointerX,
        this.smoothPointerY,
        this.dragX,
        this.dragY,
        elapsed,
        true,
      );
    };
    this.rafId = requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rig?.dispose();
    this.rig = null;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateTargetProgress();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.isDesktop = window.innerWidth >= 1024;
    if (this.isDesktop && !this.rig) {
      this.rig = createLaptopRig(this.canvasHostRef.nativeElement);
    }
    const host = this.canvasHostRef.nativeElement;
    this.rig?.resize(host.clientWidth, host.clientHeight);
    this.updateTargetProgress();
  }

  onPointerMove(event: PointerEvent): void {
    const rect = this.canvasHostRef.nativeElement.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      this.pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    }

    if (this.isDragging) {
      const dx = event.clientX - this.lastDragPos.x;
      const dy = event.clientY - this.lastDragPos.y;
      this.dragX = Math.max(-0.85, Math.min(0.85, this.dragX + dx * 0.006));
      this.dragY = Math.max(-0.55, Math.min(0.55, this.dragY + dy * 0.006));
      this.lastDragPos = { x: event.clientX, y: event.clientY };
    }
  }

  onPointerDown(event: PointerEvent): void {
    this.isDragging = true;
    this.lastDragPos = { x: event.clientX, y: event.clientY };
  }

  @HostListener('window:pointerup')
  onPointerUp(): void {
    this.isDragging = false;
  }

  copyEmail(): void {
    this.audioService.playClick();
    navigator.clipboard.writeText('mangelcs2003@gmail.com');
    this.copiedEmail = true;
    setTimeout(() => {
      this.copiedEmail = false;
    }, 2000);
  }

  scrollToStage(progressTarget: number): void {
    const el = this.stageRef.nativeElement;
    const maxScroll = Math.max(1, el.offsetHeight - window.innerHeight);
    const targetY = el.offsetTop + maxScroll * progressTarget;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }

  private updateTargetProgress(): void {
    const el = this.stageRef.nativeElement;
    const rect = el.getBoundingClientRect();
    const scrollable = Math.max(1, el.offsetHeight - window.innerHeight);
    this.targetProgress = clamp01(-rect.top / scrollable);
  }
}
