# vocabulary-overhaul （討論結果，待拆分為多個 Spectra changes）

## 討論來源

- 僅使用 `_private/discuss.txt` 的內容作為輸入。
- 偵察過的程式碼證據：
  - `src/modules/vocabulary/data/jpWords.ts`（7611 行、約 1086 筆 entries）
  - `src/modules/vocabulary/types/vocabulary.ts`（`RawVocabularyEntry` / `VocabularyEntry` 結構）
  - `src/modules/vocabulary/utils/vocabularyFilters.ts`（`normalizeVocabularyEntries` 以 `index + 1` 產生 id）
  - `src/modules/vocabulary/storage/vocabularyMarksStorage.ts`（`VocabularyMarkSnapshot.markedIds: number[]`）
  - `src/modules/vocabulary/composables/useVocabularySession.ts`
- CSV 規模（`_private/`）：N1 = 2698、N2 = 1747、N3 = 2138、N4 = 667、N5 = 717（含表頭，扣掉約 7962 筆）。

---

## 我的假設（assumptions mode，請逐條確認）

> 規則：列出我目前依現況做出的判斷與證據；若有錯誤，請於回覆中標出，我會逐條跟進、再進入 Convergence。

1. **CSV 翻譯與詞性標註必須分批送審，不能一次直接覆寫。**
   - 證據：`discuss.txt` 第 7、21 行強調「教材，不允許錯誤或瑕疵」；目前五份 CSV 合計約 7962 筆英文翻譯需轉中文，且需精準辨識辭書形 / 形容詞分類。
   - 若錯：若採一次性自動翻譯後直接覆寫原檔，會在無法復原的情況下混入錯誤翻譯與錯誤詞性標註，違反大前提。
   - 推論：必須採「以 chunk（每次 50–100 筆）逐批處理 + 每批比對 + commit」，原檔需先複製成 working copy 或在 git 上以可回溯的方式變更。
   - 結論：必須採「以 chunk（每次 50–100 筆）逐批處理 + 每批比對 + commit」，原檔會以後續git 可以回朔的方式變更。
2. **跨 CSV 去重的 key 是 `expression + reading`（即同時匹配漢字寫法與假名讀音），而不是只比對 `expression`。**
   - 證據：N5 CSV 中已存在 `あつい` 的三個不同 entry（`暑い` / `熱い` / `厚い`），單看讀音會誤刪不同義字；單看漢字又會錯過同字異讀。
   - 若錯：誤刪同形異義詞或同音異字會造成教材內容缺失。
   - 結論：對，是 `expression + reading`（即同時匹配漢字寫法與假名讀音），而不是只比對 `expression`。

3. **跨 CSV 衝突時，「保留難度低（N5 端）刪除難度高（N1 端）」表示 stage 由低決定。**
   - 證據：`discuss.txt` 第 9 行「n5.csv 與 n1.csv有重複單字，則刪除 n1.csv 的單字」。
   - 若錯：若反過來保留高難度，會讓初學階段缺字、且現有 jpWords.ts 的 N5 entries 會無對應來源。
   - 結論：沒錯

4. **`jpword_N*.ts` 拆檔後仍以陣列 export `RawVocabularyEntry[]`，並由聚合層 `jpWords.ts` 依 N5→N4→N3→N2→N1 串接。**
   - 證據：現有 `useVocabularySession` 透過 `import { vocabularyEntries } from '@/modules/vocabulary/data/jpWords'` 使用，並在 `normalizeVocabularyEntries` 用陣列順序產生 id；保留聚合層可降低呼叫端改動成本。
   - 若錯：若預期改成 lazy import（按需載入單一 stage），則 `useVocabularySession`、`filterVocabularyEntries`、`buildVisibleStageGroups` 都要改寫。
   - 結論：拆檔結構維持「`jpword_N*.ts` 各自 export `RawVocabularyEntry[]` + 聚合層 `jpWords.ts` 串接」。同時在合併 CSV 之後，為每筆單字補一個 `displayId`（格式 `N5_1`、`N4_100`），用於人類可讀的展示／log，但**不作為儲存 key**（見假設 #5 結論）。

