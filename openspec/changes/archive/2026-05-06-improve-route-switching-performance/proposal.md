## Why

使用者在切換路由時出現明顯卡頓，會中斷手機短時段學習節奏；目前雖已有 Vue Router 動態載入，但 N5 文法大型資料、單字預設全等級載入與整頁掛載仍可能造成首次切換或返回頁面延遲。現在需要將路由切換列為可驗證的效能行為。

## What Changes

- 建立路由切換效能目標與量測方式，涵蓋首次進入、已載入返回與離線 PWA 情境。
- 優先評估路由預載：使用者 hover、focus 或 touchstart 導覽時預先載入目標 route chunk，降低首次點擊等待。
- 調整重資料頁面的載入策略：N5 文法資料與單字 JLPT 資料應分段、按需或背景載入，避免切換瞬間同步處理過多資料。
- 保留已訪問路由狀態：以安裝後 PWA App 的切換流暢度為優先，對主要路由使用 KeepAlive 或等效狀態保存，減少返回時重新掛載與重新計算。
- 加入 bundle/chunk 檢查與 route smoke/performance 測試，確認沒有單一 chunk 超過 500 KB 警戒線，且切換不出現長時間空白。

## Non-Goals

- 不引入新的路由框架、UI framework 或大型效能監控依賴。
- 不改變現有路由 URL、導覽文案或學習內容正確性。
- 不新增使用者資料同步；若調整 PWA chunk 快取，僅處理靜態資產快取，不涉及使用者資料衝突合併。

## Capabilities

### New Capabilities

- route-switching-performance: 定義路由切換應維持可感知流暢、可量測並支援離線快取後快速返回的行為。

### Modified Capabilities

(none)

## Impact

- Affected specs: route-switching-performance
- Affected code:
  - Modified: src/app/router.ts, src/app/AppShell.vue, src/shared/components/RouteTabs.vue, src/modules/grammar/components/GrammarLevelSwitcher.vue, src/modules/vocabulary/composables/useVocabularySession.ts, src/modules/n5Grammar/views/N5GrammarView.vue, vite.config.ts, PROJECT_ARCHITECTURE.md
  - New: src/app/routePreload.ts, tests/unit/routePreload.spec.ts, tests/e2e/route-switching-performance.spec.ts
  - Removed: none
