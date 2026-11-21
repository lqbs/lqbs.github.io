---
title: "第五章　FastAPI 接口与权限"
description: "设计分析接口、身份认证、团队数据权限和查询性能验收。"
outline: [2, 2]
prev:
  text: "第四章　ETL 增量同步与补数"
  link: "/posts/aftersales-analytics/04-etl"
next:
  text: "第六章　React 与 ECharts 看板"
  link: "/posts/aftersales-analytics/06-dashboard"
---

# 第五章　FastAPI 接口与权限

设计分析接口、身份认证、团队数据权限和查询性能验收。

[返回完整目录](/posts/aftersales-analytics-from-scratch#完整目录)

## 第 27 轮　接口契约、参数校验和汇总查询 {#turn-27}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第五课实战问题1，我选择：B。理由：数据交接面。请评价，并开始指导我设计 FastAPI 数据分析接口，包括接口规范、参数校验、权限控制和查询性能。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第五课：FastAPI 数据分析接口设计

<p v-pre><div>实战问题1：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：FastAPI 提供经营总览接口，从 ADS 汇总表读取指标，统一处理权限、时间范围和指标口径。</strong></span></p>

<p v-pre>你的理由是「数据交接面」，这个理解很有价值。</p>

<p v-pre>在软件架构中，更准确的说法是：</p>

<p v-pre><span><strong>API 是前后端之间稳定的数据契约（Data Contract）。</strong></span></p>

<p v-pre>它不仅负责传递数据，还负责规定：</p>

<ul v-pre><li><div><div><p>前端可以请求什么数据。</p></div></div></li><li><div><div><p>请求参数必须满足什么规则。</p></div></div></li><li><div><div><p>当前用户有权查看哪些数据。</p></div></div></li><li><div><div><p>返回结果的字段和业务含义是什么。</p></div></div></li><li><div><div><p>出现错误时如何响应。</p></div></div></li></ul>

<p v-pre>我们继续使用之前的售后分析系统进行实战。</p>

#### 一、先理解数据分析 API 的架构

<p v-pre><span><strong>React + ECharts</strong></span></p>

<p v-pre>展示 KPI 卡片、趋势图、团队排行榜</p>

<p v-pre><span><strong>FastAPI 路由层</strong></span></p>

<p v-pre>接收 HTTP 请求、校验参数、返回响应</p>

<p v-pre><span><strong>Service 业务层</strong></span></p>

<p v-pre>指标口径、数据权限、业务逻辑</p>

<p v-pre><span><strong>Repository 数据访问层</strong></span></p>

<p v-pre>SQLAlchemy、查询优化、数据读取</p>

<p v-pre><span><strong>MySQL ADS</strong></span></p>

<p v-pre>已加工并通过质量检查的统计数据</p>

<p v-pre>为什么不让前端直接连接 MySQL？</p>

<p v-pre>因为那样会暴露数据库访问能力、难以统一权限和指标口径，也会让前端依赖数据库内部结构。</p>

<p v-pre>我们希望前端只依赖 API，而不需要知道 ADS 表是如何设计的。</p>

### 二、第一步：设计 API 接口规范

<p v-pre>假设售后主管打开数据看板，需要查看指定日期范围内的经营指标。</p>

<p v-pre>推荐先设计四个接口。</p>

<table v-pre><tbody><tr><th><p>接口</p></th><th><p>HTTP 方法</p></th><th><p>用途</p></th></tr><tr><td><p><code>/api/v1/aftersales/overview</code></p></td><td><p>GET</p></td><td><p>KPI 总览</p></td></tr><tr><td><p><code>/api/v1/aftersales/trends</code></p></td><td><p>GET</p></td><td><p>售后趋势</p></td></tr><tr><td><p><code>/api/v1/aftersales/teams</code></p></td><td><p>GET</p></td><td><p>团队表现</p></td></tr><tr><td><p><code>/api/v1/aftersales/issues</code></p></td><td><p>GET</p></td><td><p>售后问题分布</p></td></tr></tbody></table>

<p v-pre>其中 <code>/api/v1</code> 表示 API 版本。</p>

<p v-pre>以后即使底层数据库结构发生变化，只要 API 契约保持稳定，前端通常不需要修改。</p>

#### 1. 设计总览接口

<p v-pre>请求：</p>

<p v-pre><div>HTTP</div></p>

<p v-pre><div><code><span><span>GET /api/v1/aftersales/overview?start_date=2026-11-01&amp;end_date=2026-11-20</span> <span><span>Authorization</span><span>: </span>Bearer &lt;access_token&gt;</span></span></code></div></p>

<p v-pre>返回：</p>

<p v-pre><div>JSON</div></p>

```json

{
  "code": 0,
  "message": "success",
  "data": {
    "start_date": "2026-11-01",
    "end_date": "2026-11-20",
    "created_order_count": 1280,
    "resolved_order_count": 1150,
    "avg_resolution_minutes": 58.2,
    "sla_overdue_rate": 0.125,
    "complaint_count": 36
  }
}

```

<p v-pre>这里要特别注意两个问题。</p>

<p v-pre><span><strong>第一，接口字段必须表达清楚业务含义。</strong></span></p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p><code>created_order_count</code>：统计期间创建的售后申请数量。</p></div></div></li><li><div><div><p><code>resolved_order_count</code>：统计期间解决的售后申请数量。</p></div></div></li><li><div><div><p><code>avg_resolution_minutes</code>：统计期间解决的售后申请，其平均解决时长。</p></div></div></li><li><div><div><p><code>sla_overdue_rate</code>：统计期间 SLA 到期的售后申请中，按既定规则判定超时的比例。</p></div></div></li><li><div><div><p><code>complaint_count</code>：统计期间发生的投诉数量。</p></div></div></li></ul>

<p v-pre>这些指标虽然放在同一个总览接口里，但它们的统计日期依据不同，不能简单地把它们当成同一批订单的漏斗。</p>

<p v-pre><span><strong>第二，返回数据要有统一单位。</strong></span></p>

<p v-pre>例如：</p>

<p v-pre><code>0.125</code> 表示比例，前端格式化为 <code>12.5%</code>。</p>

<p v-pre>不要让有的接口返回 <code>0.125</code>，有的接口返回 <code>12.5</code>，否则前端很容易出现错误。</p>

### 三、第二步：使用 FastAPI 实现参数校验

#### 1. 安装依赖

<p v-pre><div>Bash</div></p>

```bash
uv add fastapi "uvicorn[standard]" sqlalchemy pymysql
```

<p v-pre>项目结构：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>app/ ├── main.py ├── api/ │   └── v1/ │       └── aftersales.py ├── schemas/ │   └── aftersales.py ├── services/ │   └── aftersales_service.py ├── repositories/ │   └── aftersales_repository.py └── database/     └── session.py</span></code></div></p>

#### 2. 使用 Pydantic 定义查询参数

<p v-pre><code>app/schemas/aftersales.py</code></p>

<p v-pre><div>Python</div></p>

```text

from datetime import date

from pydantic import BaseModel, Field, model_validator


class OverviewQuery(BaseModel):
    start_date: date
    end_date: date
    team_id: int | None = Field(
        default=None,
        gt=0,
    )

    @model_validator(mode="after")
    def validate_date_range(self):
        if self.start_date > self.end_date:
            raise ValueError(
                "开始日期不能晚于结束日期"
            )

        if (self.end_date - self.start_date).days > 90:
            raise ValueError(
                "单次查询不能超过91个自然日"
            )

        return self

```

<p v-pre>这里包含三种校验：</p>

<table v-pre><tbody><tr><th><p>参数</p></th><th><p>校验规则</p></th></tr><tr><td><p><code>start_date</code></p></td><td><p>必须是合法日期</p></td></tr><tr><td><p><code>end_date</code></p></td><td><p>不得早于开始日期</p></td></tr><tr><td><p><code>team_id</code></p></td><td><p>可选；传入时必须大于0</p></td></tr></tbody></table>

<p v-pre>另外还限制了查询时间范围，避免用户一次请求几年数据造成不必要的数据库压力。</p>

#### 3. 定义返回模型

<p v-pre><div>Python</div></p>

```text

from datetime import date

from pydantic import BaseModel


class OverviewData(BaseModel):
    start_date: date
    end_date: date

    created_order_count: int
    resolved_order_count: int

    avg_resolution_minutes: float | None
    sla_overdue_rate: float | None

    complaint_count: int


class OverviewResponse(BaseModel):
    code: int = 0
    message: str = "success"
    data: OverviewData

```

<p v-pre>为什么平均解决时长和 SLA 超时率允许返回 <code>null</code>？</p>

<p v-pre>因为有时统计期间没有符合条件的订单。</p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>没有任何已解决订单，平均解决时长无法计算。</p></div></div></li><li><div><div><p>没有任何 SLA 到期订单，超时率的分母为零。</p></div></div></li></ul>

<p v-pre>这种情况下，返回 <code>null</code> 比返回 <code>0</code> 更准确。</p>

<p v-pre><code>0</code> 表示确实计算出零，而 <code>null</code> 表示该指标没有可计算的结果。</p>

### 四、第三步：实现 FastAPI 路由

<p v-pre>先用模拟数据实现接口契约，再接入真实数据库。</p>

<p v-pre><code>app/api/v1/aftersales.py</code></p>

<p v-pre><div>Python</div></p>

```text

from typing import Annotated

from fastapi import APIRouter, Depends

from app.schemas.aftersales import (
    OverviewQuery,
    OverviewData,
    OverviewResponse,
)

router = APIRouter(
    prefix="/aftersales",
    tags=["售后数据分析"],
)


@router.get(
    "/overview",
    response_model=OverviewResponse,
)
def get_overview(
    query: Annotated[OverviewQuery, Depends()],
):
    return OverviewResponse(
        data=OverviewData(
            start_date=query.start_date,
            end_date=query.end_date,
            created_order_count=1280,
            resolved_order_count=1150,
            avg_resolution_minutes=58.2,
            sla_overdue_rate=0.125,
            complaint_count=36,
        )
    )

```

<p v-pre><code>app/main.py</code></p>

<p v-pre><div>Python</div></p>

```text

from fastapi import FastAPI

from app.api.v1.aftersales import router

app = FastAPI(
    title="售后数据分析 API",
    version="1.0.0",
)

app.include_router(
    router,
    prefix="/api/v1",
)

```

<p v-pre>运行：</p>

<p v-pre><div>Bash</div></p>

```bash
uv run uvicorn app.main:app --reload
```

<p v-pre>访问：</p>

<p v-pre><code>http://127.0.0.1:8000/docs</code></p>

<p v-pre>就可以打开 FastAPI 自动生成的交互式 API 文档。</p>

<p v-pre>注意：目前返回的是模拟数据，仅用于验证接口结构和参数校验，还没有接入 ADS。</p>

### 五、第四步：设计数据权限控制

<p v-pre>现在进入真正重要的业务问题。</p>

<p v-pre>假设系统有三种角色：</p>

<table v-pre><tbody><tr><th><p>角色</p></th><th><p>数据权限</p></th></tr><tr><td><p>老板</p></td><td><p>查看全部团队</p></td></tr><tr><td><p>售后主管</p></td><td><p>查看自己负责的团队</p></td></tr><tr><td><p>客服人员</p></td><td><p>仅查看自己有权限的个人数据</p></td></tr></tbody></table>

<p v-pre>如果主管 A 负责团队 101，主管 B 负责团队 102。</p>

<p v-pre>主管 A 请求：</p>

<p v-pre><div>HTTP</div></p>

<p v-pre><div><code><span><span>GET /api/v1/aftersales/overview?team_id=102</span></span></code></div></p>

<p v-pre>应该怎么办？</p>

<p v-pre><span><strong>不能因为前端传入了 </strong><code>team_id=102</code><strong>，后端就直接查询团队 102 的数据。</strong></span></p>

<p v-pre>这是典型的越权访问风险。</p>

#### 1. 区分身份认证与权限控制

<ul v-pre><li><div><div><p>Authentication：你是谁？</p></div></div></li><li><div><div><p>Authorization：你能访问什么？</p></div></div></li></ul>

<p v-pre>推荐流程：</p>

<p v-pre><span><strong>验证 Access Token</strong></span></p>

<p v-pre><span><strong>获取当前用户身份和角色</strong></span></p>

<p v-pre><span><strong>查询用户授权的团队范围</strong></span></p>

<p v-pre><span><strong>在 SQL 查询中强制应用权限条件</strong></span></p>

<p v-pre>这里的核心原则是：</p>

<p v-pre><span><strong>数据权限必须由后端可信的用户身份和授权关系决定，不能由前端参数决定。</strong></span></p>

#### 2. SQL 查询必须带权限范围

<p v-pre>例如主管 A 只能查看团队 101：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    SUM(assigned_order_count) AS assigned_count,
    SUM(resolved_order_count) AS resolved_count
FROM ads_aftersales_team_daily
WHERE stat_date BETWEEN :start_date AND :end_date
  AND team_id IN :allowed_team_ids;
```

<p v-pre>实际使用 SQLAlchemy 时，应使用支持展开列表参数的绑定方式，或 ORM 的 <code>in_()</code> 表达式，而不是直接把 ID 拼接成 SQL 字符串。</p>

<p v-pre>此外，<code>team_id</code> 未传入不代表用户可以查看所有团队。它应该表示查看当前用户有权访问的全部团队。</p>

<p v-pre>如果请求的团队不在授权范围内，应拒绝访问。</p>

### 六、第五步：设计查询性能优化

<p v-pre>数据分析 API 与普通 CRUD 接口有一个明显区别：</p>

<p v-pre><span><strong>分析接口通常需要聚合大量数据。</strong></span></p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>统计最近30天的售后订单量。</p></div></div></li><li><div><div><p>计算各团队平均解决时长。</p></div></div></li><li><div><div><p>查询最近90天的趋势。</p></div></div></li></ul>

<p v-pre>如果每次都扫描售后明细和处理事件，随着数据增长，查询可能越来越慢。</p>

<p v-pre>因此，我们在第三课设计了 ADS 汇总表。</p>

#### 1. 明细查询与汇总查询对比

<table v-pre><tbody><tr><th><p>方案</p></th><th><p>特点</p></th><th><p>适用场景</p></th></tr><tr><td><p>直接查询 DWD</p></td><td><p>灵活，但可能扫描大量明细</p></td><td><p>订单核验、明细下钻</p></td></tr><tr><td><p>查询 ADS</p></td><td><p>预先计算，通常更快</p></td><td><p>KPI、趋势、排行榜</p></td></tr><tr><td><p>Redis 缓存 ADS 结果</p></td><td><p>降低重复查询压力</p></td><td><p>高频访问、热点指标</p></td></tr></tbody></table>

<p v-pre>对于 MVP：</p>

<p v-pre><span><strong>优先使用 ADS + 合理索引，不急于增加 Redis 查询缓存。</strong></span></p>

<p v-pre>因为 Celery 已经使用 Redis 作为任务消息代理，并不意味着所有 API 都需要缓存。</p>

#### 2. ADS 查询示例

<p v-pre><div>SQL</div></p>

```sql
SELECT
    SUM(assigned_order_count) AS assigned_count,
    SUM(resolved_order_count) AS resolved_count,

    ROUND(
        SUM(resolution_minutes_sum)
        / NULLIF(SUM(resolved_count_for_avg), 0),
        2
    ) AS avg_resolution_minutes

FROM ads_aftersales_team_daily

WHERE stat_date BETWEEN :start_date AND :end_date
  AND team_id = :team_id;
```

<p v-pre>这里最重要的是平均值的计算方式。</p>

<p v-pre><span><strong>不能直接对每天的平均解决时长再求平均。</strong></span></p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>日期</p></th><th><p>已解决订单</p></th><th><p>平均解决时长</p></th></tr><tr><td><p>第一天</p></td><td><p>10单</p></td><td><p>30分钟</p></td></tr><tr><td><p>第二天</p></td><td><p>90单</p></td><td><p>60分钟</p></td></tr></tbody></table>

<p v-pre>错误算法：</p>

<p v-pre><div><span><span><span>(30+60)/2=45分钟(30+60)/2=45\text{分钟}</span></span></span></div></p>

<p v-pre>正确算法：</p>

<p v-pre><div><span><span><span>10×30+90×6010+90=57分钟\frac{10\times30+90\times60}{10+90}=57\text{分钟}</span></span></span></div></p>

<p v-pre>因此，ADS 最好保留：</p>

<ul v-pre><li><div><div><p><code>resolution_minutes_sum</code></p></div></div></li><li><div><div><p><code>resolved_count_for_avg</code></p></div></div></li></ul>

<p v-pre>再根据总时长和总订单数计算加权平均。</p>

<p v-pre>对于前面设计的总览接口，还需要补齐全局售后创建量、投诉量和 SLA 到期口径对应的汇总数据，不能直接用团队接手量冒充创建量，也不能把不同团队的参与订单数简单相加当作全局去重订单数。</p>

### 七、第五课实战问题2：数据权限设计

<p v-pre>假设售后主管 A 只能查看团队 101 的数据。</p>

<p v-pre>但是他修改浏览器请求参数：</p>

<p v-pre><div>HTTP</div></p>

<p v-pre><div><code><span><span>GET /api/v1/aftersales/overview?team_id=102</span></span></code></div></p>

<p v-pre>其中团队 102 属于另一位主管。</p>

<p v-pre>你认为后端应该如何处理？</p>

<p v-pre><div><label>A. 前端已经隐藏团队102，因此后端不需要验证。</label></div><div><label>B. 后端根据当前登录用户的授权团队范围验证 team_id，不在范围内则拒绝访问。</label></div><div><label>C. 只要用户登录成功，就允许查看所有团队数据。</label></div><div><label>D. 返回团队102的数据，但不显示团队名称。</label></div></p>

<p v-pre><span><strong>请说明你的理由</strong></span></p>

```text
前端请求不行，感觉有点差点意思。你给给给找谁删了吧。不能作为权限依据。
```

<p v-pre><span class="interaction"><span>提交答案，继续第五课</span></span></p>

#### 本课学习进度

<p v-pre>理解 API 数据契约</p>

<p v-pre>设计 REST API 接口规范</p>

<p v-pre>Pydantic 参数与响应校验</p>

<p v-pre>FastAPI 路由实现</p>

<p v-pre>数据权限控制原理</p>

<p v-pre>ADS 查询与性能优化</p>

<p v-pre>身份认证与 RBAC 实现</p>

<p v-pre>Service / Repository 分层</p>

<p v-pre>接口自动化测试</p>

<p v-pre>API 开发验收</p>

<p v-pre><span><strong>第五课目前最重要的知识点：</strong></span></p>

<p v-pre>API 不只是把数据库结果转换成 JSON，而是负责统一数据契约、业务口径、访问权限和查询性能。</p>

<p v-pre>下一步我们会把身份认证和数据范围控制真正写进 FastAPI，避免出现「接口能用，但任何登录用户都能查看其他团队数据」的问题。</p>

## 第 28 轮　JWT、RBAC 和团队数据权限 {#turn-28}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第五课实战问题2，我选择：B。理由：前端请求不能作为权限依据。。请评价我的数据权限设计，并继续指导我实现 FastAPI 身份认证、RBAC、数据范围控制与接口测试。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第五课 · 实战3：FastAPI 身份认证、RBAC 与数据权限

<p v-pre><div>实战问题2：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：后端根据当前登录用户的授权范围验证 </strong><code>team_id</code><strong>，不在范围内则拒绝访问。</strong></span></p>

<p v-pre>你的理由是「前端请求不能作为权限依据」，完全正确，而且已经抓住了权限设计最重要的原则。</p>

<p v-pre>我再帮你提升一个层次：</p>

<p v-pre><span><strong>前端参数表示用户想访问什么；后端授权系统决定用户实际能访问什么。</strong></span></p>

<p v-pre>例如，售后主管 A 请求团队 102 的数据，即使请求格式合法、Token 有效，也不代表他有权访问团队 102。</p>

<p v-pre>这涉及三个不同概念：</p>

<table v-pre><tbody><tr><th><p>概念</p></th><th><p>解决的问题</p></th><th><p>示例</p></th></tr><tr><td><p>Authentication（认证）</p></td><td><p>你是谁？</p></td><td><p>验证 JWT Token</p></td></tr><tr><td><p>RBAC（角色权限）</p></td><td><p>你能执行什么操作？</p></td><td><p>主管可以查看团队报表</p></td></tr><tr><td><p>Data Scope（数据范围）</p></td><td><p>你能查看哪些数据？</p></td><td><p>主管只能查看团队 101</p></td></tr></tbody></table>

<p v-pre>下面我们把三者组合起来。</p>

#### 一、设计完整的 API 安全架构

<p v-pre><span><strong>React 前端</strong></span></p>

<p v-pre>携带 Access Token 发起请求</p>

<p v-pre><span><strong>FastAPI 身份认证</strong></span></p>

<p v-pre>验证 JWT 签名、有效期、用户身份</p>

<p v-pre><span><strong>RBAC 功能权限</strong></span></p>

<p v-pre>是否拥有 aftersales:overview:read 权限</p>

<p v-pre><span><strong>Data Scope 数据范围</strong></span></p>

<p v-pre>计算用户有权访问的团队集合</p>

<p v-pre><span><strong>SQLAlchemy 查询 ADS</strong></span></p>

<p v-pre>强制应用团队过滤条件</p>

<p v-pre>注意：<span><strong>认证成功，不等于授权成功。</strong></span></p>

### 二、设计 RBAC 数据模型

<p v-pre>为了便于理解，我们采用最小 RBAC 模型。</p>

<table v-pre><tbody><tr><th><p>表名</p></th><th><p>作用</p></th></tr><tr><td><p><code>sys_user</code></p></td><td><p>用户信息</p></td></tr><tr><td><p><code>sys_role</code></p></td><td><p>角色定义</p></td></tr><tr><td><p><code>sys_permission</code></p></td><td><p>功能权限</p></td></tr><tr><td><p><code>sys_user_role</code></p></td><td><p>用户与角色关联</p></td></tr><tr><td><p><code>sys_role_permission</code></p></td><td><p>角色与权限关联</p></td></tr><tr><td><p><code>sys_user_team_scope</code></p></td><td><p>用户可访问的团队</p></td></tr></tbody></table>

<p v-pre>假设：</p>

<table v-pre><tbody><tr><th><p>用户</p></th><th><p>角色</p></th><th><p>授权团队</p></th></tr><tr><td><p>老板</p></td><td><p>ADMIN</p></td><td><p>全部团队</p></td></tr><tr><td><p>主管 A</p></td><td><p>SUPERVISOR</p></td><td><p>101</p></td></tr><tr><td><p>主管 B</p></td><td><p>SUPERVISOR</p></td><td><p>102</p></td></tr><tr><td><p>客服 C</p></td><td><p>AGENT</p></td><td><p>101，但仅能访问个人明细</p></td></tr></tbody></table>

<p v-pre>这里有个重要细节：</p>

<p v-pre>客服 C 即使属于团队 101，也不意味着他可以查看团队 101 的全部订单明细。</p>

<p v-pre>因此，功能权限和数据范围必须分别判断。</p>

#### 推荐的权限编码

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>aftersales:overview:read aftersales:trend:read aftersales:team:read aftersales:order:read aftersales:order:export</span></code></div></p>

<p v-pre>这种编码方式适合 B 端系统，也便于以后扩展。</p>

### 三、使用 JWT 实现身份认证

<p v-pre>JWT（JSON Web Token）是一种常见的身份令牌格式。</p>

<p v-pre>典型流程：</p>

<ol v-pre><li><div><div><p>用户输入账号密码。</p></div></div></li><li><div><div><p>后端验证密码哈希。</p></div></div></li><li><div><div><p>后端签发 Access Token。</p></div></div></li><li><div><div><p>前端携带 Token 请求接口。</p></div></div></li><li><div><div><p>FastAPI 验证 Token。</p></div></div></li><li><div><div><p>根据用户身份加载当前权限。</p></div></div></li></ol>

#### 1. 安装依赖

<p v-pre><div>Bash</div></p>

```bash
uv add pyjwt "pwdlib[argon2]"
```

<p v-pre>密码不能明文保存，建议使用 Argon2id 等成熟的密码哈希算法。</p>

<p v-pre>JWT 密钥通过环境变量配置，不应硬编码在源代码中。</p>

#### 2. 签发 Token

<p v-pre><code>app/security/jwt.py</code></p>

<p v-pre><div>Python</div></p>

```text

import os
from datetime import datetime, timedelta, timezone

import jwt

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"


def create_access_token(user_id: int) -> str:
    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(minutes=30),
        "iss": "aftersales-api",
        "aud": "aftersales-web",
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )

