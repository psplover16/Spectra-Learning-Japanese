## Context

單字練習目前由 `useVocabularySession` 一次載入 `jpWords.ts`，再用 `selectedJlptLevels`、搜尋、字音與註記狀態過濾 `visibleEntries`。註記有兩層：`persistedMarkedKeys` 來自 localStorage v2 snapshot，`draftMarkedKeys` 是畫面上的暫存勾選，只有按「儲存註記」才會持久化。

字母練習測驗已有 `createExamSession`、`ExamModal` 與 `latestUnknownResults` localStorage 結算。單字測驗可借用 modal 呈現形式，但結算語意完全不同：單字只改畫面勾選，不寫字母測驗結果。

## Goals / Non-Goals

**Goals:**

- 先整理單字資料，再建立單字測驗，確保 `から` 與 `あげる` 類型都能正確出題。
- 將單字資料依 N1 到 N5 拆檔，讓 stage checkbox 成為 lazy import 的資料入口。
- 新增單字測驗 session，題庫來自開始當下的可見且已勾選單字 snapshot。
- 保持字母練習測驗 UI 與 localStorage 結算不被單字測驗改壞。
- 手機優先調整單字測驗版面，讓多行答案不破版。

**Non-Goals:**

- 不新增後端、帳號、雲端同步或遠端 JLPT 查詢。
- 不把單字測驗結算自動寫入 localStorage。
- 不把字母測驗與單字測驗合併成單一通用 session。
- 不引入新的 UI 套件或外部依賴。

## Decisions

### 先規則化字典再建立單字測驗

先處理資料層，再做測驗層。`から` 需要一筆 entry 產生三個題幹，`あげる／上げる` 則需要同題幹合併多行答案；若資料格式未先穩定，展題與結算會反覆返工。

替代方案：先做測驗再回頭改資料。淘汰原因是題目數、答案合併與 checkbox 結算都依賴資料格式，先做 UI 會留下錯誤模型。

### 用 stage 分檔與 lazy import 取代單一 jpWords 入口

將原始資料拆為 `jpWords_N1.ts` 到 `jpWords_N5.ts`，每檔 default export raw entries。`useVocabularySession` 根據 `selectedJlptLevels` 載入對應 stage，合併後再 normalize、建立 markKey 與 visible entries。`jpWords.ts` 不再保留，避免看似仍有 all-in-one 資料入口。

composable state shape：

- `selectedJlptLevels: Ref<Set<VocabularyJlptLevel>>`，初始值為五級全選。
- `loadedStageEntries: Ref<Partial<Record<VocabularyJlptLevel, VocabularyEntry[]>>>`，初始值為空物件。
- `loadingJlptLevels: Ref<Set<VocabularyJlptLevel>>`，追蹤正在載入的 stage。
- `loadError: Ref<string | null>`，stage import 失敗時供 UI 顯示。
- `persistedMarkedKeys: Ref<Set<string>>` 與 `draftMarkedKeys: Ref<Set<string>>` 維持既有職責。

離線資料職責：字典檔由 Vite 打包進 PWA 靜態資源，localStorage 只保存註記 snapshot；本變更不使用 IndexedDB、不新增 Pinia store。若 lazy import 失敗，畫面顯示錯誤並停用測驗開始，不改動既有註記。

替代方案：保留 `jpWords.ts` 統一匯入再用 filter 切 stage。淘汰原因是無法達成需求指定的 lazy import，也無法降低初始載入成本。

### 單字測驗使用獨立 session 並只回寫 draftMarkedKeys

新增 `useVocabularyExamSession`，輸入為開始當下的 `visibleEntries` 與目前 checkbox 勾選狀態。可受測集合為 `visibleEntries ∩ (draftMarkedKeys ∪ persistedMarkedKeys)`，並立即建立 snapshot deck；測驗進行中不受 stage/filter/checkbox 後續變化影響。

