# 討論結論：設定 CI/CD

## 唯一輸入

來源：`_private/discuss.txt`

本次討論依照要求，只以該檔內容作為輸入；未檢查專案其他檔案、規格或程式碼。後續進入實作前，仍必須依需求先檢查專案結構、`package.json` scripts、build output 目錄，以及前端框架與路由/PWA 設定。

## Conclusion

**Decision**：建立 Spectra 變更 `setting-ci-cd`，目標是在本專案設定一套 GitHub Actions CI/CD，包含 CI 驗證、GitHub Pages staging/production 部署、build base path、發布腳本、README 文件與本地驗證。

**Rationale**：需求同時涉及驗證流程、部署流程、Vite/GitHub Pages 路徑、PWA manifest、Vue Router、發布同步安全與文件說明。這些項目彼此耦合，應放在同一個變更中設計與驗收；但實作時必須限制在 CI/CD 相關檔案，避免牽動無關業務程式碼。

**Capture to**：建議後續產生 `openspec/changes/setting-ci-cd/`，至少包含 `proposal.md`、`design.md`、`tasks.md`，以及必要的 spec delta。

## 已確認的固定參數

- change 名稱：`setting-ci-cd`
- repository name：`Spectra-Learning-Japanese`
- GitHub user：`psplover16`
- production URL：`https://psplover16.github.io/Spectra-Learning-Japanese/`
- staging URL：`https://psplover16.github.io/Spectra-Learning-Japanese/staging/`
- GitHub Pages 發布分支：`gh-pages`
- staging 來源分支：`dev`
- production 來源分支：`main`
- Node.js 版本：`22`

## 建議提案骨架

### Problem

目前需要為前端專案建立可重跑且可部署的 CI/CD 流程。CI 應在 pull request 與 push 時驗證品質；CD 應在 `dev` 與 `main` 分支推送後，將靜態網站部署到 GitHub Pages 的 staging 與 production 路徑。部署時還必須處理 GitHub Pages 子路徑、PWA manifest、Vue Router base path、`gh-pages` 內容同步與避免空 commit。

### Proposed Change

建立或更新 CI/CD 相關設定：

- 新增或更新 `.github/workflows/ci.yml`
- 新增或更新 `.github/workflows/cd.yml`
- 檢查並補齊必要的 package scripts
- 讓 build base path 可依部署目標切換
- 確認 PWA manifest `start_url` 與 Vue Router history base path 使用相同 base path
- 新增或調整 `scripts/publishPages.mjs`
- 更新 README 的本地測試、CI/CD 觸發條件、部署路徑、GitHub Pages 設定與 branch protection 建議

### Non-Goals

- 不重構與 CI/CD 無關的業務程式碼。
- 不改動學習功能、UI、資料模型或測試語意，除非是為了讓既有驗證流程能在 CI 正常執行。
- 不使用 destructive git 指令，例如 `git reset --hard`。
- 不強制覆蓋使用者尚未提交的修改。

## CI 決策

CI workflow 應命名為 `CI`，並符合以下行為：

- 觸發所有 `pull_request`
- 觸發所有 `push`，但排除 `gh-pages`
- 使用 `ubuntu-latest`
- 使用 Node.js 22
- 依目前專案 package manager 安裝依賴；若為 npm，使用 `npm ci`
- 步驟順序：
  1. checkout repository
  2. setup Node.js with cache
  3. install dependencies
  4. lint
  5. typecheck
  6. unit tests
  7. build
  8. 若專案有 e2e tests，安裝 Playwright browser
  9. 若專案有 e2e tests，執行 e2e tests
- e2e 失敗時上傳 `playwright-report/` 與 `test-results/` 等 diagnostics artifact
- 不應在 `gh-pages` 分支再次執行，避免部署產物觸發 CI 迴圈

## CD 決策

CD workflow 應命名為 `CD`，並符合以下行為：

