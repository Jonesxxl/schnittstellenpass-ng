import { expect, test } from './fixtures';

// Episode pages built from the test feed (e2e/fixtures/feed.xml)
const NEWEST = { slug: 'testgast-eins-ueber-kabine-und-kreisliga', title: 'Testgast Eins über Kabine und Kreisliga' };

test.describe('Folgen-Archiv und Folgen-Seiten', () => {
  test('listet alle Folgen des Feeds, neueste zuerst', async ({ page }) => {
    await page.goto('/folgen');
    await expect(page).toHaveTitle('Alle Folgen – Schnittstellenpass');
    const links = page.locator('main a[href^="/folgen/"]');
    await expect(links).toHaveCount(4);
    await expect(links.first()).toContainText(NEWEST.title);
    await expect(links.nth(2)).toContainText('Ältere Folge mit Ümläuten & Sonderzeichen');
  });

  test('öffnet eine Folge mit ihren Shownotes', async ({ page }) => {
    await page.goto('/folgen');
    await page.getByRole('link', { name: new RegExp(NEWEST.title) }).click();
    await expect(page).toHaveURL(`/folgen/${NEWEST.slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(NEWEST.title);
    await expect(page.getByText('S4 · 9')).toBeVisible();
    const notes = page.getByRole('region', { name: 'Shownotes' });
    await expect(notes.getByRole('listitem')).toHaveCount(2);
    await expect(notes.getByRole('link', { name: 'Mehr zum Gast' })).toHaveAttribute('href', 'https://example.com/mehr');
    await expect(page.getByRole('link', { name: 'Auf Spotify anhören' })).toHaveAttribute('href', 'https://open.spotify.com/episode/testfolge9');

    await page.getByRole('link', { name: '← Alle Folgen' }).click();
    await expect(page).toHaveURL('/folgen');
  });

  test.describe('Shownotes mit Code', () => {
    // Newer Chromium reports the click handler to the CSP while Angular strips it: a second safeguard
    test.use({ allowErrors: /^CSP violation: script-src-attr inline$|^Executing inline event handler violates .*'script-src 'self''/ });

    test('führen den Code nicht aus', async ({ page }) => {
      await page.goto('/folgen/folge-mit-skript-in-den-shownotes');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Folge mit Skript in den Shownotes');
      await page.getByText('Absatz mit Klick-Handler').click();
      const flags = await page.evaluate(() => {
        const w = window as unknown as Record<string, unknown>;
        return [w['__shownotesScript'], w['__shownotesClick'], w['__shownotesLink']];
      });
      expect(flags).toEqual([undefined, undefined, undefined]);
      const notes = page.getByRole('region', { name: 'Shownotes' });
      await expect(notes.locator('script, [onclick]')).toHaveCount(0);
      // Angular neutralises the script link
      await expect(notes.getByRole('link', { name: 'Link mit Skript' })).toHaveAttribute('href', /^unsafe:javascript:/);
    });
  });

  test('zeigt eine Folge ohne Beschreibung mit ihrer Zusammenfassung', async ({ page }) => {
    await page.goto('/folgen/aeltere-folge-mit-uemlaeuten-sonderzeichen');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ältere Folge mit Ümläuten & Sonderzeichen');
    await expect(page.getByRole('region', { name: 'Shownotes' })).toContainText('Nur eine Zusammenfassung');
  });
});
