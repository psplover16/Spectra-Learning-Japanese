## Why

使用者要解決的問題是：專案已在 openspec/config.yaml 定義多項規範，但目前所有程式碼尚未確認完全符合。現在需要建立一個專門變更，讓既有程式碼與專案憲法對齊，避免後續開發建立在不一致的基線上。

## What Changes

- 以 openspec/config.yaml 作為規範來源，盤點現有程式碼的遵循狀態。
- 修正可確認的規範不一致實作。
- 補充必要驗證，確保修正後沒有回歸。
- 記錄規範與既有設計衝突或語意不明的項目，不任意放寬規範。

## Non-Goals

- 不新增與規範對齊無關的產品功能。
- 不在本變更中修改 openspec/config.yaml。
- 不做非必要的大範圍重構。
- 不在未確認衝突原因時改寫既有規格。

## Capabilities

### New Capabilities

- constitution-compliance: 定義現有程式碼必須可依 openspec/config.yaml 被盤點、修正與驗證的規範遵循基線。

### Modified Capabilities

(none)

## Impact

- Affected specs: constitution-compliance.
- Affected code:
  - Modified: Existing source, test, script, and configuration files governed by openspec/config.yaml, identified during the audit.
  - New: Validation or test files required to prove compliance.
  - Removed: Non-compliant generated or obsolete files only if the audit confirms they should not remain.
