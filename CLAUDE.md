# 維護指南

hmgvibe 項目官網，純靜態 HTML／CSS／JS，無建置步驟。推送到 `main` 後由 GitHub Pages 自動發佈。
網站文字一律使用繁體中文（`zh-Hant`），英文只用於產品名、平台名與 `NEW` 這類小標籤；段落編號用等寬數字，不再加英文大寫小標。

## 簡體中文版（重要）

- 繁體頁面（`index.html`、`projects/*.html`）是唯一來源；`zh-hans/` 由腳本產生，**不要手動修改**。
- 每次改動繁體頁面後都要執行 `python3 tools/build-zh-hans.py`（需 `pip install opencc`），並一起提交 `zh-hans/`。
  提交前可用 `python3 tools/build-zh-hans.py --check` 確認已同步。
- 轉換用 OpenCC `tw2sp`（含大陸用語），漏轉或誤轉的詞加到腳本的 `PHRASES`。
- 新增項目頁時腳本會自動產生對應簡體頁；新頁面要有 hreflang 三行與 `.lang-switch` 連結（複製現有頁面即可）。
- `theme.js` 首次造訪會依瀏覽器語言自動跳轉一次，之後記住選擇；`theme.js`、`script.js` 裡的介面文字有繁簡兩份。

## 內容來源

- 項目資訊以 `https://github.com/hmgvibe/<Repo>` 的 README 與 Releases 為準，不自行推測功能。
- 下載按鈕固定連到 `releases/latest`，發新版通常不必改連結。
- `assets/*.svg` 是舊版的概念視覺，新版頁面已不使用；網站上的裝置是線稿，不要描述成截圖。

## 項目順序（目前 9 個）

ClassFlow → TouchWrite → Phnomy → Secondary → QRTrans → NextPhoto → CloudNotes（檔名 `cloudnote`）→ MPad → Beautiful Waste

上一個／下一個項目連結是循環的（最後一個接回第一個）。
新項目慣例放在第 2 位（ClassFlow 之後）。首頁工具的 `.tool-name` 加 `<span class="tool-new">NEW</span>`，並移除上一個新項目的 NEW。所有工具預設都不亮，只有懸停或聚焦時才亮。

## 更新現有項目（例如新版本）

1. 改 `projects/<name>.html`：`meta description`、`detail-intro`、功能、開始使用、系統需求、FAQ。
2. 若一句話、平台改變，同步改 `index.html` 的工具（`.tool-line`、`.tool-os`、`data-platforms`）。
3. 新增平台時：在 `index.html` 的篩選列加按鈕（數字由 `script.js` 自動計算）、更新 `meta description`。
4. 更新 `README.md` 的項目清單說明。

## 新增項目檢查清單

- `projects/<name>.html`：複製現有頁面為範本，設定 `--product-color`、canonical；開頭的 `.detail-visual` 換成這件工具的線稿。
- 線稿：首頁和詳細頁共用同一張內聯 SVG（裝置俯視線稿）。複製最接近的現有裝置（手機、筆電、螢幕），改螢幕內容即可；
  規則見下方「工具線稿」。
- `index.html`：在 `.tools` 加一個 `<li style="--i:N">`（`id`、`href`、`data-platforms`、`--pc` 產品色、線稿、編號、名稱、一句話、平台）；
  後面各項的 `--i` 與 `.tool-no` 編號、`#project-count` 與「全部」按鈕的預設數字、
  `meta description` 中的項目數量（中文數字）都要更新。平台按鈕的數字由腳本計算。
  首頁「關於這些工具」的紙條若提到具體工具（離線、Nextcloud），也一併確認。
- 每個 `projects/*.html`：側欄 `detail-sidebar` 清單、相鄰頁的上一個／下一個工具連結。
- 詳細頁「如何開始」結尾與「完整說明」連結列的「下載最新版本」都連到 `releases/latest`。
- `README.md`：項目數量與清單。
- 執行 `python3 tools/build-zh-hans.py` 產生簡體版。

## 工具線稿

- 1 個 viewBox 單位＝墊子格線 `--u` 的 1/10；`svg` 的 `style` 寫 `--w`（寬，格數）、`--h` 與 `view-transition-name:art-<name>`。
  首頁與詳細頁兩張線稿要用同一個名字，跨頁轉場才會接起來；詳細頁那張多加 `is-lit` class。
- class：`b` 機身、`s` 螢幕（亮屏時變色）、`p` 零件、`i` 螢幕上的線、`if` 螢幕上的實心、`a` 亮屏時填產品色、`faint` 變淡。
  亮屏時的小動作寫在 `styles.css` 的線稿區段。
- 顏色、字體、間距變數都在 `styles.css` 開頭；產品色只在亮屏時出現，不要拿來當版面底色。

## 快取版本

CSS／JS 以 `?v=N` 防快取（目前 `v=13`）。改了 `styles.css`、`detail.css`、`script.js` 或 `theme.js` 時，
把所有 HTML 中的 `v=N` 一起加 1。只改文字內容不必調整。

## 檢查

- 本機預覽：`python3 -m http.server 8000`
- 改完確認淺色／深色模式、手機寬度、平台篩選與詳細頁連結都正常。

## 功能分區

詳細頁的功能清單可用 `.feature-groups` 分區（範例：`projects/secondary.html` 的首頁／快捷導航／性能監控／特色功能）。
每區為 `section.feature-group`，項目標題用 `h4`，區內編號自動從 01 開始（分區本身不顯示編號）；新功能可加 `<span class="feature-new">vX.Y.Z 新增</span>`。

## 用語

全站統一叫「工具」：所有工具、其他工具、上一個／下一個工具。
