## Context

單字練習頁目前以 `jpWords.ts` 作為靜態字典來源，資料列有 `stage` 欄位，但使用者要將它收斂為 JLPT 難度 N1～N5，並讓頁面可用 checkbox 控制實際顯示單字。此變更同時要求改善目前單字頁資料處理效率，且不能破壞既有搜尋、註記、練習模式、只顯示註記與長按揭露行為。

## Goals / Non-Goals

**Goals:**

- 單字練習頁新增 N1～N5 與「全部勾選」checkbox，並以勾選狀態控制可見單字。
- `jpWords.ts` 每筆單字的 `stage` 只允許 N1、N2、N3、N4、N5。
- 預設狀態為 N1～N5 全部勾選，讓首次進入頁面的可見單字不因新增篩選而消失。
- 移除「XXXX 個單字」數量統計 UI。
- 調整控制列：level filter 在上方；練習、只顯示註記與儲存註記同列。
- 單字頁上方非字母控制區的三個垂直 block 之間不保留外層 gap。
- 改善單字頁可見資料推導效率，避免多處重複轉換與重複篩選。

**Non-Goals:**

- 不新增伺服器、雲端同步、帳號或 analytics。
- 不新增 SRS、熟練度或跨頁學習進度功能。
- 不引入 Pinia、IndexedDB 或新的外部依賴。
- 不重做整個單字頁視覺，只調整本 change 涉及的控制列與統計 UI。

## Decisions

### JLPT level stage data in jpWords.ts

`src/modules/vocabulary/data/jpWords.ts` 的 `stage` 欄位改為 JLPT level 字串，並在 `src/modules/vocabulary/types/vocabulary.ts` 定義 `VocabularyJlptLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5'`。資料測試要驗證所有單字 stage 均屬於這五種值，避免舊 stage 名稱與新 level 混用。

替代方案：新增另一個 `level` 欄位並保留舊 `stage`。淘汰原因是使用者明確要求 stage 內容改成 N1/N2/N3/N4/N5；雙欄位會增加資料同步與篩選歧義。

### Parent-owned vocabulary level filter state in useVocabularySession

JLPT level filter state 放在 `src/modules/vocabulary/composables/useVocabularySession.ts`，讓 `VocabularyView.vue` 與控制列共用同一份狀態。建議 state shape 為 `selectedJlptLevels: Set<VocabularyJlptLevel>`，初始值包含 N1～N5 全部 level。衍生狀態 `allJlptLevelsSelected` 由 selected set 與全 level 清單計算，不另外保存第二份真相。

替代方案：在 `VocabularyControlBar.vue` 自行持有 checkbox state。淘汰原因是可見單字篩選在 view/session 層使用，若控制列自行保存 state，容易造成 UI 與資料列表不同步。

### Select-all level filter synchronization

「全部勾選」不是獨立資料來源，而是 selected set 的衍生控制。勾選全部時 selected set 變成 N1～N5；取消全部時 selected set 變成空集合；取消任一 level 時全部勾選會自動變 false；手動把 N1～N5 都勾回來時全部勾選會自動變 true。若 selected set 為空，可見單字清單為空。

替代方案：把「全部勾選」保存成獨立 boolean。淘汰原因是會產生兩份真相，尤其在手動勾回所有 level 時容易忘記同步。

### Efficient visible vocabulary derivation

單字資料應先在資料層或 session 初始化時整理成可直接篩選的結構；可見單字只由 normalized vocabulary、selectedJlptLevels、搜尋條件、註記條件與練習模式推導。篩選流程應集中在 `src/modules/vocabulary/utils/vocabularyFilters.ts` 或 session 的單一路徑，避免 view、control bar 與 table 多處重複 filter / map。

替代方案：在每個元件內各自 filter 所需資料。淘汰原因是目前問題包含效率差，分散篩選會增加 render 時重複計算與行為不一致風險。

### Vocabulary control layout without count summary

`VocabularyCountSummary.vue` 的「XXXX 個單字」UI 不再顯示。N1～N5 與「全部勾選」checkbox 放在練習控制列上方；「練習」與「只顯示註記」靠左同列且保留 gap；「儲存註記」按鈕在同列右側。手機優先下可允許換行，但相對順序與分組語意必須維持。

替代方案：保留數量摘要並只移動位置。淘汰原因是使用者明確要求移除此功能及 UI。

### 8px vertical gap between vocabulary upper control blocks

`VocabularyControlBar.vue` 的上方非字母區塊由搜尋/全域篩選、JLPT level controls、action controls 三個垂直 block 組成；外層 `.vocabulary-control-bar` 的 block 間距需為 8px。此調整只影響三個 block 之間的垂直 gap，不移除 block 內部的水平 gap 或 checkbox 之間的可讀間距。

替代方案：把外層 gap 改為 0。淘汰原因是使用者修正需求，明確指定最終應為 8px。

### Test-first vocabulary verification

依專案 TDD 偏好，先補資料、filter、component 與必要 e2e 測試，再實作。測試至少覆蓋：stage 僅能是 N1～N5、level 篩選影響 visible words、全部勾選同步、數量統計 UI 移除、控制列排列、既有搜尋/註記/練習功能不回歸。

替代方案：只靠手動檢查 UI。淘汰原因是本 change 同時改資料模型、互動狀態與效能路徑，沒有自動測試容易出現篩選或註記回歸。

## Risks / Trade-offs

- [Risk] 把所有 stage 改成 N1～N5 時可能誤標難度。→ Mitigation: 先用資料測試驗證值域，內容難度歸類若需人工修正，應集中在 `jpWords.ts`。
- [Risk] 新增 level 篩選可能與搜尋、只顯示註記、練習模式互相覆蓋。→ Mitigation: 將所有條件集中在單一路徑推導 visible words，並以組合測試覆蓋。
- [Risk] selected set 為空時畫面可能看似沒有資料。→ Mitigation: 規格明確定義空集合顯示空清單，不視為錯誤；既有 empty 狀態不得 console error。
- [Risk] 移除數量摘要可能讓使用者少一個回饋。→ Mitigation: 這是明確需求；其他控制與 table 可見性仍保留。
- [Risk] 外層垂直 gap 若太小或太大，可能讓三個控制 block 看起來過緊或分離。→ Mitigation: 將 block 間距固定為 8px，保留 block 內部 padding、border 與水平 gap，並以 375px e2e 確認不水平溢出。

## Migration Plan

1. 先補資料值域、filter、component 與 e2e 測試，讓目前行為失敗。
2. 更新 vocabulary 型別與 `jpWords.ts` stage 值。
3. 更新 session/filter 資料流，加入 selectedJlptLevels 與全部勾選同步。
4. 更新控制列與 view UI，移除數量摘要渲染並調整控制列排列。
5. 將上方三個控制 block 的外層垂直 gap 調整為 8px。
6. 更新 `PROJECT_ARCHITECTURE.md`。
7. 執行 lint、typecheck、unit test、build 與 vocabulary e2e。

Rollback 策略：還原 vocabulary 型別、資料 stage、session/filter、control bar/view 與測試；此 change 不新增持久化 key，因此沒有 localStorage migration。

## Open Questions

無。`_private/propose.md` 已明確指定 change 名稱、N1～N5 行為、全部勾選同步、stage 值域、效率改善方向與 UI 調整。
