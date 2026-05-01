## Why

N5 文法頁的 checkbox 在手機模式下很難準確點擊，使用者容易誤按到同一列的收合/展開控制。這次變更要改善 checkbox 的可觸發範圍，同時保持既有視覺樣式與展開行為。

## What Changes

- 放大 N5 文法 section checkbox 周圍的點擊/觸控 hit area。
- 放大的 hit area 只切換 checkbox 狀態，不觸發 section 展開或收合。
- section 展開/收合控制維持原本行為，且不切換 checkbox 狀態。
- checkbox 的視覺大小與樣式維持不變。

## Non-Goals

- 不重新設計 checkbox 外觀。
- 不改變 checkbox 的語意。
- 不改變 N5 文法列表展開/收合規則。
- 不新增額外提示文字或教學 UI。

## Capabilities

### New Capabilities

- `n5-grammar-checkbox-hit-area`: 定義 N5 文法 section checkbox 的放大觸發範圍與互動邊界。

### Modified Capabilities

(none)

## Impact

- Affected specs: New `n5-grammar-checkbox-hit-area`
- Affected code:
  - New: (none)
  - Modified:
    - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
    - tests/component/N5GrammarSections.spec.ts
    - PROJECT_ARCHITECTURE.md
  - Removed: (none)
