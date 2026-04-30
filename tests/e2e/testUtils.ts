import { expect, type Page } from '@playwright/test';

export async function gotoApp(page: Page, path = '/'): Promise<void> {
  await page.goto(path);
  await expect(page.getByTestId('app-shell')).toBeVisible();
}

export async function expectPrimaryTabs(page: Page, grammarLabel = 'N5文法'): Promise<void> {
  const controls = page.getByTestId('route-tabs').locator('a,button');
  await expect(controls).toHaveCount(4);
  await expect(controls).toHaveText(['字母練習', '變化規則', grammarLabel, '單字練習']);

  for (const testId of ['route-tab-practice', 'route-tab-grammar', 'route-tab-grammar-level', 'route-tab-vocabulary']) {
    await expect(page.getByTestId(testId)).toBeVisible();
    await expect(page.getByTestId(testId)).toHaveCSS('white-space', 'nowrap');
  }
}

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBe(false);
}
