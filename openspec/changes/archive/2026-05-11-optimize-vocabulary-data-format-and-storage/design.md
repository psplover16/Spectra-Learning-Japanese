## Context

vocabulary 模組目前是專案中 wire size 第三大的功能（5 個 jpWords_N*.ts 加總 build 後 ~95 KB），其每筆 entry 的 object 形式攜帶大量冗餘 key。同時 vocabularyMarksStorage 仍使用 localStorage（sync API、quota 5-10 MB、整段 JSON 替換），與 CLAUDE.md 宣告的「IndexedDB 用於大量學習資料、字卡」技術棧不一致。

本變更不解決當下任何痛點，而是為**可預見的資料量擴張**鋪路：未來 SRS 排程資料、字卡答題紀錄、跨裝置同步暫存區若一起塞 localStorage，會在 N3-N5 全標 + 多次練習紀錄之後逼近 quota 上限。短期收益是 bundle 體積（~15-20 KB gzip），長期收益是儲存層基礎打穩。

相關既有規格約束：
- `vocabulary-mark-persistence`：marks 自然鍵 `text|kanji` 必須維持。
- `vocabulary-meaning-pos-format`：每筆 entry 的 `meaning` 字串多行格式必須維持。
- `vocabulary-jlpt-level-filtering`：`stage` 仍須為 JLPT 值（N1~N5）。

## Goals / Non-Goals

**Goals:**

- 把 5 個 jpWords_N*.ts 從 object 陣列改為 tuple 陣列，import 時透過 mapper 還原為 `RawVocabularyEntry`。
- 把 vocabularyMarksStorage 從 localStorage 遷移到 IndexedDB；對外 API 從 sync 改 async。
- 寫一次性 migration：localStorage 舊資料搬到 IndexedDB 後清除舊 key。
- 既有 spec 行為不變（natural key、meaning 格式、stage 值都保留）。

**Non-Goals:**

- 不抽出共用 IndexedDB wrapper（不過度抽象，違反「最簡可行解」原則）。
- 不引入 idb-keyval / dexie / 任何 IndexedDB library；直接用瀏覽器原生 API。
- 不一併遷移其他 storage（grammarLevelStorage、n5GrammarCompletionStorage、latestUnknownResultStorage 都繼續 localStorage）。
- 不引入 Pinia store（既有 storage 直連 composable 的模式維持）。
- 不改變 UI、不改變 marks 操作流程。

## Decisions

### Tuple 順序與 stage 推導

選擇順序 `[text, romanization, kanji, meaning]`，stage 從呼叫 mapper 時傳入的參數推導。

理由：
- text 與 kanji 是 natural key 組成項目，放前兩位確保肉眼可讀。
- meaning 是最長欄位，放最後降低 IDE 自動換行干擾。
- stage 在 5 個檔案中各自為常數，由 import path 決定（每檔頂層宣告 `const STAGE = 'N5'` 之類）。

**替代方案**：
- (A) JSON file + Vite raw import：失去 TS 型別檢查與 IDE 跳轉，否決。
- (B) 用 Object.freeze + 短 key（`{t,r,k,m}`）：可讀性差，gzip 後效益接近 tuple，否決。

### vocabularyMarksStorage 用原生 IndexedDB

用瀏覽器原生 `indexedDB.open()` API 寫一個 ~80 行的薄包裝在 vocabularyMarksDb.ts。資料庫名 `vocabulary`，object store `marks`，keyPath 為 natural key（字串 `text|kanji`），value 為完整 `MarkedVocabularyEntry`。

理由：
- 只搬遷一個 collection，library 沒有抽象價值。
- 沒有額外 wire size（idb-keyval ~3 KB gzip 雖然小，但仍是負擔）。
- 不需要 Promise 化的查詢語法、index、cursor 等進階功能。

**替代方案**：
- idb-keyval（~3 KB gzip）：API 簡潔但對單一 collection 過剩，否決。
- dexie（~20 KB gzip）：違反 bundlephobia >30 KB 守則的 spirit，否決。
- 不做 IndexedDB 直接維持 localStorage：違背本提案前向動機，否決。

### 一次性 migration 採「先寫後刪」策略

App 啟動時，若 IndexedDB 的 marks store 為空 且 localStorage 有舊 marks key 存在，則：
1. parse localStorage → MarkedVocabularyEntry[]
2. 把每筆 put 進 IndexedDB
3. 全部 put 成功才 `localStorage.removeItem(key)`

中斷時 localStorage 仍保留，下次啟動會再試一次（idempotent）。

理由：localStorage 失敗成本低，遷移失敗時保留舊資料優於遺失。

**替代方案**：dual-write 一段時間再切：成本高、本專案是單人使用，沒必要保險，否決。

### Async API 滲透邊界與啟動時序

vocabularyMarksStorage 的 `readMarks()` / `writeMarks()` / `migrateMarks()` 三個函式皆變成回傳 Promise。

呼叫端影響範圍：
- VocabularyView 的 marks 初始化從 onMounted 同步取值改為 onMounted `await`。
- 為避免 marks 在 first paint 之後才出現造成「checkbox 閃爍」，在 main.ts 加入啟動時的並行 `prefetchVocabularyMarks()` 呼叫，但不 await（讓它在 background 跑）；VocabularyView 進入時若 prefetch 尚未完成，照常 await。

**替代方案**：
- 永遠 await 完成再讓 VocabularyView 進入：阻塞路由進入，違反「使用者明顯感覺到的卡頓視為 bug」，否決。
- 把 marks 在 SSR / build 時靜態 embed：本專案是純 client，無 SSR，方案不適用。

### 儲存職責劃分（依 design rule 要求）

