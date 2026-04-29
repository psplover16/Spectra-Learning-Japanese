# 專案架構圖

本文件整理目前專案的資料夾結構與用途，重點展開 `src/` 內部檔案。

備註：
- `src/` 的檔案用途，主要依實際引用關係與檔案內容整理。
- `_private/` 依專案規則不展開私人筆記與受限制內容。

## 根目錄架構

```text
Japanese_Word_Practice_Vue_AI/
├─ .agents/ (本地代理技能與輔助資源，提供 AI / agent 工作流程用)
├─ .codex/ (Codex 本地設定與工作資料)
├─ .github/
│  └─ workflows/
│     ├─ ci.yml (CI 驗證流程：lint、typecheck、unit test、build、e2e)
│     └─ cd.yml (CD 部署流程：建置後建立 `gh-pages` worktree，交由 `scripts/publishPages.mjs` 同步 production root 與 `staging/`)
├─ .specify/ (Spec-driven 開發模板、腳本與專案規範記憶)
├─ dist/ (Vite build 後產生的靜態網站輸出)
├─ node_modules/ (npm 安裝的套件)
├─ playwright-report/ (Playwright 測試報告輸出)
├─ public/ (正式公開靜態資產；提供 favicon 與 PWA icons，會直接進入 Vite build 輸出)
├─ specs/ (功能規格、研究、計畫、任務與契約文件)
├─ src/ (專案核心原始碼：畫面、路由、資料、商業邏輯、共用元件)
├─ test-results/ (Playwright 執行後的原始測試結果)
├─ tests/ (Vitest / Playwright 測試程式)
├─ _private/ (私人資料區；本次未展開受限制內容)
├─ .gitignore (Git 忽略規則)
├─ AGENTS.md (此專案給代理 / 助手的工作規則)
├─ eslint.config.js (ESLint 規則設定)
├─ index.html (前端入口 HTML，載入 `/src/app/main.ts`)
├─ package-lock.json (npm 依賴鎖定檔)
├─ package.json (套件清單與 npm scripts，例如 dev、build、test)
├─ playwright.config.ts (Playwright e2e 設定)
├─ postcss.config.js (PostCSS 設定)
├─ README.md (專案說明與開發指令)
├─ tailwind.config.ts (Tailwind CSS 主題與掃描設定)
├─ tsconfig.app.json (前端 app TypeScript 設定)
├─ tsconfig.json (TypeScript 基礎設定)
├─ tsconfig.node.json (Node / 工具腳本 TypeScript 設定)
├─ vite.config.ts (Vite 建置、alias、PWA 等設定；使用 Vite 標準 `public/` 目錄提供 favicon 與 PWA icons)
└─ vitest.config.ts (Vitest 設定：jsdom、setup、排除 e2e)
```

## src 詳細架構

