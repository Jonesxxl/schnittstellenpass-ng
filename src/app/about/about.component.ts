import { Component, computed, signal } from '@angular/core';

import { Router } from '@angular/router';

interface HighlightSection {
  id: string;
  title: string;
  items: string[];
}

interface Guest {
  id: string;
  name: string;
  role: string;
  icon: 'coach' | 'player' | 'chef';
  gradient: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  template: `
    <!-- About Page mit Fußballfeld-Ästhetik -->
    <div class="relative min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 overflow-x-hidden overflow-y-auto">

      <!-- Fußballfeld-Grid Overlay -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute inset-0 grid grid-cols-6 grid-rows-6">
          @for (i of gridLines(); track i) {
            <div class="border border-white/30"></div>
          }
        </div>
        <!-- Mittelkreis -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-white/30 rounded-full pointer-events-none"></div>
        <!-- Strafraum Links -->
        <div class="hidden md:block absolute top-1/2 left-0 -translate-y-1/2 w-32 h-48 border-4 border-white/30 pointer-events-none"></div>
        <!-- Strafraum Rechts -->
        <div class="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 w-32 h-48 border-4 border-white/30 pointer-events-none"></div>
      </div>

      <!-- Main Content -->
      <main class="relative z-10 container mx-auto max-w-5xl px-4 md:px-8 py-16 md:py-24">

        <!-- Hero Section -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-sm border border-white/40 rounded-full shadow-lg mb-6">
            <span class="icon-badge-3d icon-badge-xs icon-badge-blue" aria-hidden="true">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" stroke-width="2"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8l2.5 1.8-.9 2.9h-3.2l-.9-2.9L12 8z"/>
              </svg>
            </span>
            <span class="text-sm font-bold text-gray-800">ÜBER UNS</span>
          </div>

          <h2 class="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
            Schnittstellenpass
          </h2>
          <div class="h-2 w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto mb-8"></div>

          <p class="text-xl md:text-2xl text-gray-700 font-semibold max-w-3xl mx-auto">
            Zwischen Profi und Amateur
          </p>
        </div>

        <!-- Main Description Card -->
        <div class="relative backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl mb-12 overflow-hidden">
          <!-- Decorative Elements -->
          <div class="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-2xl opacity-60 animate-pulse pointer-events-none"></div>

          <div class="space-y-8">
            <!-- Kurzbeschreibung -->
            <div>
              <h3 class="text-2xl md:text-3xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <span class="icon-badge-3d icon-badge-sm icon-badge-purple" aria-hidden="true">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3zm0 0v4m-4 0h8"/>
                  </svg>
                </span>
                Kurzbeschreibung
              </h3>
              <p class="text-lg text-gray-700 leading-relaxed">
                „Schnittstellenpass – Zwischen Profi und Amateur" ist ein Fußball-Podcast von Marc Agyemang mit wechselnden Gästen aus dem Profi- und Amateurbereich. In jeder Folge werden Erfahrungen, Anekdoten und Insider-Einblicke geteilt, die hinter die Kulissen der Fußballwelt blicken. Persönliche Erlebnisse, Herausforderungen und das Zusammenspiel von Alltag, Leistung und Leidenschaft im Fußball stehen im Mittelpunkt.
              </p>
            </div>

            <!-- Duration Info -->
            <div class="flex items-center gap-3 p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-white/40">
              <span class="icon-badge-3d icon-badge-sm icon-badge-amber" aria-hidden="true">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="13" r="7" stroke-width="2"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V9m0-7h2m-4 0h2"/>
                </svg>
              </span>
              <p class="text-gray-800 font-semibold">
                Jede Episode dauert etwa „eine Halbzeit" – ca. <span class="text-gray-900 font-black">45 Minuten</span> intensiver und authentischer Dialog.
              </p>
            </div>
          </div>
        </div>

        <!-- Thematische Schwerpunkte -->
        <div class="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl mb-12">
          <h3 class="text-2xl md:text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <span class="icon-badge-3d icon-badge-sm icon-badge-blue" aria-hidden="true">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" stroke-width="2"/>
                <circle cx="12" cy="12" r="4" stroke-width="2"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12l7-7"/>
              </svg>
            </span>
            Thematische Schwerpunkte
          </h3>

          <div class="space-y-4">
            @for (topic of topics(); track topic) {
              <div class="flex items-start gap-4 p-4 rounded-xl hover:bg-white/30 transition-all duration-300 group">
                <span class="icon-badge-3d icon-badge-sm icon-badge-green md:group-hover:scale-110 transition-transform flex-shrink-0" aria-hidden="true">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="7.5" stroke-width="2"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10l3-2 3 2-1 3h-4l-1-3z"/>
                  </svg>
                </span>
                <p class="text-gray-700 text-lg leading-relaxed flex-1">{{ topic }}</p>
              </div>
            }
          </div>
        </div>

        <!-- Besonderheiten Grid -->
        <div class="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl mb-12">
          <h3 class="text-2xl md:text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <span class="icon-badge-3d icon-badge-sm icon-badge-purple" aria-hidden="true">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3l2.4 4.8L20 10l-4 3.9.9 5.6-4.9-2.6-4.9 2.6.9-5.6-4-3.9 5.6-2.2L12 3z"/>
              </svg>
            </span>
            Das macht uns besonders
          </h3>

          <div class="grid md:grid-cols-2 gap-6">
            @for (highlight of highlights(); track highlight.id) {
              <div class="p-6 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 transition-all duration-300 md:hover:scale-105 shadow-lg">
                <h4 class="text-xl font-bold text-gray-900 mb-4">{{ highlight.title }}</h4>
                <ul class="space-y-2">
                  @for (item of highlight.items; track item) {
                    <li class="flex items-start gap-2 text-gray-700">
                      <span class="text-blue-600 font-bold mt-1">→</span>
                      <span>{{ item }}</span>
                    </li>
                  }
                </ul>
              </div>
            }
          </div>
        </div>

        <!-- Gäste Highlight -->
        <div class="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl mb-12">
          <h3 class="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span class="icon-badge-3d icon-badge-sm icon-badge-pink" aria-hidden="true">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3l2.4 4.8L20 10l-4 3.9.9 5.6-4.9-2.6-4.9 2.6.9-5.6-4-3.9 5.6-2.2L12 3z"/>
              </svg>
            </span>
            Unsere Gäste
          </h3>

          <p class="text-lg text-gray-700 leading-relaxed mb-6">
            Gespräche mit Persönlichkeiten aus der Fußballwelt geben vielschichtige Einblicke:
          </p>

          <div class="grid sm:grid-cols-3 gap-4">
            @for (guest of guests(); track guest.id) {
              <div class="text-center p-6 rounded-2xl bg-gradient-to-br {{ guest.gradient }} text-white shadow-xl md:hover:scale-105 transition-transform duration-300">
                <div class="flex justify-center mb-3" aria-hidden="true">
                  <div class="icon-badge-3d icon-badge-lg"
                       [class.icon-badge-blue]="guest.icon === 'coach'"
                       [class.icon-badge-purple]="guest.icon === 'player'"
                       [class.icon-badge-pink]="guest.icon === 'chef'">
                    @if (guest.icon === 'coach') {
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h6M8 14h8M9 6h6M6 20h12l-1-12H7L6 20z"/>
                      </svg>
                    }
                    @if (guest.icon === 'player') {
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="7" r="3" stroke-width="2"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 20a6 6 0 0112 0M8 12l4 2 4-2"/>
                      </svg>
                    }
                    @if (guest.icon === 'chef') {
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9a4 4 0 118 0v2H8V9zm1 2v7m6-7v7M7 20h10"/>
                      </svg>
                    }
                  </div>
                </div>
                <h4 class="font-bold text-lg mb-1">{{ guest.name }}</h4>
                <p class="text-sm opacity-90">{{ guest.role }}</p>
              </div>
            }
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center backdrop-blur-2xl bg-gradient-to-br from-blue-500/30 to-purple-600/30 border border-white/40 rounded-3xl p-12 shadow-2xl">
          <h3 class="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Bereit für die nächste Episode?
          </h3>
          <p class="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Tauche ein in die Welt des Fußballs – authentisch, persönlich und inspirierend.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            <button
              type="button"
              (click)="navigateToHome()"
              class="group relative w-full inline-flex items-center justify-center px-6 sm:px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 md:hover:scale-105 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300"
              aria-label="Jetzt anhören">
              <span class="relative z-10 flex items-center gap-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                </svg>
                Jetzt anhören
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <a
              href="https://www.instagram.com/schnittstellenpass/"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full inline-flex items-center justify-center px-6 sm:px-8 py-4 bg-white/50 backdrop-blur-sm border-2 border-gray-300 text-gray-900 font-bold rounded-xl hover:bg-white/70 hover:border-gray-400 transition-all duration-300 md:hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300 gap-2"
              aria-label="Folge uns auf Instagram">
              <span class="icon-badge-3d icon-badge-xs icon-badge-pink" aria-hidden="true">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="4" ry="4" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3.2" stroke-width="2"/>
                  <circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none"/>
                </svg>
              </span>
              Folge uns
            </a>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="relative z-10 backdrop-blur-md bg-white/10 border-t border-white/20 py-8">
        <div class="container mx-auto max-w-7xl px-4 md:px-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-sm text-gray-700 font-medium">
              © 2025 Schnittstellenpass | Zwischen Profis & Amateur
            </p>
            <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <a href="#" class="hover:text-gray-900 transition-colors focus:outline-none focus:text-gray-900">Datenschutz</a>
              <a href="#" class="hover:text-gray-900 transition-colors focus:outline-none focus:text-gray-900">Impressum</a>
              <a href="#" class="hover:text-gray-900 transition-colors focus:outline-none focus:text-gray-900">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .animation-delay-1000 {
      animation-delay: 1s;
    }
  `]
})
export class AboutComponent {
  constructor(private router: Router) {}

