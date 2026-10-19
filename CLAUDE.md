# 維護指南

hmgvibe 項目官網，純靜態 HTML／CSS／JS，無建置步驟。推送到 `main` 後由 GitHub Pages 自動發佈。
網站文字一律使用繁體中文（`zh-Hant`），英文只用於小型裝飾標籤（如 `FEATURES`、`CONCEPT VISUAL`）。

## 內容來源

- 項目資訊以 `https://github.com/hmgvibe/<Repo>` 的 README 與 Releases 為準，不自行推測功能。
- 下載按鈕固定連到 `releases/latest`，發新版通常不必改連結。
- `assets/*.svg` 是概念視覺，不是實際截圖；不要描述成截圖。

## 項目順序（目前 8 個）

ClassFlow → Phnomy → Secondary → QRTrans → NextPhoto → CloudNotes（檔名 `cloudnote`）→ MPad → Beautiful Waste

上一個／下一個項目連結是循環的（最後一個接回第一個）。

## 更新現有項目（例如新版本）

1. 改 `projects/<name>.html`：`meta description`、`detail-intro`、功能、開始使用、系統需求、FAQ。
2. 若摘要、平台改變，同步改 `index.html` 的卡片（`project-category`、`project-description`、`data-platforms`）。
3. 新增平台時：在 `index.html` 的篩選列加按鈕、更新 hero 的平台文字（`hero-note`）與 `meta description`。
4. 更新 `README.md` 的項目清單說明。

## 新增項目檢查清單

- `projects/<name>.html`：複製現有頁面為範本，設定 `--product-color`、canonical、`PROJECT NN / TT`。
- `assets/<name>.svg`：960×700，深色背景概念插圖，風格參考現有 SVG。
- `index.html`：新增卡片；所有卡片的 `art-index`（`NN / TT`）、篩選列總數、`project-count`、
  `hero-bottom` 的 `01 — TT`、`meta description` 中的項目數量（中文數字）都要更新。
- 每個 `projects/*.html`：`detail-kicker` 的 `PROJECT NN / TT`、`figcaption` 的 `NN — TT`、
  側欄 `detail-sidebar` 清單、相鄰頁的上一個／下一個連結。
- `README.md`：項目數量與清單。

## 快取版本

CSS／JS 以 `?v=N` 防快取（目前 `v=9`）。改了 `styles.css`、`detail.css`、`script.js` 或 `theme.js` 時，
把所有 HTML 中的 `v=N` 一起加 1。只改文字內容不必調整。

## 檢查

- 本機預覽：`python3 -m http.server 8000`
- 改完確認淺色／深色模式、手機寬度、平台篩選與詳細頁連結都正常。

## 功能分區

詳細頁的功能清單可用 `.feature-groups` 分區（範例：`projects/secondary.html` 的首頁／快捷導航／性能監控／特色功能）。
每區為 `section.feature-group`，項目標題用 `h4`，編號自動顯示為 `01.1`；新功能可加 `<span class="feature-new">vX.Y.Z 新增</span>`。
