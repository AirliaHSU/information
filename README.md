# Airlia Portfolio / Freelance

同一份作品資料、版型與樣式，產生兩個靜態頁面：

| 版本 | 網址 | 用途 |
| --- | --- | --- |
| Freelance | https://airliahsu.github.io/information/ | 作品、服務方案、合作說明與詢價 |
| Portfolio | https://airliahsu.github.io/information/portfolio/ | 正職求職、作品與職缺／面談聯繫 |

## 本機建置與預覽

安裝 Node.js 22 或更新版本。不需要安裝第三方套件。

```sh
npm run build
npm test
npm run preview
```

開啟 `http://127.0.0.1:4173/information/` 或 `http://127.0.0.1:4173/information/portfolio/`。
預覽器僅提供已建置的檔案；修改資料後重新執行 `npm run build`，再重新整理瀏覽器。
使用 Ctrl+C 停止預覽器。請勿直接雙擊 HTML，因為資源使用 Pages 基底路徑。

## 維護入口

| 修改項目 | 檔案 |
| --- | --- |
| 動畫、Logo、分鏡作品 | `src/data/works.json` |
| 姓名、經歷、技能、工具、Email | `src/data/profile.json` |
| 各版定位、CTA、Contact、分享資訊、網址 | `src/data/variants.json` |
| 接案方案、合作說明、詢價信件 | `src/data/services.json` |
| 共用視覺與響應式樣式 | `src/assets/styles.css` |
| 輪播、頁尾年份 | `src/assets/main.js` |
| 頁面骨架 | `src/templates/page.mjs` |
| 共用展示元件 | `src/templates/components.mjs` |

### 新增作品

1. 在 `works.json` 複製同類別的作品物件，設定唯一 `id`。
2. 類別為 `animation`、`logo` 或 `storyboard`。各類別按照資料陣列中的順序顯示。
3. 影片填 YouTube 的 11 字元 ID，並填寫 `videoTitle`、`tags`、`roles`、`tools`；沒有項目時使用空陣列。
4. 分鏡圖片放在 `images/`，在 `images` 陣列填 `src` 與有意義的 `alt`。檔名使用英數字、連字號或底線；支援每組多張圖片。
5. 執行 `npm test`。兩版與作品分類數量會自動更新，不必修改 HTML。

資料中的文字會作 HTML 跳脫，請填純文字。求職版不會輸出服務區塊或詢價信件範本。
Email 是公開聯絡資訊，透過 `mailto:` 開啟使用者的郵件程式；網站沒有表單伺服器、登入或憑證。

### 版本與網址設定

`variants.json` 的 `siteUrl` 為網域，`basePath` 為 `/information/`。
每個頁面的 `path` 相對於 `basePath`，目前為空字串與 `portfolio/`。
若日後更換網域或儲存庫名稱，更新這兩個欄位並重新建置。
每頁有獨立 title、description、canonical、Open Graph URL；圖片與樣式共用。

`showServices` 決定是否輸出方案、需求清單、報價說明，以及使用詢價信件。
求職版使用自己的 `mailSubject`、`mailBody`。接案方案按鈕會預填方案 A／B／C。

## 首次遷移與 GitHub Pages 發布

原本根目錄 `index.html` 已拆成 `src/` 的資料、元件與樣式。正式發布來源改為自動產生的 `dist/`；不要手動修改產物，也不要將 `dist/` 加入版本控制。

首次切換時：

1. 先確認 Pull Request 的 build 檢查通過並審閱兩版。
2. 在儲存庫 **Settings → Pages → Build and deployment → Source** 選擇 **GitHub Actions**。
3. 合併至 `main` 後，工作流程會執行測試與建置，將 `dist/` 部署到 Pages。若先合併才調整設定，請在 Actions 手動執行工作流程。
4. 驗證上述兩個正式網址。

PR 只執行建置與測試，不部署。部署僅限 `main` 的 push 或手動執行；工作流程使用 GitHub 提供的短期權限，不需要新增個人 access token。

## 互動與基本驗證

作品優先排列，其後為 About／Skills、接案版服務方案與 Contact。
求職版為墨綠金框，接案版為黑金，頂部有版本識別與固定導覽。
動畫作品、Logo Motion、分鏡設計採同頁分類切換，支援鍵盤方向鍵與瀏覽器返回。
可分享 `#animation`、`#logo`、`#storyboard` 直接開啟分類。
影片先顯示 YouTube 封面，點擊才載入播放器；切換分類會停止舊分類的影片。
分鏡點擊開啟完整圖片，支援 Escape 關閉並恢復焦點。進場效果尊重減少動態效果偏好。
停用 JavaScript 時，所有分類保持可見，影片連至 YouTube，分鏡連至原圖。

`npm test` 驗證兩版共用作品、求職版無接案 CTA、方案預填、metadata、資源路徑及資料更新同步。
發布前另檢查桌面與手機排版，以及實際 YouTube 播放和本機郵件程式開啟行為。
