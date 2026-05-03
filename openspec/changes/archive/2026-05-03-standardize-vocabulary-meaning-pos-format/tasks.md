## 1. 測試先行

- [x] 1.1 在 tests/unit/vocabularyMeaningFormat.spec.ts 新增失敗測試，覆蓋 Vocabulary meanings use per-sense lines、Vocabulary part-of-speech markers use full-width parentheses 與「詞性標註採每義項一行」：以 働く、帰る/変える 的 expected meaning 作為 fixture；完成定義：現有資料會因分號掛尾詞性、多行漏標或半形括號標註而失敗。
- [x] 1.2 在 scripts/vocabulary/checkVocabularyMeaningFormat.mjs 與 tests/unit/vocabularyMeaningFormat.spec.ts 新增失敗測試，覆蓋 JMdict is the primary part-of-speech source 與「以 JMdict lookup 作為優先詞性來源」：JMdict v1/v5*/adj-i/adj-na 自動映射到專案詞性，JMdict 唯一命中者不得進人工確認；完成定義：あげる N5、あげる N3 等 JMdict 可判定詞條漏標時，測試輸出具體 text、kanji、stage、JMdict POS。
- [x] 1.3 在 tests/unit/vocabularyMeaningFormat.spec.ts 新增全量格式掃描測試，覆蓋 Vocabulary meaning format is automatically checked、「以全量掃描清單驅動資料修正」與「自動化檢查只阻止可確定錯誤」：掃描 src/modules/vocabulary/data 匯出的所有 raw vocabulary entries，並要求 unresolved JMdict report 為空或具備明確 allowlist reason；完成定義：測試涵蓋所有現行 RawVocabularyEntry.meaning，不只單筆 fixture。

## 2. 字典資料修正

- [x] 2.1 更新 src/modules/vocabulary/data/jpWords.ts 中確定格式錯誤的 meaning，落實 Vocabulary meanings use per-sense lines：分號掛尾詞性改成每義項一行，多行中漏標的動詞/形容詞行補上對應詞性；完成定義：働く 為 工作（五段動詞）\n起作用（五段動詞），帰る/変える 為 回家（五段動詞）\n改變（一段動詞）。
- [x] 2.2 更新 src/modules/vocabulary/data/jpWords.ts 中 JMdict 可唯一判定的動詞與形容詞漏標，落實 Confirmed verbs and adjectives include part-of-speech markers 與 JMdict is the primary part-of-speech source：あげる N5 每行標註一段動詞，あげる N3 標註一段動詞與他動詞，其他 JMdict 唯一命中詞條自動套用；完成定義：JMdict 可判定詞條不需要人工確認且 unresolved report 為空。
- [x] 2.3 統一 src/modules/vocabulary/data/jpWords.ts 的詞性括號格式，落實 Vocabulary part-of-speech markers use full-width parentheses；完成定義：字典 meaning 不再包含半形詞性標註如 (五段動詞)、(一段動詞)、(い形容詞)、(な形容詞)。

## 3. 驗證

- [x] 3.1 執行 vocabularyMeaningFormat 與 vocabularyData 相關 Vitest，確認 Vocabulary meaning format is automatically checked 的全量掃描通過；完成定義：新增測試與既有 vocabularyData 測試全數通過。
- [x] 3.2 執行 npm run typecheck 與 npm run build，確認字典資料格式變更不造成 TypeScript 或 bundle regression；完成定義：typecheck 成功，build 成功且無新增依賴。
- [x] 3.3 檢查 openspec/changes/standardize-vocabulary-meaning-pos-format 的 proposal、design、specs、tasks 與實作結果一致；完成定義：spectra analyze 無 Critical/Warning，spectra validate 通過。

## 4. kanji/meaning 對齊與可讀性追加

- [x] 4.1 在 tests/unit/vocabularyMeaningFormat.spec.ts 補失敗測試，覆蓋 Vocabulary kanji lines align with meaning lines、Vocabulary meaning labels are concise and learner-readable、「kanji 與 meaning 逐行對齊」與「中文 meaning 採短句語境化」：以 あげる expected kanji/meaning 作為 fixture，並要求全量資料的 kanji 行數與 meaning 行數一致；完成定義：舊資料會因 あげる 行數不一致、缺少 揚げる／油炸 或保留 提出（一段動詞）而失敗。
- [x] 4.2 更新 scripts/vocabulary/checkVocabularyMeaningFormat.mjs 與 src/modules/vocabulary/data/jpWords.ts，落實 Vocabulary kanji lines align with meaning lines 與 Vocabulary meaning labels are concise and learner-readable：checker 保留空白 kanji 行但禁止行數錯位，あげる 改成 上げる／給、上げる／舉起、挙げる／列舉／舉例、揚げる／油炸，並修正全量資料中所有 kanji/meaning 行數不一致項目；完成定義：全量掃描沒有 alignment diagnostics。
- [x] 4.3 執行 vocabularyMeaningFormat、vocabularyData、vocabularyGodanVerbMarkers、vocabularyNaAdjectiveMarkers 相關 Vitest，並執行 npm run typecheck、npm run build、spectra analyze、spectra validate；完成定義：所有驗證通過，Spectra apply 顯示 all_done。

## 5. adj-no／の形容詞追加

- [x] 5.1 在 tests/unit/vocabularyMeaningFormat.spec.ts 補失敗測試，覆蓋 Confirmed verbs and adjectives include part-of-speech markers、JMdict is the primary part-of-speech source 與「JMdict adj-no 標為 の形容詞」：fixture 加入 生／なま 的 `adj-no`，並要求 なま meaning 為 生的／未煮熟的／新鮮的（の形容詞）；完成定義：現有資料會因 なま 漏標 の形容詞而失敗。
- [x] 5.2 更新 scripts/vocabulary/checkVocabularyMeaningFormat.mjs、型別宣告與 src/modules/vocabulary/data/jpWords.ts，落實 `adj-no` → の形容詞：checker 自動映射 JMdict `adj-no`，半形/全形 marker 檢查納入 の形容詞，なま 補上 の形容詞；完成定義：vocabularyMeaningFormat 對 なま 不再回報 missing marker。
- [x] 5.3 執行 vocabularyMeaningFormat 與 vocabularyData 相關 Vitest，並執行 npm run typecheck、npm run build、spectra analyze、spectra validate；完成定義：所有驗證通過，Spectra apply 顯示 all_done。
