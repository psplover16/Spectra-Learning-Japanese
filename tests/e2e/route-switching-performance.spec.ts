import { expect, test, type Page } from '@playwright/test';
import { expectPrimaryTabs, gotoApp } from './testUtils';

async function expectStableRoute(page: Page, routeTestId: string): Promise<void> {
  await expect(page.getByTestId('app-shell')).toBeVisible();
  await expect(page.getByTestId('route-tabs')).toBeVisible();
  await expect(page.getByTestId('app-main')).toBeVisible();
  await expect(page.getByTestId(routeTestId)).toBeVisible();

  const mainTextLength = await page.getByTestId('app-main').evaluate((element) => element.textContent?.trim().length ?? 0);
  expect(mainTextLength).toBeGreaterThan(0);
}

test('主要路由切換保持 shell 可見，且已訪問路由狀態會保留', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    consoleErrors.push(error.message);
  });

  await page.setViewportSize({ width: 375, height: 900 });
  await gotoApp(page, '/');
  await expect(page).toHaveURL(/\/practice$/);
  await expectPrimaryTabs(page);
  await expectStableRoute(page, 'practice-seion-table');

  await page.getByTestId('route-tab-grammar').click();
  await expect(page).toHaveURL(/\/grammar$/);
  await expectStableRoute(page, 'grammar-sections');

  await page.getByTestId('route-tab-grammar-level').click();
  await expect(page).toHaveURL(/\/n5-grammar$/);
  await expectStableRoute(page, 'n5-grammar-view');

  const n5Toggle = page.getByTestId('n5-grammar-toggle-core-term-usage-overview');
  const n5Body = page.getByTestId('n5-grammar-body-core-term-usage-overview');
  await n5Toggle.click();
  await expect(n5Body).toBeVisible();

  for (const [routeName, routePattern, testId] of [
    ['n1-grammar', /\/n1-grammar$/, 'n1-grammar-placeholder-view'],
    ['n2-grammar', /\/n2-grammar$/, 'n2-grammar-placeholder-view'],
    ['n3-grammar', /\/n3-grammar$/, 'n3-grammar-placeholder-view'],
    ['n4-grammar', /\/n4-grammar$/, 'n4-grammar-placeholder-view']
  ] as const) {
    await page.getByTestId('route-tab-grammar-level').click();
    await page.getByTestId(`route-sub-menu-option-${routeName}`).click();
    await expect(page).toHaveURL(routePattern);
    await expectStableRoute(page, testId);
  }

  await page.getByTestId('route-tab-vocabulary').click();
  await expect(page).toHaveURL(/\/vocabulary$/);
  await expectStableRoute(page, 'vocabulary-view');
  await expect(page.evaluate(() => document.body.style.overflow)).resolves.toBe('hidden');

  await page.getByTestId('route-tab-grammar-level').click();
  await expect(page).toHaveURL(/\/n4-grammar$/);
  await expectStableRoute(page, 'n4-grammar-placeholder-view');
  await expect(page.evaluate(() => document.body.style.overflow)).resolves.toBe('');

  await page.getByTestId('route-tab-grammar-level').click();
  await page.getByTestId('route-sub-menu-option-n5-grammar').click();
  await expect(page).toHaveURL(/\/n5-grammar$/);
  await expectStableRoute(page, 'n5-grammar-view');
  await expect(n5Body).toBeVisible();

  await page.getByTestId('route-tab-practice').click();
  await expect(page).toHaveURL(/\/practice$/);
  await expectStableRoute(page, 'practice-seion-table');

  expect(consoleErrors).toEqual([]);
});
