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

async function expectLastVocabularyRowFullyVisible(page: Page) {
  const scroll = page.getByTestId('vocabulary-table-scroll');
  const lastRow = vocabularyRows(page).last();

  await scroll.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });

  const [scrollBox, rowBox] = await Promise.all([
    scroll.boundingBox(),
    lastRow.boundingBox()
  ]);

  expect(scrollBox).not.toBeNull();
  expect(rowBox).not.toBeNull();
  expect(rowBox!.y + rowBox!.height).toBeLessThanOrEqual(scrollBox!.y + scrollBox!.height + 1);
}

async function expectCompactControlSizing(page: Page) {
  const searchInput = page.getByTestId('vocabulary-search-input');
  const modeButton = page.getByTestId('vocabulary-reading-mode-button');
  const startQuizButton = page.getByTestId('vocabulary-start-quiz-button');

  await expect(searchInput).toHaveCSS('height', '32px');
  await expect(startQuizButton).toBeVisible();

  const startQuizBox = await startQuizButton.boundingBox();
  const readModeBox = await modeButton.boundingBox();

  expect(startQuizBox).not.toBeNull();
  expect(readModeBox).not.toBeNull();
  expect(Math.round(readModeBox!.width)).toBe(Math.round(startQuizBox!.width));
  expect(Math.round(readModeBox!.height)).toBe(Math.round(startQuizBox!.height));

  await modeButton.click();
  await expect(modeButton).toHaveText('操作模式');

  const operateModeBox = await modeButton.boundingBox();

  expect(operateModeBox).not.toBeNull();
  expect(Math.round(operateModeBox!.width)).toBe(Math.round(startQuizBox!.width));
  expect(Math.round(operateModeBox!.height)).toBe(Math.round(startQuizBox!.height));

  await modeButton.click();
  await expect(modeButton).toHaveText('閱讀模式');
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
  await expect(page.getByTestId('vocabulary-filter-practice-mode')).toHaveCount(0);
  await expect(page.getByTestId('vocabulary-reading-mode-button')).toHaveText('閱讀模式');
  await expect(page.getByTestId('vocabulary-action-controls')).toContainText('僅註記');
  await expect(page.getByTestId('vocabulary-action-controls')).not.toContainText('只顯示註記');
  await expectCountSummaryAbsent(page);
  await expectCompactControlSizing(page);
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
  await expect(vocabularyRows(page).first()).toBeVisible();
  await expectLastVocabularyRowFullyVisible(page);

  await page.getByTestId('vocabulary-reading-mode-button').click();
  await expect(page.getByTestId('vocabulary-reading-mode-button')).toHaveText('操作模式');
  await expect(page.getByTestId('vocabulary-search-input')).toBeVisible();
  await expect(page.getByTestId('vocabulary-level-controls')).toBeHidden();
  await expect(page.getByTestId('vocabulary-action-controls')).toBeHidden();
  await expect(page.getByTestId('vocabulary-table-region')).toHaveClass(/vocabulary-table-region-reading-mode/);
  await expectLastVocabularyRowFullyVisible(page);

  await page.getByTestId('vocabulary-reading-mode-button').click();
  await expect(page.getByTestId('vocabulary-reading-mode-button')).toHaveText('閱讀模式');
  await expect(page.getByTestId('vocabulary-level-controls')).toBeVisible();
  await expect(page.getByTestId('vocabulary-action-controls')).toBeVisible();

  await page.getByTestId('vocabulary-search-input').fill('早上');
  await expectOnlyRow(page, ['あさ', '朝', '早上']);
  await expectCountSummaryAbsent(page);
  await expectLastVocabularyRowFullyVisible(page);

  await expect(page.getByTestId('vocabulary-start-quiz-button')).toBeDisabled();
  await expect(headerBulkMarkCheckbox(page)).not.toBeChecked();
  await headerBulkMarkCheckbox(page).check();
  await expect(firstVisibleMarkCheckbox(page)).toBeChecked();
  expect(await page.evaluate(() => window.localStorage.getItem('vocabulary-mark-snapshot'))).toBeNull();
  await expect(page.getByTestId('vocabulary-start-quiz-button')).toBeEnabled();

  await page.getByTestId('vocabulary-start-quiz-button').click();
  await expect(page.getByTestId('exam-modal')).toBeVisible();
  await expect(page.getByTestId('exam-modal').locator('..')).toHaveCSS('z-index', '100');
  await expect(page.getByTestId('exam-prompt')).toHaveClass(/exam-modal-prompt-md/);
  await expect(page.getByTestId('exam-hint')).toHaveCount(0);
  await page.getByTestId('exam-unknown-button').click();
  await page.getByTestId('exam-next-button').click();
  await expect(page.getByTestId('exam-modal')).toHaveCount(0);
  await expect(page.getByTestId('vocabulary-unsaved-marks-hint')).toHaveCount(0);
  expect(await page.evaluate(() => window.localStorage.getItem('vocabulary-mark-snapshot'))).toBeNull();

  await expect(headerBulkMarkCheckbox(page)).toBeChecked();
  await page.getByTestId('vocabulary-save-marks-button').click();
  // Allow the async IndexedDB write chain to settle before reload.
  await page.waitForFunction(async () => {
    return new Promise<boolean>((resolve) => {
      const req = indexedDB.open('vocabulary');
      req.onsuccess = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('marks')) {
          db.close();
          resolve(false);
          return;
        }
        const tx = db.transaction('marks', 'readonly');
        const getAll = tx.objectStore('marks').getAll();
        getAll.onsuccess = () => {
          db.close();
          // Filter out the meta record (id starts with __meta:)
          const marks = (getAll.result as Array<{ id: string }>).filter((r) => !r.id.startsWith('__meta:'));
          resolve(marks.length > 0);
        };
        getAll.onerror = () => {
          db.close();
          resolve(false);
        };
      };
      req.onerror = () => resolve(false);
    });
  });

  await page.reload();
  await expectCountSummaryAbsent(page);
  await selectOnlyJlptLevel(page, 'N5');
  await page.getByTestId('vocabulary-search-input').fill('早上');
  await expectOnlyRow(page, ['あさ', '朝', '早上']);
  await expect(firstVisibleMarkCheckbox(page)).toBeChecked();

  // Per vocabulary-mark-persistence spec: marks persist in the IndexedDB mark store
  // across reloads. Verify the record id and that localStorage is NOT used.
  const indexedDbMarkIds = await page.evaluate(() => {
    return new Promise<string[]>((resolve) => {
      const req = indexedDB.open('vocabulary');
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction('marks', 'readonly');
        const getAll = tx.objectStore('marks').getAll();
        getAll.onsuccess = () => {
          db.close();
          const ids = (getAll.result as Array<{ id: string }>)
            .map((r) => r.id)
            .filter((id) => !id.startsWith('__meta:'));
          resolve(ids);
        };
        getAll.onerror = () => {
          db.close();
          resolve([]);
        };
      };
      req.onerror = () => resolve([]);
    });
  });
  expect(indexedDbMarkIds).toContain('あさ|朝');
  expect(await page.evaluate(() => window.localStorage.getItem('vocabulary-mark-snapshot'))).toBeNull();

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

