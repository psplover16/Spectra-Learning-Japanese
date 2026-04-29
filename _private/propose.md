# 討論結論：重現 Japanese_Word_Practice_Vue_AI

## 唯一輸入

來源：`_private/discuss.txt`

輸入內容指出：

- 需要讀取來源專案 `C:\Users\Gary\Documents\Japanese_Word_Practice_Vue_AI`
- 來源專案目前分支為 `017-refine-n5-content`
- 目標是在本專案中，將 `Japanese_Word_Practice_Vue_AI` 專案的所有功能與所有 UI 完全一模一樣地重現

本次討論依照要求，未讀取來源專案、本專案其他檔案、規格或程式碼；以下結論只根據上述輸入形成。

## Conclusion

**Decision**：建議建立一個 Spectra 變更，暫定名稱為 `recreate-japanese-word-practice-vue-ai`，目標是在本專案重現來源專案 `Japanese_Word_Practice_Vue_AI` 於 `017-refine-n5-content` 分支上的所有使用者可見功能與 UI。

**Rationale**：「所有功能與所有 UI 完全一模一樣」範圍很大，不能直接當成可驗收實作項目。比較穩妥的做法是先把來源專案盤點成明確的功能清單、頁面清單、互動狀態、資料流程與視覺規格，再逐項映射到本專案並驗收視覺與行為一致性。

**Capture to**：建議後續產生 `openspec/changes/recreate-japanese-word-practice-vue-ai/`，至少包含 `proposal.md`、`design.md`、`tasks.md` 與必要的 spec delta。

## 範圍定義

納入範圍：

- 來源專案在 `017-refine-n5-content` 分支上的所有使用者可見功能
- 所有頁面、路由、元件、表單、按鈕、選單、彈窗與互動流程
- 所有 UI 狀態，包括正常、空資料、載入中、錯誤、停用、選取、完成與復原等狀態
- 版面配置、文案、顏色、間距、字體層級、響應式行為與視覺細節
- 與功能相關的資料讀寫、狀態保存、匯入匯出、設定與使用者流程

暫不直接納入，除非後續確認需要：

- 來源專案的 Git 歷史、開發紀錄或非使用者可見的內部實驗
- 機密設定、憑證、個人資料或與功能重現無關的環境檔
- 單純因來源專案技術棧而存在、但對本專案使用者行為沒有影響的內部實作細節

## 建議決策

1. 將「完全一模一樣」定義為「使用者可觀察到的功能、流程與 UI 結果一致」。
2. 後續在提案或實作階段，需要允許讀取來源專案指定分支，並先產出來源功能與 UI 盤點。
3. 實作不應只靠主觀比對，應建立 parity checklist，逐項確認每個功能、畫面、狀態與互動是否已在本專案重現。
4. 若本專案技術架構與來源專案不同，允許使用不同內部實作，但對外行為與 UI 必須保持一致。
5. 完成標準應包含功能驗收、視覺驗收、響應式驗收與回歸測試。

## 建議提案骨架

### Problem

本專案需要重現 `Japanese_Word_Practice_Vue_AI` 在 `017-refine-n5-content` 分支上的完整功能與 UI。目前需求以「全部重現」描述，範圍過大且缺少可驗收清單，因此需要先建立明確的來源盤點與遷移策略。

### Proposed Change

建立一個重現來源專案的變更流程：

- 讀取來源專案指定分支並確認工作樹狀態
- 盤點所有頁面、功能、UI 元件、互動狀態與資料流程
- 建立來源功能到本專案實作位置的映射表
- 依功能區塊分階段重現
- 以 parity checklist 驗收所有功能與 UI
- 補上必要測試，避免重現過程破壞既有行為

### Acceptance Criteria

- 已確認來源專案路徑為 `C:\Users\Gary\Documents\Japanese_Word_Practice_Vue_AI`
- 已確認來源分支為 `017-refine-n5-content`
- 已列出來源專案所有使用者可見頁面與功能
- 已列出所有需要重現的 UI 狀態與互動流程
- 本專案具備與來源專案一致的使用者可見功能
- 本專案具備與來源專案一致的 UI 呈現與響應式行為
- 差異若不可避免，必須在設計文件中明確記錄原因與影響
- 測試或人工驗收結果能證明 parity checklist 已完成

### Example

若來源專案某頁面存在三種使用者可見狀態：空資料、練習中、完成結果，則本專案對應頁面也必須提供相同狀態、相同主要操作、相同文案語意與相同視覺層級。驗收時不能只確認主要畫面，還要確認狀態切換與邊界情境。

## 建議任務清單

- 建立 Spectra change：`recreate-japanese-word-practice-vue-ai`
- 確認並記錄來源專案分支 `017-refine-n5-content`
- 盤點來源專案的頁面、功能、UI 狀態與資料流程
- 盤點本專案現有架構，決定每個來源功能要落在哪些模組
- 建立 parity checklist
- 分階段重現功能與 UI
- 補齊測試與視覺驗收
- 彙整差異、限制與後續追蹤項目

## 結論

這個需求應先進入 `$spectra-propose`，形成正式變更與可驗收清單，再進入 `$spectra-apply`。直接實作「所有功能與所有 UI」風險過高，容易遺漏狀態、邊界流程與視覺細節；先做來源盤點與 parity checklist，是讓「完全一模一樣」變成可執行工作的關鍵。
