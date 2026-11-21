import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ArticleMeta from './components/ArticleMeta.vue'
import ArchiveList from './components/ArchiveList.vue'
import CourseCard from './components/CourseCard.vue'
import HomeColumns from './components/HomeColumns.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'layout-top': () => h(ReadingProgress),
      'sidebar-nav-before': () => h(CourseCard)
    }),
  enhanceApp({ app }) {
    app.component('ArticleMeta', ArticleMeta)
    app.component('ArchiveList', ArchiveList)
    app.component('HomeColumns', HomeColumns)
  }
} satisfies Theme
