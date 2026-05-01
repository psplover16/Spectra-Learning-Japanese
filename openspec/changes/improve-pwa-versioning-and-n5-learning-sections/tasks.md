## 1. App Version Display 能力（app-version-display）

- [x] [P] 1.1 在 `vite.config.ts` 設定 `define: { __APP_VERSION__: JSON.stringify(pkg.version) }`，將 `package.json` 的 version 以 build-time 注入；對應 design「版本號來源以 build-time 注入 package.json 的 version 為準」決策；實作 spec「Version source MUST be automatically derived from package metadata」build-time 部分。完成定義：build 後 dist 內 source 含實際版本字串。
- [x] [P] 1.2 確認 `package.json` 的 `version` 欄位為 `0.0.1`，若不是則調整；完成定義：`node -p "require('./package.json').version"` 印出 `0.0.1`。
- [x] 1.3 建立 `src/shared/version/appVersion.ts`，命名匯出 `appVersion`，含 fallback `'0.0.0-dev'`；補齊 spec「Version source MUST be automatically derived from package metadata」runtime 取值部分；完成定義：執行時 `appVersion` 為 `__APP_VERSION__` 之值，未注入時為 fallback。
- [x] 1.4 建立 `src/shared/components/AppVersionLabel.vue`，僅負責顯示版號文字；實作 spec「Version label MUST be implemented as a reusable component」；對應 design「版號元件放 src/shared/components/AppVersionLabel.vue」決策。完成定義：元件可獨立掛載並渲染版號文字，無更新檢查邏輯。
- [x] 1.5 在 `src/modules/practice/views/PracticeView.vue` 引入 AppVersionLabel，依規格擺右下、距特殊音節 4px、文字黑、字體 1rem；實作 spec「Practice page SHALL display the application version」；完成定義：dev server 開啟字母練習頁可看到 `0.0.1`，位置與樣式符合 spec。
- [x] [P] 1.6 撰寫 `appVersion.ts` 與 `AppVersionLabel.vue` 的 vitest 單元測試（含 fallback 行為），並補 PracticeView smoke test 驗證版號可見且樣式正確；完成定義：`npx vitest run` 通過。
- [ ] 1.7 在實機 iPhone Safari 與 Android Chrome 離線情境驗證版號顯示於整個頁面內容最底部右下角，且文字黑、字體 1rem、無固定於 viewport；完成定義：手動測試紀錄寫入 PR description。
- [x] 1.8 更新 `tests/component/PracticeViewSmoke.spec.ts`，先以失敗測試覆蓋 spec「Practice page SHALL display the application version」的新定位：`app-version-label` 必須是 Practice 頁面最後一個非 overlay 內容、不得位於 `practice-reference-sections` 內、且右對齊整頁內容寬度；完成定義：變更前測試失敗，變更後 `npx vitest run tests/component/PracticeViewSmoke.spec.ts` 通過。
- [x] 1.9 更新 `src/modules/practice/views/PracticeView.vue`，將 `AppVersionLabel` 從右欄 `practice-reference-sections` 移到 PracticeView 內容流最後的全寬版號列，保留黑色與 1rem 樣式，不使用 `fixed` / viewport positioning；對應 design「版號定位於整個 Practice 頁面內容流最底部右側」決策。完成定義：dev server 開啟字母練習頁並捲到最底部時，版號位於整頁內容右下角。

## 2. PWA Update Check on Launch 能力（pwa-update-check-on-launch）

- [x] [P] 2.1 擴充 `src/modules/pwa/services/pwaLifecycleService.ts`：加入 `triggerLaunchUpdateCheck()`，呼叫 `registration.update()` 並包 try/catch；實作 spec「Update check MUST fail silently when offline or unreachable」；對應 design「PWA 啟動時主動觸發 SW update」決策。完成定義：函式存在、有回傳 Promise、catch 區塊輸出 `console.warn`。
- [x] 2.2 擴充 `src/modules/pwa/composables/usePwaLifecycle.ts`，向外暴露 `triggerLaunchUpdateCheck`；完成定義：composable 回傳值包含此方法且型別正確。
- [x] 2.3 在 `src/app/main.ts` 啟動流程中呼叫 `triggerLaunchUpdateCheck()` 一次；實作 spec「PWA App MUST check for service-worker updates on every launch」；完成定義：page reload 時 console 可見一次更新檢查日誌。
- [x] [P] 2.4 撰寫單元測試：mock SW registration，驗證 `update()` 在啟動時被呼叫一次、且 offline 拒絕時不丟錯；同時覆蓋 spec「PWA App MUST check for service-worker updates on every launch」與「Update check MUST fail silently when offline or unreachable」；完成定義：`npx vitest run` 通過、覆蓋成功與失敗兩條路徑。
- [ ] 2.5 在實機 PWA App 部署新版後驗證：使用者重新開啟 App 即可看到既有 update-prompt UI（不需開網頁）；實作 spec「Update delivery MUST NOT require opening the website entry」與「Existing update-prompt UI MUST be preserved」；完成定義：手動驗證紀錄寫入 PR description。

## 3. N5 Grammar Learning Status Sections 能力（n5-grammar-learning-status-sections）

