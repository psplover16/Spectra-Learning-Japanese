import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, expectPrimaryTabs, gotoApp } from './testUtils';

test('375px 下的 /practice 首屏可讀且下半部區塊穩定顯示', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await gotoApp(page, '/practice');

  await expectPrimaryTabs(page);
  await expect(page.getByTestId('practice-reference-sections')).toBeVisible();
  await expect(page.getByTestId('practice-seion-table')).toBeVisible();
  await expect(page.getByTestId('practice-dakuon-table')).toBeVisible();
  await expect(page.getByTestId('seion-yoon-section')).toBeVisible();
  await expect(page.getByTestId('dakuon-yoon-section')).toBeVisible();
  await expect(page.getByTestId('loanword-section')).toBeVisible();
  await expect(page.getByTestId('choon-section')).toBeVisible();
  await expect(page.getByTestId('loanword-section')).toContainText('ファ');
  await expect(page.getByTestId('choon-section')).toContainText('ケーキ');
  await expect(page.getByText('tableA')).toHaveCount(0);
  await expect(page.getByText('tableB')).toHaveCount(0);

  const seionFontSize = await page.getByTestId('practice-seion-table').locator('.practice-kana-main-text').first().evaluate((element) =>
    Number.parseFloat(window.getComputedStyle(element).fontSize)
  );
  const dakuonFontSize = await page.getByTestId('practice-dakuon-table').locator('.practice-kana-main-text').first().evaluate((element) =>
    Number.parseFloat(window.getComputedStyle(element).fontSize)
  );
  const kanaTextGap = await page.getByTestId('practice-seion-table').locator('.practice-kana-text-stack').first().evaluate((element) => {
    const style = window.getComputedStyle(element);
    return style.rowGap || style.gap;
  });

  expect(seionFontSize).toBeGreaterThan(11);
  expect(dakuonFontSize).toBeGreaterThan(11);
  expect(kanaTextGap).toBe('4px');
  await expectNoHorizontalOverflow(page);
});
