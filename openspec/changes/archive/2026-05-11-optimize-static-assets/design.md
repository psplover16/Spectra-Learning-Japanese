## Context

Wave 1 (`optimize-startup-bundle-and-pwa-meta`) 已完成 build 設定 + PWA workbox + index.html 與 unplugin-icons；Wave 2 (`establish-grammar-data-architecture`) 已完成 N5 拆檔與 v-if。本提案是 Wave 3 的靜態資產層收尾：

- `public/icons/512.png` 148 KB、`192.png` 32 KB、`180.png` 28 KB 都偏大（特別是 512 PNG 完全可無損壓 ~30%）。
- `public/vite.ico` 是 256×256 PNG-in-ICO；favicon 實際使用尺寸為 32×32 / 16×16，目前檔案是大量冗餘。
- `src/assets/vue.svg`、`vite.svg`、`hero.png` 為 Vite scaffold 預設素材，grep 全 src 確認 0 引用。
- 缺 chunk 視覺化工具（後續評估難）；無 pre-compression（gzip / br 在 build-time 預先產出可大幅減少 production server 壓縮負擔，雖然 GH Pages 自有 gzip 但本機 preview 與未來換平台仍受惠）。

## Goals / Non-Goals

**Goals:**

- PWA icons 兩階段壓縮（無損 → 有損），預期 512 KB 從 148 KB → 50~70 KB。
- Favicon 替換為合理尺寸（32+16 多尺寸 ICO），預期從 ~80 KB → < 5 KB。
- 移除 `src/assets/` scaffold 殘留三檔，瘦身 source tree。
- 加入 `rollup-plugin-visualizer`（dev-only）作為後續優化的量測工具。
- 加入 `vite-plugin-compression`（dev-only build plugin）產出預壓檔；改 `publishPages.mjs` 同步前過濾以避免冗檔上 `gh-pages`。
- 維持文本內容、UI 樣式、icon 視覺與舊版完全一致。

**Non-Goals:**

- 不做 maskable icon（Q11=A 暫緩）。
- 不重組 `public/` 結構或 PWA manifest icon descriptors。
- 不引入 web font / 外部 CDN / image lazy-load 規範化。
- 不擴張 Workbox `runtimeCaching` 至圖片。
- 不改 `tsconfig.app.json`、`eslint.config.js`、`vitest.config.ts` 等已穩定設定。

## Decisions

### PWA icons 壓縮：oxipng + pngquant 兩階段

**選擇**：用 `oxipng-bin` 做無損壓縮（先），再用 `pngquant-bin` 做 quality 80-95 有損壓縮（後）。透過 `npx <bin>` 呼叫，不裝 globally。

**替代方案**：

- 只做無損（oxipng）：保留 100% 像素品質但壓縮率有限（~30%）。
- 只做有損（pngquant）：直接做有損但跳過無損的「免費收益」。
- 換 WebP/AVIF：PWA installation icon 用 WebP/AVIF 仍需 PNG fallback；複雜度高、收益低。

**為何選兩階段**：先無損再有損可疊加效益（無損確保結構最佳，有損再壓縮 palette）；icon 在桌面顯示尺寸小，肉眼幾乎無法察覺有損品質差。

### Favicon 替換：ImageMagick 縮 32+16 多尺寸 ICO

**選擇**：用 `magick` 從 `public/icons/192.png` 縮成 32×32 + 16×16 + 48×48 + 64×64 多尺寸 `favicon.ico`。

**替代方案**：

- 維持 `vite.ico` 256×256：每次冷啟動瀏覽器抓一顆 ~80 KB 的 icon，純浪費。
- 用 sharp 或 png-to-ico npm 套件：避免系統 ImageMagick 依賴；本機環境可能無 ImageMagick。
- 線上工具（realfavicongenerator）：需手動，不可重複執行。

**為何選 ImageMagick**：本機已安裝；如未安裝，fallback 用 png-to-ico npm 套件；產出標準 favicon.ico。

### `rollup-plugin-visualizer` 條件啟用

**選擇**：`mode === 'analyze'` 才加入 plugin；`vite build` / `vite build --mode production` 不啟用。

**替代方案**：

- 永遠啟用：每次 build 都產 `dist/stats.html`，多餘輸出。
- 不裝：之後想分析 chunk 仍要回頭裝。

**為何選條件啟用**：dev-only、零 production 影響；需要時跑 `vite build --mode analyze`。

### `vite-plugin-compression` 同產 .gz + .br + publishPages 過濾

**選擇**：build 時同時產 `.gz`（zlib）與 `.br`（brotli）；threshold 設 1024 bytes（小檔不壓）；`scripts/publishPages.mjs` 在 sync 到 `gh-pages` 前過濾這兩種副檔。

**替代方案**：

- 只產 `.gz`：未來換平台（Cloudflare/Netlify/Vercel）仍要重 build。
- 不過濾：`gh-pages` 多 N 倍冗檔（GH Pages 不認 br），repo 變大。
- 直接讓 GH Pages 處理：on-the-fly gzip 仍然 OK，但本機 preview 與未來換平台無預壓收益。

**為何選此組合**：build-time 一次產出，未來換平台直接受惠；publish 腳本過濾避免 `gh-pages` 冗檔。

### scaffold 素材刪除

**選擇**：`git rm src/assets/{vue.svg,vite.svg,hero.png}`；若目錄空則 `rmdir`（git 不追蹤空目錄）。

**替代方案**：

- 保留：占空間、誤導開發者以為有用。
- 改用 `rm` 不入 git：留 untracked 檔案在工作區。

**為何選刪除**：grep 已驗證無引用；`PROJECT_ARCHITECTURE.md` 第 60~63 行同步移除三筆素材條目。

## Implementation Contract

**Behavior（使用者觀察）**：

