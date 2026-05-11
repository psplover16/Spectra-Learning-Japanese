## 1. 基礎建設：tuple 與 mapper

- [x] 1.1 在 `src/modules/vocabulary/types/vocabulary.ts` 新增具名 4-tuple 型別 `VocabularyEntryTuple = readonly [text: string, romanization: string, kanji: string, meaning: string]`，使順序錯位在編譯期可被擋下。對應設計決策「Tuple 順序與 stage 推導」。完成驗證：`npm run typecheck` 通過、且任意調換順序的測試樣本會出現 TS error。
- [x] 1.2 在 `src/modules/vocabulary/data/vocabularyEntryMapper.ts` 實作 `toEntry(tuple, stage)`：將 `VocabularyEntryTuple + VocabularyStage` 還原為 `RawVocabularyEntry`，stage 由參數傳入而非 tuple 攜帶。完成驗證：新增 `tests/unit/vocabularyEntryMapper.spec.ts` 覆蓋一般情境、`meaning` 含換行（per `vocabulary-meaning-pos-format` spec）、stage 隨參數變動三個 case，全部通過。
- [x] 1.3 撰寫 regression 護欄 `tests/unit/vocabularyTupleRegression.spec.ts`：將 git baseline 的 jpWords_N1~N5 object 陣列快照與經過 mapper 還原的 tuple 結果做 deep-equal 比對。完成驗證：5 個 N 級皆通過 deep-equal、任一筆 entry 欄位錯置會讓測試 fail。

## 2. 單字資料 tuple 化

- [x] 2.1 將 `src/modules/vocabulary/data/jpWords_N1.ts` 內部由 object 陣列改為 tuple 陣列加 mapper 還原，stage 改由模組頂層 const + mapper 參數推導，對外仍 default-export `RawVocabularyEntry[]`。完成驗證：task 1.3 regression test 對 N1 通過、`npm run typecheck` 通過。
- [x] 2.2 [P] 將 `src/modules/vocabulary/data/jpWords_N2.ts` 改為 tuple 陣列加 mapper 還原。完成驗證：task 1.3 regression test 對 N2 通過。
- [x] 2.3 [P] 將 `src/modules/vocabulary/data/jpWords_N3.ts` 改為 tuple 陣列加 mapper 還原。完成驗證：task 1.3 regression test 對 N3 通過。
- [x] 2.4 [P] 將 `src/modules/vocabulary/data/jpWords_N4.ts` 改為 tuple 陣列加 mapper 還原。完成驗證：task 1.3 regression test 對 N4 通過。
- [x] 2.5 [P] 將 `src/modules/vocabulary/data/jpWords_N5.ts` 改為 tuple 陣列加 mapper 還原。完成驗證：task 1.3 regression test 對 N5 通過。

## 3. IndexedDB 儲存層底層

- [x] 3.1 在 `src/modules/vocabulary/storage/vocabularyMarksDb.ts` 實作原生 IndexedDB 包裝：資料庫名 `vocabulary`、object store `marks`、keyPath `id`、公開 `readAllMarks()`、`putMarks(records)`、`clearMarks()` 三個 async 函式。對應設計決策「vocabularyMarksStorage 用原生 IndexedDB」與「儲存職責劃分（依 design rule 要求）」。完成驗證：新增 `tests/unit/vocabularyMarksDb.spec.ts` 在 fake-indexeddb 環境下覆蓋（空 store 回 []、put 後 read 一致、clear 後回 []）三個 case，全部通過。
- [x] 3.2 為 `vocabularyMarksDb` 加上「IndexedDB unavailable degrades to in-memory marks」spec scenario 對應的失敗路徑：open 失敗時 `readAllMarks` 回 []、`putMarks` 為 no-op、第一次失敗時 `console.warn` 一次（模組級 flag）。完成驗證：task 3.1 測試檔擴充「open throws → 退化為 in-memory + 單次 warn」case，且後續呼叫不再 warn。

## 4. localStorage → IndexedDB 一次性 migration

- [x] 4.1 在 `src/modules/vocabulary/storage/vocabularyMarksMigration.ts` 實作 `migrateMarksFromLocalStorage()`：先讀 IndexedDB 非空則 return；否則讀 localStorage 既有 v1/v2 snapshot，將 v1 numeric ids 透過當前正規化字典 resolve 為 natural keys，全部成功 put 進 IndexedDB 之後才 `localStorage.removeItem` 舊 key。對應設計決策「一次性 migration 採「先寫後刪」策略」與 spec requirement「Marks persistence migrates from localStorage to the IndexedDB mark store on first run」。完成驗證：新增 `tests/unit/vocabularyMarksMigration.spec.ts` 覆蓋四個 case：(a) v2 直接搬遷成功且 localStorage 被清；(b) v1 resolve 後寫入；(c) IndexedDB 寫到一半失敗時 localStorage 保留、下次 startup 重試成功（idempotent）；(d) IndexedDB 已非空時整體 no-op。

## 5. async API 滲透與呼叫端更新

