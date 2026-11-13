# 开始写作

在 仓库目录中创建或修改 Markdown 文件，然后提交并推送到 GitHub。GitHub Actions 会自动构建并发布站点。

## 新增页面

例如，创建 `notes.md`：

```md
# 我的笔记

在这里记录内容。
```

如需在导航栏或侧边栏显示，请修改 `.vitepress/config.mts`。

## 本地预览

```sh
npm ci
npm run docs:dev
```

构建生产版本：

```sh
npm run docs:build
npm run docs:preview
```
