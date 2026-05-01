# expand-n5-grammar-checkbox-hit-area

## 討論來源

- 僅使用 `_private/discuss.txt` 的內容作為輸入。

## 結論

**Decision:**
在「子路由 - N5 文法」中，保持 checkbox 目前的視覺樣式不變，但放大它的可觸發範圍，特別是手機模式下的點擊/觸控範圍。

**Rationale:**
目前手機上 checkbox 很難準確勾選，使用者容易誤按到同一列的收納/開啟列表按鈕。這表示問題不在 checkbox 外觀，而在 hit area 太小且與展開/收合觸發區太接近。

**Recommended change name:**
`expand-n5-grammar-checkbox-hit-area`

## 需求整理

- N5 文法頁的 checkbox 視覺樣式必須保持不變。
- checkbox 的可觸發範圍必須放大，讓手機使用者更容易勾選。
- 放大的觸發範圍只能切換 checkbox 狀態，不應觸發列表收納/開啟。
- 收納/開啟列表的按鈕行為必須維持原本用途，不應因 checkbox hit area 放大而被破壞。
- 手機模式是主要驗證場景。

## 非目標

- 不重新設計 checkbox 樣式。
- 不改變 checkbox 代表的語意。
- 不改變 N5 文法列表的收納/開啟行為。
- 不新增額外提示文字或教學 UI。

## 建議驗收情境

### 情境 1：手機上更容易勾選 checkbox

- **GIVEN** 使用者在手機模式瀏覽 N5 文法頁
- **WHEN** 使用者點擊 checkbox 周圍的擴大觸控區
- **THEN** 該 section 的 checkbox 狀態會切換
- **AND** section 不會被展開或收合

### 情境 2：展開/收合按鈕仍維持原行為

- **GIVEN** 使用者在手機模式瀏覽 N5 文法頁
- **WHEN** 使用者點擊 section 的收納/開啟按鈕
- **THEN** section 會展開或收合
- **AND** checkbox 狀態不會被切換

### 情境 3：checkbox 樣式不變

- **WHEN** N5 文法頁 render
- **THEN** checkbox 的視覺大小、外觀與目前一致
- **AND** 只有可觸發範圍被放大

## 建議下一步

使用 `$spectra-propose expand-n5-grammar-checkbox-hit-area` 建立正式變更，將上述需求轉成 proposal、design、spec 與 tasks。