```text
src/
├─ app/ (應用程式入口層：啟動 Vue、切路由、提供全域殼層)
│  ├─ AppShell.vue (整個網站的外框；建立 PracticeSession、提供 RouterView、共享 route tabs 頁首與 PWA Toast，並處理小螢幕下 tabs-only header 的換列穩定性)
│  ├─ main.ts (Vue 啟動入口；createApp(AppShell).use(router).mount('#app'))
│  └─ router.ts (路由表；定義 /practice、/grammar、/vocabulary、/n5-grammar 與對應 route meta)
│
├─ assets/ (靜態素材)
│  ├─ hero.png (專案使用的圖片素材)
│  ├─ vue.svg (Vue 預設圖示素材)
│  └─ vite.svg (Vite 預設圖示素材)
│
├─ modules/ (依功能切分的業務模組)
│  ├─ exam/ (測驗流程模組：出題、答題、標記不熟、結果保存)
│  │  ├─ components/
│  │  │  ├─ ExamModal.vue (測驗進行中的彈窗；顯示放大的題目列、答案提示、下一題與不熟標記操作)
│  │  │  └─ UnknownResultPanel.vue (顯示最近一次「不熟題目」統計結果的面板；提供不斷行的「清除」按鈕)
│  │  ├─ composables/
│  │  │  └─ useExamSession.ts (測驗狀態核心；建立題組、控制目前題目、結算不熟項目、讀寫最近結果)
│  │  ├─ storage/
│  │  │  └─ latestUnknownResultStorage.ts (包裝 localStorage；讀寫最近一次不熟題目結果快照)
│  │  └─ types/
│  │     └─ exam.ts (測驗資料型別定義，例如 StartExamInput、ExamQuestionCard、結果快照)
│  │
│  ├─ grammar/ (文法頁模組)
│  │  ├─ components/
│  │  │  ├─ GodanVerbTable.vue (五段動詞主表與音便子表；以兩個 accordion table 呈現詞尾母音變化與音便規則)
│  │  │  ├─ GrammarAccordionTableShell.vue (文法表格共用殼層；提供標題列、展開收合、`data-testid`、標題/說明分離與一致表格骨架)
│  │  │  ├─ InflectionTable.vue (一般活用表 renderer；支援一段、サ變、カ變、形容詞與助動詞等多組列資料，並可在表格下方顯示例句組)
│  │  │  ├─ PosConversionTable.vue (詞性變化規則 renderer；顯示分組標題、條列規則與例句)
│  │  │  ├─ RuleListTable.vue (規則清單表 renderer；顯示編號規則與多行補充說明)
│  │  │  └─ SystemDifferenceTable.vue (語法系統差異比較表 renderer；顯示系統別對照與備註列)
│  │  ├─ data/
│  │  │  └─ changeRules.ts (文法頁 11 個 section 的靜態資料來源；集中管理標題、payload 與穩定 id)
│  │  ├─ types/
│  │  │  └─ changeRules.ts (文法表格資料型別定義，例如 section、比較列、活用表、可選例句組與詞性變化結構)
│  │  └─ views/
│  │     └─ GrammarView.vue (文法頁畫面；組裝 11 個規則容器並依資料型別切換對應 renderer)
│  │
│  ├─ n5Grammar/ (N5 文法學習頁模組)
│  │  ├─ components/
│  │  │  ├─ N5GrammarBulletBlock.vue (條列式文法說明 renderer；適合規則重點與例句混合閱讀的群組，支援例句重點字標記)
│  │  │  ├─ N5GrammarCompareTable.vue (差異對照表 renderer；先顯示比較表，再補充每個儲存格例句群組與必要的主題說明/例句，支援例句重點字標記)
│  │  │  ├─ N5GrammarInfoBlock.vue (說明後接例句的 renderer；適合連續閱讀型內容，支援例句重點字標記)
│  │  │  └─ N5GrammarSectionCard.vue (N5 文法群組容器；提供標題列、右側收合按鈕與標題分離的說明區)
│  │  ├─ data/
│  │  │  └─ grammarNotes.ts (N5 文法結構化靜態資料；整理 v11~v16 筆記、排序規則、來源覆蓋、共通註記、圖片轉表格資料與敬體總覽儲存格例句)
│  │  ├─ types/
│  │  │  └─ grammarNotes.ts (N5 文法資料型別定義，例如 section、topic、可標記重點字的 example、compare table、tableExampleGroups 與來源覆蓋項)
│  │  └─ views/
│  │     └─ N5GrammarView.vue (N5 文法正式學習頁；依 section 的 presentation mode 組裝 compare/info/bullet 三種 renderer)
│  │
│  ├─ practice/ (主練習頁模組：假名選擇、練習設定、規則說明)
│  │  ├─ components/
│  │  │  ├─ ChoonRuleSection.vue (長音規則單一大表格；以規則列與例字三段資訊列呈現長音閱讀規則)
│  │  │  ├─ DakuonTable.vue (濁音 / 半濁音表格；不再顯示 `tableB` 輔助標示，並套用 route-specific 字級 class)
│  │  │  ├─ DakuonYoonSection.vue (合拗音矩陣區塊；列標頭與內容格都顯示羅馬音)
│  │  │  ├─ HatsuonSection.vue (撥音規則說明區塊)
│  │  │  ├─ LoanwordSection.vue (外來語擴張矩陣；第一列為母音、第一欄為基底音，內容格以上假名下羅馬音顯示)
│  │  │  ├─ PracticeToolbar.vue (練習頁控制列；切換平假名/片假名、全選、題數、開始測驗、重設與上方清除最近結果)
│  │  │  ├─ SeionTable.vue (清音表格；不再顯示 `tableA` 輔助標示，並套用 route-specific 字級 class)
│  │  │  ├─ SelectionDetailPanel.vue (顯示目前已選假名與選項摘要的側邊/明細面板)
│  │  │  ├─ SeionYoonSection.vue (清音拗音矩陣區塊；標頭列、列標頭與內容格都顯示羅馬音)
│  │  │  ├─ SokuonSection.vue (促音規則說明區塊)
│  │  │  └─ SpecialSyllableSection.vue (特殊音節 / 補充說明區塊)
│  │  ├─ composables/
│  │  │  └─ usePracticeSession.ts (練習頁最核心狀態；管理選字、題數、自動計算、全選、provide/inject)
│  │  ├─ data/
│  │  │  ├─ kanaData.ts (五十音、濁音、列欄位與所有 Kana cell 的主資料)
│  │  │  └─ specialSyllableData.ts (促音、撥音、拗音、長音與外來語矩陣的結構化靜態說明資料)
│  │  ├─ types/
│  │  │  └─ practice.ts (練習模組的型別定義，例如 KanaCell、長音規則列、拗音格、外來語矩陣列與明細項目)
│  │  └─ views/
│  │     └─ PracticeView.vue (主練習頁；組裝 toolbar、表格、規則區塊、最近結果與 ExamModal，並提供 `/practice` 專屬樣式作用範圍與結果區清除後的平滑回頂)
│  │
│  ├─ pwa/ (PWA 安裝 / 更新體驗模組)
│  │  ├─ composables/
│  │  │  └─ usePwaLifecycle.ts (在元件 mounted 時註冊 PWA service，回傳 toast 狀態與更新操作)
│  │  ├─ services/
│  │  │  └─ pwaLifecycleService.ts (PWA 更新邏輯核心；呼叫 registerSW、控制更新提示、延後更新與清快取)
│  │  └─ types/
│  │     └─ pwa.ts (PWA ToastState 型別定義)
│  │
│  └─ vocabulary/ (單字頁模組)
│     ├─ components/
│     │  ├─ VocabularyControlBar.vue (單字頁控制區；提供搜尋、練習模式與右側全域篩選入口)
│     │  ├─ VocabularyCountSummary.vue (單字數量摘要文字；顯示目前可見資料列數)
│     │  └─ VocabularyStageTable.vue (單字表格；處理單一可捲動 table、共用欄位顯示、註記欄與長按揭露事件)
│     ├─ composables/
│     │  └─ useVocabularySession.ts (單字頁狀態管理；串接 `/practice` 勾選、搜尋條件、註記草稿／持久化與長按揭露)
│     ├─ data/
│     │  └─ jpWords.ts (單字靜態資料；將既有字典與 v16 補充詞條正規化為可渲染結構，並保留 stage 中繼資訊)
│     ├─ storage/
│     │  └─ vocabularyMarksStorage.ts (單字註記 localStorage 存取與格式驗證)
│     ├─ types/
│     │  └─ vocabulary.ts (單字資料、顯示欄位、篩選條件與註記快照型別)
│     ├─ utils/
│     │  └─ vocabularyFilters.ts (單字字種轉換、搜尋比對、條件篩選與顯示內容導出)
│     └─ views/
│        └─ VocabularyView.vue (單字頁畫面；重建為參考頁風格的單表格字典、搜尋篩選、註記與長按揭露介面)
│
├─ shared/ (跨模組共用的元件與工具)
│  ├─ components/
│  │  ├─ BaseButton.vue (全站共用按鈕元件)
│  │  ├─ BaseCheckbox.vue (全站共用核取方塊元件)
│  │  ├─ BaseInput.vue (全站共用輸入框元件)
│  │  ├─ RouteTabs.vue (頁面主路由切換導覽列；固定呈現「字母練習 / 變化規則 / N5文法 / 單字練習」，按鈕文字不斷行且可在小螢幕換列)
│  │  └─ ToastBanner.vue (全站共用 Toast 提示；主要用於 PWA 更新 / 離線提示)
│  ├─ config/
│  │  └─ publicAssets.ts (公開資產常數；集中定義 favicon 與 PWA icon 檔名，供 Vite 設定與測試共用)
│  └─ utils/
│     ├─ questionCount.ts (依已選假名數與是否包含平假名/片假名，計算建議題數)
│     ├─ questionDeck.ts (提供洗牌與循環補足題組的工具函式)
│     ├─ renderSafety.ts (小型安全工具；處理空值 fallback，避免 render 時出現 undefined / null)
│     └─ storageGuard.ts (localStorage 讀寫保護工具；含 JSON parse 驗證與移除壞資料)
│
├─ styles/ (全域樣式層)
│  └─ main.css (全域 CSS 與 Tailwind / 主題樣式入口；含共享 route tabs、`/practice` 指定表格字級、`/grammar`、`/vocabulary`、`/n5-grammar` 等 route-specific 樣式與小螢幕退讓規則)
│
└─ env.d.ts (Vite / TypeScript 環境型別宣告)
```

