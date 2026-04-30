## Why

使用者要解決的問題是：N5 文法頁每個容器目前同時用箭頭與標題背景表示開合，視覺訊號重複，且沒有可持久保存的「已學完」註記。現在要讓使用者能在離線 PWA 中標記每個文法 section 的學習完成狀態，下次開啟仍保留。

## What Changes

- 移除 N5 文法 section 標題列中的開合箭頭，只保留標題背景色表示開合；展開時背景色需更深。
- 將原箭頭位置改為完成 checkbox；點 checkbox 不得觸發 section 開合。
- 勾選完成後，該 section 必須立即收合且不可展開；取消勾選後不自動展開。
- 完成狀態以 localStorage snapshot 持久化，僅儲存在使用者本機，無同步與衝突處理。
- N5 文法 section header 需以純 CSS sticky 呈現目前可視 section 的標題。

## Non-Goals

- 不引入 Pinia、全域進度系統或跨等級共用完成追蹤。
- 不新增帳號、雲端同步、analytics 或伺服器功能。
- 不重寫 N5 文法內容資料結構。
- 不以 IntersectionObserver 實作 sticky header。

## Capabilities

### New Capabilities

- n5-grammar-section-completion: N5 文法 section 可被標記為已學完，並以本機持久化狀態控制互動與顯示。

### Modified Capabilities

(none)

## Impact

- Affected specs: n5-grammar-section-completion.
- Affected code:
  - New: src/modules/n5Grammar/storage/n5GrammarCompletionStorage.ts, tests/unit/n5GrammarCompletionStorage.spec.ts.
  - Modified: src/modules/n5Grammar/components/N5GrammarSectionCard.vue, src/modules/n5Grammar/views/N5GrammarView.vue, src/shared/config/storageKeys.ts, src/styles/main.css, tests/component/N5GrammarSections.spec.ts, tests/e2e/n5-grammar-layout.spec.ts, PROJECT_ARCHITECTURE.md.
  - Removed: (none)