| 資料 | 載體 | 理由 |
|---|---|---|
| vocab marks（natural keys） | IndexedDB (vocabulary/marks) | 預期未來成長到 1000+ 筆，async I/O 不卡 UI |
| 文法等級、N5 完成狀態、最近錯題 | localStorage | 規模小（< 5 KB）、sync 讀取在啟動關鍵路徑上 |
| Pinia | 未使用 | 本變更不引入 Pinia |

## Implementation Contract

**Behavior**

- 使用者打勾單字 → reload 頁面 → 該單字仍是勾選狀態。
- 第一次升級到新版（localStorage 還有舊資料）→ 啟動後 marks 仍正確顯示，且下次啟動已從 IndexedDB 讀取。
- IndexedDB 不可用（Safari Private、嚴格瀏覽器）→ marks 視為空清單，操作 marks 仍可在 in-memory 進行但 reload 後丟失，console 印一次 warning。

**Interface / Data shape**

- `RawVocabularyEntry` 型別不變：`{ text, romanization, kanji, meaning, stage }`。
- `vocabularyEntryMapper.toEntry(tuple: readonly [string, string, string, string], stage: VocabularyStage): RawVocabularyEntry`
- vocabularyMarksStorage 公開三個函式：
  - `readMarks(): Promise<MarkedVocabularyEntry[]>`
  - `writeMarks(marks: MarkedVocabularyEntry[]): Promise<void>`
  - `migrateMarksFromLocalStorage(): Promise<void>`
- IndexedDB schema：db = `vocabulary`、object store = `marks`、keyPath = `"id"`（即 natural key `${text}|${kanji}`）、value 為 `MarkedVocabularyEntry & { id: string }`。

**Failure modes**

- IndexedDB open 失敗 → 函式回傳 `[]`、`writeMarks` 變為 no-op，console.warn 一次。
- migration 過程中任一筆 put 失敗 → 不刪 localStorage、不擲錯給 UI、下次啟動重試。
- 從 localStorage 讀到結構不符的舊資料 → 走既有 `storageGuard.readJsonStorage` 的 fail-safe（清掉並回傳 null）。

**Acceptance criteria**

- Vitest：vocabularyEntryMapper 將 tuple 還原為 RawVocabularyEntry，stage 由參數傳入。
- Vitest：vocabularyMarksDb 對空 store 回 `[]`、put 後 read 拿到一致資料。
- Vitest：migrateMarksFromLocalStorage 在「localStorage 有 / IndexedDB 空」情境下正確搬遷並清 localStorage；其他三種組合下為 no-op。
- Vitest：完整 jpWords_N5 經 mapper 後的結果與舊 object 陣列在 deep equal 下相等（保留為 regression 護欄）。
- Playwright：勾選一個 N5 單字 → reload → 該單字仍勾選。
- Build size check：執行 `npm run build`，比對 `dist/assets/jpWords_N*.js.gz` 加總與 baseline，必須減少 ≥ 10 KB。

**Scope boundaries**

- **In scope**：vocabulary data 5 檔 tuple 化、vocabularyMarksStorage 改 IndexedDB、新增 migration、新增 mapper、新增 db wrapper、更新對應測試與 spec。
- **Out of scope**：其他 storage（grammarLevel / n5GrammarCompletion / latestUnknownResult）；任何 UI 視覺調整；引入 Pinia；引入 IndexedDB library。

## Risks / Trade-offs

- [tuple 順序錯位 → 整批單字錯置] → Mitigation：mapper 接受具名 tuple 型別 `readonly [text: string, romanization: string, kanji: string, meaning: string]`，編譯期擋住順序錯誤；外加 vitest deep-equal 護欄。
- [IndexedDB API 在 Safari Private 模式受限] → Mitigation：失敗時降級為 in-memory + console.warn；CLAUDE.md「離線可用」原則仍維持（基本功能不破）。
- [migration 中斷讓使用者誤以為 marks 不見] → Mitigation：先寫後刪，localStorage 保留到 IndexedDB 寫完才清；遷移失敗在 console 留下標示。
- [async API 改寫造成 VocabularyView 啟動 race condition] → Mitigation：main.ts 加 prefetch + VocabularyView await 雙保險；prefetch 是 best-effort 不阻塞。
- [build size 未達 10 KB 目標] → Mitigation：acceptance criteria 寫死門檻，跑 build 比對；若實測不達，可在 task 中追加進一步壓縮（如移除 romanization 中的連字號）。

## Migration Plan

1. **準備**：先合併 mapper / db wrapper / migration 三個新檔（純新增，無破壞）並通過單元測試。
2. **切換 storage**：vocabularyMarksStorage 內部從 localStorage 改 IndexedDB，公開函式簽名變 async。同 commit 內更新所有呼叫端（VocabularyView 與其他 composable）以 await 取值。
3. **加 migration 鉤子**：main.ts 啟動時非同步觸發 `migrateMarksFromLocalStorage()` 與 `prefetchVocabularyMarks()`，皆 best-effort（unhandled rejection 只 console.warn）。
4. **資料檔 tuple 化**：5 個 jpWords_N*.ts 依序改為 tuple + mapper 形式；每改一個跑一次 vitest 確保 deep-equal regression test 通過。
5. **驗證**：跑 `npm run test:ci`（含 build、e2e）；手動驗證 marks 在實機（或 dev server）reload 後保留；對比 dist/ 的 gzip size。
6. **回滾策略**：任何階段 fail，revert 該 commit；因為 migration 是「先寫後刪」，localStorage 舊資料仍在，使用者實機不會掉資料。

## Open Questions

- VocabularyStage 型別目前在哪定義？實作時需確認 import path 並讓 mapper 接受嚴格列舉。
- VocabularyView 是否還有其他直接讀 localStorage 的點（除 marks 外）？實作前先 grep 確認。
