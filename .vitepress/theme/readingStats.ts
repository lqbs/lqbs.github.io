// 构建期与客户端共用的阅读统计工具（纯函数，不依赖 Node 或 DOM）

const CJK = /[㐀-鿿豈-﫿]/g

export interface ReadingStats {
  /** 中文字数 + 英文单词数 */
  words: number
  /** 预计阅读分钟数 */
  minutes: number
}

/** 统计 Markdown 源文的字数和阅读时长：中文按 400 字/分钟，英文按 200 词/分钟，忽略代码块和 HTML 标签 */
export function countReading(source: string): ReadingStats {
  const body = source
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{#[^}]*\}/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
  const cjk = body.match(CJK)?.length ?? 0
  const latin = body.replace(CJK, ' ').match(/[A-Za-z0-9][\w'.-]*/g)?.length ?? 0
  return { words: cjk + latin, minutes: Math.max(1, Math.round(cjk / 400 + latin / 200)) }
}

/** 统一按北京时间格式化为 YYYY-MM-DD，避免 UTC 序列化后日期偏移一天 */
export function formatDate(value: unknown): string | undefined {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) return undefined
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} 分钟`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} 小时 ${rest} 分钟` : `${hours} 小时`
}

export function formatWords(words: number): string {
  return words >= 10000 ? `${(words / 10000).toFixed(1)} 万字` : `${words} 字`
}
