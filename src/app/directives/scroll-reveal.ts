import { Directive, ElementRef, Renderer2, OnInit, OnDestroy, Input } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
})
export class ScrollReveal implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;

  @Input() revealDelay = 0; // optional delay in milliseconds

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Initial hidden state with a slight downward translation
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(25px)');
    
    // Set transitions using premium cubic-bezier easing for smooth elegant feel
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
    );

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
              this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
            }, this.revealDelay);

            this.observer.unobserve(this.el.nativeElement);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px' // triggers slightly before entering the full screen
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
