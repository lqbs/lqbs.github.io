---
title: "第一章　认识数据分析系统"
description: "课程路线、售后案例与数据分析系统的组成。"
outline: [2, 2]
prev:
  text: 完整目录
  link: /posts/aftersales-analytics-from-scratch
next:
  text: "第二章　业务需求、指标与 PRD"
  link: "/posts/aftersales-analytics/02-requirements-and-prd"
---

# 第一章　认识数据分析系统

课程路线、售后案例与数据分析系统的组成。

[返回完整目录](/posts/aftersales-analytics-from-scratch#完整目录)

## 第 1 轮　学习目标与课程路线 {#turn-1}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div><div><p><span><span>学习</span></span><span> 如何开发一个数据分析系统</span></p></div></div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

<p v-pre>我们从零开始系统学习：<span><strong>如何开发一个完整的数据分析系统（Data Analytics System）</strong></span>。</p>

<p v-pre>这次不只是学习技术栈，而是以真实项目为例，带你走完从业务需求、数据建模、指标体系、数据处理、后端开发、前端可视化到系统上线的完整流程。</p>

<p v-pre>结合你已有的数据开发经验，我们会重点补足业务分析、系统设计和产品思维。</p>

#### 一、课程路线

<ol v-pre><li><div><div><p><span><strong>第一课：数据分析系统概述</strong></span></p><p>理解系统组成、业务价值、用户角色和整体架构。</p></div></div></li><li><div><div><p><span><strong>第二课：业务需求分析</strong></span></p><p>从业务问题提炼分析目标、用户需求和功能需求。</p></div></div></li><li><div><div><p><span><strong>第三课：指标体系设计</strong></span></p><p>学习 KPI、指标口径、维度、指标之间的关系。</p></div></div></li><li><div><div><p><span><strong>第四课：数据架构设计</strong></span></p><p>数据源、数据采集、ETL、数据仓库和数据模型。</p></div></div></li><li><div><div><p><span><strong>第五课：数据库设计</strong></span></p><p>事实表、维度表、汇总表及数据粒度。</p></div></div></li><li><div><div><p><span><strong>第六课：后端系统开发</strong></span></p><p>API、查询服务、权限、缓存和定时任务。</p></div></div></li><li><div><div><p><span><strong>第七课：前端数据可视化</strong></span></p><p>React、ECharts、筛选器、图表、联动和下钻。</p></div></div></li><li><div><div><p><span><strong>第八课：数据分析与业务洞察</strong></span></p><p>趋势分析、对比分析、异常分析和归因分析。</p></div></div></li><li><div><div><p><span><strong>第九课：系统测试与性能优化</strong></span></p><p>数据准确性、查询性能、权限和稳定性。</p></div></div></li><li><div><div><p><span><strong>第十课：项目上线与迭代</strong></span></p><p>部署、监控、用户反馈和持续迭代。</p></div></div></li></ol>

#### 二、实战项目

<p v-pre>我们以一个真实的业务分析看板为贯穿案例：</p>

<p v-pre><div><span class="visual-label">[E-commerce in 2026: From Platform to Profit | Devimus]</span></div></p>

<p v-pre><div><span class="visual-label">[Durchstarten mit Datenvisualisation in Apache Superset - DataIntelligence]</span></div></p>

<p v-pre><div><span class="visual-label">[Microsoft Dynamics 365 AI]</span></div></p>

<p v-pre><span><strong>项目：电商经营与售后数据分析系统</strong></span></p>

<p v-pre>最终实现：</p>

<ul v-pre><li><div><div><p>经营总览：销售额、订单量、利润等。</p></div></div></li><li><div><div><p>销售分析：商品、区域、时间趋势。</p></div></div></li><li><div><div><p>售后分析：售后率、问题类型、解决时长。</p></div></div></li><li><div><div><p>客服分析：客服绩效、响应时间、解决率。</p></div></div></li><li><div><div><p>异常分析：识别异常指标并定位原因。</p></div></div></li></ul>

<p v-pre>技术栈暂定：</p>

<table v-pre><tbody><tr><th><p>层次</p></th><th><p>技术</p></th></tr><tr><td><p>前端</p></td><td><p>React + TypeScript</p></td></tr><tr><td><p>可视化</p></td><td><p>ECharts</p></td></tr><tr><td><p>后端</p></td><td><p>Python + FastAPI</p></td></tr><tr><td><p>数据库</p></td><td><p>MySQL</p></td></tr><tr><td><p>数据处理</p></td><td><p>Python + SQL</p></td></tr><tr><td><p>定时任务</p></td><td><p>Celery + Redis</p></td></tr></tbody></table>

#### 三、先确定学习目标

<p v-pre>我想先确认一个问题，避免课程难度和方向不匹配。</p>

<p v-pre><span><strong>你学习开发数据分析系统，最主要的目标是什么？</strong></span></p>

<p v-pre><span><strong>1. 你的学习目标</strong></span></p>

<p v-pre><div><label>A. 独立从零开发一套完整的数据分析系统</label></div><div><label>B. 掌握数据分析看板的产品设计与业务分析</label></div><div><label>C. 掌握数据分析系统的整体架构设计</label></div><div><label>D. 掌握数据仓库、数据建模与指标体系</label></div><div><label>E. 全面掌握，从业务到技术上线</label></div></p>

<p v-pre><span><strong>2. 你目前的系统开发水平</strong></span></p>

<p v-pre><div><label>A. 了解 SQL 和数据处理，缺乏系统开发经验</label></div><div><label>B. 能开发后端和数据处理任务，但缺乏完整系统经验</label></div><div><label>C. 能独立开发系统，希望提升架构与业务设计能力</label></div></p>

<p v-pre><span class="interaction"><span>确定，开始第一课</span></span></p>

<p v-pre>学习方式：每一课采用 <span><strong>知识讲解 → 案例分析 → 实战练习 → 答案评价 → 下一课</strong></span>，由你一步步完成设计，我负责引导和纠正。</p>

## 第 2 轮　系统组成、核心能力与案例范围 {#turn-2}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>我的数据分析系统学习目标是：A；当前水平是：B。请开始第一课。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第一课：认识数据分析系统

<p v-pre></p>

<p v-pre><div>正式开始</div> <div>第一阶段：系统认知</div></p>

<p v-pre>你的目标是独立从零开发一套完整的数据分析系统，目前能够开发后端和数据处理任务，但缺少完整系统开发经验。</p>

<p v-pre>所以，这门课我们不从 SQL 或 ECharts 开始，而是先建立一个重要认知：</p>

<p v-pre><span><strong>数据分析系统不是一个展示图表的网页，而是一套将业务数据转化为业务决策的完整软件系统。</strong></span></p>

<p v-pre>今天的目标是：理解数据分析系统的组成、工作流程、核心模块，以及如何从业务视角理解整个系统。</p>

#### 一、什么是数据分析系统？

<p v-pre>假设你负责一家生鲜电商平台的数据分析系统。</p>

<p v-pre>老板每天想知道：</p>

<ol v-pre><li><div><div><p>今天销售额是多少？</p></div></div></li><li><div><div><p>哪些商品卖得最好？</p></div></div></li><li><div><div><p>哪些区域的销售额下降了？</p></div></div></li><li><div><div><p>售后问题主要集中在哪里？</p></div></div></li><li><div><div><p>哪些客服处理效率比较低？</p></div></div></li><li><div><div><p>销售额为什么下降？</p></div></div></li></ol>

<p v-pre>这些问题背后需要数据分析系统提供支持。</p>

<p v-pre>例如：</p>

<p v-pre><span><strong>经营分析看板示例</strong></span></p>

<p v-pre>模拟数据 · 今日经营情况</p>

<p v-pre>销售额</p>

### ¥128,600

<p v-pre>↑ 12.5%</p>

<p v-pre>订单量</p>

### 3,280

<p v-pre>↑ 8.2%</p>

<p v-pre>售后率</p>

### 4.8%

<p v-pre>↑ 1.2%</p>

<p v-pre>平均解决时长</p>

### 36分钟

<p v-pre>↑ 15分钟</p>

<p v-pre><span><strong>销售额趋势</strong></span></p>

<p v-pre>模拟最近7天销售额，单位：元。</p>

<ul v-pre><li>周一: 销售额 ¥8.5万</li><li>周二: 销售额 ¥9.2万</li><li>周三: 销售额 ¥8.9万</li><li>周四: 销售额 ¥10.5万</li><li>周五: 销售额 ¥11万</li><li>周六: 销售额 ¥11.9万</li><li>周日: 销售额 ¥12.9万</li></ul>

<p v-pre>以上为教学模拟数据，不代表真实经营情况。</p>

<p v-pre>注意：图表只是最终展示结果。</p>

<p v-pre>系统真正的价值在于能够回答：</p>

<ul v-pre><li><div><div><p>数据从哪里来？</p></div></div></li><li><div><div><p>销售额怎么算？</p></div></div></li><li><div><div><p>为什么售后率上升？</p></div></div></li><li><div><div><p>哪些商品导致售后增加？</p></div></div></li><li><div><div><p>业务人员应该采取什么行动？</p></div></div></li></ul>

<p v-pre>这才是完整的数据分析系统需要解决的问题。</p>

#### 二、数据分析系统的六大组成部分

<p v-pre>一个完整的数据分析系统可以拆分为六个核心层次。</p>

#### ① 数据来源层

<p v-pre>订单、商品、用户、售后、客服、物流</p>

#### ② 数据采集与处理层

<p v-pre>SQL、Python、ETL、数据清洗、定时任务</p>

#### ③ 数据存储与建模层

<p v-pre>MySQL、事实表、维度表、汇总表</p>

#### ④ 数据分析服务层

<p v-pre>指标计算、统计分析、查询 API、权限控制</p>

#### ⑤ 数据展示层

<p v-pre>React、ECharts、筛选器、表格、图表</p>

#### ⑥ 业务决策层

<p v-pre>发现问题、分析原因、提出行动、验证效果</p>

##### 每一层具体做什么？

<table v-pre><tbody><tr><th><p>层次</p></th><th><p>核心职责</p></th><th><p>举例</p></th></tr><tr><td><p>数据来源</p></td><td><p>获取业务数据</p></td><td><p>订单表</p></td></tr><tr><td><p>数据处理</p></td><td><p>清洗、转换数据</p></td><td><p>计算每日销售额</p></td></tr><tr><td><p>数据存储</p></td><td><p>组织分析数据</p></td><td><p>日销售汇总表</p></td></tr><tr><td><p>分析服务</p></td><td><p>提供统计和查询</p></td><td><p>销售额 API</p></td></tr><tr><td><p>数据展示</p></td><td><p>展示分析结果</p></td><td><p>销售趋势图</p></td></tr><tr><td><p>业务决策</p></td><td><p>辅助业务行动</p></td><td><p>分析销售下降原因</p></td></tr></tbody></table>

<p v-pre>这里有一个重要区别：</p>

<p v-pre><span><strong>数据开发主要关注数据如何产生和处理；数据分析系统开发还需要关注数据如何被使用，以及如何帮助业务决策。</strong></span></p>

#### 三、一个数据分析系统是如何工作的？

<p v-pre>我们用一个具体需求来理解。</p>

<p v-pre><span><strong>业务需求：老板希望每天早上 9 点看到昨天的销售额。</strong></span></p>

<p v-pre>整个过程如下：</p>

#### 销售额分析完整流程

<ol v-pre><li><div><div><p><span><strong>业务系统产生数据</strong></span></p><p>订单系统记录订单、订单明细、支付金额。</p></div></div></li><li><div><div><p><span><strong>数据采集</strong></span></p><p>定时任务读取昨天的订单数据。</p></div></div></li><li><div><div><p><span><strong>数据处理</strong></span></p><p>清洗无效订单，按照业务口径计算销售额。</p></div></div></li><li><div><div><p><span><strong>数据存储</strong></span></p><p>将结果保存到每日销售汇总表。</p></div></div></li><li><div><div><p><span><strong>后端提供接口</strong></span></p><p>FastAPI 提供 <code>/api/analytics/sales</code> 接口。</p></div></div></li><li><div><div><p><span><strong>前端请求数据</strong></span></p><p>React 页面调用 API，获取销售额。</p></div></div></li><li><div><div><p><span><strong>可视化展示</strong></span></p><p>ECharts 展示销售额、同比、环比和趋势。</p></div></div></li><li><div><div><p><span><strong>业务人员使用</strong></span></p><p>老板发现销售额下降，进一步查看商品和区域分析。</p></div></div></li></ol>

<p v-pre>你会发现，这里面其实有两条相互配合的流程：</p>

<p v-pre><span><strong>第一条：数据生产流程</strong></span></p>

<p v-pre>业务数据 → 数据采集 → 数据处理 → 数据存储。</p>

<p v-pre><span><strong>第二条：数据消费流程</strong></span></p>

<p v-pre>用户需求 → 数据查询 → 指标计算 → 图表展示 → 业务决策。</p>

<p v-pre>这两条流程共同构成数据分析系统。</p>

#### 四、系统应该如何划分模块？

<p v-pre>开发完整系统时，不建议把所有代码都写在一个模块里。</p>

<p v-pre>我们可以先从业务功能划分模块。</p>

<p v-pre><span class="visual-label">[AI Data Intelligence Command Center SKILL.md | Agensi]</span><div><a href="https://www.agensi.io/skills/ai-data-intelligence-command-center?utm_source=chatgpt.com"><span>agensi.io</span></a></div></p>

<table v-pre><tbody><tr><th><p>模块</p></th><th><p>主要功能</p></th></tr><tr><td><p>数据管理</p></td><td><p>数据源、数据导入、数据同步</p></td></tr><tr><td><p>指标管理</p></td><td><p>指标定义、指标口径、指标分类</p></td></tr><tr><td><p>数据分析</p></td><td><p>销售、订单、商品、售后分析</p></td></tr><tr><td><p>可视化管理</p></td><td><p>图表、看板、筛选器</p></td></tr><tr><td><p>用户管理</p></td><td><p>用户、角色、数据权限</p></td></tr><tr><td><p>系统管理</p></td><td><p>任务调度、日志、异常告警</p></td></tr></tbody></table>

<p v-pre>这里要区分两个概念：</p>

<ul v-pre><li><div><div><p><span><strong>技术分层</strong></span>：数据处理层、存储层、服务层、展示层。</p></div></div></li><li><div><div><p><span><strong>业务模块</strong></span>：销售分析、售后分析、商品分析、用户管理。</p></div></div></li></ul>

<p v-pre>技术分层解决代码和系统如何组织的问题；业务模块解决系统提供哪些功能的问题。</p>

<p v-pre>这是后续系统设计中非常重要的知识。</p>

#### 五、从零开发应该遵循什么顺序？

<p v-pre>假设现在要正式启动一个数据分析系统，我建议遵循以下开发顺序：</p>

#### 数据分析系统开发路线

<p v-pre>从业务问题到最终上线</p>

<ol v-pre><li><div><div><p><span><strong>需求分析</strong></span></p><p>明确用户是谁、要解决什么问题、需要哪些分析。</p></div></div></li><li><div><div><p><span><strong>指标设计</strong></span></p><p>定义销售额、订单量、售后率等指标及其计算口径。</p></div></div></li><li><div><div><p><span><strong>数据源分析</strong></span></p><p>确认数据来自哪些业务表、接口或文件。</p></div></div></li><li><div><div><p><span><strong>数据建模</strong></span></p><p>设计事实表、维度表、汇总表。</p></div></div></li><li><div><div><p><span><strong>系统架构设计</strong></span></p><p>设计前端、后端、数据库、数据处理任务之间的关系。</p></div></div></li><li><div><div><p><span><strong>功能开发</strong></span></p><p>开发数据处理任务、查询 API 和可视化页面。</p></div></div></li><li><div><div><p><span><strong>测试验收</strong></span></p><p>验证指标准确性、查询性能和业务结果。</p></div></div></li><li><div><div><p><span><strong>部署上线</strong></span></p><p>部署服务，监控运行情况，收集用户反馈。</p></div></div></li></ol>

<p v-pre><span><strong>一个容易犯的错误：</strong></span> 看到数据分析系统就马上开始设计数据库、写 SQL、画 ECharts 图表。</p>

<p v-pre>实际上，应该先确认业务要解决什么问题，再确定需要什么指标、数据和功能。</p>

<p v-pre>否则很容易出现：图表做了很多，但业务人员不知道如何使用。</p>

#### 六、第一课实战练习

<p v-pre>现在进入实战。</p>

<p v-pre>假设你是一名数据分析系统的产品负责人，老板提出了以下需求：</p>

<blockquote v-pre><p>我想开发一个电商经营分析系统，每天能够看到公司的销售情况、商品销售情况、售后情况。如果发现销售额下降，希望能够知道是什么原因造成的。</p></blockquote>

<p v-pre>请你思考以下问题。</p>

<p v-pre><span><strong>第一课知识测验</strong></span></p>

<p v-pre><div>3/3 已作答</div></p>

<p v-pre><span><strong>问题 1：这个系统最核心的目标是什么？</strong></span></p>

<p v-pre><div><label>A. 展示各种数据图表，让老板能够看到数据</label></div><div><label>B. 帮助老板发现经营问题、分析原因并辅助决策</label></div><div><label>C. 将所有业务数据库中的数据汇总到一个页面</label></div><div><label>D. 减少人工编写 SQL 和 Excel 报表的工作</label></div></p>

<p v-pre><strong>回答正确</strong></p>

<p v-pre>核心目标是辅助业务决策。图表、数据汇总和自动化只是实现手段。</p>

<p v-pre><span><strong>问题 2：在正式开发之前，最应该先做什么？</strong></span></p>

<p v-pre><div><label>A. 设计 MySQL 数据库表</label></div><div><label>B. 选择 React 和 ECharts 版本</label></div><div><label>C. 分析业务需求，明确用户、问题和分析目标</label></div><div><label>D. 开发销售额统计 SQL</label></div></p>

<p v-pre><strong>回答正确</strong></p>

<p v-pre>先理解业务问题，再确定指标、数据模型和技术实现。</p>

<p v-pre><span><strong>问题 3：销售额下降后，系统最应该提供什么能力？</strong></span></p>

<p v-pre><div><label>A. 只展示销售额下降了多少</label></div><div><label>B. 自动把所有订单数据导出 Excel</label></div><div><label>C. 支持按商品、区域、时间等维度下钻分析，定位下降原因</label></div><div><label>D. 增加更多颜色和图表</label></div></p>

<p v-pre><strong>回答正确</strong></p>

<p v-pre>分析系统不能只告诉用户发生了什么，还要帮助用户寻找原因。</p>

<p v-pre><span class="interaction"><span>提交并批改</span></span></p>

#### 答对 3/3 题

#### 七、本课需要掌握的知识

<p v-pre>完成本课后，你应该能够解释：</p>

<ol v-pre><li><div><div><p>数据分析系统和普通数据展示页面有什么区别？</p></div></div></li><li><div><div><p>数据分析系统由哪六个层次组成？</p></div></div></li><li><div><div><p>数据生产流程和数据消费流程有什么区别？</p></div></div></li><li><div><div><p>技术分层和业务模块有什么区别？</p></div></div></li><li><div><div><p>为什么应该先分析业务需求，再开始编码？</p></div></div></li></ol>

<p v-pre><span><strong>下一课：第二课——数据分析系统业务需求分析。</strong></span></p>

<p v-pre>我们将学习如何把老板的一句模糊需求，拆解成明确的用户角色、业务问题、分析目标和系统功能，并最终形成一份可以交给 AI 编程工具执行的需求说明书。</p>

<p v-pre>先完成上面的三道选择题，我会根据你的答案批改，再进入下一课。</p>
