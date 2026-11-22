<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as posts } from '../posts.data.mts'
import { formatMinutes } from '../readingStats'

const { page } = useData()

const courses = posts.filter((post) => post.chapterBase)

const state = computed(() => {
  const path = page.value.relativePath
  const course = courses.find((c) => c.source === path || path.startsWith(c.chapterBase!))
  if (!course) return undefined
  const onIndex = course.source === path
  const current = onIndex ? undefined : Number.parseInt(path.slice(course.chapterBase!.length), 10)
  return { course, onIndex, current }
})
</script>

<template>
  <div v-if="state" class="course-card">
    <p class="course-card__eyebrow">课程</p>
    <a class="course-card__title" :href="withBase(state.course.url)">{{ state.course.title }}</a>
    <p class="course-card__meta">
      <span v-if="state.current">第 {{ state.current }} / {{ state.course.chapters }} 篇</span>
      <span v-else>共 {{ state.course.chapters }} 篇</span>
      <span>约 {{ formatMinutes(state.course.minutes) }}</span>
    </p>
    <div class="course-card__bar" aria-hidden="true">
      <div
        class="course-card__fill"
        :style="{ width: `${((state.current ?? 0) / (state.course.chapters ?? 1)) * 100}%` }"
      />
    </div>
    <a v-if="!state.onIndex" class="course-card__link" :href="withBase(state.course.url)">课程导读 →</a>
    <span v-else class="course-card__link is-current">正在阅读：课程导读</span>
  </div>
</template>

<style scoped>
.course-card {
  margin: 16px 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  padding: 12px 14px;
}

.course-card__eyebrow {
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
}

.course-card__title {
  display: block;
  margin-top: 2px;
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}

.course-card__title:hover {
  color: var(--vp-c-brand-1);
}

.course-card__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0 8px;
  margin-top: 4px;
  white-space: nowrap;
  font-size: 12px;
  line-height: 18px;
  color: var(--vp-c-text-2);
}

.course-card__bar {
  margin-top: 8px;
  height: 3px;
  border-radius: 2px;
  background: var(--vp-c-default-soft);
  overflow: hidden;
}

.course-card__fill {
  height: 100%;
  background: var(--vp-c-brand-1);
}

.course-card__link {
  display: inline-block;
  margin-top: 8px;
  font-size: 12px;
  line-height: 18px;
  color: var(--vp-c-brand-1);
}

.course-card__link.is-current {
  color: var(--vp-c-text-3);
}
</style>
