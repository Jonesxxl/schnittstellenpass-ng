import { Directive, ElementRef, OnDestroy, OnInit, Service, inject } from '@angular/core';

/**
 * One observer for all revealed elements, so elements that enter the viewport
 * together fade in with a short stagger.
 */
@Service()
export class RevealObserver {
  private observer: IntersectionObserver | null = null;

  observe(element: HTMLElement): void {
    this.observer ??= new IntersectionObserver(entries => this.reveal(entries), {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });
    this.observer.observe(element);
  }

  unobserve(element: HTMLElement): void {
    this.observer?.unobserve(element);
  }

  private reveal(entries: IntersectionObserverEntry[]): void {
    let index = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        continue;
      }
      const element = entry.target as HTMLElement;
      element.style.transition = 'opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1)';
      element.style.transitionDelay = `${index++ * 90}ms`;
      element.style.opacity = '1';
      element.style.transform = 'none';
      this.observer?.unobserve(element);
      setTimeout(() => {
        element.style.transition = '';
        element.style.transitionDelay = '';
        element.style.transform = '';
      }, 1400);
    }
  }
}

/**
 * Fades the element in when it scrolls into view. Does nothing if the user
 * prefers reduced motion.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective implements OnInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly observer = inject(RevealObserver);

  ngOnInit(): void {
    if (typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    this.element.style.opacity = '0';
    this.element.style.transform = 'translateY(28px)';
    this.observer.observe(this.element);
  }

  ngOnDestroy(): void {
    this.observer.unobserve(this.element);
  }
}