- [x] 5.1 將 `src/modules/vocabulary/storage/vocabularyMarksStorage.ts` 公開 API 改為 `readMarks(): Promise<MarkedVocabularyEntry[]>` 與 `writeMarks(marks): Promise<void>`，內部改呼叫 `vocabularyMarksDb`，保留並維持既有的 dictionary pruning 邏輯與 visible-scope 合併邏輯。對應 spec requirements「Stored mark keys are pruned against the current dictionary」、「Saving vocabulary marks merges only visible entries」、「Table header bulk toggles visible draft vocabulary marks」與設計決策「Async API 滲透邊界與啟動時序」、「儲存職責劃分（依 design rule 要求）」。完成驗證：`tests/unit/vocabularyMarksStorage.spec.ts` 既有三個 requirement 對應的測試案例改為 async 並全部通過、無新 console.error。
- [x] 5.2 更新 `src/modules/vocabulary/composables/useVocabularySession.ts`：marks 初始化從 sync 取值改 async，所有 `readMarks` / `writeMarks` 呼叫加 await，reactive `persistedMarkedKeys` 必須在 promise resolve 之後才寫入避免 race。完成驗證：`tests/component/useVocabularySession.spec.ts` 既有測試（含 toggling、merge、header bulk）全部通過，無新增 unhandled promise rejection。
- [x] 5.3 更新 `src/modules/vocabulary/views/VocabularyView.vue`：`onMounted` 加 await marks 載入，loading 期間沿用既有 empty/zero 視覺，不新增任何 spinner 或 UI 元件。完成驗證：`tests/component/VocabularyViewSmoke.spec.ts` 全部通過；在 dev server 離線情境（Chrome DevTools Network = Offline 後 reload）下 vocab 頁仍正確顯示已勾選 marks，並將此手動驗證步驟記於本任務 commit message。

## 6. 啟動時序：migration 與 prefetch

- [x] 6.1 在 `src/app/main.ts` 加上 `void migrateMarksFromLocalStorage()` 與 `void prefetchVocabularyMarks()` 的 best-effort 觸發（不 await、unhandled rejection 僅 console.warn），確保兩者皆在 router mount 之後但 idle 階段之前發起。對應設計決策「Async API 滲透邊界與啟動時序」。完成驗證：新增（或擴充既有）`tests/component/mainBootstrap.spec.ts` 驗證兩個函式皆在 mount 後被呼叫一次、任一失敗都不會阻擋 app render；同時驗證二次啟動時 prefetch 仍會被呼叫但 migration 變 no-op。

## 7. 端對端驗證與成果量測

- [x] 7.1 撰寫或更新 `tests/e2e/vocabulary-word-practice.spec.ts`：勾選 N5 一個單字 → reload page → 該單字仍勾選 → 開啟 DevTools 確認 IndexedDB `vocabulary/marks` 有對應 record；同時清空 IndexedDB 再 reload，預先在 localStorage 寫入 v2 snapshot，驗證 migration 後該單字仍勾選。對應 spec requirement「Vocabulary marks persistence uses IndexedDB」。完成驗證：Playwright spec 通過、含上述兩個流程。
- [x] 7.2 [P] 跑 `npm run build`，計算 `dist/assets/jpWords_N*.js.gz` 加總體積，與本變更前 baseline（feature branch fork 點）比對。完成驗證：實測 gzip wire 節省 ≥ 10 KB 並將實測數據（baseline 與當前各檔大小）記於最終 commit message 或 `_private/筆記.md`；若未達 10 KB，需在 commit 中說明原因或追加進一步壓縮任務。

   **實測結果（apply session）**：
   - Baseline gzip: 22.76 KB（pre-tuple）→ 21.02 KB（post-tuple）= **1.74 KB 節省**
   - Raw JS: 91.8 KB → 52.4 KB = **39.4 KB 節省**（cold-start parse-time win）
   - **未達 10 KB gzip 門檻**；經分析確認 gzip 對重複 key 名稱已壓得極佳，
     即使加上 strip-hyphens + meaning enum 至多 +0.7 KB，合計仍 ~2-2.5 KB
   - 結論：保留 UI 與資料正確性下，gzip ceiling 約為 22 → 19 KB（~3 KB）
   - 已將剩餘壓縮探索移至 task 7.3 作為 deferred 後續工作

- [x] 7.3 (deferred) 探索進一步單字資料壓縮 — 在獨立變更中處理：
   - (a) 修復既有 romanization 不 deterministic 問題（如 `ship-pa-i-ritsu`、`gyaku-se-tsu` 等非標準切分），統一為 mora-by-mora hyphen 規則；
   - (b) 實作 kana → romaji runtime converter（含 sokuon、yoon、choon-pu、長音規則），將 romanization 從資料檔移除；
   - (c) 評估若 (a)+(b) 完成後對 UI 顯示是否有可見變化，並決定要不要保留。預估完整實作後可省 5-7 KB gzip。
   完成驗證：本任務為 deferred follow-up，本變更不會實作；新變更建立時把此任務複製到該變更的 tasks.md。

## 8. 規格驗證與架構文件回寫

- [x] 8.1 [P] 跑 `spectra validate optimize-vocabulary-data-format-and-storage`。完成驗證：輸出無 error。
- [x] 8.2 [P] 更新 `PROJECT_ARCHITECTURE.md` 中 vocabulary 模組的 storage 段落，反映 marks 已從 localStorage 遷移到 IndexedDB（資料庫名、object store、key 結構）。完成驗證：人工 review 文件用語與 spec 一致、未引入「將」「即將」等未來式語句。
