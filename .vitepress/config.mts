import { readdirSync, readFileSync } from 'node:fs'
import { defineConfig, type DefaultTheme } from 'vitepress'

function readCourseChapters(base: string): DefaultTheme.SidebarItem[] {
  const directory = new URL(`..${base}`, import.meta.url)
  return readdirSync(directory)
    .filter((file) => /^\d{2}-[^/]+\.md$/.test(file))
    .sort()
    .map((file) => {
      const chapter = readFileSync(new URL(file, directory), 'utf8')
      const text = chapter.match(/^# ([^\r\n]+)\r?$/m)?.[1]
      const link = base + file.slice(0, -3)
      const items = Array.from(
        chapter.matchAll(/^## ([^\r\n]+) \{#(turn-\d+)\}\r?$/gm),
        ([, title, anchor]) => ({ text: title, link: `${link}#${anchor}` })
      )

      if (!text || items.length === 0) {
        throw new Error(`课程章节缺少标题或对话小节：${link}`)
      }

      return { text, link, collapsed: true, items }
    })
}

const aftersalesIndex = '/posts/aftersales-analytics-from-scratch'
const aftersalesBase = '/posts/aftersales-analytics/'
const aftersalesChapters = readCourseChapters(aftersalesBase)

const aftersalesSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '完整目录',
    items: [{ text: '课程导读', link: aftersalesIndex }, ...aftersalesChapters]
  },
  {
    text: '关键材料',
    items: [
      { text: '售后数据分析系统 PRD V1.0', link: `${aftersalesBase}02-requirements-and-prd#prd-v1-0` },
      { text: '数据库设计评审', link: `${aftersalesBase}03-data-modeling#database-design-review` },
      { text: '生产上线验收', link: `${aftersalesBase}08-deployment#production-acceptance` },
      { text: 'V1 首轮迭代题', link: `${aftersalesBase}09-project#first-iteration-exercise` }
    ]
  }
]

const softwareDevelopmentIndex = '/posts/software-development-workflow'
const softwareDevelopmentBase = softwareDevelopmentIndex + '/'
const softwareDevelopmentChapters = readCourseChapters(softwareDevelopmentBase)
const softwareDevelopmentSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '完整目录',
    items: [{ text: '课程导读', link: softwareDevelopmentIndex }]
  },
  { text: '软件开发六课', items: softwareDevelopmentChapters.slice(0, 6) },
  { text: '综合项目与八轮需求调研', items: softwareDevelopmentChapters.slice(6, 15) },
  { text: '系统架构设计', items: softwareDevelopmentChapters.slice(15) }
]

export default defineConfig({
  lang: 'zh-CN',
  title: '我的文档',
  description: '基于 VitePress 和 Markdown 的文档站点',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '写作指南', link: '/guide' },
      { text: '文档写作技巧', link: '/posts/document-writing-skills' },
      { text: '售后数据分析系统', link: aftersalesIndex },
      { text: '软件开发流程', link: softwareDevelopmentIndex },
      {
        text: '八股文笔记',
        items: [
          { text: '计算机基础篇', link: '/posts/code-notes-computer-fundamentals' },
          { text: 'Java 篇', link: '/posts/code-notes-java' },
          { text: '前端篇', link: '/posts/code-notes-frontend' },
          { text: '算法篇', link: '/posts/code-notes-algorithm' },
          { text: '面经篇', link: '/posts/code-notes-interview' }
        ]
      },
      { text: '原有文章', link: '/posts/ai-agent-tutorials' }
    ],
    sidebar: {
      [aftersalesIndex]: aftersalesSidebar,
      [aftersalesBase]: aftersalesSidebar,
      [softwareDevelopmentIndex]: softwareDevelopmentSidebar,
      [softwareDevelopmentBase]: softwareDevelopmentSidebar,
      '/': [
        { text: '文档', items: [{ text: '开始写作', link: '/guide' }] },
        { text: '写作方法', items: [
          { text: '文档书写技巧', link: '/posts/document-writing-skills' }
        ] },
        { text: '项目实战', items: [
          { text: '从零开发售后数据分析系统', link: aftersalesIndex },
          { text: '软件开发流程与订单系统实战', link: softwareDevelopmentIndex }
        ] },
        { text: '八股文笔记', items: [
          { text: '计算机基础篇', link: '/posts/code-notes-computer-fundamentals' },
          { text: 'Java 篇', link: '/posts/code-notes-java' },
          { text: '前端篇', link: '/posts/code-notes-frontend' },
          { text: '算法篇', link: '/posts/code-notes-algorithm' },
          { text: '面经篇', link: '/posts/code-notes-interview' }
        ] },
        { text: '原有文章', items: [
          { text: 'AI Agent 26 项目教程', link: '/posts/ai-agent-tutorials' },
          { text: '程序员如何选 AI 模型', link: '/posts/ai-model-selection-for-programmers' },
          { text: '互联网项目完整流程', link: '/posts/internet-project-lifecycle' },
          { text: '技术设计全流程', link: '/posts/tech-design-for-internet-projects' }
        ] }
      ]
    },
    sidebarMenuLabel: '目录',
    search: { provider: 'local' },
    outline: { label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    returnToTopLabel: '返回顶部'
  }
})
