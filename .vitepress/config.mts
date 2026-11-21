import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '我的文档',
  description: '基于 VitePress 和 Markdown 的文档站点',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '写作指南', link: '/guide' },
      { text: '文档写作技巧', link: '/posts/document-writing-skills' },
      { text: '售后数据分析系统', link: '/posts/aftersales-analytics-from-scratch' },
      { text: '软件开发流程', link: '/posts/software-development-workflow' },
      { text: '原有文章', link: '/posts/ai-agent-tutorials' }
    ],
    sidebar: [
      { text: '文档', items: [{ text: '开始写作', link: '/guide' }] },
      { text: '写作方法', items: [
        { text: '文档书写技巧', link: '/posts/document-writing-skills' }
      ] },
      { text: '项目实战', items: [
        { text: '从零开发售后数据分析系统', link: '/posts/aftersales-analytics-from-scratch' },
        { text: '软件开发流程与订单系统实战', link: '/posts/software-development-workflow' }
      ] },
      { text: '原有文章', items: [
        { text: 'AI Agent 26 项目教程', link: '/posts/ai-agent-tutorials' },
        { text: '程序员如何选 AI 模型', link: '/posts/ai-model-selection-for-programmers' },
        { text: '互联网项目完整流程', link: '/posts/internet-project-lifecycle' },
        { text: '技术设计全流程', link: '/posts/tech-design-for-internet-projects' }
      ] }
    ],
    search: { provider: 'local' },
    outline: { label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    returnToTopLabel: '返回顶部'
  }
})