5. **註記儲存（`vocabularyMarksStorage`）必須改用 stable natural key，而不是繼續用 `index + 1`。**
   - 證據：`normalizeVocabularyEntries` 的 id 是陣列 index + 1；只要拆檔、刪重複、或合併 CSV，所有 id 會重新編號 → 既有使用者的 `markedIds` 會指到錯誤單字。
   - 若錯：若選擇「不保留既有註記、直接清空」，則只需要在發版時主動 `clearVocabularyMarksSnapshot`，不需要 schema migration。
   - 結論：採「儲存 key 與 displayId 分離」雙軌制：
     - **儲存 key（用於 `vocabularyMarksStorage`）**：使用內容 natural key `${text}|${kanji}`（不含 stage，避免未來重新分級導致註記失效；空 `kanji` 以空字串保留，例：`おい|`）。對應的型別由 `markedIds: number[]` 改成 `markedKeys: string[]`，schema bump 到 `version: 2`。
     - **displayId（用於 UI / log / debug）**：採 `N5_1`、`N4_100` 格式，於最後一步合併 CSV 之後一次發配，並遵守 **append-only、不回收已刪除號碼** 的紀律；不參與儲存／不參與比對相等性判斷。
     - **migration / 校驗策略（統一規則：對不上就直接刪掉那筆 localStorage 資料，無通知）**：
       - **時機 A（v1 → v2 schema 升級當下）**：讀 v1 `markedIds`，逐筆以「當下字典順序」反查 `text + kanji` 換成新 key；查不到的那筆直接捨棄，最後寫回 v2。
       - **時機 B（每次 app 啟動載入 v2 時）**：把 `markedKeys` 與當下字典的 natural-key 索引比對；不存在的 key 直接從 `markedKeys` 移除並寫回 localStorage。
       - 兩個時機共用同一個 helper：`pruneMarkedKeysAgainstDictionary(keys, dictionaryKeySet) → keys'`，純函式、易測。
       - **不彈 alert、不寫 log 給使用者看**（使用者不需要知道某筆失效）。

> **這 5 條哪些是錯的？** 若全部成立，我就以這個假設集進入 Convergence。

---

## 三大議題的關鍵風險與相依性

```
┌─────────────────────────┐    ┌──────────────────────────────┐    ┌──────────────────────────────┐
│  ① CSV 整理（外部資料）  │ ─▶ │  ② 拆檔 + 與 CSV 合併（內部） │ ─▶ │  ③ 註記儲存重構              │
│  - 英文 → 中文           │    │  - jpword.ts → jpword_N*.ts  │    │  - markedIds 改成 stable key │
│  - 詞性標註              │    │  - 跨檔去重                  │    │  - schema migration          │
│  - 動詞辭書形            │    │  - CSV 與字典檔合併          │    │                              │
└─────────────────────────┘    └──────────────────────────────┘    └──────────────────────────────┘
```

### 風險清單

| # | 風險 | 影響 | 因應 |
|---|------|------|------|
| R1 | LLM 翻譯約 7962 筆英文 → 中文，極可能出現幻覺 / 錯詞性 | 違反大前提「精準、不允許錯誤」 | 分批 + 對照 + 抽樣校對；保留原 CSV 為唯一真相，不要直接覆寫 |
| R2 | 跨 CSV 去重時把同形異義詞誤判為重複 | 教材缺字 | 用 `expression + reading + meaning shape` 做去重判定 |
| R3 | 拆檔後 `vocabularyEntries` 順序變動 → `index + 1` id 全部重編 | 既有使用者本機儲存的註記指到錯字 | 在「拆檔合併 CSV」前先重構 `vocabularyMarksStorage`，把 key 改成 natural key `${text}\|${kanji}`（不含 stage） |
| R4 | jpWords.ts 既有資料的詞性標註可能與規則不一致（範例 `かく` 是有標的，但全檔不確定覆蓋率） | 教材一致性 | 在拆檔前先做一輪「標註審計」，列出未符合規則的條目 |
| R5 | 動詞辭書形偵測：CSV 含可能不是辭書形（例：`開ける` 是辭書形、但網路抓的條目可能混入「ます形」「て形」） | 教材正確性 | 對動詞 entries 跑規則化器（後綴白名單）+ 人工抽查 |
| R6 | 一次塞 ~5000–8000 筆進 `RawVocabularyEntry[]` | 啟動效能 / bundle 大小 | 先測量 baseline；必要時改 per-stage lazy import |
| R7 | CSV 屬於 `_private/`，不確定是否該進 repo | 機敏 / 智財 / 與專案教材定位的衝突 | 待使用者確認；建議只把「整理過後」的字典檔放 `src/`，原始 CSV 保留 `_private/` |
| R8 | `displayId`（`N5_1`、`N4_100`）若被當成 key 使用會復現原本的位置依賴問題 | 註記再次失效 | 明確規定 displayId **僅供顯示**；儲存層只認 natural key；加 lint / code review checklist 防止誤用 |
| R9 | 同一個 stage 內若有兩筆 `text + kanji` 完全相同（理論上應已被 #2 去重判定刪掉一個） | natural key 撞號、註記混淆 | `clean-private-csv` 與 `split-and-merge-jpwords` 的最後驗收必須跑 uniqueness assertion，撞號即 fail |
| R10 | 同一個 `text + kanji` 出現在不同 stage（例：N5 與 N3 都有「あう／会う」） | natural key 因不含 stage 會衝突 | 假設 #3 已規定「保留低 stage、刪高 stage」，所以合併後不會發生；同樣需要 uniqueness assertion 把關 |