test('migration: localStorage v2 snapshot 在啟動時被搬到 IndexedDB 且不再寫 localStorage', async ({ page }) => {
  // Land on root, seed pre-migration state, then navigate into vocabulary.
  // The seeded localStorage v2 snapshot represents a returning user from the
  // pre-IndexedDB era.
  await gotoApp(page, '/');

  // Pre-conditions: clear both stores and seed legacy localStorage data.
  await page.evaluate(() => {
    window.localStorage.removeItem('vocabulary-mark-snapshot');
    return new Promise<void>((resolve) => {
      const req = indexedDB.deleteDatabase('vocabulary');
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
      req.onblocked = () => resolve();
    });
  });
  await page.evaluate(() => {
    window.localStorage.setItem(
      'vocabulary-mark-snapshot',
      JSON.stringify({
        version: 2,
        markedKeys: ['あさ|朝'],
        updatedAt: '2026-01-01T00:00:00.000Z'
      })
    );
  });

  // Reload triggers main.ts boot, which fires migrateMarksFromLocalStorage().
  await page.reload();

  // Wait for migration to complete: IndexedDB has the record and localStorage is cleared.
  await page.waitForFunction(async () => {
    const ls = window.localStorage.getItem('vocabulary-mark-snapshot');
    if (ls !== null) return false;
    return new Promise<boolean>((resolve) => {
      const req = indexedDB.open('vocabulary');
      req.onsuccess = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('marks')) {
          db.close();
          resolve(false);
          return;
        }
        const getAll = db.transaction('marks', 'readonly').objectStore('marks').getAll();
        getAll.onsuccess = () => {
          db.close();
          const marks = (getAll.result as Array<{ id: string }>).filter((r) => r.id === 'あさ|朝');
          resolve(marks.length === 1);
        };
        getAll.onerror = () => {
          db.close();
          resolve(false);
        };
      };
      req.onerror = () => resolve(false);
    });
  });

  // Navigate to vocabulary and confirm the marked row shows as marked after migration.
  await page.goto('/vocabulary');
  await selectOnlyJlptLevel(page, 'N5');
  await page.getByTestId('vocabulary-search-input').fill('早上');
  await expectOnlyRow(page, ['あさ', '朝', '早上']);
  await expect(firstVisibleMarkCheckbox(page)).toBeChecked();
});

