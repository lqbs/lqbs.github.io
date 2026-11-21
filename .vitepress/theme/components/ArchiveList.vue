<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data.mts'
import { formatMinutes } from '../readingStats'

const activeTag = ref<string | null>(null)

const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const post of posts) for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'))
})

const showAllTags = ref(false)
const visibleTags = computed(() =>
  showAllTags.value ? tags.value : tags.value.filter(([name, count]) => count > 1 || name === activeTag.value)
)
const hiddenCount = computed(() => tags.value.length - visibleTags.value.length)

const groups = computed(() => {
  const filtered = activeTag.value ? posts.filter((p) => p.tags.includes(activeTag.value!)) : posts
  const byYear = new Map<string, typeof posts>()
  for (const post of filtered) {
    const year = post.date?.slice(0, 4) ?? '未注明日期'
    byYear.set(year, [...(byYear.get(year) ?? []), post])
  }
  return [...byYear]
})

function select(tag: string | null) {
  activeTag.value = activeTag.value === tag ? null : tag
  const url = new URL(window.location.href)
  if (activeTag.value) url.searchParams.set('tag', activeTag.value)
  else url.searchParams.delete('tag')
  window.history.replaceState(window.history.state, '', url)
}

onMounted(() => {
  const tag = new URLSearchParams(window.location.search).get('tag')
  if (tag && tags.value.some(([name]) => name === tag)) activeTag.value = tag
})
</script>

<template>
  <div class="archive vp-raw">
    <div class="archive__tags" role="group" aria-label="按标签筛选">
      <button
        type="button"
        class="archive__tag"
        :class="{ 'is-active': !activeTag }"
        @click="select(null)"
      >全部 <span>{{ posts.length }}</span></button>
      <button
        v-for="[tag, count] in visibleTags"
        :key="tag"
        type="button"
        class="archive__tag"
        :class="{ 'is-active': activeTag === tag }"
        :aria-pressed="activeTag === tag"
        @click="select(tag)"
      >{{ tag }} <span>{{ count }}</span></button>
      <button
        v-if="hiddenCount > 0 || showAllTags"
        type="button"
        class="archive__more"
        :aria-expanded="showAllTags"
        @click="showAllTags = !showAllTags"
      >{{ showAllTags ? '收起标签' : `更多标签（${hiddenCount}）` }}</button>
    </div>

    <section v-for="[year, items] in groups" :key="year" class="archive__year">
      <h2 class="archive__year-title">{{ year }}</h2>
      <ul class="archive__list">
        <li v-for="post in items" :key="post.url" class="archive__item">
          <time class="archive__date" :datetime="post.date">{{ post.date?.slice(5) }}</time>
          <div class="archive__body">
            <a class="archive__link" :href="withBase(post.url)">{{ post.title }}</a>
            <p v-if="post.description" class="archive__desc">{{ post.description }}</p>
            <p class="archive__detail">
              <span v-if="post.chapters">{{ post.chapters }} 章 · </span>约 {{ formatMinutes(post.minutes) }}
              <template v-if="post.category"> · {{ post.category }}</template>
            </p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.archive__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 32px;
}

.archive__tag {
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 2px 12px;
  font-size: 13px;
  line-height: 24px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  transition: color 0.2s, border-color 0.2s, background-color 0.2s;
}

.archive__tag span {
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

.archive__tag:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.archive__tag.is-active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.archive__more {
  padding: 2px 6px;
  font-size: 13px;
  line-height: 24px;
  color: var(--vp-c-brand-1);
}

.archive__more:hover {
  text-decoration: underline;
}

.archive__year + .archive__year {
  margin-top: 32px;
}

.archive__year-title {
  border-top: 0;
  padding-top: 0;
  letter-spacing: 0;
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 600;
  line-height: 32px;
  color: var(--vp-c-text-1);
}

.archive__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.archive__item {
  display: flex;
  gap: 20px;
  padding: 14px 0;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.archive__date {
  flex: none;
  width: 3.2em;
  padding-top: 2px;
  white-space: nowrap;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
}

.archive__body {
  min-width: 0;
}

.archive__link {
  font-size: 16px;
  font-weight: 500;
  line-height: 26px;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.archive__link:hover {
  color: var(--vp-c-brand-1);
}

.archive__desc {
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--vp-c-text-2);
}

.archive__detail {
  margin: 4px 0 0;
  font-size: 12.5px;
  line-height: 20px;
  color: var(--vp-c-text-3);
}
</style>
