## Context

單字測驗功能已建立在共用 ExamModal 與單字頁面的 draft/persisted mark 狀態之上。這次調整不新增資料來源，也不引入外部 API；唯一離線資料仍是 localStorage 內的 vocabulary marks v2 snapshot。主要風險在於目前頁面可見範圍會受搜尋、JLPT stage 篩選、只顯示註記與練習模式共同影響，因此儲存與清除都必須以同一份 visible vocabulary 結果為邊界。

狀態職責如下：localStorage 只保存已持久化的 markedKeys；useVocabularySession 維護 selectedLevels、loaded stage data、visibleVocabulary、draftMarkedKeys、persistedMarkedKeys、search state、mark-only state、practice mode state 與 loading/error state；Pinia store 不參與本次註記流程。

## Goals / Non-Goals

**Goals:**

- 單字測驗使用較緊湊且置中的答案呈現，並保留多行換行與手機寬度不 overflow。
- 字母練習不取得單字測驗專用版面選項時，仍維持既有大題目、提示文字與操作流程。
- 儲存註記與 header 清除只處理目前 visibleVocabulary 對應的 mark keys。
- 不可見的 persistedMarkedKeys 在搜尋、stage 篩選、只顯示註記或練習模式下都必須保留。
- 單字表在沒有其他排序條件時依 N5、N4、N3、N2、N1 顯示。

**Non-Goals:**

- 不新增未儲存提示或替代提示。
- 不讓單字測驗結算直接寫 localStorage。
- 不改 localStorage schema，除非實作證明現有 v2 snapshot 無法表達 visible-scope merge。
- 不重做字母練習 ExamModal 視覺設計。

## Decisions

### Decision: Scope vocabulary quiz presentation through explicit modal props

ExamModal 保持共享 shell，但單字測驗必須透過既有或新增的 vocabulary-specific presentation option 套用 compact spacing 與 multiline answer flex centering。預設 props 必須對應字母練習目前行為，避免共用 CSS class 全域改動造成字母練習回歸。

替代方案：直接修改 ExamModal 的預設版面。淘汰原因是這會把單字測驗的需求套到字母練習，違反路由特定規格優先於共用抽象。

### Decision: Treat visible vocabulary keys as the write boundary

儲存與 header 清除都應先從目前 visibleVocabulary 計算 visibleMarkedKeysScope。save marks 將以 persistedMarkedKeys 的複本為基底，只合併 scope 內 key 的 draft checked state：draft 有勾選就加入，draft 未勾選就移除；scope 外 key 完全不動。

替代方案：讓 save marks 繼續用 draftMarkedKeys 覆蓋整份 persisted snapshot。淘汰原因是 draft 只代表目前互動畫面，不代表使用者要刪除所有 hidden marks。

### Decision: Preserve persisted hidden marks during table header clear

Header 最右側清除 checkbox 的操作範圍必須與 save marks 使用同一個 visibleMarkedKeysScope。若保留確認視窗，確認文案要明確描述目前顯示的單字，不得使用全部註記。清除後 localStorage 與 persistedMarkedKeys 只移除 scope 內 key，scope 外 key 保留。

替代方案：保留清除全部註記並只修改文案。淘汰原因是這無法滿足目前頁面範圍語意，仍會造成不可見資料流失。

### Decision: Sort vocabulary by JLPT learning order

單一 visible vocabulary filtering path 在套用所有篩選後，應以 N5、N4、N3、N2、N1 作為 stage order。此排序與 duplicate consolidation 的 simplest-level 定義一致，讓學習者由簡入難瀏覽。

替代方案：維持 N1 到 N5 或沿用載入順序。淘汰原因是使用者已確認排序方向為 N5 到 N1，載入順序也不能成為可見排序的隱性規則。

## Risks / Trade-offs

- [Risk] visible scope 在多個元件各自計算會不一致 → Mitigation: 儲存、清除、quiz start 與表格都使用 useVocabularySession 暴露的同一份 visibleVocabulary 或由它推導的 key set。
- [Risk] mark-only 篩選下取消勾選會讓項目從畫面消失，導致 scope 計算時漏清 → Mitigation: 實作清除與儲存時以操作當下的 visible row key snapshot 為準，事件處理期間不要重新查詢已變動後的可見清單。
- [Risk] 共用 modal CSS 變更影響字母練習 → Mitigation: component test 驗證 alphabet default 與 vocabulary presentation 各自輸出。
- [Risk] localStorage 寫入仍是同步操作 → Mitigation: 本次只處理少量 mark keys，不引入新 dependency；保留既有 v2 snapshot 清理與版本解析。

## Migration Plan

現有 localStorage v2 snapshot 可直接沿用，不需要資料遷移。部署後使用者既有 persisted marks 會保留；後續 save 或 clear 只會依當下 visible scope 合併或移除。

Rollback 時可回復本 change 的程式碼與規格；資料 schema 未改，因此不需要資料回滾。

## Open Questions

無。排序方向、未儲存提示移除、visible scope 合併語意與字母練習保護範圍皆已確認。
