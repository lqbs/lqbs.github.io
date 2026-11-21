---
title: "第九章　Aftersales Analytics V1 项目实战"
description: "确定 MVP、初始化仓库，规划第一个售后 KPI 闭环。"
outline: [2, 2]
prev:
  text: "第八章　部署、上线与运维"
  link: "/posts/aftersales-analytics/08-deployment"
next:
  text: 完整目录
  link: /posts/aftersales-analytics-from-scratch
---

# 第九章　Aftersales Analytics V1 项目实战

确定 MVP、初始化仓库，规划第一个售后 KPI 闭环。

[返回完整目录](/posts/aftersales-analytics-from-scratch#完整目录)

## 第 43 轮　项目目标、目录、初始化步骤和首轮迭代题 {#turn-43}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div><div><p><span>开始 </span><strong><span>第九课</span></strong></p></div></div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第九课：售后数据分析系统 V1 真实工程实战

<p v-pre></p>

<p v-pre><div>进入真实项目开发阶段</div> <div>Project-Based Learning</div></p>

<p v-pre>前八课，我们学习了如何设计和开发一个完整的数据分析系统。</p>

<p v-pre>从现在开始，我们换一种学习方式：</p>

<p v-pre><span><strong>不再以知识点为中心，而是以真实项目为中心。</strong></span></p>

<p v-pre>我们将真正建立一个 GitHub 项目，从零开始编写代码，逐步完成售后数据分析系统 V1。</p>

#### 一、本课学习目标

<p v-pre>本课项目名称：</p>

<p v-pre><span><strong>Aftersales Analytics —— 售后数据分析系统</strong></span></p>

<p v-pre>项目目标：</p>

<p v-pre>帮助售后主管和老板回答四个问题：</p>

<ol v-pre><li><div><div><p>售后业务整体情况怎么样？</p></div></div></li><li><div><div><p>哪些团队、客服的处理效率存在问题？</p></div></div></li><li><div><div><p>售后问题主要集中在哪里？</p></div></div></li><li><div><div><p>哪些问题需要优先改善？</p></div></div></li></ol>

##### 最终技术架构

#### 项目技术栈

<p v-pre><div><span class="visual-label">[William Candillon Mix!]</span></div></p>

<p v-pre><span><strong>React + TypeScript</strong></span></p>

<p v-pre>前端开发</p>

<p v-pre><div><span class="visual-label">[FastAPI × @hey-api/openapi-tsで型定義を自動生成する | DevelopersIO]</span></div></p>

<p v-pre><span><strong>Python + FastAPI</strong></span></p>

<p v-pre>后端开发</p>

<p v-pre><div><span class="visual-label">[MySQL là gì? Hướng dẫn Cài đặt và Sử dụng MySQL · 200Lab]</span></div></p>

<p v-pre><span><strong>MySQL</strong></span></p>

<p v-pre>数据库</p>

<p v-pre><div><span class="visual-label">[Apache - The ASF (@TheASF) on X]</span></div></p>

<p v-pre><span><strong>ECharts</strong></span></p>

<p v-pre>数据可视化</p>

<p v-pre><div><span class="visual-label">[omv6:docker_in_omv [omv-extras.org]]</span></div></p>

<p v-pre><span><strong>Docker Compose</strong></span></p>

<p v-pre>容器部署</p>

<p v-pre><div><span class="visual-label">[GitHub Actions at a Glance]</span></div></p>

<p v-pre><span><strong>GitHub Actions</strong></span></p>

<p v-pre>自动化发布</p>

<p v-pre><span><strong>配套技术</strong></span></p>

<p v-pre>SQLAlchemy · Alembic · Celery · Redis · Nginx · Pytest</p>

#### 二、先确定项目 MVP 范围

<p v-pre>我们不打算一开始就开发所有售后功能。</p>

<p v-pre>先做一条完整的数据分析链路。</p>

#### 第一版 MVP 功能

<ol v-pre><li><div><div><p><span><strong>数据导入</strong></span></p><p>支持 Excel/CSV 售后数据导入。</p></div></div></li><li><div><div><p><span><strong>数据处理</strong></span></p><p>Python 清洗、转换、去重、增量同步。</p></div></div></li><li><div><div><p><span><strong>数据存储</strong></span></p><p>MySQL 保存售后订单和分析数据。</p></div></div></li><li><div><div><p><span><strong>指标计算</strong></span></p><p>售后申请量、解决量、解决率、平均解决时长、SLA 超时率。</p></div></div></li><li><div><div><p><span><strong>API 服务</strong></span></p><p>FastAPI 提供指标查询和明细查询。</p></div></div></li><li><div><div><p><span><strong>数据看板</strong></span></p><p>React + ECharts 展示 KPI 和趋势。</p></div></div></li><li><div><div><p><span><strong>质量检查</strong></span></p><p>数据完整性、重复记录、指标对账。</p></div></div></li><li><div><div><p><span><strong>部署上线</strong></span></p><p>Docker Compose + Nginx + GitHub Actions。</p></div></div></li></ol>

<p v-pre>第一版暂不做复杂的 AI 分析、实时数据同步和多租户。先把核心数据链路做正确。</p>

#### 三、第一步：设计项目目录

<p v-pre>我们先建立一个规范的 Monorepo 项目。</p>

<p v-pre>Monorepo 的意思是：前端、后端、部署配置和项目文档统一放在一个 GitHub 仓库中。</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>aftersales-analytics/ │ ├── frontend/ │   ├── src/ │   │   ├── api/ │   │   ├── components/ │   │   ├── pages/ │   │   ├── hooks/ │   │   └── types/ │   ├── package.json │   └── Dockerfile │ ├── backend/ │   ├── app/ │   │   ├── api/ │   │   ├── core/ │   │   ├── models/ │   │   ├── schemas/ │   │   ├── repositories/ │   │   ├── services/ │   │   ├── etl/ │   │   ├── quality/ │   │   └── tasks/ │   ├── tests/ │   ├── alembic/ │   ├── pyproject.toml │   └── Dockerfile │ ├── deploy/ │   ├── nginx/ │   ├── docker-compose.yml │   └── compose.production.yaml │ ├── docs/ │   ├── PRD.md │   ├── architecture.md │   ├── database-design.md │   └── RUNBOOK.md │ ├── .github/ │   └── workflows/ │       └── ci.yml │ ├── .gitignore └── README.md</span></code></div></p>

<p v-pre>这里特别注意：</p>

<ul v-pre><li><div><div><p><code>api</code>：只负责接收 HTTP 请求。</p></div></div></li><li><div><div><p><code>services</code>：负责业务逻辑。</p></div></div></li><li><div><div><p><code>repositories</code>：负责数据库访问。</p></div></div></li><li><div><div><p><code>etl</code>：负责数据抽取、转换、加载。</p></div></div></li><li><div><div><p><code>quality</code>：负责数据质量检查。</p></div></div></li><li><div><div><p><code>tasks</code>：负责 Celery 后台任务。</p></div></div></li></ul>

<p v-pre>这样可以避免后端代码全部写在一个文件里。</p>

#### 四、第二步：初始化真实项目

<p v-pre>我们开始动手。</p>

##### 1. 创建项目目录

<p v-pre><div>Bash</div></p>

```bash
mkdir aftersales-analytics

cd aftersales-analytics

mkdir -p docs deploy/nginx .github/workflows
```

##### 2. 初始化 Python 后端

<p v-pre>使用你之前接触过的 <code>uv</code>：</p>

<p v-pre><div>Bash</div></p>

```bash
uv init backend

cd backend
```

<p v-pre>安装依赖：</p>

<p v-pre><div>Bash</div></p>

```bash
uv add fastapi "uvicorn[standard]" \
  sqlalchemy pymysql alembic \
  pydantic-settings
```

<p v-pre>安装开发依赖：</p>

<p v-pre><div>Bash</div></p>

```bash
uv add --dev pytest httpx ruff
```

<p v-pre>回到项目根目录：</p>

<p v-pre><div>Bash</div></p>

```bash
cd ..
```

<p v-pre>为什么暂时不安装所有依赖？</p>

<p v-pre>因为我们采用渐进式开发：</p>

<ul v-pre><li><div><div><p>第一阶段：先跑通 API。</p></div></div></li><li><div><div><p>第二阶段：加入 MySQL。</p></div></div></li><li><div><div><p>第三阶段：加入 ETL。</p></div></div></li><li><div><div><p>第四阶段：加入 Celery 和 Redis。</p></div></div></li></ul>

<p v-pre>避免项目刚初始化就引入大量尚未使用的依赖。</p>

##### 3. 初始化 React 前端

<p v-pre><div>Bash</div></p>

```bash
npm create vite@latest frontend \
  -- --template react-ts
```

<p v-pre>进入项目：</p>

<p v-pre><div>Bash</div></p>

```bash
cd frontend

npm install

npm install axios echarts echarts-for-react

cd ..
```

##### 4. 初始化 Git

<p v-pre><div>Bash</div></p>

```bash
git init

git branch -M main
```

<p v-pre>创建 <code>.gitignore</code>：</p>

<p v-pre><div>gitignore</div></p>

<p v-pre><div><code><span> <span># Python</span> <span>__pycache__/</span> <span>*.py[cod]</span> <span>.venv/</span> <span>.pytest_cache/</span> <span>.ruff_cache/</span> <span>.coverage</span>  <span># Node</span> <span>node_modules/</span> <span>dist/</span>  <span># Environment</span> <span>.env</span> <span>.env.*</span> <span>!.env.example</span>  <span># Secrets</span> <span>deploy/secrets/</span> <span>*.pem</span> <span>*.key</span>  <span># IDE</span> <span>.idea/</span> <span>.vscode/</span>  <span># macOS</span> <span>.DS_Store</span>  <span># Logs and backups</span> <span>*.log</span> <span>backup/</span> </span></code></div></p>

<p v-pre>注意：<code>.env.production</code>、数据库密码文件和生产 SSH 私钥绝不能提交到 GitHub。</p>

### 五、第三步：定义第一个业务闭环

<p v-pre>这是本课最重要的部分。</p>

<p v-pre>我们不要一上来就开发十几个页面。</p>

<p v-pre>先完成一个真正可用的业务闭环：</p>

#### 第一个开发目标：售后总览 KPI

<p v-pre><span><strong>CSV 售后数据</strong></span></p>

<p v-pre><span><strong>Python ETL</strong></span></p>

<p v-pre>数据清洗和转换</p>

<p v-pre><span><strong>MySQL</strong></span></p>

<p v-pre>保存售后事实数据</p>

<p v-pre><span><strong>FastAPI</strong></span></p>

<p v-pre>计算并返回 KPI</p>

<p v-pre><span><strong>React + ECharts</strong></span></p>

<p v-pre>展示售后总览</p>

##### 第一批核心数据字段

<p v-pre>我们先设计一个最小数据集。</p>

<table v-pre><tbody><tr><th><p>字段</p></th><th><p>类型</p></th><th><p>说明</p></th></tr><tr><td><p>aftersales_id</p></td><td><p>VARCHAR</p></td><td><p>售后单号</p></td></tr><tr><td><p>order_id</p></td><td><p>VARCHAR</p></td><td><p>订单编号</p></td></tr><tr><td><p>apply_time</p></td><td><p>DATETIME</p></td><td><p>申请时间</p></td></tr><tr><td><p>first_response_time</p></td><td><p>DATETIME</p></td><td><p>首次响应时间</p></td></tr><tr><td><p>resolved_time</p></td><td><p>DATETIME</p></td><td><p>解决时间</p></td></tr><tr><td><p>team_id</p></td><td><p>BIGINT</p></td><td><p>当前团队标识</p></td></tr><tr><td><p>status</p></td><td><p>VARCHAR</p></td><td><p>售后状态</p></td></tr><tr><td><p>sla_deadline</p></td><td><p>DATETIME</p></td><td><p>SLA 截止时间</p></td></tr></tbody></table>

<p v-pre>这里需要特别说明：如果我们要统计历史团队工作量，不能只保存当前 <code>team_id</code>，还要保留团队转交事件或团队归属历史。</p>

<p v-pre>另外，正式数据模型还需要明确状态流转、时间字段时区、部分解决和重新打开规则。不能只依靠一张当前状态表推导全部历史过程。</p>

##### 第一版首页 KPI

<p v-pre>售后申请量</p>

### —

<p v-pre>解决数量</p>

### —

<p v-pre>解决率</p>

### —

<p v-pre>SLA 超时率</p>

### —

<p v-pre><span>这是待开发的 KPI 页面结构示意，目前没有接入真实数据。</span></p>

### 六、第一课实战：如何安排第一个开发迭代？

<p v-pre>现在模拟真实项目的开发决策。</p>

<p v-pre>你只有有限的开发时间，不能一次性完成所有模块。</p>

<p v-pre>老板希望尽快看到售后分析看板，但你知道没有可靠的数据链路，图表就没有价值。</p>

<p v-pre>你准备采用哪种开发方式？</p>

#### 实战问题1：如何规划第一个迭代？ {#first-iteration-exercise}

<p v-pre><label><p><span><strong>A. 先开发完整前端</strong></span></p><p>把所有看板页面、图表和筛选功能完成，再对接后端。</p></label></p>

<p v-pre><label><p><span><strong>B. 优先打通一条端到端数据链路</strong></span></p><p>从 CSV 导入开始，完成 ETL、MySQL、API 和一个 KPI 页面。</p></label></p>

<p v-pre><label><p><span><strong>C. 先搭建完整后端架构</strong></span></p><p>完成所有数据库表、API、权限和 Celery，再开发前端。</p></label></p>

<p v-pre><label><p><span><strong>D. 先完成所有数据库建模</strong></span></p><p>一次性设计完整数据库和所有指标，再开始编码。</p></label></p>

<p v-pre><span><strong>请说明你的理由</strong></span></p>

<p v-pre><span class="interaction"><span>提交答案，继续实战</span></span></p>

#### 七、第九课项目里程碑

#### Aftersales Analytics V1

<p v-pre>真实工程项目进度管理</p>

<p v-pre><span><strong>1</strong></span></p>

<p v-pre><span><strong>M1 · 项目初始化</strong></span></p>

<p v-pre>GitHub 仓库、目录、开发环境</p>

<p v-pre><div>当前阶段</div></p>

<p v-pre><span><strong>2</strong></span></p>

<p v-pre><span><strong>M2 · 数据工程</strong></span></p>

<p v-pre>CSV、ETL、MySQL、质量检查</p>

<p v-pre><div>待开始</div></p>

<p v-pre><span><strong>3</strong></span></p>

<p v-pre><span><strong>M3 · 后端开发</strong></span></p>

<p v-pre>FastAPI、SQLAlchemy、指标 API</p>

<p v-pre><div>待开始</div></p>

<p v-pre><span><strong>4</strong></span></p>

<p v-pre><span><strong>M4 · 前端开发</strong></span></p>

<p v-pre>React、ECharts、筛选与下钻</p>

<p v-pre><div>待开始</div></p>

<p v-pre><span><strong>5</strong></span></p>

<p v-pre><span><strong>M5 · 集成测试</strong></span></p>

<p v-pre>前后端联调、数据验收</p>

<p v-pre><div>待开始</div></p>

<p v-pre><span><strong>6</strong></span></p>

<p v-pre><span><strong>M6 · 部署上线</strong></span></p>

<p v-pre>Docker、HTTPS、CI/CD、运维</p>

<p v-pre><div>待开始</div></p>

<p v-pre><span><strong>本课的最终目标：</strong></span> 不是做出一个看起来漂亮的演示页面，而是交付一个数据来源明确、指标口径正确、可以测试、可以部署、可以持续维护的真实系统。</p>

<p v-pre>我们从 M1 开始，逐个模块完成，每次实战都要有可运行的代码和验收标准。</p>

### 原回复中的补充代码与配置

```text
aftersales-analytics/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── types/
│   ├── package.json
│   └── Dockerfile
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── etl/
│   │   ├── quality/
│   │   └── tasks/
│   ├── tests/
│   ├── alembic/
│   ├── pyproject.toml
│   └── Dockerfile
│
├── deploy/
│   ├── nginx/
│   ├── docker-compose.yml
│   └── compose.production.yaml
│
├── docs/
│   ├── PRD.md
│   ├── architecture.md
│   ├── database-design.md
│   └── RUNBOOK.md
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .gitignore
└── README.md
```

```text

# Python
__pycache__/
*.py[cod]
.venv/
.pytest_cache/
.ruff_cache/
.coverage

# Node
node_modules/
dist/

# Environment
.env
.env.*
!.env.example

# Secrets
deploy/secrets/
*.pem
*.key

# IDE
.idea/
.vscode/

# macOS
.DS_Store

# Logs and backups
*.log
backup/
```
