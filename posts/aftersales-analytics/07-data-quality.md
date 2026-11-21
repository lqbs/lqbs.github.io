---
title: "第七章　数据验证与质量治理"
description: "用对账、异常隔离和指标版本管理保证数据可信。"
outline: [2, 2]
prev:
  text: "第六章　React 与 ECharts 看板"
  link: "/posts/aftersales-analytics/06-dashboard"
next:
  text: "第八章　部署、上线与运维"
  link: "/posts/aftersales-analytics/08-deployment"
---

# 第七章　数据验证与质量治理

用对账、异常隔离和指标版本管理保证数据可信。

[返回完整目录](/posts/aftersales-analytics-from-scratch#完整目录)

## 第 35 轮　数据完整性、指标复算和质量规则 {#turn-35}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>下一课</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第七课：数据验证、测试与质量保障

<p v-pre>前六课，我们已经完成了售后数据分析系统从业务需求、数据建模、ETL、API 到 React 看板的设计学习。</p>

<p v-pre>这一课我们要解决一个更重要的问题：</p>

<p v-pre><span><strong>如何证明系统展示的数据是正确的？</strong></span></p>

<p v-pre>因为数据分析系统最危险的故障，不一定是页面打不开，而是页面正常显示，却展示了错误的数据。</p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>售后订单实际有 1,280 单，系统显示 1,180 单。</p></div></div></li><li><div><div><p>团队平均解决时长显示 58 分钟，实际应该是 76 分钟。</p></div></div></li><li><div><div><p>SLA 超时率显示 8%，实际是 12.5%。</p></div></div></li><li><div><div><p>同一个售后订单被重复统计。</p></div></div></li></ul>

<p v-pre>这些问题可能直接误导老板和售后主管的经营决策。</p>

#### 一、本课学习目标

<p v-pre>本课仍然使用我们一直在开发的售后分析系统。</p>

<table v-pre><tbody><tr><th><p>模块</p></th><th><p>学习内容</p></th><th><p>实战成果</p></th></tr><tr><td><p>1</p></td><td><p>数据完整性验证</p></td><td><p>源数据与目标数据核对</p></td></tr><tr><td><p>2</p></td><td><p>指标口径验证</p></td><td><p>KPI 计算正确性</p></td></tr><tr><td><p>3</p></td><td><p>数据质量管理</p></td><td><p>自动化质量规则</p></td></tr><tr><td><p>4</p></td><td><p>API 测试</p></td><td><p>接口与权限验证</p></td></tr><tr><td><p>5</p></td><td><p>前端测试</p></td><td><p>图表与交互验证</p></td></tr><tr><td><p>6</p></td><td><p>端到端测试</p></td><td><p>完整业务链路验证</p></td></tr><tr><td><p>7</p></td><td><p>上线验收</p></td><td><p>质量验收报告</p></td></tr></tbody></table>

#### 二、先建立质量保障体系

<p v-pre>数据分析系统不能只依赖一个测试环节。</p>

<p v-pre>我们建立五层质量保障：</p>

<p v-pre><span><strong>第一层：源数据质量</strong></span></p>

<p v-pre>数据是否完整、是否重复、字段是否合法</p>

<p v-pre><span><strong>第二层：ETL 质量</strong></span></p>

<p v-pre>数据是否遗漏、是否重复、转换是否正确</p>

<p v-pre><span><strong>第三层：指标质量</strong></span></p>

<p v-pre>统计口径、计算公式、聚合结果是否正确</p>

<p v-pre><span><strong>第四层：API 与前端质量</strong></span></p>

<p v-pre>接口、权限、数据映射、图表是否正确</p>

<p v-pre><span><strong>第五层：业务验收</strong></span></p>

<p v-pre>售后主管能否根据数据正确发现和定位问题</p>

### 三、第一课题：数据完整性验证

<p v-pre>假设业务 MySQL 有一张售后订单表：</p>

<p v-pre><code>dwd_aftersales_order</code></p>

<p v-pre>ETL 将数据加工到：</p>

<p v-pre><code>ads_aftersales_daily</code></p>

<p v-pre>现在发现：</p>

<table v-pre><tbody><tr><th><p>数据表</p></th><th><p>售后订单量</p></th></tr><tr><td><p>业务源表</p></td><td><p>10,000</p></td></tr><tr><td><p>ADS 汇总表对应明细去重数量</p></td><td><p>9,850</p></td></tr><tr><td><p>差异</p></td><td><p>150</p></td></tr></tbody></table>

<p v-pre>这说明有 150 单没有被正确纳入目标统计，或者统计范围、过滤条件存在差异。</p>

<p v-pre>我们需要回答：</p>

<ol v-pre><li><div><div><p>是 ETL 漏同步？</p></div></div></li><li><div><div><p>是重复数据？</p></div></div></li><li><div><div><p>是数据过滤条件错误？</p></div></div></li><li><div><div><p>是统计日期口径不一致？</p></div></div></li><li><div><div><p>是数据尚未完成加工？</p></div></div></li></ol>

#### 1. 基础数据核对 SQL

<p v-pre>源数据：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    COUNT(DISTINCT aftersales_id) AS total_count
FROM dwd_aftersales_order
WHERE created_at >= '2026-11-01'
  AND created_at < '2026-11-21';
```

<p v-pre>目标数据：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    SUM(created_order_count) AS total_count
FROM ads_aftersales_daily
WHERE stat_date >= '2026-11-01'
  AND stat_date < '2026-11-21';
```

<p v-pre>注意：这里假设 ADS 的统计粒度和去重规则与源表一致。正式核对时还需要检查数据版本、软删除、有效状态和重复业务主键，不能只比较两个总数。</p>

#### 2. 计算差异率

<p v-pre><div><span><span><span>差异率=∣源数据量−目标数据量∣源数据量×100%差异率 = \frac{|源数据量-目标数据量|} {源数据量}\times100\%</span></span></span></div></p>

<p v-pre>例如：</p>

<p v-pre><div><span><span><span>∣10000−9850∣10000×100%=1.5%\frac{|10000-9850|}{10000} \times100\%=1.5\%</span></span></span></div></p>

<p v-pre>对于核心订单数量指标，我们希望差异率为 0。</p>

<p v-pre>但某些经过业务过滤的指标允许源表和目标表数量不同，必须先定义预期过滤规则。</p>

### 四、第二课题：指标口径验证

<p v-pre>这是数据分析系统中最容易出现隐蔽错误的地方。</p>

<p v-pre>假设 11 月团队 B 的售后订单数据：</p>

<table v-pre><tbody><tr><th><p>订单</p></th><th><p>解决时长</p></th></tr><tr><td><p>A001</p></td><td><p>30分钟</p></td></tr><tr><td><p>A002</p></td><td><p>40分钟</p></td></tr><tr><td><p>A003</p></td><td><p>50分钟</p></td></tr><tr><td><p>A004</p></td><td><p>60分钟</p></td></tr><tr><td><p>A005</p></td><td><p>120分钟</p></td></tr></tbody></table>

<p v-pre>正确平均解决时长：</p>

<p v-pre><div><span><span><span>30+40+50+60+1205=60\frac{30+40+50+60+120}{5}=60</span></span></span></div></p>

<p v-pre>但是，如果 ADS 每天保存平均解决时长，API 又直接对每日平均值求平均，就可能产生错误结果。</p>

<p v-pre>因此，我们需要保存可加总的指标：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>resolution_minutes_sum resolved_order_count</span></code></div></p>

<p v-pre>计算：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    SUM(resolution_minutes_sum)
    / NULLIF(SUM(resolved_order_count), 0)
    AS avg_resolution_minutes
FROM ads_aftersales_team_daily
WHERE team_id = 102
  AND stat_date BETWEEN
      '2026-11-01' AND '2026-11-20';
```

<p v-pre><span><strong>本课的核心原则：重要指标必须可以通过明细数据独立复算。</strong></span></p>

### 五、第三课题：建立自动化数据质量规则

<p v-pre>我们把质量规则分为五类。</p>

<table v-pre><tbody><tr><th><p>规则类型</p></th><th><p>检查内容</p></th><th><p>示例</p></th></tr><tr><td><p>完整性</p></td><td><p>是否缺少必要字段</p></td><td><p>售后单号不能为空</p></td></tr><tr><td><p>唯一性</p></td><td><p>是否存在重复记录</p></td><td><p>售后单号重复</p></td></tr><tr><td><p>合法性</p></td><td><p>字段值是否合理</p></td><td><p>解决时长不能为负数</p></td></tr><tr><td><p>一致性</p></td><td><p>多张表之间是否匹配</p></td><td><p>团队 ID 必须存在</p></td></tr><tr><td><p>时效性</p></td><td><p>数据是否及时更新</p></td><td><p>ETL 延迟不超过约定阈值</p></td></tr></tbody></table>

#### 1. 示例 SQL

<p v-pre>检查重复订单：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    aftersales_id,
    COUNT(*) AS duplicate_count
FROM dwd_aftersales_order
GROUP BY aftersales_id
HAVING COUNT(*) > 1;
```

<p v-pre>检查非法解决时长：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    aftersales_id,
    resolution_minutes
FROM dwd_aftersales_order
WHERE resolution_minutes < 0;
```

<p v-pre>检查缺失团队：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    o.aftersales_id,
    o.team_id
FROM dwd_aftersales_order o
LEFT JOIN dim_team t
    ON o.team_id = t.team_id
WHERE o.team_id IS NOT NULL
  AND t.team_id IS NULL;
```

#### 2. Python 自动化质量检查

<p v-pre><div>Python</div></p>

```text
def validate_aftersales_data(df):
    errors = []

    if df["aftersales_id"].isna().any():
        errors.append("售后单号存在空值")

    if df["aftersales_id"].duplicated().any():
        errors.append("存在重复售后单")

    if (df["resolution_minutes"].dropna() < 0).any():
        errors.append("解决时长存在负数")

    return {
        "passed": len(errors) == 0,
        "errors": errors,
    }
```

<p v-pre>这里我们把数据质量检查设计成独立模块，方便 ETL、补偿任务和每日数据发布共同调用。</p>

<p v-pre>对于核心质量规则，如果检查失败，应该阻止受影响的 ADS 数据发布，而不是只记录一条日志后继续展示错误结果。</p>

### 六、第四课题：测试 API 和前端

<p v-pre>这一部分是对第五课、第六课的复习与提升。</p>

#### API 测试重点

<table v-pre><tbody><tr><th><p>测试对象</p></th><th><p>验证内容</p></th></tr><tr><td><p>参数</p></td><td><p>日期范围是否合法</p></td></tr><tr><td><p>权限</p></td><td><p>是否存在跨团队访问</p></td></tr><tr><td><p>指标</p></td><td><p>是否与 SQL 计算一致</p></td></tr><tr><td><p>分页</p></td><td><p>是否重复、遗漏</p></td></tr><tr><td><p>空数据</p></td><td><p>是否正确返回 null 或空列表</p></td></tr><tr><td><p>异常</p></td><td><p>数据库故障时是否正确处理</p></td></tr></tbody></table>

#### React 测试重点

<table v-pre><tbody><tr><th><p>测试对象</p></th><th><p>验证内容</p></th></tr><tr><td><p>KPI 卡片</p></td><td><p>数字和单位是否正确</p></td></tr><tr><td><p>趋势图</p></td><td><p>日期和数值是否对应</p></td></tr><tr><td><p>团队筛选</p></td><td><p>是否触发正确请求</p></td></tr><tr><td><p>图表下钻</p></td><td><p>是否查询正确的团队和时间口径</p></td></tr><tr><td><p>Loading</p></td><td><p>是否正常显示</p></td></tr><tr><td><p>Error</p></td><td><p>是否可以重试</p></td></tr><tr><td><p>Empty</p></td><td><p>是否正确提示</p></td></tr></tbody></table>

#### 端到端测试

<p v-pre>最终我们要验证完整链路：</p>

<p v-pre><span><strong>业务系统新增售后申请</strong></span></p>

<p v-pre><span><strong>ETL 增量同步</strong></span></p>

<p v-pre><span><strong>MySQL ADS 指标计算</strong></span></p>

<p v-pre><span><strong>FastAPI 返回指标</strong></span></p>

<p v-pre><span><strong>React 看板展示正确结果</strong></span></p>

<p v-pre>测试人员可以构造一条已知数据的售后申请，从源数据开始一直跟踪到最终页面，确认订单是否被正确统计。</p>

### 七、第七课实战问题1：如何处理数据量不一致？

<p v-pre>现在进入实战。</p>

<p v-pre>假设售后系统每天同步 10,000 条订单。</p>

<p v-pre>某天 ETL 运行完成后：</p>

<table v-pre><tbody><tr><th><p>项目</p></th><th><p>数量</p></th></tr><tr><td><p>源系统符合条件的订单</p></td><td><p>10,000</p></td></tr><tr><td><p>目标系统符合条件的订单</p></td><td><p>9,850</p></td></tr><tr><td><p>差异</p></td><td><p>150</p></td></tr></tbody></table>

<p v-pre>你准备如何处理？</p>

<p v-pre><div><label>A. 忽略差异，因为 1.5% 的误差不影响整体趋势。</label></div><div><label>B. 暂停相关指标发布，定位缺失订单，检查 ETL、过滤条件和统计口径，修复后重新对账。</label></div><div><label>C. 直接把目标数量修改成 10,000，不需要检查明细。</label></div><div><label>D. 删除目标表，重新全量同步，暂时不调查原因。</label></div></p>

<p v-pre><span><strong>请说明你的理由</strong></span></p>

```text
因为数据质量应该保证数据一致。
```

<p v-pre><span class="interaction"><span>提交答案，继续第七课</span></span></p>

#### 本课学习进度

<p v-pre>数据完整性验证</p>

<p v-pre>指标口径验证</p>

<p v-pre>自动化质量规则</p>

<p v-pre>API 测试设计</p>

<p v-pre>React 测试设计</p>

<p v-pre>端到端测试设计</p>

<p v-pre>差异定位与数据修复</p>

<p v-pre>质量监控与告警</p>

<p v-pre>正式项目质量验收</p>

<p v-pre><span><strong>这一课希望你形成一个新的工程习惯：</strong></span></p>

<p v-pre>不要因为接口返回 200、页面显示正常，就认为系统正确。</p>

<p v-pre>真正的数据分析系统，必须能够证明：</p>

<ol v-pre><li><div><div><p>数据没有遗漏。</p></div></div></li><li><div><div><p>指标计算正确。</p></div></div></li><li><div><div><p>权限没有越界。</p></div></div></li><li><div><div><p>图表和明细一致。</p></div></div></li><li><div><div><p>出现异常可以发现、定位和修复。</p></div></div></li></ol>

<p v-pre>这才是从「能够开发数据看板」走向「能够负责数据分析系统」的重要一步。</p>

## 第 36 轮　定位缺失订单与自动化质量检查 {#turn-36}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第七课实战问题1，我选择：B。理由：因为数据质量应该保证数据一致。。请评价我的数据质量管理思路，并继续带我完成售后数据完整性检查、差异定位和自动化质量规则设计。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第七课 · 实战2：售后数据完整性检查、差异定位与自动化质量规则

<p v-pre><div>实战问题1：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：暂停相关指标发布，定位缺失订单，检查 ETL、过滤条件和统计口径，修复后重新对账。</strong></span></p>

<p v-pre>你的理由是：</p>

<blockquote v-pre><p>因为数据质量应该保证数据一致。</p></blockquote>

<p v-pre>判断正确，而且你的处理思路已经具备数据质量管理的基本闭环。</p>

<p v-pre>不过，我想帮你把这个理由提升到更专业的层次：</p>

<p v-pre><span><strong>数据质量不是简单地要求源表和目标表数量相同，而是要求数据在明确的业务规则下完整、准确、一致、及时。</strong></span></p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>源表有 10,000 单，目标表有 9,850 单，不一定意味着 ETL 出错。</p></div></div></li><li><div><div><p>如果有 150 单属于明确排除的测试订单，数量差异可能合理。</p></div></div></li><li><div><div><p>如果 150 单是因为增量同步遗漏，那么就属于数据完整性故障。</p></div></div></li><li><div><div><p>如果订单数量相同，但部分订单被重复、错误归属团队，也仍然属于数据质量问题。</p></div></div></li></ul>

<p v-pre>所以，我们不能只比较 COUNT，还要比较业务主键、业务状态和关键字段。</p>

<p v-pre>今天我们完成三个实战任务：</p>

<ol v-pre><li><div><div><p>建立售后数据完整性检查 SQL。</p></div></div></li><li><div><div><p>定位 150 条缺失数据的真正原因。</p></div></div></li><li><div><div><p>建立自动化数据质量规则与异常处理机制。</p></div></div></li></ol>

### 一、先设计数据完整性检查体系

<p v-pre>我们的售后分析系统目前有三个关键数据层：</p>

<p v-pre><span><strong>ODS / 原始数据层</strong></span></p>

<p v-pre>接收业务系统原始售后订单数据</p>

<p v-pre>例如：ods_aftersales_order</p>

<p v-pre><span><strong>DWD / 明细数据层</strong></span></p>

<p v-pre>清洗、去重、标准化、关联团队</p>

<p v-pre>例如：dwd_aftersales_order</p>

<p v-pre><span><strong>ADS / 应用数据层</strong></span></p>

<p v-pre>计算售后 KPI、团队指标和趋势</p>

<p v-pre>例如：ads_aftersales_team_daily</p>

<p v-pre>我们要检查两个转换过程：</p>

<ul v-pre><li><div><div><p>ODS → DWD：订单有没有丢失、重复、错误清洗？</p></div></div></li><li><div><div><p>DWD → ADS：指标有没有遗漏、重复计算、聚合错误？</p></div></div></li></ul>

#### 1. 定义数据质量检查维度

<table v-pre><tbody><tr><th><p>检查维度</p></th><th><p>检查问题</p></th><th><p>售后业务示例</p></th></tr><tr><td><p>完整性</p></td><td><p>是否缺少数据</p></td><td><p>售后申请遗漏</p></td></tr><tr><td><p>唯一性</p></td><td><p>是否重复</p></td><td><p>同一售后单重复</p></td></tr><tr><td><p>准确性</p></td><td><p>字段值是否正确</p></td><td><p>解决时长错误</p></td></tr><tr><td><p>一致性</p></td><td><p>关联关系是否一致</p></td><td><p>团队归属错误</p></td></tr><tr><td><p>合法性</p></td><td><p>是否违反业务规则</p></td><td><p>解决时间早于创建时间</p></td></tr><tr><td><p>时效性</p></td><td><p>数据是否及时</p></td><td><p>昨日数据尚未同步完成</p></td></tr></tbody></table>

<p v-pre>这里需要特别区分：</p>

<p v-pre><span><strong>数据完整性 ≠ 数据数量一致。</strong></span></p>

<p v-pre>数量一致只是一个检查指标，不能证明数据完全正确。</p>

### 二、实战：定位 150 条缺失订单

<p v-pre>假设 2026-11-20 的数据核对结果如下：</p>

#### 售后数据对账结果

<p v-pre>源系统订单量</p>

### 10,000

<p v-pre>目标系统订单量</p>

### 9,850

<p v-pre><span><strong>差异订单</strong></span></p>

### 150 单

<p v-pre>差异率 1.5%，需要进一步定位</p>

<p v-pre>我们不要马上重新跑 ETL。</p>

<p v-pre>正确的第一步是找到具体缺失的订单。</p>

#### 1. 第一步：检查订单主键是否重复

<p v-pre>在源数据中：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    aftersales_id,
    COUNT(*) AS cnt
FROM ods_aftersales_order
WHERE bizdate = '20261120'
GROUP BY aftersales_id
HAVING COUNT(*) > 1;
```

<p v-pre>在目标数据中：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    aftersales_id,
    COUNT(*) AS cnt
FROM dwd_aftersales_order
WHERE bizdate = '20261120'
GROUP BY aftersales_id
HAVING COUNT(*) > 1;
```

<p v-pre>如果存在重复记录，需要检查：</p>

<ul v-pre><li><div><div><p>ETL 是否重复执行。</p></div></div></li><li><div><div><p>是否使用了正确的业务主键。</p></div></div></li><li><div><div><p>是否存在一单多事件被错误写入订单事实表。</p></div></div></li><li><div><div><p>是否缺少幂等写入机制。</p></div></div></li></ul>

<p v-pre>注意：如果 DWD 订单表的业务粒度是一单一行，那么 <code>aftersales_id</code> 应该唯一；事件事实表则可能一单多行，不能使用相同的唯一性规则。</p>

#### 2. 第二步：找出源表有、目标表没有的订单

<p v-pre>这是最重要的一条 SQL。</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    o.aftersales_id,
    o.created_at,
    o.status,
    o.team_id
FROM ods_aftersales_order o
LEFT JOIN dwd_aftersales_order d
    ON o.aftersales_id = d.aftersales_id
   AND d.bizdate = '20261120'
WHERE o.bizdate = '20261120'
  AND d.aftersales_id IS NULL;
```

<p v-pre>这叫做反向关联检查，也可以理解为 Anti Join。</p>

<p v-pre>它可以找出：</p>

<p v-pre><span><strong>源表存在，但目标表不存在的业务记录。</strong></span></p>

<p v-pre>我们假设查询结果如下：</p>

<table v-pre><tbody><tr><th><p>订单</p></th><th><p>状态</p></th><th><p>发现的问题</p></th></tr><tr><td><p>AS001</p></td><td><p>已解决</p></td><td><p>没有同步</p></td></tr><tr><td><p>AS002</p></td><td><p>处理中</p></td><td><p>没有同步</p></td></tr><tr><td><p>AS003</p></td><td><p>已解决</p></td><td><p>没有同步</p></td></tr><tr><td><p>AS004</p></td><td><p>已取消</p></td><td><p>被过滤</p></td></tr><tr><td><p>AS005</p></td><td><p>已解决</p></td><td><p>没有同步</p></td></tr></tbody></table>

<p v-pre>这时我们就从「少了150单」变成了「具体哪些订单没有进入目标表」。</p>

<p v-pre>这一步非常重要。</p>

#### 3. 第三步：检查目标表是否存在多余数据

<p v-pre>只检查源表遗漏是不够的。</p>

<p v-pre>还要反向检查：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    d.aftersales_id,
    d.created_at,
    d.status
FROM dwd_aftersales_order d
LEFT JOIN ods_aftersales_order o
    ON d.aftersales_id = o.aftersales_id
   AND o.bizdate = '20261120'
WHERE d.bizdate = '20261120'
  AND o.aftersales_id IS NULL;
```

<p v-pre>这可以发现：</p>

<ul v-pre><li><div><div><p>目标表存在历史残留数据。</p></div></div></li><li><div><div><p>数据同步批次混乱。</p></div></div></li><li><div><div><p>删除或取消记录没有正确处理。</p></div></div></li><li><div><div><p>业务主键映射错误。</p></div></div></li></ul>

<p v-pre>如果源表和目标表是按不同业务日期分区，不能直接用同一个 <code>bizdate</code> 进行关联。应先明确业务主键范围，再根据实际分区设计查询。</p>

### 三、第四步：对 150 条差异进行分类

<p v-pre>我们假设经过检查，发现差异由以下原因构成。</p>

<p v-pre><span><strong>150 条差异订单原因分布</strong></span></p>

<p v-pre>教学模拟数据，分类合计150条</p>

<p v-pre><div><span>关联维度失败</span></div><div><span>其他原因</span></div><div><span>增量游标遗漏</span></div><div><span>状态过滤错误</span></div><div><span>重复数据去重错误</span></div></p>

<ul v-pre><li>增量游标遗漏: 80</li><li>状态过滤错误: 30</li><li>重复数据去重错误: 20</li><li>关联维度失败: 10</li><li>其他原因: 10</li></ul>

<table v-pre><tbody><tr><th><p>原因</p></th><th><p>数量</p></th><th><p>处理方向</p></th></tr><tr><td><p>增量游标遗漏</p></td><td><p>80</p></td><td><p>补偿同步</p></td></tr><tr><td><p>状态过滤错误</p></td><td><p>30</p></td><td><p>修正过滤条件</p></td></tr><tr><td><p>去重错误</p></td><td><p>20</p></td><td><p>修正去重逻辑</p></td></tr><tr><td><p>团队关联失败</p></td><td><p>10</p></td><td><p>修复维度关联</p></td></tr><tr><td><p>其他原因</p></td><td><p>10</p></td><td><p>逐条调查</p></td></tr><tr><td><p><span><strong>合计</strong></span></p></td><td><p><span><strong>150</strong></span></p></td></tr></tbody></table>

<p v-pre>现在你会发现：</p>

<p v-pre>150 条差异不是一个问题，而是五类不同的问题。</p>

<p v-pre>这也是数据质量分析的核心能力：</p>

<p v-pre><span><strong>从结果异常，逐步追溯到数据加工环节的根因。</strong></span></p>

#### 重点分析：增量游标遗漏

<p v-pre>假设 ETL 使用下面的逻辑：</p>

<p v-pre><div>SQL</div></p>

```sql
WHERE updated_at > :last_sync_time
```

<p v-pre>这可能存在一个问题：</p>

<p v-pre>上一次任务读取到 10:00:00。</p>

<p v-pre>如果一条记录的 <code>updated_at</code> 也是 10:00:00，那么下一次查询使用严格大于号时，这条记录可能被遗漏。</p>

<p v-pre>改进方式可以使用复合游标：</p>

<p v-pre><div>SQL</div></p>

```sql
WHERE
    updated_at > :last_time
    OR (
        updated_at = :last_time
        AND aftersales_id > :last_id
    )
ORDER BY
    updated_at,
    aftersales_id
LIMIT 1000;
```

<p v-pre>另外还可以使用重叠时间窗口，例如每次回溯最近一段时间的数据，并通过业务主键幂等 Upsert。</p>

<p v-pre>需要注意：复合游标依赖排序字段稳定且记录可见；如果业务存在延迟写入、回填或删除，还需要考虑定期对账、删除标记和历史补偿。</p>

### 四、建立自动化数据质量规则

<p v-pre>前面我们是人工执行 SQL 检查。</p>

<p v-pre>真正上线后，不能每天靠人手动检查。</p>

<p v-pre>我们要建立一套自动化质量检查机制。</p>

#### 1. 设计质量规则表

<p v-pre>建议新增：</p>

<p v-pre><code>quality_rule_config</code></p>

<p v-pre>用于管理数据质量规则。</p>

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE quality_rule_config (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    rule_code VARCHAR(64) NOT NULL UNIQUE,
    rule_name VARCHAR(128) NOT NULL,
    table_name VARCHAR(128) NOT NULL,
    rule_type VARCHAR(32) NOT NULL,
    severity VARCHAR(16) NOT NULL,
    threshold_value DECIMAL(12,4) DEFAULT NULL,
    enabled TINYINT NOT NULL DEFAULT 1,
    description VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) COMMENT='数据质量规则配置表';
```

<p v-pre>规则示例：</p>

<table v-pre><tbody><tr><th><p>规则编号</p></th><th><p>规则名称</p></th><th><p>类型</p></th><th><p>严重级别</p></th></tr><tr><td><p>DQ001</p></td><td><p>售后单号不能为空</p></td><td><p>完整性</p></td><td><p>P0</p></td></tr><tr><td><p>DQ002</p></td><td><p>售后单号不能重复</p></td><td><p>唯一性</p></td><td><p>P0</p></td></tr><tr><td><p>DQ003</p></td><td><p>解决时长不能为负数</p></td><td><p>合法性</p></td><td><p>P1</p></td></tr><tr><td><p>DQ004</p></td><td><p>团队 ID 必须存在</p></td><td><p>一致性</p></td><td><p>P1</p></td></tr><tr><td><p>DQ005</p></td><td><p>数据同步延迟检查</p></td><td><p>时效性</p></td><td><p>P1</p></td></tr><tr><td><p>DQ006</p></td><td><p>源目标数据数量对账</p></td><td><p>完整性</p></td><td><p>P0</p></td></tr></tbody></table>

<p v-pre>这里 P0 表示阻断指标发布的严重问题，P1 表示需要处理的高优先级问题。</p>

#### 2. 设计质量检查结果表

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE quality_check_result (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    rule_code VARCHAR(64) NOT NULL,
    table_name VARCHAR(128) NOT NULL,
    bizdate DATE NOT NULL,
    check_status VARCHAR(16) NOT NULL,
    total_count BIGINT DEFAULT 0,
    error_count BIGINT DEFAULT 0,
    error_rate DECIMAL(12,4) DEFAULT 0,
    error_message VARCHAR(1000),
    checked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_rule_bizdate (rule_code, bizdate)
) COMMENT='数据质量检查结果表';
```

<p v-pre>这样就能记录每天每条规则的执行情况。</p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>规则</p></th><th><p>日期</p></th><th><p>检查状态</p></th><th><p>异常数量</p></th></tr><tr><td><p>DQ001</p></td><td><p>11-20</p></td><td><p>PASS</p></td><td><p>0</p></td></tr><tr><td><p>DQ002</p></td><td><p>11-20</p></td><td><p>PASS</p></td><td><p>0</p></td></tr><tr><td><p>DQ003</p></td><td><p>11-20</p></td><td><p>FAIL</p></td><td><p>3</p></td></tr><tr><td><p>DQ004</p></td><td><p>11-20</p></td><td><p>FAIL</p></td><td><p>10</p></td></tr><tr><td><p>DQ006</p></td><td><p>11-20</p></td><td><p>FAIL</p></td><td><p>150</p></td></tr></tbody></table>

### 五、使用 Python 实现自动化检查

<p v-pre>我们把数据质量检查独立出来，不要直接写进 ETL 主流程。</p>

<p v-pre>建议目录：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>app/ ├── etl/ │   ├── extract.py │   ├── transform.py │   └── load.py ├── quality/ │   ├── rules.py │   ├── checker.py │   └── reporter.py ├── tasks/ │   └── quality_tasks.py └── database/     └── session.py</span></code></div></p>

#### 1. 编写质量规则

<p v-pre><code>quality/rules.py</code></p>

<p v-pre><div>Python</div></p>

```text

from dataclasses import dataclass
from typing import Callable

from sqlalchemy import text
from sqlalchemy.orm import Session


@dataclass
class QualityResult:
    rule_code: str
    rule_name: str
    total_count: int
    error_count: int
    passed: bool


def check_null_aftersales_id(
    session: Session,
    bizdate: str,
) -> QualityResult:

    sql = text("""
        SELECT COUNT(*)
        FROM dwd_aftersales_order
        WHERE bizdate = :bizdate
          AND aftersales_id IS NULL
    """)

    error_count = session.execute(
        sql,
        {"bizdate": bizdate},
    ).scalar_one()

    return QualityResult(
        rule_code="DQ001",
```

<p v-pre>这里为了简化示例，<code>total_count</code> 暂时设置为 0。正式版本应该统计规则适用的数据总量，便于计算异常率。</p>

#### 2. 执行质量检查

<p v-pre><code>quality/checker.py</code></p>

<p v-pre><div>Python</div></p>

```text

from sqlalchemy.orm import Session

from app.quality.rules import (
    check_null_aftersales_id,
    check_negative_duration,
)


def run_quality_checks(
    session: Session,
    bizdate: str,
):
    checks = [
        check_null_aftersales_id,
        check_negative_duration,
    ]

    results = []

    for check in checks:
        result = check(session, bizdate)
        results.append(result)

    return results

```

<p v-pre>实际项目中还需要把结果写入 <code>quality_check_result</code>，并且让规则注册表、规则配置和执行逻辑解耦，方便后续增加规则。</p>

#### 3. 质量检查结果决定是否发布

<p v-pre><div>Python</div></p>

```text
results = run_quality_checks(session, bizdate)

blocking_errors = [
    item
    for item in results
    if not item.passed
]

if blocking_errors:
    raise RuntimeError(
        "数据质量检查失败，禁止发布 ADS"
    )

# 只有通过阻断级检查，才允许发布 ADS
publish_ads()
```

<p v-pre>这里有一个重要架构原则：</p>

<p v-pre><span><strong>ETL 成功，不代表数据可以发布。</strong></span></p>

<p v-pre>完整流程应该是：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>数据同步    ↓ 数据清洗    ↓ 数据质量检查    ↓ 指标计算    ↓ 指标发布</span></code></div></p>

<p v-pre>对于有问题的数据，应该保留上一个可信的 ADS 版本，不能让错误数据覆盖正在使用的指标。</p>

<p v-pre>如果采用分区交换或版本化发布，还需要确保切换操作具备原子性。</p>

### 六、建立数据质量监控与告警

<p v-pre>质量检查不能只记录数据库。</p>

<p v-pre>建议形成如下闭环：</p>

<ol v-pre><li><div><div><p><span><strong>定时执行质量检查</strong></span></p><p>Celery Beat 每天在 ETL 完成后触发。</p></div></div></li><li><div><div><p><span><strong>保存检查结果</strong></span></p><p>写入 <code>quality_check_result</code>。</p></div></div></li><li><div><div><p><span><strong>判断严重程度</strong></span></p><p>P0 阻断发布，P1 告警，P2 记录观察。</p></div></div></li><li><div><div><p><span><strong>通知相关人员</strong></span></p><p>通过邮件或企业微信、飞书发送异常报告。</p></div></div></li><li><div><div><p><span><strong>人工定位并修复</strong></span></p><p>记录根因、处理人和修复结果。</p></div></div></li><li><div><div><p><span><strong>重新检查并恢复发布</strong></span></p><p>确认数据完整后重新发布指标。</p></div></div></li></ol>

#### 建议增加一个质量监控看板

#### 数据质量监控

<p v-pre>教学模拟数据 · 2026-11-20</p>

<p v-pre>检查规则总数</p>

### 12

<p v-pre>检查通过率</p>

### 83.3%

<p v-pre>异常规则数</p>

### 2

<p v-pre>待修复记录</p>

### 160

<p v-pre><span><strong>质量规则状态</strong></span></p>

<table v-pre><tbody><tr><th><p>规则</p></th><th><p>状态</p></th><th><p>异常数</p></th></tr><tr><td><p>售后单号非空</p></td><td><p></p><div>通过</div></td><td><p>0</p></td></tr><tr><td><p>售后单号唯一</p></td><td><p></p><div>通过</div></td><td><p>0</p></td></tr><tr><td><p>解决时长合法</p></td><td><p></p><div>失败</div></td><td><p>10</p></td></tr><tr><td><p>团队关联完整</p></td><td><p></p><div>失败</div></td><td><p>150</p></td></tr><tr><td><p>ETL 时效</p></td><td><p></p><div>通过</div></td><td><p>0</p></td></tr></tbody></table>

<p v-pre>这里的通过率采用 10/12，待修复记录采用两条规则异常数量的合计，仅用于演示。正式看板还需要防止不同规则重复统计同一条异常记录。</p>

### 七、自动化质量规则设计评审

<p v-pre>我建议你的售后分析系统 V1 至少实现以下规则：</p>

<table v-pre><tbody><tr><th><p>编号</p></th><th><p>检查规则</p></th><th><p>失败处理</p></th></tr><tr><td><p>DQ001</p></td><td><p>售后单号不能为空</p></td><td><p>阻断</p></td></tr><tr><td><p>DQ002</p></td><td><p>订单主键唯一</p></td><td><p>阻断</p></td></tr><tr><td><p>DQ003</p></td><td><p>解决时长不能为负</p></td><td><p>阻断相关指标</p></td></tr><tr><td><p>DQ004</p></td><td><p>团队关联有效</p></td><td><p>隔离异常记录</p></td></tr><tr><td><p>DQ005</p></td><td><p>源目标订单对账</p></td><td><p>阻断</p></td></tr><tr><td><p>DQ006</p></td><td><p>ADS 汇总与 DWD 复算一致</p></td><td><p>阻断</p></td></tr><tr><td><p>DQ007</p></td><td><p>ETL 更新时间符合 SLA</p></td><td><p>告警</p></td></tr><tr><td><p>DQ008</p></td><td><p>解决时间不能早于创建时间</p></td><td><p>阻断相关指标</p></td></tr><tr><td><p>DQ009</p></td><td><p>已解决订单必须存在解决时间</p></td><td><p>阻断相关指标</p></td></tr><tr><td><p>DQ010</p></td><td><p>SLA 超时率处于合理范围</p></td><td><p>异常告警，人工确认</p></td></tr></tbody></table>

<p v-pre>特别说明：DQ010 不应因为业务指标突然变差就自动把数据判为错误。业务确实可能发生异常，所以应该把它作为异常监测规则，而不是直接认定数据无效。</p>

### 八、第七课实战问题2：如何处理数据质量检查失败？

<p v-pre>现在进入下一道实战题。</p>

<p v-pre>假设每天凌晨 ETL 完成后，系统执行质量检查。</p>

<p v-pre>发现：</p>

<ul v-pre><li><div><div><p>售后单号重复：20 条。</p></div></div></li><li><div><div><p>团队关联失败：10 条。</p></div></div></li><li><div><div><p>解决时长为负：3 条。</p></div></div></li><li><div><div><p>其他数据正常。</p></div></div></li></ul>

<p v-pre>其中，重复订单和负解决时长可能影响平均解决时长，团队关联失败可能影响团队排行榜。</p>

<p v-pre>你认为应该如何处理？</p>

<p v-pre><div><label>A. 只记录异常日志，仍然正常发布所有 ADS 指标。</label></div><div><label>B. 根据规则严重程度隔离异常数据，阻断受影响指标发布，修复后重新校验；不受影响的指标可以独立发布。</label></div><div><label>C. 直接删除所有异常记录，然后重新统计。</label></div><div><label>D. 所有数据质量规则失败时，都停止整个系统运行。</label></div></p>

<p v-pre><span><strong>请说明你的理由</strong></span></p>

```text
不同质量问题影响的指标范围不同
```

<p v-pre><span class="interaction"><span>提交答案，继续第七课</span></span></p>

#### 本节你需要真正掌握的三个能力

<ol v-pre><li><div><div><p><span><strong>发现差异：</strong></span> 不只是发现数量不一致，还要定位具体业务主键。</p></div></div></li><li><div><div><p><span><strong>分析根因：</strong></span> 能够从增量游标、过滤条件、去重逻辑和维度关联定位问题。</p></div></div></li><li><div><div><p><span><strong>自动保障：</strong></span> 把人工检查变成可重复执行、可记录、可告警、可阻断发布的质量体系。</p></div></div></li></ol>

<p v-pre>你现在学习的已经不只是 SQL 或 Python，而是数据工程中非常重要的一项能力：<span><strong>数据质量治理（Data Quality Management）。</strong></span></p>

## 第 37 轮　隔离异常数据、控制指标发布和处理告警 {#turn-37}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第七课实战问题2，我选择：B。理由：不同质量问题影响的指标范围不同。请评价我的数据质量异常处理策略，并继续指导我设计数据隔离、指标发布控制、质量告警和质量闭环。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第七课 · 实战3：数据隔离、指标发布控制与质量闭环

<p v-pre><div>实战问题2：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：根据规则严重程度隔离异常数据，阻断受影响指标发布，修复后重新校验；不受影响的指标可以独立发布。</strong></span></p>

<p v-pre>你的理由是：</p>

<blockquote v-pre><p>不同质量问题影响的指标范围不同。</p></blockquote>

<p v-pre>这个判断非常好。你已经开始从单纯的数据检查，转向数据质量治理和系统可用性设计。</p>

#### 一、评价你的处理策略

<p v-pre>你的思路体现了一个重要原则：</p>

<p v-pre><span><strong>数据质量故障应该按照影响范围处理，而不是简单地全部放行或全部停止。</strong></span></p>

<p v-pre>例如，今天发现以下问题：</p>

<table v-pre><tbody><tr><th><p>数据问题</p></th><th><p>异常数量</p></th><th><p>影响范围</p></th></tr><tr><td><p>售后单号重复</p></td><td><p>20</p></td><td><p>订单数量、解决时长</p></td></tr><tr><td><p>团队关联失败</p></td><td><p>10</p></td><td><p>团队排行榜</p></td></tr><tr><td><p>解决时长为负</p></td><td><p>3</p></td><td><p>平均解决时长</p></td></tr><tr><td><p>数据更新时间正常</p></td><td><p>0</p></td><td><p>不影响其他指标</p></td></tr></tbody></table>

<p v-pre>正确的处理应该是：</p>

<ul v-pre><li><div><div><p>售后总申请量：如果去重规则明确且数据完整，可以独立发布。</p></div></div></li><li><div><div><p>平均解决时长：受到重复记录和负时长影响，需要阻断。</p></div></div></li><li><div><div><p>团队排行榜：团队关联失败的记录需要隔离，不能错误归属。</p></div></div></li><li><div><div><p>SLA 超时率：如果其所需数据和规则没有受到影响，可以独立发布。</p></div></div></li></ul>

<p v-pre>这里再增加一个专业概念：</p>

<p v-pre><span><strong>质量影响范围（Quality Impact Scope）。</strong></span></p>

<p v-pre>一条质量规则不应该只有 PASS 或 FAIL，还应该知道它影响哪些数据集、指标、接口和页面。</p>

### 二、第一步：设计数据隔离机制

<p v-pre>先理解为什么需要隔离。</p>

<p v-pre>假设我们同步 10,000 条售后订单：</p>

<ul v-pre><li><div><div><p>9,970 条正常。</p></div></div></li><li><div><div><p>20 条重复订单。</p></div></div></li><li><div><div><p>10 条团队关联失败。</p></div></div></li></ul>

<p v-pre>如果直接把 10,000 条全部写入 DWD，可能导致错误统计。</p>

<p v-pre>如果直接删除 30 条，也可能丢失重要业务数据。</p>

<p v-pre>所以我们需要区分：</p>

<ol v-pre><li><div><div><p>原始数据：保留真实来源。</p></div></div></li><li><div><div><p>正常数据：进入可发布的数据集。</p></div></div></li><li><div><div><p>异常数据：进入隔离区，等待修复。</p></div></div></li></ol>

#### 数据质量隔离流程

<p v-pre><span><strong>ODS 原始数据</strong></span></p>

<p v-pre>10,000 条原始记录</p>

<p v-pre><span><strong>数据质量校验</strong></span></p>

<p v-pre>唯一性、合法性、关联性、完整性</p>

<p v-pre><span><strong>正常数据</strong></span></p>

### 9,970

<p v-pre>进入 DWD 正常数据集</p>

<p v-pre><span><strong>异常数据</strong></span></p>

### 30

<p v-pre>进入隔离区等待处理</p>

#### 1. 建立数据隔离表

<p v-pre>建议新增：</p>

<p v-pre><code>dwd_aftersales_quarantine</code></p>

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE dwd_aftersales_quarantine (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    aftersales_id VARCHAR(64) NOT NULL,
    bizdate DATE NOT NULL,

    rule_code VARCHAR(64) NOT NULL,
    error_type VARCHAR(32) NOT NULL,
    error_message VARCHAR(500),

    raw_payload JSON,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    batch_id VARCHAR(64) NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME DEFAULT NULL,

    INDEX idx_aftersales_id (aftersales_id),
    INDEX idx_rule_status (rule_code, status),
    INDEX idx_batch_id (batch_id)
) COMMENT='售后异常数据隔离表';
```

<p v-pre>字段解释：</p>

<table v-pre><tbody><tr><th><p>字段</p></th><th><p>用途</p></th></tr><tr><td><p><code>aftersales_id</code></p></td><td><p>定位异常订单</p></td></tr><tr><td><p><code>rule_code</code></p></td><td><p>触发的质量规则</p></td></tr><tr><td><p><code>error_type</code></p></td><td><p>异常类型</p></td></tr><tr><td><p><code>raw_payload</code></p></td><td><p>保存原始数据快照</p></td></tr><tr><td><p><code>status</code></p></td><td><p>异常处理状态</p></td></tr><tr><td><p><code>batch_id</code></p></td><td><p>追溯 ETL 批次</p></td></tr></tbody></table>

<p v-pre>建议状态：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>PENDING       待处理 PROCESSING    处理中 FIXED         已修复 REJECTED      确认无效 REPROCESSED   已重新处理</span></code></div></p>

<p v-pre>注意：一条记录可能违反多条质量规则，因此不能把 <code>aftersales_id</code> 设计成唯一键。正式生产环境还应增加来源系统、源记录版本和隔离事件 ID，防止重复隔离及历史问题覆盖。</p>

#### 2. 设计异常数据处理流程

<p v-pre>举例：团队关联失败。</p>

<p v-pre>原始数据：</p>

<p v-pre><div>JSON</div></p>

```json
{
  "aftersales_id": "AS001",
  "team_id": 999,
  "resolution_minutes": 60
}
```

<p v-pre>但维度表中没有团队 999。</p>

<p v-pre>正确处理：</p>

<ol v-pre><li><div><div><p>保留原始订单。</p></div></div></li><li><div><div><p>将异常原因记录为 <code>DQ004</code>。</p></div></div></li><li><div><div><p>将订单放入隔离区。</p></div></div></li><li><div><div><p>检查是否是团队维度缺失。</p></div></div></li><li><div><div><p>如果团队真实存在，补充维度映射。</p></div></div></li><li><div><div><p>重新执行关联处理。</p></div></div></li><li><div><div><p>再次运行质量规则。</p></div></div></li><li><div><div><p>通过后恢复到正常数据集。</p></div></div></li></ol>

<p v-pre>不要简单地把 <code>team_id=999</code> 修改成默认团队，否则会污染团队绩效数据。</p>

### 三、第二步：设计指标发布控制

<p v-pre>这是本节最重要的内容。</p>

<p v-pre>我们不能只判断整个 ETL 是否成功，还要判断哪些指标可以发布。</p>

#### 1. 建立指标与质量规则依赖关系

<p v-pre>建议建立：</p>

<p v-pre><code>quality_metric_dependency</code></p>

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE quality_metric_dependency (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    metric_code VARCHAR(64) NOT NULL,
    rule_code VARCHAR(64) NOT NULL,

    impact_level VARCHAR(16) NOT NULL,
    enabled TINYINT NOT NULL DEFAULT 1,

    UNIQUE KEY uk_metric_rule (
        metric_code,
        rule_code
    )
) COMMENT='指标质量依赖关系表';
```

<p v-pre>示例配置：</p>

<table v-pre><tbody><tr><th><p>指标编码</p></th><th><p>质量规则</p></th><th><p>影响级别</p></th></tr><tr><td><p><code>AFTERSALES_COUNT</code></p></td><td><p>DQ001</p></td><td><p>BLOCK</p></td></tr><tr><td><p><code>AFTERSALES_COUNT</code></p></td><td><p>DQ002</p></td><td><p>BLOCK</p></td></tr><tr><td><p><code>AVG_RESOLUTION_TIME</code></p></td><td><p>DQ002</p></td><td><p>BLOCK</p></td></tr><tr><td><p><code>AVG_RESOLUTION_TIME</code></p></td><td><p>DQ003</p></td><td><p>BLOCK</p></td></tr><tr><td><p><code>TEAM_PERFORMANCE</code></p></td><td><p>DQ004</p></td><td><p>BLOCK</p></td></tr><tr><td><p><code>SLA_OVERDUE_RATE</code></p></td><td><p>DQ005</p></td><td><p>BLOCK</p></td></tr></tbody></table>

<p v-pre>这里的规则关联需要根据实际指标公式确定。例如，如果 SLA 超时率也依赖团队关联数据，就必须把 DQ004 加入其依赖关系。</p>

#### 2. 设计发布状态

<p v-pre>建议统一使用：</p>

<table v-pre><tbody><tr><th><p>状态</p></th><th><p>含义</p></th><th><p>是否允许展示</p></th></tr><tr><td><p><code>PENDING</code></p></td><td><p>尚未完成质量检查</p></td><td><p>否</p></td></tr><tr><td><p><code>PASSED</code></p></td><td><p>质量检查通过</p></td><td><p>是</p></td></tr><tr><td><p><code>BLOCKED</code></p></td><td><p>存在阻断问题</p></td><td><p>否</p></td></tr><tr><td><p><code>DEGRADED</code></p></td><td><p>部分数据存在问题，经过授权允许降级发布</p></td><td><p>仅在明确标注后</p></td></tr><tr><td><p><code>STALE</code></p></td><td><p>当前版本超过新鲜度要求</p></td><td><p>按业务策略处理</p></td></tr></tbody></table>

<p v-pre>特别强调：</p>

<p v-pre><code>DEGRADED</code> 不能成为掩盖错误数据的通道。必须明确缺失范围、影响指标、批准人和展示说明。</p>

#### 3. 指标发布状态示例

<p v-pre>假设今天的质量检查结果如下：</p>

#### 售后指标发布控制

<p v-pre>2026-11-21 · 模拟结果</p>

<p v-pre><span><strong>售后申请总量</strong></span></p>

<p v-pre>允许发布</p>

<p v-pre><div>PASSED</div></p>

<p v-pre><span><strong>平均解决时长</strong></span></p>

<p v-pre>阻止发布</p>

<p v-pre><div>BLOCKED</div></p>

<p v-pre><span><strong>团队排行榜</strong></span></p>

<p v-pre>阻止发布</p>

<p v-pre><div>BLOCKED</div></p>

<p v-pre><span><strong>SLA 超时率</strong></span></p>

<p v-pre>允许发布</p>

<p v-pre><div>PASSED</div></p>

<p v-pre>这里有一个更进一步的架构问题：</p>

<p v-pre><span><strong>发布必须按数据版本管理，而不是直接覆盖当前正在使用的数据。</strong></span></p>

<p v-pre>建议流程：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>生成新 ADS 版本       ↓ 执行数据质量检查       ↓ 生成指标发布清单       ↓ 检查每个指标的依赖规则       ↓ 通过的指标发布新版本       ↓ 未通过的指标保留上一个可信版本</span></code></div></p>

<p v-pre>这样即使团队排行榜出现数据异常，也不一定需要让整个售后看板停止工作。</p>

<p v-pre>但旧版本也必须显示它的数据截至时间，避免用户把旧数据当成最新数据。</p>

### 四、第三步：建立质量告警机制

<p v-pre>数据质量问题如果没人知道，自动检查就失去了意义。</p>

<p v-pre>我们需要将质量检查结果转化为可跟踪的告警事件。</p>

#### 1. 设计质量告警表

<p v-pre>建议新增：</p>

<p v-pre><code>quality_alert</code></p>

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE quality_alert (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    alert_code VARCHAR(64) NOT NULL,
    rule_code VARCHAR(64) NOT NULL,

    bizdate DATE NOT NULL,
    batch_id VARCHAR(64) NOT NULL,

    severity VARCHAR(16) NOT NULL,
    alert_message VARCHAR(1000),

    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',

    assignee VARCHAR(64) DEFAULT NULL,
    root_cause VARCHAR(1000) DEFAULT NULL,
    solution VARCHAR(1000) DEFAULT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME DEFAULT NULL,

    INDEX idx_status_severity (status, severity),
    INDEX idx_batch (batch_id)
) COMMENT='数据质量告警表';
```

#### 2. 告警分级

<table v-pre><tbody><tr><th><p>等级</p></th><th><p>示例</p></th><th><p>处理方式</p></th></tr><tr><td><p>P0</p></td><td><p>核心订单大量丢失</p></td><td><p>立即阻断并通知负责人</p></td></tr><tr><td><p>P1</p></td><td><p>团队关联失败</p></td><td><p>阻断受影响指标并通知</p></td></tr><tr><td><p>P2</p></td><td><p>非核心字段缺失</p></td><td><p>记录并安排处理</p></td></tr><tr><td><p>P3</p></td><td><p>数据延迟轻微波动</p></td><td><p>观察趋势</p></td></tr></tbody></table>

<p v-pre>建议告警通知至少包含：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>告警标题：售后团队关联失败  业务日期：2026-11-20 ETL 批次：batch_20261120_001  规则编码：DQ004 异常数量：10 影响指标：TEAM_PERFORMANCE  影响范围：团队排行榜 处理状态：待处理  建议操作： 1. 检查团队维度表 2. 检查团队历史映射 3. 修复关联关系 4. 重新执行数据质量检查</span></code></div></p>

<p v-pre>告警需要支持去重，避免同一个批次、同一规则每次重试都产生大量重复通知。</p>

<p v-pre>建议使用：</p>

<p v-pre><code>rule_code + bizdate + batch_id</code></p>

<p v-pre>作为告警事件的去重依据。</p>

### 五、第四步：建立质量问题闭环

<p v-pre>前面我们解决了发现问题、隔离数据和阻断发布。</p>

<p v-pre>但还有一个问题：</p>

<p v-pre><span><strong>问题修复之后，如何确保以后不再发生？</strong></span></p>

<p v-pre>我们需要建立完整的质量治理闭环。</p>

#### 数据质量问题处理闭环

<ol v-pre><li><div><div><p><span><strong>发现问题</strong></span></p><p>自动化质量规则发现异常。</p></div></div></li><li><div><div><p><span><strong>创建告警</strong></span></p><p>生成唯一告警编号，记录批次和规则。</p></div></div></li><li><div><div><p><span><strong>分配责任人</strong></span></p><p>指定数据开发或业务负责人。</p></div></div></li><li><div><div><p><span><strong>根因分析</strong></span></p><p>定位 SQL、ETL、维度关联或业务源数据问题。</p></div></div></li><li><div><div><p><span><strong>修复数据</strong></span></p><p>补偿同步、修复维度、纠正转换逻辑。</p></div></div></li><li><div><div><p><span><strong>重新验证</strong></span></p><p>重跑质量规则，并与源数据核对。</p></div></div></li><li><div><div><p><span><strong>恢复指标发布</strong></span></p><p>生成可信的新版本。</p></div></div></li><li><div><div><p><span><strong>复盘与预防</strong></span></p><p>更新规则、测试用例和开发规范。</p></div></div></li></ol>

#### 1. 增加根因分类

<p v-pre>建议统一根因分类：</p>

<table v-pre><tbody><tr><th><p>分类</p></th><th><p>具体问题</p></th></tr><tr><td><p>SOURCE</p></td><td><p>业务源数据错误</p></td></tr><tr><td><p>ETL</p></td><td><p>增量同步遗漏</p></td></tr><tr><td><p>SQL</p></td><td><p>SQL 计算逻辑错误</p></td></tr><tr><td><p>DIMENSION</p></td><td><p>维度关联失败</p></td></tr><tr><td><p>BUSINESS</p></td><td><p>业务规则变化</p></td></tr><tr><td><p>SYSTEM</p></td><td><p>数据库或任务异常</p></td></tr><tr><td><p>HUMAN</p></td><td><p>人工操作错误</p></td></tr></tbody></table>

<p v-pre>这能够帮助你后续统计质量问题的主要来源。</p>

#### 2. 建立质量管理 KPI

<p v-pre>除了业务售后指标，我们还需要监控数据工程自身的健康程度。</p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>计算方式</p></th></tr><tr><td><p>质量规则通过率</p></td><td><p>通过规则数 / 执行规则数</p></td></tr><tr><td><p>数据完整率</p></td><td><p>实际完整记录数 / 应有记录数</p></td></tr><tr><td><p>数据延迟</p></td><td><p>实际完成时间 - 计划完成时间</p></td></tr><tr><td><p>问题平均修复时间</p></td><td><p>从发现到关闭的平均耗时</p></td></tr><tr><td><p>重复问题率</p></td><td><p>重复发生问题数 / 总问题数</p></td></tr><tr><td><p>指标发布成功率</p></td><td><p>成功发布的指标数 / 计划发布指标数</p></td></tr></tbody></table>

<p v-pre>这些指标可以形成独立的质量监控看板。</p>

### 六、第五步：把质量治理接入 Celery

<p v-pre>前面第四课，我们已经学习了 Celery 定时任务。</p>

<p v-pre>现在把它应用到质量治理。</p>

<p v-pre>推荐调度顺序：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>01:00  ETL 增量同步 01:20  DWD 数据清洗 01:30  数据质量检查 01:40  ADS 指标计算 01:50  指标发布控制 02:00  质量报告与告警</span></code></div></p>

<p v-pre>以上是示例时间，正式项目应使用任务依赖和完成事件驱动，不应只依赖固定时间假设上一步一定完成。</p>

<p v-pre>例如：</p>

<p v-pre><div>Python</div></p>

```text
from celery import chain

daily_pipeline = chain(
    sync_aftersales_data.s(),
    transform_aftersales_data.s(),
    run_quality_checks.s(),
    build_ads_metrics.s(),
    publish_metrics.s(),
)

daily_pipeline.apply_async()
```

<p v-pre>这里还需要特别注意：</p>

<ul v-pre><li><div><div><p>质量检查失败时，不能继续发布受影响指标。</p></div></div></li><li><div><div><p>任务重试不能造成重复写入。</p></div></div></li><li><div><div><p>每个批次必须具有唯一标识。</p></div></div></li><li><div><div><p>质量检查和指标发布需要保留运行记录。</p></div></div></li><li><div><div><p>失败后应能够从失败节点恢复，而不是盲目重复全部步骤。</p></div></div></li></ul>

<p v-pre>实际开发时，还需要处理 Celery chain 的任务参数传递、异常分支和不同指标独立发布逻辑。</p>

### 七、最终架构：数据质量治理模块

<p v-pre>现在把今天学习的内容整合起来。</p>

#### 数据质量治理架构 V1

<p v-pre><span><strong>ODS / DWD / ADS</strong></span></p>

<p v-pre>业务数据与分析数据</p>

<p v-pre><span><strong>Quality Checker</strong></span></p>

<p v-pre>完整性、唯一性、准确性、一致性、时效性</p>

<p v-pre><span><strong>正常数据</strong></span></p>

<p v-pre>进入正常加工链路</p>

<p v-pre><span><strong>异常数据</strong></span></p>

<p v-pre>隔离、修复、复检</p>

<p v-pre><span><strong>Metric Release Controller</strong></span></p>

<p v-pre>根据指标依赖规则决定发布范围</p>

<p v-pre><span><strong>可信 ADS 数据发布</strong></span></p>

<p v-pre>版本管理、数据更新时间、发布状态</p>

<p v-pre><span><strong>FastAPI + React</strong></span></p>

<p v-pre>只展示符合发布策略的数据</p>

<p v-pre><span><strong>横向质量管理模块</strong></span></p>

<p v-pre>质量规则配置</p>

<p v-pre>告警管理</p>

<p v-pre>异常数据隔离</p>

<p v-pre>修复与复检</p>

<p v-pre>生产环境还应确保隔离区的原始数据经过访问控制，敏感字段脱敏或加密，并设置合理的数据保留期限。</p>

### 八、第七课实战问题3：指标发布应该如何保证原子性？

<p v-pre>最后再提高一点难度。</p>

<p v-pre>假设：</p>

<p v-pre>今天的 ADS 指标计算已经完成。</p>

<ul v-pre><li><div><div><p>售后申请总量：通过。</p></div></div></li><li><div><div><p>平均解决时长：通过。</p></div></div></li><li><div><div><p>团队排行榜：失败。</p></div></div></li><li><div><div><p>SLA 超时率：通过。</p></div></div></li></ul>

<p v-pre>此时系统正在将新版本指标发布给 React 看板。</p>

<p v-pre>你认为应该采用哪种方式？</p>

<p v-pre><div><label>A. 所有指标必须一起发布，只要一个指标失败，就回滚全部指标。</label></div><div><label>B. 按指标依赖和发布版本管理，通过质量检查的指标独立发布，失败指标保留上一个可信版本，并明确展示更新时间与状态。</label></div><div><label>C. 不管质量检查结果如何，都直接覆盖所有 ADS 数据。</label></div><div><label>D. 把失败指标删除，前端不再展示即可，不需要保留历史版本。</label></div></p>

<p v-pre><span><strong>请说明你的理由</strong></span></p>

```text
不同指标具有独立质量依赖
```

<p v-pre><span class="interaction"><span>提交答案，继续第七课</span></span></p>

#### 本节学习成果

<p v-pre>异常数据隔离设计</p>

<p v-pre>质量规则与指标依赖</p>

<p v-pre>指标发布状态设计</p>

<p v-pre>质量告警管理</p>

<p v-pre>问题处理闭环</p>

<p v-pre>Celery 质量调度</p>

<p v-pre>原子发布与版本管理</p>

<p v-pre>质量监控看板</p>

<p v-pre>完整质量项目验收</p>

<p v-pre><span><strong>本节最重要的收获：</strong></span></p>

<p v-pre>你已经从最初的「发现数据不一致」，逐渐建立起一套完整的数据质量治理思维：</p>

<p v-pre>发现 → 定位 → 隔离 → 修复 → 复检 → 发布 → 监控 → 复盘。</p>

<p v-pre>这就是数据工程师需要具备的质量管理能力。</p>

## 第 38 轮　指标版本管理、质量监控看板与项目验收 {#turn-38}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第七课实战问题3，我选择：B。理由：不同指标具有独立质量依赖。请评价我的指标发布设计，并继续带我完成发布版本管理、数据质量监控看板和第七课项目验收。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第七课收官：指标发布版本管理、数据质量监控与项目验收

<p v-pre><div>实战问题3：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：按照指标依赖和发布版本管理，通过质量检查的指标独立发布，失败指标保留上一个可信版本，并明确展示更新时间与状态。</strong></span></p>

<p v-pre>你的理由是：</p>

<blockquote v-pre><p>不同指标具有独立质量依赖。</p></blockquote>

<p v-pre>这个判断正确，而且已经涉及数据平台架构设计中的一个重要概念：<span><strong>独立指标发布（Independent Metric Publishing）。</strong></span></p>

#### 一、评价你的指标发布设计

<p v-pre>假设今天有四个售后指标：</p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>质量检查</p></th><th><p>发布决策</p></th></tr><tr><td><p>售后申请总量</p></td><td><p>通过</p></td><td><p>发布新版本</p></td></tr><tr><td><p>平均解决时长</p></td><td><p>通过</p></td><td><p>发布新版本</p></td></tr><tr><td><p>团队排行榜</p></td><td><p>失败</p></td><td><p>保留旧版本</p></td></tr><tr><td><p>SLA 超时率</p></td><td><p>通过</p></td><td><p>发布新版本</p></td></tr></tbody></table>

<p v-pre>你的设计比简单的全量回滚更加合理。</p>

<p v-pre>但需要补充三个工程要求。</p>

<p v-pre><span><strong>1. 指标之间存在依赖关系。</strong></span></p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>团队排行榜依赖团队维度关联。</p></div></div></li><li><div><div><p>平均解决时长依赖解决时间和时长计算规则。</p></div></div></li><li><div><div><p>SLA 超时率依赖 SLA 到期时间和处理状态。</p></div></div></li></ul>

<p v-pre>如果一个基础数据集发生故障，所有依赖它的指标都应该受到影响。</p>

<p v-pre><span><strong>2. 每个指标必须具有独立版本。</strong></span></p>

<p v-pre>不能只记录一个全局 ETL 批次号。</p>

<p v-pre>例如：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>售后申请总量：V42 平均解决时长：V42 团队排行榜：V41 SLA 超时率：V42</span></code></div></p>

<p v-pre><span><strong>3. 前端必须明确展示数据新鲜度。</strong></span></p>

<p v-pre>不能让用户误以为四个指标都来自同一时间点。</p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>售后申请总量：数据截至 11 月 21 日 02:00。</p></div></div></li><li><div><div><p>团队排行榜：数据截至 11 月 20 日 02:00，存在更新延迟。</p></div></div></li></ul>

<p v-pre>这里还有一个容易忽略的问题：<span><strong>独立发布不等于可以忽略跨指标一致性。</strong></span></p>

<p v-pre>如果几个 KPI 必须共同构成一个经营分析结论，就需要把它们归入同一个发布组，确保它们来自兼容的数据版本。</p>

### 二、第一步：设计指标版本管理

<p v-pre>我们先解决一个问题：</p>

<p v-pre>如何知道当前看板上的某个指标究竟来自哪一次数据计算？</p>

<p v-pre>建议建立三个核心表：</p>

<ol v-pre><li><div><div><p><code>metric_release</code>：指标发布记录。</p></div></div></li><li><div><div><p><code>metric_release_detail</code>：每个指标的版本明细。</p></div></div></li><li><div><div><p><code>metric_release_current</code>：当前正式发布版本指针。</p></div></div></li></ol>

#### 1. 指标发布主表

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE metric_release (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    release_id VARCHAR(64) NOT NULL UNIQUE,
    batch_id VARCHAR(64) NOT NULL,

    release_status VARCHAR(20) NOT NULL,

    started_at DATETIME NOT NULL,
    completed_at DATETIME DEFAULT NULL,

    created_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_batch_id (batch_id)
) COMMENT='指标发布批次表';
```

#### 2. 指标发布明细表

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE metric_release_detail (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    release_id VARCHAR(64) NOT NULL,
    metric_code VARCHAR(64) NOT NULL,

    metric_version BIGINT NOT NULL,

    data_as_of DATETIME NOT NULL,

    quality_status VARCHAR(20) NOT NULL,
    publish_status VARCHAR(20) NOT NULL,

    published_at DATETIME DEFAULT NULL,

    UNIQUE KEY uk_metric_version (
        metric_code,
        metric_version
    ),

    INDEX idx_release_metric (
        release_id,
        metric_code
    )
) COMMENT='指标发布版本明细表';
```

#### 3. 当前版本指针表

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE metric_release_current (
    metric_code VARCHAR(64) PRIMARY KEY,

    metric_version BIGINT NOT NULL,

    release_id VARCHAR(64) NOT NULL,

    updated_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) COMMENT='当前指标发布版本';
```

<p v-pre>为什么需要这三张表？</p>

<table v-pre><tbody><tr><th><p>表</p></th><th><p>主要作用</p></th></tr><tr><td><p>发布主表</p></td><td><p>追踪一次发布任务</p></td></tr><tr><td><p>发布明细表</p></td><td><p>记录每个指标的独立版本</p></td></tr><tr><td><p>当前版本表</p></td><td><p>快速找到当前可用版本</p></td></tr></tbody></table>

<p v-pre>这里有一个重要设计：版本数据本身应该是不可变的，当前版本指针只负责指向一个已经完成质量验证的版本。</p>

<p v-pre>不能先修改当前版本指针，再慢慢计算新数据。</p>

### 三、第二步：实现独立指标发布

<p v-pre>我们用一个实际场景理解。</p>

#### 指标发布版本演示

<p v-pre>模拟发布批次 RELEASE-20261121-001</p>

<p v-pre><span><strong>售后申请总量</strong></span></p>

<p v-pre>当前版本 V42</p>

<p v-pre><div>发布成功</div></p>

<p v-pre><span><strong>平均解决时长</strong></span></p>

<p v-pre>当前版本 V42</p>

<p v-pre><div>发布成功</div></p>

<p v-pre><span><strong>团队排行榜</strong></span></p>

<p v-pre>当前版本 V41</p>

<p v-pre><div>保留旧版</div></p>

<p v-pre><span><strong>SLA 超时率</strong></span></p>

<p v-pre>当前版本 V42</p>

<p v-pre><div>发布成功</div></p>

<p v-pre>该示例展示的是指标独立发布，而不是整个系统只存在一个版本。</p>

#### 1. 发布前检查

<p v-pre>伪代码：</p>

<p v-pre><div>Python</div></p>

```text
def publish_metric(metric_code, new_version):
    # 1. 查询指标质量检查结果
    quality = get_quality_result(
        metric_code,
        new_version
    )

    if not quality.passed:
        return "BLOCKED"

    # 2. 检查依赖指标和数据版本
    if not dependencies_valid(metric_code):
        return "BLOCKED"

    # 3. 验证新版本数据完整性
    if not validate_metric_data(
        metric_code,
        new_version
    ):
        return "BLOCKED"

    # 4. 原子切换当前版本指针
    switch_current_version(
        metric_code,
        new_version
    )

    return "PUBLISHED"
```

#### 2. 如何保证原子发布？

<p v-pre>例如当前版本为 V41，新版本为 V42。</p>

<p v-pre>正确顺序：</p>

<ol v-pre><li><div><div><p>计算 V42。</p></div></div></li><li><div><div><p>将 V42 写入暂存或版本化数据集。</p></div></div></li><li><div><div><p>执行质量检查。</p></div></div></li><li><div><div><p>校验通过后，开启数据库事务。</p></div></div></li><li><div><div><p>更新 <code>metric_release_current</code>。</p></div></div></li><li><div><div><p>提交事务。</p></div></div></li></ol>

<p v-pre>关键 SQL：</p>

<p v-pre><div>SQL</div></p>

```sql
START TRANSACTION;

UPDATE metric_release_current
SET
    metric_version = 42,
    release_id = 'RELEASE-20261121-001'
WHERE metric_code = 'AFTERSALES_COUNT';

COMMIT;
```

<p v-pre>这段 SQL 只是版本指针切换示意。实际实现还必须检查受影响行数、目标版本已验证且已存在，并使用事务锁或乐观锁避免两个并发发布任务互相覆盖。</p>

<p v-pre>对于多个相互依赖的指标，如果要求一起切换，应使用发布组和组级版本指针，在一个事务中完成切换，而不是逐个更新。</p>

<p v-pre><span><strong>记住：先生成并验证新版本，再切换当前版本。</strong></span></p>

### 四、第三步：设计数据质量监控看板

<p v-pre>现在我们要给数据开发人员和管理人员提供一个独立的质量监控页面。</p>

<p v-pre>注意：这个页面和售后经营分析看板不同。</p>

<ul v-pre><li><div><div><p>售后经营看板：回答业务经营得怎么样。</p></div></div></li><li><div><div><p>数据质量看板：回答数据是否可信、任务是否正常、指标是否可以发布。</p></div></div></li></ul>

#### 1. 页面布局

<p v-pre>建议分成五个区域。</p>

#### 数据质量监控中心

<p v-pre>Data Quality Monitor</p>

<p v-pre><div>存在异常</div></p>

<p v-pre>2026-11-21 · 教学模拟数据</p>

<p v-pre>质量规则通过率</p>

### 91.7%

<p v-pre>11 / 12 条规则</p>

<p v-pre>待处理异常</p>

### 13

<p v-pre>3 条阻断级，10 条高优先级</p>

<p v-pre>数据同步延迟</p>

### 18 分钟

<p v-pre>相对计划完成时间</p>

<p v-pre>指标发布成功率</p>

### 75%

<p v-pre>3 / 4 个指标</p>

<p v-pre><span><strong>最近7天质量趋势</strong></span></p>

<p v-pre><div><span class="interaction"><span>通过规则数</span></span><span class="interaction"><span>失败规则数</span></span></div></p>

<ul v-pre><li>11-15: 通过规则数 10, 失败规则数 2</li><li>11-16: 通过规则数 11, 失败规则数 1</li><li>11-17: 通过规则数 12, 失败规则数 0</li><li>11-18: 通过规则数 10, 失败规则数 2</li><li>11-19: 通过规则数 11, 失败规则数 1</li><li>11-20: 通过规则数 10, 失败规则数 2</li><li>11-21: 通过规则数 11, 失败规则数 1</li></ul>

<p v-pre><span><strong>指标发布状态</strong></span></p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>当前版本</p></th><th><p>状态</p></th></tr><tr><td><p>售后申请总量</p></td><td><p>V42</p></td><td><p></p><div>正常</div></td></tr><tr><td><p>平均解决时长</p></td><td><p>V42</p></td><td><p></p><div>正常</div></td></tr><tr><td><p>团队排行榜</p></td><td><p>V41</p></td><td><p></p><div>数据滞后</div></td></tr><tr><td><p>SLA 超时率</p></td><td><p>V42</p></td><td><p></p><div>正常</div></td></tr></tbody></table>

<p v-pre><span><strong>待处理告警</strong></span></p>

<p v-pre>团队维度关联失败</p>

<p v-pre><div>P0</div></p>

<p v-pre>影响团队排行榜 · 10 条异常记录</p>

<p v-pre>解决时长数据异常</p>

<p v-pre><div>P1</div></p>

<p v-pre>3 条异常记录 · 等待复核</p>

<p v-pre><span>以上均为示意数据，不代表实际运行状态。</span></p>

#### 2. 看板应该提供哪些功能？

<table v-pre><tbody><tr><th><p>页面区域</p></th><th><p>具体功能</p></th></tr><tr><td><p>质量总览</p></td><td><p>通过率、异常数量、数据延迟</p></td></tr><tr><td><p>质量趋势</p></td><td><p>每日异常变化、规则通过率</p></td></tr><tr><td><p>异常明细</p></td><td><p>规则、订单、错误原因</p></td></tr><tr><td><p>指标发布</p></td><td><p>当前版本、历史版本、发布状态</p></td></tr><tr><td><p>告警管理</p></td><td><p>告警分级、责任人、处理进度</p></td></tr></tbody></table>

<p v-pre>建议异常明细支持下钻：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>DQ004 团队关联失败        ↓ 查看10条异常记录        ↓ 定位具体售后单        ↓ 查看原始数据和团队维度        ↓ 修复映射关系        ↓ 重新执行质量检查        ↓ 恢复指标发布</span></code></div></p>

#### 3. 质量监控 API 设计

<p v-pre>在第五课的 FastAPI 基础上，新增：</p>

<table v-pre><tbody><tr><th><p>API</p></th><th><p>用途</p></th></tr><tr><td><p><code>GET /api/v1/quality/overview</code></p></td><td><p>质量总览</p></td></tr><tr><td><p><code>GET /api/v1/quality/rules</code></p></td><td><p>质量规则列表</p></td></tr><tr><td><p><code>GET /api/v1/quality/results</code></p></td><td><p>检查结果</p></td></tr><tr><td><p><code>GET /api/v1/quality/alerts</code></p></td><td><p>告警列表</p></td></tr><tr><td><p><code>GET /api/v1/quality/releases</code></p></td><td><p>指标发布记录</p></td></tr><tr><td><p><code>GET /api/v1/quality/releases/{release_id}</code></p></td><td><p>发布详情</p></td></tr><tr><td><p><code>POST /api/v1/quality/alerts/{id}/assign</code></p></td><td><p>分配告警</p></td></tr><tr><td><p><code>POST /api/v1/quality/alerts/{id}/resolve</code></p></td><td><p>处理告警</p></td></tr></tbody></table>

<p v-pre>权限建议：</p>

<ul v-pre><li><div><div><p>售后主管：只能查看质量状态和受授权范围内的业务数据。</p></div></div></li><li><div><div><p>数据开发人员：可以查看异常详情和执行修复。</p></div></div></li><li><div><div><p>数据管理员：可以配置规则和管理发布。</p></div></div></li><li><div><div><p>普通业务用户：不能修改质量规则或切换指标版本。</p></div></div></li></ul>

<p v-pre>对于修改指标发布状态、关闭 P0 告警等操作，建议记录操作人、操作前后状态、时间和审批信息。</p>

### 五、第四步：建立质量问题复盘机制

<p v-pre>系统不能只统计异常数量，还要知道问题是否反复出现。</p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>日期</p></th><th><p>问题</p></th><th><p>根因</p></th><th><p>处理结果</p></th></tr><tr><td><p>11-18</p></td><td><p>增量遗漏</p></td><td><p>游标边界错误</p></td><td><p>修复游标</p></td></tr><tr><td><p>11-19</p></td><td><p>团队关联失败</p></td><td><p>新团队未同步</p></td><td><p>补充维度</p></td></tr><tr><td><p>11-20</p></td><td><p>解决时长异常</p></td><td><p>计算规则错误</p></td><td><p>修复 SQL</p></td></tr><tr><td><p>11-21</p></td><td><p>团队关联失败</p></td><td><p>历史团队映射缺失</p></td><td><p>待处理</p></td></tr></tbody></table>

<p v-pre>通过历史记录可以发现：</p>

<ul v-pre><li><div><div><p>哪类质量问题最频繁？</p></div></div></li><li><div><div><p>哪个 ETL 任务最容易失败？</p></div></div></li><li><div><div><p>哪些规则经常重复触发？</p></div></div></li><li><div><div><p>平均修复时间是多少？</p></div></div></li><li><div><div><p>修复之后是否再次发生？</p></div></div></li></ul>

<p v-pre>建议建立每周质量复盘机制，重点分析重复发生的 P0/P1 问题，而不是只追求规则通过率达到 100%。</p>

#### 质量管理的三个重要指标

<p v-pre><div><span><span><span>问题修复时长=问题关闭时间−问题发现时间问题修复时长 = 问题关闭时间-问题发现时间</span></span></span></div><div><span><span><span>重复问题率=重复发生的问题数问题总数重复问题率 = \frac{重复发生的问题数}{问题总数}</span></span></span></div><div><span><span><span>数据新鲜度=当前时间−数据截至时间数据新鲜度 = 当前时间-数据截至时间</span></span></span></div></p>

<p v-pre>这些指标可以帮助你判断质量体系是否真正改善，而不只是增加了检查规则。</p>

### 六、第五步：第七课最终项目验收

<p v-pre>现在我们将数据质量治理正式纳入售后分析系统。</p>

<p v-pre>建议将最终项目验收分成六个模块。</p>

<p v-pre><span><strong>售后数据质量项目验收表</strong></span></p>

### 0/24

<p v-pre><span><strong>数据完整性</strong></span></p>

<p v-pre><label><span><p>DQ01 · 源表与目标表主键对账</p></span></label></p>

<p v-pre><label><span><p>DQ02 · 重复订单检测</p></span></label></p>

<p v-pre><label><span><p>DQ03 · 缺失记录定位</p></span></label></p>

<p v-pre><label><span><p>DQ04 · 关键字段合法性检查</p></span></label></p>

<p v-pre><span><strong>数据隔离</strong></span></p>

<p v-pre><label><span><p>DQ05 · 异常数据隔离表完成</p></span></label></p>

<p v-pre><label><span><p>DQ06 · 原始数据可追溯</p></span></label></p>

<p v-pre><label><span><p>DQ07 · 异常修复和重新处理</p></span></label></p>

<p v-pre><label><span><p>DQ08 · 隔离记录有审计历史</p></span></label></p>

<p v-pre><span><strong>指标发布</strong></span></p>

<p v-pre><label><span><p>DQ09 · 指标独立版本管理</p></span></label></p>

<p v-pre><label><span><p>DQ10 · 发布前质量检查</p></span></label></p>

<p v-pre><label><span><p>DQ11 · 版本指针原子切换</p></span></label></p>

<p v-pre><label><span><p>DQ12 · 旧版本保留与回滚</p></span></label></p>

<p v-pre><span><strong>质量告警</strong></span></p>

<p v-pre><label><span><p>DQ13 · 告警分级和去重</p></span></label></p>

<p v-pre><label><span><p>DQ14 · 告警责任人管理</p></span></label></p>

<p v-pre><label><span><p>DQ15 · 异常通知与处理记录</p></span></label></p>

<p v-pre><span><strong>质量监控</strong></span></p>

<p v-pre><label><span><p>DQ16 · 质量总览页面</p></span></label></p>

<p v-pre><label><span><p>DQ17 · 质量趋势图</p></span></label></p>

<p v-pre><label><span><p>DQ18 · 异常明细下钻</p></span></label></p>

<p v-pre><label><span><p>DQ19 · 指标发布状态展示</p></span></label></p>

<p v-pre><span><strong>最终验证</strong></span></p>

<p v-pre><label><span><p>DQ20 · ETL 全链路质量测试</p></span></label></p>

<p v-pre><label><span><p>DQ21 · 指标独立复算</p></span></label></p>

<p v-pre><label><span><p>DQ22 · API 权限测试</p></span></label></p>

<p v-pre><label><span><p>DQ23 · 异常发布阻断测试</p></span></label></p>

<p v-pre><label><span><p>DQ24 · 修复后重新发布测试</p></span></label></p>

<p v-pre><span>请在真实代码实现并测试通过后勾选。当前为教学验收模板，不代表已经完成工程验收。</span></p>

#### 1. 最终验收标准

<table v-pre><tbody><tr><th><p>评审项目</p></th><th><p>通过条件</p></th></tr><tr><td><p>数据完整性</p></td><td><p>符合业务口径的源目标数据可以对账</p></td></tr><tr><td><p>数据准确性</p></td><td><p>核心指标可通过明细独立复算</p></td></tr><tr><td><p>数据隔离</p></td><td><p>异常记录不会污染正常统计</p></td></tr><tr><td><p>指标发布</p></td><td><p>未通过阻断规则的指标不能发布</p></td></tr><tr><td><p>版本管理</p></td><td><p>可以追踪当前版本及历史版本</p></td></tr><tr><td><p>质量告警</p></td><td><p>异常可以通知、分配、关闭</p></td></tr><tr><td><p>数据监控</p></td><td><p>可以查看质量趋势和异常明细</p></td></tr><tr><td><p>闭环管理</p></td><td><p>问题修复后能够重新验证并恢复发布</p></td></tr></tbody></table>

### 七、第七课最终评审报告

#### 售后数据分析系统 · 数据质量治理 V1

<p v-pre><span><strong>质量体系设计</strong></span></p>

<p v-pre><div>学习评审通过</div></p>

<p v-pre><span><strong>数据隔离机制</strong></span></p>

<p v-pre><div>方案已确定</div></p>

<p v-pre><span><strong>指标版本管理</strong></span></p>

<p v-pre><div>方案已确定</div></p>

<p v-pre><span><strong>独立指标发布</strong></span></p>

<p v-pre><div>方案已确定</div></p>

<p v-pre><span><strong>质量告警与闭环</strong></span></p>

<p v-pre><div>方案已确定</div></p>

<p v-pre><span><strong>质量监控看板</strong></span></p>

<p v-pre><div>原型已设计</div></p>

<p v-pre><span><strong>真实数据库实现</strong></span></p>

<p v-pre><div>待执行</div></p>

<p v-pre><span><strong>自动化测试</strong></span></p>

<p v-pre><div>待执行</div></p>

<p v-pre><span><strong>生产环境验收</strong></span></p>

<p v-pre><div>待执行</div></p>

#### 八、七课学习成果总结

<p v-pre>你已经完成了一个完整的数据分析系统的设计学习。</p>

<table v-pre><tbody><tr><th><p>课程</p></th><th><p>你掌握的核心能力</p></th></tr><tr><td><p>第一课</p></td><td><p>理解数据分析系统的业务价值</p></td></tr><tr><td><p>第二课</p></td><td><p>需求调研、指标体系、PRD</p></td></tr><tr><td><p>第三课</p></td><td><p>数据建模、事实表、维度表</p></td></tr><tr><td><p>第四课</p></td><td><p>Python ETL、增量同步、任务调度</p></td></tr><tr><td><p>第五课</p></td><td><p>FastAPI、RBAC、数据权限</p></td></tr><tr><td><p>第六课</p></td><td><p>React、ECharts、交互下钻</p></td></tr><tr><td><p>第七课</p></td><td><p>数据质量、版本发布、质量治理</p></td></tr></tbody></table>

<p v-pre>你的技术路线已经形成：</p>

#### 售后数据分析系统完整架构

<p v-pre><span><strong>React + TypeScript + ECharts</strong></span></p>

<p v-pre>业务分析看板 / 质量监控看板</p>

<p v-pre><span><strong>FastAPI + SQLAlchemy</strong></span></p>

<p v-pre>API / JWT / RBAC / 数据权限</p>

<p v-pre><span><strong>MySQL</strong></span></p>

<p v-pre>ODS / DWD / ADS / Quality</p>

<p v-pre><span><strong>Python + Celery + Redis</strong></span></p>

<p v-pre>ETL / 数据质量 / 指标发布</p>

<p v-pre><span><strong>业务数据源</strong></span></p>

<p v-pre>售后申请 / 客服处理 / 团队 / SLA</p>

#### 九、第八课：系统部署、上线与运行维护

<p v-pre>接下来不建议继续堆叠新的开发框架。</p>

<p v-pre>我们应该把之前学习的内容真正串成一个可以上线运行的系统。</p>

<p v-pre>第八课将学习：</p>

<ol v-pre><li><div><div><p>Docker Compose 部署 React、FastAPI、MySQL、Redis。</p></div></div></li><li><div><div><p>Nginx 反向代理与 HTTPS。</p></div></div></li><li><div><div><p>Docker Secrets 和环境变量安全管理。</p></div></div></li><li><div><div><p>数据库备份、恢复与迁移。</p></div></div></li><li><div><div><p>Celery Worker 和 Beat 生产部署。</p></div></div></li><li><div><div><p>日志、监控、异常告警。</p></div></div></li><li><div><div><p>CI/CD 自动化发布。</p></div></div></li><li><div><div><p>灰度发布、回滚与上线验收。</p></div></div></li></ol>

<p v-pre>最终完成一个完整的项目交付：</p>

<p v-pre><span><strong>售后数据分析系统 V1：从业务需求到生产部署、数据监控和持续运营。</strong></span></p>

<p v-pre>我的建议是，第八课采用真正的工程项目方式推进：每一节都产出可执行的配置、代码、测试或部署成果，而不是只停留在概念学习。</p>
