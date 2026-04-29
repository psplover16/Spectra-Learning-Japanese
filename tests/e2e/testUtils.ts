import { expect, type Page } from '@playwright/test';

export async function gotoApp(page: Page, path = '/'): Promise<void> {
  await page.goto(path);
  await expect(page.getByTestId('app-shell')).toBeVisible();
}

export async function expectPrimaryTabs(page: Page): Promise<void> {
  const links = page.getByTestId('route-tabs').locator('a');
  await expect(links).toHaveCount(4);
  await expect(links).toHaveText(['字母練習', '變化規則', 'N5文法', '單字練習']);

  for (const label of ['字母練習', '變化規則', 'N5文法', '單字練習']) {
    await expect(page.getByRole('link', { name: label })).toBeVisible();
    await expect(page.getByRole('link', { name: label })).toHaveCSS('white-space', 'nowrap');
  }
}

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBe(false);
}