  // Grid für Fußballfeld
  protected gridLines = computed(() => Array.from({ length: 36 }, (_, i) => i));

  // Thematische Schwerpunkte
  protected topics = signal([
    'Lebenswege von Spielern und Trainern – von der Jugend über die ersten Schritte auf dem Bolzplatz bis hin zur Bundesliga oder zum Traineramt.',
    'Persönliche Erfahrungen mit Leistungsdruck und Umgang mit Rückschlägen sowie Motivation und Alltagsstruktur im Spitzensport.',
    'Die Rolle von Ernährung, Mentalität, Kultur und sozialen Faktoren im modernen Fußball.',
    'Austausch zwischen Profi- und Amateurfußball, deren Berührungspunkte und Unterschiede.'
  ]);

  // Besonderheiten
  protected highlights = signal<HighlightSection[]>([
    {
      id: '1',
      title: 'Offener Austausch',
      items: [
        'Fokus auf das, was Fußball abseits des Spielfelds ausmacht',
        'Inspiration, Werte und Kultur im Mittelpunkt',
        'Persönliche Entwicklung der Gäste'
      ]
    },
    {
      id: '2',
      title: 'Authentisch & Vielschichtig',
      items: [
        'Sehr positive Bewertungen von Hörerinnen und Hörern',
        'Hebt sich durch persönliche Geschichten ab',
        'Intensive und authentische Dialoge'
      ]
    }
  ]);

  // Beispiel-Gäste
  protected guests = signal<Guest[]>([
    {
      id: '1',
      name: 'Peter Hyballa',
      role: 'Fußballtrainer',
      icon: 'coach',
      gradient: 'from-blue-600 to-blue-800'
    },
    {
      id: '2',
      name: 'Eunice Beckmann',
      role: 'Nationalspielerin',
      icon: 'player',
      gradient: 'from-purple-600 to-purple-800'
    },
    {
      id: '3',
      name: 'Kira Meenke',
      role: 'Privatköchin',
      icon: 'chef',
      gradient: 'from-pink-600 to-pink-800'
    }
  ]);

  // Navigation
  protected navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
