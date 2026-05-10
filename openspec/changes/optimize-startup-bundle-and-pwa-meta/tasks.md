## 1. Icon 系統改用 unplugin-icons + fa6-solid

- [x] 1.1 安裝 devDep unplugin-icons 與 @iconify-json/fa6-solid，並移除三套 fortawesome dep（@fortawesome/fontawesome-svg-core、@fortawesome/free-solid-svg-icons、@fortawesome/vue-fontawesome）。完成定義：package.json 不再含 @fortawesome/* 三筆 dep。驗證：npm ls @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/vue-fontawesome 顯示三筆皆無安裝。
- [x] 1.2 vite.config.ts plugins 陣列加入 Icons compiler vue3；tsconfig.app.json compilerOptions.types 加入 unplugin-icons/types/vue。完成定義：build 設定可解析 ~icons/fa6-solid/xmark 樣式 import 並通過 TypeScript 編譯。驗證：npm run typecheck 通過。
- [x] 1.3 src/modules/exam/components/ExamModal.vue 替換 ✕ icon 為 IconXmark from ~icons/fa6-solid/xmark；既有 aria-label="關閉練習" 與 confirmClose emit 行為維持；✕ 圖示視覺尺寸、顏色、對齊位置與舊版一致（必要時加 inline style 補齊）。完成定義：✕ icon 渲染為 unplugin-icons inline SVG component；按鈕 a11y 名稱與 emit 事件契約不變；視覺輸出與舊版同畫素或人眼無感差異。驗證：tests/component/ExamModal.spec.ts 既有測試通過，並補測 close button 仍可以 a11y 名稱「關閉練習」被定位；PR 內附 ExamModal 開啟狀態 before/after 截圖對照。
- [x] [P] 1.4 PROJECT_ARCHITECTURE.md 新增「Icon 使用規範」章節，描述 unplugin-icons + iconify 流程、預設集合 fa6-solid、禁止 inline SVG path 與禁止重新引入 @fortawesome/* 整套。完成定義：文件含三條規範要點與新增 icon SOP。驗證：人工 review 章節覆蓋三條規範要點，並含找 icon 名稱（icones.js.org）的指引。

## 2. Vendor chunk 切一桶 vendor-vue 與 build.target 設為 es2020

- [x] 2.1 vite.config.ts build 區塊新增 target: 'es2020' 與 rollupOptions.output.manualChunks 設定 vendor-vue 一桶（vue 與 vue-router）。完成定義：production build 後 dist/assets/ 出現獨立 vendor-vue.[hash].js chunk 檔；es2020 語法不被降級為更舊版本。驗證：npm run build 通過、無 chunk 超 500KB 警告，並於 dist/assets/ 目錄列出 vendor-vue 開頭的 chunk 檔。

## 3. Workbox 啟用 cleanupOutdatedCaches 並補 navigation 機制

- [x] 3.1 vite.config.ts VitePWA workbox 區塊啟用 navigationPreload: true。滿足規格 Requirement「Service worker SHALL enable navigation preload for faster route transitions」。驗證：npx playwright test tests/e2e/route-switching-performance.spec.ts --project=chromium 通過；DevTools Application > Service Workers 可見 navigation preload enabled。
- [x] 3.2 vite.config.ts VitePWA workbox 區塊設 navigateFallback 為 appBasePath + 'index.html' 並設 navigateFallbackDenylist 為 [/^\/api\//]。滿足規格 Requirement「Service worker SHALL use the application base path for navigation fallback」。驗證：PLAYWRIGHT_PWA=1 npx playwright test tests/e2e/pwa-offline-route-cache.spec.ts 通過，含 staging 子路徑下的離線回訪情境。
- [x] 3.3 vite.config.ts VitePWA workbox 區塊啟用 cleanupOutdatedCaches: true。滿足規格 Requirement「Service worker SHALL use Workbox cleanupOutdatedCaches for version-aware cache replacement」。驗證：tests/unit/pwaLifecycleService.spec.ts 通過；PLAYWRIGHT_PWA=1 npx playwright test tests/e2e/pwa-offline-route-cache.spec.ts 通過；DevTools 中確認新 SW activate 後舊版 precache 由 Workbox 自動移除，更新進行中的舊 precache 仍可服務。

## 4. viewport-fit cover 與 safe-area padding 配套同做

- [x] 4.1 index.html head 補 description、color-scheme、theme-color meta（theme-color 須與 manifest 設定一致）；`<script type="module">` 從 `<body>` 搬至 `<head>`。滿足規格 Requirement「HTML head SHALL provide PWA installation and SEO metadata」。驗證：build 後 dist/index.html 含此三條 meta 且 theme-color 與 manifest 同值；tests/component/AppShellSmoke.spec.ts 通過。
- [x] 4.2 index.html head 補 apple-mobile-web-app-capable=yes、apple-mobile-web-app-status-bar-style=default、apple-mobile-web-app-title 三條 meta 與 apple-touch-icon link 指向 /icons/180.png。滿足規格 Requirement「HTML head SHALL provide iOS PWA installation hints」。驗證：人工 review build 後 dist/index.html 結構；iOS Safari 模擬器安裝至主畫面時 icon 與 title 正確顯示。
- [x] 4.3 index.html viewport meta content 加入 viewport-fit=cover。滿足規格 Requirement「HTML SHALL declare viewport-fit=cover for iPhone notch support」。**視覺一致性護欄**：本提案僅針對 iPhone notch 機種延伸背景；非 notch 裝置（桌機、無瀏海手機、iPad）視覺須與舊版完全一致。驗證：tests/e2e/practice-layout.smoke.spec.ts 與 tests/e2e/n5-grammar-layout.spec.ts 在 375px 視窗下通過；PR 內附桌面 1920×1080 與 Android 360×800（無瀏海）before/after 截圖對照，主要 layout 像素差異 ≤ 1px；iPhone 模擬器具 notch 機型確認背景延伸至瀏海區（此為刻意變更）。
- [x] 4.4 src/styles/main.css :root 新增 --safe-top、--safe-bottom、--safe-left、--safe-right CSS variables 對應 env(safe-area-inset-*)；body 套用左右 safe-area padding。滿足規格 Requirement「Sticky and fixed UI elements SHALL respect iPhone safe-area inset」之全域基礎部分。**視覺一致性護欄**：env() 在不支援裝置自動回退為 0，桌機與無瀏海裝置應無任何 layout 差異。驗證：人工 review main.css 變更；PR 內附桌面 + 無瀏海手機 before/after 截圖對照（layout 像素差 ≤ 1px）；iPhone notch 模擬器中 body 內容不被瀏海或圓角吃掉（此為刻意變更）。
- [x] [P] 4.5 src/shared/components/RouteTabs.vue scoped style sticky 區套用 padding-top: max(var(--safe-top), 既有 padding 值)。滿足規格 Requirement「Sticky and fixed UI elements SHALL respect iPhone safe-area inset」之 route tabs 部分。**視覺一致性護欄**：使用 max() 確保非 notch 裝置維持原 padding 不變。驗證：tests/component/AppShellSmoke.spec.ts 通過；PR 內附桌面 + 無瀏海手機的 route tabs before/after 截圖對照（無視覺差異）；iPhone notch 模擬器確認 route tabs 不被瀏海遮蓋（此為刻意變更）。
- [x] [P] 4.6 src/modules/practice/components/PracticeToolbar.vue scoped style sticky 或 fixed 區套用 padding-top: max(var(--safe-top), 既有 padding 值)。滿足規格 Requirement「Sticky and fixed UI elements SHALL respect iPhone safe-area inset」之 practice toolbar 部分。**視覺一致性護欄**：使用 max() 確保非 notch 裝置維持原 padding 不變。驗證：tests/e2e/practice-layout.smoke.spec.ts 通過；PR 內附桌面 + 無瀏海手機的 PracticeToolbar before/after 截圖對照（無視覺差異）；iPhone notch 模擬器確認 toolbar 不被瀏海遮蓋（此為刻意變更）。
- [x] [P] 4.7 src/modules/n5Grammar/components/N5GrammarSectionCard.vue scoped style sticky header 區套用 padding-top: max(var(--safe-top), 既有 padding 值)。滿足規格 Requirement「Sticky and fixed UI elements SHALL respect iPhone safe-area inset」之 N5 section header 部分。**視覺一致性護欄**：使用 max() 確保非 notch 裝置維持原 padding 不變；不影響 N5 section 完成 checkbox hit area 與展開動畫。驗證：tests/e2e/n5-grammar-layout.spec.ts 通過；PR 內附桌面 + 無瀏海手機的 N5GrammarSectionCard before/after 截圖對照（無視覺差異）；iPhone notch 模擬器確認 N5 sticky header 不被瀏海遮蓋（此為刻意變更）。

## 5. 字型改系統字型 stack

- [x] 5.1 src/styles/main.css font-family 替換為跨平台系統字型 stack（system-ui、-apple-system、Segoe UI、Hiragino Sans、Hiragino Kaku Gothic ProN、Microsoft JhengHei UI、PingFang TC、Helvetica Neue、Arial、sans-serif）。完成定義：字型改系統字型 stack 完成；無 web font 下載；DevTools Network 不再嘗試載入 Noto Sans TC。驗證：iPhone（PingFang TC）/ Android（Noto CJK）/ Windows（Microsoft JhengHei UI）三平台 visual diff 截圖留存於 PR；既有 component / smoke 測試全綠。

## 6. 量測與驗收

- [x] 6.1 執行 npm run typecheck、npm run lint、npm run test:unit。完成定義：三項皆綠。驗證：CI log 無錯誤、無 lint warning 退化。
- [x] 6.2 執行 npm run build；比對 dist 內 .js 與 .css 各檔的 gzip 大小，以及 entry chunk + vendor-vue chunk 大小，產出前/後對照表。完成定義：對照表貼進 PR；無 chunk 超 500KB 警戒線；vendor-vue chunk 出現於 dist/assets/。驗證：PR 內含對照表（markdown 表格或截圖）。
- [x] 6.3 執行 PLAYWRIGHT_PWA=1 npx playwright test tests/e2e/pwa-offline-route-cache.spec.ts、npx playwright test tests/e2e/route-switching-performance.spec.ts、tests/e2e/practice-layout.smoke.spec.ts、tests/e2e/n5-grammar-layout.spec.ts。完成定義：四項 e2e 全綠。驗證：CI log 顯示測試通過。
- [ ] 6.4 在 npm run preview 上跑 Lighthouse 抓 Performance / PWA / Best Practices 三分數，與 main 基線比對；同時在 iPhone notch 機型模擬器人工檢查三處 sticky header 不被瀏海遮蓋。完成定義：分數對比表 + 模擬器截圖貼進 PR。驗證：PR 含 Lighthouse 報告連結或截圖、含 iPhone 模擬器三張 sticky header 截圖。
