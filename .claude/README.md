# `.claude/` 設定說明

此資料夾為 Claude Code 的專案層級設定，內容對應 [`settings.json`](settings.json)。

> ⚠️ Claude Code 的 settings.json **必須是純 JSON**，不支援 `//` 註解。
> 因此所有說明都集中在這份 README，請勿把註解寫回 settings.json。

---

## `settings.json` 各區塊說明

### `includeGitInstructions: false`

不要自動把 git 相關指引塞進 system prompt（節省 context 空間）。

---

### `permissions.defaultMode: "bypassPermissions"`

**預設權限模式 = 最高權限**，跳過所有工具呼叫提示。等同 CLI 的 `--dangerously-skip-permissions`。

| 模式 | 行為 |
|---|---|
| `default` | 每次工具呼叫都要按確認 |
| `acceptEdits` | 自動允許檔案編輯，其他仍要按確認 |
| `plan` | 規劃模式，僅唯讀 |
| `bypassPermissions` | **目前設定**，全自動，最高自主權 |

執行時可按 **Shift + Tab** 即時切換模式。

---

### `permissions.deny`

**禁止規則（紅燈）**，即使在 `bypassPermissions` 模式仍會被擋下。
規則優先順序：**deny > ask > allow**。

#### 受保護的檔案類別

| 類別 | 規則 |
|---|---|
| **SSH 金鑰** | `**/.ssh/**`、`id_rsa*`、`id_ed25519*` |
| **環境變數** | `.env`、`.env.local`、`.env.production` 等 |
| **私鑰/憑證** | `*.pem`、`*.key` |
| **雲端憑證** | `.aws/**`、`credentials` |
| **GPG 金鑰** | `.gnupg/**` |
| **權限設定檔** | `permissions`、`permission`、`permissions.json` |

每類都對 `Read` / `Edit` / `Write` 三種操作分別設置，徹底封死讀寫。

#### Bash 繞過防線

- `Bash(cat *.env*)`、`Bash(type *.env*)` — 防止用終端機偷讀 `.env`
- `Bash(cat *id_rsa*)`、`Bash(cat *.pem)`、`Bash(cat *.key)` — 防止偷讀私鑰

#### 災難級指令封鎖

- `Bash(rm -rf /:*)`
- `Bash(rm -rf C:*)`
- `Bash(rm -rf ~:*)`

---

### `additionalDirectories`

允許 Claude 存取的額外目錄，重啟後仍生效。
目前已開放整顆 `C:\`、`D:\`、`E:\` 的讀寫權限——但敏感檔仍受 `deny` 規則保護。

---

## 修改規則時的注意事項

- **不要加 `//` 或 `/* */` 註解** → 會讓 Claude Code 解析失敗，所有設定一併失效
- **glob 規則**：`**` 表任何層深、`*` 表單一層級的任意字元
- **路徑分隔符**：Windows 路徑要寫雙反斜線 `C:\\`，正斜線通常也接受
- 改完後可在對話中按 **Shift + Tab** 確認底部仍顯示 `bypassPermissions`，代表設定有正確載入
