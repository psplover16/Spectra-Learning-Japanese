## 1. 來源盤點與驗收基準

- [x] 1.1 驗證 Fixed Source Target：確認 `C:\Users\Gary\Documents\Japanese_Word_Practice_Vue_AI` 存在且目前分支為 `017-refine-n5-content`，完成定義：在 parity checklist 記錄驗證方式、時間與結果。
- [x] 1.2 先建立來源 parity inventory 再實作，建立 `docs/parity/source-project-parity.md`，欄位包含來源位置、頁面或流程、UI 狀態、可見文案、資料依賴、離線行為、實作目標、驗收證據與狀態，完成定義：Source Parity Inventory 覆蓋所有已發現的使用者可見項目。
- [x] 1.3 建立 Parity Verification Checklist 的狀態規則，包含 not-started、in-progress、complete、accepted-difference，完成定義：每個 inventory item 都能追蹤功能、視覺、響應式、離線與已知差異證據。

## 2. 架構映射與狀態資料

- [x] 2.1 依「以使用者可觀察結果為一致性標準」將每個 inventory item 映射到本專案路由、元件、store、樣式與測試目標，完成定義：checklist 中每列都有明確實作目標或 accepted-difference 理由。
- [x] 2.2 依「Source-compatible composables 管理執行期狀態，localStorage 保存離線資料」建立或調整狀態模型，完成定義：`PracticeSession`、`ExamSession`、`VocabularySession` 與 localStorage snapshot 類型明確且可驗證還原。
- [x] 2.3 實作 Offline Data Parity 的本機保存與還原流程，完成定義：設定、進度與使用者學習資料可在無網路狀態下寫入、重新載入並保持一致。

## 3. 功能與 UI 重現

- [x] 3.1 實作 Observable Behavior Parity 的路由、導覽與頁面框架，完成定義：所有 inventory 中的入口、頁面切換、返回流程與空狀態都能在本專案重現。
- [x] 3.2 實作 Observable Behavior Parity 的核心學習與練習流程，完成定義：每個 inventoried flow 的操作順序、狀態轉換、完成結果與資料保存都與來源一致。
- [x] 3.3 實作來源設定、進度、匯入匯出或資料管理相關流程，完成定義：inventory 中列出的每個資料流程都有對應 UI、狀態處理與本機保存驗收證據。
- [x] 3.4 實作 Visual And Responsive Parity，完成定義：每個 inventoried screen 在手機尺寸完成版面、控制層級、文案語意、顏色、間距、字體層級與 UI 狀態比對，桌機尺寸沒有破版。
- [x] 3.5 依「保持手機優先與離線優先」完成離線情境 UI 降級，完成定義：實機或模擬器斷網時核心學習流程可用，網路相關能力有明確停用或錯誤狀態。

## 4. 測試與收斂

- [x] 4.1 為核心狀態、localStorage 還原與資料轉換新增單元測試，完成定義：測試涵蓋正常、空資料、錯誤資料與離線重新載入案例。
- [x] 4.2 為主要路由與使用者流程新增互動測試或手動測試腳本，完成定義：每個 Source Parity Inventory 的高風險流程都有可重跑的驗收步驟。
- [x] 4.3 完成 Visual And Responsive Parity 的截圖或人工視覺驗收，完成定義：手機與桌機尺寸的證據已記錄到 parity checklist。
- [x] 4.4 完成 Parity Verification Checklist 收斂，完成定義：所有 checklist item 均為 complete 或 accepted-difference，且 accepted-difference 含來源行為、限制、使用者影響與接受理由。
- [x] 4.5 執行完整驗證，完成定義：型別檢查、測試、PWA 離線檢查與 Spectra validate 均完成並記錄結果。
