/**
 * Writes the latest episodes to public/generated/episodes.json before the build,
 * so prerendering puts them into the HTML of the start page for search engines.
 * In the browser the site loads the live list from the Netlify function anyway.
 *
 * Calls the Netlify function itself (Node runs the .mts file directly), so build
 * and site read Spotify the same way. Without SPOTIFY_CLIENT_ID and
 * SPOTIFY_CLIENT_SECRET (local builds, CI, Netlify variables not scoped to
 * Builds) nothing is written and the page shows its loading state as before.
 * Never fails the build.
 *
 * Each episode gets the slug of its page under /folgen, from the list that
 * scripts/fetch-feed.mjs wrote just before (matched by title), so the start
 * page links to the episode pages. In turn the episode pages get the episode's
 * link on Spotify (open.spotify.com) in place of the Spotify for Creators link
 * from the feed, which is all the feed knows; pages without a match keep it.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Rows of the episode list on the start page (episodeRows in home.component.ts)
const COUNT = 6;

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'public/generated/episodes.json');
const feedFolder = path.join(root, 'public/generated/folgen');
const feedIndex = path.join(feedFolder, 'index.json');
// Most episodes per request (MAX_EPISODE_LIMIT in netlify/functions/spotify.mts)
const PAGE_SIZE = 50;
const SPOTIFY_EPISODE_URL = /^https:\/\/open\.spotify\.com\/episode\/[A-Za-z0-9]+$/;

// Fields the site reads (SpotifyEpisode in src/app/models/spotify.models.ts); the
// rest only makes the HTML larger, as the data is embedded for hydration
const pick = ({ id, name, description, release_date, duration_ms, external_urls, images, audio_preview_url }) =>
  ({ id, name, description, release_date, duration_ms, external_urls, images, audio_preview_url });

// Letters and digits only: Spotify and the feed differ in spaces and punctuation
const normalize = title => title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

/** Slug of the episode page; Spotify titles may still carry the episode code at the end */
async function slugFinder() {
  const pages = JSON.parse(await readFile(feedIndex, 'utf8').catch(() => '[]'))
    .map(page => ({ slug: page.slug, title: normalize(page.title) }))
    .sort((a, b) => b.title.length - a.title.length);
  return name => pages.find(page => normalize(name).startsWith(page.title))?.slug ?? null;
}

/** All episodes of the show, newest first, as Spotify pages them */
async function allEpisodes(spotify) {
  const episodes = [];
  for (let offset = 0; offset < 2000; offset += PAGE_SIZE) {
    const response = await spotify(new Request(`https://build.invalid/?resource=episodes&limit=${PAGE_SIZE}&offset=${offset}`));
    if (!response.ok) {
      throw new Error(`Spotify request failed with status ${response.status}`);
    }
    const { items = [] } = await response.json();
    episodes.push(...items.filter(Boolean));
    if (items.length < PAGE_SIZE) {
      break;
    }
  }
  return episodes;
}

/** Puts each episode's Spotify link into its page and the archive list; returns how many matched */
async function linkPagesToSpotify(episodes, slugOf) {
  const urls = new Map();
  for (const episode of episodes) {
    const slug = slugOf(episode.name);
    const url = episode.external_urls?.spotify;
    if (slug && SPOTIFY_EPISODE_URL.test(url ?? '') && !urls.has(slug)) {
      urls.set(slug, url);
    }
  }
  const list = JSON.parse(await readFile(feedIndex, 'utf8').catch(() => '[]'));
  for (const page of list) {
    const url = urls.get(page.slug);
    if (!url) {
      continue;
    }
    page.listenUrl = url;
    const file = path.join(feedFolder, `${page.slug}.json`);
    const detail = JSON.parse(await readFile(file, 'utf8'));
    await writeFile(file, JSON.stringify({ ...detail, listenUrl: url }));
  }
  if (list.length) {
    await writeFile(feedIndex, JSON.stringify(list));
  }
  return list.filter(page => urls.has(page.slug)).length;
}

async function main() {
  // A list from an earlier build must not outlive a failed fetch
  await rm(target, { force: true });

  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    console.log('Episodes: no Spotify credentials, the start page shows its loading state');
    return;
  }

  const { default: spotify } = await import('../netlify/functions/spotify.mts');
  let items;
  try {
    items = await allEpisodes(spotify);
  } catch (error) {
    console.warn(`Episodes: ${error.message}, the start page shows its loading state`);
    return;
  }

  const slugOf = await slugFinder();
  const episodes = items.slice(0, COUNT).map(item => ({ ...pick(item), slug: slugOf(item.name) }));
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify({ items: episodes }));
  console.log(`Episodes: ${episodes.length} written to public/generated/episodes.json, ${episodes.filter(item => item.slug).length} linked to their page`);

  const linked = await linkPagesToSpotify(items, slugOf);
  console.log(`Episodes: ${linked} episode pages link to Spotify, the others to Spotify for Creators`);
}

main().catch(error => console.warn('Episodes: skipped,', error.message));
