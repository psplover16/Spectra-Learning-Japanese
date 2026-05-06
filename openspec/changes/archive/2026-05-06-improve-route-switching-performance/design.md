## Context

本變更以「安裝成 PWA App 後的日常使用流暢度」為優先目標。一般網頁首次開啟體驗暫時不作為主要最佳化方向；因此可以接受較積極地預熱 route component 與保留已訪問 route state，只要不在 App 啟動當下同步處理所有大型學習資料。

目前 `/` 已 redirect 到 `/practice`，因此 App 啟動後會先進入字母練習。這個入口應維持不變，讓使用者最快看到可操作畫面。

## Decision

### PWA App 優先於一般網頁首次載入

路由切換效能的主要評估場景是已安裝 PWA App 的日常使用：使用者開啟 App、先進 `/practice`，再在各主要路由間切換。網頁瀏覽器首次造訪的下載量與首次載入最佳化暫時降為次要考量。

### `/practice` 先啟動，再預熱其他 route component

App 啟動時先讓 `/practice` 與 AppShell 可操作。畫面穩定或瀏覽器 idle 後，再低優先級預熱其他主要路由的 component chunk。預熱目標是 route component module，不是立即載入、整理或 render 所有大型學習資料。

導覽列也應在使用者表達導航意圖時預熱目標路由，例如 pointer hover、keyboard focus、touchstart，尤其要支援手機 PWA 常見的 touchstart。

### 主要路由全部使用 KeepAlive

使用者偏好 App 切換時的回訪流暢度，因此主要路由採用 KeepAlive 或等效狀態保存。這裡的「全部」指主要路由被使用者訪問後，其 route component instance 應可被保留，切回時避免完整 unmount / mount 與重算。

KeepAlive 不代表 App 啟動時隱形掛載所有路由，也不代表立刻載入所有路由資料。路由 component 可以被預熱，但 route instance 只有在實際訪問後才進入保留範圍。

主要路由範圍包含：

- `/practice`
- `/grammar`
- `/vocabulary`
- `/n1-grammar`
- `/n2-grammar`
- `/n3-grammar`
- `/n4-grammar`
- `/n5-grammar`

### 重資料頁先出 shell，再補資料

`/vocabulary` 與 `/n5-grammar` 不應在路由切換當下同步完成所有資料處理。它們應先 render 穩定 route shell、控制項或可見區塊，再依目前可見狀態、使用者選取的範圍或明確互動載入資料。

單字頁尤其不應因 App 啟動後的 route 預熱而立即處理 N1 到 N5 全部資料。N5 文法頁也應避免在首次進入瞬間同步處理所有非可見或非必要內容。

## Trade-offs

### 優點

- PWA App 中已訪問路由回訪更快，較符合短時間反覆學習的使用方式。
- 單字頁與 N5 文法頁的篩選、展開、閱讀狀態較容易自然保留。
- 搭配 route component 預熱後，第一次切換等待與第二次切回成本都會下降。
- AppShell 與導覽列可持續顯示，路由切換時比較不會出現空白感。

### 缺點

- 手機記憶體使用量會比白名單 KeepAlive 更高。
- 被 KeepAlive 的 route 不會重新觸發一般 mounted 流程，若頁面依賴 localStorage、timer、event listener 或資料重新同步，需要檢查 activated / deactivated 行為。
- 如果預熱誤做成「載入並處理全部資料」，仍會讓 App 啟動後短暫卡頓。
- 所有主要路由都保留時，長時間使用後可能累積較多 component state，需要靠測試確認沒有 stale state 或背景 timer 問題。

## Implementation Notes

AppShell 可透過 Vue RouterView slot 包住 KeepAlive，讓主要 route component 在訪問後保留。實作時需要確認 async route component、route key 與 transition/loading state 的搭配，避免相同 component 被錯誤重用或不必要地重建。

route 預熱應集中在 router 或 shared preload helper，並記錄已 loaded / loading 的 route，避免重複 import。idle 預熱用於 App 啟動後低優先級準備；navigation intent 預熱用於 hover、focus、touchstart 等明確路由意圖。

對於被 KeepAlive 的頁面，若有 timer、DOM listener、pending reveal、scroll lock 或外部 storage 同步，需要視情況加入 activated / deactivated 處理，而不是只依賴 mounted / beforeUnmount。

## Verification

驗證重點以 PWA App 體感為主：

- App 啟動先可操作 `/practice`。
- 切換到每個主要路由時 AppShell 與導覽列不消失。
- 回到已訪問路由時不重複完整空白 loading pass。
- console 不出現 route transition error。
- production build chunk 仍維持 500 KB 警戒線。
- 手機尺寸下連續切換多個路由後，互動狀態保留且沒有明顯卡頓。
