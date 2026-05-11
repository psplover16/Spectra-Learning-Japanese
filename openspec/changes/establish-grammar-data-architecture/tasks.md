## 1. 建立 N1~N5 文法資料 5 大 category 規範

- [x] 1.1 src/modules/n5Grammar/types/grammarNotes.ts 將 N5GrammarCategory type union 從 'core' | 'particle' 改為 'particles' | 'fundamentals' | 'sentence-patterns' | 'expressions' | 'honorifics'。完成定義：type union 5 值；TypeScript 強制 section.category 必為其一。驗證：npm run typecheck 通過（既有 24 個 section 在改 category 值前會有錯誤，待 task 1.2 完成後消除）。
- [x] 1.2 將既有 grammarNotes.ts 內 24 個 section 重編 category 值。對應規則：12 個 particle 既有 sections 改為 particles；core-term-usage-overview / question-words / demonstratives / numbers / time-expressions 改為 fundamentals；sentence-basics / past-and-state / invitation-comparison / state-change-naru / state-change-suru / dekiru-ability 改為 sentence-patterns；polite-overview 改為 honorifics。完成定義：24 個 section category 全部對應到新 union。驗證：npm run typecheck 通過；後續 task 1.5 sections 子檔一致性測試會強化此驗證。
- [x] 1.3 PROJECT_ARCHITECTURE.md 新增「N1~N5 文法資料分類規範」章節（5 大 category 定義表、邊界處理規則、新增 section 流程、未來 N4/N3/N2/N1 沿用方式）。實作此 design 決策「跨 N 級 5 大 category 規範」與「規範文件化（PROJECT_ARCHITECTURE.md）」。完成定義：文件含 5 條分類定義 + 新增 section 4 步驟 + 模糊邊界處理規則。驗證：人工 review 章節覆蓋三項要求並含「滿足 Requirement Each JLPT level grammar module SHALL classify its sections into one of five canonical categories」之指引。

## 2. N5 拆 5 檔 + barrel 重組（滿足 Requirement JLPT level grammar module SHALL split section data into one file per category）

- [x] 2.1 新建 src/modules/n5Grammar/data/sections/particles.ts，移入 12 個 particle category sections，並 re-export particleSectionIds const（從 grammarNotes.ts 搬移）。實作 design 決策「N5 拆 5 檔 + barrel 重組」之 particles 部分；滿足 Requirement「JLPT level grammar module SHALL split section data into one file per category」之 particles 檔案。完成定義：檔案 export sections（12 筆，全部 category === 'particles'）與 particleSectionIds。驗證：npm run typecheck 通過。
- [x] 2.2 新建 src/modules/n5Grammar/data/sections/fundamentals.ts，移入 5 個 fundamentals category sections（core-term-usage-overview、question-words、demonstratives、numbers、time-expressions）。完成定義：檔案 export sections（5 筆，全部 category === 'fundamentals'）。驗證：npm run typecheck 通過。
- [x] 2.3 新建 src/modules/n5Grammar/data/sections/sentence-patterns.ts，移入 6 個 sentence-patterns category sections（sentence-basics、past-and-state、invitation-comparison、state-change-naru、state-change-suru、dekiru-ability）。完成定義：檔案 export sections（6 筆，全部 category === 'sentence-patterns'）。驗證：npm run typecheck 通過。
- [x] 2.4 新建 src/modules/n5Grammar/data/sections/expressions.ts，export sections 為空陣列（N5 預留）。完成定義：檔案存在；export sections: N5GrammarSection[] = []。驗證：npm run typecheck 通過。**滿足規格 Empty category file uses uniform structure**。
- [x] 2.5 新建 src/modules/n5Grammar/data/sections/honorifics.ts，移入 1 個 honorifics category sections（polite-overview）。完成定義：檔案 export sections（1 筆，category === 'honorifics'）。驗證：npm run typecheck 通過。
- [x] 2.6 src/modules/n5Grammar/data/grammarNotes.ts 改為 barrel：合併 5 個 sections 子檔的 sections 陣列，套用既有 sort callback 產生 sortedN5GrammarSections，並保留 n5GrammarSourceCoverage const 與 re-export particleSectionIds。完成定義：sortedN5GrammarSections 內容 ID 集合與順序與重組前相同。驗證：tests/unit/n5GrammarData.spec.ts 既有測試通過（驗證 sortedN5GrammarSections 內容）。

