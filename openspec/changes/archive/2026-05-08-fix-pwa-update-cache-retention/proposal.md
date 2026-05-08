## Why

使用者在 PWA 更新後離線開啟時，可能遇到 N5 文法資料載入失敗或單字資料不可用。現在需要修正更新流程造成的快取空窗，確保已安裝 App 在更新前後仍符合離線優先承諾。

## What Changes

- 調整 PWA 更新契約：更新確認時不得手動清空全部 CacheStorage，避免刪除仍需離線使用的 app shell、route chunk、N5 文法與單字資料 chunk。
- 讓 Workbox 既有 precache 與 outdated cache cleanup 負責版本替換，保留離線快取直到新版可用。
- 補強更新後離線驗收，涵蓋 /n5-grammar 與 /vocabulary 的資料載入。

## Non-Goals

- 不新增雲端同步、遠端資料來源、IndexedDB 或外部 API。
- 不改變 N5 文法內容、單字資料內容或 localStorage 註記格式。
- 不以使用者手動清除瀏覽器資料作為修復方式。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `pwa-update-check-on-launch`: 補充 PWA 更新確認時的 cache retention 要求。
- `route-switching-performance`: 補充更新後離線回訪路由與 lazy 資料資產的驗收要求。

## Impact

- Affected code:
  - Modified: src/modules/pwa/services/pwaLifecycleService.ts
  - Modified: tests/unit/pwaLifecycleService.spec.ts
  - Modified: tests/e2e/pwa-offline-route-cache.spec.ts
  - Modified: PROJECT_ARCHITECTURE.md
  - New: openspec/changes/fix-pwa-update-cache-retention/specs/pwa-update-check-on-launch/spec.md
  - New: openspec/changes/fix-pwa-update-cache-retention/specs/route-switching-performance/spec.md
  - Removed: none
