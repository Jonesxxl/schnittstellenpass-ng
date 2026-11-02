import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from './fixtures';

/**
 * What search engines and link previews see: the prerendered HTML, read with
 * JavaScript switched off
 */
test.use({
  javaScriptEnabled: false,
  // Chromium refuses the preloaded script chunks when scripts are off
  allowErrors: /^csp http:\/\/localhost:\d+\/chunk-[\w-]+\.js$/
});

const PAGES = [
  { path: '/', title: /Der Fußball-Podcast/, heading: /Schnittstellenpass/ },
  { path: '/folgen', title: 'Alle Folgen – Schnittstellenpass', heading: 'Alle Folgen' },
  { path: '/folgen/testgast-eins-ueber-kabine-und-kreisliga', title: /Testgast Eins über Kabine und Kreisliga/, heading: 'Testgast Eins über Kabine und Kreisliga' },
  { path: '/impressum', title: 'Impressum – Schnittstellenpass', heading: /Impressum/ },
  { path: '/datenschutz', title: 'Datenschutz – Schnittstellenpass', heading: /Datenschutz/ }
];

test.describe('Vorgerenderte Seiten', () => {
  for (const { path: url, title, heading } of PAGES) {
    test(`${url} hat Inhalt, Titel, Beschreibung und strukturierte Daten ohne JavaScript`, async ({ page }) => {
      const response = await page.goto(url);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(title);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);

      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description?.length, 'meta description').toBeGreaterThan(50);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://schnittstellenpass.de${url === '/' ? '/' : url}`);
      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);

      for (const script of await page.locator('script[type="application/ld+json"]').allTextContents()) {
        expect(() => JSON.parse(script), 'JSON-LD').not.toThrow();
      }
    });
  }

  test('die Folgen-Seite beschreibt die Folge als PodcastEpisode', async ({ page }) => {
    await page.goto('/folgen/testgast-eins-ueber-kabine-und-kreisliga');
    const data = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(text => JSON.parse(text));
    expect(JSON.stringify(data)).toContain('"PodcastEpisode"');
    await expect(page.getByRole('region', { name: 'Shownotes' })).toContainText('Shownotes der Testfolge');
  });

  test('die Sitemap enthält alle Seiten und Folgen', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
    expect(urls).toEqual(expect.arrayContaining(PAGES.map(page => `https://schnittstellenpass.de${page.path}`)));
    expect(urls).toHaveLength(8);
    const robots = readFileSync(path.join(__dirname, '../dist/schnittstellenpass/browser/robots.txt'), 'utf8');
    expect(robots).toContain('Sitemap: https://schnittstellenpass.de/sitemap.xml');
  });
});