```

<p v-pre>这里：</p>

<ul v-pre><li><div><div><p><code>sub</code>：用户 ID。</p></div></div></li><li><div><div><p><code>iat</code>：签发时间。</p></div></div></li><li><div><div><p><code>exp</code>：过期时间。</p></div></div></li><li><div><div><p><code>iss</code>：签发方。</p></div></div></li><li><div><div><p><code>aud</code>：目标接收方。</p></div></div></li></ul>

<p v-pre>为什么不直接把所有团队权限放进 JWT？</p>

<p v-pre>因为权限可能发生变化。</p>

<p v-pre>例如主管 A 今天负责团队 101，明天调整为团队 102。</p>

<p v-pre>如果把团队列表长期写入 Token，权限变更可能不能及时生效。</p>

<p v-pre>所以我们推荐：<span><strong>Token 证明身份，权限范围从可信的服务端数据获取。</strong></span></p>

### 四、FastAPI 验证当前用户

<p v-pre><code>app/security/dependencies.py</code></p>

<p v-pre>下面是认证依赖的核心实现。</p>

<p v-pre><div>Python</div></p>

```text

import os

import jwt

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/token"
)


def get_current_user_id(
    token: str = Depends(oauth2_scheme),
) -> int:
    try:
        payload = jwt.decode(
            token,
            os.environ["JWT_SECRET"],
            algorithms=["HS256"],
            issuer="aftersales-api",
            audience="aftersales-web",
            options={"require": ["sub", "exp", "iat"]},
        )

        return int(payload["sub"])

    except (jwt.PyJWTError, ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="登录凭证无效或已过期",
            headers={"WWW-Authenticate": "Bearer"},
        )

