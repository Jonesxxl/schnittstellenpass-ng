import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-datenschutz',
  standalone: true,
  template: `
    <div class="bg-paper">


      <main class="mx-auto max-w-5xl px-6 py-[clamp(48px,6vw,80px)]">
        <section class="mb-10">
          <div class="flex flex-col gap-4">
            <p class="m-0 font-mono text-[13px] uppercase tracking-[.12em] text-moss">Rechtliche Angaben</p>
            <h1 class="m-0 font-display text-[clamp(24px,8.5vw,80px)] font-black uppercase leading-[.9]">Datenschutzerklärung</h1>
            <p class="m-0 max-w-[720px] text-[17px] leading-normal text-forest">
              Diese Erklärung informiert darüber, wie personenbezogene Daten beim Besuch dieser Website verarbeitet werden.
            </p>
            <p class="m-0 rounded-md border-2 border-ink bg-pitch px-4 py-3 text-[14px] leading-normal">
              Hinweis: Bitte ergänze die Platzhalterdaten (Name/Adresse), damit die Datenschutzerklärung vollständig rechtsverbindlich ist.
            </p>
          </div>
        </section>

        <section class="space-y-5">
          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">1. Verantwortliche Stelle</h2>
            <div class="mt-4 space-y-1 leading-relaxed text-forest">
              <p><strong>Schnittstellenpass Podcast</strong></p>
              <p>[Vor- und Nachname ergänzen]</p>
              <p>[Straße und Hausnummer ergänzen]</p>
              <p>[PLZ Ort ergänzen]</p>
              <p>E-Mail: <a href="mailto:schnittstellenpassderpodcast@gmail.com" class="font-semibold underline decoration-2 underline-offset-2 hover:text-moss">schnittstellenpassderpodcast@gmail.com</a></p>
            </div>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">2. Hosting und Server-Logfiles</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Beim Aufruf dieser Website werden technisch notwendige Daten durch den Hosting-Anbieter verarbeitet (z. B. IP-Adresse, Datum/Uhrzeit, angeforderte Ressource, Browsertyp). Diese Verarbeitung erfolgt zur Bereitstellung, Stabilität und Sicherheit der Website.
            </p>
            <p class="mt-3 leading-relaxed text-forest">
              Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem und funktionsfähigem Betrieb).
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">3. Kontaktaufnahme</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Wenn du per E-Mail oder über den Kontaktbereich mit uns in Verbindung trittst, verarbeiten wir die von dir mitgeteilten Angaben (z. B. Name, E-Mail, Nachricht) ausschließlich zur Bearbeitung deiner Anfrage.
            </p>
            <p class="mt-3 leading-relaxed text-forest">
              Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Kommunikation) und/oder Art. 6 Abs. 1 lit. f DSGVO (effiziente Bearbeitung von Anfragen).
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">4. Externe Links und Plattformen</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Diese Website enthält Links zu externen Plattformen (u. a. Spotify, YouTube, Apple Podcasts, Instagram, Deezer, X/Twitter). Beim Anklicken eines Links verlässt du diese Website. Für die Datenverarbeitung auf den Zielseiten sind die jeweiligen Anbieter verantwortlich.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">5. Speicherdauer</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Personenbezogene Daten werden nur so lange gespeichert, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Anschließend werden die Daten gelöscht.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">6. Deine Rechte</h2>
            <ul class="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-forest">
              <li>Auskunft über gespeicherte personenbezogene Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen Verarbeitungen (Art. 21 DSGVO)</li>
            </ul>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">7. Beschwerderecht</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren, wenn du der Ansicht bist, dass die Verarbeitung deiner personenbezogenen Daten gegen Datenschutzrecht verstößt.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">8. Aktualisierung dieser Datenschutzerklärung</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Wir passen diese Datenschutzerklärung an, wenn sich rechtliche, technische oder organisatorische Änderungen ergeben.
            </p>
          </article>
        </section>

        <p class="mt-8 text-[14px] text-forest">Stand: 11. Februar 2026</p>
      </main>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: []
})
export class DatenschutzComponent {}
