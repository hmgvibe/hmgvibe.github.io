# hmgvibe 項目介紹網站

介紹各項目的用途、主要功能、適用平台與下載方式。這是純靜態網站，不需安裝套件，可直接發佈到 GitHub Pages。

網站：[hmgvibe.github.io](https://hmgvibe.github.io/)

來源：[hmgvibe/hmgvibe.github.io](https://github.com/hmgvibe/hmgvibe.github.io)

右上角可切換深色／淺色模式。首次開啟依照系統偏好，手動切換後在此瀏覽器記住選擇。

## 瀏覽體驗

首頁以項目展廳呈現八個工具，支援 Android、Windows、Linux 與 Nextcloud 平台篩選。
項目卡片和詳細頁使用獨立 SVG 概念視覺；這些插圖不是應用程式實際截圖。
動態包含捲動進場、卡片光影、首頁視差、懸浮物件與瀏覽器支援時的跨頁轉場。
會遵循系統「減少動態效果」，觸控裝置不啟用滑鼠視差，首頁物件離開畫面時暫停循環動畫。

## 內容來源

目前作品內容整理自 `https://github.com/hmgvibe` 的公開 repositories、README 與 Releases：

- ClassFlow
- Phnomy
- Secondary（Windows／Linux；v1.1.0 起提供區域網路連線模式）
- QRTrans
- NextPhoto
- CloudNote
- MPad
- Beautiful Waste

首頁保留項目摘要。點擊項目名稱或「詳細介紹」可前往 `projects/` 下的獨立介紹頁，
閱讀適用情境、功能特色、開始使用、系統需求與常見問題；每頁都有固定網址可分享。
下載入口使用各 repository 的 `releases/latest`，版本發布後不必手動修改連結。
首頁摘要位於 `index.html`，詳細內容位於 `projects/<項目名稱>.html`。

## 本機預覽

可直接雙擊 `index.html`，或在此資料夾執行：

```powershell
python -m http.server 8000
```

然後開啟 <http://localhost:8000>。

## 發佈到 GitHub Pages

推送網站檔案到 `hmgvibe/hmgvibe.github.io` 的 `main` 分支後，GitHub Pages 自動更新網站。
發布來源為 `main` 分支的 `/(root)`。

## 檔案

- `index.html`：網站內容與 SEO 標題
- `projects/*.html`：八個項目的獨立詳細介紹頁
- `styles.css`：完整視覺、桌面與手機版面
- `detail.css`：詳細頁的排版、固定目錄與功能段落
- `assets/*.svg`：八個項目的概念視覺
- `script.js`：平台篩選、捲動目錄、進場動態、滑鼠互動與頁尾年份
- `theme.js`：系統配色偏好、主題切換與本機偏好保存
- `.nojekyll`：讓 GitHub Pages 直接提供靜態檔案
