import { Component, ElementRef, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LINKS } from './links';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  // Sticky on the host: a sticky <header> inside an equally tall host would scroll away with it
  host: { class: 'sticky top-0 z-20 block' },
  template: `
    <header class="border-b-2 border-ink bg-paper">
      <!-- Phones: logo and button in one row, the navigation below; one row from md -->
      <div class="mx-auto box-content flex max-w-[1280px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6 md:py-3">
        <a routerLink="/" fragment="top" class="flex items-center">
          <img src="assets/brand/logo-black.webp" alt="Schnittstellenpass" width="1200" height="656" class="block h-8 w-auto md:h-10" />
        </a>
        <nav aria-label="Hauptnavigation" class="order-last flex w-full justify-between font-mono text-[12px] uppercase tracking-[.08em] sm:justify-start sm:gap-6 sm:text-[13px] md:order-none md:w-auto">
          @for (item of navItems; track item.fragment) {
            <a routerLink="/" [fragment]="item.fragment" class="py-1.5 hover:text-moss md:py-0">{{ item.label }}</a>
          }
        </nav>
        <a [href]="links.spotify" target="_blank" rel="noopener noreferrer" class="rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-paper hover:bg-moss md:px-[18px] md:py-2.5 md:text-[14px]">Jetzt reinhören</a>
      </div>
    </header>
  `
})
export class SiteHeaderComponent {
  protected readonly links = LINKS;
  protected readonly navItems = [
    { fragment: 'live', label: 'Live' },
    { fragment: 'folgen', label: 'Folgen' },
    { fragment: 'ueber', label: 'Über' },
    { fragment: 'social', label: 'Social' }
  ];

  constructor() {
    // The router's anchor scrolling ignores CSS scroll-margin; keep section
    // headings clear of the sticky header, which wraps on narrow screens
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    inject(ViewportScroller).setOffset(() => [0, host.offsetHeight]);
  }
}