## tests 架構

```text
tests/
├─ component/ (Vue 元件測試)
│  ├─ AppShellSmoke.spec.ts (AppShell 基本渲染與核心外框 smoke test；驗證 tabs-only header 與四主路由)
│  ├─ ChoonRuleSection.spec.ts (長音規則大表格的結構與例字三段資訊測試)
│  ├─ ExamModal.spec.ts (ExamModal 的關鍵互動、題目列顯示與關閉測試)
│  ├─ GrammarChangeRulesTables.spec.ts (文法頁複雜表格 renderer 測試；驗證五段動詞、活用表、サ變例句與詞性變化內容)
│  ├─ GrammarViewSmoke.spec.ts (文法頁 11 個規則容器、標題/說明分離與 accordion 初始狀態 smoke test)
│  ├─ LoanwordSection.spec.ts (外來語矩陣的標頭、內容格與假名/羅馬音呈現測試)
│  ├─ N5GrammarSections.spec.ts (N5 文法群組測試；驗證敬體總覽與 v16 新 section 收合/展開、儲存格例句群組、重點字標記與不同內容模式 renderer)
│  ├─ N5GrammarViewSmoke.spec.ts (N5 文法正式頁 smoke test；驗證核心詞類、敬體與 v16 區塊標題、render-safe 初始渲染與無非預期外溢內容)
│  ├─ PracticeViewSmoke.spec.ts (PracticeView 的基本渲染、指定假名表字級 class、下半部區塊首屏存在與最近結果清除/捲動測試)
│  ├─ RouteOwnership.spec.ts (驗證 `/practice`、`/grammar`、`/vocabulary`、`/n5-grammar` 的 feature ownership 與 negative ownership，並確認 N5 文法內容不外溢)
│  ├─ SelectionDetailPanel.spec.ts (選取明細面板的顯示邏輯測試)
│  ├─ VocabularyControlBar.spec.ts (單字頁控制區測試；驗證搜尋與 checkbox 疊加控制事件)
│  ├─ VocabularyStageTable.spec.ts (單字表格測試；驗證欄位保留佔位、註記與長按事件輸出)
│  ├─ VocabularyViewSmoke.spec.ts (單字頁 smoke test；驗證初始渲染、註記儲存、長按揭露與 v16 方位詞搜尋)
│  ├─ YoonSections.spec.ts (清音拗音與合拗音矩陣的全表羅馬音測試)
│  └─ testUtils.ts (元件測試共用 helper；例如先 provide PracticeSession 再 mount，並可傳入額外 mount options)
├─ e2e/ (Playwright 端到端測試)
│  ├─ app-shell.smoke.spec.ts (整個網站 shell 與基本進站流程 smoke test；驗證四主路由導覽、N5 入口與 direct URL)
│  ├─ grammar-change-rules.spec.ts (375px 下 `/grammar` 的展開流程、主要文法表格可見性與不破版驗證)
│  ├─ practice-layout.smoke.spec.ts (375px 下 `/practice` 首屏、表格可讀性與無水平捲動 smoke test)
│  ├─ practice-exam-flow.spec.ts (從選字到開始測驗的完整流程測試，含 modal 題目列存在驗證)
│  ├─ n5-grammar-layout.spec.ts (375px 下 `/n5-grammar` 的展開流程、主要群組可見性與不破版驗證)
│  ├─ vocabulary-word-practice.spec.ts (單字頁端到端測試；驗證搜尋、註記持久化、長按揭露與窄版穩定性)
│  └─ testUtils.ts (e2e 共用 helper；含四主路由 tabs、nowrap 與無水平捲動斷言)
├─ mocks/ (測試替身 / mock 模組)
│  └─ pwaRegisterMock.ts (mock `virtual:pwa-register`，讓測試不真的註冊 service worker)
├─ unit/ (純邏輯單元測試)
│  ├─ latestUnknownResultStorage.spec.ts (最近不熟結果 storage 的讀寫與驗證測試)
│  ├─ changeRulesData.spec.ts (文法頁靜態資料測試；驗證 section 數量、id 唯一性與關鍵 payload 完整度)
│  ├─ n5GrammarData.spec.ts (N5 文法靜態資料測試；驗證核心區塊排序、12 組儲存格例句、v16 來源覆蓋、助詞排序與重點字欄位)
│  ├─ pwaLifecycleService.spec.ts (PWA 更新流程與 toast 狀態測試)
│  ├─ questionDeck.spec.ts (洗牌與循環題組工具測試)
│  ├─ useExamSession.spec.ts (測驗流程狀態機測試)
│  ├─ usePracticeSession.spec.ts (練習狀態管理測試)
│  ├─ vocabularyData.spec.ts (單字資料測試；驗證正規化後筆數、id、stage 分組順序與 v16 補充詞條唯一性)
│  ├─ vocabularyFilters.spec.ts (單字過濾邏輯測試；驗證搜尋與字母條件疊加規則)
│  └─ vocabularyMarksStorage.spec.ts (單字註記 storage 測試；驗證格式驗證與壞資料清除)
└─ setup.ts (Vitest 共用初始化；載入 `jest-dom` matcher)
```

