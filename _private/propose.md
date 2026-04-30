# 討論結論：add-n5-grammar-section-completion

> 本檔由 `/spectra-discuss` 產出，作為 `/spectra-propose` 的輸入草稿。確認結論無誤後即可進入提案階段。

---

## 1. 來源與目的

**來源檔案**：`_private/discuss.txt`

**核心需求**（摘錄）：
- 子路由「N5 文法」目前每個容器有 ▼/▲ 圖示與標題背景色雙重指示開合狀態。
- 改動目標：
  1. 拿掉 ▼/▲ 圖示，只用「標題背景色」表示開合，**打開時背景色更深**。
  2. 將原本 ▼ 的位置換成 checkbox。點 checkbox **不會**觸發容器開合。
  3. checkbox 勾選 → 容器**無法打開**；若已打開則自動收合。
  4. checkbox 狀態需在重新開啟網頁後保留（持久化）。
- 用途：作為「這條文法已學完」的標註。

---

## 2. 程式碼偵察結果

| 元素 | 位置 | 現況觀察 |
| --- | --- | --- |
| 容器元件 | `src/modules/n5Grammar/components/N5GrammarSectionCard.vue` | 整顆 `<button>` 既是標題又是 toggle，含 ▼/▲ icon span；`expanded` 是局部 ref。 |
| 父頁面 | `src/modules/n5Grammar/views/N5GrammarView.vue` | 純配置式，無狀態管理；以 `defaultExpandedSectionIds` 初始化開合預設。 |
| 預設配置 | `src/modules/n5Grammar/config/viewPreferences.ts` | 目前只匯出空陣列 `defaultExpandedSectionIds`。 |
| 樣式 | `src/styles/main.css:426-457` | header `bg-neutral-100`、toggle hover `bg-neutral-200`、body `bg-white`。 |
| 持久化範本 | `src/modules/vocabulary/storage/vocabularyMarksStorage.ts` | 版本化 snapshot：`{ version: 1, markedIds: number[], updatedAt: string }`，搭配 `storageGuard`。 |
| 儲存鍵集中管理 | `src/shared/config/storageKeys.ts` | 命名前綴慣例 `duotify.<scope>.<feature>`，`vocabularyMarksStorageKey` 為例外。 |
| 狀態管理慣例 | 全專案 | **沒有 Pinia**；偏好「函式式 storage 模組 + props/emit」。 |

---

## 3. 假設與決策

以下假設均已參考實際程式碼。每項註明「證據」與「若假設錯誤的後果」。

### A. 持久化採既有 `storageGuard` snapshot 模式
- **作法**：新建 `src/modules/n5Grammar/storage/n5GrammarCompletionStorage.ts`，schema：
  ```ts
  { version: 1, completedSectionIds: string[], updatedAt: string }
  ```
  並在 `src/shared/config/storageKeys.ts` 新增 `n5GrammarCompletionStorageKey = 'duotify.n5Grammar.completed'`。
- **證據**：[vocabularyMarksStorage.ts](../src/modules/vocabulary/storage/vocabularyMarksStorage.ts)；[storageKeys.ts](../src/shared/config/storageKeys.ts)。
- **若錯**：另起爐灶會分裂儲存慣例，未來測試與快取清理難一致。
- **TDD 對應測試**：`tests/unit/n5GrammarCompletionStorage.spec.ts`（仿 `vocabularyMarksStorage.spec.ts`）。

### B. 狀態提升至父層 `N5GrammarView.vue`，不引入 Pinia
- **作法**：父層維護 `Set<string>` 的「已完成」集合，於 `onMounted` 讀取 snapshot、變更時 `writeJsonStorage`。透過 props 將該 section 是否已完成傳入 `N5GrammarSectionCard`，子元件以 `emit('update:completed', value)` 回報。
- **證據**：全專案無 Pinia 痕跡；現存模組統一用 props/emit + 函式式 storage。
- **若錯**：若未來 N4／N3／單字也要相同功能，應改成 composable（`useGrammarCompletion`）。本變更先以最小可行設計處理，避免過度抽象。

### C. `N5GrammarSectionCard.vue` 結構重整
拆解原本「整片可點」的按鈕，改為三區：
```
┌─────────────────────────────────────────────┐
│ [checkbox]   標題（可點 → 切換開合）         │  ← header, 背景色隨開合改變
├─────────────────────────────────────────────┤
│ body（v-show="expanded && !completed"）     │
└─────────────────────────────────────────────┘
```
- checkbox 用 `@click.stop` 阻擋冒泡，確保不觸發 toggle。
- 標題改為一顆獨立 `<button>`（仍具 `aria-expanded`、`aria-controls`），不再內含 icon。
- 移除 `n5-grammar-section-toggle-icon` span。
- **若錯**：若視障/鍵盤可訪問性測試未通過（例如點 checkbox 時 focus 跳走），需在 checkbox 上額外設 `aria-label="標記為已學完"`。本提案已涵蓋。

