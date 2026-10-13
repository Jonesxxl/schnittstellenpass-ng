import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, shareReplay } from 'rxjs';

/** An episode in the archive list (public/generated/folgen/index.json) */
export interface FeedEpisodeSummary {
  slug: string;
  // Title without the episode code
  title: string;
  // "S4 · 9" or "Folge 6", if known
  code: string | null;
  // Release date (YYYY-MM-DD)
  date: string;
  durationSeconds: number;
  // Plain-text teaser of the show notes
  summary: string;
  // Episode on Spotify for Creators, with player and links to the apps
  listenUrl: string;
}

/** An episode page (public/generated/folgen/<slug>.json) */
export interface FeedEpisode extends FeedEpisodeSummary {
  // Show notes from the feed; Angular sanitizes them when rendering
  descriptionHtml: string;
}

const SLUG = /^[a-z0-9-]{1,120}$/;

/**
 * All episodes of the podcast, as read from its RSS feed at build time by
 * scripts/fetch-feed.mjs. While prerendering the files come from the build,
 * in the browser they are reused from the page (HTTP transfer cache).
 */
@Injectable({ providedIn: 'root' })
export class FolgenService {
  private readonly http = inject(HttpClient);
  private readonly basePath = '/generated/folgen';

  private readonly list$ = this.http.get<FeedEpisodeSummary[]>(`${this.basePath}/index.json`).pipe(
    catchError(() => of([])),
    shareReplay(1)
  );
  private readonly pages = new Map<string, Observable<FeedEpisode | null>>();

  /** Newest first; empty if the build could not read the feed */
  episodes(): Observable<FeedEpisodeSummary[]> {
    return this.list$;
  }

  /** One episode with its show notes; null if there is no such episode */
  episode(slug: string): Observable<FeedEpisode | null> {
    if (!SLUG.test(slug)) {
      return of(null);
    }
    let page = this.pages.get(slug);
    if (!page) {
      // Shared by the page's title, description and component, so it is loaded once
      page = this.http.get<FeedEpisode>(`${this.basePath}/${slug}.json`).pipe(
        catchError(() => of(null)),
        shareReplay(1)
      );
      this.pages.set(slug, page);
    }
    return page;
  }
}

/** "2026-09-27" → "27.09.2026" */
export function formatDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}

/** 3303 → "55 Min.", 4601 → "1 Std. 17 Min.", 3600 → "1 Std." */
export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (!hours) {
    return `${minutes} Min.`;
  }
  return minutes % 60 ? `${hours} Std. ${minutes % 60} Min.` : `${hours} Std.`;
}
