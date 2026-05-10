## Context

本專案為個人單人 Vue 3 + Vite PWA，部署於 GitHub Pages 子路徑 `/Spectra-Learning-Japanese/`（production）與 `/Spectra-Learning-Japanese/staging/`（staging）。使用者主場景為 iPhone Safari ≥14、Android Chrome ≥85，5~15 分鐘短時段使用，常見弱網或離線。

當前痛點：

- `vite.config.ts` 未設 `manualChunks` 與 `build.target`，所有依賴與應用碼擠在同一 entry chunk，使用者更新後重抓全部。
- `ExamModal` 為單一 ✕ 圖示拖三套 fortawesome dependency。
- `index.html` 僅 4 行 head，缺 SEO/PWA meta，iPhone notch 下無 safe-area 配套。
- `main.css` 字型設定指 Noto Sans TC 卻未引入 web font，意圖不清。
- Workbox 設定僅有 `globPatterns`，缺 `navigationPreload`、`navigateFallback`、`cleanupOutdatedCaches`。

最近合併的 `fix-pwa-update-cache-retention`（commit `972e41d`）已穩定 PWA 快取行為，新 spec 明寫「leave precache available until Workbox replaces outdated caches through its normal lifecycle」，本提案啟用 `cleanupOutdatedCaches` 即為該 lifecycle 的具體實現。

## Goals / Non-Goals

**Goals:**

- 降低使用者每次更新的下載量（vendor chunk 獨立化、長期快取）。
- 移除三套 fortawesome dependency，建立可擴展 icon 規範。
- 補齊 PWA 安裝體驗（SEO meta、iOS PWA hints、apple-touch-icon）。
- 修正 iPhone notch 下 sticky header 被瀏海遮蓋。
- 補齊 PWA 離線回訪契約（navigationPreload + navigateFallback）。
- 與 `fix-pwa-update-cache-retention` 新 spec 的「Workbox normal lifecycle」對齊（cleanupOutdatedCaches）。

**Non-Goals:**

- 不引入 web font（Noto Sans TC self-host 不做）。
- 不啟用 Workbox `runtimeCaching`（無 user-generated 圖片需求）。
- N5 拆檔、icon 壓縮、CSS 樣式拆分皆屬後續變更。
- 不引入 SSR/SSG、不換 router、不改單字資料載入機制。

## Decisions

### Icon 系統改用 unplugin-icons + fa6-solid

**選擇**：以 `unplugin-icons` Vite plugin 搭配 `@iconify-json/fa6-solid` 集合取代 fortawesome 三套依賴。`ExamModal` 改 import 自 `~icons/fa6-solid/xmark` 路徑。

**替代方案**：

- inline SVG 寫死在元件：最瘦、零依賴，但未來新增 icon 需各自管理 path，缺乏統一規範。
- 保留 fortawesome 改用 single SVG import：仍要保留 fortawesome 至少 1 套，ROI 低。

**為何選 unplugin-icons**：自動 tree-shake（只打包用到的 icon path，每個約 200~400 bytes）；建立未來新增 icon 的標準路徑（搜尋 icones.js.org 後直接 import 並當 component 用）；devDep 不入 production bundle。

### Vendor chunk 切一桶 vendor-vue

**選擇**：`manualChunks: { 'vendor-vue': ['vue', 'vue-router'] }`。`workbox-window` 不獨立切，留在 entry chunk。

**替代方案**：

- 多桶切分（vendor-vue、vendor-pwa、vendor-icons）：dep 數量未到，徒增 HTTP 請求。
- function 形式所有 node_modules 一桶：任何 dep 改版整桶失效，命中率反而低。

**為何選一桶**：本專案目前主要 production deps 僅 vue、vue-router、workbox-window；workbox-window 由 SW 自管，不需獨立 chunk；簡單 + 命中率最佳。

### build.target 設為 es2020

**選擇**：明示 `build.target: 'es2020'`。

**替代方案**：

- baseline-2023（Vite 7 新增）：較大 polyfill。
- 保留 Vite 7 預設：相當保守、最大 polyfill。

**為何選 es2020**：iOS Safari 14+（2020 年 9 月）、Android Chrome 85+（2020 年 8 月）皆全支援；對應使用者 iPhone Safari ≥14、Android Chrome ≥85 矩陣；polyfill 最瘦。

