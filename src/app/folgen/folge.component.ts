import { Component, DOCUMENT, DestroyRef, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { FeedEpisode, FeedEpisodeSummary, FolgenService, formatDate, formatDuration } from './folgen.service';
import { LINKS } from '../shared/links';
import { episodeStructuredData, setJsonLd } from '../shared/structured-data';

/**
 * /folgen/:slug: one episode with its show notes, so search engines find it
 * by guest, title and topic, and links to the episodes before and after it.
 * Listening happens on the podcast platforms.
 */
@Component({
  selector: 'app-folge',
  imports: [RouterLink],
  template: `
    <main class="bg-paper">
      @if (episode(); as episode) {
        <article>
          <header class="relative overflow-hidden border-b-2 border-ink bg-pitch">
            <!-- Pitch markings as on the start page -->
            <div aria-hidden="true" class="pointer-events-none absolute inset-0">
              <div class="absolute bottom-0 left-[62%] top-0 border-l-2 border-ink/[.12] max-lg:hidden"></div>
              <div class="absolute left-[62%] top-1/2 aspect-square w-[min(44vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink/[.12] max-lg:hidden"></div>
              <div class="absolute -right-0.5 bottom-[16%] top-[16%] w-[10%] border-2 border-ink/[.12]"></div>
            </div>

            <div class="relative mx-auto box-content grid max-w-[1280px] items-center gap-10 px-6 pb-[clamp(40px,6vw,80px)] pt-[clamp(32px,5vw,56px)] lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
              <div class="flex min-w-0 flex-col gap-6">
                <a routerLink="/folgen" class="self-start font-mono text-[13px] uppercase tracking-[.12em] text-forest hover:text-ink">← Alle Folgen</a>
                <ul aria-label="Über die Folge" class="m-0 flex list-none flex-wrap gap-2 p-0 font-mono text-[12px] uppercase tracking-[.1em]">
                  @if (episode.code) {
                    <li class="rounded-full bg-ink px-3 py-1.5 text-paper">{{ episode.code }}</li>
                  }
                  <li class="rounded-full border-[1.5px] border-ink px-3 py-[5px]">{{ date(episode) }}</li>
                  <li class="rounded-full border-[1.5px] border-ink px-3 py-[5px]">{{ duration(episode) }}</li>
                </ul>
                <h1 class="m-0 hyphens-auto text-balance font-display text-[clamp(38px,5.6vw,76px)] [overflow-wrap:anywhere] font-black uppercase leading-[.92]">{{ episode.title }}</h1>
                <div class="flex flex-wrap gap-3">
                  <a [href]="episode.listenUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2.5 rounded-full bg-ink px-[22px] py-3.5 font-semibold text-paper hover:bg-moss"><span aria-hidden="true" class="text-[12px]">▶</span>Auf Spotify anhören</a>
                  <a [href]="links.applePodcasts" target="_blank" rel="noopener noreferrer" class="rounded-full border-2 border-ink px-5 py-3 font-semibold hover:bg-ink hover:text-paper">Apple Podcasts</a>
                  <a [href]="links.youtube" target="_blank" rel="noopener noreferrer" class="rounded-full border-2 border-ink px-5 py-3 font-semibold hover:bg-ink hover:text-paper">YouTube</a>
                </div>
              </div>

              <!-- Episode card in the style of "Aktuelle Folge" on the start page -->
              <a [href]="episode.listenUrl" target="_blank" rel="noopener noreferrer" aria-hidden="true" tabindex="-1" class="mx-auto box-content flex w-full max-w-[340px] rotate-[1.5deg] flex-col rounded-md border-2 border-ink bg-paper shadow-block transition-transform hover:rotate-0 max-lg:hidden">
                <span class="flex items-center justify-between border-b-2 border-ink px-4 py-3 font-mono text-[12px] uppercase tracking-[.1em]">
                  <span>{{ episode.code || 'Folge' }}</span>
                  <span>{{ duration(episode) }}</span>
                </span>
                <img src="assets/cover.jpg" alt="" width="1400" height="1400" loading="lazy" decoding="async" class="block aspect-square h-auto w-full border-b-2 border-ink" />
                <span class="flex items-center justify-between gap-3 px-4 py-3.5">
                  <span class="font-display text-[22px] font-extrabold uppercase leading-none">Jetzt reinhören</span>
                  <span class="flex size-10 items-center justify-center rounded-full bg-ink text-[14px] text-paper">▶</span>
                </span>
              </a>
            </div>
          </header>

          <div class="mx-auto box-content grid max-w-[1280px] gap-12 px-6 py-[clamp(48px,6vw,96px)] lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
            <div class="flex min-w-0 flex-col gap-6">
              <p class="m-0 font-mono text-[13px] uppercase tracking-[.12em] text-moss">Shownotes</p>
              <!-- Show notes from the feed, cleaned up at build time (scripts/fetch-feed.mjs); Angular sanitizes them -->
              <section
                aria-label="Shownotes"
                class="max-w-[720px] text-[18px] leading-[1.65] text-forest
                  [&>p:first-child]:text-[clamp(21px,2vw,24px)] [&>p:first-child]:font-semibold [&>p:first-child]:leading-snug [&>p:first-child]:text-ink
                  [&_p]:mb-4 [&_strong]:font-semibold [&_strong]:text-ink
                  [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:decoration-moss [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a]:[overflow-wrap:anywhere] hover:[&_a]:decoration-ink
                  [&_ul]:my-8 [&_ul]:list-none [&_ul]:border-t-2 [&_ul]:border-ink [&_ul]:p-0
                  [&_li]:relative [&_li]:border-b [&_li]:border-ink/20 [&_li]:py-3 [&_li]:pl-8 [&_li]:text-ink
                  [&_li]:before:absolute [&_li]:before:left-1 [&_li]:before:top-[1.35em] [&_li]:before:size-2.5 [&_li]:before:rounded-full [&_li]:before:bg-signal [&_li]:before:content-['']
                  [&_li_ul]:my-2 [&_li_ul]:border-t-0 [&_li_li]:border-b-0 [&_li_li]:py-1 [&_li_li]:text-forest [&_li_li]:before:bg-moss
                  [&_ol]:my-8 [&_ol]:list-decimal [&_ol]:pl-6
                  [&_blockquote]:my-10 [&_blockquote]:border-l-4 [&_blockquote]:border-signal [&_blockquote]:pl-6 [&_blockquote]:font-display [&_blockquote]:text-[clamp(26px,3vw,36px)] [&_blockquote]:font-extrabold [&_blockquote]:uppercase [&_blockquote]:leading-[1.05] [&_blockquote]:text-ink [&_blockquote_p]:m-0"
                [innerHTML]="episode.descriptionHtml"></section>
            </div>

            <aside class="flex flex-col gap-4 self-start lg:sticky lg:top-28">
              <nav aria-label="Weitere Folgen" class="flex flex-col overflow-hidden rounded-md border-2 border-ink bg-paper shadow-block">
                <p class="m-0 border-b-2 border-ink bg-ink px-4 py-3 font-mono text-[12px] uppercase tracking-[.1em] text-pitch">Weitere Folgen</p>
                @if (neighbours().newer; as newer) {
                  <a [routerLink]="['/folgen', newer.slug]" class="flex flex-col gap-1.5 border-b-2 border-ink px-4 py-4 hover:bg-pitch">
                    <span class="font-mono text-[12px] uppercase tracking-[.1em] text-moss">Neuere Folge{{ newer.code ? ' · ' + newer.code : '' }}</span>
                    <!-- Keeps label and title apart in the link's name -->
                    {{ ' ' }}
                    <span class="line-clamp-3 hyphens-auto font-display text-[22px] font-extrabold uppercase leading-[1.05]">{{ newer.title }}</span>
                  </a>
                }
                @if (neighbours().older; as older) {
                  <a [routerLink]="['/folgen', older.slug]" class="flex flex-col gap-1.5 border-b-2 border-ink px-4 py-4 hover:bg-pitch">
                    <span class="font-mono text-[12px] uppercase tracking-[.1em] text-moss">Ältere Folge{{ older.code ? ' · ' + older.code : '' }}</span>
                    <!-- Keeps label and title apart in the link's name -->
                    {{ ' ' }}
                    <span class="line-clamp-3 hyphens-auto font-display text-[22px] font-extrabold uppercase leading-[1.05]">{{ older.title }}</span>
                  </a>
                }
                <a routerLink="/folgen" class="flex items-center justify-between gap-3 px-4 py-4 font-semibold hover:bg-pitch">Alle Folgen ansehen <span aria-hidden="true">→</span></a>
              </nav>
            </aside>
          </div>
        </article>
      } @else {
        <div class="mx-auto box-content flex max-w-[880px] flex-col gap-6 px-6 py-[clamp(48px,6vw,80px)]">
          <a routerLink="/folgen" class="self-start font-mono text-[13px] uppercase tracking-[.12em] text-moss hover:text-ink">← Alle Folgen</a>
          <h1 class="m-0 font-display text-[clamp(34px,5.5vw,68px)] font-black uppercase leading-[.95]">Folge nicht gefunden</h1>
          <p class="m-0 text-[19px] leading-[1.55] text-forest">Diese Folge gibt es nicht (mehr). Alle Folgen findest du im Archiv.</p>
        </div>
      }
    </main>
  `
})
export class FolgeComponent {
  protected readonly links = LINKS;
  private readonly episodes = toSignal(inject(FolgenService).episodes(), { initialValue: [] as FeedEpisodeSummary[] });
  // The episodes released before and after this one (the list is newest first)
  protected readonly neighbours = computed<{ newer?: FeedEpisodeSummary; older?: FeedEpisodeSummary }>(() => {
    const list = this.episodes();
    const index = list.findIndex(item => item.slug === this.episode()?.slug);
    return index < 0 ? {} : { newer: list[index - 1], older: list[index + 1] };
  });
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
