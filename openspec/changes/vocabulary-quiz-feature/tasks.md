## 1. 字典規則與資料整理

- [x] [P] 1.1 新增 `tests/unit/vocabularyMeaningFormat.spec.ts` 測試，覆蓋 `Vocabulary kanji lines align with meaning lines`、`New vocabulary senses are appended without violating kanji ordering`，以及 `Vocabulary meaning format is automatically checked` 的失敗與成功案例；完成定義：測試先能表達 kanji-bearing 在前、kanji-less tail placeholder、`から` final no-kanji、`あげる` repeated kanji 的預期。
- [x] 1.2 更新 `scripts/vocabulary/checkVocabularyMeaningFormat.mjs` 與 `scripts/vocabulary/checkVocabularyMeaningFormat.d.mts`，落實 `先規則化字典再建立單字測驗`，讓 checker 偵測 kanji-less 順序、必要 placeholder、未整併同 text+kanji 重複；完成定義：1.1 測試轉綠，且 checker 對現有資料仍能列出待修問題。
- [x] 1.3 整併單字資料中同 text+kanji 的重複單字，實作 `Vocabulary duplicate senses are consolidated before quiz use` 與 `Duplicate entries use the simplest JLPT stage`，並新增 N5 `から`；完成定義：`あげる` 合併到最簡單 stage、`から` 有三個 meaning sense，checker 回報 0 violation。

## 2. Stage 分檔與 lazy import

- [x] 2.1 依 `用 stage 分檔與 lazy import 取代單一 jpWords 入口` 建立 `src/modules/vocabulary/data/jpWords_N1.ts` 到 `jpWords_N5.ts`，落實 `Vocabulary data is split by JLPT level files`；完成定義：每檔 default export raw entries，且每筆 entry 的 stage 與檔名相符。
- [x] 2.2 改寫 `src/modules/vocabulary/composables/useVocabularySession.ts`、`src/modules/vocabulary/utils/vocabularyFilters.ts` 與相關 types，實作 `JLPT stage data loads lazily`、`JLPT level filter controls`、`Efficient visible vocabulary derivation`；完成定義：session 暴露 loaded/loading/error state，selected level 變更後只透過單一 visible entries path 產生表格資料。
- [x] [P] 2.3 更新 `tests/unit/vocabularyData.spec.ts`、`tests/unit/vocabularyFilters.spec.ts`、`tests/component/useVocabularySession.spec.ts`，驗證 stage 分檔、lazy loading、載入失敗、取消勾選已載入 stage 不會顯示 stale entries；完成定義：相關測試通過且沒有 console error。

## 3. 單字測驗 session 與展題結算

- [x] [P] 3.1 新增 `src/modules/vocabulary/composables/useVocabularyExamSession.ts` 與必要 quiz 題卡型別，依 `單字測驗使用獨立 session 並只回寫 draftMarkedKeys` 實作 `Vocabulary quiz starts from visible marked vocabulary`；完成定義：start 只收 visible 且 draft/persisted 任一勾選的 entries，並在開始時建立 snapshot。
- [x] 3.2 在 `useVocabularyExamSession` 實作 `展題以 text 與單行 kanji 分組` 與 `Vocabulary quiz expands multi-sense entries into grouped questions`；完成定義：`から` 產生三題、`あげる／上げる` 產生一題多行答案，展開後全題洗牌。
- [x] 3.3 在 `useVocabularyExamSession` 實作 `Vocabulary quiz settlement updates draft marks only`；完成定義：全 next 才移除 draft mark、任一 unknown 保留、未答保留原狀，且不呼叫 saveMarks、不寫 persisted marks、不寫 alphabet latest unknown storage。
- [x] [P] 3.4 新增 `tests/unit/useVocabularyExamSession.spec.ts`，驗證 start source、multi-sense grouping、shuffle 邊界、settlement 四種狀態與 alphabet unknown storage 隔離；完成定義：測試覆蓋空題庫、單義、多義、同題幹合併、中途關閉。

## 4. UI 串接與回歸保護

- [x] 4.1 修改 `src/modules/exam/components/ExamModal.vue` 與 `src/modules/exam/types/exam.ts`，依 `ExamModal 只增加可配置呈現能力` 實作 `Vocabulary quiz modal preserves alphabet quiz behavior`；完成定義：新增 prompt size、hint visibility、多行答案 wrapping 的可選 props，預設值維持字母測驗現況。
- [x] 4.2 修改 `src/modules/vocabulary/components/VocabularyControlBar.vue` 與 `src/modules/vocabulary/views/VocabularyView.vue`，加入「開始測驗」按鈕、disabled 規則、測驗 modal 串接與結算後未儲存提醒；完成定義：按鈕位於「儲存註記」左側，間距符合 checkbox 群，無可見勾選或 loading/error 時 disabled。
- [x] [P] 4.3 更新 `tests/component/ExamModal.spec.ts`、`tests/component/VocabularyControlBar.spec.ts`、`tests/component/VocabularyViewSmoke.spec.ts` 與 `tests/e2e/vocabulary-word-practice.spec.ts`；完成定義：字母測驗預設 UI 回歸通過，單字測驗可在手機寬度與離線情境開啟、答題、關閉並保留 draft 結算。

## 5. 文件、架構與驗證

- [x] 5.1 更新 `PROJECT_ARCHITECTURE.md`，記錄 vocabulary data 分檔、lazy import、`useVocabularyExamSession` 與 ExamModal 可配置 props；完成定義：架構文件與實作檔案結構一致。
- [x] 5.2 執行驗證命令：`node scripts/vocabulary/checkVocabularyMeaningFormat.mjs`、`npm run test:unit -- tests/unit/vocabularyMeaningFormat.spec.ts tests/unit/vocabularyData.spec.ts tests/unit/vocabularyFilters.spec.ts tests/unit/useVocabularyExamSession.spec.ts`、相關 component/e2e 測試與 `npm run build`；完成定義：命令通過，或把任何環境限制與失敗原因記錄在實作回報。
- [x] 5.3 手動驗證單字練習離線情境；完成定義：在瀏覽器 devtools offline 模式重新載入已快取 PWA，確認 stage 切換、可見勾選題庫、`から`/`あげる` 答案顯示、結算只改 draft、按「儲存註記」後才持久化。
