# Proposal（定稿）— 本專案啟動效能與打包體積全面優化

> 此檔由 `/spectra-discuss` 產出。輸入：`_private/discuss.txt`（共 13 項：A1~A4、B1~B6+B5b、C1~C6、D1~D3）。
> **狀態：定稿** — 全部問題已收斂，可直接以 `/spectra-propose` 立案。

---

## 0. 決策一覽（全部已定）

| # | 決策 | 影響 |
|---|---|---|
| Q1 | **A** — 本提案內順手補 safe-area padding | Wave 1 範圍含 4 檔 safe-area padding 配套 |
| Q2 | **A** — 顯式設 `navigateFallback: appBasePath + 'index.html'` + `navigationPreload: true` | A3-safe 包含這兩個 flag |
| Q3 | **A** — `target: 'es2020'` | iOS Safari ≥14、Android Chrome ≥85 |
| Q4 | **C** — 改用 `unplugin-icons` + iconify，並寫成新增 icon 規則 | A1 改用 unplugin-icons；新增 icon 規範至 `PROJECT_ARCHITECTURE.md` |
| Q4-extra | **i** — `@iconify-json/fa6-solid` | 與既有 `faXmark` 視覺一致、最小變動 |
| Q5 | **A** — 改用系統字型 stack | B1 解決方案確認 |
| Q6 | **A** — `vendor-vue: ['vue', 'vue-router']` 一桶 | A2 manualChunks 顆粒度確認 |
| Q7 | **A** — Wave 1 用 1 個 PR、多 commit | 量測一次到位 |
| Q8 | 自寫 — `description = "Duotify 日語學習"` | A4 文案確認 |
| **Q9** | **5 個跨級分類 + 升級為 `establish-grammar-data-architecture`** | N5 拆 5 檔 + v-if + 跨 N 級架構規範 |
| Q10 | **B** — 產 `.gz + .br`，改 `publishPages.mjs` 過濾 | B4 含 publish 腳本變更 |
| Q11 | **A** — 只做 oxipng + pngquant，不做 maskable | B5 簡化為兩階段壓縮 |
| Q12 | **A** — 新檔名 `favicon.ico` | B5b 確認 |
| Q13 | **A** — 不做 `requestIdleCallback` 包 launch update | C3 移出範圍 |
| Q14 | **B** — 不做 incremental TS build | C4 移出範圍 |
| Q15 | **B** — 不做 `<img>` 屬性規範文件化 | C5 移出範圍 |
| Q16 | **C** — 不做觀察指標自動化 | C6 移出範圍 |

---

## 1. 背景與動機

### 1.1 為什麼要做

Duotify 是個人專案、純前端 PWA、已上線。觀察：
- `vite.config.ts` 沒做 vendor chunk 切分 → 每次 src 改動，使用者都要重抓所有第三方依賴。
- `ExamModal.vue` 為了一個 ✕ 圖示拖了三個 fortawesome 套件。
- `index.html` 只有 4 行 head，缺基本 SEO/PWA meta。
- `main.css` 字型設定意圖不清（指定 Noto Sans TC 但未引入 web font）。
- `public/icons/512.png` 148KB、`public/vite.ico` 256×256 都偏大。
- `src/assets/` 內三張 scaffold 殘留（vue.svg / vite.svg / hero.png），grep 確認 src 內無引用。
- N5 文法資料 176KB 一檔且未做章節拆分；section content 用 `v-show` 一次全 render。

### 1.2 為什麼是現在

- 最近合併的 `fix-pwa-update-cache-retention`（commit `972e41d`）把 PWA 快取行為穩定下來，上層優化建立在穩定基底上比較安全。
- 個人專案、無外部協作壓力，是做基礎建設的好時機。
- discuss.txt 已詳列 13 項，討論已經足夠成熟。
- N5 內容大致穩定（v11~v16），是建立**跨 N 級文法資料架構**的好時機，讓未來 N4/N3/N2/N1 上路時直接套用。

---

## 2. 全項目地圖（discuss.txt 完整對照）

依「投入產出比 × 風險」整理為三波 + 不做。**已套用全部決策**。

### Wave 1：build / entry / CSS 級設定（最高 ROI、blast radius 可控）— 1 個 PR、多 commit

