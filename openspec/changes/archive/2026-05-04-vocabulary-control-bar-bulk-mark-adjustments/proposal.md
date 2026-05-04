## Summary

使用者要修正單字練習控制列與 table header checkbox 的實際操作語意，讓 JLPT 篩選、開始測驗與批次勾選更符合目前頁面可見範圍。

## Motivation

目前 JLPT row 有多餘的全部勾選控制，開始測驗按鈕位置與隱藏條件不符合使用者期待，table header 最右側 checkbox 仍帶有刪除 localStorage 的語意。現在調整可降低誤操作風險，並讓批次操作只影響目前可見 draft marks；localStorage 仍只由儲存註記負責，無同步或衝突處理需求。

## Proposed Solution

- 下方包含練習、只顯示註記與儲存註記的 action row 使用與 JLPT level row 一致的背景色、外框、圓角與 padding，讓兩行在視覺上屬於同一組控制區塊。
- 移除 JLPT level 的全部勾選 checkbox，只保留 N1、N2、N3、N4、N5 individual checkboxes。
- 將開始測驗按鈕搬到 JLPT checkbox row 右側，該 row 與下方 action row 都採左側 checkbox 群、右側 button 的排版。
- 下方包含練習、只顯示註記與儲存註記的 action row padding 與 JLPT level row 保持一致，讓兩行 row 的內容起點對齊。
- 當 table 沒有可見單字時，開始測驗按鈕像儲存註記按鈕一樣隱藏；有可見單字但沒有可測驗已勾選單字時則顯示 disabled。
- 將 table header 最右側 checkbox 改成目前可見單字的 draft mark 全選/全不選控制，不顯示刪除 alert，也不直接寫入或刪除 localStorage。
- header checkbox 狀態由目前可見 row 的 draft checkbox 推導：全部可見 row 已勾選才呈現 checked，任一可見 row 未勾選就呈現 unchecked。

## Non-Goals

- 不重新設計整個單字練習頁。
- 不改變儲存註記按鈕的持久化責任。
- 不讓 header checkbox 直接寫入或刪除 localStorage。
- 不重新引入全部勾選 checkbox。
- 不改變單字測驗出題、答題或結算流程。

## Alternatives Considered

- 保留全部勾選 checkbox：拒絕，因為使用者已明確要求移除。
- 讓 header checkbox 繼續清除 localStorage：拒絕，因為新需求要求它只控制目前可見 draft checkbox 狀態。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- vocabulary-jlpt-level-filtering: 移除 select-all level 控制，並要求 JLPT row 左側只呈現 N1-N5 checkbox。
- vocabulary-quiz: 調整 start-quiz control 的 row 位置、無可見單字時隱藏，以及 disabled 條件。
- vocabulary-mark-persistence: 將 table header checkbox 從清除持久化註記改成目前可見 draft mark 的批次勾選控制。

## Impact

- Affected specs: vocabulary-jlpt-level-filtering, vocabulary-quiz, vocabulary-mark-persistence
- Affected code:
  - Modified: src/modules/vocabulary/components/VocabularyControlBar.vue, src/modules/vocabulary/components/VocabularyStageTable.vue, src/modules/vocabulary/composables/useVocabularySession.ts, src/modules/vocabulary/views/VocabularyView.vue, src/styles/main.css, tests/component/VocabularyControlBar.spec.ts, tests/component/VocabularyStageTable.spec.ts, tests/component/VocabularyViewSmoke.spec.ts, tests/component/useVocabularySession.spec.ts, tests/e2e/vocabulary-word-practice.spec.ts, PROJECT_ARCHITECTURE.md
  - New: none
  - Removed: none
