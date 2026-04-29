## Context

本變更的唯一需求來源是 `_private/propose.md`。目標是在本專案重現 `C:\Users\Gary\Documents\Japanese_Word_Practice_Vue_AI` 於 `017-refine-n5-content` 分支上的所有使用者可見功能與 UI。

目前尚未盤點來源專案，因此設計重點是先建立可驗收的 parity inventory，再依 inventory 分段重現。專案仍須維持手機優先、離線優先、Vue 3 Composition API、TypeScript strict、Pinia 與 localStorage 的既有約束。

## Goals / Non-Goals

**Goals:**

- 在實作前確認來源路徑與分支，避免重現錯誤版本。
- 產出 parity inventory，涵蓋頁面、路由、元件、互動、UI 狀態、資料流程、離線保存與驗收證據。
- 以使用者可觀察結果為準，在本專案重現功能、流程、文案語意、視覺層級與響應式行為。
- 對每個差異記錄原因、限制、使用者影響與接受條件。

**Non-Goals:**

- 不搬移來源 Git 歷史、私人資料、憑證或無使用者可見影響的內部實驗。
- 不要求逐行複製來源內部實作。
- 不新增雲端同步；若來源存在網路能力，核心學習流程仍須可離線使用並優雅降級。

## Decisions

### 先建立來源 parity inventory 再實作

先從來源分支盤點所有使用者可見項目，再把每個項目映射到本專案的實作與驗收項。這比直接邊看邊搬更可靠，因為需求本身是「所有功能與所有 UI」，漏掉空狀態、錯誤狀態或響應式細節都會造成 parity 失敗。

替代方案：直接重建主要畫面。淘汰原因是它無法證明所有狀態與流程都已覆蓋。

### 以使用者可觀察結果為一致性標準

一致性判準為使用者看到與操作到的結果，包括畫面、文案語意、操作順序、狀態切換、錯誤提示、資料保存與完成結果。內部模組可以配合本專案架構重寫，只要外部行為與 UI 一致。

替代方案：逐行移植來源程式。淘汰原因是本專案技術約束可能不同，逐行移植會增加型別、架構與維護風險。

### 保持手機優先與離線優先

所有重現畫面先以手機尺寸驗收，再確認桌機尺寸沒有破版。核心學習流程、設定、進度與使用者資料須在無網路時可用；網路功能若存在，離線時須停用或顯示明確狀態，不阻塞核心流程。

替代方案：先完成桌機畫面再補手機。淘汰原因是專案主要使用情境是手機離線使用。

### Source-compatible composables 管理執行期狀態，localStorage 保存離線資料

來源專案使用 Vue composables、provide/inject、ref 與 computed 管理執行期狀態。為了維持 parity，本專案採用相同外部行為與相容的 state model：`PracticeSession` 管理假名選取與題數，`ExamSession` 管理練習題卡、答案顯示與不清楚標記，`VocabularySession` 管理篩選、欄位顯示、練習模式與暫存標記。

localStorage 負責保存可離線延續的來源行為，包括 PWA deferred update、最新不清楚題目結果與單字註記快照。IndexedDB 不作為預設選項；只有來源盤點證明存在大型資料或二進位資產，且 localStorage 無法可靠承載時，才在設計補充中引入。由於本變更不新增雲端同步，衝突處理以本機最新寫入為準，不產生遠端合併衝突。

替代方案：新增 Pinia 並重寫來源狀態模型。淘汰原因是來源專案沒有使用 Pinia，重寫會增加 parity 風險且不提供使用者可見收益。

## Risks / Trade-offs

- 來源專案範圍過大 → 先完成 inventory 與 checklist，再分區塊實作與驗收。
- 來源 UI 細節難以精準量測 → 以截圖、互動錄製或人工記錄作為驗收證據，並保存不可避免差異。
- 內部實作不同導致行為偏差 → 每個 inventory item 都需要功能驗收與狀態切換驗收。
- localStorage 容量不足 → 先維持 localStorage；若來源盤點證明資料量超出限制，再提出後續變更引入 IndexedDB。

## Migration Plan

1. 驗證來源專案路徑與 `017-refine-n5-content` 分支。
2. 建立 parity inventory 與 checklist。
3. 依頁面或功能區塊重現 UI、狀態、資料流程與離線保存。
4. 針對每個 checklist item 執行功能、視覺、響應式與離線驗收。
5. 若發現不可避免差異，在 design 或 checklist 中記錄原因與接受條件。

回退策略：每個功能區塊以獨立提交或可辨識變更群組完成；若某區塊失敗，回退該區塊並保留 inventory 與 checklist 作為下次修正依據。

## Open Questions

沒有需要在提案階段向使用者追問的事項。來源專案實際功能清單、UI 狀態與資料流程會在 apply 階段第一個任務中由 parity inventory 解析。
