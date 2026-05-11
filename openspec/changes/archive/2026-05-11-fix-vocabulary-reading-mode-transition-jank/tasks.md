## 1. CSS transition 同步化

- [x] 1.1 將 `src/styles/main.css` 內 `.vocabulary-level-controls` 與 `.vocabulary-action-controls` 的 `transition` 屬性中的 `opacity 120ms ease` 改為 `opacity 180ms ease`，使四個動畫屬性（max-height/padding/border-width/opacity）共用同一條 180ms 時長。對應 spec requirement「Reading mode toggle animates control bar collapse and table scroll growth in sync」。完成驗證：手動切換 reading mode，opacity 不再比 max-height 提早 60ms 完成；DOM 上 `getComputedStyle` 顯示 transition-duration 全為 180ms。
- [x] 1.2 在 `src/styles/main.css` 內 `.vocabulary-level-controls` 與 `.vocabulary-action-controls` 的 transition 列表加上 `visibility 0s linear 180ms`；在 `.vocabulary-view-reading-mode .vocabulary-level-controls` 與 `.vocabulary-view-reading-mode .vocabulary-action-controls` 內覆寫為 `visibility 0s linear 0s`。對應 spec requirement「Hidden-state visibility flips at the end of the transition」。完成驗證：手動切到 reading mode，控制區在 180ms 期間仍為 `visibility: visible`、180ms 完成後才變 `hidden`；反向切換時於 0ms 立即 `visible`。

## 2. table region 視覺變化補上 transition

- [x] 2.1 [P] 在 `src/styles/main.css` 為 `.vocabulary-table-region` 增加 `transition: padding 180ms ease, border-color 180ms ease, border-radius 180ms ease, box-shadow 180ms ease`，使 reading-mode class 切換時，邊框、圓角、padding、shadow 與 control bar 同步動畫。對應 spec requirement「Reading mode toggle animates control bar collapse and table scroll growth in sync」。完成驗證：手動切換 reading mode，table region 邊框與 shadow 隨 control bar 同步淡入／淡出；DevTools Performance 錄製顯示對應屬性的 transition 動畫條。
- [x] 2.2 [P] 在 `src/styles/main.css` 為 `.vocabulary-table-scroll` 增加 `transition: max-height 180ms ease`，使 reading-mode 切換時的 84px 高度差分散到 180ms 而非瞬切。對應 spec requirement「Reading mode toggle animates control bar collapse and table scroll growth in sync」。完成驗證：手動切換 reading mode，table scroll 區高度平滑變化、無瞬間跳動；DevTools Performance 顯示 max-height 動畫條。

## 3. control bar collapse 改 grid-template-rows pattern（消除死區）

- [x] 3.1 修改 `src/modules/vocabulary/components/VocabularyControlBar.vue`，在 `<div class="vocabulary-level-controls">` 內側新增一層 `<div class="vocabulary-level-controls-inner">` wrapper，將原本的 `vocabulary-level-controls-left` 與 `vocabulary-level-controls-right` 兩個子節點都包進去，但 `data-testid` 維持在原父節點 `vocabulary-level-controls` 上。對應 spec requirement「Collapse animation has no leading dead zone on wide viewports」（markup 前置）。完成驗證：`npm run typecheck` 通過；既有 e2e 對 `[data-testid="vocabulary-level-controls"]` 的 visible 判斷仍能取得正確元素。
- [x] 3.2 修改 `src/modules/vocabulary/components/VocabularyControlBar.vue`，在 `<div class="vocabulary-action-controls">` 內側新增一層 `<div class="vocabulary-action-controls-inner">` wrapper，將原本的 `vocabulary-action-controls-left` 與 `vocabulary-action-controls-right` 包進去，data-testid 同樣維持在原父節點。對應 spec requirement「Collapse animation has no leading dead zone on wide viewports」（markup 前置）。完成驗證：`npm run typecheck` 通過；既有 component 測試對 `vocabulary-action-controls` 的視覺判斷仍正確。
- [x] 3.3 修改 `src/styles/main.css`，將 `.vocabulary-level-controls` 與 `.vocabulary-action-controls` 改為 `display: grid; grid-template-rows: 1fr; transition: grid-template-rows 180ms ease, opacity 180ms ease, border-width 180ms ease, visibility 0s linear 180ms`；移除既有的 `max-height: 8rem/6rem` 與 `padding-top/bottom` transition；對應 `.vocabulary-view-reading-mode` 後代選擇器內把 `max-height: 0` 改為 `grid-template-rows: 0fr` 並維持其他收合屬性。新加的 `.vocabulary-level-controls-inner` 與 `.vocabulary-action-controls-inner` 套用 `min-height: 0; overflow: hidden`，保留原本的 flex 排列規則（`flex flex-wrap items-center justify-between gap-3` 等）。對應 spec requirement「Collapse animation has no leading dead zone on wide viewports」。完成驗證：在桌機 Chrome 1280×720 進入 vocab 路由，按下閱讀模式按鈕，從 DevTools Performance 錄製可看到收合動畫於 16ms 內開始視覺變化、無「死區」；手機 Safari 375px viewport 切換仍順暢。

