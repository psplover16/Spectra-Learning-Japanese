## 1. 測試先行

- [x] [P] 1.1 為 Vocabulary control sizing and concise mark filter label 補上 component 測試；完成定義：測試覆蓋搜尋 input 高度為 2rem、閱讀模式與操作模式按鈕寬高與開始測驗按鈕一致、操作區顯示「僅註記」且不顯示「只顯示註記」，並在實作前失敗。
- [x] [P] 1.2 為 Vocabulary control sizing and concise mark filter label 補上 375px e2e 驗證；完成定義：在手機尺寸下驗證搜尋 input 高度、模式按鈕尺寸、僅註記標籤，以及模擬離線時控制列仍可操作且既有搜尋、註記篩選、閱讀模式切換、測驗啟動行為不變。

## 2. 控制列 UI 微調

- [x] 2.1 更新 VocabularyControlBar 標籤文字；完成定義：mark-only filter 的 label 改為「僅註記」，相關 test id 與篩選事件語意維持不變，畫面不再出現「只顯示註記」。
- [x] 2.2 更新控制列尺寸樣式；完成定義：搜尋 input 可視高度為 2rem，閱讀模式與操作模式按鈕的寬高與「開始測驗」按鈕一致，且未影響儲存註記、JLPT level checkbox 或表格布局。

## 3. 驗證與收尾

- [x] 3.1 執行 vocabulary 相關 unit 與 component 測試；完成定義：VocabularyControlBar、VocabularyViewSmoke 與受影響的 vocabulary 測試通過。
- [x] 3.2 執行 vocabulary e2e 並驗證手機離線情境；完成定義：375px 情境與模擬離線情境通過，且沒有水平溢位或 console/page error。
- [x] 3.3 執行 typecheck、lint 與 build；完成定義：TypeScript、ESLint 與 Vite build 通過，且沒有新增依賴或超出控制列 UI 微調範圍的架構變更。
