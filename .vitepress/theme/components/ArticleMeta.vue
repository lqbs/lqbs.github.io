<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { formatMinutes, formatWords, type ReadingStats } from '../readingStats'

const { page, frontmatter } = useData()

const stats = computed(
  () => (page.value as { readingStats?: ReadingStats & { date?: string } }).readingStats
)
const tags = computed<string[]>(() =>
  Array.isArray(frontmatter.value.tags) ? frontmatter.value.tags : []
)
const visible = computed(() => frontmatter.value.meta !== false && !!stats.value)
</script>

<template>
  <div v-if="visible && stats" class="article-meta vp-raw">
    <span v-if="stats.date" class="article-meta__item">
      <time :datetime="stats.date">{{ stats.date }}</time>
    </span>
    <span class="article-meta__item">{{ formatWords(stats.words) }}</span>
    <span class="article-meta__item">约 {{ formatMinutes(stats.minutes) }}</span>
    <span v-if="tags.length" class="article-meta__tags">
      <a
        v-for="tag in tags"
        :key="tag"
        class="article-meta__tag"
        :href="withBase(`/archive?tag=${encodeURIComponent(tag)}`)"
      >{{ tag }}</a>
    </span>
  </div>
</template>

<style scoped>
.article-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 0;
  margin: 12px 0 28px;
  font-size: 13px;
  line-height: 22px;
  color: var(--vp-c-text-2);
}

.article-meta__item:not(:first-child)::before {
  content: '·';
  margin: 0 8px;
  color: var(--vp-c-text-3);
}

.article-meta__tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-left: 14px;
}

.article-meta__tag {
  padding: 0 8px;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s, background-color 0.2s;
}

.article-meta__tag:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

@media (max-width: 639px) {
  .article-meta__tags {
    flex-basis: 100%;
    margin-left: 0;
  }
}
</style>
