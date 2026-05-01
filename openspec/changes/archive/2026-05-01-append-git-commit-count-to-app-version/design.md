## Context

目前 vite.config.ts 以 package.json 的 version 注入 `__APP_VERSION__`，`src/shared/version/appVersion.ts` 只負責讀取該常數，`AppVersionLabel.vue` 只負責渲染。這讓 UI 字串不用手動改，但只要 package version 沒改，即使有新 commit 與新部署，畫面仍停在 0.0.1。

## Goals / Non-Goals

**Goals:**

- 讓 build-time 注入的 app version 顯示為 `packageVersion+gitCommitCount`，例如 0.0.1+36。
- 新 commit 重新 build 後，顯示值自然變成下一個 commit count，例如 0.0.1+37。
- 保持 `AppVersionLabel.vue` 無副作用，只顯示已解析好的版本字串。
- 確認部署流程保留完整 git history，讓 production/staging build 的 commit count 可重現。

**Non-Goals:**

- 不在 build 時修改 package.json。
- 不將未 commit 的本機修改納入版號。
- 不改 PWA 更新提示 UI。
- 不新增 runtime 網路請求或 localStorage/IndexedDB 狀態。

## Decisions

### 以 build-time git commit count 組合 app version

在 Vite config 內把 package.json version 與目前 Git commit count 組成完整版本字串，再注入 `__APP_VERSION__`。前端 runtime 只讀這個 build-time 常數，因此離線、PWA 快取與頁面渲染都不需要額外資料來源。

**Alternative considered:**
- **在 build 時自動修改 package.json**：會讓 working tree 變髒，且容易在 CI/CD 造成重複變更或衝突。
- **顯示 Git commit hash**：可識別版本，但不符合使用者想看到 0.0.1+36 到 0.0.1+37 的遞增格式。

### 將 commit count resolve 邏輯集中在 Vite config

commit count 只應存在於 build 工具層，由 vite.config.ts 呼叫 Git 取得數字並格式化；`src/shared/version/appVersion.ts` 維持單純讀取 `__APP_VERSION__` 與 fallback。這避免前端 bundle 在瀏覽器 runtime 依賴 Node 或 Git。

**Alternative considered:**
- **在前端 runtime 計算 commit count**：瀏覽器無法讀 Git history，也會破壞離線可用原則。
- **新增獨立版本檔**：會增加產物同步成本，且目前 `__APP_VERSION__` 已是單一來源。

### 用測試鎖定格式與 CI history 條件

單元測試需驗證 `appVersion` 可讀取 0.0.1+36 這類 build-time 注入值，build 產物測試需確認注入字串包含 `+<數字>`。GitHub Actions 測試需確認 CD checkout 使用完整 history，避免部署時 commit count 只得到淺層歷史數字。

**Alternative considered:**
- **只靠手動部署驗證**：PWA 版號是使用者判斷更新的重要線索，必須用測試保護避免回歸。

## Risks / Trade-offs

| 風險 | 緩解 |
| --- | --- |
| CI/CD 使用 shallow clone 導致 commit count 不正確 | 以 workflow 測試鎖定 CD checkout `fetch-depth: 0`，必要時更新 workflow |
| 非 git 環境 build 無法取得 count | Vite config 提供明確 fallback，並以測試覆蓋不崩潰行為 |
| 版本字串不再等於 package.json version | 文件說明 UI app version 是 package version 加 build metadata，package version 仍是基礎語意版本 |
