import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createContentLoader, type SiteConfig } from 'vitepress'
import { countReading, formatDate } from './readingStats'

export interface Post {
  title: string
  url: string
  description?: string
  date?: string
  tags: string[]
  category?: string
  words: number
  minutes: number
  /** 课程类文章：同名目录下的章节数 */
  chapters?: number
  /** 源文件相对路径，如 posts/foo.md */
  source: string
  /** 课程类文章：章节目录相对路径，如 posts/aftersales-analytics/ */
  chapterBase?: string
}

declare const data: Post[]
export { data }

export default createContentLoader('posts/*.md', {
  includeSrc: true,
  transform(raw): Post[] {
    const srcDir = (globalThis as { VITEPRESS_CONFIG?: SiteConfig }).VITEPRESS_CONFIG?.srcDir ?? process.cwd()

    return raw
      .filter(({ frontmatter }) => frontmatter.draft !== true)
      .map(({ url, frontmatter, src = '' }) => {
        const title = frontmatter.title ?? src.match(/^# (.+)$/m)?.[1] ?? url
        let { words, minutes } = countReading(src)
        let chapters: number | undefined
        let chapterBase: string | undefined

        // 课程首页：统计同名目录（或 frontmatter.chapterDir 指定的同级目录）下所有章节
        const base = url.replace(/^\//, '').replace(/\.html$/, '')
        const relativeDir = frontmatter.chapterDir ? join(base, '..', frontmatter.chapterDir) : base
        const dir = join(srcDir, relativeDir)
        if (existsSync(dir)) {
          const files = readdirSync(dir).filter((file) => /^\d{2}-.+\.md$/.test(file))
          if (files.length) {
            chapters = files.length
            chapterBase = relativeDir.replace(/\\/g, '/') + '/'
            for (const file of files) {
              const stats = countReading(readFileSync(join(dir, file), 'utf8'))
              words += stats.words
              minutes += stats.minutes
            }
          }
        }

        return {
          title: String(title),
          url,
          description: frontmatter.description,
          date: formatDate(frontmatter.date),
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : [],
          category: Array.isArray(frontmatter.categories) ? String(frontmatter.categories[0]) : undefined,
          words,
          minutes,
          chapters,
          source: `${base}.md`,
          chapterBase
        }
      })
      .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title, 'zh-CN'))
  }
})