```

<p v-pre>这个依赖完成了 Token 验证，但还需要通过数据库检查用户是否存在、是否被禁用。</p>

<p v-pre>不能仅仅因为 JWT 签名正确，就认定账号仍然有效。</p>

### 五、实现 RBAC 功能权限

<p v-pre>假设我们已经通过数据库查询得到用户的权限集合。</p>

<p v-pre>先设计一个权限检查依赖。</p>

<p v-pre><div>Python</div></p>

```text

from fastapi import Depends, HTTPException


def require_permission(permission_code: str):

    def checker(
        user_id: int = Depends(get_current_user_id),
    ):
        # 这里调用真实的权限服务
        permissions = permission_service.get_permissions(
            user_id
        )

        if permission_code not in permissions:
            raise HTTPException(
                status_code=403,
                detail="没有访问该功能的权限",
            )

        return user_id

    return checker

```

<p v-pre>这里的 <code>permission_service</code> 是后续需要实现的数据库服务，不是 Python 内置对象。</p>

<p v-pre>调用方式：</p>

<p v-pre><div>Python</div></p>

```text
@router.get("/overview")
def get_overview(
    user_id: int = Depends(
        require_permission("aftersales:overview:read")
    ),
):
    ...
```

<p v-pre>这样即使用户登录成功，如果没有总览查看权限，也会返回 HTTP 403。</p>

### 六、实现 Data Scope 数据范围控制

<p v-pre>这是本节最重要的部分。</p>

<p v-pre>假设：</p>

<ul v-pre><li><div><div><p>老板可以访问全部团队。</p></div></div></li><li><div><div><p>主管 A 可以访问团队 101。</p></div></div></li><li><div><div><p>主管 B 可以访问团队 102。</p></div></div></li></ul>

<p v-pre>我们设计一个权限范围对象：</p>

<p v-pre><div>Python</div></p>

```text

