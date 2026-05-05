## 1. 測試先行

- [x] [P] 1.1 為 Vocabulary quiz modal uses compact centered answer layout 補上失敗的 component 測試，覆蓋單字測驗 0.5rem 間距、多行答案 flex 置中、換行保留、手機寬度不 overflow，以及字母練習預設 modal 不變；完成定義：相關測試在實作前能捕捉目前不符合規格的行為。
- [x] [P] 1.2 為 Vocabulary quiz settlement does not show an unsaved hint 補上失敗的 component/smoke 測試，覆蓋 quiz settlement 改變 draft marks 後不顯示「尚未儲存」或同等提示，且不寫 localStorage；完成定義：測試能證明移除提示不是只改文字。
- [x] [P] 1.3 為 Saving vocabulary marks merges only visible entries 與 Table header clear removes only visible vocabulary marks 補上失敗的 session/component 測試，覆蓋 visible checked 寫入、visible unchecked 移除、hidden persisted mark 保留、確認文案不再宣稱全部註記；完成定義：搜尋、stage 篩選、mark-only 或練習模式造成的 hidden mark 都有保護案例。
- [x] [P] 1.4 為 Visible vocabulary is ordered from N5 to N1 補上失敗的排序測試，覆蓋全 stage 與部分 stage 選取，並確認 lazy-load 完成順序不影響 N5、N4、N3、N2、N1 顯示順序；完成定義：測試固定 stage 間排序且同 stage 內維持既有 normalized order。

## 2. 核心實作

- [x] 2.1 實作 Decision: Scope vocabulary quiz presentation through explicit modal props，讓單字測驗套用 compact spacing 與 multiline answer flex centering，並讓字母練習不傳入該選項時保留預設版面；完成定義：Vocabulary quiz modal uses compact centered answer layout 測試通過且 alphabet route 測試通過。
- [x] 2.2 移除未需求的未儲存提示 UI 與相關 copy，並保持單字測驗結算只更新 draft marks；完成定義：Vocabulary quiz settlement does not show an unsaved hint 測試通過，localStorage 寫入仍只發生在 save-marks action。
- [x] 2.3 實作 Decision: Treat visible vocabulary keys as the write boundary，將 save marks 改成以操作當下 visible row key snapshot 合併 persisted marks；完成定義：Saving vocabulary marks merges only visible entries 測試通過，hidden persisted keys 在所有篩選狀態下保留。
- [x] 2.4 實作 Decision: Preserve persisted hidden marks during table header clear，將 header clear scope 改成目前 visible row key snapshot，並更新確認文案；完成定義：Table header clear removes only visible vocabulary marks 測試通過，localStorage、persisted marks 與 draft marks 都只移除 visible keys。
- [x] 2.5 實作 Decision: Sort vocabulary by JLPT learning order，在單一 visible vocabulary filtering path 套用 N5、N4、N3、N2、N1 stage order；完成定義：Visible vocabulary is ordered from N5 to N1 測試通過，lazy loaded stage 的完成順序不影響畫面排序。

## 3. 驗證與文件

- [x] 3.1 檢查 PROJECT_ARCHITECTURE.md 是否需要同步 useVocabularySession、ExamModal 或 vocabulary component ownership 文字；完成定義：若架構敘述受影響則已更新，若未受影響則在實作紀錄中說明不需更新。
- [x] 3.2 執行相關 unit/component/e2e 測試與 production build，至少覆蓋 ExamModal、VocabularyControlBar、VocabularyStageTable、VocabularyViewSmoke、useVocabularySession、vocabularyData 與 vocabulary-word-practice；完成定義：所有指定測試與 build 通過，或列出失敗原因與修正結果。
- [x] 3.3 在手機尺寸模擬與離線模式下手動驗證單字測驗 modal、save marks、header clear 與 N5 到 N1 排序；完成定義：離線操作無 console error、無水平 overflow，且 hidden persisted marks 未被可見範圍操作誤刪。
