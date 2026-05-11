## Context

N5 文法 module 在 dev 上目前是：
- `src/modules/n5Grammar/data/grammarNotes.ts` 單一大檔（24 個 section、約 130 KB raw / 37 KB gzip）。
- `useN5GrammarSections` 單一 loader 載入該檔。
- `N5GrammarSectionCard.vue` 用 `v-show` 控制展開/收合，未展開 section 的所有 DOM（含表格、例句）也已建立並 hide。
- `category` 欄位 union 只有 `core` / `particle`（12 + 12）。

未來 N4/N3/N2/N1 文法陸續實作時，本提案決定的「跨 N 級資料架構規範」會被各級延伸沿用；N5 module 是首個落實點。

本提案針對：
1. 建立跨 N 級通用 5 大 category union。
2. N5 拆檔 + barrel 重組。
3. `useN5GrammarSections` 並行載入。
4. `N5GrammarSectionCard.vue` `v-show` 改 `v-if` 讓未展開 section 不建 DOM。
5. 文件規範（PROJECT_ARCHITECTURE.md 新增「N1~N5 文法資料分類規範」）。

## Goals / Non-Goals

**Goals:**

- 建立 N1~N5 共通的 5 大 category union（`particles` / `fundamentals` / `sentence-patterns` / `expressions` / `honorifics`），未來 N4 上路時直接套用。
- 降低 `/n5-grammar` 入口頁首次 render 的 DOM node 數與 JS 解析量。
- 維持文本內容、UI 樣式、完成 checkbox 行為、storage 格式、現有 sortedN5GrammarSections 順序與 ID 完全一致。
- 提供測試強制機制（type union + 各 sections 子檔 category 一致性測試）防止未來 section 放錯檔。

**Non-Goals:**

- 不建立 N4/N3/N2/N1 module（規範文件化但不實作）。
- 不抽 `grammar-shared/` 共用 module。
- 不改 N5 各 section 內部資料（標題、例句、tableExampleGroups 等內容不動）。
- 不改其他 sticky header（vocabulary 等）。
- 不更動展開動畫、checkbox 完成邏輯與 storage。

## Decisions

### 跨 N 級 5 大 category 規範

**選擇**：採用 5 個跨 N1~N5 通用 category：`particles` / `fundamentals` / `sentence-patterns` / `expressions` / `honorifics`。
**N5 對應**：
- `particles` × 12（既有 12 個助詞 section）
- `fundamentals` × 5（core-term-usage-overview、question-words、demonstratives、numbers、time-expressions）
- `sentence-patterns` × 6（sentence-basics、past-and-state、invitation-comparison、state-change-naru、state-change-suru、dekiru-ability）
- `honorifics` × 1（polite-overview）
- `expressions` × 0（N5 預留空陣列）

**替代方案**：

- 維持現況 2 值（core / particle）：未來 N4 上路時 core 變超大檔，無法支援拆檔。
- 細到 7 值（再切 verb-usage、vocabulary-helpers）：N5 量身打造，N4 不一定適用，造成各級分類不一致。
- 簡到 4 值（合併 expressions 與 honorifics）：N1/N2 慣用句型與敬語體系獨立，合併後 expressions 在 N1 會超大。

**為何選 5 值**：跨 N 級每檔均衡（單檔最大預估 ~15 sections）、邊界清楚（依「主題本質」而非「N 級內部結構」分類）、開發者看標題即可決定 category。

### N5 拆 5 檔 + barrel 重組

**選擇**：`data/sections/` 新增 5 個檔案分別存各 category 的 section；`grammarNotes.ts` 改為 barrel，合併 + sort 後 re-export。

**替代方案**：

- 不拆檔：違反本提案 lazy parse 目標。
- 一個 section 一個檔（24 檔）：過細、HTTP 請求數爆炸。
- 拆 2 檔（依現況 core / particle）：core 12 個仍打包同檔，邊際效益低。

**為何選 5 檔**：各檔大小均衡、與 5 大 category 規範對齊、未來 N4 沿用同樣結構。

### `useN5GrammarSections` 並行載入

**選擇**：loader 改用 `Promise.all` 並行 import 5 個 sections 子檔，合併後 sort 即得 `sortedN5GrammarSections`。

**替代方案**：

- 序列載入：浪費往返時間。
- 依使用者展開 section 才載入該 category：邊際差異與 v-if 重複收益（v-if 已大幅減 DOM cost），增加 loader 複雜度不划算。

**為何選並行**：HTTP/2 多路復用下 5 小檔並行通常比 1 大檔快；錯誤處理單純（任一失敗即 `loadError`，與現況一致）。

### `N5GrammarSectionCard.vue` `v-show` 改 `v-if`

**選擇**：第 93 行 `<div ... v-show="contentVisible">` 改 `<div ... v-if="contentVisible">`。

**替代方案**：

- 維持 v-show：所有 section 內容首次進入頁就建 DOM，render cost 高。
- 用 dynamic `<component :is>`：複雜度高，無額外收益。

**為何選 v-if**：未展開 section 連 DOM node 都不建；首次進入 `/n5-grammar` 的 DOM 數量大幅降低；展開時建 DOM 約 5~30 ms（人眼幾乎無感）。

