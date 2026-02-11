import { Component, signal, OnInit, inject } from '@angular/core';

import { SpotifyService } from '../services/spotify.service';
import { SpotifyEpisode } from '../models/spotify.models';

const APPLE_SHOW_URL = 'https://podcasts.apple.com/us/podcast/schnittstellenpass-zwischen-profi-und-amateur/id1561845736';
const APPLE_LOOKUP_URL = 'https://itunes.apple.com/lookup?id=1561845736&entity=podcastEpisode&limit=200';

interface Episode {
  id: string;
  title: string;
  date: string;
  releaseDateIso: string;
  duration: string;
  episodeNumber: number;
  thumbnail?: string;
  spotifyUrl: string;
  youtubeUrl: string;
  appleMusicUrl: string;
  description?: string;
}

interface AppleLookupItem {
  kind?: string;
  trackName?: string;
  releaseDate?: string;
  trackViewUrl?: string;
}

interface AppleLookupResponse {
  results?: AppleLookupItem[];
}

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [],
  template: `
    <div class="relative min-h-screen overflow-x-hidden overflow-y-auto bg-gradient-to-b from-emerald-50 via-slate-50 to-amber-50/40">
      <div class="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 20% 10%, rgba(5,150,105,0.08), transparent 35%), radial-gradient(circle at 80% 0%, rgba(15,23,42,0.05), transparent 30%);"></div>
      </div>

      <div class="relative z-10 h-1.5 w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-500"></div>

      <main class="relative z-10 container mx-auto max-w-6xl px-4 md:px-8 py-10 md:py-16">
        <section class="mb-10 md:mb-12">
          <div class="overflow-hidden rounded-3xl border border-emerald-200/80 bg-white/95 shadow-xl shadow-amber-100/60">
            <div class="h-1 w-full bg-gradient-to-r from-emerald-700 via-emerald-500 to-amber-500"></div>
            <div class="px-6 py-10 md:px-12 md:py-12 text-center">
              <p class="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Schnittstellenpass Podcast</p>
              <h1 class="mt-3 text-4xl md:text-6xl font-black tracking-tight text-emerald-800 uppercase">Episoden</h1>
              <div class="mx-auto mt-5 h-px w-32 bg-slate-300"></div>
              <div class="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-slate-700">
                <svg class="h-4 w-4 text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke-width="1.8" />
                  <polygon points="12,8.5 14.8,10.2 13.8,13.4 10.2,13.4 9.2,10.2" stroke-width="1.4" />
                  <path stroke-width="1.4" stroke-linecap="round" d="M7.5 8.8 9.2 10.2m7.3-1.4-1.7 1.4M8.5 15.6l1.7-2.2m5.3 2.2-1.7-2.2M12 17.8v-4.4" />
                </svg>
                Die letzten 5 Folgen
              </div>
            </div>
          </div>
        </section>

        @if (isLoading() && episodes().length === 0) {
          <div class="rounded-2xl border border-emerald-200 bg-white p-12 text-center shadow-lg">
            <div class="mx-auto mb-5 inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-b-transparent"></div>
            <p class="text-lg font-semibold text-slate-700">Lade Episoden...</p>
          </div>
        }

        @if (!isLoading() && episodes().length === 0) {
          <div class="rounded-2xl border border-emerald-200 bg-white p-12 text-center shadow-lg">
            <p class="text-xl font-semibold text-slate-700">Keine Episoden gefunden.</p>
            <p class="mt-2 text-slate-500">Bitte versuche es später noch einmal.</p>
          </div>
        }

        <div class="grid grid-cols-1 gap-7 md:gap-8">
          @for (episode of episodes(); track episode.id; let i = $index) {
            <article class="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-lg transition duration-300 hover:shadow-xl">
              <header class="relative overflow-hidden bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 px-5 py-5 md:px-7 md:py-6">
                <div class="absolute -right-3 -top-6 text-7xl md:text-8xl font-black text-white/10">{{ episode.episodeNumber }}</div>
                <div class="relative z-10 flex flex-col gap-4">
                  <div class="flex flex-wrap items-center gap-2 text-sm">
                    <span class="rounded-full border border-amber-200/60 bg-amber-400/20 px-3 py-1.5 font-bold text-white backdrop-blur">Folge #{{ episode.episodeNumber }}</span>
                    <span class="rounded-full bg-white/15 px-3 py-1.5 font-medium text-white/95 backdrop-blur">{{ episode.date }}</span>
                    <span class="rounded-full bg-white/15 px-3 py-1.5 font-medium text-white/95 backdrop-blur">{{ episode.duration }}</span>
                  </div>
                  <h2 class="text-xl md:text-2xl font-extrabold leading-tight text-white">{{ episode.title }}</h2>
                </div>
              </header>

              <div class="p-5 md:p-7">
                <div class="mb-6">
                  <h3 class="mb-3 text-base font-semibold tracking-wide text-slate-700 uppercase">Jetzt anhören auf</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <a
                      [href]="episode.spotifyUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="group flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 transition hover:border-emerald-400 hover:bg-emerald-100/70">
                      <div>
                        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Spotify</p>
                        <p class="mt-1 text-sm font-semibold text-slate-800">Jetzt hören</p>
                      </div>
                      <span class="text-sm font-semibold text-emerald-700 transition-transform group-hover:translate-x-1">Öffnen</span>
                    </a>

                    <a
                      [href]="episode.youtubeUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="group flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3 transition hover:border-rose-400 hover:bg-rose-100/70">
                      <div>
                        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">YouTube</p>
                        <p class="mt-1 text-sm font-semibold text-slate-800">Video ansehen</p>
                      </div>
                      <span class="text-sm font-semibold text-emerald-700 transition-transform group-hover:translate-x-1">Öffnen</span>
                    </a>

                    <a
                      [href]="episode.appleMusicUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="group flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-3 transition hover:border-indigo-400 hover:bg-indigo-100/70">
                      <div>
                        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Apple Podcasts</p>
                        <p class="mt-1 text-sm font-semibold text-slate-800">Podcast öffnen</p>
                      </div>
                      <span class="text-sm font-semibold text-emerald-700 transition-transform group-hover:translate-x-1">Öffnen</span>
                    </a>
                  </div>
                </div>

                <div class="border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    (click)="shareEpisode(episode)"
                    class="w-full rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-5 py-3 text-sm md:text-base font-semibold text-white transition hover:from-emerald-800 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-50">
                    Episode teilen
                  </button>
                </div>
              </div>
            </article>
          }
        </div>

        @if (episodes().length > 0 && hasMoreEpisodes()) {
          <div class="mt-12 text-center">
            <div class="rounded-2xl border border-emerald-200 bg-white p-7 shadow-lg">
              <p class="mb-5 text-lg font-semibold text-slate-700">Noch mehr Episoden entdecken?</p>
              <button
                type="button"
                [disabled]="isLoading()"
                (click)="loadMoreEpisodes()"
                class="rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-8 py-3 text-base font-semibold text-white transition hover:from-emerald-800 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-50">
                @if (isLoading()) {
                  <span class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent align-[-2px]"></span>
                }
                Weitere Episoden laden
              </button>
            </div>
          </div>
        }
      </main>

      <footer class="relative z-10 mt-16 border-t border-emerald-900/20 bg-slate-900 py-8">
        <div class="container mx-auto max-w-6xl px-4 md:px-8">
          <div class="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p class="text-sm font-medium text-slate-300">© 2026 Schnittstellenpass | Zwischen Profis & Amateur</p>
            <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
              <a href="/datenschutz" class="transition hover:text-amber-300">Datenschutz</a>
              <a href="/impressum" class="transition hover:text-amber-300">Impressum</a>
              <a href="/contact" class="transition hover:text-amber-300">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class EpisodesComponent implements OnInit {
  private readonly spotifyService = inject(SpotifyService);
  private appleLookupPromise: Promise<void> | null = null;
  private appleEpisodeUrlByTitle = new Map<string, string>();
  private appleEpisodeUrlByTitleDate = new Map<string, string>();

  // Episodes data
  protected episodes = signal<Episode[]>([]);
  protected isLoading = signal<boolean>(false);
  protected currentOffset = signal<number>(0);
  protected hasMoreEpisodes = signal<boolean>(true);

  ngOnInit(): void {
    this.loadEpisodes();
  }

  // Share episode
  protected shareEpisode(episode: Episode): void {
    const shareText = `Hör dir diese Episode von Schnittstellenpass an: ${episode.title}\n\n` +
                     `Zwischen Profi und Amateur\n\n` +
                     `Spotify: ${episode.spotifyUrl}\n` +
                     `YouTube: ${episode.youtubeUrl}\n` +
                     `Apple Podcasts: ${episode.appleMusicUrl}`;

    if (navigator.share) {
      navigator.share({
        title: episode.title,
        text: shareText,
        url: episode.spotifyUrl
      }).catch(() => {
        // Fallback: Copy to clipboard
        this.copyToClipboard(shareText);
      });
    } else {
      this.copyToClipboard(shareText);
    }
  }

  // Copy to clipboard helper
  private copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Links kopiert');
    });
  }

  /**
   * Load episodes from Spotify API
   */
  protected loadEpisodes(offset: number = 0): void {
    this.isLoading.set(true);

    // Fetch 5 episodes from Spotify
    this.spotifyService.getEpisodes(undefined, 5, offset).subscribe({
      next: (response) => {
        const newEpisodes = response.items.map((spotifyEpisode, index) => this.transformToEpisode(spotifyEpisode, offset + index + 1));

        if (offset === 0) {
          // First load - replace all episodes
          this.episodes.set(newEpisodes);
        } else {
          // Load more - append to existing episodes
          this.episodes.update(current => [...current, ...newEpisodes]);
        }

        // Update pagination state
        this.currentOffset.set(offset + response.items.length);
        this.hasMoreEpisodes.set(response.next !== null);

        // Resolve direct Apple episode links and keep show URL as fallback.
        this.resolveAppleEpisodeUrls();
      },
      error: (error) => {
        console.error('Failed to fetch episodes:', error);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Transform Spotify episode to component Episode model
   */
  private transformToEpisode(spotifyEpisode: SpotifyEpisode, episodeNumber: number): Episode {
    // YouTube and Apple Music URLs are not available from Spotify API
    // Use show URL as fallback; direct episode links are resolved separately.
    const youtubeUrl = 'https://www.youtube.com/@schnittstellenpass1105';
    const appleMusicUrl = APPLE_SHOW_URL;

    // Format date from YYYY-MM-DD to DD.MM.YYYY
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    // Format duration from milliseconds to MM:SS or HH:MM:SS
    const formatDuration = (ms: number): string => {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;
        return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      } else {
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
      }
    };

    // Strip HTML from description
    const stripHtml = (html: string): string => {
      const tmp = document.createElement('DIV');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    };

    return {
      id: spotifyEpisode.id,
      title: spotifyEpisode.name,
      date: formatDate(spotifyEpisode.release_date),
      releaseDateIso: spotifyEpisode.release_date,
      duration: formatDuration(spotifyEpisode.duration_ms),
      episodeNumber: episodeNumber,
      thumbnail: spotifyEpisode.images?.[0]?.url,
      spotifyUrl: spotifyEpisode.external_urls?.spotify,
      youtubeUrl: youtubeUrl,
      appleMusicUrl: appleMusicUrl,
      description: stripHtml(spotifyEpisode.description)
    };
  }

  /**
   * Load more episodes
   */
  protected loadMoreEpisodes(): void {
    if (this.hasMoreEpisodes() && !this.isLoading()) {
      this.loadEpisodes(this.currentOffset());
    }
  }

  private resolveAppleEpisodeUrls(): void {
    this.loadAppleEpisodeMap()
      .then(() => {
        this.episodes.update((current) =>
          current.map((episode) => {
            const appleUrl = this.getAppleEpisodeUrl(episode);
            if (appleUrl === episode.appleMusicUrl) {
              return episode;
            }
            return { ...episode, appleMusicUrl: appleUrl };
          })
        );
      })
      .catch((error) => {
        console.warn('Failed to resolve Apple Podcasts episode URLs:', error);
      });
  }

  private loadAppleEpisodeMap(): Promise<void> {
    if (this.appleEpisodeUrlByTitle.size > 0 || this.appleEpisodeUrlByTitleDate.size > 0) {
      return Promise.resolve();
    }

    if (this.appleLookupPromise) {
      return this.appleLookupPromise;
    }

    this.appleLookupPromise = fetch(APPLE_LOOKUP_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Apple lookup failed with status ${response.status}`);
        }
        return response.json() as Promise<AppleLookupResponse>;
      })
      .then((data) => {
        const items = data.results ?? [];
        for (const item of items) {
          if (item.kind !== 'podcast-episode' || !item.trackName || !item.trackViewUrl) {
            continue;
          }

          const normalizedTitle = this.normalizeTitle(item.trackName);
          if (!normalizedTitle) {
            continue;
          }

          const releaseDateIso = item.releaseDate?.slice(0, 10);
          if (releaseDateIso) {
            const titleDateKey = this.createTitleDateKey(normalizedTitle, releaseDateIso);
            this.appleEpisodeUrlByTitleDate.set(titleDateKey, item.trackViewUrl);
          }

          if (!this.appleEpisodeUrlByTitle.has(normalizedTitle)) {
            this.appleEpisodeUrlByTitle.set(normalizedTitle, item.trackViewUrl);
          }
        }
      })
      .finally(() => {
        this.appleLookupPromise = null;
      });

    return this.appleLookupPromise;
  }

  private getAppleEpisodeUrl(episode: Episode): string {
    const normalizedTitle = this.normalizeTitle(episode.title);
    const titleDateKey = this.createTitleDateKey(normalizedTitle, episode.releaseDateIso);

    return (
      this.appleEpisodeUrlByTitleDate.get(titleDateKey) ||
      this.appleEpisodeUrlByTitle.get(normalizedTitle) ||
      APPLE_SHOW_URL
    );
  }

  private createTitleDateKey(normalizedTitle: string, releaseDateIso: string): string {
    return `${normalizedTitle}|${releaseDateIso}`;
  }

  private normalizeTitle(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }
}
