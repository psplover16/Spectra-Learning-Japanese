import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, expectPrimaryTabs, gotoApp } from './testUtils';

test('首頁可載入並切換主要導覽', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await gotoApp(page, '/');

  await expect(page).toHaveURL(/\/practice$/);
  await expectPrimaryTabs(page);
  await expect(page.getByTestId('app-header').locator('h1')).toHaveCount(0);
  await expect(page.getByTestId('practice-seion-table')).toBeVisible();

  await page.getByRole('link', { name: '變化規則' }).click();
  await expect(page).toHaveURL(/\/grammar$/);
  await expect(page.getByTestId('grammar-sections')).toBeVisible();

  await page.getByRole('link', { name: 'N5文法' }).click();
  await expect(page).toHaveURL(/\/n5-grammar$/);
  await expect(page.getByTestId('n5-grammar-view')).toContainText('核心詞類用法總覽');
  await expect(page.getByTestId('n5-grammar-view')).toContainText('敬體變化速覽');
  await expect(page.getByTestId('n5-grammar-view')).toContainText('敬體句型：現在型與詞類基礎');
  await expect(page.getByTestId('n5-grammar-view')).toContainText('敬體句型：過去、狀態與補充表現');
  await expect(page.getByTestId('n5-grammar-view')).toContainText('邀約與勸誘：ませんか 與 ましょう');
  await expect(page.getByTestId('n5-grammar-view')).toContainText('できる：能力、可能與完成');
  await expect(page.getByTestId('n5-grammar-view')).toContainText('狀態變化：～くなります / ～になります');
  await expect(page.getByTestId('n5-grammar-view')).toContainText('人為改變：～くします / ～にします');
  await expect(page.getByTestId('n5-grammar-view')).not.toContainText('句型與詞類敬體基礎');
  await expect(page.getByTestId('n5-grammar-view')).not.toContainText('製作中');

  await page.getByRole('link', { name: '單字練習' }).click();
  await expect(page).toHaveURL(/\/vocabulary$/);
  await expect(page.getByTestId('vocabulary-control-bar')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('敬體變化速覽');
  await expect(page.locator('body')).not.toContainText('核心詞類用法總覽');

  await expectPrimaryTabs(page);
  await expectNoHorizontalOverflow(page);
});

test('可直接以網址進入 N5 文法頁', async ({ page }) => {
  await gotoApp(page, '/n5-grammar');

  await expect(page.getByTestId('n5-grammar-view')).toContainText('核心詞類用法總覽');
  await expect(page.getByTestId('n5-grammar-view')).toContainText('敬體變化速覽');
  await expect(page.getByTestId('n5-grammar-view')).toContainText('敬體句型：現在型與詞類基礎');
  await expect(page.getByTestId('n5-grammar-view')).toContainText('敬體句型：過去、狀態與補充表現');
  await expect(page.getByTestId('n5-grammar-view')).toContainText('邀約與勸誘：ませんか 與 ましょう');
  await expect(page.getByTestId('n5-grammar-view')).toContainText('できる：能力、可能與完成');
  await expect(page.getByTestId('n5-grammar-view')).toContainText('狀態變化：～くなります / ～になります');
  await expect(page.getByTestId('n5-grammar-view')).toContainText('人為改變：～くします / ～にします');
  await expect(page.getByTestId('n5-grammar-view')).not.toContainText('句型與詞類敬體基礎');
  await expect(page.getByTestId('n5-grammar-view')).not.toContainText('製作中');
  await expectPrimaryTabs(page);
});
