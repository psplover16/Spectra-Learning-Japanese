## Why

vocabulary 模組存在兩個可預期但尚未撞牆的瓶頸：

1. 單字資料檔每筆 object 重複 5 個 key（text/romanization/kanji/meaning/stage），其中 `stage` 永遠等於檔名標記，是純冗餘。5 檔合計 source ~130 KB，build 後 wire ~95 KB。
2. vocabularyMarksStorage 仍走 localStorage（sync API + 5-10 MB quota）。CLAUDE.md 技術棧宣稱「IndexedDB 用於大量學習資料、字卡」，但實作未對齊。

短期內 (1) 是 bundle 體積的邊際成本，(2) 沒有實機痛點。但未來規劃中的 SRS 排程、字卡答題紀錄、跨裝置同步暫存區，會讓 vocab 模組儲存量線性成長，撞到 localStorage quota 上限的風險真實存在。**現在動，可避免「撐到撞牆才大改」的高風險路徑**。

## What Changes

- **資料格式 tuple 化**：5 個 jpWords_N*.ts 改為 `readonly [text, romanization, kanji, meaning]` tuple 陣列，import 時透過 mapper 轉回 `RawVocabularyEntry`。`stage` 由 import path 推導，不再寫入資料檔。預估 gzip wire 節省 15-20 KB。
- **marks 儲存改 IndexedDB**：vocabularyMarksStorage 從 localStorage 遷移到 IndexedDB；對外 API 從 sync 改為 async（read/write 加 Promise）。
- **一次性 migration**：應用首次啟動讀到 localStorage 舊資料時，搬到 IndexedDB 並清除舊 localStorage key。
- **既有 spec 行為維持**：自然鍵 `text|kanji` 不變、meaning 多行格式不變、stage 仍為 JLPT 值。

## Non-Goals

- 不一併遷移其他 storage（grammarLevelStorage、n5GrammarCompletionStorage、latestUnknownResultStorage 都繼續走 localStorage）。
- 不引入 SRS、學習紀錄、跨裝置同步等新功能；本提案只把儲存層底子打好。
- 不抽出共用 IndexedDB wrapper 或 repository pattern；只解決 marks 這一個 collection 的搬遷。
- 不改變任何 UI、不改變 marks 的視覺呈現與操作流程。
- 不引入新的執行階段依賴（不裝 idb-keyval / dexie；直接用瀏覽器原生 IndexedDB API）。

## Capabilities

### New Capabilities

(none — Part 1 純內部重構、無外部行為變化；Part 4 對應的 capability 已存在)

### Modified Capabilities

- `vocabulary-mark-persistence`: 新增「marks 儲存於 IndexedDB」需求；既有自然鍵需求（`text|kanji`）維持不變。

## Impact

- Affected specs: `vocabulary-mark-persistence` (modified)
- Affected code:
  - Modified:
    - src/modules/vocabulary/data/jpWords_N1.ts
    - src/modules/vocabulary/data/jpWords_N2.ts
    - src/modules/vocabulary/data/jpWords_N3.ts
    - src/modules/vocabulary/data/jpWords_N4.ts
    - src/modules/vocabulary/data/jpWords_N5.ts
    - src/modules/vocabulary/types/vocabulary.ts
    - src/modules/vocabulary/composables/useVocabularySession.ts
    - src/modules/vocabulary/storage/vocabularyMarksStorage.ts
  - New:
    - src/modules/vocabulary/data/vocabularyEntryMapper.ts
    - src/modules/vocabulary/storage/vocabularyMarksDb.ts
    - src/modules/vocabulary/storage/vocabularyMarksMigration.ts
  - Removed: (none)
