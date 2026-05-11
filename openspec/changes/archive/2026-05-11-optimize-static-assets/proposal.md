## Why

PWA 啟動效能仍有靜態資產層面可壓：`public/icons/512.png` 148 KB、`public/vite.ico` 256×256（PNG-in-ICO，>30 KB）皆過大；`src/assets/{vue.svg,vite.svg,hero.png}` 為 Vite scaffold 殘留（grep 確認 src 內無引用）；缺少 build chunk 量測工具與 pre-compression。本提案做最後一階段資產層優化。

## What Changes

- 安裝 devDep `rollup-plugin-visualizer`，於 `vite.config.ts` 條件啟用（`mode === 'analyze'`），跑 `vite build --mode analyze` 產出 `dist/stats.html` 觀察 chunk graph。
- 安裝 devDep `vite-plugin-compression`，build 時同時產 `.gz` 與 `.br`；`scripts/publishPages.mjs` 同步 `dist/` 到 `gh-pages` 前過濾 `.gz` / `.br`（GH Pages 不認 br，避免冗檔）。
- `public/icons/{512,192,180}.png` 用 oxipng（無損）+ pngquant（有損 quality 80-95）兩階段壓縮；不做 maskable icon。
- `public/vite.ico`（256×256 PNG-in-ICO）改為 `public/favicon.ico`（32×32 + 16×16 多尺寸 ICO）；同步更新 `src/shared/config/publicAssets.ts` 的 `faviconFileName`、`index.html` 的 `<link rel="icon">`、`tests/unit/publicAssets.spec.ts` 的斷言。
- 刪除 `src/assets/{vue.svg,vite.svg,hero.png}` 三個 scaffold 殘留（已 grep 驗證無引用）；若 `src/assets/` 變空目錄則一併移除。
- `PROJECT_ARCHITECTURE.md` 同步更新：`vite.config.ts` 描述補上 visualizer / compression、favicon 描述更新、scaffold 三筆條目刪除。

## Non-Goals

- 不做 maskable icon（風險評估後暫緩）。
- 不做 image lazy-load 規範化（無 user-facing 圖片大量載入需求）。
- 不重組 `public/` 目錄結構或 PWA manifest icon descriptors 列表。
- 不擴張 `runtimeCaching` 至圖片（既有 navigation-only 設定不變）。
- 不引入 web font 或外部 CDN 資源。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `pwa-installation-metadata`: favicon 從 `vite.ico` 替換為 `favicon.ico`；apple-touch-icon 與 PWA icon descriptors 不變。

## Impact

- Affected specs: `pwa-installation-metadata`（修改）
- Affected code (modified):
  - vite.config.ts
  - scripts/publishPages.mjs
  - package.json
  - public/icons/180.png
  - public/icons/192.png
  - public/icons/512.png
  - index.html
  - src/shared/config/publicAssets.ts
  - tests/unit/publicAssets.spec.ts
  - PROJECT_ARCHITECTURE.md
- Affected code (new):
  - public/favicon.ico
- Affected code (removed):
  - public/vite.ico
  - src/assets/vue.svg
  - src/assets/vite.svg
  - src/assets/hero.png
- Dependencies (devDep, no production impact):
  - Added: rollup-plugin-visualizer、vite-plugin-compression
