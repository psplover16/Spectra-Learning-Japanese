## Context

目前 PWA 更新流程在使用者確認更新時會刪除全部 CacheStorage，接著呼叫 service worker 更新並重新載入。這會把 Workbox precache 中仍需離線使用的 app shell、route chunk、N5 文法內容與單字資料 chunk 一併刪除，造成更新後離線啟動時資料 lazy import 失敗。專案目標是手機 PWA 離線優先，因此更新流程必須避免讓已快取核心學習資料出現空窗。

## Goals / Non-Goals

**Goals:**

- 更新確認流程保留現有可用快取，避免手動刪除全部 CacheStorage。
- 讓 Workbox 的 precache manifest 與 cleanupOutdatedCaches 負責版本化資源替換。
- 驗證更新後離線可開啟 /n5-grammar，且 N5 文法資料可 render。
- 驗證更新後離線可開啟 /vocabulary，且單字資料可 render。

**Non-Goals:**

- 不新增遠端同步、後端 API、IndexedDB 或 Pinia store。
- 不改變 localStorage 中的 PWA deferred update flag、N5 文法完成註記或單字註記格式。
- 不重寫 Vite PWA 或 Workbox 產生 service worker 的方式。

## Decisions

### Remove manual CacheStorage clearing from PWA confirm update

更新確認只移除 localStorage 中的 deferred update flag，然後呼叫既有 updateServiceWorker(true)。不再呼叫會列出並刪除全部 caches 的 helper，避免刪掉 Workbox 已建立的新舊 precache。替代方案是只刪符合舊版本命名的 cache；淘汰原因是目前 cache 名稱由 Workbox 管理，手動比對名稱容易誤刪新版 precache，也會增加不必要的維護成本。

### Keep storage responsibilities unchanged

localStorage 只保存小量狀態：PWA deferred update flag、N5 文法完成註記與單字註記 snapshot。CacheStorage 只由 service worker / Workbox 管理靜態資產與 lazy chunk。IndexedDB 不使用，因為本修正沒有新增大量使用者資料或二進位資產。Pinia store 不新增，因為 PWA 更新流程仍由現有 composable service 管理，沒有跨頁共享新狀態。

### Verify updated offline route data assets

既有 E2E 只證明已快取後離線回訪 /vocabulary route shell 可 render；這次要擴充成 route shell 與 lazy data asset 都可用。測試需在 production preview 與 PLAYWRIGHT_PWA=1 情境下等待 service worker ready，確認 /n5-grammar 有實際 section、/vocabulary 有實際單字列，再切離線重新進入兩個路由驗證資料仍存在。替代方案是只用 unit test 斷言不刪 cache；淘汰原因是 unit test 無法證明瀏覽器 service worker 與動態 import 在離線時真的可用。

## Risks / Trade-offs

- [Risk] 舊版 cache 可能比以前保留更久。→ Mitigation：依賴 Workbox cleanupOutdatedCaches 清理不再使用的 precache，避免應用程式碼自行誤刪。
- [Risk] E2E 需 production preview 與 PWA 環境，執行成本較一般測試高。→ Mitigation：沿用既有 PLAYWRIGHT_PWA=1 條件，只在 PWA 驗證流程啟用。
- [Risk] 使用者瀏覽器若已被舊版本清空 cache，單靠新版本程式無法回復已刪除的離線資產。→ Mitigation：修正發布後需在線開啟一次，讓新版 service worker 建立新的 precache；之後離線使用才有保障。
