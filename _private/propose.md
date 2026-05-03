# vocabulary-quiz-feature

## 摘要

子路由「單字練習」新增測驗功能，並補強多義單字的資料規則。整體拆成 2 個 Spectra changes 依序執行：

1. **`add-multi-meaning-vocabulary-rule`**：定義多義單字資料規則、新增 `から` entry、修正既有違規條目
2. **`add-vocabulary-quiz-feature`**：新增「開始測驗」按鈕、測驗 Modal、結算寫回 draftMarkedKeys

來源：`_private/discuss.txt`。

---

## 程式碼上下文（既有實作）

| 檔案 | 角色 |
|------|------|
| `src/modules/exam/components/ExamModal.vue` | 既有測驗 modal（下一步 / 我不清楚 / 關閉確認流程，已驗證） |
| `src/modules/exam/composables/useExamSession.ts` | 字母練習 session（`createExamSession()` / `settle()` / `buildLoopedDeck`） |
| `src/modules/exam/types/exam.ts` | `ExamQuestionCard`（kana 欄位寫死：`hiragana / katakana / romaji`） |
| `src/modules/vocabulary/types/vocabulary.ts` | `VocabularyEntry.markKey: string`、`VocabularyMarkSnapshot.version: 2`（natural-key 重構已完成） |
| `src/modules/vocabulary/composables/useVocabularySession.ts` | `draftMarkedKeys` / `persistedMarkedKeys: Set<string>`、`saveMarks()` 寫 v2 snapshot |
| `src/modules/vocabulary/components/VocabularyControlBar.vue` | 控制列（左 checkbox 群、右「儲存註記」按鈕） |
| `src/modules/vocabulary/components/VocabularyStageTable.vue` | 每列右側 checkbox（綁 `entry.markKey`） |
| `src/modules/vocabulary/data/jpWords.ts` | 字典檔（多義單字目前以 `\n` 分段） |
| `src/modules/practice/components/PracticeToolbar.vue` | 字母練習「送出」按鈕（`BaseButton variant="primary" :disabled`） — 配色參考 |

> **前提**：上一輪 propose 的「natural-key 重構」（`refactor-vocabulary-marks-storage-key`）已實作完成。本次新需求直接基於現有 `markKey` / `markedKeys` 架構設計，不再動 storage 層。

---

## 設計總則 A：多義單字資料模型

### A.1 `kanji` 與 `meaning` 欄位的分段規則

兩欄都視為「以 `\n` 分段的列表」：

- **`kanji` 欄**：只列出**有漢字**的義，按順序，不放 placeholder。例：`殻\n空`
- **`meaning` 欄**：列出**所有**義（有漢字 + 無漢字），無漢字的義一律放尾端。例：`外殼\n空(無內容)\n從～、因為～；助詞`
- **對齊規則**：第 k 段 meaning 對應第 k 個 kanji；超出 kanji 段數的 meaning 段一律是「無漢字義」、放最後
- **約束**：`meaning.split('\n').length >= kanji.split('\n').length`，無漢字段一定在尾端
- **單義單字**：`kanji` 與 `meaning` 都是單一字串、無 `\n`（與既有絕大多數 entries 行為一致）

### A.2 新增 entry 的處理規則

- **去重 key**：`text + kanji`（完整字串，含 `\n`）
  - 完全相同（兩欄都同）→ 拒絕加入
  - 同音異字（text 同、kanji 不同，例 `あつい / 暑い` vs `あつい / 熱い`）→ 允許加入
- **位置**：不特別排序，直接 append 到該 stage 區段尾端
- **入庫前檢查**：spec / lint 規則中明文：新增前先比對 `text + kanji`，已存在則拒絕加入

### A.3 `から` 新增 entry（N5 區段尾端）

```ts
{
  text: "から",
  romanization: "ka-ra",
  kanji: "殻\n空",
  meaning: "外殼\n空(無內容)\n從～、因為～；助詞",
  stage: "N5",
}
```

### A.4 既有違規條目處理

寫一支 audit 腳本掃描 `jpWords.ts`，找出違反 A.1 規則的條目（無漢字義不在尾端、或 meaning 段數 < kanji 段數）。違規條目逐筆修正：搬到尾端、meaning 段順序也跟著調整。

---

## 設計總則 B：測驗功能

### B.1 「開始測驗」按鈕（VocabularyControlBar）

- **位置**：放在「儲存註記」按鈕**左側**；那一行右半邊變成 `[開始測驗] [儲存註記]`
- **間距**：兩按鈕之間的間距 = 左半邊 checkbox 群內部 checkbox 間距
- **enabled 條件**：`visibleEntries.value.some(e => draftMarkedKeys.value.has(e.markKey))` ≥ 1
- **disabled 樣式**：`BaseButton variant="primary" :disabled="!canStartVocabularyExam"`，配色參考字母練習「送出」按鈕

### B.2 題目展開（測驗開始時 snapshot）

對「測驗開始時 `visibleEntries ∩ draftMarkedKeys` 快照」中每筆 entry，依 `meaning` 段數展開 `N` 題：

