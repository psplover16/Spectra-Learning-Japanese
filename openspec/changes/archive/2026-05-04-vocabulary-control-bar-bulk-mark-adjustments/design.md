## Context

單字練習頁目前由 VocabularyControlBar、VocabularyStageTable、VocabularyView 與 useVocabularySession 組合而成。JLPT level 篩選、search、marked-only、practice mode 與 lazy-loaded vocabulary data 共同決定目前 visible entries；draftMarkedKeys 代表畫面上的暫存勾選，persistedMarkedKeys 與 localStorage version 2 snapshot 代表已儲存註記。

本變更不新增資料來源，不引入外部 API，也不變更 localStorage schema。localStorage 只由「儲存註記」動作寫入；header checkbox 只改 draftMarkedKeys。IndexedDB 與 Pinia 不參與本次流程。

狀態 shape：useVocabularySession 維持 selectedJlptLevels: Set<VocabularyJlptLevel>、visibleEntries: VocabularyEntry[]、draftMarkedKeys: Set<string>、persistedMarkedKeys: Set<string>、searchText、showMarkedOnly、practiceMode、loading/error state。新增或調整的批次勾選行為應由 visibleEntries 推導 visible mark key scope，避免重複計算可見範圍。

## Goals / Non-Goals

**Goals:**

- JLPT row 只顯示 N1、N2、N3、N4、N5 checkbox，並把開始測驗按鈕放在同一 row 右側。
- 開始測驗按鈕在無可見單字時隱藏；有可見單字但沒有可測驗勾選單字時保留 disabled。
- Table header 最右側 checkbox 改成目前可見 entries 的 draft mark 全選/全不選。
- Header checkbox 狀態由目前可見 entries 的 draft mark 狀態同步推導。
- Header checkbox 操作不顯示刪除 alert，也不直接寫入或刪除 localStorage。

**Non-Goals:**

- 不重新設計整個單字練習頁。
- 不改變儲存註記按鈕的持久化責任。
- 不重新引入 JLPT 全部勾選 checkbox。
- 不改變單字測驗出題、答題或結算流程。

## Decisions

### Decision: Split vocabulary controls into two left-right rows

VocabularyControlBar 應把 JLPT level row 改成左側 N1-N5 checkbox group、右側 start-quiz button。下方 action row 維持左側 practice/marked-only checkbox group、右側 save-marks button。整個 action row 應使用與 JLPT level controls row 相同的 padding、背景色、外框與圓角，讓練習/只顯示註記與儲存註記所在 row 的內容起點和 N1-N5 row 對齊，且兩行看起來像同一組控制區塊。這讓兩行的視覺語意一致，也移除 select-all level checkbox 的額外狀態同步。

替代方案：保留 start-quiz 在下方 action row。淘汰原因是使用者明確要求搬到 JLPT row，且 start quiz 與目前 visible level/filter 範圍關聯更強。

### Decision: Keep start quiz hidden only when there are no visible rows

Start-quiz control 的 visibility 應與 save-marks control 的無可見單字行為一致：visibleEntries 為空時隱藏。有可見 row 但沒有任何 visible marked entry 時，按鈕仍顯示 disabled，讓使用者理解需要先勾選可見單字才能測驗。

替代方案：沒有可測驗勾選單字時也隱藏 start-quiz。淘汰原因是這會讓可見 rows 存在時缺少明確 affordance，不如 disabled 狀態清楚。

### Decision: Replace header clear with draft-only visible bulk mark

VocabularyStageTable header 最右側 checkbox 應發出批次 draft mark 更新，而不是 clear persisted marks。useVocabularySession 應提供針對目前 visibleEntries 的 bulk mark action：checked=true 時加入所有 visible mark keys，checked=false 時移除所有 visible mark keys。Scope 外 draft keys 必須保留。

替代方案：讓 table 自己逐列 emit toggle-marked。淘汰原因是 table 只知道目前 props，批次行為與 visible scope、draft state ownership 更適合集中在 session 層。

### Decision: Derive header checkbox checked state from visible draft marks

Header checkbox 的 checked state 應由 visibleEntries 與 draftMarkedKeys 推導：有 visible rows 且全部 visible mark keys 都在 draftMarkedKeys 內時為 checked；任一 visible row 未勾選時為 unchecked。當使用者取消任一 row，下一次 render 會讓 header checkbox 同步變 unchecked。

替代方案：在 table component 內維護獨立 header checked ref。淘汰原因是獨立狀態會與 row checkbox 狀態脫節，容易發生 header 顯示錯誤。

## Risks / Trade-offs

- [Risk] 移除 select-all checkbox 會破壞既有測試與 e2e 操作流程 → Mitigation: 更新測試改以 individual N1-N5 checkboxes 驗證 no-level 狀態與 level 篩選。
- [Risk] header checkbox 若直接寫 localStorage 會與儲存註記責任衝突 → Mitigation: 批次 action 只更新 draftMarkedKeys，持久化仍只由 saveMarks 執行。
- [Risk] visible scope 在 marked-only filter 下會因勾選變更而即時縮小 → Mitigation: 批次操作應先 snapshot 當下 visible mark keys，再更新 draftMarkedKeys。
- [Risk] 手機寬度下兩行 right-side buttons 可能擠壓 checkbox group → Mitigation: 使用現有 action row 的 mobile-first wrapping/gap pattern，並以 375px e2e 驗證無水平 overflow。

## Migration Plan

不需要資料遷移。既有 localStorage version 2 snapshot 保留；header checkbox 不再修改 localStorage，使用者必須透過儲存註記按鈕才會持久化 draft marks。

Rollback 時回復本 change 的 UI 與 session 行為即可，localStorage schema 未變，不需要資料回滾。

## Open Questions

無。`_private/propose.md` 已確認移除全部勾選、開始測驗搬到 JLPT row 右側，以及 header checkbox 改為目前可見單字全選/全不選控制。
