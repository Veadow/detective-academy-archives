# 侦探学院 · 四份封存档案

React + Vite 纯前端单页解谜网站，包含四道逻辑谜题、逐题核验和最终四位密码核验。

正确提交最终密码后，整个页面只显示：

> 学院正在筹备，请耐心等待

完成状态保存在同一浏览器的本地存储中，刷新或重新打开也保持该提示。

## 开发

需要 Node.js 22.12 或更高版本。

```sh
npm ci
npm run dev
```

打开终端显示的本地网址。

## 构建与部署

```sh
npm run build
npm run preview
```

构建输出位于 `dist/`，可以上传到静态网站托管服务。资源使用相对路径，支持 GitHub Pages 的仓库子路径。网站无需后端、数据库或服务器密钥。

## GitHub Pages

仓库包含 `.github/workflows/pages.yml`。在 GitHub 的 Settings → Pages 中，将 Source 设为 GitHub Actions。每次向 `main` 分支推送都会自动构建和发布，也可以在 Actions 页面手动运行 Publish GitHub Pages。

流程采用 GitHub 官方的 [Pages 发布方式](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)，不需要额外配置部署令牌。

## 题目和发布时间

编辑 `src/puzzles.js`，可以修改题面、答案和解析。

- `releaseAt: null`：立即公开，目前四题均采用此设置。
- `releaseAt: '2026-10-10T18:00:00+08:00'`：北京时间指定时刻公开。

发布时间依据玩家设备时钟。设置了时间时，页面每秒检查并追加显示新题，保留旧题。按设计，题目、答案与验证逻辑全部包含在前端。

## 文件结构

```text
src/main.jsx                    React 入口
src/App.jsx                     页面、解谜状态与完成状态
src/puzzles.js                  四道题、答案及发布时间
src/styles.css                  样式和响应式布局
src/components/PuzzleCard.jsx   单题显示与核验
src/components/FinalLock.jsx    最终密码输入
public/favicon.svg             网站图标
tests/game.spec.js              浏览器检查
```

## 检查

```sh
npx playwright install chromium
npm test
```

检查完整解题、完成后的刷新与重新打开、手机布局、定时公开边界和代理核验入口。已安装 Microsoft Edge 时，也可设置 `PLAYWRIGHT_CHANNEL=msedge` 后执行测试。

完成前的逐题进度只保留在当前页面；完成后的提示使用本地存储。清除该站点的浏览器存储会恢复解谜页面。新设备或其他浏览器从未完成状态开始。

支持 WebMCP 的浏览器可注册 `submit_archive_answer` 工具，复用页面的核验逻辑。浏览器集成检查使用模拟注册上下文，原生协议兼容性未验证。
