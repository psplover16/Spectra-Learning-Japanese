## Why

目前主路由列只有固定的 N5 文法入口，無法承載 N1 到 N4 文法路由，也無法記住使用者偏好的文法等級。現在需要在手機空間有限、離線優先的前提下，提供可擴充且可持久保存的文法等級切換體驗。

## What Changes

- 將主路由列的文法入口改為目前選定等級的動態按鈕，預設 N5。
- 新增 N1 到 N4 文法路由 placeholder，並保留既有 N5 文法頁。
- 在文法等級頁點文法按鈕時開啟 N1 到 N5 子列表；在非文法頁點擊時直接前往目前選定等級。
- 使用 localStorage 保存選定等級；無伺服器同步與衝突情境，啟動時遇到無效記憶值會刪除並回到 N5。
- 抽出 options/config 驅動的可重用路由子列表元件，並微調主路由按鈕 padding。
- 調整子列表與路由容器間距：子列表改為 2px padding、4px gap，且與觸發按鈕水平置中；路由按鈕容器改為 `p-1`，外層頁面容器改為 `p-2`。

## Non-Goals (optional)

- 不實作 N1 到 N4 文法實際教材內容。
- 不保存子列表開關狀態，重新開啟網頁時一律關閉。
- 不改變字母練習、變化規則、單字練習三個主路由的既有行為。
- 不引入新的狀態管理、UI 套件或伺服器同步機制。

## Capabilities

### New Capabilities

- `grammar-level-routing`: 定義 N1 到 N5 文法等級路由、主路由文法按鈕與等級切換行為。
- `grammar-level-persistence`: 定義選定文法等級的本地保存、啟動還原與無效記憶清除規則。
- `route-sub-menu`: 定義可重用路由子列表元件的呈現、關閉與選項事件行為。

### Modified Capabilities

(none)

## Impact

- Affected specs: grammar-level-routing, grammar-level-persistence, route-sub-menu
- Affected code:
  - New: src/modules/grammar/config/grammarLevels.ts, src/modules/grammar/composables/useGrammarLevel.ts, src/modules/grammar/storage/grammarLevelStorage.ts, src/modules/grammar/components/GrammarLevelSwitcher.vue, src/modules/grammar/views/N1GrammarView.vue, src/modules/grammar/views/N2GrammarView.vue, src/modules/grammar/views/N3GrammarView.vue, src/modules/grammar/views/N4GrammarView.vue, src/shared/components/RouteSubMenu.vue
  - Modified: src/app/AppShell.vue, src/app/router.ts, src/shared/components/RouteTabs.vue, src/shared/config/storageKeys.ts, src/styles/main.css, PROJECT_ARCHITECTURE.md, tests/component/AppShellSmoke.spec.ts, tests/component/RouteSubMenu.spec.ts, tests/e2e/app-shell.smoke.spec.ts, tests/e2e/testUtils.ts
  - Removed: none
