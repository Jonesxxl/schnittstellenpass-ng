import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface NavLink {
  id: string;
  label: string;
  url: string;
  isRoute: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Header Navigation -->
    <header class="relative z-50 pt-8 px-4 md:px-8">
      <nav class="container mx-auto max-w-7xl">
        <div class="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-6 py-4 shadow-xl">
          <div class="flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center gap-3">
              <div class="relative w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 flex items-center justify-center overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
                <span class="relative text-2xl font-black text-white drop-shadow-lg">SP</span>
              </div>
              <button
                type="button"
                (click)="navigateTo('/')"
                class="focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg">
                <p class="text-xs text-gray-600 font-medium mt-1">LOGO</p>
              </button>
            </div>

            <!-- Navigation Links -->
            <div class="hidden md:flex items-center gap-6">
              @for (link of navLinks(); track link.id) {
                @if (link.isRoute) {
                  <button
                    type="button"
                    (click)="navigateTo(link.url)"
                    class="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:text-gray-900"
                    [attr.aria-label]="link.label">
                    {{ link.label }}
                  </button>
                } @else {
                  <a
                    [href]="link.url"
                    class="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:text-gray-900"
                    [attr.aria-label]="link.label">
                    {{ link.label }}
                  </a>
                }
              }
            </div>

            <!-- CTA Button -->
            <button
              type="button"
              (click)="onSubscribe()"
              class="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-400"
              aria-label="Jetzt abonnieren">
              Abonnieren
            </button>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    @keyframes flyInRight {
      0% {
        transform: translateX(100%);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes flyInLeft {
      0% {
        transform: translateX(-100%);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .animate-fly-in-right {
      animation: flyInRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .animate-fly-in-left {
      animation: flyInLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .animation-delay-200 {
      animation-delay: 0.2s;
      opacity: 0;
    }

    .animation-delay-400 {
      animation-delay: 0.4s;
      opacity: 0;
    }
  `]
})
export class NavbarComponent {
  constructor(private router: Router) {}

  // Mobile menu state
  protected isMobileMenuOpen = signal<boolean>(false);

  // Navigation Links
  protected navLinks = signal<NavLink[]>([
    { id: '1', label: 'Home', url: '/design', isRoute: true },
    { id: '2', label: 'Episoden', url: '/episodes', isRoute: true },
    { id: '3', label: 'Über uns', url: '/about', isRoute: true },
    { id: '4', label: 'Kontakt', url: '#contact', isRoute: false }
  ]);

  // Navigation method
  protected navigateTo(url: string): void {
    this.router.navigate([url]);
    // Close mobile menu after navigation
    this.isMobileMenuOpen.set(false);
  }

  // Subscribe action
  protected onSubscribe(): void {
    window.open('https://open.spotify.com/show/4gpxvhJ8WyrGAnba5A6LQc', '_blank');
    // Close mobile menu after action
    this.isMobileMenuOpen.set(false);
  }

  // Toggle mobile menu
  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(current => !current);
  }
}
