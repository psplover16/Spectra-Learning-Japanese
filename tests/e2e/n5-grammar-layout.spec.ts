import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, expectPrimaryTabs, gotoApp } from './testUtils';

test('375px 下的 /n5-grammar 可展開 v16 核心區塊且不破版', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    pageErrors.push(String(error));
  });

  await page.setViewportSize({ width: 375, height: 900 });
  await gotoApp(page, '/n5-grammar');

  await expectPrimaryTabs(page);
  await expect(page.getByTestId('n5-grammar-view')).toBeVisible();
  await expect(page.getByTestId('n5-grammar-section-core-term-usage-overview')).toBeVisible();
  await expect(page.getByTestId('n5-grammar-section-polite-overview')).toBeVisible();
  await expect(page.getByTestId('n5-grammar-section-sentence-basics')).toBeVisible();
  await expect(page.getByTestId('n5-grammar-section-invitation-comparison')).toBeVisible();
  await expect(page.getByTestId('n5-grammar-section-dekiru-ability')).toBeVisible();
  await expect(page.getByTestId('n5-grammar-section-demonstratives')).toBeVisible();
  await expect(page.getByTestId('n5-grammar-section-numbers')).toBeVisible();
  await expect(page.getByTestId('n5-grammar-section-time-expressions')).toBeVisible();
  await expect(page.getByTestId('n5-grammar-section-state-change-naru')).toBeVisible();
  await expect(page.getByTestId('n5-grammar-section-state-change-suru')).toBeVisible();
  await expect(page.getByText('製作中')).toHaveCount(0);

  const coreTermToggle = page.getByTestId('n5-grammar-toggle-core-term-usage-overview');
  const politeOverviewToggle = page.getByTestId('n5-grammar-toggle-polite-overview');
  const sentenceBasicsToggle = page.getByTestId('n5-grammar-toggle-sentence-basics');
  const pastAndStateToggle = page.getByTestId('n5-grammar-toggle-past-and-state');
  await expect(coreTermToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(politeOverviewToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(sentenceBasicsToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(pastAndStateToggle).toHaveAttribute('aria-expanded', 'false');

  await coreTermToggle.click();
  await expect(coreTermToggle).toHaveAttribute('aria-expanded', 'true');
  const coreTermSection = page.getByTestId('n5-grammar-section-core-term-usage-overview');
  await expect(coreTermSection.getByTestId('n5-grammar-compare-table-core-term-usage-overview')).toBeVisible();
  await expect(coreTermSection.getByRole('rowheader', { name: 'い形容詞' })).toBeVisible();

  await politeOverviewToggle.click();
  await expect(politeOverviewToggle).toHaveAttribute('aria-expanded', 'true');

  const overviewSection = page.getByTestId('n5-grammar-section-polite-overview');
  const overviewTable = overviewSection.getByTestId('n5-grammar-compare-table-polite-overview');
  await expect(overviewTable).toBeVisible();
  await expect(overviewTable.getByRole('rowheader', { name: '現在肯定' })).toBeVisible();
  await expect(overviewSection.locator('[data-testid^="n5-grammar-table-example-"]')).toHaveCount(12);
  await expect(overviewSection.getByTestId('n5-grammar-table-example-present-positive-nominal')).toContainText('この部屋は静かです。');

  await sentenceBasicsToggle.click();
  const sentenceBasicsSection = page.getByTestId('n5-grammar-section-sentence-basics');
  await expect(sentenceBasicsSection.getByText('名詞與な形容詞的句尾變化與接名詞差異')).toBeVisible();
  await expect(sentenceBasicsSection.getByText('名詞句與な形容詞句')).toBeVisible();
  await expect(sentenceBasicsSection.locator('[data-testid^="n5-grammar-compare-table-"]')).toHaveCount(0);

  const invitationToggle = page.getByTestId('n5-grammar-toggle-invitation-comparison');
  await invitationToggle.scrollIntoViewIfNeeded();
  await expect(invitationToggle).toHaveAttribute('aria-expanded', 'false');
  await invitationToggle.click();
  await expect(invitationToggle).toHaveAttribute('aria-expanded', 'true');

  const invitationSection = page.getByTestId('n5-grammar-section-invitation-comparison');
  await expect(invitationSection.getByTestId('n5-grammar-compare-table-invitation-comparison')).toBeVisible();
  await expect(
    invitationSection.getByTestId('n5-grammar-table-example-invitation-tone-masenka').getByText('疲れましたね。ちょっと休みませんか。')
  ).toBeVisible();
  await expect(
    invitationSection.getByTestId('n5-grammar-topic-invitation-core-difference').getByText('この週末、食事に行きませんか。')
  ).toBeVisible();
  await expect(invitationSection.getByText('一緒に映画を見ない？')).toBeVisible();
  await expect(
    invitationSection.getByTestId('n5-grammar-topic-mashou-plain-volitional').getByText('一緒に帰ろう。', { exact: true })
  ).toBeVisible();
  await expect(
    invitationSection
      .getByTestId('n5-grammar-topic-invitation-core-difference')
      .getByText('山の中ではごみは捨てないで、ちゃんと持って帰りましょう。')
  ).toBeVisible();
  await expect(invitationSection.locator('[data-testid^="n5-grammar-table-example-"]')).toHaveCount(2);

  const dekiruToggle = page.getByTestId('n5-grammar-toggle-dekiru-ability');
  await dekiruToggle.scrollIntoViewIfNeeded();
  await dekiruToggle.click();
  const dekiruSection = page.getByTestId('n5-grammar-section-dekiru-ability');
  await expect(dekiruSection.getByText('日本語ができます。')).toBeVisible();
  await expect(dekiruSection.getByText('て形：できて；假定形：できれば / できたら。')).toBeVisible();

  const demonstrativesToggle = page.getByTestId('n5-grammar-toggle-demonstratives');
  await demonstrativesToggle.scrollIntoViewIfNeeded();
  await demonstrativesToggle.click();
  const demonstrativesSection = page.getByTestId('n5-grammar-section-demonstratives');
  await expect(demonstrativesSection.getByTestId('n5-grammar-compare-table-demonstratives')).toBeVisible();
  await expect(demonstrativesSection.locator('.n5-grammar-example-highlight').getByText('これ', { exact: true }).first()).toBeVisible();

  const numbersToggle = page.getByTestId('n5-grammar-toggle-numbers');
  await numbersToggle.scrollIntoViewIfNeeded();
  await numbersToggle.click();
  await expect(page.getByTestId('n5-grammar-section-numbers').getByText('じゅっ / じっ')).toBeVisible();

  const timeToggle = page.getByTestId('n5-grammar-toggle-time-expressions');
  await timeToggle.scrollIntoViewIfNeeded();
  if ((await timeToggle.getAttribute('aria-expanded')) === 'false') {
    await timeToggle.click();
  }
  const timeSection = page.getByTestId('n5-grammar-section-time-expressions');
  await expect(timeSection.getByRole('heading', { name: '月份', exact: true })).toBeVisible();
  await expect(timeSection.getByRole('heading', { name: '日期', exact: true })).toBeVisible();
  await expect(timeSection.getByRole('heading', { name: '星期', exact: true })).toBeVisible();
  await expect(timeSection.getByRole('heading', { name: '小時', exact: true })).toBeVisible();
  await expect(timeSection.getByRole('heading', { name: '分鐘', exact: true })).toBeVisible();
  await expect(timeSection.getByRole('heading', { name: '其他常用表現', exact: true })).toBeVisible();
  await expect(timeSection.getByText('午後三時半です。')).toBeVisible();
  await expect(timeSection.getByText('午前八時十五分です。')).toBeVisible();
  await expect(timeSection.locator('.n5-grammar-shared-note-box')).toHaveCount(1);
  await expect(timeSection.getByTestId('n5-grammar-topic-time-months').locator('.n5-grammar-example-box')).toHaveCount(0);
  await expect(timeSection.locator('.n5-grammar-detail-highlight').getByText('しがつ', { exact: true })).toBeVisible();
  await expect(timeSection.locator('.n5-grammar-detail-highlight').getByText('じゅっぷん', { exact: true })).toBeVisible();

  const naruToggle = page.getByTestId('n5-grammar-toggle-state-change-naru');
  await naruToggle.scrollIntoViewIfNeeded();
  await naruToggle.click();
  await expect(naruToggle).toHaveAttribute('aria-expanded', 'true');

  const naruSection = page.getByTestId('n5-grammar-section-state-change-naru');
  await expect(naruSection.getByText('今日は寒くなりました。')).toBeVisible();
  await expect(naruSection.getByText('辞める / 止める / やめる')).toBeVisible();

  const suruToggle = page.getByTestId('n5-grammar-toggle-state-change-suru');
  await suruToggle.scrollIntoViewIfNeeded();
  await suruToggle.click();
  await expect(suruToggle).toHaveAttribute('aria-expanded', 'true');

  const suruSection = page.getByTestId('n5-grammar-section-state-change-suru');
  await expect(suruSection.getByText('図書館では静かにします。')).toBeVisible();
  await expect(suruSection.getByText('教室では静かにしてください。')).toBeVisible();

  await expectNoHorizontalOverflow(page);
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
