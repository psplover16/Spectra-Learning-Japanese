<!-- SPECTRA:START v1.0.2 -->

# Spectra 指引

本專案使用 Spectra 進行規格驅動開發（Spec-Driven Development，SDD）。規格位於 `openspec/specs/`，變更提案位於 `openspec/changes/`。

## 何時使用 `$spectra-*` 技能：

- 動工前需要有結構的討論 → `$spectra-discuss`
- 使用者想規劃、提案或設計變更 → `$spectra-propose`
- 任務已可實作 → `$spectra-apply`
- 有進行中的變更要繼續推進 → `$spectra-ingest`
- 使用者詢問規格或某項功能如何運作 → `$spectra-ask`
- 實作完成 → `$spectra-archive`
- 只提交與特定變更相關的檔案 → `$spectra-commit`

## 工作流程

discuss? → propose → apply ⇄ ingest → archive

- `discuss` 為選用 — 若需求已明確可略過
- 工作中途需求變更？`ingest` → 回到 `apply` 繼續

## 暫存的變更（Parked Changes）

變更可以被暫存（park）— 暫時從 `openspec/changes/` 中移出。暫存的變更不會出現在 `spectra list` 中，但可用 `spectra list --parked` 找到。若要還原：`spectra unpark <name>`。`$spectra-apply` 與 `$spectra-ingest` 技能會自動處理暫存的變更。

<!-- SPECTRA:END -->

## 一般行為準則
- 變更前一律先說明計畫。
- 每完成一個有意義的步驟就回報進度。
- 結束前彙整變更的檔案與測試結果。
- 以繁體中文回覆。
- 所有新增或修改的中文內容（包含 commit message、規格文件與對外說明）都必須以 UTF-8 正確保存與提交，不得出現亂碼、問號替代字元，或讓 BOM 汙染可見文字。

<!-- ## 規格工作流程 -->

## 檔案存取限制
- 不得讀取或修改 `_private/_private_notes/筆記.txt`。
- 除非明確要求，否則忽略個人筆記與學習資料。
- 受限版本資料夾名稱：`done`。
<!-- - 受限版本資料夾名稱：`done`、`v11`。 -->
- 在 `_private/_private_notes/` 內，凡是名稱符合受限版本資料夾名稱的資料夾，及其底下任何檔案（不論巢狀深度），皆不得讀取或修改。
- 在 `_private/_private_fileAssets/` 內，凡是名稱符合受限版本資料夾名稱的資料夾，及其底下任何檔案（不論巢狀深度），皆不得讀取或修改。
