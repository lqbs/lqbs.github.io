# 项目说明

VitePress 文档站点，发布到 GitHub Pages（合并到 `main` 自动部署）。

新增或修改文章前，先读并遵守 [`guide.md`](guide.md)（写作与发布指南），重点：

- 文件放在 `posts/`，课程章节放在课程目录并以两位序号开头；发布后不改文件名。
- frontmatter 必须有 `title`、`date`（带 `+08:00`）、`categories`，`categories` 第一项决定首页专栏。
- 正文第一行是唯一的 `# 一级标题`；不手写目录。
- 八股文的 `##` 带 `{#锚点}`；课程章节标题用全角空格分隔编号，对话标题带 `{#turn-N}`。
- 新文章需在 `.vitepress/config.mts` 登记侧边栏（课程章节除外）。
- 需要 Node 20+；提交前 `npm run docs:build` 必须通过。
