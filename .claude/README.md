# `.claude/` 設定說明

此資料夾為 Claude Code 的專案層級設定，內容對應 [`settings.json`](settings.json)。

> ⚠️ Claude Code 的 settings.json **必須是純 JSON**，不支援 `//` 註解。
> 因此所有說明都集中在這份 README，請勿把註解寫回 settings.json。

---

## 規則優先順序

```
deny > ask > allow > defaultMode
```

`deny` 永遠勝出，連 `bypassPermissions` 都擋不掉。

---

## 1. `includeGitInstructions: false`

不要自動把 git 相關指引塞進 system prompt（節省 context 空間）。

---

## 2. `permissions.defaultMode: "bypassPermissions"`

最高權限模式，跳過所有工具呼叫提示。

> 💡 **注意**：VSCode 原生擴充版只暴露三種 UI 模式（`ask before edit` / `edit automatically` / `plan mode`），可能不會切到 `bypassPermissions`。
> 真正的 bypass 在 CLI 才能完整使用，VSCode 內建議搭配下方 `allow` 名單達成「幾乎不跳提示」效果。

---

## 3. `permissions.allow`（綠燈白名單）

預先放行的工具與命令，不會跳提示。本專案開放範圍**極寬**，分類整理如下：

### 內建工具

- `WebSearch`、`WebFetch`
- `Read(**/*)`、`Edit(**/*)`、`Write(**/*)`、`Glob(**/*)`、`Grep(**/*)` — 所有檔案皆可（敏感檔仍由 `deny` 擋）

### Bash — 檔案系統（讀取）

`ls`、`pwd`、`cat`、`head`、`tail`、`less`、`more`、`file`、`stat`、`wc`、`du`、`df`、`tree`、`realpath`、`readlink`、`basename`、`dirname`

### Bash — 檔案系統（寫入）

`cp`、`mv`、`mkdir`、`touch`、`ln`、`rm`、`rmdir`、`chmod`、`chown`

> ⚠️ `rm` 已開放，但災難級指令（`rm -rf /`、`rm -rf C:`、`rm -rf ~`）已在 deny 擋下。

### Bash — Shell 內建

`echo`、`printf`、`true`、`false`、`test`、`:`

### Bash — 環境/系統資訊

`env`、`export`、`set`、`unset`、`alias`、`history`、`uname`、`whoami`、`date`、`hostname`、`uptime`、`cal`、`which`、`where`、`type`、`command`

### Bash — 程序管理

`ps`、`top`、`htop`、`jobs`、`bg`、`fg`

### Bash — 文字處理

`grep`、`egrep`、`fgrep`、`sed`、`awk`、`sort`、`uniq`、`cut`、`tr`、`tee`、`xargs`、`jq`、`yq`、`diff`、`comm`、`paste`、`join`

### Bash — 搜尋

`find`、`fd`、`rg`、`ag`、`locate`

### Bash — 壓縮/解壓

`tar`、`zip`、`unzip`、`gzip`、`gunzip`、`bzip2`、`7z`

### Bash — 網路

`curl`、`wget`、`ping`、`nslookup`、`dig`、`host`、`traceroute`、`netstat`、`ss`、`ip`、`ifconfig`

### Bash — Git

`git:*`（全部子指令）、`gh:*`（GitHub CLI）

### Bash — Node 生態

- 執行：`node`、`npm`、`npx`、`pnpm`、`yarn`、`bun`、`deno`
- TypeScript：`tsc`、`ts-node`
- 框架：`vite`、`vue`、`vue-cli-service`、`nuxt`、`next`、`astro`、`remix`、`svelte`、`svelte-kit`
- 測試：`vitest`、`jest`、`mocha`、`playwright`、`cypress`
- 格式化：`prettier`、`eslint`、`stylelint`
- 打包：`esbuild`、`rollup`、`webpack`、`parcel`、`turbo`

### Bash — Python 生態

`python`、`python3`、`pip`、`pip3`、`poetry`、`uv`、`pytest`、`ruff`、`black`、`mypy`

### Bash — 其他語言

`cargo`、`rustc`、`rustup`、`go`、`java`、`javac`、`mvn`、`gradle`、`make`、`cmake`

### Bash — Docker（唯讀為主）

`docker ps`、`docker images`、`docker logs`、`docker inspect`、`docker exec`、`docker compose`、`docker-compose`

> ⚠️ 為安全起見，未開放 `docker run`、`docker rm`、`docker rmi` 的萬用允許。

### Bash — 專案工具

`spectra:*`

### Bash — Windows Shell

`pwsh`、`powershell`

---

## 4. `permissions.deny`（紅燈，永遠擋）

即使在 `bypassPermissions` 模式仍會被擋下。

### 受保護檔案類別

| 類別 | 規則 |
|---|---|
| **SSH 金鑰** | `**/.ssh/**`、`id_rsa*`、`id_ed25519*` |
| **環境變數** | `.env`、`.env.local`、`.env.production` 等 |
| **私鑰/憑證** | `*.pem`、`*.key` |
| **雲端憑證** | `.aws/**`、`credentials` |
| **GPG 金鑰** | `.gnupg/**` |
| **權限設定檔** | `permissions`、`permission`、`permissions.json` |

每類都對 `Read` / `Edit` / `Write` 三種操作分別設置，徹底封死。

### Bash 繞過防線

- `cat *.env*`、`type *.env*` — 防止偷讀 `.env`
- `cat *id_rsa*`、`cat *.pem`、`cat *.key` — 防止偷讀私鑰

### 災難級指令封鎖

- `rm -rf /:*`、`rm -rf C:*`、`rm -rf ~:*`、`rm -rf /*`
- `format:*`、`dd if=*`、`mkfs:*`
- `shutdown:*`、`reboot:*`

---

## 5. `additionalDirectories`

允許 Claude 存取的額外目錄，重啟後仍生效。
目前已開放整顆 `C:\`、`D:\`、`E:\`，敏感檔仍受 `deny` 規則保護。

---

## 修改規則的注意事項

- **不可加 `//` 或 `/* */` 註解** → 會讓 Claude Code 解析失敗，所有設定一併失效
- **glob 規則**：`**` 表任何層深、`*` 表單一層級的任意字元
- **路徑分隔符**：Windows 路徑寫雙反斜線 `C:\\`，正斜線通常也接受
- **Bash 規則語法**：`Bash(cmd:*)` 表示 `cmd` 加任意參數；`Bash(cmd)` 表示精確匹配
- 改完後**完全關閉再開啟 Claude Code**，設定才會重新載入
