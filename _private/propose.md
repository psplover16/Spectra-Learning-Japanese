# add-persistent-grammar-level-route-switcher

> 由 `_private/discuss.txt` 整理而成的變更草案。確認內容後可用 `/spectra-propose add-persistent-grammar-level-route-switcher` 正式建立 Spectra 變更。

---

## Why（為何要做）

1. **手機可擴充性受限**：現有「N5文法」主路由按鈕僅支援單一等級，未來新增 N1–N4 後將無處可擴充，手機橫向空間更不夠。
2. **無持久化偏好**：使用者每次重開網站都被迫從預設等級開始，不符離線優先 PWA「短時段、無干擾學習」的場景。
3. **缺可重用元件**：未來如有其他「下拉式路由切換」需求（如語言、難度、章節等），目前沒有共用底層，易重複造輪子。
4. **既有按鈕間距不適合手機**：現有 padding `0.3125rem 0.5rem` 在手機單手操作下偏大、易誤觸鄰近按鈕。

## What（要做什麼）

- 微調主路由列按鈕 padding 為 `0.3rem 0.39rem`
- 將主路由列「N5文法」改為**動態文法等級切換按鈕**（N1–N5）
- 新增 N1–N4 路由（內容暫為 placeholder）
- 在文法頁點主路由按鈕：開**子列表**讓使用者選等級
- 在非文法頁點主路由按鈕：直接跳到目前選定等級
- 持久化使用者選定等級（localStorage），含無效值的 fallback 機制
- 抽出**可重用的子列表元件**（options/config 驅動），未來可服務其他下拉切換需求

## Non-goals（不做什麼）

- 不實作 N1–N4 文法的實際內容（本變更只開路由 + placeholder）
- 不持久化「子列表開／關狀態」（重開網頁子列表一律關閉）
- 不動「字母練習」「變化規則」「單字練習」三個路由的行為
- 不引入新狀態管理或 UI 套件，沿用既有 Pinia + Tailwind
- 不變更主路由列的視覺樣式（除按鈕 padding 外）

---

## Impact（影響範圍）

### 新增檔案
- `src/modules/grammar/config/grammarLevels.ts` — N1–N5 等級設定資料（label、route、value、testId）
- `src/modules/grammar/composables/useGrammarLevel.ts` — 等級狀態與持久化
- `src/modules/grammar/storage/grammarLevelStorage.ts` — localStorage 讀寫與驗證
- `src/shared/components/RouteSubMenu.vue`（或類似命名）— 可重用的子列表元件
- `src/modules/grammar/components/GrammarLevelSwitcher.vue` — 文法等級切換按鈕（包裝 RouteSubMenu）
- `src/modules/grammar/views/N1GrammarView.vue`、`N2GrammarView.vue`、`N3GrammarView.vue`、`N4GrammarView.vue` — placeholder 頁面

### 修改檔案
- `src/app/router.ts` — 註冊 `/n1-grammar`、`/n2-grammar`、`/n3-grammar`、`/n4-grammar`、`/n5-grammar`
- `src/app/AppShell.vue` 或主路由列元件（`RouteTabs.vue`）— 整合 GrammarLevelSwitcher、調整 padding
- `PROJECT_ARCHITECTURE.md` — 補上新模組與元件責任

---

## 詳細需求（分類整理）

### A. 路由結構
- A1. 文法等級路由命名為 `/n1-grammar`、`/n2-grammar`、`/n3-grammar`、`/n4-grammar`、`/n5-grammar`
- A2. N1–N4 路由內容可為空白或簡單 placeholder，只需可正常進入且不報錯
- A3. 既有 `/n5-grammar` 路由保留不動

### B. 主路由按鈕行為
- B1. 主路由列上的文法按鈕文字顯示目前選定等級（例：「N5文法」、「N1文法」）
- B2. 預設等級為 N5
- B3. **非文法頁**點按鈕 → 直接跳到目前選定等級的文法路由
- B4. **文法頁（任一等級）**點按鈕 → 不跳轉，開啟子列表
- B5. 主路由列按鈕 padding 改為 `0.3rem 0.39rem`

### C. 子列表行為
- C1. 子列表提供 N1–N5 五個等級按鈕
- C2. 點任一等級後：跳轉到該等級路由 + 更新主按鈕文字 + 寫入 localStorage
- C3. 子列表開啟期間，點擊**畫面其他物件**時：**不執行該物件原動作**，只關閉子列表
  - 例外：點擊子列表自身按鈕、主路由列按鈕仍正常作用
- C4. 子列表開啟狀態不持久化，重開網頁一律關閉