### Workbox 啟用 cleanupOutdatedCaches 並補 navigation 機制

**選擇**：啟用 `cleanupOutdatedCaches: true`，搭配 `navigationPreload: true` 與 `navigateFallback: appBasePath + 'index.html'`。

**替代方案**：

- 不啟用 cleanup，靠手動 cache 維護：原 `pwaLifecycleService.confirmUpdate()` 即此模式，已在 `fix-pwa-update-cache-retention` 移除。
- 啟用 `runtimeCaching` for images：目前無 user-generated 與外部 CDN 圖片，全部已 precache。

**為何選此組合**：

- `cleanupOutdatedCaches` 是 `pwa-update-check-on-launch` spec 的「Workbox normal lifecycle」具體實現；只在新 SW activate 時清舊版 precache，不會造成「更新進行中清空快取」風險。
- `navigationPreload` 讓 SW 啟動同時送 nav request，PWA 啟動感更快。
- `navigateFallback` 走 `appBasePath` 是必要的，因為部署在 GH Pages 子路徑，寫死 `/index.html` 在 staging 子路徑下會 404。

### viewport-fit cover 與 safe-area padding 配套同做

**選擇**：本提案同時加入 `viewport-fit=cover` 與三處 sticky header（`RouteTabs`、`PracticeToolbar`、`N5GrammarSectionCard`）+ `main.css` 的 `env(safe-area-inset-*)` 配套。

**替代方案**：

- 拆獨立提案：顆粒度乾淨，但中間期 iPhone 用戶會看到 sticky header 被瀏海遮，且兩者是配套關係，分開做會造成短期 UX 退化。
- 不做 viewport-fit cover：失去 iPhone 全螢幕適配，未來還是要做。

**為何選一起做**：兩者是配套關係，分離反而造成短期使用者退化；本提案範圍可控（只動 4 個檔案 + main.css）。

### 字型改系統字型 stack

**選擇**：main.css 字型改為 system-ui、apple-system、Segoe UI、Hiragino Sans、Hiragino Kaku Gothic ProN、Microsoft JhengHei UI、PingFang TC、Helvetica Neue、Arial、sans-serif 的多重 fallback stack。

**替代方案**：

- self-host Noto Sans TC（fontsource）：子集化仍要 200~500 KB，違反短 session + 離線優先定位。
- 維持現狀：意圖不清（指 Noto 卻未引入）。

**為何選系統字型**：零下載、零 FOUT、各 OS 用原生 CJK 字型；對純文字 PWA 是最划算選擇。

## Implementation Contract

**Behavior（使用者觀察）**：

- A1：`ExamModal` 關閉鈕視覺、`aria-label="關閉練習"`、emit `confirmClose` 事件三者不變。圖示渲染為 inline SVG（Vue component from unplugin-icons）。
- A2：`npm run build` 後 dist 含獨立 vendor-vue chunk；第二次造訪該檔回應 from disk cache。
- A3：使用者離線從已造訪過的 SPA route 重新整理或回訪，仍可顯示 route shell；新版 SW activate 後，舊版 precache 由 Workbox 自動清除（不在更新進行中發生）。
- A4：iPhone notch 機種開啟 PWA 時，sticky header（route tabs、practice toolbar、N5 section header）不被瀏海遮蓋；分享連結時瀏覽器顯示 description 與 theme color。
- B1：iPhone 使用 PingFang TC、Android 使用 Noto Sans CJK、Windows 使用 Microsoft JhengHei UI；無 web font 下載。

**Interface / 設定形狀**：

- vite.config.ts 的 build 區塊新增 target 為 es2020 與 rollupOptions.output.manualChunks 為 vendor-vue 一桶。
- vite.config.ts 的 VitePWA workbox 區塊新增 navigationPreload、navigateFallback、navigateFallbackDenylist、cleanupOutdatedCaches 四個欄位。
- vite.config.ts 的 plugins 陣列新增 Icons compiler vue3。
- tsconfig.app.json 的 compilerOptions.types 加入 unplugin-icons/types/vue。
- package.json 移除三筆 fortawesome dependency；新增 devDep unplugin-icons 與 @iconify-json/fa6-solid。
- index.html head 重寫為含 description、theme-color、color-scheme、apple-mobile-web-app-* 系列、apple-touch-icon、viewport-fit=cover；`<script type="module">` 移至 head。
- main.css 新增 :root CSS variables（safe-top、safe-bottom、safe-left、safe-right）；body 補 padding-left 與 padding-right 對應 safe variables；font-family 替換為系統字型 stack。
- 三個 sticky header 元件 scoped style 套用 padding-top 取 max(safe-top, 既有值)。

