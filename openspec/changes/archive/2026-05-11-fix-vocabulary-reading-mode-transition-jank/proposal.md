## Problem

在桌機 Chrome 進入 `/vocabulary` 路由後，按下「閱讀模式」或「操作模式」按鈕切換 UI 時，整體 transition 看起來不順暢：使用者按下按鈕後有約 100ms 視覺上「按了沒反應」的死區，接著 table 區邊框／圓角／padding 與 84px 高度差**瞬間切換**（無 transition），同時 level controls 與 action controls 才開始慢慢收合。三段節奏錯亂，使用者明顯感覺到卡頓。

其他平台（手機 Safari、Android Chrome）切換流暢、無此問題。

## Root Cause

`src/styles/main.css` 中 `.vocabulary-level-controls` 與 `.vocabulary-action-controls` 用 `max-height: 8rem / 6rem` 上限值，但桌機寬螢幕讓控制列排成單行（實際只占 ~2-3rem）。當切換到閱讀模式時：

1. **`max-height` 死區**：transition 從 `8rem → 0`，但內容只占 ~3rem，前 ~62% 區間（8rem → 3rem）視覺上完全沒變化——使用者按下後感覺「沒反應」。手機因控制列 wrap 導致內容貼近上限，死區短到無感。
2. **`vocabulary-table-region` 與 `vocabulary-table-scroll` 無 transition**：閱讀模式下加上的邊框、圓角、padding、shadow，以及 `max-height` 從 `calc(100dvh - 196px)` 變為 `calc(100dvh - 112px)`（84px 跳動），在 className 切換瞬間生效。control-bar 還在 fade、table 已經跳完位置。
3. **`opacity` 120ms 與其他屬性 180ms 不同步**：opacity 提早 60ms 收完，視覺重心提早離開。
4. **`visibility: hidden` 不在 transition 屬性列表**：discrete 屬性，class 一加即立即生效，跟 opacity/max-height transition 不同步。

## Proposed Solution

統一以同一條 transition curve（180ms ease）處理所有 reading-mode 觸發的視覺變化，並改採能正確量測內容高度的 collapse pattern：

1. **`max-height` → `grid-template-rows` collapse pattern**
   把 `.vocabulary-level-controls` 與 `.vocabulary-action-controls` 改為 `display: grid; grid-template-rows: 1fr` 容器，內容用一層 inner wrapper 套 `min-height: 0; overflow: hidden`。閱讀模式時 `grid-template-rows: 0fr`。
   優點：transition 從「實際內容高度 ↔ 0」，沒有死區、且不需手動量 scrollHeight。

2. **`vocabulary-table-region` 與 `vocabulary-table-scroll` 補上 transition**
   `padding`、`border-color`、`border-radius`、`max-height` 都加 180ms ease。

3. **`opacity` 從 120ms 統一為 180ms**
   單行 CSS 改動，讓四個動畫屬性同步開始與結束。

4. **`visibility: hidden` 加 transition delay**
   `transition: ..., visibility 0s linear 180ms`（進入閱讀模式時）／`visibility 0s linear 0s`（退出時），讓 visibility 切換落在 transition 結束點。

5. **`gap` 屬於 layout 切換，可選擇加 transition 或維持瞬切**
   `.vocabulary-control-bar` 的 `gap: 2 → 0` 切換目前無 transition。若實測仍有殘留 jank，再加 `transition: gap 180ms ease`；否則維持現狀。

## Non-Goals

- 不改變按鈕本身的視覺切換（`bg-emerald-100 ↔ bg-red-600`）— 既有 `transition-colors` 已涵蓋，行為正確
- 不改動其他路由（`/practice`、`/grammar`、`/n5-grammar`）的 reading-mode 或類似 toggle UI
- 不引入動畫 library（Framer Motion、GSAP 等），純 CSS + 必要的最小 markup 調整
- 不調整 transition 時長為「比 180ms 更長／更短」的數值；維持既有 180ms baseline，僅修同步性
- 不重寫整個 `VocabularyControlBar` 元件結構，只在 `vocabulary-level-controls` / `vocabulary-action-controls` 各自加一層 inner wrapper（最小入侵）
- 不處理「按下按鈕到反應的 input latency」議題（非本問題範圍）
- 不新增可調整 transition 時長／曲線的使用者偏好設定

## Success Criteria

1. 在桌機 Chrome 預設 1280×720 viewport 下進入 `/vocabulary`，按下「閱讀模式」按鈕，**視覺上 100ms 內看到控制區開始收合動作**（無「死區」感）。
2. 切換 reading mode 期間，`vocabulary-table-region` 的視覺變化（邊框／padding／高度）與 `vocabulary-level-controls` / `vocabulary-action-controls` 的收合動畫**同時開始、同時結束**（差距 ≤ 16ms / 1 frame）。
3. `visibility` 與 `opacity` 切換不再造成「內容瞬間消失但 max-height 還在收」的視覺斷層。
4. 在手機 Safari / Android Chrome 上切換 reading mode 仍順暢、無 regression（手動驗證 + 既有 e2e 測試通過）。
5. 既有 `tests/component/VocabularyViewSmoke.spec.ts` 中 reading mode 切換相關測試與 `tests/e2e/vocabulary-word-practice.spec.ts` 中 reading mode 流程全部維持通過。
6. Chrome DevTools Performance panel 錄製一次完整切換，transition 期間不再出現「按下後 ~100ms 無變化」的紀錄段。

## Capabilities

### New Capabilities

- `vocabulary-reading-mode-ui-transition`: 描述 vocab 子路由「閱讀模式 ↔ 操作模式」切換時，control bar 收合動畫與 table region 視覺變化的同步性與順暢度要求（transition 同步開始與結束、無「死區」、跨裝置一致）。

### Modified Capabilities

(none)

## Impact

- Affected specs: `vocabulary-reading-mode-ui-transition` (new)
- Affected code:
  - Modified:
    - src/styles/main.css
    - src/modules/vocabulary/components/VocabularyControlBar.vue
  - New:
    - (none — 不新增檔案)
  - Removed:
    - (none — 不刪除檔案)
- Affected tests:
  - Modified（如有 selector 因 wrapper 新增而需調整）:
    - tests/component/VocabularyViewSmoke.spec.ts
    - tests/e2e/vocabulary-word-practice.spec.ts
