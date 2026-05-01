## 1. 測試先行

- [x] [P] 1.1 更新 `tests/unit/appVersion.spec.ts`，覆蓋 spec「Version source MUST be automatically derived from package metadata」的新格式：當 `__APP_VERSION__` 為 `0.0.1+36` 時，`appVersion` 必須讀出完整字串；完成定義：變更前測試能描述目前缺少 build metadata 的差異，變更後通過。
- [x] [P] 1.2 更新 `tests/unit/publicAssets.spec.ts`，覆蓋 design「以 build-time git commit count 組合 app version」：暫時 build 產物內必須包含符合 `package.json version + 數字` 的版本字串；完成定義：build 後 JS assets 可找到例如 `0.0.1+36` 格式，且不只找到裸 `0.0.1`。
- [x] [P] 1.3 更新 `tests/unit/githubActionsWorkflows.spec.ts`，覆蓋 design「用測試鎖定格式與 CI history 條件」：CD workflow 必須保留 `fetch-depth: 0`，確保 deployment build 可取得完整 git commit count；完成定義：workflow 測試明確保護 deploy checkout history 深度。

## 2. Build-time 版號實作

- [x] 2.1 更新 `vite.config.ts`，依 design「以 build-time git commit count 組合 app version」與「將 commit count resolve 邏輯集中在 Vite config」取得 Git commit count，將 `__APP_VERSION__` 注入為 `<package-version>+<git-commit-count>`；完成定義：build-time app version 等於 `package.json` version 加上實際 `git rev-list --count HEAD` 數字。
- [x] 2.2 更新 `vite.config.ts` 與 `src/env.d.ts` 的型別/輔助函式，確保 Git metadata 無法解析時使用 `<package-version>+0`，且前端 runtime 不依賴 Node 或 Git；完成定義：`src/shared/version/appVersion.ts` 與 `AppVersionLabel.vue` 不加入任何 Git/runtime 邏輯。

## 3. 文件與驗證

- [x] [P] 3.1 更新 `PROJECT_ARCHITECTURE.md`，記錄 app version 現在由 package version 加 git commit count 組成，並說明 `AppVersionLabel.vue` 仍只負責顯示；完成定義：文件中的版本來源與實際 `vite.config.ts`、`appVersion.ts` 一致。
- [x] 3.2 執行完整驗證：`npm run lint`、`npm run typecheck`、`npm run test:unit`、`npm run build`、`spectra validate append-git-commit-count-to-app-version`；完成定義：所有命令通過，若 `test:unit` 出現既有 jsdom CSS parse stderr，記錄為既有非阻斷訊息。
- [x] 3.3 以手機寬度或瀏覽器模擬驗證 Practice 頁面版號顯示為 `0.0.1+<目前 commit count>`，並在離線/PWA 快取情境確認該文字仍可顯示；完成定義：最終回覆記錄實際看到的版本字串與離線驗證方式。
