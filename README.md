# Japanese Word Practice Vue AI

這是一個使用 Vue 3、TypeScript、Vite 與 PWA 架構建立的日語練習前端專案。  
目前專案已補上本地測試入口、Playwright e2e、GitHub Actions CI，以及以 GitHub Pages 為目標的 staging / production 自動部署流程。

## 本地開發

```powershell
npm ci
npm run dev
```

## Spectra 與 PowerShell UTF-8

本專案的中文文件與 Spectra 設定皆以 UTF-8 無 BOM 儲存。若在 Windows PowerShell 5.1 直接讀取 UTF-8 無 BOM 檔案，可能因預設 code page 顯示亂碼；請優先使用專案提供的 UTF-8 入口：

```powershell
npm run spectra -- list
npm run spectra -- show app-version-display
npm run spectra:analyze
npm run spectra:validate
```

若需要在目前 PowerShell 工作階段直接閱讀專案文件，可先套用專案 UTF-8 設定：

```powershell
. .\scripts\Use-ProjectUtf8.ps1
Get-Content .\PROJECT_ARCHITECTURE.md
```

## 本地測試

第一次執行 e2e 前，先安裝 Playwright 瀏覽器：

```powershell
npx playwright install chromium
```

常用指令：

```powershell
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm run test:e2e
npm run test:ci
```

## 測試內容

- `test:unit`：執行 Vitest 單元測試
- `test:e2e`：執行 Playwright 端對端測試
- `test:ci`：依 CI 順序執行 lint、typecheck、unit、build、e2e

目前最小 e2e 覆蓋包含：

- app shell smoke：驗證首頁可開啟、主要導覽存在且可切換路由
- practice exam flow：驗證第一頁可完成最小出題流程並開啟考試 modal

## GitHub Actions

### CI

- 觸發：所有 `pull_request`、所有 `push`（排除 `gh-pages`）
- 流程：`npm ci -> lint -> typecheck -> test:unit -> build -> test:e2e`
- e2e 失敗時會上傳 `playwright-report/` 與 `test-results/` artifact

### CD

- `dev` push：部署到 staging
- `main` push：部署到 production
- 部署承載：GitHub Pages `gh-pages` branch
- 發佈方式：`cd.yml` 直接建置 `dist/`、切出 `gh-pages` worktree、清理對應目錄後提交
- production base path：`/Spectra-Learning-Japanese/`
- staging base path：`/Spectra-Learning-Japanese/staging/`

預期 URL：

- staging: `https://psplover16.github.io/Spectra-Learning-Japanese/staging/`
- production: `https://psplover16.github.io/Spectra-Learning-Japanese/`

## GitHub Pages 設定

請在 repository settings 中確認：

1. 已啟用 GitHub Pages
2. 發佈來源使用 `gh-pages` branch
3. 已建立 `staging` 與 `production` environments
4. 若正式環境需要人工核准，請在 `production` environment 設定 required reviewers

## Branch Protection 建議

建議在 repository settings 中設定 branch protection：

- 禁止直接 push 到 `main`
- pull request 必須等 CI 通過後才能 merge
- production 若需要人工把關，可搭配 `production` environment required reviewers

## 常見排查

- e2e 啟不來：確認已執行 `npx playwright install --with-deps chromium`
- staging 路由 404：確認 `VITE_APP_BASE_PATH`、router `BASE_URL` 與 Pages 路徑一致
- GitHub Pages 沒更新：確認 `cd.yml` 成功執行，且 `gh-pages` branch 有新 commit
- staging 重新部署後 production 異常：確認 `cd.yml` 只清理 `gh-pages/staging/`，沒有誤刪 root 內容
- production 部署後 staging 消失：確認 `cd.yml` 的 production 清理步驟仍保留 `staging/` 子目錄
