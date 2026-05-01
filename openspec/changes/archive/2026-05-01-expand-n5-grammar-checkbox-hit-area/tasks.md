## 1. 測試先行

- [x] [P] 1.1 更新 `tests/component/N5GrammarSections.spec.ts`，新增或調整 spec「Checkbox hit area MUST be expanded without visual redesign」的失敗測試；測試 wrapper 能放大 checkbox hit area，且 input 視覺樣式維持不變。若現有測試無法量測 hit area，至少應確認 checkbox input 既有 class 維持不變，並讓 wrapper 具備專用可查詢標記或 role 以覆蓋 hit area 行為。（對應 design「以 wrapper 放大 checkbox hit area 並保留 input 視覺尺寸」）
- [x] [P] 1.2 更新 `tests/component/N5GrammarSections.spec.ts`，新增或調整 spec「Checkbox hit area MUST NOT toggle section expansion」與「Section expand control MUST NOT toggle checkbox state」的失敗測試；覆蓋 checkbox hit area 不改變 `aria-expanded`，以及展開/收合按鈕不切換 checkbox。（對應 design「保持展開控制與 checkbox 事件邊界分離」）

## 2. Hit Area 實作

- [x] 2.1 更新 `src/modules/n5Grammar/components/N5GrammarSectionCard.vue`，依 design 以 wrapper 或 label 放大 checkbox hit area，但保留 input 原本的 checkbox 視覺尺寸與樣式；component 需提供穩定的 hit area 查詢方式，讓測試能區分 hit area 與 checkbox input。
- [x] 2.2 更新 `src/modules/n5Grammar/components/N5GrammarSectionCard.vue` 的 checkbox 事件邊界；確保 checkbox input 與 checkbox hit area click / touch 不會觸發展開/收合，展開/收合控制也不會切換 checkbox。執行 `npx vitest run tests/component/N5GrammarSections.spec.ts`。

## 3. 文件與驗證

- [x] [P] 3.1 更新 `PROJECT_ARCHITECTURE.md`，補充 N5 文法 section checkbox 使用放大 hit area，但 checkbox 視覺樣式與 checkbox 學習狀態語意維持不變。
- [x] 3.2 執行完整驗證：`npm run lint`、`npm run typecheck`、`npm run test:unit`、`npm run build`、`spectra validate expand-n5-grammar-checkbox-hit-area`。若 `test:unit` 出現既有 jsdom CSS parse stderr，需記錄為既有非阻斷訊息。
- [x] 3.3 以手機寬度或實機模擬驗證 N5 文法 checkbox hit area：點擊 checkbox 周圍可切換學習狀態，且不會展開/收合；點擊展開/收合控制不會切換 checkbox。將結果記錄於最終回覆或 PR description。（對應 design「以手機互動測試保護行為」）