| 編號 | 內容 | 變動位置 | 風險 |
|---|---|---|---|
| A1 | 移除 FontAwesome 三套依賴，改用 `unplugin-icons` + `@iconify-json/fa6-solid`（**Q4=C、Q4-extra=i**）| `ExamModal.vue` + `vite.config.ts` + `package.json` + `tsconfig.app.json` + `PROJECT_ARCHITECTURE.md`（新增 icon 規範段） | 低（a11y `aria-label="關閉練習"` 已存在於第 97 行） |
| A2 | Vite `manualChunks: { 'vendor-vue': ['vue', 'vue-router'] }` + `target: 'es2020'`（含 C1）（**Q3=A、Q6=A**） | `vite.config.ts` | 低 |
| A3 | Workbox 啟用 `navigationPreload` + `navigateFallback: appBasePath + 'index.html'` + `cleanupOutdatedCaches: true`（**Q2=A，已對齊最新 dev spec**） | `vite.config.ts` | 低（與 `fix-pwa-update-cache-retention` 新增 spec 一致，由 Workbox lifecycle 管理版本化清理） |
| A4 | `index.html` 補 SEO/PWA meta、`viewport-fit=cover` + safe-area padding 配套（**Q1=A、Q8=自寫**） | `index.html` + `RouteTabs.vue` + `PracticeToolbar.vue` + `N5GrammarSectionCard.vue` + `main.css` | 中（範圍擴大到 5 檔） |
| B1 | 字型策略：改成系統字型 stack（**Q5=A**） | `src/styles/main.css` | 低（純 CSS） |

### Wave 2：N5 重構（含跨級架構）+ 資產壓縮 + 量測

| 編號 | 內容 | 變動位置 | 風險 |
|---|---|---|---|
| B2（升級） | **N5 文法資料 5 大跨 N 級分類 + 拆 5 檔 + v-if 改造**（**Q9=1**）| `n5Grammar/types/`、`n5Grammar/data/`、`useN5GrammarSections.ts`、`N5GrammarSectionCard.vue`、`PROJECT_ARCHITECTURE.md` | 中高（建立跨級架構規範） |
| B3 | 加 `rollup-plugin-visualizer`（dev only） | `vite.config.ts`、`package.json` devDeps | 低 |
| B4 | 加 `vite-plugin-compression`（產 `.gz + .br`）+ 改 `publishPages.mjs` 過濾（**Q10=B**） | `vite.config.ts`、`scripts/publishPages.mjs` | 低 |
| B5 | PWA icons 用 oxipng + pngquant 兩階段壓縮，**不做 maskable**（**Q11=A**） | `public/icons/*.png` | 低 |
| B5b | favicon 從 `vite.ico`(256×256) 改為 `favicon.ico`(32+16)（**Q12=A**） | `public/`、`index.html`、`src/shared/config/publicAssets.ts`、`tests/unit/publicAssets.spec.ts` | 中 |

### Wave 3：清理與規範

| 編號 | 內容 | 狀態 |
|---|---|---|
| B6 | 刪除 `src/assets/{vue.svg,vite.svg,hero.png}`，更新架構文件 | 保留（風險低） |
| C1 | `build.target` 顯式宣告 | 已併入 A2 |
| C2 | `main.css` 內 route-specific 樣式拆進各 view 的 `<style scoped>` | 保留評估（高風險） |
| C3 | `triggerLaunchUpdateCheck()` 包進 `requestIdleCallback` | **不做（Q13=A）** |
| C4 | `vue-tsc --build`（incremental） | **不做（Q14=B）** |
| C5 | 全站 `<img>` 統一加 `loading="lazy" decoding="async"` | **不做（Q15=B）** |
| C6 | 加 Lighthouse CI 或 e2e 蒐集 navigation timing | **不做（Q16=C）** |

### 不做（D 系列）— 已釐清放棄理由

| 編號 | 內容 | 不做原因 |
|---|---|---|
| D1 | SSR / SSG | PWA 重複造訪 + 離線為主，SEO 不是核心 KPI |
| D2 | 換 router / 引入 pinia | 規模未到，純成本 |
| D3 | `jpWords_N*.ts` 改 JSON 由 fetch | 失去型別防護，是退步 |

---

## 3. 提案如何拆分（4 個獨立變更）

| 變更代號 | 包含 | 為何分一組 |
|---|---|---|
| 1. `optimize-startup-bundle-and-pwa-meta`（Wave 1） | A1 + A2/C1 + **A3 全套** + A4 + B1 | 都是 build/entry/CSS 設定，可一次量測；A3 全套（含 `cleanupOutdatedCaches`）與最新 dev `fix-pwa-update-cache-retention` spec 一致 |
| 2. `establish-grammar-data-architecture`（Q9 升級） | B2 跨 N 級 5 大分類 + N5 拆 5 檔 + v-if + 文件規範 | 行為變更 + 跨級架構，須單獨設計與 spec 回寫 |
| 3. `optimize-static-assets` | B5 + B5b + B6 + B3 + B4 | 都是資產類 + build 工具加值；B3/B4 為下一階段量測做準備 |
| 4. `cleanup-css-route-scoping` | C2 | 高風險（涉及 `RouteOwnership.spec.ts`），單獨提案；可選擇延後或不做 |

