import { Directive, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appScrollSpin]',
})
export class ScrollSpin implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Hide initially to prevent layout flash before animation starts
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Apply 360 spin animation class
            this.renderer.addClass(this.el.nativeElement, 'spin-reveal-active');
            this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');

            // Remove the class after the 1.2s animation finishes
            // This is crucial to avoid conflicting with ThreeDTilt transforms
            setTimeout(() => {
              this.renderer.removeClass(this.el.nativeElement, 'spin-reveal-active');
            }, 1200);

            // Stop observing once animated
            this.observer.unobserve(this.el.nativeElement);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
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