| 段 index | 對應 kanji 段 | promptText | answerText | question id |
|----------|--------------|-----------|-----------|-------------|
| 0 | `殻` | `から／殻` | `外殼` | `${markKey}__seg0` |
| 1 | `空` | `から／空` | `空(無內容)` | `${markKey}__seg1` |
| 2 | （無）| `から` | `從～、因為～；助詞` | `${markKey}__seg2` |

- prompt 中的分隔符用全形「／」（與 discuss.txt 行 32–33 一致）
- 同一個原始 entry 的多題共享同一個 `markKey`（沿用 `entry.markKey`，由 `vocabularyFilters` 既有規則生成）
- 每張題卡的 unique id 為 `${markKey}__seg${index}`，結算時用 `markKey` 聚合同 entry 的所有題卡
- **題目總數**：`sum(snapshot 中每個 entry 的 meaning.split('\n').length)`，**無題數上限**
- **題目排序**：所有題卡展開後做**全題完全洗牌**，同 entry 的多題會散在隨機位置
- **題目集合 snapshot**：測驗開始時固定，之後使用者切換 stage filter / 改 checkbox 都不影響進行中的題庫

### B.3 結算規則（per-entry 匯總）

統一原則：

> **只有「全部段都已答 + 全部都是『下一步』」才解除打勾；任何「我不知道」或「未答」都視為打勾。**

| 該 entry 的答題狀態 | 結算動作 |
|---------------------|---------|
| 至少一段點過「我不知道」 | 加入 `draftMarkedKeys`（打勾） |
| 至少一段**未答**（即使其他段都點「下一步」）| 加入 `draftMarkedKeys`（打勾） |
| 完全沒答任何段（中途關閉、該 entry 都還沒輪到） | 加入 `draftMarkedKeys`（打勾） |
| **全部段都已答 + 全部都是「下一步」** | 從 `draftMarkedKeys` 移除（取消打勾） |

**結算寫入路徑**：

- **只更新 `draftMarkedKeys`**（純畫面狀態 = table 上各列右側的 checkbox 勾選狀態）
- **不**寫 `persistedMarkedKeys`、**不**寫 localStorage、**不**走 `saveMarks()` 路徑
- 使用者要持久化必須再點「儲存註記」按鈕（與一般打勾改動的路徑相同）
- 因為測驗開始時題庫 = `visibleEntries ∩ draftMarkedKeys`（每個受測 entry 原本就是打勾），所以結算只有「保留打勾」或「移除打勾」兩種終態，不會出現「測驗中新增打勾」

**與字母練習結算完全分開**：

- 字母練習結算：寫 `latestUnknownResults` localStorage，顯示 `UnknownResultPanel`
- 單字練習結算：只動 `draftMarkedKeys`，**不**寫 `latestUnknownResults`、**不**顯示任何 result panel、**不**產生「我不清楚的單字」清單

### B.4 Modal 行為（複用 ExamModal）

- **保留** `ExamModal.vue` 結構與 `next / unknown / confirmClose` 事件介面
- **擴充點**：
  - 新增 prop `promptSize?: 'lg' | 'md'`，預設 `'lg'`（字母練習用），單字練習傳 `'md'`（≈ 1.5rem）
  - 答案區加 `word-break: break-word; overflow-wrap: anywhere;` 防破版
- **中途關閉**：使用者按 X 鈕 → `window.confirm('確定要結束練習嗎？')` → 確認後**也走 settle()**，套用 B.3 結算規則（已答的算數，未答的視為打勾）

### B.5 Session 結構（兩支並列）

新增 `useVocabularyExamSession` composable，與既有 `createExamSession` 並列：

- 字母練習：用既有 `createExamSession`，邏輯不動
- 單字練習：用新的 `useVocabularyExamSession`，負責：
  - 從 `visibleEntries ∩ draftMarkedKeys` 快照展開題目（B.2）
  - 結算時跑 B.3 規則回寫 `draftMarkedKeys`
- 題目型別：`exam.ts` 加一個 `VocabularyExamQuestionCard`，與既有 `ExamQuestionCard` 並列（不需要 generic 化）

### B.6 結算後 UX 提示

結算結束時 modal 顯示一段提示：「測驗結算已更新畫面上的勾選，記得按『儲存註記』才能保存」。或者讓「儲存註記」按鈕在 `hasUnsavedMarkChanges` 為 true 時視覺強調（如 highlight）。具體交給設計階段定。

---

## 風險與因應

