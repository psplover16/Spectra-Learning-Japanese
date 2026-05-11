## Context

N5 文法頁（路由 `/grammar`，模組 `src/modules/n5Grammar/`）以 section 為容器列出語法條目，每個 section 標題列已有：

- **Checkbox（已學完）**：絕對定位於右側（`.n5-grammar-section-completion-hit-area`，`position: absolute; right: -0.375rem`），h-11 w-11 hit-area；勾選後 section 摺疊並移至「已完成」區
- **標題按鈕（展開/摺疊）**：`.n5-grammar-section-toggle`，滿寬置中

現有持久化以 localStorage 為主：`n5GrammarCompletionStorage`（記錄已學完）、`grammar-level-persistence` spec（記錄選用等級）。專案另有 `vocabulary` 模組使用 IndexedDB，但僅因該資料規模（數百筆 mark）與查詢需求才升級。

本變更要在不動現有 checkbox / 標題的前提下，新增「閱讀位置書籤」— 鏡像 checkbox 視覺/觸發模式但置於左側，並跨 session 持久化。schema 須預留 N4–N1。

## Goals / Non-Goals

**Goals:**

- 在 N5 文法 section 標題左側提供書籤按鈕，與右側 checkbox 視覺對稱（hit-area、尺寸、padding 一致）
- 每個 JLPT 等級僅一個實心書籤；切換時自動覆蓋舊書籤；點實心可取消
- 書籤狀態跨 session 持久化，使用 localStorage 與既有持久化機制一致
- Storage wrapper 設計成跨等級（N1–N5）可重用，未來等級模組可直接呼叫
- 不影響現有 checkbox 行為與測試

**Non-Goals:**

- 不實作 N4/N3/N2/N1 的 view 程式（只在 storage schema 預留欄位）
- 不偵測捲動位置或最後展開區塊（手動標記為唯一輸入）
- 不允許單一等級多書籤（單一 key 自然強制）
- 不使用 IndexedDB（資料量、查詢需求皆不符合）
- 不改動既有 e2e 對 checkbox 位置/行為的斷言

## Decisions

### 採用 localStorage 而非 IndexedDB

**選擇**：localStorage（透過既有 `src/shared/utils/storageGuard.ts` 的 `readJsonStorage` / `writeJsonStorage`）。

**理由**：

- 資料規模上限：5 等級 × ~50 bytes = < 1 KB，遠低於 localStorage 5 MB 配額
- 無查詢需求：以 `level` 取得單一記錄，無索引、cursor、範圍查詢
- 同步 API：寫入發生在 UI 互動瞬間，同步寫入無需 Promise 包裝
- 一致性：同模組 `n5GrammarCompletionStorage` 與 `grammar-level-persistence` 已用 localStorage

**替代方案（已淘汰）**：

- **IndexedDB**（原始 discuss.txt 第 5 行建議）：適合大量結構化資料（如 vocabulary marks 模組已採用），但本案資料量與查詢模式皆未達升級門檻。會引入非同步 API、版本遷移、失敗降級的額外複雜度，違反「最簡可行解」原則
- **Pinia store + 應用啟動時讀檔**：適合需在多元件間共享的記憶體狀態；本案僅 `N5GrammarView` 一處使用，過度抽象

### Storage schema：單 key + byLevel map

**選擇**：單一 localStorage key（`duotify.grammar.bookmark`），值為 JSON 物件，按等級分組。

**Schema**：

```ts
interface GrammarBookmarkSnapshot {
  version: 1;
  byLevel: Partial<Record<JlptLevel, { sectionId: string; updatedAt: string }>>;
}
```

樣態示例：

```json
{ "version": 1, "byLevel": { "n5": { "sectionId": "particles-wa", "updatedAt": "2026-05-11T..." } } }
```

**理由**：跨等級為共用儲存層的自然抽象；整包讀寫保證原子性；新增等級無需擴張 key 空間。

**替代方案（已淘汰）**：

- **每等級獨立 key**（`duotify.grammar.bookmark:n5`、`...:n4`）：跨等級操作需多次讀取；列出所有書籤需掃描多 key
- **複合 key `${level}-${sectionId}` 為單筆**：「同等級至多一個」需在應用層強制刪除舊筆，無法靠 key 結構天然保證

### 職責分層：localStorage / Wrapper / 元件

- **localStorage**：原始持久化（單一 key + JSON 物件）
- **Wrapper（`src/modules/grammar/storage/grammarBookmarkStorage.ts`）**：封裝 byLevel map 的部分更新（讀/寫/刪某一等級不影響其他等級）、型別保護、`storageGuard` 失敗降級
- **元件（`N5GrammarSectionCard.vue` / `N5GrammarView.vue`）**：UI 狀態 ↔ Wrapper API

