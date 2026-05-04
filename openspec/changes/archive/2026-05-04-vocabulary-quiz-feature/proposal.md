## Why

使用者想在「單字練習」加入測驗，但目前字典存在跨 stage 重複、多義詞行列規則不一致、以及整份 jpWords 一次載入的限制。現在先把字典規則與 stage 載入方式定清楚，才能讓測驗題目、答案與結算不失真。

## What Changes

- 新增單字測驗能力：可從畫面可見且已勾選的單字建立 snapshot 題庫，依多義詞規則出題、顯示答案並結算回畫面勾選狀態。
- 修改多義單字資料規則：新增 N5 から，定義有漢字義項在前、無漢字義項在後、同 kanji 可重複對應不同 meaning 的格式。
- 修改 JLPT stage 資料組織：整併跨 stage 重複詞條，將 jpWords.ts 拆為 N1 到 N5 五份並移除原 all-in-one 檔案，由 stage checkbox lazy import。
- 單字測驗結算只更新 draftMarkedKeys；儲存仍須由使用者按「儲存註記」才寫入 localStorage。

## Non-Goals

- 不改動字母練習測驗既有流程與 localStorage 結算結果。
- 不新增伺服器同步、帳號系統或遠端 JLPT 查詢。
- 不把單字測驗結果自動持久化。

## Capabilities

### New Capabilities

- vocabulary-quiz: 單字練習可依可見勾選單字產生測驗題庫、顯示多義答案並結算 draft 勾選狀態。

### Modified Capabilities

- vocabulary-meaning-pos-format: 補強多義單字、同 kanji 多義與無漢字義項排序規則。
- vocabulary-jlpt-level-filtering: stage checkbox 對應 N1 到 N5 分檔資料並支援 lazy import 載入狀態。

## Impact

- Affected specs: vocabulary-quiz, vocabulary-meaning-pos-format, vocabulary-jlpt-level-filtering
- Affected code:
  - New: src/modules/vocabulary/data/jpWords_N1.ts, src/modules/vocabulary/data/jpWords_N2.ts, src/modules/vocabulary/data/jpWords_N3.ts, src/modules/vocabulary/data/jpWords_N4.ts, src/modules/vocabulary/data/jpWords_N5.ts, src/modules/vocabulary/composables/useVocabularyExamSession.ts
  - Modified: src/modules/vocabulary/composables/useVocabularySession.ts, src/modules/vocabulary/components/VocabularyControlBar.vue, src/modules/vocabulary/components/VocabularyStageTable.vue, src/modules/vocabulary/views/VocabularyView.vue, src/modules/exam/components/ExamModal.vue, src/modules/exam/types/exam.ts, scripts/vocabulary/checkVocabularyMeaningFormat.mjs, PROJECT_ARCHITECTURE.md
  - Removed: src/modules/vocabulary/data/jpWords.ts
