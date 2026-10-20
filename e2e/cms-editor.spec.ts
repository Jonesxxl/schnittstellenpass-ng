import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from './fixtures';

/**
 * The CMS editor with its live preview, logged in through a local Decap backend
 * on a throwaway copy of the repository (e2e/cms-backend.mjs). Runs on request
 * only: npm run e2e:cms. Reads the committed content, so commit changes first.
 */
const live = JSON.parse(readFileSync(path.join(__dirname, '../public/content/live.json'), 'utf8'));

test.use({
  // The local Decap backend
  allowRequests: /^http:\/\/localhost:8081\//,
  // decap-server answers a draft that does not exist with 404 and a picture outside the
  // upload folder with 500; Decap itself rejects a promise when an invalid entry is saved
  allowErrors: /^(404|500) http:\/\/localhost:8081\/api\/v1$|^Uncaught: undefined$/
});

test.beforeEach(async ({ page }) => {
  // Leaving the editor with unsaved changes asks for confirmation
  page.on('dialog', dialog => dialog.accept());
  await page.goto('/admin/');
  await page.getByRole('button', { name: 'Login' }).click({ timeout: 30_000 });
  await expect(page.getByText('1 · Begrüßung (ganz oben)')).toBeVisible({ timeout: 30_000 });
});

test('zeigt die Bereiche der Startseite in ihrer Reihenfolge, mit Erklärung', async ({ page }) => {
  const labels = ['1 · Begrüßung (ganz oben)', '2 · Live-Bereich & Banner', '3 · Neueste Folgen', '4 · Gastgeber', '5 · Instagram'];
  const text = await page.locator('body').innerText();
  const positions = labels.map(label => text.indexOf(label));
  expect(positions.every(position => position >= 0)).toBe(true);
  expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  await expect(page.getByText(/Texte und Fotos der Startseite/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Arbeitsablauf/ })).toBeVisible();
});

test('bearbeitet den Live-Bereich mit Vorschau und Prüfung der Länge', async ({ page }) => {
  await page.getByText('2 · Live-Bereich & Banner').click();
  const banner = page.getByLabel('Banner ganz oben');
  await expect(banner).toHaveValue(live.bannerText, { timeout: 30_000 });
  await expect(page.getByText(/Dunkle Leiste über der ganzen Seite/)).toBeVisible();

  // Headline lines are plain strings in the form, not "[object Object]"
  const values = await page.locator('input[type="text"]').evaluateAll(inputs => inputs.map(input => (input as HTMLInputElement).value));
  expect(values).toEqual(expect.arrayContaining(live.headlineLines));

  const preview = page.frameLocator('iframe').first();
  await expect(preview.locator('.sp-banner-text')).toHaveText(live.bannerText);
  await expect(preview.locator('.sp-photo img')).toHaveJSProperty('complete', true);
  expect(await preview.locator('.sp-big-title').evaluate(() => document.fonts.check('900 40px "Big Shoulders Display"'))).toBe(true);

  await banner.fill('Neue Termine für die Live-Folgen');
  await expect(preview.locator('.sp-banner-text')).toHaveText('Neue Termine für die Live-Folgen');

  await banner.fill('x'.repeat(80));
  await page.getByRole('button', { name: 'Speichern' }).first().click();
  await expect(page.getByText(/höchstens 70 Zeichen/i)).toBeVisible();
});

for (const [label, selector] of [
  ['1 · Begrüßung (ganz oben)', '.sp-hero-title'],
  ['3 · Neueste Folgen', '.sp-rows'],
  ['4 · Gastgeber', '.sp-facts'],
  ['5 · Instagram', '.sp-tiles']
]) {
  test(`zeigt die Vorschau für „${label}“`, async ({ page }) => {
    await page.getByText(label).click();
    await expect(page.frameLocator('iframe').first().locator(selector)).toBeVisible({ timeout: 30_000 });
  });
}
