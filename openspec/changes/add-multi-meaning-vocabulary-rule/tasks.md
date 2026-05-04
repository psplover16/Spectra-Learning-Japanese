## 1. 既有違規盤點

- [ ] 1.1 用既有 `scripts/vocabulary/checkVocabularyMeaningFormat.mjs` 對 `src/modules/vocabulary/data/jpWords.ts` 跑一次 dry-run，列出所有 `kanji` 含 `\n` 或 `meaning` 含 `\n` 的多義 entry，記下哪些違反新「meaning >= kanji 段數 + 無漢字義放尾端 + 無空 placeholder」規則。完成定義：產生一份違規清單（可寫到 `_private/` 暫存檔或直接列在 PR 描述）並列出每筆 entry 的 `text + kanji` 鍵與當前 `kanji` / `meaning` 內容。

## 2. 擴充 checker（TDD：先測試後實作）

- [ ] 2.1 [P] 在 `tests/unit/vocabularyMeaningFormat.spec.ts` 新增失敗測試：當 entry 的 `kanji` 段數 > `meaning` 段數時 checker 必須 fail（對應 requirement「Vocabulary kanji lines align with meaning lines」）。完成定義：測試先 red。
- [ ] 2.2 [P] 在 `tests/unit/vocabularyMeaningFormat.spec.ts` 新增失敗測試：當無漢字義（meaning 對應的 kanji 段為空或 index 超出 kanji 段數）出現在 meaning 中段而非尾端時 checker 必須 fail（對應 requirement「Vocabulary kanji lines align with meaning lines」）。完成定義：測試先 red。
- [ ] 2.3 [P] 在 `tests/unit/vocabularyMeaningFormat.spec.ts` 新增失敗測試：當 `kanji` 含空字串 placeholder 行（如 `"例一\n\n例三"`）時 checker 必須 fail（對應 requirement「Vocabulary kanji lines align with meaning lines」）。完成定義：測試先 red。
- [ ] 2.4 [P] 在 `tests/unit/vocabularyMeaningFormat.spec.ts` 新增失敗測試：當資料集中存在兩筆 entry 具有完全相同的 `text + kanji` 字串時 checker 必須 fail 並回報兩筆 entry（對應 requirement「Vocabulary entries are uniquely identified by text plus kanji」）。完成定義：測試先 red；同時涵蓋 `あつい/暑い` vs `あつい/熱い` 同音異字應 pass 的反向案例。
- [ ] 2.5 修改 `scripts/vocabulary/checkVocabularyMeaningFormat.mjs`：把舊的「kanji 與 meaning 行數 1:1」檢查替換為新規則（meaning 段數 >= kanji 段數、無漢字義必須在尾端、kanji 不可含空 placeholder 行），並新增 `text + kanji` 重複偵測邏輯，把上述四項納入失敗條件，使 requirement「Vocabulary meaning format is automatically checked」覆蓋本次新規則。完成定義：2.1–2.4 的測試全部由 red 轉 green，且既有測試不破。
- [ ] 2.6 同步更新 `scripts/vocabulary/checkVocabularyMeaningFormat.d.mts` 型別宣告（若有新增匯出函式）。完成定義：`tsc --noEmit` 通過。

## 3. 修正既有違規條目

- [ ] 3.1 依 1.1 清單逐筆修正 `src/modules/vocabulary/data/jpWords.ts` 中違規 entry：把無漢字義搬到 `meaning` 尾端、移除 `kanji` 內空字串 placeholder 行、保留段順序對齊（kanji-bearing 段在前、kanji-less 段在後）。完成定義：每筆 entry 的最終值符合 requirement「Vocabulary kanji lines align with meaning lines」。
- [ ] 3.2 重跑 `scripts/vocabulary/checkVocabularyMeaningFormat.mjs`，確認 0 violation。完成定義：checker 結束碼為 0。
- [ ] 3.3 重跑 `vitest run tests/unit/vocabularyMeaningFormat.spec.ts tests/unit/vocabularyData.spec.ts`，確認既有資料測試仍通過。完成定義：兩支測試 all green。

## 4. 新增 から entry

- [ ] 4.1 依 requirement「New vocabulary entries are appended to their stage section」append `から` entry 到 `src/modules/vocabulary/data/jpWords.ts` 中 N5 區段的最後一筆之後（`text: "から"`、`romanization: "ka-ra"`、`kanji: "殻\n空"`、`meaning: "外殼\n空(無內容)\n從～、因為～；助詞"`、`stage: "N5"`）；不得改動 N5 既有 entry 的順序。完成定義：jpWords.ts 中 N5 段最後一筆為 `から`。
- [ ] 4.2 在 `tests/unit/vocabularyData.spec.ts` 加一筆測試：N5 段中存在 `text === "から"` 的 entry，且其 `kanji.split('\n').length === 2`、`meaning.split('\n').length === 3`，且 `kanji` 不含空字串行。完成定義：測試 green。
- [ ] 4.3 重跑 `scripts/vocabulary/checkVocabularyMeaningFormat.mjs`，確認新增 entry 通過所有規則。完成定義：checker 結束碼為 0。

## 5. 端對端驗證

- [ ] 5.1 嘗試在本地暫時加入一筆與 `から` 完全相同 (`text + kanji` 都同) 的測試 entry，確認 checker fail；驗證後刪除該測試 entry。完成定義：手動驗證紀錄寫入 PR 描述。
- [ ] 5.2 啟動 dev server（`npm run dev`），手動到「單字練習 / N5」頁面確認 `から` 顯示為三段 meaning（含 `外殼` / `空(無內容)` / `從～、因為～；助詞`），且不會 console error。完成定義：截圖或文字紀錄附在 PR。
- [ ] 5.3 跑全套單元測試 `npm run test:unit`，確認所有 `vocabulary*` 測試通過。完成定義：CI 綠燈或本地 0 failure。
