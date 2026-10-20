import { SPOTIFY_EPISODES, INSTAGRAM_POSTS, expect, failFunction, test } from './fixtures';

// Start page with the Spotify and Instagram functions answered by the test data
test.describe('Startseite', () => {
  test('zeigt alle Bereiche in der richtigen Reihenfolge', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Schnittstellenpass/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Schnittstellenpass');
    const ids = await page.locator('main > section[id]').evaluateAll(sections => sections.map(section => section.id));
    expect(ids).toEqual(['top', 'live', 'folgen', 'ueber', 'social']);
  });

  test('zeigt die neuesten Folgen von Spotify', async ({ page }) => {
    await page.goto('/');
    const list = page.locator('#folgen');
    for (const [i, episode] of SPOTIFY_EPISODES.entries()) {
      const row = list.getByRole('link', { name: new RegExp(`Testgast ${i + 1} im Gespräch`) });
      await expect(row).toHaveAttribute('href', episode.external_urls.spotify);
    }
    // The card at the top shows the newest episode
    await expect(page.locator('#top').getByText('Testgast 1 im Gespräch')).toBeVisible();
    await expect(list.getByRole('link', { name: 'Alle Folgen im Archiv' })).toHaveAttribute('href', '/folgen');
  });

  test('verlinkt Folgen mit eigener Seite dorthin und der Play-Knopf direkt zu Spotify', async ({ page }) => {
    // The build attaches the page to an episode in its snapshot (scripts/fetch-episodes.mjs)
    const slug = 'testgast-eins-ueber-kabine-und-kreisliga';
    await page.route('**/generated/episodes.json', route => route.fulfill({ json: { items: [{ ...SPOTIFY_EPISODES[0], slug }] } }));
    await page.goto('/');
    const list = page.locator('#folgen');
    const title = list.getByRole('link', { name: 'Testgast 1 im Gespräch', exact: true });
    await expect(title).toHaveAttribute('href', `/folgen/${slug}`);
    const play = list.getByRole('link', { name: 'Auf Spotify anhören: Testgast 1 im Gespräch (öffnet in neuem Tab)' });
    await expect(play).toHaveAttribute('href', SPOTIFY_EPISODES[0].external_urls.spotify);
    await expect(play).toHaveAttribute('target', '_blank');
    // The play button is not covered by the row link
    await play.click({ trial: true });

    // The rest of the row opens the episode page: the title link covers it, so click where the text is
    const text = await list.getByText('Beschreibung der Testfolge 1.').boundingBox();
    await page.mouse.click(text!.x + 10, text!.y + text!.height / 2);
    await expect(page).toHaveURL(`/folgen/${slug}`);
  });

  test.describe('wenn Spotify nicht erreichbar ist', () => {
    test.use({ allowErrors: /^502 .*functions\/spotify|Failed to fetch episodes/ });

    test('verweist auf Spotify statt auf einzelne Folgen', async ({ page }) => {
      await failFunction(page, 'spotify');
      await page.goto('/');
      await expect(page.locator('#folgen').getByText('Alle Folgen auf Spotify')).toBeVisible();
      await expect(page.locator('#top').getByText('Alle Folgen auf Spotify')).toBeVisible();
    });
  });

  test('zeigt die neuesten Instagram-Beiträge', async ({ page }) => {
    await page.goto('/');
    const posts = page.getByRole('group', { name: 'Neueste Instagram-Beiträge' }).getByRole('button');
    await expect(posts).toHaveCount(INSTAGRAM_POSTS.length);
    await expect(page.locator('#kabine-stage')).toHaveAttribute('href', INSTAGRAM_POSTS[0].permalink);

    await posts.nth(2).click();
    await expect(posts.nth(2)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#kabine-stage')).toHaveAttribute('href', INSTAGRAM_POSTS[2].permalink);
  });

  test.describe('wenn Instagram nicht erreichbar ist', () => {
    test.use({ allowErrors: /^502 .*functions\/instagram|Failed to fetch Instagram posts/ });

    test('verweist direkt auf Instagram', async ({ page }) => {
      await failFunction(page, 'instagram');
      await page.goto('/');
      await expect(page.locator('#social').getByRole('link', { name: 'Direkt auf Instagram →' })).toBeVisible();
    });
  });

  test('passt ohne seitliches Scrollen in den Bildschirm', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    for (const path of ['/', '/folgen', '/impressum', '/datenschutz']) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(0);
    }
  });

  test.describe('mit reduzierter Bewegung', () => {
    test.use({ reducedMotion: 'reduce' });

    test('laufen keine Animationen', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const animated = await page.evaluate(() => [...document.querySelectorAll('*')]
        .filter(element => getComputedStyle(element).animationName !== 'none' && getComputedStyle(element).animationIterationCount === 'infinite')
        .map(element => element.className.toString().slice(0, 80)));
      expect(animated).toEqual([]);
    });
  });
});