from dataclasses import dataclass


@dataclass(frozen=True)
class DataScope:
    all_teams: bool
    allowed_team_ids: frozenset[int]

```

<p v-pre>注意这里使用 <code>all_teams</code> 显式表示全部团队权限。</p>

<p v-pre>不能把空集合当成全部团队。</p>

<p v-pre>因为：</p>

<ul v-pre><li><div><div><p>空集合应该表示没有任何团队权限。</p></div></div></li><li><div><div><p><code>all_teams=True</code> 才表示全部团队权限。</p></div></div></li></ul>

#### 1. 验证请求团队

<p v-pre><div>Python</div></p>

```text

from fastapi import HTTPException


def validate_team_scope(
    requested_team_id: int | None,
    scope: DataScope,
) -> frozenset[int] | None:

    if requested_team_id is not None:

        if (
            not scope.all_teams
            and requested_team_id
            not in scope.allowed_team_ids
        ):
            raise HTTPException(
                status_code=403,
                detail="无权访问该团队数据",
            )

        return frozenset({requested_team_id})

    if scope.all_teams:
        return None

    return scope.allowed_team_ids

```

<p v-pre>这里返回值的含义是：</p>

<ul v-pre><li><div><div><p><code>None</code>：允许全部团队。</p></div></div></li><li><div><div><p>非空集合：只允许指定团队。</p></div></div></li><li><div><div><p>空集合：没有团队权限。</p></div></div></li></ul>

<p v-pre>后续 Repository 必须严格执行这个范围。</p>

#### 2. 在 SQLAlchemy 中强制过滤

<p v-pre><div>Python</div></p>

```text

from sqlalchemy import select, func


def query_team_summary(
    session,
    model,
    start_date,
    end_date,
    allowed_team_ids,
):
    stmt = select(
        func.sum(
            model.resolved_order_count
        ).label("resolved_count")
    ).where(
        model.stat_date.between(
            start_date,
            end_date,
        )
    )

    if allowed_team_ids is not None:
        stmt = stmt.where(
            model.team_id.in_(allowed_team_ids)
        )

    return session.execute(stmt).one()

```

<p v-pre>如果 <code>allowed_team_ids</code> 是空集合，SQLAlchemy 会生成不匹配任何团队的过滤条件。</p>

<p v-pre>这是正确的。</p>

<p v-pre><span><strong>绝不能因为集合为空就跳过权限过滤。</strong></span></p>

### 七、编写 API 权限测试

<p v-pre>现在我们不只是实现功能，还要证明权限不会被绕过。</p>

<p v-pre>FastAPI 可以配合 <code>pytest</code> 和 <code>TestClient</code> 进行接口测试。</p>

<p v-pre><div>Bash</div></p>

```bash
uv add --dev pytest httpx
```

<p v-pre>假设已经实现了认证、RBAC 和数据范围依赖，我们至少要验证以下场景：</p>

<table v-pre><tbody><tr><th><p>测试编号</p></th><th><p>场景</p></th><th><p>预期 HTTP 状态</p></th></tr><tr><td><p>A01</p></td><td><p>未携带 Token</p></td><td><p>401</p></td></tr><tr><td><p>A02</p></td><td><p>Token 无效</p></td><td><p>401</p></td></tr><tr><td><p>A03</p></td><td><p>Token 过期</p></td><td><p>401</p></td></tr><tr><td><p>A04</p></td><td><p>用户没有总览权限</p></td><td><p>403</p></td></tr><tr><td><p>A05</p></td><td><p>主管 A 查看团队 101</p></td><td><p>200</p></td></tr><tr><td><p>A06</p></td><td><p>主管 A 查看团队 102</p></td><td><p>403</p></td></tr><tr><td><p>A07</p></td><td><p>主管 A 不传 team_id</p></td><td><p>200，仅返回授权范围</p></td></tr><tr><td><p>A08</p></td><td><p>用户没有任何团队授权</p></td><td><p>不能返回其他团队数据</p></td></tr><tr><td><p>A09</p></td><td><p>日期参数格式错误</p></td><td><p>422</p></td></tr><tr><td><p>A10</p></td><td><p>日期范围超过限制</p></td><td><p>422</p></td></tr></tbody></table>

#### 一个权限测试示例

<p v-pre><div>Python</div></p>

```text

def test_supervisor_cannot_access_other_team(
    client,
    supervisor_a_token,
):
    response = client.get(
        "/api/v1/aftersales/overview",
        params={
            "start_date": "2026-11-01",
            "end_date": "2026-11-20",
            "team_id": 102,
        },
        headers={
            "Authorization":
                f"Bearer {supervisor_a_token}"
        },
    )

    assert response.status_code == 403

```

<p v-pre>这里的 <code>client</code> 和 <code>supervisor_a_token</code> 是 pytest Fixture，需要在测试项目中定义。</p>

<p v-pre>真正的测试还应该验证：不传 <code>team_id</code> 时，响应结果中确实不包含其他团队的数据，而不是只检查 HTTP 200。</p>

### 八、第五课实战问题3：权限变更后如何保证立即生效？

<p v-pre>现在给你一道更接近生产环境的题目。</p>

<p v-pre>假设：</p>

<ul v-pre><li><div><div><p>主管 A 原来负责团队 101。</p></div></div></li><li><div><div><p>10:00 登录系统，获得一个有效期 30 分钟的 JWT。</p></div></div></li><li><div><div><p>10:05 管理员撤销了他对团队 101 的访问权限。</p></div></div></li><li><div><div><p>10:10 主管 A 使用原来的 JWT 再次请求团队 101 的数据。</p></div></div></li></ul>

<p v-pre>你认为应该怎么处理？</p>

<p v-pre><div><label>A. JWT 还没过期，因此继续允许访问团队101。</label></div><div><label>B. JWT 只用于验证身份，后端重新读取或使用已失效处理的权限缓存，发现权限撤销后返回403。</label></div><div><label>C. 让前端隐藏团队101即可，不需要修改后端。</label></div><div><label>D. 等 JWT 30分钟后过期，权限才正式生效。</label></div></p>

<p v-pre><span><strong>请说明你的理由</strong></span></p>

```text
JWT 有效不代表数据访问权限。你好点背靠背吧。你这整的前不着村，着不着店的，你这不是纯靠我吗？哈哈哈。
```

<p v-pre><span class="interaction"><span>提交答案，继续第五课</span></span></p>

#### 本节知识总结

<p v-pre>JWT 验证用户身份</p>

<p v-pre>RBAC 控制功能访问</p>

<p v-pre>Data Scope 控制数据范围</p>

<p v-pre>SQLAlchemy 强制权限过滤</p>

<p v-pre>FastAPI 依赖注入</p>

<p v-pre>接口权限测试设计</p>

<p v-pre>权限变更与缓存失效</p>

<p v-pre>完整 Service/Repository 实现</p>

<p v-pre>接口性能测试与最终验收</p>

<p v-pre><span><strong>本节最重要的结论：</strong></span></p>

<p v-pre>登录认证决定「你是谁」，RBAC 决定「你能做什么」，Data Scope 决定「你能看哪些数据」。</p>

<p v-pre>只有这三层共同生效，数据分析 API 才能满足 B 端系统的基本安全要求。</p>

## 第 29 轮　Service 与 Repository 分层、权限缓存和慢查询 {#turn-29}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第五课实战问题3，我选择：B。理由：JWT 有效不代表数据访问权限。。请评价我的权限变更设计，并继续指导我完成 FastAPI Service/Repository 分层、权限缓存与接口性能优化。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第五课 · 实战4：FastAPI 分层架构、权限缓存与性能优化

<p v-pre><div>实战问题3：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：JWT 用于验证身份，后端重新检查当前权限；权限被撤销后返回 403。</strong></span></p>

<p v-pre>你的理由是：</p>

<blockquote v-pre><p>JWT 有效不代表数据访问权限有效。</p></blockquote>

<p v-pre><span><strong>完全正确。</strong></span> 这说明你已经能够区分身份认证和业务授权。</p>

<p v-pre>进一步完善你的思路：</p>

<ul v-pre><li><div><div><p>JWT 有效：只能说明令牌通过了验证。</p></div></div></li><li><div><div><p>账号有效：还需要确认用户没有被禁用或注销。</p></div></div></li><li><div><div><p>功能权限有效：确认用户有权访问当前 API。</p></div></div></li><li><div><div><p>数据权限有效：确认用户有权查看指定团队。</p></div></div></li><li><div><div><p>权限变更：必须在系统约定的生效时间内反映到后端授权判断。</p></div></div></li></ul>

<p v-pre>如果要求权限撤销立即生效，就不能依赖尚未过期的旧权限缓存。</p>

<p v-pre>接下来，我们进入 FastAPI 工程开发中非常重要的一部分：<span><strong>如何组织代码，让业务逻辑、权限和数据库查询既清晰又容易测试。</strong></span></p>

#### 一、为什么要进行 Service / Repository 分层？

<p v-pre>假设我们直接把所有代码写进一个 API：</p>

<p v-pre><div>Python</div></p>

```text
@router.get("/overview")
def get_overview():
    # 1. 验证 JWT
    # 2. 查询用户角色
    # 3. 查询授权团队
    # 4. 拼接 SQL
    # 5. 计算 KPI
    # 6. 返回 JSON
    ...
