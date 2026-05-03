## Why

使用者要解決的是現行單字字典的 meaning 欄位格式不一致：多義詞常把詞性掛在整串最後，且あげる等動詞漏標詞性，會讓教材語意與文法資訊誤導初學者。現在必須全量處理所有 vocabulary 字典資料，而不是只修單筆例外。

## What Changes

- 全量審查 src/modules/vocabulary/data 內所有 RawVocabularyEntry.meaning。
- 以 JMdict 詞性資料作為優先權威來源，自動對照 vocabulary entry 的 text/kanji 並判定五段動詞、一段動詞、い形容詞、な形容詞等標註。
- 多義詞每個義項各自獨立成一行，且動詞/形容詞義項每行都標註詞性。
- 將半形括號標註統一成中文全形括號，例如 （五段動詞）、（一段動詞）。
- 修正已知錯誤：働く 改為工作（五段動詞）與起作用（五段動詞）；あげる 補一段動詞標註。
- 新增自動化檢查，避免 meaning 出現分號掛尾詞性、多行漏標、JMdict 可判定詞條漏標等問題。
- 人工確認只允許作為例外處理；JMdict 可唯一判定的詞條不得要求人工確認，最終 unresolved 目標為 0。

## Non-Goals

- 不進行英文 CSV 翻譯，不處理 _private/n1.csv 到 _private/n5.csv 的整批翻譯內容。
- 不拆分 jpWords.ts，不導入 displayId，不改 stage 分級。
- 不以未校驗的字尾猜測直接覆寫所有詞性；字尾規則只能作 sanity check，優先使用 JMdict 對照結果。

## Capabilities

### New Capabilities

- `vocabulary-meaning-pos-format`: 規範 vocabulary meaning 欄位的多義詞換行、詞性標註與自動化資料檢查。

### Modified Capabilities

(none)

## Impact

- Affected specs: vocabulary-meaning-pos-format
- Affected code:
  - Modified: src/modules/vocabulary/data/jpWords.ts
  - Modified: tests/unit/vocabularyData.spec.ts
  - New: tests/unit/vocabularyMeaningFormat.spec.ts
  - New: scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - Removed: none
- Offline data: 字典資料仍隨 PWA bundle 離線提供；不新增同步機制。衝突處理以測試與審查規則阻止格式不一致資料進入字典。
