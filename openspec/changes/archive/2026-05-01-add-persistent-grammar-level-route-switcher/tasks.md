## 1. 測試先行

- [x] [P] 1.1 新增會失敗的 router/component 測試，覆蓋 Grammar level routes 與 Keep placeholder grammar pages explicit：驗證 `/n1-grammar` 到 `/n5-grammar` 可進入、N5 保留既有內容、N1 到 N4 顯示準備中 placeholder。
- [x] [P] 1.2 新增會失敗的 storage/unit 測試，覆蓋 Persist selected grammar level、Restore selected grammar level、Clear invalid grammar level preference、Submenu open state is not persisted，以及 Persist only the grammar level value in localStorage 的只存 value 規則。
- [x] [P] 1.3 新增會失敗的 RouteSubMenu component 測試，覆蓋 Config-driven route submenu、External interaction handling、Keyboard dismissal 與 Route submenu positioning and visual style 的 class/style 合約。
- [x] [P] 1.4 新增會失敗的 Playwright E2E 測試，覆蓋 Main grammar route control、Grammar route control navigation behavior、Grammar level option selection、外部點擊只關閉子列表，以及 375px 手機 viewport 無水平溢出。

## 2. 路由與偏好資料層

- [x] 2.1 實作 Centralize grammar level config and routes：新增 `grammarLevels.ts`、註冊 N1 到 N5 route、建立 N1 到 N4 placeholder views，完成 Grammar level routes 與 Keep placeholder grammar pages explicit。
- [x] 2.2 實作 Persist only the grammar level value in localStorage：新增 storage key、`grammarLevelStorage.ts` 與 `useGrammarLevel.ts`，完成 Persist selected grammar level、Restore selected grammar level、Clear invalid grammar level preference、Submenu open state is not persisted。

## 3. 子列表與主路由整合

- [x] 3.1 實作 Keep business state outside RouteSubMenu：新增 `RouteSubMenu.vue`，以 options/config 渲染按鈕並 emit 選項事件，完成 Config-driven route submenu，且不耦合文法 storage 或 router。
- [x] 3.2 實作 Use an overlay to close the submenu without triggering page actions：在 `RouteSubMenu.vue` 加入 overlay 攔截、允許主路由與子列表按鈕、Escape 關閉，完成 External interaction handling 與 Keyboard dismissal。
- [x] 3.3 實作 Route submenu positioning and visual style：新增或調整 CSS，使子列表位於觸發按鈕下方 4px、padding 0、gap 2px、背景略深，並將 `.route-tab-link` padding 調整為 `0.3rem 0.39rem`。
- [x] 3.4 實作 `GrammarLevelSwitcher.vue` 並整合 `RouteTabs.vue`，完成 Main grammar route control、Grammar route control navigation behavior、Grammar level option selection：非文法頁直接跳 selected route，文法頁開子列表，選項更新文字、路由與 storage。

## 4. 文件與驗證

- [x] 4.1 更新 `PROJECT_ARCHITECTURE.md`，記錄新增 grammar config、storage/composable、placeholder views、GrammarLevelSwitcher 與 RouteSubMenu 的責任邊界。
- [x] 4.2 更新既有 smoke/test utilities 對主路由列數量、文字、test id 與 nowrap 的預期，完成後舊測試與新測試都能描述同一套路由行為。
- [x] 4.3 執行 `npm run lint`、`npm run typecheck`、`npm run test:unit`、`npm run build`，確認無 lint、型別、單元測試或建置錯誤。
- [x] 4.4 執行 `npm run test:e2e`，並在 375px 手機 viewport 的離線或快取可用情境下手動驗證：路由切換、localStorage 還原、外部點擊關閉、子列表重開頁面後保持關閉。

## 5. 視覺間距調整

- [x] [P] 5.1 修正 Route submenu positioning and visual style：在 `src/styles/main.css` 將子列表改為 padding 2px、gap 4px，並以觸發按鈕水平置中；同步更新 `tests/component/RouteSubMenu.spec.ts` 驗證 4px 下方 offset、2px padding、4px gap 與中心對齊。
- [x] [P] 5.2 落實 Route switcher layout spacing 與 Keep route and page containers compact：在 `src/app/AppShell.vue` 將路由按鈕容器改為 `p-1`、外層頁面容器改為 `p-2`；同步更新 smoke 測試確認 class 或 spacing。
- [x] 5.3 驗證 `npm run lint`、`npm run typecheck`、`npm run test:unit`、`npm run build`，並在 375px viewport 手動或 E2E 驗證子列表閉合/開啟、離線重新整理後路由記憶仍正常。
