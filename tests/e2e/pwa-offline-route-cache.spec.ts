import { expect, test } from '@playwright/test';
import { gotoApp } from './testUtils';

test.skip(process.env.PLAYWRIGHT_PWA !== '1', 'requires production preview with generated service worker');

test('已訪問 vocabulary 後離線回訪可從 PWA 快取 render', async ({ context, page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await gotoApp(page, '/');

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.getByTestId('app-shell')).toBeVisible();
  await expect(page.evaluate(() => Boolean(navigator.serviceWorker.controller))).resolves.toBe(true);

  await page.getByTestId('route-tab-vocabulary').click();
  await expect(page).toHaveURL(/\/vocabulary$/);
  await expect(page.getByTestId('vocabulary-view')).toBeVisible();
  await expect(page.getByTestId('vocabulary-table-region')).toBeVisible();

  await expect(
    page.evaluate(async () => {
      const cacheNames = await caches.keys();
      return cacheNames.length;
    })
  ).resolves.toBeGreaterThan(0);

  await context.setOffline(true);
  await page.goto('/vocabulary');

  await expect(page.getByTestId('app-shell')).toBeVisible();
  await expect(page.getByTestId('vocabulary-view')).toBeVisible();
  await expect(page.getByTestId('vocabulary-table-region')).toBeVisible();
  await expect(page.getByTestId('app-main')).not.toHaveText('');
});