### D. 子列表元件設計（可重用）
- D1. 元件需獨立可重用，不可硬寫於 RouteTabs
- D2. 元件透過 `options` / `config` 驅動：每個選項由外部傳入 label、route、value、testId 等
- D3. 元件職責限定為：
  - 渲染選項
  - 開／關狀態
  - 點擊外部關閉
  - 派發選項點擊事件
- D4. **跳轉到哪個路由 + 寫入哪個偏好值**由父層或 composable 處理，元件不耦合具體業務

### E. 視覺與排版
- E1. 子列表位置：在主按鈕**下方 4px**
- E2. 子列表為**懸浮層**（absolute / fixed），不推動 layout
- E3. 子列表 `padding: 0`、按鈕間 `gap: 2px`
- E4. 子列表內 button 樣式與目前主路由列 button **完全一致**
- E5. 子列表背景顏色：與專案背景接近，但**略深**

### F. 持久化與容錯
- F1. 使用者選定等級存入 localStorage（key 自訂，例：`grammarLevel`）
- F2. 啟動時讀取 localStorage：
  - 若記憶值有效（屬於設定中的等級、對應路由存在）→ 使用該值
  - 若無效（不是合法等級、路由不存在、已從設定中移除）→ **刪除該記憶值** + 回到預設 N5
- F3. 等級設定（A–F 通用）集中於 `grammarLevels.ts`，方便未來新增／刪除／調整順序

---

## 開放問題（建議在 design 階段處理）

1. **子列表元件命名**：建議 `RouteSubMenu.vue` 或 `RouteDropdown.vue`，待 design 確認 → 採用 RouteSubMenu.vue
2. **「點擊外部僅關閉、不執行原動作」的實作策略**：
   - 方案 A：全屏透明 overlay 攔截點擊
   - 方案 B：document 全域監聽 + `event.preventDefault()` / `stopPropagation()`
   - 方案 A 較直觀，方案 B 較輕量
   - 建議在 design 階段選定
   - 採用方案A
3. **「略深」量化**：背景比專案主背景深多少？建議在 design 用 Tailwind class（例：`bg-neutral-100` → `bg-neutral-200`）明確化
     → 原先的色彩不是很清楚，但顏色深度的幅度變化 要像例子一樣的幅度 `bg-neutral-100` → `bg-neutral-300`
4. **PWA 離線可用性**：本功能完全前端，無 API 呼叫，預設可離線運作；無需特別降級策略

---

## 風險

| # | 風險 | 緩解 |
|---|---|---|
| 1 | 子列表元件抽得太通用，反而難用 | 先寫死實際使用情境（grammar level switcher）→ 確認可用 → 再抽出共用部分 |
| 2 | localStorage 寫入時機過頻 | 只在等級切換時寫一次，不每次 render 寫 |
| 3 | 「點外部不執行原動作」可能影響 a11y / 鍵盤操作 | 需保留 ESC 關閉子列表的鍵盤行為 |
| 4 | N1–N4 placeholder 頁面影響使用者信任感 | 顯示明確「敬請期待」訊息，避免使用者以為功能壞掉 |

---

## 驗收條件

- 主路由列按鈕 padding 為 `0.3rem 0.39rem`
- 文法按鈕文字會顯示目前選定等級（預設 N5）
- N1–N5 路由皆可進入且不報錯
- 在非文法頁點文法按鈕 → 直接跳到目前選定等級
- 在文法頁點文法按鈕 → 開啟子列表
- 子列表提供 N1–N5 五個按鈕，按下後跳轉並更新主按鈕文字
- localStorage 記錄並在重開網頁後恢復選擇
- localStorage 含無效值時：刪除並 fallback 回 N5
- 子列表開啟期間，點外部僅關閉，不觸發原動作
- 重開網頁子列表一律關閉
- 子列表視覺：下方 4px、padding 0、gap 2px、背景略深、按鈕樣式一致
- 子列表元件可被獨立用於其他下拉切換場景（驗證可重用性）
- 補測試覆蓋：路由切換、持久化讀寫、無效值 fallback、子列表互動、外部點擊處理

---

## 建議的 spec 切分（給 design 參考）

可拆成以下 capability spec：

- `grammar-level-routing` — 路由結構與切換邏輯
- `grammar-level-persistence` — 持久化與 fallback
- `route-sub-menu` — 共用元件層級的 spec

---

## 下一步

1. 使用者確認本草案內容
2. 跑 `/spectra-propose add-persistent-grammar-level-route-switcher`，把本檔內容餵入正式 proposal
3. `/spectra-apply` 階段建議順序：
   - 先做 A、F（路由與持久化資料層）
   - 再做 D（共用子列表元件）
   - 最後做 B、C、E（整合與 UI 細節）
