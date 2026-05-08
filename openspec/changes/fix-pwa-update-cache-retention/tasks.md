## 1. 測試先行

- [ ] 1.1 更新 tests/unit/pwaLifecycleService.spec.ts，新增會先失敗的 PWA update confirmation MUST retain offline caches 單元測試；完成定義：mock window.caches.keys/delete 後呼叫 confirmUpdate，斷言 updateServiceWorker(true) 被呼叫、pwaDeferredUpdateStorageKey 被移除、CacheStorage delete 不被呼叫，且既有測試不再期待更新時清空 cache。
- [ ] [P] 1.2 擴充 tests/e2e/pwa-offline-route-cache.spec.ts，新增 Offline return after PWA update MUST keep lazy learning data available 的 production preview PWA 情境；完成定義：PLAYWRIGHT_PWA=1 時等待 service worker ready，線上進入 /n5-grammar 與 /vocabulary 確認文法 section 與單字列已 render，再切離線重新進入兩個路由並確認沒有資料載入失敗狀態。

## 2. 更新流程修正

- [ ] 2.1 在 src/modules/pwa/services/pwaLifecycleService.ts 實作 Remove manual CacheStorage clearing from PWA confirm update；完成定義：confirmUpdate 只移除 deferred update flag 並呼叫 updateServiceWorker(true)，不再呼叫清空全部 CacheStorage 的 helper，也不新增 Workbox cache name hardcode。
- [ ] 2.2 依 Keep storage responsibilities unchanged 檢查儲存責任邊界；完成定義：localStorage key 與 snapshot 格式不變、未新增 IndexedDB、未新增 Pinia store，CacheStorage 仍只由 service worker / Workbox 管理。

## 3. 文件與驗證

- [ ] 3.1 依 Verify updated offline route data assets 更新 PROJECT_ARCHITECTURE.md；完成定義：文件記錄 PWA 更新流程不手動清空 cache，並記錄更新後離線驗證涵蓋 /n5-grammar 與 /vocabulary 的 lazy learning data assets。
- [ ] 3.2 執行單元與型別驗證；完成定義：npm run typecheck 通過，且 npx vitest run tests/unit/pwaLifecycleService.spec.ts 通過。
- [ ] 3.3 執行 build 與 PWA 離線驗證；完成定義：npm run build 通過，PLAYWRIGHT_PWA=1 npx playwright test tests/e2e/pwa-offline-route-cache.spec.ts --project=chromium 通過，並在手機尺寸模擬離線情境確認更新後 /n5-grammar 與 /vocabulary 都能載入資料。