### D. 開合狀態的視覺呈現
- 關閉：`.n5-grammar-section-header` 維持 `bg-neutral-100`。
- 打開：新增 `.is-expanded` 修飾類，套用 `bg-neutral-300`（或對應 design token）。
- 已完成：在標題與背景套用降彩度／淡化效果（建議 `text-ink/60`、`bg-neutral-50`），讓使用者一眼看出此 section 已完成且強制收合。
- **若錯**：若色彩對比不足（WCAG），需改用更明確的 token；提案會把「實際色階以 design token 為準」列為實作確認項。

### E. 互動規則細節
| 動作 | 結果 |
| --- | --- |
| 點 checkbox（從未勾 → 勾） | 寫入 storage；若 `expanded === true` → 立即設為 `false` |
| 點 checkbox（已勾 → 取消勾） | 從 storage 移除；**不**自動展開 |
| 點標題 | 切換 `expanded`，但若 `completed === true` 則忽略點擊（`disabled` 或 `aria-disabled="true"`） |
| 重新開啟頁面 | `onMounted` 讀回 snapshot，已完成的 section 一律收合 |

- **若錯**：若使用者期待「取消勾後自動展開」，需調整。本提案採「最小驚訝」原則：取消標記不自動改變開合。

### G. Sticky 容器標題：純 CSS `position: sticky`，無需 JS
- **作法**：在 `.n5-grammar-section-header` 加上 `position: sticky; top: 0; z-index: 1;`，header 整塊（含 checkbox 與標題）一起黏。
- **多容器同時打開的行為**：`position: sticky` 天然實現「只有當前可視容器的標題黏在最上」 — 每個 header 在自己 `<section>` 範圍內 sticky，當該 section 整段滾出畫面時，下一個 section 的 header 自然接手。**不需要** IntersectionObserver。
- **背景不透明**：header 已用實心 `bg-neutral-100` / `bg-neutral-300`（開啟時更深），無透明度問題；body 內容滾過時不會穿透。
- **無上方偏移**：經確認 `RouteTabs` 目前未 sticky，因此 `top: 0` 即可，不必預留偏移量。
- **z-index**：`z-index: 1` 確保 header 蓋過 body；若日後 body 內出現自訂 z-index 元素，需重新評估。
- **證據**：[N5GrammarSectionCard.vue](../src/modules/n5Grammar/components/N5GrammarSectionCard.vue)（每個 section 是獨立 `<section>` 元素，符合 sticky 適用結構）；[main.css:430](../src/styles/main.css#L430)（既有 header 樣式可擴充）。
- **若錯**：若實測發現 sticky 在 iOS Safari 有橫向滾動或 transform 父容器導致失效，需加 `-webkit-sticky` 前綴或檢查 `.n5-grammar-view` 父層是否有 `overflow` / `transform` 屬性。
- **TDD 對應測試**：CSS sticky 行為較難用單元測試覆蓋；改以 e2e 測試（`tests/e2e/n5-grammar-layout.spec.ts`）驗證滾動時 header 仍可見、且當前 sticky 的 header 對應到目前可視 section。

### F. 測試策略（對應 `.spectra.yaml` 的 `tdd: true`）
1. **Storage 單元測試**：版本驗證、無效資料清除、寫入後讀回一致。
2. **元件測試**（vitest + Vue Test Utils）：
   - 勾選 checkbox 不觸發 toggle（事件不冒泡）。
   - 勾選後容器收合；取消勾選後容器**不**自動展開。
   - 已完成狀態下點標題無反應。
   - 標題背景色 class 隨 `expanded` 切換。
3. **整合測試**：擴充 `tests/component/N5GrammarSections.spec.ts`，驗證父層與儲存的整合。
4. **e2e 持久化驗證**：擴充 `tests/e2e/n5-grammar-layout.spec.ts`，模擬刷新後 checkbox 狀態仍存。

---

## 4. 設計選擇（已拍板）

以下三項決策由 gary_lin 於 2026-04-30 拍板，全數採用討論時的建議方案：

### 4.1 已完成的 section 不可手動展開
- **決定**：勾選 checkbox 後，標題 toggle 失效（`aria-disabled="true"`），點擊無反應，且若已展開則立即收合。要再看內容必須先取消勾選。
- **理由**：符合 `discuss.txt` 字面語意「checkbox 被勾選時 container 無法打開」；以「已完成 = 視覺與互動都鎖定」傳達明確的學習進度狀態。
- **若需複習**：使用者需明確取消勾選 → 解鎖 → 展開 → 再次勾選；此摩擦是設計上的有意為之。

### 4.2 儲存鍵命名：`duotify.n5Grammar.completed`
- **決定**：採用 `duotify.n5Grammar.completed`，登錄於 `src/shared/config/storageKeys.ts` 為 `n5GrammarCompletionStorageKey`。
- **理由**：與 `pwaDeferredUpdateStorageKey`、`latestUnknownResultsStorageKey` 等慣例一致。`vocabularyMarksStorageKey` 為早期例外，未來可另案改名向此慣例靠攏，本變更不處理。

### 4.3 ARIA 行為：完整加上輔助標籤
- **決定**：
  - 標題 `<button>` 維持 `aria-expanded="<true|false>"`；當 `completed === true` 時加 `aria-disabled="true"`。
  - checkbox 加上 `aria-label="標記 {section.title} 為已學完"`（label 含 section 標題以利語音輔助辨識）。
  - 焦點順序：checkbox 在前、標題 toggle 在後（與視覺順序一致）。
- **理由**：強化可訪問性，為視障與鍵盤使用者提供等同的互動可達性。

### 4.4 Sticky 容器標題
- **決定**：
  - `.n5-grammar-section-header`（含 checkbox 與標題）整塊使用 `position: sticky; top: 0; z-index: 1;`。
  - 多容器同時打開時，**只有當前可視容器的標題黏在最上**（`position: sticky` 原生行為，不引入 IntersectionObserver）。
  - sticky header 背景**保持不透明**，沿用既有的 `bg-neutral-100`（關閉）／`bg-neutral-300`（打開）色階。
  - `top: 0` 直接黏到視窗頂端（已確認 `RouteTabs` 未 sticky，無需偏移）。
- **理由**：純 CSS 解最簡單、效能最好，且原生 sticky 行為剛好對應使用者要的「目前可視容器標題在頂」。
- **驗證**：以 e2e 測試模擬長頁面滾動，斷言當 section A 在可視範圍時，A 的 header 出現在頁面頂端；滾過 A、進入 B 後，B 的 header 接手。

---

## 5. 預估影響範圍

| 類別 | 內容 |
| --- | --- |
| 新增檔案 | `src/modules/n5Grammar/storage/n5GrammarCompletionStorage.ts`、`src/modules/n5Grammar/types/n5GrammarCompletion.ts`（如需要）、上述測試檔。 |
| 修改檔案 | `src/modules/n5Grammar/components/N5GrammarSectionCard.vue`、`src/modules/n5Grammar/views/N5GrammarView.vue`、`src/shared/config/storageKeys.ts`、`src/styles/main.css`、相關現有測試檔。 |
| 移除元素 | 模板中的 `.n5-grammar-section-toggle-icon` 與 `▲/▼` 字元；對應 CSS class（必要時保留以避免破壞他處引用）。 |
| CSS 新增 | `.n5-grammar-section-header` 套 `position: sticky; top: 0; z-index: 1;`；新增 `.is-expanded` 修飾類控制深色背景；新增 `.is-completed` 修飾類控制淡化效果。 |
| 對既有測試影響 | `tests/component/N5GrammarSections.spec.ts`、`tests/e2e/n5-grammar-layout.spec.ts` 需更新對 ▼/▲ 的斷言；e2e 額外新增 sticky header 滾動測試。 |

---

## 6. 結論

**Decision**：以最小範圍變更達成需求 — 新增單一 storage 模組、調整單一 section 元件結構、提升狀態到父層、用背景色強化開合視覺、以純 CSS `position: sticky` 實現容器標題吸頂。**不引入** Pinia、跨模組全域狀態或 IntersectionObserver，保持與現有架構一致。

**Rationale**：把「已學完」做成 N5 模組的 local feature（簡單、易維護）而非全等級通用機制（彈性但現在用不到），符合 YAGNI；同時沿用 `storageGuard + storageKeys` 慣例可一致管理快取與測試假資料。

**Capture to**：本檔即為 discussion summary，可直接餵入 `/spectra-propose add-n5-grammar-section-completion`。

**下一步**：
- 第 4 節三項設計選擇已拍板，可直接執行 `/spectra-propose add-n5-grammar-section-completion`，將本檔內容作為輸入。
- 預期 propose 產出 `proposal.md`、`design.md`、`tasks.md`，並建立新規格 capability `n5-grammar-section-completion`。
