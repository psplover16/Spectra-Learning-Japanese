import { expect, test, type Page } from '@playwright/test';
import { expectNoHorizontalOverflow, expectPrimaryTabs, gotoApp } from './testUtils';

const jlptLevels = ['N1', 'N2', 'N3', 'N4', 'N5'] as const;
const existingSearchExamples = [
  { query: '皮膚', expectedTexts: ['はだ', '肌', '皮膚'] },
  { query: '光滑', expectedTexts: ['なめらか', '滑らか', '光滑（な形容詞）'] },
  { query: '動作', expectedTexts: ['うごき', '動き', '動作'] },
  { query: '居酒屋', expectedTexts: ['いざかや', '居酒屋'] },
  { query: '東口', expectedTexts: ['ひがしぐち', '東口'] },
  { query: '西口', expectedTexts: ['にしぐち', '西口'] },
  { query: '北口', expectedTexts: ['きたぐち', '北口'] },
  { query: '南口', expectedTexts: ['みなみぐち', '南口'] }
] as const;

type JlptLevel = (typeof jlptLevels)[number];

function checkboxInput(page: Page, testId: string) {
  return page.locator(`input[data-testid="${testId}"], [data-testid="${testId}"] input`);
}

function jlptLevelCheckbox(page: Page, level: JlptLevel) {
  return checkboxInput(page, `vocabulary-filter-jlpt-${level.toLowerCase()}`);
}

function vocabularyRows(page: Page) {
  return page.locator('[data-testid^="vocabulary-row-"]');
}

function headerBulkMarkCheckbox(page: Page) {
  return page.getByTestId('vocabulary-bulk-mark-checkbox');
}

async function expectCountSummaryAbsent(page: Page) {
  await expect(page.getByTestId('vocabulary-count-summary')).toHaveCount(0);
  await expect(page.getByText(/^\d+個單字$/)).toHaveCount(0);
}

async function expectSelectedJlptLevels(page: Page, selectedLevels: readonly JlptLevel[]) {
  const selectedSet = new Set(selectedLevels);

  for (const level of jlptLevels) {
    const checkbox = jlptLevelCheckbox(page, level);

    if (selectedSet.has(level)) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }
}

async function selectOnlyJlptLevel(page: Page, level: JlptLevel) {
  for (const candidate of jlptLevels) {
    await jlptLevelCheckbox(page, candidate).uncheck();
  }

  await expect(page.getByTestId('vocabulary-filter-jlpt-select-all')).toHaveCount(0);
  await expectSelectedJlptLevels(page, []);

  await jlptLevelCheckbox(page, level).check();
  await expectSelectedJlptLevels(page, [level]);
}

async function expectOnlyRow(page: Page, expectedTexts: readonly string[]) {
  const row = vocabularyRows(page).first();

  await expect(vocabularyRows(page)).toHaveCount(1);
  await expect(row).toBeVisible();

  for (const text of expectedTexts) {
    await expect(row).toContainText(text);
  }
}

function firstVisibleMarkCheckbox(page: Page) {
  return vocabularyRows(page).first().locator('input[type="checkbox"]');
}

async function expectOnlyRowContaining(page: Page, expectedTexts: readonly string[]) {
  const row = vocabularyRows(page).first();

  await expect(vocabularyRows(page)).toHaveCount(1);

  for (const text of expectedTexts) {
    await expect(row).toContainText(text);
  }
}

