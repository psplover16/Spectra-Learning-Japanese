## Why

`src/modules/vocabulary/data/jpWords.ts` 中已有少數多義單字以 `\n` 分段同時填寫 `kanji` 與 `meaning`。既有 spec `vocabulary-meaning-pos-format` 已規範「每義一行」，並要求 `kanji` 與 `meaning` 行數 1:1 對齊（無漢字義以空 `kanji` 行 placeholder 對齊）。但本次新需求採取不同策略：`kanji` 欄只列「有漢字」的義且按順序排，無漢字義一律放尾端，因此 `meaning` 段數會 >= `kanji` 段數，且既有 spec 必須跟著修訂。同時新增 entry 的唯一性與位置規則目前只散落在開發者直覺，沒有寫入 spec 或 lint。下一支「單字測驗」change 的題目展開規則直接依賴此資料模型，因此必須先把規則寫死、補上 audit 與既有違規修正後才能進場。

## What Changes

- **MODIFIED** `vocabulary-meaning-pos-format` 中「kanji 與 meaning 行對齊」requirement：由「行數 1:1、無漢字以空行 placeholder 對齊」改為「`meaning` 段數 >= `kanji` 段數、無漢字義一律放尾端、不放空字串 placeholder」。**BREAKING**：既有以空 `kanji` 行 placeholder 表達的 entry 必須改寫為新格式。
- **ADDED** `vocabulary-meaning-pos-format` 中「entry 唯一性與新增規則」requirement：以 `text + kanji`（完整字串、含 `\n`）作為去重鍵，完全相同則拒絕加入；同音異字（text 同、kanji 不同）視為不同 entry；新增 entry 一律 append 到該 stage 區段尾端，不重新排序。
- **MODIFIED** `vocabulary-meaning-pos-format` 中「自動檢查」requirement：擴充 `scripts/vocabulary/checkVocabularyMeaningFormat.mjs`，把新對齊規則與唯一性規則納入失敗條件，原本的「行數 1:1」檢查改為「meaning 段數 >= kanji 段數 + 無漢字段在尾端」。
- 於 `src/modules/vocabulary/data/jpWords.ts` 的 N5 區段尾端新增 `から` entry（`kanji: "殻\n空"`、`meaning: "外殼\n空(無內容)\n從～、因為～；助詞"`）。
- 將既有違反新規則的條目逐筆修正：搬尾端、meaning 段順序對齊、移除空字串 `kanji` placeholder。

## Non-Goals

- 不重構 `vocabulary` 模組的儲存層（`markKey` / `markedKeys` 結構維持上一輪 natural-key 重構結果）。
- 不引入新測驗 UI 或 modal — 測驗功能屬於下一支 change `add-vocabulary-quiz-feature`。
- 不更動 `useVocabularySession` 對 entry 的載入與顯示邏輯（多段 meaning 已能正確以 `\n` 換行顯示）。
- 不對 `kanji` 為空字串的單義 entry 新增任何特例 — 既有「單義無漢字」entry 維持原樣（`kanji = ""`、`meaning` 為單一字串）。
- 不另外新增獨立 audit 腳本（決議：擴充既有 checker，避免雙軌規則漂移）。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `vocabulary-meaning-pos-format`: 修訂 kanji/meaning 行對齊規則改為「meaning 段數 >= kanji 段數、無漢字義放尾端」；新增 entry 唯一性與 append-only 位置規則；擴充自動檢查涵蓋上述兩項。

## Impact

- Affected specs: `vocabulary-meaning-pos-format`
- Affected code:
  - Modified: `src/modules/vocabulary/data/jpWords.ts`
  - Modified: `scripts/vocabulary/checkVocabularyMeaningFormat.mjs`
  - Modified: `tests/unit/vocabularyMeaningFormat.spec.ts`
  - Modified: `tests/unit/vocabularyData.spec.ts`
  - Removed: (none)
