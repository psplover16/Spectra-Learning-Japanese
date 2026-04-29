import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, expectPrimaryTabs, gotoApp } from './testUtils';

test('375px 下的 /grammar 可展開規則表且不破版', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await gotoApp(page, '/grammar');

  await expectPrimaryTabs(page);
  await expect(page.getByTestId('grammar-sections')).toBeVisible();
  await expect(page.getByTestId('grammar-section-system-difference')).toBeVisible();
  await expect(page.getByTestId('grammar-section-pos-conversion')).toBeVisible();

  await expect(page.locator('[data-testid="grammar-table-system-difference"] tbody')).toHaveAttribute('style', /display: none/i);

  await page.getByTestId('grammar-toggle-system-difference').click();
  await expect(page.locator('[data-testid="grammar-table-system-difference"] tbody')).toHaveAttribute('style', '');
  await expect(page.getByText('主詞＋動詞＋受詞（SVO）')).toBeVisible();

  await page.getByTestId('grammar-toggle-godan-table').click();
  await expect(page.getByText('書く→書き→書い(い音便)→書いて/書いた')).toBeVisible();

  await page.getByTestId('grammar-toggle-sahen-table').click();
  await expect(page.getByTestId('grammar-inflection-examples-sahen-sanpo-examples')).toContainText('雨の日は散歩しません。');
  await expect(page.getByTestId('grammar-inflection-examples-sahen-sanpo-examples')).toContainText('昨日は忙しかったので、散歩しませんでした。');

  await page.getByTestId('grammar-toggle-pos-conversion').click();
  await expect(page.getByText('V(普通形)＋こと：把『動作／事情』名詞化')).toBeVisible();

  await expectNoHorizontalOverflow(page);
});