### 規範文件化（PROJECT_ARCHITECTURE.md）

**選擇**：新增「N1~N5 文法資料分類規範」章節，明文定義 5 大 category、邊界處理、新增 section 流程、未來 N4/N3/N2/N1 沿用方式。

**替代方案**：

- 只寫進 spec：spec 是行為契約，不是開發指引；架構文件是工程師日常檢索點。
- 寫進 README：與專案架構職責不符。

**為何選 PROJECT_ARCHITECTURE.md**：本檔已是憲法 V 認定的活文件；既有「Icon 使用規範」（Wave 1 加入）已採同樣模式，一致性高。

## Implementation Contract

**Behavior（使用者觀察）**：

- 進入 `/n5-grammar` 後 sortedN5GrammarSections 順序、各 section 標題、內容、completion checkbox、展開動畫與 storage 行為與既有 dev 完全一致。
- 未展開 section 的內容不在 DOM（v-if）；展開時 DOM 建立後與既有展開狀態完全一致。
- 文本內容（標題、說明、例句、reading、translation、highlightTerms）100% 保留不變。

**Interface / 資料形狀**：

- `N5GrammarCategory` type union：`'particles' | 'fundamentals' | 'sentence-patterns' | 'expressions' | 'honorifics'`。
- `N5GrammarSection.category` 欄位型別跟著縮緊；既有 24 個 section 全部需重編 category 值。
- `data/sections/<category>.ts` 各 export `sections: N5GrammarSection[]` 陣列；其中所有 section 的 `category` 必須等於檔案對應 category。
- `data/grammarNotes.ts` re-export：
  - `sortedN5GrammarSections`（合併 5 檔陣列後依既有 sort 邏輯排序）
  - `n5GrammarSourceCoverage`（既有 const，搬移位置不變）
  - `particleSectionIds`（既有 const，搬移到 particles.ts 並 re-export）
  - 任何其他既有 export 維持。
- `useN5GrammarSections` 預設 loader：`async () => Promise.all([5 個 import]).then(modules => ({ sortedN5GrammarSections: [...].sort(...) }))`；測試可注入自訂 loader 模擬並行載入。
- `N5GrammarSectionCard.vue`：第 93 行 `v-show` 改 `v-if`；其他內容（checkbox hit area、sticky header、展開狀態 class）完全不變。

**失敗模式**：

- 任一 sections 子檔載入失敗 → `loadError` 設為「N5文法資料載入失敗」（與現況同訊息）。
- Type 違規（section.category 與所在檔不一致）→ TypeScript 編譯失敗。
- Sections 子檔內 category 不一致 → `n5GrammarData.spec.ts` 新增測試擋下。

**Acceptance Criteria（驗收）**：

- `npm run typecheck` 通過。
- `npm run lint` 通過。
- `npm run test:unit` 通過（含新增的 sections 子檔 category 一致性測試與 useN5GrammarSections 並行載入測試）。
- `npm run build` 通過、無 chunk 超 500 KB 警戒線；dist/assets/ 出現各 sections chunk。
- `npx playwright test tests/e2e/n5-grammar-layout.spec.ts --project=chromium` 通過。
- `tests/component/N5GrammarSections.spec.ts` 通過（驗證 v-if 後展開狀態仍正確）。
- `tests/component/N5GrammarViewSmoke.spec.ts` 通過。
- 視覺一致性護欄：PR 內附 N5 入口頁 + 展開若干 section 的 before/after 截圖對照（無視覺差異）。

**Scope 邊界**：

- 在範圍內：`src/modules/n5Grammar/{types,data,composables,components}/` 列名檔案、`tests/unit/n5GrammarData.spec.ts`、`tests/unit/useN5GrammarSections.spec.ts`、`PROJECT_ARCHITECTURE.md`。
- 不在範圍：N4/N3/N2/N1 module 建立、N5 各 section 內部資料修改、其他 sticky header、route 設定、其他 module 的 type 或 category 概念。

## Risks / Trade-offs

- 拆檔後若任一 sections 子檔 module init 失敗 → 全 N5 頁無法 render。Mitigation：與現況單一檔失敗一致（同樣會 loadError）；e2e + unit 測試守住。
- 24 個 section 重編 category 過程中可能誤分類。Mitigation：sections 子檔內 category 一致性測試 + TypeScript union 強制；逐 section 對照 design 段所列分類表。
- v-if 改 v-show 會讓「展開時的首次互動」多 5~30 ms 建 DOM。Mitigation：對人眼無感；既有 expand transition 仍可吸收此延遲。
- N5 各 section sort 順序若改變會破壞 `sortedN5GrammarSections` 既有順序契約。Mitigation：barrel 內保留現有 sort callback；單元測試驗證合併後順序與重組前相同。

## Migration Plan

- 此變更不改 user data schema、不改 storage 格式（completedSectionIds 仍用 section.id 集合，不依 category）。
- 部署順序：merge 至 dev → staging 自動 deploy → 手動驗證 staging 真機 N5 頁 → merge 至 master → production 部署。
- Rollback：純 git revert；既有 N5 sections 資料未改，回滾後 24 個 section 與行為與本提案前完全相同。

## Open Questions

無。Q9 與 Q4-extra 已於 `_private/propose.md` 收斂。
