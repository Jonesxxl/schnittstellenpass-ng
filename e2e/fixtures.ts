import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test as base, expect, type Page } from '@playwright/test';

/**
 * Shared setup of every test:
 * - requests to other hosts are blocked and recorded: the site must not load
 *   anything from third parties (privacy policy), so any such request fails the test
 * - console errors, uncaught exceptions and CSP violations fail the test,
 *   unless the test expects them (allowErrors)
 * - the Netlify functions answer with the test data below (mockFunctions); a
 *   test can register its own route afterwards, which takes precedence
 */

const root = path.join(__dirname, '..');
const image = (file: string) => readFileSync(path.join(root, 'src/assets', file));

/** Six episodes as the Spotify function returns them, newest first */
export const SPOTIFY_EPISODES = Array.from({ length: 6 }, (_, i) => ({
  id: `testepisode${i}`,
  name: `Testgast ${i + 1} im Gespräch - Saison 4 Folge #${9 - i}`,
  description: `Beschreibung der Testfolge ${i + 1}.`,
  release_date: `2026-09-${String(28 - i * 3).padStart(2, '0')}`,
  duration_ms: 3_300_000 - i * 60_000,
  external_urls: { spotify: `https://open.spotify.com/episode/testepisode${i}` },
  // A cover URL in Spotify's format; the site loads it through the function
  images: [{ url: `https://i.scdn.co/image/${'ab67656300005f1f'}${String(i).padStart(24, '0')}`, width: 640, height: 640 }],
  audio_preview_url: null
}));

/** Four Instagram posts as the Instagram function returns them */
export const INSTAGRAM_POSTS = [
  { id: 'post1', caption: 'Live in Stuttgart: Danke an alle! #live', mediaType: 'IMAGE' },
  { id: 'post2', caption: 'Neue Folge mit Testgast 1 ist online', mediaType: 'VIDEO' },
  { id: 'post3', caption: 'Blick in die Kabine', mediaType: 'CAROUSEL_ALBUM' },
  { id: 'post4', caption: 'Bis zur nächsten Folge!', mediaType: 'IMAGE' }
].map((post, i) => ({
  ...post,
  permalink: `https://www.instagram.com/p/${post.id}/`,
  timestamp: `2026-09-${20 - i}T18:00:00+0000`,
  image: `/.netlify/functions/instagram?image=${i}`
}));

export async function mockFunctions(page: Page): Promise<void> {
  await page.route('**/.netlify/functions/spotify**', route => {
    const url = new URL(route.request().url());
    if (url.searchParams.has('image')) {
      return route.fulfill({ contentType: 'image/jpeg', body: image('cover.jpg') });
    }
    const limit = Number(url.searchParams.get('limit') ?? 10);
    return route.fulfill({ json: { items: SPOTIFY_EPISODES.slice(0, limit), total: SPOTIFY_EPISODES.length, limit, offset: 0, next: null, previous: null } });
  });
  await page.route('**/.netlify/functions/instagram**', route => {
    const url = new URL(route.request().url());
    if (url.searchParams.has('image')) {
      return route.fulfill({ contentType: 'image/webp', body: image('live-event.webp') });
    }
    return route.fulfill({ json: { posts: INSTAGRAM_POSTS } });
  });
}

/** Answers a function with an error, as when Spotify or Instagram cannot be reached */
export async function failFunction(page: Page, name: 'spotify' | 'instagram'): Promise<void> {
  await page.route(`**/.netlify/functions/${name}**`, route => route.fulfill({ status: 502, json: { error: 'Upstream error' } }));
}

/**
 * The latest episodes for the prerendered start page are only written when the
 * build can reach Spotify (scripts/fetch-episodes.mjs); the test build cannot
 */
const EXPECTED_ERRORS = /^404 .*\/generated\/episodes\.json$/;

type Fixtures = {
  /** Errors a test expects, e.g. the error logged when a function fails */
  allowErrors: RegExp | null;
  /** Requests to other hosts a test expects, e.g. to the local CMS backend */
  allowRequests: RegExp | null;
};

export const test = base.extend<Fixtures>({
  allowErrors: [null, { option: true }],
  allowRequests: [null, { option: true }],

  page: async ({ page, baseURL, allowErrors, allowRequests }, use) => {
    const externalRequests: string[] = [];
    const origin = new URL(baseURL!).origin;
    const external = (url: URL) => url.origin !== origin && url.protocol !== 'data:' && url.protocol !== 'blob:' && !allowRequests?.test(url.href);
    await page.context().route(external, route => {
      externalRequests.push(route.request().url());
      return route.abort('blockedbyclient');
    });

    const errors: string[] = [];
    await page.addInitScript(() => {
      document.addEventListener('securitypolicyviolation', event => {
        console.error(`CSP violation: ${event.violatedDirective} ${event.blockedURI}`);
      });
    });
    page.on('console', message => {
      // Failed requests are recorded with their URL below
      if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
        errors.push(message.text());
      }
    });
    page.on('pageerror', error => errors.push(`Uncaught: ${error.message}`));
    page.on('response', response => {
      if (response.status() >= 400) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });
    page.on('requestfailed', request => {
      // Requests to other hosts are blocked on purpose and reported below
      if (request.failure()?.errorText !== 'net::ERR_BLOCKED_BY_CLIENT') {
        errors.push(`${request.failure()?.errorText} ${request.url()}`);
      }
    });

    await mockFunctions(page);
    await use(page);

    const unexpected = errors.filter(error => !EXPECTED_ERRORS.test(error) && !allowErrors?.test(error));
    expect(unexpected, 'console errors, exceptions or CSP violations').toEqual([]);
    expect(externalRequests, 'requests to other hosts').toEqual([]);
  }
});

export { expect };
