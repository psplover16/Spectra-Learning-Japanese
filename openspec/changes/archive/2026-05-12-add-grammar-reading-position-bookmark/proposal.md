## Why

文法頁內容長、容器多，使用者於 5~15 分鐘短 session 中斷後，無法記錄「上次讀到哪個段落」。現有 checkbox 只能標「已學完」，不能表達「進行中位置」；回到頁面只能憑記憶翻找，違背 PWA「碎片時間可用」目標。

## What Changes

- 每個 N5 文法 section 標題列**左側**新增書籤按鈕（hit-area、尺寸鏡像右側既有 checkbox）
- **每個 JLPT 等級至多一個書籤**：點空心 → 變實心並覆蓋同等級舊書籤；點實心 → 取消
- 書籤狀態以 **localStorage** 持久化（key `duotify.grammar.bookmark`、單一 JSON、按等級分組 `byLevel: { n5?, n4?, ... }`、`version: 1`）
- 與「已學完」checkbox **職責正交**：可獨立切換；section 被勾「已學完」時自動清掉其書籤（reading position 對已完成段落無意義）
- 已學完區（finished zone）裡的 section 不顯示書籤按鈕
- Storage wrapper 置於 `src/modules/grammar/storage/`（共用層），schema 預留 N4–N1，本次只實作 N5 UI
- 新增 dev 依賴 `@iconify-json/fa6-regular`（空心書籤 icon）

## Non-Goals

- 不做 N4/N3/N2/N1 的 UI（資料尚未存在，YAGNI）
- 不做自動偵測閱讀位置（捲動位置、最後展開區塊）— 手動標記語意明確、無誤判
- 不支援單一等級多書籤 — 違反「上次讀到」單一概念
- 不改動現有 checkbox 行為、位置、樣式或 hit-area
- 不採用 IndexedDB — 資料量 < 1 KB、無查詢需求，localStorage 為合理選擇（與既有 `n5GrammarCompletionStorage` 一致）

## Capabilities

### New Capabilities

- `grammar-reading-position-bookmark`: 每個 JLPT 文法等級至多一個閱讀位置書籤，使用者可手動切換、清除，並透過 localStorage 跨 session 持久化

### Modified Capabilities

(none)

## Impact

- Affected specs: 新增 `grammar-reading-position-bookmark`
- Affected code:
  - New:
    - `src/modules/grammar/storage/grammarBookmarkStorage.ts`
    - `tests/unit/grammarBookmarkStorage.spec.ts`
  - Modified:
    - `src/shared/config/storageKeys.ts`
    - `src/modules/n5Grammar/components/N5GrammarSectionCard.vue`
    - `src/modules/n5Grammar/views/N5GrammarView.vue`
    - `src/styles/main.css`
    - `tests/e2e/n5-grammar-layout.spec.ts`
    - `package.json`
  - Removed: (none)
- 離線儲存：localStorage（單一 key、總量 < 1 KB）；無同步策略需求（純本地、無多裝置）、無衝突處理需求（單一寫入點）
