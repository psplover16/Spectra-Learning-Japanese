# Constitution Compliance Report

## 1.1 規範清單

本變更以 `openspec/config.yaml` 為唯一憲法來源。以下規則依檔案內「核心原則」「技術棧」「架構慣例」「語言與編碼」「存取限制」整理。

| 規則來源 | 適用範圍 | 本變更適用性與不適用原因 |
| --- | --- | --- |
| 倉儲衛生 | `.gitignore`、build/test 輸出、`PROJECT_ARCHITECTURE.md` | 適用。需確認必要 ignore 規則存在；若本變更調整 `src/` 結構，必須同步更新架構文件。 |
| 測試補強 | bug fix、主要路由、高風險互動元件、空/error/loading/placeholder 狀態 | 適用於驗證策略。本變更若修正產品行為，需先補測試；若只修正文件或設定，記錄可執行驗證命令。 |
| UX 一致性 | `src/modules/**`、`src/shared/**` 的 UI 行為與狀態 | 適用於稽核。若發現 loading/empty/error/success 狀態處理違規，才進入最小修正。 |
| 規格回寫 | `openspec/specs/**` | 適用於行為差異。本變更不主動變更產品行為；若修正造成 spec 不一致，需同一工作項回寫。 |
| 範圍與復用邊界 | feature ownership、shared state、shared UI、task ownership | 適用於 `src/modules/**` 與 `src/shared/**`。檢查是否有明顯違反功能分組或共用 UI 濫用。 |
| 簡潔與驗證 | 所有本變更修改 | 適用。任何修正採最小可行解，並在本報告記錄驗證證據。 |
| 效能感知 | `vite.config.ts`、新增依賴、離線儲存、build chunk | 適用於稽核。若本變更新增依賴需查 bundlephobia；目前未規劃新增依賴。 |
| 技術棧與架構慣例 | `src/**/*.vue`、`src/**/*.ts`、`tests/**/*.ts`、設定與工具腳本 | 適用。檢查 TypeScript、Vue `<script setup lang="ts">`、命名、縮排、字串與功能分組。 |
| 語言與編碼 | commit 訊息、規格、提案、對外說明、中文文件 | 適用。所有新增或修改中文內容須為 UTF-8，無亂碼、問號替代字元或可見 BOM。 |
| 存取限制 | `_private/_private_notes/**`、`_private/_private_fileAssets/**` | 適用。不得讀取或修改指定私人筆記與 `done` 受限資料夾；本次搜尋與讀檔排除 `_private/**`。 |

## 1.2 Governed Project Code 範圍

| 類別 | 納入範圍 | 判定 |
| --- | --- | --- |
| source | `src/**`、`public/**`、`index.html` | 納入。產品邏輯、畫面、PWA 公開資產與入口 HTML 都受憲法規範。 |
| test | `tests/**`、`vitest.config.ts`、`playwright.config.ts` | 納入。測試覆蓋、smoke test 與驗證命令均受規範。 |
| script | `scripts/**`、`.github/workflows/**` | 納入。部署腳本與 CI/CD 工作流程影響驗證與發布安全。 |
| configuration | `.spectra.yaml`、`.gitignore`、`package.json`、`tsconfig*.json`、`vite.config.ts`、`tailwind.config.ts`、`postcss.config.js`、`eslint.config.js`、`AGENTS.md`、`CLAUDE.md`、`openspec/config.yaml` | 納入。設定會直接影響建置、測試、agent 行為與規格流程。 |
| specs and docs | `openspec/specs/**`、`openspec/changes/align-with-constitution/**`、`README.md`、`PROJECT_ARCHITECTURE.md`、`docs/**`、`constitution.md` | 納入文件與規格一致性檢查。封存 change 僅作歷史資料，不作本次修正目標。 |
| excluded | `_private/**`、`node_modules/**`、`dist/**`、`build/**`、`coverage/**`、`test-results/**`、`playwright-report/**`、`.git/**` | 不納入。原因分別是存取限制、第三方依賴、產物輸出或 Git 內部資料。 |

## 2.1 稽核結果

| ID | 檔案位置 | 違規規則 | 稽核結果 | 預計修正方式 |
| --- | --- | --- | --- | --- |
| V-001 | `PROJECT_ARCHITECTURE.md` | 倉儲衛生：`PROJECT_ARCHITECTURE.md` 必須準確反映目前 repository 結構、主要目錄與重要檔案職責。 | 文件仍列出不存在或非現行主軸的 `.codex/`、`.specify/`、`specs/`，且未正確呈現目前的 `openspec/`、`.spectra/`、`constitution.md` 與 agent 指引結構。 | 以最小文件更新修正根目錄架構與規格/腳本角色段落，保持 `src/` 詳細架構不重寫。 |
| V-002 | `vite.config.ts` | 效能感知：vite build chunk 警戒線設為 500 KB。 | 目前未在專案 Vite 設定中明示 `chunkSizeWarningLimit: 500`，需避免依賴工具預設值作為憲法證據。 | 先新增一個會失敗的 unit test 驗證專案明示設定，再於 `vite.config.ts` 加入 `build.chunkSizeWarningLimit = 500`。 |
| V-003 | `src/app/router.ts` | 效能感知：超過 500 KB chunk 警戒線需處理。 | 明示 500 KB 警戒線後，`npm run build` 顯示主 chunk 為 525.86 kB 並觸發 Vite warning。主要 route view 以靜態 import 進入入口 chunk。 | 先新增 route lazy-load guardrail test，再將主要 route view 改為 dynamic import，讓 route-level chunks 分離。 |

已確認符合項目：

