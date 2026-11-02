import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

// Automatic accessibility check (axe-core); fails on serious and critical findings
const PAGES = ['/', '/folgen', '/folgen/testgast-eins-ueber-kabine-und-kreisliga', '/impressum', '/datenschutz'];

test.describe('Barrierearmut', () => {
  for (const path of PAGES) {
    test(`${path} hat keine schweren Barrieren`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const serious = violations
        .filter(violation => violation.impact === 'serious' || violation.impact === 'critical')
        .map(violation => `${violation.id}: ${violation.help} (${violation.nodes.map(node => node.target.join(' ')).slice(0, 3).join(', ')})`);
      expect(serious).toEqual([]);
    });
  }
});