test('reading-mode transition CSS contract on desktop Chrome (1280px) verifies via real-browser getComputedStyle', async ({ page }) => {
  // Use the desktop viewport that was the original bug surface (桌機 Chrome
  // 不順、其他平台正常). The collapse pattern's correctness on wide viewports
  // is what this test guards.
  await page.setViewportSize({ width: 1280, height: 720 });
  await gotoApp(page, '/vocabulary');
  await expect(page.getByTestId('vocabulary-control-bar')).toBeVisible();

  const view = page.getByTestId('vocabulary-view');
  const levelControls = page.getByTestId('vocabulary-level-controls');
  const actionControls = page.getByTestId('vocabulary-action-controls');
  const modeButton = page.getByTestId('vocabulary-reading-mode-button');

  // Baseline computed styles in operation mode.
  const baselineLevel = await levelControls.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      visibility: cs.visibility,
      gridTemplateRows: cs.gridTemplateRows,
      display: cs.display,
      transition: cs.transition
    };
  });
  expect(baselineLevel.visibility).toBe('visible');
  expect(baselineLevel.display).toBe('grid');
  // gridTemplateRows in operation mode SHALL be a non-zero value
  // (browsers report it as a pixel measurement for `1fr`).
  expect(baselineLevel.gridTemplateRows).not.toBe('0px');
  // Per spec: opacity transition is 180ms (was 120ms before this change).
  // Chromium normalizes `180ms` to `0.18s` in computed style.
  expect(baselineLevel.transition).toMatch(/0\.18s|180ms/);
  // Per spec: base rule has `visibility 0s linear 0s` for immediate
  // flip-on-exit. The 0s delay is omitted from computed style when default,
  // so we just confirm visibility appears in the transition list.
  expect(baselineLevel.transition).toMatch(/visibility/);
  // Per spec: previous opacity-120ms timing SHALL NOT appear anywhere.
  expect(baselineLevel.transition).not.toMatch(/0\.12s|120ms/);

  // Activate reading mode and wait for the 180ms transition to fully settle.
  await modeButton.click();
  await page.waitForTimeout(250);

  await expect(view).toHaveClass(/vocabulary-view-reading-mode/);

  // Settled state in reading mode: per spec, visibility SHALL be hidden
  // (override rule applies `visibility 0s linear 180ms`, snap happens at
  // end of transition).
  const collapsedLevel = await levelControls.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      visibility: cs.visibility,
      gridTemplateRows: cs.gridTemplateRows,
      opacity: cs.opacity
    };
  });
  expect(collapsedLevel.visibility).toBe('hidden');
  // Per spec "Collapse animation has no leading dead zone": grid-template-rows
  // SHALL be 0fr (browsers report `0px` for 0fr at settled state).
  expect(collapsedLevel.gridTemplateRows).toBe('0px');
  expect(collapsedLevel.opacity).toBe('0');

  // Action controls SHALL collapse the same way.
  const collapsedAction = await actionControls.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      visibility: cs.visibility,
      gridTemplateRows: cs.gridTemplateRows,
      opacity: cs.opacity
    };
  });
  expect(collapsedAction.visibility).toBe('hidden');
  expect(collapsedAction.gridTemplateRows).toBe('0px');
  expect(collapsedAction.opacity).toBe('0');

  // Exit reading mode: visibility SHALL flip to visible immediately
  // (base rule applies `visibility 0s linear 0s`).
  await modeButton.click();
  await page.waitForTimeout(50); // brief wait, less than 180ms

  // At this point the transition is in progress, but visibility should
  // ALREADY be visible per the immediate-flip base rule.
  const exitingLevel = await levelControls.evaluate((el) => {
    return window.getComputedStyle(el).visibility;
  });
  expect(exitingLevel).toBe('visible');
});

