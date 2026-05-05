## Summary

單字測驗後續調整要修正目前回饋指出的版面、提示、註記持久化與排序語意，避免剛完成的流程留下會誤導或破壞既有註記的行為。

## Motivation

使用者已確認單字表應依 N5 到 N1 排序，且「儲存註記」與 header 清除都只能影響目前頁面可見單字。現在處理可避免 hidden localStorage 註記被搜尋、stage 篩選或練習模式意外清掉。

## Proposed Solution

- 調整單字測驗 modal：題目與答案間距為 0.5rem，多行答案容器使用 flex 並水平、垂直置中，且不影響字母練習 modal 預設版面。
- 移除「尚未儲存」或同等語意提示；單字測驗結算後只更新 draft marks，不顯示該提示。
- 將儲存註記改成以目前頁面可見單字為範圍合併 localStorage：可見且勾選則保存，可見且未勾選則移除，不可見項目保留。
- 將 table header 最右側清除 checkbox 改成只清除目前頁面可見單字；若保留確認視窗，文字不得宣稱清除全部註記。
- 將單字表預設 stage 排序改為 N5、N4、N3、N2、N1。

## Non-Goals

- 不重新設計字母練習測驗 modal。
- 不新增未儲存提示的替代 UI。
- 不讓單字測驗自動寫入 localStorage。
- 不改 localStorage schema，除非現有 schema 無法支援可見範圍合併。

## Alternatives Considered

- 保留整份 localStorage 覆蓋式儲存：拒絕，因為會刪除目前不可見但已保存的註記。
- 保留清除全部註記：拒絕，因為 header 操作應遵守目前頁面可見範圍。

## Capabilities

### New Capabilities

- vocabulary-quiz: 定義單字測驗 modal 後續呈現調整，以及結算後不得顯示未儲存提示的行為。

### Modified Capabilities

- vocabulary-mark-persistence: 新增儲存與 header 清除都只影響目前頁面可見單字的持久化語意。
- vocabulary-jlpt-level-filtering: 新增單字表依 N5、N4、N3、N2、N1 顯示的排序語意。

## Impact

- Affected specs: vocabulary-quiz, vocabulary-mark-persistence, vocabulary-jlpt-level-filtering
- Affected code:
  - Modified: src/modules/exam/components/ExamModal.vue, src/modules/vocabulary/components/VocabularyControlBar.vue, src/modules/vocabulary/components/VocabularyStageTable.vue, src/modules/vocabulary/composables/useVocabularySession.ts, src/modules/vocabulary/types/vocabulary.ts, src/modules/vocabulary/views/VocabularyView.vue, src/styles/main.css, tests/component/ExamModal.spec.ts, tests/component/VocabularyControlBar.spec.ts, tests/component/VocabularyStageTable.spec.ts, tests/component/VocabularyViewSmoke.spec.ts, tests/component/useVocabularySession.spec.ts, tests/e2e/vocabulary-word-practice.spec.ts, tests/unit/vocabularyData.spec.ts, PROJECT_ARCHITECTURE.md
  - New: none
  - Removed: none