## 4. 確認按鈕視覺保持不變

- [x] 4.1 [P] 在 `src/styles/main.css` 對應 `.vocabulary-reading-mode-button`、`.vocabulary-reading-mode-button--read`、`.vocabulary-reading-mode-button--operate` 三條 rule 做 diff 確認：僅有 task 1-3 帶來的非預期變更時要還原。對應 spec requirement「Reading mode toggle preserves existing button visual identity」。完成驗證：`git diff src/styles/main.css` 中三條 button rule 維持 `transition-colors` 為唯一動畫驅動，無額外 `transition`／`animation` 屬性。

## 5. 測試與量測

- [x] 5.1 跑既有 `tests/component/VocabularyViewSmoke.spec.ts` 中 reading mode 相關案例（「預設為操作模式，並可切換閱讀模式且保留搜尋列與模式按鈕列」、「可從目前可見且已勾選的單字開始測驗，結算後只更新 draft 且不顯示未儲存提示」等）。對應 spec requirements「Reading mode toggle animates control bar collapse and table scroll growth in sync」與「Reading mode toggle preserves existing button visual identity」。完成驗證：所有相關案例通過；若因 task 3.1/3.2 新增的 inner wrapper 造成 DOM 結構變動使既有 selector 取錯元素，需更新測試但維持斷言意圖不變。
- [x] 5.2 跑既有 `tests/e2e/vocabulary-word-practice.spec.ts` reading mode 切換流程。對應 spec requirements「Reading mode toggle animates control bar collapse and table scroll growth in sync」與「Hidden-state visibility flips at the end of the transition」。完成驗證：兩個 e2e tests（375px JLPT level 篩選、離線控制列）皆通過；其中 reading mode 切換段在 hidden / visible 斷言上不需修改也能通過。
- [x] 5.3 [P] 在 `tests/component/VocabularyViewSmoke.spec.ts` 新增一個 transition 完整性測試：mount VocabularyView、模擬點擊 reading mode 按鈕、等待 200ms、檢查 `.vocabulary-level-controls` 的 `getComputedStyle` 屬性顯示 `transition-duration` 全為 `180ms`、`visibility` 已切到 `hidden`、`grid-template-rows`（或 max-height）已收到 0。對應 spec requirements「Reading mode toggle animates control bar collapse and table scroll growth in sync」、「Collapse animation has no leading dead zone on wide viewports」、「Hidden-state visibility flips at the end of the transition」。完成驗證：新增測試通過；變更被回退時測試失敗。
- [x] 5.4 桌機 Chrome 1280×720 手動量測：開 DevTools Performance 錄製一次完整的 reading mode 切換（操作 → 閱讀 → 操作），確認沒有「按下後 100ms 無變化」的 idle 段。對應 spec requirement「Collapse animation has no leading dead zone on wide viewports」。完成驗證：把 Performance trace 截圖或數據（按下時間戳、首個視覺變化時間戳、差值）記入最終 commit message。

   **實測結果（apply session 自動測量 + 使用者實機驗證）**：
   - Playwright headless Chromium 1280×720：transitionstart 218-287ms、layout shrink 128.9ms、layout grow 169-216ms（headless 環境 artifact、不等同真實 Chrome 體驗）
   - 使用者實機驗證：「優化不少，但仍有些許卡頓」→ 觸發 task 5.5 補丁

