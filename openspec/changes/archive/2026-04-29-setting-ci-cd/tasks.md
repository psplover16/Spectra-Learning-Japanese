## 1. 現況確認

- [x] 1.1 檢查專案 package manager、現有 package scripts、Vite/Vue Router/PWA 設定、build output 目錄與 e2e 測試存在狀態；完成定義：在實作紀錄中列出實際命令名稱、是否需要補齊 scripts、dist 來源、router base path 來源與 PWA manifest base path 來源。

## 2. CI workflow

- [x] [P] 2.1 依「Split CI and CD workflows by responsibility」實作「CI workflow validation」，建立或更新 .github/workflows/ci.yml；完成定義：workflow 名稱為 CI，pull_request 全部觸發，push 排除 gh-pages，使用 ubuntu-latest、Node.js 22、依序 checkout、setup node cache、install、lint、typecheck、unit、build、Playwright browser、e2e。
- [x] [P] 2.2 實作「CI diagnostics artifact upload」；完成定義：e2e 失敗時上傳 playwright-report/ 與 test-results/，e2e 成功時不要求 artifact，且 artifact 設定不會讓成功流程失敗。

## 3. CD、base path 與發布腳本

- [x] 3.1 依「Split CI and CD workflows by responsibility」實作「CD workflow deployment targets」，建立或更新 .github/workflows/cd.yml；完成定義：workflow 名稱為 CD，只在 dev/main push 觸發，dev 對 staging、main 對 production，設定 permissions.contents: write 與包含 workflow/ref 的 concurrency。
- [x] 3.2 依「Use Vite base path as the single routing and asset prefix」實作「GitHub Pages base path alignment」；完成定義：production base path 為 /Spectra-Learning-Japanese/，staging base path 為 /Spectra-Learning-Japanese/staging/，Vite assets、PWA manifest start_url 與 Vue Router history 使用同一來源。
- [x] 3.3 依「Publish with a gh-pages worktree and guarded sync script」實作「Protected GitHub Pages publishing」；完成定義：scripts/publishPages.mjs 可接收 worktree、dist、target，production 保留 .git、.nojekyll、CNAME、staging，staging 不改 production root，dist 空時失敗，無內容變更時不要求空 commit。
- [x] 3.4 為「Protected GitHub Pages publishing」補上或更新單元測試；完成定義：測試覆蓋 production 清理保留 staging/CNAME、staging 更新不破壞 root、空 dist 失敗、無變更不產生提交需求。

## 4. scripts 與文件

- [x] 4.1 依「Keep package scripts as the CI contract」實作「Package script contract」；完成定義：package.json 具備 lint、typecheck、test:unit、build、test:e2e、test:ci，且 test:ci 依序執行 lint、typecheck、unit、build、e2e。
- [x] [P] 4.2 依「Document operational setup in README」實作「CI/CD documentation」；完成定義：README 說明本地測試指令、CI/CD 觸發條件、dev/main 對應 staging/production、GitHub Pages 使用 gh-pages branch、production/staging URL 與 branch protection 建議。

## 5. 驗證與收斂

- [x] 5.1 執行本地驗證；完成定義：install 不需要重跑時不重跑，至少執行 lint、typecheck、unit、build；若 e2e 存在則執行 e2e，若無法執行需記錄原因。
- [x] 5.2 驗證 CI/CD 設定與文件一致；完成定義：ci.yml、cd.yml、package scripts、base path、publishPages 行為與 README 描述互相對齊，並列出修改檔案、CI 觸發、CD 觸發/部署位置與測試結果。
