/**
 * Reads all episodes from the podcast's RSS feed before the build and writes
 * - public/generated/folgen/index.json: list for the archive (/folgen) and the
 *   prerendered routes (src/app/app.routes.server.ts)
 * - public/generated/folgen/<slug>.json: one file per episode page, so each page
 *   embeds only its own show notes for hydration
 * - public/sitemap.xml: the fixed pages plus one URL per episode
 *
 * The feed is public, no credentials needed. If it cannot be read, a Netlify
 * build fails: the last deploy, with its episode pages, stays online instead of
 * being replaced by one without them. Elsewhere (local, CI) it only warns.
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FEED_URL = 'https://anchor.fm/s/fead9f68/podcast/rss';
const SITE_URL = 'https://schnittstellenpass.de';
// Pages that always exist (src/app/app.routes.ts)
const PAGES = ['/', '/folgen', '/impressum', '/datenschutz'];
// Teaser on the episode page and in its structured data / in the archive list
const SUMMARY_LENGTH = 300;
const TEASER_LENGTH = 160;
// Long enough for title and guest name
const SLUG_LENGTH = 100;

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = path.join(root, 'public/generated/folgen');
const sitemap = path.join(root, 'public/sitemap.xml');

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decode(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, name) => {
    if (name[0] === '#') {
      const code = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : Number(name.slice(1));
      return Number.isFinite(code) ? String.fromCodePoint(code) : entity;
    }
    return ENTITIES[name.toLowerCase()] ?? entity;
  });
}

/** Content of the first <tag> of an item, without CDATA wrapper */
function field(item, tag) {
  const match = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`).exec(item);
  if (!match) {
    return '';
  }
  const value = match[1].trim();
  const cdata = /^<!\[CDATA\[([\s\S]*)\]\]>$/.exec(value);
  return cdata ? cdata[1] : decode(value);
}

function plainText(html) {
  return decode(html.replace(/<(br|\/p|\/li)\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

/** Cut by characters (emoji stay whole) at a word boundary */
function shorten(text, length) {
  const characters = Array.from(text);
  if (characters.length <= length) {
    return text;
  }
  const cut = characters.slice(0, length - 1).join('');
  const space = cut.lastIndexOf(' ');
  return `${(space > 0 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

// "… - Saison 4 Folge #9", "… - Saison #3 Folge #5 -", "… - Folge #6" at the end of a title
const CODE = /\s*[-–—|:]?\s*\(?(?:Saison\s*#?\s*(\d+)[\s,]*)?Folge\s*#?\s*(\d+)\)?\s*[-–—|:]?\s*$/i;

/** Title without the episode code, and the code as shown on the site ("S4 · 9") */
function splitTitle(rawTitle, season, episode) {
  const match = CODE.exec(rawTitle);
  const title = (match ? rawTitle.slice(0, match.index) : rawTitle).replace(/\s+/g, ' ').replace(/\s+([?!.,])/g, '$1').trim() || rawTitle.trim();
  season ||= match?.[1];
  episode ||= match?.[2];
  const code = episode ? (season ? `S${season} · ${episode}` : `Folge ${episode}`) : null;
  return { title, code };
}

function slugify(title) {
  const slug = title.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (slug.length <= SLUG_LENGTH) {
    return slug || 'folge';
  }
  const cut = slug.slice(0, SLUG_LENGTH);
  return cut.slice(0, cut.lastIndexOf('-') > 60 ? cut.lastIndexOf('-') : SLUG_LENGTH);
}

/** "00:55:03", "55:03" or seconds → seconds */
function seconds(duration) {
  return duration.split(':').map(Number).reduce((total, part) => total * 60 + part, 0) || 0;
}

function parseFeed(xml) {
  const slugs = new Set();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const { title, code } = splitTitle(field(item, 'title'), field(item, 'itunes:season'), field(item, 'itunes:episode'));
    let slug = slugify(title);
    for (let n = 2; slugs.has(slug); n++) {
      slug = `${slugify(title)}-${n}`;
    }
    slugs.add(slug);
    const descriptionHtml = field(item, 'description') || field(item, 'itunes:summary');
    return {
      slug,
      title,
      code,
      date: new Date(field(item, 'pubDate')).toISOString().slice(0, 10),
      durationSeconds: seconds(field(item, 'itunes:duration')),
      summary: shorten(plainText(descriptionHtml), SUMMARY_LENGTH),
      listenUrl: field(item, 'link'),
      descriptionHtml
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

function writeSitemap(episodes) {
  const urls = [
    ...PAGES.map(page => `  <url>\n    <loc>${SITE_URL}${page}</loc>\n  </url>`),
    ...episodes.map(episode => `  <url>\n    <loc>${SITE_URL}/folgen/${episode.slug}</loc>\n    <lastmod>${episode.date}</lastmod>\n  </url>`)
  ];
  return writeFile(sitemap, [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- Written by scripts/fetch-feed.mjs; URLs as in the canonical links -->',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    ''
  ].join('\n'));
}

async function main() {
  // Files from an earlier build must not outlive a failed fetch
  await rm(folder, { recursive: true, force: true });

  let episodes = [];
  try {
    const response = await fetch(FEED_URL);
    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }
    episodes = parseFeed(await response.text());
    if (episodes.length === 0) {
      throw new Error('no episodes in the feed');
    }
  } catch (error) {
    if (process.env.NETLIFY === 'true') {
      console.error(`Feed: cannot read ${FEED_URL} (${error.message}); stopping, the last deploy stays online`);
      process.exit(1);
    }
    console.warn(`Feed: cannot read ${FEED_URL} (${error.message}); building without episode pages`);
  }

  if (episodes.length) {
    await mkdir(folder, { recursive: true });
    const summaries = episodes.map(({ descriptionHtml, summary, ...rest }) => ({ ...rest, summary: shorten(summary, TEASER_LENGTH) }));
    await writeFile(path.join(folder, 'index.json'), JSON.stringify(summaries));
    await Promise.all(episodes.map(episode => writeFile(path.join(folder, `${episode.slug}.json`), JSON.stringify(episode))));
  }
  await writeSitemap(episodes);
  console.log(`Feed: ${episodes.length} episode pages, sitemap with ${PAGES.length + episodes.length} URLs`);
}

main();
