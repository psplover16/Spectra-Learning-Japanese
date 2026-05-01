## Context

本變更同時處理三個獨立但都影響「手機 PWA 短時段學習體驗」的議題：

1. **版號顯示**：目前無從在 UI 辨識使用者實際在哪一版（package.json 不曝露給前端、無 build-time 注入）。
2. **PWA 啟動更新檢查**：現有實作（`src/modules/pwa/services/pwaLifecycleService.ts` + `usePwaLifecycle.ts`）依賴 Workbox 預設的更新節奏，已知在已安裝 PWA 上偶爾失靈，使用者需改開網頁才能取得更新。
3. **N5 文法分區**：`src/modules/n5Grammar/views/N5GrammarView.vue` 已有「checkbox 代表是否已學習」（既有 spec `n5-grammar-section-completion`），但目前所有 container 同列呈現，使用者必須逐一掃描標記，掃描成本高。
4. **子路由 root 垂直 padding**：目前 `/practice` 與 `/grammar` 的 route root 帶有 `py-1`，造成正式內容前多一層垂直 padding；N5 文法頁雖然 template root 沒有 `py-1`，但 `src/styles/main.css` 的 `.n5-grammar-view` 仍套用 `@apply space-y-1 py-1`。使用者希望除單字練習外移除這層 root padding。

三個議題雖獨立，但變動點分散於 build 設定、PWA service、shared component、view 層；同批處理可避免重複改動 main.ts 與 PROJECT_ARCHITECTURE.md。

## Goals / Non-Goals

**Goals:**

- 在「字母練習」頁顯示自動更新的版本號，工程師零維護
- 確保已安裝 PWA App 啟動時主動觸發 SW 更新檢查
- 讓 N5 文法 container 依 checkbox 狀態自動分區，不影響既有資料、checkbox 語意與排序；已學習區沒有內容時不 render 空 zone
- 除單字練習頁外，移除子路由 root container 的 `py-1`，並移除 `.n5-grammar-view` root selector 的 padding-top / padding-bottom 來源

**Non-Goals:**

- 不重做 PWA 更新提示 UI
- 不變更 N5 文法 checkbox 行為與儲存格式
- 不為 N5 文法已學習空區新增 placeholder 或提示文字
- 不為「字母練習」以外的路由加版號（本變更只在該頁顯示，但元件本身可被重用）
- 不移除卡片、section、表格或元件內部 padding
- 不改變單字練習頁 root `py-1`
- 不引入新的版本管理工具（如 semantic-release）

## Decisions

### 版本號來源以 build-time 注入 package.json 的 version 為準

採用 vite 的 `define` 機制，將 `package.json` 的 `version` 欄位以 build-time 常數 `__APP_VERSION__` 注入。前端透過 `src/shared/version/appVersion.ts` 統一暴露為命名匯出，其他模組僅 import 此檔。

**Alternative considered:**
- **直接 `import pkg from '../../package.json'`**：會把整份 JSON 打包進 bundle，意外曝露 dependencies 名單；違反「最簡可行解」原則。
- **Git commit hash**：對使用者沒語意（看到 `a1b2c3d` 不知道是哪版），且需 build 環境有 git；違反「自動更新、不需手動維護」原則。
- **手動於 .env 維護版號**：違反 propose 明訂的「不需工程師手動控制」要求。

### PWA 啟動時主動觸發 SW update

擴充既有 `pwaLifecycleService.ts`：在 SW registration 完成後，於 `app.mount()` 完成的下一個 microtask 呼叫 `registration.update()`，主動向 server 詢問新 SW。`usePwaLifecycle.ts` 暴露 `triggerLaunchUpdateCheck()` 給 `main.ts` 在啟動時呼叫一次。既有 `skipWaiting` / `clientsClaim` 策略不變，故偵測到新 SW 後行為一致（沿用既有提示 UI）。

