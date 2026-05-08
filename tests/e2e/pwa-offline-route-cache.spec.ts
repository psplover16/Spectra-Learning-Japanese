import { expect, test, type Page } from '@playwright/test';
import { gotoApp } from './testUtils';

test.skip(process.env.PLAYWRIGHT_PWA !== '1', 'requires production preview with generated service worker');

async function expectN5GrammarDataVisible(page: Page) {
  await expect(page.getByTestId('n5-grammar-view')).toBeVisible();
  await expect(page.getByTestId('n5-grammar-load-error')).toHaveCount(0);
  const grammarSections = page.locator('[data-testid^="n5-grammar-section-"]');
  await expect.poll(async () => grammarSections.count()).toBeGreaterThan(0);
  await expect(grammarSections.first()).toBeVisible();
}

async function expectVocabularyDataVisible(page: Page) {
  await expect(page.getByTestId('vocabulary-view')).toBeVisible();
  await expect(page.getByTestId('vocabulary-table-region')).toBeVisible();
  await expect(page.getByText(/單字資料載入失敗/)).toHaveCount(0);
  const vocabularyRows = page.locator('[data-testid^="vocabulary-row-"]');
  await expect.poll(async () => vocabularyRows.count()).toBeGreaterThan(0);
  await expect(vocabularyRows.first()).toBeVisible();
}

test('更新 reload 後離線回訪可從 PWA 快取 render lazy 學習資料', async ({ context, page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await gotoApp(page, '/');

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.getByTestId('app-shell')).toBeVisible();
  await expect(page.evaluate(() => Boolean(navigator.serviceWorker.controller))).resolves.toBe(true);

  await page.goto('/n5-grammar');
  await expect(page).toHaveURL(/\/n5-grammar$/);
  await expectN5GrammarDataVisible(page);

  await page.goto('/vocabulary');
  await expect(page).toHaveURL(/\/vocabulary$/);
  await expectVocabularyDataVisible(page);

  await expect(
    page.evaluate(async () => {
      const cacheNames = await caches.keys();
      return cacheNames.length;
    })
  ).resolves.toBeGreaterThan(0);

  await context.setOffline(true);

  await page.goto('/n5-grammar');
  await expect(page.getByTestId('app-shell')).toBeVisible();
  await expectN5GrammarDataVisible(page);

  await page.goto('/vocabulary');
  await expect(page.getByTestId('app-shell')).toBeVisible();
  await expectVocabularyDataVisible(page);
  await expect(page.getByTestId('app-main')).not.toHaveText('');
});
