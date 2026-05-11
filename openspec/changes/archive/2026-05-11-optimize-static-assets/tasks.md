## 1. Build 工具加值（visualizer + compression）

- [x] 1.1 安裝 devDep `rollup-plugin-visualizer` 與 `vite-plugin-compression`。完成定義：package.json 含此兩 devDep。驗證：`npm ls rollup-plugin-visualizer vite-plugin-compression` 顯示 1 級安裝。
- [x] 1.2 vite.config.ts 條件啟用 `visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true })`（`mode === 'analyze'`），加入 `viteCompression` 兩條（gzip + brotliCompress，threshold 1024）。實作 design 決策「`rollup-plugin-visualizer` 條件啟用」與「`vite-plugin-compression` 同產 .gz + .br + publishPages 過濾」之 vite 部分。完成定義：`vite build` 通過，dist 內含 `.gz` 與 `.br` 副檔；`vite build --mode analyze` 產出 `dist/stats.html`。驗證：兩次 build 命令均成功；ls dist 內可見 `.gz` 與 `.br` 副檔；analyze 模式產 `dist/stats.html`。
- [x] 1.3 scripts/publishPages.mjs sync `dist/` 到 `gh-pages` 之前過濾 `.gz` 與 `.br` 副檔。實作 design 決策「`vite-plugin-compression` 同產 .gz + .br + publishPages 過濾」之 publish 腳本部分。完成定義：sync 函式內針對 file path endsWith('.gz') 或 endsWith('.br') 直接 return / skip。驗證：本地模擬執行 publishPages 後，gh-pages worktree 不含 `.gz` 或 `.br` 副檔（人工 review）。

## 2. PWA icons 兩階段壓縮

- [x] 2.1 用 `oxipng-bin` 對 public/icons/{512,192,180}.png 做無損最強壓縮（`-o max --strip safe`）；用 `pngquant-bin` 後續做 quality 80-95 有損壓縮（`--strip --force`）。實作 design 決策「PWA icons 壓縮：oxipng + pngquant 兩階段」。完成定義：三檔總大小較壓縮前下降 ≥ 30%。**視覺一致性護欄**：icon 桌面 / 主畫面顯示與壓縮前肉眼無感差異。驗證：`ls -lh public/icons/*.png` 對照表貼進 PR；`tests/unit/publicAssets.spec.ts` 通過；PR 內附 icon 桌面顯示 before/after 截圖（無視覺差異）。

## 3. Favicon 替換為合理尺寸

- [x] 3.1 用 ImageMagick `magick` 從 `public/icons/192.png` 縮成 32×32 + 16×16 + 48×48 + 64×64 多尺寸 ICO 寫入 `public/favicon.ico`。若本機無 `magick`，退回用 `png-to-ico` npm 套件（pure JS）產出。完成定義：`public/favicon.ico` 存在，<5 KB。驗證：`file public/favicon.ico` 顯示 `MS Windows icon resource`。
- [x] 3.2 移除 `public/vite.ico`；更新 `index.html` `<link rel="icon" href="/vite.ico" />` 改 `<link rel="icon" href="/favicon.ico" sizes="any" />`；更新 `src/shared/config/publicAssets.ts` `faviconFileName: 'vite.ico'` 改 `'favicon.ico'`。實作 design 決策「Favicon 替換：ImageMagick 縮 32+16 多尺寸 ICO」；滿足規格 Requirement「Favicon SHALL be a multi-size ICO sized appropriately for browser tabs」。完成定義：vite.ico 從 public/ 移除；index.html 與 publicAssets.ts 同步指向 favicon.ico。驗證：`tests/unit/publicAssets.spec.ts` 通過；`npm run build` 後 `dist/favicon.ico` 存在、`dist/vite.ico` 不存在；瀏覽器分頁 favicon 正常顯示。

## 4. 刪除 src/assets/ scaffold 殘留

- [x] 4.1 `git rm src/assets/{vue.svg,vite.svg,hero.png}`；若 `src/assets/` 變空目錄則一併移除。實作 design 決策「scaffold 素材刪除」。完成定義：三個檔案從 git 與工作區移除；`grep -r 'vue.svg\|vite.svg\|hero.png' src/` 無結果（除自身外）。驗證：`npm run typecheck` 與 `npm run build` 通過、無 reference error。

## 5. 文件同步

- [x] 5.1 PROJECT_ARCHITECTURE.md 更新：vite.config.ts 描述補上 visualizer / compression；favicon 描述從 `vite.ico` 改 `favicon.ico`；移除 `src/assets/` 三筆 scaffold 條目。完成定義：三段描述同步本提案實際變更。驗證：人工 review 文件涵蓋三項要點。

## 6. 量測與驗收

- [x] 6.1 執行 npm run typecheck、npm run lint、npm run test:unit。完成定義：三項皆綠。驗證：CI log 無錯誤。
- [x] 6.2 執行 npm run build；對照 dist 的 icon 大小（before / after）+ 出現 `.gz` 與 `.br` 副檔；dist/favicon.ico < 5 KB；無 chunk 超 500 KB 警戒線。完成定義：對照表貼進 PR。驗證：PR 內含對照表 + dist 目錄列表截圖。
- [x] 6.3 執行 PLAYWRIGHT_PWA=1 CI=1 PLAYWRIGHT_PORT=4175 npx playwright test tests/e2e/pwa-offline-route-cache.spec.ts --project=chromium。完成定義：通過。驗證：CI log 顯示測試通過；確認 favicon 替換不破 PWA 安裝。
