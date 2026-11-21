---
title: 代码随想录八股文笔记：前端篇
description: 整理自《代码随想录知识星球精华（最强八股文）第五版》前端篇：HTML、CSS、JavaScript、浏览器与网络、性能优化与安全、Vue 与 React 的学习笔记。
date: 2026-11-21T00:00:00+08:00
draft: false
outline: [2, 3]
tags: ["八股文", "前端", "JavaScript", "CSS", "Vue", "React"]
categories: ["面试八股"]
---

# 代码随想录八股文笔记：前端篇

《代码随想录知识星球精华（最强八股文）第五版》共九册，本篇整理自其中的前端篇，覆盖 HTML、CSS、JavaScript、Ajax/Fetch/Axios、浏览器与网络、性能优化与安全，以及 Vue 和 React 两大框架。
原文以面试问答为主，整理时按主题重排为章节，逐题给出答案要点，对比类考点整理成表。原书中 Webpack 与 Node 两章仅有标题无正文、部分小节为外部链接形式，已如实标注或按通用知识补齐；内容为个人学习笔记，仅供学习参考。

::: details 完整目录（点击展开）

- [HTML](#html)
  - [DOCTYPE 的作用](#html-doctype)
  - [HTML 语义化](#html-semantic)
  - [meta 标签](#html-meta)
  - [HTML5 特性](#html-html5)
  - [src 和 href 的区别](#html-src-href)
  - [行内元素和块级元素](#html-inline-block)
  - [link 与 @import 的区别](#html-link-import)
  - [常见图片格式](#html-image-formats)
  - [iframe](#html-iframe)
  - [defer 和 async](#html-defer-async)
- [CSS](#css)
  - [基础](#css-basics)
  - [盒模型](#css-box-model)
  - [BFC](#css-bfc)
  - [浮动](#css-float)
  - [定位](#css-position)
  - [文档流](#css-document-flow)
  - [CSS 选择器](#css-selectors)
  - [CSS 属性继承](#css-inheritance)
  - [常考属性](#css-common-props)
  - [CSS3 新特性](#css-css3)
  - [flex 布局](#css-flex)
  - [常见布局](#css-layouts)
  - [响应式布局](#css-responsive)
  - [过渡与动画](#css-transition-animation)
  - [SCSS](#css-scss)
  - [CSS 性能优化](#css-performance)
- [JavaScript](#js)
  - [数据类型和运算符](#js-data-types-operators)
  - [数组](#js-array)
  - [对象](#js-object)
  - [函数](#js-function)
  - [this](#js-this)
  - [字符串](#js-string)
  - [DOM 和事件](#js-dom)
  - [异步解决方案](#js-async)
  - [内存管理与垃圾回收](#js-gc)
  - [其它零散考点](#js-misc)
  - [ES6](#js-es6)
- [Ajax、Fetch 与 Axios](#ajax)
  - [三者定位与对比](#ajax-compare)
  - [Axios 封装实践](#ajax-axios)
- [构建工具与 Node](#eng)
- [浏览器与网络](#bw)
  - [浏览器概述](#bw-overview)
  - [事件循环(重点)](#bw-eventloop)
  - [浏览器内核](#bw-engine)
  - [同源策略与跨域](#bw-cors)
  - [输入 URL 回车后发生了什么](#bw-url)
  - [HTTP 缓存与 HTTP/2](#bw-http)
  - [浏览器存储与鉴权](#bw-storage)
  - [浏览器执行机制](#bw-exec)
  - [性能优化](#bw-perf)
  - [前端安全](#bw-security)
  - [CDN](#bw-cdn)
  - [Web Worker 与 Service Worker](#bw-worker)
  - [微前端](#bw-micro)
- [Vue](#vue)
  - [Vue 基础](#vue-basics)
  - [组件](#vue-components)
  - [Vue-router](#vue-router)
  - [Vuex](#vue-vuex)
  - [虚拟 DOM](#vue-vdom)
  - [DIFF 算法](#vue-diff)
  - [Vue3](#vue3)
- [React](#react)
  - [基础语法](#react-basics)
  - [React 生命周期](#react-lifecycle)
  - [组件开发](#react-components)
  - [React Hooks](#react-hooks)
  - [状态管理](#react-state)
  - [路由](#react-router)
  - [React18 新特性](#react-18)
  - [虚拟 DOM](#react-vdom)
  - [Diff 算法](#react-diff)
  - [React 性能优化](#react-perf)
  - [Fiber](#react-fiber)
  - [dangerouslySetInnerHTML](#react-dangerouslysetinnerhtml)

:::

## HTML {#html}

### DOCTYPE 的作用 {#html-doctype}

DOCTYPE（document type，文档类型）声明用于告诉浏览器当前文档的类型，便于解析文档，必须声明在 HTML 文档的第一行；不同的渲染模式会影响浏览器对 CSS 代码甚至 JavaScript 脚本的解析。

| 模式 | 名称 | 行为 |
| --- | --- | --- |
| CSS1Compat | 标准模式（Standards mode，严格模式） | 按 W3C 标准解析渲染页面，以浏览器支持的最高标准呈现 |
| BackCompat | 怪异模式 / 混杂模式（Quirks mode），默认 | 以宽松的向后兼容方式显示页面 |

DOCTYPE 不存在或形式不正确，会导致 HTML 或 XHTML 文档以混杂模式呈现——相当于把渲染页面的权利交给浏览器，有多少种浏览器就有多少种展示方式，因此声明 DOCTYPE 是提高浏览器兼容性的第一步。

### HTML 语义化 {#html-semantic}

核心：根据内容的结构选择合适的标签。

优点：增加代码可读性、结构清晰，便于开发和维护；对机器友好，有利于 SEO（搜索引擎优化）；方便设备解析（如盲人阅读器），可用于智能分析；没有 CSS 样式时页面也能呈现良好的内容结构。

常见语义化标签：`header`（页眉，含网站标志、主导航、搜索框等）、`nav`（导航，仅对文档中重要的链接群使用）、`section`（文档中的节、区段）、`main`（页面主要内容）、`article`（独立于文档其余部分的内容）、`aside`（侧栏、广告、相关内容等）、`footer`（页脚，父级是 body 时才是整页页脚）、`address`（联系信息）、`title`（文档标题）。

### meta 标签 {#html-meta}

meta 标签用来描述 HTML 网页文档的属性（作者、日期时间、网页描述、关键词、页面刷新等），作用包括：搜索引擎优化（SEO）、定义页面使用语言、自动刷新并指向新页面、实现网页转换时的动态效果、控制页面缓冲、网页定级评价、控制网页显示的窗口等。

meta 的三种配置项：`name`（页面描述信息，常用取值 keywords 关键字、description 网站内容描述、author 作者、robots 机器人向导）；`http-equiv`（HTTP 标题信息，可代替 name 项，常用取值 expires 期限、pragma 缓存模式、refresh 刷新、set-cookie、window-target 显示窗口设定、content-type 字符集设定）；`content`（根据 name 或 http-equiv 项的定义决定填写什么字符串）。

### HTML5 特性 {#html-html5}

新增：新选择器 `querySelector` / `querySelectorAll`；媒体播放 `video`、`audio`（以前用 Flash 实现）；本地存储 localStorage 和 sessionStorage；浏览器通知 Notifications；语义化标签（header、nav、footer、section、article 等）；地理位置 Geolocation（涉及隐私，除非用户同意否则不可获取）；离线应用 manifest；全双工通信 WebSocket；浏览器历史对象 history；多任务处理 Web Worker（后台运行 JS，独立于其他脚本，不影响性能）；拖拽 API；增强表单控件（url、date、time、email、calendar、search）；页面可见性事件 visibilitychange；跨窗口通信 PostMessage；表单 FormData 对象；canvas 和 SVG。

移除：纯表现的元素（`basefont`、`big`、`center`、`font`、`s`、`strike`、`tt`、`u`）；对可用性产生负面影响的元素（`frame`、`frameset`、`noframes`）。

### src 和 href 的区别 {#html-src-href}

一句话结论：src 用于替换当前元素，指向的内容会嵌入文档；href 用于在当前文档和引用资源之间确立联系。

| 对比项 | src | href |
| --- | --- | --- |
| 全称 | source | Hypertext Reference |
| 语义 | 指向外部资源的位置，内容嵌入到当前标签所在位置 | 建立与当前元素（锚点）或当前文档（链接）之间的链接 |
| 加载行为 | 解析到该元素时会下载、解析、编译并执行，暂停整个页面加载 | 并行下载资源，不会停止对当前文档的处理 |
| 典型元素 | `script`、`img`、`iframe` | `a`、`link` |
| 本质 | 资源是必备的，最终会嵌入到页面中 | 资源的链接 |

这也是为什么 js 脚本建议放在底部而不是头部，而加载 CSS 建议使用 `link` 而不是 `@import`。

### 行内元素和块级元素 {#html-inline-block}

| 对比项 | 行内元素 | 块级元素 |
| --- | --- | --- |
| 占行 | 与其他元素都在一行上，一行可有多个 | 总是在新行上开始，独占一行 |
| 宽高 | 不可以设置，宽度只与内容有关，高度随字体大小改变 | 高度、行高、内外边距都可控制，宽度始终与浏览器宽度一样 |
| 边距 | 外边距、内边距只对左右起作用 | 四个方向都起作用 |
| 容纳 | 只能容纳文本或其他行内元素 | 可容纳内联元素和其他块元素 |

常见行内元素：`a`、`span`、`strong`、`b`、`em`、`del`、`img`、`input`、`select`；常见块级元素：`div`、`p`、`h1`~`h6`、`ul`、`ol`、`li`、`dl`；空元素：`br`、`hr`、`img`、`input`、`link`、`meta`。通过 `display` 转换：`block`（块级）、`inline`（行内）、`inline-block`（行内块）。

### link 与 @import 的区别 {#html-link-import}

| 对比项 | link | @import |
| --- | --- | --- |
| 从属关系 | HTML 提供的标签，除加载 CSS 外还可定义 RSS、rel 连接属性等 | CSS 提供的语法规则，只有导入样式表的作用 |
| 加载顺序 | 和 HTML 同时加载 | 页面加载完毕后才被加载 |
| 兼容性 | HTML 元素，不存在兼容性问题 | CSS2.1 才有的语法，IE5+ 才能识别 |
| DOM 可控性 | 可通过 JS 操作 DOM 插入 link 标签改变样式 | 无法用 @import 的方式通过 DOM 插入样式 |
| 权重 | 高于 @import | 较低 |

语法：`<link href="路径" rel="stylesheet" type="text/css" />` 与 `@import url(路径);`。总的来说 link 优于 @import：兼容性好，且 @import 在 DOM 树渲染完才加载，不能被 JavaScript 动态修改。

### 常见图片格式 {#html-image-formats}

| 格式 | 优点 | 缺点 | 使用场景 |
| --- | --- | --- | --- |
| GIF | 文件小，支持动画、透明，无兼容性问题 | 只支持 256 种颜色 | 色彩简单的 logo、icon、动图 |
| JPG | 色彩丰富，文件小 | 有损压缩，反复保存质量下降明显 | 色彩丰富的图片、渐变图像 |
| PNG | 无损压缩，支持透明，简单图片尺寸小 | 不支持动画，色彩丰富的图片尺寸大 | logo、icon、透明图 |
| WEBP | 文件小，支持有损和无损压缩、动画、透明 | 浏览器兼容性相对不好 | 支持 webp 格式的 app 和 webview |

### iframe {#html-iframe}

iframe 元素可以在一个网站里嵌入另一个网站的内容。优点：实现一个窗口同时加载多个第三方域名下的内容；增加代码复用性。缺点：搜索引擎无法识别；影响首页首屏加载时间；兼容性差。

限制页面被 iframe 嵌套的方式：一是设置 `X-Frame-Options` 响应头——`deny`（完全禁止任何网页嵌套）、`sameorigin`（只允许同源域名访问）、`allow-from url`（允许指定 url 的域名嵌套）；二是设置 `Content-Security-Policy`（CSP 内容安全策略，限定网页允许加载的资源，防范 XSS 攻击），如 `"frame-ancestors 'self'"` 限定 iframe 的嵌套；三是判断 `window.top`（页面顶级窗口）与自身窗口 `window.self` 是否相等，若不等则说明被嵌入了 iframe。

### defer 和 async {#html-defer-async}

defer 和 async 是 `script` 标签的两个属性，用于在不阻塞页面文档解析的前提下控制脚本的下载和执行。

背景——页面加载渲染过程：浏览器获取 HTML 从上到下解析构建 DOM，遇到外联样式和脚本声明会暂停解析并开始下载；样式下载完构建 CSSOM，脚本下载完解析执行后继续解析文档；文档解析完成后将 DOM 和 CSSOM 关联映射并渲染视图。脚本的下载和执行与文档解析同步，会阻塞文档解析，控制不好会造成页面卡顿。

共同点：都是异步加载外部脚本文件，不会阻塞页面的解析。

| 对比项 | defer | async |
| --- | --- | --- |
| 含义 | 延迟加载：下载与文档解析并行（仅加载不执行） | 异步加载：文档的加载渲染与脚本的加载执行并行 |
| 执行时机 | 文档所有元素解析完之后、load 和 DOMContentLoaded 事件之前 | 脚本文件一旦加载完成，立即解释执行 |
| 执行顺序 | 有顺序（按脚本出现顺序执行） | 无法预测，谁先下载好谁执行 |
| 适用场景 | 有前后依赖关系的脚本 | 相互独立的脚本 |

## CSS {#css}

### 基础 {#css-basics}

**为什么要初始化 CSS 样式**：一是消除浏览器之间的差异、提高兼容性（不同浏览器对一些标签的默认值可能不一样，不做初始化可能导致同一页面在不同浏览器展示效果不同）；二是提高代码质量，初始化后便于统一管理、减少重复样式。

**id 和 class 的区别**

1. 书写方式：id 选择符前缀为 `#`，class 选择符前缀为 `.`；
2. 唯一性：id 在一个页面中只能使用一次，class 可以反复使用；
3. 定位：id 用于区分不同结构和内容，class 作为样式可应用到任何结构和内容；布局原则上 id 先确定结构再定义样式，class 相反；
4. 注意：浏览器允许同页面出现多个相同 id 且一般能正常显示，但 JavaScript 通过 id 控制元素时会出错；实际应用中 class 常用在文字版块和页面修饰，id 多用在布局和包含框的样式。

**伪元素和伪类**：单冒号 `:` 用于伪类，双冒号 `::` 用于伪元素。伪类对选择元素的特殊状态修改样式（`:hover`、`:active`、`:checked`、`:focus`、`:first-child` 等）；伪元素对选择元素的指定部分修改样式（`::before`、`::after`、`::first-line`、`::first-letter` 等），`::before` 以一个子元素存在，只存在于页面中。

**单位**

| 单位 | 含义 |
| --- | --- |
| px | 固定像素单位，屏幕能显示的最小区域 |
| % | 宽高随浏览器变化，实现响应式；一般相对于直接父元素 |
| em | 作 font-size 单位时相对父元素字体大小，作其他属性单位时相对自身字体大小 |
| rem | CSS3 新增，相对于根元素字体大小；作用于根元素时相对其初始字体（16px） |
| vw / vh | 相对视口宽度 / 高度，视窗宽度为 100vw、高度为 100vh |
| rpx | 微信小程序独有（responsive pixel 动态像素），解决屏幕自适应 |

```css
.parent { font-size: 32px; }
.child {
  font-size: .5em; /* 相对父元素，16px */
  width: 2em;      /* 相对自身字体，32px */
}
html { font-size: 20px; }
p { font-size: 2rem; /* 相对根元素，40px */ }
```

rpx 换算：规定屏幕宽度为 750rpx。iPhone6 屏幕宽度 375px、750 个物理像素，则 750rpx = 375px，即 1px = 2rpx。

**block、inline、inline-block**：块级元素自动占据一行、可设置宽高（div、p、h1-h6、ul、li、form、table）；行内元素占一行的一小部分、多个水平排列、无法设置宽高（span、a、img）；行内块类似行内元素但可设置宽高（button、img、input、select、label、textarea）。

**link 标签的伪类**：`a:link` 链接未被访问时的状态（未设置超链接则无效）；`a:visited` 链接访问后的状态（针对 URL，两个 a 指向同一链接时点击一个另一个也是 visited）；`a:hover` 鼠标悬浮；`a:focus` 获得焦点（点击后刚松开）；`a:active` 点击中（鼠标未松开时）。书写顺序建议 link、visited、hover、focus、active。

**重排、重绘和合成**

核心结论：回流一定触发重绘，重绘不一定触发回流；重绘开销小，回流代价高。

- 回流 reflow（重排 layout）：渲染树中部分或全部元素的尺寸、结构或属性变化，浏览器重新渲染部分或全部文档；
- 重绘 repaint：元素样式（如颜色）改变但不影响其在文档流中的位置，跳过布局阶段直接进入绘制阶段；
- 合成：利用 `transform`、`opacity`、`filter` 实现 GPU 加速，避开布局、分块和绘制阶段。

触发回流的操作：初次渲染、窗口大小改变（resize）、元素属性 / 尺寸 / 位置 / 内容改变、字体大小变化、添加或删除可见 DOM 元素、激活 CSS 伪类（如 :hover），以及查询某些属性或方法：clientWidth / offsetWidth / scrollWidth 系列、`getComputedStyle()`、`getBoundingClientRect()`、`scrollTo()` 等——它们都会刷新渲染队列，要使用最好将值缓存起来。

优化手段：样式集中改变、使用添加新样式类名，不把 DOM 节点属性值放在循环里；使用 absolute 或 fixed 使元素脱离文档流；开启 GPU 加速（transform、opacity、will-change），改变位置用 translate 比改 left / top 更高效，transform 会为元素创建 GPU 图层在独立层中渲染；用 visibility 替换 display: none（前者只引起重绘，后者引发回流）；DOM 离线后修改（先 display: none 一次回流，修改完再显示）；不用 table 布局（小改动可能造成整个 table 重新布局）；动画速度越快回流次数越多，可用 requestAnimationFrame；CSS 选择符从右往左匹配查找，避免节点层级过多；频繁运行的动画变为图层以阻止该节点回流影响别的元素（如 video 标签浏览器自动变为图层）；通过 documentFragment 批量操作 DOM，完成后再添加到文档，只触发一次回流（现代浏览器有队列优化，效果可能不明显）。

### 盒模型 {#css-box-model}

**盒模型宽度的计算**：`box-sizing` 定义引擎如何计算元素的总高度和总宽度。

- `content-box`（默认值，标准盒模型）：width / height 只应用于内容区，不包含 padding 和 border；`offsetWidth = width + padding + border`，不算 margin；
- `border-box`（怪异盒模型）：width / height 包含内容区、padding 和 border，不算 margin；`offsetWidth = width`；
- `inherit`：从父元素继承 box-sizing 的值。

**margin 合并（外边距重叠 / 塌陷）**：块的上外边距和下外边距有时合并（折叠）为单个边距，大小取单个边距的最大值（相等时仅取其一），注意不同于高度塌陷。三种情形：同一层相邻元素之间（实际间距是二者 margin 的较大值而非相加）；没有内容将父元素和后代元素分开（子元素的外边距会"溢出"到父元素外面）；空的块级元素（自身上下外边距合并）。解决思路：把两个元素变成两个 BFC；父子重叠时给父元素触发 BFC、添加 border 或 padding。

**margin 负值问题**：margin-top、margin-left 是负值时元素自身向上或向左移动；margin-right 负值时右侧元素左移、自身不受影响；margin-bottom 负值时下侧元素上移、自身不受影响。

**margin 和 padding 的值为百分比时**：参考的是父元素的宽度，不管是上下还是左右方向（padding 同样）；若父元素没有宽度，则依次找父辈元素的宽度，均未设置时相对屏幕宽度。为什么是 width 而不是 height：正常流中大多数元素都足够高以包含其后代元素（包括外边距），如果上下外边距是父元素 height 的百分数，可能导致无限循环——父元素高度增加以适应后代外边距的增加，而外边距又随高度增加而增加。

### BFC {#css-bfc}

BFC（Block Formatting Context，块级格式化上下文）是 Web 页面可视 CSS 渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域；它是一块独立的布局环境，与外部互不影响。除 BFC 外还有 IFC（行级）、GFC（display: grid）、FFC（display: flex / inline-flex）；同一个元素不能同时存在于两个 BFC 中。

创建 BFC 的条件：根元素；float 值不为 none（left、right）；display 值为 inline-block、table-cell、table-caption、table、inline-table、flex、inline-flex、grid、inline-grid 等；position 值为 absolute、fixed；overflow 值不为 visible（即 auto、scroll、hidden）。

特点：是页面上的独立容器，里面的子元素不会影响外面的元素；垂直方向自上而下排列，与文档流排列方式一致；同一 BFC 下的相邻块级元素可能发生 margin 折叠，创建新的 BFC 可避免；BFC 区域不会与浮动容器发生重叠；计算 BFC 高度时，浮动元素参与计算；每个元素 margin box 的左边与包含块 border box 的左边相接触，即使存在浮动。

应用：解决 margin 重叠（把两个元素变成两个 BFC）；自适应两栏布局（左列浮动，右列 `overflow: hidden` 触发 BFC，即 float + overflow:hidden）；清除浮动、解决父元素高度塌陷；解决父子元素外边距重叠（父元素触发 BFC、添加 border 或 padding）。

### 浮动 {#css-float}

浮动元素不在文档流中，文档流的块框表现得像浮动框不存在：块级元素认为浮动元素不存在，浮动元素会影响行内元素的布局，并通过行内元素间接影响包含块的布局。

摆放规则：尽量靠上、尽量靠左（或右）、尽量一个挨一个、可能超出包含块、不能超过所在行的最高点、行内元素绕着浮动元素摆放。带来的问题：父元素的高度无法被撑开（高度塌陷）；与浮动元素同级的非浮动元素会紧随其后。

清除浮动的方法：父级 div 定义 height；最后一个浮动元素后加空 div 标签并设置 `clear: both`（不推荐）；父级定义 zoom；父级添加 `overflow: hidden / auto`；浮动元素的容器添加浮动（不推荐，会使整体浮动影响布局）；::after 伪元素清除浮动（推荐）；before 和 after 双伪元素清除浮动。总结为三类：clear 属性、BFC、::after 伪元素。

```css
/* 1. 父级标签定义伪类（推荐） */
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
/* 兼容 IE 低版本 */
.clearfix { *zoom: 1; }
/* 2. 父级标签 overflow */
.clearfix { overflow: hidden; }
```

**圣杯布局和双飞翼布局**：实现 PC 端三栏布局，中间一栏最先渲染，两边宽度固定、中间自适应；核心都是三栏通过 float 浮动，再通过负值 margin 调整。

| 对比项 | 圣杯布局 | 双飞翼布局 |
| --- | --- | --- |
| HTML 结构 | 一个容器包裹三栏 | 只包裹中间一栏 |
| 是否定位 | 需要相对定位 | 无需定位 |
| 左右栏的空间 | 容器使用 padding 预留 | 中间栏内容使用 margin 预留 |
| 左 / 右栏处理 | position + margin-left / margin-right | 均为 margin-left |

```css
/* 圣杯布局关键代码 */
.container { padding: 0 200px; }
.main, .left, .right { float: left; }
.main  { width: 100%; }
.left  { width: 200px; margin-left: -100%; position: relative; right: 200px; }
.right { width: 200px; margin-right: -200px; }
/* 双飞翼布局：main 内再加一层内容 div 用 margin 避开遮挡，无需相对定位 */
.wrapper, .left, .right { float: left; }
.wrapper { width: 100%; }
.wrapper .main { margin-left: 200px; margin-right: 200px; }
```

圣杯的缺点是需要多加一层标签、html 顺序不对、占用布局框的 margin 属性；双飞翼是圣杯的改进方案。

### 定位 {#css-position}

- relative：相对自身之前正常文档流中的位置偏移，原来的位置仍被占据，偏移时可能覆盖其他元素；典型用法"子绝父相"；
- absolute：元素框不再占有文档位置，相对于包含块偏移（包含块即最近一级 position 不为 static 的外层元素，都没有则相对 body）；
- fixed：不再占有文档流位置，相对于视窗定位；注意当祖先的 transform 非 none 时，会相对该祖先定位；
- static：默认值，取消继承，top 等偏移属性无效；
- sticky：CSS3 新增，粘性定位，相当于 relative 和 fixed 的混合——最初当作 relative 相对原位置偏移，超过一定阈值后当作 fixed 相对视口定位；
- inherit：继承父元素的 position 值。

### 文档流 {#css-document-flow}

普通流其实就是 BFC 中的 FC（Formatting Context，格式化上下文）——页面中的一块渲染区域，有一套渲染规则，决定其子元素如何布局以及和其他元素的关系。

- 普通流：元素按 HTML 中的先后位置自上而下布局；行内元素水平排列，直到当行占满换行，块级元素渲染为完整的新行；除非另外指定，所有元素默认都是普通流定位；
- 浮动流：元素先按普通流的位置出现，再根据浮动方向尽可能向左或向右偏移，效果与印刷排版中的文本环绕相似；
- 定位流：position 为 absolute 或 fixed 的元素整体脱离普通流，不会对兄弟元素造成影响，位置由 top、bottom、left、right 坐标决定。

### CSS 选择器 {#css-selectors}

CSS 样式类型：行内样式（标签 style 属性）、内部样式（`<style>` 标签）、外部样式（`<link>` 或 @import 引入）。

**常见选择器种类**

| 类别 | 示例 | 说明 |
| --- | --- | --- |
| 类选择器 | `.intro`、`.name1.name2` | 选择对应 class 的元素；多类为同时含两个类名 |
| 后代选择器 | `.name1 .name2`、`div p` | 后代关系 |
| id 选择器 | `#firstname` | 选择对应 id 的元素 |
| 标签 / 并集 / 通配选择器 | `p`、`p.intro`、`div, p`、`*` | 所有 p / class 为 intro 的 p / 所有 div 和 p / 所有元素 |
| 子选择器 | `div > p` | 父元素是 div 的所有 p |
| 相邻 / 通用兄弟选择器 | `div + p`、`p ~ ul` | 紧跟 div 的首个 p / 前面有 p 的每个 ul |
| 属性选择器 | `[target]`、`[target=_blank]`、`[href^="https"]`、`[href$=".pdf"]`、`[href*="abc"]` | 按属性存在、等于、前缀、后缀、包含子串匹配 |
| 伪类选择器 | `:hover`、`:first-child`、`:nth-child(n)`、`:checked` 等 | 元素的特殊状态 |
| 伪元素选择器 | `::before`、`::after`、`::first-letter`、`::first-line` | 元素的指定部分 |

**优先级与权重计算**

样式表来源不同时，优先级顺序为：内联样式 > 内部样式 > 外部样式 > 浏览器用户自定义样式 > 浏览器默认样式。

| 选择器 | 格式示例 | 优先级权重 |
| --- | --- | --- |
| 内联样式 | style="..." | 1000 |
| id 选择器 | `#id` | 100 |
| 类 / 属性 / 伪类选择器 | `.classname`、`a[ref="eee"]`、`li:last-child` | 10 |
| 标签 / 伪元素选择器 | `div`、`li::after` | 1 |
| 通配符、子 / 后代 / 相邻兄弟选择器 | `*`、`ul > li`、`li a`、`h1 + p` | 0 |

比较规则：从左往右逐位比较，较大者胜出，相等则继续右移；四位全部相等时，后出现的样式覆盖前面的。其他注意：`!important` 优先级最高但会破坏级联规则，应避免使用；优先级相同时最后出现的样式生效，继承得到的样式优先级最低；权值计算基于选择器的形式，`[id=p33]` 被视为属性选择器（权值 10）；通配符、关系选择符（`+ > ~` 空格）和 `:not()` 本身对优先级没有影响，但 `:not()` 内部声明的选择器会影响优先级；CSS 选择符从右往左匹配查找，避免节点层级过多。

```css
p { color: red; }                   /* 标签，权值 1 */
p span { color: green; }            /* 两个标签，权值 1+1=2 */
a:hover { }                         /* 标签和伪类，权值 1+10=11 */
p span .warning { color: purple; }  /* 权值 1+1+10=12 */
#footer .note p { color: yellow; }  /* 权值 100+10+1=111 */
p { color: red !important; }        /* 优先级最高 */
```

### CSS 属性继承 {#css-inheritance}

- 继承属性：元素未指定值时，取父元素同属性的计算值；非继承属性：元素未指定值时，取属性的初始值；
- 可继承的属性：字体系列属性（font-family、font-weight、font-size、font-style 等）、文本系列属性（text-indent、text-align、line-height、word-spacing、letter-spacing、text-transform、direction、color）、元素可见性（visibility）、表格布局属性、列表布局属性（list-style 系列）、光标属性（cursor）；
- 不可继承的属性：display、盒子模型属性（width、height、margin、padding、border 系列）、背景属性、定位属性（float、clear、position、top / right / bottom / left、min / max-width / height、overflow、z-index）、生成内容属性（content 等）、轮廓样式属性（outline 系列）、页面样式属性等；
- 补充：内联元素可以继承字体系列属性以及除 text-indent、text-align 之外的文本系列属性；块级元素可以继承 text-indent、text-align。

**line-height 如何继承**：父元素写具体数值（如 30px）时子元素继承该值；写比例（如 1.5）时子元素继承该比例，再按自身 font-size 计算；写百分比（如 200%）时子元素继承的是父元素 fontSize × 200% 计算出来的值。

### 常考属性 {#css-common-props}

**CSS 隐藏元素的方法**

- `display: none`：渲染树不包含该渲染对象，不占据位置，不响应绑定事件，会导致重排和重绘；
- `visibility: hidden`：仍占据空间，不响应绑定事件，不重排但会重绘；
- `opacity: 0`：透明度设为 0，仍占据空间，能响应绑定事件；不引发重排（若利用 animation 对 opacity 做变化，只触发 GPU 层面的 composite，不触发重绘）；
- `position: absolute`（移出可视区域，不影响页面布局）、`z-index: 负值`（被其他元素遮盖）、`clip / clip-path`（裁剪）、`transform: scale(0, 0)`（缩放为 0，不触发重排）——均仍占据位置、不响应绑定事件；
- 设置 height / width 为 0：元素内有子元素时应配合 `overflow: hidden`，不占据空间、不响应点击事件。

（Vue 中还有 v-if 和 v-show 两个指令与之对应。）

三者综合对比（display: none / visibility: hidden / opacity: 0）：

| 对比项 | display: none | visibility: hidden | opacity: 0 |
| --- | --- | --- | --- |
| 页面中是否存在 | 不存在 | 存在 | 存在 |
| 重排 | 会 | 不会 | 不会 |
| 重绘 | 会 | 会 | 不一定 |
| 自身绑定事件 | 不触发 | 不触发 | 可触发 |
| transition | 不支持 | 支持 | 支持 |
| 子元素可复原 | 不能 | 能 | 不能 |
| 被遮挡的元素可触发事件 | 能 | 能 | 不能 |

**display: none 与 visibility: hidden 的区别**：一是是否在渲染树中——前者让元素完全从渲染树中消失，渲染时不占据任何空间，后者不会从渲染树消失，仍占据相应空间只是内容不可见；二是是否是继承属性——前者是非继承属性，子孙节点随父节点从渲染树消失，修改子孙节点的属性也无法显示，后者是继承属性，设置 `visibility: visible` 可让子孙节点重新显示；三是渲染代价——修改 display 通常造成文档的重排，修改 visibility 只会造成本元素的重绘；四是读屏器——前者的内容不会被读取，后者的内容会被读取。两者的关系类似于 v-if 和 v-show。

**opacity 与 rgba 的区别**：opacity（取值 0~1）作用于元素以及元素内所有内容的透明度，子元素会继承；rgba 的 A（Alpha）只作用于元素的颜色或其背景色，其后代元素不会继承不透明属性。

**文本溢出**

单行溢出省略需要三个属性配合：

```css
.ellipsis {
  overflow: hidden;         /* 隐藏超出限定宽度的内容 */
  white-space: nowrap;      /* 文字在一行显示不能换行，是生效的基础 */
  text-overflow: ellipsis;  /* 溢出时显示省略号 */
}
```

text-overflow 的属性值：clip（溢出部分裁掉）、ellipsis（溢出时显示 ...）。多行溢出：基于高度截断可用伪元素 + 定位（伪元素绝对定位到行尾遮住文字，配合 overflow: hidden 隐藏多余文字；兼容性好、响应式截断）；基于行数截断可用 line-clamp 类方案。

**background-size**：设置背景图片大小。100% 为整个图片铺满 div；cover 缩放图片以完全覆盖背景区，可能图片部分看不见（尽可能大地缩放并保持宽高比例不压扁，大小不同时图片的左/右或上/下部分被裁剪）；contain 缩放图片以完全装入背景区，可能背景区部分空隙，空白区域显示 background-color；auto 不能铺满整个 div，按图片比例缩放。

**z-index**：取值为数字无单位、auto（默认，和父元素一样的层叠等级）、整数、inherit。层叠上下文和层叠等级：每个网页默认创建一个层叠上下文（即 html 元素），其所有子元素都位于该上下文中的某个层叠等级；将元素的 z-index 设置为非 auto 时，会创建一个新的层叠上下文，独立于其他层叠上下文。一个层叠上下文从低到高的 7 个层叠等级：背景和边框；z-index 为负数；block 盒模型（正常文档流，块级，非定位）；float 盒模型（浮动，非定位）；inline 盒模型（正常文档流，内联，非定位）；z-index = 0；z-index 为正数（数值越大越靠上）。

压盖顺序：自定义压盖顺序使用 z-index，但只有定位元素（position 为 absolute、fixed 或 relative）可使用；z-index 值相同时 HTML 结构中后面的压盖前面的；父子都有 z-index 时，父元素数值小，儿子数值再大也没用。

**client、offset、scroll**

- client 系列（与可视区有关）：clientWidth / clientHeight（内容及其内边距占据的空间，不含边框和滚动条）、clientTop / clientLeft（上 / 左边框宽度）；
- offset 系列（与自身有关）：offsetWidth / offsetHeight（border + padding + content）、offsetTop / offsetLeft（到有定位的父盒子顶部 / 左侧的距离）、offsetParent（只读，返回最近的包含该元素的定位元素，没有则为最近的 table、td、th 或 body，display 为 none 时返回 null）；
- scroll 系列（滚动相关）：scrollWidth / scrollHeight（元素内容的实际大小）、scrollLeft / scrollTop（当前滚动距离，也可设置滚动位置，设为 0 可重置）；事件对象 e.clientX / e.clientY 为鼠标距离可视区左侧 / 顶部的距离。

共同点：返回数字均不带单位，且都是只读。

### CSS3 新特性 {#css-css3}

1. 新增选择器（如 `p:nth-child(n)`）；文字溢出 `text-overflow: clip / ellipsis`；
2. 弹性盒模型：`display: flex`（弹性布局）、`display: grid`（栅格布局）；
3. 渐变：`linear-gradient(red, green, blue)` 线性渐变、`radial-gradient(...)` 径向渐变；
4. 边框：`border-radius`（圆角）、`box-shadow`（阴影）、`border-image`（图片边框）；
5. 背景：`background-clip`（背景画区）、`background-origin`（背景图片对齐）、`background-size`（背景图片大小）、`background-break`；多列布局 `column-count`；
6. transform 转换：translate（位移）、scale（缩放）、rotate（旋转）、skew（倾斜）；
7. animation 动画：animation-name、animation-duration、animation-timing-function（时间函数）、animation-delay（延迟）、animation-iteration-count（执行次数，可为 infinite）、animation-direction（执行方向）、animation-play-state（播放状态）、animation-fill-mode（填充模式）；
8. 媒体查询（@media）、混合模式等。

实际开发中大量使用：处理文字溢出用 text-overflow，文字需要突破 12px 限制可用 `transform: scale(0.5)`。

### flex 布局 {#css-flex}

弹性布局，可以简便、完整、响应式地实现各种页面布局，为盒模型提供最大的灵活性。由父容器和子容器构成，通过主轴和交叉轴控制子容器排列布局；设置为 flex 后，子元素的 float、clear 和 vertical-align 属性失效。

父容器属性：`flex-direction` 决定主轴方向（子元素排列方向），row | row-reverse | column | column-reverse；`flex-wrap` 决定主轴排不下时项目是否可换行，nowrap | wrap | wrap-reverse（默认不换行，也不会任由元素溢出容器，会涉及弹性伸缩）；`flex-flow` 是前两者的简写，默认值 row nowrap；`justify-content` 定义项目在主轴上的对齐方式，flex-start（默认，左对齐）| flex-end | center | space-between（两端对齐，项目之间间隔相等）| space-around（每个项目两侧间隔相等）；`align-items` 定义项目在交叉轴上的对齐方式，flex-start | flex-end | center | baseline（第一行文字的基线对齐）| stretch（默认，未设置高度或 auto 时占满容器高度）；`align-content` 定义多根轴线的对齐方式，项目只有一根轴线时不起作用。

子容器属性：`order` 排列顺序，越小越靠前，默认 0；`flex-grow` 放大比例（容器宽度 > 元素总宽度时如何伸展），默认 0 即不放大，全为 1 时等分剩余空间，之和小于 1 时只能按比例分配部分剩余空间，容器宽度正好等于元素宽度总和时无论什么值都不生效；`flex-shrink` 缩小比例（容器宽度 < 元素总宽度时如何收缩），默认 1 即空间不足时等比例缩小，为 0 的项目不缩小；`flex-basis` 分配多余空间前占据的主轴空间（flex-grow 和 flex-shrink 生效前的初始尺寸），默认 auto；`flex` 是前三者的简写，默认 0 1 auto，优先使用 flex 而不是单独写三个分离的属性，浏览器会推算相关值；`align-self` 允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items，默认 auto 表示继承父元素的 align-items。

常用简写：`flex: 1` = `1 1 0%`（等分剩余空间）、`flex: 2` = `2 1 0%`、`flex: auto` = `1 1 auto`、`flex: none` = `0 0 auto`（常用于固定尺寸不伸缩）。居中用法：垂直居中 `align-items: center`，水平居中 `justify-content: center`。

### 常见布局 {#css-layouts}

**两栏布局（左边固定，右边自适应）**

1. flex 布局：左边元素固定宽度 200px，右边元素设置 `flex: 1`；
2. 浮动 + margin：左边元素固定宽度且向左浮动，右边 `margin-left: 200px`，宽度 auto 撑满父元素；
3. 浮动 + BFC：左边固定宽度左浮动，右边设置 `overflow: hidden` 触发 BFC，BFC 区域不会与浮动元素重叠（左列浮动使自身高度塌陷，右列利用流特性占满整行再被 BFC 隔开）；
4. 绝对定位：父级相对定位，左边 absolute 定位宽度固定，右边 margin-left 设为左边宽度；或右边 absolute、left 为左边宽度、其余方向为 0（有歧义，谨慎使用）；
5. inline-block + calc：`.left { display: inline-block; width: 240px; }`、`.right { display: inline-block; width: calc(100% - 240px); }`；也可用 grid 布局。

**三栏布局（两侧固定，中间自适应）**

1. flex 弹性布局：左右两栏固定大小，中间一栏 `flex: 1`；
2. grid 栅格布局：`grid-template-columns: 300px 3fr 300px`；fr 定义网格轨道大小的弹性系数，按比例分配剩余可用空间；布局思维新颖，缺点是兼容性；
3. float 布局：两边 float（左栏左浮动、右栏右浮动）+ 中间 margin（如 `margin: 0 300px`）；缺点是 html 结构不正确，包含区域宽度小于左右框之和时右框会被挤下来，且需清除浮动（float 脱离文档流造成高度塌陷）；
4. BFC 布局：中间栏设置 `overflow: hidden` 变成 BFC，就不会和浮动元素发生重叠；
5. table 布局：容器 `display: table`、三栏 `display: table-cell`；实现简单但相对繁琐、代码量大，且一个格子超出高度后两侧会一起变高；
6. 圣杯布局 / 双飞翼布局（见「浮动」小节）；
7. 定位布局：子绝父相，左右两栏 absolute + 中间一栏 margin；快捷方便、不易出问题，但绝对定位脱离文档流，有效性和可用性较差；也有三栏均 absolute + left / right 的方案。

```css
/* flex 三栏 */
.flex { display: flex; }
.left, .right { width: 300px; /* flex-shrink: 0; 不缩小 */ }
.center { flex: 1; /* flex-grow: 1; 增大 */ }
/* grid 三栏 */
.grid { display: grid; grid-template-columns: 300px 1fr 300px; }
```

**居中方案**

- 水平居中：行内元素给父元素设置 `text-align: center` 或 `display: flex; justify-content: center`；块级元素定宽用 `margin: 0 auto`；绝对定位 + `left: 50%` + margin 负值（自身一半宽度）；flex / grid 布局；
- 垂直居中：单行文本（父元素高度确定）height === line-height；多行文本（父元素高度确定）`display: table-cell; vertical-align: middle`；
- 水平垂直居中常见方式：
  1. flex：`display: flex; justify-content: center; align-items: center`，兼容性好；grid + align-items 次之（兼容性相对较差）；
  2. absolute + transform：先 `top: 50%; left: 50%` 将子元素左上角移到父元素中心，再 `transform: translate(-50%, -50%)` 往左往上平移自身 50% 宽高；不定宽高适用，不会触发重排，最常用；
  3. absolute + margin: auto：`position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto`，定宽高适用，对应方向平分；
  4. absolute + margin 负值：`top: 50%; left: 50%` 再以自身一半宽高负值赋值，定宽高适用；
  5. table 布局：`display: table-cell; text-align: center; vertical-align: middle`（css-table 有 PC 兼容性要求，宽高不固定，推荐）；以及 writing-mode: vertical-lr 等文字类方案。

**CSS 画三角形**（原文该小节仅列出标题，以下为通用实现思路）

利用 border 实现：宽高设为 0，四边 border 设为透明，保留其中一边的颜色。

```css
.triangle {
  width: 0;
  height: 0;
  border: 50px solid transparent;
  border-bottom-color: red; /* 保留底边颜色，得到向上的三角形 */
}
```

**1px 问题（移动端细线）**

设计稿中的 1px，代码要实现 0.5px：由于 dpr 的存在，直接写 1px 会渲染偏粗。常见方案：

1. 伪元素 + 缩放：用 200% 尺寸的伪元素画 1px 边框再 scale(0.5)，避免直接写小数像素带来的不同手机兼容性差异；
2. 动态 viewport + rem（flexible 方案，已弃用：根据 dpr 动态修改 initial-scale，动态修改 viewport 统一使用 rem 布局）；
3. vw 单位适配（未来推荐）。

```css
/* 伪元素实现 0.5px border */
.border::after {
  content: "";
  box-sizing: border-box;   /* 为了与原元素等大 */
  position: absolute;
  left: 0; top: 0;
  width: 200%; height: 200%;
  border: 1px solid red;
  transform: scale(0.5);
  transform-origin: 0 0;
}
```

可配合媒体查询按 dpr 适配：`@media (-webkit-min-device-pixel-ratio: 2)` 内 scale(0.5)，dpr 为 3 时 scale(0.333)。总结：老项目整体修改 viewport 成本过高，采用伪元素方案处理；新项目可动态设置 viewport 一键解决适配。

**Chrome 支持 12px 以下文字**：Chrome 中 font-size 有最小值 12px（不同操作系统、语言可能不一样），低于 12px 的一律按 12px 显示（Chrome 认为低于 12px 的中文对人类不友好），但可以设置为 0。实现更小文字的方式：`zoom: 0.8`（"变焦"，改变页面上元素的尺寸，属于真实尺寸；非标准属性有兼容问题，缩放会改变元素占据空间大小、触发重排）；`-webkit-transform: scale(0.8)`（针对 Chrome 使用 webkit 前缀，只对可以定义宽高的元素生效，配合 `display: inline-block`，不改变页面布局）；`-webkit-text-size-adjust: none`（设定文字大小是否根据设备自动调整，取值 percentage、auto 默认自动调整、none 不自动调整）。

### 响应式布局 {#css-responsive}

原理：页面的设计和开发根据用户行为和设备环境进行调整和响应（"Content is like water"）。通常配合 viewport meta 标签：

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

viewport 属性：width=device-width（自适应手机屏幕宽度）、initial-scale（初始缩放）、maximum-scale（缩放比例最大值）、user-scalable（用户是否可以缩放）、viewport-fit=cover（缩放以填充满屏幕）。

实现方式：媒体查询（针对不同的媒体类型定义不同的样式，重置浏览器窗口大小时页面会根据宽度和高度重新渲染）、百分比（组件的宽和高随浏览器变化而变化）、vw / vh、rem。响应式设计通常从以下几方面思考：弹性盒子和媒体查询等；百分比布局创建流式布局的弹性 UI，同时用媒体查询限制元素尺寸和内容变更范围；相对单位使内容自适应调节。

缺点：仅适用于布局、信息、框架并不复杂的网站；兼容各种设备工作量大、效率低下；代码累赘，出现隐藏无用的元素，加载时间加长；一定程度上改变了网站原有的布局结构。

**px、em、rem、vh、vw 的区别及使用场景**

| 单位 | 相对基准 | 特点 |
| --- | --- | --- |
| px | 屏幕分辨率 | 固定大小，设置后无法适应页面大小变化 |
| em | 当前对象内文本的字体大小（父元素） | 未设置字体大小时相对浏览器默认 16px，即 1em = 16px；为便于运算可在 body 声明 font-size: 62.5% 使 1em = 10px |
| rem | 根元素字体大小 | 只需在根元素确定一个参考值，只修改根元素就能成比例调整所有字体大小 |
| vw / vh | 视口宽度 / 高度 | 视口大小分为 100 份，50vw 即窗口宽度的一半，窗口变化随之改变 |

使用场景：设置边框和边距时用 px 较好，需要做响应式的页面用 rem 较便捷，具体根据业务来定。

**rem 布局**：rem 单位相对于根元素 html 的 font-size 决定大小，根元素的 font-size 提供了一个基准——当页面的 size 发生变化时，只需改变 font-size 的值，以 rem 为固定单位的元素大小也会相应变化。

### 过渡与动画 {#css-transition-animation}

前端实现动画的方式：JavaScript 直接实现、SVG、CSS3 transition、CSS3 animation、Canvas、requestAnimationFrame。

**transition 和 animation**

| 对比项 | transition | animation |
| --- | --- | --- |
| 本质 | 过渡动画，不能实现独立的动画 | 真正意义上的 CSS3 动画 |
| 触发方式 | 只能在某个标签元素样式或状态改变时进行平滑的效果过渡，而不是马上改变 | 通过对关键帧和循环次数的控制自动运行 |
| 能力 | 依赖样式变化触发，能力有限 | 可实现复杂动画效果，摆脱 JS 控制，能利用硬件加速 |

animation 常用属性：animation-name（绑定动画规则）、animation-duration（持续时间）、animation-delay（延迟时间）、animation-iteration-count（运行次数，可为 infinite）、animation-direction（向前、向后还是交替播放）、animation-timing-function（速度曲线）、animation-fill-mode（默认 CSS 动画不会在第一个关键帧之前或最后一个关键帧之后影响元素，该属性可覆盖此行为）、animation（简写）。

```css
@keyframes example {
  from { background-color: red; }
  to   { background-color: yellow; }
}
/* 动画持续 4 秒，背景色从 red 逐渐变为 yellow */
div {
  width: 100px; height: 100px;
  animation-name: example;
  animation-duration: 4s;
}
```

其他实现方式：JavaScript 直接实现（对元素样式渐进式变化编程完成，由定时器 / 绘图函数调用；频繁重排重绘消耗性能，且 JS 在浏览器主线程运行，会被其他脚本、样式计算、布局、绘制任务干扰导致丢帧）；SVG 可伸缩矢量图形（可控制动画延时、属性连续改变、颜色变化、缩放旋转等几何变化、元素移动路径；SVG 是对图形的渲染，HTML 是对 DOM 的渲染）；CSS3 transition（移动端直接使用会让页面变慢甚至卡顿，通常添加 `transform: translate3D(0,0,0)` 或 `translateZ(0)` 开启 GPU 加速）；Canvas（H5 新增元素，借助 Web API 实现动画，只有 width 和 height 两个属性）；requestAnimationFrame（按系统刷新的节奏调用，一帧一般 16ms，性能更好；将动画每一步传入 rAF，执行完后异步回调连续触发）。

**JavaScript 动画与 CSS 动画**

| | JavaScript 动画 | CSS 动画 |
| --- | --- | --- |
| 优点 | 过程可控，可实现暂停、返回、加速等任何效果；动画效果丰富，可根据绘图函数实现任意效果；兼容性好 | 浏览器可对动画优化：集中所有 DOM 一次重绘重排，刷新频率和浏览器一致；代码简单方便调试；不可见元素不参与重排，节约 CPU；可使用硬件加速（GPU） |
| 缺点 | 在浏览器主线程运行，受其他任务干扰可能阻塞造成丢帧；代码复杂度高于 CSS 动画 | 运行过程控制较弱，无法附加事件绑定回调函数；代码冗长 |

### SCSS {#css-scss}

常用特性：嵌套（选择器可嵌套书写，编译后展开为后代选择器）；定义变量（用 `$` 定义并复用，如 `$baseColor: red;`）；混合（`@mixin` 定义可复用的样式块，`@include` 引入，可传参数）；继承（`@extend` 让一个选择器继承另一个选择器的样式）。

```scss
$baseColor: red;

@mixin box-sizing($sizing) {
  -webkit-box-sizing: $sizing;
  -moz-box-sizing: $sizing;
  box-sizing: $sizing;
}

.box-border {
  border: 1px solid red;
  @include box-sizing(border-box);
}
```

编译结果为带浏览器前缀的普通 CSS，减少重复代码。

### CSS 性能优化 {#css-performance}

CSS 性能优化的 8 个技巧：内联首屏关键 CSS；异步加载 CSS；资源压缩；合理使用选择器；减少使用昂贵的属性；不要使用 @import；CSS 雪碧图；小图片转为 BASE64 编码。

## JavaScript {#js}

### 数据类型和运算符 {#js-data-types-operators}

覆盖类型体系、类型判断、隐式转换与浮点数精度，是 JavaScript 笔试的高频考点。

#### 有哪些数据类型

- 原始类型：`Undefined`、`Null`、`Boolean`、`Number`、`String`，ES6 新增 `Symbol` 和 `BigInt`。Symbol 代表独一无二的值，最大用法是为对象定义唯一的属性名；BigInt 可表示任意大小的整数，用于安全存储和操作大整数。
- 引用类型：`Object`（包括 `Date`、`Array`、`RegExp` 等）。常用数值处理：`Math.floor` 向下取整、`Math.ceil` 向上取整、`Math.round` 四舍五入、`Math.abs` 绝对值、`toFixed(2)` 按位数四舍五入、`String()` 转字符串。

#### 判断数据类型

核心结论：`typeof` 判基本类型、`instanceof` 判引用类型、`Object.prototype.toString.call` 判内置类型最准确。

| 方式 | 适用范围 | 局限 |
| --- | --- | --- |
| `typeof` | 基本类型（null 除外）、function | `typeof null` 返回 "object"；引用类型无法细分 |
| `instanceof` | 引用类型 | 不能判断基本类型，`2 instanceof Number` 为 false |
| `constructor` | 基本类型和引用类型 | null/undefined 无 constructor；重写 prototype 后不稳定，会默认指向 Object |
| `Object.prototype.toString.call` | 所有内置类型，返回 `[object Xxx]` | 最准确，但无法细分自定义实例对象 |

- `typeof null` 为 "object"：JS 最初版本用 32 位存储变量，类型标志存在低位，`000` 开头代表对象，null 的二进制全为 0，被误判。
- `instanceof` 原理是沿原型链查找，判断构造函数的 `prototype` 是否出现在对象的原型链上，也可判断实例是否属于其父类型或祖先类型。
- `Object.prototype.toString` 必须配合 `call`：大多数对象实现了自身的 `toString`，会终止原型链查找，`call` 强制以目标对象为 this 执行 Object 原型上的版本。

```js
function myInstanceof(L, R) {
  let proto = Object.getPrototypeOf(L);
  const prototype = R.prototype;
  while (true) {
    if (proto === null) return false;
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}
```

#### 类型转换

核心结论：对象转基本类型先查 `valueOf` 再查 `toString`；转布尔为 false 的值只有七个。

- 对象转字符串/数字：先取 `valueOf` 的结果，不是基本类型再取 `toString`；两者都返回对象则抛 `TypeError`；`Object.create(null)` 创建的对象没有这两个方法，转换直接报错；显式转换用 `String(obj)`、`Number(obj)`。
- 转布尔为 false 的值只有 `null`、`undefined`、`false`、`+0`、`-0`、`NaN`、`""`，其余都是真值。隐式转布尔的场景：`if` 条件、`for` 第二个表达式、`while`/`do...while` 条件、三目运算符条件、`||` 和 `&&` 的左操作数。
- 常见结果：`Number('')` 为 0、`Number(null)` 为 0、`Number(undefined)` 为 NaN、`Number([])` 为 0（`[]` 先 toString 得空串再转数字）。隐式转字符串用 `x + ""`（`+` 有一侧是字符串就拼接）；隐式转数字用 `+'2'`、`'2' - 0`、`'2' * 1`，非法字符结果为 NaN。

`==` 类型不同时的比较规则：

1. 字符串和数字比较，字符串先转数字；布尔和其他类型比较，布尔先转数字。
2. 对象和非对象比较，对象先按转数字的流程转为基本类型。
3. `null == undefined` 为 true，且它们与任何其他类型都不相等。
4. 两个对象比较，判断的是引用是否相同。

经典输出：`NaN == NaN` 为 false、`-0 == +0` 为 true、`"0" == false` 为 true、`false == []` 为 true、`0 == []` 为 true。

#### parseInt 与 parseFloat

核心结论：`+` 和 `Number()` 是严格转换，值不完全可转数字就失败；`parseInt`/`parseFloat` 是宽松的"读取数字"。

- `parseInt(string, radix)` 逐字符解析，遇到不能转换的字符就停下；radix 取值 2~36，省略或为 0 时按十进制，`0x`/`0X` 开头按十六进制，超范围返回 NaN；`parseFloat()` 把值转换成浮点数，没有基模式。
- 示例：`parseInt("100px")` 为 100、`parseInt("a123")` 为 NaN、`parseFloat("12.3.4")` 为 12.3、`parseInt('ff', 16)` 为 255、`parseInt('2n9c', 36)` 为 123456。

#### 浮点数精度：0.1 + 0.2 为什么不等于 0.3

核心结论：JS 数字采用 IEEE 754 双精度存储（1 位符号 + 11 位指数 + 52 位尾数），0.1 的二进制无限循环超出 52 位尾数被截断，只能存近似值；对阶相加再次截断，结果为 `0.30000000000000004`。

- 双精度浮点数求和分三步：对阶（指数位不同时对齐，遵守"小阶向大阶看齐"原则，尾数右移一位指数加 1）、尾数求和（可能产生进位）、规格化与舍入（进位则阶码加 1，超出有效位数的尾数按 0 舍 1 入处理）。
- 十进制小数转二进制用"乘 2 取整，顺序排列"：用 2 乘小数取出积的整数部分，再用 2 乘余下的小数部分，直到小数部分为 0 或达到精度要求，先取的整数作为高位。如 0.5 转为 `0.1`；而 0.1 转二进制是 `0.000110011...`（0011 无限循环），无法精确表示。精度损失的三个来源：转二进制时截断、对阶时小阶尾数右移截断、求和结果超过 53 位有效数字被截断。解决方式：

```js
// 误差范围：Number.EPSILON（2^-52，可接受的最小误差范围）
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // true
// 保留指定位数（toFixed 四舍五入、toPrecision 指定精度）
parseFloat((0.1 + 0.2).toFixed(10)); // 0.3
// 放大为整数再运算
(0.1 * 1000 + 0.2 * 1000) / 1000 === 0.3; // true
```

#### null 和 undefined

核心结论：undefined 代表"不存在的值"，null 代表"空对象（没有值）"，常用于给可能返回对象的变量做初始化。

| 对比项 | null | undefined |
| --- | --- | --- |
| typeof 结果 | "object"（历史遗留 bug：null 的存储单元标志位和 object 一样） | "undefined" |
| 典型来源 | 主动赋值初始化 | 变量声明了但还没赋值 |
| `==` / `===` 互相比较 | `null == undefined` 为 true，`===` 为 false | 同左 |

- `undefined` 不是保留字，可被当作变量名覆盖（非常危险），可用 `void 0` 获得安全的 undefined 值。
- 与 undeclared 的区别：undeclared（未声明）是访问尚未用 `var`/`let`/`const` 声明的变量，抛 `ReferenceError: xxx is not defined`；undefined（未定义）是已声明但未赋值。`typeof` 对两者都返回 "undefined"，因此常用于安全探测未声明变量。

#### === 和 == 以及 =

核心结论：`=` 是赋值操作符；`==` 比较前允许类型转换；`===` 类型不同直接不相等。

| 运算符 | 类型转换 | 说明 |
| --- | --- | --- |
| `=` | 无 | 赋值，不是比较运算符 |
| `==` | 有 | 类型不同先按规则转换再比较值 |
| `===` | 无 | 类型和值都必须相同 |

- `===` 判断规则：类型不同即不等；数值须为同一个值（NaN 与任何值都不等）；字符串须每个位置的字符都一样；布尔须同真假；对象须引用同一个对象或函数；两个 null 或两个 undefined 相等。`==` 的转换规则见上文「类型转换」。

#### NaN、isNaN 与 Number.isNaN、isFinite

- `NaN` 是代表非数字值的特殊值，`typeof NaN === "number"`；它是唯一一个非自反的值（`NaN !== NaN` 为 true）；属性不可配置、不可写；常在计算失败时出现，如 `Math.sqrt(-1)`、`parseInt("blabla")`。
- `isNaN(val)` 先将参数转换为数字再判断，任何不能转换为数字的值也返回 true（如 `isNaN('merry')` 为 true），会误判；`Number.isNaN(val)` 先判断参数是否为数字类型再判断是否 NaN，判断更准确。
- `Infinity`/`-Infinity` 是特殊数值，`NaN` 代表一个 error，它们都是 number 类型但不是"普通"数字；`isFinite(val)` 将 val 转换为数字，是常规数字返回 true，是 `NaN`/`±Infinity` 返回 false。在所有数字函数中，空字符串或只有空格的字符串都被视为 0。

#### 逻辑与 && 和逻辑或 ||

核心结论：两者都是短路操作符，返回值不一定是布尔值。

| 操作符 | 前面为假时 | 前面为真时 |
| --- | --- | --- |
| `&&` | 返回前面的值（不再对后面求值） | 返回后面的值 |
| `\|\|` | 返回后面的值 | 返回前面的值（不再对后面求值） |

- 判为 false 的值：`0`、`""`、`null`、`false`、`undefined`、`NaN`，其他都为 true。
- 典型用途：设置默认值 `const myObject = preferredObject || backupObject`；空值守卫 `data.owner && data.owner.avatar`，避免变量为 null 或 undefined 时报错。

### 数组 {#js-array}

围绕数组 API 的分类记忆、去重与拍平的手写实现、数组与链表的取舍展开。

#### 数组方法

创建数组：`Array.from(arrayLike, mapFn)` 从类数组对象或可迭代对象创建新数组实例（浅拷贝），第二个参数作用类似 map，对每个元素处理后放入返回的数组；`Array.of(...items)` 根据一组参数创建新数组实例，支持任意参数数量和类型。

改变原数组的方法：

| 方法 | 作用与返回值 |
| --- | --- |
| `push` / `unshift` | 尾部/头部添加元素，返回数组最新长度 |
| `pop` / `shift` | 删除尾部/头部元素，返回被删除的元素 |
| `splice(index, howmany, ...items)` | 在指定位置删除并插入元素，返回被删除元素组成的数组 |
| `sort()` | 排序，默认将元素转为字符串比较 UTF-16 码元值（数字排序需传比较函数），ES2019 起保证稳定排序 |
| `copyWithin(target, start, end)` | 将指定位置成员复制到其他位置（覆盖原成员），返回当前数组，负数表示倒数 |
| `fill(value, start, end)` | 填充数组，填充对象时是浅拷贝 |

不改变原数组的方法：`concat`、`slice`、`join`、`map`、`filter`、`reduce`、`some`、`every`、`find`、`findIndex`、`includes`、`indexOf`、`flat`、`flatMap`。

- `find(fn)` 返回第一个符合条件的数组成员（没有则 undefined），`findIndex(fn)` 返回其下标（没有则 -1），都可传第二个参数绑定回调函数的 this。`filter` 返回满足条件元素组成的新数组；`some` 存在满足条件的元素即 true；`every` 所有元素都满足才 true；`reduce` 不改变原数组；求数组最大值可用 `Math.max.apply(null, arr)`。

#### 数组去重

常见思路：Set、Map、`indexOf`/`includes`、`filter`。

```js
const unique1 = arr => [...new Set(arr)]; // 或 Array.from(new Set(arr))
const unique2 = arr => arr.filter((item, index) => arr.indexOf(item) === index);
const unique3 = arr => {
  const map = new Map();
  return arr.filter(item => !map.has(item) && map.set(item, true));
};
```

#### 数组和链表

核心结论：数组连续存储、查找快、增删慢；链表离散存储、增删快、查找慢。

| 对比项 | 数组 | 链表 |
| --- | --- | --- |
| 物理存储 | 连续存储 | 离散存储 |
| 内存申请 | 需事先申请连续空间（太大浪费、太小越界） | 使用时动态申请或删除 |
| 查找 | 方便，支持随机访问 | 需从头遍历 |
| 增删改 | 效率低，需移动元素 | 灵活高效 |
| 适用场景 | 数据量固定、频繁查询、较少增删 | 数据量不固定、频繁增删、较少查询 |

#### 数组拍平

常用方式：`flat(Infinity)`、`toString + replace + split`、`replace + JSON.parse`、递归、`reduce` 迭代、扩展运算符。

```js
// reduce 递归，depth 控制拍平层数
function flatten(arr, depth = 1) {
  if (depth === 0) return arr;
  return arr.reduce((pre, cur) =>
    pre.concat(Array.isArray(cur) && depth > 1 ? flatten(cur, depth - 1) : cur), []);
}
// 扩展运算符等价写法：while (arr.some(Array.isArray)) arr = [].concat(...arr);
```

#### ES6 新增数组方法

包括 `find`、`findIndex`、`flat`、`flatMap`、`at`、`from`、`of`、`includes`、扩展运算符、`copyWithin`、`fill`、`entries`/`keys`/`values`。

- `flat(n)` 默认拍平一层，参数 n 拍平 n 层，`Infinity` 全部拍成一层，数组有空位会跳过；`flatMap(fn)` 对每个成员执行函数后再执行 `flat()`，只能拍平一层，返回新数组，第二个参数可绑定遍历函数里的 this。
- `at(index)` 返回对应下标的值；扩展运算符是 rest 参数的逆运算；类数组对象需要有 `length` 属性才能被 `Array.from` 转换，否则返回 `[]`。

#### 判断数组是否存在某个值

`indexOf(value)` 返回下标（没有则 -1）；`find(fn)` 返回第一个满足条件的元素的值（没有则 undefined）；`findIndex(fn)` 返回第一个满足条件的下标（没有则 -1）；`includes(value, fromIndex)` 返回布尔值，第二个参数为搜索起始位置，默认 0，负数表示倒数。

#### arguments 为什么不是数组

核心结论：arguments 是类数组对象（有 length 和 callee 属性），不是 Array 的实例，无法调用数组原生方法。转换为数组的方式：

```js
function sum() {
  const args1 = Array.prototype.slice.call(arguments);
  const args2 = Array.from(arguments);   // 或 [...arguments]
  const args3 = Array.prototype.concat.apply([], arguments);
  console.log(args1.reduce((s, cur) => s + cur));
}
```

也常用 `[].slice.call(document.getElementsByTagName('li'))` 把 DOM 的 NodeList 转换为数组。

### 对象 {#js-object}

聚焦对象遍历 API 的差异、原型链模型、六种继承方式的演进以及深浅拷贝。

#### 遍历对象属性

五种方式的覆盖范围对比：

| 方式 | 自身属性 | 继承属性 | Symbol | 不可枚举属性 |
| --- | --- | --- | --- | --- |
| `for...in` | 可枚举 | 可枚举 | 不含 | 不含 |
| `Object.keys()` | 可枚举 | 不含 | 不含 | 不含 |
| `Object.getOwnPropertyNames()` | 全部 | 不含 | 不含 | 含 |
| `Object.getOwnPropertySymbols()` | 仅 Symbol | 不含 | 只含 Symbol | - |
| `Reflect.ownKeys()` | 全部 | 不含 | 含 | 含 |

- `for...in` 以任意顺序迭代对象除 Symbol 以外的可枚举属性（含继承的）；原型链上扩展的方法也会被遍历出来，可用 `hasOwnProperty` 过滤。
- 键的排序：ES6 起 Object 的键按自然数（升序）、非自然数、Symbol 排序，后两者按插入时间顺序；`keys`/`values`/`entries` 都有此特性。
- 属性访问 `.` 与 `[]`：`[]` 可通过变量访问属性、支持含空格等非字母数字的属性名；属性名是对象时自动转为 `"[object Object]"`。遍历对象的方法：`Object.keys` 返回自身可枚举属性名数组、`Object.values` 返回属性值数组、`Object.entries` 返回键值对数组（可配合 `for...of`），三者顺序与 `for...in` 一致。

#### 判断对象是否具有属性

| 方式 | 是否检查原型链 | 说明 |
| --- | --- | --- |
| `in` | 含 | 属性来自原型也返回 true |
| `Reflect.has(obj, key)` | 含 | 和 in 一样作为函数工作 |
| `obj.hasOwnProperty(key)` | 不含 | 只判断自身属性，可正确区分本身属性和原型属性 |
| `Object.prototype.hasOwnProperty.call(obj, key)` | 不含 | 直接调用内置函数、跳过原型链，解决 `Object.create(null)` 对象报错的问题 |
| `Object.hasOwn(obj, key)` | 不含 | 静态方法，属性被继承或不存在返回 false |

#### for in 和 for of 的区别

一句话总结：`for...in` 为遍历对象属性而构建（遍历 index），`for...of` 为遍历数组（可迭代对象）而设计（遍历 value）。

| 对比项 | for...in | for...of |
| --- | --- | --- |
| 遍历内容 | 键名（index），且是字符串型数字 | 值（value） |
| 适用对象 | 对象的可枚举属性（含原型链上的） | 所有拥有迭代器的对象（数组、字符串、Map、Set 等） |
| 普通对象 | 可用 | 报错 `not iterable` |
| 注意点 | index 不能直接进行几何运算；遍历数组会带上自定义属性和原型方法 | - |

#### 原型和原型链

核心结论：`prototype` 是构造函数的属性，`__proto__` 是每个对象都有的属性（指向该对象的原型），`constructor` 是原型上指向关联构造函数的属性，三者构成"实例—构造函数—原型"的三角关系。

- `__proto__` 与其说是属性，不如说是 getter/setter，`obj.__proto__` 可理解为 `Object.getPrototypeOf(obj)`。
- 读取实例属性找不到时，会查找关联的原型，还找不到就找原型的原型，直到最顶层 `Object.prototype.__proto__ === null`；由相互关联的原型组成的链状结构就是原型链。
- 原型对象本身是普通对象，其构造函数是 Object；除 `Object.prototype` 外，内置函数对象的原型对象（如 `Array.prototype`）和自定义构造函数原型的 `__proto__` 都指向 `Object.prototype`。一切对象都继承自 Object，Object 直接继承根源对象 null；一切函数对象（包括 Object）都继承自 Function，`Function.__proto__ === Function.prototype`。
- 不是所有对象都有原型，`Object.create(null)` 可创建没有原型的对象；`Object.setPrototypeOf` 可改变对象的 `__proto__`；instanceof 的结果可被运行时修改原型而改变，ES6+ 还允许通过 `Symbol.hasInstance` 自定义。

```js
function Person() {}
const person = new Person();
person.__proto__ === Person.prototype;              // true
Person.prototype.constructor === Person;            // true
Object.getPrototypeOf(person) === Person.prototype; // true
Object.prototype.__proto__ === null;                // true
```

#### 继承方式

核心结论：从原型链继承到寄生组合式继承，演进方向是解决"引用类型属性共享"和"重复调用父构造函数"两大问题。

| 方式 | 核心做法 | 优缺点 |
| --- | --- | --- |
| 原型链继承 | `Child.prototype = new Parent()` | 缺点：引用类型属性被所有实例共享；创建 Child 实例时不能向 Parent 传参 |
| 借用构造函数（经典继承） | `Parent.call(this)` | 优点：避免引用共享、可传参；缺点：方法都在构造函数中定义，每次创建实例都会创建一遍 |
| 组合继承 | `Parent.call(this)` + `Child.prototype = new Parent()` | 最常用的继承模式；缺点：调用两次父构造函数（设置子原型时、创建子实例时） |
| 原型式继承 | `Object.create(o)` 的模拟实现 | 包含引用类型属性的值都会共享，和原型链继承一样 |
| 寄生式继承 | 在原型式基础上创建函数增强对象再返回 | 和借用构造函数一样，每次创建对象都会创建一遍方法 |
| 寄生组合式继承 | 用父原型的副本作为子原型 | 引用类型最理想的继承方式，只调用一次父构造函数 |

寄生组合式继承（避免两次调用父构造函数，原型链不变、instanceof 和 isPrototypeOf 可正常使用）：

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
function inherit(child, parent) {
  const proto = object(parent.prototype); // 创建父类原型对象的副本
  proto.constructor = child;              // 补充因重写原型而丢失的 constructor
  child.prototype = proto;                // 将副本指定给子类的原型对象
}
```

#### instanceof

核心结论：instanceof 判断构造函数的 `prototype` 是否出现在对象的原型链上，只能判断引用类型。

- 优点：可弥补 `Object.prototype.toString.call()` 不能判断自定义实例对象的缺点；缺点：只能判断对象类型，`2 instanceof Number` 为 false。
- 与 typeof 对比：typeof 返回类型字符串，可判断基本类型（null 除外）和 function，但引用类型除 function 外无法判断；instanceof 返回布尔值，能准确判断复杂引用类型但不能判断基本类型；通用检测用 `Object.prototype.toString`，统一返回 `[object Xxx]` 格式的字符串。

#### 深浅拷贝

核心结论：浅拷贝只能拷贝一层对象；深拷贝能解决无限层级对象嵌套问题。

- 浅拷贝方法：`Object.assign()`（拷贝的是对象属性的引用而非对象本身；处理数组时把数组视为属性为 0、1、2 的对象）、`concat`、`slice`、扩展运算符、`for...in`。
- 深拷贝方式：`JSON.parse(JSON.stringify())`（无法解决循环引用；无法拷贝 RegExp、Date、Set、Map 等特殊对象；忽略 `undefined`、Symbol 和函数）、递归实现（用 `Object.prototype.toString.call(obj)` 鉴别特殊对象）、lodash 等第三方库。

```js
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (hash.has(obj)) return hash.get(obj); // 解决循环引用
  const clone = Array.isArray(obj) ? [] : {};
  hash.set(obj, clone);
  Object.keys(obj).forEach(key => (clone[key] = deepClone(obj[key], hash)));
  return clone;
}
```

#### freeze 属性

核心结论：`Object.freeze` 通过禁止扩展、禁止修改、禁止配置来冻结对象。

- 属性的四个内部特性（规范用双中括号标识内部特性，修改用 `Object.defineProperty()`）：`[[Configurable]]` 能否 delete 删除并重新定义、修改特性、改为访问器属性；`[[Enumerable]]` 能否通过 for-in 循环返回；`[[Writable]]` 属性值能否被修改；`[[Value]]` 属性实际的值。前三者默认均为 true，`[[Value]]` 默认 undefined。

- `Object.freeze` 做的事：设置 `Object.preventExtensions()` 禁止添加新属性；设置 `[[Writable]]` 为 false 禁止修改属性值；设置 `[[Configurable]]` 为 false 禁止配置；禁止更改访问器属性（getter 和 setter）。

### 函数 {#js-function}

覆盖函数声明的提升规则、柯里化、箭头函数、构造函数、执行上下文、作用域与闭包。

#### 函数基本知识

- 函数声明（`function fn() {}`）：整体提升，优先级高于变量声明，无论在什么位置声明，同一执行上下文中都可直接使用。
- 函数表达式（`const fn = function () {}`）：也叫匿名函数，提升方式与变量声明一致——只提升声明不提升赋值，声明前调用报错。同名时函数声明先提升，var 声明不再重复声明同名变量，只执行赋值覆盖。
- 匿名函数：没有被显式赋名的函数，多作为参数传入另一个函数，传入后最终在其中执行，常称为回调函数；IIFE（立即执行函数表达式）是匿名函数的一种应用。
- 高阶函数：接收另一个函数作为参数或返回另一个函数，如 `map`、`reduce`、`filter`、`sort`。
- 函数传参按值传递：传引用类型时真正传递的只是引用的副本，函数内改变引用指向不影响外部，修改其属性会影响外部。
- 函数式编程特征：函数是第一等公民（可赋值给变量、作参数、作返回值）；只用"表达式"不用"语句"；纯函数（同样的参数传入，返回的结果一定相等）。输出题：`console.log(foo)` 为 undefined（var foo 只提升了声明），而 `console.log(bar)` 为 `f bar() {}`（函数声明整体提升）。

#### 函数柯里化

核心结论：柯里化是高阶函数的一种特殊用法——接收函数 A 作为参数，返回一个能处理 A 剩余参数的新函数；运行过程就是参数的收集过程，每次传入的参数收集起来，在最里层处理。

```js
function curry(fn) {
  const judge = (...args) => {
    if (args.length === fn.length) return fn.apply(this, args);
    return (...rest) => judge(...args, ...rest); // 返回包装器，重新组装参数
  };
  return judge;
}
const add = curry((a, b) => a + b);
add(1)(2); // 3
```

#### 函数的 length

核心结论：`fn.length` 是第一个具有默认值参数之前的形参个数，剩余参数不计入。

```js
function fn1(name) {}                         // length: 1
function fn4(name, aaa, age = 22, gender) {}  // length: 2
function fn5(name = 'x', age, gender, aaa) {} // length: 0
function fn6(name, ...args) {}                // length: 1（剩余参数不计入）
```

经典题：`123['toString'].length + 123` 的结果是 124（`Number.prototype.toString` 的 length 为 1）。

#### 箭头函数和普通函数区别

| 对比项 | 箭头函数 | 普通函数 |
| --- | --- | --- |
| this | 定义时所在上下文的 this，固定不变 | 调用时所在的对象 |
| arguments | 没有，实际获得的是外层函数的 arguments | 有 |
| 构造函数 | 不可用于构造函数，不能 new | 可以 |
| prototype | 无 | 有 |
| call/apply/bind | 无法改变 this 指向 | 可以 |
| generator | 不能用作 generator 函数，无 yield | 可以 |

补充：箭头函数不绑定 this 是因为它没有 Constructor 内部槽；对象字面量的大括号 `{}` 不是单独的执行环境，其中的 this 依旧处于全局环境中。

#### 构造函数

- 通过 `new` 来实例化对象的函数叫构造函数，命名一般首字母大写；与 `prototype` 配合（或使用 class）批量创建对象。
- `new` 操作符的执行过程：创建一个新对象并在内存中创建新的地址；新对象继承原型（`person.__proto__ = Person.prototype`）；改变构造函数的 this 指向为新对象并执行，添加属性和方法；根据返回类型判断——返回原始值会被忽略（仍返回新对象），返回对象则正常处理该对象。
- 构造函数尽量不要显式返回值：返回原始值不会生效，返回对象会导致 new 操作符失效。本质上 `let a = []` 相当于 `let a = new Array()`，`function a() {}` 也是由 Function 构造器产生的函数对象。

#### 执行上下文

核心结论：执行 JS 代码会产生全局、函数、eval 三种执行上下文，由执行上下文栈（ECStack）管理。

- 每个执行上下文在创建阶段确定三个重要属性：变量对象（VO，包含变量、函数声明和形参，只能在全局上下文中访问，全局上下文的变量对象就是全局对象）；作用域链（JS 采用词法作用域，变量的作用域在定义时就决定了）；this 指向。
- JS 的执行分两个阶段：解释阶段（词法分析、语法分析、作用域规则确定），执行阶段（创建执行上下文、执行函数代码、垃圾回收）。
- 执行上下文栈：初始化时最先压入全局执行上下文（只有整个应用程序结束时才清空，栈底永远是 globalContext）；函数被调用时创建函数执行上下文压入栈，执行完毕出栈。

#### 作用域

核心结论：作用域规定了如何查找变量、确定当前执行代码对变量的访问权限，内层作用域可以访问外层作用域的变量，反之不行。

- 全局作用域：最外层函数和在最外层函数外面定义的变量；所有未定义直接赋值的变量（自动声明为全局变量）；所有 window 对象的属性。
- 函数作用域：声明在函数内部的变量只在固定的代码片段内可访问，生命周期随函数结束而销毁。
- 块级作用域（ES6 新增）：通过 `let`/`const` 声明创建，所声明的变量在指定块的作用域外无法访问；不会提升到代码块顶部、禁止重复声明；for 循环中设置循环变量的部分是父作用域，循环体内部是单独的子作用域。
- 词法作用域（静态作用域）：变量被创建时就确定，而不是执行阶段；函数在全局定义，即使在其他函数内调用，也只能访问全局作用域。

#### 作用域和作用域链

- 查找变量时先从当前上下文的变量对象中查找，找不到就沿词法层面的父级执行上下文的变量对象一层层向上，直到全局上下文；多个执行上下文的变量对象构成的链表叫做作用域链，它保证当前执行环境对符合访问权限的变量和函数的有序访问。
- 块语句（if、switch、for、while 的大括号）不像函数，不会创建一个新的作用域。
- 与执行上下文的区别：作用域在定义时就确定、不会改变；执行上下文在函数执行前创建、随时可以改变（最典型的体现是 this 的指向在执行时确定）。同一作用域下不同的调用会产生不同的执行上下文环境，继而产生不同的变量值。

#### 闭包和内存泄漏

核心结论：闭包是有权访问另一个函数作用域中变量的函数，即"函数 + 函数能够访问的自由变量"（自由变量：在函数中使用、但既不是函数参数也不是函数局部变量的变量）。

- 自由变量的查找发生在函数定义的地方，向上级作用域查找，不是在执行的地方；闭包的变量存在堆中，这解释了函数调用之后为什么闭包还能引用到函数内的变量。
- 形成条件：内部函数访问了上层作用域链中的变量对象；闭包在函数被调用执行时才被确认创建。
- 与内存泄漏的关系：上级作用域内变量的生命周期，因为被下级作用域引用而得不到释放，需要等到下级作用域执行完才释放；若闭包被长期持有，这些变量就无法回收。
- 作用：独立作用域避免变量污染、实现缓存计算结果、库的封装（如 jQuery）；典型运用是防抖节流、模拟块级作用域、对象中创建私有变量。

```js
function debounce(fn, delay = 300) {
  let timer; // 闭包引用外界变量
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### this {#js-this}

JS 面试必考：this 在调用时确定，判断依靠调用位置和绑定规则。

#### 关于 this 的指向问题

核心结论：this 在函数被调用时（执行上下文被创建时）确定，函数执行过程中一旦确定就不可更改；绑定优先级为 new 绑定 > 显式绑定 > 隐式绑定 > 默认绑定。

判断 this 的两个要点：

1. 调用位置：当前正在执行的函数的上一个调用位置（看调用栈，栈是先进后出的结构）。
2. 绑定规则：
   - 默认绑定：无法应用其他规则时的兜底，即独立函数调用；非严格模式下 this 指向全局对象（浏览器 window、Node.js global），严格模式下为 undefined。
   - 隐式绑定：函数作为对象的方法调用，this 绑定到该上下文对象；调用前存在多个对象时，this 指向距离调用自己最近的对象。
   - 隐式丢失：变量赋值（`const bar = obj.foo; bar()`）或参数传递使函数引用脱离原对象，this 回到默认绑定。
   - 显式绑定：通过 `call`、`apply`、`bind` 改变 this。
   - new 绑定：this 指向新创建的对象。
   - 箭头函数：不创建自己的 this，从作用域链上一层继承（外层第一个非箭头函数的 this），且无法被改变。

特殊场景：全局上下文中 this 指向顶层对象（严格和非严格模式都是）；`setTimeout`/`setInterval` 回调函数的 this 指向全局对象 window，可使用箭头函数修正；对象字面量 `{}` 不是单独的执行环境，如 `{ a: 10, c: this.a + 20 }` 中的 this 仍处于全局作用域指向 window；`f()` 是 `f.call()` 的简写，call 的第一个参数可指定函数中的 this 指向谁，函数被某个对象拥有时调用内部 this 指向该对象，独立调用时 this 指向 undefined（非严格模式自动指向全局对象）。

#### 改变 this 指向的方法（bind / call / apply）

核心结论：三者都是用来重新定义 this 对象的，且都挂载在 `Function.prototype` 上。

| 对比项 | call | apply | bind |
| --- | --- | --- | --- |
| 执行时机 | 使用后马上执行 | 使用后马上执行 | 返回一个绑定新环境的新函数，调用该函数才执行目标函数 |
| 参数形式 | 第一个参数是 this 对象，其余参数用逗号隔开 | 第一个参数是 this 对象，所有参数必须放在数组里传入 | 第一个参数是 this 对象，其余参数用逗号隔开（与 call 相同） |

- 对 bind 来说，多次 bind 调用 this 的指向仍然是第一次的：`aa.bind(1).bind(2)()` 输出 1；箭头函数的 this 指向它所在的上下文，不能使用这三个方法修改；典型用途如 `Math.max.apply(null, arr)` 求数组最大值。

```js
function myFun(fm, t) { console.log(this.name + ' 来自' + fm + ' 去往' + t); }
const db = { name: 'ccc', age: 12 };
myFun.call(db, '成都', '上海');
myFun.apply(db, ['成都', '上海']);
myFun.bind(db, '成都', '上海')();
```

### 字符串 {#js-string}

按功能分类记忆 String 方法，重点是 replace 的替换模式和三种截取方法的差异。

#### String 方法

按功能分类：

- 字符与编码：`charAt(index)`（返回指定索引处的字符，找不到返回空串）、`charCodeAt(index)`（返回指定索引处字符的 Unicode 值）、`codePointAt(pos)`、`fromCharCode()`（Unicode 值转字符）、`fromCodePoint(code)`。
- 拼接：`concat(str1, str2, ...)`，连接多个字符串返回副本，纯函数。
- 查找：`indexOf(str)`（第一次出现的位置，没有返回 -1）、`lastIndexOf(str)`（最后一次出现的位置，没有返回 -1）、`search(regex)`（基于正则搜索，返回第一个匹配的位置）、`match(regex)`（返回正则表达式的所有匹配）。
- 截取：`slice`、`substring`、`substr`。
- 大小写：`toLowerCase()`、`toUpperCase()`。
- 其他：`split`、`trim`、`valueOf()`（返回原始字符串值）、`toString()`（把 Number 对象转换为字符串）、`replace`。

编码相关要点：`String.fromCharCode(97)` 返回 "a"；`"z".codePointAt(0)` 为 122、`"Z".codePointAt(0)` 为 90、`String.fromCodePoint(90)` 为 "Z"；字符串比较按数字代码进行，所以 `'a' > 'Z'`（97 > 90）；`\u` 后跟十六进制代码可表示 Unicode 字符，如 `'\u005a'` 为 "Z"；`{}` 的 valueOf 结果为 `{}`、toString 结果为 `"[object Object]"`，`[]` 的 valueOf 结果为 `[]`、toString 结果为 `""`。

三种截取方法对比：

| 方法 | 参数 | 特点 |
| --- | --- | --- |
| `slice(start, end)` | 起止索引，返回两者之间（不含 end）的子串 | 支持负数索引 |
| `substring(from, to)` | 起止索引，返回两者之间（不含 to）的子串 | 允许 from > to（提取前先交换两参数），不支持负参数；参数相等返回空串 |
| `substr(start, length)` | 起始下标 + 长度 | start 可为负数（从尾部算起，-1 指最后一个字符）；length 为 0 或负数返回空串 |

- `split(separator, limit)`：把字符串分割成字符数组；separator 必填（字符串或正则表达式），limit 指定返回数组的最大长度（从头开始执行分割的最大数量），不设置则整个字符串都会被分割。
- `trim()`：删除字符串两端的空白字符并返回新字符串，不影响原字符串本身；缺陷是只能去除两端的空格，不能去除中间的空格。

#### replace

核心结论：replace 不会修改原字符串；第二个参数传字符串时只匹配一次，传函数时原始字符串中有 n 个匹配函数就执行 n 次，返回值作为替换内容。

替换模式（第二个参数中的特殊字符）：

| 模式 | 含义 |
| --- | --- |
| `$&` | 匹配到的字符串（适用于没有子表达式的情况） |
| `` $` `` | 匹配字符串左边的所有字符 |
| `$'` | 匹配字符串右边的所有字符 |
| `$1, $2, ... $n` | 依次匹配子表达式（分组） |

第二个参数为函数时，函数参数依次为：匹配到的字符串、各分组（正则使用分组匹配时才有）、匹配字符串的索引位置、原始字符串。

```js
const s = '讨论一下正则表达式中的replace的用法';
s.replace(/正则表达式/, '《$&》');            // 讨论一下《正则表达式》中的replace的用法
s.replace(/(正则)(.+?)(式)/, '《$1》$2<$3>'); // 讨论一下《正则》表达<式>中的...
s.replace(/(正则).+?(式)/g, function ($1) {
  return $1 + 'a'; // 每次匹配执行一次
});
```

常用正则处理：`str.replace(/\s*/g, '')` 去除所有空格（`\s` 匹配空格、制表符、换行符）、`str.replace(/^\s*|\s*$/g, '')` 去首尾空格、`str.replace(/^\s*/, '')` 去左侧空格；单词首字母大写可用 `name.replace(/\b\w+\b/g, w => w.substring(0, 1).toUpperCase() + w.substring(1))`。

### DOM 和事件 {#js-dom}

一句话:事件流描述事件在元素节点与根节点之间的传播顺序,DOM 事件模型分为捕获、目标、冒泡三个阶段,这是事件委托等高频考点的理论基础。

**事件流三阶段**:1) 捕获阶段,事件从 `window` 自上而下向目标节点传播;2) 目标阶段,目标节点正在处理事件(该阶段处理程序会被视为冒泡阶段的一部分);3) 冒泡阶段,事件从目标节点自下而上传播回 `window`。历史上 IE 采用「由内向外」的冒泡模型,Netscape 采用「由外向内」的捕获模型,W3C 最终统一为三阶段。所有事件都经历捕获与目标阶段,但部分事件没有冒泡阶段(如 `focus`/`blur`),因此无法委托。

**三种事件模型**

| 模型 | 绑定方式 | 特点 |
| --- | --- | --- |
| 原始事件模型(DOM0) | `dom.onclick = fn` | 只支持冒泡;同类型事件只能绑定一次,后者覆盖前者;删除置 `null` |
| 标准事件模型(DOM2) | `addEventListener(type, handler, useCapture)` | 可绑定多个处理器互不覆盖;第三参选择捕获/冒泡阶段;`removeEventListener` 移除(事件名不带 on) |
| IE 事件模型 | `attachEvent('onclick', fn)` | 只有目标处理与冒泡两阶段,无捕获;仅老版本 IE 使用 |

**哪些事件支持冒泡**:判断方法是读 `event.bubbles`。支持冒泡的有 `click`、`dblclick`、`keydown`、`keyup`、`mousedown`、`mousemove`、`mouseout`、`mouseover`、`mouseup`、`scroll` 等鼠标、键盘、点击类事件;不支持的有 `blur`、`focus`、`resize`、`abort`、`mouseenter`、`mouseleave`、`load`、`unload` 等聚焦失焦、加载、UI、移入移出类事件。

**阻止冒泡与默认行为**:阻止冒泡用 `e.stopPropagation()`(IE 用 `window.event.cancelBubble = true`);阻止默认行为用 `e.preventDefault()`(IE 用 `window.event.returnValue = false`)。

**事件代理(事件委托)**:利用事件冒泡,把子元素的事件响应委托到父层或更外层元素上,由外层监听函数统一处理。优点:节省内存、减少 DOM 操作;新增子节点无需重新绑定(动态绑定);子节点销毁无需注销事件。适合委托:`click`、`mousedown`、`mouseup`、`keydown`、`keyup`、`keypress`;不适合:`mousemove`(频繁计算位置)、`mouseover`/`mouseout`(位置计算复杂)、`focus`/`blur`(本身不冒泡)。页面上的事件处理程序数量直接影响整体性能,事件委托正是「事件处理程序过多」的解决方案。

**HTMLCollection 与 NodeList**

| 对比项 | NodeList | HTMLCollection |
| --- | --- | --- |
| 来源 | `Node.childNodes`、`document.querySelectorAll` | `getElementsByTagName` 等 |
| 包含节点 | 任意类型节点 | 仅元素节点 |
| 动态性 | `childNodes` 实时;`querySelectorAll` 返回静态集合 | live,即时更新 |
| 特有方法 | 无 | `namedItem` |

两者都是类数组而非真正的数组,可用 `Array.from()` 转换或 `for`/`for-of` 遍历;不要用 `for-in`(会把 `length`、`item` 遍历出来且不保证顺序);动态集合迭代中增删节点会互相影响,最好先创建副本。

**Element 与 Node**:`Node` 是基类,`Element` 与 `Text` 继承于它,分别对应 `ELEMENT_NODE` 与 `TEXT_NODE`;HTML 标签是 `ELEMENT_NODE` 类型的 Node,标签间插入的文本是 `TEXT_NODE`。`childNodes` 返回 NodeList;`getElementByXXX` 返回 Element 集合(ElementCollection),也都不是真正的数组。

**dom.onclick 与 dom.addEventListener**:onclick 可作 HTML 内联属性或脚本赋值,所有浏览器支持,但同类型事件只能绑定一个会被覆盖,且不能选择捕获/冒泡阶段;addEventListener 可绑定多个、可移除、可选阶段(IE8 及更早用 attachEvent)。内联 onclick 混淆 HTML 与 JS 逻辑、使 XSS 更有害、增大传输体积,除非特殊理由不建议;一般优先 addEventListener。

**e.target 与 e.currentTarget**:`e.target` 是触发事件的元素(实际点击的元素);`e.currentTarget` 是绑定事件的元素(当前事件流途经、正在执行处理程序的元素)。

**页面生命周期**

| 事件 | 触发时机 | 典型用途 |
| --- | --- | --- |
| `DOMContentLoaded` | DOM 树构建完成,外部资源(图片、样式表)可能未加载完 | 查找 DOM 节点、初始化接口 |
| `load` | HTML 及所有外部资源加载完成 | 依赖资源尺寸的操作 |
| `beforeunload` | 用户正要离开页面 | 检查未保存修改,询问确认 |
| `unload` | 用户几乎已离开 | 发送统计数据等不涉及延迟的操作 |

- 浏览器遇到 `script` 会先执行脚本再继续构建 DOM(脚本可能修改 DOM),因此 DOMContentLoaded 必须等待脚本执行结束。
- 外部样式表不直接影响 DOM,但样式表后面的脚本必须等样式加载完成(脚本可能读取样式相关属性),从而间接阻塞 DOMContentLoaded。
- `document.readyState`:`loading`(加载中)、`interactive`(文档解析完毕)、`complete`(全部资源加载完成);文档加载完成后再注册 DOMContentLoaded 处理程序将永不执行,可借助 readyState 判断。

**不阻塞 DOMContentLoaded 的脚本**:1) 带 `async` 特性的脚本;2) 通过 `document.createElement('script')` 动态创建插入的脚本。

### 异步解决方案 {#js-async}

一句话:JS 单线程下通过任务队列实现异步,方案经历「回调 → 发布/订阅 → Promise → Generator → async/await」的演进,核心目标是解决回调地狱、让异步代码具备同步可读性。

- 同步:顺序执行,同一时间只做一件事,阻塞后续代码;异步:异步代码作为任务放进任务队列而非主线程调用栈,主线程执行完后再取任务执行,不阻塞后续代码。常见异步场景:定时任务(`setTimeout`/`setInterval`)、网络请求(Ajax、动态创建 img)、事件监听(`addEventListener`)、ES6 Promise。
- 演进要点:回调函数实现异步但带来回调地狱;事件发布/订阅通过事件中心解耦;Promise 用 `then` 链式调用降低嵌套,错误具有「冒泡」性质,会一直向后传递直到被捕获。

**Promise**:状态 `pending`(进行中)→ `fulfilled`(`resolve()` 触发)/ `rejected`(`reject()` 触发),后两者合称 settled。组合方法:`Promise.all`(一个失败立即 rejected)、`Promise.allSettled`(全部 settled 后 fulfilled)、`Promise.race`(第一个 settled 的结果胜出)。`then(null, errCallback)` 与 `catch` 可互相替代,处理后的状态变化会影响后续链路。

**iterator(迭代器)**:为 Array、Set、Map 等不同数据结构提供统一访问机制,`for...of` 的底层实现。拥有 `next` 方法,每次调用返回 `{ value, done }`,内部指针随调用后移。原生具备接口的有 Array、Map、Set、String、TypedArray、`arguments`、NodeList;`Symbol.iterator` 是创建迭代器的接口而非迭代器本身;Object 原生不具备,可自定义遍历器。

**Generator(生成器)**:两个特征——`function` 与函数名之间有星号 `*`,内部用 `yield` 定义多个状态。调用后不执行函数体,而是返回遍历器对象(原型链上有 `next`/`return`/`throw`),可多次取 `yield` 的值。`yield` 像断点:暂停执行并记住位置、下次从该处继续、可执行多次;`return` 只能执行一次且无位置记忆。注意:yield 只能用在 Generator 函数内且不能跨函数;箭头函数不能用作 Generator;yield 用在表达式中需加括号。价值:像「可记住执行状态的函数」,并能把异步回调代码写成「同步」风格。

**async/await(ES7)**:相对 Generator 的改进——内置执行器(自动执行,无需手动调 `next`)、`await` 后面不限于 Promise、语义更清晰;相对 Promise——基于 Promise,async 函数返回 Promise 对象,`await` 代替 `then`,避免链式调用与嵌套。`await` 会阻塞其下面的代码(加入微任务队列):先执行 async 外的同步代码,同步代码执行完再回到函数内继续。

**定时器原理**:`setTimeout(fn, delay)` 返回唯一 id,可 `clearTimeout(id)` 取消;`setInterval` 周期执行,用 `clearInterval` 取消。JS 单线程,异步事件触发后回调进入执行队列,线程空闲时按顺序执行,因此延迟时间不能保证:定时器被阻塞会推迟到下一个可能的时间点;interval 回调执行时间超过 delay 时会「背靠背」无间隔执行。

### 内存管理与垃圾回收 {#js-gc}

一句话:栈内存随执行环境结束自动回收,堆内存由 GC 算法回收,V8 采用分代回收 + 多种算法组合,面试重点在四种经典算法与新生代/老生代策略。

- 基础:栈内存在执行状态指针 ESP 移过某执行上下文后销毁;堆内存只在所有引用结束后才回收;引擎通过逃逸分析决定变量存栈还是堆;全局变量在页面卸载时清除。
- 垃圾回收通用流程:标记活动/非活动对象 → 删除非活动对象释放内存 → 整理空间避免碎片。

**四种经典算法**

| 算法 | 思路 | 优点 | 缺点 |
| --- | --- | --- | --- |
| 引用计数 | 跟踪引用次数,归零即回收 | 思路直接 | 计数器内存开销大;无法解决循环引用 |
| 标记清除 | 从根出发标记可达对象,清除未标记者 | 实现简单 | 内存碎片化;分配速度慢(O(n)) |
| 复制算法 | 空间分 from/to 两半,存活对象复制到 to 后互换 | 吞吐量高、无碎片 | 复制有时间成本;可用内存减半 |
| 标记整理 | 标记后将活动对象移到内存一端,清理边界外 | 无碎片且不浪费空间 | 需多次搜索,堆越大越耗时 |

**V8 分代回收**:堆分为新生代与老生代,分别由副、主垃圾回收器负责;小对象(新生代容量约 1~8M)分配到新生代。新生代采用 Scavenge(Cheney)算法:空间对半分为 from-space 与 to-space,from 快满时标记存活对象复制到 to-space 后两区角色互换。晋升老生代的两种情况:经历过一次 Scavenge 仍存活;to-space 对象占比超过 25%(预留翻转后的分配空间)。老生代采用标记-清除 + 标记整理(从根递归遍历,可达为活动对象,碎片问题用标记整理优化)。由于 JS 单线程,为避免长回收导致卡顿,V8 将标记过程拆分为多个子标记,让垃圾回收与应用逻辑交替执行。

**内存泄露**:识别经验法则——连续五次垃圾回收后内存占用一次比一次大;可在 Chrome DevTools 的 Performance 面板勾选 Memory 录制观察。常见原因:意外的全局变量、被遗忘的定时器和回调、事件监听没有移除、没有清理的 DOM 引用、子元素存在引用、闭包。

### 其它零散考点 {#js-misc}

一句话:本节汇集 Unicode 编码、字符串与日期处理、JSON 序列化、URL 编码、移动端交互问题等杂项高频题。

**Unicode、UTF-8 与 UTF-16**:Unicode 是字符集,为每种语言的每个字符设定统一且唯一的二进制编码,满足跨语言、跨平台文本处理要求;UTF-8、UTF-16 是其实现方式。UTF-16 存储单位 16bit,汉字可能占多个存储单元,英文一字节也要对齐为两字节;UTF-8 是可变长编码(1~4 字节表示一个字符),节省且便于解析。**Base64**:基于 64 个可打印字符表示二进制数据的编码;因输入中可能存在 ASCII 不可见字符,为完全可见而采用。

**中文长度**:JS 字符串是 Unicode 编码,`"你好呀大笨蛋".length` 输出 6(按字符数计),而数据库中中文常按两个字符存放,导致前后端长度校验不一致;可用 `str.replace(/[^\x00-\xff]/g, '__').length` 计算字节长度。

**日期时间处理**:`getDate()`(1-31)、`getMonth()`(0-11,使用要 +1)、`getFullYear()`、`getHours()`、`getMinutes()`、`getSeconds()`、`getTime()`(距 1970-1-1 的毫秒数)。时间戳:`new Date().valueOf()` 或 `new Date().getTime()`;小于 10 的月/日需手动补零拼成 `YYYY-MM-DD`。

**input 与 Object 实现双向绑定**:利用 `Object.defineProperty(obj, prop, desc)` 定义属性的 `get`/`set`,在 set 中同步更新 DOM,即 Vue2 响应式的基本思路:

```js
var Person = {}, name = null;
Object.defineProperty(Person, 'name', {
  get: function () { return name },
  set: function (newV) { name = newV }
});
ipt.addEventListener('input', e => { Person.name = e.target.value });
```

**JSON.stringify 规则**

1. 目标对象存在 `toJSON()` 方法时,由它决定序列化结果。
2. Boolean/Number/String 包装对象转换为对应原始值。
3. `undefined`、函数、Symbol:在对象中被忽略,在数组中变为 `null`。
4. 所有 Symbol 键的属性被忽略。
5. Date 实例返回与 `toISOString()` 相同的 ISO 字符串。
6. `Infinity`、`NaN`、`null` 都序列化为 `null`。
7. 其他对象(含 Map、Set、WeakMap、WeakSet)序列化为可枚举属性,不可枚举属性不输出。
8. 循环引用与 BigInt 序列化均抛出 TypeError。

实践注意:字段值为 `undefined` 会被忽略,提交前需检测并替换为空字符串等。

**escape、encodeURI 与 encodeURIComponent**:`escape`(已废弃)生成 16 进制转义序列(≤0xFF 用 `%xx`,否则 `%uxxxx`);`encodeURI` 对 URI 整体编码,保留 `;/?:@&=+$#` 等保留字符,空格转 `%20`;`encodeURIComponent` 编码更彻底,`#` 也转 `%23`。原则:用户输入的任何作为 URI 部分的内容都应使用 `encodeURIComponent` 转义,避免服务器收到不可预知的请求。

**移动端点击延迟(300ms)**:移动端存在双击缩放,浏览器在 click 后等待约 300ms 判断是否双击。解决:meta 标签禁用缩放(`user-scalable='no'`);设置 `width=device-width`(响应式站点会被自动去掉延迟);使用 FastClick 等库。延迟可能引发点击穿透:touchstart 隐藏元素后,同一触摸又触发了下层元素的 click。

**滚动穿透与滚动溢出**:滚动穿透指 fixed 弹窗遮罩上下滑动时下层页面跟着滚动,解决:CSS `touch-action` 改变触摸手势;监听弹窗外层 `touchmove` 并 `preventDefault` 禁用滚动,再对弹窗内部滚动元素 `stopPropagation` 释放滚动。滚动溢出(scroll chaining / overscroll)指弹窗内滚动元素滚到顶部/底部后再滚带动页面滚动,解决:监听滚动事件,在边界处 `event.preventDefault()` 阻断。

**JS 如何影响 DOM 树构建**:渲染引擎遇到脚本时,HTML 解析器暂停 DOM 解析,JS 引擎介入(脚本可能修改已生成的 DOM);外部 JS 文件下载会阻塞 DOM 解析(受网络、文件大小影响),内嵌脚本直接执行;JS 若操作 CSSOM,执行前需先解析其上所有 CSS 并等待外部 CSS 下载完成,且引擎无法预知脚本是否操作 CSSOM,统一先处理 CSS 再执行 JS。结论:JS 文件下载阻塞 DOM 解析,样式文件阻塞 JS 执行。

### ES6 {#js-es6}

一句话:本节覆盖 Set/Map 数据结构、rest 与扩展运算符、Proxy 代理以及前端模块化方案的演进与对比。

**Set(集合)**:存储任何类型的唯一值(原始值或对象引用),重复 add 无效;对象引用不同即视为不同值。API:`add`、`has`、`delete`、`size`、`clear`;遍历 `keys()`/`values()`/`entries()`/`forEach()`,顺序即插入顺序。集合运算:

```js
let a = new Set([1, 2, 3]), b = new Set([4, 3, 2]);
new Set([...a, ...b]);                  // 并集 {1,2,3,4}
new Set([...a].filter(x => b.has(x)));  // 交集 {2,3}
new Set([...a].filter(x => !b.has(x))); // 差集 {1}
```

**Map(字典)**:存键值对,键可以是任何数据类型;记住键的原始插入顺序;`size` 返回成员总数。API:`set`(可链式)、`get`(不存在返回 undefined)、`has`、`delete`、`clear`、`keys()`、`values()`、`entries()`、`forEach()`(第二参可绑定 this)。

**rest 参数与扩展运算符(...)**:rest 参数解决传参数量不定的问题,是真实的数组(`arguments` 是类数组);只包含没有对应形参的实参,而 `arguments` 包含全部实参;rest 参数可被解构。扩展运算符好比 rest 的逆运算,将数组转为逗号分隔的参数序列,用于函数调用传参、数据结构转数组、合并数组等;实现的是浅拷贝,修改引用指向的值会同步反映到新数组。

**Proxy(代理)**:ES6 新增,用于自定义对象中的操作:`new Proxy(target, handler)`,在 handler 中定义 `get`/`set` 等拦截逻辑;适合在公开 API 的同时避免使用者直接操作底层数据(如只暴露 push/pop/length 的栈)。Vue3 用 Proxy 替代 `Object.defineProperty` 实现响应式:无需逐层递归为每个属性添加代理,一次即可完成,性能更好,能监听任何方式的数据改变;缺陷是浏览器兼容性不佳。

**模块化**:意义在于解决命名污染与变量冲突、内聚私有、按需加载、封装复用与多人协作维护。

| 方案 | 环境 | 加载方式 | 输出 | 特点 |
| --- | --- | --- | --- | --- |
| CommonJS | 服务端(Node) | 同步、运行时加载 | 值的拷贝 | 文件即模块、作用域私有;首次执行后缓存;`module.exports`/`require` |
| AMD | 浏览器 | 异步、可并行 | — | RequireJS 实现,`define`/`require`,依赖前置;开发成本高、语义不顺畅 |
| CMD | 浏览器 | 异步、依赖就近、延迟执行 | — | SeaJS 实现,整合前两者特点;依赖 SPM 打包,加载逻辑偏重 |
| ES6 | 通用 | 编译时静态确定依赖 | 值的引用(实时绑定) | `import`/`export`;import 提升到模块头部;多次 import 只加载一次(单例);支持 `export default` 与动态 `import()` |

- CommonJS 导出值是拷贝,导出值变了导入值不变;ES6 导入导出指向同一内存地址,导入值跟随导出值变化。
- Node 模块在本地硬盘加载快,适合同步的 CommonJS;浏览器需从服务器下载,同步会阻塞,故诞生 AMD/CMD,最终 ES6 成为浏览器与服务器通用的方案。

## Ajax、Fetch 与 Axios {#ajax}

### 三者定位与对比 {#ajax-compare}

一句话:Ajax 是基于 XMLHttpRequest 的异步更新技术,Fetch 是替代 XHR 的原生 Promise 底层 API,Axios 是基于 Promise 封装、浏览器与 Node 双端可用的 HTTP 客户端库。

| 对比项 | Ajax(XHR) | Fetch | Axios |
| --- | --- | --- | --- |
| 本质 | XMLHttpRequest API 实现的异步更新技术 | 原生 JS 底层 API,不基于 XHR | 对 XHR 的 Promise 封装(HTTP 客户端库) |
| 异步模型 | 基于事件回调,对异步事件不友好 | 基于 Promise,支持 async/await | 基于 Promise,符合最新 ES 规范 |
| Cookie | 可携带 | 默认不携带,需手动配置 | 可配置 |
| 附加能力 | XHR 架构本身不清晰 | API 丰富、脱离 XHR | 拦截请求/响应、转换数据、取消请求、自动转换 JSON、防御 XSRF、Node 端发请求 |

**Ajax 请求步骤**

```js
const ajax = new XMLHttpRequest();          // 1. 创建 XHR 对象
ajax.open('GET', url, true);                // 2. 建立连接(类型/URL/是否异步)
ajax.setRequestHeader('Content-type',
  'application/x-www-form-urlencoded');     // 3. 设置内容编码类型
ajax.send(null);                            // 4. 发送请求
ajax.onreadystatechange = function () {     // 5. 监听状态,接收响应
  if (ajax.readyState == 4 &&
     (ajax.status == 200 || ajax.status == 304)) { /* 处理数据 */ }
};
```

Ajax 的意义:局部刷新页面,无需重载整个页面;它不是新技术,而是 2005 年提出的术语。

### Axios 封装实践 {#ajax-axios}

- 环境区分:利用 Node 环境变量(process.env.NODE_ENV)设置不同 `baseURL`,本地调试可在 config 中配置 proxy 代理转发。
- 实例配置:`axios.create` 统一设置超时时间(如 30s)与 GET/POST 各自的 Content-Type 请求头。
- 封装请求方法:将 `httpGet`/`httpPost` 等封装为返回 Promise 的函数,内部 `then` 取 `res.data`、`catch` 抛错。
- 请求拦截器:统一为每个请求加上 token,便于维护;响应拦截器:接收响应后先做一层判断,如根据状态码判断登录状态、授权。

## 构建工具与 Node {#eng}

原文该部分仅保留「再来一打 Webpack 面试题」「前端 Node.js 面试题」两节标题,未包含正文内容,故本分片无可整理的实质知识点。Webpack 相关的零散要点(production 模式压缩、tree shaking、图片 base64、路由代码拆分、文件名加 hash 等)已并入「性能优化」一节。

## 浏览器与网络 {#bw}

### 浏览器概述 {#bw-overview}

一句话:浏览器是多进程架构,渲染进程(浏览器内核)是多线程的,各线程分工配合实现了 JS 单线程下的异步与渲染。

**为何使用多进程架构**:单进程浏览器三大问题——不稳定(插件、渲染线程崩溃导致整个浏览器崩溃)、不流畅(死循环脚本或插件卡顿)、不安全(插件和脚本可获取系统任意资源)。多进程的解决:进程相互隔离,崩溃只影响当前页面或插件;脚本只阻塞所在页面的渲染进程;安全沙箱使渲染进程无法直接访问或修改 OS 数据,需要系统资源时通过浏览器内核经 IPC 转发。

**主要进程**

| 进程 | 数量 | 职责 |
| --- | --- | --- |
| 浏览器主进程 | 1 个 | 页面创建销毁、网络资源管理、下载、存储等 |
| 第三方插件进程 | 每类插件一个 | 隔离运行插件,崩溃不影响浏览器和页面 |
| GPU 进程 | 最多 1 个 | 3D 绘制等 |
| 渲染进程(浏览器内核) | 每个 Tab 一个 | 将 HTML、CSS、JS 转换为可交互网页,运行在沙箱模式下 |
| 网络进程 | 1 个 | 页面网络资源加载 |

**渲染进程内的主要线程**:GUI 线程(解析 HTML/CSS、构建 DOM 树与渲染树、重绘回流,JS 引擎运行期间被挂起);JS 引擎线程(解析执行 JS,V8 跑在此,与 GUI 线程互斥,JS 执行过长会致渲染不连贯);定时触发线程(单独计时并触发定时任务,所以 setTimeout 不阻塞后续程序,到点后通知事件触发线程往任务队列添加事件);事件触发线程(把定时任务、鼠标点击、Ajax 等事件添加到待处理队列,等待 JS 引擎处理);异步 HTTP 请求线程(XHR 连接后新开线程请求,状态变更且有回调时将事件放入 JS 引擎的处理队列)。

### 事件循环(重点) {#bw-eventloop}

一句话:JS 单线程通过「调用栈 + 宏/微任务队列」的事件循环实现异步,一轮循环 = 执行一个宏任务 + 清空全部微任务(必要时渲染 UI),是笔试题的高频核心。

**浏览器事件循环流程**

1. 执行同步代码(整个 script 属于宏任务)。
2. 执行栈为空,查询是否有微任务需要执行。
3. 执行所有微任务(一次性清空)。
4. 必要的话渲染 UI。
5. 开始下一轮 Event Loop,取下一个宏任务中的异步代码执行。

**关键规则**:宏任务队列可有多个,微任务队列只有一个;本次宏任务产生的微任务全部执行完才会执行下一个宏任务。`setTimeout` 的延时是最快可多久执行,须等调用栈为空;渲染也需调用栈为空,同步长任务会阻塞渲染。`requestAnimationFrame` 不在任务队列也不在微任务队列,在渲染阶段执行。`await` 后面的代码会放进微任务队列;两个 script 代码块之间会先清空微任务。若宏任务中有大量计算又要操作 DOM,可将 DOM 操作放入微任务以加快界面响应。

**宏任务与微任务**:宏任务(一般由浏览器发起,DOM 渲染后触发)有 script 整体代码、setTimeout、setInterval、setImmediate(Node)、requestAnimationFrame、I/O、UI rendering;微任务(一般由 JS 自身创建,DOM 渲染前触发)有 Promise 回调(then)、MutationObserver、process.nextTick(Node)。

**Node 事件循环**:与浏览器的区别——浏览器每执行一个宏任务就去检查微任务;Node 把当前阶段的任务一次全部执行完,microtask 在各阶段之间执行,且 `process.nextTick` 优先于微任务。主要阶段(重点关注 timers、poll、check):timers 执行 `setTimeout`/`setInterval` 回调;poll 等待新 I/O 事件、执行到点定时器与 poll 队列事件,poll 为空时若有 setImmediate 则进入 check 阶段,否则等待回调入队;check 执行 `setImmediate` 回调。每个阶段都有先进先出的回调队列,执行完或超过数量上限后转入下一阶段。`setImmediate` 在 check 阶段执行(poll 完成后),`setTimeout` 在 timers 阶段执行;在 I/O 回调中 setImmediate 永远先于 timer 回调执行。

### 浏览器内核 {#bw-engine}

一句话:浏览器内核即渲染引擎,负责解析页面语法与渲染,现代语境下通常包含渲染引擎与 JS 引擎两部分。

- 浏览器组成 = 外壳(菜单、工具栏等 UI 与设置)+ 内核;内核是基于标记语言显示内容的程序或模块。浏览器作用:向服务器发出请求,在窗口中展示 URI 指定的网络资源(HTML、PDF、图片等)。
- 常见内核:Trident(IE、360、搜狗等)、Gecko(Netscape6+、Firefox)、Presto(Opera7+)、Blink(Opera 新版)、WebKit(Safari、Chrome)。
- 检测浏览器版本:`window.navigator.userAgent` 不可靠(可被改写、早期浏览器伪装);功能检测更可靠,如 IE 独有的 `ActiveXObject`。

### 同源策略与跨域 {#bw-cors}

一句话:同源指协议、域名、端口完全相同,同源策略限制一个域下的 JS 未经允许不能访问另一个域的内容;跨域请求实际上已发出并被服务端执行,只是响应被浏览器拦截。

**跨域请求的真相**:服务端无法可靠判断请求是否跨域(HTTP Header 均可被篡改),请求一定先发出去,返回时被浏览器拦截,有返回值也会被隐藏。预检请求(OPTIONS)的作用是「询问」服务端是否允许该跨域请求、支持哪些 HTTP 方法;不是所有请求都发预检,简单请求不会。前端大部分跨域问题通过代理解决,典型场景是生产环境不跨域、仅开发环境跨域(开发代理)。

**解决方案一览**

| 方案 | 要点 |
| --- | --- |
| JSONP | 利用 `script` 的 src 发请求并传回调函数名;只支持 GET、不安全;前后端配合 |
| CORS | 服务端设置 `Access-Control-Allow-Origin` 等,基于 HTTP/1.1,后端开启 |
| 代理(开发/Nginx) | 开发环境 devServer proxy 转发;Nginx 反向代理把本地 url 前缀映射到目标服务器并 rewrite 去掉前缀,对浏览器表现为同源 |
| postMessage | 用于获取嵌入页面中的第三方页面数据,一个页面发送消息、另一个判断来源并接收 |
| WebSocket | 请求头含 origin 字段,服务器据此判断是否允许通信,与 HTTP 同级 |
| document.domain + iframe | 仅适用于相同主域不同子域(如 a.test.com 与 b.test.com),都设置 `document.domain = 'test.com'` |
| location.hash + iframe | 通过 C 页面实现 A 和 B 通信 |
| window.name + iframe | 利用 window.name 共享变量 |

代理辨析:正向代理冒充客户端,反向代理冒充服务端;Nginx 三大功能为静态 web 服务器、反向代理、负载均衡。

**CORS 的三种交互模式**

1. 简单请求:方法为 GET/POST/HEAD,请求头仅含安全字段(Accept、Content-Type 等),Content-Type 仅限 text/plain、multipart/form-data、application/x-www-form-urlencoded,未注册事件监听、未用 ReadableStream。请求头自动带 Origin,服务端响应 `Access-Control-Allow-Origin` 即可。
2. 需要预检的请求:浏览器先发 OPTIONS 预检(无请求体,携带 Origin、Access-Control-Request-Method、Access-Control-Request-Headers),服务端以 Allow-Origin/Methods/Headers 及 Max-Age 响应,通过后再发真实请求。
3. 附带身份凭证的请求:XHR 设 `withCredentials = true` 或 fetch 设 `credentials: 'include'`;服务端须响应 `Access-Control-Allow-Credentials: true`,且此时 Allow-Origin 不得为 `*`(这也是不推荐用 `*` 的原因)。

补充:跨域时 JS 默认只能拿到基本响应头(Cache-Control、Content-Type 等),其余需服务端通过 `Access-Control-Expose-Headers` 加入白名单。

### 输入 URL 回车后发生了什么 {#bw-url}

一句话:整个过程分为导航阶段(浏览器主进程、网络进程协作请求资源)与渲染阶段(渲染进程流水线),是浏览器原理的集大成考点。

**简易版流程**:URL 解析 → 查找缓存 → DNS 域名解析 → TCP 三次握手 → 发送 HTTP 请求 → 服务器处理并返回报文 → 浏览器解析渲染页面 → TCP 四次挥手关闭连接。

**导航阶段**

1. 用户输入 URL:输入搜索内容则由默认搜索引擎合成带关键字的 URL,输入 URL 则补全协议;浏览器主进程通过 IPC 把 URL 请求发送给网络进程。
2. 网络进程检查本地缓存:先根据 expires/cache-control 判断强缓存,命中则不发请求;未命中再根据 If-Modified-Since/If-None-Match 判断协商缓存;都未命中才真正请求服务端。
3. DNS 解析(先查缓存):浏览器缓存 → 本机缓存 → hosts 文件 → 路由器缓存 → ISP DNS 缓存 → DNS 递归查询(本地 DNS → 权限 DNS → 顶级 DNS → 根 DNS)。
4. 等待 TCP 队列:浏览器为每个域名最多维护 6 个 TCP 连接,超出的请求排队;可用域名分片(多 CDN 域名)或升级 HTTP/2 解决。
5. 三次握手建立 TCP 连接:客户端发 SYN=1、seq=x 进入 SYN-SENT;服务端回 SYN=1、ACK=1、seq=y、ack=x+1 进入 SYN-RCVD;客户端回 ACK=1、seq=x+1、ack=y+1,双方进入 ESTABLISHED。第三次握手的原因:防止网络中滞留的旧连接请求又到达服务端,服务端回确认后无限等待造成资源浪费。
6. 构建 HTTP 请求(请求行、请求头、请求体)发送;服务器处理返回响应(响应行、响应头、响应体)。
7. 客户端处理响应:301/302 重定向则从 Location 读取新地址重新发起请求;200 则检查 Content-Type(text/html 走渲染,application/octet-stream 走下载)。
8. 非长连接时四次挥手断开:主动方 FIN → 被动方 ACK → 被动方 FIN+ACK → 主动方 ACK;需要四次是因为被动方可能还有数据要传,FIN 与 ACK 分开发送。
9. 准备渲染进程:URL 根域名与已打开页面相同则复用进程,否则新开进程。
10. 提交文档:浏览器向渲染进程发「提交文档」消息,渲染进程与网络进程建立传输管道,接收完后回「确认提交」,浏览器更新安全状态、地址栏 URL、前进后退历史并更新页面。

**渲染阶段流水线**

1. 构建 DOM 树:HTML 字节流 → 分词为 Token → 生成节点 Node → 组装成 DOM 树;XSSAuditor 安全检查模块检测词法安全;预解析线程提前下载内嵌引用的外部 JS/CSS。
2. 构建 CSSOM:CSS 转换为 styleSheets;因 JS 可修改 CSS 与 HTML,需 CSSOM 就绪后才执行 JS,这种阻塞会导致白屏。优化:内联 JS/CSS、压缩文件、async/defer 异步引入、媒体查询拆分 CSS。
3. 样式计算:属性值标准化(em→px、颜色→rgb),按继承与层叠规则计算每个节点的具体样式。
4. 布局(Layout/reflow):创建布局树,遍历 DOM 去掉不可见节点(head、display:none),只保留可见节点并计算坐标位置,生成渲染树。
5. 分层:对布局树分层生成分层树;3D 变换(translate3d/translateZ)、will-change、video/iframe 标签、opacity 动画、position:fixed 可生成新图层;频繁渲染的元素建议单独成层,但图层过多也有反作用。
6. 图层绘制:为每层生成绘制指令(绘制列表)提交给合成线程,此后不再阻塞主线程。
7. 切分图块:合成线程将图层切为固定大小图块(256x256 或 512x512),优先绘制靠近视口的图块。
8. 栅格化:光栅化线程池将图块转成位图,通常用 GPU 加速(GPU 栅格化),位图保存在 GPU 内存。
9. 合成与显示:所有图块光栅化后,合成线程将其合成为一张图片,生成 DrawQuad 命令提交给浏览器进程;浏览器进程的 viz 组件接收命令,将页面内容绘制到内存再显示到屏幕。

**回流、重绘与合成**:回流(重排)是修改元素几何位置属性,触发重新布局及后续子阶段;重绘跳过布局直接进入绘制及之后阶段;合成跳过布局和绘制,在合成线程(非主线程)执行,如 transform/opacity 动画。

### HTTP 缓存与 HTTP/2 {#bw-http}

一句话:HTTP 缓存分强缓存与协商缓存(都从第二次请求开始生效),HTTP/2 通过二进制分帧、首部压缩、多路复用等特性大幅改进传输性能。

**强缓存**:服务器与浏览器约定过期时间,是否使用缓存的主动权在浏览器;命中则不发请求(状态码 200,Size 标识 from disk cache),失效则进入协商缓存。`Expires`(HTTP/1.0)是响应头中的绝对到期时间,缺点是依赖客户端与服务端时间对比,时区或时钟误差会导致缓存失效;`Cache-Control`(HTTP/1.1)采用过期时长 max-age,优先级更高。取值:public(客户端与代理都可缓存)、private(仅客户端,默认值)、no-cache(跳过强缓存直接进入协商缓存)、no-store(完全不缓存)、max-age=xxx(xxx 秒后失效)。

**协商缓存**:强缓存失效后,浏览器携带缓存标识向服务器询问,由服务器决定是否使用缓存;命中返回 304 使用本地缓存,未命中返回 200 与新资源。

| 对比项 | Last-Modified | ETag |
| --- | --- | --- |
| 字段 | 响应头 Last-Modified / 请求头 If-Modified-Since | 响应头 ETag / 请求头 If-None-Match |
| 原理 | 最后修改时间对比 | 依据文件内容生成唯一标识 |
| 精确度 | 较低:内容未变的编辑也失效;时间单位为秒,1s 内改动无法感知 | 较高:按内容标识,可准确感知变化 |
| 性能 | 好(仅记录时间点) | 差(需生成哈希值) |

两者同时存在时 ETag 优先级更高;协商缓存字段需配合 Cache-Control 使用,只有未命中强缓存时才会发起。ETag 强弱:强 ETag 任何细微变化都改变值;弱 ETag(W/ 前缀)只在资源根本改变时变化,适合 HTTP 压缩等字节级一致性无必要的场景。

**HTTP/2 特性**

- 二进制分帧:头信息帧与数据帧全面二进制化,解析更高效健壮;不改变 HTTP 语义。
- 首部压缩(HPACK):客户端与服务端共同维护头信息表,字段以索引号传输,避免重复 header;SPDY 用的是 DEFLATE。
- 多路复用:一个 TCP 连接上并发多个请求/回应,不必按序一一对应;每个 request 有 id,接收方按 id 归属;消除 HTTP/1.1 队头排队,降低延迟。
- 请求优先级:浏览器为每个流指定优先级,服务器优先响应高优先级请求。
- 流量控制:基于窗口更新帧、按跳进行、有方向、可禁用;只有 data 帧受控。
- 服务端推送:服务端可主动把客户端可能需要的资源推入缓存;通过 PUSH_PROMISE 帧,客户端可拒绝;遵守同源策略,必须在返回响应之前发送。
- 数据流(Stream):每个请求/响应的所有数据包构成一个流,有唯一 Stream ID,可乱序发送、按 ID 组装;客户端建立的流为奇数号,服务端为偶数号。
- 缺陷:解决了 HTTP 层队头阻塞,但 TCP 层仍存在——丢包触发重传时,同一连接中的所有请求都得等待该包重传完成。
- 升级要点:主流浏览器只支持基于 TLS 部署的 HTTP/2,故应先升级 HTTPS;Nginx 配置开启即可,对不支持的浏览器自动向下兼容。

### 浏览器存储与鉴权 {#bw-storage}

一句话:前端缓存分 HTTP 缓存与浏览器本地存储(Cookie、WebStorage、IndexedDB),鉴权方案经历 Cookie → Cookie-Session → SSO/JWT 的演进。

**缓存存储位置(优先级从高到低)**:Service Worker → Memory Cache → Disk Cache → Push Cache。大的 JS/CSS 文件进磁盘,小文件进内存;内存使用率高时文件优先进磁盘。

**Cookie**:作用是解决「记录客户端用户信息」的问题,使无状态的 HTTP 能维持登录态;用途包括会话状态、个性化设置、浏览器行为跟踪。主要字段:expires(有效期,省略则为会话期)、path(适用路径)、domain(作用域,指定 `.example.com` 后子域名均可访问)、HttpOnly(禁止 JS 访问,防 XSS 窃取)、secure(仅 HTTPS 携带)、SameSite(限制跨站携带防 CSRF:Strict 完全禁止第三方、Lax 仅 GET 导航携带、None 默认自动携带)。JS 通过 `document.cookie` 创建、读取(字符串形式返回全部)、删除。局限:存储在客户端可被篡改;最大约 4KB;单个站点约 20 个、浏览器约 300 个;移动端支持不友好;只能存纯文本。Cookie 不能跨根域,浏览器不允许跨根域读写,跨域场景可用 SSO。

**鉴权方案**

| 方案 | 原理 | 局限/弊端 | 优点 |
| --- | --- | --- | --- |
| Cookie | 服务端下发 cookie,后续请求自动携带 | 可被篡改、4KB 限制、移动端不友好 | 简单直接 |
| Cookie-Session | 后端只返回 sessionId 存于 cookie,用户信息放缓存数据库 | 依赖 cookie(可被禁用);频繁查缓存有内存开销;session 机器挂掉影响登录(需集群负载均衡) | 缓解 cookie 容量限制 |
| SSO 单点登录 | 一次登录访问多个互信系统;分同站点、同顶级域、不同顶级域三种类型 | — | CAS(中央认证服务)流程与 Cookie-Session 相同 |
| JWT | header.payload.signature 三段式;token 含 uid、time、sign 签名 | 注销是假失效(token 未过期仍可用);安全性依赖密钥;数据较长 | 不依赖 Cookie;服务端无状态;易扩展 |

session 与 token 的对比本质是「用不用 cookie」和「后端存不存」的对比。

**WebStorage(localStorage 与 sessionStorage)**:出现动机是克服 cookie 的限制,数据不必持续返回服务端,可在断网时保存部分 Web 应用能力;同样受同源策略限制。相同点:容量约 5MB;存在客户端;只能存字符串;通过 `window.localStorage` 访问;API 一致(setItem/getItem/removeItem/clear/key)。区别:localStorage 持久化,除非手动删除永不过期,适合长期登录等长期数据;sessionStorage 页面关闭即删除,适合敏感账号一次性登录。注意:本质是字符串读写,存储过多会消耗内存导致页面卡顿;无法像 cookie 一样设置过期时间;localStorage 同域共享。

**IndexedDB**:运行在浏览器中的非关系型数据库,可理解为 localStorage 的加强版(WebSql 已被规范废弃)。特性:存储量理论上无上限;所有操作异步,大数据量下性能优于 localStorage 的同步操作;原生支持存储 JS 对象;受同源策略限制;操作繁琐。

### 浏览器执行机制 {#bw-exec}

一句话:JS 代码执行前会先经「词法分析 → 语法分析 → AST → 字节码/JIT」的编译流程,引擎查找变量使用 LHS(赋值目标)与 RHS(取值来源)两种查询。

- 编译语言(C/C++/Go 等):首次执行由编译器产出二进制文件,之后直接运行;解释语言(Python、JavaScript 等):每次执行都需解释器动态解释执行。
- 编译一般六步:分词/词法分析 → 解析/语法分析 → 生成 AST → 词义分析 → 生成二进制文件或字节码 → 执行;两类语言都会生成 AST,区别在后续产物。V8 早期直接将 AST 编译成机器码,效率高但内存占用过大,后引入字节码与 JIT(即时编译),采用「字节码 + JIT」技术。
- AST:源码必须先转为 AST 才能被编译器/解释器理解;Babel、ESLint 等工具都在这一步工作。构建两步:词法分析把代码拆为一个个 token(语法上不可再分的最小单位);语法分析按语法规则将 token 流转为 AST,不符合规则则抛出语法错误。
- LHS 与 RHS:LHS 查找赋值操作的目标(为赋值找到容器);RHS 查找赋值操作的源头(获取变量的值)。`console.log(a)` 中对 a 是 RHS 引用;`a = 2` 中对 a 是 LHS 引用;函数参数赋值是 LHS,调用函数与内部取值是 RHS。两种查询都先在当前作用域查找,找不到则逐级向上层作用域,最后到达全局作用域。

### 性能优化 {#bw-perf}

一句话:性能优化围绕加载(网络、缓存、资源体积)与渲染(回流重绘、主线程占用)两条主线展开,并覆盖图片、首屏、动画等专项场景。

**HTML 层面**:避免在 HTML 中直接写 CSS;使用 viewport 加速渲染;使用语义化标签;减少标签数量(DOM 解析是大量遍历);避免 src 和 href 空值;减少 DNS 查询数。

**CSS 层面**:避免后代选择符、链式选择符、`!important` 与通配符(选择器从右到左解析,遇通配符会遍历整个 DOM);优化嵌套、合并选择器、精确样式(如只写 `padding-left: 10px`);link 代替 @import(@import 使请求串行化);CSS 放 head;压缩并开启 gzip;异步加载;骨架屏 + loading;减少回流重绘;少用 float;0 值不加单位;谨慎使用昂贵属性(border-radius、box-shadow、opacity、transform、filter、position: fixed);使用 flex 布局。CSS 阻塞性:CSS 加载不阻塞 DOM 树解析,但阻塞 DOM 树渲染和后续 JS 执行。

**JS 层面**:避免循环操作 DOM;使用事件委托(监听少、新增节点无需再绑定);script 放 body 后;压缩文件、按需加载;避免逐个修改 DOM 样式,改为预留 class 切换以集中减少 reflow;减少 iframe 数量。合成层优势:位图交 GPU 处理比 CPU 快;repaint 不影响其他层;transform 和 opacity 不触发重绘。代码层面问题:频繁对大对象 JSON.parse/JSON.stringify;正则灾难性回溯;内存泄漏。

**网络相关**:DNS 预解析(`<link rel="dns-prefetch">` 预先获得域名对应 IP);preload 强制浏览器立即获取资源、优先级高,prefetch 优先级低、是否获取取决于浏览器;缓存策略选择——不需缓存用 `no-store`,已缓存但每次询问用 `no-cache` + ETag,长期缓存用 `max-age=31536000` + 文件指纹(文件名变动即重新下载);使用 HTTP/2(解析快、头部压缩、多路复用、服务器推送,规避浏览器并发请求限制);预加载提前获取暂不使用的资源且不阻塞 onload;预渲染后台预先渲染页面(需确保页面会被访问否则浪费资源);减少请求——服务端渲染(SSR)、Gzip 压缩、避免重定向。

**渲染优化**:懒执行把耗时逻辑延迟到使用时再计算(定时器或事件唤醒,适合首屏优化);懒加载只加载可视区域或即将进入可视区域的内容(图片先设占位 src、真实地址放 data-src,进入区域后替换);防抖——单位时间内多次触发只执行最后一次,原理是延迟执行,期间新触发就重置定时器;节流——单位时间只触发一次,原理是上锁,满足间隔才执行。

**图片优化**:照片用 JPEG(有损、体积小、不支持透明);小图/logo 用 PNG(无损、支持透明、体积大);图标用 SVG 或 iconfont(字体图标,轻量、减少请求);WebP 兼具体积与质量、支持透明,但兼容性一般。雪碧图(CSS Sprites)将多个小图标合成一张大图,1 次请求代替多次,减少请求数、服务器压力与并发占用。内联 Base64 解析字符串不发起请求,但体积比二进制大 33%,且原本可并行的图片会串行,适用于更新频率低、首屏或骨架上的小图标。其他:图片压缩(webpack 配置 image-webpack-loader);能用 CSS 实现的效果(半透明、阴影、圆角、渐变)不用图片;CDN 按屏幕宽度请求裁剪后的图;懒加载;预加载(大量图提前进缓存);响应式图片(picture 标签多 source);渐进式图片(先显示低画质版本,类似骨架屏)。

**CDN 与构建优化**:静态资源用 CDN 加载,浏览器对单个域名有并发上限,可考虑多个 CDN 域名。Webpack:production 模式自动压缩;ES6 模块开启 tree shaking 移除未用代码;小图 base64 写入文件;按路由拆分代码按需加载;打包文件名加 hash 利用浏览器缓存。监控体系:采集 → 上传 → 分析 → 报警。大数据量渲染用 requestAnimationFrame 每 16ms 刷新一批。

**SPA 首屏优化**:加载慢的原因——网络延时;资源文件体积过大;资源重复发送请求;加载脚本时渲染内容阻塞。手段:路由懒加载减少入口文件体积(函数形式动态加载,按路由分割代码块);静态资源本地缓存(HTTP 缓存 + localStorage);UI 框架按需加载;图片压缩;组件重复打包治理(如 CommonChunkPlugin minChunks=3 抽离公共依赖);开启 Gzip;使用 SSR(服务端生成 HTML 字符串下发)。App 首屏:二次启动先用缓存渲染、后台异步更新;减少不必要请求;提前请求;压缩图片与代码;gzip;CDN;网址后加 `/` 减少服务器一次判断;Ajax 采用缓存。

**白屏与卡顿**:白屏排查——网络请求返回状态;组件样式布局、组件是否显示。网页卡顿原因——网络请求过多导致传输慢(可用缓存优化);资源 bundle 太大需拆分;主线程上长循环耗时;某一帧渲染内容太多;大量回流重绘;内存泄漏。

**动画性能优化**:合理布局;用 transform 代替 left/top 减少重排;硬件加速;避免不必要的图形层;用 requestAnimationFrame 实现动画。显示器刷新频率 60Hz,每帧任务耗时不应超过 16ms。

### 前端安全 {#bw-security}

一句话:前端安全三大考点是 XSS(注入脚本执行)、CSRF(冒用登录态伪造请求)与 HTTPS 中间人攻击,防范思路分别是输入过滤 + CSP + HttpOnly、SameSite + 来源验证 + Token、以及严格的证书校验。

**XSS(跨站脚本攻击)**:用户输入或其他方式向页面注入 JS 并被执行,可窃取 cookie、监听用户行为、修改 DOM 伪造登录表单、生成浮窗广告。三种类型:

| 类型 | 注入路径 | 特点 |
| --- | --- | --- |
| 反射型 | XSS 代码通过 URL 参数注入,经服务器反射回 HTML 执行 | 服务器不存储,常见于搜索、跳转等传参功能 |
| 存储型 | XSS 代码提交并存入数据库,前端请求数据时执行 | 常见于论坛发帖、商品评论、私信 |
| DOM 型 | 不经过服务端,传输过程被劫持后修改 HTML 文档(WiFi 路由劫持、本地恶意软件) | 取出和执行恶意代码由浏览器端完成,属前端 JS 自身漏洞;前两类属服务端漏洞 |

防范(「一个信念,两个利用」):对输入转码过滤;利用 CSP(内容安全策略,服务器决定浏览器加载哪些资源、禁止向其他域提交数据、提供上报机制);利用 HttpOnly cookie 阻止 JS 访问登录凭证。

**CSRF(跨站请求伪造)**:本质是利用 cookie 会在同源请求中自动携带的特点,攻击者诱导受害者进入第三方网站,向被攻击网站发送跨站请求,冒充用户执行操作。点击链接后可能发生:自动发 GET 请求(利用 src)、自动发 POST 请求、诱导点击发 GET 请求。防范:SameSite(Strict/Lax/None 三档);验证来源站点(请求头 Origin 与 Referer,Origin 只含域名,Referer 含完整 URL);CSRF Token(后端生成唯一登录态,前端每次请求携带、后端校验);敏感操作需确认、敏感 cookie 用较短生命周期;安全框架(如 Spring Security)。

**XSS 与 CSRF 对比**:XSS 利用站点注入漏洞执行恶意 JS,前提是站点存在注入漏洞,防范核心是输入过滤转码、CSP、HttpOnly;CSRF 利用浏览器自动携带的 cookie 登录态,前提是用户已在被攻击网站登录,防范核心是 SameSite、来源验证、Token。

**SQL 注入与其他攻击**:SQL 注入是将恶意 SQL 语句插入表单或请求参数,后端未做输入安全检查直接拼接执行。预防:严格检查输入变量的类型和格式;过滤和转义特殊字符;部署 Web 应用防火墙(WAF)。其他攻击类型:DDoS(分布式拒绝服务,攻击 Web、邮件、DNS、即时通讯等服务)、DNS 劫持、JSON 劫持、暴力破解、HTTP 报头追踪漏洞、信息泄露、目录遍历、命令执行、文件上传漏洞等。

**HTTPS 中间人攻击**:攻击者与客户端和目标服务器同时建立连接,充当双方桥梁,处理双向数据,整个会话内容几乎完全被其控制,可拦截并插入新内容。过程:本地请求被劫持全部发往中间人服务器 → 中间人返回自己的证书 → 客户端生成随机数,用中间人证书公钥加密传回并构造对称加密 → 中间人拿到随机数可解密内容 → 中间人冒充客户端向真实服务器请求 → 服务器返回加密数据 → 中间人解密后再加密传给客户端 → 客户端用与中间人建立的对称密钥解密。根因:缺少证书验证,客户端完全不知道网络被拦截、数据被窃取。

### CDN {#bw-cdn}

一句话:CDN(内容分发网络)本质是遍布全球的缓存服务器网络,配合 DNS 将用户请求指向最近的边缘节点,解决分布、带宽、服务器性能带来的访问延迟。

- 背景:长途骨干网传输最耗时,海量用户同时请求同一资源对骨干网是灾难;CDN 提前把数据存在离用户最近的节点,减少骨干网负担、提高访问速度。
- 工作过程:发起请求后本地 DNS 将域名解析权交给 CNAME 指向的 CDN 专用 DNS 服务器 → CDN DNS 返回全局负载均衡设备 IP → 浏览器向其发起 URL 请求 → 全局负载均衡设备依据用户 IP 与 URL 选择区域负载均衡设备 → 区域负载均衡设备按负载情况、距离、内容命中情况选出最合适的 CDN 缓存服务器 → 返回该服务器 IP → 用户向缓存服务器发请求,缓存命中直接返回,否则回源到网站服务器获取。
- 组成:中心节点(CDN 网管中心 + 全局负载均衡 DNS 重定向解析系统,负责整个网络的分发与管理,像总仓)与边缘节点(异地分发节点,含负载均衡设备与高速缓存服务器 Cache,像各城市的本地仓库)。

### Web Worker 与 Service Worker {#bw-worker}

一句话:Web Worker 为主线程创造多线程环境承担计算密集型任务;Service Worker 是浏览器背后的独立代理线程,核心价值是可编程的持久缓存与离线体验。

**Web Worker**:JS 单线程模型下,前面任务没做完后面只能等;Worker 允许主线程创建 worker 线程,后台运行互不干扰,完成后将结果返回主线程。好处:计算密集型或高延迟任务由 worker 负担,主线程保持流畅;worker 一旦创建始终运行,不会被主线程活动打断,但也消耗资源,不应过度使用。限制:同源限制;不能读取主线程网页的 DOM 对象(可读 navigator/location);与主线程不在同一上下文,不能直接通信(需消息机制);不能执行 alert/confirm,但可发 Ajax 请求。

**Service Worker**:本质是 Web 应用与浏览器之间的代理服务器(也可作浏览器与网络间的代理),基于 Web Worker,不阻塞 JS 线程;用于创建有效的离线体验、拦截网络请求、访问推送通知和后台同步 API,常用来缓存文件提高首屏速度。要求传输协议必须是 HTTPS(涉及请求拦截,必须保证安全);可自由控制缓存哪些文件、如何匹配与读取,缓存具有持续性。实现缓存三步:注册 Service Worker → 监听 install 事件缓存所需文件 → 下次访问时拦截请求,命中缓存直接读取,未命中调用 fetch 获取。未命中 SW 缓存时按缓存优先级继续查找(Memory Cache、网络等),但无论数据实际来自哪里,浏览器都会显示为从 Service Worker 获取。

**三类缓存补充**:Memory Cache 是内存中当前页面已抓取的资源(样式、脚本、图片),读取快但持续性短,随进程释放而释放,关闭 Tab 即失效;内存容量有限,不能全放内存。Disk Cache 是硬盘缓存,读取慢些,但胜在容量与存储时效。Push Cache 是 HTTP/2 的推送缓存,前三种都未命中才使用;只在会话(Session)中存在,Chrome 中约 5 分钟;可推送 no-cache/no-store 资源;连接关闭即释放;多个页面可共享同一 HTTP/2 连接的 Push Cache;缓存只能被使用一次;浏览器可拒绝已存在的资源推送;也可给其他域名推送。

### 微前端 {#bw-micro}

一句话:微前端是把微服务理念应用于浏览器端的架构体系,将单一前端应用变为多个可独立开发、运行、部署的小型应用聚合,核心问题是拆分整合与隔离。

- 定位:不是框架或工具,而是一套架构体系;各子应用可使用不同技术栈、独立运行、独立开发、独立部署。解决的问题:庞大应用拆分后可单独部署维护,提升效率;基本不修改原有系统逻辑的前提下兼容新老系统并行运行。

| 方案 | 要点 | 优缺点 |
| --- | --- | --- |
| Nginx 路由转发 | 不同路径映射到不同应用 | 简单快速易配置;属运维层面,切换应用触发浏览器刷新影响体验 |
| iframe 嵌套 | 子应用嵌 iframe,父子通信用 postMessage 或 contentWindow | 实现简单、自带沙箱隔离;样式显示有兼容性问题 |
| Web Components | 子应用用纯 Web Components 编写 | 可单独部署;开发模式全新、改造成本高、通信复杂 |
| 组合式应用路由分发 | 子应用独立构建部署,父应用管理路由、加载、启动、卸载和通信 | 纯前端改造、体验好、可无感切换;需解决样式冲突、变量污染、通信等问题 |

- 应用隔离(主应用与微应用):CSS 隔离——主微应用同屏渲染可能样式互相污染,可用 CSS Modules 或命名空间保证互不干扰,或用 webpack 的 postcss 插件打包时加特定前缀;微应用之间则在应用加载时标记所有 link 和 style,卸载应用时同步卸载。JS 隔离——使用沙箱机制,避免对全局 window 与全局事件的修改;浏览器端可结合 with 关键字或 Proxy 实现沙箱,保证局部 JS 运行时对外部对象的访问和修改在可控范围内。

## Vue {#vue}

### Vue 基础 {#vue-basics}

**MVVM**：MVVM 即 Model-View-ViewModel，是一种设计思想。View 与 Model 之间没有直接联系，而是通过 ViewModel 交互，且两者之间的交互是双向的——View 数据的变化会同步到 Model，Model 数据的变化也会立即反映到 View 上。双向数据绑定让 View 与 Model 的同步完全自动化，开发者只需关注业务逻辑，不需要手动操作 DOM、维护数据状态同步。

**Vue 的优点与特点**

- 优点：双向绑定（Vue2 用 `Object.defineProperty` 劫持数据，Vue3 用 Proxy）；简单易学（中文文档、生态完善）；虚拟 DOM 结合 DIFF 算法把多次操作合并为一次推送真实 DOM（前提是频繁操作场景）；组件化思想，便于复用维护。
- 缺点：相比 Angular 和 React 生态不够完善；构建大型应用的企业多用 React，中小企业多用 Vue。
- 与 React 对比：共同点是组件化、虚拟 DOM、数据绑定；不同点是设计思想（Vue 定位降低开发门槛，React 推崇函数式编程）、React 用 JSX 把 HTML/CSS 写入 JavaScript、DIFF 算法实现不同。

**v-show 与 v-if**

| 对比项 | v-show | v-if |
| --- | --- | --- |
| 本质 | 切换 CSS 的 `display:none`，元素始终存在 | 动态创建/销毁 DOM 元素 |
| 初始渲染 | 无论条件真假都会渲染 | 惰性，初始为 false 时不渲染 |
| 切换开销 | 低，只改 CSS | 高，反复增删 DOM 可能触发重排 |
| 适用场景 | 频繁切换 | 条件很少改变 |

**v-if 和 v-for 不建议一起用**：v-for 的优先级比 v-if 高，同一元素上同时使用会先完整循环渲染列表，再逐个执行 v-if 判断销毁不符合项，造成不必要的计算浪费。解决方式：条件在外层时用 `<template>` 包裹（不生成 DOM 节点）在外层做 v-if；条件在循环内部时用 computed 提前过滤数据。

```html
<!-- 反例：先循环再判断，浪费性能 -->
<p v-if="isShow" v-for="item in items">{{ item.title }}</p>
<!-- 正确做法 -->
<template v-if="isShow">
  <p v-for="item in items">{{ item.title }}</p>
</template>
```

由于 v-show 只是通过 `display:none` 隐藏而非销毁 DOM，v-show 和 v-for 同用没有影响。

**双向数据绑定原理**：Vue2.x 采用数据劫持结合发布-订阅模式，通过 `Object.defineProperty` 劫持各属性的 setter/getter，数据变动时发布消息给订阅者触发监听回调。整体整合 Observer（监听 model 数据变化）、Compile（解析编译模板指令）、Watcher（两者间的通信桥梁）三者，实现「数据变化 → 视图更新、视图交互（如 input）→ 数据变更」。Vue3.x 放弃 defineProperty，改用 ES6 原生 Proxy。

**computed 与 watch**

| 对比项 | computed | watch | methods |
| --- | --- | --- | --- |
| 性质 | 计算属性，return 结果，自动调用 | 观察、监听，发生改变就调用 | 定义函数，手动调用 |
| 使用场景 | 一个数据受多个数据影响 | 一个数据影响多个数据，或含异步逻辑 | 获取数据、改变状态等交互 |
| 缓存 | 有，依赖不变直接返回之前结果 | 无，重新渲染也会执行 | 无 |
| 异步 | 不支持 | 支持异步监听 | 支持 |

补充：computed 与 methods 的初始化在 beforeCreate 和 created 之间完成（props、data 同理）；computed 是依赖变化才重新计算，methods 每次调用都执行。

**插槽**：当复用组件不能满足特殊需求时，用插槽向组件分发内容——在子组件需要扩展的位置放 `<slot>` 占位，父组件使用时填入内容。默认插槽可写默认值（父组件不传时生效）；具名插槽对插槽命名，父组件通过 `v-slot:名字` 确定分发位置；作用域插槽让子组件向父组件传值。注意父子组件编译作用域不同：父级模板内容在父级作用域编译，子模板内容在子作用域编译。

```html
<!-- 子组件：具名插槽 + 默认插槽 -->
<slot name="header">这里是头部</slot>
<slot>这里是默认</slot>
<!-- 父组件 -->
<BBorder>
  <template v-slot:header>头部</template>
  <p>落到默认插槽的内容</p>
</BBorder>
<!-- 作用域插槽：子组件传值 -->
<slot :user="user">{{ user.lastName }}</slot>
<current-user>
  <template v-slot:default="slotProps">{{ slotProps.user.firstName }}</template>
</current-user>
```

**key**：key 相当于给 vnode 添加唯一 id，主要在 DOM DIFF 算法中使用。

1. 列表场景：没有 key 时 Vue 无法跟踪节点，采用「就地复用」策略，头部插入新元素会导致后续所有节点内容依次变更；有 key 时能更准确、更快地定位 vnode，只做一次插入，大幅减少 DOM 操作。
2. 强制替换元素：key 改变时 Vue 认为产生了新元素，删除旧元素并插入新元素，可用于强制重新渲染（如时间戳做 key）。

注意不要用数组索引 index 做 key：向指定位置插入新元素后，后续元素的索引全变了，对应 vnode key 全部更新，等于没加 key。应使用唯一标识（如 id），没有唯一 ID 时可用 uid 拼接 index 或时间戳。

**过滤器**：用于文本格式化（如时间戳转常见格式），可在双花括号插值和 v-bind 表达式中使用。Vue3 已移除过滤器，改用计算属性或方法。

```js
// 模板中使用：{{ message | capitalize }} 或 v-bind:id="rawId | formatId"
filters: {                    // 组件内定义
  capitalize(value) {
    if (!value) return ''
    return value.toString().charAt(0).toUpperCase() + value.slice(1)
  }
}
Vue.filter('capitalize', fn)  // 全局定义
```

**Scoped 原理**：实现思路是：为每个组件实例生成唯一标识（InstanceID）；给模板中每个标签的 DOM 元素添加 `data-v-实例标识` 属性；给 scoped 样式每个选择器的最后一个选择器单元增加属性选择器 `[data-v-实例标识]`。特点是样式范围限制在组件自身标签内——包含子组件的根标签，不包含子组件其他标签（子组件根元素同时带父子两个实例标识）。例外：递归组件若含后代选择器（如 `div p`），会选中当前递归实例中所有匹配的 p 元素，打破该限制。

**ref**：用于获取 DOM 元素或组件的引用，或在父子组件中获取对方元素取值、调用方法。每个组件实例上都有 `$refs` 对象存储引用，默认为空对象。

```html
<my-counter ref="counterRef"></my-counter>
```

```js
// 引用组件实例后可调用其 methods
this.$refs.counterRef.add()
```

注意：`$refs` 只在组件渲染完成后生效且不是响应式的，仅作为直接操作子组件的「逃生舱」，应避免在模板或计算属性中访问；获取不到时可试试 `$nextTick`。

**$nextTick**：在下次 DOM 更新循环结束之后执行延迟回调，修改数据之后立即使用可获取更新后的 DOM。Vue 中数据改变后不会马上更新视图（否则性能差），而是把更新加入任务队列，待执行栈的任务处理完才执行；需要实时获取最新 DOM 时手动调用 `$nextTick`。

**keep-alive**：用 keep-alive 包裹组件时，缓存不活动的组件实例而非销毁，返回时重新激活，主要用于保存组件状态或避免重复渲染（如保存商品列表页滚动位置、筛选信息），配套钩子是 activated（激活时）和 deactivated（失活时）。注意与 HTTP 的 `Connection: Keep-Alive` 无关——后者是让 TCP 传输完数据后保持打开，省去下次建连时间。

**data 为什么是函数**：组件 data 写成函数、以返回值形式定义，每复用一次组件就返回一份新的 data，相当于给每个实例创建私有数据空间；写成对象则所有实例共用同一份 data，造成「一个变了全都变」。

### 组件 {#vue-components}

**组件生命周期**：Vue 实例从创建到销毁的过程，共 8 个主要阶段（创建前/后、挂载前/后、更新前/后、销毁前/后），外加 keep-alive 的激活/失活钩子；beforeMount 及之后的钩子在服务器端渲染期间不会被调用。

| 钩子 | 时机与要点 |
| --- | --- |
| beforeCreate | 实例初始化后，data/methods 未初始化，适合做与数据无关的事如 loading |
| created | 创建完成，data/methods/computed 已初始化，可发请求，但 DOM 未挂载 |
| beforeMount | 挂载前，render 函数首次被调用，页面显示的还是未编译的 {{}} |
| mounted | 挂载完成，最早可操作 DOM；不保证子组件挂载完，需等待时用 `vm.$nextTick` |
| beforeUpdate | 数据已变、DOM 更新前，data 最新但页面还是旧的 |
| updated | DOM 已更新；避免在此修改状态，否则可能无限循环 |
| activated / deactivated | 被 keep-alive 缓存的组件激活 / 失活时调用 |
| beforeDestroy | 销毁前，实例仍完全可用，适合清理定时器、解绑事件 |
| destroyed | 销毁后，指令解绑、事件监听移除、子实例销毁 |

**组件通信方式**：常见方式有 props、$emit、v-model、$refs、provide/inject、eventBus、vuex/pinia；少见的还有插槽 slot、混入、路由携带参数、localStorage、`$parent` / `$children` 等。

1. props：父传子，子组件用 props 接收。
2. $emit：子传父，子组件 `this.$emit('事件', '数据')`，父组件监听。
3. provide/inject：适合层级很深的场景（A→B→C→…→E），无论多深都能取到。
4. eventBus：事件总线，不限父子关系，简单粗暴但不好维护，不建议滥用。
5. vuex：大型项目（尤其单页应用）统一管理全局状态。

**EventBus**：兄弟组件通信的中间事件总线（事件巴士）思想：创建一个 Vue 实例作为媒介，一方 `$emit` 触发事件，另一方 `$on` 监听。

```js
// bus.js 单独文件导出，或 main.js 中 Vue.prototype.$EventBus = new Vue()
export const EventBus = new Vue()

medium.$emit('eventName', data)                // 发送方
medium.$on('eventName', (data) => { /*...*/ }) // 接收方
```

### Vue-router {#vue-router}

**$router 与 $route**：`$router` 是路由实例对象，含编程式方法与全局配置：`push`、`replace`、`go`、`back`、`forward`、`beforeEach`、`afterEach`、`addRoutes`、`currentRoute` 等；`$route` 是当前路由信息对象：`path`、`query`、`params`、`hash`、`fullPath`、`name`、`matched`、`redirectedFrom`。

**hash 模式与 history 模式**：核心区别是 hash 依靠 `onhashchange` 事件监听 `location.hash` 改变；history 依靠 HTML5 的 `pushState()`（改变 url 且不发请求）和 `replaceState()`（修改历史记录栈）。

| 对比项 | hash 模式 | history 模式 |
| --- | --- | --- |
| URL 显示 | 夹杂 `#` 号，不好看 | 路径正规、干净 |
| 实现原理 | onhashchange 监听 | H5 history 的 pushState/replaceState |
| 是否发请求 | 不刷新页面、不发给服务器 | 前端 URL 必须与后端实际一致 |
| 后端支持 | 不需要 | 需要；手动输入 URL 或刷新时后端未处理该路径会 404，需配置覆盖所有情况的候选资源 |
| 兼容性 | 好 | 略差 |

```js
// hash 模式监听
window.addEventListener('hashchange', () => { /* 更新视图 */ })
// history 模式
history.pushState(state, title, url)    // 添加记录，不刷新页面
history.replaceState(state, title, url) // 替换当前记录
window.addEventListener('popstate', (e) => { /* 前进/后退时触发 */ })
```

补充 history 要点：pushState 的 url 必须与当前页面同域，跨域报错；仅调用 pushState/replaceState 不触发 popstate，只有点击前进/后退或调用 `back()`/`forward()`/`go()` 才触发；页面首次加载也不触发 popstate。

**路由传参**：分 params 和 query 两大类，params 又分 URL 中显示与不显示两种。推荐「命名路由 + params」和「query」，两者都不需要修改路由配置。

```js
this.$router.push({ name: 'B', params: { id: 1 } })      // 命名路由：URL 不显示参数
this.$router.push({ path: '/child', query: { id: 1 } })  // query：URL 显示参数
this.$route.params.id   // 读取
this.$route.query.id
// params + 动态路径方式需配置 { path: '/child/:id', component: Child }
```

**前端路由**：把「不同路由对应不同内容或页面」的任务交给前端（之前由服务端根据 url 返回不同页面）。实质是检测 URL 变动，截获 URL 地址，通过解析、匹配路由规则实现 UI 更新。URL 的改变（不含 hash 变化）只能由三种情况引起：点击浏览器前进/后退（可监听 popstate）、点击 a 标签、JS 调用 `pushState()`/`replaceState()`。

### Vuex {#vue-vuex}

**Vuex 是什么、解决了什么**：Vuex 是专为 Vue.js 开发的状态管理模式，采用集中式存储管理应用所有组件的状态，并以相应规则保证状态以可预测的方式变化（内部实现 Flux 模式，即数据单向流动）。它解决的问题：多个组件依赖同一状态时，兄弟组件间状态无法直接传递，不同视图变更同一状态要靠事件同步，遗漏就出现状态更新错误；组件一多，共享数据互相关联，状态变得不可预测、难以维护。好处：全局管理、状态变更跟踪、规范化、便于调试；嵌套/兄弟组件状态更好维护；同一数据集请求缓存共享，减轻服务端压力；便于团队开发维护。

**五个核心概念**：核心是一个 store 仓库，包含应用中的大部分状态。

| 概念 | 职责 | 类比 |
| --- | --- | --- |
| state | 集中存储数据，`this.$store.state` 或 mapState 辅助函数访问 | 组件的 data |
| getters | state 的派生计算，随 state 变化 | 组件的 computed |
| mutations | 修改数据的唯一方式（同步），组件 `commit` 触发 | — |
| actions | 用于异步，`dispatch` 调用，内部间接提交 mutation | — |
| modules | 分割 store，每个 module 拥有自己的 state/mutations/actions/getters | — |

```js
const store = new Vuex.Store({
  state: { name: 'wenmo' },
  getters: { upperName: state => state.name.toUpperCase() },
  mutations: { setName(state) { state.name = 'WENMO' } },
  actions: { setAction(context) { setTimeout(() => context.commit('setName'), 1000) } }
})
this.$store.state.name          // 读
this.$store.commit('setName')   // 同步修改
this.$store.dispatch('setAction') // 异步触发
```

**Flux 模式**：Vuex 是 Flux 思想的落地。基本原则：单一数据来源（共享数据统一保存在 store，组件从中读取、不保留副本，防止冲突）；数据只读（组件不能直接修改，必须通知 store 由已定义的更新函数执行修改）；更新是同步的（便于追踪状态变化和调试，异步无法判断执行顺序）。

### 虚拟 DOM {#vue-vdom}

**是什么**：虚拟 DOM 本质上是 JS 和 DOM 之间的映射，表现为一个能描述 DOM 结构及其属性信息的 JS 对象：用 JS 对象作为基础树，用对象属性描述节点，再映射成真实 DOM 结构。

```js
// <div id="app"><p class="text">hello</p></div> 转换为虚拟 DOM
{
  tag: 'div',
  props: { id: 'app' },
  children: [{ tag: 'p', props: { className: 'text' }, children: ['hello'] }]
}
```

**好处与缺点**：

1. 优化性能：虚拟 DOM 像缓存区，渲染更新频繁时先对比前后两棵虚拟 DOM 树，定位需要更新的部分生成「补丁集」（JS 对象），一次性打到真实 DOM 上，避免大量不必要的计算。
2. 抽象化渲染过程：比 diff 更大的优势——抽象了渲染过程，实现跨平台能力，不局限于浏览器 DOM，可以是安卓/iOS 原生组件、小程序或各种 GUI，解耦视图层和渲染平台。
3. 缺点：初次渲染多出一层虚拟 DOM 计算；且不一定高效——每次改动不大时才相对高效，改动很大时反而多出更多计算。

### DIFF 算法 {#vue-diff}

DIFF 算法是同层树节点比较的算法。朴素做法要先遍历旧 DOM、再遍历新 DOM、最后判断改变/新增/删除，共遍历三回，一千个节点就可能产生十亿次计算。优化后的核心策略（时间复杂度 O(n)）：

1. 只比较同一层级，不跨级比较。
2. 标签不同，直接删除重建，不继续比较。
3. 标签名相同且 key 相同，就认为是相同节点，不再深度比较。

### Vue3 {#vue3}

**Composition API 与 Options API 的不同**

| 对比项 | Options API（Vue2） | Composition API（Vue3） |
| --- | --- | --- |
| 代码组织 | 按 data/methods/computed 等选项组织，组件复杂后相关逻辑分散在不同选项中，难以阅读 | 按逻辑功能组织代码，一个功能的 API 聚在一起 |
| 逻辑复用 | 依赖 mixins 或全局函数，易命名冲突、数据来源不明确 | 通过函数组合逻辑，setup 中更灵活复用 |
| 响应式 | 通过 this 访问实例与 this.$data | 用 ref、reactive 等函数创建响应式数据 |
| TS 支持 | 支持但需额外配置和类型声明 | 提供更好的支持 |

**Vue3 与 Vue2 的区别**：

1. 引入 tree-shaking，构建时剔除未使用代码，整体体积变小。
2. 源码用 TS 重写，TypeScript 支持更好（类型推断更准确、类型定义更丰富）。
3. 支持 Composition API，基于函数、更灵活地组织组件逻辑。
4. 响应式系统改用 Proxy 替代 Object.defineProperty，可监听动态新增/删除属性及数组变化。
5. 编译优化：Vue2 标记静态根节点优化 diff，Vue3 标记和提升所有静态根节点，diff 时只需对比动态节点内容。
6. 打包体积优化：移除不常用 API（inline-template、filter）。
9. 生命周期变化：setup 代替 beforeCreate 和 created；template 模板支持多个根标签。
10. API 使用变化：Vuex 用 createStore 创建实例；获取实例与路由信息用 getCurrentInstance/useRoute/useRouter（不再通过 this）；props 直接通过 props 访问；子组件用自定义名称（如 backData）向父组件传回数据时需在 emits 中定义。

**为什么用 Proxy 替换 defineProperty**：Object.defineProperty 的局限：无法监听数组索引和 length 属性的变化（直接修改不触发响应式更新）；只能拦截 get 和 set，无法劫持对象属性的删除和新增；深层嵌套对象需要递归监听，有性能开销。Proxy 提供丰富的拦截操作（get、set、has、deleteProperty 等），可直接劫持整个对象，轻松递归观察整个对象树的变化，也更准确地拦截数组变化。

## React {#react}

### 基础语法 {#react-basics}

**对 React 的理解**：React 是用于构建界面的 JavaScript 库，特性包括 JSX 语法、单向数据绑定、组件化开发、虚拟 DOM、声明式编程。

**state 和 props**：state 是组件内部的变量，一般 state 改变后组件会更新；props 是属性，用于父子通信，且 props 不可修改。

**JSX 是什么**：JSX 是看起来很像 XML 的 JavaScript 语法扩展，本质是 `React.createElement`，既不是字符串也不是 HTML，可以生成 React 元素（如 `const ele = <h1>hello world</h1>` 会被 Babel 转译为 React.createElement() 调用）。要点：React 认为渲染逻辑与其他 UI 逻辑内在耦合，将标签和逻辑共同存放在组件中实现「关注点分离」；编译后 JSX 转为普通 JS 函数调用，取值后得到 JS 对象，React 读取这些元素对象构建 DOM 并保持更新；允许在条件或循环语句中使用 JSX，可赋值给变量、作为参数传入、从函数返回；防止注入攻击——React DOM 渲染所有内容后会转义，可安全插入用户内容，确保不会注入非自己写的内容。

**React 事件机制**：React 事件是合成事件（SyntheticEvent），充当浏览器原生事件的跨浏览器包装器，将不同浏览器行为组合到一个 API 中，确保事件属性一致。

1. React 不是把事件绑定到真实 DOM 上，而是在 document 处监听所有事件，事件发生并冒泡到 document 时，React 将事件内容封装并交由真正的处理函数运行。可减少内存消耗，组件挂载/销毁时统一订阅和移除。
2. 冒泡到 document 的不是原生浏览器事件，而是 React 自己实现的合成事件。
3. 阻止事件冒泡调用 `event.stopPropagation()`，阻止默认行为调用 `event.preventDefault()`。
4. 合成事件的目的：抹平浏览器兼容问题；原生事件每个监听器都分配事件对象、造成高额内存分配，合成事件有专门的事件池管理创建和销毁，事件被使用时从池中复用对象，回调结束后销毁对象属性便于复用。

**引入 CSS 的方式**：内联样式（style 属性直接引入）；组件中引入 .css 文件（全局生效，样式互相影响）；CSS in JS（第三方库）；引入 .module.css 文件（模块化）。

**setState 同步还是异步**：取决于被调用的环境，这里的「同步/异步」指调用后 DOM 更新是同步还是异步。

1. React 能控制的范围（合成事件处理函数、生命周期函数）：批量更新，状态合并后再更新 DOM，表现为异步。
2. 原生 JS 控制的范围（原生事件、定时器回调、Ajax 回调）：React 17 及以前立即更新 DOM，表现为同步；可在外面包一层 batchUpdates 手动切换为批量执行。
3. React 18 之后所有 setState 都异步批量执行。

所谓异步就是批量更新：来一个 setState 就加入队列，时机成熟后合并队列中的 state 结果，只对最新 state 走一次渲染流程（shouldComponentUpdate → render → componentDidUpdate），避免频繁 re-render。

```js
// React18：自动批量处理，只 render 一次
setTimeout(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
}, 1000)
// 需要同步更新时用 react-dom 的 flushSync
flushSync(() => { this.setState({ count: count + 1 }) })
```

**refs 的理解**：ref 即 reference（引用），是 React 中的一个属性，用于存储对 React 元素或组件的引用。三种使用方式：字符串（React16 之前最常用，不推荐）、函数（ref 对应一个方法，参数即节点实例）、`React.createRef()`（React16 API）。使用场景：input 聚焦、直接使用 DOM 元素的某个方法、直接使用自定义组件的某个方法。作用规则：作用于内置 HTML 组件得到真实 DOM 元素；作用于类组件得到类的实例；不能直接作用于函数组件，但函数组件可通过 `React.forwardRef()` 传递/暴露 ref。注意 render 阶段不能访问 refs——该阶段 DOM 还未生成，DOM 获取需要在 pre-commit 和 commit 阶段。

```jsx
class MyComponent extends React.Component {
  myRef = React.createRef() // React16 API
  render() { return <div ref={this.myRef} /> }
}
const Input = forwardRef((props, ref) => <input {...props} ref={ref} />) // 函数组件暴露 DOM
```

**key 的作用**：Diff 算法根据 key 判断元素是新创建的还是被移动的元素，从而减少不必要的渲染。key 是 React 保留的两个特殊 prop 之一（另一个是 ref），接收 key 的组件并不能读取到 key 的值。

### React 生命周期 {#react-lifecycle}

React15 的生命周期含 constructor、componentWillMount、componentWillReceiveProps、shouldComponentUpdate、componentWillUpdate、render、componentDidMount、componentDidUpdate、componentWillUnmount；React16 废弃了三个带 Will 的更新期钩子，新增 getDerivedStateFromProps 和 getSnapshotBeforeUpdate。常用钩子要点：

1. constructor：实例化时自动调用，通过 super 获取父组件 props，通常初始化 state 或在 this 上挂载方法。
2. static getDerivedStateFromProps(nextProps, prevState)：静态方法（纯函数），在每次 render 前调用，组件创建和更新阶段都触发（16.4 后任何更新流程都触发）；比较 props 和 state 防止无用的 state 更新，返回新对象作为新 state，返回 null 表示不更新。
3. shouldComponentUpdate：接到新 props 或 state 时调用，返回 true/false 告知是否更新，默认 true；不建议做深层比较（影响效率），不能调用 setState（无限循环）。
4. getSnapshotBeforeUpdate(prevProps, prevState)：render 后、DOM 更新前执行；返回的 Snapshot 值作为 componentDidUpdate 的第三个参数，用于获取更新前信息（如滚动位置），更新后据此恢复 UI 视觉状态。
5. componentDidMount：挂载后执行，做数据获取、事件监听等。
6. componentDidUpdate：更新结束后触发，可根据前后 props/state 变化做相应操作。
7. componentWillUnmount：卸载前清理注册或监听的事件、取消订阅的网络请求；实例一旦卸载不会再被挂载，只会被重新创建。

为何废弃 componentWillMount、componentWillReceiveProps、componentWillUpdate：Fiber 机制下 render 阶段允许被暂停、终止和重启，render 阶段的生命周期都可能重复执行；这三个方法常年被滥用（setState、fetch 发请求、操作真实 DOM），存在风险，这些操作完全可以转移到其他方法中。废弃后既确保 Fiber 机制下的数据安全，也让生命周期方法行为更纯粹。

### 组件开发 {#react-components}

**有状态组件和无状态组件**：不需要管理自身状态的组件应优先设计为函数组件。

| 对比项 | 有状态组件 | 无状态组件 |
| --- | --- | --- |
| state | 内部维护自己的 state，结合 props 渲染 | 不依赖自身 state，props 改变即 re-render |
| 形式 | 类组件（有继承、有 this、有生命周期） | 类组件或函数组件，可避免使用 this |
| 使用场景 | 需要使用状态、需要状态操作 | 组件不需要管理 state |
| 优点 | 可维护自己的 state，能做更多控制 | 简化代码专注 render、无需实例化、视图和数据解耦 |
| 缺点 | 相对复杂 | 无法使用 ref、无生命周期、无法控制 re-render |

**函数式组件和类组件的区别**

| 对比项 | 函数组件 | 类组件 |
| --- | --- | --- |
| 编写形式 | 函数形式，语法简单 | 类形式，更复杂 |
| 状态 | （Hooks 之前）无状态 | 有状态 |
| 生命周期 | 不存在（Hooks 后可用钩子模仿） | 有 |

**受控组件和非受控组件**

| 对比项 | 受控组件 | 非受控组件 |
| --- | --- | --- |
| 表单状态 | 变化触发 onChange，更新组件 state | 没有 value props，不维护 state |
| 取值方式 | 从 state 读取 | 用 ref 从 DOM 获取表单值，不写事件处理函数 |
| 特点 | 渲染状态与 value/checked 对应，消除局部状态，组件可控 | 减少代码量 |
| 缺点 | 多个输入框都要写事件处理函数，代码臃肿 | — |

**组件通信**：父向子——数据流单向，通过 props（最常见）；子向父——父组件传一个函数，子组件通过函数回调传值；兄弟组件——父组件作为中间层实现数据互通；父向后代——使用 Context 共享数据，像全局数据一样，后代组件都能读取；非关系组件——关系复杂时做全局资源管理，例如 Redux、Dva。

**PureComponent 与 Component**：Component 需要手动实现 `shouldComponentUpdate`，PureComponent 默认以浅比较实现了它（浅比较只比较第一层）。注意 PureComponent 不仅影响本身还会影响子组件，最佳使用场景是展示组件。

**高阶组件**：高阶组件（HOC）是一个函数，接收组件作为参数，返回一个新的组件。

### React Hooks {#react-hooks}

React 16.8 之后推出 Hooks，让函数组件可以使用类组件的特性。解决的三个问题：组件间逻辑复用、复杂组件难以理解、难以理解的 class。好处：跨组件复用轻量、改造成本小，不影响原组件层级结构（避免嵌套地狱）；状态与 UI 隔离，状态逻辑粒度更小，可把业务逻辑抽离成自定义 hook。缺点：状态不同步，容易产生闭包问题，需要用 useRef 记录。使用限制：不在循环、条件、嵌套函数中调用（Hook 基于链表实现，必须保证调用顺序稳定，否则数组取值错位）；仅在函数组件中调用（没有 this）。

**常见 Hooks**：useState、useEffect、useContext、useReducer、useRef、useMemo、useCallback、useLayoutEffect、useImperativeHandle、useDebugValue。为什么 useState 返回数组而不是对象：数组解构可自由命名，代码干净；对象解构必须与内部返回属性同名，多次使用只能设别名。

**useMemo 与 useCallback**：函数式组件从头更新到尾，一处改变所有模块都刷新。useMemo 防止「父组件更新时子组件无论是否相关都跟着更新」：第二个参数是依赖数组，据此判断是否重新执行第一个函数并缓存返回值。useCallback 与 useMemo 几乎一样，唯一区别是 useMemo 返回函数运行结果，useCallback 返回函数本身；该函数通常是传给子组件的，防止无关刷新，且必须配合 memo 使用，否则可能反而降低性能。

```jsx
// 缓存大量计算
const someProp = useMemo(() => heavyCalculation(props.item), [props.item])
// 缓存函数引用，配合 memo 防止子组件无关刷新
const handleChange = useCallback(() => props.callback(props.id), [props.id])
```

**useRef**：返回一个可变的 ref 对象，只有 current 属性，可设置 initialValue。用途：获取当前元素的所有属性、缓存数据。react-redux 在 Hooks 推出后用大量 useMemo 重做了 Provider 等核心模块，并用 useRef 缓存数据（都不绑定在 DOM 上）；利用重新赋值改变缓存数据可减少不必要更新——用 useState 势必 re-render。实践建议：自定义 hooks 接收外部传值时优先 useRef 再考虑 useState；封装时存放的值放入 useRef。

**useLayoutEffect 和 useEffect**：共同点是都用于处理副作用（DOM 改变、订阅设置、定时器操作）。

| 对比项 | useEffect | useLayoutEffect |
| --- | --- | --- |
| 调用时机 | 异步调用，屏幕像素改变后执行 | 所有 DOM 变更后同步调用，改变屏幕像素之前执行 |
| 视觉表现 | 可能闪烁 | 不会闪烁（会推迟页面显示时间） |
| 执行顺序 | 后 | 总是先于 useEffect；与 componentDidMount/componentDidUpdate 时机一样 |
| 建议 | 优先使用，避免阻塞视觉更新 | 页面有异常（闪烁）时再替换 |

### 状态管理 {#react-state}

**Redux**：名字含义是 Reducer + Flux。Context 提供全局可访问对象（Provider 包住最顶层组件，context 覆盖整个应用），但全局对象应避免——任何一处修改其他地方都受影响，只适用于个别组件，不能滥用。Redux 的 store 封装得好，没有提供直接修改状态的功能，克服了全局对象的缺点；且一个应用只有一个 Store，不算滥用。工作原理：

1. 用户（View）发出 action，使用 dispatch。
2. store 自动调用 reducer，传入当前 state 和收到的 action，reducer 返回新的 state。
3. state 变化，store 调用监听函数，更新 View。

异步请求处理借助中间件，主要有 redux-thunk 和 redux-saga（常用）。redux-saga 的优点：异步解耦（不掺杂在 action 或 component 中）、可用 try/catch 捕获异常、功能强大无需或简单封装即可使用、灵活（可将 saga 串行形成异步 flow）、易测性；缺陷：学习成本高、体积略大、功能过剩、yield 无法返回 TS 类型。

connect 连接 React 和 Redux 的工作：通过 context 获取 Provider 中的 state，`store.getState()` 获取 store tree 上所有 state；将 state 和 action 以 props 方式传入组件（mapStateToProps、mapDispatchToProps 与组件原有 props 合并传给被包裹组件）；监听 state tree 变化——connect 缓存 state 状态，比较当前和变更前状态，确定是否 setState 触发 re-render。

**Redux 和 Vuex 的区别**：Vuex 改进了 Redux 的 action 和 reducer，以 mutations 变化函数取代 reducer，无需 switch，直接在 mutations 中修改对应 state；Vuex 无需订阅重新渲染，只需生成新的 state，Vue 检测到 state 修改自动渲染；Vuex 弱化 dispatch 和 reducer，数据流为 view 调用 store、commit 提交到对应 mutations、store 修改后自动渲染，更简易。共同点：单一数据流、可预测变化、都为 MVVM 思想服务。

**Redux Toolkit**：Redux Toolkit（RTK）是 Redux 官方推荐的 Redux 开发工具，注意它只是封装了一层 Redux。包含简化最常见 Redux 场景的实用功能：配置 store、定义 reducer、编写不可变的更新逻辑，甚至可直接创建整个状态的「切片 slice」而无需手动编写任何 action creator 或 action type；还自带最常用的 Redux 插件——用于异步逻辑的 Redux Thunk、用于编写选择器 selector 的 Reselect，均可直接使用。

### 路由 {#react-router}

**原理**：客户端路由的两种实现：基于 hash 路由，监听 hashchange 事件，`location.hash = xxx` 改变路由；基于 H5 的 history，通过 pushState 和 replaceState 修改 URL，能应用 `history.go()` 等 API，允许通过自定义事件触发。react-router 基于 history 库实现（可保存浏览器历史记录）：维护一个列表，检测到 URL 变化时通过配置的路径匹配对应的 Component 并 render。核心组件：

1. Route：比较 path 属性和当前地址的 pathname，匹配成功 render 对应组件，否则渲染 null。
2. Switch：对 Route 分组，遍历所有子 Route，渲染匹配的第一个元素。
3. Link：创建链接，在 HTML 处渲染锚点（a 标签）。
4. NavLink：to 属性与当前地址匹配时定义为活跃的（加 active 样式）。
5. Redirect：渲染强制导航实现重定向，属性有 from（被重定向路径）、to（重定向的 URL 字符串或 location 对象）、push（为真时新地址加入历史记录且无法回退）。

```jsx
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/about" component={About} />
</Switch>
<Link to="/">Home</Link> // 渲染为 <a href="/">Home</a>
```

**Link 和 a 标签**：两者都是链接、都渲染为 a 标签。Link 是 react-router 中实现路由跳转的链接，一般配合 Route 使用：有 onClick 就执行 onClick；click 时阻止 a 的默认事件；根据 to 属性使用 history 或 hash 跳转。跳转只触发相匹配的页面内容更新，不会整页刷新，而 a 是普通的超链接。Link 禁用后想实现跳转，可手动给标签赋值 location 属性。

**获取 URL 参数**：get 方式——`this.props.location.search` 获取 URL 字符串后解析参数；动态路由传值——如 `path='/admin/:id'`，用 `this.props.match.params.id` 获取，或使用 Hooks API；query 或 state 传值——Link 的 to 属性可传对象 `{ pathname: '/admin', query: '111', state: '111' }`，用 `this.props.location.state` 或 `this.props.location.query` 获取，一旦刷新页面数据丢失。

**获取历史对象**：`this.props.history`；React 16.8 及以后使用 React Router 的 Hooks：`const history = useHistory()`。

**路由模式**：BrowserRouter 用 H5 的 history API 控制路由跳转；HashRouter 用 URL 的 hash 属性控制路由跳转。

### React18 新特性 {#react-18}

**Concurrent（并发）**：正式支持并发，最主要的特点是渲染可中断。以前 update 是同步渲染，一旦开启，任务完成前不可中断。

**createRoot**：react-dom/client 中的 createRoot 取代以前的 ReactDOM.render（`createRoot(document.getElementById('root')).render(jsx)`）；以前 root 只存在于 React 内部，现在用户也可以复用 root。

**Automatic Batching（自动批量处理）**：setState 可同步可异步：React18 以前可把 setState 放在 promises、setTimeout 或原生事件中实现同步；所谓异步就是批量处理（state 攒够了再一起更新，减少 render 次数）。以前批量更新依赖合成事件，React18 后不再与合成事件有直接关系，而是自动批量处理——所有场景（包括 setTimeout、Promise 回调）都合并为一次渲染。需要同步 setState 时可使用 flushSync。

**Suspense**：支持 Suspense「等待」目标 UI 加载，并可直接指定加载界面（如 spinner）在用户等待时显示（`<Suspense fallback={<Spinner />}><Comments /></Suspense>`）。

**错误处理边界**：在 Suspense 中获取数据抛出的错误与组件渲染报错处理方式一样：在需要的层级渲染一个错误边界组件，「捕捉」层级下面的所有报错信息。

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
```

**SuspenseList**：用于控制 Suspense 组件的显示顺序（正式环境中尚未完全支持）。

**transition**：React 把 update 分成两种：Urgent updates（紧急更新），直接交互，如点击、输入，不及时用户就会觉得不对劲；Transition updates（过渡更新），如 UI 从一个视图向另一个视图的更新，用户并不着急看到。相关 API：startTransition（可用于任何更新，典型场景是渲染慢——有很多不着急的内容要渲染更新；网络慢——更新需较长时间从服务端获取，可结合 Suspense）、useTransition（使用 startTransition 更新状态时获取实时情况，`const [isPending, startTransition] = useTransition()`）、useDeferredValue（延迟更新不那么重要的部分，相当于参数版的 transitions）。

**新的 Hooks**：useTransition 如上；useId 产生在服务端与 Web 端都稳定且唯一的 ID，支持加前缀，多用于支持 SSR 的环境；useSyncExternalStore 用于外部数据的读取与订阅；useInsertionEffect 函数签名同 useEffect，但在所有 DOM 变更前同步触发，主要用于 css-in-js 库动态注入 `<style>` 或 SVG `<defs>`，因执行时机不可读取 refs。

### 虚拟 DOM {#react-vdom}

**是什么**：用 JavaScript 对象表示 DOM 信息和结构，状态变更时重新渲染这个 JS 对象结构，该对象即虚拟 DOM（如 `<button class="myButton"><span>this is button</span></button>` 可表示为 `{ type: 'button', props: { className: 'myButton', children: [...] } }`）。DOM 操作很慢，轻微操作都可能导致页面重新排版、非常耗性能；JS 对象处理起来更快更简单，通过 diff 算法对比新旧 vdom 差异，可批量地、最小化地执行 DOM 操作。VDOM 的优越之处：提供更高效的研发模式（函数式 UI 编程）的同时保持还不错的性能——保证性能下限，不手动优化时也提供过得去的性能；同时支持跨平台。

VDOM 生成真实 DOM 的 render 流程：构建虚拟 DOM → 通过虚拟 DOM 构建真正的 DOM → 生成新的 VDOM → 比较两棵 VDOM 异同 → 应用变更于 DOM。

**VDom 一定更快吗**：不一定。React 中涉及 VDOM 的代码分三部分：把 render 中的 JSX（或 createElement）转化为 VDOM；状态或属性改变后重新计算 VDOM 并生成补丁对象（domDiff，核心）；通过补丁对象更新视图中的 DOM 节点。DOM 操作是性能杀手（引起回流或重绘），通过预先计算减少 DOM 操作更划算；但「使用 VDOM 更快」不适用于所有场景——例如页面只有一个按钮、点击数字加一，直接操作 DOM 肯定更快，用 VDOM 白白增加计算量和代码量；复杂情况下浏览器也会根据操作的时间和次数做批量处理，直接操作 DOM 未必很慢。框架都使用 VDOM 的原因：提高代码的性能下限，极大优化大量操作 DOM 时的性能损耗，并保证在少数 VDOM 不给力的场景下性能也在可接受范围内。

### Diff 算法 {#react-diff}

流程：DOM 映射为 VDOM → VDOM 变化后根据差距生成 patch（结构化数据，包括增加、更新和移除）→ 根据 patch 更新真实 DOM。

diff 从树、组件、元素 3 个层面进行复杂度优化：

1. 树：忽略节点跨层级操作——若节点不存在了，该节点及其子节点被删除，不会进一步比较。
2. 组件：同一类型才进行树对比，类型不一致直接放入 patch；只要父组件类型不一致就会 re-render。
3. 元素：同一层级子节点通过 key 进行列表对比——标记了 key，React 可直接移动 DOM 节点，降低消耗。

### React 性能优化 {#react-perf}

总体思路：减少 render 执行次数、减少渲染的节点、降低渲染计算量。

1. 使用工具分析性能；使用不可突变数据结构（数组用 concat，对象用 Object.assign）；组件尽可能拆分；列表类组件优化；bind 函数优化；不滥用 props；reactDOMServer 服务端渲染组件。
2. React.memo：缓存组件、记忆组件渲染结果，只检查 props 是否变化（浅比较），第二个参数可传自定义比较函数 areEqual——返回值语义与 shouldComponentUpdate 相反。
3. React.useMemo：缓存大量计算。
4. PureComponent：React.Component 并未实现 shouldComponentUpdate，PureComponent 以浅层对比 Prop 和 State 实现了该函数。父组件状态每次更新都会导致子组件重新渲染（即使传入相同 props）——这里的「重新渲染」不是更新 DOM，而是每次都调用 diff 算法判断，对大型组件树非常消耗性能。浅比较中基本类型 props 值相同即相同；引用类型只比较是否同一个引用，内容一样但引用不同也认为不同。浅比较本身也花费时间，更适合大型展示组件；大型组件也可拆成小组件并用 memo 包裹。

避免重复渲染的实践：确保数据是值类型，引用类型不应有深层数据变化（解构）；避免内联对象——每次渲染重新创建引用，导致接收方浅比较始终返回 false、一直重新渲染，应把 style 等对象提取为常量；避免匿名函数——用 useCallback 缓存，或类组件中把方法定义为实例方法。

```jsx
// 反例：内联对象 + 内联函数，每次渲染都是新引用
<Comp style={{ margin: 0 }} onChange={() => props.callback(props.id)} />
// 优化：提取常量 + useCallback
const styles = { margin: 0 }
const handleChange = useCallback(() => props.callback(props.id), [props.id])
```

其他优化：组件懒加载——React.lazy 定义动态加载的组件，直接缩减打包体积、延迟加载初次渲染不需要的组件，React.Suspense 配合渲染 lazy 组件、等待加载时展示 loading；用 CSS 而不是强制加/卸载组件——渲染成本很高（尤其需要更改 DOM 时），避免对大型组件频繁加卸载，可用 opacity 控制显隐；React.Fragment 聚合子元素列表，不在 DOM 中添加额外标签；key 保证唯一性，diff 算法据此判断元素是新建还是移动，减少不必要渲染；合理使用 Context——无需为每层组件手动添加 Props，通过 Provider 传递数据，原则是只定义被大多数组件共用的属性；虚拟列表；合理设计组件——简化 Props、简化 State、减少组件嵌套。

```jsx
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'))
<Suspense fallback={<PageLoading />}>
  <SettingDrawer />
</Suspense>
```

### Fiber {#react-fiber}

React 15 渲染时递归对比 VDOM，找出需要变动的节点再同步更新，一气呵成。此过程中 React 占据浏览器资源，用户触发的事件得不到响应，导致掉帧、卡顿。React 16 起引入 Fiber 架构，让执行过程变得可中断：分批延时操作 DOM，避免一次性操作大量 DOM 节点，用户体验更好；也给浏览器一点喘息的机会，对代码进行编译优化及热代码优化。其思想是把浏览器的渲染、布局、绘制、资源加载、事件响应、脚本执行看成操作系统的 process，通过调度策略合理分配 CPU 资源，提高用户响应速率，兼顾执行效率。Fiber 也称协程或纤程，和线程不一样：协程本身没有并发或并行能力，只是一种控制流程的让出机制——让出 CPU 执行权，让 CPU 能在这段时间执行其他操作。

### dangerouslySetInnerHTML {#react-dangerouslysetinnerhtml}

是 React 中 innerHTML 的替代品，React HTML 元素上的一个属性。它可能是危险的：容易受到 XSS（跨站脚本攻击）——从第三方获取数据或用户提交内容时，HTML 元素可能会执行附加其上的 JS 脚本。因此使用时应通过 HTML 净化工具（如 DOMPurify）检测 HTML 中潜在的恶意部分。

```jsx
<div dangerouslySetInnerHTML={{ __html: newsTexts }} />
```
