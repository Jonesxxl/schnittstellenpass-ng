import { Component, DOCUMENT, DestroyRef, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { FeedEpisode, formatDate, formatDuration } from './folgen.service';
import { LINKS } from '../shared/links';
import { episodeStructuredData, setJsonLd } from '../shared/structured-data';

/**
 * /folgen/:slug: one episode with its show notes, so search engines find it
 * by guest, title and topic. Listening happens on the podcast platforms.
 */
@Component({
  selector: 'app-folge',
  imports: [RouterLink],
  template: `
    <main class="bg-paper">
      <article class="mx-auto box-content flex max-w-[880px] flex-col gap-8 px-6 py-[clamp(48px,6vw,80px)]">
        <a routerLink="/folgen" class="self-start font-mono text-[13px] uppercase tracking-[.12em] text-moss hover:text-ink">← Alle Folgen</a>

        @if (episode(); as episode) {
          <div class="flex flex-col gap-4">
            <p class="m-0 font-mono text-[13px] uppercase tracking-[.12em] text-forest">
              {{ episode.code ? episode.code + ' · ' : '' }}{{ date(episode) }} · {{ duration(episode) }}
            </p>
            <h1 class="m-0 hyphens-auto text-balance font-display text-[clamp(34px,5.5vw,68px)] [overflow-wrap:anywhere] font-black uppercase leading-[.95]">{{ episode.title }}</h1>
          </div>

          <div class="flex flex-wrap gap-3">
            <a [href]="episode.listenUrl" target="_blank" rel="noopener noreferrer" class="rounded-full bg-ink px-[22px] py-3.5 font-semibold text-paper hover:bg-moss">Auf Spotify anhören</a>
            <a [href]="links.applePodcasts" target="_blank" rel="noopener noreferrer" class="rounded-full border-2 border-ink px-5 py-3 font-semibold hover:bg-ink hover:text-paper">Apple Podcasts</a>
            <a [href]="links.youtube" target="_blank" rel="noopener noreferrer" class="rounded-full border-2 border-ink px-5 py-3 font-semibold hover:bg-ink hover:text-paper">YouTube</a>
          </div>

          <section aria-label="Shownotes" class="max-w-[720px] border-t-2 border-ink pt-8 text-[18px] leading-[1.65] text-forest [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-2 [&_li]:mb-1 [&_p]:mb-4 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6" [innerHTML]="episode.descriptionHtml"></section>

          <a routerLink="/folgen" class="self-start rounded-full border-2 border-ink px-5 py-3 font-semibold hover:bg-ink hover:text-paper">Alle Folgen ansehen →</a>
        } @else {
          <div class="flex flex-col gap-4">
            <h1 class="m-0 font-display text-[clamp(34px,5.5vw,68px)] font-black uppercase leading-[.95]">Folge nicht gefunden</h1>
            <p class="m-0 text-[19px] leading-[1.55] text-forest">Diese Folge gibt es nicht (mehr). Alle Folgen findest du im Archiv.</p>
          </div>
        }
      </article>
    </main>
  `
})
export class FolgeComponent {
  protected readonly links = LINKS;
  protected readonly episode = toSignal(
    inject(ActivatedRoute).data.pipe(map(data => data['episode'] as FeedEpisode | null)),
    { requireSync: true }
  );

  constructor() {
    // Structured data of this episode, in the prerendered HTML; it goes when another page opens
    const document = inject(DOCUMENT);
    effect(() => {
      const episode = this.episode();
      setJsonLd(document, 'episode-structured-data', episode ? episodeStructuredData(episode) : null);
    });
    inject(DestroyRef).onDestroy(() => setJsonLd(document, 'episode-structured-data', null));
  }

  protected date(episode: FeedEpisode): string {
    return formatDate(episode.date);
  }

  protected duration(episode: FeedEpisode): string {
    return formatDuration(episode.durationSeconds);
  }
}
