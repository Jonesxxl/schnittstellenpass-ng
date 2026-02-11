import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-datenschutz',
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
            <h1 class="mt-3 text-4xl font-black tracking-tight text-emerald-800 md:text-5xl">Datenschutzerklärung</h1>
            <p class="mt-5 text-slate-700">
              Diese Erklärung informiert darüber, wie personenbezogene Daten beim Besuch dieser Website verarbeitet werden.
            </p>
            <p class="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-slate-700">
              Hinweis: Bitte ergänze die Platzhalterdaten (Name/Adresse), damit die Datenschutzerklärung vollständig rechtsverbindlich ist.
            </p>
          </div>
        </section>

        <section class="space-y-5">
          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">1. Verantwortliche Stelle</h2>
            <div class="mt-4 space-y-1 text-slate-700">
              <p><strong>Schnittstellenpass Podcast</strong></p>
              <p>[Vor- und Nachname ergänzen]</p>
              <p>[Straße und Hausnummer ergänzen]</p>
              <p>[PLZ Ort ergänzen]</p>
              <p>E-Mail: <a href="mailto:schnittstellenpassderpodcast@gmail.com" class="font-semibold text-emerald-800 hover:text-emerald-700">schnittstellenpassderpodcast@gmail.com</a></p>
            </div>
          </article>

          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">2. Hosting und Server-Logfiles</h2>
            <p class="mt-4 leading-relaxed text-slate-700">
              Beim Aufruf dieser Website werden technisch notwendige Daten durch den Hosting-Anbieter verarbeitet (z. B. IP-Adresse, Datum/Uhrzeit, angeforderte Ressource, Browsertyp). Diese Verarbeitung erfolgt zur Bereitstellung, Stabilität und Sicherheit der Website.
            </p>
            <p class="mt-3 text-slate-700">
              Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem und funktionsfähigem Betrieb).
            </p>
          </article>

          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">3. Kontaktaufnahme</h2>
            <p class="mt-4 leading-relaxed text-slate-700">
              Wenn du per E-Mail oder über den Kontaktbereich mit uns in Verbindung trittst, verarbeiten wir die von dir mitgeteilten Angaben (z. B. Name, E-Mail, Nachricht) ausschließlich zur Bearbeitung deiner Anfrage.
            </p>
            <p class="mt-3 text-slate-700">
              Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Kommunikation) und/oder Art. 6 Abs. 1 lit. f DSGVO (effiziente Bearbeitung von Anfragen).
            </p>
          </article>

          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">4. Externe Links und Plattformen</h2>
            <p class="mt-4 leading-relaxed text-slate-700">
              Diese Website enthält Links zu externen Plattformen (u. a. Spotify, YouTube, Apple Podcasts, Instagram, Deezer, X/Twitter). Beim Anklicken eines Links verlässt du diese Website. Für die Datenverarbeitung auf den Zielseiten sind die jeweiligen Anbieter verantwortlich.
            </p>
          </article>

          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">5. Speicherdauer</h2>
            <p class="mt-4 leading-relaxed text-slate-700">
              Personenbezogene Daten werden nur so lange gespeichert, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Anschließend werden die Daten gelöscht.
            </p>
          </article>

          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">6. Deine Rechte</h2>
            <ul class="mt-4 space-y-2 text-slate-700">
              <li>Auskunft über gespeicherte personenbezogene Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen Verarbeitungen (Art. 21 DSGVO)</li>
            </ul>
          </article>

          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">7. Beschwerderecht</h2>
            <p class="mt-4 leading-relaxed text-slate-700">
              Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren, wenn du der Ansicht bist, dass die Verarbeitung deiner personenbezogenen Daten gegen Datenschutzrecht verstößt.
            </p>
          </article>

          <article class="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
            <h2 class="text-xl font-extrabold text-slate-900">8. Aktualisierung dieser Datenschutzerklärung</h2>
            <p class="mt-4 leading-relaxed text-slate-700">
              Wir passen diese Datenschutzerklärung an, wenn sich rechtliche, technische oder organisatorische Änderungen ergeben.
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
export class DatenschutzComponent {}