結算時以 entry markKey 聚合題目結果：該 entry 所有已展開題目都按「下一步」才從 `draftMarkedKeys` 移除；任一題「我不清楚」則保留或加入；中途關閉造成未答時保留原勾選狀態。session 不呼叫 `saveMarks()`，不寫 `persistedMarkedKeys`，不寫 `latestUnknownResults`。

替代方案：擴充既有 `createExamSession` 成 generic session。淘汰原因是字母練習的 looped deck、unknown result localStorage 與單字 draft 結算不同，強行共用會讓兩條規則互相污染。

### 展題以 text 與單行 kanji 分組

展題時把 entry 的 `kanji` 與 `meaning` 分行對應，再以 `(text, kanji-line)` 分組。不同 kanji 形成不同題，例如 `から／殻` 與 `から／空`；沒有 kanji 的義項題幹只有 text；同 text 同 kanji 的多個 meaning 合併成同一題，答案以換行串接。

題卡需要保存 `id`、`markKey`、`promptText`、`answerText`、`answerRevealed`、`unknownMarked` 與是否已完成，方便結算判斷未答題。題庫建立後全題洗牌，不維持同 entry 相鄰。

替代方案：一律每個 meaning 行一題。淘汰原因是 `あげる／上げる` 會變成多題同題幹，違反需求要求的一題多行答案。

### ExamModal 只增加可配置呈現能力

`ExamModal` 保留既有 props 與 emit，新增可選 props 讓呼叫端控制題目尺寸與提示區顯示。字母練習使用預設大字級與提示文字，單字測驗使用 `promptSize='md'`、隱藏提示區、加高答案區並套用 `white-space: pre-line`、`overflow-wrap: anywhere`。

替代方案：複製一份 `VocabularyExamModal`。淘汰原因是關閉確認、body scroll lock、基本操作列都相同，複製會增加回歸成本；但只共享呈現殼，不共享單字與字母的 session 邏輯。

## Risks / Trade-offs

- [Risk] 拆檔後 entry id 可能因載入順序改變而影響既有 UI 測試 → Mitigation：mark persistence 繼續使用 `text|kanji`，測試避免依賴跨 stage 全域數字 id；必要時 normalize 時依 `vocabularyJlptLevels` 固定合併順序。
- [Risk] lazy import 造成短暫 loading/empty 狀態 → Mitigation：`useVocabularySession` 明確暴露 loading/error，control bar 與 table 在載入中不顯示錯誤空狀態，開始測驗按鈕 disabled。
- [Risk] 修改 `ExamModal` 可能影響字母練習 → Mitigation：所有新 props 都有維持現況的預設值，保留既有 component/unit/e2e 測試並新增字母練習回歸案例。
- [Risk] 多義格式規則與 checker 不一致 → Mitigation：先更新 `vocabularyMeaningFormat` spec，再以 unit tests 驅動 checker，最後修資料到 checker 0 violation。
- [Risk] 單字測驗結算後使用者忘記儲存 → Mitigation：結算後讓 `hasUnsavedMarkChanges` 反映差異，並在 UI 顯示「請按儲存註記」提醒或強化儲存按鈕狀態。

## Migration Plan

1. 更新多義單字 spec 與 checker 測試，定義合法格式。
2. 整併重複 entry、新增 `から`，確認資料通過 checker。
3. 拆分 N1 到 N5 資料檔並改寫 session lazy import。
4. 新增單字測驗 session 與 UI 串接。
5. 更新 `PROJECT_ARCHITECTURE.md` 與測試。

Rollback 方式：若 lazy import 或測驗串接出現高風險，可先保留已修正資料與 spec，暫時不掛上「開始測驗」按鈕；localStorage snapshot 不需 migration，因為 markKey 不含 stage。

## Open Questions

目前無待決問題。`@/_private/propose.md` 已明確指定資料整理、展題、版面與結算規則。