- 只在 push 到 `dev` 或 `main` 時觸發
- `dev` 部署到 staging：`gh-pages/staging/`
- `main` 部署到 production：`gh-pages` root
- 使用 GitHub Pages，發布分支為 `gh-pages`
- 使用 `permissions.contents: write`
- 使用 concurrency，避免同一分支多次部署互相覆蓋
- 步驟順序：
  1. checkout repository with full history
  2. setup Node.js 22
  3. install dependencies
  4. 根據分支設定 build base path
  5. build static site
  6. 建立或 checkout `gh-pages` worktree
  7. 同步 `dist/` 到正確目錄
  8. commit 並 push 到 `gh-pages`
  9. 若內容沒有變更，不產生空 commit

## Build Base Path 決策

如果專案使用 Vite，build 應透過環境變數控制 base path：

- production：`/Spectra-Learning-Japanese/`
- staging：`/Spectra-Learning-Japanese/staging/`

如果專案有 PWA manifest `start_url`，它應跟著使用相同 base path。

如果專案使用 Vue Router，應確認使用 `createWebHistory(import.meta.env.BASE_URL)` 或等價設定，避免 GitHub Pages 子路徑部署後重新整理或直接進入路由時失敗。

如果後續檢查發現不是 Vite，則需依實際框架使用標準的 base path 或 public path 設定。

## Publish Script 決策

若需要新增或調整 `scripts/publishPages.mjs`，它應支援：

- 接收 worktree、dist、target 參數
- `target` 支援 `production` 與 `staging`
- production 發布到 `gh-pages` root
- staging 發布到 `gh-pages/staging/`
- production 清理 root 時保留 `.git`、`.nojekyll`、`CNAME`、`staging`
- staging 更新時不得破壞 production root
- `dist` 為空時失敗
- 發布後建立 `.nojekyll`
- 內容沒有變更時不產生空 commit

## Package Scripts 決策

後續應檢查並補齊必要 scripts：

- `lint`
- `typecheck`
- `test:unit`
- `build`
- `test:e2e`
- `test:ci`

`test:ci` 建議順序：

```text
lint -> typecheck -> unit tests -> build -> e2e
```

## README 決策

README 應補充：

- 本地測試指令
- CI 觸發條件
- CD 觸發條件
- `dev` 對應 staging
- `main` 對應 production
- GitHub Pages 來源需設定為 `gh-pages` branch
- 建議設定 branch protection，禁止直接 push 到 `main`，並要求 CI 通過後才能 merge

## Acceptance Criteria

- `.github/workflows/ci.yml` 存在，且符合 CI 觸發條件與步驟順序。
- `.github/workflows/cd.yml` 存在，且只針對 `dev` 與 `main` 部署。
- `dev` build output 會發布到 `gh-pages/staging/`。
- `main` build output 會發布到 `gh-pages` root。
- CD 使用 `permissions.contents: write` 與 concurrency。
- build base path 能依 staging/production 正確切換。
- PWA manifest `start_url` 與前端 router base path 不會和 GitHub Pages 子路徑衝突。
- 發布腳本能保護 production root 與 staging 目錄，且不產生空 commit。
- README 說明本地驗證、CI/CD 觸發條件、部署位置、GitHub Pages 設定與 branch protection 建議。
- 完成後有列出修改檔案、CI/CD 觸發條件、部署位置與測試結果。

## 驗證要求

後續實作完成後應執行可行的本地驗證：

- 不需要重跑 install 時，不強制重跑 install
- 至少執行 lint
- 至少執行 typecheck
- 至少執行 unit tests
- 至少執行 build
- 若專案有 e2e tests，執行 e2e tests；若無法執行，需說明原因

## 建議任務清單

- 檢查專案結構、package manager、前端框架、build output、PWA 與 router base path。
- 建立或更新 CI workflow。
- 建立或更新 CD workflow。
- 檢查並補齊 package scripts。
- 檢查或調整 build base path、PWA manifest 與 router 設定。
- 建立或調整 GitHub Pages publish script。
- 更新 README。
- 執行本地驗證。
- 彙整修改檔案、CI/CD 觸發條件、部署位置與測試結果。

## 下一步

這份討論結論已足夠進入 `$spectra-propose`。後續提案階段應先對照 repo 現況，避免文件或 workflow 假設與實際專案不一致。
