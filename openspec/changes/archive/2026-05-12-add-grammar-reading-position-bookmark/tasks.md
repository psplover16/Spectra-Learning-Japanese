## 1. 依賴與設定

- [x] 1.1 [P] 新增 dev 依賴 `@iconify-json/fa6-regular`，使空心書籤 icon 可透過 `~icons/fa6-regular/bookmark` 匯入；驗證 `package.json` 內出現該套件，`npm install` 成功，TypeScript 型別檢查（`npm run typecheck`）通過。

## 2. Storage 層

- [x] 2.1 [P] 在 `src/shared/config/storageKeys.ts` 新增 `grammarBookmarkStorageKey = 'duotify.grammar.bookmark'` 常數，落實 design「介面/資料形狀」段落與「Storage schema：單 key + byLevel map」decision；驗證 export 存在且值為 `'duotify.grammar.bookmark'`，可被測試 import。
- [x] 2.2 撰寫 `tests/unit/grammarBookmarkStorage.spec.ts`，涵蓋 spec「Storage schema reserves all JLPT levels」與「Storage failures degrade gracefully」（含 design「失敗模式」段落定義的 corrupt JSON 與 localStorage 不可用情境）；屬 TDD 紅階段；驗證執行 `npm run test:unit -- grammarBookmarkStorage` 因 wrapper 尚未實作而失敗。
- [x] 2.3 實作 `src/modules/grammar/storage/grammarBookmarkStorage.ts`，提供 `readGrammarBookmark` / `writeGrammarBookmark` / `clearGrammarBookmark` 三個函式，落實 design「採用 localStorage 而非 IndexedDB」與「職責分層：localStorage / Wrapper / 元件」decision；驗證 2.2 全部測試轉綠，且不引入 IndexedDB 任何 API。

## 3. CSS hit-area 鏡像

- [x] 3.1 [P] 在 `src/styles/main.css` 新增 `.n5-grammar-section-bookmark-hit-area` 樣式，鏡像既有 `.n5-grammar-section-completion-hit-area` 但改用 `left: -0.375rem`，落實 design「UI 鏡像 checkbox 而非新版面」與「Mobile-first 互動」decision（hit-area ≥ 44×44 CSS px）；驗證手動於 `npm run dev` 上開啟 N5 文法頁，section header 左側出現 44×44 可點區，hover 顯示 cursor pointer，桌機 / iPhone 模擬器 / Android 模擬器三種寬度下位置正確且不重疊既有 checkbox。

## 4. SectionCard 新增書籤按鈕

- [x] 4.1 擴充 `tests/unit/N5GrammarSectionCard.spec.ts`（如不存在則建立），涵蓋 spec「Bookmark button appears on each grammar section header」、「Bookmark button has two visual states」、「Sections in the finished zone do not render the bookmark button」；屬 TDD 紅階段；驗證執行 `npm run test:unit -- N5GrammarSectionCard` 因新斷言而失敗。
- [x] 4.2 修改 `src/modules/n5Grammar/components/N5GrammarSectionCard.vue`：新增 props（`bookmarked: boolean` 預設 `false`、`showBookmark: boolean` 預設 `true`）、emit `update:bookmarked: [bookmarked: boolean]`、書籤按鈕 DOM 與 outline / solid icon 切換（`~icons/fa6-regular/bookmark` 與 `~icons/fa6-solid/bookmark`）；既有 checkbox label、toggle button、title 結構維持不變；驗證 4.1 全部測試轉綠，且既有 SectionCard 測試（completion、toggle、展開狀態）全部仍綠。

## 5. View 整合互動

- [x] 5.1 擴充 `tests/unit/N5GrammarView.spec.ts`（如不存在則建立），涵蓋 spec「At most one bookmark per JLPT level」、「Solid bookmark can be cleared by clicking it again」、「Bookmark persists across sessions」（透過 onMounted / onActivated 模擬還原）、「Marking a bookmarked section as completed clears its bookmark」；屬 TDD 紅階段；驗證執行 `npm run test:unit -- N5GrammarView` 因尚未實作互動而失敗。
- [x] 5.2 修改 `src/modules/n5Grammar/views/N5GrammarView.vue`：在 onMounted / onActivated 讀取 `readGrammarBookmark('n5')`、點書籤呼叫 `writeGrammarBookmark` / `clearGrammarBookmark`、`updateSectionCompleted(id, true)` 時若 `id === currentBookmark` 則呼叫 `clearGrammarBookmark('n5')`（落實 design「「已學完」自動清書籤」decision），unfinished 區傳 `showBookmark=true`、finished 區傳 `showBookmark=false`；驗證 5.1 全部測試轉綠，且既有 N5GrammarView 測試（completion、區段分組、loading、error）全部仍綠。

## 6. E2E 驗證

- [x] 6.1 擴充 `tests/e2e/n5-grammar-layout.spec.ts`：新增「可觀察行為」斷言（書籤按鈕存在、位於 section 左側、點擊空心 → 變實心、再點 → 變空心、reload 後實心位置還原、finished zone 內 section 無書籤按鈕 DOM），落實 design「可觀察行為」、「驗收條件」、「範圍邊界」三段；驗證執行 `npm run test:e2e -- n5-grammar-layout` 全部通過，且既有 checkbox 位置 / 行為斷言保持綠燈，並於手機寬度視窗下亦通過（離線情境驗證：透過 Playwright `context.setOffline(true)` 模擬無網路後仍可切換書籤）。

## 7. 規格回寫與架構文件同步

- [x] 7.1 執行 `spectra verify add-grammar-reading-position-bookmark` 確認實作與 spec 無偏離；若有差異，回寫 `openspec/specs/grammar-reading-position-bookmark/spec.md` 使 spec 為「目前實作的真相」（核心原則「規格回寫」）；驗證 verify 命令無 drift / mismatch findings。
- [x] 7.2 [P] 更新 `PROJECT_ARCHITECTURE.md`「模組結構」段落，加入 `src/modules/grammar/storage/grammarBookmarkStorage.ts` 共用層說明（跨等級書籤持久化、localStorage 後端、預留 N4–N1 schema），落實核心原則「倉儲衛生」對 src/ 結構變動的同步要求；驗證該文件 grep `grammar/storage` 有命中且段落正確描述職責。