| # | 風險 | 影響 | 因應 |
|---|------|------|------|
| R1 | 結算後 `draftMarkedKeys` ≠ `persistedMarkedKeys`，使用者可能誤以為已自動保存，關頁面 → 結果丟失 | UX | B.6 的提示 + 「儲存註記」按鈕視覺強調 |
| R2 | 既有資料若違反 A.1 規則（無漢字義在中間） | 規則套用後資料不一致 | A.4 的 audit 腳本掃描 + 逐筆修正 |
| R3 | ExamModal 改動可能影響字母練習測驗 | 既有功能回歸 | `promptSize` 預設 `'lg'` 保持字母練習零變動；新測試覆蓋兩條路徑 |
| R4 | 多義 entry 的 kanji + meaning 段數不一致 → 題目展開錯亂 | 題目顯示錯誤 | dev mode assert；上線版以 meaning 段數為準、kanji 段不足補空字串 |
| R5 | 全題完全洗牌後，使用者中途關閉時某 entry 可能只答到部分段 | 結算需處理「部分已答」 | B.3 的 4 列規則已涵蓋（任一未答 → 打勾） |
| R6 | 字母練習與單字練習結算行為不一致，未來可能被誤改成共用 | 行為退化 | `useVocabularyExamSession.settle()` 加註解明確說明「不寫 localStorage / 不顯示 unknown panel」；spec 中明文寫出兩者差異 |

---

## Spectra Changes 拆分

### A. `add-multi-meaning-vocabulary-rule`

獨立可驗收，不依賴其他 change。

**Tasks**：

- 在 spec 中明文規定 A.1（多義單字資料分段規則）與 A.2（新增 entry 的去重 key + append-only 規則）
- 新增 `から` entry（A.3）到 jpWords.ts 中 N5 區段尾端
- 寫 audit 腳本掃描 jpWords.ts 違規條目（A.4）
- 違規條目逐筆修正：搬尾端、meaning 段順序對齊
- 加 lint / build-time 檢查：每筆 entry 都符合 A.1 約束（meaning 段數 ≥ kanji 段數）

**驗收**：

- 新增的 `から` entry 可被 `useVocabularySession` 正確載入並顯示三段 meaning
- audit 腳本對全檔執行 0 violation
- 嘗試新增完全重複（同 text + kanji）的 entry 會被 lint 擋下

### B. `add-vocabulary-quiz-feature`

依賴 A 完成（題目展開規則需要 A.1 的資料模型）。

**Tasks**：

- `VocabularyControlBar` 新增「開始測驗」按鈕（B.1）
- 新增 `useVocabularyExamSession` composable（B.2 + B.3 + B.5）
- `ExamModal.vue` 加 `promptSize` prop + 答案斷行樣式（B.4）
- `exam.ts` 擴充 `VocabularyExamQuestionCard` 型別
- `VocabularyView.vue` 引入 ExamModal 與新 session
- 結算後提示使用者要按「儲存註記」才會持久化（B.6）

**測試**：

- 題目展開（から 三題、單義單字一題、kanji + meaning 段數對齊）
- 結算 4 種狀態（全下一步 / 任一不知道 / 任一未答 / 完全沒答）
- 「開始測驗」 enabled / disabled 條件（visibleEntries ∩ draftMarkedKeys 為空時 disabled）
- 結算後 `draftMarkedKeys` 變動但 `persistedMarkedKeys` 不變（不寫 localStorage）
- 結算後不影響 `latestUnknownResults`（與字母練習結算解耦）
- 中途關閉測驗也跑 settle（confirmClose 路徑）
- 測驗中切換 stage filter 不影響已 snapshot 的題庫

---

## 已收斂的決策（速查）

| 主題 | 決策 |
|------|------|
| 多義 entry 分段 | `\n` 分段、無漢字義一律放尾端、`meaning` 段數 ≥ `kanji` 段數 |
| 新增 entry 去重 key | `text + kanji`（同音異字允許、完全相同拒絕） |
| 新增 entry 位置 | append 到該 stage 區段尾端，不特別排序 |
| `から` 的 stage | N5 |
| 「開始測驗」題目來源 | `visibleEntries ∩ draftMarkedKeys`（畫面上 + 已勾選） |
| 「開始測驗」disabled 條件 | 上述交集為空時 disable，配色參考字母練習「送出」按鈕 |
| 題目展開 | 每段 meaning 一題；prompt = `text／kanji`（無漢字段只有 text）；題卡 id = `${markKey}__seg${index}` |
| 題目排序 | 全題完全洗牌 |
| 題目集合 | 測驗開始時 snapshot、之後固定 |
| 題數限制 | 無上限 |
| Modal | 複用 ExamModal + `promptSize='md'` + 答案斷行 |
| Session 結構 | 兩支並列（字母用 `createExamSession`、單字用新增 `useVocabularyExamSession`） |
| 結算寫入 | 只動 `draftMarkedKeys`；**不**寫 localStorage、**不**走 saveMarks |
| 結算 per-entry 規則 | 全段已答 + 全「下一步」→ 移除打勾；任一「我不知道」或「未答」→ 打勾 |
| 中途關閉 | 也跑 settle（已答算數、未答視為打勾） |
| 字母 vs 單字結算 | 完全分開：字母寫 `latestUnknownResults` 並顯示 panel；單字不寫、不顯示 |

---

## 建議下一步（交由 Codex / `/spectra-propose` 處理）

依序啟動：

```
/spectra-propose add-multi-meaning-vocabulary-rule
/spectra-propose add-vocabulary-quiz-feature
```

第一支必須先完成並驗收，第二支才能展開（因為題目展開規則依賴 A.1 的資料模型）。
