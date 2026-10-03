# hmgvibe 項目介紹網站

介紹各項目的用途、主要功能、適用平台與下載方式。這是純靜態網站，不需安裝套件，可直接發佈到 GitHub Pages。

網站：[hmgvibe.github.io](https://hmgvibe.github.io/)

來源：[hmgvibe/hmgvibe.github.io](https://github.com/hmgvibe/hmgvibe.github.io)

## 內容來源

目前作品內容整理自 `https://github.com/hmgvibe` 的公開 repositories 與 README：

- ClassFlow
- Secondary
- QRTrans
- NextPhoto
- CloudNote
- MPad
- Beautiful Waste

各項目的介紹直接顯示，透過目錄可前往對應項目。下載入口使用各 repository 的
`releases/latest`，版本發布後不必手動修改連結。若要更新功能介紹，修改 `index.html`。

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
- `styles.css`：完整視覺、桌面與手機版面
- `script.js`：目錄目前位置提示與頁尾年份
- `.nojekyll`：讓 GitHub Pages 直接提供靜態檔案
