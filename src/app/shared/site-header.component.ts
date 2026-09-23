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
      <div class="mx-auto box-content flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-3">
        <a routerLink="/home" fragment="top" class="flex items-center">
          <img src="assets/brand/logo-black.webp" alt="Schnittstellenpass" width="1200" height="656" class="block h-10 w-auto" />
        </a>
        <nav aria-label="Hauptnavigation" class="flex flex-wrap gap-6 font-mono text-[13px] uppercase tracking-[.08em]">
          @for (item of navItems; track item.fragment) {
            <a routerLink="/home" [fragment]="item.fragment" class="hover:text-moss">{{ item.label }}</a>
          }
        </nav>
        <a [href]="links.spotify" target="_blank" rel="noopener noreferrer" class="rounded-full bg-ink px-[18px] py-2.5 text-[14px] font-semibold text-paper hover:bg-moss">Jetzt reinhören</a>
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
