import { expect, test } from './fixtures';

// The CMS loads under its Content Security Policy and accepts its configuration.
// Logging in needs GitHub; the editor itself is covered by cms-editor.spec.ts.
test.describe('CMS', () => {
  test.use({ allowErrors: /ERR_CONNECTION_REFUSED http:\/\/localhost:8081\// });

  test('lädt die Login-Seite mit Logo und GitHub-Login', async ({ page }) => {
    // Decap looks for a local backend (decap-server) on localhost; there is none here
    await page.route('http://localhost:8081/**', route => route.abort('connectionrefused'));
    const response = await page.goto('/admin/');
    expect(response?.headers()['content-security-policy']).toContain("script-src 'self' 'unsafe-eval'");
    await expect(page.getByRole('button', { name: 'Mit GitHub einloggen' })).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('img[src*="logo-black"]')).toBeVisible();
    await expect(page.getByText(/Error loading the CMS configuration|Fehler beim Laden der CMS-Konfiguration/i)).toHaveCount(0);
  });

  test('ist auch ohne Schrägstrich am Ende erreichbar', async ({ page }) => {
    await page.route('http://localhost:8081/**', route => route.abort('connectionrefused'));
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/(#\/)?$/);
    await expect(page.getByRole('button', { name: 'Mit GitHub einloggen' })).toBeVisible({ timeout: 30_000 });
  });
});