```

<p v-pre>短期看起来简单，但后续增加趋势分析、团队排行榜、投诉分析时，代码会越来越难维护。</p>

<p v-pre>推荐使用以下结构：</p>

<p v-pre><span><strong>Router · 接口层</strong></span></p>

<p v-pre>接收参数、注入身份、调用 Service、返回响应</p>

<p v-pre><span><strong>Service · 业务层</strong></span></p>

<p v-pre>校验业务权限、确定数据范围、组织指标逻辑</p>

<p v-pre><span><strong>Repository · 数据访问层</strong></span></p>

<p v-pre>SQLAlchemy 查询、聚合、分页、数据库访问</p>

<p v-pre><span><strong>MySQL ADS</strong></span></p>

<p v-pre>已通过数据质量检查的指标数据</p>

<p v-pre>记住三个职责：</p>

<table v-pre><tbody><tr><th><p>层</p></th><th><p>负责什么</p></th><th><p>不应该负责什么</p></th></tr><tr><td><p>Router</p></td><td><p>HTTP 协议、参数、响应</p></td><td><p>复杂 SQL、指标计算</p></td></tr><tr><td><p>Service</p></td><td><p>业务规则、授权范围、指标组织</p></td><td><p>直接拼接原始 SQL</p></td></tr><tr><td><p>Repository</p></td><td><p>数据库查询和持久化</p></td><td><p>判断用户角色、生成 HTTP 响应</p></td></tr></tbody></table>

<p v-pre>这不是要求每个函数都必须拆成三层，而是把容易变化、需要独立测试的职责分开。</p>

### 二、设计实际项目目录

<p v-pre>沿用前面售后分析系统的技术栈：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>aftersales-api/ ├── app/ │   ├── main.py │   ├── api/ │   │   └── v1/ │   │       └── aftersales.py │   ├── core/ │   │   ├── config.py │   │   └── security.py │   ├── schemas/ │   │   └── aftersales.py │   ├── services/ │   │   ├── aftersales_service.py │   │   └── permission_service.py │   ├── repositories/ │   │   ├── aftersales_repository.py │   │   └── permission_repository.py │   ├── models/ │   │   └── ads.py │   └── database/ │       └── session.py ├── tests/ │   ├── test_aftersales_api.py │   ├── test_permissions.py │   └── test_performance.py └── pyproject.toml</span></code></div></p>

<p v-pre>我们的目标是完成一个真实的接口：</p>

<p v-pre><code>GET /api/v1/aftersales/overview</code></p>

<p v-pre>并确保主管只能读取自己授权团队的数据。</p>

### 三、Repository：实现数据库查询

<p v-pre>先使用之前设计的 <code>ads_aftersales_team_daily</code> 汇总表。</p>

<p v-pre>为了聚焦分层架构，本节先实现两个已存在的指标：</p>

<ul v-pre><li><div><div><p>团队接手订单量。</p></div></div></li><li><div><div><p>团队解决订单量。</p></div></div></li></ul>

<p v-pre>完整经营总览还需要其他 ADS 指标表支持，不能把接手量直接当成全局创建量。</p>

#### 1. 定义 ORM 模型

<p v-pre><code>app/models/ads.py</code></p>

<p v-pre><div>Python</div></p>

```text

from datetime import date

from sqlalchemy import Date, Integer, BigInteger
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class AftersalesTeamDaily(Base):
    __tablename__ = "ads_aftersales_team_daily"

    stat_date: Mapped[date] = mapped_column(
        Date, primary_key=True
    )

    team_id: Mapped[int] = mapped_column(
        BigInteger, primary_key=True
    )

    assigned_order_count: Mapped[int] = mapped_column(
        Integer, nullable=False
    )

    resolved_order_count: Mapped[int] = mapped_column(
        Integer, nullable=False
    )

```

<p v-pre>这里使用联合主键：</p>

<p v-pre><code>(stat_date, team_id)</code></p>

<p v-pre>表示一个团队在某个统计日期只有一条日汇总记录。</p>

<p v-pre>实际项目中的 ORM 模型还应包含此前设计的其他指标字段，并与数据库迁移脚本保持一致。</p>

#### 2. 实现 Repository

<p v-pre><code>app/repositories/aftersales_repository.py</code></p>

<p v-pre><div>Python</div></p>

```text

from datetime import date

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.models.ads import AftersalesTeamDaily


class AftersalesRepository:

    def get_team_summary(
        self,
        db: Session,
        start_date: date,
        end_date: date,
        team_ids: frozenset[int] | None,
    ):
        stmt = select(
            func.coalesce(
                func.sum(
                    AftersalesTeamDaily.assigned_order_count
                ), 0
            ).label("assigned_count"),

            func.coalesce(
                func.sum(
                    AftersalesTeamDaily.resolved_order_count
                ), 0
            ).label("resolved_count"),
        ).where(
            AftersalesTeamDaily.stat_date.between(
                start_date,
                end_date,
            )
        )
```

<p v-pre>这里有两个重要设计。</p>

<p v-pre><span><strong>第一：Repository 不关心用户是谁。</strong></span></p>

<p v-pre>它只接收已经确定的数据范围 <code>team_ids</code>。</p>

<p v-pre><span><strong>第二：空集合不能被当作全部团队。</strong></span></p>

<ul v-pre><li><div><div><p><code>None</code>：表示全部团队。</p></div></div></li><li><div><div><p><code>{101}</code>：表示团队 101。</p></div></div></li><li><div><div><p>空集合：表示不允许匹配任何团队。</p></div></div></li></ul>

<p v-pre>只有经过授权的 Service 才能决定是否传入 <code>None</code>。</p>

### 四、Service：实现业务规则与权限控制

<p v-pre><code>app/services/aftersales_service.py</code></p>

<p v-pre><div>Python</div></p>

```text

from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.aftersales_repository import (
    AftersalesRepository,
)


class AftersalesService:

    def __init__(self):
        self.repository = AftersalesRepository()

    def get_team_overview(
        self,
        db: Session,
        start_date: date,
        end_date: date,
        requested_team_id: int | None,
        allowed_team_ids: frozenset[int],
        can_view_all_teams: bool,
    ):
        if requested_team_id is not None:
            if (
                not can_view_all_teams
                and requested_team_id not in allowed_team_ids
            ):
                raise HTTPException(
                    status_code=403,
                    detail="无权访问该团队数据",
                )

            team_ids = frozenset({requested_team_id})
```

<p v-pre>这个 Service 的关键点是：</p>

<p v-pre><span><strong>先计算合法数据范围，再调用 Repository。</strong></span></p>

<p v-pre>注意，<code>allowed_team_ids</code> 和 <code>can_view_all_teams</code> 必须来自可信的权限服务，而不是前端请求参数。</p>

<p v-pre>另外，生产代码中更推荐使用独立的领域异常，而不是让 Service 直接抛出 <code>HTTPException</code>。这里暂时简化，便于你理解。</p>

### 五、Router：组合 API、认证与业务服务

<p v-pre>Router 的职责应该非常薄。</p>

<p v-pre><div>Python</div></p>

```text

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

router = APIRouter(prefix="/aftersales")


