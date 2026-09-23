import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-impressum',
  standalone: true,
  template: `
    <div class="bg-paper">


      <main class="mx-auto max-w-5xl px-6 py-[clamp(48px,6vw,80px)]">
        <section class="mb-10">
          <div class="flex flex-col gap-4">
            <p class="m-0 font-mono text-[13px] uppercase tracking-[.12em] text-moss">Rechtliche Angaben</p>
            <h1 class="m-0 font-display text-[clamp(24px,8.5vw,80px)] font-black uppercase leading-[.9]">Impressum</h1>
            <p class="m-0 max-w-[720px] text-[17px] leading-normal text-forest">
              Angaben gemäß § 5 TMG und § 18 Abs. 2 MStV für den Webauftritt von Schnittstellenpass.
            </p>
            <p class="m-0 rounded-md border-2 border-ink bg-pitch px-4 py-3 text-[14px] leading-normal">
              Hinweis: Bitte ergänze die Platzhalterdaten (Name/Adresse), damit das Impressum vollständig rechtsverbindlich ist.
            </p>
          </div>
        </section>

        <section class="space-y-5">
          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">Diensteanbieter</h2>
            <div class="mt-4 space-y-1 leading-relaxed text-forest">
              <p><strong>Schnittstellenpass Podcast</strong></p>
              <p>[Vor- und Nachname ergänzen]</p>
              <p>[Straße und Hausnummer ergänzen]</p>
              <p>[PLZ Ort ergänzen]</p>
              <p>Deutschland</p>
            </div>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">Kontakt</h2>
            <div class="mt-4 space-y-2 leading-relaxed text-forest">
              <p>E-Mail: <a href="mailto:schnittstellenpassderpodcast@gmail.com" class="font-semibold underline decoration-2 underline-offset-2 hover:text-moss">schnittstellenpassderpodcast@gmail.com</a></p>
              <p>Telefon: [Telefonnummer ergänzen]</p>
            </div>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <div class="mt-4 space-y-1 leading-relaxed text-forest">
              <p>[Vor- und Nachname ergänzen]</p>
              <p>[Straße und Hausnummer ergänzen]</p>
              <p>[PLZ Ort ergänzen]</p>
            </div>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">Haftung für Inhalte</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">Haftung für Links</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">Urheberrecht</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung der jeweiligen Urheberin bzw. des jeweiligen Urhebers.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">EU-Streitbeilegung</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" class="font-semibold underline decoration-2 underline-offset-2 hover:text-moss">https://ec.europa.eu/consumers/odr</a>.
              Unsere E-Mail-Adresse findest du oben im Impressum.
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
export class ImpressumComponent {}