**變動點 vs 上一版**：
- 原本拆 5 個變更，**取消 `optimize-pwa-cache-strategy`**。
- 原因：讀完 dev 最新 commits（`972e41d` fix-pwa-update-cache-retention）後確認 `cleanupOutdatedCaches` 是該 spec 明確指定的「Workbox normal lifecycle」清理機制，非衝突。A3 全套可直接進 Wave 1。

**建議實作順序**：1 → 3 → 2 → 4。理由：
- 先做 1（最大 ROI、blast radius 最可控）
- 接著 3（資產類最簡單，B3 visualizer 也提早量測 N5 chunk）
- 然後 2（架構性變更，依 3 的量測決定優先級）
- 4 可選（C2 風險高、收益不明，可不做）

---

## 4. 各項詳細變更（已套用所有決策）

### A1. 移除 FontAwesome，改用 `unplugin-icons` + `fa6-solid`（Q4=C、Q4-extra=i）

**現況**：`ExamModal.vue` 第 3-4 行 import `FontAwesomeIcon` 與 `faXmark`，其餘地方無引用。第 97 行 `<button aria-label="關閉練習">`。

**做法**：

1. 安裝 devDep：
   ```bash
   npm i -D unplugin-icons @iconify-json/fa6-solid
   ```

2. `vite.config.ts` 加 plugin：
   ```ts
   import Icons from 'unplugin-icons/vite';

   plugins: [
     vue(),
     Icons({ compiler: 'vue3' }),
     VitePWA({...})
   ]
   ```

3. `ExamModal.vue` 替換：
   ```ts
   // 移除：
   // import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
   // import { faXmark } from '@fortawesome/free-solid-svg-icons';

   // 改成：
   import IconXmark from '~icons/fa6-solid/xmark';
   ```
   ```vue
   <!-- template 內 -->
   <IconXmark aria-hidden="true" />
   ```

4. 移除 `package.json` 三個 fortawesome dependency。

5. `tsconfig.app.json` 補 type 解析：
   ```json
   { "compilerOptions": { "types": ["unplugin-icons/types/vue"] } }
   ```

