## Why

已安裝 PWA App 偶爾無法取得最新版，使用者必須改開網頁才會更新，造成修正與新功能延誤送達。字母練習頁缺版號，使用者與工程師都無法快速辨識目前是否在最新版。N5 文法頁多個學習 container 未依學習狀態區分，「還沒學」與「已學過」混雜，難以快速掃描學習進度。三項問題皆直接降低手機 PWA 在短時段學習情境的使用體驗，故同批處理。
使用者也觀察到多數子路由在正式內容前仍有 root `py-1` 垂直 padding；除單字練習頁外，這會讓各頁內容起點不一致，需要同批收斂版面規則。N5 文法頁即使 template root 未直接加 `py-1`，仍可能由 `.n5-grammar-view` stylesheet 規則套用 root padding，因此必須一併處理。

## What Changes

- 在「字母練習」頁整個頁面內容最底部的右下角顯示版本號（初始 `0.0.1`、自動更新、不需手動維護）
- PWA App 開啟時主動檢查最新版，使「已下載 App」的使用者不需改開網頁也能取得更新；既有更新提示 UI 維持不變
- N5 文法頁依 container 標題旁的 checkbox 狀態自動分為「未學習」（上）與「已學習」（下）兩個大區塊；兩區之間 `1rem` 間距，區塊本身不加 padding，既有排序維持；若「已學習」區沒有內容，則不 render 該空區塊
- 除「單字練習」頁外，移除子路由 root container 的 `py-1` 與 route-root stylesheet vertical padding；單字練習保留既有 root spacing

## Non-Goals

- 不調整 PWA 既有更新提示 UI
- 不要求使用者改用網頁入口才能更新
- 不移除卡片、section、表格或元件內部 padding，只處理 route root 上的 `py-1` 或 stylesheet vertical padding
- 不改變單字練習頁 root `py-1`
- 不改變 N5 文法 container 內部內容、樣式、既有排序邏輯
- 不在 N5 文法「已學習」空狀態新增 placeholder 或提示文字
- 不改變 checkbox 語意（仍代表「是否已學習」）
- 不要求工程師手動維護版號
- 不引入新依賴或新狀態管理機制

## Capabilities

### New Capabilities

- `app-version-display`: 在指定路由顯示應用版本號（位置、樣式、來源、自動更新行為）
- `pwa-update-check-on-launch`: PWA App 啟動時主動檢查最新版的行為規範
- `n5-grammar-learning-status-sections`: 依 checkbox 將 N5 文法 container 分區呈現的版面行為規範
- `route-root-vertical-padding`: 規範各子路由 root container 與 root selector 是否保留 `py-1` 或 padding-top / padding-bottom

### Modified Capabilities

(none)

## Impact

- Affected specs:
  - New: `app-version-display`, `pwa-update-check-on-launch`, `n5-grammar-learning-status-sections`
  - New: `route-root-vertical-padding`
- Affected code:
  - New:
    - src/shared/version/appVersion.ts
    - src/shared/components/AppVersionLabel.vue
  - Modified:
    - src/modules/practice/views/PracticeView.vue
    - src/modules/grammar/views/GrammarView.vue
    - src/modules/n5Grammar/views/N5GrammarView.vue
    - src/styles/main.css
    - src/modules/vocabulary/views/VocabularyView.vue (保留 root `py-1` 的例外，不移除)
    - src/modules/pwa/services/pwaLifecycleService.ts
    - src/modules/pwa/composables/usePwaLifecycle.ts
    - src/app/main.ts
    - vite.config.ts
    - package.json
    - PROJECT_ARCHITECTURE.md
  - Removed: (none)
