import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type DefaultTheme } from 'vitepress'
import { articleMeta, chatTurns } from './markdownPlugins'
import { countReading, formatDate } from './theme/readingStats'

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

const projectLinks: DefaultTheme.SidebarItem[] = [
  { text: '从零开发售后数据分析系统', link: aftersalesIndex },
  { text: '软件开发流程与订单系统实战', link: softwareDevelopmentIndex }
]

const notesLinks: DefaultTheme.SidebarItem[] = [
  { text: '计算机基础篇', link: '/posts/code-notes-computer-fundamentals' },
  { text: 'Java 篇', link: '/posts/code-notes-java' },
  { text: '前端篇', link: '/posts/code-notes-frontend' },
  { text: '算法篇', link: '/posts/code-notes-algorithm' },
  { text: '面经篇', link: '/posts/code-notes-interview' }
]

const articleGroups: DefaultTheme.SidebarItem[] = [
  {
    text: '写作与项目管理',
    items: [
      { text: '文档书写技巧', link: '/posts/document-writing-skills' },
      { text: '互联网项目完整流程', link: '/posts/internet-project-lifecycle' },
      { text: '技术设计全流程', link: '/posts/tech-design-for-internet-projects' }
    ]
  },
  {
    text: 'AI',
    items: [
      { text: 'AI Agent 26 项目教程', link: '/posts/ai-agent-tutorials' },
      { text: '程序员如何选 AI 模型', link: '/posts/ai-model-selection-for-programmers' }
    ]
  }
]

type NavLink = DefaultTheme.NavItemWithLink
const toNav = (items: DefaultTheme.SidebarItem[]) => items as NavLink[]

export default defineConfig({
  lang: 'zh-CN',
  title: '我的文档',
  description: '项目实战课程、面试八股笔记与方法论长文',
  markdown: {
    config(md) {
      md.use(chatTurns)
      md.use(articleMeta)
    }
  },
  transformPageData(pageData, { siteConfig }) {
    if (!pageData.relativePath.endsWith('.md') || pageData.frontmatter.layout === 'home') return
    try {
      const source = readFileSync(join(siteConfig.srcDir, pageData.relativePath), 'utf8')
      return {
        readingStats: { ...countReading(source), date: formatDate(pageData.frontmatter.date) }
      } as Partial<typeof pageData>
    } catch {
      return
    }
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '项目实战', items: toNav(projectLinks) },
      { text: '八股文笔记', items: toNav(notesLinks) },
      {
        text: '文章',
        items: articleGroups.map((group) => ({ text: group.text!, items: toNav(group.items!) }))
      },
      { text: '归档', link: '/archive' }
    ],
    sidebar: {
      [aftersalesIndex]: aftersalesSidebar,
      [aftersalesBase]: aftersalesSidebar,
      [softwareDevelopmentIndex]: softwareDevelopmentSidebar,
      [softwareDevelopmentBase]: softwareDevelopmentSidebar,
      '/': [
        { text: '项目实战', items: projectLinks },
        { text: '八股文笔记', items: notesLinks },
        ...articleGroups
      ]
    },
    footer: {
      message: '<a href="/guide">写作与发布指南</a> · <a href="/archive">文章归档</a>'
    },
    sidebarMenuLabel: '目录',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '清除查询',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有找到相关结果',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})