- `.gitignore` 已排除 `node_modules/`、`dist/`、`build/`、`coverage/`、`test-results/`、`playwright-report/`。
- `src/**/*.vue` 皆使用 `<script setup lang="ts">`。
- `src/**` 維持 `src/app/`、`src/modules/<feature>/...`、`src/shared/...` 的 feature-based 結構。
- `tsconfig.app.json` 啟用 `strict` 與多項嚴格檢查。
- `package.json` 已提供 `lint`、`typecheck`、`test:unit`、`build`、`test:e2e`、`test:ci` 驗證指令。
- `any` 的搜尋命中位於 Vitest/Jest matcher `expect.any`，不是 TypeScript `any` 型別使用。

## 2.2 修正紀錄

| ID | 修正內容 | 行為影響 |
| --- | --- | --- |
| V-001 | 更新 `PROJECT_ARCHITECTURE.md` 的根目錄架構，移除舊的 `.codex/`、`.specify/`、root `specs/` 描述，補上 `.claude/`、`.spectra/`、`openspec/`、`.spectra.yaml`、`CLAUDE.md`、`constitution.md`，並將「specs / .specify / scripts」段落改為「openspec / agents / scripts」。 | 文件修正，不改產品執行行為。 |
| V-002 | 新增 `tests/unit/constitutionCompliance.spec.ts` 鎖定架構文件與 Vite chunk budget；在 `vite.config.ts` 明示 `build.chunkSizeWarningLimit = 500`。 | 建置警戒線與憲法一致；未改變使用者可見功能。 |
| V-003 | `tests/unit/constitutionCompliance.spec.ts` 增加 route lazy-load 檢查；`src/app/router.ts` 將 `/practice`、`/grammar`、`/vocabulary`、`/n5-grammar` 的 view 改為 dynamic import。 | 路由行為保持不變；建置輸出改為 route-level chunks，入口 chunk 低於 500 KB 警戒線。 |

## 2.3 衝突紀錄

| ID | 規範 | 受影響行為 | 暫不修改原因 | 後續處理建議 |
| --- | --- | --- | --- | --- |
| C-001 | `openspec/config.yaml` 技術棧列出「狀態管理：Pinia」。 | 目前 `src/modules/practice/composables/usePracticeSession.ts`、`src/modules/exam/composables/useExamSession.ts`、`src/modules/vocabulary/composables/useVocabularySession.ts` 使用 composable 與 provide/inject 管理狀態，`package.json` 也未安裝 `pinia`。 | 直接導入 Pinia 會改變狀態管理架構、增加依賴、影響多個路由與測試，超出本次最小規範對齊範圍。現有行為未因本次修正變更。 | 另開變更決定要調整憲法技術棧描述，或規劃一個有測試保護的 Pinia 遷移。 |

## 3.1 驗證紀錄

| 命令 | 結果 | 備註 |
| --- | --- | --- |
| `npm ci` | 通過 | 安裝測試依賴；npm audit 摘要顯示既有依賴有 2 moderate、7 high vulnerabilities。本變更未調整 dependency tree，後續可另開依賴稽核變更。 |
| `npm run test:unit -- tests/unit/constitutionCompliance.spec.ts` | 通過 | 3 tests passed；曾先確認新增 guardrail tests 會因既有違規失敗，再修到通過。 |
| `npm run lint` | 通過 | ESLint 無錯誤。 |
| `npm run typecheck` | 通過 | `vue-tsc --noEmit -p tsconfig.app.json` 無錯誤。 |
| `npm run test:unit` | 通過 | 43 files / 142 tests passed。 |
| `npm run build` | 通過 | lazy-load 修正後無 500 KB chunk warning；最大 route chunk 約 134.70 kB，入口 chunk 約 111.91 kB。 |
| `npm run test:e2e -- tests/e2e/app-shell.smoke.spec.ts` | 通過 | 第一次使用預設 4173 與 4174 時撞到既有「SpekitApp Mini Game」server 而失敗；改用 `PLAYWRIGHT_PORT=42879` 後 2 tests passed。 |

## 3.2 UTF-8 檢查

以 PowerShell 對本變更新增/修改的成果檔執行嚴格 UTF-8 decode，並檢查 UTF-8 BOM、可見 BOM、U+FFFD replacement char 與常見 mojibake 標記。

檢查檔案：

- `openspec/changes/align-with-constitution/proposal.md`
- `openspec/changes/align-with-constitution/tasks.md`
- `openspec/changes/align-with-constitution/compliance-report.md`
- `PROJECT_ARCHITECTURE.md`
- `tests/unit/constitutionCompliance.spec.ts`
- `vite.config.ts`
- `src/app/router.ts`

結果：全部 `ValidUtf8 = True`，且 `Utf8Bom = False`、`ReplacementChar = False`、`VisibleBom = False`、`MojibakeMarker = False`。

## 3.3 最終範圍確認

確認結果：

- `git diff -- openspec/config.yaml` 無輸出，本變更未修改憲法來源檔。
- 本變更未新增產品功能；`src/app/router.ts` 僅將既有 route view 改為 dynamic import，維持相同路由與畫面。
- 本變更相關檔案只包含規範對齊、驗證與衝突紀錄：
  - `PROJECT_ARCHITECTURE.md`
  - `openspec/changes/align-with-constitution/proposal.md`
  - `openspec/changes/align-with-constitution/tasks.md`
  - `openspec/changes/align-with-constitution/compliance-report.md`
  - `tests/unit/constitutionCompliance.spec.ts`
  - `src/app/router.ts`
  - `vite.config.ts`
- 工作樹另有 `_private/` 下既有未納入修改；依專案存取限制，本變更未讀取、未修改、未納入該內容。
