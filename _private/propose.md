# align-with-constitution

## 討論結論

**Decision**：建立變更 `align-with-constitution`，目標是讓目前所有程式碼符合 `openspec/config.yaml` 中已定義的專案規範。

**Rationale**：專案規範已存在，現在的重點不是新增功能，而是讓既有程式碼與規範對齊，降低後續變更違反共同準則的風險。

**Capture to**：建議後續建立 `openspec/changes/align-with-constitution/`，至少包含 `proposal.md` 與 `tasks.md`。

## Proposal Draft

### Why

目前 `openspec/config.yaml` 已添加多項專案規範，但既有程式碼尚未明確保證完全符合。需要一個專門變更，盤點並修正與規範不一致之處。

### What Changes

- 以 `openspec/config.yaml` 作為規範來源，檢查現有程式碼是否違反其中規則。
- 修正所有可確認的不一致實作。
- 若發現規範與現有設計互相衝突，先記錄衝突點，不任意放寬規範或改寫規範。
- 補充必要驗證，確保後續變更能持續符合規範。

### Out of Scope

- 不新增與規範對齊無關的功能。
- 不在未確認原因的情況下改動 `openspec/config.yaml`。
- 不進行大範圍重構，除非該重構是符合規範所必需。

### Impact

- Affected code: 所有受專案規範約束的現有程式碼。
- Affected specs: 目前輸入未要求新增功能規格；此變更屬於規範遵循與對齊。
- Risk: 範圍可能較廣，應以小步驟盤點、修正與驗證，避免一次性大改。

## Suggested Tasks

1. 讀取並整理 `openspec/config.yaml` 中的規範清單。
2. 將每項規範對應到需要檢查的程式碼區域。
3. 稽核目前程式碼，找出明確違反規範之處。
4. 以最小必要變更修正已確認的不一致。
5. 執行既有檢查與測試，確認修正未造成回歸。
6. 記錄仍有歧義或與既有設計衝突的規範。

## Open Questions

- 「所有程式碼」是否只包含 source code，或也包含 tests、scripts、設定檔與產生檔？
- 此變更是否需要新增自動化規範檢查，或只需先讓目前程式碼符合規範？
- 若既有行為與規範衝突，應立即調整行為，還是另開提案處理？

## Proposed Spectra Artifacts

```text
openspec/changes/align-with-constitution/
  proposal.md
  tasks.md
```

### `proposal.md` Draft

```markdown
# align-with-constitution

## Why

The project already defines coding and project rules in `openspec/config.yaml`, but the current codebase is not yet explicitly verified against those rules. This change aligns existing code with the project constitution so future work starts from a compliant baseline.

## What Changes

- Audit existing code against `openspec/config.yaml`.
- Fix confirmed rule violations with minimal, focused changes.
- Preserve existing behavior unless a rule requires behavior to change.
- Record ambiguous or conflicting rules instead of silently changing the rules.

## Impact

- Affected code: all existing project code governed by `openspec/config.yaml`.
- Affected specs: none unless the audit identifies a requirement-level conflict.
```

### `tasks.md` Draft

```markdown
# Tasks

- [ ] Read `openspec/config.yaml` and extract a compliance checklist.
- [ ] Map checklist items to relevant code areas.
- [ ] Audit current code against the checklist.
- [ ] Fix confirmed non-compliant code.
- [ ] Run existing tests and validation commands.
- [ ] Document unresolved ambiguities or follow-up proposals.
```

## Note

本文件只根據 `_private/discuss.txt` 的內容整理；尚未讀取 `openspec/config.yaml` 或其他專案檔案。後續正式提案或實作時，應再依 `openspec/config.yaml` 的實際規範逐條檢查。
