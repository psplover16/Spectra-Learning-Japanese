# 單字測驗後續調整討論結論

## 來源與範圍

本文件只根據 `_private/discuss.txt` 的內容整理，作為下一步 `$spectra-propose` 的唯一提案輸入。

## 建議變更名稱

`vocabulary-quiz-followup-adjustments`

## 背景

剛完成的單字測驗與註記流程需要依使用者回饋做後續調整。這次調整聚焦於單字測驗版面、移除未需求的提示、註記儲存語意改成「只影響目前頁面可見單字」，以及單字表排序方向。

## 決策摘要

1. 單字測驗 modal 的題目與答案間距要改為 `0.5rem`。
2. 單字測驗答案區 `.exam-modal-answer-multiline` 要使用 flex，並讓答案內容在該容器內水平、垂直置中。
3. 上述 modal 版面調整不得影響子路由「字母練習」。
4. 移除「尚未儲存」提示，因為這不是需求。
5. 「儲存註記」只能合併目前頁面可見單字的勾選狀態，不可影響目前不可見的已儲存註記。
6. table header 最右側清除 checkbox 不應再刪除全部註記，應改成只清除目前頁面可見單字的註記。
7. 單字表排序要改成較簡單級別在前：N5、N4、N3、N2、N1。

## 需求細節

### 單字測驗 modal 版面

- 單字測驗的題目與答案之間的間距要是 `0.5rem`。
- 單字測驗多行答案容器 `.exam-modal-answer-multiline` 要使用 flex。
- `.exam-modal-answer-multiline` 內的答案文字要在容器內水平置中與垂直置中。
- 多行答案仍要保留換行顯示。
- 不可以改到「字母練習」子路由的測驗 modal 預設版面。

### 移除未儲存提示

- 不顯示「尚未儲存」或同等語意的提示。
- 單字測驗結算後若 draft mark 有變化，畫面也不應出現這個提示。

### 儲存註記改成只影響目前頁面可見單字

「儲存註記」的語意要從「用目前 draft 覆蓋整份 localStorage」改為「只把目前頁面可見單字的勾選狀態合併進 localStorage」。

合併規則：

- 目前頁面可見且已勾選的單字，要寫入 localStorage。
- 目前頁面可見但未勾選的單字，要從 localStorage 移除。
- 目前頁面不可見的單字，不論是否已存在 localStorage，都不得被這次儲存影響。
- 搜尋、JLPT stage 篩選、只顯示註記、練習模式等造成的可見範圍，都應被視為「目前頁面可見單字」的範圍。

具體範例：

- GIVEN：N1 的 A 單字已勾選，N5 的 B 單字也已勾選。
- AND：目前頁面只顯示 A 單字。
- WHEN：使用者按下「儲存註記」。
- THEN：localStorage 只能根據 A 的目前勾選狀態更新。
- AND：B 在 localStorage 中的狀態保持不變。

具體範例：

- GIVEN：A 與 B 都已存在 localStorage。
- AND：目前頁面只顯示 A。
- WHEN：使用者取消 A 的勾選並按下「儲存註記」。
- THEN：localStorage 移除 A。
- AND：localStorage 仍保留 B。

### table header 清除 checkbox 改成只清除目前頁面

目前 table header 最右邊的 checkbox 會跳出刪除全部註記，而且實際刪除全部註記。這需要調整。

新語意：

- table header 最右側清除 checkbox 只能清除目前頁面可見單字的註記。
- 目前頁面不可見的已儲存註記必須保留。
- 若仍保留確認視窗，確認文字也要避免說「全部註記」，應明確指向「目前頁面」或「目前顯示的單字」。

具體範例：

- GIVEN：A 與 B 都已存在 localStorage。
- AND：目前頁面只顯示 A。
- WHEN：使用者按下 table header 最右側清除 checkbox 並確認。
- THEN：localStorage 移除 A。
- AND：localStorage 仍保留 B。

### 單字排序

單字表排序要讓 N5 在最前面，接著 N4、N3、N2，最後 N1。

具體範例：

- GIVEN：資料中有 N5、N4、N3、N2、N1 單字。
- WHEN：全部 JLPT level 都被選取且沒有其他排序條件。
- THEN：表格先顯示 N5，再顯示 N4、N3、N2，最後顯示 N1。

## 非目標

- 不重新設計字母練習測驗 modal。
- 不新增「尚未儲存」提示的替代 UI。
- 不讓單字測驗自動持久化註記。
- 不改 localStorage schema，除非實作時證明既有 schema 無法支援目前頁面範圍合併。

## 需要特別保護的回歸

- 字母練習的 ExamModal 預設大題目、提示文字、答案顯示與操作流程不應改變。
- 單字測驗多行答案要維持換行，且不能造成手機寬度水平 overflow。
- 搜尋或 stage 篩選後儲存註記，不可刪除不可見單字的既有 localStorage 註記。
- table header 清除 checkbox 不可刪除不可見單字的既有 localStorage 註記。

## 已確認事項

- 單字排序方向已確認為 `N5 → N4 → N3 → N2 → N1`。
