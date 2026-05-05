## 1. 測試先行

- [x] [P] 1.1 為 Vocabulary practice controls separate operation filters from table word practice 與 Vocabulary operation filters use fixed order and defaults 補上 component 測試；完成定義：測試覆蓋操作區不顯示舊練習 checkbox、表頭顯示單字與新練習 checkbox、間距與預設勾選狀態，且在實作前會失敗。
- [x] [P] 1.2 為 Vocabulary word display supports kana swap practice 補上 unit 或 component 測試；完成定義：測試覆蓋單字 checkbox 優先、只有表頭練習 checkbox 時 あさ 顯示 アサ、あサ 顯示 アさ、兩者都未勾選時不顯示單字。
- [x] [P] 1.3 為 Vocabulary reading mode overlays the table without hiding search controls、Reading mode state stays in the vocabulary session、Reading mode uses layout classes rather than a new overlay subsystem 補上 component 或 e2e 測試；完成定義：測試覆蓋預設操作模式、閱讀模式按鈕文字與背景、操作模式按鈕文字與背景、搜尋列與模式按鈕列仍可見。
- [x] [P] 1.4 為 Vocabulary table bottom row remains visible 與 Vocabulary quiz layer stays above reading mode 補上 e2e 或 component 驗證；完成定義：測試覆蓋操作模式與閱讀模式捲到底部最後一列可見，且測驗 UI 高於閱讀模式覆蓋層並可互動。
- [x] [P] 1.5 為 Vocabulary data rejects duplicate text and kanji entries across stages、Duplicate text and kanji validation extends the vocabulary format checks、Offline data responsibilities remain unchanged 補上資料測試；完成定義：測試會偵測同 text 且同 kanji 的跨 stage 重複，接受同 text 但不同 kanji 的詞條，並不引入執行期去重或新儲存層。

## 2. 單字練習 UI 與狀態

- [x] 2.1 依 Table-local word display controls live in VocabularyStageTable 更新 VocabularyStageTable；完成定義：表頭內新增表格專用練習 checkbox，舊操作區練習語意不再控制單字欄位，props/emits 命名可清楚區分單字欄位顯示與練習顯示。
- [x] 2.2 依 Reading mode state stays in the vocabulary session 更新 useVocabularySession 與 VocabularyView；完成定義：session 暴露 readingMode、wordColumnVisible、wordPracticeVisible 或等價清楚 state，初始狀態符合規格，且控制列與表格透過同一狀態同步。
- [x] 2.3 更新 VocabularyControlBar 的操作區控制；完成定義：操作區移除舊練習 checkbox，漢字、全部字音、只顯示註記依序排列，漢字與全部字音預設勾選，input 旁顯示閱讀模式/操作模式切換按鈕。
- [x] 2.4 依 Reading mode uses layout classes rather than a new overlay subsystem 實作閱讀模式版面；完成定義：單字表以不透明專案背景色向上覆蓋操作區，不覆蓋搜尋 input 與模式按鈕列，切回操作模式時表格回到原本版面。
- [x] 2.5 完成 Vocabulary table bottom row remains visible 與 Vocabulary quiz layer stays above reading mode 的 UI 修正；完成定義：表格底部保留足夠可視空間，測驗 UI 的 z-index 高於閱讀模式覆蓋層，且未改變測驗流程。

## 3. 單字資料合併與檢查

- [x] 3.1 依 Duplicate text and kanji validation extends the vocabulary format checks 擴充 scripts/vocabulary/checkVocabularyMeaningFormat.mjs 或 vocabularyData 測試；完成定義：檢查輸出包含重複詞條的 text、kanji、stage、meaning，並讓同 text 且同 kanji 的跨 stage 重複造成測試失敗。
- [x] 3.2 依 Vocabulary data rejects duplicate text and kanji entries across stages 清理 raw vocabulary data；完成定義：同 text 且同 kanji 的重複詞條被合併到最簡單 stage，meaning 與 kanji 行對齊，資料筆數與 stage 筆數測試同步更新。
- [x] 3.3 確認 Offline data responsibilities remain unchanged；完成定義：單字資料仍來自靜態 TypeScript 資料檔，localStorage 只保留既有註記 snapshot，沒有新增 IndexedDB、Pinia store 或遠端同步。

## 4. 驗證與收尾

- [x] 4.1 執行 vocabulary 相關 unit 與 component 測試；完成定義：vocabularyData、vocabularyMeaningFormat、VocabularyControlBar、VocabularyStageTable、VocabularyViewSmoke 相關測試通過。
- [x] 4.2 執行 vocabulary e2e，並在手機尺寸與離線情境驗證 UI；完成定義：單字練習閱讀/操作模式、底部最後一列、測驗層級在模擬離線或已快取狀態下可正常使用。
- [x] 4.3 執行 typecheck、lint 與 build；完成定義：TypeScript、ESLint 與 Vite build 通過，且沒有新增超過範圍的依賴或架構檔案變更。
