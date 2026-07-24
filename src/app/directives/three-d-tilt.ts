import { Directive, ElementRef, HostListener, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appThreeDTilt]',
})
export class ThreeDTilt implements OnInit {
  private glareContainer!: HTMLDivElement;
  private glareInner!: HTMLDivElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'transform-style', 'preserve-3d');
  }

  ngOnInit() {
    const card = this.el.nativeElement;

    // Create glare wrapper dynamically
    this.glareContainer = this.renderer.createElement('div');
    this.renderer.addClass(this.glareContainer, 'js-tilt-glare');

    this.glareInner = this.renderer.createElement('div');
    this.renderer.addClass(this.glareInner, 'js-tilt-glare-inner');

    this.renderer.appendChild(this.glareContainer, this.glareInner);
    this.renderer.appendChild(card, this.glareContainer);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const card = this.el.nativeElement;
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Increased max tilt rotation to 15 degrees for stronger 3D depth
    const maxRotate = 15;
    const rotateX = ((centerY - y) / centerY) * maxRotate;
    const rotateY = ((x - centerX) / centerX) * maxRotate;

    // Set card transform
    this.renderer.setStyle(card, 'transform', `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
    this.renderer.setStyle(card, 'transition', 'transform 0.15s cubic-bezier(0.25, 0.61, 0.355, 1)');

    // Move reflection glare overlay
    this.renderer.setStyle(this.glareInner, 'opacity', '0.6');
    this.renderer.setStyle(
      this.glareInner,
      'transform',
      `translate(-50%, -50%) rotate(30deg) translate3d(${(x - rect.width / 2) * 0.4}px, ${(y - rect.height / 2) * 0.4}px, 0px)`
    );

    // Apply Z-axis parallax translation to nested elements with class 'app-parallax'
    const parallaxElements = card.querySelectorAll('.app-parallax');
    parallaxElements.forEach((child: any) => {
      this.renderer.setStyle(child, 'transform', 'translateZ(30px)');
      this.renderer.setStyle(child, 'transition', 'transform 0.15s cubic-bezier(0.25, 0.61, 0.355, 1)');
    });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    const card = this.el.nativeElement;

    // Reset card transform
    this.renderer.setStyle(card, 'transform', 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    this.renderer.setStyle(card, 'transition', 'transform 0.6s cubic-bezier(0.25, 0.61, 0.355, 1)');

    // Fade out glare
    this.renderer.setStyle(this.glareInner, 'opacity', '0');
    this.renderer.setStyle(this.glareInner, 'transform', 'translate(-50%, -50%) rotate(30deg)');

    // Reset Z-axis parallax on nested elements
    const parallaxElements = card.querySelectorAll('.app-parallax');
    parallaxElements.forEach((child: any) => {
      this.renderer.setStyle(child, 'transform', 'translateZ(0px)');
      this.renderer.setStyle(child, 'transition', 'transform 0.6s cubic-bezier(0.25, 0.61, 0.355, 1)');
    });
  }
}
