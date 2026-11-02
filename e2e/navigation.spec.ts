import { expect, test } from './fixtures';

test.describe('Navigation', () => {
  test('springt aus der Hauptnavigation zu den Bereichen', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
    for (const [label, id] of [['Folgen', 'folgen'], ['Über', 'ueber'], ['Social', 'social'], ['Live', 'live']]) {
      await nav.getByRole('link', { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });

  test('führt über den Banner zum Live-Bereich', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Mehr →/ }).click();
    await expect(page).toHaveURL(/\/#live$/);
    await expect(page.locator('#live')).toBeInViewport();
  });

  test('öffnet Impressum und Datenschutz aus dem Footer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('contentinfo').getByRole('link', { name: 'Impressum' }).click();
    await expect(page).toHaveURL(/\/impressum$/);
    await expect(page).toHaveTitle('Impressum – Schnittstellenpass');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.getByRole('contentinfo').getByRole('link', { name: 'Datenschutz' }).click();
    await expect(page).toHaveURL(/\/datenschutz$/);
    await expect(page).toHaveTitle('Datenschutz – Schnittstellenpass');
  });

  test('leitet alte Unterseiten auf die Startseite um', async ({ page }) => {
    for (const [from, to] of [['/home', /\/$/], ['/episodes', /\/#folgen$/], ['/about', /\/#ueber$/], ['/contact', /\/#social$/]] as const) {
      const response = await page.request.get(from, { maxRedirects: 0 });
      expect(response.status(), from).toBe(301);
      await page.goto(from);
      await expect(page, from).toHaveURL(to);
    }
  });

  test.describe('unbekannte Adressen', () => {
    test.use({ allowErrors: /^404 .*\/gibt-es-nicht$/ });

    test('bekommen eine 404-Seite', async ({ page }) => {
      for (const path of ['/gibt-es-nicht', '/folgen/gibt-es-nicht']) {
        const response = await page.goto(path);
        expect(response?.status(), path).toBe(404);
        await expect(page, path).toHaveTitle(/nicht gefunden/);
      }
    });
  });
});
