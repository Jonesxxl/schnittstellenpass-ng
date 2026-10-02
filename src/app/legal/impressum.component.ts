import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-impressum',
  standalone: true,
  template: `
    <div class="bg-paper">


      <main class="mx-auto max-w-5xl break-words px-6 py-[clamp(48px,6vw,80px)]">
        <section class="mb-10">
          <div class="flex flex-col gap-4">
            <p class="m-0 font-mono text-[13px] uppercase tracking-[.12em] text-moss">Rechtliche Angaben</p>
            <h1 class="m-0 font-display text-[clamp(24px,8.5vw,80px)] font-black uppercase leading-[.9]">Impressum</h1>
            <p class="m-0 max-w-[720px] text-[17px] leading-normal text-forest">
              Angaben gemäß § 5 DDG und § 18 Abs. 2 MStV für den Webauftritt schnittstellenpass.de.
            </p>
          </div>
        </section>

        <section class="space-y-5">
          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">Diensteanbieter</h2>
            <div class="mt-4 space-y-1 leading-relaxed text-forest">
              <p><strong>Marc Agyemang</strong></p>
              <p>Schnittstellenpass Podcast</p>
              <p>Steig 12/1</p>
              <p>78628 Rottweil</p>
              <p>Deutschland</p>
            </div>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">Kontakt</h2>
            <div class="mt-4 space-y-2 leading-relaxed text-forest">
              <p>E-Mail: <a href="mailto:schnittstellenpass@gmail.com" class="font-semibold underline decoration-2 underline-offset-2 hover:text-moss">schnittstellenpass@gmail.com</a></p>
            </div>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <div class="mt-4 space-y-1 leading-relaxed text-forest">
              <p>Marc Agyemang</p>
              <p>Steig 12/1</p>
              <p>78628 Rottweil</p>
            </div>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">Haftung für Inhalte</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Für eigene Inhalte auf diesen Seiten bin ich nach den allgemeinen Gesetzen verantwortlich. Für fremde Informationen, die ich lediglich übermittle oder speichere, gelten die Haftungsbeschränkungen der Art. 4 bis 6 des Digital Services Act (DSA). Eine allgemeine Verpflichtung, solche Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen, besteht nicht (Art. 8 DSA). Sobald mir konkrete Rechtsverletzungen bekannt werden, entferne ich die betreffenden Inhalte umgehend.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">Haftung für Links</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Dieses Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar; bei Bekanntwerden von Rechtsverletzungen entferne ich derartige Links umgehend. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">Urheberrecht</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung der jeweiligen Urheberin bzw. des jeweiligen Urhebers.
            </p>
          </article>

          <article class="rounded-md border-2 border-ink bg-paper p-6">
            <h2 class="font-display text-[28px] font-extrabold uppercase leading-none">Verbraucherstreitbeilegung</h2>
            <p class="mt-4 leading-relaxed text-forest">
              Ich bin weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </article>
        </section>

        <p class="mt-8 text-[14px] text-forest">Stand: 2. Oktober 2026</p>
      </main>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: []
})
export class ImpressumComponent {}
