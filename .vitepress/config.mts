import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type DefaultTheme } from 'vitepress'
import { articleMeta, chatTurns } from './markdownPlugins'
import { countReading, formatDate } from './theme/readingStats'

/** 课程标题“第三章　数据架构……”拆成编号和标题两段，侧边栏分两行显示；隐藏的全角空格保证在翻页链接里仍连读 */
function splitTitle(title: string): string {
  const [no, ...rest] = title.split('　')
  if (!rest.length) return title
  return `<span class="sb-no">${no}</span><span class="sb-sep">　</span><span class="sb-title">${rest.join('　')}</span>`
}

/** 对话轮次“第 16 轮　……”/“对话 43　……”渲染为数字徽标 + 标题 */
function turnTitle(title: string): string {
  const match = title.match(/^(?:第\s*(\d+)\s*轮|对话\s*(\d+))\s*(.*)$/)
  if (!match) return title
  const [, a, b, rest] = match
  return `<span class="sb-turn">${a ?? b}</span><span class="sb-title">${rest}</span>`
}

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
        ([, title, anchor]) => ({ text: turnTitle(title), link: `${link}#${anchor}` })
      )

      if (!text || items.length === 0) {
        throw new Error(`课程章节缺少标题或对话小节：${link}`)
      }

      return { text: splitTitle(text), link, collapsed: true, items }
    })
}

/** 八股文：每篇的二级标题（## 标题 {#id}）作为侧边栏子项 */
function readSections(link: string): DefaultTheme.SidebarItem[] {
  const source = readFileSync(new URL(`..${link}.md`, import.meta.url), 'utf8')
  return Array.from(source.matchAll(/^## ([^\r\n]+?) \{#([\w-]+)\}\r?$/gm), ([, title, anchor]) => ({
    text: title,
    link: `${link}#${anchor}`
  }))
}

// —— 项目实战：两门课程各一套侧边栏（课程导读入口在侧边栏顶部的课程卡里） ——

const aftersalesIndex = '/posts/aftersales-analytics-from-scratch'
const aftersalesBase = '/posts/aftersales-analytics/'
const aftersalesSidebar: DefaultTheme.SidebarItem[] = [
  { text: '章节', items: readCourseChapters(aftersalesBase) },
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
  { text: '软件开发六课', items: softwareDevelopmentChapters.slice(0, 6) },
  { text: '综合项目与八轮需求调研', items: softwareDevelopmentChapters.slice(6, 15) },
  { text: '系统架构设计', items: softwareDevelopmentChapters.slice(15) }
]

const projectLinks: DefaultTheme.NavItemWithLink[] = [
  { text: '从零开发售后数据分析系统', link: aftersalesIndex },
  { text: '软件开发流程与订单系统实战', link: softwareDevelopmentIndex }
]

// —— 八股文笔记：5 篇，当前篇展开大章节 ——

const notesPrefix = '/posts/code-notes-'
const notesSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '八股文笔记',
    items: [
      { text: '计算机基础篇', link: `${notesPrefix}computer-fundamentals` },
      { text: 'Java 篇', link: `${notesPrefix}java` },
      { text: '前端篇', link: `${notesPrefix}frontend` },
      { text: '算法篇', link: `${notesPrefix}algorithm` },
      { text: '面经篇', link: `${notesPrefix}interview` }
    ].map((item) => ({ ...item, collapsed: true, items: readSections(item.link) }))
  }
]

// —— 方法与思考：5 篇长文，分两组 ——

const essaysSidebar: DefaultTheme.SidebarItem[] = [
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
const essayLinks = essaysSidebar.flatMap((group) => group.items!.map((item) => item.link!))

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

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
    // 顶部导航只负责专栏切换；专栏内的篇目与章节交给左侧边栏
    nav: [
      { text: '首页', link: '/' },
      {
        text: '项目实战',
        items: projectLinks,
        activeMatch: `^(${[aftersalesIndex, aftersalesBase, softwareDevelopmentIndex].map(escapeRegExp).join('|')})`
      },
      { text: '八股文笔记', link: `${notesPrefix}computer-fundamentals`, activeMatch: `^${notesPrefix}` },
      { text: '方法与思考', link: essayLinks[0], activeMatch: `^(${essayLinks.map(escapeRegExp).join('|')})` },
      { text: '归档', link: '/archive' }
    ],
    // 左侧边栏按专栏区分，只显示当前专栏；首页、归档、指南不显示
    sidebar: {
      [aftersalesIndex]: aftersalesSidebar,
      [aftersalesBase]: aftersalesSidebar,
      [softwareDevelopmentIndex]: softwareDevelopmentSidebar,
      [notesPrefix]: notesSidebar,
      ...Object.fromEntries(essayLinks.map((link) => [link, essaysSidebar]))
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
