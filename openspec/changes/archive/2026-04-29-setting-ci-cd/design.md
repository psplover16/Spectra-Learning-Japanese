## Context

本變更要補齊前端 PWA 專案的 GitHub Actions CI/CD。輸入需求指定 repository 為 Spectra-Learning-Japanese、GitHub 使用者為 psplover16，並要求 dev 部署 staging、main 部署 production。此變更不改學習功能本身，但部署到 GitHub Pages 子路徑時，Vite base path、PWA manifest 與 Vue Router history 必須一致，否則靜態資產、離線安裝或直接進入路由會失敗。

## Goals / Non-Goals

**Goals:**

- 建立可重跑的 CI workflow，覆蓋 lint、typecheck、unit、build 與 e2e。
- 建立 CD workflow，將 dev 發布到 gh-pages/staging/，main 發布到 gh-pages root。
- 讓 production 與 staging build 使用明確 base path。
- 以發布腳本保護 production root 與 staging 內容，避免互相刪除。
- 更新 README，讓本地驗證、GitHub Pages 設定與 branch protection 建議可被操作。

**Non-Goals:**

- 不重構日文學習頁面、UI、資料模型、localStorage 或測試語意。
- 不新增 GitHub Pages 以外的部署目標。
- 不新增伺服器端 API、雲端同步或密鑰管理流程。
- 不要求 CD 在本機推送 gh-pages；本機只驗證腳本與建置結果。

## Decisions

### Split CI and CD workflows by responsibility

CI 與 CD 使用兩個 workflow。CI 名稱為 CI，處理所有 pull_request 與非 gh-pages push；CD 名稱為 CD，只處理 dev 與 main push。這讓部署產物分支不會反覆觸發驗證，也讓 PR 驗證與正式發布權限分離。

替代方案：使用單一 workflow 依分支條件切換驗證與部署。此方案檔案較少，但 permissions、concurrency 與 artifact 上傳條件會混在一起，後續維護時較容易誤觸部署。

### Use Vite base path as the single routing and asset prefix

build base path 由環境變數提供：production 使用 /Spectra-Learning-Japanese/，staging 使用 /Spectra-Learning-Japanese/staging/。Vite config、PWA manifest start_url 與 Vue Router history 必須使用同一個 base path 來源，避免 asset URL、service worker scope 與 client route base 不一致。

替代方案：在 workflow、Vite config、router 與 manifest 各自硬編路徑。此方案初期直接，但 staging 與 production 很容易出現其中一處漏改。

### Publish with a gh-pages worktree and guarded sync script

CD checkout 原始碼 full history 後建立或使用 gh-pages worktree，再呼叫 publishPages 腳本同步 dist。production 清理 root 時保留 .git、.nojekyll、CNAME 與 staging；staging 更新時只改 staging 目錄。腳本必須在 dist 為空時失敗，並在無內容變更時不要求產生空 commit。

替代方案：使用現成 GitHub Pages action 直接發布整個 dist。此方案簡單，但較難同時維護 production root 與 staging 子目錄，也較難保證 production 清理時保留 staging。

### Keep package scripts as the CI contract

CI 不直接拼出各工具的內部命令，而是呼叫 package scripts。必要 scripts 包含 lint、typecheck、test:unit、build、test:e2e 與 test:ci；test:ci 順序固定為 lint、typecheck、unit、build、e2e。這讓本機與 CI 使用同一組驗證入口。

替代方案：只在 workflow 寫完整命令。此方案可少改 package.json，但本機重現 CI 會變得麻煩，且後續工具替換時要同時改 workflow 與文件。

### Document operational setup in README

README 必須記錄本地測試指令、CI/CD 觸發條件、dev/main 對應環境、GitHub Pages 來源設定、production/staging URL，以及 branch protection 建議。這些是 repository 設定，不完全由程式碼保證，因此必須在文件中明確留下操作步驟。

替代方案：只依賴 workflow 檔案自我說明。此方案少寫文件，但 GitHub Pages source 與 branch protection 需要人工到 GitHub UI 設定，缺文件會增加部署失敗機率。

## Risks / Trade-offs

- GitHub Pages source 未設為 gh-pages → README 記錄必要設定，CD 完成後由維護者確認 repository settings。
- production 清理誤刪 staging → publishPages 腳本明確保留 staging，並以單元測試覆蓋 production 與 staging 同步情境。
- base path 設定不一致 → Vite config、PWA manifest 與 Vue Router 共用同一個環境變數來源，並以 build 或測試檢查輸出路徑。
- e2e 在 CI 缺瀏覽器而失敗 → CI 在 e2e 前安裝 Playwright browser，失敗時上傳 diagnostics artifact。
- dev 與 main 同時部署互相覆蓋 → CD 使用 concurrency，群組需包含 workflow 與 ref。

## Migration Plan

1. 新增 CI workflow，先讓 pull_request 與一般 push 能跑完整驗證。
2. 新增 CD workflow 與 base path 設定，先確認 dev/main 分支判斷會產出正確部署目標。
3. 建立或調整 publishPages 腳本與測試，確認 production 與 staging 互不破壞。
4. 更新 README，補齊 GitHub Pages 與 branch protection 操作說明。
5. 本地執行 lint、typecheck、unit、build 與 e2e；CD 的 push 行為由 workflow 在 GitHub 環境驗證。

Rollback 策略：若 CD 部署造成 gh-pages 內容錯誤，停用 CD workflow 或暫停 dev/main push 部署，將 gh-pages 分支回復到上一個正常提交，再修正 publishPages 或 base path 設定。

## Open Questions

無尚待決策的問題；實作時只需依現有專案實際 package manager 與前端設定確認命令名稱是否需要補齊。
