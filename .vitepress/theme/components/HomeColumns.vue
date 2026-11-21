<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as posts, type Post } from '../posts.data.mts'
import { formatMinutes } from '../readingStats'

interface Column {
  title: string
  summary: string
  match: (post: Post) => boolean
  label?: (post: Post) => string
}

const MAIN_CATEGORIES = ['项目实战', '面试八股']

const columns: Column[] = [
  {
    title: '项目实战',
    summary: '从需求调研、建模到上线运维，完整的课程对话记录。',
    match: (post) => post.category === '项目实战'
  },
  {
    title: '八股文笔记',
    summary: '按主题重排的面试知识点，逐题整理答案要点。',
    match: (post) => post.category === '面试八股',
    label: (post) => post.title.replace(/^代码随想录八股文笔记：/, '')
  },
  {
    title: '方法与思考',
    summary: '写作方法、项目管理与 AI 工具选型的长文。',
    match: (post) => !MAIN_CATEGORIES.includes(post.category ?? '')
  }
].map((column) => ({ ...column, posts: posts.filter(column.match) }))

const recent = posts.slice(0, 6)

function detail(post: Post) {
  const length = `约 ${formatMinutes(post.minutes)}`
  return post.chapters ? `${post.chapters} 章 · ${length}` : length
}
</script>

<template>
  <div class="home-columns vp-raw">
    <section class="columns" aria-label="专栏">
      <article v-for="column in columns" :key="column.title" class="column">
        <header class="column__header">
          <h2 class="column__title">{{ column.title }}</h2>
          <p class="column__summary">{{ column.summary }}</p>
        </header>
        <ul class="column__list">
          <li v-for="post in column.posts" :key="post.url">
            <a class="column__link" :href="withBase(post.url)">
              <span class="column__name">{{ column.label ? column.label(post) : post.title }}</span>
              <span class="column__detail">{{ detail(post) }}</span>
            </a>
          </li>
        </ul>
      </article>
    </section>

    <section class="recent" aria-labelledby="recent-title">
      <div class="recent__header">
        <h2 id="recent-title" class="recent__title">最近更新</h2>
        <a class="recent__more" :href="withBase('/archive')">全部文章 →</a>
      </div>
      <ol class="recent__list">
        <li v-for="post in recent" :key="post.url" class="recent__item">
          <time class="recent__date" :datetime="post.date">{{ post.date }}</time>
          <a class="recent__link" :href="withBase(post.url)">{{ post.title }}</a>
          <span v-if="post.category" class="recent__category">{{ post.category }}</span>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.home-columns {
  margin: 0 auto;
  max-width: 1152px;
  padding: 8px 0 48px;
}

.columns {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.column {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  padding: 22px 22px 14px;
}

.column__title {
  border-top: 0;
  padding-top: 0;
  letter-spacing: 0;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  color: var(--vp-c-text-1);
}

.column__summary {
  margin: 4px 0 12px;
  font-size: 14px;
  line-height: 22px;
  color: var(--vp-c-text-2);
}

.column__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.column__list li + li {
  border-top: 1px dashed var(--vp-c-divider);
}

.column__link {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 0;
  text-decoration: none;
}

.column__name {
  font-size: 15px;
  line-height: 24px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}

.column__link:hover .column__name {
  color: var(--vp-c-brand-1);
}

.column__detail {
  font-size: 12.5px;
  line-height: 20px;
  color: var(--vp-c-text-3);
}

.recent {
  margin-top: 40px;
}

.recent__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 8px;
}

.recent__title {
  border-top: 0;
  padding-top: 0;
  letter-spacing: 0;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.recent__more {
  font-size: 14px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.recent__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.recent__item {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.recent__date {
  flex: none;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
}

.recent__link {
  flex: 1;
  min-width: 0;
  font-size: 15px;
  line-height: 24px;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.recent__link:hover {
  color: var(--vp-c-brand-1);
}

.recent__category {
  flex: none;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

@media (max-width: 639px) {
  .recent__item {
    flex-wrap: wrap;
    gap: 2px 12px;
  }

  .recent__link {
    flex-basis: 100%;
    order: 3;
  }
}
</style>
