## Why

本專案需要把來源專案 Japanese_Word_Practice_Vue_AI 在 017-refine-n5-content 分支上的使用者可見功能與 UI 重現到本專案。現在先建立可驗收變更，避免「完全一樣」停留在不可驗收描述，並保留離線 PWA 的一致性要求。

## What Changes

- 新增來源專案 parity 能力：盤點來源功能、頁面、UI 狀態、資料流程，並在本專案重現。
- 建立 parity checklist，將每個來源畫面、互動與狀態映射到本專案驗收項目。
- 重現離線資料保存、設定、匯入匯出與進度等使用者可見流程；資料以本專案離線儲存保存，不新增雲端同步。
- 以功能、視覺與響應式驗收確認與來源一致。

## Non-Goals

- 不搬移來源 Git 歷史、實驗紀錄、憑證、個人資料或無使用者可見影響的內部實作。
- 不引入需要網路才能完成核心學習流程的功能。
- 不要求內部技術實作逐行相同；以使用者可觀察行為與 UI 一致為準。

## Capabilities

### New Capabilities

- `source-project-parity`: Covers auditing the specified source project branch and recreating all user-visible features, UI states, offline persistence behavior, and parity verification in this project.

### Modified Capabilities

(none)

## Impact

- Affected specs: source-project-parity
- Affected code:
  - New: parity checklist and tests for recreated screens and flows
  - Modified: front-end routes, feature modules, stores, components, styles, PWA assets, and offline persistence used by the learning app
  - Removed: none
