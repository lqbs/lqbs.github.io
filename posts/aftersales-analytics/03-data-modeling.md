---
title: "第三章　数据架构与 MySQL 建模"
description: "用售后单、处理事件和团队归属设计事实表、维度表与每日汇总。"
outline: [2, 2]
prev:
  text: "第二章　业务需求、指标与 PRD"
  link: "/posts/aftersales-analytics/02-requirements-and-prd"
next:
  text: "第四章　ETL 增量同步与补数"
  link: "/posts/aftersales-analytics/04-etl"
---

# 第三章　数据架构与 MySQL 建模

用售后单、处理事件和团队归属设计事实表、维度表与每日汇总。

[返回完整目录](/posts/aftersales-analytics-from-scratch#完整目录)

## 第 16 轮　ODS、DWD、DWS 与 ADS 分层 {#turn-16}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>开始下一步</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第三课：数据架构与数据建模

<p v-pre><div>第 1 讲 / 数据架构设计</div></p>

<p v-pre>上一课，我们完成了《售后数据分析系统 PRD V1.0》草稿。</p>

<p v-pre>这一课开始，我们要把业务需求转化为真正能够开发的数据系统。</p>

<p v-pre><span><strong>本课目标：学会从业务需求出发，设计数据架构，而不是一开始就建表写 SQL。</strong></span></p>

#### 一、先理解：什么是数据架构？

<p v-pre>假设一家生鲜电商企业有三个系统：</p>

<ul v-pre><li><div><div><p>订单系统：保存客户订单、商品、金额。</p></div></div></li><li><div><div><p>售后系统：保存售后申请、处理状态。</p></div></div></li><li><div><div><p>客服系统：保存客服聊天记录、处理事件。</p></div></div></li></ul>

<p v-pre>老板希望查看：</p>

<blockquote v-pre><p>昨天有多少售后订单？平均解决时长是多少？哪些问题最严重？</p></blockquote>

<p v-pre>但是，这些数据分散在不同系统中。</p>

<p v-pre>我们需要建立一套数据架构，把数据组织起来。</p>

#### 售后数据分析系统架构 V1

<p v-pre>订单系统</p>

<p v-pre>订单、商品</p>

<p v-pre>售后系统</p>

<p v-pre>售后申请</p>

<p v-pre>客服系统</p>

<p v-pre>处理记录</p>

<p v-pre>数据同步 / ETL</p>

<p v-pre><span><strong>ODS 原始数据层</strong></span></p>

<p v-pre>保存同步后的源数据，方便追溯</p>

<p v-pre><span><strong>DWD 明细数据层</strong></span></p>

<p v-pre>清洗、去重、统一业务口径</p>

<p v-pre><span><strong>DWS 汇总数据层</strong></span></p>

<p v-pre>按日期、售后类型、客服等维度聚合</p>

<p v-pre><span><strong>ADS 应用数据层</strong></span></p>

<p v-pre>首页 KPI、趋势、超时分析等查询结果</p>

<p v-pre><span><strong>FastAPI + React + ECharts</strong></span></p>

<p v-pre>接口服务、指标查询、可视化看板</p>

<p v-pre>这是一种常见的分层数据架构，并不是所有项目都必须使用完整的四层。</p>

#### 二、理解四个数据层

<p v-pre>我们用同一笔售后订单来理解。</p>

<p v-pre>假设原始售后数据如下：</p>

<p v-pre><div>JSON</div></p>

```json
{
  "aftersales_id": "A001",
  "create_time": "2026-11-20 10:00:00",
  "finish_time": "2026-11-20 11:30:00",
  "status": "finished",
  "type": "logistics"
}
```

##### 1. ODS：原始数据层

<p v-pre>保存从业务系统同步过来的数据，尽量保留原始信息。</p>

<p v-pre>例如：</p>

<p v-pre><code>ods_aftersales_order</code></p>

<p v-pre>主要用途：数据追溯、重新清洗、问题排查。</p>

##### 2. DWD：明细数据层

<p v-pre>对原始数据进行清洗和标准化。</p>

<p v-pre>例如：</p>

<p v-pre><code>dwd_aftersales_order</code></p>

<table v-pre><tbody><tr><th><p>售后单</p></th><th><p>售后类型</p></th><th><p>状态</p></th><th><p>解决时长</p></th></tr><tr><td><p>A001</p></td><td><p>物流异常</p></td><td><p>已解决</p></td><td><p>90 分钟</p></td></tr></tbody></table>

<p v-pre>DWD 解决的问题是：<span><strong>每一条业务记录究竟代表什么？</strong></span></p>

##### 3. DWS：汇总数据层

<p v-pre>按照业务维度聚合明细。</p>

<p v-pre>例如：</p>

<p v-pre><code>dws_aftersales_type_1d</code></p>

<table v-pre><tbody><tr><th><p>日期</p></th><th><p>售后类型</p></th><th><p>已解决量</p></th><th><p>平均解决时长</p></th></tr><tr><td><p>11月20日</p></td><td><p>物流异常</p></td><td><p>100</p></td><td><p>90分钟</p></td></tr><tr><td><p>11月20日</p></td><td><p>商品质量</p></td><td><p>80</p></td><td><p>35分钟</p></td></tr></tbody></table>

<p v-pre>DWS 解决的问题是：<span><strong>如何快速分析某个业务维度？</strong></span></p>

##### 4. ADS：应用数据层

<p v-pre>直接为具体看板或业务应用提供数据。</p>

<p v-pre>例如：</p>

<p v-pre><code>ads_aftersales_overview_1d</code></p>

<table v-pre><tbody><tr><th><p>日期</p></th><th><p>售后量</p></th><th><p>平均解决时长</p></th><th><p>超时率</p></th></tr><tr><td><p>11月20日</p></td><td><p>850</p></td><td><p>58分钟</p></td><td><p>18%</p></td></tr></tbody></table>

<p v-pre>ADS 解决的问题是：<span><strong>前端页面需要展示哪些数据？</strong></span></p>

#### 三、实际开发一定要四层吗？

<p v-pre>不一定。</p>

<p v-pre>结合我们的学习项目，假设首期每天只有几万条售后记录，使用 MySQL 和定时任务即可满足初步分析需求。</p>

<p v-pre>我更建议采用简化架构：</p>

#### MVP 推荐架构

<p v-pre><span><strong>业务数据源</strong></span></p>

<p v-pre><span><strong>ODS 原始数据</strong></span></p>

<p v-pre><span><strong>DWD 标准化明细</strong></span></p>

<p v-pre><span><strong>ADS 指标汇总</strong></span></p>

<p v-pre><span><strong>FastAPI → React / ECharts</strong></span></p>

<p v-pre>首期暂不单独建设 DWS 层；需要按多维度复用大量聚合结果时再引入。</p>

<p v-pre>原因是：</p>

<ul v-pre><li><div><div><p>数据量尚不大。</p></div></div></li><li><div><div><p>项目需要快速完成 MVP。</p></div></div></li><li><div><div><p>减少数据表数量和维护成本。</p></div></div></li><li><div><div><p>先确保指标准确，再考虑复杂架构。</p></div></div></li></ul>

<p v-pre>但要注意：<span><strong>简化分层不代表可以省略数据质量、口径管理和历史追溯。</strong></span></p>

### 四、第三课实战问题 1：如何选择数据架构？

<p v-pre>现在你是这套售后数据分析系统的架构负责人。</p>

<p v-pre>项目条件如下：</p>

<table v-pre><tbody><tr><th><p>条件</p></th><th><p>情况</p></th></tr><tr><td><p>团队人数</p></td><td><p>2 人</p></td></tr><tr><td><p>每日新增售后订单</p></td><td><p>3 万条</p></td></tr><tr><td><p>历史数据</p></td><td><p>1 年</p></td></tr><tr><td><p>数据来源</p></td><td><p>3 个业务系统</p></td></tr><tr><td><p>更新要求</p></td><td><p>5 分钟</p></td></tr><tr><td><p>主要用途</p></td><td><p>KPI 看板、趋势分析、订单下钻</p></td></tr><tr><td><p>当前数据库</p></td><td><p>MySQL</p></td></tr><tr><td><p>项目目标</p></td><td><p>尽快上线 MVP</p></td></tr></tbody></table>

<p v-pre>你会选择哪种架构？</p>

<p v-pre><div><label>A. 直接从三个业务数据库查询，前端实时计算所有指标。</label></div><div><label>B. MySQL + ODS + DWD + ADS，定时增量同步和汇总。</label></div><div><label>C. 立即建设 Kafka + Flink + Spark + ClickHouse 的完整实时数仓。</label></div><div><label>D. 每天人工导出 Excel，使用 Python 计算并生成静态报表。</label></div></p>

<p v-pre><span><strong>请说明你的架构选择理由</strong></span></p>

```text
我选择使用 MySQL，目前数据体量并不大。
```

<p v-pre><span class="interaction"><span>提交答案，继续学习</span></span></p>

<p v-pre>下一步我们会进入数据建模中最重要的概念：<span><strong>数据粒度（Grain）</strong></span>。</p>

<p v-pre>例如，「一笔售后订单一行」和「一次售后处理事件一行」，看起来都是售后数据，但它们代表完全不同的业务事实。</p>

<p v-pre>如果粒度设计错误，后面的关联查询、指标统计和数据汇总都可能出现重复计算。</p>

## 第 17 轮　用 MySQL 搭建最小架构并定义数据粒度 {#turn-17}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第三课实战问题1，我选择：B。理由：我选择使用 MySQL，目前数据体量并不大。。请评价我的架构设计，并继续带我学习事实表、维度表、数据粒度和售后数据建模。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

<p v-pre><div>第三课实战问题 1：回答正确</div></p>

<p v-pre>你的选择是 <span><strong>B：MySQL + ODS + DWD + ADS，定时增量同步和汇总</strong></span>。</p>

<p v-pre>理由是：</p>

<blockquote v-pre><p>目前数据体量并不大，选择 MySQL。</p></blockquote>

<p v-pre>这个判断合理。你已经开始根据业务规模选择技术，而不是盲目追求复杂架构。</p>

<p v-pre>不过，我希望你进一步建立一种架构设计思维：</p>

<p v-pre><span><strong>选择技术架构，不仅要考虑数据量，还要考虑实时性、查询复杂度、团队规模和维护成本。</strong></span></p>

### 一、评价你的架构设计

<p v-pre>先看看项目规模：</p>

#### 售后数据分析系统 · 项目条件

<p v-pre>每日新增售后单</p>

### 3 万

<p v-pre>一年新增售后单</p>

### 约 1,095 万

<p v-pre>数据源</p>

### 3 个

<p v-pre>更新要求</p>

### 5 分钟

<p v-pre>一年约 1,095 万笔售后单，并不意味着 MySQL 一定没有问题。</p>

<p v-pre>真正需要关注的是：一笔售后单可能产生多条处理事件。</p>

<p v-pre>假设每笔售后单平均有 10 条事件，那么一年就会产生约 1.095 亿条事件记录。</p>

<p v-pre>因此，订单表和事件表的规模可能相差一个数量级。</p>

#### 为什么 B 更适合当前项目？

<table v-pre><tbody><tr><th><p>评价维度</p></th><th><p>B 方案表现</p></th></tr><tr><td><p>数据规模</p></td><td><p>MySQL 可以作为 MVP 起点</p></td></tr><tr><td><p>实时要求</p></td><td><p>5 分钟增量同步可以满足</p></td></tr><tr><td><p>开发成本</p></td><td><p>不需要复杂的大数据组件</p></td></tr><tr><td><p>运维成本</p></td><td><p>适合 2 人团队</p></td></tr><tr><td><p>数据质量</p></td><td><p>ODS、DWD 分层便于追溯</p></td></tr><tr><td><p>后续扩展</p></td><td><p>可以逐步引入专用分析数据库</p></td></tr></tbody></table>

<p v-pre>但有一个前提：需要通过真实数据量、索引设计、查询压力和性能测试验证 MySQL 是否满足要求。</p>

<p v-pre>所以，我给你的架构决策评价是：</p>

<p v-pre><span><strong>方案选择正确，理由还可以从「数据量不大」提升为「在满足性能与时效要求的前提下，选择总体成本最低的可维护架构」。</strong></span></p>

### 二、开始学习数据建模

<p v-pre>现在进入第三课的核心知识。</p>

<p v-pre>数据建模需要先回答三个问题：</p>

<ol v-pre><li><div><div><p>我们要记录哪些业务事实？</p></div></div></li><li><div><div><p>每条记录代表什么？</p></div></div></li><li><div><div><p>这些事实可以从哪些维度分析？</p></div></div></li></ol>

<p v-pre>分别对应：</p>

<ul v-pre><li><div><div><p>事实表（Fact Table）</p></div></div></li><li><div><div><p>数据粒度（Grain）</p></div></div></li><li><div><div><p>维度表（Dimension Table）</p></div></div></li></ul>

#### 1. 什么是事实表？

<p v-pre>事实表记录业务过程中实际发生的事件或状态。</p>

<p v-pre>例如，售后系统中有两类重要事实。</p>

<p v-pre><span><strong>售后订单事实</strong></span></p>

<p v-pre>一笔售后申请从创建到解决的业务过程</p>

<p v-pre><span><strong>售后处理事件事实</strong></span></p>

<p v-pre>客服回复、物流反馈、状态变更等具体事件</p>

<p v-pre>我们可以设计两张表。</p>

<p v-pre><span><strong>表 1：</strong><code>dwd_aftersales_order</code></span></p>

<table v-pre><tbody><tr><th><p>售后单 ID</p></th><th><p>创建时间</p></th><th><p>解决时间</p></th><th><p>状态</p></th></tr><tr><td><p>A001</p></td><td><p>10:00</p></td><td><p>11:30</p></td><td><p>已解决</p></td></tr><tr><td><p>A002</p></td><td><p>10:20</p></td><td><p>—</p></td><td><p>处理中</p></td></tr></tbody></table>

<p v-pre><span><strong>表 2：</strong><code>dwd_aftersales_event</code></span></p>

<table v-pre><tbody><tr><th><p>事件 ID</p></th><th><p>售后单 ID</p></th><th><p>事件类型</p></th><th><p>时间</p></th></tr><tr><td><p>E001</p></td><td><p>A001</p></td><td><p>创建售后</p></td><td><p>10:00</p></td></tr><tr><td><p>E002</p></td><td><p>A001</p></td><td><p>客服回复</p></td><td><p>10:10</p></td></tr><tr><td><p>E003</p></td><td><p>A001</p></td><td><p>联系物流</p></td><td><p>10:15</p></td></tr><tr><td><p>E004</p></td><td><p>A001</p></td><td><p>物流反馈</p></td><td><p>11:15</p></td></tr><tr><td><p>E005</p></td><td><p>A001</p></td><td><p>售后解决</p></td><td><p>11:30</p></td></tr></tbody></table>

<p v-pre>为什么要拆成两张表？</p>

<p v-pre>因为一笔售后订单可以有多条处理事件。</p>

<p v-pre>这是一对多关系。</p>

<p v-pre>一笔售后订单对应多条处理事件</p>

### 三、最重要的概念：数据粒度

<p v-pre>数据粒度指的是：</p>

<p v-pre><span><strong>数据表中的一行记录，究竟代表什么业务对象或业务事件。</strong></span></p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>表</p></th><th><p>数据粒度</p></th></tr><tr><td><p>售后订单事实表</p></td><td><p>一笔售后申请一行</p></td></tr><tr><td><p>售后事件事实表</p></td><td><p>一次处理事件一行</p></td></tr><tr><td><p>客服每日汇总表</p></td><td><p>一个客服每天一行</p></td></tr><tr><td><p>售后类型每日汇总表</p></td><td><p>一种售后类型每天一行</p></td></tr></tbody></table>

<p v-pre>为什么粒度这么重要？</p>

<p v-pre>因为粒度决定了数据如何关联，以及指标能不能正确计算。</p>

#### 一个常见的 SQL 错误

<p v-pre>假设订单表：</p>

<table v-pre><tbody><tr><th><p>售后单 ID</p></th><th><p>解决时长</p></th></tr><tr><td><p>A001</p></td><td><p>90 分钟</p></td></tr><tr><td><p>A002</p></td><td><p>30 分钟</p></td></tr></tbody></table>

<p v-pre>真实平均解决时长：</p>

<p v-pre><div><span><span><span>90+302=60 分钟\frac{90+30}{2}=60\text{ 分钟}</span></span></span></div></p>

<p v-pre>但是：</p>

<ul v-pre><li><div><div><p>A001 有 5 条处理事件。</p></div></div></li><li><div><div><p>A002 有 1 条处理事件。</p></div></div></li></ul>

<p v-pre>如果直接把订单表 JOIN 事件表，然后计算平均值：</p>

<p v-pre><div><span><span><span>90×5+30×16=80 分钟\frac{90\times5+30\times1}{6}=80\text{ 分钟}</span></span></span></div></p>

<p v-pre>正确平均值</p>

### 60 分钟

<p v-pre>错误 JOIN 后</p>

### 80 分钟

<p v-pre>为什么结果错误？</p>

<p v-pre>因为 JOIN 后，A001 被重复了 5 次。</p>

<p v-pre>这叫作 <span><strong>JOIN 扇出（Join Fanout）</strong></span>。</p>

<p v-pre>数据分析系统中，很多指标错误不是计算公式写错，而是数据粒度不一致导致的。</p>

##### 正确做法

<p v-pre>先在售后订单粒度计算指标，或者先把事件表聚合成每笔售后一行，再与订单表关联。</p>

<p v-pre>例如：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    AVG(TIMESTAMPDIFF(
        MINUTE,
        created_at,
        resolved_at
    )) AS avg_resolution_minutes
FROM dwd_aftersales_order
WHERE resolved_at IS NOT NULL;
```

<p v-pre>这段 SQL 是示意，正式实现还需要增加统计日期、有效订单、重新打开订单等过滤规则。</p>

### 四、什么是维度表？

<p v-pre>事实表记录发生了什么。</p>

<p v-pre>维度表描述是谁、在哪里、属于什么类型。</p>

<p v-pre>例如：</p>

#### 售后分析星型模型（概念图）

<p v-pre><span><code>dim_date</code><strong> 日期维度</strong></span></p>

<p v-pre>客服维度</p>

<p v-pre>dim_agent</p>

<p v-pre>售后事实表</p>

<p v-pre>dwd_aftersales_order</p>

<p v-pre>物流维度</p>

<p v-pre>dim_logistics</p>

<p v-pre><span><code>dim_issue_type</code><strong> 售后类型维度</strong></span></p>

<p v-pre>概念示意：实际关联通过维度键完成，日期和客服等维度可能需要区分创建时与解决时的角色。</p>

<p v-pre>通过维度表，我们可以分析：</p>

<ul v-pre><li><div><div><p>不同客服的解决时长。</p></div></div></li><li><div><div><p>不同地区的售后量。</p></div></div></li><li><div><div><p>不同物流公司的超时率。</p></div></div></li><li><div><div><p>不同问题类型的处理效率。</p></div></div></li></ul>

<p v-pre>需要注意，维度表自身也必须有明确粒度。例如，物流网点和物流公司不能在同一维度键下随意混用。</p>

### 五、第三课实战问题 2：识别 JOIN 导致的重复统计

<p v-pre>现在考察你是否真正理解数据粒度。</p>

<p v-pre>假设售后订单表有：</p>

<table v-pre><tbody><tr><th><p>售后单</p></th><th><p>解决时长</p></th></tr><tr><td><p>A001</p></td><td><p>100 分钟</p></td></tr><tr><td><p>A002</p></td><td><p>20 分钟</p></td></tr></tbody></table>

<p v-pre>处理事件表中：</p>

<ul v-pre><li><div><div><p>A001 有 4 条事件。</p></div></div></li><li><div><div><p>A002 有 2 条事件。</p></div></div></li></ul>

<p v-pre>开发人员写了以下 SQL：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT AVG(o.resolution_minutes)
FROM dwd_aftersales_order o
JOIN dwd_aftersales_event e
    ON o.aftersales_id = e.aftersales_id;
```

<p v-pre><span><strong>问题：这条 SQL 会得到什么结果？</strong></span></p>

<p v-pre><div><label>A. 60 分钟，因为只有两笔售后订单。</label></div><div><label>B. 约 73.33 分钟，因为 JOIN 后订单被重复。</label></div><div><label>C. 120 分钟，因为两笔订单时长相加。</label></div><div><label>D. SQL 会直接报错，因为两张表粒度不同。</label></div></p>

<p v-pre><span><strong>请说明你的计算过程或判断理由</strong></span></p>

```text
笛卡尔积
```

<p v-pre><span class="interaction"><span>提交答案，继续建模</span></span></p>

<p v-pre>这道题之后，我们将开始真正设计 <code>dwd_aftersales_order</code> 的字段、主键、粒度与关联关系，并逐步写出可以在 MySQL 中执行的建表 SQL。</p>

<p v-pre><span><strong>本节最重要的一句话：先确定数据粒度，再设计字段和 JOIN，最后才编写指标 SQL。</strong></span></p>

## 第 18 轮　识别 JOIN 扇出，设计订单和事件事实表 {#turn-18}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第三课实战问题2，我选择：B。理由：笛卡尔积。请评价我的 JOIN 粒度理解，并继续指导我设计售后订单事实表、事件事实表和维度表。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

<p v-pre></p>

<p v-pre><div>回答正确</div> <div>已掌握 JOIN 粒度问题</div></p>

<p v-pre>你的选择 B 正确，但你的理由「笛卡尔积」需要稍微修正。</p>

<p v-pre>你已经意识到 JOIN 会造成数据重复，这是正确的。不过，这道题严格来说不是笛卡尔积，而是 <span><strong>一对多关联导致的 JOIN 扇出（Join Fanout）</strong></span>。</p>

<p v-pre>下面我们通过计算把它彻底弄清楚。</p>

### 一、评价你的 JOIN 粒度理解

<p v-pre>原始数据：</p>

<p v-pre><span><strong>售后订单表</strong></span></p>

<table v-pre><tbody><tr><th><p>售后单</p></th><th><p>解决时长</p></th></tr><tr><td><p>A001</p></td><td><p>100 分钟</p></td></tr><tr><td><p>A002</p></td><td><p>20 分钟</p></td></tr></tbody></table>

<p v-pre><span><strong>处理事件表</strong></span></p>

<table v-pre><tbody><tr><th><p>售后单</p></th><th><p>事件</p></th></tr><tr><td><p>A001</p></td><td><p>创建</p></td></tr><tr><td><p>A001</p></td><td><p>客服回复</p></td></tr><tr><td><p>A001</p></td><td><p>联系物流</p></td></tr><tr><td><p>A001</p></td><td><p>物流反馈</p></td></tr><tr><td><p>A002</p></td><td><p>创建</p></td></tr><tr><td><p>A002</p></td><td><p>客服回复</p></td></tr></tbody></table>

<p v-pre>两张表 JOIN 后：</p>

<table v-pre><tbody><tr><th><p>售后单</p></th><th><p>解决时长</p></th><th><p>事件</p></th></tr><tr><td><p>A001</p></td><td><p>100</p></td><td><p>创建</p></td></tr><tr><td><p>A001</p></td><td><p>100</p></td><td><p>客服回复</p></td></tr><tr><td><p>A001</p></td><td><p>100</p></td><td><p>联系物流</p></td></tr><tr><td><p>A001</p></td><td><p>100</p></td><td><p>物流反馈</p></td></tr><tr><td><p>A002</p></td><td><p>20</p></td><td><p>创建</p></td></tr><tr><td><p>A002</p></td><td><p>20</p></td><td><p>客服回复</p></td></tr></tbody></table>

<p v-pre>可以看到：</p>

<ul v-pre><li><div><div><p>A001 被复制了 4 次。</p></div></div></li><li><div><div><p>A002 被复制了 2 次。</p></div></div></li><li><div><div><p>原本 2 笔订单，JOIN 后变成 6 行。</p></div></div></li></ul>

<p v-pre>计算：</p>

<p v-pre><div><span><span><span>AVG=100×4+20×26AVG=\frac{100\times4+20\times2}{6}</span></span></span></div><div><span><span><span>AVG=73.33 分钟AVG=73.33\text{ 分钟}</span></span></span></div></p>

<p v-pre><span><strong>结果对比</strong></span></p>

<p v-pre>正确平均值</p>

### 60 分钟

<p v-pre>错误 JOIN 结果</p>

### 73.33 分钟

#### 笛卡尔积和 JOIN 扇出有什么区别？

<table v-pre><tbody><tr><th><p>概念</p></th><th><p>含义</p></th></tr><tr><td><p>笛卡尔积</p></td><td><p>两张表所有行两两组合</p></td></tr><tr><td><p>一对多 JOIN</p></td><td><p>一条订单匹配多条事件</p></td></tr><tr><td><p>JOIN 扇出</p></td><td><p>JOIN 后订单记录被重复展开</p></td></tr><tr><td><p>重复统计</p></td><td><p>将展开后的重复记录错误地用于聚合</p></td></tr></tbody></table>

<p v-pre>如果 JOIN 没有任何关联条件，可能产生完整笛卡尔积。</p>

<p v-pre>但本题是有条件的 <code>1:N JOIN</code>，所以准确说法是 JOIN 扇出。</p>

<p v-pre><span><strong>记住：JOIN 本身没有错，粒度不匹配却没有处理好，才会造成统计错误。</strong></span></p>

### 二、开始设计售后订单事实表

<p v-pre>现在进入真正的数据建模工作。</p>

<p v-pre>先回忆我们的业务需求：</p>

<p v-pre>售后主管需要分析：</p>

<ul v-pre><li><div><div><p>售后订单量</p></div></div></li><li><div><div><p>平均解决时长</p></div></div></li><li><div><div><p>超时率</p></div></div></li><li><div><div><p>不同售后类型的处理效率</p></div></div></li><li><div><div><p>不同客服的处理表现</p></div></div></li><li><div><div><p>不同物流公司的异常情况</p></div></div></li></ul>

<p v-pre>所以我们需要一张核心事实表：</p>

<p v-pre><code>dwd_aftersales_order</code></p>

#### 1. 先确定数据粒度

<p v-pre>这张表的粒度是：</p>

<p v-pre><div>核心设计决定</div></p>

<p v-pre><span><strong>一笔售后申请一行。</strong></span></p>

<p v-pre>同一笔售后申请即使发生多次状态变化、客服转交或重新打开，也不能在这张表中产生多条重复记录。</p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>aftersales_id</p></th><th><p>order_id</p></th><th><p>status</p></th></tr><tr><td><p>A001</p></td><td><p>O001</p></td><td><p>已解决</p></td></tr><tr><td><p>A002</p></td><td><p>O002</p></td><td><p>处理中</p></td></tr><tr><td><p>A003</p></td><td><p>O003</p></td><td><p>已取消</p></td></tr></tbody></table>

<p v-pre>每一行代表一个售后申请，而不是原始销售订单。</p>

<p v-pre>注意：一笔原始订单可能产生多笔售后申请，所以 <code>order_id</code> 不一定唯一。</p>

#### 2. 设计字段

<p v-pre>我建议将字段分为六组。</p>

<table v-pre><tbody><tr><th><p>字段分类</p></th><th><p>字段</p></th><th><p>说明</p></th></tr><tr><td><p>主键</p></td><td><p><code>aftersales_id</code></p></td><td><p>售后单唯一标识</p></td></tr><tr><td><p>关联</p></td><td><p><code>order_id</code></p></td><td><p>原始订单 ID</p></td></tr><tr><td><p>维度</p></td><td><p><code>issue_type_id</code></p></td><td><p>售后问题类型</p></td></tr><tr><td><p>维度</p></td><td><p><code>agent_id</code></p></td><td><p>当前负责客服</p></td></tr><tr><td><p>维度</p></td><td><p><code>logistics_id</code></p></td><td><p>关联物流公司</p></td></tr><tr><td><p>时间</p></td><td><p><code>created_at</code></p></td><td><p>售后创建时间</p></td></tr><tr><td><p>时间</p></td><td><p><code>first_response_at</code></p></td><td><p>首次响应时间</p></td></tr><tr><td><p>时间</p></td><td><p><code>resolved_at</code></p></td><td><p>最终解决时间</p></td></tr><tr><td><p>SLA</p></td><td><p><code>sla_rule_id</code></p></td><td><p>适用 SLA 规则</p></td></tr><tr><td><p>SLA</p></td><td><p><code>sla_deadline</code></p></td><td><p>SLA 截止时间</p></td></tr><tr><td><p>SLA</p></td><td><p><code>sla_breached</code></p></td><td><p>是否超时</p></td></tr><tr><td><p>状态</p></td><td><p><code>status</code></p></td><td><p>当前业务状态</p></td></tr><tr><td><p>审计</p></td><td><p><code>updated_at</code></p></td><td><p>最后更新时间</p></td></tr></tbody></table>

<p v-pre>这里特别强调两个设计细节：</p>

<p v-pre><span><strong>第一，当前客服和历史处理客服不是一回事。</strong></span></p>

<p v-pre><code>agent_id</code> 只表示当前负责人。历史上谁处理过，需要从事件表中查询。</p>

<p v-pre><span><strong>第二，解决时间与超时时间也不是一回事。</strong></span></p>

<p v-pre><code>resolved_at</code> 表示业务解决时间，<code>sla_deadline</code> 表示规定的截止时间。</p>

### 三、使用 MySQL 创建售后订单事实表

<p v-pre>下面是一版可以执行的建表 SQL。</p>

<p v-pre><div>SQL</div></p>

```sql

CREATE TABLE dwd_aftersales_order (
    aftersales_id BIGINT NOT NULL COMMENT '售后单ID',
    order_id BIGINT NOT NULL COMMENT '原始订单ID',

    issue_type_id BIGINT NOT NULL COMMENT '售后类型ID',
    agent_id BIGINT DEFAULT NULL COMMENT '当前负责客服ID',
    logistics_id BIGINT DEFAULT NULL COMMENT '物流公司ID',

    status VARCHAR(32) NOT NULL COMMENT '售后状态',

    created_at DATETIME NOT NULL COMMENT '售后创建时间',
    first_response_at DATETIME DEFAULT NULL COMMENT '首次响应时间',
    resolved_at DATETIME DEFAULT NULL COMMENT '最终解决时间',

    sla_rule_id BIGINT DEFAULT NULL COMMENT 'SLA规则ID',
    sla_minutes INT DEFAULT NULL COMMENT '创建时适用的SLA分钟数',
    sla_deadline DATETIME DEFAULT NULL COMMENT 'SLA截止时间',
    sla_breached TINYINT DEFAULT 0 COMMENT '是否超时：0否1是',
    sla_breached_at DATETIME DEFAULT NULL COMMENT '首次超时时间',

    created_date DATE NOT NULL COMMENT '售后创建日期',
    resolved_date DATE DEFAULT NULL COMMENT '售后解决日期',

    created_at_source DATETIME DEFAULT NULL COMMENT '源系统创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP COMMENT '数据更新时间',

    PRIMARY KEY (aftersales_id),

    KEY idx_created_date (created_date),
    KEY idx_resolved_date (resolved_date),
    KEY idx_status_created (status, created_at),
    KEY idx_agent_resolved (agent_id, resolved_date),
    KEY idx_issue_created (issue_type_id, created_date)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COMMENT='售后订单明细事实表';

```

<p v-pre>这里有两个地方需要注意：</p>

<ol v-pre><li><div><div><p><code>created_at</code> 是业务创建时间；<code>updated_at</code> 是分析库中该记录最后更新时间，两者不能混淆。</p></div></div></li><li><div><div><p><code>sla_breached</code> 是当前累计状态，不是完整的历史记录。历史 SLA 状态变化仍然需要事件表记录。</p></div></div></li></ol>

<p v-pre>另外，生产环境还需要确认源系统主键类型、时区、字段长度及数据同步策略。</p>

### 四、设计售后处理事件事实表

<p v-pre>这张表是我们整个系统中非常重要的一张表。</p>

<p v-pre>因为我们不仅要知道售后订单最终是否解决，还要知道：</p>

<p v-pre><span><strong>解决过程中到底发生了什么？</strong></span></p>

#### 1. 确定数据粒度

<p v-pre><div>核心设计决定</div></p>

<p v-pre><span><strong>一次售后业务事件一行。</strong></span></p>

<p v-pre>一次客服回复、一笔物流反馈、一次状态变化，都可以形成一条事件记录。</p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>event_id</p></th><th><p>aftersales_id</p></th><th><p>event_type</p></th><th><p>event_time</p></th></tr><tr><td><p>E001</p></td><td><p>A001</p></td><td><p>CREATED</p></td><td><p>10:00</p></td></tr><tr><td><p>E002</p></td><td><p>A001</p></td><td><p>AGENT_REPLY</p></td><td><p>10:10</p></td></tr><tr><td><p>E003</p></td><td><p>A001</p></td><td><p>WAIT_LOGISTICS</p></td><td><p>10:15</p></td></tr><tr><td><p>E004</p></td><td><p>A001</p></td><td><p>LOGISTICS_REPLY</p></td><td><p>11:15</p></td></tr><tr><td><p>E005</p></td><td><p>A001</p></td><td><p>RESOLVED</p></td><td><p>11:30</p></td></tr></tbody></table>

#### 2. 字段设计

<table v-pre><tbody><tr><th><p>字段</p></th><th><p>含义</p></th></tr><tr><td><p><code>event_id</code></p></td><td><p>事件唯一 ID</p></td></tr><tr><td><p><code>aftersales_id</code></p></td><td><p>售后单 ID</p></td></tr><tr><td><p><code>event_type</code></p></td><td><p>事件类型</p></td></tr><tr><td><p><code>operator_id</code></p></td><td><p>操作人 ID</p></td></tr><tr><td><p><code>operator_type</code></p></td><td><p>操作人类型</p></td></tr><tr><td><p><code>event_time</code></p></td><td><p>事件发生时间</p></td></tr><tr><td><p><code>event_content</code></p></td><td><p>事件说明</p></td></tr><tr><td><p><code>source_event_id</code></p></td><td><p>来源系统事件 ID</p></td></tr><tr><td><p><code>created_at</code></p></td><td><p>数据入库时间</p></td></tr></tbody></table>

<p v-pre>这里还有一个非常重要的技术问题：</p>

<p v-pre><span><strong>数据同步必须保证事件幂等。</strong></span></p>

<p v-pre>例如，源系统某个物流反馈事件被重复同步三次，不能在分析库中变成三条重复事件。</p>

<p v-pre>因此建议：</p>

<ul v-pre><li><div><div><p>使用分析库自己的 <code>event_id</code> 作为主键。</p></div></div></li><li><div><div><p>使用 <code>source_event_id</code> 标识源系统事件。</p></div></div></li><li><div><div><p>对来源系统和来源事件 ID 建立唯一约束。</p></div></div></li><li><div><div><p>重复同步时采用幂等写入。</p></div></div></li></ul>

#### 3. 建表 SQL

<p v-pre><div>SQL</div></p>

```sql

CREATE TABLE dwd_aftersales_event (
    event_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '分析库事件ID',
    aftersales_id BIGINT NOT NULL COMMENT '售后单ID',

    source_system VARCHAR(32) NOT NULL COMMENT '来源系统',
    source_event_id VARCHAR(128) NOT NULL COMMENT '来源事件ID',

    event_type VARCHAR(64) NOT NULL COMMENT '事件类型',
    operator_id BIGINT DEFAULT NULL COMMENT '操作人ID',
    operator_type VARCHAR(32) DEFAULT NULL COMMENT '操作人类型',

    event_time DATETIME NOT NULL COMMENT '事件发生时间',
    event_content VARCHAR(1000) DEFAULT NULL COMMENT '事件说明',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        COMMENT '入库时间',

    PRIMARY KEY (event_id),

    UNIQUE KEY uk_source_event (
        source_system,
        source_event_id
    ),

    KEY idx_aftersales_time (
        aftersales_id,
        event_time
    ),

    KEY idx_event_type_time (
        event_type,
        event_time
    )
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COMMENT='售后处理事件事实表';

```

<p v-pre>实际开发时，<code>event_content</code> 还需要结合敏感信息保护策略，避免直接保存不必要的客户隐私内容。</p>

### 五、设计维度表

<p v-pre>现在我们的事实表已经有了。</p>

<p v-pre>接下来设计四张维度表。</p>

<p v-pre><span><strong>1. </strong><code>dim_agent</code><strong>：客服维度表</strong></span></p>

<table v-pre><tbody><tr><th><p>字段</p></th><th><p>含义</p></th></tr><tr><td><p>agent_id</p></td><td><p>客服 ID</p></td></tr><tr><td><p>agent_name</p></td><td><p>客服姓名</p></td></tr><tr><td><p>team_id</p></td><td><p>所属团队</p></td></tr><tr><td><p>team_name</p></td><td><p>团队名称</p></td></tr><tr><td><p>is_active</p></td><td><p>是否在职</p></td></tr></tbody></table>

<p v-pre><span><strong>2. </strong><code>dim_issue_type</code><strong>：售后类型维度表</strong></span></p>

<table v-pre><tbody><tr><th><p>字段</p></th><th><p>含义</p></th></tr><tr><td><p>issue_type_id</p></td><td><p>类型 ID</p></td></tr><tr><td><p>issue_type_code</p></td><td><p>类型编码</p></td></tr><tr><td><p>issue_type_name</p></td><td><p>类型名称</p></td></tr><tr><td><p>category</p></td><td><p>问题大类</p></td></tr></tbody></table>

<p v-pre><span><strong>3. </strong><code>dim_logistics</code><strong>：物流维度表</strong></span></p>

<table v-pre><tbody><tr><th><p>字段</p></th><th><p>含义</p></th></tr><tr><td><p>logistics_id</p></td><td><p>物流 ID</p></td></tr><tr><td><p>logistics_name</p></td><td><p>物流公司</p></td></tr><tr><td><p>region_id</p></td><td><p>区域 ID</p></td></tr><tr><td><p>region_name</p></td><td><p>区域名称</p></td></tr><tr><td><p>station_name</p></td><td><p>网点名称</p></td></tr></tbody></table>

<p v-pre><span><strong>4. </strong><code>dim_date</code><strong>：日期维度表</strong></span></p>

<table v-pre><tbody><tr><th><p>字段</p></th><th><p>含义</p></th></tr><tr><td><p>date_key</p></td><td><p>日期键</p></td></tr><tr><td><p>calendar_date</p></td><td><p>自然日期</p></td></tr><tr><td><p>year</p></td><td><p>年</p></td></tr><tr><td><p>month</p></td><td><p>月</p></td></tr><tr><td><p>week</p></td><td><p>周</p></td></tr><tr><td><p>day_of_week</p></td><td><p>星期</p></td></tr></tbody></table>

<p v-pre>注意，当前客服所属团队可能变化。如果我们要准确还原历史客服绩效，就不能只保留当前团队信息。</p>

<p v-pre>后续可以采用维度历史版本管理（例如 SCD Type 2），保存客服所属团队的生效时间和失效时间。</p>

### 六、售后系统的整体数据模型

<p v-pre>现在把刚才设计的表连接起来。</p>

#### 售后数据模型 ER 关系图

<p v-pre><span><code>dwd_aftersales_order</code></span></p>

<p v-pre>主表：一笔售后申请一行</p>

<p v-pre><span><code>dwd_aftersales_event</code></span></p>

<p v-pre>1:N 处理事件</p>

<p v-pre><span><code>dim_agent</code></span></p>

<p v-pre>N:1 客服</p>

<p v-pre><span><code>dim_issue_type</code></span></p>

<p v-pre>N:1 售后类型</p>

<p v-pre><span><code>dim_logistics</code></span></p>

<p v-pre>N:1 物流公司</p>

<p v-pre>这里有一个实际建模细节：</p>

<p v-pre>日期维度不是只有一条关系。订单创建日期、首次响应日期、解决日期可能对应同一个日期维度的不同角色。</p>

<p v-pre>而且事件表可以直接通过 <code>aftersales_id</code> 与订单表关联，不应该把客服、物流等维度信息错误地复制到每一条事件记录中。</p>

### 七、实战问题 3：确定客服维度的历史数据策略

<p v-pre>现在我们来做一个真正的架构设计决策。</p>

<p v-pre>假设：</p>

<p v-pre>客服小王在 11 月属于 A 团队，12 月调到了 B 团队。</p>

<p v-pre>售后主管现在想查看：</p>

<blockquote v-pre><p>11 月 A 团队的售后解决效率。</p></blockquote>

<p v-pre>你认为系统应该如何处理客服团队信息？</p>

<p v-pre><div><label>A. 只保留客服当前团队，历史订单查询时统一使用当前团队。</label></div><div><label>B. 在售后订单中保存客服当时的团队 ID。</label></div><div><label>C. 建立客服维度历史版本，记录团队生效时间和失效时间，查询时匹配业务发生时间。</label></div><div><label>D. 不需要保存团队信息，只按客服姓名统计。</label></div></p>

<p v-pre><span><strong>说明你的理由</strong></span></p>

```text
团队维度数据，只能包含团队对应数据

```

<p v-pre><span class="interaction"><span>提交答案，继续学习</span></span></p>

<p v-pre><span><strong>本节课你要牢牢记住三个概念：</strong></span></p>

<ol v-pre><li><div><div><p>事实表记录业务事实。</p></div></div></li><li><div><div><p>维度表描述分析对象。</p></div></div></li><li><div><div><p>数据粒度决定每一行代表什么。</p></div></div></li></ol>

<p v-pre>尤其是第三点：在正式创建数据库之前，先把每张表的数据粒度写清楚。</p>

<p v-pre>下一步我们将继续设计维度历史版本、ER 关系、完整建表 SQL，并实际演练如何通过这些表计算售后解决时长、超时率和客服绩效。</p>

## 第 19 轮　SCD2、ER 图与建表 SQL {#turn-19}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第三课实战问题3，我选择：C。理由：团队维度数据，只能包含团队对应数据 。请评价我的维度历史管理设计，并继续指导我完成 ER 图、完整建表 SQL 和售后数据建模。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第三课：售后数据建模实战——SCD2、ER 图与 MySQL 建表

<p v-pre></p>

<p v-pre><div>第3题回答正确</div> <div>进入数据库设计实战</div></p>

<p v-pre>你选择 C：</p>

<blockquote v-pre><p>建立客服维度历史版本，记录团队生效时间和失效时间，查询时匹配业务发生时间。</p></blockquote>

<p v-pre>这个选择是正确的。</p>

<p v-pre>不过，你的理由：</p>

<blockquote v-pre><p>团队维度数据，只能包含团队对应数据。</p></blockquote>

<p v-pre>还可以进一步完善。</p>

<p v-pre>真正的设计原因是：</p>

<p v-pre><span><strong>客服的组织归属会发生变化，历史业务数据应该按照业务发生时的组织归属进行统计，而不是按照客服当前所属团队统计。</strong></span></p>

<p v-pre>这涉及一个数据仓库的重要知识：SCD Type 2（缓慢变化维度第二型）。</p>

### 一、评价你的维度历史管理设计

<p v-pre>假设有一个客服小王：</p>

<table v-pre><tbody><tr><th><p>时间</p></th><th><p>所属团队</p></th></tr><tr><td><p>11月1日</p></td><td><p>A团队</p></td></tr><tr><td><p>12月1日</p></td><td><p>B团队</p></td></tr></tbody></table>

<p v-pre>现在查看 11 月售后数据。</p>

<p v-pre>如果只保留当前团队：</p>

<table v-pre><tbody><tr><th><p>客服</p></th><th><p>当前团队</p></th></tr><tr><td><p>小王</p></td><td><p>B团队</p></td></tr></tbody></table>

<p v-pre>那么 11 月 A 团队的历史业绩就可能被错误归到 B 团队。</p>

<p v-pre>这就是历史维度数据丢失的问题。</p>

#### 1. 正确的设计：SCD Type 2

<p v-pre>我们不覆盖旧记录，而是新增一条版本记录。</p>

<p v-pre><span><strong>客服维度历史记录 </strong><code>dim_agent</code></span></p>

<table v-pre><tbody><tr><td><p><span><strong>agent</strong><strong>_</strong><strong>sk</strong></span></p></td><td><p><span><strong>agent</strong><strong>_</strong><strong>id</strong></span></p></td><td><p><span><strong>team</strong></span></p></td><td><p><span><strong>有效期</strong></span></p></td></tr><tr><td>101</td><td>1001</td><td>A团队</td><td><p>11月1日～11月30日</p></td></tr><tr><td>102</td><td>1001</td><td>B团队</td><td><p>12月1日起</p></td></tr></tbody></table>

<p v-pre>示例：agent_id 是客服业务 ID，agent_sk 是数据仓库内部版本 ID。</p>

<p v-pre>两个字段要特别注意：</p>

<ul v-pre><li><div><div><p><code>agent_id</code>：客服在业务系统中的固定身份。</p></div></div></li><li><div><div><p><code>agent_sk</code>：客服某个历史版本的唯一标识。</p></div></div></li></ul>

<p v-pre>当客服调岗时：</p>

<ol v-pre><li><div><div><p>旧版本设置失效时间。</p></div></div></li><li><div><div><p>新增一条团队为 B 的记录。</p></div></div></li><li><div><div><p>新版本设置新的生效时间。</p></div></div></li><li><div><div><p>历史数据仍然关联旧版本。</p></div></div></li></ol>

#### 2. 如何查询历史团队？

<p v-pre>例如查看 11 月 20 日的客服归属：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    agent_id,
    agent_name,
    team_id
FROM dim_agent
WHERE agent_id = 1001
  AND effective_start <= '2026-11-20 23:59:59'
  AND effective_end > '2026-11-20 23:59:59';
```

<p v-pre>如果采用左闭右开的有效期：</p>

<ul v-pre><li><div><div><p>11 月版本：<code>[11月1日, 12月1日)</code></p></div></div></li><li><div><div><p>12 月版本：<code>[12月1日, 无穷大)</code></p></div></div></li></ul>

<p v-pre>那么 12 月 1 日的业务就会正确归入 B 团队。</p>

<p v-pre><span><strong>这就是 SCD Type 2 的核心价值：保留历史，而不是覆盖历史。</strong></span></p>

<p v-pre>另外，客服调岗和售后订单转交是两件不同的事。客服维度记录组织归属，售后事件表记录具体由谁在什么时候处理订单。两者不能混为一谈。</p>

### 二、正式设计售后系统 ER 图

<p v-pre>现在开始把业务对象和表之间的关系连接起来。</p>

<p v-pre>我们先确定核心实体：</p>

<table v-pre><tbody><tr><th><p>实体</p></th><th><p>作用</p></th><th><p>粒度</p></th></tr><tr><td><p>售后订单</p></td><td><p>记录售后申请</p></td><td><p>一笔售后一行</p></td></tr><tr><td><p>售后事件</p></td><td><p>记录处理过程</p></td><td><p>一次事件一行</p></td></tr><tr><td><p>客服维度</p></td><td><p>记录客服及历史组织归属</p></td><td><p>一个客服版本一行</p></td></tr><tr><td><p>团队维度</p></td><td><p>记录客服团队</p></td><td><p>一个团队一行</p></td></tr><tr><td><p>售后类型维度</p></td><td><p>记录售后问题分类</p></td><td><p>一种类型一行</p></td></tr><tr><td><p>物流维度</p></td><td><p>记录物流公司</p></td><td><p>一个物流对象一行</p></td></tr><tr><td><p>SLA 规则</p></td><td><p>记录时效标准</p></td><td><p>一条规则版本一行</p></td></tr><tr><td><p>投诉事实</p></td><td><p>记录客户投诉</p></td><td><p>一次投诉一行</p></td></tr></tbody></table>

#### 1. ER 关系图

<p v-pre><div><span class="visual-label">Mermaid 图表</span></div></p>

<p v-pre>注意：这是一张逻辑 ER 图。实际数据库中，我们还需要根据数据同步方式、历史归属规则和查询性能决定哪些关联使用物理外键，哪些只保留逻辑关联。</p>

#### 2. 关系解释

#### 核心表关系

<ol v-pre><li><div><div><p><span><strong>一笔售后 → 多条处理事件</strong></span></p><p><code>dwd_aftersales_order</code> 1:N <code>dwd_aftersales_event</code></p></div></div></li><li><div><div><p><span><strong>一个客服历史版本 → 多笔售后</strong></span></p><p><code>dim_agent</code> 1:N <code>dwd_aftersales_order</code></p></div></div></li><li><div><div><p><span><strong>一个售后类型 → 多笔售后</strong></span></p><p><code>dim_issue_type</code> 1:N <code>dwd_aftersales_order</code></p></div></div></li><li><div><div><p><span><strong>一条 SLA 规则 → 多笔售后</strong></span></p><p><code>dim_sla_rule</code> 1:N <code>dwd_aftersales_order</code></p></div></div></li><li><div><div><p><span><strong>一笔售后 → 多次投诉</strong></span></p><p><code>dwd_aftersales_order</code> 1:N <code>fact_complaint</code></p></div></div></li></ol>

<p v-pre>这里我们还做了一个重要决定：</p>

<p v-pre>售后订单中的 <code>agent_sk</code> 代表当前负责人或指定的解决责任人，事件表中的 <code>agent_sk</code> 代表实际执行这次事件的客服。</p>

<p v-pre>这两个字段不能互相替代。</p>

### 三、完整 MySQL 建表 SQL

<p v-pre>下面正式把 ER 图转换为数据库结构。</p>

<p v-pre>我们采用 MySQL 8.0，统一使用 InnoDB 和 utf8mb4。</p>

<p v-pre>为了方便后续开发，先建立八张核心表。</p>

#### 1. 团队维度表

<p v-pre><code>dim_team</code></p>

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE dim_team (
    team_id BIGINT NOT NULL COMMENT '团队业务ID',
    team_name VARCHAR(100) NOT NULL COMMENT '团队名称',
    is_active TINYINT NOT NULL DEFAULT 1 COMMENT '是否有效',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='客服团队维度表';
```

#### 2. 客服历史维度表

<p v-pre><code>dim_agent</code></p>

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE dim_agent (
    agent_sk BIGINT NOT NULL AUTO_INCREMENT COMMENT '客服历史版本代理键',
    agent_id BIGINT NOT NULL COMMENT '客服业务ID',
    agent_name VARCHAR(100) NOT NULL COMMENT '客服姓名',
    team_id BIGINT NOT NULL COMMENT '所属团队ID',

    effective_start DATETIME NOT NULL COMMENT '生效时间',
    effective_end DATETIME NOT NULL COMMENT '失效时间',
    is_current TINYINT NOT NULL DEFAULT 1 COMMENT '是否当前版本',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (agent_sk),

    UNIQUE KEY uk_agent_version (agent_id, effective_start),
    KEY idx_agent_effective (
        agent_id,
        effective_start,
        effective_end
    ),
    KEY idx_team (team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='客服历史维度表-SCD2';
```

<p v-pre>注意：</p>

<ul v-pre><li><div><div><p>一个 <code>agent_id</code> 可以有多条历史版本。</p></div></div></li><li><div><div><p>一个 <code>agent_sk</code> 只能对应一个历史版本。</p></div></div></li><li><div><div><p>同一个客服同一时刻只能有一个有效版本，这是需要在数据同步程序中保证的业务约束。</p></div></div></li></ul>

#### 3. 售后类型维度表

<p v-pre><code>dim_issue_type</code></p>

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE dim_issue_type (
    issue_type_id BIGINT NOT NULL COMMENT '售后类型ID',
    issue_type_code VARCHAR(50) NOT NULL COMMENT '类型编码',
    issue_type_name VARCHAR(100) NOT NULL COMMENT '类型名称',
    category VARCHAR(100) DEFAULT NULL COMMENT '问题大类',
    is_active TINYINT NOT NULL DEFAULT 1,
    PRIMARY KEY (issue_type_id),
    UNIQUE KEY uk_issue_code (issue_type_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='售后问题类型维度表';
```

#### 4. 物流维度表

<p v-pre><code>dim_logistics</code></p>

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE dim_logistics (
    logistics_id BIGINT NOT NULL COMMENT '物流维度ID',
    logistics_name VARCHAR(100) NOT NULL COMMENT '物流公司',
    region_id BIGINT DEFAULT NULL COMMENT '区域ID',
    region_name VARCHAR(100) DEFAULT NULL COMMENT '区域名称',
    station_name VARCHAR(100) DEFAULT NULL COMMENT '物流网点',
    is_active TINYINT NOT NULL DEFAULT 1,
    PRIMARY KEY (logistics_id),
    KEY idx_region (region_id),
    KEY idx_logistics_name (logistics_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='物流维度表';
```

#### 5. SLA 规则表

<p v-pre><code>dim_aftersales_sla_rule</code></p>

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE dim_aftersales_sla_rule (
    sla_rule_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '规则版本ID',
    issue_type_id BIGINT NOT NULL COMMENT '售后类型ID',
    sla_minutes INT NOT NULL COMMENT 'SLA时限分钟',

    effective_start DATETIME NOT NULL COMMENT '规则生效时间',
    effective_end DATETIME NOT NULL COMMENT '规则失效时间',
    is_active TINYINT NOT NULL DEFAULT 1 COMMENT '是否启用',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (sla_rule_id),

    KEY idx_sla_issue_effective (
        issue_type_id,
        effective_start,
        effective_end
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='售后SLA规则历史表';
```

<p v-pre>这张表同样保留历史版本，避免修改 SLA 后影响历史订单。</p>

#### 6. 售后订单事实表

<p v-pre><code>dwd_aftersales_order</code></p>

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE dwd_aftersales_order (
    aftersales_id VARCHAR(64) NOT NULL COMMENT '售后单ID',
    order_id VARCHAR(64) NOT NULL COMMENT '原始订单ID',

    issue_type_id BIGINT NOT NULL COMMENT '售后类型ID',
    logistics_id BIGINT DEFAULT NULL COMMENT '物流公司ID',

    current_agent_sk BIGINT DEFAULT NULL COMMENT '当前负责人版本ID',
    resolution_agent_sk BIGINT DEFAULT NULL COMMENT '解决责任客服版本ID',

    status VARCHAR(32) NOT NULL COMMENT '售后业务状态',

    created_at DATETIME NOT NULL COMMENT '售后创建时间',
    first_response_at DATETIME DEFAULT NULL COMMENT '首次响应时间',
    resolved_at DATETIME DEFAULT NULL COMMENT '最终解决时间',

    sla_rule_id BIGINT DEFAULT NULL COMMENT '适用SLA规则版本',
    sla_minutes INT DEFAULT NULL COMMENT 'SLA时限快照',
    sla_deadline DATETIME DEFAULT NULL COMMENT 'SLA截止时间',
    sla_breached TINYINT NOT NULL DEFAULT 0 COMMENT '是否已超时',
    sla_breached_at DATETIME DEFAULT NULL COMMENT '首次超时时间',

    source_updated_at DATETIME DEFAULT NULL COMMENT '源系统更新时间',
    created_at_dw DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '数仓入库时间',
    updated_at_dw DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP COMMENT '数仓更新时间',

    PRIMARY KEY (aftersales_id),

    KEY idx_created_at (created_at),
    KEY idx_resolved_at (resolved_at),
    KEY idx_status_created (status, created_at),
    KEY idx_issue_created (issue_type_id, created_at),
    KEY idx_agent_resolved (resolution_agent_sk, resolved_at),
    KEY idx_logistics_created (logistics_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='售后订单明细事实表';
```

#### 7. 售后处理事件事实表

<p v-pre><code>dwd_aftersales_event</code></p>

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE dwd_aftersales_event (
    event_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '数仓事件ID',
    aftersales_id VARCHAR(64) NOT NULL COMMENT '售后单ID',

    source_system VARCHAR(32) NOT NULL COMMENT '来源系统',
    source_event_id VARCHAR(128) NOT NULL COMMENT '来源事件ID',

    event_type VARCHAR(64) NOT NULL COMMENT '事件类型',
    agent_sk BIGINT DEFAULT NULL COMMENT '事件发生时客服版本ID',

    operator_type VARCHAR(32) DEFAULT NULL COMMENT '操作人类型',
    event_time DATETIME NOT NULL COMMENT '业务事件发生时间',
    event_content VARCHAR(1000) DEFAULT NULL COMMENT '事件描述',

    created_at_dw DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',

    PRIMARY KEY (event_id),

    UNIQUE KEY uk_source_event (
        source_system,
        source_event_id
    ),

    KEY idx_aftersales_time (
        aftersales_id,
        event_time
    ),

    KEY idx_agent_time (
        agent_sk,
        event_time
    ),

    KEY idx_event_type_time (
        event_type,
        event_time
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='售后处理事件事实表';
```

#### 8. 客户投诉事实表

<p v-pre><code>fact_complaint</code></p>

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE fact_complaint (
    complaint_id VARCHAR(64) NOT NULL COMMENT '投诉ID',
    aftersales_id VARCHAR(64) NOT NULL COMMENT '关联售后单ID',

    complaint_type VARCHAR(64) DEFAULT NULL COMMENT '投诉类型',
    complaint_time DATETIME NOT NULL COMMENT '投诉时间',
    complaint_status VARCHAR(32) DEFAULT NULL COMMENT '投诉处理状态',

    created_at_dw DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (complaint_id),

    KEY idx_aftersales (aftersales_id),
    KEY idx_complaint_time (complaint_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='客户投诉事实表';
```

<p v-pre><div>核心建表 SQL 已完成</div></p>

<p v-pre>这里有一个工程上的说明：上述 SQL 暂时采用逻辑关联，没有全部添加物理外键。这是为了便于多源数据增量同步和数据仓库装载。实际项目应在 ETL 中检查孤儿记录、维度缺失和关联完整性，不能因为没有外键就忽略数据一致性。</p>

<p v-pre>另外，事件表的 <code>source_event_id</code> 必须在同一个来源系统内唯一。如果源系统无法提供稳定事件 ID，需要先制定可靠的事件去重键。</p>

### 四、验证数据模型：插入模拟数据

<p v-pre>设计数据库不能只看建表 SQL，还要验证模型是否能够支持业务分析。</p>

<p v-pre>我们插入一组模拟客服历史数据：</p>

<p v-pre><div>SQL</div></p>

```sql
INSERT INTO dim_team (team_id, team_name)
VALUES
(1, 'A团队'),
(2, 'B团队');

INSERT INTO dim_agent (
    agent_id,
    agent_name,
    team_id,
    effective_start,
    effective_end,
    is_current
)
VALUES
(1001, '小王', 1, '2026-11-01', '2026-12-01', 0),
(1001, '小王', 2, '2026-12-01', '9999-12-31', 1);
```

<p v-pre>插入后：</p>

<table v-pre><tbody><tr><th><p>agent_sk</p></th><th><p>agent_id</p></th><th><p>team_id</p></th><th><p>历史版本</p></th></tr><tr><td><p>1</p></td><td><p>1001</p></td><td><p>1</p></td><td><p>A团队</p></td></tr><tr><td><p>2</p></td><td><p>1001</p></td><td><p>2</p></td><td><p>B团队</p></td></tr></tbody></table>

<p v-pre>现在插入两笔售后订单：</p>

<p v-pre><div>SQL</div></p>

```sql
INSERT INTO dwd_aftersales_order (
    aftersales_id,
    order_id,
    issue_type_id,
    resolution_agent_sk,
    status,
    created_at,
    resolved_at
)
VALUES
(
    'A001', 'O001', 1, 1,
    'RESOLVED',
    '2026-11-20 10:00:00',
    '2026-11-20 11:00:00'
),
(
    'A002', 'O002', 1, 2,
    'RESOLVED',
    '2026-12-05 10:00:00',
    '2026-12-05 11:30:00'
);
```

<p v-pre>现在我们就能正确区分：</p>

<ul v-pre><li><div><div><p>A001 属于小王在 A 团队时的业务。</p></div></div></li><li><div><div><p>A002 属于小王在 B 团队时的业务。</p></div></div></li></ul>

<p v-pre>查询：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    t.team_name,
    COUNT(*) AS resolved_count,
    AVG(
        TIMESTAMPDIFF(
            MINUTE,
            o.created_at,
            o.resolved_at
        )
    ) AS avg_resolution_minutes
FROM dwd_aftersales_order o
JOIN dim_agent a
    ON o.resolution_agent_sk = a.agent_sk
JOIN dim_team t
    ON a.team_id = t.team_id
WHERE o.resolved_at IS NOT NULL
GROUP BY t.team_name;
```

<p v-pre>预期结果：</p>

<table v-pre><tbody><tr><th><p>团队</p></th><th><p>解决订单数</p></th><th><p>平均解决时长</p></th></tr><tr><td><p>A团队</p></td><td><p>1</p></td><td><p>60分钟</p></td></tr><tr><td><p>B团队</p></td><td><p>1</p></td><td><p>90分钟</p></td></tr></tbody></table>

<p v-pre>这样就实现了历史团队绩效统计。</p>

### 五、进一步完善数据模型的三个工程规则

<p v-pre>在进入下一步前，还需要掌握三个重要规则。</p>

<p v-pre><span><strong>规则 1：SCD2 版本不能重叠</strong></span></p>

<p v-pre>同一个客服不能同时存在两个有效的团队版本。</p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>版本</p></th><th><p>生效时间</p></th><th><p>失效时间</p></th></tr><tr><td><p>A团队</p></td><td><p>11月1日</p></td><td><p>12月1日</p></td></tr><tr><td><p>B团队</p></td><td><p>11月20日</p></td><td><p>12月20日</p></td></tr></tbody></table>

<p v-pre>这就是错误的，因为 11 月 20 日至 12 月 1 日出现了版本重叠。</p>

<p v-pre><span><strong>规则 2：事件必须保留历史</strong></span></p>

<p v-pre>不能只更新订单的 <code>status</code>。</p>

<p v-pre>每次状态变化、转交、回复、物流反馈都应该尽可能保存为独立事件。</p>

<p v-pre><span><strong>规则 3：汇总指标不能随意 JOIN</strong></span></p>

<p v-pre>一对多关联之前，先确定每张表的粒度。</p>

<p v-pre>例如，需要统计平均解决时长时，先确保订单一行，再进行聚合；需要统计事件数量时，再使用事件粒度。</p>

### 六、数据模型的最终检查

<p v-pre>目前我们已经有八张核心表。现在从系统需求角度检查它们能否支撑五个页面。</p>

<table v-pre><tbody><tr><th><p>页面</p></th><th><p>主要数据表</p></th><th><p>是否具备数据基础</p></th></tr><tr><td><p>经营总览</p></td><td><p>售后订单、投诉、指标汇总</p></td><td><p></p><div>具备</div></td></tr><tr><td><p>效率分析</p></td><td><p>售后订单、处理事件</p></td><td><p></p><div>具备</div></td></tr><tr><td><p>问题类型分析</p></td><td><p>售后订单、售后类型</p></td><td><p></p><div>具备</div></td></tr><tr><td><p>客服绩效分析</p></td><td><p>售后订单、客服历史维度、事件</p></td><td><p></p><div>具备</div></td></tr><tr><td><p>售后明细分析</p></td><td><p>售后订单、处理事件、投诉</p></td><td><p></p><div>具备</div></td></tr></tbody></table>

<p v-pre>不过，目前还存在三个待完善事项：</p>

<ol v-pre><li><div><div><p>客服实际处理时长：需要处理开始、结束事件，或者明确的工作状态区间，不能简单把客服回复次数当成工作时长。</p></div></div></li><li><div><div><p>外部等待时长：需要识别等待物流、等待客户等状态的开始和结束。</p></div></div></li><li><div><div><p>每日指标汇总：后续增加 <code>ads_aftersales_daily</code>，提高首页查询效率。</p></div></div></li></ol>

<p v-pre>这些属于下一阶段的数据加工设计。</p>

### 七、实战问题 4：客服转交订单如何归属？

<p v-pre>现在给你一道更接近真实企业数据分析的题目。</p>

<p v-pre>假设有一笔售后订单：</p>

<table v-pre><tbody><tr><th><p>时间</p></th><th><p>操作</p></th><th><p>客服</p></th><th><p>团队</p></th></tr><tr><td><p>10:00</p></td><td><p>创建售后</p></td><td><p>小王</p></td><td><p>A团队</p></td></tr><tr><td><p>10:10</p></td><td><p>首次响应</p></td><td><p>小王</p></td><td><p>A团队</p></td></tr><tr><td><p>10:30</p></td><td><p>转交订单</p></td><td><p>小李</p></td><td><p>B团队</p></td></tr><tr><td><p>11:00</p></td><td><p>完成解决</p></td><td><p>小李</p></td><td><p>B团队</p></td></tr></tbody></table>

<p v-pre>售后主管提出三个分析需求：</p>

<ul v-pre><li><div><div><p>A团队处理了多少售后订单？</p></div></div></li><li><div><div><p>B团队处理了多少售后订单？</p></div></div></li><li><div><div><p>哪个团队实际完成了解决？</p></div></div></li></ul>

<p v-pre>这里出现了一个重要问题：</p>

<p v-pre>一笔售后订单可能由多个客服、多个团队共同处理。</p>

<p v-pre>你认为系统应该如何设计团队归属？</p>

<p v-pre><div><label>A. 只记录订单创建时的客服和团队，后续转交不再记录。</label></div><div><label>B. 只记录最终解决订单的客服和团队，忽略之前的处理过程。</label></div><div><label>C. 订单表记录当前负责人和最终解决责任人，事件表记录每次操作人及其历史团队版本。</label></div><div><label>D. 每次转交就复制一条新的售后订单记录。</label></div></p>

<p v-pre><span><strong>请说明你的选择理由</strong></span></p>

```text
因为需要区分客服历史团队。
```

<p v-pre><span class="interaction"><span>提交答案，继续建模</span></span></p>

#### 八、第三课学习进度

#### 数据架构与数据建模

<p v-pre>数据分层架构 ODS/DWD/ADS</p>

<p v-pre>完成</p>

<p v-pre>事实表与维度表</p>

<p v-pre>完成</p>

<p v-pre>数据粒度与 JOIN 扇出</p>

<p v-pre>完成</p>

<p v-pre>SCD Type 2 历史维度</p>

<p v-pre>完成初步设计</p>

<p v-pre>ER 图设计</p>

<p v-pre>初版完成</p>

<p v-pre>MySQL 核心建表 SQL</p>

<p v-pre>初版完成</p>

<p v-pre>客服转交与团队归属</p>

<p v-pre>正在学习</p>

<p v-pre>指标汇总表设计</p>

<p v-pre>待完成</p>

<p v-pre>完整数据加工 SQL</p>

<p v-pre>待完成</p>

<p v-pre><span><strong>这一阶段最重要的能力提升：</strong></span></p>

<p v-pre>你已经开始理解数据分析系统不是简单地把业务表关联起来，而是需要明确每张表的粒度、历史版本、业务关系和统计口径。</p>

<p v-pre>下一步，我们会把客服转交过程设计成可追溯的数据模型，再完成每日汇总表和实际指标 SQL，最终形成可以直接用于项目开发的数据库设计文档。</p>

## 第 20 轮　客服转交、分配历史与团队工作量 {#turn-20}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第三课实战问题4，我选择：C。理由：因为需要区分客服历史团队。。请评价，并继续指导我设计客服转交、团队工作量统计、ER图和指标汇总表。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第三课：客服转交、团队工作量统计与指标汇总表

<p v-pre></p>

<p v-pre><div>第4题回答正确</div> <div>进入团队数据建模</div></p>

<p v-pre>你的选择 C 正确。</p>

<p v-pre>你的理由：</p>

<blockquote v-pre><p>因为需要区分客服历史团队。</p></blockquote>

<p v-pre>这个思路是对的。你已经意识到：售后订单不一定由一个客服从头处理到尾，因此不能只在订单表里记录一个客服 ID。</p>

<p v-pre>不过，我想进一步提升你的理解：</p>

<p v-pre><span><strong>不仅要记录客服历史团队，还要记录订单在不同时间由谁负责、谁实际处理、谁最终解决。</strong></span></p>

<p v-pre>这三种关系是不同的。</p>

#### 一、评价你的数据建模思路

<p v-pre>先看我们之前的业务场景：</p>

<table v-pre><tbody><tr><th><p>时间</p></th><th><p>操作</p></th><th><p>客服</p></th><th><p>团队</p></th></tr><tr><td><p>10:00</p></td><td><p>创建售后</p></td><td><p>小王</p></td><td><p>A团队</p></td></tr><tr><td><p>10:10</p></td><td><p>首次响应</p></td><td><p>小王</p></td><td><p>A团队</p></td></tr><tr><td><p>10:30</p></td><td><p>转交订单</p></td><td><p>小李</p></td><td><p>B团队</p></td></tr><tr><td><p>11:00</p></td><td><p>完成解决</p></td><td><p>小李</p></td><td><p>B团队</p></td></tr></tbody></table>

<p v-pre>我们需要区分三个概念：</p>

<table v-pre><tbody><tr><th><p>概念</p></th><th><p>含义</p></th><th><p>数据存储位置</p></th></tr><tr><td><p>当前负责人</p></td><td><p>现在由谁处理</p></td><td><p>售后订单表</p></td></tr><tr><td><p>实际操作人</p></td><td><p>谁执行了某次操作</p></td><td><p>售后事件表</p></td></tr><tr><td><p>最终解决责任人</p></td><td><p>谁完成最终解决</p></td><td><p>售后订单表</p></td></tr></tbody></table>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>小王完成了首次响应。</p></div></div></li><li><div><div><p>小李完成了最终解决。</p></div></div></li><li><div><div><p>当前负责人可能是小李。</p></div></div></li></ul>

<p v-pre>如果把这三种角色全部放在一个 <code>agent_id</code> 字段中，就会丢失业务信息。</p>

<p v-pre><span><strong>所以你的 C 方案是正确的，但还需要增加一张专门记录客服分配历史的表。</strong></span></p>

### 二、设计客服转交数据模型

<p v-pre>我建议保留之前的两张核心表，再增加一张表：</p>

<p v-pre><code>fact_aftersales_assignment</code></p>

<p v-pre>它专门记录售后订单的负责人变化历史。</p>

#### 1. 三张表各自负责什么？

<p v-pre><div>第一张表</div></p>

<p v-pre><span><code>dwd_aftersales_order</code></span></p>

<p v-pre>一笔售后一行。</p>

<p v-pre>记录当前负责人、最终解决责任人、创建时间和解决时间。</p>

<p v-pre><div>第二张表</div></p>

<p v-pre><span><code>dwd_aftersales_event</code></span></p>

<p v-pre>一次业务事件一行。</p>

<p v-pre>记录客服回复、转交、物流反馈、解决等操作。</p>

<p v-pre><div>新增第三张表</div></p>

<p v-pre><span><code>fact_aftersales_assignment</code></span></p>

<p v-pre>一次负责人分配周期一行。</p>

<p v-pre>记录谁在什么时候负责这笔售后，以及何时结束负责。</p>

<p v-pre>为什么需要第三张表？</p>

<p v-pre>因为事件表记录的是「发生了什么」，分配历史表记录的是「谁在什么时间段负责」。</p>

<p v-pre>这两种数据粒度不同。</p>

#### 2. 分配历史示例

<p v-pre>假设：</p>

<ul v-pre><li><div><div><p>10:00 小王接单。</p></div></div></li><li><div><div><p>10:30 转交小李。</p></div></div></li><li><div><div><p>11:00 小李完成解决。</p></div></div></li></ul>

<p v-pre>分配历史表：</p>

<table v-pre><tbody><tr><th><p>售后单</p></th><th><p>客服</p></th><th><p>团队</p></th><th><p>开始时间</p></th><th><p>结束时间</p></th></tr><tr><td><p>A001</p></td><td><p>小王</p></td><td><p>A团队</p></td><td><p>10:00</p></td><td><p>10:30</p></td></tr><tr><td><p>A001</p></td><td><p>小李</p></td><td><p>B团队</p></td><td><p>10:30</p></td><td><p>11:00</p></td></tr></tbody></table>

<p v-pre><span><strong>A001 售后责任流转</strong></span></p>

<p v-pre><span><strong>10:00 — 10:30</strong></span></p>

<p v-pre>小王 · A团队</p>

<p v-pre><div>负责中</div></p>

<p v-pre>负责时长：30分钟</p>

<p v-pre>10:30 转交</p>

<p v-pre><span><strong>10:30 — 11:00</strong></span></p>

<p v-pre>小李 · B团队</p>

<p v-pre><div>最终解决</div></p>

<p v-pre>负责时长：30分钟</p>

<p v-pre>这样我们就能回答：</p>

<ul v-pre><li><div><div><p>A 团队接手过多少笔售后？</p></div></div></li><li><div><div><p>B 团队接手过多少笔售后？</p></div></div></li><li><div><div><p>A 团队累计负责了多少分钟？</p></div></div></li><li><div><div><p>B 团队最终解决了多少笔售后？</p></div></div></li></ul>

<p v-pre>这些都是管理人员真正关心的问题。</p>

### 三、设计客服分配历史表

#### 1. 字段设计

<p v-pre>表名：<code>fact_aftersales_assignment</code></p>

<table v-pre><tbody><tr><th><p>字段</p></th><th><p>含义</p></th></tr><tr><td><p>assignment_id</p></td><td><p>分配记录 ID</p></td></tr><tr><td><p>aftersales_id</p></td><td><p>售后单 ID</p></td></tr><tr><td><p>agent_sk</p></td><td><p>客服历史版本 ID</p></td></tr><tr><td><p>assigned_at</p></td><td><p>开始负责时间</p></td></tr><tr><td><p>unassigned_at</p></td><td><p>结束负责时间</p></td></tr><tr><td><p>assignment_status</p></td><td><p>分配状态</p></td></tr><tr><td><p>assignment_reason</p></td><td><p>分配原因</p></td></tr><tr><td><p>source_event_id</p></td><td><p>来源事件 ID</p></td></tr></tbody></table>

<p v-pre>数据粒度：</p>

<p v-pre><span><strong>一笔售后订单的一次负责人分配周期一行。</strong></span></p>

#### 2. MySQL 建表 SQL

<p v-pre><div>SQL</div></p>

```sql

CREATE TABLE fact_aftersales_assignment (
    assignment_id BIGINT NOT NULL AUTO_INCREMENT
        COMMENT '分配记录ID',

    aftersales_id VARCHAR(64) NOT NULL
        COMMENT '售后单ID',

    agent_sk BIGINT NOT NULL
        COMMENT '客服历史版本ID',

    assigned_at DATETIME NOT NULL
        COMMENT '开始负责时间',

    unassigned_at DATETIME DEFAULT NULL
        COMMENT '结束负责时间',

    assignment_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE'
        COMMENT 'ACTIVE/ENDED',

    assignment_reason VARCHAR(255) DEFAULT NULL
        COMMENT '分配原因',

    source_event_id VARCHAR(128) DEFAULT NULL
        COMMENT '来源事件ID',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (assignment_id),

    KEY idx_aftersales (
        aftersales_id,
        assigned_at
    ),

    KEY idx_agent_period (
        agent_sk,
        assigned_at,
        unassigned_at
    ),

    KEY idx_active (
        assignment_status,
        agent_sk
    )
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COMMENT='售后客服负责人分配历史表';

```

<p v-pre>注意：这张表不能只依靠普通唯一索引保证同一笔售后同时只有一个负责人，因为 MySQL 的普通索引无法直接表达时间区间不重叠。</p>

<p v-pre>正式开发时，应该在转交事务中锁定售后订单，结束旧分配记录、创建新记录，并保证同一时刻只有一个有效负责人。</p>

#### 3. 客服转交时如何更新？

<p v-pre>例如，A001 从小王转交给小李。</p>

<p v-pre>业务操作应该在一个数据库事务中完成：</p>

<p v-pre><div>SQL</div></p>

```sql
START TRANSACTION;

-- 1. 结束旧负责人记录
UPDATE fact_aftersales_assignment
SET
    unassigned_at = '2026-11-20 10:30:00',
    assignment_status = 'ENDED'
WHERE aftersales_id = 'A001'
  AND assignment_status = 'ACTIVE';

-- 2. 创建新负责人记录
INSERT INTO fact_aftersales_assignment (
    aftersales_id,
    agent_sk,
    assigned_at,
    assignment_status
)
VALUES (
    'A001',
    102,
    '2026-11-20 10:30:00',
    'ACTIVE'
);

-- 3. 更新订单当前负责人
UPDATE dwd_aftersales_order
SET current_agent_sk = 102
WHERE aftersales_id = 'A001';

COMMIT;
```

<p v-pre>这里假设小李对应的客服历史版本 <code>agent_sk=102</code>。</p>

<p v-pre>实际代码还需要在事务开始时锁定订单行，例如使用 <code>SELECT ... FOR UPDATE</code>，并检查旧负责人是否存在，避免并发转交导致两条有效分配记录。</p>

### 四、如何统计团队工作量？

<p v-pre>现在我们已经能够记录客服转交历史。</p>

<p v-pre>接下来是一个更重要的问题：</p>

<p v-pre><span><strong>A 团队和 B 团队分别贡献了多少售后工作？</strong></span></p>

<p v-pre>这里不能简单地按订单当前负责人统计。</p>

<p v-pre>我们需要设计不同的统计指标。</p>

#### 1. 团队工作量指标

<p v-pre>我建议分为四类。</p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>计算方式</p></th><th><p>业务意义</p></th></tr><tr><td><p>接手订单量</p></td><td><p>当天开始负责的去重售后单数</p></td><td><p>衡量团队接单量</p></td></tr><tr><td><p>参与处理订单量</p></td><td><p>当天实际发生处理事件的去重售后单数</p></td><td><p>衡量团队参与量</p></td></tr><tr><td><p>最终解决订单量</p></td><td><p>由该团队客服最终完成的售后单数</p></td><td><p>衡量解决产出</p></td></tr><tr><td><p>累计负责时长</p></td><td><p>分配时间区间与统计日期的重叠时长</p></td><td><p>衡量责任投入</p></td></tr></tbody></table>

<p v-pre>注意，这四个指标不能混用。</p>

<p v-pre>例如：</p>

<p v-pre>一笔售后订单先由 A 团队处理，再由 B 团队解决。</p>

<p v-pre>那么：</p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>A团队</p></th><th><p>B团队</p></th></tr><tr><td><p>接手订单量</p></td><td><p>1</p></td><td><p>1</p></td></tr><tr><td><p>参与处理订单量</p></td><td><p>1</p></td><td><p>1</p></td></tr><tr><td><p>最终解决订单量</p></td><td><p>0</p></td><td><p>1</p></td></tr><tr><td><p>累计负责时长</p></td><td><p>30分钟</p></td><td><p>30分钟</p></td></tr></tbody></table>

<p v-pre>因此：</p>

<ul v-pre><li><div><div><p>接手订单量可以重复计算同一售后单。</p></div></div></li><li><div><div><p>参与处理订单量也可以在不同团队之间重复计算。</p></div></div></li><li><div><div><p>全公司整体售后订单量必须按照售后单去重。</p></div></div></li><li><div><div><p>最终解决订单量按照最终解决责任归属统计。</p></div></div></li></ul>

<p v-pre>这就是多团队协作场景下的指标口径。</p>

#### 2. 团队工作量的 SQL 示例

##### 统计团队接手订单量

<p v-pre><div>SQL</div></p>

```sql
SELECT
    a.agent_sk,
    COUNT(DISTINCT a.aftersales_id) AS assigned_orders
FROM fact_aftersales_assignment a
WHERE a.assigned_at >= '2026-11-20 00:00:00'
  AND a.assigned_at < '2026-11-21 00:00:00'
GROUP BY a.agent_sk;
```

<p v-pre>再关联 <code>dim_agent</code> 和 <code>dim_team</code>，即可得到团队级别数据。</p>

##### 统计团队参与处理订单量

<p v-pre><div>SQL</div></p>

```sql
SELECT
    a.team_id,
    COUNT(DISTINCT e.aftersales_id) AS handled_orders,
    COUNT(*) AS handled_events
FROM dwd_aftersales_event e
JOIN dim_agent a
    ON e.agent_sk = a.agent_sk
WHERE e.event_time >= '2026-11-20 00:00:00'
  AND e.event_time < '2026-11-21 00:00:00'
GROUP BY a.team_id;
```

<p v-pre>这里：</p>

<ul v-pre><li><div><div><p><code>handled_orders</code> 是团队参与过的不同售后订单数量。</p></div></div></li><li><div><div><p><code>handled_events</code> 是团队执行的业务事件数量。</p></div></div></li></ul>

<p v-pre>不要把事件数量当成订单数量。</p>

##### 统计团队累计负责时长

<p v-pre>假设小王负责 A001 的时间为 10:00～10:30。</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    agent_sk,
    SUM(
        TIMESTAMPDIFF(
            SECOND,
            assigned_at,
            COALESCE(unassigned_at, NOW())
        )
    ) / 60 AS responsible_minutes
FROM fact_aftersales_assignment
GROUP BY agent_sk;
```

<p v-pre>这段 SQL 适合统计完整分配周期的累计时长。</p>

<p v-pre>如果要统计某一天的负责时长，还必须计算分配区间与当天时间区间的交集，不能直接使用完整负责时长。</p>

### 五、完善 ER 图

<p v-pre>现在我们将新增的分配历史表加入整体数据模型。</p>

<p v-pre><div><span class="visual-label">Mermaid 图表</span></div></p>

<p v-pre>现在整个模型已经可以支持：</p>

<ul v-pre><li><div><div><p>售后订单分析。</p></div></div></li><li><div><div><p>售后事件分析。</p></div></div></li><li><div><div><p>客服历史团队分析。</p></div></div></li><li><div><div><p>客服转交分析。</p></div></div></li><li><div><div><p>团队工作量分析。</p></div></div></li><li><div><div><p>最终解决责任分析。</p></div></div></li></ul>

### 六、设计团队每日指标汇总表

<p v-pre>现在进入数据建模的最后一个重要环节：汇总表。</p>

<p v-pre>前面设计的事实表适合保存明细，但经营总览如果每次都查询上亿条事件记录，性能可能不理想。</p>

<p v-pre>因此，我们可以提前计算每日指标。</p>

<p v-pre>表名：</p>

<p v-pre><code>ads_aftersales_team_daily</code></p>

#### 1. 确定汇总表粒度

<p v-pre><div>核心设计决定</div></p>

<p v-pre><span><strong>一个统计日期 + 一个团队一行。</strong></span></p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>日期</p></th><th><p>团队</p></th></tr><tr><td><p>11月20日</p></td><td><p>A团队</p></td></tr><tr><td><p>11月20日</p></td><td><p>B团队</p></td></tr><tr><td><p>11月21日</p></td><td><p>A团队</p></td></tr><tr><td><p>11月21日</p></td><td><p>B团队</p></td></tr></tbody></table>

#### 2. 指标字段

<table v-pre><tbody><tr><th><p>字段</p></th><th><p>含义</p></th></tr><tr><td><p>stat_date</p></td><td><p>统计日期</p></td></tr><tr><td><p>team_id</p></td><td><p>团队 ID</p></td></tr><tr><td><p>assigned_order_count</p></td><td><p>接手订单量</p></td></tr><tr><td><p>handled_order_count</p></td><td><p>参与处理订单量</p></td></tr><tr><td><p>handled_event_count</p></td><td><p>处理事件数量</p></td></tr><tr><td><p>resolved_order_count</p></td><td><p>最终解决订单量</p></td></tr><tr><td><p>responsible_minutes</p></td><td><p>累计负责时长</p></td></tr><tr><td><p>resolution_minutes_sum</p></td><td><p>解决时长总和</p></td></tr><tr><td><p>resolved_count_for_avg</p></td><td><p>平均解决时长分母</p></td></tr><tr><td><p>avg_resolution_minutes</p></td><td><p>平均解决时长</p></td></tr><tr><td><p>overtime_order_count</p></td><td><p>超时订单量</p></td></tr></tbody></table>

<p v-pre>这里特别强调：</p>

<p v-pre><span><strong>汇总表不要只保存平均值，最好同时保存总和与计数。</strong></span></p>

<p v-pre>例如：</p>

<p v-pre>A 团队：</p>

<ul v-pre><li><div><div><p>解决 10 单。</p></div></div></li><li><div><div><p>总解决时长 600 分钟。</p></div></div></li><li><div><div><p>平均解决时长 60 分钟。</p></div></div></li></ul>

<p v-pre>B 团队：</p>

<ul v-pre><li><div><div><p>解决 100 单。</p></div></div></li><li><div><div><p>总解决时长 9,000 分钟。</p></div></div></li><li><div><div><p>平均解决时长 90 分钟。</p></div></div></li></ul>

<p v-pre>公司整体平均解决时长应该是：</p>

<p v-pre><div><span><span><span>600+900010+100=87.27 分钟\frac{600+9000}{10+100}=87.27\text{ 分钟}</span></span></span></div></p>

<p v-pre>而不是：</p>

<p v-pre><div><span><span><span>60+902=75 分钟\frac{60+90}{2}=75\text{ 分钟}</span></span></span></div></p>

<p v-pre>这叫作可加总指标设计。</p>

#### 3. 汇总表 SQL

<p v-pre><div>SQL</div></p>

```sql

CREATE TABLE ads_aftersales_team_daily (
    stat_date DATE NOT NULL COMMENT '统计日期',
    team_id BIGINT NOT NULL COMMENT '团队ID',

    assigned_order_count BIGINT NOT NULL DEFAULT 0
        COMMENT '接手订单量',

    handled_order_count BIGINT NOT NULL DEFAULT 0
        COMMENT '参与处理订单量',

    handled_event_count BIGINT NOT NULL DEFAULT 0
        COMMENT '处理事件数量',

    resolved_order_count BIGINT NOT NULL DEFAULT 0
        COMMENT '最终解决订单量',

    responsible_minutes BIGINT NOT NULL DEFAULT 0
        COMMENT '累计负责分钟数',

    resolution_minutes_sum BIGINT NOT NULL DEFAULT 0
        COMMENT '解决时长总和',

    resolved_count_for_avg BIGINT NOT NULL DEFAULT 0
        COMMENT '平均解决时长分母',

    avg_resolution_minutes DECIMAL(12,2) DEFAULT NULL
        COMMENT '平均解决时长',

    overtime_order_count BIGINT NOT NULL DEFAULT 0
        COMMENT '超时订单量',

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (stat_date, team_id),

    KEY idx_team_date (team_id, stat_date)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COMMENT='售后团队每日指标汇总表';

```

<p v-pre>注意：<code>avg_resolution_minutes</code> 是展示用冗余字段，真正合并不同团队的数据时，应使用总和除以计数重新计算，不能直接平均各团队平均值。</p>

### 七、团队统计口径必须进一步明确

<p v-pre>目前我们已经具备数据表，但正式开发前还需要明确每个指标的归属规则。</p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>归属团队</p></th><th><p>统计日期</p></th></tr><tr><td><p>接手订单量</p></td><td><p>接手时客服所属团队</p></td><td><p>接手日期</p></td></tr><tr><td><p>参与处理订单量</p></td><td><p>实际执行事件的客服所属团队</p></td><td><p>事件日期</p></td></tr><tr><td><p>处理事件量</p></td><td><p>实际操作人所属团队</p></td><td><p>事件日期</p></td></tr><tr><td><p>最终解决订单量</p></td><td><p>最终解决责任人所属团队</p></td><td><p>解决日期</p></td></tr><tr><td><p>累计负责时长</p></td><td><p>分配期间客服所属团队</p></td><td><p>按天拆分</p></td></tr></tbody></table>

<p v-pre>这张表非常重要，它就是团队指标的统计口径说明。</p>

<p v-pre>另外，团队绩效不能只看最终解决订单量。</p>

<p v-pre>例如 A 团队负责调查，B 团队负责最后解决。如果只把业绩全部记给 B 团队，可能低估 A 团队的工作贡献。</p>

<p v-pre>因此建议：</p>

<ul v-pre><li><div><div><p>用最终解决订单量衡量解决产出。</p></div></div></li><li><div><div><p>用参与处理订单量衡量参与程度。</p></div></div></li><li><div><div><p>用累计负责时长衡量责任投入。</p></div></div></li><li><div><div><p>用处理事件量辅助观察工作活动。</p></div></div></li></ul>

<p v-pre>不同指标分别回答不同管理问题。</p>

### 八、实战问题 5：确定团队绩效的统计方式

<p v-pre>现在考察你是否真正理解刚才的数据模型。</p>

<p v-pre>假设有一笔售后订单：</p>

<table v-pre><tbody><tr><th><p>时间</p></th><th><p>操作</p></th><th><p>团队</p></th></tr><tr><td><p>10:00</p></td><td><p>A团队接手</p></td><td><p>A团队</p></td></tr><tr><td><p>10:10</p></td><td><p>A团队客服回复</p></td><td><p>A团队</p></td></tr><tr><td><p>10:30</p></td><td><p>转交给B团队</p></td><td><p>B团队</p></td></tr><tr><td><p>10:40</p></td><td><p>B团队联系物流</p></td><td><p>B团队</p></td></tr><tr><td><p>11:00</p></td><td><p>B团队解决</p></td><td><p>B团队</p></td></tr></tbody></table>

<p v-pre>售后主管希望分别统计：</p>

<ul v-pre><li><div><div><p>团队接手订单量。</p></div></div></li><li><div><div><p>团队参与处理订单量。</p></div></div></li><li><div><div><p>团队最终解决订单量。</p></div></div></li></ul>

<p v-pre>你认为正确的统计结果是什么？</p>

<p v-pre><div><label>A. A团队：接手1单、参与处理1单、解决0单；B团队：接手1单、参与处理1单、解决1单。</label></div><div><label>B. A团队：接手1单、参与处理1单、解决1单；B团队：接手0单、参与处理0单、解决0单。</label></div><div><label>C. A团队和B团队各自解决1单。</label></div><div><label>D. 只统计B团队，因为最终由B团队解决。</label></div></p>

<p v-pre><span><strong>请解释为什么这样统计</strong></span></p>

```text
接手、参与和最终解决代表不同的业务含义
```

<p v-pre><span class="interaction"><span>提交答案，继续学习</span></span></p>

#### 九、第三课学习进度

#### 数据架构与数据建模

<p v-pre>ODS/DWD/ADS 数据分层</p>

<p v-pre>事实表、维度表和数据粒度</p>

<p v-pre>JOIN 扇出与重复统计</p>

<p v-pre>SCD Type 2 历史维度</p>

<p v-pre>售后订单与事件事实表</p>

<p v-pre>客服转交与分配历史</p>

<p v-pre>团队工作量指标设计</p>

<p v-pre>团队每日汇总表</p>

<p v-pre>完整指标加工 SQL</p>

<p v-pre>数据质量与性能验证</p>

<p v-pre>数据库设计文档交付</p>

<p v-pre><span><strong>本节课最重要的收获：</strong></span></p>

<p v-pre>你已经从「一笔售后订单属于哪个客服」，进步到「一笔售后订单可能由多个客服、多个团队共同完成，应该如何准确记录和评价贡献」。</p>

<p v-pre>这是真正的数据建模思维。</p>

<p v-pre>下一步我们将完成团队汇总 SQL、指标计算、数据质量校验，最后形成一份可以交给 Cursor 或 Codex 实际开发的 MySQL 数据库设计文档。</p>

## 第 21 轮　团队日汇总 SQL、质量检查与数据库设计文档 {#turn-21}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第三课实战问题5，我选择：A。理由：接手、参与和最终解决代表不同的业务含义。请评价，并继续指导我完成团队每日指标汇总SQL、数据质量检查和完整数据库设计文档。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第三课：团队指标汇总 SQL、数据质量检查与数据库设计文档

<p v-pre></p>

<p v-pre><div>第5题回答正确</div> <div>进入数据开发实战</div></p>

<p v-pre>你的选择 A 完全正确。</p>

<p v-pre>你的理由：</p>

<blockquote v-pre><p>接手、参与和最终解决代表不同的业务含义。</p></blockquote>

<p v-pre>这次不仅答案正确，而且你已经抓住了数据分析系统中一个非常重要的原则：</p>

<p v-pre><span><strong>同一笔业务可以产生多种统计结果，但每种统计结果必须有独立的业务定义。</strong></span></p>

#### 一、评价你的团队指标设计

<p v-pre>我们再看一遍业务过程：</p>

<table v-pre><tbody><tr><th><p>时间</p></th><th><p>操作</p></th><th><p>团队</p></th></tr><tr><td><p>10:00</p></td><td><p>接手售后</p></td><td><p>A团队</p></td></tr><tr><td><p>10:10</p></td><td><p>客服回复</p></td><td><p>A团队</p></td></tr><tr><td><p>10:30</p></td><td><p>转交订单</p></td><td><p>B团队</p></td></tr><tr><td><p>10:40</p></td><td><p>联系物流</p></td><td><p>B团队</p></td></tr><tr><td><p>11:00</p></td><td><p>完成解决</p></td><td><p>B团队</p></td></tr></tbody></table>

<p v-pre>正确的统计结果：</p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>A团队</p></th><th><p>B团队</p></th></tr><tr><td><p>接手订单量</p></td><td><p>1</p></td><td><p>1</p></td></tr><tr><td><p>参与处理订单量</p></td><td><p>1</p></td><td><p>1</p></td></tr><tr><td><p>最终解决订单量</p></td><td><p>0</p></td><td><p>1</p></td></tr><tr><td><p>处理事件量</p></td><td><p>1</p></td><td><p>2</p></td></tr></tbody></table>

<p v-pre>为什么这样设计？</p>

<ul v-pre><li><div><div><p>接手订单量：衡量团队接收了多少业务。</p></div></div></li><li><div><div><p>参与处理订单量：衡量团队参与了多少业务。</p></div></div></li><li><div><div><p>最终解决订单量：衡量团队完成了多少业务。</p></div></div></li><li><div><div><p>处理事件量：衡量团队产生了多少处理活动。</p></div></div></li></ul>

<p v-pre>这里有一个容易忽略的地方：</p>

<p v-pre>A 团队和 B 团队的接手订单量相加为 2，但全公司实际上只有 1 笔售后订单。</p>

<p v-pre>这不是错误，因为接手订单量统计的是团队接手行为，而不是公司售后订单总量。</p>

<p v-pre>所以，<span><strong>团队指标可以重复归属，全局业务订单量必须去重。</strong></span></p>

### 二、正式设计团队每日指标汇总 SQL

<p v-pre>现在开始真正的数据开发。</p>

<p v-pre>我们的目标是：</p>

<p v-pre>每天自动计算每个团队的售后工作情况，写入：</p>

<p v-pre><code>ads_aftersales_team_daily</code></p>

#### 1. 先确定统计口径

<p v-pre>这是写 SQL 之前必须完成的工作。</p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>统计日期</p></th><th><p>归属团队</p></th><th><p>去重方式</p></th></tr><tr><td><p>接手订单量</p></td><td><p>接手日期</p></td><td><p>接手时所属团队</p></td><td><p>售后单 ID</p></td></tr><tr><td><p>参与处理订单量</p></td><td><p>事件日期</p></td><td><p>实际操作人所属团队</p></td><td><p>售后单 ID</p></td></tr><tr><td><p>处理事件量</p></td><td><p>事件日期</p></td><td><p>实际操作人所属团队</p></td><td><p>事件 ID</p></td></tr><tr><td><p>最终解决订单量</p></td><td><p>解决日期</p></td><td><p>最终解决责任人所属团队</p></td><td><p>售后单 ID</p></td></tr><tr><td><p>累计负责时长</p></td><td><p>负责日期</p></td><td><p>负责期间所属团队</p></td><td><p>分配时间区间</p></td></tr><tr><td><p>平均解决时长</p></td><td><p>解决日期</p></td><td><p>最终解决责任人所属团队</p></td><td><p>售后单 ID</p></td></tr></tbody></table>

<p v-pre>特别强调：</p>

<p v-pre>我们使用 <code>agent_sk</code>，而不是 <code>agent_id</code>。</p>

<p v-pre>因为 <code>agent_sk</code> 对应客服的历史版本，能够还原业务发生时所属团队。</p>

#### 2. SQL 一：统计团队接手订单量

<p v-pre><div>SQL</div></p>

```sql
SELECT
    DATE(a.assigned_at) AS stat_date,
    d.team_id,
    COUNT(DISTINCT a.aftersales_id) AS assigned_order_count
FROM fact_aftersales_assignment a
JOIN dim_agent d
    ON a.agent_sk = d.agent_sk
WHERE a.assigned_at >= '2026-11-20 00:00:00'
  AND a.assigned_at <  '2026-11-21 00:00:00'
GROUP BY
    DATE(a.assigned_at),
    d.team_id;
```

<p v-pre>这里要理解：</p>

<ul v-pre><li><div><div><p><code>agent_sk</code> 找到客服当时的历史版本。</p></div></div></li><li><div><div><p><code>team_id</code> 找到当时所属团队。</p></div></div></li><li><div><div><p><code>COUNT(DISTINCT aftersales_id)</code> 防止同一团队重复接手记录造成重复统计。</p></div></div></li></ul>

#### 3. SQL 二：统计团队参与处理订单量

<p v-pre><div>SQL</div></p>

```sql
SELECT
    DATE(e.event_time) AS stat_date,
    a.team_id,
    COUNT(DISTINCT e.aftersales_id) AS handled_order_count,
    COUNT(*) AS handled_event_count
FROM dwd_aftersales_event e
JOIN dim_agent a
    ON e.agent_sk = a.agent_sk
WHERE e.event_time >= '2026-11-20 00:00:00'
  AND e.event_time <  '2026-11-21 00:00:00'
  AND e.event_type IN (
      'AGENT_REPLY',
      'CONTACT_LOGISTICS',
      'HANDLE_ISSUE',
      'RESOLVED'
  )
GROUP BY
    DATE(e.event_time),
    a.team_id;
```

<p v-pre>为什么要限制 <code>event_type</code>？</p>

<p v-pre>因为创建订单、系统自动更新、定时任务等事件，不一定代表客服实际参与处理。</p>

<p v-pre>所以需要维护一份事件类型分类规则。</p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>事件类型</p></th><th><p>是否计入客服参与</p></th></tr><tr><td><p>AGENT_REPLY</p></td><td><p>是</p></td></tr><tr><td><p>CONTACT_LOGISTICS</p></td><td><p>是</p></td></tr><tr><td><p>HANDLE_ISSUE</p></td><td><p>是</p></td></tr><tr><td><p>RESOLVED</p></td><td><p>是</p></td></tr><tr><td><p>SYSTEM_SYNC</p></td><td><p>否</p></td></tr><tr><td><p>AUTO_UPDATE</p></td><td><p>否</p></td></tr></tbody></table>

#### 4. SQL 三：统计团队最终解决订单量

<p v-pre><div>SQL</div></p>

```sql
SELECT
    DATE(o.resolved_at) AS stat_date,
    a.team_id,
    COUNT(DISTINCT o.aftersales_id) AS resolved_order_count,
    SUM(
        TIMESTAMPDIFF(
            SECOND,
            o.created_at,
            o.resolved_at
        )
    ) AS resolution_seconds_sum
FROM dwd_aftersales_order o
JOIN dim_agent a
    ON o.resolution_agent_sk = a.agent_sk
WHERE o.resolved_at >= '2026-11-20 00:00:00'
  AND o.resolved_at <  '2026-11-21 00:00:00'
  AND o.status = 'RESOLVED'
GROUP BY
    DATE(o.resolved_at),
    a.team_id;
```

<p v-pre>这里我们同时计算解决时长总和。</p>

<p v-pre>为什么？</p>

<p v-pre>因为后面需要计算团队平均解决时长：</p>

<p v-pre><div><span><span><span>平均解决时长=解决时长总和已解决订单数平均解决时长= \frac{解决时长总和}{已解决订单数}</span></span></span></div></p>

<p v-pre>注意：这里的平均解决时长包含了转交前后的全部客户等待时间，不能将它解释为客服实际工作时间。</p>

#### 5. SQL 四：统计团队每日负责时长

<p v-pre>这个 SQL 是本节比较重要的内容。</p>

<p v-pre>假设 A 团队在 11 月 20 日 23:00 开始负责一笔订单，11 月 21 日 01:00 才结束。</p>

<p v-pre>如果只使用完整的负责时长，就会把 120 分钟全部归入某一天。</p>

<p v-pre>正确做法是计算负责时间区间与统计日期的交集。</p>

<p v-pre><div>SQL</div></p>

```sql
SET @stat_date = '2026-11-20';

SELECT
    @stat_date AS stat_date,
    a.team_id,
    SUM(
        GREATEST(
            0,
            TIMESTAMPDIFF(
                SECOND,
                GREATEST(
                    x.assigned_at,
                    CAST(@stat_date AS DATETIME)
                ),
                LEAST(
                    COALESCE(
                        x.unassigned_at,
                        NOW()
                    ),
                    DATE_ADD(
                        CAST(@stat_date AS DATETIME),
                        INTERVAL 1 DAY
                    )
                )
            )
        )
    ) / 60 AS responsible_minutes
FROM fact_aftersales_assignment x
JOIN dim_agent a
    ON x.agent_sk = a.agent_sk
WHERE x.assigned_at <
      DATE_ADD(CAST(@stat_date AS DATETIME), INTERVAL 1 DAY)
  AND COALESCE(x.unassigned_at, NOW()) >
      CAST(@stat_date AS DATETIME)
GROUP BY a.team_id;
```

<p v-pre>这就实现了按自然日拆分负责时长。</p>

<p v-pre>但请注意：累计负责时长不等于客服实际工作时长。客服可能同时负责多笔订单，这个指标反映的是订单责任时间，可能存在时间重叠。</p>

### 三、把多个指标合并到每日汇总表

<p v-pre>现在有了四组 SQL，下一步就是整合。</p>

<p v-pre>这里有一个重要的工程原则：</p>

<p v-pre><span><strong>不要直接把订单表、事件表、分配表三张明细表 JOIN 在一起计算所有指标。</strong></span></p>

<p v-pre>因为：</p>

<ul v-pre><li><div><div><p>一笔订单有多条事件。</p></div></div></li><li><div><div><p>一笔订单有多条分配记录。</p></div></div></li><li><div><div><p>两者同时 JOIN 会产生重复行。</p></div></div></li></ul>

<p v-pre>正确方案是：</p>

<ol v-pre><li><div><div><p>订单表先独立聚合。</p></div></div></li><li><div><div><p>事件表先独立聚合。</p></div></div></li><li><div><div><p>分配表先独立聚合。</p></div></div></li><li><div><div><p>将聚合后的结果按照 <code>stat_date + team_id</code> 合并。</p></div></div></li></ol>

#### 1. 汇总 SQL 的整体结构

#### 每日团队指标加工流程

<p v-pre><span><strong>接手指标</strong></span></p>

<p v-pre>assignment 表聚合</p>

<p v-pre><span><strong>参与指标</strong></span></p>

<p v-pre>event 表聚合</p>

<p v-pre><span><strong>解决指标</strong></span></p>

<p v-pre>order 表聚合</p>

<p v-pre><span><strong>负责时长</strong></span></p>

<p v-pre>assignment 区间计算</p>

<p v-pre><span><strong>按照 stat</strong><strong>_</strong><strong>date + team</strong><strong>_</strong><strong>id 合并</strong></span></p>

<p v-pre><span><strong>ads</strong><strong>_</strong><strong>aftersales</strong><strong>_</strong><strong>team</strong><strong>_</strong><strong>daily</strong></span></p>

#### 2. MySQL 8.0 综合汇总 SQL

<p v-pre>下面给你一版可作为每日任务基础的 SQL。</p>

<p v-pre>这里使用 CTE 分别聚合各张表，避免 JOIN 扇出。</p>

<p v-pre><div>SQL</div></p>

```sql

SET @stat_date = '2026-11-20';

INSERT INTO ads_aftersales_team_daily (
    stat_date,
    team_id,
    assigned_order_count,
    handled_order_count,
    handled_event_count,
    resolved_order_count,
    responsible_minutes,
    resolution_minutes_sum,
    resolved_count_for_avg,
    avg_resolution_minutes
)
WITH
assigned AS (
    SELECT
        DATE(x.assigned_at) AS stat_date,
        a.team_id,
        COUNT(DISTINCT x.aftersales_id) AS assigned_count
    FROM fact_aftersales_assignment x
    JOIN dim_agent a
        ON x.agent_sk = a.agent_sk
    WHERE x.assigned_at >= CAST(@stat_date AS DATETIME)
      AND x.assigned_at < DATE_ADD(
          CAST(@stat_date AS DATETIME),
          INTERVAL 1 DAY
      )
    GROUP BY DATE(x.assigned_at), a.team_id
),

handled AS (
    SELECT
        DATE(e.event_time) AS stat_date,
        a.team_id,
        COUNT(DISTINCT e.aftersales_id) AS handled_count,
        COUNT(*) AS event_count
    FROM dwd_aftersales_event e
    JOIN dim_agent a
        ON e.agent_sk = a.agent_sk
    WHERE e.event_time >= CAST(@stat_date AS DATETIME)
      AND e.event_time < DATE_ADD(
          CAST(@stat_date AS DATETIME),
          INTERVAL 1 DAY
      )
      AND e.event_type IN (
          'AGENT_REPLY',
          'CONTACT_LOGISTICS',
          'HANDLE_ISSUE',
          'RESOLVED'
      )
    GROUP BY DATE(e.event_time), a.team_id
),

resolved AS (
    SELECT
        DATE(o.resolved_at) AS stat_date,
        a.team_id,
        COUNT(DISTINCT o.aftersales_id) AS resolved_count,
        SUM(
            TIMESTAMPDIFF(
                SECOND,
                o.created_at,
                o.resolved_at
            )
        ) AS resolution_seconds
    FROM dwd_aftersales_order o
    JOIN dim_agent a
        ON o.resolution_agent_sk = a.agent_sk
    WHERE o.resolved_at >= CAST(@stat_date AS DATETIME)
      AND o.resolved_at < DATE_ADD(
          CAST(@stat_date AS DATETIME),
          INTERVAL 1 DAY
      )
      AND o.status = 'RESOLVED'
    GROUP BY DATE(o.resolved_at), a.team_id
),

responsible AS (
    SELECT
        @stat_date AS stat_date,
        a.team_id,
        SUM(
            GREATEST(
                0,
                TIMESTAMPDIFF(
                    SECOND,
                    GREATEST(
                        x.assigned_at,
                        CAST(@stat_date AS DATETIME)
                    ),
                    LEAST(
                        COALESCE(x.unassigned_at, NOW()),
                        DATE_ADD(
                            CAST(@stat_date AS DATETIME),
                            INTERVAL 1 DAY
                        )
                    )
                )
            )
        ) / 60 AS responsible_minutes
    FROM fact_aftersales_assignment x
    JOIN dim_agent a
        ON x.agent_sk = a.agent_sk
    WHERE x.assigned_at < DATE_ADD(
              CAST(@stat_date AS DATETIME),
              INTERVAL 1 DAY
          )
      AND COALESCE(x.unassigned_at, NOW()) >
          CAST(@stat_date AS DATETIME)
    GROUP BY a.team_id
),

team_keys AS (
    SELECT stat_date, team_id FROM assigned
    UNION
    SELECT stat_date, team_id FROM handled
    UNION
    SELECT stat_date, team_id FROM resolved
    UNION
    SELECT stat_date, team_id FROM responsible
)

SELECT
    k.stat_date,
    k.team_id,

    COALESCE(x.assigned_count, 0),
    COALESCE(h.handled_count, 0),
    COALESCE(h.event_count, 0),
    COALESCE(r.resolved_count, 0),
    COALESCE(p.responsible_minutes, 0),

    COALESCE(r.resolution_seconds, 0) / 60,
    COALESCE(r.resolved_count, 0),

    CASE
        WHEN COALESCE(r.resolved_count, 0) > 0
        THEN ROUND(
            r.resolution_seconds / 60 / r.resolved_count,
            2
        )
        ELSE NULL
    END

FROM team_keys k
LEFT JOIN assigned x
    ON k.stat_date = x.stat_date
   AND k.team_id = x.team_id
LEFT JOIN handled h
    ON k.stat_date = h.stat_date
   AND k.team_id = h.team_id
LEFT JOIN resolved r
    ON k.stat_date = r.stat_date
   AND k.team_id = r.team_id
LEFT JOIN responsible p
    ON k.stat_date = p.stat_date
   AND k.team_id = p.team_id

ON DUPLICATE KEY UPDATE
    assigned_order_count = VALUES(assigned_order_count),
    handled_order_count = VALUES(handled_order_count),
    handled_event_count = VALUES(handled_event_count),
    resolved_order_count = VALUES(resolved_order_count),
    responsible_minutes = VALUES(responsible_minutes),
    resolution_minutes_sum = VALUES(resolution_minutes_sum),
    resolved_count_for_avg = VALUES(resolved_count_for_avg),
    avg_resolution_minutes = VALUES(avg_resolution_minutes);

```

<p v-pre>这段 SQL 体现了三个重要技术：</p>

<ul v-pre><li><div><div><p>CTE：把复杂计算拆分成多个逻辑步骤。</p></div></div></li><li><div><div><p>UNION：建立需要生成汇总记录的日期与团队组合。</p></div></div></li><li><div><div><p>ON DUPLICATE KEY UPDATE：允许同一天的数据重新计算并覆盖旧结果。</p></div></div></li></ul>

<p v-pre>注意三个生产环境细节：</p>

<ol v-pre><li><div><div><p>这版 SQL 是单日全量重算示例，实际应在事务中执行，并处理源数据同步完成标记。</p></div></div></li><li><div><div><p>如果某团队当天没有任何活动，但仍需要显示零值，需要用日期表与有效团队表生成完整日期团队组合，不能只依靠 <code>team_keys</code>。</p></div></div></li><li><div><div><p>如果历史客服团队维度发生修正，必须同步重算受影响日期的汇总结果。</p></div></div></li></ol>

### 四、建立数据质量检查机制

<p v-pre>现在进入数据开发中经常被忽略、但非常重要的环节。</p>

<p v-pre>假设你每天计算出了这些结果：</p>

<table v-pre><tbody><tr><th><p>团队</p></th><th><p>售后解决量</p></th><th><p>平均解决时长</p></th></tr><tr><td><p>A团队</p></td><td><p>120</p></td><td><p>60分钟</p></td></tr><tr><td><p>B团队</p></td><td><p>180</p></td><td><p>-20分钟</p></td></tr></tbody></table>

<p v-pre>B 团队平均解决时长为负数。</p>

<p v-pre>SQL 执行成功了，但业务结果明显不合理。</p>

<p v-pre>所以：</p>

<p v-pre><span><strong>SQL 执行成功，不代表数据计算正确。</strong></span></p>

<p v-pre>我们需要建立数据质量检查体系。</p>

#### 1. 数据质量检查的五个维度

<table v-pre><tbody><tr><th><p>检查维度</p></th><th><p>检查内容</p></th><th><p>示例</p></th></tr><tr><td><p>完整性</p></td><td><p>关键字段是否为空</p></td><td><p>售后单没有创建时间</p></td></tr><tr><td><p>唯一性</p></td><td><p>是否存在重复记录</p></td><td><p>相同来源事件重复</p></td></tr><tr><td><p>一致性</p></td><td><p>关联数据是否匹配</p></td><td><p>客服历史版本不存在</p></td></tr><tr><td><p>合理性</p></td><td><p>数值是否符合业务规律</p></td><td><p>解决时间早于创建时间</p></td></tr><tr><td><p>及时性</p></td><td><p>数据是否按时更新</p></td><td><p>订单同步延迟超过 5 分钟</p></td></tr></tbody></table>

#### 2. 检查重复售后订单

<p v-pre><div>SQL</div></p>

```sql
SELECT
    aftersales_id,
    COUNT(*) AS duplicate_count
FROM dwd_aftersales_order
GROUP BY aftersales_id
HAVING COUNT(*) > 1;
```

<p v-pre>预期结果：0 条。</p>

#### 3. 检查重复事件

<p v-pre><div>SQL</div></p>

```sql
SELECT
    source_system,
    source_event_id,
    COUNT(*) AS duplicate_count
FROM dwd_aftersales_event
GROUP BY
    source_system,
    source_event_id
HAVING COUNT(*) > 1;
```

<p v-pre>预期结果：0 条。</p>

#### 4. 检查异常解决时间

<p v-pre><div>SQL</div></p>

```sql
SELECT
    aftersales_id,
    created_at,
    resolved_at
FROM dwd_aftersales_order
WHERE resolved_at IS NOT NULL
  AND resolved_at < created_at;
```

<p v-pre>预期结果：0 条。</p>

#### 5. 检查孤立客服维度

<p v-pre><div>SQL</div></p>

```sql
SELECT
    o.aftersales_id,
    o.resolution_agent_sk
FROM dwd_aftersales_order o
LEFT JOIN dim_agent a
    ON o.resolution_agent_sk = a.agent_sk
WHERE o.resolution_agent_sk IS NOT NULL
  AND a.agent_sk IS NULL;
```

<p v-pre>预期结果：0 条。</p>

#### 6. 检查客服历史版本时间重叠

<p v-pre><div>SQL</div></p>

```sql
SELECT
    a.agent_id,
    a.agent_sk,
    b.agent_sk AS conflicting_agent_sk
FROM dim_agent a
JOIN dim_agent b
    ON a.agent_id = b.agent_id
   AND a.agent_sk < b.agent_sk
   AND a.effective_start < b.effective_end
   AND b.effective_start < a.effective_end;
```

<p v-pre>预期结果：0 条。</p>

<p v-pre>这条 SQL 能发现同一个客服的历史版本时间区间重叠。</p>

<p v-pre>但还需要检查版本间的空档，以及是否存在多个当前版本。</p>

#### 7. 检查负责人分配区间

<p v-pre><div>SQL</div></p>

```sql
SELECT
    a.aftersales_id,
    a.assignment_id,
    b.assignment_id AS conflict_id
FROM fact_aftersales_assignment a
JOIN fact_aftersales_assignment b
    ON a.aftersales_id = b.aftersales_id
   AND a.assignment_id < b.assignment_id
   AND a.assigned_at <
       COALESCE(b.unassigned_at, '9999-12-31')
   AND b.assigned_at <
       COALESCE(a.unassigned_at, '9999-12-31');
```

<p v-pre>预期结果：0 条。</p>

<p v-pre>注意，这个检查是按照不允许同时存在两个负责人设计的。如果企业业务允许多人共同负责，就必须调整规则。</p>

#### 8. 检查每日汇总数据

<p v-pre><div>SQL</div></p>

```sql
SELECT
    stat_date,
    team_id,
    assigned_order_count,
    handled_order_count,
    resolved_order_count,
    avg_resolution_minutes
FROM ads_aftersales_team_daily
WHERE assigned_order_count < 0
   OR handled_order_count < 0
   OR resolved_order_count < 0
   OR avg_resolution_minutes < 0;
```

<p v-pre>预期结果：0 条。</p>

<p v-pre>另外，还应该验证汇总表中的解决订单数、解决时长总和能否与明细表重新聚合的结果一致。</p>

### 五、建立数据质量管理表

<p v-pre>前面的 SQL 都是检查语句，但生产系统不能每天靠开发人员手动执行。</p>

<p v-pre>建议建立：</p>

<p v-pre><code>etl_data_quality_log</code></p>

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE etl_data_quality_log (
    id BIGINT NOT NULL AUTO_INCREMENT,
    check_date DATE NOT NULL COMMENT '检查日期',
    table_name VARCHAR(128) NOT NULL COMMENT '数据表',
    check_code VARCHAR(64) NOT NULL COMMENT '检查规则编码',
    check_name VARCHAR(128) NOT NULL COMMENT '检查名称',
    check_status VARCHAR(20) NOT NULL COMMENT 'PASS/FAIL',
    error_count BIGINT NOT NULL DEFAULT 0 COMMENT '异常数量',
    error_message VARCHAR(1000) DEFAULT NULL COMMENT '异常说明',
    checked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_check_date (check_date, check_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='数据质量检查日志';
```

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>检查项目</p></th><th><p>结果</p></th><th><p>异常数量</p></th></tr><tr><td><p>售后订单唯一性</p></td><td><p>PASS</p></td><td><p>0</p></td></tr><tr><td><p>事件唯一性</p></td><td><p>PASS</p></td><td><p>0</p></td></tr><tr><td><p>解决时间合理性</p></td><td><p>FAIL</p></td><td><p>3</p></td></tr><tr><td><p>客服维度关联</p></td><td><p>PASS</p></td><td><p>0</p></td></tr><tr><td><p>团队版本重叠</p></td><td><p>PASS</p></td><td><p>0</p></td></tr></tbody></table>

<p v-pre>建议将质量检查集成到 Celery 定时任务中：</p>

<p v-pre><span><strong>每日数据加工流程</strong></span></p>

<ol v-pre><li><div><div><span>同步业务数据</span></div></div></li><li><div><div><span>执行数据清洗和去重</span></div></div></li><li><div><div><span>计算售后指标</span></div></div></li><li><div><div><span>生成每日汇总表</span></div></div></li><li><div><div><span>执行数据质量检查</span></div></div></li><li><div><div><span>记录任务日志和质量结果</span></div></div></li><li><div><div><span>检查通过后更新数据就绪状态</span></div></div></li></ol>

<p v-pre>如果核心数据质量检查失败，不应该直接把错误汇总结果发布给经营看板。</p>

### 六、形成完整数据库设计文档 V1.0

<p v-pre>现在把本课已经完成的成果整理成一份数据库设计文档。</p>

### 售后数据分析系统

<p v-pre>Database Design Specification</p>

<p v-pre><div>V1.0 草稿</div></p>

<p v-pre><span><strong>1. 项目技术架构</strong></span></p>

<ul v-pre><li><div><div><p>数据库：MySQL 8.0</p></div></div></li><li><div><div><p>数据处理：Python + SQLAlchemy</p></div></div></li><li><div><div><p>定时任务：Celery + Redis</p></div></div></li><li><div><div><p>API：FastAPI</p></div></div></li><li><div><div><p>前端：React + TypeScript + ECharts</p></div></div></li><li><div><div><p>数据架构：ODS → DWD → ADS</p></div></div></li></ul>

<p v-pre><span><strong>2. 核心数据表清单</strong></span></p>

<table v-pre><tbody><tr><th><p>表名</p></th><th><p>类型</p></th><th><p>粒度</p></th></tr><tr><td><p><code>dim_team</code></p></td><td><p>维度表</p></td><td><p>一个团队一行</p></td></tr><tr><td><p><code>dim_agent</code></p></td><td><p>历史维度表</p></td><td><p>一个客服版本一行</p></td></tr><tr><td><p><code>dim_issue_type</code></p></td><td><p>维度表</p></td><td><p>一种售后类型一行</p></td></tr><tr><td><p><code>dim_logistics</code></p></td><td><p>维度表</p></td><td><p>一个物流对象一行</p></td></tr><tr><td><p><code>dim_aftersales_sla_rule</code></p></td><td><p>规则维度表</p></td><td><p>一条规则版本一行</p></td></tr><tr><td><p><code>dwd_aftersales_order</code></p></td><td><p>事实表</p></td><td><p>一笔售后申请一行</p></td></tr><tr><td><p><code>dwd_aftersales_event</code></p></td><td><p>事实表</p></td><td><p>一次业务事件一行</p></td></tr><tr><td><p><code>fact_aftersales_assignment</code></p></td><td><p>事实表</p></td><td><p>一次负责人分配周期一行</p></td></tr><tr><td><p><code>fact_complaint</code></p></td><td><p>事实表</p></td><td><p>一次投诉一行</p></td></tr><tr><td><p><code>ads_aftersales_team_daily</code></p></td><td><p>汇总表</p></td><td><p>一个日期、一个团队一行</p></td></tr><tr><td><p><code>etl_data_quality_log</code></p></td><td><p>质量日志表</p></td><td><p>一次质量检查一行</p></td></tr></tbody></table>

<p v-pre><span><strong>3. 核心业务关系</strong></span></p>

<ul v-pre><li><div><div><p>售后订单与处理事件：1:N</p></div></div></li><li><div><div><p>售后订单与负责人分配历史：1:N</p></div></div></li><li><div><div><p>客服历史版本与售后订单：1:N</p></div></div></li><li><div><div><p>售后类型与售后订单：1:N</p></div></div></li><li><div><div><p>售后订单与投诉：1:N</p></div></div></li></ul>

<p v-pre><span><strong>4. 数据建模规范</strong></span></p>

<ul v-pre><li><div><div><p>每张表必须定义数据粒度。</p></div></div></li><li><div><div><p>每张事实表必须定义主键。</p></div></div></li><li><div><div><p>客服和 SLA 采用历史版本管理。</p></div></div></li><li><div><div><p>事件数据必须支持幂等同步。</p></div></div></li><li><div><div><p>一对多 JOIN 前必须先检查粒度。</p></div></div></li><li><div><div><p>汇总表保留可重新计算的分子、分母。</p></div></div></li><li><div><div><p>统计日期使用统一时区和左闭右开区间。</p></div></div></li></ul>

<p v-pre><span><strong>5. 指标加工规则</strong></span></p>

<ul v-pre><li><div><div><p>接手订单量按分配时间统计。</p></div></div></li><li><div><div><p>参与处理订单量按有效客服事件统计。</p></div></div></li><li><div><div><p>最终解决订单量按解决日期统计。</p></div></div></li><li><div><div><p>负责时长按分配时间区间拆分。</p></div></div></li><li><div><div><p>平均解决时长按总时长除以已解决订单数。</p></div></div></li></ul>

<p v-pre><span><strong>6. 数据质量规则</strong></span></p>

<ul v-pre><li><div><div><p>主键唯一。</p></div></div></li><li><div><div><p>来源事件唯一。</p></div></div></li><li><div><div><p>订单时间合理。</p></div></div></li><li><div><div><p>维度关联完整。</p></div></div></li><li><div><div><p>历史版本无重叠。</p></div></div></li><li><div><div><p>负责人分配区间符合业务约束。</p></div></div></li><li><div><div><p>汇总结果与明细重新计算一致。</p></div></div></li></ul>

<p v-pre><span><strong>7. 数据任务</strong></span></p>

<table v-pre><tbody><tr><th><p>任务</p></th><th><p>频率</p></th></tr><tr><td><p>售后订单同步</p></td><td><p>5分钟</p></td></tr><tr><td><p>售后事件同步</p></td><td><p>1～5分钟</p></td></tr><tr><td><p>客服维度同步</p></td><td><p>发生变更时</p></td></tr><tr><td><p>SLA 状态计算</p></td><td><p>5分钟</p></td></tr><tr><td><p>每日团队汇总</p></td><td><p>每日及历史补算</p></td></tr><tr><td><p>数据质量检查</p></td><td><p>每次加工后</p></td></tr></tbody></table>

<p v-pre>说明：这是目前课程设计成果的文档化版本，仍有若干业务规则和生产约束待验证，不应直接视为已经验收的生产数据库方案。</p>

#### 七、还有三个设计问题需要在正式开发前解决

<p v-pre>我特别指出三个目前模型中的不足：</p>

<p v-pre><span><strong>1. 团队历史版本的完整性</strong></span></p>

<p v-pre>需要保证客服调岗后，旧版本关闭、新版本生效，且不能出现重叠或无意的时间空档。</p>

<p v-pre><span><strong>2. SLA 超时汇总</strong></span></p>

<p v-pre>当前团队汇总 SQL 尚未加工 <code>overtime_order_count</code>。而且已解决超时与当前未解决超时应该分别统计，不能只靠一个字段混合计算。</p>

<p v-pre><span><strong>3. 投诉指标</strong></span></p>

<p v-pre>投诉可能在售后解决后发生，所以投诉量必须按照投诉时间统计，不能简单按照售后解决日期统计。</p>

<p v-pre>这三个问题建议在后续开发设计评审中单独确认。</p>

### 八、实战问题 6：数据质量出现异常，应该怎么办？

<p v-pre>假设每天凌晨的售后指标任务运行完成。</p>

<p v-pre>系统发现：</p>

<ul v-pre><li><div><div><p>售后订单表有 5 条重复记录。</p></div></div></li><li><div><div><p>处理事件表有 12 条重复记录。</p></div></div></li><li><div><div><p>每日汇总表已经成功生成。</p></div></div></li><li><div><div><p>前端看板已经展示这些结果。</p></div></div></li></ul>

<p v-pre>你作为数据开发负责人，会如何处理？</p>

<p v-pre><div><label>A. 不影响页面使用，先展示结果，之后再修复。</label></div><div><label>B. 标记本批次数据质量失败，阻止错误结果发布，排查重复来源，修复后重新计算汇总。</label></div><div><label>C. 直接删除重复数据，然后不重新计算汇总表。</label></div><div><label>D. 只修复前端显示数字，不修改底层数据。</label></div></p>

<p v-pre><span><strong>请说明你的处理思路</strong></span></p>

```text
修复
```

<p v-pre><span class="interaction"><span>提交答案，继续学习</span></span></p>

#### 九、第三课学习进度

#### 第三课：数据架构与数据建模

<p v-pre>学习成果完成情况</p>

#### 约 85%

<p v-pre>数据分层架构</p>

<p v-pre>事实表与维度表</p>

<p v-pre>数据粒度与 JOIN</p>

<p v-pre>SCD2 历史维度</p>

<p v-pre>ER 图与 MySQL 建表</p>

<p v-pre>客服转交与团队统计</p>

<p v-pre>团队每日指标汇总 SQL</p>

<p v-pre>数据质量检查</p>

<p v-pre>数据库设计评审</p>

<p v-pre>最终开发验收</p>

<p v-pre><span><strong>完成第三课后，你应该具备的能力：</strong></span></p>

<p v-pre>不只是会创建 MySQL 表，而是能够：</p>

<ol v-pre><li><div><div><p>根据业务需求确定数据粒度。</p></div></div></li><li><div><div><p>设计事实表、维度表和历史维度。</p></div></div></li><li><div><div><p>设计一对多业务关系。</p></div></div></li><li><div><div><p>避免 JOIN 扇出导致的数据错误。</p></div></div></li><li><div><div><p>编写可复用的指标汇总 SQL。</p></div></div></li><li><div><div><p>建立数据质量检查和任务监控机制。</p></div></div></li><li><div><div><p>输出开发人员可以执行的数据库设计文档。</p></div></div></li></ol>

<p v-pre>完成最后一道题，我们就可以进入第四课：<span><strong>数据 ETL 开发与指标计算实战</strong></span>，开始使用 Python、SQLAlchemy、Celery 和 MySQL，把这套设计真正运行起来。</p>

## 第 22 轮　数据库设计评审与开发验收 {#turn-22}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第三课实战问题6，我选择：B。理由：修复。请评价我的数据质量管理思路，并带我完成第三课最后的数据库设计评审与开发验收。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第三课收官：数据库设计评审与开发验收

<p v-pre><div>实战问题6：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：标记数据质量失败，阻止错误结果发布，排查并修复重复数据，然后重新计算汇总。</strong></span></p>

<p v-pre>你的理由是「修复」，方向正确，但还不够完整。</p>

<p v-pre>数据开发负责人不仅要考虑如何修复问题，还要考虑：</p>

<p v-pre><span><strong>如何阻止错误数据影响业务，以及如何证明修复后的数据是正确的。</strong></span></p>

#### 一、评价你的数据质量管理思路

<p v-pre>假设系统发现：</p>

<ul v-pre><li><div><div><p>售后订单重复 5 条。</p></div></div></li><li><div><div><p>处理事件重复 12 条。</p></div></div></li><li><div><div><p>每日汇总表已经生成。</p></div></div></li><li><div><div><p>前端正在展示错误结果。</p></div></div></li></ul>

<p v-pre>正确的处理流程是：</p>

<ol v-pre><li><div><div><p><span><strong>发现异常</strong></span></p><p>数据质量检查发现重复记录，标记本批次 <code>FAILED</code>。</p></div></div></li><li><div><div><p><span><strong>隔离错误数据</strong></span></p><p>阻止当前批次发布。如果错误数据已经发布，则标记看板数据异常，并回退到最近一次验证通过的版本（如有）。</p></div></div></li><li><div><div><p><span><strong>定位根因</strong></span></p><p>检查是重复采集、同步任务重试，还是数据去重逻辑失效。</p></div></div></li><li><div><div><p><span><strong>修复底层数据</strong></span></p><p>按业务唯一键去重，修复同步程序的幂等逻辑，保留必要的审计记录。</p></div></div></li><li><div><div><p><span><strong>重新计算并验证</strong></span></p><p>重新生成受影响日期的汇总，核对明细与指标，质量检查通过后再发布。</p></div></div></li></ol>

<p v-pre>你需要记住一个完整的处理闭环：</p>

<p v-pre><span><strong>发现 → 隔离 → 定位 → 修复 → 重算 → 验证 → 发布。</strong></span></p>

<p v-pre>这比简单地「发现问题就修复」更接近生产环境中的数据质量管理。</p>

### 二、正式数据库设计评审 {#database-design-review}

<p v-pre>现在我们模拟一次技术评审。</p>

<p v-pre>假设你是数据开发负责人，参加评审的还有后端开发、数据分析师和测试人员。</p>

<p v-pre>评审重点不是 SQL 能否执行，而是数据库设计是否真正满足业务需求。</p>

#### 1. 核心设计评审

<table v-pre><tbody><tr><th><p>评审项</p></th><th><p>当前设计</p></th><th><p>结论</p></th></tr><tr><td><p>数据分层</p></td><td><p>ODS → DWD → ADS</p></td><td><p>通过</p></td></tr><tr><td><p>售后订单粒度</p></td><td><p>一笔售后申请一行</p></td><td><p>通过</p></td></tr><tr><td><p>处理事件粒度</p></td><td><p>一次业务事件一行</p></td><td><p>通过</p></td></tr><tr><td><p>客服历史归属</p></td><td><p>SCD Type 2</p></td><td><p>通过</p></td></tr><tr><td><p>客服转交历史</p></td><td><p>分配周期事实表</p></td><td><p>通过</p></td></tr><tr><td><p>团队指标归属</p></td><td><p>按接手、参与、解决分别统计</p></td><td><p>通过</p></td></tr><tr><td><p>数据幂等</p></td><td><p>来源业务键唯一约束</p></td><td><p>设计通过，待验证</p></td></tr><tr><td><p>SLA 指标</p></td><td><p>已定义基础规则</p></td><td><p>待完善</p></td></tr><tr><td><p>事件与工作时长</p></td><td><p>尚缺状态区间规则</p></td><td><p>待完善</p></td></tr><tr><td><p>数据质量</p></td><td><p>已设计检查 SQL</p></td><td><p>待验证</p></td></tr><tr><td><p>发布与回滚</p></td><td><p>尚未实现版本隔离</p></td><td><p>待完善</p></td></tr></tbody></table>

<p v-pre>这里的「通过」表示课堂逻辑设计评审通过，不代表已经执行数据库测试。</p>

#### 2. 发现三个需要修正的问题

##### 问题 A：SCD2 历史版本不能只靠时间关联

<p v-pre>之前我们使用 <code>agent_sk</code> 关联客服历史版本，这是正确方向。</p>

<p v-pre>但还有一种情况：</p>

<p v-pre>客服 10:00 属于 A 团队，10:30 调到 B 团队，而某笔售后订单从 09:00 持续处理到 11:00。</p>

<p v-pre>此时，<span><strong>一次负责人分配周期可能跨越客服调岗时间</strong></span>。</p>

<p v-pre>因此，必须进一步明确：</p>

<ul v-pre><li><div><div><p>处理事件按照事件发生时的团队归属。</p></div></div></li><li><div><div><p>接手订单量按照接手时的团队归属。</p></div></div></li><li><div><div><p>最终解决订单量按照解决时责任人的团队归属。</p></div></div></li><li><div><div><p>负责时长如果按实际历史团队归属统计，需要在团队变更时拆分责任区间。</p></div></div></li></ul>

<p v-pre>不能只用分配开始时的 <code>agent_sk</code> 计算整个跨团队时间段。</p>

##### 问题 B：SLA 超时率的统计口径还需要完善

<p v-pre>我们之前约定按照 SLA 到期日期统计。</p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>售后单</p></th><th><p>SLA 截止时间</p></th><th><p>实际解决时间</p></th><th><p>是否超时</p></th></tr><tr><td><p>A001</p></td><td><p>11:00</p></td><td><p>10:50</p></td><td><p>否</p></td></tr><tr><td><p>A002</p></td><td><p>11:00</p></td><td><p>11:30</p></td><td><p>是</p></td></tr><tr><td><p>A003</p></td><td><p>11:00</p></td><td><p>未解决</p></td><td><p>是</p></td></tr></tbody></table>

<p v-pre>对于已经到期的这三笔售后：</p>

<p v-pre><div><span><span><span>超时率=23×100%=66.67%超时率=\frac{2}{3}\times100\%=66.67\%</span></span></span></div></p>

<p v-pre>但还需要处理取消、重开、暂停和延迟到达的数据。</p>

<p v-pre>因此，SLA 口径应在 PRD 中单独形成一份规则说明，并配置对应的测试用例。</p>

##### 问题 C：指标发布需要增加版本控制

<p v-pre>之前设计的 <code>ON DUPLICATE KEY UPDATE</code> 可以重复计算汇总数据，但如果直接覆盖线上结果，可能出现用户读取到部分更新数据的情况。</p>

<p v-pre>建议采用：</p>

<p v-pre><span><strong>计算新批次指标</strong></span></p>

<p v-pre><span><strong>写入临时结果 / 带批次号的结果</strong></span></p>

<p v-pre><span><strong>执行数据质量检查</strong></span></p>

<p v-pre><span><strong>通过后原子切换已发布批次</strong></span></p>

<p v-pre>这样可以避免错误批次直接污染线上看板，也为回滚提供基础。</p>

### 三、数据库开发验收清单

<p v-pre>下面是一份可以在实际项目中使用的验收清单。</p>

<p v-pre><span><strong>开发验收检查</strong></span></p>

<p v-pre>0/11 项</p>

<p v-pre><div><label><span>所有核心表成功创建，主键与索引符合设计</span></label></div><div><label><span>售后订单与事件的一对多关系正确</span></label></div><div><label><span>客服调岗后历史团队统计正确</span></label></div><div><label><span>客服转交后接手、参与、解决指标正确</span></label></div><div><label><span>重复同步不会产生重复业务记录</span></label></div><div><label><span>平均解决时长不会因 JOIN 扇出而失真</span></label></div><div><label><span>跨天负责人时长可以正确拆分</span></label></div><div><label><span>SLA 边界、取消、重开等规则验证通过</span></label></div><div><label><span>异常数据能阻止错误指标发布</span></label></div><div><label><span>修复后可以重新计算并核对历史指标</span></label></div><div><label><span>主要查询满足约定的性能目标</span></label></div></p>

<p v-pre>这是实际执行时使用的验收清单。目前尚未运行数据库测试，默认所有项目均未勾选。</p>

#### 四、第三课最终交付成果

#### 数据库设计说明书 V1.0

<p v-pre>课堂设计评审完成 · 开发验证待执行</p>

<p v-pre><span><strong>已完成的设计成果</strong></span></p>

<ul v-pre><li><div><div><p>数据分层架构：ODS / DWD / ADS。</p></div></div></li><li><div><div><p>核心事实表：售后订单、处理事件、客服分配、投诉。</p></div></div></li><li><div><div><p>核心维度表：客服、团队、售后类型、物流、SLA 规则。</p></div></div></li><li><div><div><p>SCD2 历史版本管理方案。</p></div></div></li><li><div><div><p>售后业务 ER 关系图。</p></div></div></li><li><div><div><p>MySQL 核心建表 SQL。</p></div></div></li><li><div><div><p>团队每日指标汇总 SQL。</p></div></div></li><li><div><div><p>数据质量检查 SQL。</p></div></div></li><li><div><div><p>数据发布和验收策略初版。</p></div></div></li></ul>

<p v-pre><span><strong>尚未完成的工程验证</strong></span></p>

<ul v-pre><li><div><div><p>在真实 MySQL 8.0 环境执行完整建表脚本。</p></div></div></li><li><div><div><p>使用模拟数据运行所有指标 SQL。</p></div></div></li><li><div><div><p>校验客服调岗、转交和重开边界。</p></div></div></li><li><div><div><p>实现完整 SLA 超时统计。</p></div></div></li><li><div><div><p>执行性能测试和索引优化。</p></div></div></li><li><div><div><p>实现可靠的数据批次发布与回滚。</p></div></div></li></ul>

<p v-pre><span><strong>设计学习阶段</strong></span></p>

<p v-pre><div>完成</div></p>

<p v-pre><span><strong>生产开发验收</strong></span></p>

<p v-pre><div>待执行</div></p>

### 五、进入第四课：ETL 数据开发实战

<p v-pre>第三课已经完成了核心建模训练。下一步，我们要让设计真正运行起来。</p>

#### 第四课：从业务数据到分析指标

<p v-pre><span><strong>业务系统 MySQL</strong></span></p>

<p v-pre>订单、售后、客服事件</p>

<p v-pre><span><strong>Python + SQLAlchemy</strong></span></p>

<p v-pre>增量抽取、清洗、去重、数据入库</p>

<p v-pre><span><strong>MySQL ODS / DWD</strong></span></p>

<p v-pre>保存原始数据和标准化明细</p>

<p v-pre><span><strong>指标加工与质量检查</strong></span></p>

<p v-pre>生成 ADS、检查口径、验证结果</p>

<p v-pre><span><strong>Celery Beat 定时调度</strong></span></p>

<p v-pre>周期执行、失败重试、任务日志</p>

#### 第四课实战问题1：如何实现增量同步？

<p v-pre>假设售后业务系统每天新增 3 万条订单，部分历史订单还会更新状态。</p>

<p v-pre>我们每 5 分钟同步一次数据。</p>

<p v-pre>你认为哪种同步方案更合适？</p>

<p v-pre><div><label>A. 每 5 分钟全量读取所有历史订单，并删除重建分析表。</label></div><div><label>B. 根据源系统更新时间进行增量抽取，使用稳定业务主键幂等写入，并保存同步进度。</label></div><div><label>C. 只同步新增订单，不处理历史订单状态变化。</label></div><div><label>D. 每天人工导出一次 Excel，不需要自动同步。</label></div></p>

<p v-pre><span><strong>请说明你的选择理由</strong></span></p>

```text
性能
```

<p v-pre><span class="interaction"><span>提交答案，开始第四课</span></span></p>

<p v-pre>第三课最值得带走的经验是：</p>

<p v-pre><span><strong>数据建模不仅要让数据能够存进去，更要保证历史可追溯、指标可计算、结果可验证、异常可恢复。</strong></span></p>

<p v-pre>这四项能力，将贯穿后面的 ETL 开发、API 设计和数据看板建设。</p>
