## Why

vendor JS 未獨立 chunk、`ExamModal` 為單一圖示拖三套 fortawesome、`index.html` 缺 SEO/PWA meta 與 iPhone safe-area 配套、字型設定意圖不清。最近 `fix-pwa-update-cache-retention` 已穩定 PWA 快取行為，是處理啟動效能的時機。

## What Changes

- 移除 `@fortawesome/*` 三套依賴，改用 `unplugin-icons` + `@iconify-json/fa6-solid`；`PROJECT_ARCHITECTURE.md` 新增 icon 使用規範段落。
- `vite.config.ts` 加 `build.target='es2020'` 與 `manualChunks: { 'vendor-vue': ['vue','vue-router'] }`。
- Workbox 啟用 `navigationPreload`、`navigateFallback: appBasePath + 'index.html'`、`navigateFallbackDenylist`、`cleanupOutdatedCaches: true`。
- `index.html` 補 `description`、`theme-color`、`color-scheme`、`apple-mobile-web-app-*`、`apple-touch-icon`、`viewport-fit=cover`；`<script>` 從 `<body>` 移至 `<head>`。
- sticky header 三處（`RouteTabs`、`PracticeToolbar`、`N5GrammarSectionCard`）與 `main.css` 加 `env(safe-area-inset-*)` 配套，避免 iPhone notch 遮蓋。
- `main.css` 字型改為跨平台系統字型 stack（`system-ui`、`PingFang TC`、`Hiragino Sans`、`Microsoft JhengHei UI` 等）。

## Non-Goals

- 不引入 web font（Noto Sans TC self-host 不做）。
- 不啟用 Workbox `runtimeCaching`（無 user-generated 圖片需求）。
- N5 拆檔與 v-if 改造屬後續變更 `establish-grammar-data-architecture`，不在此範圍。
- icon / favicon 壓縮、scaffold 清理、visualizer、pre-compression 屬後續變更 `optimize-static-assets`，不在此範圍。
- CSS route 樣式拆分屬後續變更 `cleanup-css-route-scoping`，不在此範圍。
- 不引入 SSR/SSG、不換 router、不改單字資料載入機制。

## Capabilities

### New Capabilities

- `pwa-installation-metadata`: PWA 安裝相關 HTML head metadata（SEO meta、iOS PWA hints、`apple-touch-icon`、`viewport-fit` 與 safe-area 配套）。

### Modified Capabilities

- `pwa-update-check-on-launch`: 補上 Workbox `cleanupOutdatedCaches` 為「normal lifecycle」清理機制的規格條文。
- `route-switching-performance`: 補上 Workbox `navigationPreload` 與 `navigateFallback` 為 base-path 部署下離線回訪的機制。

## Impact

- Affected specs: `pwa-installation-metadata`（新建）、`pwa-update-check-on-launch`（修改）、`route-switching-performance`（修改）
- Affected code (modified):
  - vite.config.ts
  - index.html
  - package.json
  - tsconfig.app.json
  - PROJECT_ARCHITECTURE.md
  - src/modules/exam/components/ExamModal.vue
  - src/styles/main.css
  - src/shared/components/RouteTabs.vue
  - src/modules/practice/components/PracticeToolbar.vue
  - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
- Dependencies:
  - Removed: `@fortawesome/fontawesome-svg-core`、`@fortawesome/free-solid-svg-icons`、`@fortawesome/vue-fontawesome`
  - Added (devDep): `unplugin-icons`、`@iconify-json/fa6-solid`