## specs / .specify / scripts 的角色

```text
specs/ (每個功能需求的規格資料夾)
├─ 001-japanese-pwa-study/ (第一階段功能規格：主功能、畫面契約、研究、任務拆解)
├─ 002-testing-cicd-foundation/ (第二階段規格：測試與 CI/CD 基礎建設)
├─ 003-practice-romaji-layout/ (第三階段規格：字母練習排版與羅馬音補強)
├─ 004-romaji-layout-stability/ (第四階段規格：長音大表格、外來語矩陣、首屏穩定渲染與 375px 補強)
├─ 011-route-tabs-n5-grammar/ (第十一階段規格：共享 route tabs 重構、N5 文法入口與 `/practice` 指定表格字級調整)
├─ 012-n5-grammar-route/ (第十二階段規格：N5 文法正式學習頁、資料整理、群組／收合與來源覆蓋)
├─ 013-add-vocabulary-entries/ (第十三階段規格：單字練習補齊詞條與字典驗證)
└─ 014-n5-grammar-table/ (第十四階段規格：N5 文法敬體變化總覽、儲存格例句與前兩個區塊重整)

.specify/ (規格導向開發工具資源)
├─ templates/ (spec、plan、tasks 等模板)
├─ scripts/ (建立新 feature、檢查前置條件、更新 agent context 的腳本)
└─ memory/ (專案規範記憶，例如 constitution)

scripts/ (專案自訂腳本目錄)
└─ publishPages.mjs (GitHub Pages 發布同步腳本：清理不安全 root 殘留、保留合法 production 內容、同步 `dist/` 到 production 或 `staging/`)
```

