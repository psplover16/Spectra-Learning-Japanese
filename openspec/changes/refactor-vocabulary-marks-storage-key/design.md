## Context

目前單字註記快照存於 localStorage，快照以 version 1 與 markedIds: number[] 表示。這些 id 來自 normalizeVocabularyEntries 的陣列順序，因此後續 jpWords.ts 拆檔、跨 CSV 去重、合併 CSV 或重新排序時，既有註記會落到錯誤單字。此 change 只處理註記儲存身份，為後續字典資料變更建立安全前提。

職責劃分：localStorage 負責保存少量使用者註記快照；IndexedDB 不參與本 change；Pinia store 不新增狀態。useVocabularySession 繼續持有畫面 session state，註記集合改由 Set<string> 表示，初始值為空集合，載入快照後以 markedKeys 填入。

## Goals / Non-Goals

**Goals:**

- 將單字註記儲存 key 從位置相依的 number id 改為 stable natural key。
- 支援 v1 markedIds 到 v2 markedKeys 的本機遷移。
- 每次載入 v2 快照時依當下字典刪除不存在的 key，並寫回 localStorage。
- 讓 mark-only filter、toggle、save、clear 全部改以 key 比對。

**Non-Goals:**

- 不拆分、翻譯、合併或重排任何字典資料。
- 不導入 displayId，不把 displayId 當作儲存 key。
- 不新增伺服器同步、帳號同步、IndexedDB 儲存或使用者通知。

## Decisions

### 使用 text 與 kanji 組成 natural key

儲存 key 使用 text + "|" + kanji，不包含 stage。空 kanji 以空字串保留，例如 おい|。這讓後續重新分級時不會使註記失效，也符合 propose.md 已收斂的「儲存 key 與 displayId 分離」規則。

替代方案：保留 number id。淘汰原因是拆檔、去重、合併 CSV 會改變陣列順序，使 id 指向錯誤單字。

替代方案：使用 displayId。淘汰原因是 displayId 只供 UI、log、debug 讀懂，不參與儲存與相等性判斷；把它當 key 會重新引入排序與流水號治理風險。

### 在 storage 層集中處理 schema migration 與 pruning

vocabularyMarksStorage 負責讀寫 version 2 快照、讀取舊版資料、將 v1 markedIds 依當下 normalized vocabulary 轉成 markedKeys，以及呼叫 pruneMarkedKeysAgainstDictionary。useVocabularySession 只接收已修剪過的 markedKeys，並在互動時以 key set 操作。

這個分工讓離線資料清理集中在 localStorage 邊界，避免 UI 或 filter utility 同時背負 migration 規則。localStorage 失效或資料格式不合規時，回到空快照；不存在於當下字典的 key 直接移除並覆寫。

### 暴露純函式 pruneMarkedKeysAgainstDictionary

pruneMarkedKeysAgainstDictionary(keys, dictionaryKeySet) 回傳仍存在於字典的 key 陣列，並保留輸入順序。它同時服務 v1 到 v2 遷移後的清理，以及每次 v2 載入時的校驗，讓測試能直接覆蓋邊界情境。

替代方案：在每個讀取點各自 filter。淘汰原因是規則容易分裂，且後續字典整理時較難確認所有入口都有一致清理。

### 以 key set 驅動 session 互動與 mark-only filter

VocabularyEntry 保留既有 number id 以降低此 change 的呼叫端衝擊，但新增或衍生 stable mark key 供註記功能使用。toggle marked、save marks、clear all、show marked only 與 visible vocabulary derivation 都用 key set 判斷，不再依賴 markedIds。

## Risks / Trade-offs

- [Risk] 同一批字典內存在相同 text + kanji 會造成 key collision → Mitigation：本 change 不修改字典，但實作時須建立 dictionary key set，並在測試中覆蓋 duplicate key 的可觀測行為；後續 split-and-merge-jpwords 必須以 uniqueness assertion 防止 collision。
- [Risk] v1 markedIds 是舊順序，若使用者已更新到排序不同版本才遷移，仍可能轉成錯誤 key → Mitigation：此 change 必須先於字典拆分與合併發布，讓遷移發生在當下字典順序仍可對應時。
- [Risk] 靜默 pruning 會讓使用者少量註記消失 → Mitigation：依 propose.md 結論不通知使用者；只刪除當下字典不存在的 key，避免錯誤保留。

## Migration Plan

1. 發布 version 2 讀寫邏輯，但不更動字典檔內容。
2. 第一次讀到 v1 快照時，依當下 normalized vocabulary 用 id 找 entry，轉為 text + "|" + kanji，查不到的 id 捨棄。
3. 將轉換結果經 pruneMarkedKeysAgainstDictionary 修剪後寫回 localStorage version 2。
4. 往後每次讀 v2 快照時都以當下字典 key set 修剪，若內容被修剪則立即寫回。
5. rollback 時若回到只懂 v1 的版本，v2 快照不會被舊程式正確讀取；此為 schema breaking change，回滾策略是清除該 localStorage key 後讓舊版從空註記啟動。

## Open Questions

- 無。propose.md 已收斂 key 格式、migration 策略、通知策略與後續 displayId 分工。
