import { Component, signal, effect, Renderer2, inject } from '@angular/core';
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
    <header class="fixed z-[90] top-0 left-0 right-0 px-4 md:px-8 pt-2 md:pt-4 max-w-full overflow-x-hidden">
      <nav class="container mx-auto max-w-7xl animate-fade-in w-full">
        <div class="bg-white/95 md:bg-white/80 md:backdrop-blur-md border border-white/20 md:border-white/30 rounded-xl md:rounded-2xl px-4 md:px-6 py-2.5 md:py-4 shadow-sm md:shadow-xl max-w-full">
          <div class="flex items-center relative min-h-[44px] md:min-h-[56px] w-full max-w-full">
            <!-- Logo - Centered on mobile, left on desktop -->
            <div class="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center md:static md:inset-y-auto md:translate-x-0">
              <button
                type="button"
                (click)="navigateTo('/home')"
                class="relative group focus:outline-none focus:ring-2 focus:ring-green-400 rounded-xl">
                <div class="relative w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl border border-white/30 overflow-hidden shadow-md md:shadow-lg transition-all duration-300 md:group-hover:scale-105 group-hover:shadow-green-400/30 md:animate-pulse-slow">
                  <img
                    src="assets/logo.jpg"
                    alt="Schnittstellenpass Logo"
                    class="block w-full h-full object-cover">
                </div>
              </button>
            </div>

            <!-- Desktop Navigation Links -->
            <div class="hidden md:flex items-center gap-8 ml-12">
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

            <!-- CTA Button - Right side -->
            <button
              type="button"
              (click)="onSubscribe()"
              class="hidden md:block ml-auto px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-bold rounded-xl transition-all duration-300 md:hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-400/50 animate-fade-in animation-delay-400"
              aria-label="Jetzt abonnieren">
              Abonnieren
            </button>

            <!-- Mobile Menu Toggle -->
            <button
              type="button"
              (click)="toggleMobileMenu()"
              class="md:hidden flex flex-col justify-center items-center space-y-1 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 relative z-[120] w-9 h-9 ml-auto"
              aria-label="Toggle menu"
              [attr.aria-expanded]="isMobileMenuOpen()">
              <span class="block w-6 h-0.5 bg-gray-700 transition-all duration-300 origin-center"
                    [class.rotate-45]="isMobileMenuOpen()"
                    [class.translate-y-2]="isMobileMenuOpen()"></span>
              <span class="block w-6 h-0.5 bg-gray-700 transition-all duration-300"
                    [class.opacity-0]="isMobileMenuOpen()"></span>
              <span class="block w-6 h-0.5 bg-gray-700 transition-all duration-300 origin-center"
                    [class.-rotate-45]="isMobileMenuOpen()"
                    [class.-translate-y-2]="isMobileMenuOpen()"></span>
            </button>
          </div>
        </div>

      </nav>

      <!-- Mobile Menu Backdrop -->
      @if (isMobileMenuOpen()) {
        <div
          class="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
          (click)="toggleMobileMenu()">
        </div>
      }

      <!-- Mobile Menu Panel -->
      <div
        class="md:hidden fixed right-0 top-0 h-full w-4/5 max-w-sm bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 shadow-2xl transition-transform duration-300 ease-in-out z-[110] overflow-y-auto"
        [class.translate-x-0]="isMobileMenuOpen()"
        [class.translate-x-full]="!isMobileMenuOpen()">
          <div class="p-6 flex flex-col min-h-full">
            <div class="flex justify-between items-center mb-8">
              <div class="flex items-center">
                <div class="relative w-10 h-10 rounded-lg border border-white/30 overflow-hidden shadow-md">
                  <img
                    src="assets/logo.jpg"
                    alt="Schnittstellenpass Logo"
                    class="block w-full h-full object-cover">
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
                    class="py-3 px-4 text-left text-lg font-semibold text-gray-800 hover:bg-white/20 hover:text-green-600 rounded-xl transition-colors focus:outline-none focus:bg-white/20 focus:text-green-600"
                    [attr.aria-label]="link.label">
                    {{ link.label }}
                  </button>
                } @else {
                  <a
                    [href]="link.url"
                    (click)="toggleMobileMenu()"
                    class="py-3 px-4 text-lg font-semibold text-gray-800 hover:bg-white/20 hover:text-green-600 rounded-xl transition-colors focus:outline-none focus:bg-white/20 focus:text-green-600"
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
                class="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-base font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-400/50"
                aria-label="Jetzt abonnieren">
                Abonnieren
              </button>
            </div>
          </div>
        </div>
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
  private router = inject(Router);
  private renderer = inject(Renderer2);

  // Mobile menu state
  protected isMobileMenuOpen = signal<boolean>(false);

  constructor() {
    // Lock body scroll when mobile menu is open
    effect(() => {
      if (this.isMobileMenuOpen()) {
        this.renderer.addClass(document.body, 'overflow-hidden');
      } else {
        this.renderer.removeClass(document.body, 'overflow-hidden');
      }
    });
  }

  // Navigation Links
  protected navLinks = signal<NavLink[]>([
    { id: '1', label: 'Home', url: '/home', isRoute: true },
    { id: '2', label: 'Episoden', url: '/episodes', isRoute: true },
    { id: '3', label: 'Über uns', url: '/about', isRoute: true },
    { id: '4', label: 'Kontakt', url: '/contact', isRoute: true }
  ]);

  // Navigation method
  protected navigateTo(url: string): void {
    this.router.navigate([url]).then(() => {
      // Scroll to top after navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
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
