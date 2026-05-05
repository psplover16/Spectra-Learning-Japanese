## Why

使用者在單字練習子路由實際閱讀時，操作區與單字表佔位不夠順手，且單字表底部目前會遮住最後的單字；同時，資料仍可能出現同 text 且同 kanji 卻散落不同 stage 的重複詞條。現在需要把 UI 閱讀流程與資料合併規則一起規格化，避免後續實作偏離既有規則。

## What Changes

- 移除操作區原本的「練習」checkbox，並在單字表表頭新增獨立的「練習」checkbox。
- 調整單字表表頭間距、單字/練習 checkbox 間距，以及單字欄位的原假名、平假名/片假名互換、空白顯示規則。
- 重新排列操作區 checkbox 為「漢字 / 全部字音 / 只顯示註記」，並設定漢字與全部字音預設勾選。
- 新增「閱讀模式 / 操作模式」切換，讓單字表可用不透明背景向上覆蓋操作區，但保留 input 與模式按鈕列。
- 修正單字表最下方單字被遮擋的問題。
- 依既有規則合併同 text 且同 kanji 但不同 stage 的詞條，並防止新增資料再次產生同類重複。

## Non-Goals

- 不改變切換路由 UI 或其他子路由排版。
- 不把只看 text 相同、但 kanji 不同的詞條納入合併條件。
- 不改變測驗流程；只要求測驗畫面的 z-index 高於本次覆蓋效果。
- 不新增遠端同步或外部資料儲存；單字資料仍由本機靜態資料檔提供。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- vocabulary-jlpt-level-filtering: 調整單字練習子路由的操作區控制項、單字表表頭顯示控制、閱讀/操作模式與底部可見性要求。
- vocabulary-meaning-pos-format: 明確要求同 text 且同 kanji 的跨 stage 重複詞條合併到最簡單 stage，並由檢查避免新增同類重複。

## Impact

- Affected specs: vocabulary-jlpt-level-filtering, vocabulary-meaning-pos-format
- Affected code:
  - Modified: src/modules/vocabulary/components/VocabularyControlBar.vue
  - Modified: src/modules/vocabulary/components/VocabularyStageTable.vue
  - Modified: src/modules/vocabulary/composables/useVocabularySession.ts
  - Modified: src/modules/vocabulary/utils/vocabularyFilters.ts
  - Modified: src/modules/vocabulary/data/jpWords_N1.ts
  - Modified: src/modules/vocabulary/data/jpWords_N2.ts
  - Modified: src/modules/vocabulary/data/jpWords_N3.ts
  - Modified: src/modules/vocabulary/data/jpWords_N4.ts
  - Modified: src/modules/vocabulary/data/jpWords_N5.ts
  - Modified: tests/component/VocabularyControlBar.spec.ts
  - Modified: tests/component/VocabularyStageTable.spec.ts
  - Modified: tests/component/VocabularyViewSmoke.spec.ts
  - Modified: tests/unit/vocabularyData.spec.ts
  - Modified: tests/unit/vocabularyMeaningFormat.spec.ts
  - Modified: tests/e2e/vocabulary-word-practice.spec.ts
  - New: none
  - Removed: none
