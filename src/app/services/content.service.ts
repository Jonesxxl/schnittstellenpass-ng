import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface HomeHeroContent {
  titleLines: string[];
  subtitle: string;
}

export interface AboutFact {
  value: string;
  label: string;
}

export interface AboutIntroContent {
  headline: string;
  body: string;
  portrait: string;
  facts: AboutFact[];
}

export interface LiveContent {
  bannerText: string;
  eyebrow: string;
  headlineLines: string[];
  text: string;
  jubileeLabel: string;
  jubileeText: string;
  photo: string;
}

// Texts of the episode section; the episodes themselves come from Spotify
export interface EpisodesContent {
  eyebrow: string;
  headline: string;
  intro: string;
}

export interface SocialContent {
  eyebrow: string;
  headline: string;
}

// Pictures can only come from the CMS upload folder or the bundled assets
const IMAGE_PATH = /^(\/uploads\/|assets\/)[A-Za-z0-9_\-./ ]+$/;

// Used until the CMS content has loaded and if it cannot be loaded
export const DEFAULT_HOME_HERO: HomeHeroContent = {
  titleLines: ['Zwischen Profi', '& Amateur'],
  subtitle: 'Gespräche mit Menschen aus Bundesliga, Kreisliga und allem dazwischen. Ehrlich, persönlich und mit Geschichten, die sonst in der Kabine bleiben.'
};

export const DEFAULT_ABOUT_INTRO: AboutIntroContent = {
  headline: 'Marc „Agy“ Agyemang',
  body: 'Agy kennt beide Seiten: Nachwuchs beim VfB Stuttgart, später Amateurfußball. Genau an dieser Schnittstelle setzt der Podcast an. Was verbindet die Bundesliga mit dem Sportplatz um die Ecke, und was trennt sie?',
  portrait: 'assets/host-portrait.webp',
  facts: [
    { value: '45 min', label: 'pro Folge' },
    { value: '14-tägig', label: 'neue Folgen' },
    { value: 'Live', label: 'seit 09/2026' }
  ]
};

export const DEFAULT_LIVE: LiveContent = {
  bannerText: '5 Jahre Schnittstellenpass — erstes Live-Event',
  eyebrow: 'Neu · seit 22.09.2026',
  headlineLines: ['Jetzt', 'auch live.'],
  text: 'Schnittstellenpass verlässt das Studio: Gäste auf der Bühne, Publikum im Raum, Fragen direkt aus der Kurve. Termine und Tickets kündigen wir auf Instagram an.',
  jubileeLabel: '5 Jahre Schnittstellenpass',
  jubileeText: 'Zum 5-jährigen Jubiläum ist unser erstes Live-Event an den Start gegangen – und war ein voller Erfolg. Danke an alle, die dabei waren!',
  photo: 'assets/live-event.webp'
};

export const DEFAULT_EPISODES: EpisodesContent = {
  eyebrow: 'Spielplan',
  headline: 'Neueste Folgen',
  intro: 'Jede Folge dauert eine Halbzeit: 45 Minuten, kein Nachspielzeit-Gelaber.'
};