- PWA installation icon 在桌面 / 主畫面顯示視覺與舊版一致（壓縮後肉眼無感差異；視覺一致性護欄）。
- 瀏覽器分頁 favicon 從舊 `vite.ico` 換為新 `favicon.ico`（32×32 ）；視覺由舊「Vite logo 大圖縮放」變為「Vite logo 小尺寸 sharper」。
- 桌機 / 模擬器 / 真機 開啟 PWA 時 layout、文本、UI 樣式、scroll 行為完全與舊版一致。
- `npm run build` 產出 `.gz` / `.br` 副檔；GH Pages 部署不含這些檔（publishPages.mjs 過濾）。
- `vite build --mode analyze` 產出 `dist/stats.html`（dev tool）。

**Interface / 設定形狀**：

- `vite.config.ts`：
  - `plugins` 陣列加入 `viteCompression({ algorithm: 'gzip', ext: '.gz', threshold: 1024 })` 與 `viteCompression({ algorithm: 'brotliCompress', ext: '.br', threshold: 1024 })`。
  - `mode === 'analyze'` 時加入 `visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true })`。
- `package.json` devDep 新增：`rollup-plugin-visualizer`、`vite-plugin-compression`、`oxipng-bin`、`pngquant-bin`。
- `public/icons/*.png`：透過 oxipng + pngquant 重寫；二進位內容變更但 file path、檔名、尺寸與透明度不變。
- `public/favicon.ico`：新檔，多尺寸 ICO（包含 16×16、32×32、48×48、64×64）。
- `public/vite.ico`：移除。
- `index.html`：`<link rel="icon" href="/vite.ico" />` 改為 `<link rel="icon" href="/favicon.ico" sizes="any" />`。
- `src/shared/config/publicAssets.ts`：`faviconFileName` 從 `'vite.ico'` 改 `'favicon.ico'`。
- `tests/unit/publicAssets.spec.ts`：對應斷言更新（以 `faviconFileName` 為 single source of truth，改動可能僅在常數）。
- `scripts/publishPages.mjs`：同步函式內加入過濾，跳過 `.gz` / `.br` 副檔。
- `src/assets/`：移除 `vue.svg`、`vite.svg`、`hero.png`；目錄空則一併移除。
- `PROJECT_ARCHITECTURE.md`：vite.config.ts 描述補 visualizer / compression、favicon 描述更新、scaffold 三筆條目移除。

**失敗模式**：

- oxipng / pngquant 透過 npx 找不到 → 回退到「跳過該階段」並在 commit 註明。
- ImageMagick 不存在 → fallback 用 `png-to-ico` npm 套件（pure JS）產 favicon.ico。
- vite-plugin-compression build 失敗 → 解除安裝該 dep 並降級為「只產 .gz」或「不啟用」。
- publishPages.mjs 過濾誤刪生產檔 → 部署前 `npm run preview` 真機驗證。

**Acceptance Criteria（驗收）**：

- `npm run typecheck` 通過。
- `npm run lint` 通過。
- `npm run test:unit` 通過（含 `tests/unit/publicAssets.spec.ts`）。
- `npm run build` 通過、無 chunk 超 500 KB；`dist/` 含 `.gz` 與 `.br` 副檔；`dist/icons/*.png` 容量比較表貼進 PR；`dist/favicon.ico` 體積 < 5 KB。
- `vite build --mode analyze` 產出 `dist/stats.html`。
- `npx playwright test tests/e2e/pwa-offline-route-cache.spec.ts --project=chromium`（PLAYWRIGHT_PWA=1 CI=1）通過：確認 favicon 替換不破 PWA 安裝。
- `scripts/publishPages.mjs` 模擬執行後產生的 `gh-pages` worktree 不含 `.gz` 或 `.br`。
- `tests/unit/publicAssets.spec.ts` 通過（驗證 favicon 檔名與內容）。

**Scope 邊界**：

- 在範圍內：`vite.config.ts`、`package.json`、`scripts/publishPages.mjs`、`public/icons/*.png`、`public/favicon.ico`（新）、`public/vite.ico`（刪）、`index.html`、`src/shared/config/publicAssets.ts`、`tests/unit/publicAssets.spec.ts`、`src/assets/`、`PROJECT_ARCHITECTURE.md`。
- 不在範圍：N5 文法資料、Workbox runtimeCaching 擴張、icon component 引用方式、PWA manifest icon descriptors 列表、其他 src/ 模組、其他測試檔。

## Risks / Trade-offs

- 若本機未安裝 ImageMagick，會 fallback 到 npm 套件 `png-to-ico`（增加一個 devDep）。Mitigation：兩種路徑都會產出標準多尺寸 ICO，效果一致。
- pngquant 有損壓縮在低 quality 設定下 icon 可能出現色階斷裂。Mitigation：quality 80-95 區間人眼不可辨；視覺護欄要求 PR 附 before/after icon 截圖。
- vite-plugin-compression 為 dev-only Vite plugin，但會增加 build-time。Mitigation：threshold 1024 跳過小檔；build 仍 < 10 秒。
- publishPages 過濾邏輯若誤刪非預期檔 → 部署破洞。Mitigation：過濾條件嚴格 `.gz` / `.br` 副檔結尾；本地 preview 真機驗證。

## Migration Plan

- 不涉及 user data schema、storage 格式、PWA cache 行為（cleanupOutdatedCaches 已在 Wave 1 加入；新 SW activate 後自動清舊版 precache）。
- 部署順序：merge dev → staging 自動部署 → 手動驗證 staging 真機 favicon + PWA icon 視覺 → merge master → production 部署。
- Rollback：純 git revert；icon 與 favicon 二進位 git history 保留可還原。

## Open Questions

無。所有討論已於 `_private/propose.md` 收斂。