---

## 建議的拆分（建議切成 4 個 Spectra changes，依序進行）

1. **`audit-jpwords-pos-tagging`**（前置作業，無資料動）
   - 跑掃描，列出 `jpWords.ts` 中所有未符合「(い形容詞 / な形容詞 / 五段動詞 / 一段動詞)」標註規則的條目。
   - 純報告、不改檔，作為後續變更的範圍依據。

2. **`refactor-vocabulary-marks-storage-key`**（必須先做）
   - 把 `VocabularyMarkSnapshot.markedIds: number[]` 改成 `markedKeys: string[]`，元素為 natural key `${text}|${kanji}`（**不含 stage**，避免未來重新分級失效）。
   - schema 升到 `version: 2`。實作 `pruneMarkedKeysAgainstDictionary(keys, dictionaryKeySet)` 純函式。
   - v1 → v2 升級：用當下字典反查 `text + kanji` 換成新 key；對不上的直接丟棄、不通知。
   - 每次啟動載入 v2：用同一個 prune helper 對當下字典再校驗一次，找不到的 key 直接從 localStorage 移除。
   - 連帶調整：`VocabularyEntry.id` 仍可保留為 number 不影響此變更，但 `useVocabularySession` 中所有依賴 `markedIds`（含 `toggleMarked`、`saveMarks`、`clearAll...`、`showMarkedOnly` 過濾）都要改為以 key 比對。
   - 不更動字典檔內容，純粹替後續變更解除耦合。

3. **`clean-private-csv`**（與字典檔解耦的第一步）
   - 五份 CSV 的：英文→中文翻譯、詞性標註、動詞辭書形轉換、跨檔去重。
   - 分批 PR / commit，每批含對照表與抽樣審查紀錄。
   - 不動 `src/`。

4. **`split-and-merge-jpwords`**（最後一步，吃 #1、#2、#3 的成果）
   - 把 `jpWords.ts` 拆成 `jpword_N1..N5.ts`，聚合層維持 N5→N4→N3→N2→N1 的串接順序。
   - 與整理過後的 CSV 合併（按假設 #2 的 key 做去重 / 合併 / 翻譯整併）。
   - **合併完成後一次性發配 `displayId`**：每個 stage 內依排序給流水號 `N5_1`、`N5_2` ... `N4_1`、`N4_100` ...；同時在 `RawVocabularyEntry` / `VocabularyEntry` 加 `displayId: string` 欄位。
   - 加上 lint / 自動化檢查：禁止手動修改 `displayId`，新單字一律 `append` 到該 stage 的尾端取下一號，刪除的單字其號碼不得回收。
   - 切換 `useVocabularySession` 的 import 來源；驗證註記功能仍正確（已被 #2 解耦，註記是綁 natural key、不是 displayId）。

---

## 仍待使用者裁示的點（Open Questions）

> 這幾題會直接影響 propose 的範圍與技術決策，建議在啟動 `/spectra-propose` 之前先回答。

