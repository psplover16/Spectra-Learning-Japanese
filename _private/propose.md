# 單字練習頁面操作區與單字資料整理提案草稿

## 結論

**決策**：本次單字練習頁面修改分成四個方向處理：先調整「漢字」checkbox 的位置，再建立螢幕寬度 768px 以下才觸發的單字 table 覆蓋式捲動互動，並把 table 底部單字被遮蓋、以及相同 `text` 單字合併納入本次檢查與規格要求。

**理由**：使用者實際操作時，單字 table 是主要閱讀區域；捲動閱讀時需要讓 table 取得更多畫面空間，但仍要能快速叫回操作區塊。另有資料品質問題需要一起處理，避免相同 `text` 被拆成多筆 vocabulary entries。

**捕捉位置**：後續可整理成對應 Spectra change 的 `proposal.md`、`design.md`、`tasks.md` 與相關 spec。

## 需求整理

目前「單字練習」子路由下方有單字 table，table 內放置單字，且 table 本身有滾動條。

本次需求分成四個步驟。

## 步驟 1：調整漢字 checkbox 位置

先執行此步驟。

- 將操作區塊中的「漢字」checkbox 移到「只顯示註記」checkbox 的左側。
- 「全部字音」checkbox 不需要調整。

## 步驟 2：單字 table 捲動覆蓋與 menu 互動

### 基本限制

- 切換路由 UI 與排版不動。
- 會動的只有單字練習頁面內部。
- 預設樣式以完成步驟 1 之後的樣式為準。
- 覆蓋式互動只在螢幕寬度 768px 以下觸發。
- 螢幕寬度大於 768px 時，維持既有桌面版版面與操作方式。

### 捲動往下時

- 單字 table 的滾動條慢慢往下捲動時，單字 table 會慢慢長高。
- 單字 table 會逐步覆蓋操作區塊。
- 當覆蓋到操作區塊只剩下「搜尋 input 與全部字音 checkbox 那一行」時：
  - 「全部字音」checkbox 隱藏。
  - 原位置改成一個 menu 按鈕。
  - 建議按鈕使用選單圖示加上無障礙標籤，不直接顯示 `menu` 文字；若需要純文字 fallback，使用 `menu`。
  - menu 按鈕背景色建議使用淺綠色 `#BBF7D0`。

### 綠色 menu 按鈕

- 觸發淺綠色 menu 按鈕時，操作區塊會出現。
- 這是特效，看起來像操作區塊快速長高。
- 特效過程中，操作區塊浮在單字 table 之上。
- 操作區塊出現後，menu 按鈕顏色變成紅色。
- 紅色建議使用 `#FCA5A5`。

### 紅色 menu 按鈕

- 紅色 menu 按鈕功能與綠色 menu 相反。
- 觸發紅色 menu 按鈕時，操作區塊會消失。
- 這是特效，看起來像操作區塊快速變矮。
- 特效過程一開始，操作區塊浮在單字 table 之上。
- 特效結束時，操作區塊要回到原本位置，也就是回到單字 table 之下的正常頁面流狀態。

### 層級要求

- 測驗畫面的層級必須高於本次新增或修改的覆蓋層級。
- 本次修正不得讓 menu 或操作區塊覆蓋在測驗畫面之上。

## 步驟 3：底部單字可見性檢查

此步驟是本次修改的考核點。

- 目前單字 table 最下方的單字無法看到，會被遮蓋。
- 本次修改必須修正或至少驗證此問題不再發生。
- 驗收時必須確認單字 table 捲到最底部時，最後一筆單字可被看見且不被覆蓋。

## 步驟 4：同 text 單字合併與規格補強

目前單字表有「單字完全相同，但散落在不同 stage」的情形。後續規格需要進一步收斂為：只要 `text` 完全相同，就視為同一個 vocabulary entry，不論 `kanji`、`romanization`、`meaning`、`stage` 是否不同。

本次要處理的重複判定包含：

- `text + kanji` 完全相同，但 `stage` 不同。
- `text + romanization + kanji` 完全相同，但 `stage` 不同。
- 純粹 `text` 完全相同，但 `stage` 不同。
- 純粹 `text` 完全相同，即使 `stage` 相同也不應拆成多筆 entries。

處理方向：

- 需要將這些單字合併為同一個 vocabulary entry。
- 合併後保留各個不同 kanji 與 meaning 作為多義項，不丟失原本意思。
- 合併時必須保留每個 meaning 原本的詞性標記，例如 `はやい` 合併後仍需保留 `快／早（い形容詞）` 與 `快速的（い形容詞）`。
- 合併時 `kanji` 與 `meaning` 必須維持一行對一行。
- 如果相同 `text` 的 source entries 有不同 `romanization`，不得靜默合併；需要在實作時列為人工確認或明確失敗。
- 合併後使用來源 entries 中最簡單的 JLPT stage，順序為 `N5`、`N4`、`N3`、`N2`、`N1`。
- 既有規格位於 `openspec/specs/vocabulary-meaning-pos-format/spec.md`。
- 既有規格目前已要求「同 `text` + 同 `kanji`」跨 stage 時要合併，並使用最簡單 JLPT stage。
- 既有規格目前也寫明「同 `text` 但不同 `kanji`」會保留為不同 entries。
- 本次需求會改變上述後者：未來即使 `kanji` 不同，只要 `text` 相同，也要合併成同一 entry。
- 後續提案需要修改 `vocabulary-meaning-pos-format` 規格，並補上自動檢查，確保未來新增單字時不會再次產生相同 `text` 的多筆 entries。