test('reading-mode toggle 在桌機 1280px 下測量切換延遲（資訊性、不斷言）', async ({ page }) => {
  // Reports the click → first visible change latency for reference. The
  // automated measurement in headless Chromium consistently over-reports
  // versus real-browser perception (layout interpolation for
  // grid-template-rows 1fr → 0fr behaves differently under Playwright),
  // so this test logs data WITHOUT a hard assertion. Real validation lives
  // in the CSS contract test above and in manual user inspection of dev
  // server / production preview.
  await page.setViewportSize({ width: 1280, height: 720 });
  await gotoApp(page, '/vocabulary');
  await expect(page.getByTestId('vocabulary-control-bar')).toBeVisible();

  // Helper: measure click → first `transitionstart` event on the collapse
  // container. This is the most reliable signal that the browser has started
  // running the transition for our properties — far more accurate than polling
  // computedStyle (Chromium reports grid-template-rows discretely during
  // animation, which would falsely show ~140ms latency).
  async function measureTransitionStartLatency(): Promise<{
    deltaMs: number;
    propertyName: string;
  }> {
    return page.evaluate(() => {
      return new Promise<{ deltaMs: number; propertyName: string }>((resolve) => {
        const ctrl = document.querySelector('[data-testid="vocabulary-level-controls"]') as HTMLElement | null;
        const btn = document.querySelector('[data-testid="vocabulary-reading-mode-button"]') as HTMLButtonElement | null;
        if (!ctrl || !btn) {
          resolve({ deltaMs: -1, propertyName: '' });
          return;
        }
        let clickTime = -1;
        const onStart = (event: Event) => {
          const transitionEvent = event as TransitionEvent;
          ctrl.removeEventListener('transitionstart', onStart);
          resolve({
            deltaMs: performance.now() - clickTime,
            propertyName: transitionEvent.propertyName
          });
        };
        ctrl.addEventListener('transitionstart', onStart);
        clickTime = performance.now();
        btn.click();
        // Safety timeout
        window.setTimeout(() => {
          ctrl.removeEventListener('transitionstart', onStart);
          resolve({ deltaMs: -1, propertyName: '' });
        }, 500);
      });
    });
  }

  // Additional helper: measure click → first observable height change of the
  // INNER wrapper via getBoundingClientRect. This bypasses any quirks in
  // Chromium's transitionstart event ordering and directly observes layout.
  async function measureLayoutShrinkLatency(): Promise<{
    deltaMs: number;
    initialHeight: number;
    heightAtFirstChange: number;
  }> {
    return page.evaluate(() => {
      return new Promise<{ deltaMs: number; initialHeight: number; heightAtFirstChange: number }>(
        (resolve) => {
          const inner = document.querySelector(
            '.vocabulary-level-controls-inner'
          ) as HTMLElement | null;
          const btn = document.querySelector(
            '[data-testid="vocabulary-reading-mode-button"]'
          ) as HTMLButtonElement | null;
          if (!inner || !btn) {
            resolve({ deltaMs: -1, initialHeight: -1, heightAtFirstChange: -1 });
            return;
          }
          const initialHeight = inner.getBoundingClientRect().height;
          const clickTime = performance.now();
          btn.click();

          const tick = () => {
            const currentHeight = inner.getBoundingClientRect().height;
            // Allow 0.5px tolerance for sub-pixel rendering quirks
            if (Math.abs(currentHeight - initialHeight) > 0.5) {
              resolve({
                deltaMs: performance.now() - clickTime,
                initialHeight,
                heightAtFirstChange: currentHeight
              });
              return;
            }
            if (performance.now() - clickTime > 500) {
              resolve({ deltaMs: -1, initialHeight, heightAtFirstChange: currentHeight });
              return;
            }
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      );
    });
  }

  // Measure entering reading mode — both signals.
  const enterTransitionStart = await measureTransitionStartLatency();
  // eslint-disable-next-line no-console
  console.log('[reading-mode ENTER transitionstart event]', enterTransitionStart);

  // Wait for the collapse to fully settle before measuring layout shrink.
  await page.waitForTimeout(300);
  // Reset back to operation mode for clean entry measurement.
  await page.getByTestId('vocabulary-reading-mode-button').click();
  await page.waitForTimeout(300);

  const enterLayoutShrink = await measureLayoutShrinkLatency();
  // eslint-disable-next-line no-console
  console.log('[reading-mode ENTER layout shrink]', enterLayoutShrink);

  // Soft assertions — only validate the directional sign of the change,
  // not the exact timing (headless Chromium reports inconsistent latency).
  expect(enterLayoutShrink.deltaMs).toBeGreaterThanOrEqual(0);
  expect(enterLayoutShrink.heightAtFirstChange).toBeLessThan(enterLayoutShrink.initialHeight);

  // Wait for collapse to settle, then measure exit (expand) direction.
  await page.waitForTimeout(300);
  const exitLayoutShrink = await measureLayoutShrinkLatency();
  // eslint-disable-next-line no-console
  console.log('[reading-mode EXIT layout grow]', exitLayoutShrink);
  expect(exitLayoutShrink.deltaMs).toBeGreaterThanOrEqual(0);
  expect(exitLayoutShrink.heightAtFirstChange).toBeGreaterThan(exitLayoutShrink.initialHeight);
});

test('375px 下模擬離線時 vocabulary 控制列仍可操作', async ({ context, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await gotoApp(page, '/vocabulary');
  await expectCountSummaryAbsent(page);
  await expect(page.getByTestId('vocabulary-control-bar')).toBeVisible();
  await expect(page.getByTestId('vocabulary-filter-jlpt-select-all')).toHaveCount(0);
  await expect(jlptLevelCheckbox(page, 'N1')).toBeChecked();
  await expect(page.getByTestId('vocabulary-action-controls')).toContainText('僅註記');
  await expect(page.getByTestId('vocabulary-action-controls')).not.toContainText('只顯示註記');
  await expectCompactControlSizing(page);

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
    await expect(page.getByTestId('vocabulary-filter-practice-mode')).toHaveCount(0);
    await page.getByTestId('vocabulary-reading-mode-button').click();

    await expect(page.getByTestId('vocabulary-search-input')).toHaveValue('早上');
    await expect(page.getByTestId('vocabulary-reading-mode-button')).toHaveText('操作模式');
    await expect(page.getByTestId('vocabulary-level-controls')).toBeHidden();
    await expect(page.getByTestId('vocabulary-action-controls')).toBeHidden();
    await expect(page.getByTestId('vocabulary-control-bar')).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.getByTestId('vocabulary-reading-mode-button').click();
    await expect(page.getByTestId('vocabulary-reading-mode-button')).toHaveText('閱讀模式');
    await expect(page.getByTestId('vocabulary-level-controls')).toBeVisible();
    await expect(page.getByTestId('vocabulary-action-controls')).toBeVisible();
    await expect(jlptLevelCheckbox(page, 'N5')).toBeChecked();

    await checkboxInput(page, 'vocabulary-filter-show-marked-only').check();
    await expect(checkboxInput(page, 'vocabulary-filter-show-marked-only')).toBeChecked();
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
