## Context

現行 src/modules/vocabulary/data/jpWords.ts 約 1086 筆 RawVocabularyEntry。使用者指出 meaning 欄位存在系統性問題：例如 働く 寫成「工作；運作(五段動詞)」，あげる 作為一段動詞卻完全沒有詞性標註。初步掃描顯示至少 1 筆分號掛尾詞性、1 筆多行部分漏標、113 筆る結尾且未標詞性候選；其中包含名詞誤判，因此不能直接用字尾規則覆寫。新的要求是盡量減少人工確認，最好不需人工確認，並以 JMdict 對照為優先來源。

本 change 只處理產品內建字典資料。localStorage、IndexedDB、Pinia store 都不參與；字典仍由 PWA bundle 離線提供。

## Goals / Non-Goals

**Goals:**

- 讓所有 vocabulary meaning 的多義詞格式一致。
- 動詞與形容詞義項每一行都帶正確詞性標註。
- 以 JMdict POS code 自動判定詞性，JMdict 唯一命中時不得要求人工確認。
- 將人工確認降到例外路徑；實作完成時 unresolved 詞條目標為 0。
- 補上已知漏標的 あげる、たべる、みる 等一段動詞候選，並修正 働く 的第二義為「起作用」。
- 建立自動化檢查，阻止分號掛尾詞性、多行部分漏標、半形括號詞性標註再次進入字典。

**Non-Goals:**

- 不翻譯或整理 _private CSV。
- 不把 JMdict 原始資料提交進 repo；若使用 _private/_tools/jmdict/ 作為 lookup 來源，該資料仍維持私有。
- 不以字尾規則自動認定所有候選詞性；不確定者必須先嘗試 JMdict fallback 與資料對齊，只有仍無法自動判定時才列入 unresolved allowlist。

## Decisions

### 以全量掃描清單驅動資料修正

先用測試掃描所有 rawVocabularyEntries，再修正資料，避免只處理使用者點名的單字。掃描規則至少涵蓋：分號加單一詞性標註、多行 meaning 中部分行有詞性部分行沒有、半形括號詞性標註、JMdict 可判定動詞或形容詞卻缺少詞性標註。

替代方案：只修 働く 與 あげる。淘汰原因是使用者需求明確是全部字典檔，單筆修補會繼續漏掉同型錯誤。

### 以 JMdict lookup 作為優先詞性來源

建立 scripts/vocabulary/checkVocabularyMeaningFormat.mjs，讀取 rawVocabularyEntries 與本機 JMdict 資料，依 text/kanji 對照 JMdict entries。JMdict POS code 映射如下：adj-i → い形容詞、adj-na → な形容詞、v1 → 一段動詞、v5* → 五段動詞。當 JMdict 只得到一個可用詞性結果時，自動採用該結果並讓測試檢查 meaning 標註；不得把這類詞條丟給人工確認。

替代方案：人工逐筆確認所有疑似動詞/形容詞。淘汰原因是使用者明確要求盡量不要人工確認，且 JMdict 已能提供大多數詞條的詞性依據。

### 詞性標註採每義項一行

多義詞使用換行分隔，每個動詞或形容詞義項都各自附上全形括號詞性。例如 働く 必須是「工作（五段動詞）\n起作用（五段動詞）」。這讓 UI 目前直接顯示 meaning 時也能讀得清楚，不需要新增 rendering 邏輯。

替代方案：把詞性獨立成新欄位。淘汰原因是本 change 只治理現有資料格式；資料模型拆欄會影響更多 UI 與後續 CSV 合併設計。

### 自動化檢查只阻止可確定錯誤

測試不靠字尾規則直接判定所有詞性，因為 よる、ひる、すきる 等候選可能是名詞或資料本身異常。測試使用 JMdict lookup 保護可自動判定的動詞/形容詞，並對格式錯誤模式做全量禁止。JMdict 未命中、多 POS 衝突、或 text/kanji 對不上時才進 unresolved report；apply 完成前必須讓 unresolved report 為空，或以明確 allowlist 記錄原因。

## Risks / Trade-offs

- [Risk] JMdict 本機資料不存在或格式不一致 → Mitigation：腳本先檢查 _private/_tools/jmdict/ 是否可讀；不可讀時 fail 並提示準備 JMdict 資料，不退回人工全量確認。
- [Risk] 字尾規則誤判名詞為動詞 → Mitigation：字尾候選清單只作 sanity check，詞性以 JMdict lookup 為優先。
- [Risk] 一次修改大量 meaning 造成教材翻譯錯誤 → Mitigation：詞性標註自動依 JMdict；中文翻譯本身只修可確定錯誤，未校驗翻譯不在本 change 中批量改寫。
- [Risk] UI 直接顯示換行可能不如預期 → Mitigation：現有 meaning 已有換行資料；變更後以現有 smoke/unit test 驗證不破版。

## Migration Plan

1. 新增 JMdict lookup 腳本與 vocabularyMeaningFormat 測試，先讓現有資料失敗。
2. 以 JMdict 自動產生可判定詞條的詞性期望與 unresolved report。
3. 修正 jpWords.ts 中 JMdict 可判定的漏標與格式錯誤，讓 unresolved report 歸零。
4. 執行 vocabulary data 測試、相關 component smoke、typecheck 與 build。
5. 若後續拆檔為 jpword_N*.ts，沿用同一測試規則掃描 src/modules/vocabulary/data 下所有字典 exports。

## Open Questions

- 無。此 change 先處理現行 src/modules/vocabulary/data 字典；_private CSV 翻譯仍留給 clean-private-csv。