**Alternative considered:**
- **依賴 Workbox 預設輪詢**：已知問題正是預設節奏不夠即時，已被使用者觀察到「需改開網頁才會更新」。
- **強制 reload**：太過侵入，違反「不調整既有更新提示 UI」與「mobile-first 不打斷使用者」原則。

### N5 分區用 computed + 雙 v-for 渲染

在 `N5GrammarView.vue` 內，從既有儲存（`n5-grammar-section-completion` spec 定義的 storage key）讀 checkbox 狀態，用兩個 computed 拆出 `unfinishedSections` 與 `finishedSections`。未學習區永遠渲染；已學習區只有在 `finishedSections.length > 0` 時才渲染，避免空 section 仍被 root `space-y-4` 加上 `margin-top: 1rem` 並造成父層高度多 16px。當兩個 zone 都存在時，root `space-y-4` 提供 `1rem` 間距；既有排序邏輯不動，僅以 `filter` 切兩半。

**Alternative considered:**
- **純 CSS `:has()` selector 分組**：瀏覽器支援度（特別是 iOS Safari 早期版本）不全，違反「離線優先 + 手機 Safari」場景。
- **新增 store 來管分區狀態**：不必要，checkbox 狀態已是分區的唯一來源；違反「最簡可行解」原則。
- **保留空的已學習區但用 CSS 隱藏 margin**：會讓空 DOM 節點與 spacing 規則互相牽制，未來較容易再出現 margin collapse；直接不 render 空 zone 較符合畫面語意。

### 版號元件放 src/shared/components/AppVersionLabel.vue

獨立元件，props 只接受顯示文字（預設讀 `appVersion`）與簡單樣式覆寫。職責限定於「呈現版號文字」，不涉及更新檢查邏輯。位置、字體、顏色由父頁面以 Tailwind utilities 控制。

**Alternative considered:**
- **直接 hardcode 於 PracticeView template**：未來其他頁想顯示版號時要複寫，違反 DRY；本元件抽出成本極低。
- **元件內含「點擊顯示 build info」彈窗**：超出 propose 範圍，且增加離線情境測試負擔。

### 版號定位於整個 Practice 頁面內容流最底部右側

`AppVersionLabel` 在 `PracticeView.vue` 中應位於所有非 overlay 內容之後，成為整個頁面內容流的最後一個可見項目，並以全寬容器靠右對齊。此定位不是 viewport fixed 右下角，也不是右欄 `practice-reference-sections` 的最後一列；因此使用者捲到頁面最底部時，版號會貼齊 Practice 頁面內容寬度的右側。

**Alternative considered:**
- **保留在右欄並用 `text-right` 對齊**：只能貼齊右側 reference column，在手機 PWA 會被使用者看成沒有位於整頁右下角。
- **使用 `fixed bottom-* right-*` 固定在 viewport 右下角**：會讓版號浮在畫面上，不符合「整個頁面內容最底部」的需求，且可能與既有 Toast 或 modal 視覺層級產生干擾。

### 路由根層 py-1 只保留在 VocabularyView

將 route root container 的 `py-1` 視為各路由的顯式版面規則，而不是共用預設。`PracticeView.vue` 與 `GrammarView.vue` 移除 root `py-1`，讓正式內容直接接在 AppShell main 區塊之後；`VocabularyView.vue` 保留 `py-1`，因單字練習頁有固定高度與 body scroll lock 的表格體驗，既有上下緩衝仍是該頁設計的一部分。N1～N4 placeholder 與 N5 文法頁 template root 不加 `py-1`，並且要移除 `src/styles/main.css` 的 `.n5-grammar-view { @apply space-y-1 py-1; }` root stylesheet 規則，避免 N5 文法仍透過 CSS 取得 padding-top / padding-bottom。N5 文法分區間距由 `N5GrammarView.vue` root 上的 `space-y-4` 控制，不再由 global CSS 的 `.n5-grammar-view` 隱式覆寫。