1. ~~**去重 key 定義**~~：已於假設 #2 結論中確認 — 用 `expression + reading`。
2. ~~**註記遷移策略**~~：已於假設 #5 結論中確認 — 採「對不上就刪掉那筆 localStorage 資料、不通知」的統一規則，v1→v2 升級與每次啟動的 key 校驗共用同一個 prune helper。
3. **是否導入 lazy import**：把 `jpword_N*.ts` 改成按需載入（依使用者勾選的 stage）？還是維持目前一次 import 全部？
- 要導入lazy import
4. **CSV 的 commit 策略**：原始 CSV 是否進 repo 作為教材來源？還是僅留 `_private/` 作為私有來源、最終只 commit 整理過的 `jpword_N*.ts`？
- 原始 CSV 僅留 `_private/` 作為私有來源、最終只 commit 整理過的 `jpword_N*.ts`？
5. ~~**動詞 / 形容詞詞性的權威來源**~~：採 **JMdict 為主、規則化器為輔、人工只審差異** 的三層 pipeline。原則：正確性極高、能不人工就不人工。
   - **第 1 層 — JMdict lookup（自動）**：以 JMdict POS code 直接 mapping 到專案標籤
     | JMdict code | 專案標籤 |
     |-------------|---------|
     | `adj-i` | い形容詞 |
     | `adj-na` | な形容詞 |
     | `v5k` / `v5s` / `v5r` / `v5g` / `v5b` / `v5m` / `v5n` / `v5t` / `v5u` … | 五段動詞 |
     | `v1` | 一段動詞 |
   - **第 2 層 — 規則化器 sanity check（自動）**：依字尾規則做 cross-check，與 JMdict 結果一致 → 直接通過；不一致 → 進第 3 層。
   - **第 3 層 — Wiktionary 或次要字典 fallback（自動）**：JMdict 未命中時嘗試 Wiktionary API；仍未命中或多 POS 衝突 → 進第 4 層。
   - **第 4 層 — 人工裁示（僅針對前三層全部失敗的 ⚠️ 條目）**：預期 < 5%。
   - 落地：寫一支 Node script，吃整理過後的 CSV → 跑 4 層 pipeline → 輸出「自動完成 / 待人工裁示」兩份報表。JMdict 資料放 `_private/_tools/jmdict/`，不進 repo。

6. ~~**翻譯品質驗收標準**~~：採 **100% 人工逐筆審核** 為最終驗收門檻；「抽樣」只用於 pipeline 內部品控與事後審計，不是驗收標準。詳細條件：
   - **每批（50–100 筆）完成條件**（全部打勾才算過）：
     - [ ] 規則化器掃描 0 violation
     - [ ] JMdict 詞性對照 0 unresolved（⚠️ 標記都已人工裁示）
     - [ ] 100% 逐筆人工 review，每筆確認「翻譯正確 / 詞性正確 / 辭書形正確」
     - [ ] 任何一筆有疑義 → 整批退回重做，不部分過
   - **5 份 CSV 全部完成後的最終驗收**：
     - [ ] uniqueness assertion 通過（跨檔無 `expression + reading` 重複）
     - [ ] 詞性標註覆蓋率 100%
     - [ ] 從 5 份 CSV 隨機抽 100 筆做事後 second-pass audit，0 error
   - 注意：「最終驗收」中的隨機抽 100 筆是 audit（事後檢驗），不是接受門檻。接受門檻一律 100% 人工。

---

## Conclusion

- **Decision：** 三大議題彼此有強相依，拆成 **4 個 Spectra changes** 依序執行：`audit-jpwords-pos-tagging` → `refactor-vocabulary-marks-storage-key` → `clean-private-csv` → `split-and-merge-jpwords`。
- **Rationale：** 註記儲存目前以 `index + 1` 為 key，任何拆檔／去重／合併動作都會破壞既有使用者的本地註記；因此「儲存重構」必須**先於**字典檔結構變動。同時 ~7962 筆翻譯與詞性標註的工作量遠大於一次 PR 可承受，必須分批 + 解耦。
- **已收斂的關鍵設計**：
  - 儲存層 key：`${text}|${kanji}` natural key（不含 stage）
  - displayId：`N5_1`、`N4_100`，append-only、僅供顯示
  - 校驗策略：對不上就直接從 localStorage 移除、不通知
  - 字典檔載入：lazy import，依使用者勾選的 stage 按需載入
  - 原始 CSV：留 `_private/`、不進 repo；只 commit 整理過的 `jpword_N*.ts`
  - 詞性標註：JMdict → 規則化器 → Wiktionary fallback → 人工（< 5%）四層 pipeline
  - 驗收：100% 人工逐筆審核為最終門檻；抽樣只用於 pipeline 品控與事後 audit
- **Capture to：** 本檔（`_private/propose.md`）。後續每個 change 由 `/spectra-propose <change-name>` 各自展開為 proposal / design / spec / tasks。

---

## 建議下一步

所有假設與 Open Questions 都已收斂，可以直接啟動第一個 change：

```
/spectra-propose refactor-vocabulary-marks-storage-key
```

依序執行：

1. `/spectra-propose refactor-vocabulary-marks-storage-key`（儲存層解耦，必須最先做）
2. `/spectra-propose audit-jpwords-pos-tagging`（純報告，掃描既有 jpWords.ts 標註不合規條目）
3. `/spectra-propose clean-private-csv`（五份 CSV 翻譯／詞性／辭書形／去重，跑 JMdict 四層 pipeline）
4. `/spectra-propose split-and-merge-jpwords`（拆檔、與 CSV 合併、發配 displayId、切換 lazy import）
