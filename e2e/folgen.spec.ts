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
    // Each row also has a play button straight to the episode on Spotify, not covered by the row link
    const play = page.getByRole('link', { name: `Auf Spotify anhören: ${NEWEST.title} (öffnet in neuem Tab)` });
    await expect(play).toHaveAttribute('href', 'https://open.spotify.com/episode/testfolge9');
    await play.click({ trial: true });
  });

  test('öffnet eine Folge mit ihren Shownotes', async ({ page }) => {
    await page.goto('/folgen');
    await page.getByRole('link', { name: NEWEST.title, exact: true }).click();
    await expect(page).toHaveURL(`/folgen/${NEWEST.slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(NEWEST.title);
    await expect(page.getByRole('list', { name: 'Über die Folge' }).getByRole('listitem')).toHaveText(['S4 · 9', '21.09.2026', '55 Min.']);
    const notes = page.getByRole('region', { name: 'Shownotes' });
    await expect(notes.getByRole('listitem')).toHaveCount(2);
    await expect(notes.getByRole('link', { name: 'Mehr zum Gast' })).toHaveAttribute('href', 'https://example.com/mehr');
    await expect(page.getByRole('link', { name: 'Auf Spotify anhören' })).toHaveAttribute('href', 'https://open.spotify.com/episode/testfolge9');

    // A quote of its own is set apart, the empty spacer paragraph is gone
    await expect(notes.locator('blockquote')).toHaveText('„Fehler macht jeder. Wichtig ist, dass man aus Fehlern lernt.“');
    await expect(notes.locator('p:empty, p:has(> br:only-child)')).toHaveCount(0);

    // Neighbouring episodes: the newest has only an older one
    const more = page.getByRole('navigation', { name: 'Weitere Folgen' });
    await expect(more.getByRole('link', { name: /^Neuere Folge/ })).toHaveCount(0);
    await more.getByRole('link', { name: /^Ältere Folge · S4 · 8 Zweiter Testgast/ }).click();
    await expect(page).toHaveURL('/folgen/zweiter-testgast-vom-bolzplatz-in-die-bundesliga');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Zweiter Testgast: Vom Bolzplatz in die Bundesliga');
    await expect(more.getByRole('link', { name: /^Neuere Folge · S4 · 9 Testgast Eins/ })).toHaveAttribute('href', `/folgen/${NEWEST.slug}`);

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

  // The show notes editor writes items after the list's end and items that wrap a list
  // or the rest of the text (e2e/fixtures/feed.xml, as in the VAR episode)
  test('zeigt kaputte Listen aus dem Feed als eine Liste mit einem Punkt pro Eintrag', async ({ page }) => {
    await page.goto('/folgen/zweiter-testgast-vom-bolzplatz-in-die-bundesliga');
    const notes = page.getByRole('region', { name: 'Shownotes' });
    const items = notes.locator(':scope > ul > li');
    await expect(items).toHaveText(['Erstes Thema', 'Verschachtelt eins', 'Verschachtelt zwei', /^Thema mit Unterpunkt/, 'Außerhalb der Liste', 'Letzter Punkt']);
    await expect(notes.locator(':scope > li, li > p')).toHaveCount(0);
    // A real sub-list under an item with text stays
    await expect(items.filter({ hasText: /^Thema mit Unterpunkt/ }).getByRole('listitem')).toHaveText('Echter Unterpunkt');
    // The text the last item wrapped follows the list
    await expect(notes.locator(':scope > ul + p')).toHaveText('Begriffe aus der Folge');
  });

  test('zeigt eine Folge ohne Beschreibung mit ihrer Zusammenfassung', async ({ page }) => {
    await page.goto('/folgen/aeltere-folge-mit-uemlaeuten-sonderzeichen');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ältere Folge mit Ümläuten & Sonderzeichen');
    await expect(page.getByRole('region', { name: 'Shownotes' })).toContainText('Nur eine Zusammenfassung');
  });
});