export const DEFAULT_SOCIAL: SocialContent = {
  eyebrow: 'Instagram',
  headline: 'Aus der Kabine'
};

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly contentBasePath = '/content';

  getHomeHeroContent(): Observable<HomeHeroContent> {
    return this.http.get<Partial<HomeHeroContent>>(`${this.contentBasePath}/home-hero.json`).pipe(
      map((payload) => ({
        titleLines: this.resolveTitleLines(payload.titleLines),
        subtitle: this.asNonEmptyString(payload.subtitle, DEFAULT_HOME_HERO.subtitle)
      })),
      catchError(() => of(DEFAULT_HOME_HERO))
    );
  }

  getAboutIntroContent(): Observable<AboutIntroContent> {
    return this.http.get<Partial<AboutIntroContent>>(`${this.contentBasePath}/ueber-uns.json`).pipe(
      map((payload) => ({
        headline: this.asNonEmptyString(payload.headline, DEFAULT_ABOUT_INTRO.headline),
        body: this.asNonEmptyString(payload.body, DEFAULT_ABOUT_INTRO.body),
        portrait: this.asImagePath(payload.portrait, DEFAULT_ABOUT_INTRO.portrait),
        facts: this.asList(payload.facts, DEFAULT_ABOUT_INTRO.facts, 3, (entry) => ({
          value: this.asNonEmptyString(entry['value'], ''),
          label: this.asNonEmptyString(entry['label'], '')
        }), (fact) => fact.value.length > 0)
      })),
      catchError(() => of(DEFAULT_ABOUT_INTRO))
    );
  }

  getLiveContent(): Observable<LiveContent> {
    return this.http.get<Record<string, unknown>>(`${this.contentBasePath}/live.json`).pipe(
      map((payload) => ({
        bannerText: this.asNonEmptyString(payload['bannerText'], DEFAULT_LIVE.bannerText),
        eyebrow: this.asNonEmptyString(payload['eyebrow'], DEFAULT_LIVE.eyebrow),
        headlineLines: this.asList(payload['headlineLines'], DEFAULT_LIVE.headlineLines, 3, (entry) => this.asNonEmptyString(entry['line'], ''), (line) => line.length > 0, true),
        text: this.asNonEmptyString(payload['text'], DEFAULT_LIVE.text),
        jubileeLabel: this.asNonEmptyString(payload['jubileeLabel'], DEFAULT_LIVE.jubileeLabel),
        jubileeText: this.asNonEmptyString(payload['jubileeText'], DEFAULT_LIVE.jubileeText),
        photo: this.asImagePath(payload['photo'], DEFAULT_LIVE.photo)
      })),
      catchError(() => of(DEFAULT_LIVE))
    );
  }

  getEpisodesContent(): Observable<EpisodesContent> {
    return this.http.get<Record<string, unknown>>(`${this.contentBasePath}/folgen.json`).pipe(
      map((payload) => ({
        eyebrow: this.asNonEmptyString(payload['eyebrow'], DEFAULT_EPISODES.eyebrow),
        headline: this.asNonEmptyString(payload['headline'], DEFAULT_EPISODES.headline),
        intro: this.asNonEmptyString(payload['intro'], DEFAULT_EPISODES.intro)
      })),
      catchError(() => of(DEFAULT_EPISODES))
    );
  }

  getSocialContent(): Observable<SocialContent> {
    return this.http.get<Record<string, unknown>>(`${this.contentBasePath}/social.json`).pipe(
      map((payload) => ({
        eyebrow: this.asNonEmptyString(payload['eyebrow'], DEFAULT_SOCIAL.eyebrow),
        headline: this.asNonEmptyString(payload['headline'], DEFAULT_SOCIAL.headline)
      })),
      catchError(() => of(DEFAULT_SOCIAL))
    );
  }

  /**
   * Only the CMS upload folder and the bundled assets are accepted as picture
   * source, so a manipulated content file cannot load pictures from elsewhere
   */
  private asImagePath(value: unknown, fallback: string): string {
    const path = this.asNonEmptyString(value, '');
    return IMAGE_PATH.test(path) && !path.includes('..') ? path : fallback;
  }

  /**
   * Entries of a list from the CMS: objects only, empty ones dropped, capped
   * in length; the fallback is used if nothing usable remains. With
   * `plainStrings` the entries may be plain strings as well.
   */
  private asList<T>(
    value: unknown,
    fallback: T[],
    max: number,
    read: (entry: Record<string, unknown>) => T,
    keep: (item: T) => boolean,
    plainStrings = false
  ): T[] {
    if (!Array.isArray(value)) {
      return fallback;
    }

    const items = value
      .map((entry) => {
        if (plainStrings && typeof entry === 'string') {
          return read({ line: entry });
        }
        return entry && typeof entry === 'object' ? read(entry as Record<string, unknown>) : null;
      })
      .filter((item): item is T => item !== null && keep(item))
      .slice(0, max);

    return items.length > 0 ? items : fallback;
  }

  private asNonEmptyString(value: unknown, fallback: string): string {
    if (typeof value !== 'string') {
      return fallback;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }

  private resolveTitleLines(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return DEFAULT_HOME_HERO.titleLines;
    }

    const resolvedLines = value
      .map((entry) => {
        if (typeof entry === 'string') {
          return entry;
        }

        if (entry && typeof entry === 'object' && 'line' in entry && typeof entry.line === 'string') {
          return entry.line;
        }

        return '';
      })
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 3);

    if (resolvedLines.length === 0) {
      return DEFAULT_HOME_HERO.titleLines;
    }

    return resolvedLines;
  }

}
