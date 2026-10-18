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
