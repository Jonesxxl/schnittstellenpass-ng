import { Episode } from '../models/spotify.models';
import { LINKS } from './links';
import { SITE_URL } from './page-meta';

/** Longest episode description in the structured data; the HTML has the full text */
const DESCRIPTION_LENGTH = 300;

export interface PodcastFacts {
  // Short description of the podcast (hero subtitle from the CMS)
  description: string;
  // Path of the host portrait, relative to the site (from the CMS)
  hostImage: string;
  // Latest episodes shown on the start page
  episodes: Episode[];
}

/**
 * Schema.org data of the start page: the website, the podcast with its host,
 * feed and profiles, and the episodes listed on the page. Lets search engines
 * and AI answers treat website, Spotify, Apple, YouTube and Instagram as one
 * podcast. One @graph, linked by @id.
 */
export function podcastStructuredData({ description, hostImage, episodes }: PodcastFacts): object {
  const podcastId = `${SITE_URL}/#podcast`;
  const hostId = `${SITE_URL}/#host`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'Schnittstellenpass',
        alternateName: 'Schnittstellenpass – Zwischen Profi & Amateur',
        inLanguage: 'de-DE',
        about: { '@id': podcastId }
      },
      {
        '@type': 'PodcastSeries',
        '@id': podcastId,
        name: 'Schnittstellenpass – Zwischen Profi und Amateur',
        url: `${SITE_URL}/`,
        description,
        image: `${SITE_URL}/assets/cover.jpg`,
        inLanguage: 'de-DE',
        genre: ['Fußball', 'Sport'],
        webFeed: LINKS.rssFeed,
        author: { '@id': hostId },
        sameAs: [LINKS.spotify, LINKS.applePodcasts, LINKS.youtube, LINKS.instagram]
      },
      {
        '@type': 'Person',
        '@id': hostId,
        name: 'Marc Agyemang',
        alternateName: 'Agy',
        image: new URL(hostImage, `${SITE_URL}/`).href
      },
      ...episodes.map(episode => ({
        '@type': 'PodcastEpisode',
        '@id': episode.spotifyUrl,
        url: episode.spotifyUrl,
        name: episode.title,
        datePublished: episode.releaseDate,
        description: shorten(episode.description),
        timeRequired: isoDuration(episode.durationMs),
        partOfSeries: { '@id': podcastId }
      }))
    ]
  };
}

/**
 * Puts the data into a <script type="application/ld+json"> in <head>, or
 * removes it for null. Not executed by browsers, so the CSP does not apply.
 * "<" is escaped: CMS or Spotify text must not be able to close the tag.
 */
export function setJsonLd(document: Document, id: string, data: object | null): void {
  let script = document.getElementById(id);
  if (!data) {
    script?.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('id', id);
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Cut by characters, so emoji are not split, and at a word boundary */
function shorten(text: string): string {
  const characters = Array.from(text.replace(/\s+/g, ' ').trim());
  if (characters.length <= DESCRIPTION_LENGTH) {
    return characters.join('');
  }
  const cut = characters.slice(0, DESCRIPTION_LENGTH - 1).join('');
  const space = cut.lastIndexOf(' ');
  return `${(space > 0 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

/** 3 303 000 ms → "PT55M3S" (ISO 8601 duration) */
function isoDuration(ms: number): string {
  const seconds = Math.round(ms / 1000);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s || (!h && !m) ? `${s}S` : ''}`;
}
