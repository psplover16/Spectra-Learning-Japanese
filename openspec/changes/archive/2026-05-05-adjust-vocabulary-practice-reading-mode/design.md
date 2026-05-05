## Context

單字練習子路由目前由 vocabulary session composable 管理搜尋、欄位顯示、註記、JLPT level 載入與測驗入口，操作區與單字表分別由控制列與表格元件呈現。這次需求同時改變操作區控制項、表頭顯示控制、閱讀模式覆蓋互動，以及 raw vocabulary data 的重複防護；實作必須維持純前端 PWA、靜態資料檔與既有本機註記儲存方式。

## Goals / Non-Goals

**Goals:**

- 將「練習」從操作區移除，改為單字表表頭內的獨立顯示控制。
- 讓單字列可在原假名、平假名/片假名互換、空白三種狀態間切換。
- 以閱讀模式讓單字表覆蓋操作區，但保留搜尋 input 與模式切換按鈕列。
- 修正表格最底部單字被遮擋，並保護測驗畫面層級。
- 讓同 text 且同 kanji 的跨 stage 重複詞條被檢查並合併到最簡單 stage。

**Non-Goals:**

- 不改變路由 tab、其他子路由或測驗流程。
- 不新增外部 API、遠端同步、IndexedDB 或新依賴。
- 不合併只看 text 相同但 kanji 不同的同音詞。

## Decisions

### Table-local word display controls live in VocabularyStageTable

單字表表頭新增的「練習」checkbox 屬於表格欄位顯示控制，應與「單字」checkbox 一起由 VocabularyStageTable 呈現與發出更新事件。操作區的舊 practiceMode 不再用來控制單字欄位內容，避免同名控制項語意混淆。

替代方案：保留操作區 practiceMode 並讓表頭 checkbox 共用同一 state。淘汰原因是兩個位置會呈現相同名稱但不同用途，使用者無法判斷哪個控制欄位顯示。

### Reading mode state stays in the vocabulary session

閱讀/操作模式是整個單字練習頁面的版面狀態，應由 useVocabularySession 暴露明確 state，VocabularyView 負責把 state 傳給控制列與表格容器。建議 state shape 為 readingMode: boolean，初始值 false；wordColumnVisible: boolean，初始值 true；wordPracticeVisible: boolean，初始值 false。若現有欄位可重用，仍須保持命名能區分表頭練習顯示與舊操作區練習。

替代方案：把閱讀模式存在單一元件 local ref。淘汰原因是模式按鈕與表格覆蓋效果跨控制列、頁面容器與表格，local state 會造成 prop/event 串接不清。

### Reading mode uses layout classes rather than a new overlay subsystem

閱讀模式應以現有頁面結構加 class/state 切換完成：表格區在閱讀模式中向上覆蓋操作區，背景使用目前專案背景色且不透明，並保留 input 與模式按鈕列可見。測驗 modal 的 z-index 必須維持高於閱讀模式覆蓋層。

替代方案：建立新的全頁 modal 式閱讀容器。淘汰原因是需求只要求單字表覆蓋操作區，modal 會改變路由頁面結構與測驗層級互動，範圍過大。

### Duplicate text and kanji validation extends the vocabulary format checks

同 text 且同 kanji 的重複檢查應納入既有 vocabulary meaning format 或 vocabulary data 測試，並報出重複詞條的 stage 與 meaning。資料合併時使用最簡單 stage，順序固定為 N5、N4、N3、N2、N1，並保留每個有效 meaning 行與 kanji 對齊規則。

替代方案：只在本次手動清資料，不新增檢查。淘汰原因是需求明確要求未來新增單字也避免同類重複，缺少測試會讓問題回歸。

### Offline data responsibilities remain unchanged

單字資料仍由 src/modules/vocabulary/data 的靜態 TypeScript 檔提供；localStorage 只維持既有 vocabulary marks snapshot；本次不新增 Pinia store、IndexedDB schema 或同步衝突處理。衝突處理僅限靜態資料建置時的測試失敗與人工修正。

替代方案：建立執行期去重 normalization。淘汰原因是重複資料應在 source data 階段被修正，執行期去重會隱藏資料品質問題，也可能影響註記 key 對應。

## Risks / Trade-offs

- 閱讀模式覆蓋操作區時可能遮住測驗畫面 → 以測驗 modal z-index 高於閱讀模式層級作為 spec 與 E2E 驗證條件。
- 表頭「練習」checkbox 名稱與舊操作區「練習」容易混淆 → 移除操作區舊 checkbox，並在 state/event 命名上區分表頭顯示控制。
- 表格高度動畫可能造成最後一列仍被遮擋 → 驗收需包含捲到底部可見性的 component 或 E2E 檢查。
- 合併資料可能改變詞條數與測試期待值 → tasks 必須同步更新資料總數、stage 筆數與重複檢查測試。

## Migration Plan

1. 先新增或更新會失敗的測試，覆蓋 UI 控制、閱讀模式、底部可見性與同 text 且同 kanji 重複檢查。
2. 調整 vocabulary session state 與元件 props/emits。
3. 更新控制列與表格元件 UI。
4. 清理重複 raw vocabulary entries 並更新資料測試期待值。
5. 執行 unit/component/e2e 驗證，必要時補充截圖或手動驗證紀錄。

## Open Questions

- 無。需求輸入已指定合併條件為同 text 且同 kanji，且排除只看 text 相同的合併。
