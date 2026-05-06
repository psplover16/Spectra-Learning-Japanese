## 1. 測試先行

- [x] [P] 1.1 新增 `tests/unit/routePreload.spec.ts`，先以失敗測試覆蓋 `Route assets are prepared from navigation intent`：同一路由重複 preload 只觸發一次 loader、pending promise 可被重用、已完成 preload 不重複 import；完成定義：未實作 `src/app/routePreload.ts` 前測試失敗，實作後測試通過。
- [x] [P] 1.2 新增 `tests/e2e/route-switching-performance.spec.ts`，先以失敗測試覆蓋 `Route switches keep visible feedback`、`Primary route visits are retained during the app session` 與 `Route switching performance is verified`：依序切換 `/practice`、`/grammar`、`/vocabulary`、`/n1-grammar`、`/n2-grammar`、`/n3-grammar`、`/n4-grammar`、`/n5-grammar`，斷言 AppShell 與導覽列持續存在、main route region 不空白、console 無錯誤，且回到已訪問路由時保留可觀察的 route-local state；完成定義：KeepAlive 與 route feedback 尚未實作前至少一個斷言失敗，實作後全數通過。

## 2. 路由保留與預熱

- [x] 2.1 更新 `src/app/router.ts` 並新增 `src/app/routePreload.ts`，實作 route component preload registry，支援 idle preload 與 navigation intent preload，並以 loaded/loading 狀態避免重複 import；對應 design「PWA App 優先於一般網頁首次載入」與「`/practice` 先啟動，再預熱其他 route component」；完成定義：App 啟動仍先進 `/practice`，idle preload 只預熱主要 route component module，不掛載未訪問 route instance，也不觸發單字或 N5 文法重資料處理。
- [x] 2.2 更新 `src/app/AppShell.vue`，以 RouterView slot 包住 KeepAlive，讓 `/practice`、`/grammar`、`/vocabulary`、`/n1-grammar`、`/n2-grammar`、`/n3-grammar`、`/n4-grammar`、`/n5-grammar` 訪問後保留；對應 design「主要路由全部使用 KeepAlive」與 spec `Primary route visits are retained during the app session`；完成定義：未訪問路由不會被預先掛載，已訪問路由切回時不經完整 teardown/remount，且 route transition 期間 AppShell 與導覽列不消失。
- [x] 2.3 更新 `src/shared/components/RouteTabs.vue` 與 `src/modules/grammar/components/GrammarLevelSwitcher.vue`，在 pointer hover、keyboard focus、touchstart 導覽意圖時呼叫 route preload，尤其支援手機 PWA 的 touchstart；對應 spec `Route assets are prepared from navigation intent`；完成定義：一般 route tab 與 N1-N5 文法等級路由都可在點擊前開始預熱，重複事件共用同一個 preload promise。

## 3. 重資料頁不阻塞 shell

- [x] 3.1 調整 `src/modules/vocabulary/composables/useVocabularySession.ts` 與必要的單字頁呼叫端，讓 `/vocabulary` 先 render 控制列、JLPT 選項與表格 shell，再分段載入目前需要的 JLPT 資料；對應 spec `Heavy route data does not block the route shell` 與 design「重資料頁先出 shell，再補資料」；完成定義：進入 `/vocabulary` 時不需等待 N1 到 N5 全部資料處理完才顯示 route shell，載入中 controls/table 有明確 disabled 或 loading 狀態，且不出現錯誤空狀態。
- [x] 3.2 調整 `src/modules/n5Grammar/views/N5GrammarView.vue` 與必要的 N5 文法資料載入方式，讓 `/n5-grammar` 先 render 可見 section 結構，再延後非可見或非必要內容處理；對應 spec `Heavy route data does not block the route shell`；完成定義：進入 `/n5-grammar` 時可先看到穩定 route shell，展開或顯示後續內容不會阻塞導覽列互動。
- [x] 3.3 檢查被 KeepAlive 的 route 內 timer、pending reveal、scroll lock、localStorage 同步與 event listener，必要時補 activated/deactivated 清理或同步；對應 design「主要路由全部使用 KeepAlive」的缺點控管；完成定義：連續切換主要路由後沒有殘留 body scroll lock、重複 listener、過期 timer 或 stale localStorage 狀態造成的錯誤。

## 4. 驗證與文件

- [x] 4.1 執行 unit/component/e2e 測試，至少包含 `tests/unit/routePreload.spec.ts` 與 `tests/e2e/route-switching-performance.spec.ts`；對應 spec `Route switching performance is verified` 與 design「優點」中回訪更快、狀態保留、切換不空白的預期；完成定義：所有相關測試通過，route transition 無 console error，main route region 不出現空白。
- [x] 4.2 執行 production build 並檢查 500 KB chunk 警戒線，同時在手機尺寸或模擬器做安裝後 PWA App 與離線回訪手動驗證；對應 design「PWA App 優先於一般網頁首次載入」與 spec `Route switching performance is verified`；完成定義：build 成功、無 JavaScript chunk 超過 500 KB，已訪問 `/vocabulary` 後離線回訪可從快取 route asset render，不出現 network-only failure state。
- [x] 4.3 更新 `PROJECT_ARCHITECTURE.md`，記錄 route preload helper、KeepAlive route retention、重資料頁 shell-first 載入策略與 PWA 驗證方式；完成定義：架構文件與 `src/app/router.ts`、`src/app/routePreload.ts`、`src/app/AppShell.vue`、單字與 N5 文法載入策略一致。
- [x] 4.4 執行 `spectra analyze improve-route-switching-performance --json` 與 `spectra validate improve-route-switching-performance --strict`；完成定義：Critical/Warning 已修正或明確記錄，strict validation 通過。
