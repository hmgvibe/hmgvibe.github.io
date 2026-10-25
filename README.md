# hmgvibe 項目介紹網站

介紹各項目的用途、主要功能、適用平台與下載方式。這是純靜態網站，不需安裝套件，可直接發佈到 GitHub Pages。

網站：[hmgvibe.github.io](https://hmgvibe.github.io/)

來源：[hmgvibe/hmgvibe.github.io](https://github.com/hmgvibe/hmgvibe.github.io)

右上角可切換深色／淺色模式。首次開啟依照系統偏好，手動切換後在此瀏覽器記住選擇。

網站提供繁體與簡體中文（`/zh-hans/`）。首次開啟依照瀏覽器語言自動選擇一次，之後可用右上角「简体／繁體」切換並記住選擇。
簡體頁面由繁體頁面自動轉換產生，請只修改繁體頁面，再執行：

```bash
pip install opencc
python3 tools/build-zh-hans.py
```

## 瀏覽體驗

首頁是一張綠色切割墊上的工具桌：九個工具各畫成一件裝置的線稿，平鋪在墊上，支援 Android、Windows、Linux 與 Nextcloud 平台篩選。
有滑鼠時，懸停或用鍵盤聚焦一件工具，它的螢幕就會亮成該項目的產品色並做一個小動作；最新的工具預設亮著。觸控裝置上全部預設亮著。
篩選時不符合的工具留在原位，變成虛線輪廓。
詳細頁頂部沿用同一塊墊子，這件工具的線稿亮著、像剛從桌上拿起來；線稿不是應用程式實際截圖。
首頁下方「關於這些工具」是三張放在同一張墊上的紙條。平台篩選會記在網址（`?platform=`）與這個分頁。
動態包含工具依序放上墊子、捲動進場與瀏覽器支援時的跨頁轉場（首頁線稿會接到詳細頁的同一張線稿）。
會遵循系統「減少動態效果」。

## 內容來源

目前作品內容整理自 `https://github.com/hmgvibe` 的公開 repositories、README 與 Releases：

- ClassFlow
- TouchWrite（Windows 觸控板手寫輸入）
- Phnomy
- Secondary（Windows／Linux；v1.1.0 起提供區域網路連線模式，v1.2.0 起可匯出／匯入快捷導航）
- QRTrans
- NextPhoto
- CloudNote
- MPad
- Beautiful Waste

首頁每個工具只放名稱、一句話與平台。點擊工具可前往 `projects/` 下的獨立介紹頁，
閱讀適用情境、功能特色、開始使用、系統需求與常見問題；每頁都有固定網址可分享。
下載入口使用各 repository 的 `releases/latest`，版本發布後不必手動修改連結。
首頁位於 `index.html`，詳細內容位於 `projects/<項目名稱>.html`。

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
- `projects/*.html`：九個項目的獨立詳細介紹頁
- `styles.css`：顏色與字體變數、切割墊、工具線稿與亮屏動作、桌面與手機版面
- `detail.css`：詳細頁的墊上開頭、固定目錄與紙上內文
- `assets/*.svg`：舊版概念視覺（新版已不使用）；`assets/favicon.svg` 是網站圖示
- `script.js`：工具亮屏、平台篩選、捲動目錄、進場動態與頁尾年份
- `theme.js`：系統配色偏好、主題切換、語言自動選擇與本機偏好保存
- `zh-hans/`：簡體中文版（自動產生，勿手動修改）
- `tools/build-zh-hans.py`：從繁體頁面產生簡體版（OpenCC 轉換與用語修正）
- `.nojekyll`：讓 GitHub Pages 直接提供靜態檔案
