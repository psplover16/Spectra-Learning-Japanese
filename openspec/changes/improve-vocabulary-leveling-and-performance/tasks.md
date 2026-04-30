## 1. Test-first verification

- [x] [P] 1.1 為 Vocabulary stage uses JLPT levels 與 JLPT level stage data in jpWords.ts 擴充 `tests/unit/vocabularyData.spec.ts`；完成定義：測試驗證所有 `jpWords.ts` 單字的 `stage` 皆為 N1～N5，舊 stage 值會讓測試失敗。
- [x] [P] 1.2 為 JLPT level filter controls、Select-all level synchronization、JLPT filter composes with existing vocabulary filters 與 Efficient visible vocabulary derivation 擴充 `tests/unit/vocabularyFilters.spec.ts`；完成定義：測試涵蓋 N5-only 篩選、空 level 集合、搜尋與 level 同時作用、只顯示註記與 level 同時作用，以及 visible vocabulary 由單一路徑產生。
- [x] [P] 1.3 為 Parent-owned vocabulary level filter state in useVocabularySession、Select-all level filter synchronization、Vocabulary count summary is removed、Vocabulary controls layout 與 Vocabulary control layout without count summary 擴充 `tests/component/VocabularyControlBar.spec.ts` 與 `tests/component/VocabularyViewSmoke.spec.ts`；完成定義：測試涵蓋預設全選、全部勾選連動、手動全選回復、數量統計 UI 不存在、level controls 在 action controls 上方、練習與只顯示註記靠左且儲存註記靠右。
- [x] [P] 1.4 為 Test-first vocabulary verification 擴充 `tests/e2e/vocabulary-word-practice.spec.ts`；完成定義：在 375px viewport 驗證 N1～N5 與全部勾選互動、篩選後既有搜尋/註記/長按揭露仍可用、單字數量統計 UI 不出現，並記錄離線或模擬離線時控制列仍可操作。

## 2. Data model and filtering

- [x] 2.1 實作 Vocabulary stage uses JLPT levels 與 JLPT level stage data in jpWords.ts；完成定義：`src/modules/vocabulary/types/vocabulary.ts` 定義 JLPT level 型別，`src/modules/vocabulary/data/jpWords.ts` 每筆 stage 收斂為 N1～N5，且 1.1 測試通過。
- [x] 2.2 實作 Parent-owned vocabulary level filter state in useVocabularySession 與 Select-all level filter synchronization；完成定義：`src/modules/vocabulary/composables/useVocabularySession.ts` 以 N1～N5 全選為初始狀態，提供 individual level toggle、select-all toggle 與衍生 `allJlptLevelsSelected`，且 1.3 的連動測試通過。
- [x] 2.3 實作 Efficient visible vocabulary derivation 與 JLPT filter composes with existing vocabulary filters；完成定義：`src/modules/vocabulary/utils/vocabularyFilters.ts` 與 session/view 使用單一路徑套用 normalized vocabulary、selected JLPT levels、搜尋、只顯示註記與練習模式，不重複在多個元件做 visible vocabulary 推導，且 1.2 測試通過。

## 3. Vocabulary UI

- [x] 3.1 實作 JLPT level filter controls 與 Vocabulary control layout without count summary；完成定義：`src/modules/vocabulary/components/VocabularyControlBar.vue` 顯示 N1～N5 與全部勾選，level controls 位於 action row 上方，action row 中練習與只顯示註記靠左且有 gap，儲存註記按鈕靠右。
- [x] 3.2 實作 Vocabulary count summary is removed 與 Vocabulary controls layout；完成定義：`src/modules/vocabulary/views/VocabularyView.vue` 不再渲染「XXXX 個單字」數量統計 UI，必要時停止使用或移除 `src/modules/vocabulary/components/VocabularyCountSummary.vue`，且 component/e2e 不再找到該 UI。
- [x] 3.3 保留既有單字頁互動；完成定義：搜尋、註記保存、只顯示註記、練習模式與長按揭露在 JLPT filter 加入後仍依既有測試通過。

## 4. Documentation and verification

- [x] 4.1 更新 `PROJECT_ARCHITECTURE.md`；完成定義：文件記錄 vocabulary JLPT level filter、stage 值域、控制列布局、效率改善責任與相關測試責任，且不展開 `_private/` 受限內容。
- [x] 4.2 執行完整驗證；完成定義：記錄並確認 `npm run lint`、`npm run typecheck`、`npm run test:unit`、`npm run build`、`npm run test:e2e -- tests/e2e/vocabulary-word-practice.spec.ts` 通過；若 e2e port 撞到既有 server，改用未占用的 `PLAYWRIGHT_PORT` 重跑。
- [x] 4.3 驗證手機與離線情境；完成定義：在 Playwright 或手動模擬 375px viewport 與離線狀態中確認 N1～N5/全部勾選可操作、控制列布局符合需求、既有註記與長按揭露功能不回歸。
- [x] 4.4 檢查 UTF-8 與範圍；完成定義：新增或修改的中文內容可用嚴格 UTF-8 讀回，無 replacement char、問號替代字元或可見 BOM；最終 diff 僅包含 vocabulary JLPT level filtering、控制列 UI、效能改善、測試、規格與文件相關變更。

## 5. Follow-up control spacing

- [ ] 5.1 為 Vocabulary controls layout 與 Zero vertical gap between vocabulary upper control blocks 補強 `tests/component/VocabularyControlBar.spec.ts` 或 `tests/component/VocabularyViewSmoke.spec.ts`；完成定義：測試驗證單字頁上方搜尋/全域篩選、JLPT level controls、action controls 三個垂直 block 的外層 gap 為 0，且 action controls 內部「練習」與「只顯示註記」仍保留 gap。
- [ ] 5.2 實作 Zero vertical gap between vocabulary upper control blocks；完成定義：`src/styles/main.css` 中 `.vocabulary-control-bar` 的三個上方 block 垂直間距由目前 0.5rem 改為 0，不移除 block 內部 padding、border 或 checkbox 間距，且 5.1 測試通過。
- [ ] 5.3 驗證 375px 與離線情境；完成定義：執行 `npm run lint`、`npm run typecheck`、相關 unit/component 測試，以及 `PLAYWRIGHT_PORT` 指定的 `npm run test:e2e -- tests/e2e/vocabulary-word-practice.spec.ts`，確認三個控制 block gap 為 0 後仍無水平溢出且離線控制列可操作。
