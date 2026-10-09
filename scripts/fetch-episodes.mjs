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
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Rows of the episode list on the start page (episodeRows in home.component.ts)
const COUNT = 6;

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'public/generated/episodes.json');

// Fields the site reads (SpotifyEpisode in src/app/models/spotify.models.ts); the
// rest only makes the HTML larger, as the data is embedded for hydration
const pick = ({ id, name, description, release_date, duration_ms, external_urls, images, audio_preview_url }) =>
  ({ id, name, description, release_date, duration_ms, external_urls, images, audio_preview_url });

async function main() {
  // A list from an earlier build must not outlive a failed fetch
  await rm(target, { force: true });

  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    console.log('Episodes: no Spotify credentials, the start page shows its loading state');
    return;
  }

  const { default: spotify } = await import('../netlify/functions/spotify.mts');
  const response = await spotify(new Request(`https://build.invalid/?resource=episodes&limit=${COUNT}`));
  if (!response.ok) {
    console.warn(`Episodes: Spotify request failed with status ${response.status}, the start page shows its loading state`);
    return;
  }

  const { items = [] } = await response.json();
  const episodes = items.filter(Boolean).map(pick);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify({ items: episodes }));
  console.log(`Episodes: ${episodes.length} written to public/generated/episodes.json`);
}

main().catch(error => console.warn('Episodes: skipped,', error.message));