## 3. Section sections 檔案內容一致性測試（滿足 Requirement Section sections file content consistency SHALL be enforced by tests）

- [x] 3.1 tests/unit/n5GrammarData.spec.ts 新增 5 條測試：每條對應一個 sections 子檔，驗證該檔 export 的 sections 陣列內所有 section.category 都等於對應檔名 category。滿足 Requirement「Section sections file content consistency SHALL be enforced by tests」。完成定義：5 條測試覆蓋 particles / fundamentals / sentence-patterns / expressions / honorifics 五檔。驗證：npm run test:unit 通過、5 條新測試全綠。

## 4. useN5GrammarSections 並行載入（滿足 Requirement Default loader SHALL load all category files in parallel and merge before sorting）

- [x] 4.1 src/modules/n5Grammar/composables/useN5GrammarSections.ts 預設 loader 改為 Promise.all 並行 import 5 個 sections 子檔，merge 後套用既有 sort 邏輯產出 sortedN5GrammarSections。實作 design 決策「`useN5GrammarSections` 並行載入」；滿足 Requirement「Default loader SHALL load all category files in parallel and merge before sorting」。完成定義：composable 暴露的 sections 與既有單檔載入順序與內容相同；任一子檔失敗即 loadError = 'N5文法資料載入失敗'（與既有訊息一致）。驗證：tests/unit/useN5GrammarSections.spec.ts 既有測試通過；新增測試模擬「5 個 import 中 1 個失敗」情境，確認 loadError 設定且 sections 仍為空。

## 5. N5GrammarSectionCard 改 v-if（滿足 Requirement N5 grammar section content SHALL be DOM-mounted only when the section is expanded）

- [x] 5.1 src/modules/n5Grammar/components/N5GrammarSectionCard.vue 第 93 行 v-show="contentVisible" 改 v-if="contentVisible"。實作 design 決策「`N5GrammarSectionCard.vue` `v-show` 改 `v-if`」；滿足 Requirement「N5 grammar section content SHALL be DOM-mounted only when the section is expanded」。完成定義：未展開 section 內容區（description、topics、tables、examples、tableExampleGroups、source coverage refs）不在 DOM 中；header（title、checkbox、expand 控制、sticky 背景）保持存在。**視覺一致性護欄**：展開動畫、checkbox hit area、background class 與舊版 100% 一致。驗證：tests/component/N5GrammarSections.spec.ts 通過（含展開後內容存在、收合後內容不在 DOM 之斷言新增）；tests/component/N5GrammarViewSmoke.spec.ts 通過；PR 內附 N5 入口頁 + 展開若干 section 的 before/after 截圖對照（無視覺差異）。

## 6. 量測與驗收

- [x] 6.1 執行 npm run typecheck、npm run lint、npm run test:unit。完成定義：三項皆綠（含本次新增的 sections 子檔一致性測試與 useN5GrammarSections 並行載入錯誤處理測試）。驗證：CI log 無錯誤。
- [x] 6.2 執行 npm run build；比對 dist 內 N5 相關 chunk（grammarNotes-*.js 拆成 5 個 sections-*.js 以及一個合併用 barrel chunk）；前/後 entry chunk + N5 chunk 大小對照表。完成定義：對照表貼進 PR；無 chunk 超 500 KB 警戒線；dist/assets/ 出現 5 個 sections 相關 chunk。驗證：PR 內含對照表（markdown 表格）。
- [x] 6.3 執行 npx playwright test tests/e2e/n5-grammar-layout.spec.ts --project=chromium。完成定義：通過。驗證：CI log 顯示測試通過。
- [ ] 6.4 PR 內附 N5 入口頁 + 展開 N5 重點 section（如 polite-overview、sentence-basics、particle-wa）的 before/after 截圖對照；視覺與展開動畫與舊版完全一致。完成定義：截圖貼進 PR。驗證：人工目視比對。
