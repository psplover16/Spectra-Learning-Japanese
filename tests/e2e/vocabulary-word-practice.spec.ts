import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, expectPrimaryTabs, gotoApp } from './testUtils';

test('單字練習頁可搜尋、持久化註記並支援長按揭露', async ({ page }) => {
  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  await gotoApp(page, '/vocabulary');

  await expectPrimaryTabs(page);
  await expect(page.getByTestId('vocabulary-control-bar')).toBeVisible();
  await expect(page.getByTestId('vocabulary-count-summary')).toContainText('1086個單字');

  await page.getByTestId('vocabulary-mark-checkbox-1').check();
  await page.getByTestId('vocabulary-save-marks-button').click();

  await page.reload();
  await expect(page.getByTestId('vocabulary-mark-checkbox-1')).toBeChecked();

  const combinedContent = page.getByTestId('vocabulary-combined-content-1');
  await expect(combinedContent).toHaveClass(/vocabulary-hidden-content/);

  await page.getByTestId('vocabulary-row-1').dispatchEvent('pointerdown');
  await page.waitForTimeout(450);
  await expect(combinedContent).not.toHaveClass(/vocabulary-hidden-content/);

  await page.getByTestId('vocabulary-row-1').dispatchEvent('pointerup');
  await expect(combinedContent).toHaveClass(/vocabulary-hidden-content/);

  await page.getByTestId('vocabulary-search-input').fill('皮膚');
  await expect(page.getByTestId('vocabulary-count-summary')).toContainText('1個單字');
  await expect(page.getByTestId('vocabulary-row-1077')).toContainText('はだ');
  await expect(page.getByTestId('vocabulary-row-1077')).toContainText('肌');
  await expect(page.getByTestId('vocabulary-row-1077')).toContainText('皮膚');

  await page.getByTestId('vocabulary-search-input').fill('光滑');
  await expect(page.getByTestId('vocabulary-count-summary')).toContainText('1個單字');
  await expect(page.getByTestId('vocabulary-row-1078')).toContainText('なめらか');
  await expect(page.getByTestId('vocabulary-row-1078')).toContainText('滑らか');
  await expect(page.getByTestId('vocabulary-row-1078')).toContainText('光滑(な形容詞)');

  await page.getByTestId('vocabulary-search-input').fill('動作');
  await expect(page.getByTestId('vocabulary-count-summary')).toContainText('1個單字');
  await expect(page.getByTestId('vocabulary-row-1079')).toContainText('うごき');
  await expect(page.getByTestId('vocabulary-row-1079')).toContainText('動き');
  await expect(page.getByTestId('vocabulary-row-1079')).toContainText('動作');

  await page.getByTestId('vocabulary-search-input').fill('居酒屋');
  await expect(page.getByTestId('vocabulary-count-summary')).toContainText('1個單字');
  await expect(page.getByTestId('vocabulary-row-1080')).toContainText('いざかや');
  await expect(page.getByTestId('vocabulary-row-1080')).toContainText('居酒屋');

  await page.getByTestId('vocabulary-search-input').fill('東口');
  await expect(page.getByTestId('vocabulary-count-summary')).toContainText('1個單字');
  await expect(page.getByTestId('vocabulary-row-1083')).toContainText('ひがしぐち');
  await expect(page.getByTestId('vocabulary-row-1083')).toContainText('東口');

  await page.getByTestId('vocabulary-search-input').fill('西口');
  await expect(page.getByTestId('vocabulary-count-summary')).toContainText('1個單字');
  await expect(page.getByTestId('vocabulary-row-1084')).toContainText('にしぐち');
  await expect(page.getByTestId('vocabulary-row-1084')).toContainText('西口');

  await page.getByTestId('vocabulary-search-input').fill('北口');
  await expect(page.getByTestId('vocabulary-count-summary')).toContainText('1個單字');
  await expect(page.getByTestId('vocabulary-row-1085')).toContainText('きたぐち');
  await expect(page.getByTestId('vocabulary-row-1085')).toContainText('北口');

  await page.getByTestId('vocabulary-search-input').fill('南口');
  await expect(page.getByTestId('vocabulary-count-summary')).toContainText('1個單字');
  await expect(page.getByTestId('vocabulary-row-1086')).toContainText('みなみぐち');
  await expect(page.getByTestId('vocabulary-row-1086')).toContainText('南口');

  await page.getByTestId('vocabulary-search-input').fill('說話');
  await expect(page.getByTestId('vocabulary-count-summary')).toContainText('1個單字');
  await expect(page.locator('[data-testid^="vocabulary-row-"]')).toHaveCount(1);
  await expect(page.locator('[data-testid^="vocabulary-row-"]').first()).toContainText('はなす');
  await expect(page.locator('[data-testid^="vocabulary-row-"]').first()).toContainText('話す');
  await expect(page.locator('[data-testid^="vocabulary-row-"]').first()).toContainText('說話');

  await page.getByTestId('vocabulary-search-input').fill('');
  await expect(page.getByTestId('vocabulary-count-summary')).toContainText('1086個單字');

  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.getByTestId('vocabulary-control-bar')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
