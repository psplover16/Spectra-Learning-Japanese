## Why

使用者的單字註記目前綁定陣列順序產生的數字 id；後續拆檔、去重與 CSV 合併會重排字典，導致既有 localStorage 註記指向錯誤單字。現在必須先解除這個位置耦合，才可安全推進 vocabulary overhaul。

## What Changes

- **BREAKING**：將單字註記快照 schema 升級為 version 2，儲存欄位由 markedIds: number[] 改為 markedKeys: string[]。
- 將儲存 key 定義為不含 stage 的 natural key：text + "|" + kanji；空 kanji 保留空字串。
- v1 讀取時以當下字典順序把數字 id 轉成 natural key；對不上者直接捨棄、不通知使用者。
- 每次載入 v2 時以當下字典 key set 修剪不存在的 markedKeys，並寫回 localStorage。
- mark-only 過濾、toggle、save、clear 行為改以 stable key 比對。

## Non-Goals

- 不拆分或合併 jpWords.ts，不修改任何單字資料內容。
- 不導入 displayId；displayId 屬於後續 split-and-merge-jpwords。
- 不顯示 migration 或 pruning 通知，不新增遠端同步。

## Capabilities

### New Capabilities

- `vocabulary-mark-persistence`: 單字註記在 localStorage 以 stable natural key 持久化，並支援 v1 到 v2 遷移與字典校驗修剪。

### Modified Capabilities

(none)

## Impact

- Affected specs: vocabulary-mark-persistence
- Affected code:
  - Modified: src/modules/vocabulary/types/vocabulary.ts
  - Modified: src/modules/vocabulary/storage/vocabularyMarksStorage.ts
  - Modified: src/modules/vocabulary/composables/useVocabularySession.ts
  - Modified: src/modules/vocabulary/utils/vocabularyFilters.ts
  - New: tests/unit/vocabularyMarksStorage.spec.ts
  - New: tests/component/useVocabularySession.spec.ts
  - Removed: none
- Offline data: localStorage keeps only local user marks; there is no network synchronization. Conflicts are resolved by dictionary-key validation: keys that no longer exist are pruned silently.
