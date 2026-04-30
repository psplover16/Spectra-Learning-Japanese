## Context

現況的主路由列由 `src/shared/components/RouteTabs.vue` 以固定 tabs 陣列渲染，其中 `N5文法` 固定指向 `/n5-grammar`。目前 `src/app/router.ts` 只註冊 N5 文法頁，N1 到 N4 尚未存在。專案已有 `src/shared/utils/storageGuard.ts` 可讀取、驗證並清除無效 localStorage JSON，適合延伸成文法等級偏好儲存。

此變更的使用情境以手機為主：主路由列空間有限，文法等級需要收斂在單一主按鈕中；同時 PWA 離線使用時仍要保留上次選定等級。

## Goals / Non-Goals

**Goals:**

- 提供 N1 到 N5 文法等級路由入口，N1 到 N4 先以 placeholder 保持可進入且無渲染錯誤。
- 讓主路由列的文法按鈕顯示並前往目前選定等級。
- 在文法等級頁以子列表切換 N1 到 N5，子列表開啟時攔截外部點擊並只關閉列表。
- 使用 localStorage 保存選定等級，並在啟動時清除無效記憶值後 fallback N5。
- 抽出可重用、options/config 驅動的路由子列表元件。

**Non-Goals:**

- 不撰寫 N1 到 N4 文法教材內容。
- 不保存子列表開關狀態。
- 不把字母練習、變化規則、單字練習改成下拉路由。
- 不引入 Pinia store、新 UI 套件、新依賴或遠端同步。

## Decisions

### Centralize grammar level config and routes

新增 `src/modules/grammar/config/grammarLevels.ts` 作為單一資料來源，定義 `value`、`label`、`route`、`testId`，並匯出預設等級 `N5`。`src/app/router.ts` 依此設定註冊 `/n1-grammar` 到 `/n5-grammar`；N5 指向既有 `N5GrammarView.vue`，N1 到 N4 指向各自 placeholder view。

替代方案：直接在 `RouteTabs.vue` template 內寫死五個按鈕。淘汰原因是 route、label、storage 驗證會分散，未來調整順序或新增等級時容易漏改。

### Keep business state outside RouteSubMenu

新增 `src/shared/components/RouteSubMenu.vue`，只接收 options、目前選項、開關狀態與 test id 等資料，並只負責渲染、選項事件、外部點擊關閉事件。它不讀寫 localStorage、不知道文法等級，也不直接決定業務路由。

`src/modules/grammar/components/GrammarLevelSwitcher.vue` 負責把文法設定、router、route 狀態、storage composable 與 `RouteSubMenu` 串起來。`RouteTabs.vue` 只保留主路由列布局與非文法 tabs，避免共享元件被文法業務邏輯塞滿。

替代方案：把子列表與文法切換全部寫在 `RouteTabs.vue`。淘汰原因是可讀性差，且未來其他下拉路由會複製外部點擊攔截與 options 渲染邏輯。

### Persist only the grammar level value in localStorage

新增 `src/modules/grammar/storage/grammarLevelStorage.ts` 與 `src/modules/grammar/composables/useGrammarLevel.ts`。localStorage 只保存選定等級值，例如 `N1`，key 由 `src/shared/config/storageKeys.ts` 匯出，建議 `duotify.grammar.selectedLevel`。啟動時依 `grammarLevels.ts` 驗證等級與 route 是否仍存在；無效、格式錯誤或已移除的記憶值交由 storage guard 清除，然後回到 `N5`。

狀態 shape 不使用 Pinia；composable 以 Vue ref/computed 管理：`selectedLevel: Ref<GrammarLevelValue>`、`selectedOption: ComputedRef<GrammarLevelOption>`、`setSelectedLevel(level): boolean`、`clearSelectedLevel(): void`。localStorage 負責少量偏好持久化；IndexedDB 不使用；Pinia 不介入此局部 UI 偏好。

替代方案：保存完整 `{ label, route }` 物件。淘汰原因是程式碼改名或路由調整後容易留下過期資料；只保存 `value` 可由最新 config 推導文字與路由。

### Use an overlay to close the submenu without triggering page actions

子列表開啟時渲染一個透明 overlay，覆蓋主內容區並攔截一般畫面點擊；overlay 點擊只關閉子列表。主路由按鈕區與子列表本身維持可點擊，子列表使用 absolute 或 fixed 定位在觸發按鈕下方 4px，並以觸發按鈕水平置中。子列表容器使用 `padding: 2px`、選項 gap `4px`、背景比專案背景略深，按鈕沿用 `.route-tab-link`。

替代方案：document 全域 click listener 搭配 `preventDefault`/`stopPropagation`。淘汰原因是它較容易與 Vue Router link、checkbox、表格互動衝突；overlay 的攔截範圍與視覺層級較明確，也更容易用 E2E 驗證。

### Keep route and page containers compact

路由按鈕所在的 app shell header 容器採用 `p-1`，讓主路由列與子列表觸發按鈕之間保留緊湊可點擊空間。整個頁面外層容器採用 `p-2`，取代原本 X/Y 不一致的 `px-2 py-3`，讓手機寬度下的頂部區域更穩定，也讓子列表定位比較容易用單一參考框驗證。

替代方案：只調整子列表本身，不改 app shell 容器。淘汰原因是子列表雖然會變緊湊，但主路由列與整頁外框仍保留不一致間距，手機畫面上方會顯得鬆散且不利於精準對齊。

### Keep placeholder grammar pages explicit

N1 到 N4 placeholder view 需顯示明確的空狀態文字，例如「N1文法內容準備中」，並提供穩定 `data-testid`。placeholder 是正式可進入頁面，不是錯誤頁或 redirect；這可讓路由切換與持久化在教材內容完成前先被驗證。

替代方案：N1 到 N4 暫時 redirect 到 N5。淘汰原因是使用者選 N1 後卻看到 N5 內容會破壞路由記憶語意，也無法驗證每個等級路由是否獨立存在。

## Risks / Trade-offs

- [Overlay 層級遮住主路由按鈕] → 將 overlay z-index 放在頁面內容之上、主路由與子列表之下或以容器分層，並用 E2E 驗證主路由按鈕仍可點擊。
- [localStorage 在 SSR 或測試環境不存在] → storage 函式只在瀏覽器生命週期使用，單元測試以 jsdom localStorage 驗證。
- [共用子列表過度抽象] → 第一版只抽 RouteSubMenu 的通用渲染與外部關閉行為；文法等級業務保留在 GrammarLevelSwitcher。
- [主路由列在 375px 下溢出] → 按需求調整 `.route-tab-link` padding 為 `0.3rem 0.39rem`，header 容器為 `p-1`、頁面外層為 `p-2`，並保留既有 nowrap 與 flex-wrap 驗證。
- [placeholder 被誤認為故障] → 使用明確準備中 copy 與可見頁面標題，而不是空白畫面。

## Migration Plan

1. 新增文法等級設定、storage key、storage/composable 與 placeholder views。
2. 註冊 N1 到 N4 文法路由，確認 N5 既有路由不被改名。
3. 建立 RouteSubMenu 與 GrammarLevelSwitcher，整合到 RouteTabs。
4. 更新樣式、PROJECT_ARCHITECTURE 與測試。
5. 若部署後需回滾，移除新增 route 與 switcher，恢復 RouteTabs 固定 `/n5-grammar`；既有無效 localStorage key 會在功能移除後不再被讀取。

## Open Questions

無待決問題；本設計採用 overlay 攔截方案、`RouteSubMenu.vue` 命名與 `N5` fallback。