@router.get("/team-overview")
def get_team_overview(
    start_date: date,
    end_date: date,
    team_id: int | None = Query(default=None, gt=0),

    db: Session = Depends(get_db),

    current_user: CurrentUser = Depends(
        require_permission("aftersales:team:read")
    ),
):
    if start_date > end_date:
        raise HTTPException(
            status_code=422,
            detail="日期范围不合法",
        )

    scope = permission_service.get_data_scope(
        db=db,
        user_id=current_user.id,
    )

    service = AftersalesService()

    return service.get_team_overview(
```

<p v-pre>其中 <code>get_db</code>、<code>CurrentUser</code>、<code>require_permission</code> 和 <code>permission_service</code> 是前面身份认证及权限模块需要提供的组件。此处展示的是组合方式，不是可以单独运行的完整文件。</p>

<p v-pre>实际实现时，建议通过 FastAPI 依赖注入创建 Service，便于测试时替换依赖。</p>

### 六、权限缓存：如何兼顾性能与安全？

<p v-pre>这是你刚才那道题的延伸。</p>

<p v-pre>假设每次 API 请求都要查询：</p>

<ol v-pre><li><div><div><p>用户表。</p></div></div></li><li><div><div><p>用户角色表。</p></div></div></li><li><div><div><p>角色权限表。</p></div></div></li><li><div><div><p>团队授权表。</p></div></div></li></ol>

<p v-pre>如果看板每秒有大量请求，权限查询会带来额外数据库压力。</p>

<p v-pre>因此可以使用 Redis 缓存权限。</p>

#### 1. 缓存结构

<p v-pre><span><strong>FastAPI 收到请求</strong></span></p>

<p v-pre>JWT 已通过身份验证</p>

<p v-pre><span><strong>Redis 查询权限缓存</strong></span></p>

<p v-pre>Key：permission:user:1001</p>

<p v-pre><span><strong>缓存命中</strong></span></p>

<p v-pre>读取权限并校验版本</p>

<p v-pre><span><strong>缓存未命中</strong></span></p>

<p v-pre>查询 MySQL 并写入 Redis</p>

<p v-pre><span><strong>执行 RBAC + Data Scope 检查</strong></span></p>

<p v-pre>只查询授权范围内的数据</p>

#### 2. 缓存示例

<p v-pre><div>JSON</div></p>

```json
{
  "user_id": 1001,
  "permissions": [
    "aftersales:team:read",
    "aftersales:overview:read"
  ],
  "all_teams": false,
  "team_ids": [101],
  "version": 7
}
```

<p v-pre>可以设置一个较短的缓存 TTL，例如 60 秒。</p>

<p v-pre>但要注意：</p>

<p v-pre><span><strong>TTL 为 60 秒，不代表权限撤销能够立即生效。</strong></span></p>

<p v-pre>如果业务要求立即撤销权限，必须设计主动失效机制。</p>

#### 3. 推荐的权限变更策略

<p v-pre>对于当前 MVP：</p>

<ul v-pre><li><div><div><p>用户授权信息存储在 MySQL。</p></div></div></li><li><div><div><p>Redis 缓存权限数据。</p></div></div></li><li><div><div><p>管理员修改权限时，在数据库事务中更新授权和权限版本。</p></div></div></li><li><div><div><p>后端验证缓存版本是否仍然有效。</p></div></div></li><li><div><div><p>版本不一致时重新加载权限。</p></div></div></li><li><div><div><p>Redis 不可用或无法确认权限有效性时，对敏感查询采取拒绝访问或回源校验策略。</p></div></div></li></ul>

<p v-pre>这里还有一个容易忽略的竞态问题：</p>

<p v-pre>数据库提交成功后，如果 Redis 删除缓存失败，旧权限仍可能被读取。</p>

<p v-pre>因此，不能仅靠「更新数据库后删除 Redis Key」就声称权限一定立即生效。</p>

<p v-pre>对严格实时撤权的接口，可以每次读取可信的权限版本，或者使用具备一致性保证的授权校验服务。</p>

<p v-pre>对于普通内部报表，可以根据业务风险约定一个明确的权限生效时限。</p>

### 七、接口性能优化：从 SQL 到缓存

<p v-pre>假设售后分析系统有 100 名用户同时打开看板。</p>

<p v-pre>每个人都请求：</p>

<p v-pre><code>GET /api/v1/aftersales/team-overview</code></p>

<p v-pre>我们应该按什么顺序优化？</p>

#### 推荐优化顺序

<ol v-pre><li><div><div><p><span><strong>先检查 SQL</strong></span></p><p>使用 <code>EXPLAIN ANALYZE</code> 检查实际执行计划、扫描行数和耗时。</p></div></div></li><li><div><div><p><span><strong>检查索引</strong></span></p><p>根据日期范围、团队过滤条件和查询选择性设计索引。</p></div></div></li><li><div><div><p><span><strong>优先查询 ADS</strong></span></p><p>不让每次 KPI 请求重新扫描大量 DWD 明细。</p></div></div></li><li><div><div><p><span><strong>限制请求规模</strong></span></p><p>限制日期跨度、分页大小和可查询字段。</p></div></div></li><li><div><div><p><span><strong>必要时增加缓存</strong></span></p><p>对高频、允许短暂延迟的统计结果使用 Redis。</p></div></div></li></ol>

#### 1. 索引设计

<p v-pre>当前 ADS 表的主键是：</p>

<p v-pre><div>SQL</div></p>

```sql
PRIMARY KEY (stat_date, team_id)
```

<p v-pre>如果主要按日期范围查询全部团队，这个索引可能已经适合。</p>

<p v-pre>但如果经常查询某个团队最近 90 天的数据，可以考虑增加：</p>

<p v-pre><div>SQL</div></p>

```sql
CREATE INDEX idx_team_date
ON ads_aftersales_team_daily (
    team_id,
    stat_date
);
```

<p v-pre>为什么字段顺序不同？</p>

<p v-pre>因为 B-Tree 复合索引通常遵循最左前缀原则。</p>

<p v-pre>例如：</p>

<p v-pre><div>SQL</div></p>

```sql
WHERE team_id = 101
  AND stat_date BETWEEN '2026-09-01' AND '2026-11-20'
```

<p v-pre>这种查询可以较好地利用 <code>(team_id, stat_date)</code>。</p>

<p v-pre>不过是否真正需要新增索引，必须根据查询频率、执行计划和写入成本判断。</p>

<p v-pre>不能看到查询慢就盲目增加索引。</p>

#### 2. 使用 EXPLAIN ANALYZE

<p v-pre><div>SQL</div></p>

```sql
EXPLAIN ANALYZE
SELECT
    SUM(resolved_order_count)
FROM ads_aftersales_team_daily
WHERE team_id = 101
  AND stat_date BETWEEN
      '2026-09-01' AND '2026-11-20';
```

<p v-pre>重点观察：</p>

<ul v-pre><li><div><div><p>是否使用预期索引。</p></div></div></li><li><div><div><p>实际扫描多少行。</p></div></div></li><li><div><div><p>查询耗时。</p></div></div></li><li><div><div><p>是否出现不必要的全表扫描。</p></div></div></li></ul>

#### 3. API 缓存设计

<p v-pre>假设团队 101 的最近 30 天指标被反复请求。</p>

<p v-pre>可以设计缓存 Key：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>aftersales:team-overview:v1: team=101: start=2026-10-22: end=2026-11-20: data_version=42</span></code></div></p>

<p v-pre>这里的 <code>data_version</code> 表示已发布 ADS 数据版本。</p>

<p v-pre>为什么建议加入版本？</p>

<p v-pre>因为 ETL 可能重新计算历史数据。</p>

<p v-pre>如果缓存只按日期生成，历史数据修复后，API 仍可能返回旧结果。</p>

<p v-pre>使用数据版本可以降低缓存失效管理的复杂度。</p>

<p v-pre>对于多团队查询，还应保证缓存 Key 包含规范化后的授权团队范围，或者只缓存可复用的单团队指标后再按授权范围聚合，避免跨用户数据泄露。</p>

### 八、接口性能验收标准

<p v-pre>我们先制定 MVP 的目标。</p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>建议目标</p></th></tr><tr><td><p>总览接口 P95</p></td><td><p>不超过 300ms</p></td></tr><tr><td><p>趋势接口 P95</p></td><td><p>不超过 500ms</p></td></tr><tr><td><p>团队排行榜 P95</p></td><td><p>不超过 500ms</p></td></tr><tr><td><p>未授权访问</p></td><td><p>100% 拒绝</p></td></tr><tr><td><p>无效参数</p></td><td><p>返回 422</p></td></tr><tr><td><p>数据权限越权</p></td><td><p>返回 403</p></td></tr><tr><td><p>指标一致性</p></td><td><p>与已发布 ADS 核对一致</p></td></tr></tbody></table>

<p v-pre>这些是设计目标，不是已经完成的压测结果。</p>

<p v-pre>正式验收时需要在约定并发量、数据规模和部署环境下进行测试。</p>

### 九、第五课实战问题4：如何优化慢查询？

<p v-pre>现在给你一道架构设计实战题。</p>

<p v-pre>假设：</p>

<ul v-pre><li><div><div><p><code>dwd_aftersales_order</code> 已经有 1000 万条数据。</p></div></div></li><li><div><div><p><code>ads_aftersales_team_daily</code> 只有几万条数据。</p></div></div></li><li><div><div><p>主管查询最近 30 天团队售后统计。</p></div></div></li><li><div><div><p>当前 API 每次都扫描 DWD 明细，响应时间约 5 秒。</p></div></div></li></ul>

<p v-pre>你会选择哪种方案？</p>

<p v-pre><div><label>A. 先增加服务器内存，不修改 SQL。</label></div><div><label>B. 优先查询 ADS 汇总表，检查索引与执行计划，再评估是否需要缓存。</label></div><div><label>C. 让前端下载全部 DWD 数据，在浏览器计算指标。</label></div><div><label>D. 每次请求都重新运行完整 ETL，再返回结果。</label></div></p>

<p v-pre><span><strong>请说明你的优化思路</strong></span></p>

```text
分析接口应该查询汇总好的数据。 Just so.
```

<p v-pre><span class="interaction"><span>提交答案，进入第五课验收</span></span></p>

#### 第五课当前进度

<p v-pre>API 数据契约设计</p>

<p v-pre>Pydantic 参数与响应模型</p>

<p v-pre>JWT 身份认证</p>

<p v-pre>RBAC 与 Data Scope</p>

<p v-pre>Service / Repository 分层</p>

<p v-pre>权限缓存与撤权策略</p>

<p v-pre>SQL 索引与 ADS 查询优化</p>

<p v-pre>API 自动化测试</p>

<p v-pre>性能压测与开发验收</p>

<p v-pre><span><strong>本节最值得掌握的工程原则：</strong></span></p>

<ul v-pre><li><div><div><p>Router 保持简单。</p></div></div></li><li><div><div><p>Service 负责业务规则和授权。</p></div></div></li><li><div><div><p>Repository 负责数据库访问。</p></div></div></li><li><div><div><p>权限缓存不能破坏撤权时效。</p></div></div></li><li><div><div><p>优化查询时，先检查数据模型和 SQL，再考虑增加缓存或服务器资源。</p></div></div></li></ul>

<p v-pre>下一步，我们将通过接口测试与性能验收，把第五课的 API 设计阶段正式收尾。</p>

## 第 30 轮　接口评审、自动化测试和开发验收 {#turn-30}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第五课实战问题4，我选择：B。理由：分析接口应该查询汇总好的数据。。请评价我的接口性能优化思路，并带我完成第五课最终 API 设计评审、自动化测试与开发验收。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第五课收官：FastAPI 设计评审、自动化测试与开发验收

<p v-pre><div>实战问题4：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：优先查询 ADS 汇总表，检查索引与执行计划，再评估是否需要缓存。</strong></span></p>

<p v-pre>理由是：</p>

<blockquote v-pre><p>分析接口应该查询汇总好的数据。</p></blockquote>

<p v-pre><span><strong>判断正确，而且抓住了数据分析系统与普通业务系统的重要区别。</strong></span></p>

<p v-pre>我帮你把这个回答提升到架构设计层面：</p>

<p v-pre><span><strong>对于固定口径、高频访问的统计指标，优先使用预计算的 ADS 数据；对于明细核验和临时分析，再按需访问 DWD。</strong></span></p>

<p v-pre>但还需要补充一个前提：ADS 的数据粒度、统计口径、授权范围和新鲜度必须满足接口要求。</p>

<p v-pre>例如，<code>ads_aftersales_team_daily</code> 适合查询团队日统计，却不能直接用于查询单个售后订单的处理过程。</p>

#### 一、第五课最终 API 设计评审

<p v-pre>我们的目标是为生鲜电商售后分析看板提供安全、准确、高效的 API。</p>

#### 售后分析 API V1 架构

<p v-pre><span><strong>React + ECharts</strong></span></p>

<p v-pre>经营总览、趋势分析、团队表现、明细下钻</p>

<p v-pre><span><strong>FastAPI Router</strong></span></p>

<p v-pre>请求参数、响应模型、JWT 认证</p>

<p v-pre><span><strong>Service</strong></span></p>

<p v-pre>RBAC、Data Scope、指标口径、业务规则</p>

<p v-pre><span><strong>Repository</strong></span></p>

<p v-pre>SQLAlchemy、参数化查询、聚合、分页</p>

<p v-pre><span><strong>MySQL ADS / DWD</strong></span></p>

<p v-pre>ADS 用于统计；DWD 用于授权后的明细核验</p>

##### 评审结论

<table v-pre><tbody><tr><th><p>评审维度</p></th><th><p>设计结论</p></th><th><p>状态</p></th></tr><tr><td><p>API 规范</p></td><td><p>REST 风格、<code>/api/v1</code>、统一响应模型</p></td><td><p>设计通过</p></td></tr><tr><td><p>参数校验</p></td><td><p>Pydantic、日期范围、分页限制</p></td><td><p>设计通过</p></td></tr><tr><td><p>身份认证</p></td><td><p>JWT + 服务端账号状态校验</p></td><td><p>设计通过</p></td></tr><tr><td><p>功能权限</p></td><td><p>RBAC 权限编码</p></td><td><p>设计通过</p></td></tr><tr><td><p>数据权限</p></td><td><p>Data Scope 强制 SQL 过滤</p></td><td><p>设计通过</p></td></tr><tr><td><p>代码架构</p></td><td><p>Router / Service / Repository</p></td><td><p>设计通过</p></td></tr><tr><td><p>查询性能</p></td><td><p>ADS 优先、索引、执行计划</p></td><td><p>设计通过</p></td></tr><tr><td><p>缓存</p></td><td><p>按授权范围和数据版本隔离</p></td><td><p>设计通过</p></td></tr><tr><td><p>自动化测试</p></td><td><p>需要实际运行</p></td><td><p>待验证</p></td></tr><tr><td><p>性能压测</p></td><td><p>需要实际测量</p></td><td><p>待验证</p></td></tr></tbody></table>

<p v-pre>这里的“设计通过”表示方案满足本课程的架构评审要求，不代表代码已经完成生产验收。</p>

### 二、最终 API 契约

<p v-pre>建议 MVP 保留以下四个接口。</p>

<table v-pre><tbody><tr><th><p>接口</p></th><th><p>主要数据</p></th><th><p>数据来源</p></th></tr><tr><td><p><code>GET /aftersales/overview</code></p></td><td><p>KPI 总览</p></td><td><p>多个 ADS 指标汇总</p></td></tr><tr><td><p><code>GET /aftersales/trends</code></p></td><td><p>每日售后趋势</p></td><td><p>ADS 日汇总</p></td></tr><tr><td><p><code>GET /aftersales/teams</code></p></td><td><p>团队绩效排行</p></td><td><p>ADS 团队日汇总</p></td></tr><tr><td><p><code>GET /aftersales/orders</code></p></td><td><p>售后明细</p></td><td><p>DWD 售后申请及授权关联</p></td></tr></tbody></table>

<p v-pre>统一加上 <code>/api/v1</code> 前缀。</p>

<p v-pre>对于经营总览，我们继续沿用之前确定的指标口径。</p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>统计日期依据</p></th></tr><tr><td><p>新增售后申请量</p></td><td><p>申请创建日期</p></td></tr><tr><td><p>已解决售后申请量</p></td><td><p>实际解决日期</p></td></tr><tr><td><p>平均解决时长</p></td><td><p>解决日期，已解决申请</p></td></tr><tr><td><p>SLA 超时率</p></td><td><p>SLA 到期日期</p></td></tr><tr><td><p>投诉数量</p></td><td><p>投诉发生日期</p></td></tr></tbody></table>

<p v-pre><span><strong>重要评审发现：</strong></span></p>

<p v-pre>此前设计的 <code>ads_aftersales_team_daily</code> 不能独立支撑所有总览指标。需要补齐按对应统计日期汇总的事实或指标表，并确保跨团队聚合时不会重复计算同一售后申请。</p>

<p v-pre>同时，所有指标必须明确数据截至时间，例如 <code>data_as_of</code>，否则用户可能误以为看板展示的是实时数据。</p>

### 三、自动化测试：从功能正确到权限安全

<p v-pre>建议使用 <code>pytest + FastAPI TestClient</code>。</p>

<p v-pre><div>Bash</div></p>

```bash
uv add --dev pytest httpx
```

<p v-pre>测试分为三层：</p>

<p v-pre><span><strong>单元测试</strong></span></p>

<p v-pre>Service 业务规则、日期校验、数据权限计算</p>

<p v-pre><span><strong>接口测试</strong></span></p>

<p v-pre>HTTP 状态码、参数、响应结构、身份认证</p>

<p v-pre><span><strong>集成测试</strong></span></p>

<p v-pre>真实测试 MySQL、Repository SQL、数据隔离、指标核对</p>

#### 1. 使用依赖替换测试 API

<p v-pre>下面展示一个最小的、可以独立运行的 FastAPI 权限测试示例。它不依赖生产数据库，专门验证 HTTP 层和团队权限。</p>

<p v-pre><div>Python</div></p>

```text

# tests/test_api_permissions.py

from datetime import date

from fastapi import FastAPI, Depends, HTTPException
from fastapi.testclient import TestClient
from pydantic import BaseModel, model_validator


app = FastAPI()


class QueryParams(BaseModel):
    start_date: date
    end_date: date
    team_id: int | None = None

    @model_validator(mode="after")
    def check_dates(self):
        if self.start_date > self.end_date:
            raise ValueError("日期范围错误")
        return self


def get_current_user():
    raise HTTPException(
        status_code=401,
        detail="未登录",
    )


def get_authorized_teams():
    return frozenset({101})


```

<p v-pre>运行：</p>

<p v-pre><div>Bash</div></p>

```bash
uv run pytest tests/test_api_permissions.py -v
```

<p v-pre>预期三个测试全部通过。</p>

<p v-pre>这个示例只测试简化的身份依赖和数据范围逻辑。生产项目仍需要测试真实 JWT 验证、用户禁用、权限撤销、SQL 查询范围和响应数据隔离。</p>

### 四、API 完整验收测试矩阵

<p v-pre>这是我建议你在正式项目中使用的测试清单。</p>

<p v-pre><span><strong>项目验收清单</strong></span></p>

<p v-pre>0/14 已验证</p>

<p v-pre><label><span><div><div><p>F01 · 合法日期范围</p><p>预期：200</p></div></div></span></label></p>

<p v-pre><label><span><div><div><p>F02 · 开始日期晚于结束日期</p><p>预期：422</p></div></div></span></label></p>

<p v-pre><label><span><div><div><p>F03 · 查询跨度超过限制</p><p>预期：422</p></div></div></span></label></p>

<p v-pre><label><span><div><div><p>F04 · 无 Token</p><p>预期：401</p></div></div></span></label></p>

<p v-pre><label><span><div><div><p>F05 · 无效或过期 Token</p><p>预期：401</p></div></div></span></label></p>

<p v-pre><label><span><div><div><p>F06 · 用户缺少功能权限</p><p>预期：403</p></div></div></span></label></p>

<p v-pre><label><span><div><div><p>F07 · 请求未授权团队</p><p>预期：403</p></div></div></span></label></p>

<p v-pre><label><span><div><div><p>F08 · 未指定团队时只返回授权数据</p><p>预期：200，且数据隔离</p></div></div></span></label></p>

<p v-pre><label><span><div><div><p>F09 · 权限撤销后再次访问</p><p>预期：403</p></div></div></span></label></p>

<p v-pre><label><span><div><div><p>F10 · 无符合条件的数据</p><p>预期：200，正确处理 null</p></div></div></span></label></p>

<p v-pre><label><span><div><div><p>F11 · 多日平均时长加权计算</p><p>预期：与 ADS 核对一致</p></div></div></span></label></p>

<p v-pre><label><span><div><div><p>F12 · ETL 历史补偿后查询</p><p>预期：返回新发布版本</p></div></div></span></label></p>

<p v-pre><label><span><div><div><p>F13 · 并发请求及慢查询</p><p>预期：满足 P95 目标</p></div></div></span></label></p>

<p v-pre><label><span><div><div><p>F14 · 数据库故障</p><p>预期：可控错误，不泄露敏感信息</p></div></div></span></label></p>

<p v-pre><span>仅在实际运行测试且结果符合预期后勾选；当前没有执行这些测试。</span></p>

### 五、性能压测与 SQL 验证

<p v-pre>前面我们确定了性能目标：</p>

<table v-pre><tbody><tr><th><p>API</p></th><th><p>P95 目标</p></th></tr><tr><td><p>总览接口</p></td><td><p>≤300ms</p></td></tr><tr><td><p>趋势接口</p></td><td><p>≤500ms</p></td></tr><tr><td><p>团队排行榜</p></td><td><p>≤500ms</p></td></tr></tbody></table>

<p v-pre>P95 的意思是：在约定的测试负载下，至少 95% 的请求耗时不超过目标值。</p>

<p v-pre>注意：性能验收不能只测一次请求。</p>

<p v-pre>需要明确测试环境、并发用户数、持续时间、数据量、缓存状态，并同时观察错误率和数据库负载。</p>

#### 1. 用 EXPLAIN ANALYZE 检查 SQL

<p v-pre><div>SQL</div></p>

```sql
EXPLAIN ANALYZE
SELECT
    SUM(resolved_order_count)
FROM ads_aftersales_team_daily
WHERE team_id = 101
  AND stat_date BETWEEN
      '2026-11-01' AND '2026-11-20';
```

<p v-pre>重点检查：</p>

<ul v-pre><li><div><div><p>是否使用了合适的索引。</p></div></div></li><li><div><div><p>实际读取多少行。</p></div></div></li><li><div><div><p>SQL 执行耗时。</p></div></div></li><li><div><div><p>是否存在不必要的全表扫描。</p></div></div></li></ul>

#### 2. 压测示例

<p v-pre>可以使用 Locust：</p>

<p v-pre><div>Bash</div></p>

```bash
uv add --dev locust
```

<p v-pre>创建 <code>locustfile.py</code>：</p>

<p v-pre><div>Python</div></p>

```text

import os

from locust import HttpUser, task, between


class AftersalesUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def overview(self):
        token = os.environ["TEST_ACCESS_TOKEN"]

        self.client.get(
            "/api/v1/aftersales/overview",
            params={
                "start_date": "2026-11-01",
                "end_date": "2026-11-20",
            },
            headers={
                "Authorization": f"Bearer {token}"
            },
            name="/api/v1/aftersales/overview",
        )

```

<p v-pre>启动：</p>

<p v-pre><div>Bash</div></p>

```bash
uv run locust -f locustfile.py
```

<p v-pre>使用专门的测试环境和测试账号，不要直接对生产环境施压。</p>

<p v-pre>可以从 10 个并发用户开始，逐步提高到 50、100，并记录响应时间、吞吐量、错误率及数据库 CPU。</p>

<p v-pre>这些并发数是测试阶梯，不是已经验证的系统承载能力。</p>

### 六、第五课最终验收报告

#### FastAPI 数据分析接口 V1

<p v-pre>设计评审</p>

<p v-pre><div>通过</div></p>

<p v-pre>核心代码示例</p>

<p v-pre><div>已提供</div></p>

<p v-pre>自动化测试</p>

<p v-pre><div>待执行</div></p>

<p v-pre>真实 ADS 数据接入</p>

<p v-pre><div>待完成</div></p>

<p v-pre>性能压测</p>

<p v-pre><div>待执行</div></p>

<p v-pre>生产部署</p>

<p v-pre><div>待完成</div></p>

<p v-pre><span><strong>最终结论：第五课的设计学习阶段通过，工程实现尚未完成验收。</strong></span></p>

<p v-pre>你已经能够从四个角度思考数据分析 API：</p>

<ol v-pre><li><div><div><p><span><strong>数据契约</strong></span>：前后端如何约定字段、参数和指标口径。</p></div></div></li><li><div><div><p><span><strong>安全权限</strong></span>：身份认证、RBAC 和 Data Scope 如何协同。</p></div></div></li><li><div><div><p><span><strong>代码架构</strong></span>：Router、Service、Repository 如何分工。</p></div></div></li><li><div><div><p><span><strong>查询性能</strong></span>：如何利用 ADS、索引、执行计划和缓存。</p></div></div></li></ol>

### 七、进入第六课：React + ECharts 数据看板

<p v-pre>接下来，我们将把 API 返回的数据变成业务人员可以使用的可视化看板。</p>

<p v-pre>第六课主要学习：</p>

<ul v-pre><li><div><div><p>看板页面布局。</p></div></div></li><li><div><div><p>KPI 卡片设计。</p></div></div></li><li><div><div><p>趋势图与排行榜。</p></div></div></li><li><div><div><p>筛选条件与图表联动。</p></div></div></li><li><div><div><p>React 组件设计。</p></div></div></li><li><div><div><p>ECharts 数据映射。</p></div></div></li><li><div><div><p>加载、空数据、异常状态。</p></div></div></li><li><div><div><p>看板交互与可用性验收。</p></div></div></li></ul>

#### 第六课实战问题1：看板页面应该如何组织？

<p v-pre>假设售后主管打开数据分析系统，希望快速了解：</p>

<p v-pre>「今天售后是否正常？哪个团队出了问题？具体是什么问题？」</p>

<p v-pre>你会如何设计首页？</p>

<p v-pre><div><label>A. 首页直接展示所有售后订单明细表，让主管自己分析。</label></div><div><label>B. 按照总览 KPI → 趋势与异常 → 团队对比 → 明细下钻的层次组织页面。</label></div><div><label>C. 首页只展示一个大饼图，所有指标都放进去。</label></div><div><label>D. 把所有图表平铺在一个页面，不区分业务优先级。</label></div></p>

<p v-pre><span><strong>请说明你的理由</strong></span></p>

```text
需要先知道总览，然后再知道细节。你两张都在粉白眼
```

<p v-pre><span class="interaction"><span>提交答案，进入第六课</span></span></p>

<p v-pre>下一课的重点将从后端工程转向<span><strong>业务分析体验</strong></span>：不仅要让图表正确显示数据，还要让业务人员快速发现异常、定位原因并采取行动。</p>