- [x] [P] 3.1 在 `src/modules/n5Grammar/views/N5GrammarView.vue` 加兩個 computed：`unfinishedSections` 與 `finishedSections`；實作 spec「N5 grammar page MUST split sections by learning status」與「Existing in-zone order MUST be preserved」；對應 design「N5 分區用 computed + 雙 v-for 渲染」決策。完成定義：computed 純函式、有 type、輸出順序與來源資料一致。
- [x] 3.2 模板用兩個獨立 `<section>` 容器分別 v-for 渲染未學習與已學習；實作 spec「Zone containers MUST follow specified spacing rules」（zone padding 0、間距 1rem）；完成定義：DOM 結構與樣式對齊 spec。
- [x] [P] 3.3 撰寫單元測試覆蓋分區分配（含三段例子）、in-zone order 維持、zone container 樣式、toggle checkbox 後 section 即時於兩 zone 間移動；實作 spec「Checkbox semantics MUST remain unchanged」；完成定義：`npx vitest run` 通過。
- [x] [P] 3.4 更新 `tests/component/N5GrammarSections.spec.ts`，先以失敗測試覆蓋 spec「Empty finished zone MUST be hidden」：沒有完成 section 時 `[data-testid="n5-grammar-finished-zone"]` 不存在；有完成 section 或勾選完成後才 render finished zone 並保留 `p-0`。完成定義：實作前空狀態測試因 finished zone 仍存在而失敗。
- [x] 3.5 更新 `src/modules/n5Grammar/views/N5GrammarView.vue`，讓 `n5-grammar-finished-zone` 僅在 `finishedSections.length > 0` 時 render，避免空已學習區的 `space-y-4` margin 造成父層高度多 16px；對應 design「N5 分區用 computed + 雙 v-for 渲染」決策與 spec「Empty finished zone MUST be hidden」。完成定義：`npx vitest run tests/component/N5GrammarSections.spec.ts` 通過，且空狀態只 render unfinished zone。

## 4. 共用基礎與文件

- [x] [P] 4.1 更新 `PROJECT_ARCHITECTURE.md`，補上 `src/shared/version/`、`src/shared/components/AppVersionLabel.vue`、PWA 啟動更新檢查流程、N5 分區結構；對應憲法第 V 條（PROJECT_ARCHITECTURE.md 為活文件）。完成定義：文件內容與實際 src 結構一致。
- [x] 4.2 整合驗證：build 後檢查 `__APP_VERSION__` 注入正確、bundle size 未超過 chunk 警戒線 500 KB；對應 design「儲存與離線職責劃分」決策；完成定義：`vite build` 無錯誤，build report 顯示 chunk 大小皆 < 500 KB。
- [x] 4.3 更新 `PROJECT_ARCHITECTURE.md` 的 PracticeView 與 AppVersionLabel 說明，明確記錄版號位於整個 Practice 頁面內容流最底部右側，而非右欄 reference section；完成定義：文件內容與實際 src 結構一致。

## 5. Route Root Vertical Padding 能力（route-root-vertical-padding）

- [x] 5.1 更新 route smoke tests，先以失敗測試覆蓋 spec「Non-vocabulary route roots MUST NOT add py-1 vertical padding」與「Vocabulary route root MUST keep py-1 vertical padding」：`PracticeViewSmoke.spec.ts` 驗證 `.practice-view` 不含 `py-1`、`GrammarViewSmoke.spec.ts` 驗證 `[data-testid="grammar-sections"]` 不含 `py-1`、`GrammarLevelRoutes.spec.ts` 驗證 N1～N4 placeholder 與 N5 route root 不含 `py-1`、`VocabularyViewSmoke.spec.ts` 驗證 `.vocabulary-view` 仍含 `py-1`。完成定義：實作前至少 Practice 或 Grammar 測試失敗，實作後相關測試通過。
- [x] 5.2 更新 `src/modules/practice/views/PracticeView.vue` 與 `src/modules/grammar/views/GrammarView.vue`，移除 route root container 的 `py-1`，並保留 `src/modules/vocabulary/views/VocabularyView.vue` 的 root `py-1`；對應 design「路由根層 py-1 只保留在 VocabularyView」決策。完成定義：`rg -n -F "py-1" src/modules src/app -g "*.vue"` 只列出 `VocabularyView.vue` 的 route root 例外或其他非 route-root 內部用法。
- [x] [P] 5.3 新增 source-level 測試覆蓋 spec「N5 Grammar route root MUST NOT receive stylesheet vertical padding」：讀取 `src/styles/main.css` 的 `.n5-grammar-view` 規則，驗證不含 `py-*`、`pt-*`、`pb-*`、`padding-top`、`padding-bottom`，並驗證 `N5GrammarView.vue` route root 仍以 `space-y-4` 控制分區間距。完成定義：實作前測試因 `.n5-grammar-view { @apply space-y-1 py-1; }` 失敗。
- [x] 5.4 更新 `src/styles/main.css`，移除 `.n5-grammar-view` route-root stylesheet 規則，讓 `/n5-grammar` 不再透過 CSS 取得 padding-top / padding-bottom，也不再以 global CSS 覆寫 template root 的 `space-y-4`。完成定義：`rg -n "n5-grammar-view|py-1|padding-top|padding-bottom" src/styles/main.css src/modules/n5Grammar/views/N5GrammarView.vue` 可看出 N5 route root 無 vertical padding 來源。
- [x] 5.5 執行 route-root vertical padding 相關測試：`npx vitest run tests/unit/routeRootVerticalPadding.spec.ts tests/component/GrammarLevelRoutes.spec.ts tests/component/N5GrammarSections.spec.ts tests/component/VocabularyViewSmoke.spec.ts tests/component/PracticeViewSmoke.spec.ts tests/component/GrammarViewSmoke.spec.ts`。完成定義：測試全數通過，且沒有新增 console error。
- [ ] 5.6 在實機 iPhone Safari 與 Android Chrome 離線情境驗證 `/practice`、`/grammar`、`/n1-grammar`～`/n5-grammar` 的正式內容前沒有 root `py-1` 或 stylesheet padding-top / padding-bottom，且 `/vocabulary` 保留既有 root spacing；完成定義：手動測試紀錄寫入 PR description。
