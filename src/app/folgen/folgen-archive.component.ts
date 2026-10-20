import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FeedEpisodeSummary, FolgenService, formatDate } from './folgen.service';
import { LINKS } from '../shared/links';

/** /folgen: every episode, newest first, each linking to its page, with a play button to Spotify */
@Component({
  selector: 'app-folgen-archive',
  imports: [RouterLink],
  template: `
    <main class="bg-paper">
      <header class="relative overflow-hidden border-b-2 border-ink bg-pitch">
        <!-- Pitch markings as on the start page -->
        <div aria-hidden="true" class="pointer-events-none absolute inset-0">
          <div class="absolute bottom-0 left-[70%] top-0 border-l-2 border-ink/[.12] max-md:hidden"></div>
          <div class="absolute left-[70%] top-1/2 aspect-square w-[min(40vw,380px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink/[.12] max-md:hidden"></div>
          <div class="absolute -right-0.5 bottom-[16%] top-[16%] w-[10%] border-2 border-ink/[.12]"></div>
        </div>
        <div class="relative mx-auto box-content flex max-w-[1280px] flex-col gap-4 px-6 pb-[clamp(40px,6vw,72px)] pt-[clamp(48px,6vw,80px)]">
          <p class="m-0 font-mono text-[13px] uppercase tracking-[.12em] text-forest">Archiv</p>
          <h1 class="m-0 font-display text-[clamp(48px,8vw,104px)] font-black uppercase leading-[.9]">Alle Folgen</h1>
          <p class="m-0 max-w-[640px] text-pretty text-[19px] leading-[1.55] text-forest">
            @if (episodes().length) {
              {{ episodes().length }} Gespräche über Fußball zwischen Profi und Amateur, von der Kreisliga bis in die Bundesliga. Jede Folge mit Shownotes zum Nachlesen.
            } @else {
              Gespräche über Fußball zwischen Profi und Amateur, von der Kreisliga bis in die Bundesliga.
            }
          </p>
        </div>
      </header>

      <div class="mx-auto box-content flex max-w-[1280px] flex-col gap-10 px-6 pb-[clamp(48px,6vw,80px)] pt-[clamp(32px,4vw,56px)]">
        @if (episodes().length) {
          <ol class="m-0 flex list-none flex-col border-t-2 border-ink p-0">
            @for (episode of episodes(); track episode.slug) {
              <!-- The title links to the episode page and covers the row, the play button opens Spotify -->
              <li class="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-b-2 border-ink px-2 py-[22px] hover:bg-pitch sm:grid-cols-[minmax(0,96px)_minmax(0,1fr)_auto] sm:gap-5">
                <div class="col-span-2 font-mono text-[13px] text-moss sm:col-span-1">
                  {{ episode.code }}<span class="sm:hidden">{{ episode.code ? ' · ' : '' }}{{ date(episode) }}</span>
                </div>
                <div class="flex min-w-0 flex-col gap-1">
                  <h2 class="m-0 line-clamp-2 hyphens-auto font-display text-[clamp(22px,2.4vw,30px)] font-extrabold uppercase leading-[1.15]">
                    <a [routerLink]="['/folgen', episode.slug]" class="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-ink focus-visible:after:[outline-offset:-4px]">{{ episode.title }}</a>
                  </h2>
                  <p class="m-0 line-clamp-2 text-pretty text-[15px] text-forest">{{ episode.summary }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="whitespace-nowrap rounded-full border-[1.5px] border-ink px-2.5 py-[5px] font-mono text-[11px] uppercase tracking-[.1em] max-sm:hidden">{{ date(episode) }}</span>
                  <!-- Name as hidden text, not aria-label, which would drop the new-tab hint from styles.scss -->
                  <a [href]="episode.listenUrl" target="_blank" rel="noopener noreferrer" title="Auf Spotify anhören" class="relative z-[1] flex size-10 items-center justify-center rounded-full bg-ink text-[14px] text-paper hover:bg-moss">
                    <span aria-hidden="true">▶</span>
                    <span class="sr-only">Auf Spotify anhören: {{ episode.title }}</span>
                  </a>
                </div>
              </li>
            }
          </ol>
        } @else {
          <a [href]="links.spotify" target="_blank" rel="noopener noreferrer" class="self-start rounded-full bg-ink px-[22px] py-3.5 font-semibold text-paper hover:bg-moss">Alle Folgen auf Spotify</a>
        }
      </div>
    </main>
  `
})
export class FolgenArchiveComponent {
  protected readonly links = LINKS;
  protected readonly episodes = toSignal(inject(FolgenService).episodes(), { initialValue: [] as FeedEpisodeSummary[] });

  protected date(episode: FeedEpisodeSummary): string {
    return formatDate(episode.date);
  }
}