6. **新增 icon 使用規範**（依 Q4 要求）— 寫進 `PROJECT_ARCHITECTURE.md` 新章節「Icon 使用規範」：
   ```markdown
   ## Icon 使用規範

   - 全站 icon 統一透過 `unplugin-icons` + iconify 引入。
   - 預設集合：`@iconify-json/fa6-solid`（已安裝）。
   - 新增 icon 流程：
     1. 到 https://icones.js.org 找名稱（搜尋 set/name，例如 fa6-solid/xmark）
     2. 確認該 set 的 `@iconify-json/<set>` 已安裝；未安裝則 `npm i -D @iconify-json/<set>`
     3. 在 .vue 內 `import IconName from '~icons/<set>/<name>'`，當 component 用：`<IconName />`
   - 禁止：直接 inline `<svg>` path（除非 iconify 真的找不到）
   - 禁止：重新引入 `@fortawesome/*` 整套
   ```

**所有權**：✕ 圖示僅出現於 `ExamModal.vue`（正向）；fortawesome 移除後不殘留於任何 `.vue/.ts`（反向）。

**bundle 影響**：移除 fortawesome 3 套（gzip 前估 30~80 KB）；unplugin-icons + 用到的單一 icon path ≈ 200~400 bytes；`@iconify-json/fa6-solid` 是 devDep，不入 production。

---

### A2. Vite vendor chunk + es2020 target（含 C1）— Q3=A、Q6=A

**做法**：
```ts
build: {
  chunkSizeWarningLimit: 500,
  target: 'es2020',
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-vue': ['vue', 'vue-router']
      }
    }
  }
}
```

**目標瀏覽器矩陣**（design.md 須記錄）：iOS Safari ≥14、Android Chrome ≥85，皆全支援 es2020。

**量化指標**：第二次造訪 vendor-vue.*.js 應命中瀏覽器快取（Network 顯示 304 / from disk cache）。

---

### A3. Workbox 全套（`navigationPreload` + `navigateFallback` + `cleanupOutdatedCaches`）— Q2=A

**做法**：
```ts
workbox: {
  globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest}'],
  navigationPreload: true,
  navigateFallback: appBasePath + 'index.html',
  navigateFallbackDenylist: [/^\/api\//],
  cleanupOutdatedCaches: true
}
```

**為何 navigateFallback 走 `appBasePath`**：GH Pages 部署在 `/Spectra-Learning-Japanese/`（production）或 `/Spectra-Learning-Japanese/staging/`（staging），寫死 `/index.html` 在 staging 子路徑下會 404。

**為何啟用 `cleanupOutdatedCaches`（不再排除）**：
- 最新 dev 已合併 `fix-pwa-update-cache-retention`（commit `972e41d`），其 commit message 明寫：「**讓 Workbox precache 與 `cleanupOutdatedCaches` 接管版本化資源替換**」。
- 該 change 新增的 `pwa-update-check-on-launch/spec.md` requirement：「leave Workbox-managed precache entries available until **Workbox replaces outdated caches through its normal lifecycle**」 — `cleanupOutdatedCaches` 正是此「normal lifecycle」機制。
- 機制：新 SW activate 時才清舊版精準快取，**不會在更新進行中清空 cache**，符合「保留離線快取」契約。
- `tests/e2e/pwa-offline-route-cache.spec.ts` 是此契約的回歸測試，本提案 PR 必跑。

**為何排除 `runtimeCaching`**：目前 `public/icons/*` 已被 precache，沒有 user-generated 或外部 CDN 圖片需求。

---

### A4. `index.html` 補 SEO/PWA meta + `viewport-fit=cover` + safe-area padding 配套（Q1=A、Q8）

**做法 A4-1（index.html）**：
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

  <title>Duotify 日語學習 PWA</title>
  <meta name="description" content="Duotify 日語學習" />
  <meta name="color-scheme" content="light" />
  <meta name="theme-color" content="#b45a32" />

  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="Duotify" />
  <link rel="apple-touch-icon" href="/icons/180.png" />

  <link rel="icon" href="/vite.ico" /> <!-- B5b 完成後改為 /favicon.ico -->

  <script type="module" src="/src/app/main.ts"></script>
</head>
```

**做法 A4-2（safe-area padding 配套）**：

iPhone 瀏海下，sticky/fixed header 須加 `env(safe-area-inset-top)`。修改 4 個檔：

1. `src/styles/main.css`：宣告 root variable + body 預設左右安全區
   ```css
   :root {
     --safe-top: env(safe-area-inset-top, 0px);
     --safe-bottom: env(safe-area-inset-bottom, 0px);
     --safe-left: env(safe-area-inset-left, 0px);
     --safe-right: env(safe-area-inset-right, 0px);
   }
   body {
     padding-left: var(--safe-left);
     padding-right: var(--safe-right);
   }
   ```

2. `src/shared/components/RouteTabs.vue`：sticky header 上方補 safe-top
   ```css
   padding-top: max(var(--safe-top), <既有 padding>);
   ```

3. `src/modules/practice/components/PracticeToolbar.vue`：若有 sticky/fixed 子元素，套用同樣處理。

4. `src/modules/n5Grammar/components/N5GrammarSectionCard.vue`：sticky section header 套用 `var(--safe-top)`。

**驗證**：既有 `tests/e2e/practice-layout.smoke.spec.ts` / `n5-grammar-layout.spec.ts` 跑 375px 視窗應仍通過。

---

### B1. 字型策略：系統字型 stack（Q5=A）

**做法**：`main.css` 第 8 行替換為：
```css
font-family:
  system-ui,
  -apple-system,
  "Segoe UI",
  "Hiragino Sans",
  "Hiragino Kaku Gothic ProN",
  "Microsoft JhengHei UI",
  "PingFang TC",
  "Helvetica Neue",
  Arial,
  sans-serif;
```

**驗收**：在 iPhone（PingFang TC）、Android（Roboto + Noto CJK）、Windows（Microsoft JhengHei UI）各看一次，記錄 visual diff 進 design.md。

---

### B2. **N5 文法資料 5 大跨 N 級分類 + 拆 5 檔 + v-if 改造（Q9=1）**

**這是獨立變更 `establish-grammar-data-architecture`，非 Wave 1 範圍**。

#### 跨 N 級分類規範（核心架構決策）

定義 **5 個跨 N1~N5 通用的 category**：

| category | 涵蓋內容 | N5 預估 | N4-N1 趨勢 |
|---|---|---|---|
| `particles` | 助詞 (は、が、を、より、ながら...) | 12 | 各級 3-5 個 |
| `fundamentals` | 指示詞、疑問詞、數字、時間、副詞、接續詞 | 4 | 各級 1-2 個 |
| `sentence-patterns` | 句型、條件、連接、文末表現 | 6 | N4-N1 各 8-15 個（最大成長） |
| `expressions` | 推測、傳聞、慣用句、書面/古典語法 | 0 | N4-N1 各 5-15 個 |
| `honorifics` | 敬體、尊敬語、謙讓語、丁寧語 | 1 | N4-N1 各 1-5 個 |

**規範文字（寫進 PROJECT_ARCHITECTURE.md）**：
```markdown
## N1~N5 文法資料分類規範

每個 N 級的 grammar section 必須屬於以下 5 個 category 之一：

- particles: 助詞
- fundamentals: 指示詞、疑問詞、數字、時間、副詞、接續詞
- sentence-patterns: 句型、條件、連接、文末表現
- expressions: 推測、傳聞、慣用句、書面/古典語法
- honorifics: 敬體與敬語體系

新增 section 流程：
1. 看主題 → 是助詞嗎？→ particles
2. 不是助詞，是「補助詞類」嗎？→ fundamentals
3. 講「句型結構/連接」？→ sentence-patterns
4. 講「禮貌等級/敬語」？→ honorifics
5. 其他都是 expressions

模糊邊界處理：
- 「敬體句型」優先 sentence-patterns（重點是「句型」）
- 「敬語動詞」優先 honorifics（重點是「敬語體系」）

未來 N4/N3/N2/N1 上路時：
- 各級獨立 module（如 `src/modules/n4Grammar/`），不抽 shared module
- 同樣的 5 大 category 規範
- 各級 category union type 獨立定義（subCategory 不跨級共用）
```

#### N5 重組為 5 檔

```
src/modules/n5Grammar/data/
├ sections/
│  ├ particles.ts        ← 12 個助詞
│  ├ fundamentals.ts     ← 5 個（詞類總覽 + 指示詞 + 疑問詞 + 數字 + 時間）
│  ├ sentence-patterns.ts ← 6 個（敬體句型 + 狀態變化 + できる + 邀約等）
│  ├ expressions.ts      ← 空陣列（保留結構，等 N4+ 填）
│  └ honorifics.ts       ← 1 個（敬體變化速覽）
└ grammarNotes.ts        ← 變 barrel：合併 + sort + re-export sortedN5GrammarSections
```

12 個 core sections 對應到新分類：

| section id | 新 category |
|---|---|
| `core-term-usage-overview` | fundamentals |
| `polite-overview` | honorifics |
| `sentence-basics` | sentence-patterns |
| `past-and-state` | sentence-patterns |
| `invitation-comparison` | sentence-patterns |
| `state-change-naru` | sentence-patterns |
| `state-change-suru` | sentence-patterns |
| `dekiru-ability` | sentence-patterns |
| `question-words` | fundamentals |
| `demonstratives` | fundamentals |
| `numbers` | fundamentals |
| `time-expressions` | fundamentals |

12 個 particle sections 全部進 `particles.ts`（既有 category 不變）。

#### Type 強制（保護層 1）

`src/modules/n5Grammar/types/grammarNotes.ts`：
```ts
export type N5GrammarCategory =
  | 'particles'
  | 'fundamentals'
  | 'sentence-patterns'
  | 'expressions'
  | 'honorifics';

export interface N5GrammarSection {
  id: string;
  title: string;
  category: N5GrammarCategory;  // ← TS union 強制
  // ...其餘欄位不變
}
```

#### 並行載入（useN5GrammarSections）

```ts
const defaultSectionsLoader = async () => {
  const [particles, fundamentals, sentencePatterns, expressions, honorifics] = await Promise.all([
    import('@/modules/n5Grammar/data/sections/particles'),
    import('@/modules/n5Grammar/data/sections/fundamentals'),
    import('@/modules/n5Grammar/data/sections/sentence-patterns'),
    import('@/modules/n5Grammar/data/sections/expressions'),
    import('@/modules/n5Grammar/data/sections/honorifics')
  ]);
  return {
    sortedN5GrammarSections: [
      ...particles.sections,
      ...fundamentals.sections,
      ...sentencePatterns.sections,
      ...expressions.sections,
      ...honorifics.sections
    ].sort(/* 既有 sort 邏輯 */)
  };
};
```

**錯誤處理**：5 個之中任一失敗 → 仍歸為 `loadError = 'N5文法資料載入失敗'`（與現況一致，view 顯示 error shell）。

#### v-if 改造

`src/modules/n5Grammar/components/N5GrammarSectionCard.vue` 第 93 行：
```diff
- v-show="contentVisible"
+ v-if="contentVisible"
```

**效果**：未展開的 section 內容根本不在 DOM 中。首次進入 N5 頁時 DOM node 數量大幅減少。

#### 測試強制（保護層 2）

新增 `tests/unit/n5GrammarData.spec.ts` 補充測試：
```ts
test('sections/particles.ts 內所有 section category 都是 particles', () => {
  expect(particles.sections.every(s => s.category === 'particles')).toBe(true);
});
// 對 fundamentals / sentence-patterns / expressions / honorifics 各一條
```

#### 既有測試影響

- `tests/component/N5GrammarSections.spec.ts`：v-if 後 expand 行為 → 補測 DOM 在展開後才出現。
- `tests/component/N5GrammarViewSmoke.spec.ts`：smoke 應仍通過（loading shell + 最終 render 不變）。
- `tests/unit/useN5GrammarSections.spec.ts`：mock loader 介面從「回傳 1 個 module」改為「並行 5 個 module」。
- `tests/unit/n5GrammarData.spec.ts`：原本驗證 sortedN5GrammarSections 的測試需改成從 barrel import。

#### 規格回寫

- `route-switching-performance/spec.md` 補「N5 文法 section 內容採 lazy DOM rendering（v-if）」契約。
- `n5-grammar-section-completion/spec.md` 確認 v-if 不影響完成 checkbox 狀態同步（既有 `completedSectionIds` 是 view 層 state，不受 v-if 影響）。

#### 預期效益

| 指標 | 現況 | 改造後 |
|---|---|---|
| N5 chunk 數量 | 1 檔（176KB raw） | 5 檔並行（~30~80KB raw 各） |
| 並行下載最長路徑 | 176 KB | ~80 KB |
| 首次進入 DOM node 數 | 全部 24 sections × 內容 | 只有 24 個 card 標題 |
| 首次展開某 section | 0 ms（CSS） | 5~30 ms（建 DOM） |

---

### B3. `rollup-plugin-visualizer`（dev only）

**做法**：
```bash
npm i -D rollup-plugin-visualizer
```
```ts
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  vue(),
  Icons({ compiler: 'vue3' }),
  VitePWA({...}),
  mode === 'analyze' && visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true })
].filter(Boolean)
```
跑法：`vite build --mode analyze` → 開 `dist/stats.html`。

**用途**：B3 完成後可量測 N5 chunk 拆檔前/後實際大小，驗證 B2 收益。

---

### B4. Pre-compression（Q10=B）

**做法**：
```bash
npm i -D vite-plugin-compression
```
```ts
import viteCompression from 'vite-plugin-compression';

