## 1. Test-first verification for completion behavior

- [ ] [P] 1.1 為 LocalStorage snapshot for completed N5 grammar sections 與 Completion persistence 新增 `tests/unit/n5GrammarCompletionStorage.spec.ts`；完成定義：測試涵蓋 version 1 snapshot 寫入讀回、invalid payload 清除、空資料回傳空集合，且目前實作尚未存在時測試會失敗。
- [ ] [P] 1.2 為 Checkbox-controlled completion lock in N5GrammarSectionCard、Section completion checkbox、Completion checkbox does not toggle expansion、Completed sections are locked closed、Expansion state uses header background only、Accessible section completion controls 擴充 `tests/component/N5GrammarSections.spec.ts`；完成定義：測試涵蓋 checkbox 不冒泡、勾選後立即收合、completed 時標題無法展開、取消勾選不自動展開、背景 class 切換、ARIA label 與 disabled state。
- [ ] [P] 1.3 為 CSS sticky section headers 與 Sticky section headers 擴充 `tests/e2e/n5-grammar-layout.spec.ts`；完成定義：測試在窄版 viewport 展開至少兩個 section，滾動時目前 section header 黏在頂端，進入下一個 section 後由下一個 header 接手。

## 2. Storage and parent state

- [ ] 2.1 實作 LocalStorage snapshot for completed N5 grammar sections；完成定義：新增 `src/modules/n5Grammar/storage/n5GrammarCompletionStorage.ts`，在 `src/shared/config/storageKeys.ts` 新增 `duotify.n5Grammar.completed` key，並讓 1.1 的 storage tests 通過。
- [ ] 2.2 實作 Parent-owned completion state in N5GrammarView 與 Completion persistence；完成定義：`src/modules/n5Grammar/views/N5GrammarView.vue` 在 mounted 後讀取完成 snapshot，以 `Set<string>` 維護 completedSectionIds，透過 props / emits 串接 section card，狀態變更後寫回 storage，且刷新後已完成 section 保持勾選與鎖定。

## 3. Section UI and styling

- [ ] 3.1 實作 Checkbox-controlled completion lock in N5GrammarSectionCard、Section completion checkbox、Completion checkbox does not toggle expansion、Completed sections are locked closed、Accessible section completion controls；完成定義：`src/modules/n5Grammar/components/N5GrammarSectionCard.vue` 移除箭頭 UI，加入 checkbox、獨立 title toggle、click stop、完成後收合鎖定、取消完成不自動展開、aria-expanded、aria-controls、aria-disabled 與包含 section title 的 checkbox aria-label。
- [ ] 3.2 實作 Background-only expansion indicator and completed styling、Expansion state uses header background only；完成定義：`src/styles/main.css` 移除不再使用的 arrow icon 依賴，新增 collapsed / expanded / completed header class，展開背景比關閉更深，completed 狀態低彩度且可讀。
- [ ] 3.3 實作 CSS sticky section headers 與 Sticky section headers；完成定義：`.n5-grammar-section-header` 使用 `position: sticky`、`top: 0`、`z-index: 1` 與不透明背景，且不引入 IntersectionObserver。

## 4. Documentation and verification

- [ ] 4.1 更新 `PROJECT_ARCHITECTURE.md`；完成定義：文件列出 N5 grammar completion storage、相關測試責任與 section completion UI 行為，且不展開 `_private/` 受限內容。
- [ ] 4.2 執行完整驗證；完成定義：記錄並確認 `npm run lint`、`npm run typecheck`、`npm run test:unit`、`npm run build`、`npm run test:e2e -- tests/e2e/n5-grammar-layout.spec.ts` 通過；若 e2e port 撞到既有 server，改用未占用的 `PLAYWRIGHT_PORT` 重跑。
- [ ] 4.3 驗證手機與離線情境；完成定義：在 Playwright 或手動模擬窄版 viewport 中確認 checkbox 狀態刷新後保留、completed section 離線仍鎖定收合、sticky header 在 N5 文法長頁面滾動時正常。
- [ ] 4.4 檢查 UTF-8 與範圍；完成定義：新增或修改的中文內容可用嚴格 UTF-8 讀回，無 replacement char、問號替代字元或可見 BOM；最終 diff 僅包含 N5 grammar section completion 相關程式、測試、樣式、規格與文件。
