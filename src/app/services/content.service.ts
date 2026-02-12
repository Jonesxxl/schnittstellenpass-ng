import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface HomeHeroContent {
  titleLines: string[];
  subtitle: string;
}

export interface AboutIntroContent {
  headline: string;
  body: string;
}

export interface WhyCardContent {
  title: string;
  text: string;
}

export interface WhyCardsContent {
  sectionHeadline: string;
  cards: WhyCardContent[];
}

const DEFAULT_HOME_HERO: HomeHeroContent = {
  titleLines: ['SCHNITT', 'STELLEN', 'PASS'],
  subtitle: 'Der Fußball-Podcast zwischen Profi und Amateur. Taktik, Analysen und spannende Gespräche über das schönste Spiel der Welt.'
};

const DEFAULT_ABOUT_INTRO: AboutIntroContent = {
  headline: 'Über Uns',
  body: 'Wir sprechen über Fußball mit Perspektive: ehrlich, analytisch und nah an den Realitäten zwischen Profi- und Amateurbereich.'
};

const DEFAULT_WHY_CARDS: WhyCardsContent = {
  sectionHeadline: 'Warum Schnittstellenpass?',
  cards: [
    {
      title: 'Spannende Einblicke',
      text: 'Spannende Einblicke in die Welt des Fußballs - mit Geschichten direkt aus dem Profi- und Amateurbereich.'
    },
    {
      title: 'Verschiedenste Bereiche',
      text: 'Verschiedenste Bereiche des Fußballs: Training, Taktik, Karrierewege, Führung und Alltag im Team.'
    },
    {
      title: 'Unterschiedlichste Themen',
      text: 'Unterschiedlichste Themengebiete rund um den Fußball - klar, relevant und mit echter fachlicher Tiefe.'
    }
  ]
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
        body: this.asNonEmptyString(payload.body, DEFAULT_ABOUT_INTRO.body)
      })),
      catchError(() => of(DEFAULT_ABOUT_INTRO))
    );
  }

  getWhyCardsContent(): Observable<WhyCardsContent> {
    return this.http.get<Partial<WhyCardsContent>>(`${this.contentBasePath}/warum-cards.json`).pipe(
      map((payload) => ({
        sectionHeadline: this.asNonEmptyString(payload.sectionHeadline, DEFAULT_WHY_CARDS.sectionHeadline),
        cards: this.resolveWhyCards(payload.cards)
      })),
      catchError(() => of(DEFAULT_WHY_CARDS))
    );
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

    if (resolvedLines.length !== 3) {
      return DEFAULT_HOME_HERO.titleLines;
    }

    return resolvedLines;
  }

  private resolveWhyCards(value: unknown): WhyCardContent[] {
    const inputCards = Array.isArray(value) ? value : [];

    return DEFAULT_WHY_CARDS.cards.map((fallbackCard, index) => {
      const inputCard = inputCards[index] as Partial<WhyCardContent> | undefined;
      return {
        title: this.asNonEmptyString(inputCard?.title, fallbackCard.title),
        text: this.asNonEmptyString(inputCard?.text, fallbackCard.text)
      };
    });
  }
}
