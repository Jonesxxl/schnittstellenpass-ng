import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

interface HighlightSection {
  id: string;
  title: string;
  description: string;
  items: string[];
}

interface Guest {
  id: string;
  name: string;
  role: string;
  context: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  template: `
    <div class="relative min-h-screen overflow-x-hidden overflow-y-auto bg-gradient-to-b from-emerald-50 via-slate-50 to-amber-50/40">
      <div class="pointer-events-none absolute inset-0 opacity-45" aria-hidden="true">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 15% 10%, rgba(5,150,105,0.1), transparent 30%), radial-gradient(circle at 85% 0%, rgba(15,23,42,0.08), transparent 30%);"></div>
        <div class="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-emerald-200/70"></div>
        <div class="absolute inset-x-8 top-[18%] h-px bg-emerald-200/70 md:inset-x-20"></div>
        <div class="absolute inset-x-8 top-[50%] h-px bg-emerald-200/70 md:inset-x-20"></div>
        <div class="absolute inset-x-8 top-[82%] h-px bg-emerald-200/70 md:inset-x-20"></div>
        <div class="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-200/70"></div>
      </div>

      <div class="relative z-10 h-1.5 w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-500"></div>

      <main class="relative z-10 container mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
        <section class="mb-10 rounded-3xl border border-emerald-200/80 bg-white/95 shadow-xl shadow-amber-100/60">
          <div class="h-1 w-full bg-gradient-to-r from-emerald-700 via-emerald-500 to-amber-500"></div>
          <div class="px-6 py-10 text-center md:px-12 md:py-12">
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 sm:text-sm">Schnittstellenpass Podcast</p>
            <h1 class="mt-3 text-4xl font-black uppercase tracking-tight text-emerald-800 md:text-6xl">Über Uns</h1>
            <div class="mx-auto mt-5 h-px w-32 bg-slate-300"></div>
            <p class="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-700 md:text-xl">
              Wir sprechen über Fußball mit Perspektive: ehrlich, analytisch und nah an den Realitäten zwischen Profi- und Amateurbereich.
            </p>

            <div class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              @for (stat of stats(); track stat.id) {
                <div class="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-4 text-left">
                  <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{{ stat.label }}</p>
                  <p class="mt-1 text-xl font-extrabold text-emerald-800">{{ stat.value }}</p>
                </div>
              }
            </div>
          </div>
        </section>

        <section class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-2xl font-extrabold text-slate-900">Unsere Idee</h2>
            <p class="mt-4 text-base leading-relaxed text-slate-700">
              Schnittstellenpass schafft einen Raum für fundierte Gespräche über Leistung, Entwicklung und Entscheidungen im Fußball. Statt Schlagzeilen stehen Erfahrungen und Hintergründe im Fokus.
            </p>
            <div class="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-slate-700">
              Jede Folge entspricht einer Halbzeit: kompakt, intensiv und klar strukturiert.
            </div>
          </article>

          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-2xl font-extrabold text-slate-900">So läuft eine Folge</h2>
            <div class="mt-4 space-y-3">
              @for (step of episodeFlow(); track step.id) {
                <div class="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span class="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">{{ step.id }}</span>
                  <p class="text-sm leading-relaxed text-slate-700">{{ step.text }}</p>
                </div>
              }
            </div>
          </article>
        </section>

        <section class="mb-8 rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg md:p-8">
          <h2 class="text-2xl font-extrabold text-slate-900 md:text-3xl">Thematische Schwerpunkte</h2>
          <p class="mt-2 text-slate-600">Inhaltlich geht es um den Alltag, die Entwicklung und die Kultur des Spiels.</p>

          <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            @for (topic of topics(); track topic) {
              <article class="rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-4">
                <p class="text-sm leading-relaxed text-slate-700">{{ topic }}</p>
              </article>
            }
          </div>
        </section>

        <section class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          @for (highlight of highlights(); track highlight.id) {
            <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
              <h3 class="text-xl font-bold text-slate-900">{{ highlight.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ highlight.description }}</p>
              <ul class="mt-4 space-y-2">
                @for (item of highlight.items; track item) {
                  <li class="flex items-start gap-2 text-sm text-slate-700">
                    <span class="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-700"></span>
                    <span>{{ item }}</span>
                  </li>
                }
              </ul>
            </article>
          }
        </section>

        <section class="mb-10 rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg md:p-8">
          <h2 class="text-2xl font-extrabold text-slate-900 md:text-3xl">Gäste aus dem Fußball</h2>
          <p class="mt-2 text-slate-600">Perspektiven aus unterschiedlichen Rollen machen die Gespräche greifbar und relevant.</p>

          <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (guest of guests(); track guest.id) {
              <article class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-5">
                <p class="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">{{ guest.role }}</p>
                <h3 class="mt-2 text-lg font-bold text-slate-900">{{ guest.name }}</h3>
                <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ guest.context }}</p>
              </article>
            }
          </div>
        </section>

        <section class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg md:p-8">
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_auto] lg:items-center">
            <div>
              <h2 class="text-2xl font-extrabold text-slate-900 md:text-3xl">Mehr als ein Talkformat</h2>
              <p class="mt-3 text-slate-700">
                Wenn du Fußball nicht nur sehen, sondern verstehen willst, findest du hier Gespräche mit Substanz und klarer Haltung.
              </p>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <button
                type="button"
                (click)="navigateToEpisodes()"
                class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-emerald-800 hover:to-amber-600">
                Zu den Episoden
              </button>

              <a
                href="https://www.instagram.com/schnittstellenpass/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-800">
                Instagram
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer class="relative z-10 mt-16 border-t border-emerald-900/20 bg-slate-900 py-8">
        <div class="container mx-auto max-w-6xl px-4 md:px-8">
          <div class="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p class="text-sm font-medium text-slate-300">© 2026 Schnittstellenpass | Zwischen Profis & Amateur</p>
            <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
              <a href="/datenschutz" class="transition hover:text-amber-300">Datenschutz</a>
              <a href="/impressum" class="transition hover:text-amber-300">Impressum</a>
              <a href="/contact" class="transition hover:text-amber-300">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class AboutComponent {
  constructor(private router: Router) {}

  protected stats = signal([
    { id: '1', label: 'Format', value: '~45 Min / Folge' },
    { id: '2', label: 'Perspektiven', value: 'Profi + Amateur' },
    { id: '3', label: 'Fokus', value: 'Analyse & Haltung' }
  ]);

  protected episodeFlow = signal([
    { id: '1', text: 'Einstieg mit Kontext und den wichtigsten Themen der Woche.' },
    { id: '2', text: 'Tiefgang über Erfahrungen, Entscheidungen und Entwicklung im Fußball.' },
    { id: '3', text: 'Konkrete Learnings für Spieler, Trainer und Umfeld.' }
  ]);

  protected topics = signal([
    'Karrierewege von der Jugend bis in den Profibereich inklusive der typischen Bruchstellen.',
    'Leistungsdruck, mentale Stabilität und der Umgang mit Rückschlägen im Trainingsalltag.',
    'Taktik, Führungsarbeit und Kommunikation im Team vom Amateurplatz bis zum Leistungszentrum.',
    'Ernährung, Regeneration und Routinen als Grundlage für konstante Performance.'
  ]);

  protected highlights = signal<HighlightSection[]>([
    {
      id: '1',
      title: 'Unser Anspruch',
      description: 'Wir wollen Diskussionen führen, die sportlich relevant und menschlich nachvollziehbar sind.',
      items: [
        'Klare Sprache statt Buzzwords',
        'Nachvollziehbare Einschätzungen statt Hot Takes',
        'Praxisnahe Perspektiven mit echtem Mehrwert'
      ]
    },
    {
      id: '2',
      title: 'Warum der Podcast wirkt',
      description: 'Die Mischung aus Erfahrung und Analyse schafft Orientierung für unterschiedliche Zielgruppen.',
      items: [
        'Verbindung von Profi- und Amateurrealität',
        'Gäste mit belastbarer Expertise',
        'Konsequenter Fokus auf Entwicklung im Spiel'
      ]
    }
  ]);

  protected guests = signal<Guest[]>([
    {
      id: '1',
      name: 'Peter Hyballa',
      role: 'Trainer',
      context: 'Einblicke in Führungsarbeit, Spielidee und den Alltag im professionellen Umfeld.'
    },
    {
      id: '2',
      name: 'Eunice Beckmann',
      role: 'Nationalspielerin',
      context: 'Perspektive auf Leistung, Struktur und Verantwortung im Top-Level-Fußball.'
    },
    {
      id: '3',
      name: 'Kira Meenke',
      role: 'Performance-Umfeld',
      context: 'Blick auf Ernährung und Routinen als Teil moderner Leistungsentwicklung.'
    }
  ]);

  protected navigateToEpisodes(): void {
    this.router.navigate(['/episodes']);
  }
}
