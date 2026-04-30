## Why

使用者要解決的問題是：單字練習頁目前缺少 N1～N5 難度分級篩選，字典資料的 stage 尚未收斂為 JLPT 分級，且目前頁面效率偏差。現在要在不破壞既有搜尋、註記與練習功能的前提下，讓單字頁可依 JLPT level 顯示資料並改善資料處理效率。

## What Changes

- 新增 N1、N2、N3、N4、N5 checkbox，勾選狀態會影響實際顯示的單字。
- 新增「全部勾選」checkbox，負責批次勾選或取消 N1～N5，並與各 level checkbox 自動同步。
- 將 `src/modules/vocabulary/data/jpWords.ts` 中每筆單字的 `stage` 收斂為 N1～N5 之一。
- 移除單字練習頁顯示「XXXX 個單字」的數量統計 UI。
- 調整控制列：N1～N5 與全部勾選位於練習控制列上方；練習與只顯示註記靠左同列，儲存註記按鈕靠右同列。
- 調整單字頁上方非字母控制區：搜尋/全域篩選、JLPT level controls、action controls 三個垂直 block 之間的 gap 改為 8px。
- 在保持既有功能的前提下改善單字頁資料轉換與篩選效率，避免重複高成本 filter / map。

## Non-Goals

- 不新增伺服器、帳號、雲端同步或 analytics。
- 不建立跨頁面的完整學習進度系統。
- 不新增 SRS 或單字熟練度演算法。
- 不重做整個單字頁 UI；範圍限於 JLPT level 篩選、控制列排列、單字數量 UI 移除與效率改善。

## Capabilities

### New Capabilities

- `vocabulary-jlpt-level-filtering`: 單字練習頁可依 N1～N5 篩選單字，資料 stage 收斂為 JLPT level，並維持既有註記、搜尋與練習功能。

### Modified Capabilities

(none)

## Impact

- Affected specs: `vocabulary-jlpt-level-filtering`.
- Affected code:
  - New: (none expected)
  - Modified: `src/modules/vocabulary/data/jpWords.ts`, `src/modules/vocabulary/types/vocabulary.ts`, `src/modules/vocabulary/utils/vocabularyFilters.ts`, `src/modules/vocabulary/composables/useVocabularySession.ts`, `src/modules/vocabulary/components/VocabularyControlBar.vue`, `src/modules/vocabulary/components/VocabularyCountSummary.vue`, `src/modules/vocabulary/views/VocabularyView.vue`, `src/styles/main.css`, `tests/unit/vocabularyData.spec.ts`, `tests/unit/vocabularyFilters.spec.ts`, `tests/component/VocabularyControlBar.spec.ts`, `tests/component/VocabularyViewSmoke.spec.ts`, `tests/e2e/vocabulary-word-practice.spec.ts`, `PROJECT_ARCHITECTURE.md`.
  - Removed: (none expected; count summary component may become unused if implementation chooses to stop rendering it rather than delete it)
