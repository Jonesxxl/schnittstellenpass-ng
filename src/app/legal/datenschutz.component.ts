import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-datenschutz',
  standalone: true,
  template: `
    <div class="bg-paper">


      <main class="mx-auto max-w-5xl break-words px-6 py-[clamp(48px,6vw,80px)]">
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
              Diese Website wird bei Netlify, Inc. (San Francisco, USA) gehostet. Beim Aufruf der Website verarbeitet Netlify technisch notwendige Daten, insbesondere IP-Adresse, Datum und Uhrzeit des Zugriffs, angeforderte Seite bzw. Datei, Referrer-URL sowie Browsertyp und Betriebssystem. Diese Daten sind erforderlich, um die Website auszuliefern und ihre Stabilität und Sicherheit zu gewährleisten.
            </p>
            <p class="mt-3 leading-relaxed text-forest">
              Mit Netlify besteht ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO). Da Daten dabei in die USA übermittelt werden können, erfolgt die Übermittlung auf Grundlage des EU-US Data Privacy Framework (Angemessenheitsbeschluss der EU-Kommission, Art. 45 DSGVO) bzw. ergänzend der EU-Standardvertragsklauseln (Art. 46 DSGVO).
            </p>
            <p class="mt-3 leading-relaxed text-forest">
              Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer sicheren und funktionsfähigen Bereitstellung der Website).
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">3. Anzeige der aktuellen Folge (Spotify)</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Auf der Startseite zeigen wir die aktuelle Podcast-Folge an. Titel, Datum und Dauer ruft unser Server bei Spotify ab; dabei werden keine Daten von dir an Spotify übermittelt.
            </p>
            <p class="mt-3 leading-relaxed text-forest">
              Das Cover-Bild der Folge wird jedoch direkt von einem Server von Spotify (Spotify AB, Regeringsgatan 19, 111 53 Stockholm, Schweden) in deinen Browser geladen. Dabei erhält Spotify technisch bedingt deine IP-Adresse sowie Informationen zu deinem Browser und den Zeitpunkt des Abrufs. Ein Spotify-Player wird nicht eingebunden. Weitere Informationen findest du in der <a href="https://www.spotify.com/de/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" class="font-semibold underline decoration-2 underline-offset-2 hover:text-moss">Datenschutzerklärung von Spotify</a>.
            </p>
            <p class="mt-3 leading-relaxed text-forest">
              Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer aktuellen und ansprechenden Darstellung unseres Podcast-Angebots).
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">4. Cookies, Tracking und Schriftarten</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Diese Website setzt keine Cookies, speichert keine Daten in deinem Browser und verwendet keine Analyse- oder Tracking-Dienste.
            </p>
            <p class="mt-3 leading-relaxed text-forest">
              Die verwendeten Schriftarten sind lokal auf unserem Server eingebunden. Beim Laden der Seite wird keine Verbindung zu Servern von Drittanbietern (z. B. Google Fonts) hergestellt.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">5. Kontakt per E-Mail</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Wenn du uns per E-Mail kontaktierst, verarbeiten wir die von dir mitgeteilten Angaben (z. B. Name, E-Mail-Adresse, Inhalt der Nachricht) ausschließlich zur Bearbeitung deiner Anfrage. Unser E-Mail-Postfach wird über Gmail der Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irland) betrieben; dabei kann eine Übermittlung in die USA auf Grundlage des EU-US Data Privacy Framework erfolgen.
            </p>
            <p class="mt-3 leading-relaxed text-forest">
              Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO, sofern deine Anfrage auf eine Zusammenarbeit oder einen Vertrag abzielt, ansonsten Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen).
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">6. Externe Links und Plattformen</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Diese Website enthält Links zu unseren Profilen auf externen Plattformen (Spotify, Apple Podcasts, YouTube, Instagram). Es handelt sich um einfache Links, nicht um eingebettete Inhalte: Erst wenn du einen Link anklickst, verlässt du diese Website und es werden Daten an den jeweiligen Anbieter übertragen. Für die Datenverarbeitung auf den Zielseiten sind die jeweiligen Anbieter verantwortlich.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">7. Speicherdauer</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Personenbezogene Daten werden nur so lange gespeichert, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Server-Logfiles werden vom Hosting-Anbieter nach kurzer Zeit automatisch gelöscht. E-Mail-Anfragen löschen wir, sobald sie abschließend bearbeitet sind und keine Aufbewahrungspflichten entgegenstehen.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">8. Deine Rechte</h2>
            <ul class="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-forest">
              <li>Auskunft über gespeicherte personenbezogene Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen Verarbeitungen, die auf Art. 6 Abs. 1 lit. f DSGVO beruhen (Art. 21 DSGVO)</li>
            </ul>
            <p class="mt-3 leading-relaxed text-forest">
              Zur Ausübung deiner Rechte genügt eine formlose Nachricht an die oben genannte E-Mail-Adresse.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">9. Beschwerderecht</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren, wenn du der Ansicht bist, dass die Verarbeitung deiner personenbezogenen Daten gegen Datenschutzrecht verstößt (Art. 77 DSGVO).
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">10. Aktualisierung dieser Datenschutzerklärung</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Wir passen diese Datenschutzerklärung an, wenn sich rechtliche, technische oder organisatorische Änderungen ergeben.
            </p>
          </article>
        </section>

        <p class="mt-8 text-[14px] text-forest">Stand: 23. September 2026</p>
      </main>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: []
})
export class DatenschutzComponent {}
