import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from './reveal.directive';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, RevealDirective],
  template: `
    <footer class="bg-ink text-paper">
      <div class="mx-auto box-content flex max-w-[1280px] flex-col gap-12 px-6 pb-8 pt-16">
        <div appReveal class="flex flex-wrap items-end justify-between gap-8">
          <img src="assets/brand/logo-white-slogan.webp" alt="Schnittstellenpass – Zwischen Profi &amp; Amateur" width="760" height="440" class="block h-auto w-full max-w-[380px]" />
          <div class="flex max-w-[360px] flex-col gap-3">
            <span class="font-mono text-[13px] uppercase tracking-[.12em] text-pitch">Gast-Anfragen &amp; Kooperationen</span>
            <span class="text-[17px] leading-normal">Du hast eine Geschichte zwischen Profi und Amateur? Schreib uns auf Instagram.</span>
          </div>
        </div>
        <div class="flex flex-wrap justify-between gap-4 border-t border-paper/25 pt-5 text-[14px] text-pitch">
          <span>© {{ year }} Schnittstellenpass</span>
          <div class="flex flex-wrap gap-5">
            <a routerLink="/impressum">Impressum</a>
            <a routerLink="/datenschutz">Datenschutz</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class SiteFooterComponent {
  protected readonly year = new Date().getFullYear();
}
