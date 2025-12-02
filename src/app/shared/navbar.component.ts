import { Component, signal } from '@angular/core';

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
  imports: [],
  template: `
    <!-- Header Navigation -->
    <header class="absolute z-50 top-4 left-0 right-0 px-4 md:px-8">
      <nav class="container mx-auto max-w-7xl animate-fade-in">
        <div class="backdrop-blur-md bg-transparent border border-white/30 rounded-2xl px-6 py-4 shadow-xl">
          <div class="flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center">
              <button
                type="button"
                (click)="navigateTo('/')"
                class="relative group focus:outline-none focus:ring-2 focus:ring-green-400 rounded-xl">
                <div class="relative w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-green-400/30 animate-pulse-slow">
                  <div class="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20 opacity-70"></div>
                  <span class="relative text-2xl font-black text-white drop-shadow-lg">SP</span>
                </div>
              </button>
            </div>

            <!-- Mobile Menu Toggle -->
            <button
              type="button"
              (click)="toggleMobileMenu()"
              class="md:hidden flex flex-col space-y-1.5 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 z-50"
              aria-label="Toggle menu">
              <span class="w-6 h-0.5 bg-gray-700 transition-all duration-300" [class.rotate-45]="isMobileMenuOpen()" [class.translate-y-2]="isMobileMenuOpen()"></span>
              <span class="w-6 h-0.5 bg-gray-700 transition-all duration-300" [class.opacity-0]="isMobileMenuOpen()"></span>
              <span class="w-6 h-0.5 bg-gray-700 transition-all duration-300" [class.-rotate-45]="isMobileMenuOpen()" [class.-translate-y-2]="isMobileMenuOpen()"></span>
            </button>

            <!-- Desktop Navigation Links -->
            <div class="hidden md:flex items-center gap-6">
              @for (link of navLinks(); track link.id; let i = $index) {
                @if (link.isRoute) {
                  <button
                    type="button"
                    (click)="navigateTo(link.url)"
                    class="text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors focus:outline-none focus:text-green-600 relative group animate-fade-in"
                    [class.animation-delay-200]="i === 1"
                    [class.animation-delay-400]="i === 2 || i === 3"
                    [attr.aria-label]="link.label">
                    {{ link.label }}
                    <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                } @else {
                  <a
                    [href]="link.url"
                    class="text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors focus:outline-none focus:text-green-600 relative group animate-fade-in"
                    [class.animation-delay-200]="i === 1"
                    [class.animation-delay-400]="i === 2 || i === 3"
                    [attr.aria-label]="link.label">
                    {{ link.label }}
                    <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                }
              }
            </div>

            <!-- CTA Button -->
            <button
              type="button"
              (click)="onSubscribe()"
              class="hidden md:block px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-400/50 animate-fade-in animation-delay-400"
              aria-label="Jetzt abonnieren">
              Abonnieren
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div
          class="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          [class.opacity-100]="isMobileMenuOpen()"
          [class.opacity-0]="!isMobileMenuOpen()"
          [class.pointer-events-auto]="isMobileMenuOpen()"
          [class.pointer-events-none]="!isMobileMenuOpen()">
          <div
            class="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 shadow-2xl transition-transform duration-300 ease-in-out transform overflow-y-auto"
            [class.translate-x-0]="isMobileMenuOpen()"
            [class.translate-x-full]="!isMobileMenuOpen()">
            <div class="p-6 flex flex-col h-full">
              <div class="flex justify-between items-center mb-8">
                <div class="flex items-center">
                  <div class="relative w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg border border-white/30 flex items-center justify-center overflow-hidden shadow-md">
                    <div class="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20 opacity-70"></div>
                    <span class="relative text-lg font-black text-white drop-shadow-md">SP</span>
                  </div>
                </div>
                <button
                  type="button"
                  (click)="toggleMobileMenu()"
                  class="p-2 rounded-full bg-gray-300/50 hover:bg-gray-400/50 transition-colors"
                  aria-label="Close menu">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="flex flex-col space-y-4">
                @for (link of navLinks(); track link.id; let i = $index) {
                  @if (link.isRoute) {
                    <button
                      type="button"
                      (click)="navigateTo(link.url)"
                      class="py-3 px-4 text-left text-lg font-semibold text-gray-800 hover:bg-white/20 hover:text-green-600 rounded-xl transition-colors focus:outline-none focus:bg-white/20 focus:text-green-600 animate-fly-in-right"
                      [style.animation-delay.ms]="100 * i"
                      [attr.aria-label]="link.label">
                      {{ link.label }}
                    </button>
                  } @else {
                    <a
                      [href]="link.url"
                      class="py-3 px-4 text-lg font-semibold text-gray-800 hover:bg-white/20 hover:text-green-600 rounded-xl transition-colors focus:outline-none focus:bg-white/20 focus:text-green-600 animate-fly-in-right"
                      [style.animation-delay.ms]="100 * i"
                      [attr.aria-label]="link.label">
                      {{ link.label }}
                    </a>
                  }
                }
              </div>

              <div class="mt-auto pt-6 border-t border-gray-200">
                <button
                  type="button"
                  (click)="onSubscribe()"
                  class="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-base font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-400/50 animate-fly-in-right"
                  [style.animation-delay.ms]="navLinks().length * 100 + 100"
                  aria-label="Jetzt abonnieren">
                  Abonnieren
                </button>
              </div>
            </div>
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

    @keyframes fadeIn {
      0% {
        opacity: 0;
        transform: translateY(-10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    .animate-fly-in-right {
      animation: flyInRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .animate-fly-in-left {
      animation: flyInLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }

    .animate-pulse-slow {
      animation: pulse 3s infinite ease-in-out;
    }

    .animation-delay-200 {
      animation-delay: 0.2s;
      opacity: 0;
    }

    .animation-delay-400 {
      animation-delay: 0.4s;
      opacity: 0;
    }

    /* Custom scrollbar for the mobile menu */
    ::-webkit-scrollbar {
      width: 6px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #555;
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
