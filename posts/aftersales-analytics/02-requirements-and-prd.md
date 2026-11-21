---
title: "第二章　业务需求、指标与 PRD"
description: "从业务问题、用户角色和流程下钻，到指标定义、SLA 和 PRD V1.0。"
outline: [2, 2]
prev:
  text: "第一章　认识数据分析系统"
  link: "/posts/aftersales-analytics/01-overview"
next:
  text: "第三章　数据架构与 MySQL 建模"
  link: "/posts/aftersales-analytics/03-data-modeling"
---

# 第二章　业务需求、指标与 PRD

从业务问题、用户角色和流程下钻，到指标定义、SLA 和 PRD V1.0。

[返回完整目录](/posts/aftersales-analytics-from-scratch#完整目录)

## 第 3 轮　从售后业务场景启动需求分析 {#turn-3}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>进入下一课</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第二课：数据分析系统业务需求分析

<p v-pre></p>

<p v-pre><div>第二课开始</div> <div>需求分析阶段</div></p>

<p v-pre>上一课我们学习了数据分析系统的六大组成部分，以及从业务问题到系统上线的整体流程。</p>

<p v-pre>今天开始学习真正的软件工程工作：<span><strong>如何把业务人员提出的模糊需求，转化为明确、可开发、可验收的系统功能。</strong></span></p>

<p v-pre>这也是开发数据分析系统最容易出问题的地方。</p>

<p v-pre>例如，老板说：</p>

<blockquote v-pre><p>我想做一个销售分析看板，能够看到销售情况，发现销售下降时知道是什么原因。</p></blockquote>

<p v-pre>这句话看似简单，但开发人员还不知道：</p>

<ul v-pre><li><div><div><p>销售情况具体包含哪些指标？</p></div></div></li><li><div><div><p>谁使用这个看板？</p></div></div></li><li><div><div><p>按天、周还是月分析？</p></div></div></li><li><div><div><p>销售额下降多少才算异常？</p></div></div></li><li><div><div><p>需要从哪些维度分析原因？</p></div></div></li><li><div><div><p>最终需要哪些页面和功能？</p></div></div></li></ul>

<p v-pre>这些都需要通过需求分析逐步明确。</p>

#### 一、需求分析的完整流程

<p v-pre>我们把需求分析拆成五个步骤。</p>

<ol v-pre><li><div><div><p><span><strong>明确业务背景</strong></span></p><p>为什么需要开发这个系统？当前有什么问题？</p></div></div></li><li><div><div><p><span><strong>识别用户角色</strong></span></p><p>谁使用系统？不同用户分别需要什么？</p></div></div></li><li><div><div><p><span><strong>提炼业务问题</strong></span></p><p>用户希望通过数据解决什么问题？</p></div></div></li><li><div><div><p><span><strong>确定分析目标</strong></span></p><p>需要哪些指标、分析维度和分析方法？</p></div></div></li><li><div><div><p><span><strong>转化为功能需求</strong></span></p><p>最终系统需要开发哪些页面、功能和交互？</p></div></div></li></ol>

<p v-pre>记住一个核心逻辑：</p>

<p v-pre><span><strong>业务背景 → 用户 → 业务问题 → 分析目标 → 功能需求。</strong></span></p>

<p v-pre>下面我们逐步学习。</p>

#### 二、第一步：明确业务背景

<p v-pre>假设一家生鲜电商企业，目前有以下情况：</p>

<p v-pre><span><strong>企业现状</strong></span></p>

<ul v-pre><li><div><div><p>每天产生大量订单。</p></div></div></li><li><div><div><p>商品种类超过 500 种。</p></div></div></li><li><div><div><p>有多个销售区域。</p></div></div></li><li><div><div><p>售后客服每天处理大量售后问题。</p></div></div></li><li><div><div><p>目前主要依靠 Excel 和人工 SQL 查询数据。</p></div></div></li></ul>

<p v-pre><span><strong>目前遇到的问题</strong></span></p>

<ol v-pre><li><div><div><p>老板无法快速了解每日经营情况。</p></div></div></li><li><div><div><p>销售额下降时，很难快速定位原因。</p></div></div></li><li><div><div><p>不知道哪些商品的售后问题比较严重。</p></div></div></li><li><div><div><p>不同部门统计出来的数据口径不一致。</p></div></div></li></ol>

<p v-pre>我们可以把这些问题整理成业务背景：</p>

<blockquote v-pre><p>企业目前缺乏统一的经营数据分析平台，经营数据分散在多个业务系统中，主要依靠人工 SQL 和 Excel 进行统计，导致经营数据获取效率低、分析口径不统一、问题定位困难。因此，需要建设统一的电商经营分析系统，帮助管理人员及时掌握经营情况并发现业务问题。</p></blockquote>

<p v-pre>注意：</p>

<p v-pre>业务背景不是罗列系统功能，而是解释为什么需要这个系统。</p>

#### 三、第二步：识别用户角色

<p v-pre>同一个系统，不同用户关注的内容是不一样的。</p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>用户角色</p></th><th><p>关注内容</p></th><th><p>核心需求</p></th></tr><tr><td><p>企业老板</p></td><td><p>整体经营</p></td><td><p>销售额、利润、经营趋势</p></td></tr><tr><td><p>销售经理</p></td><td><p>销售表现</p></td><td><p>区域、商品、业务员销售情况</p></td></tr><tr><td><p>售后主管</p></td><td><p>售后质量</p></td><td><p>售后率、问题类型、解决时长</p></td></tr><tr><td><p>数据分析师</p></td><td><p>数据分析</p></td><td><p>指标查询、维度筛选、数据下钻</p></td></tr></tbody></table>

<p v-pre>为什么要识别用户角色？</p>

<p v-pre>因为它决定了：</p>

<ul v-pre><li><div><div><p>系统应该有哪些页面。</p></div></div></li><li><div><div><p>不同页面应该展示什么指标。</p></div></div></li><li><div><div><p>用户能够查看哪些数据。</p></div></div></li><li><div><div><p>系统应该具备什么交互功能。</p></div></div></li></ul>

<p v-pre>例如，老板需要经营总览，售后主管需要售后分析，数据分析师需要明细查询。</p>

<p v-pre>如果不区分用户，很容易把所有指标堆在一个页面上。</p>

#### 四、第三步：从业务需求提炼业务问题

<p v-pre>这是需求分析最重要的一步。</p>

<p v-pre>我们先看老板提出的原始需求：</p>

<blockquote v-pre><p>我想知道销售额为什么下降。</p></blockquote>

<p v-pre>这句话不是一个具体功能，而是一个需要解决的业务问题。</p>

<p v-pre>我们要进一步拆解。</p>

<p v-pre><span><strong>原始业务问题</strong></span></p>

<p v-pre>销售额为什么下降？</p>

<p v-pre><span><strong>拆解一：时间维度</strong></span></p>

<ul v-pre><li><div><div><p>哪一天开始下降？</p></div></div></li><li><div><div><p>相比昨天下降多少？</p></div></div></li><li><div><div><p>相比上周同期下降多少？</p></div></div></li></ul>

<p v-pre><span><strong>拆解二：商品维度</strong></span></p>

<ul v-pre><li><div><div><p>哪些商品销售额下降？</p></div></div></li><li><div><div><p>哪些商品销量下降？</p></div></div></li><li><div><div><p>是否存在商品缺货？</p></div></div></li></ul>

<p v-pre><span><strong>拆解三：区域维度</strong></span></p>

<ul v-pre><li><div><div><p>哪些区域销售额下降？</p></div></div></li><li><div><div><p>是否集中在某些区域？</p></div></div></li></ul>

<p v-pre><span><strong>拆解四：订单维度</strong></span></p>

<ul v-pre><li><div><div><p>订单数量是否减少？</p></div></div></li><li><div><div><p>客单价是否下降？</p></div></div></li><li><div><div><p>支付转化是否下降？</p></div></div></li></ul>

<p v-pre>这样，我们就将一个模糊问题转化成了可以分析的具体问题。</p>

<p v-pre>这里还需要注意一个业务分析知识：</p>

<p v-pre>销售额可以拆解为：</p>

<p v-pre><div><span><span><span>销售额=订单量×平均订单金额销售额 = 订单量 \times 平均订单金额</span></span></span></div></p>

<p v-pre>因此，销售额下降可能来自两个方面：</p>

<ol v-pre><li><div><div><p>订单量减少。</p></div></div></li><li><div><div><p>平均订单金额下降。</p></div></div></li></ol>

<p v-pre>继续往下分析订单量，还可以研究流量、转化率等因素。</p>

<p v-pre>这就是从业务问题逐层拆解原因的过程。</p>

#### 五、第四步：确定分析目标

<p v-pre>业务问题明确之后，需要确定系统应该提供哪些分析能力。</p>

<p v-pre>我们以销售额下降为例：</p>

<table v-pre><tbody><tr><th><p>分析目标</p></th><th><p>指标</p></th><th><p>分析维度</p></th></tr><tr><td><p>判断销售变化</p></td><td><p>销售额、增长率</p></td><td><p>时间</p></td></tr><tr><td><p>判断订单变化</p></td><td><p>订单量、订单数变化率</p></td><td><p>时间、区域</p></td></tr><tr><td><p>判断商品影响</p></td><td><p>商品销售额、销量</p></td><td><p>商品、品类</p></td></tr><tr><td><p>判断区域影响</p></td><td><p>区域销售额</p></td><td><p>区域</p></td></tr><tr><td><p>判断客单价变化</p></td><td><p>客单价</p></td><td><p>时间、区域</p></td></tr></tbody></table>

<p v-pre>这里有三个重要概念：</p>

<ul v-pre><li><div><div><p><span><strong>指标（Metric）</strong></span>：分析什么，例如销售额。</p></div></div></li><li><div><div><p><span><strong>维度（Dimension）</strong></span>：从什么角度分析，例如商品、区域、时间。</p></div></div></li><li><div><div><p><span><strong>分析方法（Analysis Method）</strong></span>：如何分析，例如趋势分析、同比分析、排名分析。</p></div></div></li></ul>

<p v-pre><span class="visual-label">[Sales Dashboard]</span><div><a href="https://www.solverglobal.com/blog/glossary/sales-dashboard?hs_amp=true&amp;utm_source=chatgpt.com"><span>solverglobal.com</span></a></div></p>

<p v-pre>一个好的数据分析系统，不只是展示指标，还要支持用户从不同维度观察指标。</p>

#### 六、第五步：转化为功能需求

<p v-pre>前面四步解决的是业务问题，现在要把它们转化成开发人员可以实现的功能。</p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>功能模块</p></th><th><p>具体功能</p></th></tr><tr><td><p>经营总览</p></td><td><p>展示销售额、订单量、客单价</p></td></tr><tr><td><p>销售趋势</p></td><td><p>按日、周、月展示销售趋势</p></td></tr><tr><td><p>商品分析</p></td><td><p>商品销售额排名、销量排名</p></td></tr><tr><td><p>区域分析</p></td><td><p>区域销售额对比</p></td></tr><tr><td><p>异常分析</p></td><td><p>识别销售额异常下降</p></td></tr><tr><td><p>数据下钻</p></td><td><p>点击指标查看对应商品、区域或订单明细</p></td></tr><tr><td><p>数据筛选</p></td><td><p>支持时间、区域、商品筛选</p></td></tr></tbody></table>

<p v-pre>注意区分：</p>

<ul v-pre><li><div><div><p>业务问题：为什么销售额下降？</p></div></div></li><li><div><div><p>分析目标：找出销售额下降的主要商品和区域。</p></div></div></li><li><div><div><p>功能需求：提供商品销售排名、区域对比和下钻查询。</p></div></div></li></ul>

<p v-pre>这三个层次不能混淆。</p>

#### 七、实战练习：你来完成需求分析

<p v-pre>现在轮到你了。</p>

<p v-pre>假设老板提出一个新的需求：</p>

<blockquote v-pre><p>最近公司售后问题越来越多，客户经常投诉售后处理速度慢。我希望开发一个售后数据分析系统，能够看到售后情况，帮助管理人员发现问题。</p></blockquote>

<p v-pre>你现在是这个系统的产品负责人。</p>

<p v-pre>请完成第一道实战题。</p>

<p v-pre><span><strong>问题 1：你认为这个系统最核心的业务目标是什么？</strong></span></p>

<p v-pre><div><label>A. 展示每天有多少售后订单，以及售后问题数量</label></div><div><label>B. 帮助管理人员发现售后问题、分析处理效率低的原因，并改善售后服务质量</label></div><div><label>C. 建立售后订单数据库，统一存储售后记录</label></div><div><label>D. 自动生成售后 Excel 报表，减少人工统计工作</label></div></p>

<p v-pre><span><strong>请说明你的判断理由（建议用自己的话回答）</strong></span></p>

```text
发现问题，定位原因，如何改善
```

<p v-pre><span class="interaction"><span>提交答案，继续实战</span></span></p>

##### 本课学习要求

<p v-pre>不要急着写 SQL，也不要急着设计数据库。</p>

<p v-pre>先练习站在业务负责人的角度思考：</p>

<p v-pre><span><strong>系统为什么要开发？用户真正想解决什么问题？</strong></span></p>

<p v-pre>我会根据你的回答评价业务思维，再带你完成用户角色识别、业务问题拆解、分析目标设计，最后编写一份完整的《售后数据分析系统需求说明书》。</p>

## 第 4 轮　确定业务目标与识别用户角色 {#turn-4}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第二课实战问题1，我选择：B。我的理由：发现问题，定位原因，如何改善。请评价我的答案，并继续引导我完成售后系统需求分析。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

<p v-pre></p>

<p v-pre><div>回答正确</div> <div>进入第二道实战题</div></p>

<p v-pre>你的选择是 <span><strong>B：帮助管理人员发现售后问题、分析处理效率低的原因，并改善售后服务质量。</strong></span></p>

<p v-pre>我的评价：这是一个正确的产品思维方向。</p>

#### 一、评价你的答案

<p v-pre>你给出的理由是：</p>

<blockquote v-pre><p>发现问题，定位原因，如何改善。</p></blockquote>

<p v-pre>这句话实际上包含了数据分析系统非常重要的三个阶段。</p>

<p v-pre><div>第一步</div></p>

<p v-pre><span><strong>发现问题</strong></span></p>

<p v-pre>例如：发现平均售后解决时长从 30 分钟上升到 60 分钟。</p>

<p v-pre><div>第二步</div></p>

<p v-pre><span><strong>定位原因</strong></span></p>

<p v-pre>例如：发现物流问题增加、某些客服处理效率下降、部分问题需要多次沟通。</p>

<p v-pre><div>第三步</div></p>

<p v-pre><span><strong>改善问题</strong></span></p>

<p v-pre>例如：优化物流异常处理流程、完善客服知识库、调整售后任务分配。</p>

<p v-pre>不过，我想帮你进一步提升一个思维能力：</p>

<p v-pre><span><strong>发现问题不等于定位原因，定位原因也不等于证明原因。</strong></span></p>

<p v-pre>例如，某客服的平均处理时长较长，不一定说明客服效率低，也可能是他处理的复杂售后问题更多。</p>

<p v-pre>因此，数据分析系统不仅需要展示数据，还需要提供足够的证据，帮助管理人员验证判断。</p>

<p v-pre>这也是我们后面要学习的分析方法。</p>

#### 二、继续实战：识别用户角色

<p v-pre>现在我们进入需求分析第二步。</p>

<p v-pre>假设公司决定开发售后数据分析系统，涉及以下人员：</p>

<table v-pre><tbody><tr><th><p>用户</p></th><th><p>工作职责</p></th></tr><tr><td><p>老板</p></td><td><p>关注公司整体售后服务质量</p></td></tr><tr><td><p>售后主管</p></td><td><p>管理售后团队，处理服务问题</p></td></tr><tr><td><p>售后客服</p></td><td><p>处理客户售后请求</p></td></tr><tr><td><p>数据分析师</p></td><td><p>统计数据、分析问题、提供报告</p></td></tr></tbody></table>

<p v-pre>请注意：不是所有用户都需要看到相同的数据。</p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>老板关注整体售后率、解决时长和客户满意度。</p></div></div></li><li><div><div><p>售后主管关注客服绩效、问题类型、未解决工单。</p></div></div></li><li><div><div><p>客服关注自己的待处理任务和处理效率。</p></div></div></li><li><div><div><p>数据分析师关注数据明细、指标口径和分析维度。</p></div></div></li></ul>

##### 实战问题 2

<p v-pre><span><strong>你认为这个售后数据分析系统，最主要的目标用户是谁？</strong></span></p>

<p v-pre><div><label>A. 老板：查看公司整体售后经营情况</label></div><div><label>B. 售后主管：发现售后问题、分析团队效率、改善服务质量</label></div><div><label>C. 售后客服：查看自己的工作任务和处理效率</label></div><div><label>D. 数据分析师：负责数据统计和分析</label></div><div><label>E. 所有人都是目标用户，但不同角色有不同需求</label></div></p>

<p v-pre><span><strong>请说明你的判断理由</strong></span></p>

```text
老板是目标用户 ，使用用户是售后主管 发现问题 定位原因和改善问题
```

<p v-pre><span class="interaction"><span>提交答案</span></span></p>

<p v-pre><span><strong>给你一个思考提示：</strong></span></p>

<p v-pre>区分两个概念：</p>

<ul v-pre><li><div><div><p>目标用户：系统主要为谁解决问题？</p></div></div></li><li><div><div><p>使用用户：哪些人会实际使用系统？</p></div></div></li></ul>

<p v-pre>这两个概念不一定相同。</p>

<p v-pre>我们暂时不急着设计页面和数据库。先把用户和业务问题分析清楚，再进入指标体系设计。</p>

## 第 5 轮　区分使用者与决策者，拆解问题 {#turn-5}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第二课实战问题2，我选择：B。我的理由：老板是目标用户 ，使用用户是售后主管 发现问题 定位原因和改善问题。请评价并继续引导我拆解售后业务问题。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

<p v-pre>你的回答方向是对的，而且你已经开始区分一个很重要的产品设计概念：<span><strong>谁提出需求、谁实际使用系统、谁从系统中获得价值。</strong></span></p>

<p v-pre>不过，你的答案中有一个小地方需要调整。</p>

#### 一、评价你的答案

<p v-pre>你的回答：</p>

<blockquote v-pre><p>老板是目标用户，使用用户是售后主管，发现问题、定位原因和改善问题。</p></blockquote>

<p v-pre><div>业务思维方向正确</div></p>

<p v-pre>我们拆开来看：</p>

<table v-pre><tbody><tr><th><p>角色</p></th><th><p>定位</p></th><th><p>主要职责</p></th></tr><tr><td><p>老板</p></td><td><p>业务决策者 / 需求提出者</p></td><td><p>关注整体售后质量和经营结果</p></td></tr><tr><td><p>售后主管</p></td><td><p>核心用户</p></td><td><p>发现问题、定位原因、改善团队管理</p></td></tr><tr><td><p>售后客服</p></td><td><p>业务执行者</p></td><td><p>处理客户售后问题</p></td></tr><tr><td><p>数据分析师</p></td><td><p>数据支持者</p></td><td><p>统计指标、分析问题、提供证据</p></td></tr></tbody></table>

<p v-pre>这里有一个概念需要纠正：</p>

<p v-pre>老板不一定是系统的主要使用者。</p>

<p v-pre>如果售后主管每天使用系统分析问题、管理团队，那么售后主管才是这个系统的核心用户。</p>

<p v-pre>老板则是重要的业务决策者和利益相关者。</p>

<p v-pre><span><strong>产品设计原则：不能只满足提出需求的人，还要满足真正使用系统的人。</strong></span></p>

#### 二、实战第三步：拆解售后业务问题

<p v-pre>现在进入今天最重要的内容。</p>

<p v-pre>我们已经知道：</p>

<ul v-pre><li><div><div><p>业务目标：改善售后服务质量。</p></div></div></li><li><div><div><p>核心用户：售后主管。</p></div></div></li><li><div><div><p>系统价值：发现问题、定位原因、改善问题。</p></div></div></li></ul>

<p v-pre>接下来需要回答：</p>

<p v-pre><span><strong>售后主管究竟需要发现哪些问题？</strong></span></p>

<p v-pre>假设公司最近出现了以下情况：</p>

<p v-pre><span><strong>某生鲜电商企业 · 售后经营现状</strong></span></p>

<p v-pre>每日售后订单</p>

### 850

<p v-pre>单</p>

<p v-pre>平均解决时长</p>

### 58分钟

<p v-pre>原来 32 分钟</p>

<p v-pre>未解决售后</p>

### 126

<p v-pre>单</p>

<p v-pre>客户投诉量</p>

### 95

<p v-pre>单 / 日</p>

<p v-pre>教学模拟数据，仅用于练习。</p>

<p v-pre>售后主管发现了三个现象：</p>

<ol v-pre><li><div><div><p>售后解决时间越来越长。</p></div></div></li><li><div><div><p>未解决售后订单越来越多。</p></div></div></li><li><div><div><p>客户投诉数量越来越多。</p></div></div></li></ol>

<p v-pre>但是，这些只是表面现象，还不是根本原因。</p>

##### 1. 建立业务问题树

<p v-pre>我们可以将售后问题拆成五个分析方向：</p>

<p v-pre><span><strong>核心问题：售后服务质量下降</strong></span></p>

<p v-pre><span><strong>① 处理效率</strong></span></p>

<p v-pre>首次响应时间、解决时长、处理次数</p>

<p v-pre><span><strong>② 问题类型</strong></span></p>

<p v-pre>商品质量、物流、缺货、退款</p>

<p v-pre><span><strong>③ 客服表现</strong></span></p>

<p v-pre>客服工作量、解决率、响应效率</p>

<p v-pre><span><strong>④ 业务流程</strong></span></p>

<p v-pre>转交次数、等待时间、处理环节</p>

<p v-pre><span><strong>⑤ 客户体验</strong></span></p>

<p v-pre>投诉量、重复反馈、负面情绪、问题是否真正解决</p>

##### 2. 学习：从表面现象找到分析方向

<p v-pre>例如：</p>

<p v-pre><span><strong>表面现象：售后解决时间从 32 分钟增加到 58 分钟。</strong></span></p>

<p v-pre>我们可以继续提出问题：</p>

<table v-pre><tbody><tr><th><p>分析方向</p></th><th><p>需要回答的问题</p></th></tr><tr><td><p>时间</p></td><td><p>哪些时段解决时间最长？</p></td></tr><tr><td><p>类型</p></td><td><p>哪种售后问题处理最慢？</p></td></tr><tr><td><p>客服</p></td><td><p>哪些客服处理时间明显偏长？</p></td></tr><tr><td><p>流程</p></td><td><p>是否存在多次转交和等待？</p></td></tr><tr><td><p>客户</p></td><td><p>是否存在客户反复反馈同一问题？</p></td></tr></tbody></table>

<p v-pre>注意，这些都是待验证的假设，不代表已经找到了根因。</p>

<p v-pre>例如，我们发现物流问题的平均解决时间是 90 分钟，但还需要进一步查看物流等待时间、客服实际处理时间，才能判断究竟是物流环节还是客服处理环节导致延迟。</p>

<p v-pre>这就是业务问题拆解的核心能力。</p>

#### 三、实战问题 3：你来拆解业务问题

<p v-pre>现在请你作为售后主管，选择你认为最应该优先分析的问题。</p>

<p v-pre><span><strong>假设当前最突出的问题是：售后解决时长明显增加。</strong></span></p>

<p v-pre>你认为应该优先从哪个方向入手？</p>

<p v-pre><div><label>A. 按售后问题类型分析，找出哪些类型的问题处理最慢。</label></div><div><label>B. 按客服人员分析，找出哪些客服处理效率最低。</label></div><div><label>C. 按业务流程分析，找出哪些环节耗时最长。</label></div><div><label>D. 按时间分析，找出哪些时段售后处理效率最低。</label></div><div><label>E. 综合分析以上四个方向，逐步定位原因。</label></div></p>

<p v-pre><span><strong>请说明你的判断理由</strong></span></p>

```text
维度 下单 缩小范围
```

<p v-pre><span class="interaction"><span>提交答案，继续学习</span></span></p>

<p v-pre><span><strong>给你一个提示：</strong></span></p>

<p v-pre>这道题没有绝对唯一的正确答案。</p>

<p v-pre>我更希望你思考的是：如果你是售后主管，你会如何利用数据逐步缩小问题范围，而不是凭经验直接认定某个客服或者某个业务环节有问题。</p>

#### 四、接下来要完成什么？

<p v-pre>我们的第二课还剩三个重要环节：</p>

<ol v-pre><li><div><div><p>完成业务问题拆解。</p></div></div></li><li><div><div><p>将业务问题转化为指标、维度和分析目标。</p></div></div></li><li><div><div><p>将分析目标转化为功能模块，最终形成《售后数据分析系统需求说明书》。</p></div></div></li></ol>

<p v-pre>最终我们要得到一条完整链路：</p>

<p v-pre><span><strong>业务问题</strong></span></p>

<p v-pre><span><strong>分析目标</strong></span></p>

<p v-pre><span><strong>指标与维度</strong></span></p>

<p v-pre><span><strong>系统功能</strong></span></p>

<p v-pre><span><strong>需求说明书</strong></span></p>

<p v-pre>我们一步一步完成，不急着写代码。</p>

## 第 6 轮　按售后类型和物流维度缩小范围 {#turn-6}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第二课实战问题3，我选择：A。理由：维度 下单 缩小范围。请评价并继续带我完成售后业务问题拆解。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第二课实战：售后业务问题拆解（继续）

<p v-pre><div>思路基本正确</div></p>

<p v-pre>你选择了 A：按售后问题类型分析，找出哪些类型的问题处理最慢。</p>

<p v-pre>你的理由是：</p>

<blockquote v-pre><p>通过维度，下钻缩小范围。</p></blockquote>

<p v-pre>这个思路是正确的，而且你已经开始理解数据分析中一个重要的方法：<span><strong>多维度分析与逐层下钻。</strong></span></p>

<p v-pre>不过，你的回答还可以再完善一点。</p>

#### 一、评价你的答案

##### 1. 你做对了什么？

<p v-pre>你没有直接判断是哪个客服效率低，而是先从售后问题类型入手。</p>

<p v-pre>例如：</p>

<p v-pre>假设我们有以下数据：</p>

<table v-pre><tbody><tr><th><p>售后问题类型</p></th><th><p>平均解决时长</p></th></tr><tr><td><p>商品质量</p></td><td><p>35 分钟</p></td></tr><tr><td><p>物流异常</p></td><td><p>90 分钟</p></td></tr><tr><td><p>商品缺货</p></td><td><p>45 分钟</p></td></tr><tr><td><p>退款问题</p></td><td><p>20 分钟</p></td></tr></tbody></table>

<p v-pre>模拟不同售后问题类型的平均解决时长。</p>

<ul v-pre><li>商品质量: 平均解决时长 35分钟</li><li>物流异常: 平均解决时长 90分钟</li><li>商品缺货: 平均解决时长 45分钟</li><li>退款问题: 平均解决时长 20分钟</li></ul>

<p v-pre>我们发现物流异常处理时间最长。</p>

<p v-pre>这时，分析范围就从：</p>

<p v-pre>所有售后问题 → 物流异常问题。</p>

<p v-pre>这就是你说的缩小范围。</p>

##### 2. 还需要补充什么？

<p v-pre>你说的「维度下单」，我理解你想表达的是通过维度下钻，但要区分两个概念：</p>

<ul v-pre><li><div><div><p>分析维度：按什么角度查看数据，例如售后类型、客服、区域、时间。</p></div></div></li><li><div><div><p>下钻：从整体逐层进入更细的数据，例如全部售后 → 物流异常 → 具体物流问题 → 售后订单。</p></div></div></li></ul>

<p v-pre>而且，平均解决时长最长，不一定代表它对整体效率影响最大。</p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>物流异常：100 单，平均 90 分钟。</p></div></div></li><li><div><div><p>商品质量：1,000 单，平均 40 分钟。</p></div></div></li></ul>

<p v-pre>商品质量问题可能对整体售后工作量的影响更大。</p>

<p v-pre>因此，我们需要同时关注：</p>

<ol v-pre><li><div><div><p>问题数量。</p></div></div></li><li><div><div><p>平均解决时长。</p></div></div></li><li><div><div><p>总耗时。</p></div></div></li><li><div><div><p>超时订单数量。</p></div></div></li></ol>

<p v-pre>这就是从单指标分析升级到多指标分析。</p>

#### 二、继续拆解：从问题类型定位到具体原因

<p v-pre>假设我们已经发现物流异常处理时间最长。</p>

<p v-pre>接下来，售后主管会问：</p>

<p v-pre><span><strong>为什么物流异常的售后处理时间这么长？</strong></span></p>

<p v-pre>我们继续拆解。</p>

<p v-pre><span><strong>物流异常售后处理时间过长</strong></span></p>

<p v-pre><span><strong>① 等待物流反馈</strong></span></p>

<p v-pre>物流公司响应慢、查询困难</p>

<p v-pre><span><strong>② 客服处理慢</strong></span></p>

<p v-pre>人工查询、沟通效率低</p>

<p v-pre><span><strong>③ 客户反馈慢</strong></span></p>

<p v-pre>需要客户补充信息或确认</p>

<p v-pre><span><strong>④ 流程转交多</strong></span></p>

<p v-pre>需要多个部门协同处理</p>

<p v-pre>这里我们又引入了一个新的分析方法：<span><strong>流程耗时分析。</strong></span></p>

<p v-pre>例如，一笔物流异常售后订单，从创建到解决用了 120 分钟：</p>

<table v-pre><tbody><tr><th><p>处理环节</p></th><th><p>耗时</p></th></tr><tr><td><p>客户提交问题</p></td><td><p>5 分钟</p></td></tr><tr><td><p>客服首次响应</p></td><td><p>10 分钟</p></td></tr><tr><td><p>等待物流反馈</p></td><td><p>70 分钟</p></td></tr><tr><td><p>客服后续处理</p></td><td><p>25 分钟</p></td></tr><tr><td><p>最终解决</p></td><td><p>10 分钟</p></td></tr><tr><td><p>合计</p></td><td><p>120 分钟</p></td></tr></tbody></table>

<p v-pre>我们发现等待物流反馈占用了 70 分钟。</p>

<p v-pre>这时才有比较明确的改善方向：优化物流协同机制，而不是简单要求客服提高工作效率。</p>

<p v-pre>注意：这些数字只是教学模拟数据，实际项目中还需要通过时间戳和业务事件记录验证。</p>

#### 三、第三层拆解：定位具体的业务原因

<p v-pre>现在我们已经发现：</p>

<ul v-pre><li><div><div><p>售后类型：物流异常。</p></div></div></li><li><div><div><p>主要耗时环节：等待物流反馈。</p></div></div></li><li><div><div><p>初步判断：物流协同效率可能存在问题。</p></div></div></li></ul>

<p v-pre>接下来不能直接下结论，还需要进一步验证。</p>

<p v-pre>售后主管可以继续从以下维度分析：</p>

<table v-pre><tbody><tr><th><p>分析维度</p></th><th><p>想回答的问题</p></th></tr><tr><td><p>物流公司</p></td><td><p>哪家物流公司的反馈最慢？</p></td></tr><tr><td><p>区域</p></td><td><p>哪些地区的物流异常最多？</p></td></tr><tr><td><p>时间</p></td><td><p>哪些时段物流反馈最慢？</p></td></tr><tr><td><p>商品</p></td><td><p>哪些商品容易发生物流异常？</p></td></tr><tr><td><p>客服</p></td><td><p>哪些客服处理物流异常的流程耗时较长？</p></td></tr></tbody></table>

<p v-pre>例如，进一步分析发现：</p>

<p v-pre><span><strong>物流公司反馈耗时分析</strong></span></p>

<p v-pre>教学模拟数据</p>

<p v-pre><span><strong>物流公司 A</strong></span></p>

<p v-pre><strong>25</strong><strong> 分钟</strong></p>

<p v-pre><span><strong>物流公司 B</strong></span></p>

<p v-pre><strong>85</strong><strong> 分钟</strong></p>

<p v-pre><span><strong>物流公司 C</strong></span></p>

<p v-pre><strong>40</strong><strong> 分钟</strong></p>

<p v-pre>我们发现物流公司 B 的平均反馈时间最长。</p>

<p v-pre>这样，分析范围又缩小了：</p>

<p v-pre>全部售后 → 物流异常 → 等待物流反馈 → 物流公司 B。</p>

<p v-pre>这就是逐层下钻定位问题。</p>

#### 四、建立完整的业务问题分析链路

<p v-pre>目前我们已经得到一条初步分析路径：</p>

<p v-pre><span><strong>业务问题：售后解决时长增加</strong></span></p>

<p v-pre><span><strong>第一层：按售后类型分析</strong></span></p>

<p v-pre>发现物流异常处理时间较长</p>

<p v-pre><span><strong>第二层：按处理环节分析</strong></span></p>

<p v-pre>发现等待物流反馈耗时较长</p>

<p v-pre><span><strong>第三层：按物流公司分析</strong></span></p>

<p v-pre>发现物流公司 B 反馈时间较长</p>

<p v-pre><strong>待验证的改善方向</strong></p>

<p v-pre><span><strong>优化物流公司 B 的异常反馈协同机制</strong></span></p>

<p v-pre>注意：最后一步仍然是待验证的业务假设，不能仅凭平均时长就认定物流公司 B 是根因。</p>

#### 五、实战问题 4：你来继续定位

<p v-pre>现在假设我们已经发现物流公司 B 的反馈时间最长。</p>

<p v-pre>你作为售后主管，下一步最应该怎么做？</p>

<p v-pre><div><label>A. 查看物流公司 B 的具体售后订单，分析不同订单的反馈时间和处理过程。</label></div><div><label>B. 直接要求物流公司 B 提高反馈速度。</label></div><div><label>C. 要求所有客服提高处理效率。</label></div><div><label>D. 只增加一个物流公司 B 的平均反馈时长图表。</label></div></p>

<p v-pre><span><strong>你的判断理由</strong></span></p>

```text
继续下钻，定位根因
```

<p v-pre><span class="interaction"><span>提交答案</span></span></p>

##### 本阶段你正在掌握的能力

<p v-pre>你已经接触了三个重要的数据分析方法：</p>

<ol v-pre><li><div><div><p><span><strong>维度分析</strong></span>：从不同角度发现问题。</p></div></div></li><li><div><div><p><span><strong>逐层下钻</strong></span>：不断缩小问题范围。</p></div></div></li><li><div><div><p><span><strong>流程耗时分析</strong></span>：找到业务流程中的时间瓶颈。</p></div></div></li></ol>

<p v-pre>接下来我们还要学习如何把这些业务问题转化为指标体系，最终落实到售后数据分析系统的功能设计中。</p>

<p v-pre>我的建议是：每次分析都遵循一个原则——先找证据，再下结论，最后提出改善方案。</p>

## 第 7 轮　回查订单明细并分析处理节点 {#turn-7}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第二课实战问题4，我选择：A。理由：继续下钻，定位根因。请评价，并继续带我完成售后业务问题拆解。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

<p v-pre></p>

<p v-pre><div>回答正确</div> <div>进入根因分析阶段</div></p>

<p v-pre>你的选择 A 是正确的。</p>

<p v-pre>你的理由：</p>

<blockquote v-pre><p>继续下钻，定位根因。</p></blockquote>

<p v-pre>这次你的思路已经比较清晰了。你知道不能看到物流公司 B 的平均反馈时间最长，就直接要求它整改，而是应该继续查看具体订单和处理过程。</p>

<p v-pre>这正是数据分析人员应该具备的思维方式。</p>

### 一、评价你的答案

<p v-pre>你已经掌握了一个重要的分析逻辑：</p>

<p v-pre><span><strong>发现异常 → 缩小范围 → 查看明细 → 定位原因。</strong></span></p>

<p v-pre>我们回顾一下刚才的分析过程：</p>

<table v-pre><tbody><tr><th><p>分析层次</p></th><th><p>分析结果</p></th></tr><tr><td><p>整体售后</p></td><td><p>平均解决时长增加</p></td></tr><tr><td><p>售后类型</p></td><td><p>物流异常处理较慢</p></td></tr><tr><td><p>处理环节</p></td><td><p>等待物流反馈耗时较长</p></td></tr><tr><td><p>物流公司</p></td><td><p>B 公司反馈时间最长</p></td></tr><tr><td><p>具体订单</p></td><td><p>查看订单处理过程，寻找异常原因</p></td></tr></tbody></table>

<p v-pre>你目前已经能够从宏观指标逐渐深入到业务明细。</p>

<p v-pre>不过，还需要增加一个能力：</p>

<p v-pre><span><strong>不仅要知道哪笔订单耗时长，还要知道时间究竟消耗在哪里。</strong></span></p>

### 二、继续实战：如何从订单明细定位根因？

<p v-pre>假设我们从物流公司 B 中抽取了三笔售后订单。</p>

<p v-pre><span><strong>物流公司 B · 售后订单样本</strong></span></p>

<p v-pre>教学模拟数据</p>

<table v-pre><tbody><tr><th><p>订单</p></th><th><p>等待物流反馈</p></th><th><p>客服处理</p></th><th><p>总耗时</p></th></tr><tr><td><p>A001</p></td><td><p>80 分钟</p></td><td><p>20 分钟</p></td><td><p>100 分钟</p></td></tr><tr><td><p>A002</p></td><td><p>15 分钟</p></td><td><p>75 分钟</p></td><td><p>90 分钟</p></td></tr><tr><td><p>A003</p></td><td><p>100 分钟</p></td><td><p>20 分钟</p></td><td><p>120 分钟</p></td></tr></tbody></table>

<p v-pre><span><strong>我们发现三个不同的情况：</strong></span></p>

<ul v-pre><li><div><div><p>A001：主要耗时在等待物流反馈。</p></div></div></li><li><div><div><p>A002：主要耗时在客服处理。</p></div></div></li><li><div><div><p>A003：主要耗时在等待物流反馈。</p></div></div></li></ul>

<p v-pre>这时候就会发现一个重要问题：</p>

<p v-pre>即使都是物流公司 B 的售后订单，导致处理时间长的原因也可能不同。</p>

<p v-pre>因此，不能简单认为所有问题都由物流公司造成。</p>

#### 三、学习一种重要方法：流程节点分析

<p v-pre>为了找到真正的原因，我们需要记录售后订单在每个业务环节发生的时间。</p>

<p v-pre>例如：</p>

<p v-pre><span><strong>售后订单处理时间线</strong></span></p>

<ol v-pre><li><div><div><p><span><strong>客户提交售后</strong></span></p><p>10:00 · 创建售后订单</p></div></div></li><li><div><div><p><span><strong>客服首次响应</strong></span></p><p>10:10 · 首次回复客户</p></div></div></li><li><div><div><p><span><strong>联系物流公司</strong></span></p><p>10:15 · 发起物流查询</p></div></div></li><li><div><div><p><span><strong>物流反馈</strong></span></p><p>11:15 · 收到物流反馈</p></div></div></li><li><div><div><p><span><strong>客服处理完成</strong></span></p><p>11:30 · 完成售后处理</p></div></div></li></ol>

<p v-pre><span><strong>时间分析</strong></span></p>

<table v-pre><tbody><tr><th><p>环节</p></th><th><p>耗时</p></th></tr><tr><td><p>首次响应等待</p></td><td><p>10 分钟</p></td></tr><tr><td><p>联系物流等待</p></td><td><p>5 分钟</p></td></tr><tr><td><p>等待物流反馈</p></td><td><p>60 分钟</p></td></tr><tr><td><p>后续客服处理</p></td><td><p>15 分钟</p></td></tr><tr><td><p>总耗时</p></td><td><p>90 分钟</p></td></tr></tbody></table>

<p v-pre>这笔订单最明显的时间瓶颈是等待物流反馈。</p>

<p v-pre>但我们还要验证：</p>

<ul v-pre><li><div><div><p>是否所有物流异常订单都有这个问题？</p></div></div></li><li><div><div><p>是否集中在某个物流公司或地区？</p></div></div></li><li><div><div><p>是否因为物流公司反馈机制不完善？</p></div></div></li><li><div><div><p>是否因为客服提交查询的信息不完整？</p></div></div></li></ul>

<p v-pre>这些才是进一步寻找根因的问题。</p>

<p v-pre><span><strong>这里引入一个新的知识：</strong></span></p>

<p v-pre>数据分析系统除了需要存储订单创建时间、解决时间，还可能需要存储各个业务节点的事件时间。</p>

<p v-pre>否则，我们只能知道一笔订单用了 90 分钟，却不知道这 90 分钟去了哪里。</p>

### 四、把分析能力转化为系统需求

<p v-pre>现在我们开始从业务分析过渡到系统设计。</p>

<p v-pre>假设售后主管希望通过系统完成刚才的分析过程。</p>

<p v-pre>我们可以设计以下功能：</p>

<table v-pre><tbody><tr><th><p>功能</p></th><th><p>作用</p></th></tr><tr><td><p>售后总览</p></td><td><p>查看整体售后情况</p></td></tr><tr><td><p>类型分析</p></td><td><p>按售后问题类型分析</p></td></tr><tr><td><p>物流分析</p></td><td><p>按物流公司、区域分析</p></td></tr><tr><td><p>耗时分析</p></td><td><p>分析不同处理环节的耗时</p></td></tr><tr><td><p>订单下钻</p></td><td><p>查看具体售后订单</p></td></tr><tr><td><p>处理时间线</p></td><td><p>查看订单每个处理节点</p></td></tr><tr><td><p>异常订单</p></td><td><p>筛选超时和未解决订单</p></td></tr></tbody></table>

<p v-pre>这样，我们就不再是单纯做一个图表页面，而是在设计一个真正帮助售后主管定位问题的分析工具。</p>

### 五、实战问题 5：进一步识别根因

<p v-pre>现在给你一个新的场景。</p>

<p v-pre>我们分析了物流公司 B 的 100 笔售后订单，发现：</p>

<table v-pre><tbody><tr><th><p>订单情况</p></th><th><p>数量</p></th></tr><tr><td><p>等待物流反馈超过 60 分钟</p></td><td><p>40 笔</p></td></tr><tr><td><p>客服处理超过 60 分钟</p></td><td><p>20 笔</p></td></tr><tr><td><p>客户等待回复超过 60 分钟</p></td><td><p>25 笔</p></td></tr><tr><td><p>其他情况</p></td><td><p>15 笔</p></td></tr></tbody></table>

<p v-pre>售后主管希望知道：为什么有 40 笔订单等待物流反馈超过 60 分钟？</p>

<p v-pre>你认为下一步应该做什么？</p>

<p v-pre><div><label>A. 继续查看这 40 笔订单，按地区、物流网点、时间段等维度分析，寻找共同特征。</label></div><div><label>B. 直接认定物流公司 B 服务质量差。</label></div><div><label>C. 要求所有客服加快处理速度。</label></div><div><label>D. 把这 40 笔订单导出 Excel，交给老板。</label></div></p>

<p v-pre><span><strong>请说明你的判断理由</strong></span></p>

```text
维度下钻，多维分析 原因
```

<p v-pre><span class="interaction"><span>提交答案</span></span></p>

### 六、第二课最终要完成的成果

<p v-pre>我们已经逐步建立了售后分析的思路。</p>

<p v-pre>接下来还需要完成：</p>

#### 《售后数据分析系统需求说明书》

<p v-pre>最终实战交付物</p>

<p v-pre>业务背景与目标</p>

<p v-pre><div>已完成初步分析</div></p>

<p v-pre>用户角色分析</p>

<p v-pre><div>已完成初步分析</div></p>

<p v-pre>业务问题拆解</p>

<p v-pre><div>正在进行</div></p>

<p v-pre>指标体系设计</p>

<p v-pre><div>待学习</div></p>

<p v-pre>功能模块设计</p>

<p v-pre><div>待学习</div></p>

<p v-pre>需求说明书</p>

<p v-pre><div>待交付</div></p>

<p v-pre><span><strong>给你一个学习建议：</strong></span> 你目前比较擅长从技术角度思考问题，这次我们刻意训练从业务现象出发、通过数据寻找证据的能力。</p>

<p v-pre>每完成一个问题，我都会帮你把思考结果沉淀成真正的系统需求，而不只是做选择题。</p>

## 第 8 轮　用多维分析和对照数据验证根因 {#turn-8}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第二课实战问题5，我选择：A。理由：维度下钻，多维分析 原因。请评价并继续引导我完成售后业务问题拆解。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

<p v-pre></p>

<p v-pre><div>回答正确</div> <div>业务问题拆解能力提升</div></p>

<p v-pre>这次你的回答非常好。</p>

<p v-pre>你的选择是 A：</p>

<blockquote v-pre><p>继续查看这 40 笔订单，按地区、物流网点、时间段等维度分析，寻找共同特征。</p></blockquote>

<p v-pre>你的理由：</p>

<blockquote v-pre><p>维度下钻，多维分析原因。</p></blockquote>

<p v-pre>这说明你已经掌握了一个重要的数据分析思路：<span><strong>不要只看异常结果，而要通过多维度分析寻找异常背后的共同特征。</strong></span></p>

<p v-pre>今天我们进一步提升，从「找到异常」走向「验证根因」。</p>

### 一、评价你的分析思路

<p v-pre>回顾你这几道题的思考过程：</p>

<table v-pre><tbody><tr><th><p>题目</p></th><th><p>你的思路</p></th><th><p>掌握的能力</p></th></tr><tr><td><p>问题3</p></td><td><p>按售后类型分析</p></td><td><p>维度分析</p></td></tr><tr><td><p>问题4</p></td><td><p>查看具体订单</p></td><td><p>数据下钻</p></td></tr><tr><td><p>问题5</p></td><td><p>按地区、网点、时间分析</p></td><td><p>多维分析</p></td></tr></tbody></table>

<p v-pre>你的分析路径已经逐渐形成：</p>

<p v-pre><span><strong>售后解决时长增加</strong></span></p>

<p v-pre><div>按售后类型分析</div><div>找到物流异常</div><div>找到物流公司 B</div><div>找到等待反馈超过 60 分钟的 40 笔订单</div></p>

<p v-pre><span><strong>按地区、网点、时间等维度寻找共同特征</strong></span></p>

<p v-pre>不过，我要提醒你一个容易忽略的问题：</p>

<p v-pre><span><strong>共同出现不代表存在因果关系。</strong></span></p>

<p v-pre>例如，40 笔超时订单集中在某个地区，并不能立即证明该地区物流网点有问题。</p>

<p v-pre>还需要比较：</p>

<ul v-pre><li><div><div><p>该地区总共有多少笔物流异常订单？</p></div></div></li><li><div><div><p>其他地区的超时比例是多少？</p></div></div></li><li><div><div><p>是否刚好集中在某个特殊时段？</p></div></div></li><li><div><div><p>是否存在某个物流网点的异常事件？</p></div></div></li></ul>

<p v-pre>这样才能避免错误归因。</p>

### 二、继续实战：从多维分析到根因验证

<p v-pre>假设我们继续分析这 40 笔订单，得到以下数据。</p>

<p v-pre><span><strong>物流公司 B · 超时订单地区分布</strong></span></p>

<p v-pre>教学模拟数据</p>

<table v-pre><tbody><tr><th><p>地区</p></th><th><p>超时订单</p></th><th><p>物流异常订单总数</p></th></tr><tr><td><p>杭州</p></td><td><p>25</p></td><td><p>50</p></td></tr><tr><td><p>宁波</p></td><td><p>8</p></td><td><p>40</p></td></tr><tr><td><p>绍兴</p></td><td><p>5</p></td><td><p>30</p></td></tr><tr><td><p>嘉兴</p></td><td><p>2</p></td><td><p>20</p></td></tr></tbody></table>

<p v-pre><span><strong>各地区超时率</strong></span></p>

<p v-pre>各地区超时订单占物流异常订单的比例。</p>

<ul v-pre><li>杭州: 超时率 50%</li><li>宁波: 超时率 20%</li><li>绍兴: 超时率 16.7%</li><li>嘉兴: 超时率 10%</li></ul>

<p v-pre>现在我们可以看到：</p>

<ul v-pre><li><div><div><p>杭州超时订单数量最多。</p></div></div></li><li><div><div><p>杭州超时率也最高。</p></div></div></li><li><div><div><p>杭州的超时率为 50%，明显高于其他地区。</p></div></div></li></ul>

<p v-pre>这时我们可以形成一个假设：</p>

<blockquote v-pre><p>物流公司 B 在杭州地区可能存在物流反馈效率问题。</p></blockquote>

<p v-pre>但还不能直接认定是物流网点问题。</p>

<p v-pre>接下来还需要进一步分析杭州地区的物流网点。</p>

#### 三、学习一个重要概念：异常定位与根因验证

<p v-pre>这两个阶段不同。</p>

<table v-pre><tbody><tr><th><p>阶段</p></th><th><p>目标</p></th><th><p>示例</p></th></tr><tr><td><p>异常定位</p></td><td><p>找到问题集中在哪里</p></td><td><p>杭州超时率最高</p></td></tr><tr><td><p>根因验证</p></td><td><p>证明为什么出现问题</p></td><td><p>某网点反馈流程存在延迟</p></td></tr></tbody></table>

<p v-pre>根因验证通常需要结合：</p>

<ol v-pre><li><div><div><p>数据对比：异常组与正常组有什么区别？</p></div></div></li><li><div><div><p>时间分析：异常从什么时候开始？</p></div></div></li><li><div><div><p>业务记录：是否存在流程延迟或异常事件？</p></div></div></li><li><div><div><p>业务访谈：实际处理过程中发生了什么？</p></div></div></li><li><div><div><p>改善验证：采取措施后指标是否改善？</p></div></div></li></ol>

<p v-pre>这意味着数据分析系统不仅需要图表，还需要能够查看明细证据。</p>

### 四、建立售后业务问题分析框架

<p v-pre>现在把我们学到的内容整理成一套可以复用的方法。</p>

#### 售后业务问题分析框架

<ol v-pre><li><div><div><p><span><strong>发现异常</strong></span></p><p>例如：平均售后解决时长增加。</p></div></div></li><li><div><div><p><span><strong>定位问题范围</strong></span></p><p>按售后类型、时间、客服等维度分析。</p></div></div></li><li><div><div><p><span><strong>深入分析明细</strong></span></p><p>查看具体售后订单、处理记录和时间节点。</p></div></div></li><li><div><div><p><span><strong>寻找共同特征</strong></span></p><p>按地区、物流公司、网点、时段交叉分析。</p></div></div></li><li><div><div><p><span><strong>验证根因</strong></span></p><p>结合业务记录和对照数据验证假设。</p></div></div></li><li><div><div><p><span><strong>制定改善措施</strong></span></p><p>找到责任环节，提出有针对性的改善措施。</p></div></div></li><li><div><div><p><span><strong>验证改善效果</strong></span></p><p>对比改善前后的解决时长、超时率和投诉率。</p></div></div></li></ol>

<p v-pre>这套方法将成为后续售后分析系统的核心业务逻辑。</p>

### 五、实战问题 6：你来判断如何验证根因

<p v-pre>现在我们进一步深入。</p>

<p v-pre>假设继续分析发现：</p>

<p v-pre>杭州地区物流公司 B 有一个网点，40 笔超时订单中有 20 笔来自这个网点。</p>

<p v-pre>售后主管怀疑：</p>

<blockquote v-pre><p>是不是这个物流网点的反馈效率有问题？</p></blockquote>

<p v-pre>你认为下一步最合理的做法是什么？</p>

<p v-pre><div><label>A. 对比该网点与其他网点的超时率、平均反馈时长，并查看具体业务记录。</label></div><div><label>B. 直接认定该网点存在问题，要求整改。</label></div><div><label>C. 只查看该网点的超时订单数量。</label></div><div><label>D. 增加一个该网点的销售额分析图表。</label></div></p>

<p v-pre><span><strong>为什么这样做？</strong></span></p>

```text
对比分析问题原因
```

<p v-pre><span class="interaction"><span>提交答案</span></span></p>

### 六、当前需求分析成果

<p v-pre>我们已经把售后系统的核心分析方向逐渐明确。</p>

<table v-pre><tbody><tr><th><p>分析模块</p></th><th><p>要解决的问题</p></th><th><p>当前进度</p></th></tr><tr><td><p>售后效率分析</p></td><td><p>为什么解决时长增加？</p></td><td><p>已拆解</p></td></tr><tr><td><p>售后类型分析</p></td><td><p>哪些问题处理最慢？</p></td><td><p>已拆解</p></td></tr><tr><td><p>物流异常分析</p></td><td><p>哪些物流公司、地区存在异常？</p></td><td><p>已拆解</p></td></tr><tr><td><p>流程耗时分析</p></td><td><p>哪个处理环节最耗时？</p></td><td><p>已拆解</p></td></tr><tr><td><p>根因验证</p></td><td><p>如何证明问题原因？</p></td><td><p>正在学习</p></td></tr><tr><td><p>改善效果分析</p></td><td><p>如何验证改善是否有效？</p></td><td><p>待完成</p></td></tr></tbody></table>

<p v-pre><span><strong>下一阶段的重要任务：</strong></span> 将这些业务问题转化为指标体系。</p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>平均售后解决时长</p></div></div></li><li><div><div><p>首次响应时长</p></div></div></li><li><div><div><p>物流反馈时长</p></div></div></li><li><div><div><p>超时订单率</p></div></div></li><li><div><div><p>售后一次解决率</p></div></div></li><li><div><div><p>重复反馈率</p></div></div></li></ul>

<p v-pre>然后我们就可以正式设计售后数据分析系统的指标管理、分析页面和功能模块。</p>

<p v-pre>你现在要做的不是记住所有指标，而是理解：<span><strong>每一个指标都应该服务于一个明确的业务问题。</strong></span></p>

## 第 9 轮　用公平对比制定改善动作 {#turn-9}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第二课实战问题6，我选择：A。理由：对比分析问题原因。请评价并继续带我完成售后业务问题拆解。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

<p v-pre></p>

<p v-pre><div>回答正确</div> <div>进入根因验证</div></p>

<p v-pre>这次你的选择 A 是正确的。</p>

<p v-pre>你的理由：</p>

<blockquote v-pre><p>对比分析问题原因。</p></blockquote>

<p v-pre>你已经掌握了数据分析中一个非常重要的方法：<span><strong>对比分析（Comparative Analysis）</strong></span>。</p>

<p v-pre>不过，我想帮你把这个思路提升一步：</p>

<p v-pre>不只是对比数据，而是通过对比建立证据，验证业务假设。</p>

### 一、评价你的答案

<p v-pre>目前我们已经有一个业务假设：</p>

<blockquote v-pre><p>杭州地区物流公司 B 的某个物流网点，可能存在反馈效率问题。</p></blockquote>

<p v-pre>为了验证这个假设，我们需要对比该网点与其他网点。</p>

<p v-pre>假设进一步采集到以下数据：</p>

<p v-pre><span><strong>物流网点反馈效率对比</strong></span></p>

<p v-pre>教学模拟数据 · 同一统计周期</p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>问题网点</p></th><th><p>其他网点</p></th></tr><tr><td><p>物流异常订单</p></td><td><p>40</p></td><td><p>160</p></td></tr><tr><td><p>超时订单</p></td><td><p>20</p></td><td><p>20</p></td></tr><tr><td><p>超时率</p></td><td><p>50%</p></td><td><p>12.5%</p></td></tr><tr><td><p>平均反馈时长</p></td><td><p>95 分钟</p></td><td><p>30 分钟</p></td></tr></tbody></table>

<p v-pre><span><strong>超时率对比</strong></span></p>

<p v-pre>问题网点与其他网点的超时率对比。</p>

<ul v-pre><li>问题网点: 超时率 50%</li><li>其他网点: 超时率 12.5%</li></ul>

<p v-pre><div>明显异常</div></p>

<p v-pre>问题网点的超时率是其他网点的 4 倍。</p>

<p v-pre>现在我们有了更强的证据：</p>

<ol v-pre><li><div><div><p>问题网点超时率明显更高。</p></div></div></li><li><div><div><p>平均反馈时长明显更长。</p></div></div></li><li><div><div><p>两组数据来自同一统计周期。</p></div></div></li></ol>

<p v-pre>因此，我们可以判断：</p>

<p v-pre><span><strong>该网点很可能是杭州地区物流反馈效率问题的重要影响因素。</strong></span></p>

<p v-pre>但还不能直接认定具体根因。</p>

<p v-pre>例如，可能是：</p>

<ul v-pre><li><div><div><p>网点人员不足。</p></div></div></li><li><div><div><p>物流信息更新不及时。</p></div></div></li><li><div><div><p>异常订单没有及时分配。</p></div></div></li><li><div><div><p>物流公司内部反馈流程复杂。</p></div></div></li></ul>

<p v-pre>这些仍然需要进一步调查。</p>

#### 二、你需要掌握的一个关键知识：对比必须公平

<p v-pre>例如：</p>

<p v-pre>问题网点处理的都是复杂物流异常，其他网点处理的都是简单物流异常。</p>

<p v-pre>即使问题网点平均反馈时间更长，也不能直接说明它的效率更低。</p>

<p v-pre>所以真正的分析还需要控制一些条件：</p>

<table v-pre><tbody><tr><th><p>对比条件</p></th><th><p>目的</p></th></tr><tr><td><p>相同统计周期</p></td><td><p>避免时间差异</p></td></tr><tr><td><p>相同售后问题类型</p></td><td><p>避免问题难度不同</p></td></tr><tr><td><p>相同订单口径</p></td><td><p>保证计算一致</p></td></tr><tr><td><p>相似业务量</p></td><td><p>避免规模差异</p></td></tr><tr><td><p>相同超时标准</p></td><td><p>保证评价公平</p></td></tr></tbody></table>

<p v-pre>这叫作控制分析条件。</p>

<p v-pre>对于数据分析人员来说，<span><strong>数据对比的公平性比图表是否漂亮更重要。</strong></span></p>

### 三、从根因分析到业务改善

<p v-pre>现在我们假设已经通过业务记录和物流网点访谈，确认：</p>

<p v-pre>问题网点存在以下情况：</p>

<ul v-pre><li><div><div><p>每天物流异常订单较多。</p></div></div></li><li><div><div><p>物流反馈由人工处理。</p></div></div></li><li><div><div><p>异常订单没有自动分配机制。</p></div></div></li><li><div><div><p>部分订单长时间无人跟进。</p></div></div></li></ul>

<p v-pre>那么售后主管可以提出改善方案：</p>

<table v-pre><tbody><tr><th><p>发现的问题</p></th><th><p>改善措施</p></th><th><p>验证指标</p></th></tr><tr><td><p>异常订单较多</p></td><td><p>优化物流异常处理流程</p></td><td><p>异常订单率</p></td></tr><tr><td><p>人工处理效率低</p></td><td><p>建立自动分配机制</p></td><td><p>平均反馈时长</p></td></tr><tr><td><p>无人跟进</p></td><td><p>增加超时提醒</p></td><td><p>超时订单率</p></td></tr><tr><td><p>处理过程不透明</p></td><td><p>建立处理时间线</p></td><td><p>平均解决时长</p></td></tr></tbody></table>

<p v-pre>这里出现了一个完整闭环：</p>

<p v-pre><span><strong>发现问题</strong></span></p>

<p v-pre>物流网点超时率达到 50%</p>

<p v-pre><span><strong>分析原因</strong></span></p>

<p v-pre>人工分配、无人跟进</p>

<p v-pre><span><strong>制定措施</strong></span></p>

<p v-pre>自动分配、超时提醒</p>

<p v-pre><span><strong>验证效果</strong></span></p>

<p v-pre>比较改善前后的超时率和反馈时长</p>

<p v-pre>这就是售后数据分析系统最终需要支持的业务闭环。</p>

### 四、现在正式整理售后业务问题树

<p v-pre>经过前面六道实战题，我们已经初步完成了售后系统的核心业务问题拆解。</p>

#### 售后数据分析系统 · 业务问题树

<p v-pre><span><strong>核心业务目标：提升售后服务质量</strong></span></p>

<p v-pre><span><strong>处理效率</strong></span></p>

<p v-pre>响应慢、解决慢、等待时间长</p>

<p v-pre><span><strong>问题类型</strong></span></p>

<p v-pre>商品质量、物流、退款、缺货</p>

<p v-pre><span><strong>客服表现</strong></span></p>

<p v-pre>工作量、处理效率、解决能力</p>

<p v-pre><span><strong>业务流程</strong></span></p>

<p v-pre>等待、转交、处理节点、超时</p>

<p v-pre><span><strong>客户体验</strong></span></p>

<p v-pre>投诉、重复反馈、客户满意度、问题是否解决</p>

<p v-pre>目前已经明确了五个主要分析方向。</p>

<p v-pre>接下来要解决一个重要问题：这些业务问题如何落地成具体指标？</p>

### 五、实战问题 7：从业务问题提炼指标

<p v-pre>我们回到最初的业务问题：</p>

<blockquote v-pre><p>客户反馈售后解决速度慢。</p></blockquote>

<p v-pre>售后主管希望通过数据分析系统判断售后处理效率是否存在问题。</p>

<p v-pre>你认为以下哪些指标最值得关注？</p>

<p v-pre><span><strong>请选择你认为值得关注的指标（可多选）</strong></span></p>

<p v-pre><div><label><span>A. 平均首次响应时长</span></label></div><div><label><span>B. 平均售后解决时长</span></label></div><div><label><span>C. 售后超时订单率</span></label></div><div><label><span>D. 客服处理订单数量</span></label></div><div><label><span>E. 重复反馈率</span></label></div><div><label><span>F. 商品销售额</span></label></div></p>

<p v-pre><span><strong>为什么选择这些指标？</strong></span></p>

```text
响应时间，处理时间，处理超时，衡量售后效率
```

<p v-pre><span class="interaction"><span>提交答案</span></span></p>

#### 六、第二课剩余学习任务

#### 售后系统需求分析进度

<p v-pre>业务背景与目标</p>

<p v-pre><div>已完成</div></p>

<p v-pre>用户角色分析</p>

<p v-pre><div>已完成</div></p>

<p v-pre>业务问题拆解</p>

<p v-pre><div>已完成初步拆解</div></p>

<p v-pre>指标体系设计</p>

<p v-pre><div>正在学习</div></p>

<p v-pre>功能模块设计</p>

<p v-pre><div>待完成</div></p>

<p v-pre>需求说明书</p>

<p v-pre><div>待交付</div></p>

<p v-pre><span><strong>这节课最重要的收获：</strong></span></p>

<p v-pre>你已经从最初的「发现问题、定位原因、如何改善」，逐渐掌握了：</p>

<ul v-pre><li><div><div><p>维度分析</p></div></div></li><li><div><div><p>数据下钻</p></div></div></li><li><div><div><p>多维度分析</p></div></div></li><li><div><div><p>流程耗时分析</p></div></div></li><li><div><div><p>对比分析</p></div></div></li><li><div><div><p>根因验证</p></div></div></li><li><div><div><p>改善效果验证</p></div></div></li></ul>

<p v-pre>下一步，我们要把这些思考转化为真正的数据指标和系统功能，而不是停留在分析思路上。</p>

## 第 10 轮　首次响应、解决时长和 SLA 超时率 {#turn-10}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第二课实战问题7，我选择的指标是：A、B、C。理由：响应时间，处理时间，处理超时，衡量售后效率。请评价我的指标设计，并继续引导我完成售后数据分析系统需求。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

<p v-pre></p>

<p v-pre><div>回答正确</div> <div>进入指标体系设计</div></p>

<p v-pre>这次你的答案很好。你已经开始从业务问题转向可量化的指标设计了。</p>

<p v-pre>你的选择是 A、B、C：</p>

<ul v-pre><li><div><div><p>A：平均首次响应时长</p></div></div></li><li><div><div><p>B：平均售后解决时长</p></div></div></li><li><div><div><p>C：售后超时订单率</p></div></div></li></ul>

<p v-pre>你的理由：</p>

<blockquote v-pre><p>响应时间、处理时间、处理超时，衡量售后效率。</p></blockquote>

<p v-pre>我的评价：<span><strong>指标选择正确，业务逻辑也比较完整。</strong></span> 不过，我们还需要进一步理解每个指标究竟衡量什么，以及指标之间有什么关系。</p>

### 一、评价你的指标设计

<p v-pre>首先，把你的三个指标放在一起看：</p>

#### 售后处理效率指标

<p v-pre>首次响应时长</p>

### 10 分钟

<p v-pre>示例数据</p>

<p v-pre>解决时长</p>

### 58 分钟

<p v-pre>示例数据</p>

<p v-pre>超时订单率</p>

### 18%

<p v-pre>示例数据</p>

<p v-pre>三个指标分别衡量不同的问题：</p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>衡量什么</p></th><th><p>回答的问题</p></th></tr><tr><td><p>首次响应时长</p></td><td><p>响应速度</p></td><td><p>客户等待多久才得到回复？</p></td></tr><tr><td><p>解决时长</p></td><td><p>解决效率</p></td><td><p>客户的问题多久得到解决？</p></td></tr><tr><td><p>超时订单率</p></td><td><p>服务达标情况</p></td><td><p>有多少订单没有按时解决？</p></td></tr></tbody></table>

<p v-pre>你的指标设计已经覆盖了售后效率的三个重要方面。</p>

#### 二、把指标变成可计算的数据

<p v-pre>这是数据分析系统开发中非常重要的环节。</p>

<p v-pre>指标不能只有名称，还必须明确计算口径。</p>

##### 1. 平均首次响应时长

<p v-pre><div><span><span><span>首次响应时长=首次响应时间−售后创建时间首次响应时长=首次响应时间-售后创建时间</span></span></span></div><div><span><span><span>平均首次响应时长=∑首次响应时长售后订单数平均首次响应时长= \frac{\sum 首次响应时长}{售后订单数}</span></span></span></div></p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>售后订单</p></th><th><p>首次响应时长</p></th></tr><tr><td><p>A001</p></td><td><p>5分钟</p></td></tr><tr><td><p>A002</p></td><td><p>10分钟</p></td></tr><tr><td><p>A003</p></td><td><p>15分钟</p></td></tr></tbody></table>

<p v-pre>平均首次响应时长：</p>

<p v-pre><div><span><span><span>(5+10+15)/3=10分钟(5+10+15)/3=10分钟</span></span></span></div></p>

##### 2. 平均售后解决时长

<p v-pre><div><span><span><span>解决时长=售后解决时间−售后创建时间解决时长=售后解决时间-售后创建时间</span></span></span></div></p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>10:00 创建售后。</p></div></div></li><li><div><div><p>10:10 客服首次响应。</p></div></div></li><li><div><div><p>10:40 联系物流。</p></div></div></li><li><div><div><p>11:00 完成售后。</p></div></div></li></ul>

<p v-pre>解决时长为 60 分钟。</p>

<p v-pre>这里有个重要问题：如果中间等待物流反馈 40 分钟，是否也应该计入解决时长？</p>

<p v-pre>通常整体客户等待时长应该保留，但还应该单独统计各个处理环节的耗时。</p>

<p v-pre>这样才能知道时间究竟消耗在哪里。</p>

##### 3. 售后超时订单率

<p v-pre><div><span><span><span>超时订单率=超时售后订单数应纳入统计的售后订单数×100%超时订单率= \frac{超时售后订单数}{应纳入统计的售后订单数} \times100\%</span></span></span></div></p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>统计售后订单：100 单。</p></div></div></li><li><div><div><p>超时订单：18 单。</p></div></div></li></ul>

<p v-pre>超时订单率为 18%。</p>

<p v-pre>注意：这里还需要定义什么叫超时，例如不同售后类型是否使用不同的服务时限。</p>

### 三、进一步完善指标体系

<p v-pre>你的三个指标属于效率指标，但售后主管还需要了解其他方面。</p>

<p v-pre>我建议将售后分析指标划分为五大类：</p>

#### 售后数据分析指标体系

<p v-pre><span><strong>① 处理效率指标</strong></span></p>

<p v-pre><div>你已完成初步设计</div></p>

<ul v-pre><li><div><div><p>平均首次响应时长</p></div></div></li><li><div><div><p>平均售后解决时长</p></div></div></li><li><div><div><p>售后超时订单率</p></div></div></li></ul>

<p v-pre><span><strong>② 处理质量指标</strong></span></p>

<ul v-pre><li><div><div><p>售后一次解决率</p></div></div></li><li><div><div><p>重复反馈率</p></div></div></li><li><div><div><p>售后问题重新打开率</p></div></div></li></ul>

<p v-pre><span><strong>③ 售后规模指标</strong></span></p>

<ul v-pre><li><div><div><p>售后订单量</p></div></div></li><li><div><div><p>售后订单率</p></div></div></li><li><div><div><p>每日新增售后量</p></div></div></li></ul>

<p v-pre><span><strong>④ 客户体验指标</strong></span></p>

<ul v-pre><li><div><div><p>客户投诉率</p></div></div></li><li><div><div><p>客户满意度</p></div></div></li><li><div><div><p>负面情绪占比</p></div></div></li></ul>

<p v-pre><span><strong>⑤ 人员与流程指标</strong></span></p>

<ul v-pre><li><div><div><p>客服人均处理量</p></div></div></li><li><div><div><p>平均转交次数</p></div></div></li><li><div><div><p>各处理环节平均耗时</p></div></div></li><li><div><div><p>超时未处理订单量</p></div></div></li></ul>

<p v-pre>为什么需要五类指标？</p>

<p v-pre>因为售后效率提高，不一定代表售后质量提高。</p>

<p v-pre>例如：</p>

<p v-pre>客服为了缩短解决时长，直接快速关闭售后订单，但客户的问题实际上没有解决。</p>

<p v-pre>这会造成解决时长下降、重复反馈率上升。</p>

<p v-pre>所以必须同时关注效率和质量。</p>

### 四、指标和维度有什么关系？

<p v-pre>这部分是你下一步必须掌握的知识。</p>

<p v-pre>假设我们有一个指标：</p>

<p v-pre><span><strong>平均售后解决时长。</strong></span></p>

<p v-pre>我们可以从不同角度分析它：</p>

<table v-pre><tbody><tr><th><p>维度</p></th><th><p>分析问题</p></th></tr><tr><td><p>时间</p></td><td><p>哪一天解决时长最长？</p></td></tr><tr><td><p>售后类型</p></td><td><p>哪种问题处理最慢？</p></td></tr><tr><td><p>客服</p></td><td><p>哪些客服处理时间较长？</p></td></tr><tr><td><p>区域</p></td><td><p>哪些区域处理时间较长？</p></td></tr><tr><td><p>物流公司</p></td><td><p>哪家物流公司反馈最慢？</p></td></tr><tr><td><p>商品</p></td><td><p>哪些商品产生的售后问题处理较慢？</p></td></tr></tbody></table>

<p v-pre><span class="visual-label">[IT Support Helpdesk Dashboard]</span><div><a href="https://zoomcharts.com/en/microsoft-power-bi-custom-visuals/dashboard-and-report-examples/view/it-support-helpdesk-dashboard-4?utm_source=chatgpt.com"><span>zoomcharts.com</span></a></div></p>

<p v-pre>可以这样理解：</p>

<ul v-pre><li><div><div><p>指标决定分析什么。</p></div></div></li><li><div><div><p>维度决定从什么角度分析。</p></div></div></li><li><div><div><p>下钻决定如何深入查看。</p></div></div></li></ul>

<p v-pre>例如：</p>

<p v-pre>平均解决时长 → 按售后类型分析 → 选择物流异常 → 按物流公司分析 → 查看具体订单。</p>

<p v-pre>这就是一个完整的分析过程。</p>

### 五、实战问题 8：定义指标的统计口径

<p v-pre>现在开始进入真正的产品设计工作。</p>

<p v-pre>假设售后主管提出：</p>

<blockquote v-pre><p>我希望系统能够统计平均售后解决时长，并且能够公平地比较不同客服的处理效率。</p></blockquote>

<p v-pre>现在出现了一个问题：</p>

<p v-pre>有些售后订单需要等待客户补充资料，有些需要等待物流公司反馈。</p>

<p v-pre>你认为计算平均售后解决时长时，应该如何处理这些等待时间？</p>

<p v-pre><div><label>A. 只计算客服实际处理时间，不计算等待客户和物流的时间。</label></div><div><label>B. 计算从售后创建到最终解决的全部时间。</label></div><div><label>C. 同时计算总解决时长、客服实际处理时长、外部等待时长，分别分析。</label></div><div><label>D. 不需要区分等待时间，直接统计每笔订单的解决时长。</label></div></p>

<p v-pre><span><strong>说明你的判断理由</strong></span></p>

```text
客服工作的体现，外部处理不计入。
```

<p v-pre><span class="interaction"><span>提交答案</span></span></p>

<p v-pre><span><strong>思考提示：</strong></span></p>

<p v-pre>这道题不仅涉及指标计算，还涉及一个重要的产品设计问题：</p>

<p v-pre>系统应该如何公平评价客服的工作效率？</p>

### 六、第二课学习成果

<p v-pre>目前我们已经完成了：</p>

#### 售后数据分析系统需求分析进度

<p v-pre><span><strong>业务背景与目标</strong></span></p>

<p v-pre>已完成</p>

<p v-pre><span><strong>用户角色分析</strong></span></p>

<p v-pre>已完成</p>

<p v-pre><span><strong>业务问题拆解</strong></span></p>

<p v-pre>已完成初步拆解</p>

<p v-pre><span><strong>指标体系设计</strong></span></p>

<p v-pre>正在进行</p>

<p v-pre><span><strong>分析维度设计</strong></span></p>

<p v-pre>已完成初步设计</p>

<p v-pre><span><strong>功能模块设计</strong></span></p>

<p v-pre>待完成</p>

<p v-pre><span><strong>需求说明书</strong></span></p>

<p v-pre>待交付</p>

<p v-pre>接下来，我们会把指标体系变成一套真正可落地的设计：</p>

<ol v-pre><li><div><div><p>指标名称和业务定义。</p></div></div></li><li><div><div><p>指标计算公式。</p></div></div></li><li><div><div><p>数据来源和统计粒度。</p></div></div></li><li><div><div><p>分析维度。</p></div></div></li><li><div><div><p>页面和交互功能。</p></div></div></li></ol>

<p v-pre>最终产出一份可以交给 Cursor 或 Codex 开发的《售后数据分析系统需求说明书》。</p>

<p v-pre><span><strong>记住：一个好的指标体系，不是指标越多越好，而是每个指标都能帮助用户回答一个明确的业务问题。</strong></span></p>

## 第 11 轮　区分客服处理、外部等待和端到端时长 {#turn-11}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第二课实战问题8，我选择：A。理由：客服工作的体现，外部处理不计入。。请评价并继续引导我完成售后指标体系和需求说明书。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

<p v-pre>你的回答有一定道理，而且你开始考虑一个很重要的管理问题：<span><strong>如何公平评价客服的工作效率，而不让外部因素影响客服绩效。</strong></span></p>

<p v-pre>不过，这道题我想帮你纠正一个关键概念。</p>

<p v-pre><div>部分正确，需要完善</div></p>

### 一、评价你的答案

<p v-pre>你的选择是 A：</p>

<blockquote v-pre><p>只计算客服实际处理时间，不计算等待客户和物流的时间。</p></blockquote>

<p v-pre>你的理由：</p>

<blockquote v-pre><p>客服工作的体现，外部处理不计入。</p></blockquote>

<p v-pre>这个思路正确的地方在于：你意识到了客服实际工作时间和外部等待时间不是一回事。</p>

<p v-pre>但是，存在一个问题：</p>

<p v-pre>如果系统只统计客服实际处理时间，就无法回答客户真正关心的问题：</p>

<p v-pre><span><strong>我提交售后问题后，究竟等了多久才得到解决？</strong></span></p>

<p v-pre>举个例子：</p>

<table v-pre><tbody><tr><th><p>时间组成</p></th><th><p>订单 A</p></th><th><p>订单 B</p></th></tr><tr><td><p>客服实际处理</p></td><td><p>20 分钟</p></td><td><p>20 分钟</p></td></tr><tr><td><p>等待物流反馈</p></td><td><p>10 分钟</p></td><td><p>90 分钟</p></td></tr><tr><td><p>等待客户反馈</p></td><td><p>5 分钟</p></td><td><p>10 分钟</p></td></tr><tr><td><p>总解决时长</p></td><td><p>35 分钟</p></td><td><p>120 分钟</p></td></tr></tbody></table>

<p v-pre>两笔订单的客服实际处理时间一样，但客户等待时间差异很大。</p>

<p v-pre>如果只看客服实际处理时间，两笔订单的效率完全一样。</p>

<p v-pre>但从客户体验来看，订单 B 明显更差。</p>

#### 二、正确的设计：将时间拆成三个指标

<p v-pre>我更推荐 C：同时计算总解决时长、客服实际处理时长、外部等待时长。</p>

#### 售后时间指标体系

<p v-pre><div>指标 1</div></p>

<p v-pre><span><strong>整体解决时长</strong></span></p>

<p v-pre>从售后创建到最终解决的全部时间。</p>

<p v-pre><div><span><span><span>Ttotal=Tresolve−TcreateT_{total}=T_{resolve}-T_{create}</span></span></span></div></p>

<p v-pre>回答：客户总共等待了多久？</p>

<p v-pre><div>指标 2</div></p>

<p v-pre><span><strong>客服实际处理时长</strong></span></p>

<p v-pre>客服实际执行处理工作的累计时间。</p>

<p v-pre><div><span><span><span>Twork=∑Tagent_activeT_{work}=\sum T_{agent\_active}</span></span></span></div></p>

<p v-pre>回答：客服真正花了多少时间处理问题？</p>

<p v-pre><div>指标 3</div></p>

<p v-pre><span><strong>外部等待时长</strong></span></p>

<p v-pre>等待客户、物流公司或其他部门反馈的时间。</p>

<p v-pre><div><span><span><span>Twait=Tcustomer+Tlogistics+TotherT_{wait}=T_{customer}+T_{logistics}+T_{other}</span></span></span></div></p>

<p v-pre>回答：时间主要消耗在哪些外部环节？</p>

<p v-pre>注意：这三个指标不能简单地认为永远可以相加。实际系统需要记录处理事件的起止时间，避免多个环节并行等待时重复计算。</p>

##### 为什么要这样设计？

<p v-pre>因为系统有两个不同的评价目标：</p>

<table v-pre><tbody><tr><th><p>评价对象</p></th><th><p>重点指标</p></th></tr><tr><td><p>客服个人绩效</p></td><td><p>实际处理时长、首次响应时长、一次解决率</p></td></tr><tr><td><p>售后整体服务质量</p></td><td><p>总解决时长、超时率、重复反馈率</p></td></tr><tr><td><p>业务流程管理</p></td><td><p>外部等待时长、流程转交次数、各节点耗时</p></td></tr></tbody></table>

<p v-pre>这样既能公平评价客服，也不会忽略客户体验。</p>

<p v-pre>这是一个很重要的产品设计能力：<span><strong>同一份业务数据，可以服务于不同的管理目标，但必须区分统计口径。</strong></span></p>

### 三、正式建立售后指标体系

<p v-pre>现在我们把之前学到的内容整理成一份指标设计初稿。</p>

<p v-pre>这是后续数据库设计、SQL 开发和看板开发的基础。</p>

#### 1. 核心指标清单

<table v-pre><tbody><tr><th><p>指标分类</p></th><th><p>指标名称</p></th><th><p>主要用途</p></th></tr><tr><td><p>效率</p></td><td><p>平均首次响应时长</p></td><td><p>衡量客服响应速度</p></td></tr><tr><td><p>效率</p></td><td><p>平均解决时长</p></td><td><p>衡量客户等待时间</p></td></tr><tr><td><p>效率</p></td><td><p>客服实际处理时长</p></td><td><p>衡量客服工作投入</p></td></tr><tr><td><p>效率</p></td><td><p>超时订单率</p></td><td><p>衡量服务时效达标情况</p></td></tr><tr><td><p>质量</p></td><td><p>一次解决率</p></td><td><p>衡量解决质量</p></td></tr><tr><td><p>质量</p></td><td><p>重复反馈率</p></td><td><p>识别问题反复发生</p></td></tr><tr><td><p>规模</p></td><td><p>售后订单量</p></td><td><p>衡量售后业务规模</p></td></tr><tr><td><p>规模</p></td><td><p>售后订单率</p></td><td><p>衡量售后发生情况</p></td></tr><tr><td><p>体验</p></td><td><p>客户投诉率</p></td><td><p>衡量客户负面体验</p></td></tr><tr><td><p>流程</p></td><td><p>外部等待时长</p></td><td><p>定位外部流程瓶颈</p></td></tr><tr><td><p>流程</p></td><td><p>平均转交次数</p></td><td><p>识别流程复杂度</p></td></tr></tbody></table>

#### 2. 指标与业务问题的对应关系

<p v-pre>这一点尤其重要。</p>

<table v-pre><tbody><tr><th><p>业务问题</p></th><th><p>需要关注的指标</p></th></tr><tr><td><p>客户等待回复太久</p></td><td><p>首次响应时长</p></td></tr><tr><td><p>售后解决太慢</p></td><td><p>总解决时长</p></td></tr><tr><td><p>客服处理效率低</p></td><td><p>实际处理时长</p></td></tr><tr><td><p>大量订单处理超时</p></td><td><p>超时订单率</p></td></tr><tr><td><p>客户反复反馈</p></td><td><p>重复反馈率</p></td></tr><tr><td><p>物流反馈慢</p></td><td><p>物流等待时长</p></td></tr><tr><td><p>售后问题没有真正解决</p></td><td><p>一次解决率</p></td></tr></tbody></table>

<p v-pre>以后你设计任何一个指标，都要问自己：</p>

<p v-pre><span><strong>这个指标是为了解决哪个业务问题？</strong></span></p>

<p v-pre>如果回答不上来，这个指标就可能没有必要。</p>

### 四、将指标体系转化成系统功能

<p v-pre>现在开始进入系统产品设计。</p>

<p v-pre>我们已经知道售后主管需要解决什么问题，也知道应该统计哪些指标。</p>

<p v-pre>下一步就是把它们转化成页面和功能。</p>

<p v-pre>我建议第一版 MVP 设计为五个核心页面。</p>

#### 售后数据分析系统 · MVP 页面结构

<p v-pre><div><span class="visual-label">[Analytics Customer Service — UI Dashboard by Seto Febriant on Dribbble]</span></div></p>

<p v-pre><span><strong>01 经营总览</strong></span></p>

<p v-pre>售后订单量、平均解决时长、超时率、投诉率、趋势分析</p>

<p v-pre><div><span class="visual-label">[المعلومات المعمّقة لخدمة العملاء القابلة للتنفيذ عبر لوحات المعلومات | Zoho Desk]</span></div></p>

<p v-pre><span><strong>02 效率分析</strong></span></p>

<p v-pre>首次响应、解决时长、客服处理时长、超时分析</p>

<p v-pre><div><span class="visual-label">[Fathem AI – Memory-Powered Customer Support]</span></div></p>

<p v-pre><span><strong>03 问题类型分析</strong></span></p>

<p v-pre>商品质量、物流、退款、缺货及问题类型下钻</p>

<p v-pre><div><span class="visual-label">[Real-time Analytics on Support Performance | LimeChat]</span></div></p>

<p v-pre><span><strong>04 客服绩效分析</strong></span></p>

<p v-pre>客服工作量、处理效率、解决率、重复反馈率</p>

<p v-pre><div><span class="visual-label">[After Sales Customer Service Management Software | Zoho Desk]</span></div></p>

<p v-pre><span><strong>05 售后明细分析</strong></span></p>

<p v-pre>订单明细、处理时间线、物流记录、异常订单查询</p>

<p v-pre>这里有一个设计原则：</p>

<p v-pre>经营总览负责发现问题，专项分析负责定位问题，订单明细负责验证问题。</p>

<p v-pre>这三个层次构成了整个系统的分析链路。</p>

### 五、继续实战：设计系统的核心页面

<p v-pre>现在我们进入一个真正的产品设计问题。</p>

<p v-pre>假设售后主管每天早上打开系统。</p>

<p v-pre>他最想先知道：</p>

<ol v-pre><li><div><div><p>昨天售后情况是否正常？</p></div></div></li><li><div><div><p>哪些指标出现异常？</p></div></div></li><li><div><div><p>哪些问题需要优先处理？</p></div></div></li><li><div><div><p>应该从哪里进一步分析？</p></div></div></li></ol>

<p v-pre>你需要设计系统的第一个页面：经营总览。</p>

<p v-pre><span><strong>实战问题 9：你认为经营总览页面最应该展示什么？</strong></span></p>

<p v-pre><span><strong>第一步：选择你认为最合理的方案</strong></span></p>

<p v-pre><div><label>A. 只展示售后订单总量和销售额</label></div><div><label>B. 展示售后核心 KPI、同比环比趋势、异常预警和问题排名</label></div><div><label>C. 展示所有售后订单明细</label></div><div><label>D. 展示所有客服的详细工作记录</label></div></p>

<p v-pre><span><strong>第二步：说明你的设计理由</strong></span></p>

```text
全局总览
```

<p v-pre><span class="interaction"><span>提交答案</span></span></p>

### 六、最终交付目标：售后数据分析系统需求说明书

<p v-pre>我们已经有了需求说明书的大部分骨架。</p>

#### 需求说明书 V0.1

<p v-pre>当前学习成果整理</p>

<table v-pre><tbody><tr><th><p>章节</p></th><th><p>当前成果</p></th></tr><tr><td><p>1. 项目背景</p></td><td><p>售后效率与客户体验问题</p></td></tr><tr><td><p>2. 项目目标</p></td><td><p>发现问题、定位原因、改善服务</p></td></tr><tr><td><p>3. 用户角色</p></td><td><p>老板、售后主管、客服、数据分析师</p></td></tr><tr><td><p>4. 业务问题</p></td><td><p>效率、类型、流程、人员、体验</p></td></tr><tr><td><p>5. 指标体系</p></td><td><p>11 个候选指标</p></td></tr><tr><td><p>6. 分析维度</p></td><td><p>时间、类型、客服、区域、物流</p></td></tr><tr><td><p>7. 功能模块</p></td><td><p>5 个 MVP 页面</p></td></tr><tr><td><p>8. 数据模型</p></td><td><p>待设计</p></td></tr><tr><td><p>9. 技术架构</p></td><td><p>待设计</p></td></tr><tr><td><p>10. 验收标准</p></td><td><p>待设计</p></td></tr></tbody></table>

<p v-pre><span><strong>你现在最需要建立的能力，是把业务分析结果转化为可开发的软件需求。</strong></span></p>

<p v-pre>下一步，我们先完成经营总览页面设计，再设计指标口径、数据模型，最终把需求说明书整理成能够直接交给 Cursor / Codex 开发的版本。</p>

## 第 12 轮　经营总览和页面布局 {#turn-12}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第二课实战问题9，我选择：B。理由：全局总览。请评价并继续指导我完成售后系统页面设计和需求说明书。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

<p v-pre></p>

<p v-pre><div>回答正确</div> <div>进入页面设计阶段</div></p>

<p v-pre>你的选择 B 正确。</p>

<p v-pre>你的理由是：</p>

<blockquote v-pre><p>全局总览。</p></blockquote>

<p v-pre>这说明你已经理解了经营总览页面的核心价值：让管理人员快速了解整体情况，而不是一进入系统就查看大量明细数据。</p>

<p v-pre>不过，你的答案还可以进一步提升：</p>

<p v-pre><span><strong>经营总览不仅要展示全局数据，还要让用户快速发现异常，并知道下一步应该去哪里分析。</strong></span></p>

### 一、评价你的页面设计思路

<p v-pre>你选择的方案包含四类重要内容：</p>

<table v-pre><tbody><tr><th><p>内容</p></th><th><p>作用</p></th><th><p>业务价值</p></th></tr><tr><td><p>核心 KPI</p></td><td><p>了解整体经营情况</p></td><td><p>判断当前是否正常</p></td></tr><tr><td><p>同比、环比趋势</p></td><td><p>了解指标变化</p></td><td><p>判断问题是否恶化</p></td></tr><tr><td><p>异常预警</p></td><td><p>发现异常指标</p></td><td><p>快速发现问题</p></td></tr><tr><td><p>问题排名</p></td><td><p>找出主要问题</p></td><td><p>确定分析方向</p></td></tr></tbody></table>

<p v-pre>我给你的建议是：</p>

<p v-pre>经营总览采用「发现问题 → 定位问题 → 深入分析」的设计逻辑。</p>

<p v-pre>不要把所有数据和图表都堆在首页。</p>

### 二、实战：设计经营总览页面

<p v-pre>我们正式设计第一个页面。</p>

#### 1. 页面整体布局

<p v-pre><span><strong>售后经营分析</strong></span></p>

<p v-pre><div>页面原型 V1</div></p>

<p v-pre>统计周期</p>

<p v-pre><div>最近 7 天</div></p>

<p v-pre>售后订单量</p>

### 5,280

<p v-pre>↓ 3.2%</p>

<p v-pre>平均首次响应</p>

### 8.5 分

<p v-pre>↓ 12%</p>

<p v-pre>平均解决时长</p>

### 58 分

<p v-pre>↑ 18%</p>

<p v-pre>售后超时率</p>

### 18%

<p v-pre>↑ 5%</p>

<p v-pre>一次解决率</p>

### 82%

<p v-pre>↑ 3%</p>

<p v-pre>客户投诉量</p>

### 95

<p v-pre>↑ 12%</p>

<p v-pre><span><strong>售后解决时长趋势</strong></span></p>

<p v-pre>最近7天模拟平均解决时长，单位：分钟。</p>

<ul v-pre><li>周一: 解决时长 35分钟</li><li>周二: 解决时长 38分钟</li><li>周三: 解决时长 40分钟</li><li>周四: 解决时长 45分钟</li><li>周五: 解决时长 48分钟</li><li>周六: 解决时长 53分钟</li><li>周日: 解决时长 58分钟</li></ul>

<p v-pre><span><strong>售后问题类型分布</strong></span></p>

<p v-pre>模拟售后问题数量分布。</p>

<p v-pre><div><span>商品缺货</span></div><div><span>商品质量</span></div><div><span>物流异常</span></div><div><span>退款问题</span></div></p>

<ul v-pre><li>物流异常: 180单</li><li>商品质量: 140单</li><li>商品缺货: 90单</li><li>退款问题: 70单</li></ul>

<p v-pre><span><strong>异常问题 TOP 3</strong></span></p>

<p v-pre>1. 物流异常解决时长</p>

<p v-pre><div>偏高</div></p>

<p v-pre>2. 超时售后订单</p>

<p v-pre><div>偏高</div></p>

<p v-pre>3. 重复反馈订单</p>

<p v-pre><div>关注</div></p>

<p v-pre>以上均为模拟数据，仅用于学习页面设计。</p>

<p v-pre>这就是我们第一版经营总览的页面结构。</p>

#### 2. 页面应该有哪些交互？

<p v-pre>一个完整的分析页面不能只有静态图表。</p>

<p v-pre>我建议设计以下交互：</p>

<table v-pre><tbody><tr><th><p>交互</p></th><th><p>用户操作</p></th><th><p>系统响应</p></th></tr><tr><td><p>时间筛选</p></td><td><p>选择最近 7 天</p></td><td><p>更新所有指标</p></td></tr><tr><td><p>KPI 点击</p></td><td><p>点击超时率</p></td><td><p>跳转超时分析</p></td></tr><tr><td><p>图表下钻</p></td><td><p>点击物流异常</p></td><td><p>查看物流异常明细</p></td></tr><tr><td><p>排名点击</p></td><td><p>点击物流公司 B</p></td><td><p>查看该公司分析</p></td></tr><tr><td><p>异常预警</p></td><td><p>点击异常提醒</p></td><td><p>查看异常证据</p></td></tr></tbody></table>

<p v-pre>例如：</p>

<p v-pre>售后主管点击「平均解决时长」，系统进入效率分析页面。</p>

<p v-pre>继续点击「物流异常」，系统展示物流异常订单。</p>

<p v-pre>继续点击某笔订单，系统展示完整处理时间线。</p>

<p v-pre>这就是完整的数据分析交互链路。</p>

### 三、继续设计其他四个页面

<p v-pre>经营总览完成后，我们需要设计四个专项分析页面。</p>

<p v-pre><div><span class="visual-label">[Operations Dashboard Examples for Businesses]</span></div></p>

<p v-pre><span><strong>02 效率分析</strong></span></p>

<ul v-pre><li><div><div><p>首次响应时长</p></div></div></li><li><div><div><p>总解决时长</p></div></div></li><li><div><div><p>客服实际处理时长</p></div></div></li><li><div><div><p>外部等待时长</p></div></div></li><li><div><div><p>超时订单率</p></div></div></li></ul>

<p v-pre><div><span class="visual-label">[Customer Sentiment Analysis: 5 Ways to Get Insights | Sprinklr]</span></div></p>

<p v-pre><span><strong>03 问题类型分析</strong></span></p>

<ul v-pre><li><div><div><p>售后问题类型分布</p></div></div></li><li><div><div><p>各类型解决时长</p></div></div></li><li><div><div><p>问题趋势</p></div></div></li><li><div><div><p>商品和区域分析</p></div></div></li></ul>

<p v-pre><div><span class="visual-label">[Rivelio for customer support teams]</span></div></p>

<p v-pre><span><strong>04 客服绩效分析</strong></span></p>

<ul v-pre><li><div><div><p>客服处理量</p></div></div></li><li><div><div><p>首次响应时长</p></div></div></li><li><div><div><p>一次解决率</p></div></div></li><li><div><div><p>重复反馈率</p></div></div></li><li><div><div><p>工作量与效率对比</p></div></div></li></ul>

<p v-pre><span><strong>05 售后明细分析</strong></span></p>

<ul v-pre><li><div><div><p>售后订单列表</p></div></div></li><li><div><div><p>时间节点记录</p></div></div></li><li><div><div><p>处理人员</p></div></div></li><li><div><div><p>物流反馈记录</p></div></div></li><li><div><div><p>异常订单追踪</p></div></div></li></ul>

<p v-pre>特别提醒：客服绩效分析不能简单按平均解决时长排名。需要考虑问题类型、工作量、复杂程度和实际工作时间，避免不公平评价。</p>

### 四、正式整理需求说明书 V0.2

<p v-pre>我们现在已经有足够的信息，可以形成第一版需求说明书。</p>

<p v-pre><span><strong>售后数据分析系统 PRD</strong></span></p>

<p v-pre><div>V0.2 草稿</div></p>

<p v-pre>项目类型：企业内部 B2B / 电商售后分析系统</p>

<p v-pre><span><strong>1. 项目背景</strong></span></p>

<p v-pre>企业售后数据分散，缺乏统一的分析平台，管理人员难以快速发现售后效率和服务质量问题。</p>

<p v-pre><span><strong>2. 项目目标</strong></span></p>

<ul v-pre><li><div><div><p>统一售后数据统计。</p></div></div></li><li><div><div><p>监控售后服务效率。</p></div></div></li><li><div><div><p>识别异常问题。</p></div></div></li><li><div><div><p>定位业务流程瓶颈。</p></div></div></li><li><div><div><p>辅助管理人员改善服务质量。</p></div></div></li></ul>

<p v-pre><span><strong>3. 用户角色</strong></span></p>

<table v-pre><tbody><tr><th><p>角色</p></th><th><p>主要职责</p></th></tr><tr><td><p>老板</p></td><td><p>查看整体经营情况</p></td></tr><tr><td><p>售后主管</p></td><td><p>分析问题、管理团队</p></td></tr><tr><td><p>客服</p></td><td><p>查看个人工作表现</p></td></tr><tr><td><p>数据分析师</p></td><td><p>数据核验与深入分析</p></td></tr></tbody></table>

<p v-pre><span><strong>4. 核心指标</strong></span></p>

<ul v-pre><li><div><div><p>平均首次响应时长</p></div></div></li><li><div><div><p>平均售后解决时长</p></div></div></li><li><div><div><p>客服实际处理时长</p></div></div></li><li><div><div><p>外部等待时长</p></div></div></li><li><div><div><p>售后超时订单率</p></div></div></li><li><div><div><p>一次解决率</p></div></div></li><li><div><div><p>重复反馈率</p></div></div></li><li><div><div><p>售后订单量</p></div></div></li><li><div><div><p>客户投诉率</p></div></div></li></ul>

<p v-pre><span><strong>5. 功能模块</strong></span></p>

<ol v-pre><li><div><div><p>经营总览</p></div></div></li><li><div><div><p>效率分析</p></div></div></li><li><div><div><p>问题类型分析</p></div></div></li><li><div><div><p>客服绩效分析</p></div></div></li><li><div><div><p>售后明细分析</p></div></div></li></ol>

<p v-pre><span><strong>6. 核心交互</strong></span></p>

<ul v-pre><li><div><div><p>时间筛选</p></div></div></li><li><div><div><p>多维度筛选</p></div></div></li><li><div><div><p>图表联动</p></div></div></li><li><div><div><p>指标下钻</p></div></div></li><li><div><div><p>订单明细查看</p></div></div></li><li><div><div><p>处理时间线查看</p></div></div></li></ul>

<p v-pre><span><strong>7. 待确认内容</strong></span></p>

<ul v-pre><li><div><div><p>售后数据来源</p></div></div></li><li><div><div><p>指标计算口径</p></div></div></li><li><div><div><p>超时标准</p></div></div></li><li><div><div><p>客服实际处理时间如何采集</p></div></div></li><li><div><div><p>数据权限</p></div></div></li><li><div><div><p>数据更新频率</p></div></div></li></ul>

<p v-pre>目前这还是需求草稿，不是可以直接交付开发的最终 PRD。后面必须把指标口径、数据来源、交互规则和验收标准明确下来。</p>

### 五、实战问题 10：确认经营总览的 KPI

<p v-pre>现在进入一个非常重要的产品设计决策。</p>

<p v-pre>我们已经设计了六个 KPI：</p>

<ul v-pre><li><div><div><p>售后订单量</p></div></div></li><li><div><div><p>平均首次响应时长</p></div></div></li><li><div><div><p>平均解决时长</p></div></div></li><li><div><div><p>超时订单率</p></div></div></li><li><div><div><p>一次解决率</p></div></div></li><li><div><div><p>客户投诉量</p></div></div></li></ul>

<p v-pre>但首页空间有限，老板希望第一屏只展示最重要的四个指标。</p>

<p v-pre>你会怎么选择？</p>

<p v-pre><span><strong>请选择四个最重要的首页 KPI</strong></span></p>

<p v-pre>已选择 4/4</p>

<p v-pre><div><label><span>A. 售后订单量</span></label></div><div><label><span>B. 平均首次响应时长</span></label></div><div><label><span>C. 平均解决时长</span></label></div><div><label><span>D. 售后超时订单率</span></label></div><div><label><span>E. 一次解决率</span></label></div><div><label><span>F. 客户投诉量</span></label></div></p>

<p v-pre><span><strong>说明你的选择理由</strong></span></p>

```text
展示业务整体情况。
```

<p v-pre><span class="interaction"><span>提交答案</span></span></p>

### 六、后续开发路线

<p v-pre>页面设计完成后，我们还要解决三个技术设计问题：</p>

<ol v-pre><li><div><div><p><span><strong>指标口径设计</strong></span></p><p>明确每个指标的定义、公式、统计粒度和异常规则。</p></div></div></li><li><div><div><p><span><strong>数据模型设计</strong></span></p><p>设计售后事实表、客服维度表、物流维度表和处理事件表。</p></div></div></li><li><div><div><p><span><strong>系统架构设计</strong></span></p><p>规划 Python + FastAPI、MySQL、React + ECharts，以及数据处理任务。</p></div></div></li></ol>

<p v-pre>最终交付物将包括：</p>

<ol v-pre><li><div><div><p>完整 PRD。</p></div></div></li><li><div><div><p>指标字典。</p></div></div></li><li><div><div><p>数据库设计文档。</p></div></div></li><li><div><div><p>系统架构设计文档。</p></div></div></li><li><div><div><p>API 接口清单。</p></div></div></li><li><div><div><p>页面交互说明。</p></div></div></li><li><div><div><p>测试与验收标准。</p></div></div></li></ol>

<p v-pre><span><strong>下一步我们先确定首页 KPI，再进入指标口径和数据模型设计。</strong></span> 这一步完成后，你就真正从业务需求分析进入系统设计阶段了。</p>

## 第 13 轮　首页 KPI、指标字典和初步数据模型 {#turn-13}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第二课实战问题10，我选择的首页 KPI 是：A、C、D、F。理由：展示业务整体情况。请评价，并继续指导我完成指标口径、数据模型和正式 PRD。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第二课：指标口径、数据模型与正式 PRD 设计

<p v-pre><div>第10题回答正确</div></p>

<p v-pre>你选择的首页 KPI 是：</p>

<ul v-pre><li><div><div><p>A：售后订单量</p></div></div></li><li><div><div><p>C：平均解决时长</p></div></div></li><li><div><div><p>D：售后超时订单率</p></div></div></li><li><div><div><p>F：客户投诉量</p></div></div></li></ul>

<p v-pre>理由是：展示业务整体情况。</p>

<p v-pre><span><strong>我的评价：选择合理，但需要进一步解释这四个指标如何共同反映业务状况。</strong></span></p>

#### 一、评价你的 KPI 设计

#### 售后经营总览 · 四大核心 KPI

<p v-pre>教学模拟数据</p>

<p v-pre>售后订单量</p>

### 850

<p v-pre>单 / 日</p>

<p v-pre>平均解决时长</p>

### 58分

<p v-pre>↑ 较前期增加</p>

<p v-pre>售后超时率</p>

### 18%

<p v-pre>超过服务时限</p>

<p v-pre>客户投诉量</p>

### 95

<p v-pre>件 / 日</p>

<p v-pre>这四个指标覆盖了四个不同的业务视角：</p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>业务视角</p></th><th><p>回答的问题</p></th></tr><tr><td><p>售后订单量</p></td><td><p>业务规模</p></td><td><p>有多少售后问题？</p></td></tr><tr><td><p>平均解决时长</p></td><td><p>处理效率</p></td><td><p>解决问题需要多久？</p></td></tr><tr><td><p>售后超时率</p></td><td><p>服务时效</p></td><td><p>有多少售后没有按时解决？</p></td></tr><tr><td><p>客户投诉量</p></td><td><p>客户体验</p></td><td><p>有多少客户表达不满？</p></td></tr></tbody></table>

<p v-pre>你的方案适合售后主管的日常管理。</p>

<p v-pre>但还有一个重要问题：<span><strong>指标的绝对值不一定能反映业务好坏。</strong></span></p>

<p v-pre>例如，售后订单量增加，可能是因为销售订单量增加，而不是商品质量下降。</p>

<p v-pre>因此，首页还应该提供售后订单率、历史趋势等辅助分析能力。</p>

#### 二、指标口径设计：从名称到可执行规则

<p v-pre>现在开始学习数据分析系统开发的关键环节。</p>

<p v-pre>假设你告诉开发人员：</p>

<blockquote v-pre><p>帮我计算每天的平均售后解决时长。</p></blockquote>

<p v-pre>开发人员可能会问：</p>

<ul v-pre><li><div><div><p>统计当天创建的订单，还是当天解决的订单？</p></div></div></li><li><div><div><p>未解决订单是否参与计算？</p></div></div></li><li><div><div><p>重新打开的订单如何处理？</p></div></div></li><li><div><div><p>跨天解决的订单如何计算？</p></div></div></li><li><div><div><p>是否包含等待物流和客户的时间？</p></div></div></li></ul>

<p v-pre>这些问题不明确，即使 SQL 正确，也可能得到错误的业务结果。</p>

<p v-pre>所以我们需要编写<span><strong>指标字典（Metric Dictionary）</strong></span>。</p>

##### 1. 指标字典示例

<table v-pre><tbody><tr><th><p>字段</p></th><th><p>平均售后解决时长</p></th></tr><tr><td><p>指标编码</p></td><td><p><code>avg_resolution_time</code></p></td></tr><tr><td><p>业务定义</p></td><td><p>售后从创建到最终解决的平均耗时</p></td></tr><tr><td><p>统计对象</p></td><td><p>统计期内最终解决的售后单</p></td></tr><tr><td><p>时间维度</p></td><td><p>最终解决日期</p></td></tr><tr><td><p>计算方式</p></td><td><p>总解决时长 ÷ 已解决售后单数</p></td></tr><tr><td><p>单位</p></td><td><p>分钟</p></td></tr><tr><td><p>排除规则</p></td><td><p>测试单、无效单</p></td></tr><tr><td><p>数据来源</p></td><td><p>售后订单表、处理事件表</p></td></tr><tr><td><p>更新频率</p></td><td><p>每日</p></td></tr><tr><td><p>分析维度</p></td><td><p>时间、类型、客服、区域</p></td></tr></tbody></table>

<p v-pre>这是我们本次实战采用的<span><strong>初步约定口径</strong></span>，不是所有企业都必须使用的统一标准。比如重新打开后再次解决的情况，还需要明确是否按最终关闭时间计算。</p>

##### 2. 四个首页 KPI 的初步统计口径

<table v-pre><tbody><tr><th><p>KPI</p></th><th><p>计算规则</p></th><th><p>统计日期</p></th></tr><tr><td><p>售后订单量</p></td><td><p>去重售后单数量</p></td><td><p>创建日期</p></td></tr><tr><td><p>平均解决时长</p></td><td><p>已解决售后总耗时 ÷ 已解决单数</p></td><td><p>解决日期</p></td></tr><tr><td><p>售后超时率</p></td><td><p>超时单数 ÷ 应考核单数</p></td><td><p>考核日期</p></td></tr><tr><td><p>客户投诉量</p></td><td><p>去重有效投诉数量</p></td><td><p>投诉日期</p></td></tr></tbody></table>

<p v-pre>这里有一个非常重要的知识：</p>

<p v-pre><span><strong>不同指标的统计日期不一定相同。</strong></span></p>

<p v-pre>例如，11 月 20 日创建的售后订单，可能在 11 月 21 日才解决。</p>

<p v-pre>那么它会进入：</p>

<ul v-pre><li><div><div><p>11 月 20 日的新增售后订单量。</p></div></div></li><li><div><div><p>11 月 21 日的已解决订单统计。</p></div></div></li></ul>

<p v-pre>这不是数据不一致，而是统计口径不同。</p>

<p v-pre>另外，超时率的分母必须明确是哪些订单。对于未解决但已经超时的订单，也需要制定统计规则。</p>

#### 三、数据模型设计：系统需要哪些表？

<p v-pre>现在从业务指标进入数据库设计。</p>

<p v-pre>我们暂时采用 MySQL，先设计四张核心业务表和一张汇总表。</p>

#### 售后分析系统 · 初步数据模型

<p v-pre><span><strong>售后订单事实表 </strong><code>fact_aftersales_order</code></span></p>

<p v-pre>售后单 ID、订单 ID、售后类型、创建时间、解决时间、状态、客服 ID、物流公司 ID</p>

<p v-pre><span><strong>客服维度表</strong></span></p>

<p v-pre><code>dim_agent</code></p>

<p v-pre>客服 ID、姓名、团队</p>

<p v-pre><span><strong>物流维度表</strong></span></p>

<p v-pre><code>dim_logistics</code></p>

<p v-pre>物流公司 ID、名称、网点</p>

<p v-pre><span><strong>售后处理事件事实表 </strong><code>fact_aftersales_event</code></span></p>

<p v-pre>事件 ID、售后单 ID、事件类型、发生时间、操作人员、处理状态</p>

<p v-pre>清洗、关联、聚合</p>

<p v-pre><span><strong>每日售后指标汇总表 </strong><code>ads_aftersales_daily</code></span></p>

<p v-pre>统计日期、新增售后量、已解决量、平均解决时长、超时率、投诉量</p>

<p v-pre>这里需要掌握两个概念。</p>

<p v-pre><span><strong>事实表（Fact Table）</strong></span>：记录实际发生的业务事件，例如一笔售后订单、一次客服处理。</p>

<p v-pre><span><strong>维度表（Dimension Table）</strong></span>：描述业务对象，例如客服、物流公司、地区。</p>

<p v-pre>每日汇总表则用于提高看板查询效率。</p>

<p v-pre>注意：目前只是逻辑模型草稿。实际设计还需要确认表的粒度、主键、历史变化、投诉数据来源，以及处理事件是否能够还原各环节的起止时间。</p>

#### 四、正式 PRD：当前已经确定什么？

<p v-pre>我们先整理一份 PRD V0.3 的核心结构。</p>

#### 售后数据分析系统 PRD V0.3

<p v-pre>教学项目 · 待确认需求草案</p>

<p v-pre><span><strong>1. 项目目标</strong></span></p>

<p v-pre>帮助售后主管发现售后异常、定位业务瓶颈、验证原因并评估改善效果。</p>

<p v-pre><span><strong>2. 核心用户</strong></span></p>

<p v-pre>售后主管为主要用户，老板和数据分析师为重要使用者。</p>

<p v-pre><span><strong>3. MVP 功能</strong></span></p>

<ul v-pre><li><div><div><p>经营总览</p></div></div></li><li><div><div><p>效率分析</p></div></div></li><li><div><div><p>问题类型分析</p></div></div></li><li><div><div><p>客服绩效分析</p></div></div></li><li><div><div><p>售后订单明细</p></div></div></li></ul>

<p v-pre><span><strong>4. 首页 KPI</strong></span></p>

<p v-pre>售后订单量、平均解决时长、售后超时率、客户投诉量。</p>

<p v-pre><span><strong>5. 数据分析能力</strong></span></p>

<p v-pre>时间筛选、多维度分析、趋势对比、明细下钻、流程时间线。</p>

<p v-pre><span><strong>6. 数据处理</strong></span></p>

<p v-pre>每日定时同步、数据清洗、指标计算、结果汇总、异常记录。</p>

<p v-pre><span><strong>7. 权限设计</strong></span></p>

<p v-pre>按角色控制功能访问，按团队或授权范围控制数据访问。</p>

<p v-pre><span><strong>8. 尚未确认的关键需求</strong></span></p>

<p v-pre>数据来源、统计口径、更新频率、历史数据修正、异常标准、验收规则。</p>

<p v-pre>为什么还不能直接进入开发？</p>

<p v-pre>因为我们虽然确定了页面和指标，但仍然缺少几个关键的业务决策。</p>

<p v-pre>例如：<span><strong>售后解决时长到底按照哪一天统计？</strong></span></p>

<p v-pre>这个决定会直接影响 SQL、数据模型和图表结果。</p>

### 五、实战问题 11：确定指标的时间统计口径

<p v-pre>假设有以下三笔售后订单：</p>

<table v-pre><tbody><tr><th><p>售后单</p></th><th><p>创建时间</p></th><th><p>解决时间</p></th></tr><tr><td><p>A001</p></td><td><p>11月19日 10:00</p></td><td><p>11月20日 10:00</p></td></tr><tr><td><p>A002</p></td><td><p>11月20日 09:00</p></td><td><p>11月20日 10:00</p></td></tr><tr><td><p>A003</p></td><td><p>11月20日 15:00</p></td><td><p>尚未解决</p></td></tr></tbody></table>

<p v-pre>现在售后主管希望查看：</p>

<blockquote v-pre><p>11 月 20 日的平均售后解决时长是多少？</p></blockquote>

<p v-pre>你认为应该采用哪种统计方式？</p>

<p v-pre><div><label>A. 按创建日期统计：只看 11 月 20 日创建的订单。</label></div><div><label>B. 按解决日期统计：只看 11 月 20 日解决的订单。</label></div><div><label>C. 按创建日期和解决日期分别统计，提供不同的分析口径。</label></div><div><label>D. 所有订单都参与计算，包括未解决订单。</label></div></p>

<p v-pre><span><strong>请说明你的选择理由</strong></span></p>

```text
因为业务更关注实际结果。
```

<p v-pre><span class="interaction"><span>提交答案，继续设计</span></span></p>

<p v-pre>这道题没有脱离业务目标的唯一答案。A、B、C 代表不同的分析视角，我们需要根据用户实际要回答的问题选择统计口径。</p>

<p v-pre><span><strong>本题的关键不是算出一个数字，而是理解：同一个指标，采用不同统计口径，可能产生完全不同的分析结论。</strong></span></p>

<p v-pre>完成这道题后，我们继续确定超时规则、未解决订单处理方式、数据更新频率和验收标准，最后形成可交付开发的正式 PRD。</p>

## 第 14 轮　创建日期与解决日期的统计口径 {#turn-14}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第二课实战问题11，我选择：B。理由：因为业务更关注实际结果。。请评价我的指标时间口径设计，并继续指导我确定售后数据模型、统计规则和正式PRD。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

<p v-pre><div>第 11 题回答正确</div></p>

<p v-pre>你选择 <span><strong>B：按解决日期统计</strong></span>，理由是「业务更关注实际结果」。</p>

<p v-pre>这个判断合理，而且你已经开始从业务目标反推指标口径，而不是单纯从数据库字段出发。</p>

<p v-pre>不过，需要补充一个重要条件：<span><strong>按解决日期统计，适合衡量当天完成的售后处理结果，但不适合单独衡量当天新增售后的处理表现。</strong></span></p>

#### 一、评价你的指标口径设计

<p v-pre>我们重新看这三笔模拟订单：</p>

<table v-pre><tbody><tr><th><p>售后单</p></th><th><p>创建时间</p></th><th><p>解决时间</p></th><th><p>解决耗时</p></th></tr><tr><td><p>A001</p></td><td><p>11月19日 10:00</p></td><td><p>11月20日 10:00</p></td><td><p>1440 分钟</p></td></tr><tr><td><p>A002</p></td><td><p>11月20日 09:00</p></td><td><p>11月20日 10:00</p></td><td><p>60 分钟</p></td></tr><tr><td><p>A003</p></td><td><p>11月20日 15:00</p></td><td><p>未解决</p></td><td><p>暂不计算</p></td></tr></tbody></table>

<p v-pre>按照你选择的 B 方案：</p>

<p v-pre><div><span><span><span>平均解决时长=1440+602=750 分钟平均解决时长=\frac{1440+60}{2}=750\text{ 分钟}</span></span></span></div></p>

<p v-pre>11 月 20 日售后处理结果</p>

<p v-pre>当日已解决售后</p>

### 2 单

<p v-pre>平均解决时长</p>

### 750 分

<p v-pre>教学示例，按自然日历时间计算，不扣除非工作时间。</p>

<p v-pre>但如果只看这个指标，会出现一个问题：A003 仍未解决，却没有参与平均值计算。</p>

<p v-pre>因此，系统可能显示平均解决时长下降，但实际上还有大量积压订单。</p>

<p v-pre><span><strong>我的建议是：采用 B 作为首页默认口径，同时保留 C 的多口径分析能力。</strong></span></p>

<p v-pre>例如，同时提供当日新增量、当日解决量、未解决积压量、超时未解决量，避免只看已完成订单产生偏差。</p>

#### 二、正式确定第一批统计规则

<p v-pre>现在把我们前面讨论的内容整理成可开发的规则。</p>

<table v-pre><tbody><tr><th><p>规则编号</p></th><th><p>统计规则</p></th><th><p>当前决定</p></th></tr><tr><td><p>R01</p></td><td><p>售后新增量按创建日期统计</p></td><td><p>暂定</p></td></tr><tr><td><p>R02</p></td><td><p>已解决量按最终解决日期统计</p></td><td><p>暂定</p></td></tr><tr><td><p>R03</p></td><td><p>平均解决时长按最终解决日期统计</p></td><td><p>已选择</p></td></tr><tr><td><p>R04</p></td><td><p>未解决订单不参与已解决平均时长</p></td><td><p>暂定</p></td></tr><tr><td><p>R05</p></td><td><p>未解决订单单独统计积压量</p></td><td><p>建议纳入 MVP</p></td></tr><tr><td><p>R06</p></td><td><p>超时率根据售后类型对应的 SLA 计算</p></td><td><p>待确认</p></td></tr><tr><td><p>R07</p></td><td><p>重新打开的售后如何计算</p></td><td><p>待确认</p></td></tr><tr><td><p>R08</p></td><td><p>每日统计结果是否允许回溯修正</p></td><td><p>待确认</p></td></tr></tbody></table>

<p v-pre>这里你需要学会区分两种内容：</p>

<ul v-pre><li><div><div><p><span><strong>已经确认的业务规则</strong></span>：可以写入正式 PRD。</p></div></div></li><li><div><div><p><span><strong>尚未确认的设计建议</strong></span>：必须标记为待确认，不能让开发人员自行猜测。</p></div></div></li></ul>

<p v-pre>这是需求管理中非常重要的一项能力。</p>

### 三、把业务规则落实到数据模型

<p v-pre>我们现在需要从逻辑模型进一步走向数据库设计。</p>

#### 售后分析数据模型 V0.2

<p v-pre><span><code>fact_aftersales_order</code><strong> — 售后订单事实表</strong></span></p>

<p v-pre>粒度：一笔售后申请一条当前状态记录</p>

<table v-pre><tbody><tr><th><p>字段</p></th><th><p>含义</p></th></tr><tr><td><p>aftersales_id</p></td><td><p>售后单唯一 ID</p></td></tr><tr><td><p>order_id</p></td><td><p>原始订单 ID</p></td></tr><tr><td><p>created_at</p></td><td><p>售后创建时间</p></td></tr><tr><td><p>resolved_at</p></td><td><p>最终解决时间</p></td></tr><tr><td><p>status</p></td><td><p>当前处理状态</p></td></tr><tr><td><p>issue_type</p></td><td><p>售后问题类型</p></td></tr><tr><td><p>agent_id</p></td><td><p>当前负责客服</p></td></tr><tr><td><p>logistics_id</p></td><td><p>关联物流公司</p></td></tr></tbody></table>

<p v-pre><span><code>fact_aftersales_event</code></span></p>

<p v-pre>处理事件表</p>

<p v-pre>记录响应、转交、等待、解决、重新打开等事件及时间</p>

<p v-pre><span><code>dim_agent</code></span></p>

<p v-pre>客服维度表</p>

<p v-pre>客服、团队、岗位、在职状态</p>

<p v-pre><span><code>dim_logistics</code></span></p>

<p v-pre>物流维度表</p>

<p v-pre>物流公司、网点、区域</p>

<p v-pre><span><code>fact_complaint</code></span></p>

<p v-pre>客户投诉事实表</p>

<p v-pre>投诉 ID、售后单 ID、投诉时间、投诉类型</p>

<p v-pre><span><code>ads_aftersales_daily</code><strong> — 每日指标汇总表</strong></span></p>

<p v-pre>按日期汇总售后新增量、解决量、平均解决时长、超时率等指标</p>

<p v-pre>这里还有两个关键设计问题：</p>

<p v-pre><span><strong>第一，订单表不能代替事件表。</strong></span> 如果只有创建时间和解决时间，就无法准确还原客服处理、等待物流、转交等环节的耗时。</p>

<p v-pre><span><strong>第二，当前状态不能代替历史状态。</strong></span> 如果订单被重新打开，我们必须能够知道之前什么时候解决、什么时候重新打开、最后什么时候真正完成。</p>

<p v-pre>所以事件表是这个系统的重要组成部分。</p>

### 四、正式 PRD V0.4：需求与数据对应

<p v-pre>我们进一步建立需求追踪关系，避免出现「页面设计了，但没有数据支撑」的问题。</p>

<table v-pre><tbody><tr><th><p>需求 ID</p></th><th><p>业务需求</p></th><th><p>对应指标</p></th><th><p>数据来源</p></th></tr><tr><td><p>FR-01</p></td><td><p>经营总览</p></td><td><p>售后量、解决时长、超时率、投诉量</p></td><td><p>售后、投诉、汇总表</p></td></tr><tr><td><p>FR-02</p></td><td><p>效率分析</p></td><td><p>首次响应、解决、等待时长</p></td><td><p>售后事件表</p></td></tr><tr><td><p>FR-03</p></td><td><p>问题类型分析</p></td><td><p>各类型售后量、解决时长</p></td><td><p>售后订单表</p></td></tr><tr><td><p>FR-04</p></td><td><p>客服绩效分析</p></td><td><p>处理量、实际处理时长、一次解决率</p></td><td><p>订单、事件、客服表</p></td></tr><tr><td><p>FR-05</p></td><td><p>售后明细查询</p></td><td><p>订单状态、处理时间线</p></td><td><p>售后订单、事件表</p></td></tr><tr><td><p>FR-06</p></td><td><p>异常分析</p></td><td><p>超时订单量、超时率</p></td><td><p>售后订单、SLA 规则</p></td></tr></tbody></table>

<p v-pre>这张表就是简化版的<span><strong>需求追踪矩阵</strong></span>。</p>

<p v-pre>它能帮助我们检查：</p>

<ul v-pre><li><div><div><p>每项业务需求是否有对应功能。</p></div></div></li><li><div><div><p>每项功能是否有足够的数据支撑。</p></div></div></li><li><div><div><p>每项指标是否有明确计算规则。</p></div></div></li><li><div><div><p>开发完成后应该如何验收。</p></div></div></li></ul>

<p v-pre>目前仍缺少 SLA、重开单、数据刷新和权限等正式规则。</p>

### 五、实战问题 12：售后超时规则如何设计？

<p v-pre>接下来，我们需要确定一个影响整个系统的关键业务规则：<span><strong>什么样的售后订单算超时？</strong></span></p>

<p v-pre>假设售后主管提出：</p>

<blockquote v-pre><p>不同售后问题的处理难度不同，不能全部按照同一个时限考核。</p></blockquote>

<p v-pre>经过业务访谈，暂定以下 SLA：</p>

<table v-pre><tbody><tr><th><p>售后类型</p></th><th><p>解决时限</p></th></tr><tr><td><p>退款问题</p></td><td><p>30 分钟</p></td></tr><tr><td><p>商品质量</p></td><td><p>60 分钟</p></td></tr><tr><td><p>物流异常</p></td><td><p>120 分钟</p></td></tr><tr><td><p>缺货问题</p></td><td><p>60 分钟</p></td></tr></tbody></table>

<p v-pre>以上时限仅为教学模拟，不代表行业标准。</p>

<p v-pre>现在有三笔订单：</p>

<table v-pre><tbody><tr><th><p>售后单</p></th><th><p>类型</p></th><th><p>已经过时间</p></th><th><p>当前状态</p></th></tr><tr><td><p>A001</p></td><td><p>退款</p></td><td><p>45 分钟</p></td><td><p>已解决</p></td></tr><tr><td><p>A002</p></td><td><p>物流异常</p></td><td><p>90 分钟</p></td><td><p>未解决</p></td></tr><tr><td><p>A003</p></td><td><p>商品质量</p></td><td><p>80 分钟</p></td><td><p>未解决</p></td></tr></tbody></table>

<p v-pre>请你判断这三笔订单的超时情况。</p>

<p v-pre><span><strong>逐笔判断是否超时</strong></span></p>

<p v-pre>A001：退款，45 分钟已解决，SLA 30 分钟</p>

<p v-pre><div><label>超时</label></div><div><label>未超时</label></div></p>

<p v-pre>A002：物流异常，已等待 90 分钟，SLA 120 分钟</p>

<p v-pre><div><label>超时</label></div><div><label>未超时</label></div></p>

<p v-pre>A003：商品质量，已等待 80 分钟，SLA 60 分钟</p>

<p v-pre><div><label>超时</label></div><div><label>未超时</label></div></p>

<p v-pre><span><strong>进一步思考：未解决订单能不能算超时？为什么？</strong></span></p>

```text
超时，问题是否解决和超时是两个维度。
```

<p v-pre><span class="interaction"><span>提交判断并继续</span></span></p>

#### 六、第二课还剩哪些内容？

<p v-pre>业务目标、用户角色、问题拆解</p>

<p v-pre>完成</p>

<p v-pre>核心 KPI 与页面设计</p>

<p v-pre>完成初稿</p>

<p v-pre>指标统计口径</p>

<p v-pre>进行中</p>

<p v-pre>数据模型</p>

<p v-pre>完成逻辑草稿</p>

<p v-pre><strong>SLA 与异常规则</strong></p>

<p v-pre>当前任务</p>

<p v-pre>数据更新与权限规则</p>

<p v-pre>待确认</p>

<p v-pre>正式 PRD 与验收标准</p>

<p v-pre>待完成</p>

<p v-pre><span><strong>这一阶段的核心学习目标：让每个指标都有明确口径、每个需求都有数据支撑、每项功能都有可验证的验收标准。</strong></span></p>

<p v-pre>完成这些后，我们就可以结束第二课的需求分析阶段，进入第三课：数据架构与数据建模实战。</p>

## 第 15 轮　SLA、数据更新与正式 PRD {#turn-15}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第二课实战问题12，我判断 A001：超时，A002：未超时，A003：超时。理由：超时，问题是否解决和超时是两个维度。。请评价，并继续完成 SLA 规则、数据更新机制和正式 PRD。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第二课实战：SLA 规则、数据更新机制与正式 PRD

<p v-pre></p>

<p v-pre><div>第12题回答正确</div> <div>进入需求分析收尾阶段</div></p>

<p v-pre>这次你的回答非常好。</p>

<p v-pre>你的判断：</p>

<ul v-pre><li><div><div><p>A001：超时。</p></div></div></li><li><div><div><p>A002：未超时。</p></div></div></li><li><div><div><p>A003：超时。</p></div></div></li></ul>

<p v-pre>你的理由：</p>

<blockquote v-pre><p>超时、问题是否解决是两个维度。</p></blockquote>

<p v-pre><span><strong>这个理解完全正确，而且是一个很重要的数据建模思维。</strong></span></p>

#### 一、评价你的答案：业务状态与 SLA 状态必须分开

<p v-pre>我们先看这三笔订单。</p>

<table v-pre><tbody><tr><th><p>售后单</p></th><th><p>解决状态</p></th><th><p>SLA 状态</p></th><th><p>判断</p></th></tr><tr><td><p>A001</p></td><td><p>已解决</p></td><td><p>已超时</p></td><td><p>超时解决</p></td></tr><tr><td><p>A002</p></td><td><p>处理中</p></td><td><p>未超时</p></td><td><p>正常处理中</p></td></tr><tr><td><p>A003</p></td><td><p>处理中</p></td><td><p>已超时</p></td><td><p>超时未解决</p></td></tr></tbody></table>

<p v-pre>这里有两个独立的状态体系。</p>

<p v-pre><span><strong>第一套：售后业务状态</strong></span></p>

<p v-pre><div>待处理</div></p>

<p v-pre><div>处理中</div></p>

<p v-pre><div>已解决</div></p>

<p v-pre><div>已取消</div></p>

<p v-pre><span><strong>第二套：SLA 状态</strong></span></p>

<p v-pre><div>未到期</div></p>

<p v-pre><div>即将到期</div></p>

<p v-pre><div>已超时</div></p>

<p v-pre><div>按时完成</div></p>

<p v-pre>为什么要分开？</p>

<p v-pre>因为一个订单可以处于「处理中 + 已超时」的状态。</p>

<p v-pre>如果只用一个订单状态字段，就很难准确表达这种情况。</p>

<p v-pre>这会直接影响数据库设计、异常预警和看板统计。</p>

### 二、正式设计 SLA 规则

<p v-pre>SLA（Service Level Agreement）可以理解为服务时效约定。</p>

<p v-pre>在我们的项目中，它用于定义：</p>

<p v-pre><span><strong>不同类型的售后问题，应该在多长时间内完成处理。</strong></span></p>

#### 1. 确定 SLA 标准

<p v-pre>我们沿用教学案例中的规则：</p>

<table v-pre><tbody><tr><th><p>售后类型</p></th><th><p>SLA 时限</p></th><th><p>计算单位</p></th></tr><tr><td><p>退款问题</p></td><td><p>30</p></td><td><p>分钟</p></td></tr><tr><td><p>商品质量</p></td><td><p>60</p></td><td><p>分钟</p></td></tr><tr><td><p>物流异常</p></td><td><p>120</p></td><td><p>分钟</p></td></tr><tr><td><p>商品缺货</p></td><td><p>60</p></td><td><p>分钟</p></td></tr></tbody></table>

#### 2. 确定 SLA 计算公式

<p v-pre><div><span><span><span>SLA截止时间=售后创建时间+SLA时限SLA截止时间=售后创建时间+SLA时限</span></span></span></div></p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>售后创建时间：10:00</p></div></div></li><li><div><div><p>物流异常 SLA：120 分钟</p></div></div></li><li><div><div><p>SLA 截止时间：12:00</p></div></div></li></ul>

<p v-pre>判断规则：</p>

<table v-pre><tbody><tr><th><p>当前情况</p></th><th><p>SLA 状态</p></th></tr><tr><td><p>11:00，处理中</p></td><td><p>未到期</p></td></tr><tr><td><p>11:50，处理中</p></td><td><p>即将到期</p></td></tr><tr><td><p>12:01，处理中</p></td><td><p>已超时</p></td></tr><tr><td><p>11:50，已解决</p></td><td><p>按时完成</p></td></tr><tr><td><p>12:30，已解决</p></td><td><p>超时解决</p></td></tr></tbody></table>

<p v-pre>注意：这里的计算采用自然时间，不扣除非工作时间。正式上线前还需要确认公司是否使用工作时间日历。</p>

#### 3. SLA 状态机

<p v-pre><span><strong>售后订单创建</strong></span></p>

<p v-pre><span><strong>计算 SLA 截止时间</strong></span></p>

<p v-pre><span><strong>订单处理中</strong></span></p>

<p v-pre>截止前解决</p>

<p v-pre><span><strong>按时完成</strong></span></p>

<p v-pre>超过截止时间</p>

<p v-pre><span><strong>已超时</strong></span></p>

#### 4. 一个重要设计：外部等待是否暂停 SLA？

<p v-pre>之前你已经提出客服实际处理时间与外部等待时间应该分开统计。</p>

<p v-pre>这里还需要进一步区分：</p>

<table v-pre><tbody><tr><th><p>时间指标</p></th><th><p>计算规则</p></th></tr><tr><td><p>客户总等待时间</p></td><td><p>创建到解决的全部时间</p></td></tr><tr><td><p>客服实际处理时间</p></td><td><p>客服实际执行工作的累计时间</p></td></tr><tr><td><p>外部等待时间</p></td><td><p>等待客户、物流、其他部门的时间</p></td></tr><tr><td><p>SLA 时间</p></td><td><p>根据正式服务时限规则计算</p></td></tr></tbody></table>

<p v-pre>我的 MVP 建议：</p>

<ul v-pre><li><div><div><p>客户总等待时间不暂停。</p></div></div></li><li><div><div><p>默认 SLA 也不因等待物流而暂停。</p></div></div></li><li><div><div><p>客服实际处理时间单独统计。</p></div></div></li><li><div><div><p>如果未来业务确实允许暂停 SLA，必须记录暂停原因、开始时间和恢复时间。</p></div></div></li></ul>

<p v-pre>这样可以避免通过把订单标记为「等待物流」来掩盖客户实际等待时间。</p>

#### 5. SLA 数据库规则表

<p v-pre>建议增加一张规则表：</p>

<p v-pre><code>dim_aftersales_sla_rule</code></p>

<table v-pre><tbody><tr><th><p>字段</p></th><th><p>类型</p></th><th><p>含义</p></th></tr><tr><td><p>id</p></td><td><p>BIGINT</p></td><td><p>主键</p></td></tr><tr><td><p>issue_type</p></td><td><p>VARCHAR</p></td><td><p>售后类型</p></td></tr><tr><td><p>sla_minutes</p></td><td><p>INT</p></td><td><p>SLA 时限</p></td></tr><tr><td><p>effective_start</p></td><td><p>DATETIME</p></td><td><p>生效时间</p></td></tr><tr><td><p>effective_end</p></td><td><p>DATETIME</p></td><td><p>失效时间</p></td></tr><tr><td><p>enabled</p></td><td><p>TINYINT</p></td><td><p>是否启用</p></td></tr></tbody></table>

<p v-pre>另外，在售后订单事实表中保存创建时适用的 SLA 快照：</p>

<ul v-pre><li><div><div><p><code>sla_rule_id</code></p></div></div></li><li><div><div><p><code>sla_minutes</code></p></div></div></li><li><div><div><p><code>sla_deadline</code></p></div></div></li><li><div><div><p><code>sla_breached</code></p></div></div></li><li><div><div><p><code>sla_breached_at</code></p></div></div></li></ul>

<p v-pre>为什么保存快照？</p>

<p v-pre>假设 11 月的物流异常 SLA 是 120 分钟，12 月调整成 90 分钟。</p>

<p v-pre>我们不能因为规则变更，就把 11 月历史订单重新按照 90 分钟计算。</p>

<p v-pre><span><strong>历史订单应该遵循创建时适用的 SLA 规则。</strong></span></p>

### 三、设计数据更新机制

<p v-pre>现在解决另一个重要问题：</p>

<p v-pre><span><strong>数据分析系统的数据从哪里来？多久更新一次？</strong></span></p>

<p v-pre>我们的售后系统主要涉及：</p>

<ol v-pre><li><div><div><p>售后订单数据。</p></div></div></li><li><div><div><p>客服处理记录。</p></div></div></li><li><div><div><p>客户投诉记录。</p></div></div></li><li><div><div><p>物流反馈记录。</p></div></div></li><li><div><div><p>客服人员信息。</p></div></div></li></ol>

#### 1. 数据更新架构

#### 数据更新流程

<p v-pre><span><strong>业务数据源</strong></span></p>

<p v-pre>订单系统、客服系统、物流系统、投诉系统</p>

<p v-pre><span><strong>数据采集</strong></span></p>

<p v-pre>API / 数据库增量同步 / Excel 导入</p>

<p v-pre><span><strong>数据处理</strong></span></p>

<p v-pre>数据清洗、去重、关联、状态计算、SLA 判断</p>

<p v-pre><span><strong>数据存储</strong></span></p>

<p v-pre>MySQL 业务明细表、事件表、指标汇总表</p>

<p v-pre><span><strong>FastAPI 数据服务</strong></span></p>

<p v-pre>指标查询、权限验证、数据筛选</p>

<p v-pre><span><strong>React + ECharts</strong></span></p>

<p v-pre>经营总览、专项分析、数据下钻</p>

#### 2. 数据更新频率设计

<p v-pre>不同类型的数据，不一定需要使用相同的更新频率。</p>

<table v-pre><tbody><tr><th><p>数据类型</p></th><th><p>建议更新频率</p></th><th><p>原因</p></th></tr><tr><td><p>售后订单</p></td><td><p>每 5 分钟</p></td><td><p>及时掌握新增与状态变化</p></td></tr><tr><td><p>处理事件</p></td><td><p>每 1～5 分钟</p></td><td><p>记录处理流程</p></td></tr><tr><td><p>物流反馈</p></td><td><p>每 5 分钟或按接口能力</p></td><td><p>追踪外部等待</p></td></tr><tr><td><p>客服信息</p></td><td><p>每日或变更时</p></td><td><p>变化频率较低</p></td></tr><tr><td><p>投诉记录</p></td><td><p>每 5 分钟</p></td><td><p>及时发现客户问题</p></td></tr><tr><td><p>每日指标汇总</p></td><td><p>每日定时 + 增量修正</p></td><td><p>支持趋势分析</p></td></tr></tbody></table>

<p v-pre>这里是推荐的 MVP 更新策略，不是已经验证的业务要求。</p>

<p v-pre>如果数据源支持事件推送，可以进一步使用事件驱动机制；如果只能查询数据库，则采用定时增量同步。</p>

#### 3. 数据处理任务如何安排？

<p v-pre>建议设计四类任务：</p>

<table v-pre><tbody><tr><th><p>任务</p></th><th><p>作用</p></th><th><p>频率</p></th></tr><tr><td><p><code>sync_aftersales</code></p></td><td><p>同步售后订单</p></td><td><p>5 分钟</p></td></tr><tr><td><p><code>sync_aftersales_event</code></p></td><td><p>同步处理事件</p></td><td><p>1～5 分钟</p></td></tr><tr><td><p><code>calculate_sla</code></p></td><td><p>计算超时状态</p></td><td><p>5 分钟</p></td></tr><tr><td><p><code>aggregate_daily_metrics</code></p></td><td><p>计算每日汇总指标</p></td><td><p>每日凌晨 + 补算</p></td></tr></tbody></table>

<p v-pre>对于未解决订单，SLA 状态需要随时间更新。</p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>11:55：未超时。</p></div></div></li><li><div><div><p>12:00：达到截止时间。</p></div></div></li><li><div><div><p>12:05：已超时。</p></div></div></li></ul>

<p v-pre>因此不能只在订单创建时计算一次。</p>

#### 4. 数据质量与异常处理

<p v-pre>系统还必须处理这些情况：</p>

<ul v-pre><li><div><div><p>同一订单被重复同步。</p></div></div></li><li><div><div><p>售后状态发生变化。</p></div></div></li><li><div><div><p>订单被重新打开。</p></div></div></li><li><div><div><p>物流反馈延迟到达。</p></div></div></li><li><div><div><p>数据源短暂不可用。</p></div></div></li><li><div><div><p>每日汇总结果需要回溯修正。</p></div></div></li></ul>

<p v-pre>建议增加同步任务日志表：</p>

<p v-pre><code>etl_job_log</code></p>

<p v-pre>核心字段：</p>

<table v-pre><tbody><tr><th><p>字段</p></th><th><p>含义</p></th></tr><tr><td><p>job_name</p></td><td><p>任务名称</p></td></tr><tr><td><p>start_time</p></td><td><p>开始时间</p></td></tr><tr><td><p>end_time</p></td><td><p>结束时间</p></td></tr><tr><td><p>status</p></td><td><p>成功 / 失败</p></td></tr><tr><td><p>records_read</p></td><td><p>读取数量</p></td></tr><tr><td><p>records_written</p></td><td><p>写入数量</p></td></tr><tr><td><p>error_message</p></td><td><p>错误信息</p></td></tr></tbody></table>

<p v-pre>这样，数据分析系统不仅可以展示业务数据，还可以监控自身的数据质量。</p>

### 四、正式 PRD：售后数据分析系统 V1.0 {#prd-v1-0}

<p v-pre>现在我们将前面完成的成果正式整合。</p>

### 售后数据分析系统

<p v-pre>Aftersales Analytics System</p>

<p v-pre><div>PRD V1.0</div></p>

<p v-pre><span><strong>01 项目概述</strong></span></p>

<p v-pre>建设统一的售后数据分析平台，帮助管理人员监控售后效率、发现异常、定位问题并验证改善效果。</p>

<p v-pre><span><strong>02 项目用户</strong></span></p>

<table v-pre><tbody><tr><th><p>用户</p></th><th><p>权限与职责</p></th></tr><tr><td><p>老板</p></td><td><p>查看整体经营数据</p></td></tr><tr><td><p>售后主管</p></td><td><p>查看团队数据、分析售后问题</p></td></tr><tr><td><p>客服</p></td><td><p>查看授权范围内的个人绩效</p></td></tr><tr><td><p>数据分析师</p></td><td><p>查看授权明细、核对指标</p></td></tr></tbody></table>

<p v-pre><span><strong>03 MVP 功能范围</strong></span></p>

<p v-pre><div>P0 必须完成</div></p>

<ul v-pre><li><div><div><p>经营总览</p></div></div></li><li><div><div><p>效率分析</p></div></div></li><li><div><div><p>问题类型分析</p></div></div></li><li><div><div><p>售后明细查询</p></div></div></li><li><div><div><p>时间及多维度筛选</p></div></div></li><li><div><div><p>SLA 超时识别</p></div></div></li></ul>

<p v-pre><div>P1 后续迭代</div></p>

<ul v-pre><li><div><div><p>客服绩效分析</p></div></div></li><li><div><div><p>异常预警</p></div></div></li><li><div><div><p>流程耗时分析</p></div></div></li><li><div><div><p>自动生成分析报告</p></div></div></li></ul>

<p v-pre><span><strong>04 首页 KPI</strong></span></p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>默认统计口径</p></th></tr><tr><td><p>售后订单量</p></td><td><p>按创建日期</p></td></tr><tr><td><p>平均解决时长</p></td><td><p>按最终解决日期</p></td></tr><tr><td><p>售后超时率</p></td><td><p>按 SLA 到期日期</p></td></tr><tr><td><p>客户投诉量</p></td><td><p>按投诉日期</p></td></tr></tbody></table>

<p v-pre><span><strong>05 分析功能</strong></span></p>

<ul v-pre><li><div><div><p>按日、周、月分析。</p></div></div></li><li><div><div><p>按售后类型分析。</p></div></div></li><li><div><div><p>按客服和团队分析。</p></div></div></li><li><div><div><p>按区域及物流公司分析。</p></div></div></li><li><div><div><p>查看售后订单明细。</p></div></div></li><li><div><div><p>查看订单处理时间线。</p></div></div></li></ul>

<p v-pre><span><strong>06 SLA 管理</strong></span></p>

<ul v-pre><li><div><div><p>支持按售后类型配置时限。</p></div></div></li><li><div><div><p>创建订单时保存 SLA 规则快照。</p></div></div></li><li><div><div><p>支持按时完成、超时解决、超时未解决的识别。</p></div></div></li><li><div><div><p>支持超时订单查询。</p></div></div></li><li><div><div><p>历史订单遵循创建时的适用规则。</p></div></div></li></ul>

<p v-pre><span><strong>07 数据更新</strong></span></p>

<ul v-pre><li><div><div><p>增量同步业务数据。</p></div></div></li><li><div><div><p>定时计算 SLA 状态。</p></div></div></li><li><div><div><p>每日生成指标汇总。</p></div></div></li><li><div><div><p>失败任务记录日志。</p></div></div></li><li><div><div><p>支持历史数据补算。</p></div></div></li></ul>

<p v-pre><span><strong>08 数据权限</strong></span></p>

<ul v-pre><li><div><div><p>按角色授权功能。</p></div></div></li><li><div><div><p>按团队控制数据范围。</p></div></div></li><li><div><div><p>个人绩效仅对授权用户开放。</p></div></div></li><li><div><div><p>记录敏感数据访问日志。</p></div></div></li></ul>

<p v-pre><span><strong>09 技术方案</strong></span></p>

<table v-pre><tbody><tr><th><p>层次</p></th><th><p>技术</p></th></tr><tr><td><p>前端</p></td><td><p>React + TypeScript</p></td></tr><tr><td><p>图表</p></td><td><p>ECharts</p></td></tr><tr><td><p>后端</p></td><td><p>Python + FastAPI</p></td></tr><tr><td><p>ORM</p></td><td><p>SQLAlchemy</p></td></tr><tr><td><p>数据库</p></td><td><p>MySQL</p></td></tr><tr><td><p>数据任务</p></td><td><p>Celery + Redis</p></td></tr><tr><td><p>部署</p></td><td><p>Docker</p></td></tr></tbody></table>

<p v-pre><span><strong>10 核心数据表</strong></span></p>

<ul v-pre><li><div><div><p><code>fact_aftersales_order</code></p></div></div></li><li><div><div><p><code>fact_aftersales_event</code></p></div></div></li><li><div><div><p><code>fact_complaint</code></p></div></div></li><li><div><div><p><code>dim_agent</code></p></div></div></li><li><div><div><p><code>dim_logistics</code></p></div></div></li><li><div><div><p><code>dim_aftersales_sla_rule</code></p></div></div></li><li><div><div><p><code>ads_aftersales_daily</code></p></div></div></li><li><div><div><p><code>etl_job_log</code></p></div></div></li></ul>

<p v-pre><span><strong>11 非功能要求</strong></span></p>

<ul v-pre><li><div><div><p>支持数据重复同步时幂等处理。</p></div></div></li><li><div><div><p>支持异常任务重试。</p></div></div></li><li><div><div><p>查询接口具备分页和筛选能力。</p></div></div></li><li><div><div><p>关键指标可以追溯到明细数据。</p></div></div></li><li><div><div><p>重要数据操作具有审计记录。</p></div></div></li></ul>

#### 五、验收标准：如何判断开发完成？

<p v-pre>这部分非常重要。</p>

<p v-pre>PRD 不能只有功能描述，还要有可测试的完成标准。</p>

<table v-pre><tbody><tr><th><p>验收编号</p></th><th><p>验收要求</p></th><th><p>验收方式</p></th></tr><tr><td><p>AC-01</p></td><td><p>售后订单量准确</p></td><td><p>与源系统订单数核对</p></td></tr><tr><td><p>AC-02</p></td><td><p>平均解决时长准确</p></td><td><p>抽取订单人工计算</p></td></tr><tr><td><p>AC-03</p></td><td><p>SLA 判断正确</p></td><td><p>测试按时和超时订单</p></td></tr><tr><td><p>AC-04</p></td><td><p>未解决订单正确展示</p></td><td><p>检查未解决及积压数据</p></td></tr><tr><td><p>AC-05</p></td><td><p>多维度筛选正常</p></td><td><p>测试时间、类型、客服</p></td></tr><tr><td><p>AC-06</p></td><td><p>明细下钻正确</p></td><td><p>核对图表与订单明细</p></td></tr><tr><td><p>AC-07</p></td><td><p>增量同步幂等</p></td><td><p>重复执行任务检查重复数据</p></td></tr><tr><td><p>AC-08</p></td><td><p>权限隔离正确</p></td><td><p>使用不同角色测试</p></td></tr></tbody></table>

<p v-pre>还有一个重要原则：</p>

<p v-pre><span><strong>图表上的数字必须能够追溯到具体的数据记录和计算口径。</strong></span></p>

<p v-pre>例如，首页显示售后超时率 18%，用户应该能够点击这个数字，查看构成这 18% 的具体订单。</p>

### 五、第二课最终交付检查

<p v-pre>我们已经把需求分析从业务问题逐步落实到系统设计。</p>

#### 第二课学习成果

<p v-pre><span><strong>业务背景与目标</strong></span></p>

<p v-pre><div>完成</div></p>

<p v-pre><span><strong>用户角色分析</strong></span></p>

<p v-pre><div>完成</div></p>

<p v-pre><span><strong>业务问题拆解</strong></span></p>

<p v-pre><div>完成</div></p>

<p v-pre><span><strong>指标体系设计</strong></span></p>

<p v-pre><div>初版完成</div></p>

<p v-pre><span><strong>页面与功能设计</strong></span></p>

<p v-pre><div>初版完成</div></p>

<p v-pre><span><strong>SLA 规则</strong></span></p>

<p v-pre><div>初版完成</div></p>

<p v-pre><span><strong>数据更新机制</strong></span></p>

<p v-pre><div>初版完成</div></p>

<p v-pre><span><strong>正式 PRD</strong></span></p>

<p v-pre><div>V1.0 草稿完成</div></p>

#### 六、正式开发前，还需要确认的 6 个事项

<p v-pre>虽然 PRD V1.0 已经形成，但以下事项不能靠开发人员自行猜测：</p>

<table v-pre><tbody><tr><th><p>待确认事项</p></th><th><p>推荐方案</p></th></tr><tr><td><p>SLA 是否按工作时间计算</p></td><td><p>MVP 暂按自然时间</p></td></tr><tr><td><p>等待物流是否暂停 SLA</p></td><td><p>默认不暂停</p></td></tr><tr><td><p>售后重新打开如何计算</p></td><td><p>保留完整历史事件，按最终解决时间统计</p></td></tr><tr><td><p>超时率统计分母</p></td><td><p>统计 SLA 到期的有效订单</p></td></tr><tr><td><p>数据更新频率</p></td><td><p>MVP 暂定 5 分钟增量同步</p></td></tr><tr><td><p>原始数据来源</p></td><td><p>先确认业务数据库、API 或 Excel</p></td></tr></tbody></table>

<p v-pre>尤其是超时率，建议采用：</p>

<p v-pre><div><span><span><span>超时率=统计周期内已超时订单数统计周期内SLA到期的有效订单数×100%超时率= \frac{统计周期内已超时订单数} {统计周期内SLA到期的有效订单数} \times100\%</span></span></span></div></p>

<p v-pre>尚未到期的处理中订单不进入分母；已经超时但仍未解决的订单必须进入分子和分母。</p>

<p v-pre>这样能够避免未到期订单稀释超时率。</p>

<p v-pre>这些规则经过业务负责人确认后，PRD 才能成为正式开发基线。</p>

### 七、进入第三课：数据架构与数据建模

<p v-pre><div>第二课核心内容完成</div></p>

<p v-pre>接下来我们进入软件开发的下一个阶段。</p>

### 第三课：数据架构与数据建模

<p v-pre><span class="visual-label">[Mastering Data Layers in data platform | Medium]</span><div><a href="https://medium.com/%40sivailango.s/principles-of-data-layers-in-data-platform-a336a0ff9e1e?utm_source=chatgpt.com"><span>medium.com</span></a></div></p>

<p v-pre><span><strong>第三课将学习：</strong></span></p>

<ol v-pre><li><div><div><p>数据分析系统应该采用什么架构？</p></div></div></li><li><div><div><p>OLTP 和 OLAP 有什么区别？</p></div></div></li><li><div><div><p>什么是事实表、维度表、汇总表？</p></div></div></li><li><div><div><p>如何确定一张表的数据粒度？</p></div></div></li><li><div><div><p>如何设计售后订单事实表？</p></div></div></li><li><div><div><p>如何设计售后处理事件表？</p></div></div></li><li><div><div><p>如何设计指标汇总表？</p></div></div></li><li><div><div><p>如何建立表之间的关联关系？</p><p><span><strong>本课最终交付物</strong></span></p></div></div></li></ol>

<ul v-pre><li><div><div><p>系统数据架构图</p></div></div></li><li><div><div><p>数据库 ER 图</p></div></div></li><li><div><div><p>核心数据表设计</p></div></div></li><li><div><div><p>字段字典</p></div></div></li><li><div><div><p>数据流转说明</p></div></div></li></ul>

<p v-pre><span><strong>第三课的实战目标：</strong></span> 真正设计出一套能够支撑刚才售后分析系统的 MySQL 数据模型，而不是只会写 SQL 查询。</p>

<p v-pre>你已经完成了从业务需求到 PRD 的第一轮训练。下一步，我们开始把这份需求变成真正可以运行的软件系统。</p>
