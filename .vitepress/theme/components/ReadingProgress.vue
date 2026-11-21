<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()
const progress = ref(0)
const visible = computed(
  () => !page.value.isNotFound && (frontmatter.value.layout ?? 'doc') === 'doc'
)

let frame = 0
function update() {
  frame = 0
  const root = document.documentElement
  const max = root.scrollHeight - root.clientHeight
  progress.value = max > 0 ? Math.min(1, root.scrollTop / max) : 0
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
})
onUnmounted(() => {
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
  cancelAnimationFrame(frame)
})
watch(() => page.value.relativePath, () => nextTick(update))
</script>

<template>
  <div v-if="visible" class="reading-progress" aria-hidden="true">
    <div class="reading-progress__bar" :style="{ transform: `scaleX(${progress})` }" />
  </div>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  inset: 0 0 auto;
  z-index: calc(var(--vp-z-index-nav) + 10);
  height: 3px;
  pointer-events: none;
}

.reading-progress__bar {
  height: 100%;
  background: var(--vp-c-brand-1);
  transform-origin: 0 50%;
  transition: transform 0.1s linear;
}
</style>