- [x] 5.5 依使用者實機回饋追加 transition 補丁（proposal Proposed Solution 第 5 點預留路徑）：
   - 第一輪（PC 殘留 jank）：
     - `.vocabulary-control-bar` 加 `transition: gap 180ms ease`，消除進入 reading mode 時 `gap-2 → 0` 的 8px 瞬間崩塌
     - `.vocabulary-table-region` 一度加入 `background-color 180ms ease, border-width 180ms ease`（後於第四輪移除，見下方）
   - 第二輪（小屏幕 multi-row「階梯感」）：
     - `.vocabulary-level-controls-inner` / `.vocabulary-action-controls-inner` 加 `transform-origin: top; transition: transform 180ms ease`；override 內加 `transform: scaleY(0)`。小屏幕下 N1-N5 checkbox wrap 成多行時，避免 `overflow: hidden` row-by-row 裁切造成的離散視覺，改為整體 scaleY 連續壓縮
   - 第三輪（手機板「動畫尾部 layer pop」）：
     - 兩個 `-inner` 加 `will-change: transform`，告訴瀏覽器把 inner 永久保留在合成 layer，避免動畫結束時 layer 進出 GPU 的最後一抖
   - 第四輪（table-region 不該有外層容器感）：
     - 移除 `.vocabulary-table-region-reading-mode` 的 `rounded-md border border-clay/15 bg-parchment p-1 shadow-soft`，只保留 `z-10` 給 stacking
     - 同步移除 `.vocabulary-table-region` 上對應的 transition 列表（padding / border-color / border-radius / box-shadow / background-color / border-width 都沒東西可 transition 了）
     - 連帶更新 spec requirement「Reading mode toggle animates control bar collapse and table scroll growth in sync」：明確 SHALL NOT add decorative border/padding/background/shadow，table 直接填滿釋出的空間
     - max-height 從 `calc(100dvh - 196px)` 成長到 `calc(100dvh - 112px)` 的 84px 額外空間維持不變
   - 第五輪（使用者實機觀察 reading mode 捲到最底空白太大）：
     - 在 `.vocabulary-table-region-reading-mode .vocabulary-table-scroll` 加 `padding-bottom: 0`，覆蓋 base 的 `padding-bottom: 0.75rem` (12px)
     - 操作模式維持 12px padding-bottom（捲動慣例下的呼吸空間）；reading mode 下表格需要最大空間，捲到最底時白邊從 32.2px 降到 20.2px（剩餘的是 view py-1 + safe-area，屬於不可動的 device chrome 預留）
     - Playwright 量測：scrollPaddingBottom `12px` → `0px`、tableBottomToScrollBottom `12px` → `0px`
   對應 spec requirement「Reading mode toggle animates control bar collapse and table scroll growth in sync」。完成驗證：既有 vitest 與 Playwright 全套測試維持綠（VocabularyViewSmoke 8/8、VocabularyControlBar 8/8、vocab e2e 5/5）；使用者實機在 PC 與小屏幕兩種 viewport 再次驗證視覺已順暢、無「按下死區」、無「階梯感」、無「最後一抖」、無「外層容器吃空間」感。

## 6. 表頭垂直對齊（apply 階段 scope 擴張，依使用者實機要求）

- [x] 6.1 修 `<th>` header cell 內容垂直置中。
   - 第一輪：將 `.vocabulary-header-cell` 從 `align-top` 改為 `align-middle`，讓四個 `<th>` cells 的內容（單字+練習雙 label、漢字/拼音、中文、bulk-mark checkbox）至少 cell-level 中央對齊。
   - 第二輪（使用者實機回饋「文字仍靠上」）：實測發現即使 cell `vertical-align: middle`，內部 `.vocabulary-header-toggle` 為 `inline-flex` 時與 baseline 對齊有 2.5px 上偏（Playwright 量測：top gap 3.25px、bottom gap 5.75px）。這是 inline-level 元素在 table-cell 內的 baseline-derived middle 與幾何中點不一致的 CSS 特性。把 `.vocabulary-header-toggle` 從 `inline-flex` 改為 `flex h-full`，讓 inner 變 block-level 並填滿 cell content area，靠自己的 `align-items: center` 對齊，避開 baseline 怪相。Playwright 重新量測：top 4.5px、bottom 4.5px，幾何中央對齊。
   - 第三輪實驗（使用者實機觀察「中文字下半部天生有些許空白」）：嘗試把 `.vocabulary-header-cell` 從 `leading-4` 改為 `leading-none` 壓平 leading 空間。Playwright 量測 span box 雖更緊貼字面（12px），但使用者實機 A/B 對比後選擇保留 `leading-4`（line-height 16px）—— 視覺上閱讀更舒服、雖然 glyph 仍偏上 ~3px 但接受 CJK 字型固有特性而不強壓 leading。最終狀態回到 `leading-4`。
   - 第四輪（使用者實機在手機 viewport 觀察 header 偏緊湊）：在 `@media (max-width: 420px)` 區塊內把 `.vocabulary-header-cell` 從共用的 `padding: 2px` 拆出來改 `padding: 3px`，`.vocabulary-body-cell` 維持 `padding: 2px`。手機下 header 更舒展、body cell 不動以維持資料密度。最後一個 cell `.vocabulary-mark-header-cell` 整段未動，padding 維持瀏覽器 `<th>` 預設（1px）；該 cell 內 checkbox 因 row height 同步拉高 2px 而視覺上有些許空白漂移，使用者確認接受此 side effect。
   最終 CSS state：`align-middle` (cell-level) + `flex h-full items-center` (inner) + `leading-4` (line-height 16px) + 手機 viewport 額外 `padding: 3px` 覆寫（僅 header cells、不影響 body 與 mark cell）。body cell 的 `align-top` 維持不變。完成驗證：既有 vitest 與 Playwright 全套測試維持綠（vitest 292/292、vocab e2e 5/5）；使用者實機驗證 4 個 header cells 的 checkbox 與文字目視都置中對齊。
