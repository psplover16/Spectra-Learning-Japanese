## Why

N5 文法資料 `grammarNotes.ts` 共 24 個 section（約 130 KB gzip 後 37 KB）目前單檔載入；`N5GrammarSectionCard.vue` 用 `v-show` 讓所有 section 內容首次進入頁就建 DOM，造成 N5 入口頁首次 render 較慢且 DOM node 量大。同時 `category` 欄位只有 `core` / `particle` 兩個值，未來 N4/N3/N2/N1 加入時無共通分類規範。本提案建立跨 N1~N5 通用的 5 大 category 架構並落實到 N5 拆檔與 v-if lazy DOM render。

## What Changes

- `types/grammarNotes.ts` 將 `N5GrammarCategory` 改為 5 值 union：`particles` / `fundamentals` / `sentence-patterns` / `expressions` / `honorifics`。
- 24 個既有 section 重編 category（12 particle 維持；12 core 重分為 4 個新分類）。
- `data/sections/` 新建 5 檔：`particles.ts`、`fundamentals.ts`、`sentence-patterns.ts`、`expressions.ts`、`honorifics.ts`（expressions 為 N5 預留空陣列）。
- `grammarNotes.ts` 改為 barrel：合併 5 檔再 sort 後 re-export `sortedN5GrammarSections` 與既有常數。
- `useN5GrammarSections` loader 改並行載入 5 個 module。
- `N5GrammarSectionCard.vue` 第 93 行 `v-show="contentVisible"` 改為 `v-if="contentVisible"`。
- `PROJECT_ARCHITECTURE.md` 新增「N1~N5 文法資料分類規範」章節，說明 5 大 category 定義與新增 section 流程；同時更新 N5 module 結構描述。
- 補測試：`n5GrammarData.spec.ts` 加各 sections 子檔內 category 一致性驗證；`useN5GrammarSections.spec.ts` 改 mock loader 介面以反映並行 5 載入。

## Non-Goals

- 不建立 N4/N3/N2/N1 module（僅落實規範與 N5）。
- 不抽 `grammar-shared/` 共用 module（為未來預先抽象，違反憲法）。
- 不改 N5 文法 section 文本內容、UI 樣式、完成 checkbox 行為與 storage 格式。
- 不改其他 sticky header（vocabulary、route tabs 等）。
- 不引入新依賴。

## Capabilities

### New Capabilities

- `grammar-data-architecture`: N1~N5 文法資料的跨級分類規範與 N5 落實（5 大 category union、檔案組織、新增 section 流程）。

### Modified Capabilities

- `n5-grammar-learning-status-sections`: 補上 N5 section 內容由 `v-if` 控制 DOM mount 的契約（未展開 section 不在 DOM 中）。

## Impact

- Affected specs: `grammar-data-architecture`（新建）、`n5-grammar-learning-status-sections`（修改）
- Affected code (modified):
  - src/modules/n5Grammar/types/grammarNotes.ts
  - src/modules/n5Grammar/data/grammarNotes.ts
  - src/modules/n5Grammar/composables/useN5GrammarSections.ts
  - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
  - tests/unit/n5GrammarData.spec.ts
  - tests/unit/vocabularyStageTestData.ts（若引用 N5 type 連帶調整，視實際情況）
  - PROJECT_ARCHITECTURE.md
- Affected code (new):
  - src/modules/n5Grammar/data/sections/particles.ts
  - src/modules/n5Grammar/data/sections/fundamentals.ts
  - src/modules/n5Grammar/data/sections/sentence-patterns.ts
  - src/modules/n5Grammar/data/sections/expressions.ts
  - src/modules/n5Grammar/data/sections/honorifics.ts
- Dependencies: 無新增。
