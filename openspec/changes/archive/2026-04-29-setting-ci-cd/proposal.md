## Why

目前專案文件與需求都指向需要 CI/CD，但缺少可驗收的 GitHub Actions 與 GitHub Pages 發布契約。現在要建立一套能在 PR/push 驗證品質，並在 dev/main 自動部署 staging/production 的流程，避免部署路徑、PWA 與 router base path 彼此不一致。

## What Changes

- 新增 CI workflow，於 pull_request 與非 gh-pages 的 push 執行 lint、typecheck、unit、build 與 e2e 驗證。
- 新增 CD workflow，於 dev 部署到 staging，於 main 部署到 production。
- 建立 GitHub Pages 子路徑部署契約，production 使用 /Spectra-Learning-Japanese/，staging 使用 /Spectra-Learning-Japanese/staging/。
- 補齊或確認 package scripts、publish script、PWA manifest、Vue Router base path 與 README 文件。

## Non-Goals

- 不重構日文學習功能、UI、資料模型或測試語意。
- 不新增雲端同步、伺服器部署或非 GitHub Pages 的發布方式。
- 不使用 destructive git 指令，也不覆蓋使用者未提交修改。

## Capabilities

### New Capabilities

- `ci-cd-pipeline`: 定義 GitHub Actions CI/CD、GitHub Pages staging/production 發布、base path、發布腳本與文件驗收行為。

### Modified Capabilities

(none)

## Impact

- Affected specs: ci-cd-pipeline
- Affected code:
  - New: .github/workflows/ci.yml, .github/workflows/cd.yml
  - Modified: package.json, vite.config.ts, src/app/router.ts, scripts/publishPages.mjs, README.md, tests/unit/publishPages.spec.ts
  - Removed: none
