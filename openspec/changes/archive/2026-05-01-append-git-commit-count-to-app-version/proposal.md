## Why

目前畫面版號只顯示 package.json 的 version，例如 0.0.1；即使程式碼修改並部署成功，只要 package version 未手動調整，使用者仍看不出版次差異。現在需要讓每次新 commit 重新 build 後，版號可自然從 0.0.1+36 變成 0.0.1+37。

## What Changes

- 將顯示版號改為 package.json version 加上 git commit count，格式為 0.0.1+36。
- 每次有新 commit 並重新 build 後，commit count 會遞增，畫面版號跟著變動。
- 保持 AppVersionLabel 只負責顯示，不加入更新檢查或互動 UI。
- CI/CD 建置需確保能取得足夠 git history，避免 commit count 被算成不正確的淺層歷史數字。

## Non-Goals

- 不在 build 過程自動修改 package.json。
- 不改成 Git commit hash 或部署時間顯示。
- 不讓未 commit 的本機檔案變動造成版號改變。
- 不改 PWA 更新提示 UI。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- app-version-display: 版號來源從單純 package.json version，改為 package.json version 加 git commit count 的 build-time 顯示值。

## Impact

- Affected specs: app-version-display
- Affected code:
  - New: none
  - Modified:
    - vite.config.ts
    - src/env.d.ts
    - src/shared/version/appVersion.ts
    - tests/unit/appVersion.spec.ts
    - tests/unit/publicAssets.spec.ts
    - tests/unit/githubActionsWorkflows.spec.ts
    - PROJECT_ARCHITECTURE.md
  - Removed: none
