## 1. 規範來源與盤點

- [ ] 1.1 Constitution Source：讀取 `openspec/config.yaml` 並整理本變更適用的規範清單；完成定義：清單包含規則來源、適用範圍與不適用原因。
- [ ] 1.2 Constitution Source：依規範清單界定 governed project code 的檢查範圍；完成定義：範圍明確列出 source、test、script、configuration 是否納入。

## 2. 程式碼對齊與衝突處理

- [ ] 2.1 Governed Code Alignment：依規範清單稽核受管轄程式碼；完成定義：每個確認違規項目都有檔案位置、違規規則與預計修正方式。
- [ ] 2.2 Governed Code Alignment：以最小必要變更修正已確認違規；完成定義：修正後既有行為保持不變，除非該項目被記錄為衝突。
- [ ] 2.3 Conflict Handling：記錄無法直接修正的規範衝突或語意不明項目；完成定義：每個衝突包含規範、受影響行為、暫不修改原因與後續處理建議。

## 3. 驗證與收尾

- [ ] 3.1 Compliance Verification：對完成的修正執行相關既有測試或驗證命令；完成定義：記錄命令、結果，以及無法執行時的失敗原因與殘餘風險。
- [ ] 3.2 Compliance Verification：檢查新增或修改的中文內容為 UTF-8 且沒有亂碼、問號替代字元或可見 BOM；完成定義：成果檔可正確讀回且未出現替代字元。
- [ ] 3.3 Conflict Handling：確認本變更未修改 `openspec/config.yaml` 且未新增無關產品功能；完成定義：最終變更清單只包含規範對齊、驗證或衝突紀錄相關檔案。