不引入 Pinia store — 書籤狀態僅 `N5GrammarView` 一處消費，`ref` + `onMounted` / `onActivated` 同步即可，與既有 completion 處理一致。

### UI 鏡像 checkbox 而非新版面

**選擇**：新增書籤按鈕，CSS class `.n5-grammar-section-bookmark-hit-area`，鏡像 `.n5-grammar-section-completion-hit-area` 的絕對定位 pattern，但用 `left: -0.375rem` 取代 `right: -0.375rem`。尺寸 h-11 w-11、置中對齊、cursor pointer 全部一致。

**理由**：完全不動 toggle button 與 completion hit-area 的既有結構，現行 e2e 斷言（`tests/e2e/n5-grammar-layout.spec.ts`）與肌肉記憶都不破壞。新增絕對定位元素只增不改。

**替代方案（已淘汰）**：

- **重排為 flexbox `[bookmark] [title] [checkbox]` 三欄**：破壞既有絕對定位邏輯、需改動 toggle 滿寬置中、需動 e2e

### 「已學完」自動清書籤

**選擇**：`N5GrammarView` 內的 `updateSectionCompleted(sectionId, true)` 若該 `sectionId` 與當前書籤位置相同，呼叫 `clearGrammarBookmark('N5')`。

**理由**：書籤語意是「**目前/上次讀到的位置**」，已學完段落該語意失效；保留書籤會在已完成區出現「無法看見的書籤」（finished 區隱藏按鈕，但資料仍在）。

**替代方案（已淘汰）**：

- **允許書籤獨立於 completion**：使用者複習已學段落時可保留進度 — 但這混淆「reading position」與「重點筆記」語意，且 finished 區不顯示按鈕會讓書籤無法被使用者主動清除，造成幽靈狀態

### Mobile-first 互動

按鈕 hit-area h-11 w-11（44 × 44 px）符合 WCAG 2.5.5 (AAA) 觸控目標尺寸，與既有 checkbox hit-area 一致。書籤位於 section 左上角，落在左拇指可達區。

### 視覺一致性：色相與對比

**色相**：書籤 icon 採 `text-amber-700`（amber 家族色相），outline 與 solid 共用同色 — 狀態語意由「**形狀**」（FA outline vs solid icon）承擔，不靠顏色加深。**禁止用灰階深淺（如 `text-stone-700`）作為視覺主色**，原因有二：

**Outline 狀態的內部填色（重要實作細節）**：FA outline icon 是「邊框 + 鏤空內部」結構，內部透明會讓 header 背景透過來，造成「icon 內部色隨容器展開而變化」的視覺缺陷。修法為**雙層堆疊**：

```vue
<span class="n5-grammar-section-bookmark-outline-stack">
  <IconBookmarkSolid class="n5-grammar-section-bookmark-icon-fill" />  <!-- 白色實心，填內部 -->
  <IconBookmarkOutline class="n5-grammar-section-bookmark-icon-border" /> <!-- amber 框，畫邊 -->
</span>
```

底層 solid bookmark 以 `text-white` 填整個書籤形狀（內部 + 邊界），上層 outline bookmark 以 `text-amber-700` 畫邊。兩者 SVG 路徑同源（FA fa6-solid 與 fa6-regular 共用同一形狀），對齊精確。結果：**outline icon 在任何 header bg 上都是「白底 + amber 邊」**，內部色不再受容器狀態影響。

**禁止改用 `opacity` 模擬**：opacity 讓 bg 透過來，等同回到「內部色隨 bg 變」的原問題。

---

1. 灰階與既有 header 背景（neutral-50 / neutral-400 / stone-300）同為無彩色，靠純亮度差異辨識，在中性灰背景上對比驟降
2. 灰階 icon 與 title 同色相，無法傳達「書籤是獨立的功能元素」

**色彩對比要求（WCAG 1.4.11 non-text contrast，≥ 3:1）**：

