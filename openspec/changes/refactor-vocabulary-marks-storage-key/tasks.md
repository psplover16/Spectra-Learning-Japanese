## 1. 測試先行

- [ ] [P] 1.1 在 tests/unit/vocabularyMarksStorage.spec.ts 新增失敗測試，覆蓋 Vocabulary marks use stable natural keys 與「使用 text 與 kanji 組成 natural key」：空 kanji 產生 text + "|"，有 kanji 產生 text + "|" + kanji，儲存結果不包含 numeric id；完成定義：測試在未實作前可重現失敗。
- [ ] [P] 1.2 在 tests/unit/vocabularyMarksStorage.spec.ts 新增失敗測試，覆蓋 Version 1 mark snapshots migrate to version 2、Stored mark keys are pruned against the current dictionary、「在 storage 層集中處理 schema migration 與 pruning」與「暴露純函式 pruneMarkedKeysAgainstDictionary」：v1 markedIds 轉 v2 markedKeys、無對應 id 被捨棄、v2 missing key 被修剪並寫回；完成定義：每個 migration/pruning 分支都有明確 assertion。
- [ ] [P] 1.3 在 tests/component/useVocabularySession.spec.ts 新增失敗測試，覆蓋 Vocabulary mark interactions compare by stable key 與「以 key set 驅動 session 互動與 mark-only filter」：toggle、save、clear、show marked only 都以 natural key 判斷；完成定義：同一批 fixture 中 marked 與 unmarked entry 的可見結果不同。

## 2. Storage 與型別實作

- [ ] 2.1 更新 src/modules/vocabulary/types/vocabulary.ts，讓 VocabularyEntry 或相鄰型別能提供 stable mark key，同時保留既有 number id；完成定義：呼叫端可取得 text + "|" + kanji key，且既有 id 型別仍可編譯。
- [ ] 2.2 更新 src/modules/vocabulary/storage/vocabularyMarksStorage.ts 的 schema：version 2 使用 markedKeys: string[]，讀寫函式拒絕把 markedIds 寫入新版快照；完成定義：新增測試中的 version 2 save/load assertion 通過。
- [ ] 2.3 在 src/modules/vocabulary/storage/vocabularyMarksStorage.ts 實作 v1 markedIds 到 v2 markedKeys migration，並由 storage 層集中處理 schema migration 與 pruning；完成定義：v1 有效 id 轉成 key、無效 id 被捨棄、localStorage 被覆寫為 version 2。
- [ ] 2.4 匯出 pruneMarkedKeysAgainstDictionary(keys, dictionaryKeySet) 純函式，保留輸入順序並移除不存在 key；完成定義：函式不讀寫 localStorage，單元測試直接呼叫並通過。

## 3. Session 與過濾整合

- [ ] 3.1 更新 src/modules/vocabulary/utils/vocabularyFilters.ts 的 normalize 流程，使每筆 normalized vocabulary entry 具備可重用的 natural key；完成定義：key 由 text 與 kanji 產生，不包含 stage、array position、numeric id 或 displayId。
- [ ] 3.2 更新 src/modules/vocabulary/composables/useVocabularySession.ts，讓 in-memory marks 使用 Set<string>，toggle marked、save marks、clear all 全部讀寫 key set；完成定義：不再以 markedIds: number[] 作為註記狀態來源。
- [ ] 3.3 更新 show marked only 的 visible vocabulary derivation，使 Vocabulary mark interactions compare by stable key；完成定義：mark-only filter 只顯示 key 存在於 marked key set 的 entries，並與 JLPT level/search/practice filters 共用既有單一路徑。

## 4. 驗證與文件一致性

- [ ] 4.1 執行 vocabularyMarksStorage 與 useVocabularySession 相關 Vitest，確認新增測試全數通過；完成定義：測試輸出顯示新增 migration、pruning、key-based filter cases 通過。
- [ ] 4.2 執行專案 typecheck 與 build，確認 localStorage schema breaking change 沒有 TypeScript 或 bundle regression；完成定義：typecheck 成功，build 成功且無新增依賴。
- [ ] 4.3 檢查 openspec/changes/refactor-vocabulary-marks-storage-key 的 proposal、design、specs、tasks 與實作結果一致；完成定義：若實作行為偏離 spec，於同一 change 更新對應 artifact 後再交付。