**Alternative considered:**
- **在 AppShell 統一控制所有 route 的 padding**：會讓單字練習這個例外變成反向覆寫，範圍比需求更大。
- **移除所有 `py-*` 類別**：會誤傷 section/card/table 內部 padding，超出「正式內容之前的 root padding」問題。
- **保留 `.n5-grammar-view { @apply space-y-1; }` 只移除 `py-1`**：仍會讓 N5 文法 root spacing 由 global CSS 覆寫 template 的 `space-y-4`，因此直接移除該 route-root 規則。

### 儲存與離線職責劃分

- **版號**：純 build-time 常數，無 storage、完全離線、無同步議題
- **PWA 更新檢查**：需網路才能向 server 詢問新版，**無網路時必須安靜失敗**（不丟錯誤、不阻擋畫面、不影響後續離線使用）；SW registration 與 cache 由 Workbox／瀏覽器管理
- **N5 checkbox 狀態**：沿用既有 localStorage（`n5-grammar-section-completion` spec），本變更不新增儲存

## Risks / Trade-offs

| 風險 | 緩解 |
|---|---|
| iOS Safari PWA 對 SW 更新較嚴格，使用者可能仍需完全關閉 App 重開才生效 | 屬瀏覽器層限制無法繞過；以 update check 提升「準備就緒」機率，使用者下次回到 App 時即可生效 |
| 版號顯示位於「字母練習」頁整個內容流最底部右下角，可能因結果面板出現而下移 | 將版號視為頁面最後一個非 overlay 內容項目；以單元測試確認不在右欄，並以 320px / 375px / 414px 三個常見手機寬度做手動驗證 |
| 移除 route root `py-1` 可能讓 Practice / Grammar / N5 Grammar 首屏變得更貼近 header | 只移除 root padding，不動內部卡片 padding；以 smoke test 鎖定 VocabularyView 保留 `py-1`、其他 route root 不含 `py-1`，並以 source-level 測試鎖定 `.n5-grammar-view` 不再套用 padding-top / padding-bottom |
| N5 分區改變既有頁面視覺結構，可能影響使用者既有 muscle memory | 既有排序維持、checkbox 語意維持，使用者勾選後 container 才會「移動」；分區是漸進的而非一次重整 |
| N5 已學習區空時不 render，可能讓 DOM 測試找不到該節點 | 測試明確拆成空狀態與有內容狀態：空狀態確認節點不存在，有內容狀態確認節點存在且 padding 為 0 |
| `__APP_VERSION__` 若忘記在 vite.config.ts 設 `define`，運行時會是 undefined | `appVersion.ts` 加 fallback `'0.0.0-dev'` + 撰寫單元測試驗證 build 後值非空；CI 階段加最小檢查 |
| 啟動時 `registration.update()` 失敗（離線、server 5xx）可能拋出未捕捉錯誤 | 包 try/catch 並 console.warn；不影響應用啟動流程 |

## Migration Plan

無資料遷移需求。部署即生效：

1. Build 後 `__APP_VERSION__` 自動注入
2. 既有使用者下次開啟 PWA 時：
   - 觸發 launch update check → 取得新 SW
   - 沿用既有提示 UI 引導更新
3. N5 文法頁渲染時讀取既有 localStorage，依 checkbox 狀態自動分區，無需資料轉換

Rollback：直接 revert commit；無資料層變動，無回退風險。

## Open Questions

- **版號是否要點擊顯示完整 build info（git commit、build time）？** 暫不做，超出 propose 範圍
- **兩個分區是否要顯示「未學習」「已學習」文字標題？** 依 propose 未明訂；建議**不加**標題（保持版面簡潔，使用者透過位置與 checkbox 即可辨識）
- **`__APP_VERSION__` 是否同時 inject 到 service worker？** 暫不需要，SW 由 Workbox 自管 cache 版本
