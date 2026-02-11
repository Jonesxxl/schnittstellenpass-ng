import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="relative min-h-screen overflow-x-hidden overflow-y-auto bg-gradient-to-b from-emerald-50 via-slate-50 to-amber-50/40">
      <div class="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 18% 10%, rgba(5,150,105,0.1), transparent 34%), radial-gradient(circle at 82% 0%, rgba(15,23,42,0.08), transparent 30%);"></div>
      </div>

      <div class="relative z-10 h-1.5 w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-500"></div>

      <main class="relative z-10 container mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-16">
        <section class="mb-8 overflow-hidden rounded-3xl border border-emerald-200/80 bg-white/95 shadow-xl shadow-amber-100/60">
          <div class="h-1 w-full bg-gradient-to-r from-emerald-700 via-emerald-500 to-amber-500"></div>
          <div class="px-6 py-10 md:px-10 md:py-12">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Rechtliche Angaben</p>
            <h1 class="mt-3 text-4xl font-black tracking-tight text-emerald-800 md:text-5xl">Impressum</h1>
            <p class="mt-5 text-slate-700">
              Angaben gemäß § 5 TMG und § 18 Abs. 2 MStV für den Webauftritt von Schnittstellenpass.
            </p>
            <p class="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-slate-700">
              Hinweis: Bitte ergänze die Platzhalterdaten (Name/Adresse), damit das Impressum vollständig rechtsverbindlich ist.
            </p>
          </div>
        </section>

        <section class="space-y-5">
          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">Diensteanbieter</h2>
            <div class="mt-4 space-y-1 text-slate-700">
              <p><strong>Schnittstellenpass Podcast</strong></p>
              <p>[Vor- und Nachname ergänzen]</p>
              <p>[Straße und Hausnummer ergänzen]</p>
              <p>[PLZ Ort ergänzen]</p>
              <p>Deutschland</p>
            </div>
          </article>

          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">Kontakt</h2>
            <div class="mt-4 space-y-2 text-slate-700">
              <p>E-Mail: <a href="mailto:schnittstellenpassderpodcast@gmail.com" class="font-semibold text-emerald-800 hover:text-emerald-700">schnittstellenpassderpodcast@gmail.com</a></p>
              <p>Telefon: [Telefonnummer ergänzen]</p>
            </div>
          </article>

          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <div class="mt-4 space-y-1 text-slate-700">
              <p>[Vor- und Nachname ergänzen]</p>
              <p>[Straße und Hausnummer ergänzen]</p>
              <p>[PLZ Ort ergänzen]</p>
            </div>
          </article>

          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">Haftung für Inhalte</h2>
            <p class="mt-4 leading-relaxed text-slate-700">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </article>

          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">Haftung für Links</h2>
            <p class="mt-4 leading-relaxed text-slate-700">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </article>

          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">Urheberrecht</h2>
            <p class="mt-4 leading-relaxed text-slate-700">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung der jeweiligen Urheberin bzw. des jeweiligen Urhebers.
            </p>
          </article>

          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">EU-Streitbeilegung</h2>
            <p class="mt-4 leading-relaxed text-slate-700">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" class="font-semibold text-emerald-800 hover:text-emerald-700">https://ec.europa.eu/consumers/odr</a>.
              Unsere E-Mail-Adresse findest du oben im Impressum.
            </p>
          </article>
        </section>

        <p class="mt-8 text-sm text-slate-500">Stand: 11. Februar 2026</p>
      </main>

      <footer class="relative z-10 mt-16 border-t border-emerald-900/20 bg-slate-900 py-8">
        <div class="container mx-auto max-w-6xl px-4 md:px-8">
          <div class="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p class="text-sm font-medium text-slate-300">© 2026 Schnittstellenpass | Zwischen Profis & Amateur</p>
            <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
              <a routerLink="/datenschutz" class="transition hover:text-amber-300">Datenschutz</a>
              <a routerLink="/impressum" class="transition hover:text-amber-300">Impressum</a>
              <a routerLink="/contact" class="transition hover:text-amber-300">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class ImpressumComponent {}
