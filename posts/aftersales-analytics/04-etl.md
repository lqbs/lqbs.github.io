---
title: "第四章　ETL 增量同步与补数"
description: "用 Python、SQLAlchemy 和 MySQL 实现可恢复的同步与补数流程。"
outline: [2, 2]
prev:
  text: "第三章　数据架构与 MySQL 建模"
  link: "/posts/aftersales-analytics/03-data-modeling"
next:
  text: "第五章　FastAPI 接口与权限"
  link: "/posts/aftersales-analytics/05-fastapi"
---

# 第四章　ETL 增量同步与补数

用 Python、SQLAlchemy 和 MySQL 实现可恢复的同步与补数流程。

[返回完整目录](/posts/aftersales-analytics-from-scratch#完整目录)

## 第 23 轮　增量抽取、复合游标和幂等写入 {#turn-23}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第四课实战问题1，我选择：B。理由：性能。请评价我的增量同步方案，并继续指导我使用 Python、SQLAlchemy 和 MySQL 实现 ETL。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第四课：ETL 数据开发实战

<p v-pre><div>实战问题1：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：根据源系统更新时间增量抽取，使用业务主键幂等写入，并保存同步进度。</strong></span></p>

<p v-pre>你的理由是「性能」，正确，但还可以进一步完善。</p>

<p v-pre>增量同步不仅是为了提高性能，还要解决三个问题：</p>

<ol v-pre><li><div><div><p><span><strong>效率</strong></span>：避免每 5 分钟重复读取全部历史数据。</p></div></div></li><li><div><div><p><span><strong>正确性</strong></span>：历史售后订单发生状态变化时，也能同步更新。</p></div></div></li><li><div><div><p><span><strong>可恢复性</strong></span>：任务失败后可以继续同步，而不是丢失数据。</p></div></div></li></ol>

<p v-pre>这三个目标分别对应：增量抽取、幂等写入、同步进度管理。</p>

#### 一、理解 ETL 的完整流程

<p v-pre>ETL 分别代表：</p>

<ul v-pre><li><div><div><p>Extract：抽取数据。</p></div></div></li><li><div><div><p>Transform：转换数据。</p></div></div></li><li><div><div><p>Load：加载数据。</p></div></div></li></ul>

<p v-pre>我们使用售后分析系统作为案例。</p>

<p v-pre><span><strong>业务数据库（MySQL）</strong></span></p>

<p v-pre>售后订单、处理事件、客服信息</p>

<p v-pre><span><strong>Extract · 增量抽取</strong></span></p>

<p v-pre>根据 updated_at 查询变化的数据</p>

<p v-pre><span><strong>Transform · 数据转换</strong></span></p>

<p v-pre>字段映射、时间校验、状态标准化</p>

<p v-pre><span><strong>Load · 幂等加载</strong></span></p>

<p v-pre>写入 ODS / DWD，更新已有记录</p>

<p v-pre><span><strong>同步进度管理</strong></span></p>

<p v-pre>记录成功同步到哪里，支持失败重试</p>

##### 举个例子

<p v-pre>假设源系统有三笔售后订单：</p>

<table v-pre><tbody><tr><th><p>售后单</p></th><th><p>状态</p></th><th><p>更新时间</p></th></tr><tr><td><p>A001</p></td><td><p>已解决</p></td><td><p>10:01</p></td></tr><tr><td><p>A002</p></td><td><p>处理中</p></td><td><p>10:03</p></td></tr><tr><td><p>A003</p></td><td><p>处理中</p></td><td><p>10:07</p></td></tr></tbody></table>

<p v-pre>系统在 10:05 执行同步，读取 A001、A002。</p>

<p v-pre>10:10 再执行同步，读取 A003，以及这段时间内发生更新的其他订单。</p>

<p v-pre>如果 A001 在 10:08 被重新打开，也应该再次同步。</p>

<p v-pre>所以增量同步不是只同步新订单，而是同步<span><strong>新增或发生变化的订单</strong></span>。</p>

### 二、第一步：设计同步进度表

<p v-pre>如果每次任务都只执行：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT *
FROM source_aftersales_order
WHERE updated_at > '2026-11-21 10:00:00';
```

<p v-pre>会有两个问题：</p>

<ul v-pre><li><div><div><p>这个时间从哪里来？</p></div></div></li><li><div><div><p>如果任务执行到一半失败，下次从哪里继续？</p></div></div></li></ul>

<p v-pre>因此我们需要一张进度表。</p>

#### etl\_sync\_checkpoint

<p v-pre><div>SQL</div></p>

```sql

CREATE TABLE etl_sync_checkpoint (
    task_name VARCHAR(100) NOT NULL
        COMMENT '任务名称',

    last_updated_at DATETIME(6) DEFAULT NULL
        COMMENT '最后成功同步的更新时间',

    last_id VARCHAR(64) DEFAULT NULL
        COMMENT '相同更新时间下的最后业务ID',

    last_success_at DATETIME(6) DEFAULT NULL
        COMMENT '最近成功执行时间',

    updated_at DATETIME(6) NOT NULL
        DEFAULT CURRENT_TIMESTAMP(6)
        ON UPDATE CURRENT_TIMESTAMP(6),

    PRIMARY KEY (task_name)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COMMENT='ETL同步进度表';

```

<p v-pre>这里为什么同时保存 <code>last_updated_at</code> 和 <code>last_id</code>？</p>

<p v-pre>因为可能有很多条记录拥有相同的更新时间。</p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>售后单</p></th><th><p>更新时间</p></th></tr><tr><td><p>A001</p></td><td><p>10:00:00</p></td></tr><tr><td><p>A002</p></td><td><p>10:00:00</p></td></tr><tr><td><p>A003</p></td><td><p>10:00:00</p></td></tr></tbody></table>

<p v-pre>如果只使用 <code>updated_at &gt; 上次时间</code>，并且上一批只处理了 A001，那么 A002、A003 就可能被漏掉。</p>

<p v-pre>所以我们使用复合游标：</p>

<p v-pre><code>(updated_at, aftersales_id)</code></p>

<p v-pre>查询条件：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT *
FROM source_aftersales_order
WHERE updated_at > :last_updated_at
   OR (
       updated_at = :last_updated_at
       AND aftersales_id > :last_id
   )
ORDER BY updated_at, aftersales_id
LIMIT 1000;
```

<p v-pre>这叫作 <span><strong>Keyset Pagination（基于游标的分页）</strong></span>。</p>

<p v-pre>它比大偏移量 <code>LIMIT ... OFFSET ...</code> 更适合持续增量抽取。</p>

<p v-pre>但这里有一个前提：源系统必须提供可靠的更新时间，并且更新时间与数据提交的顺序不会导致记录被漏掉。实际生产中通常还需要安全回看窗口、延迟数据补偿，或者采用 CDC。</p>

### 三、第二步：准备 Python ETL 项目

<p v-pre>我们先采用最小可运行结构。</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>aftersales-etl/ ├── pyproject.toml ├── .env.example ├── sql/ │   └── init.sql └── app/     ├── __init__.py     ├── config.py     ├── database.py     └── etl/         ├── __init__.py         └── sync_orders.py</span></code></div></p>

<p v-pre>使用 <code>uv</code> 初始化：</p>

<p v-pre><div>Bash</div></p>

```bash
uv init aftersales-etl
cd aftersales-etl

uv add sqlalchemy pymysql python-dotenv
```

<p v-pre>为了便于学习，我们先用同步 SQLAlchemy 实现 ETL，不急着引入 Celery。</p>

<p v-pre>等单次同步能够稳定运行，再增加定时调度。</p>

### 四、第三步：配置数据库连接

<p v-pre>我们假设有两个数据库：</p>

<ul v-pre><li><div><div><p><code>business_db</code>：业务数据库。</p></div></div></li><li><div><div><p><code>analytics_db</code>：分析数据库。</p></div></div></li></ul>

<p v-pre>可以位于同一个 MySQL 实例，也可以位于不同实例。</p>

#### .env.example

<p v-pre><div>dotenv</div></p>

<p v-pre><div><code><span><span>SOURCE_DATABASE_URL=mysql+pymysql://etl_reader:password@127.0.0.1:3306/business_db?charset=utf8mb4</span>  <span>TARGET_DATABASE_URL=mysql+pymysql://etl_writer:password@127.0.0.1:3306/analytics_db?charset=utf8mb4</span></span></code></div></p>

<p v-pre>实际使用时，将 <code>.env.example</code> 复制为 <code>.env</code>，填入真实连接信息。</p>

<p v-pre>不要把 <code>.env</code> 提交到 Git。</p>

#### app/database.py

<p v-pre><div>Python</div></p>

```text

import os

from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

source_engine = create_engine(
    os.environ["SOURCE_DATABASE_URL"],
    pool_pre_ping=True,
    pool_recycle=1800,
)

target_engine = create_engine(
    os.environ["TARGET_DATABASE_URL"],
    pool_pre_ping=True,
    pool_recycle=1800,
)

```

<p v-pre><code>pool_pre_ping=True</code> 的作用是使用连接前检查连接是否仍然有效，减少 MySQL 空闲连接断开带来的异常。</p>

### 五、第四步：编写增量同步程序

<p v-pre>先明确一个简化前提：</p>

<ul v-pre><li><div><div><p>源表叫 <code>source_aftersales_order</code>。</p></div></div></li><li><div><div><p>目标表叫 <code>ods_aftersales_order</code>。</p></div></div></li><li><div><div><p>两张表都有 <code>aftersales_id</code>、<code>status</code>、<code>created_at</code>、<code>updated_at</code>。</p></div></div></li><li><div><div><p>两张表的 <code>updated_at</code> 都使用 <code>DATETIME(6)</code>。</p></div></div></li><li><div><div><p>售后单 ID 为字符串。</p></div></div></li><li><div><div><p>源数据暂时不考虑物理删除。</p></div></div></li></ul>

<p v-pre>目标 ODS 表可以先这样创建：</p>

<p v-pre><div>SQL</div></p>

```sql
CREATE TABLE ods_aftersales_order (
    aftersales_id VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    synced_at DATETIME(6) NOT NULL
        DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (aftersales_id),
    KEY idx_updated_at (updated_at)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;
```

<p v-pre>源表还应建立：</p>

<p v-pre><div>SQL</div></p>

```sql
CREATE INDEX idx_sync_cursor
ON source_aftersales_order (
    updated_at,
    aftersales_id
);
```

#### 完整 ETL 核心代码

<p v-pre><div>Python</div></p>

```text

from datetime import datetime

from sqlalchemy import text

from app.database import source_engine, target_engine

TASK_NAME = "sync_aftersales_order"
BATCH_SIZE = 1000


def get_checkpoint():
    with target_engine.connect() as conn:
        row = conn.execute(
            text("""
                SELECT last_updated_at, last_id
                FROM etl_sync_checkpoint
                WHERE task_name = :task_name
            """),
            {"task_name": TASK_NAME},
        ).mappings().first()

    if row is None or row["last_updated_at"] is None:
        return datetime(1970, 1, 1), ""

    return row["last_updated_at"], row["last_id"] or ""


def extract_batch(last_time, last_id):
    sql = text("""
        SELECT
            aftersales_id,
            status,
            created_at,
            updated_at
        FROM source_aftersales_order
```

<p v-pre>运行：</p>

<p v-pre><div>Bash</div></p>

```bash
uv run python -m app.etl.sync_orders
```

<p v-pre>这份代码用于学习增量抽取、批量写入和进度管理的基本原理，<span><strong>还不是生产级 ETL</strong></span>。</p>

<p v-pre>尤其需要注意：</p>

<ul v-pre><li><div><div><p>不能允许同一个任务同时运行多个实例，否则进度可能相互覆盖。</p></div></div></li><li><div><div><p><code>updated_at</code> 不是可靠的提交顺序标识。长事务、延迟提交可能导致数据遗漏。</p></div></div></li><li><div><div><p>这份代码未处理物理删除、源数据变更期间的一致性、失败重试和死信记录。</p></div></div></li><li><div><div><p><code>transform()</code> 发现异常会中断批次，实际生产中需要区分可跳过异常与必须停止的异常。</p></div></div></li><li><div><div><p>这里把 ODS 简化为当前快照表；如果需要原始历史留存，应额外设计按批次保留的 ODS 历史数据。</p></div></div></li></ul>

<p v-pre>后续我们会逐步补齐这些机制。</p>

### 六、理解幂等写入

<p v-pre>这是 ETL 开发必须掌握的概念。</p>

<p v-pre><span><strong>幂等：同一批数据重复执行多次，不应该产生重复记录，也不应该把较新的数据错误覆盖成旧数据。</strong></span></p>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>执行次数</p></th><th><p>操作</p></th><th><p>目标结果</p></th></tr><tr><td><p>第1次</p></td><td><p>插入 A001</p></td><td><p>1条记录</p></td></tr><tr><td><p>第2次</p></td><td><p>重试 A001</p></td><td><p>仍然1条</p></td></tr><tr><td><p>第3次</p></td><td><p>更新 A001 状态</p></td><td><p>仍然1条，状态更新</p></td></tr></tbody></table>

<p v-pre>为什么重要？</p>

<p v-pre>因为定时任务可能：</p>

<ul v-pre><li><div><div><p>网络超时。</p></div></div></li><li><div><div><p>数据库连接断开。</p></div></div></li><li><div><div><p>进程被重启。</p></div></div></li><li><div><div><p>人工重新执行。</p></div></div></li><li><div><div><p>调度器重复触发。</p></div></div></li></ul>

<p v-pre>因此，不能假设每个任务只会执行一次。</p>

<p v-pre>我们通常使用：</p>

<p v-pre><div>SQL</div></p>

```sql
INSERT INTO ...
ON DUPLICATE KEY UPDATE ...
```

<p v-pre>配合稳定业务主键实现幂等写入。</p>

<p v-pre>不过，对于事件表这种一条业务事件对应一条记录的数据，应使用来源系统和来源事件 ID 作为去重依据。</p>

### 七、第四课实战问题2：任务失败后如何恢复？

<p v-pre>现在进入下一道实战题。</p>

<p v-pre>假设：</p>

<ul v-pre><li><div><div><p>每批同步 1000 条。</p></div></div></li><li><div><div><p>第一批成功同步 A001～A1000。</p></div></div></li><li><div><div><p>第二批成功同步 A1001～A2000。</p></div></div></li><li><div><div><p>第三批同步 A2001～A3000 时，数据库连接中断。</p></div></div></li></ul>

<p v-pre>此时，前两批已经成功写入目标库，并且同步进度也已经提交。</p>

<p v-pre>你认为下一次任务应该怎么处理？</p>

<p v-pre><div><label>A. 删除全部目标数据，从第一条记录重新同步。</label></div><div><label>B. 读取最后成功提交的同步进度，从第三批继续；即使重复读取，也通过幂等写入避免重复。</label></div><div><label>C. 直接跳过第三批，从第四批开始。</label></div><div><label>D. 不再执行同步，等待人工处理所有数据。</label></div></p>

<p v-pre><span><strong>请解释为什么这样恢复</strong></span></p>

```text
动态回复
```

<p v-pre><span class="interaction"><span>提交答案，继续 ETL 实战</span></span></p>

#### 本课学习进度

<p v-pre>理解 ETL 与增量同步</p>

<p v-pre>设计同步进度表</p>

<p v-pre>搭建 Python + SQLAlchemy 环境</p>

<p v-pre>编写基础增量同步程序</p>

<p v-pre>理解幂等写入</p>

<p v-pre>失败重试与事务控制</p>

<p v-pre>Celery 定时调度</p>

<p v-pre>数据质量与补偿机制</p>

<p v-pre>ETL 项目验收</p>

<p v-pre><span><strong>这一节最重要的收获：</strong></span></p>

<p v-pre>增量同步的核心不是写一个 <code>WHERE updated_at &gt; ...</code>，而是设计一套能够持续运行、正确更新、失败恢复和重复执行的数据同步机制。</p>

## 第 24 轮　失败重试、事务和 Celery 定时调度 {#turn-24}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第四课实战问题2，我选择：B。理由：动态回复。请评价，并继续指导我实现 ETL 失败重试、事务控制、同步进度和 Celery 定时调度。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第四课：ETL 失败重试、事务控制与 Celery 定时调度

<p v-pre><div>实战问题2：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：读取最后成功提交的同步进度，从第三批继续，通过幂等写入避免重复。</strong></span></p>

<p v-pre>你的理由是「动态回复」。我理解你可能想表达的是「动态恢复」或「断点续传」。</p>

<p v-pre>如果是这个意思，你的思路是正确的，但还需要理解一个关键原则：</p>

<p v-pre><span><strong>同步数据和更新同步进度，必须保证一致性。</strong></span></p>

#### 一、先评价你的失败恢复方案

<p v-pre>假设每批同步 1000 条：</p>

<table v-pre><tbody><tr><th><p>批次</p></th><th><p>数据范围</p></th><th><p>结果</p></th><th><p>同步进度</p></th></tr><tr><td><p>第1批</p></td><td><p>A001～A1000</p></td><td><p>成功</p></td><td><p>已提交</p></td></tr><tr><td><p>第2批</p></td><td><p>A1001～A2000</p></td><td><p>成功</p></td><td><p>已提交</p></td></tr><tr><td><p>第3批</p></td><td><p>A2001～A3000</p></td><td><p>失败</p></td><td><p>未提交</p></td></tr></tbody></table>

<p v-pre>下一次运行时，从最后成功提交的位置继续。</p>

<p v-pre>这叫 <span><strong>Checkpoint（检查点）恢复</strong></span>。</p>

<p v-pre>但这里有一个问题：</p>

<p v-pre>假如第三批数据已经写入成功，更新 Checkpoint 时程序突然崩溃，会发生什么？</p>

<p v-pre>我们先看两种情况。</p>

<p v-pre>错误方案</p>

<p v-pre>写入数据并提交</p>

<p v-pre>更新 Checkpoint</p>

<p v-pre>中途崩溃，状态不一致</p>

<p v-pre>推荐方案</p>

<p v-pre>开启事务</p>

<p v-pre>写入数据 + Checkpoint</p>

<p v-pre>一起 COMMIT 或 ROLLBACK</p>

<p v-pre>如果目标表和 Checkpoint 表都在同一个 MySQL 事务数据库中，就可以使用一个事务同时提交。</p>

<p v-pre>这样可以保证：</p>

<ul v-pre><li><div><div><p>数据成功，进度也成功。</p></div></div></li><li><div><div><p>数据失败，进度也不推进。</p></div></div></li><li><div><div><p>任务重新执行时，从最后成功位置恢复。</p></div></div></li></ul>

<p v-pre>这就是我们接下来要实现的核心能力。</p>

### 二、ETL 事务控制

<p v-pre>在之前的代码中，我们使用了：</p>

<p v-pre><div>Python</div></p>

```text
with target_engine.begin() as conn:
    # 写入数据
    # 更新 Checkpoint
```

<p v-pre><code>engine.begin()</code> 会自动管理事务。</p>

<p v-pre>正常执行完毕后提交；出现异常时回滚。</p>

#### 1. 正确的事务边界

<p v-pre><div>Python</div></p>

```text

from sqlalchemy import text

def load_batch(rows, task_name):
    last_row = rows[-1]

    with target_engine.begin() as conn:
        # 1. 幂等写入业务数据
        conn.execute(
            text("""
                INSERT INTO ods_aftersales_order (
                    aftersales_id,
                    status,
                    created_at,
                    updated_at
                )
                VALUES (
                    :aftersales_id,
                    :status,
                    :created_at,
                    :updated_at
                )
                ON DUPLICATE KEY UPDATE
                    status = IF(
                        VALUES(updated_at) >= updated_at,
                        VALUES(status),
                        status
                    ),
                    updated_at = GREATEST(
                        updated_at,
                        VALUES(updated_at)
                    )
            """),
            rows,
        )

```

<p v-pre>这段代码的重点不是 SQL，而是：</p>

<p v-pre><span><strong>数据写入和进度更新使用同一个数据库连接、同一个事务。</strong></span></p>

<p v-pre>前提是两张表都使用支持事务的存储引擎，例如 InnoDB。</p>

#### 2. 事务能解决所有问题吗？

<p v-pre>不能。</p>

<p v-pre>它只能保证目标数据库中的数据和 Checkpoint 一起提交或回滚。</p>

<p v-pre>如果源数据库在抽取期间持续更新，仍可能出现：</p>

<ul v-pre><li><div><div><p>源记录被延迟提交。</p></div></div></li><li><div><div><p>更新时间早于已保存的 Checkpoint。</p></div></div></li><li><div><div><p>源记录被物理删除。</p></div></div></li><li><div><div><p>同步任务并发运行。</p></div></div></li></ul>

<p v-pre>这些问题需要额外的同步策略。</p>

<p v-pre>因此，Checkpoint 解决的是<span><strong>失败恢复</strong></span>，并不自动保证<span><strong>源数据绝对不遗漏</strong></span>。</p>

### 三、实现失败自动重试

<p v-pre>现在假设 ETL 运行时出现：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>OperationalError: MySQL server has gone away</span></code></div></p>

<p v-pre>如果只是临时网络故障，可以自动重试。</p>

<p v-pre>但不能对所有异常无限重试。</p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>网络超时：适合重试。</p></div></div></li><li><div><div><p>数据库连接断开：适合有限次数重试。</p></div></div></li><li><div><div><p>售后单 ID 为空：不应该盲目重试。</p></div></div></li><li><div><div><p>SQL 字段不存在：需要修复程序。</p></div></div></li></ul>

#### 1. 错误分类

<table v-pre><tbody><tr><th><p>错误类型</p></th><th><p>示例</p></th><th><p>处理方式</p></th></tr><tr><td><p>临时错误</p></td><td><p>网络超时、连接断开</p></td><td><p>自动重试</p></td></tr><tr><td><p>数据错误</p></td><td><p>关键字段缺失</p></td><td><p>记录异常，按规则隔离或停止</p></td></tr><tr><td><p>程序错误</p></td><td><p>SQL 语法错误</p></td><td><p>停止任务并修复代码</p></td></tr><tr><td><p>资源错误</p></td><td><p>数据库连接数耗尽</p></td><td><p>限次重试并告警</p></td></tr></tbody></table>

#### 2. Python 重试示例

<p v-pre><div>Python</div></p>

```text

import random
import time

from sqlalchemy.exc import OperationalError


def retry_load_batch(rows, task_name, max_retries=3):
    for attempt in range(max_retries + 1):
        try:
            load_batch(rows, task_name)
            return

        except OperationalError:
            if attempt == max_retries:
                raise

            delay = min(2 ** attempt, 30)
            delay += random.uniform(0, 0.5)

            print(
                f"数据库临时故障，"
                f"{delay:.1f} 秒后重试"
            )

            time.sleep(delay)

```

<p v-pre>这段代码使用：</p>

<p v-pre><span><strong>指数退避（Exponential Backoff）+ 随机抖动（Jitter）</strong></span></p>

<p v-pre>重试间隔大致为：</p>

<ul v-pre><li><div><div><p>第1次失败：等待约1秒。</p></div></div></li><li><div><div><p>第2次失败：等待约2秒。</p></div></div></li><li><div><div><p>第3次失败：等待约4秒。</p></div></div></li></ul>

<p v-pre>随机抖动可以减少多个任务同时重试造成的瞬时压力。</p>

<p v-pre>这里仅捕获 <code>OperationalError</code>。生产环境还应进一步判断具体数据库错误码，避免对永久性故障重复尝试。</p>

### 四、使用 Celery 实现每 5 分钟自动同步

<p v-pre>现在我们已经有了：</p>

<ul v-pre><li><div><div><p><code>sync_orders()</code>：执行一次增量同步。</p></div></div></li><li><div><div><p><code>load_batch()</code>：在事务中写入数据和 Checkpoint。</p></div></div></li><li><div><div><p><code>retry_load_batch()</code>：对临时数据库故障进行重试。</p></div></div></li></ul>

<p v-pre>下一步，把它们交给 Celery 定时执行。</p>

#### 1. Celery、Beat、Redis 分别做什么？

<p v-pre><span><strong>Celery Beat</strong></span></p>

<p v-pre>每 5 分钟产生一个任务</p>

<p v-pre><span><strong>Redis</strong></span></p>

<p v-pre>保存待执行任务消息</p>

<p v-pre><span><strong>Celery Worker</strong></span></p>

<p v-pre>执行 Python ETL 程序</p>

<p v-pre><span><strong>MySQL</strong></span></p>

<p v-pre>保存同步数据、Checkpoint 和任务日志</p>

<p v-pre>这里需要区分两个概念：</p>

<ul v-pre><li><div><div><p>Beat 负责<span><strong>什么时候执行</strong></span>。</p></div></div></li><li><div><div><p>Worker 负责<span><strong>实际执行任务</strong></span>。</p></div></div></li></ul>

<p v-pre>Beat 不会亲自执行 ETL。</p>

#### 2. 安装依赖

<p v-pre><div>Bash</div></p>

```bash
uv add celery redis
```

<p v-pre>在项目中新增：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>app/ ├── celery_app.py ├── tasks.py └── etl/     └── sync_orders.py</span></code></div></p>

#### 3. 配置 Celery

<p v-pre><code>app/celery_app.py</code></p>

<p v-pre><div>Python</div></p>

```text

import os

from celery import Celery

celery_app = Celery(
    "aftersales_etl",
    broker=os.getenv(
        "CELERY_BROKER_URL",
        "redis://localhost:6379/0",
    ),
)

celery_app.conf.update(
    imports=("app.tasks",),

    timezone="Asia/Shanghai",
    enable_utc=True,

    task_serializer="json",
    accept_content=["json"],

    worker_prefetch_multiplier=1,

    beat_schedule={
        "sync-aftersales-orders": {
            "task": "app.tasks.sync_aftersales_orders",
            "schedule": 300.0,
        },
    },
)

```

<p v-pre><code>300.0</code> 代表每 300 秒调度一次，也就是每 5 分钟。</p>

<p v-pre>注意：这表示调度频率，不代表每次同步都一定在 5 分钟内完成。</p>

#### 4. 定义 Celery 任务

<p v-pre><code>app/tasks.py</code></p>

<p v-pre><div>Python</div></p>

```text

from celery.exceptions import Retry
from sqlalchemy.exc import OperationalError

from app.celery_app import celery_app
from app.etl.sync_orders import sync_orders


@celery_app.task(
    bind=True,
    name="app.tasks.sync_aftersales_orders",
    max_retries=3,
    acks_late=True,
)
def sync_aftersales_orders(self):
    try:
        sync_orders()
    except OperationalError as exc:
        raise self.retry(
            exc=exc,
            countdown=min(2 ** self.request.retries, 30),
        )

```

<p v-pre>这里的重试是<span><strong>任务级重试</strong></span>。</p>

<p v-pre>如果同步程序已经成功处理了前两批，第三批失败，那么 Celery 重新执行任务时，程序会从 Checkpoint 继续。</p>

<p v-pre><code>acks_late=True</code> 可以让任务在执行完成后才确认消息，但并不保证任务只执行一次。因此，幂等设计仍然必不可少。</p>

#### 5. 启动 Redis、Worker 和 Beat

<p v-pre>先使用 Docker 启动本地 Redis：</p>

<p v-pre><div>Bash</div></p>

```bash
docker run -d \
  --name etl-redis \
  -p 6379:6379 \
  redis:7-alpine
```

<p v-pre>然后分别在两个终端启动：</p>

<p v-pre><span><strong>终端一：Worker</strong></span></p>

<p v-pre><div>Bash</div></p>

```bash
uv run celery -A app.celery_app:celery_app worker \
  --loglevel=INFO
```

<p v-pre><span><strong>终端二：Beat</strong></span></p>

<p v-pre><div>Bash</div></p>

```bash
uv run celery -A app.celery_app:celery_app beat \
  --loglevel=INFO
```

<p v-pre>启动后，Beat 会周期性投递任务，Worker 收到任务后调用 <code>sync_orders()</code>。</p>

### 五、解决 Celery 任务重复执行问题

<p v-pre>这里有一个很重要的工程问题。</p>

<p v-pre>假设：</p>

<ul v-pre><li><div><div><p>10:00 开始同步。</p></div></div></li><li><div><div><p>任务需要 8 分钟才能完成。</p></div></div></li><li><div><div><p>10:05 Beat 又投递了一次同步任务。</p></div></div></li></ul>

<p v-pre>这时可能有两个同步任务同时运行。</p>

<p v-pre>如果两个任务都读取同一个 Checkpoint，就可能产生竞争。</p>

#### 推荐：为同一个同步任务加互斥锁

<p v-pre>对于当前这个小型 ETL 系统，推荐使用 MySQL 命名锁。</p>

<p v-pre><div>Python</div></p>

```text

from sqlalchemy import text

from app.database import target_engine
from app.etl.sync_orders import sync_orders


def run_sync_with_lock():
    # 这条连接在任务运行期间保持打开
    with target_engine.connect() as conn:
        acquired = conn.execute(
            text("SELECT GET_LOCK(:name, 0)"),
            {"name": "etl:sync_aftersales_order"},
        ).scalar()

        if acquired != 1:
            print("已有同步任务运行，本次跳过")
            return

        try:
            sync_orders()
        finally:
            conn.execute(
                text("SELECT RELEASE_LOCK(:name)"),
                {"name": "etl:sync_aftersales_order"},
            )

```

<p v-pre>然后把 Celery 任务中的 <code>sync_orders()</code> 改成 <code>run_sync_with_lock()</code>。</p>

<p v-pre>这样，同一个 MySQL 实例上的同名任务不会同时执行。</p>

<p v-pre>这里的锁连接必须在整个任务期间保持存活；如果连接意外断开，命名锁会被释放。因此，生产环境还需要结合任务日志、执行超时、Checkpoint 幂等性和并发测试验证。</p>

<p v-pre><span><strong>不要仅仅依靠把 Celery Worker 设置为单进程来解决并发问题。</strong></span> 将来增加 Worker 或人工重跑任务时，仍然可能发生重复执行。</p>

### 六、补齐 ETL 的两个关键生产约束

<p v-pre>到这里，我们已经具备了基础 ETL 的执行框架，但还有两个问题必须在上线前解决。</p>

#### 1. 源数据库的更新时间不一定可靠

<p v-pre>假设：</p>

<ul v-pre><li><div><div><p>10:00 一笔订单开始更新。</p></div></div></li><li><div><div><p>10:01 ETL 已经同步到 10:01。</p></div></div></li><li><div><div><p>10:03 这笔订单才提交。</p></div></div></li><li><div><div><p>但订单的 <code>updated_at</code> 仍然是 10:00。</p></div></div></li></ul>

<p v-pre>如果只查询 <code>updated_at &gt; 10:01</code>，就会永久漏掉这笔订单。</p>

<p v-pre>因此，<span><strong>Checkpoint + 更新时间游标不等于绝对可靠的增量同步</strong></span>。</p>

<p v-pre>对于我们的 MVP，可以先采用：</p>

<ul v-pre><li><div><div><p>稳定的 <code>(updated_at, aftersales_id)</code> 游标。</p></div></div></li><li><div><div><p>每次同步回看一段历史时间。</p></div></div></li><li><div><div><p>幂等更新，避免重复产生数据。</p></div></div></li><li><div><div><p>定期对账与历史补算。</p></div></div></li></ul>

<p v-pre>如果后续对一致性要求更高，可以考虑基于 MySQL Binlog 的 CDC。</p>

#### 2. 数据更新与数据发布是两回事

<p v-pre>即使 ODS 已经同步成功，也不能立即认定看板指标正确。</p>

<p v-pre>推荐拆分为两个任务：</p>

<table v-pre><tbody><tr><th><p>任务</p></th><th><p>作用</p></th></tr><tr><td><p><code>sync_aftersales_orders</code></p></td><td><p>同步源业务数据</p></td></tr><tr><td><p><code>build_aftersales_metrics</code></p></td><td><p>清洗、加工、校验并发布指标</p></td></tr></tbody></table>

<p v-pre>第二个任务必须确认源数据同步状态，完成质量检查后，才能发布新的 ADS 结果。</p>

<p v-pre>这样可以避免看板读取到未经验证的数据。</p>

### 七、ETL 开发验收：四个必测场景

<p v-pre>现在我们设计测试用例，而不是只看代码能否启动。</p>

<table v-pre><tbody><tr><th><p>测试场景</p></th><th><p>操作</p></th><th><p>预期结果</p></th></tr><tr><td><p>正常同步</p></td><td><p>新增 1000 笔售后</p></td><td><p>目标表增加 1000 条，Checkpoint 前进</p></td></tr><tr><td><p>任务重试</p></td><td><p>同一批数据执行两次</p></td><td><p>目标表不重复</p></td></tr><tr><td><p>中途失败</p></td><td><p>第三批写入时断开数据库</p></td><td><p>第三批回滚，进度不推进，重试后成功</p></td></tr><tr><td><p>并发调度</p></td><td><p>同时启动两个同步任务</p></td><td><p>同一时间只有一个任务执行</p></td></tr></tbody></table>

<p v-pre>这些测试通过后，才能说明基础同步机制具备可靠性。</p>

#### 八、实战问题3：Checkpoint 应该什么时候更新？

<p v-pre>现在考察你是否理解事务与同步进度的关系。</p>

<p v-pre>假设一批数据有 1000 条：</p>

<ul v-pre><li><div><div><p>数据写入目标表成功。</p></div></div></li><li><div><div><p>Checkpoint 更新失败。</p></div></div></li><li><div><div><p>程序随后崩溃。</p></div></div></li></ul>

<p v-pre>你认为哪种设计最合理？</p>

<p v-pre><div><label>A. 先单独提交业务数据，再尝试更新 Checkpoint，失败也无所谓。</label></div><div><label>B. 将业务数据写入和 Checkpoint 更新放在同一个数据库事务中，全部成功才提交。</label></div><div><label>C. 先更新 Checkpoint，再写入业务数据，减少重复读取。</label></div><div><label>D. 不保存 Checkpoint，每次都从头同步。</label></div></p>

<p v-pre><span><strong>请说明你的理由</strong></span></p>

```text
事务可以保证恢复不缺失。
```

<p v-pre><span class="interaction"><span>提交答案，继续实战</span></span></p>

#### 第四课当前进度

<p v-pre>增量同步与游标分页</p>

<p v-pre>幂等写入与 Checkpoint</p>

<p v-pre>事务控制</p>

<p v-pre>失败重试与指数退避</p>

<p v-pre>Celery Beat + Worker 调度</p>

<p v-pre>任务互斥与并发控制</p>

<p v-pre>源数据遗漏与补偿机制</p>

<p v-pre>任务监控和告警</p>

<p v-pre>完整 ETL 项目验收</p>

<p v-pre><span><strong>本节最重要的知识：</strong></span></p>

<p v-pre>ETL 的可靠性并不是靠「失败后再运行一次」实现的，而是由 <span><strong>事务一致性、Checkpoint、幂等写入、有限重试和并发控制</strong></span> 共同保证的。</p>

<p v-pre>下一步我们会通过故障模拟验证这些机制，再补齐历史数据补偿和任务监控，完成第四课的 ETL 开发闭环。</p>

## 第 25 轮　事务测试、历史补偿、日志与告警 {#turn-25}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第四课实战问题3，我选择：B。理由：事务可以保证恢复不缺失。。请评价，并继续指导我完成 ETL 事务测试、数据补偿、任务监控与项目验收。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第四课：ETL 事务测试、数据补偿、任务监控与项目验收

<p v-pre></p>

<p v-pre><div>实战问题3：回答正确</div> <div>进入 ETL 工程验收</div></p>

<p v-pre>你选择 B，正确。</p>

<p v-pre>你的理由：</p>

<blockquote v-pre><p>事务可以保证恢复不缺失。</p></blockquote>

<p v-pre>方向正确，但需要修正一个概念：</p>

<p v-pre><span><strong>事务保证的是目标数据写入和同步进度的一致性，不是单独保证源数据永远不丢失。</strong></span></p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>业务数据写入成功，Checkpoint 更新失败：事务回滚，两者都不生效。</p></div></div></li><li><div><div><p>业务数据写入成功，Checkpoint 更新成功：一起提交。</p></div></div></li><li><div><div><p>数据库连接中断：重新执行时从最后成功的 Checkpoint 恢复。</p></div></div></li></ul>

<p v-pre>这就是原子性（Atomicity）。</p>

<p v-pre>你现在已经掌握了 ETL 可靠性设计的核心思路。接下来我们把它变成可以测试、监控和验收的工程项目。</p>

### 一、先建立 ETL 事务测试体系

<p v-pre>我们不应该只通过阅读代码判断 ETL 是否可靠，而应该主动制造故障。</p>

<p v-pre>先确定测试目标。</p>

<table v-pre><tbody><tr><th><p>测试编号</p></th><th><p>测试场景</p></th><th><p>预期结果</p></th></tr><tr><td><p>T01</p></td><td><p>正常同步</p></td><td><p>数据与 Checkpoint 一起提交</p></td></tr><tr><td><p>T02</p></td><td><p>重复执行</p></td><td><p>不产生重复数据</p></td></tr><tr><td><p>T03</p></td><td><p>写入数据后模拟异常</p></td><td><p>整个事务回滚</p></td></tr><tr><td><p>T04</p></td><td><p>Checkpoint 更新失败</p></td><td><p>业务数据也回滚</p></td></tr><tr><td><p>T05</p></td><td><p>网络中断</p></td><td><p>有限重试，最终可恢复</p></td></tr><tr><td><p>T06</p></td><td><p>两个任务同时执行</p></td><td><p>同步任务互斥</p></td></tr><tr><td><p>T07</p></td><td><p>历史数据补偿</p></td><td><p>能重新计算历史结果</p></td></tr></tbody></table>

#### 1. 测试事务原子性

<p v-pre>我们设计一个故障注入测试：</p>

<p v-pre>先写入一条订单，再故意抛出异常，然后检查订单和 Checkpoint 是否都没有改变。</p>

<p v-pre><div>Python</div></p>

```text

from sqlalchemy import text

from app.database import target_engine


def test_transaction_rollback():
    try:
        with target_engine.begin() as conn:

            # 第一步：写入订单
            conn.execute(
                text("""
                    INSERT INTO ods_aftersales_order (
                        aftersales_id,
                        status,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        'TEST001',
                        'PROCESSING',
                        NOW(6),
                        NOW(6)
                    )
                    ON DUPLICATE KEY UPDATE
                        status = VALUES(status)
                """)
            )

            # 第二步：模拟 Checkpoint 更新失败
            raise RuntimeError("模拟任务崩溃")

    except RuntimeError:
        print("事务已经回滚")

```

<p v-pre>预期结果：</p>

<p v-pre><span><strong>TEST001 订单记录</strong></span></p>

<p v-pre><div>0 条</div></p>

<p v-pre>事务回滚后，刚才插入的记录不存在。</p>

<p v-pre><span><strong>验证结论</strong></span></p>

<ul v-pre><li><div><div><p>业务数据没有提交。</p></div></div></li><li><div><div><p>Checkpoint 没有推进。</p></div></div></li><li><div><div><p>下一次任务可以安全重试。</p></div></div></li></ul>

<p v-pre>这个测试证明了事务回滚机制。</p>

<p v-pre>注意：生产测试应该使用独立测试数据库，不能在真实业务库中执行故障注入。</p>

#### 2. 测试重复执行

<p v-pre><div>Python</div></p>

```text
def test_idempotent_write():
    row = {
        "aftersales_id": "TEST002",
        "status": "PROCESSING",
        "created_at": "2026-11-21 10:00:00",
        "updated_at": "2026-11-21 10:00:00",
    }

    for _ in range(3):
        load_batch([row], "test_task")

    with target_engine.connect() as conn:
        count = conn.execute(
            text("""
                SELECT COUNT(*)
                FROM ods_aftersales_order
                WHERE aftersales_id = 'TEST002'
            """)
        ).scalar_one()

    assert count == 1
```

<p v-pre>预期：</p>

<p v-pre>执行三次，最终只有一条业务记录。</p>

<p v-pre>这叫作幂等性测试。</p>

### 二、解决历史数据遗漏：数据补偿机制

<p v-pre>现在我们解决一个更难的问题。</p>

<p v-pre>假设：</p>

<ul v-pre><li><div><div><p>11 月 20 日同步了售后订单 A001。</p></div></div></li><li><div><div><p>11 月 21 日 A001 被重新打开。</p></div></div></li><li><div><div><p>11 月 22 日发现源系统的更新时间同步逻辑有问题。</p></div></div></li><li><div><div><p>分析库没有正确更新 A001。</p></div></div></li></ul>

<p v-pre>怎么办？</p>

<p v-pre>不能简单地把全部数据重新同步一遍。</p>

<p v-pre>我们需要建立数据补偿机制。</p>

#### 1. 三种常见补偿方式

<table v-pre><tbody><tr><th><p>补偿方式</p></th><th><p>使用场景</p></th><th><p>示例</p></th></tr><tr><td><p>时间窗口回看</p></td><td><p>处理延迟提交、短暂遗漏</p></td><td><p>回看最近24小时</p></td></tr><tr><td><p>指定业务主键重刷</p></td><td><p>修复少量异常订单</p></td><td><p>重新同步 A001</p></td></tr><tr><td><p>历史日期重算</p></td><td><p>修复历史指标</p></td><td><p>重算11月20日汇总</p></td></tr></tbody></table>

<p v-pre>建议我们的售后分析系统采用三种方式结合。</p>

#### 2. 时间窗口回看

<p v-pre>假设每次任务都回看最近 10 分钟的数据。</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT
    aftersales_id,
    status,
    created_at,
    updated_at
FROM source_aftersales_order
WHERE updated_at >= :watermark_start
  AND updated_at < :upper_bound
ORDER BY updated_at, aftersales_id;
```

<p v-pre>其中：</p>

<ul v-pre><li><div><div><p><code>watermark_start</code>：最后成功进度减去回看窗口。</p></div></div></li><li><div><div><p><code>upper_bound</code>：本次抽取开始前确定的安全上界。</p></div></div></li></ul>

<p v-pre>为什么要设置上界？</p>

<p v-pre>因为如果每一批都不断读取当前时间，源数据可能一直变化，任务就很难确定本次同步的范围。</p>

<p v-pre>建议在每轮同步开始时固定一个安全上界，再在这个范围内分批处理。</p>

<p v-pre>不过要注意：回看窗口只能降低延迟提交遗漏的风险，不能保证任意长事务都不会遗漏。更严格的方案需要 CDC 或可靠的源端提交序列。</p>

#### 3. 指定售后单补偿

<p v-pre>例如发现 A001 数据异常：</p>

<p v-pre><div>SQL</div></p>

```sql
SELECT *
FROM source_aftersales_order
WHERE aftersales_id = 'A001';
```

<p v-pre>抽取后走同一套转换、幂等加载逻辑。</p>

<p v-pre>不要为了补偿单独写一套完全不同的入库逻辑。</p>

<p v-pre><span><strong>正常同步和补偿同步应该共享同一套数据处理规则。</strong></span></p>

#### 4. 历史指标重算

<p v-pre>假设 11 月 20 日的售后订单数据被修复。</p>

<p v-pre>那么需要重新计算：</p>

<ul v-pre><li><div><div><p>11 月 20 日的团队接手订单量。</p></div></div></li><li><div><div><p>11 月 20 日的团队参与处理订单量。</p></div></div></li><li><div><div><p>11 月 20 日的团队解决订单量。</p></div></div></li><li><div><div><p>11 月 20 日的 SLA 超时率。</p></div></div></li></ul>

<p v-pre>建议建立重算任务表：</p>

<p v-pre><div>SQL</div></p>

```sql

CREATE TABLE etl_reprocess_task (
    task_id BIGINT NOT NULL AUTO_INCREMENT,
    task_type VARCHAR(64) NOT NULL COMMENT '补偿类型',
    business_key VARCHAR(128) DEFAULT NULL COMMENT '业务主键',
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL,
    task_status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    retry_count INT NOT NULL DEFAULT 0,
    error_message VARCHAR(1000) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at DATETIME DEFAULT NULL,

    PRIMARY KEY (task_id),
    KEY idx_status (task_status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='ETL数据补偿任务表';

```

<p v-pre>这样可以把补偿变成一个正式的系统能力，而不是开发人员手动执行 SQL。</p>

### 三、建立 ETL 任务监控体系

<p v-pre>数据同步任务不能只在终端打印：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>同步完成，共处理 1000 条</span></code></div></p>

<p v-pre>生产系统需要知道：</p>

<ul v-pre><li><div><div><p>今天运行了几次？</p></div></div></li><li><div><div><p>成功了几次？</p></div></div></li><li><div><div><p>失败了几次？</p></div></div></li><li><div><div><p>每次同步多少条？</p></div></div></li><li><div><div><p>花了多长时间？</p></div></div></li><li><div><div><p>是否出现数据延迟？</p></div></div></li><li><div><div><p>最后一次成功同步是什么时候？</p></div></div></li></ul>

<p v-pre>我们需要建立任务运行日志。</p>

#### 1. 设计 ETL 任务运行日志表

<p v-pre>表名：<code>etl_task_run_log</code></p>

<p v-pre><div>SQL</div></p>

```sql

CREATE TABLE etl_task_run_log (
    run_id BIGINT NOT NULL AUTO_INCREMENT,
    task_name VARCHAR(100) NOT NULL COMMENT '任务名称',

    task_status VARCHAR(20) NOT NULL
        COMMENT 'RUNNING/SUCCESS/FAILED',

    started_at DATETIME(6) NOT NULL,
    finished_at DATETIME(6) DEFAULT NULL,

    read_count BIGINT NOT NULL DEFAULT 0
        COMMENT '读取数量',

    insert_count BIGINT NOT NULL DEFAULT 0
        COMMENT '新增数量',

    update_count BIGINT NOT NULL DEFAULT 0
        COMMENT '更新数量',

    error_count BIGINT NOT NULL DEFAULT 0
        COMMENT '异常数量',

    duration_ms BIGINT DEFAULT NULL
        COMMENT '执行耗时毫秒',

    checkpoint_time DATETIME(6) DEFAULT NULL
        COMMENT '本次成功进度',

    error_message VARCHAR(2000) DEFAULT NULL
        COMMENT '异常信息',

    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (run_id),

    KEY idx_task_status (
        task_name,
        task_status,
        started_at
    )
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COMMENT='ETL任务运行日志';

```

#### 2. Python 记录任务执行情况

<p v-pre><div>Python</div></p>

```text
import time
from sqlalchemy import text

from app.database import target_engine


def create_run_log(task_name):
    with target_engine.begin() as conn:
        result = conn.execute(
            text("""
                INSERT INTO etl_task_run_log (
                    task_name,
                    task_status,
                    started_at
                )
                VALUES (
                    :task_name,
                    'RUNNING',
                    NOW(6)
                )
            """),
            {"task_name": task_name},
        )
        return result.lastrowid


def finish_run_log(
    run_id,
    status,
    read_count=0,
    error_message=None,
    duration_ms=None,
):
    with target_engine.begin() as conn:
        conn.execute(
            text("""
```

<p v-pre>然后在 ETL 任务入口使用：</p>

<p v-pre><div>Python</div></p>

```text
def monitored_sync():
    run_id = create_run_log("sync_aftersales_order")
    start = time.perf_counter()

    try:
        total = sync_orders()

        finish_run_log(
            run_id,
            "SUCCESS",
            read_count=total,
            duration_ms=int(
                (time.perf_counter() - start) * 1000
            ),
        )

    except Exception as exc:
        finish_run_log(
            run_id,
            "FAILED",
            error_message=str(exc)[:2000],
            duration_ms=int(
                (time.perf_counter() - start) * 1000
            ),
        )
        raise
```

<p v-pre>这里需要给之前的 <code>sync_orders()</code> 增加返回值，例如返回实际读取数量。完整实现还应该累计新增、更新、跳过和异常数量。</p>

<p v-pre>另外，任务运行日志必须独立于业务批次事务保存。否则业务事务回滚时，失败日志也可能一起消失。</p>

#### 3. 设计 ETL 监控指标

<p v-pre>建议先监控下面六项：</p>

<table v-pre><tbody><tr><th><p>监控指标</p></th><th><p>含义</p></th><th><p>异常判断示例</p></th></tr><tr><td><p>任务成功率</p></td><td><p>成功任务数 / 总任务数</p></td><td><p>低于99%</p></td></tr><tr><td><p>同步延迟</p></td><td><p>当前时间与源数据最新更新时间的差值</p></td><td><p>超过10分钟</p></td></tr><tr><td><p>任务耗时</p></td><td><p>单次任务执行时间</p></td><td><p>超过4分钟</p></td></tr><tr><td><p>同步数量</p></td><td><p>每次读取和写入数量</p></td><td><p>突然为0</p></td></tr><tr><td><p>数据质量失败数</p></td><td><p>质量检查异常数量</p></td><td><p>大于0</p></td></tr><tr><td><p>Checkpoint 停滞时间</p></td><td><p>最后成功同步距离现在多久</p></td><td><p>超过15分钟</p></td></tr></tbody></table>

<p v-pre>以上阈值只是课程示例，正式上线应结合实际数据量、业务 SLA 和任务周期确定。</p>

#### 4. 设计异常告警机制

<p v-pre>例如：</p>

<p v-pre><span><strong>ETL 异常告警示例</strong></span></p>

<p v-pre><div>严重</div></p>

<p v-pre><span><strong>任务：</strong></span> <code>sync_aftersales_order</code></p>

<p v-pre><span><strong>发生时间：</strong></span> 2026-11-21 10:15</p>

<p v-pre><span><strong>异常：</strong></span> MySQL 连接失败，重试次数已耗尽。</p>

<p v-pre><span><strong>最近成功进度：</strong></span> 10:05</p>

<p v-pre><span><strong>当前状态：</strong></span> FAILED</p>

<p v-pre><span><strong>建议处理：</strong></span></p>

<ol v-pre><li><div><div><p>检查 MySQL 连接。</p></div></div></li><li><div><div><p>检查数据库连接池。</p></div></div></li><li><div><div><p>检查 Checkpoint。</p></div></div></li><li><div><div><p>恢复后重新执行任务。</p></div></div></li></ol>

<p v-pre>建议告警分级：</p>

<ul v-pre><li><div><div><p>P0：核心数据错误，停止发布。</p></div></div></li><li><div><div><p>P1：核心 ETL 任务失败，立即通知。</p></div></div></li><li><div><div><p>P2：数据延迟、性能下降，通知维护人员。</p></div></div></li><li><div><div><p>P3：普通运行信息，仅记录日志。</p></div></div></li></ul>

<p v-pre>对于你这套系统，第一版可以先使用 Celery 日志、MySQL 任务日志和邮件或飞书告警，不必一开始就部署复杂的监控平台。</p>

### 四、完善 Celery 任务监控

<p v-pre>我们把前面的任务调度和运行日志结合起来。</p>

<p v-pre>推荐的任务结构：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>Celery Beat     │     ▼ Celery Worker     │     ▼ 任务互斥锁     │     ▼ 创建运行日志     │     ▼ 执行 ETL     │     ├── 成功：更新 SUCCESS     │     └── 失败：记录 FAILED                   │                   ▼                有限重试                   │                   ▼               最终告警</span></code></div></p>

<p v-pre>Celery 还提供任务事件与状态监控能力。</p>

<p v-pre>你可以了解：</p>

<ul v-pre><li><div><div><p><code>task_prerun</code>：任务开始。</p></div></div></li><li><div><div><p><code>task_postrun</code>：任务结束。</p></div></div></li><li><div><div><p><code>task_failure</code>：任务失败。</p></div></div></li><li><div><div><p><code>task_retry</code>：任务重试。</p></div></div></li></ul>

<p v-pre>例如：</p>

<p v-pre><div>Python</div></p>

```text
from celery.signals import task_failure


@task_failure.connect
def on_task_failure(
    sender=None,
    task_id=None,
    exception=None,
    **kwargs,
):
    print(
        f"任务失败: {sender.name}, "
        f"task_id={task_id}, "
        f"error={exception}"
    )
```

<p v-pre>生产环境不要只依赖 Celery 自身的任务状态，因为任务状态会受到结果后端配置、消息确认和状态保留策略影响。</p>

<p v-pre>MySQL 中的业务任务日志应作为自己的运行审计记录。</p>

### 五、ETL 项目完整架构评审

<p v-pre>现在我们把前面几节的知识整合成一个真正可以开发的项目。</p>

#### 售后数据分析系统 ETL 架构 V1

<p v-pre><span><strong>数据源层</strong></span></p>

<p v-pre>MySQL 业务库</p>

<p v-pre>售后订单、处理事件、客服、物流</p>

<p v-pre><span><strong>数据抽取层</strong></span></p>

<p v-pre>Python + SQLAlchemy</p>

<p v-pre>增量抽取、游标分页、回看窗口</p>

<p v-pre><span><strong>数据存储层</strong></span></p>

<p v-pre>MySQL ODS / DWD</p>

<p v-pre>原始数据、标准化数据、历史版本</p>

<p v-pre><span><strong>数据加工层</strong></span></p>

<p v-pre>SQL + Python</p>

<p v-pre>指标计算、每日汇总、历史补偿</p>

<p v-pre><span><strong>质量与发布层</strong></span></p>

<p v-pre>数据质量检查 + ADS</p>

<p v-pre>质量验证、批次发布、回滚</p>

<p v-pre><span><strong>任务调度</strong></span></p>

<p v-pre>Celery + Beat + Redis</p>

<p v-pre><span><strong>运行监控</strong></span></p>

<p v-pre>任务日志 + 告警</p>

#### 推荐的最终项目目录

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>aftersales-analytics/ ├── app/ │   ├── config/ │   │   └── settings.py │   ├── database/ │   │   ├── source.py │   │   └── target.py │   ├── etl/ │   │   ├── extract.py │   │   ├── transform.py │   │   ├── load.py │   │   └── checkpoint.py │   ├── jobs/ │   │   ├── sync_orders.py │   │   ├── sync_events.py │   │   ├── build_metrics.py │   │   └── reprocess.py │   ├── quality/ │   │   ├── checks.py │   │   └── validator.py │   ├── monitoring/ │   │   ├── task_log.py │   │   └── alerts.py │   └── celery_app.py ├── tests/ │   ├── test_extract.py │   ├── test_transform.py │   ├── test_load.py │   ├── test_checkpoint.py │   ├── test_idempotency.py │   └── test_recovery.py ├── sql/ │   ├── ods/ │   ├── dwd/ │   └── ads/ ├── migrations/ ├── docker-compose.yml ├── pyproject.toml └── .env.example</span></code></div></p>

<p v-pre>这里我建议把 <code>extract</code>、<code>transform</code>、<code>load</code> 分开，而不是把所有逻辑写在一个 <code>sync_orders.py</code> 中。</p>

<p v-pre>原因是：</p>

<ul v-pre><li><div><div><p>抽取逻辑可以单独测试。</p></div></div></li><li><div><div><p>转换逻辑可以单独测试。</p></div></div></li><li><div><div><p>加载逻辑可以单独测试。</p></div></div></li><li><div><div><p>将来新增订单事件、物流事件时可以复用组件。</p></div></div></li></ul>

<p v-pre>这也符合你之前希望采用的轻量化 SDLC：先完成可验证的小模块，再逐步集成。</p>

### 六、ETL 项目最终开发验收

<p v-pre>我们现在模拟一次正式项目验收。</p>

#### 1. 功能验收

<table v-pre><tbody><tr><th><p>验收项目</p></th><th><p>通过标准</p></th></tr><tr><td><p>增量同步</p></td><td><p>能正确同步新增和更新订单</p></td></tr><tr><td><p>游标分页</p></td><td><p>不遗漏相同更新时间的记录</p></td></tr><tr><td><p>幂等写入</p></td><td><p>重复执行不产生重复业务数据</p></td></tr><tr><td><p>事务控制</p></td><td><p>数据和 Checkpoint 原子提交</p></td></tr><tr><td><p>失败重试</p></td><td><p>临时故障自动重试</p></td></tr><tr><td><p>互斥控制</p></td><td><p>同一任务不会并发重复运行</p></td></tr><tr><td><p>数据补偿</p></td><td><p>可以指定订单和日期重新处理</p></td></tr><tr><td><p>数据质量</p></td><td><p>异常数据可以被识别</p></td></tr><tr><td><p>任务监控</p></td><td><p>能查询每次任务执行结果</p></td></tr><tr><td><p>异常告警</p></td><td><p>失败和数据延迟可以通知</p></td></tr></tbody></table>

#### 2. 性能验收

<p v-pre>假设首期业务规模：</p>

<table v-pre><tbody><tr><th><p>项目</p></th><th><p>验收目标（建议）</p></th></tr><tr><td><p>每日新增售后订单</p></td><td><p>3万条</p></td></tr><tr><td><p>单批同步数量</p></td><td><p>1000条</p></td></tr><tr><td><p>同步频率</p></td><td><p>5分钟</p></td></tr><tr><td><p>单次任务耗时</p></td><td><p>不超过4分钟</p></td></tr><tr><td><p>重复同步</p></td><td><p>不产生重复业务数据</p></td></tr><tr><td><p>失败恢复</p></td><td><p>从最后成功检查点继续</p></td></tr></tbody></table>

<p v-pre>这些是我们的 MVP 性能目标，不是实际压测结果。需要在真实数据量和硬件环境下验证。</p>

#### 3. 最终验收状态

#### 第四课 ETL 工程验收

<p v-pre><div>设计方案已完成</div></p>

<p v-pre>增量抽取与游标分页</p>

<p v-pre>设计完成</p>

<p v-pre>幂等写入与事务控制</p>

<p v-pre>设计完成</p>

<p v-pre>失败重试与断点恢复</p>

<p v-pre>设计完成</p>

<p v-pre>Celery 定时调度</p>

<p v-pre>设计完成</p>

<p v-pre>任务互斥与并发控制</p>

<p v-pre>设计完成</p>

<p v-pre>历史数据补偿</p>

<p v-pre>设计完成</p>

<p v-pre>任务监控与质量告警</p>

<p v-pre>设计完成</p>

<p v-pre>自动化故障测试</p>

<p v-pre>待实际运行</p>

<p v-pre>性能压力测试</p>

<p v-pre>待实际运行</p>

<p v-pre>生产部署验收</p>

<p v-pre>待实际运行</p>

### 七、第四课最后一道实战题：如何保证数据不遗漏？

<p v-pre>现在给你一个更接近真实生产环境的问题。</p>

<p v-pre>某天业务系统出现长事务：</p>

<ol v-pre><li><div><div><p>10:00，业务系统更新售后订单 A001，<code>updated_at=10:00</code>。</p></div></div></li><li><div><div><p>10:01，ETL 开始同步。</p></div></div></li><li><div><div><p>10:02，ETL 已经推进 Checkpoint 到 10:01。</p></div></div></li><li><div><div><p>10:05，业务系统才提交 A001。</p></div></div></li><li><div><div><p>A001 的 <code>updated_at</code> 仍然是 10:00。</p></div></div></li></ol>

<p v-pre>此时，ETL 可能已经错过 A001。</p>

<p v-pre>你认为应该如何解决？</p>

<p v-pre><div><label>A. 只依靠 Checkpoint，不需要额外处理。</label></div><div><label>B. 使用安全回看窗口，配合幂等写入和定期数据对账；高一致性场景进一步采用 CDC。</label></div><div><label>C. 每次同步前删除目标表，重新全量导入。</label></div><div><label>D. 把同步频率从5分钟改成1分钟，就不会遗漏。</label></div></p>

<p v-pre><span><strong>请解释你的选择理由</strong></span></p>

```text
时间不一致
```

<p v-pre><span class="interaction"><span>提交答案，完成第四课</span></span></p>

#### 八、第四课之后的学习路线

<table v-pre><tbody><tr><th><p>课程</p></th><th><p>学习主题</p></th><th><p>实战成果</p></th></tr><tr><td><p>第1课</p></td><td><p>数据分析系统基础</p></td><td><p>业务问题与分析目标</p></td></tr><tr><td><p>第2课</p></td><td><p>售后业务与指标设计</p></td><td><p>指标体系、PRD</p></td></tr><tr><td><p>第3课</p></td><td><p>数据架构与建模</p></td><td><p>ER图、MySQL表结构</p></td></tr><tr><td><p>第4课</p></td><td><p>ETL 数据开发</p></td><td><p>Python、SQLAlchemy、Celery</p></td></tr><tr><td><p>第5课</p></td><td><p>数据分析 API</p></td><td><p>FastAPI、查询接口</p></td></tr><tr><td><p>第6课</p></td><td><p>数据看板开发</p></td><td><p>React、ECharts</p></td></tr><tr><td><p>第7课</p></td><td><p>数据验证与测试</p></td><td><p>指标核验、自动化测试</p></td></tr><tr><td><p>第8课</p></td><td><p>部署与运营</p></td><td><p>Docker、监控、上线</p></td></tr></tbody></table>

<p v-pre><span><strong>给你的一个学习建议：</strong></span></p>

<p v-pre>不要急于一次性把所有代码都交给 Cursor 或 Codex 生成。</p>

<p v-pre>每完成一个模块，先自己说清楚：</p>

<ol v-pre><li><div><div><p>输入是什么？</p></div></div></li><li><div><div><p>输出是什么？</p></div></div></li><li><div><div><p>数据如何处理？</p></div></div></li><li><div><div><p>失败怎么办？</p></div></div></li><li><div><div><p>如何证明结果正确？</p></div></div></li></ol>

<p v-pre>这五个问题能够回答清楚，你就不只是会使用 AI 编写代码，而是真正具备数据分析系统的工程设计能力。</p>

## 第 26 轮　迟到更新、数据一致性与 ETL 验收 {#turn-26}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第四课实战问题4，我选择：B。理由：时间不一致。请评价我的数据一致性设计，并完成第四课最终总结和 ETL 项目验收。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第四课收官：ETL 数据一致性与项目验收

<p v-pre><div>实战问题4：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：安全回看窗口 + 幂等写入 + 定期对账，高一致性场景进一步采用 CDC。</strong></span></p>

<p v-pre>你的理由是「时间不一致」，判断正确。</p>

<p v-pre>更准确的表达是：</p>

<p v-pre><span><strong>业务数据的更新时间，不一定等于数据库事务的提交时间。</strong></span></p>

<p v-pre>这正是增量 ETL 容易发生数据遗漏的根本原因之一。</p>

#### 一、评价你的数据一致性设计

<p v-pre>假设发生以下情况：</p>

<ol v-pre><li><div><div><p><span><strong>10:00 — 业务修改 A001</strong></span></p><p><code>updated_at = 10:00</code>，但事务尚未提交。</p></div></div></li><li><div><div><p><span><strong>10:01 — ETL 开始查询</strong></span></p><p>A001 尚未提交，因此 ETL 无法读取。</p></div></div></li><li><div><div><p><span><strong>10:02 — ETL 更新 Checkpoint</strong></span></p><p>同步进度推进到 10:01。</p></div></div></li><li><div><div><p><span><strong>10:05 — 业务事务提交</strong></span></p><p>A001 终于可以被读取，但更新时间仍是 10:00。</p></div></div></li></ol>

<p v-pre>如果 ETL 下次只查询：</p>

<p v-pre><div>SQL</div></p>

```sql
WHERE updated_at > '2026-11-21 10:01:00'
```

<p v-pre>A001 就可能永远无法被同步。</p>

<p v-pre>这不是事务控制或幂等写入能够单独解决的问题。</p>

##### 三种保护机制

<table v-pre><tbody><tr><th><p>机制</p></th><th><p>解决的问题</p></th><th><p>局限性</p></th></tr><tr><td><p>安全回看窗口</p></td><td><p>重新读取近期可能遗漏的数据</p></td><td><p>无法覆盖无限长的延迟提交</p></td></tr><tr><td><p>幂等写入</p></td><td><p>重复读取不会产生重复业务记录</p></td><td><p>无法发现未读取过的数据</p></td></tr><tr><td><p>定期对账</p></td><td><p>发现源库和目标库之间的差异</p></td><td><p>需要额外的计算和修复流程</p></td></tr><tr><td><p>CDC</p></td><td><p>基于数据库变更日志捕获已提交的变化</p></td><td><p>部署、维护和数据消费更复杂</p></td></tr></tbody></table>

<p v-pre>对于当前售后分析系统的 MVP，我建议先采用 <span><strong>增量同步 + 回看窗口 + 幂等写入 + 定期对账</strong></span>。</p>

<p v-pre>如果未来要求严格捕获每次变更、支持物理删除，或者同步时效性要求进一步提高，再评估 MySQL Binlog CDC。</p>

### 二、第四课最终技术方案

#### 售后数据分析 ETL V1

<p v-pre>技术方案总结</p>

<p v-pre><span><strong>MySQL 业务数据库</strong></span></p>

<p v-pre>售后订单、处理事件、客服、物流</p>

<p v-pre><span><strong>Python + SQLAlchemy</strong></span></p>

<p v-pre>增量抽取、游标分页、安全回看</p>

<p v-pre><span><strong>MySQL ODS / DWD</strong></span></p>

<p v-pre>幂等写入、数据清洗、历史归属</p>

<p v-pre><span><strong>指标计算 + 数据质量检查</strong></span></p>

<p v-pre>团队指标、SLA、投诉、历史重算</p>

<p v-pre><span><strong>MySQL ADS</strong></span></p>

<p v-pre>质量检查通过后发布看板指标</p>

<p v-pre><span><strong>任务调度</strong></span></p>

<p v-pre>Celery Beat + Worker + Redis</p>

<p v-pre><span><strong>可靠性保障</strong></span></p>

<p v-pre>Checkpoint、事务、重试、互斥、监控</p>

#### 三、第四课知识点验收

<table v-pre><tbody><tr><th><p>知识点</p></th><th><p>你应该掌握的能力</p></th><th><p>学习状态</p></th></tr><tr><td><p>增量抽取</p></td><td><p>使用更新时间和游标分页读取数据</p></td><td><p>已学习</p></td></tr><tr><td><p>幂等写入</p></td><td><p>重复同步不会产生重复业务记录</p></td><td><p>已学习</p></td></tr><tr><td><p>Checkpoint</p></td><td><p>保存成功进度，支持断点恢复</p></td><td><p>已学习</p></td></tr><tr><td><p>事务控制</p></td><td><p>数据写入和进度原子提交</p></td><td><p>已学习</p></td></tr><tr><td><p>失败重试</p></td><td><p>区分临时错误和永久错误</p></td><td><p>已学习</p></td></tr><tr><td><p>Celery 调度</p></td><td><p>Beat 投递任务、Worker 执行</p></td><td><p>已学习</p></td></tr><tr><td><p>并发控制</p></td><td><p>防止同一任务同时执行</p></td><td><p>已学习</p></td></tr><tr><td><p>数据补偿</p></td><td><p>回看、指定主键重刷、历史重算</p></td><td><p>已学习</p></td></tr><tr><td><p>数据监控</p></td><td><p>记录任务状态、耗时、同步延迟</p></td><td><p>已学习</p></td></tr><tr><td><p>数据一致性</p></td><td><p>理解更新时间与提交时间的差异</p></td><td><p>已学习</p></td></tr></tbody></table>

<p v-pre>你已经连续完成了第四课的四道实战选择题，说明你能够识别主要的 ETL 设计方案。</p>

<p v-pre>但要注意：<span><strong>理解方案与能够独立实现、排查和验证系统，是两个不同的学习阶段。</strong></span></p>

### 四、ETL 项目最终验收

<p v-pre>我们将验收分成三个等级，避免把课堂学习完成误认为生产项目已经上线。</p>

<p v-pre><span><strong>Level 1：设计验收</strong></span></p>

<p v-pre>架构、数据流、异常处理方案</p>

<p v-pre><div>通过</div></p>

<p v-pre><span><strong>Level 2：功能验收</strong></span></p>

<p v-pre>运行代码、测试事务与重试、核对数据</p>

<p v-pre><div>待执行</div></p>

<p v-pre><span><strong>Level 3：生产验收</strong></span></p>

<p v-pre>性能、故障恢复、监控、数据一致性</p>

<p v-pre><div>待执行</div></p>

#### 正式开发的验收标准

<table v-pre><tbody><tr><th><p>验收项</p></th><th><p>通过标准</p></th></tr><tr><td><p>数据完整性</p></td><td><p>模拟数据与目标数据核对一致</p></td></tr><tr><td><p>幂等性</p></td><td><p>同一批数据执行三次，最终结果不重复</p></td></tr><tr><td><p>事务原子性</p></td><td><p>注入异常后数据和 Checkpoint 同时回滚</p></td></tr><tr><td><p>失败恢复</p></td><td><p>第三批失败后能从成功位置继续</p></td></tr><tr><td><p>并发控制</p></td><td><p>同一同步任务不会同时执行</p></td></tr><tr><td><p>历史补偿</p></td><td><p>指定售后单和日期可以重新加工</p></td></tr><tr><td><p>数据质量</p></td><td><p>异常数据不能直接发布</p></td></tr><tr><td><p>任务监控</p></td><td><p>可查询成功、失败、耗时、延迟</p></td></tr><tr><td><p>性能</p></td><td><p>目标环境中单次任务不超过4分钟</p></td></tr><tr><td><p>数据对账</p></td><td><p>源目标差异能够被发现和修复</p></td></tr></tbody></table>

<p v-pre>上述项目仍需要通过实际测试才能勾选完成。</p>

### 五、第四课学习总结

#### 你已经建立的 ETL 思维模型

<ol v-pre><li><div><div><p><span><strong>先保证正确性</strong></span></p><p>明确数据来源、业务主键、更新时间和统计口径。</p></div></div></li><li><div><div><p><span><strong>再保证可恢复性</strong></span></p><p>使用事务、Checkpoint 和幂等写入。</p></div></div></li><li><div><div><p><span><strong>然后保证稳定性</strong></span></p><p>通过有限重试、任务互斥和调度控制减少故障。</p></div></div></li><li><div><div><p><span><strong>最后保证可信度</strong></span></p><p>通过数据补偿、对账、质量检查和监控证明结果可靠。</p></div></div></li></ol>

<p v-pre>到这里，第四课的<span><strong>方案设计学习阶段正式完成</strong></span>。</p>

### 六、第五课预告：FastAPI 数据分析接口设计

<p v-pre>接下来，我们要解决一个新问题：</p>

<p v-pre>数据已经进入 ADS 汇总表，前端看板应该如何读取？</p>

<p v-pre>例如售后主管打开页面，希望看到：</p>

<ul v-pre><li><div><div><p>今日售后订单量。</p></div></div></li><li><div><div><p>平均解决时长。</p></div></div></li><li><div><div><p>SLA 超时率。</p></div></div></li><li><div><div><p>各团队处理效率。</p></div></div></li><li><div><div><p>近30天售后趋势。</p></div></div></li></ul>

<p v-pre>我们需要设计 FastAPI 查询接口。</p>

#### 第五课实战问题1

<p v-pre>假设 React 看板需要展示四张 KPI 卡片：</p>

<p v-pre>售后订单量</p>

### 1,280

<p v-pre>平均解决时长</p>

### 58分钟

<p v-pre>SLA超时率</p>

### 12.5%

<p v-pre>投诉订单量</p>

### 36

<p v-pre><span>以上为教学用模拟数据。</span></p>

<p v-pre>你认为后端 API 应该如何设计？</p>

<p v-pre><div><label>A. 前端直接连接 MySQL，自己执行 SQL 查询。</label></div><div><label>B. FastAPI 提供经营总览接口，从 ADS 汇总表读取指标，统一处理权限、时间范围和指标口径。</label></div><div><label>C. 每张 KPI 卡片都直接查询售后订单和事件明细表。</label></div><div><label>D. 后端每天生成 Excel，前端读取 Excel 显示。</label></div></p>

<p v-pre><span><strong>请说明你的选择理由</strong></span></p>

```text
数据交接面
```

<p v-pre><span class="interaction"><span>提交答案，进入第五课</span></span></p>

<p v-pre><span><strong>下一阶段的核心变化：</strong></span> 从「如何可靠地产生数据」转向「如何安全、准确、高效地向业务系统提供数据」。</p>