## 範圍

包含：

- 單字練習頁面操作區塊內 checkbox 位置調整。
- 768px 以下單字 table 捲動後覆蓋操作區塊的互動。
- 綠色與紅色 menu 按鈕的顯示與切換。
- 操作區塊快速展開與收合的視覺特效。
- 測驗畫面 z-index 高於本次互動層級。
- 單字 table 最底部單字可見性檢查。
- 同 `text` 單字合併。
- 保留合併後每個 meaning 的詞性標記。
- 修改 `vocabulary-meaning-pos-format` 規格，避免未來新增單字再次出現相同 `text` 的多筆 entries。

不包含：

- 修改切換路由 UI 或切換路由排版。
- 讓桌面版套用覆蓋式捲動互動。
- 調整「全部字音」checkbox 的一般位置；只有在覆蓋狀態下轉成 menu 按鈕。
- 改變測驗本身流程；只要求測驗層級高於本次互動。

## 驗收標準

- 完成步驟 1 後，「漢字」checkbox 位於「只顯示註記」checkbox 左側。
- 「全部字音」checkbox 在預設狀態下維持既有位置。
- 切換路由 UI 在整個過程中不移動、不縮放、不改變排版。
- 螢幕寬度大於 768px 時，不觸發覆蓋式捲動互動。
- 螢幕寬度 768px 以下時，單字 table 往下捲動會逐步長高並覆蓋操作區塊。
- 覆蓋到只剩搜尋列時，「全部字音」checkbox 會隱藏並改成淺綠色 menu 按鈕。
- 點擊淺綠色 `menu` 按鈕時，操作區塊以快速長高的特效浮在單字 table 之上，且按鈕轉成紅色。
- 點擊紅色 `menu` 按鈕時，操作區塊以快速變矮的特效消失，最後回到單字 table 之下的原本頁面流狀態。
- 測驗畫面永遠顯示在本次 menu 或操作區塊覆蓋層之上。
- 單字 table 捲到最底部時，最後一筆單字可以完整看見，不會被遮蓋。
- 同 `text + kanji`、同 `text + romanization + kanji`、純 `text` 相同但 stage 不同、以及純 `text` 相同但 stage 相同的單字都已合併。
- 合併後保留不同 kanji 與 meaning，並維持 `kanji` 與 `meaning` 一行對一行。
- 合併後每個 meaning 原本的詞性標記都被保留。
- 合併後使用最簡單 JLPT stage。
- 相同 `text` 若出現不同 `romanization`，實作不得靜默合併，必須人工確認或讓檢查明確失敗。
- 規格已修改，未來新增單字時不得再次產生相同 `text` 的多筆 entries。

## 已收斂決策

- 重複判定最終以純 `text` 為準：只要 `text` 完全相同，就必須合併成同一筆 vocabulary entry。
- `text + kanji` 與 `text + romanization + kanji` 仍可作為檢查報告中的分類資訊，但不作為是否合併的限制。
- 合併時必須保留不同 kanji、meaning 與每個 meaning 的詞性標記。
- 相同 `text` 若出現不同 `romanization`，需要人工確認或讓檢查明確失敗，不得靜默合併。
- 覆蓋式互動只在螢幕寬度 768px 以下觸發。
- menu 按鈕建議使用選單圖示，無障礙標籤依狀態使用「開啟操作區」或「收合操作區」。
- 若需要純文字 fallback，按鈕文字使用 `menu`。
- 淺綠色 menu 背景建議使用 `#BBF7D0`。
- 紅色 menu 背景建議使用 `#FCA5A5`。

## 既有規格狀態

目前相關規格位於 `openspec/specs/vocabulary-meaning-pos-format/spec.md`，已包含以下規則：

- 多義項的 `meaning` 必須每個意思一行。
- `kanji` 與 `meaning` 行需要對齊。
- 多個意思共用同一個 kanji 時，該 kanji 需要重複出現在對應行。
- 無 kanji 的意思要排在有 kanji 的意思之後。
- 新增 kanji 或 meaning sense 時，需要正規化順序，讓有 kanji 的 sense 在前、無 kanji 的 sense 在後。
- 同 `text` + 同 `kanji` 的跨 stage entries 需要合併。
- 合併後保留所有 verified meanings，並使用最簡單 JLPT stage：`N5`、`N4`、`N3`、`N2`、`N1`。
- 目前規格要求「同 `text` 但不同 `kanji`」保留為不同 entries。

本次需要補強或修改：

- 將「同 `text` 但不同 `kanji` 保留不同 entries」改成「只要 `text` 相同，就必須合併成同一 entry」。
- 自動檢查需擴充為：若 vocabulary data 出現相同 `text` 的多筆 entries，測試必須失敗並指出重複項目。
- 自動檢查需保護詞性標記：合併後每個 meaning 原本的詞性標記不得被移除。