## 執行流程速記

```text
index.html
  -> /src/app/main.ts
  -> AppShell.vue
  -> router.ts 決定目前頁面
  -> PracticeView / GrammarView / VocabularyView / N5GrammarView
  -> 各模組 composables、components、utils
```

## 公開資產與 PWA Icon 責任

- 根目錄 `public/` 是正式公開靜態資產來源，包含 `public/vite.ico` 與 `public/icons/*.png`。
- `_private/_private_fileAssets/v1/public` 僅保留為原始參考素材位置，不再作為正式 build 的公開來源。
- `vite.config.ts` 使用 Vite 標準 `public/` 目錄與 PWA 設定輸出 favicon、manifest 與安裝圖示。
- `src/shared/config/publicAssets.ts` 是 favicon 與 PWA icon 檔名的單一來源，供 Vite 設定與測試共用。
- `tests/unit/publicAssets.spec.ts` 會驗證 `public/` 來源素材存在，並以暫時 build 輸出確認 `index.html`、`manifest.webmanifest`、`vite.ico` 與 `icons/*.png` 都真的進入可發布產物。

## 一句話總結

- `src/`：真正的產品邏輯與畫面實作。
- `tests/`：驗證 `src/` 是否正確。
- `specs/` / `.specify/`：規格、計畫、任務與開發流程支援。
- `.github/workflows/`：自動化驗證與部署，包含呼叫 `scripts/publishPages.mjs` 管理 `gh-pages` 內容的 CD。
