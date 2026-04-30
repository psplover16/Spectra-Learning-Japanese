## Context

N5 文法頁由 `N5GrammarView.vue` 依資料渲染多個 `N5GrammarSectionCard.vue`。目前 section card 以整個標題按鈕切換展開，並用箭頭與標題背景色同時表示開合狀態。使用者需要把每個 section 標記為已學完，且此狀態在關閉網頁後仍保留。專案目前偏好 feature-local composable / storage 模組與 props / emits，沒有安裝 Pinia。

## Goals / Non-Goals

**Goals:**

- N5 文法 section 的開合狀態只以標題背景色表達；收合狀態使用接近白色的淺灰，展開時背景色更深，已完成狀態保留低彩度背景區分。
- 原箭頭位置改為完成 checkbox，checkbox 點擊不觸發 section 開合。
- 已完成 section 立即收合、不可展開，取消完成後不自動展開。
- 完成狀態以本機 localStorage snapshot 持久保存，重新開啟頁面仍一致。
- Section header 使用純 CSS sticky，讓目前可視 section 的標題可留在視窗頂端。
- 保持手機優先、鍵盤可用與螢幕閱讀器可理解。

**Non-Goals:**

- 不建立全站學習進度系統。
- 不引入 Pinia、伺服器同步、帳號或 analytics。
- 不抽象成跨 N 級文法共用機制。
- 不使用 IndexedDB；此功能只儲存少量 section id。
- 不使用 IntersectionObserver。

## Decisions

### LocalStorage snapshot for completed N5 grammar sections

新增 `src/modules/n5Grammar/storage/n5GrammarCompletionStorage.ts`，沿用 `storageGuard` 模式讀寫版本化 snapshot。資料 shape 為 version 1、completedSectionIds string array、updatedAt ISO string。儲存鍵集中放在 `src/shared/config/storageKeys.ts`，名稱為 `duotify.n5Grammar.completed`。

localStorage 負責少量完成旗標；IndexedDB 不參與，因為資料量小且不需要查詢索引；Pinia store 不參與，因為狀態只屬於 N5 文法頁，重新整理後以 storage 還原即可。無外部 API、無同步、無跨裝置衝突；同一瀏覽器中最後一次 checkbox 操作即為真相。

替代方案：使用 Pinia store。淘汰原因是本 repo 未安裝 Pinia，導入後會增加依賴與跨模組狀態設計，超出本功能需要。

### Parent-owned completion state in N5GrammarView

`N5GrammarView.vue` 在 mounted 後讀取 snapshot，維護 `Set<string>` 的 completed section ids，並把每個 section 的 completed 狀態傳入 `N5GrammarSectionCard.vue`。子元件只透過 `update:completed` emit 回報 checkbox 變更，不自行讀寫 storage。

父層狀態 shape：completedSectionIds 是 Set<string>，初始值為空集合；mounted 後從 storage snapshot 載入；每次完成狀態變更後寫回完整 snapshot。

替代方案：由每個 section card 自行讀寫 storage。淘汰原因是多個子元件會分散 storage 寫入責任，測試與狀態同步更難維護。

### Checkbox-controlled completion lock in N5GrammarSectionCard

`N5GrammarSectionCard.vue` 的 header 拆成 checkbox 與標題 toggle button。checkbox 放在原箭頭位置，使用 click stop 阻止事件冒泡；點 checkbox 不得觸發 expand/collapse。當 completed 從 false 變 true 時，若 section 已展開，子元件立即收合；當 completed 為 true 時，標題 toggle 不得展開內容。當 completed 從 true 變 false 時，不自動展開。

標題 button 保留 aria-expanded 與 aria-controls；completed 為 true 時加 aria-disabled true。Checkbox 使用包含 section title 的 aria-label，例如「標記 核心詞類用法總覽 為已學完」。焦點順序為 checkbox 先、標題 toggle 後。

替代方案：保留整片 header 都可點並在 checkbox 上判斷 target。淘汰原因是互動責任不清，容易讓 checkbox 點擊誤觸開合。

### Background-only expansion indicator and completed styling

移除 `.n5-grammar-section-toggle-icon` 與箭頭文案。Header 關閉時使用接近白色的淺灰背景，避免未展開容器看起來過重；展開時加 expanded 修飾 class，背景比關閉更深；completed 時加 completed 修飾 class，呈現低彩度與不可展開狀態。顏色使用既有 Tailwind / CSS token，不新增大範圍主題。

替代方案：使用另一個 icon 表示完成後鎖定。淘汰原因是需求明確要求開合狀態只留背景色，完成狀態已由 checkbox 表達。

### CSS sticky section headers

在 `.n5-grammar-section-header` 套用 position sticky、top 0、z-index 1，header 背景保持不透明。每個 header 限定在自己的 section 範圍內 sticky；多個 section 展開時，瀏覽器原生 sticky 行為讓目前可視 section 的 header 接手。

替代方案：使用 IntersectionObserver 管理目前 active header。淘汰原因是需求可由 CSS 原生 sticky 完成，JS 方案較複雜且增加滾動效能風險。

### Test-first verification for completion behavior

依 `.spectra.yaml` 的 TDD 設定，先補 storage unit test、section component test、N5GrammarView integration test，再實作。E2E 擴充 `tests/e2e/n5-grammar-layout.spec.ts` 驗證持久化與 sticky header。`PROJECT_ARCHITECTURE.md` 需因新增 storage 與測試責任同步更新。

替代方案：只做手動驗證。淘汰原因是此功能包含持久化與互動鎖定，沒有自動測試容易回歸。

## Risks / Trade-offs

- [Risk] localStorage 被清空或資料格式損壞會遺失完成註記。→ Mitigation: storage validator 清除無效資料並回到空集合，畫面保持可用。
- [Risk] completed 狀態讓 section 不可展開，使用者想複習時需要先取消勾選。→ Mitigation: checkbox 保持可見且可取消，這符合本功能定義的「已完成即鎖定」。
- [Risk] sticky header 在 iOS Safari 若遇到父層 overflow 或 transform 可能失效。→ Mitigation: 優先檢查現有父層樣式；E2E 覆蓋窄版滾動。
- [Risk] header 深色背景若對比不足會影響可讀性。→ Mitigation: component test 檢查 class，E2E 或手動檢查確認展開 header 文案仍可讀。

## Migration Plan

1. 新增 storage key 與 N5 grammar completion storage 模組。
2. 先寫 storage、component、view 與 e2e 測試，使目前行為失敗。
3. 更新 `N5GrammarSectionCard.vue`、`N5GrammarView.vue` 與 CSS。
4. 更新 `PROJECT_ARCHITECTURE.md`。
5. 執行 lint、typecheck、unit test、build 與 N5 grammar 相關 e2e。

Rollback 策略：移除新增 storage 模組與 tests，還原 section card、view、CSS 與 storage key。既有 localStorage key 留在瀏覽器中不會影響舊版 UI，因為舊版不讀取該 key。

## Open Questions

無。本提案已依 `_private/propose.md` 的拍板決策固定互動、儲存鍵、ARIA 與 sticky 行為。
