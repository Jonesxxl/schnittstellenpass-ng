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
              Diese Erklärung informiert darüber, wie personenbezogene Daten beim Besuch von schnittstellenpass.de verarbeitet werden.
            </p>
          </div>
        </section>

        <section class="space-y-5">
          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">1. Verantwortlicher</h2>
            <div class="mt-4 space-y-1 leading-relaxed text-forest">
              <p><strong>Marc Agyemang</strong></p>
              <p>Schnittstellenpass Podcast</p>
              <p>Steig 12/1</p>
              <p>78628 Rottweil</p>
              <p>Deutschland</p>
              <p>E-Mail: <a href="mailto:schnittstellenpass@gmail.com" class="font-semibold underline decoration-2 underline-offset-2 hover:text-moss">schnittstellenpass@gmail.com</a></p>
            </div>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">2. Hosting und Server-Logfiles</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Diese Website wird bei Netlify, Inc., 44 Montgomery Street, Suite 300, San Francisco, CA 94104, USA, gehostet. Beim Aufruf werden technisch notwendige Daten in Server-Logfiles verarbeitet (IP-Adresse, Datum und Uhrzeit, angeforderte Ressource, Referrer, Browsertyp und Betriebssystem). Das gilt auch für die kleinen Serverfunktionen bei Netlify, über die die Folgen von Spotify und die Beiträge von Instagram abgerufen werden (siehe Abschnitt 5). Die Verarbeitung dient der Bereitstellung, Stabilität und Sicherheit der Website. Ohne diese Daten kann die Website nicht ausgeliefert werden.
            </p>
            <p class="mt-3 leading-relaxed text-forest">
              Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und funktionsfähigen Betrieb). Mit Netlify besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Soweit Daten in die USA übermittelt werden, stützt sich die Übermittlung auf den EU-US Data Privacy Framework-Angemessenheitsbeschluss bzw. auf Standardvertragsklauseln der EU-Kommission. Die Logfiles werden nur kurzzeitig gespeichert und anschließend gelöscht.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">3. Cookies, Tracking und Schriftarten</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Diese Website setzt keine Cookies zu Analyse- oder Werbezwecken und verwendet keine Tracking- oder Analysedienste. Es werden keine Informationen auf deinem Endgerät gespeichert oder von dort ausgelesen, die über den technisch erforderlichen Abruf der Website hinausgehen. Ein Einwilligungsbanner ist daher nicht erforderlich.
            </p>
            <p class="mt-3 leading-relaxed text-forest">
              Die verwendeten Schriftarten sind lokal eingebunden und werden zusammen mit der Website ausgeliefert. Beim Laden der Seite wird keine Verbindung zu Servern von Drittanbietern wie Google Fonts hergestellt.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">4. Kontaktaufnahme</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Wenn du per E-Mail mit mir in Verbindung trittst, verarbeite ich die von dir mitgeteilten Angaben (z. B. Name, E-Mail-Adresse, Nachrichtentext) ausschließlich zur Bearbeitung deiner Anfrage. Für den E-Mail-Empfang nutze ich Google Mail (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland). Dabei kann eine Übermittlung an die Google LLC in den USA nicht ausgeschlossen werden; die Google LLC ist unter dem EU-US Data Privacy Framework zertifiziert, auf dessen Angemessenheitsbeschluss sich die Übermittlung stützt.
            </p>
            <p class="mt-3 leading-relaxed text-forest">
              Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO, sofern die Anfrage mit einem Vertrag oder vorvertraglichen Maßnahmen zusammenhängt, sonst Art. 6 Abs. 1 lit. f DSGVO (effiziente Bearbeitung von Anfragen). Die Daten werden gelöscht, sobald die Anfrage erledigt ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">5. Inhalte von Spotify und Instagram</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Die neuesten Podcast-Folgen (Titel, Beschreibung, Datum, Dauer und Cover) werden über die Spotify-Schnittstelle abgerufen, die Vorschaubilder und Texte der letzten Instagram-Beiträge über die Instagram-Schnittstelle. Beides erledigt eine Serverfunktion bei meinem Hoster Netlify (siehe Abschnitt 2); auch die Bilder werden von dort ausgeliefert. Dein Browser stellt dabei keine Verbindung zu Spotify oder Instagram bzw. Meta her, und es werden keine personenbezogenen Daten von dir an diese Anbieter übermittelt.
            </p>
            <p class="mt-3 leading-relaxed text-forest">
              Erst wenn du auf eine Folge, einen Beitrag oder einen der Links klickst, öffnet sich die Seite des jeweiligen Anbieters (siehe Abschnitt 6).
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">6. Externe Links und Plattformen</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Diese Website enthält Links zu externen Plattformen (u. a. Spotify, YouTube, Apple Podcasts und Instagram). Beim Anklicken eines Links verlässt du diese Website. Für die Datenverarbeitung auf den Zielseiten sind die jeweiligen Anbieter verantwortlich; es gelten deren Datenschutzhinweise.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">7. Speicherdauer</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Personenbezogene Daten werden nur so lange gespeichert, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Anschließend werden die Daten gelöscht.
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
              <li>Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
            </ul>
            <p class="mt-4 leading-relaxed text-forest">
              <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Soweit ich Daten auf Grundlage berechtigter Interessen (Art. 6 Abs. 1 lit. f DSGVO) verarbeite, kannst du dieser Verarbeitung aus Gründen, die sich aus deiner besonderen Situation ergeben, jederzeit widersprechen. Eine formlose Nachricht an die oben genannte E-Mail-Adresse genügt.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">9. Beschwerderecht</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren, insbesondere in dem Mitgliedstaat deines Aufenthaltsorts, deines Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes, wenn du der Ansicht bist, dass die Verarbeitung deiner personenbezogenen Daten gegen Datenschutzrecht verstößt (Art. 77 DSGVO). Für mich zuständig ist der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg, Lautenschlagerstraße 20, 70173 Stuttgart.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">10. Aktualisierung dieser Datenschutzerklärung</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Ich passe diese Datenschutzerklärung an, wenn sich rechtliche, technische oder organisatorische Änderungen ergeben.
            </p>
          </article>
        </section>

        <p class="mt-8 text-[14px] text-forest">Stand: 5. Oktober 2026</p>
      </main>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: []
})
export class DatenschutzComponent {}
