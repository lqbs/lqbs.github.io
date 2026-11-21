import type MarkdownIt from 'markdown-it'

type Token = ReturnType<MarkdownIt['parse']>[number]

const ASK_LABELS = new Set(['**你的提问或作答**', '**用户**'])
const ANSWER_LABELS = new Set(['**讲解与讲评**', '**ChatGPT**'])

function labelAt(tokens: Token[], i: number): string | undefined {
  if (
    tokens[i]?.type === 'paragraph_open' &&
    tokens[i + 1]?.type === 'inline' &&
    tokens[i + 2]?.type === 'paragraph_close'
  ) {
    return tokens[i + 1].content.trim()
  }
}

function htmlBlock(state: any, content: string): Token {
  const token = new state.Token('html_block', '', 0)
  token.content = content
  return token
}

/**
 * 课程章节的对话轮次：给“提问”和“讲解”标签加样式类，并把提问内容包成气泡。
 * - 售后课程：段落 **你的提问或作答** …… 段落 **讲解与讲评**，中间内容包进 div.chat-ask
 * - 软件开发课程：以 **用户** 开头的引用块直接加 .chat-ask
 */
export function chatTurns(md: MarkdownIt) {
  md.core.ruler.push('chat_turns', (state) => {
    const tokens = state.tokens as Token[]

    for (let i = 0; i < tokens.length; i++) {
      const label = labelAt(tokens, i)
      if (!label) continue

      if (ANSWER_LABELS.has(label)) {
        tokens[i].attrJoin('class', 'chat-label chat-label--answer')
        continue
      }
      if (!ASK_LABELS.has(label)) continue

      tokens[i].attrJoin('class', 'chat-label chat-label--ask')

      // 引用块里的“用户”：给外层 blockquote 加类即可
      if (tokens[i - 1]?.type === 'blockquote_open') {
        tokens[i - 1].attrJoin('class', 'chat-ask')
        continue
      }

      // 顶层的“你的提问或作答”：向后找到同一轮的讲解标签，把两者之间包起来
      let end = -1
      for (let j = i + 3; j < tokens.length; j++) {
        if (tokens[j].type === 'heading_open' && tokens[j].tag <= 'h2') break
        if (ANSWER_LABELS.has(labelAt(tokens, j) ?? '')) {
          end = j
          break
        }
      }
      if (end === -1) continue

      tokens.splice(end, 0, htmlBlock(state, '</div>\n'))
      tokens.splice(i, 0, htmlBlock(state, '<div class="chat-ask">\n'))
      i = end + 1
    }
  })
}

/** 在页面一级标题后插入文章信息行（日期 · 字数 · 阅读时长 · 标签） */
export function articleMeta(md: MarkdownIt) {
  md.core.ruler.push('article_meta', (state) => {
    const tokens = state.tokens as Token[]
    const index = tokens.findIndex((t) => t.type === 'heading_open' && t.tag === 'h1')
    if (index === -1) return
    const close = tokens.findIndex((t, k) => k > index && t.type === 'heading_close')
    tokens.splice(close + 1, 0, htmlBlock(state, '<ArticleMeta />\n'))
  })
}