plugins: [
  ...,
  viteCompression({ algorithm: 'gzip', ext: '.gz', threshold: 1024 }),
  viteCompression({ algorithm: 'brotliCompress', ext: '.br', threshold: 1024 })
]
```

**改 `scripts/publishPages.mjs`**：sync `dist/` 到 `gh-pages` 之前過濾 `.gz` 與 `.br`：
```js
if (file.endsWith('.gz') || file.endsWith('.br')) return;
```

**驗收**：build 後 `dist/` 內出現 `.gz / .br`；publish 後 `gh-pages` worktree 不應有這兩種檔。

---

### B5. PWA icons 兩階段壓縮（Q11=A）

**做法**：
```bash
# Step 1：無損
npx oxipng-bin -o max --strip safe -i 0 -p public/icons/512.png
npx oxipng-bin -o max --strip safe -i 0 -p public/icons/192.png
npx oxipng-bin -o max --strip safe -i 0 -p public/icons/180.png

# Step 2：有損（視覺允許）
npx pngquant-bin --quality 80-95 --strip --force --output public/icons/512.png public/icons/512.png
# ...同 192/180
```

**預期**：512 從 148KB → 50~70KB（合計兩階段）。

**驗收**：build 後 `dist/icons/*.png` 容量比較表貼進 PR；`tests/unit/publicAssets.spec.ts` 必跑。

---

### B5b. favicon 替換（Q12=A）

**做法**：
```bash
magick public/icons/192.png -define icon:auto-resize=64,48,32,16 public/favicon.ico
```

- 改 `index.html` 的 `<link rel="icon" href="/favicon.ico" sizes="any" />`。
- 改 `src/shared/config/publicAssets.ts` 的 `faviconFileName: 'favicon.ico'`。
- 改 `tests/unit/publicAssets.spec.ts` 對應斷言。
- 移除 `public/vite.ico`。
- 更新 `PROJECT_ARCHITECTURE.md` 第 30 / 41 行 `vite.ico` → `favicon.ico` 的描述。

---

### B6. 刪除 scaffold 殘留

**做法**：
```bash
git rm src/assets/vue.svg src/assets/vite.svg src/assets/hero.png
```
更新 `PROJECT_ARCHITECTURE.md` 第 60~63 行的素材描述。

---

### C2. CSS route-specific 樣式拆進各 view（保留評估，高風險）

**做法**：把 `main.css` 內 `[data-route="practice"] ...` 等區塊搬進對應 view 的 `<style scoped>`。

**風險**：`tests/component/RouteOwnership.spec.ts` 驗證 N5 內容不外溢，selector scope 變化可能破測。獨立提案 `cleanup-css-route-scoping` 處理；可選擇延後或不做。

---

### C3 / C4 / C5 / C6 — 不做

依 Q13/Q14/Q15/Q16 移出範圍。

---

### D1 / D2 / D3 — 不做

維持 discuss.txt 結論。

---

## 5. Non-goals（明確不做）

- C3 / C4 / C5 / C6（已決議不做）。
- D1 / D2 / D3（已決議不做）。
- 引入 jQuery / Bootstrap / UI Kit / 任何 UI 元件庫（憲法反模式）。
- 新增伺服器端功能、analytics、帳號系統（憲法反模式）。
- Pinia 引入。
- maskable PWA icon（Q11=A 暫緩）。
- N4/N3/N2/N1 module 建立（Q9 只動 N5；架構規範文件化等 N4 真的要做時才開新 module）。
- 抽 `grammar-shared/` 共用 module（為未來預先抽象，違反憲法）。

---

## 6. Impact 總覽（憲法逐條對齊）

### 憲法 I（最簡可行解）
- 各項都選最簡解：A2 只切 vue-router、A3 只啟兩個 flag、B1 系統字型 stack、B2 只動 N5（不抽 shared module）。
- A1 用 `unplugin-icons` 雖比 inline SVG 多工具鏈，但建立**未來新增 icon 的標準路徑**，避免 ad-hoc。

### 憲法 II（測試先行）
- 既有測試必跑：`ExamModal.spec.ts`、`practice-layout.smoke.spec.ts`、`n5-grammar-layout.spec.ts`、`pwa-offline-route-cache.spec.ts`、`publicAssets.spec.ts`、`appMain.spec.ts`、`RouteOwnership.spec.ts`、`route-switching-performance.spec.ts`、`N5GrammarSections.spec.ts`、`N5GrammarViewSmoke.spec.ts`、`useN5GrammarSections.spec.ts`、`n5GrammarData.spec.ts`。
- A1 PR 內補 `ExamModal.spec.ts` 對「✕ 按鈕的 a11y 名稱仍為『關閉練習』」的斷言。
- B2 PR 內：(a) 補「sections 子檔內 category 一致性」測試；(b) 補「v-if 後展開才有 DOM」測試。

### 憲法 III（UX 一致性）
- A4 `viewport-fit=cover` + safe-area padding：附 visual diff（iPhone notch 模擬）。
- B1 字型決策：附三平台 visual diff（iOS / Android / Windows）。
- B2 v-if 改造：展開動畫須與現況一致（CSS transition 不變）。

### 憲法 IV（效能預算 — 須量化）
- 每個 PR 必附**前/後對照表**：
  - `dist/**/*.{js,css}` gzip 總和
  - 主要 chunk 大小（vendor-vue / index-*.js / N5 各 sections chunk）
  - Lighthouse Performance / PWA / Best Practices 分數
- Wave 1 預期：bundle 總量 -30~80KB（gzip 前），vendor 命中率↑。
- B2 預期：N5 chunk 拆 1→5、單檔最大 ~80KB；首次進入 DOM node 數量大減。

### 憲法 V（文件 + 倉儲衛生）
- 多項改動 `vite.config.ts` 或檔案責任 → 同一 work item 更新 `PROJECT_ARCHITECTURE.md`：
  - 第 46 行 vite.config.ts 描述補上 manualChunks / navigateFallback / unplugin-icons / visualizer / compression。
  - **新增「Icon 使用規範」章節**（A1）。
  - **新增「N1~N5 文法資料分類規範」章節**（B2）。
  - 第 30 / 41 行 vite.ico → favicon.ico（B5b）。
  - 第 60~63 行刪除三筆 src/assets/ 條目（B6）。
- UTF-8、無亂碼、無 BOM。本檔已遵守。

### 憲法 VI（範圍與所有權）
- 各項 tasks.md 須記錄正向（會出現在哪）+ 反向（不會殘留在哪）所有權，例：
  - A1：✕ 圖示僅 `ExamModal.vue`；fortawesome import 不殘留任何 `.vue/.ts`。
  - A3：navigateFallback 僅 `vite.config.ts`；不影響 `src/app/router.ts`。
  - A4：safe-area padding 僅作用於 sticky / fixed header 容器；不滲入 content 區塊。
  - B2：5 個 category 值域只在 N5 module 內定義；N4/N3/N2/N1 各自獨立 type union。

### 倉儲衛生（config.yaml）
- 不入 git：`node_modules/`、`dist/`、`build/`、`coverage/`、`test-results/`、`playwright-report/`（既有）。
- B4 .gz / .br 檔在 `dist/` 內產出但 publish 時過濾（不入 gh-pages）。

### bundlephobia 檢查
- Wave 1：移除 fortawesome；新增 `unplugin-icons` (~80KB devDep + Vite plugin) + `@iconify-json/fa6-solid` (devDep, ~120KB JSON)。production 影響：用到的 icon SVG path（200~400 bytes）。**淨變動：production -30~80KB；devDep +200KB（無妨）**。
- B3 visualizer：dev 約 50KB，OK。
- B4 vite-plugin-compression：dev 約 20KB，OK。
- B2：無新依賴。
- 無 production dep 違反 >30KB 門檻。

---

## 7. 驗收 checklist（每個變更動工後都要跑）

1. `npm run typecheck`
2. `npm run lint`
3. `npm run test:unit`
4. `npm run build` → 留意 500KB chunk 警戒線、`dist/**/*.{js,css}` gzip 總大小貼進 PR
5. `npm run preview` → DevTools Application 面板確認 SW 與快取
6. `npx playwright test tests/e2e/route-switching-performance.spec.ts --project=chromium`
7. `PLAYWRIGHT_PWA=1 npx playwright test tests/e2e/pwa-offline-route-cache.spec.ts`
8. Lighthouse 跑 production preview 抓 Performance / PWA / Best Practices 分數對比

---

## Conclusion summary（給 `/spectra-propose` 的對話起點）

**Decision**: discuss.txt 全 13 項拆為 **4 個獨立 Spectra 變更**，建議實作順序 1 → 3 → 2 → 4：

1. **`optimize-startup-bundle-and-pwa-meta`**（Wave 1）
   = A1（unplugin-icons + fa6-solid）+ A2（vendor-vue + es2020）+ **A3 全套（navigationPreload + navigateFallback + cleanupOutdatedCaches）** + A4（meta + viewport-fit + safe-area padding）+ B1（系統字型 stack）。
   1 PR、5 commit、量測一次到位。

2. **`establish-grammar-data-architecture`**（Q9 升級版）：
   - 定義 N1~N5 通用的 5 大 category（`particles` / `fundamentals` / `sentence-patterns` / `expressions` / `honorifics`）
   - N5 拆成 5 個 sections 檔
   - `useN5GrammarSections` 改並行 5 載入
   - `N5GrammarSectionCard.vue` `v-show` → `v-if`
   - PROJECT_ARCHITECTURE.md 新增分類規範章節
   - 為未來 N4/N3/N2/N1 上路鋪路。

3. **`optimize-static-assets`**：B5（icons 壓縮）+ B5b（favicon 替換）+ B6（scaffold 清理）+ B3（visualizer dev tool）+ B4（pre-compression + publish 腳本）。

4. **`cleanup-css-route-scoping`**：C2 高風險，可選擇延後或不做。

C3 / C4 / C5 / C6 / D1 / D2 / D3 維持不做。

**Rationale**:
- 拆 4 個變更，避免 PR 過大 + 風險混雜 + 量測指標互相干擾。
- 第一個變更 Wave 1 是純 build/entry/CSS 設定、blast radius 最可控、可量化（bundle 大小 / Lighthouse 分數）。
- A3 全套（含 `cleanupOutdatedCaches`）併入 Wave 1：讀完 dev 最新合併的 `fix-pwa-update-cache-retention` commits 後確認 `cleanupOutdatedCaches` 是該 spec 明確指定的「Workbox normal lifecycle」機制，非衝突。
- B2 升級為 `establish-grammar-data-architecture` 是為了**建立跨 N 級可擴充的資料架構**，未來 N4/N3/N2/N1 上路時直接套用相同 5 大分類。

**Capture to**:
- 本檔（`_private/propose.md`）→ 已定稿。
- 以 `/spectra-propose` 立案到 `openspec/changes/optimize-startup-bundle-and-pwa-meta/proposal.md` 開始第一個變更。
- 後續 design.md：每個變更都需附效能量測前/後表（憲法 IV）、瀏覽器矩陣（A2）、相容性論證（A3）、視覺驗證（A4 / B1 / B2）、跨級架構規範（B2）。
- 後續 tasks.md：每個變更拆 ≤ 2 小時的可獨立驗證任務（憲法 + config 規則）。

**Next**: 跑 `/spectra-propose optimize-startup-bundle-and-pwa-meta`，把 Wave 1 內容遷入 `openspec/changes/`。