| header 狀態 | bg | `text-amber-700` 對比 | 評估 |
|---|---|---|---|
| 收合 | `bg-neutral-50` (#FAFAFA) | 5.5:1 | ✓ 通過 |
| 展開 | `bg-neutral-400` (#A3A3A3) | 2.0:1 | ⚠ 未達 WCAG AA |
| 已完成 | `bg-stone-300` (#D6D3D1) | 3.7:1 | ✓ 通過 |

**展開狀態對比偏低的影響範圍**：這是 header 既有設計問題，影響 title 文字、checkbox 邊框、書籤 icon 三者，**不是書籤獨有缺陷**。本變更不修改既有 `bg-neutral-400`（out of scope），但記錄此限制作為未來「header 視覺層次改造」變更的觸發條件。

**新增 header 背景狀態時的義務**：未來若引入新的 header 狀態（例如 `is-focused`、`is-loading`），實作者 SHALL 重新驗證書籤 icon 在新背景上的對比比，並在發現 < 3:1 時：
1. 調整新背景的亮度而非加深 icon（避免 icon 在收合狀態變得過重）
2. 或在 design.md 明列無法達標的取捨理由

## Implementation Contract

### 可觀察行為

1. **預設狀態**：所有 section 顯示空心書籤；同一等級內僅有一個 section 可顯示實心
2. **切換實心**：點空心書籤 → 該書籤變實心；若同等級先前已有實心書籤，自動變回空心
3. **取消實心**：點實心書籤 → 變回空心；該等級無書籤
4. **跨 session 還原**：關閉瀏覽器 / app 後重新開啟 N5 文法頁，先前的實心書籤位置正確還原
5. **與 checkbox 互動**：將標有書籤的 section 勾為「已學完」→ 該書籤自動消失（資料層刪除）
6. **已完成區行為**：已完成區（finished zone）的 section 不渲染書籤按鈕（連 DOM 都不存在）

### 介面/資料形狀

**Storage key**（`src/shared/config/storageKeys.ts`）：

```ts
export const grammarBookmarkStorageKey = 'duotify.grammar.bookmark';
```

**Wrapper API**（`src/modules/grammar/storage/grammarBookmarkStorage.ts`）：

```ts
import type { GrammarLevelValue } from '@/modules/grammar/config/grammarLevels';
// 重用既有型別 GrammarLevelValue = 'N1' | 'N2' | 'N3' | 'N4' | 'N5'

export interface GrammarBookmarkEntry {
  sectionId: string;
  updatedAt: string;
}

export function readGrammarBookmark(level: GrammarLevelValue): GrammarBookmarkEntry | null;
export function writeGrammarBookmark(level: GrammarLevelValue, sectionId: string, updatedAt?: Date): boolean;
export function clearGrammarBookmark(level: GrammarLevelValue): void;
```

**SectionCard props 與 emit 擴充**：

- 新增 `bookmarked: boolean`（預設 `false`）
- 新增 `showBookmark: boolean`（預設 `true`；finished zone 傳 `false`）
- 新增 emit `update:bookmarked: [bookmarked: boolean]`

**CSS class**（`src/styles/main.css`）：

```css
.n5-grammar-section-bookmark-hit-area {
  @apply absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center;
  left: -0.375rem;
}
```

### 失敗模式

- localStorage 無法存取（無痕模式、停用 storage）→ wrapper 透過 `storageGuard` 自動 no-op，UI 仍可切換但不持久化（同既有 `n5GrammarCompletionStorage` 行為）
- 讀到 corrupt JSON 或 schema 不符 → `readJsonStorage` 自動刪除 key，回傳 `null`（已既有保護）
- snapshot 缺少某等級 entry → `readGrammarBookmark(level)` 回傳 `null`

### 驗收條件

- 單元測試（`tests/unit/grammarBookmarkStorage.spec.ts`）：read/write/clear 對單一等級的隔離性、version 與 sectionId 正確性、corrupt JSON 自動清除
- e2e 測試（`tests/e2e/n5-grammar-layout.spec.ts`）：書籤按鈕存在、定位於 section 左側、點擊切換實心 / 空心、跨頁重新整理後位置還原
- 現有 e2e 斷言（checkbox 位置、行為）全數通過、未動

### 範圍邊界

**In scope**：

- N5 文法 view 與 SectionCard 的書籤 UI
- `grammar-reading-position-bookmark` capability 與其 storage wrapper
- storage schema 涵蓋 N1–N5（資料層）
- 書籤與「已學完」checkbox 的互動規則

**Out of scope**：

- N4/N3/N2/N1 的 view UI 與測試
- 書籤的視覺反向指示（例如左側色條、滾動指示）— 僅 icon 變化
- 自動偵測閱讀位置（捲動位置、IntersectionObserver）
- 跨裝置同步、雲端備份
- 變更 checkbox 行為、位置、樣式或 hit-area

## Risks / Trade-offs

- **使用者誤觸**：左側書籤與 toggle 標題按鈕鄰近，可能誤點 → hit-area 限制在 h-11 w-11、`z-10` 確保命中優先；toggle 按鈕本身已使用 `justify-center` + `px-8` 內距，視覺重心在中央
- **書籤語意不直觀**：使用者可能誤以為「實心 = 重要 / 已收藏」 → 暫不加 tooltip（行動裝置 hover 無效）；以「同一等級只能有一個實心」的視覺事實隱含「位置標記」語意；若日後需引導，可在初次使用時加 onboarding hint（本變更不做）
- **schema 預留未啟用欄位**：N4–N1 entry 永遠是 `undefined` → `Partial<Record>` 型別本已涵蓋；無資料時 `byLevel` 可為空物件，不浪費空間
- **`updatedAt` 暫無消費者**：寫入但未使用 → 保留以利未來「最近書籤」聚合查詢；資料量微小，無壓力
