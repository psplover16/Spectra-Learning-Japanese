## Why

單字練習頁面的控制列目前有兩個小幅不一致：搜尋 input 高度偏大，且閱讀模式按鈕與「開始測驗」按鈕尺寸不一致；另外「只顯示註記」文字較長，手機控制列閱讀性較差。現在要在既有閱讀/操作模式基礎上收斂控制列尺寸與標籤，讓手機介面更緊湊一致。

## What Changes

- 將單字練習搜尋 input 的可視高度調整為 2rem。
- 讓「閱讀模式」與「操作模式」按鈕的寬高與「開始測驗」按鈕一致。
- 將「只顯示註記」改名為「僅註記」，並維持既有註記篩選行為。

## Non-Goals

- 不改變搜尋、註記篩選、閱讀模式切換或測驗啟動行為。
- 不新增依賴、不改變路由、不調整其他頁面的控制列。
- 不涉及離線資料；既有 localStorage 與 PWA 快取策略不變，無同步或衝突處理變更。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- vocabulary-jlpt-level-filtering: 調整單字練習控制列的搜尋 input 高度、閱讀模式按鈕尺寸與註記篩選標籤文字要求。

## Impact

- Affected specs: vocabulary-jlpt-level-filtering
- Affected code:
  - Modified: src/modules/vocabulary/components/VocabularyControlBar.vue
  - Modified: src/styles/main.css
  - Modified: tests/component/VocabularyControlBar.spec.ts
  - Modified: tests/component/VocabularyViewSmoke.spec.ts
  - Modified: tests/e2e/vocabulary-word-practice.spec.ts
  - New: none
  - Removed: none
