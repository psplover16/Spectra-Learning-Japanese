## Context

N5 文法頁的 section header 同時包含 checkbox 與展開/收合控制。手機模式下 checkbox 可點擊範圍太小，使用者容易誤觸展開/收合按鈕。這次變更聚焦在擴大 checkbox hit area，並保持 checkbox 外觀不變。

## Goals / Non-Goals

**Goals:**

- 讓 N5 文法 checkbox 的點擊/觸控 hit area 更容易命中。
- 保持 checkbox 目前的視覺樣式。
- 讓 checkbox hit area 的互動不會觸發 section 展開/收合。
- 讓展開/收合控制不會意外切換 checkbox。

**Non-Goals:**

- 不重新設計 checkbox 外觀。
- 不調整 checkbox 代表的學習狀態語意。
- 不改變 section 展開/收合規則。
- 不新增提示文字或教學 UI。

## Decisions

### 以 wrapper 放大 checkbox hit area 並保留 input 視覺尺寸

在 N5 文法 section header 內，為 checkbox 增加外層 wrapper 或 label。wrapper 提供較大的可點擊範圍，checkbox input 則保留原本尺寸與樣式。使用者點擊 wrapper 時只切換 checkbox，不觸發展開/收合。

**Alternative considered:**
- **直接放大 checkbox input 尺寸**：會改變目前 checkbox 視覺，與需求衝突。
- **只增加 header 間距**：無法保證 checkbox 的 hit area 真的變大。
- **讓整個 header 都切換 checkbox**：會破壞展開/收合的互動邊界。

### 保持展開控制與 checkbox 事件邊界分離

checkbox hit area 與展開/收合控制需要明確分離。checkbox hit area 的 click / touch 行為只更新學習狀態，展開按鈕只控制內容展開或收合。

**Alternative considered:**
- **用座標判斷避免誤觸**：維護成本高且容易產生邊界錯誤。
- **用延遲或 debounce 避免誤觸**：無法真正解決 hit area 太小的問題。

### 以手機互動測試保護行為

新增或調整 N5 文法 component 測試，覆蓋 checkbox hit area 不會展開 section、展開按鈕不會切換 checkbox、checkbox 視覺 class 或尺寸維持原本行為。手機寬度為主要驗證場景。

**Alternative considered:**
- **只做手動測試**：容易讓事件邊界在後續改動中回歸。

## Risks / Trade-offs

| 風險 | 緩解 |
| --- | --- |
| hit area 誤觸展開/收合 | 在 wrapper 事件中阻止事件冒泡，並用測試覆蓋展開狀態不變 |
| checkbox 視覺被放大 | 明確只放大 hit area wrapper，保留 input 尺寸與樣式 |
| 鍵盤操作或無障礙狀態退化 | checkbox wrapper/input click handler 維持語意，並確認 aria-expanded 只由展開控制改變 |