**失敗模式**：

- iconify 名稱錯字（如 xmarki）→ TypeScript 編譯失敗、build 失敗。
- viewport-fit 配套漏掉某個 sticky header → 該頁 iPhone notch 機種會看到瀏海遮文字，由視覺驗證捕捉（design 階段須跑 iPhone 模擬器）。
- vendor-vue chunk 大小超 500 KB 警戒線 → npm run build 警告，須調整 manualChunks。

**Acceptance Criteria（驗收）**：

- npm run typecheck 通過。
- npm run lint 通過。
- npm run test:unit 通過（含 ExamModal 補測「關閉鈕 a11y 名稱仍為『關閉練習』」）。
- npm run build 通過、dist gzip 總和對比表貼進 PR、無 chunk 超 500 KB 警戒線。
- tests/e2e/route-switching-performance.spec.ts 通過。
- tests/e2e/pwa-offline-route-cache.spec.ts 通過（含 PLAYWRIGHT_PWA=1 環境變數）。
- tests/e2e/practice-layout.smoke.spec.ts 與 tests/e2e/n5-grammar-layout.spec.ts 在 375px 視窗下通過（驗證 viewport-fit + safe-area 不破版）。
- Lighthouse production preview 三分數對比表貼進 PR。
- iPhone 模擬器（具 notch 機型）人工檢查三處 sticky header 不被瀏海遮蓋。

**Scope 邊界**：

- 在範圍內：vite.config.ts、index.html、package.json、tsconfig.app.json、PROJECT_ARCHITECTURE.md、src/modules/exam/components/ExamModal.vue、src/styles/main.css、src/shared/components/RouteTabs.vue、src/modules/practice/components/PracticeToolbar.vue、src/modules/n5Grammar/components/N5GrammarSectionCard.vue。
- 不在範圍：N5 文法資料拆檔、N5GrammarSectionCard 的 v-show 改 v-if、icon 壓縮、favicon 替換、scaffold 清理、CSS route 樣式拆分、其他 sticky header 元件（除三處列名外）、單字資料相關檔案。

## Risks / Trade-offs

- iPhone notch 機種首次啟用 viewport-fit 配套 → 視覺微差（多一點 safe-area padding）。Mitigation：design 階段先在 iPhone 模擬器驗證；既有 practice-layout.smoke.spec.ts 與 n5-grammar-layout.spec.ts 守住 375px layout。
- 系統字型 stack 各裝置字型不完全相同 → CJK 在 iOS 是 PingFang、Android 是 Noto CJK、Windows 是 Microsoft JhengHei UI。Mitigation：本來就是設計接受的折衷（零下載收益遠大於 1px 級字型差異）。
- unplugin-icons 增加工具鏈複雜度 → Mitigation：寫進 PROJECT_ARCHITECTURE.md icon 使用規範，未來新增 icon 流程可重複；devDep 不入 production。
- es2020 target 排除 < iOS 14 / Android Chrome 85 → Mitigation：使用者矩陣已涵蓋 2020 後機型，個人專案無 telemetry 但可接受。
- cleanupOutdatedCaches 與既有 spec「保留離線快取」契約看似衝突 → 實際對齊：cleanup 只在新 SW activate 時執行，不影響「更新進行中」階段。Mitigation：tests/e2e/pwa-offline-route-cache.spec.ts 是該契約的回歸測試。

## Migration Plan

- 本提案不涉及使用者資料 schema 或 storage 格式變動，無 migration 需求。
- 部署順序：merge 至 dev → 自動 deploy 到 `/Spectra-Learning-Japanese/staging/` → 手動驗證 staging 真機 → merge 至 master → 自動 deploy 到 `/Spectra-Learning-Japanese/`。
- Rollback：純 git revert；既有 SW 會在使用者重訪時自動換回上一版 precache（cleanupOutdatedCaches 機制反向）。

## Open Questions

無。所有討論已於 `_private/discuss.txt` 與 `_private/propose.md` 收斂。