test('375px 下 JLPT level 篩選與既有單字互動可並用', async ({ page }) => {
  const consoleErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    consoleErrors.push(error.message);
  });
  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  await page.setViewportSize({ width: 375, height: 812 });
  await gotoApp(page, '/vocabulary');

  await expectPrimaryTabs(page);
  await expect(page.getByTestId('vocabulary-control-bar')).toBeVisible();
  await expectCountSummaryAbsent(page);
  await expectNoHorizontalOverflow(page);

  await expect(page.getByTestId('vocabulary-filter-jlpt-select-all')).toHaveCount(0);
  await expect(page.getByTestId('vocabulary-filter-jlpt-level-all')).toHaveCount(0);
  await expectSelectedJlptLevels(page, jlptLevels);
  await expect(vocabularyRows(page).first()).toContainText('早上');

  for (const { query, expectedTexts } of existingSearchExamples) {
    await page.getByTestId('vocabulary-search-input').fill(query);
    await expectOnlyRow(page, expectedTexts);
    await expectCountSummaryAbsent(page);
  }

  await page.getByTestId('vocabulary-search-input').fill('說話');
  await expectOnlyRowContaining(page, ['はなす', '話す', '說話']);
  await expectCountSummaryAbsent(page);
  await page.getByTestId('vocabulary-search-input').fill('');

  for (const level of jlptLevels) {
    await jlptLevelCheckbox(page, level).uncheck();
    await expect(jlptLevelCheckbox(page, level)).not.toBeChecked();

    await jlptLevelCheckbox(page, level).check();
    await expect(jlptLevelCheckbox(page, level)).toBeChecked();
  }

  for (const level of jlptLevels) {
    await jlptLevelCheckbox(page, level).uncheck();
  }

  await expectSelectedJlptLevels(page, []);
  await expect(vocabularyRows(page)).toHaveCount(0);
  await expect(page.getByTestId('vocabulary-start-quiz-button')).toHaveCount(0);
  expect(consoleErrors).toEqual([]);

  await selectOnlyJlptLevel(page, 'N5');
  await page.getByTestId('vocabulary-search-input').fill('早上');
  await expectOnlyRow(page, ['あさ', '朝', '早上']);
  await expectCountSummaryAbsent(page);

  await expect(page.getByTestId('vocabulary-start-quiz-button')).toBeDisabled();
  await expect(headerBulkMarkCheckbox(page)).not.toBeChecked();
  await headerBulkMarkCheckbox(page).check();
  await expect(firstVisibleMarkCheckbox(page)).toBeChecked();
  expect(await page.evaluate(() => window.localStorage.getItem('vocabulary-mark-snapshot'))).toBeNull();
  await expect(page.getByTestId('vocabulary-start-quiz-button')).toBeEnabled();

  await page.getByTestId('vocabulary-start-quiz-button').click();
  await expect(page.getByTestId('exam-modal')).toBeVisible();
  await expect(page.getByTestId('exam-prompt')).toHaveClass(/exam-modal-prompt-md/);
  await expect(page.getByTestId('exam-hint')).toHaveCount(0);
  await page.getByTestId('exam-unknown-button').click();
  await page.getByTestId('exam-next-button').click();
  await expect(page.getByTestId('exam-modal')).toHaveCount(0);
  await expect(page.getByTestId('vocabulary-unsaved-marks-hint')).toHaveCount(0);
  expect(await page.evaluate(() => window.localStorage.getItem('vocabulary-mark-snapshot'))).toBeNull();

  await expect(headerBulkMarkCheckbox(page)).toBeChecked();
  await page.getByTestId('vocabulary-save-marks-button').click();

  await page.reload();
  await expectCountSummaryAbsent(page);
  await selectOnlyJlptLevel(page, 'N5');
  await page.getByTestId('vocabulary-search-input').fill('早上');
  await expectOnlyRow(page, ['あさ', '朝', '早上']);
  await expect(firstVisibleMarkCheckbox(page)).toBeChecked();

  await checkboxInput(page, 'vocabulary-filter-show-marked-only').check();
  await expectOnlyRow(page, ['あさ', '朝', '早上']);

  const onlyRowTestId = await vocabularyRows(page).first().getAttribute('data-testid');
  const onlyRowId = onlyRowTestId?.replace('vocabulary-row-', '');
  const combinedContent = page.getByTestId(`vocabulary-combined-content-${onlyRowId}`);
  await expect(combinedContent).toHaveClass(/vocabulary-hidden-content/);

  await vocabularyRows(page).first().dispatchEvent('pointerdown');
  await page.waitForTimeout(450);
  await expect(combinedContent).not.toHaveClass(/vocabulary-hidden-content/);

  await vocabularyRows(page).first().dispatchEvent('pointerup');
  await expect(combinedContent).toHaveClass(/vocabulary-hidden-content/);
  expect(consoleErrors).toEqual([]);
});

test('375px 下模擬離線時 vocabulary 控制列仍可操作', async ({ context, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await gotoApp(page, '/vocabulary');
  await expectCountSummaryAbsent(page);
  await expect(page.getByTestId('vocabulary-control-bar')).toBeVisible();
  await expect(page.getByTestId('vocabulary-filter-jlpt-select-all')).toHaveCount(0);
  await expect(jlptLevelCheckbox(page, 'N1')).toBeChecked();

  await context.setOffline(true);

  try {
    await jlptLevelCheckbox(page, 'N1').uncheck();
    await expect(jlptLevelCheckbox(page, 'N1')).not.toBeChecked();

    await jlptLevelCheckbox(page, 'N1').check();
    await expectSelectedJlptLevels(page, jlptLevels);

    for (const level of jlptLevels) {
      await jlptLevelCheckbox(page, level).uncheck();
    }

    await expectSelectedJlptLevels(page, []);
    await expect(vocabularyRows(page)).toHaveCount(0);
    await expect(page.getByTestId('vocabulary-start-quiz-button')).toHaveCount(0);

    await jlptLevelCheckbox(page, 'N5').check();
    await page.getByTestId('vocabulary-search-input').fill('早上');
    await checkboxInput(page, 'vocabulary-filter-practice-mode').check();
    await checkboxInput(page, 'vocabulary-filter-show-marked-only').check();

    await expect(page.getByTestId('vocabulary-search-input')).toHaveValue('早上');
    await expect(jlptLevelCheckbox(page, 'N5')).toBeChecked();
    await expect(checkboxInput(page, 'vocabulary-filter-practice-mode')).toBeChecked();
    await expect(checkboxInput(page, 'vocabulary-filter-show-marked-only')).toBeChecked();
    await expect(page.getByTestId('vocabulary-control-bar')).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await checkboxInput(page, 'vocabulary-filter-show-marked-only').uncheck();
    await expect(page.getByTestId('vocabulary-start-quiz-button')).toBeDisabled();
    await headerBulkMarkCheckbox(page).check();
    await expect(firstVisibleMarkCheckbox(page)).toBeChecked();
    await expect(page.getByTestId('vocabulary-start-quiz-button')).toBeEnabled();
    await page.getByTestId('vocabulary-start-quiz-button').click();
    await expect(page.getByTestId('exam-modal')).toBeVisible();
    await page.getByTestId('exam-next-button').click();
    await page.getByTestId('exam-next-button').click();
    await expect(page.getByTestId('exam-modal')).toHaveCount(0);
  } finally {
    await context.setOffline(false);
  }
});
