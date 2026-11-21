---
title: "第八章　部署、上线与运维"
description: "完成 Docker、Nginx、HTTPS、GitHub Actions 和生产回滚的设计与演练。"
outline: [2, 2]
prev:
  text: "第七章　数据验证与质量治理"
  link: "/posts/aftersales-analytics/07-data-quality"
next:
  text: "第九章　Aftersales Analytics V1 项目实战"
  link: "/posts/aftersales-analytics/09-project"
---

# 第八章　部署、上线与运维

完成 Docker、Nginx、HTTPS、GitHub Actions 和生产回滚的设计与演练。

[返回完整目录](/posts/aftersales-analytics-from-scratch#完整目录)

## 第 39 轮　Docker Compose 部署和数据卷持久化 {#turn-39}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>下一课</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第八课：系统部署、上线与运行维护

<p v-pre>前七课，我们已经完成了售后数据分析系统从业务需求到数据质量治理的设计。</p>

<p v-pre>现在进入最后一个重要阶段：<span><strong>把系统真正部署到服务器，让它稳定运行。</strong></span></p>

<p v-pre>这一课和之前有所不同。我们不再只讨论架构和代码，而是采用真实项目交付的方式，逐步完成部署、配置、验证和上线。</p>

#### 一、本课学习目标

<p v-pre>我们继续使用之前的技术栈：</p>

<table v-pre><tbody><tr><th><p>模块</p></th><th><p>技术</p></th><th><p>作用</p></th></tr><tr><td><p>前端</p></td><td><p>React + TypeScript</p></td><td><p>数据分析看板</p></td></tr><tr><td><p>后端</p></td><td><p>Python + FastAPI</p></td><td><p>API 服务</p></td></tr><tr><td><p>数据库</p></td><td><p>MySQL</p></td><td><p>业务数据与分析数据</p></td></tr><tr><td><p>ORM</p></td><td><p>SQLAlchemy + Alembic</p></td><td><p>数据访问与迁移</p></td></tr><tr><td><p>定时任务</p></td><td><p>Celery + Beat</p></td><td><p>ETL 和质量检查</p></td></tr><tr><td><p>消息中间件</p></td><td><p>Redis</p></td><td><p>任务队列</p></td></tr><tr><td><p>容器</p></td><td><p>Docker Compose</p></td><td><p>服务编排</p></td></tr><tr><td><p>Web 服务</p></td><td><p>Nginx</p></td><td><p>反向代理和 HTTPS</p></td></tr><tr><td><p>发布</p></td><td><p>GitHub Actions</p></td><td><p>CI/CD</p></td></tr></tbody></table>

#### 二、最终部署架构

<p v-pre>我们先明确上线后的系统长什么样。</p>

#### 售后数据分析系统 · 生产架构

<p v-pre><span><strong>用户浏览器</strong></span></p>

<p v-pre>React 数据看板</p>

<p v-pre><span><strong>Nginx</strong></span></p>

<p v-pre>HTTPS / 静态资源 / API 反向代理</p>

<p v-pre><span><strong>FastAPI</strong></span></p>

<p v-pre>业务 API</p>

<p v-pre><span><strong>Celery Worker</strong></span></p>

<p v-pre>后台任务</p>

<p v-pre><span><strong>Celery Beat</strong></span></p>

<p v-pre>定时调度</p>

<p v-pre><span><strong>Redis</strong></span></p>

<p v-pre>任务队列</p>

<p v-pre><span><strong>MySQL</strong></span></p>

<p v-pre>业务数据 / ADS / 质量数据</p>

<p v-pre>横向能力：日志、监控、数据库备份、密钥管理、CI/CD。</p>

<p v-pre>本课采用单服务器 Docker Compose 部署作为 MVP 起点。MySQL 可以先与应用部署在同一服务器，但生产环境需要独立持久化存储、备份和资源监控；规模增长后再考虑拆分数据库与任务服务。</p>

#### 三、先确定部署方案

<p v-pre>为了让学习更贴近实际，我建议先使用一台 Linux 云服务器。</p>

<p v-pre>我们采用：</p>

<ul v-pre><li><div><div><p>Ubuntu 24.04 LTS。</p></div></div></li><li><div><div><p>Docker Engine。</p></div></div></li><li><div><div><p>Docker Compose Plugin。</p></div></div></li><li><div><div><p>Nginx。</p></div></div></li><li><div><div><p>域名 + HTTPS。</p></div></div></li><li><div><div><p>GitHub Actions 自动构建和发布。</p></div></div></li></ul>

<p v-pre>不需要一开始就使用 Kubernetes。对于个人项目或小团队，Docker Compose 更容易维护，复杂度也更低。</p>

### 四、第一步：设计生产环境项目目录

<p v-pre>先不要急着执行 Docker 命令。</p>

<p v-pre>一个好的部署方案，首先需要明确哪些文件属于应用、哪些属于配置、哪些属于持久化数据。</p>

<p v-pre>建议项目采用以下结构：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>aftersales-analytics/ │ ├── frontend/ │   ├── src/ │   ├── package.json │   └── Dockerfile │ ├── backend/ │   ├── app/ │   │   ├── api/ │   │   ├── models/ │   │   ├── services/ │   │   ├── repositories/ │   │   ├── etl/ │   │   ├── quality/ │   │   └── tasks/ │   ├── requirements.txt │   └── Dockerfile │ ├── deploy/ │   ├── nginx/ │   │   └── default.conf │   ├── secrets/ │   │   ├── mysql_root_password.txt │   │   └── db_password.txt │   └── docker-compose.yml │ ├── .dockerignore ├── .gitignore └── README.md</span></code></div></p>

<p v-pre>这里有几个设计原则：</p>

<ol v-pre><li><div><div><p>前端和后端分别构建镜像。</p></div></div></li><li><div><div><p>API、Worker、Beat 共用后端镜像，但使用不同启动命令。</p></div></div></li><li><div><div><p>MySQL 和 Redis 不直接暴露公网端口。</p></div></div></li><li><div><div><p>MySQL 数据使用 Docker Volume 持久化。</p></div></div></li><li><div><div><p>密码通过 Docker Secrets 注入，不写在代码和 Git 仓库中。</p></div></div></li></ol>

#### 五、第二步：编写后端 Dockerfile

<p v-pre><code>backend/Dockerfile</code></p>

<p v-pre><div>dockerfile</div></p>

```dockerfile

FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN pip install --no-cache-dir \
    -r requirements.txt

COPY app ./app

RUN useradd --create-home appuser \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000"]
```

<p v-pre>这里有几个重点：</p>

<ul v-pre><li><div><div><p><code>python:3.12-slim</code>：减少镜像体积。</p></div></div></li><li><div><div><p><code>WORKDIR</code>：设置工作目录。</p></div></div></li><li><div><div><p><code>COPY requirements.txt</code>：利用 Docker 构建缓存。</p></div></div></li><li><div><div><p><code>PYTHONUNBUFFERED</code>：让日志及时输出。</p></div></div></li><li><div><div><p><code>USER appuser</code>：避免使用 root 运行应用。</p></div></div></li></ul>

<p v-pre>注意：如果你的项目依赖 MySQL 原生驱动或其他系统库，需要根据实际依赖安装对应系统包。</p>

#### 六、第三步：设计 Docker Compose

<p v-pre>这是本课的核心。</p>

<p v-pre>我们需要让 Docker Compose 管理六个服务：</p>

<table v-pre><tbody><tr><th><p>服务</p></th><th><p>作用</p></th></tr><tr><td><p>nginx</p></td><td><p>对外提供 HTTP/HTTPS</p></td></tr><tr><td><p>api</p></td><td><p>FastAPI</p></td></tr><tr><td><p>worker</p></td><td><p>Celery 后台任务</p></td></tr><tr><td><p>beat</p></td><td><p>定时任务调度</p></td></tr><tr><td><p>redis</p></td><td><p>Celery 消息队列</p></td></tr><tr><td><p>mysql</p></td><td><p>数据存储</p></td></tr></tbody></table>

<p v-pre><code>deploy/docker-compose.yml</code>：</p>

<p v-pre><div>YAML</div></p>

```yaml

services:
  api:
    build:
      context: ../backend
    command: >
      uvicorn app.main:app
      --host 0.0.0.0
      --port 8000
    restart: unless-stopped
    environment:
      DB_HOST: mysql
      DB_NAME: aftersales
      DB_USER: aftersales
      DB_PASSWORD_FILE: /run/secrets/db_password
      REDIS_URL: redis://redis:6379/0
    secrets:
      - db_password
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - internal

  worker:
    build:
      context: ../backend
    command: celery -A app.celery_app worker --loglevel=INFO
    restart: unless-stopped
    environment:
      DB_HOST: mysql
      DB_NAME: aftersales
      DB_USER: aftersales
      DB_PASSWORD_FILE: /run/secrets/db_password
      REDIS_URL: redis://redis:6379/0
    secrets:
      - db_password
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - internal

  beat:
    build:
      context: ../backend
    command: celery -A app.celery_app beat --loglevel=INFO
    restart: unless-stopped
    environment:
      REDIS_URL: redis://redis:6379/0
    depends_on:
      redis:
        condition: service_healthy
    networks:
      - internal

  mysql:
    image: mysql:8.4
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: aftersales
      MYSQL_USER: aftersales
      MYSQL_PASSWORD_FILE: /run/secrets/db_password
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/mysql_root_password
    secrets:
      - db_password
      - mysql_root_password
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test:
        - CMD-SHELL
        - mysqladmin ping -h 127.0.0.1
          -uroot -p"$$(cat /run/secrets/mysql_root_password)"
          --silent
      interval: 10s
      timeout: 5s
      retries: 10
    networks:
      - internal

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - internal

volumes:
  mysql_data:
  redis_data:

secrets:
  db_password:
    file: ./secrets/db_password.txt
  mysql_root_password:
    file: ./secrets/mysql_root_password.txt

networks:
  internal:
    driver: bridge
```

<p v-pre>这是应用、数据库和任务服务的基础编排骨架。还需要补充 Nginx 网关、前端构建服务、健康检查端点以及生产环境配置后才能完整上线。</p>

<p v-pre>特别注意：</p>

<ul v-pre><li><div><div><p><code>mysql_data</code> 是持久化卷。</p></div></div></li><li><div><div><p><code>depends_on</code> 配合 <code>service_healthy</code>，避免服务在数据库尚未就绪时启动。</p></div></div></li><li><div><div><p><code>worker</code> 和 <code>api</code> 可以共享同一后端镜像。</p></div></div></li><li><div><div><p><code>beat</code> 应保证只有一个活动调度实例，避免重复派发任务。</p></div></div></li><li><div><div><p>Redis 当前没有配置认证，生产环境需要结合网络隔离、访问控制和密码策略进一步加固。</p></div></div></li><li><div><div><p><code>db_password.txt</code> 和 <code>mysql_root_password.txt</code> 必须加入 <code>.gitignore</code>，并限制文件权限。</p></div></div></li></ul>

<p v-pre>另外，首次初始化 MySQL 时，环境变量主要用于初始化数据目录；已有数据卷不会因为修改这些变量就自动修改数据库密码。</p>

#### 七、第四步：理解 Docker Volume 数据持久化

<p v-pre>这是一个非常重要的知识点。</p>

<p v-pre>假设我们已经部署了售后系统，MySQL 中保存了 100 万条订单。</p>

<p v-pre>现在执行：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose down
```

<p v-pre>然后再次启动：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose up -d
```

<p v-pre>订单数据是否还存在，取决于是否使用了持久化存储。</p>

<p v-pre>我们使用：</p>

<p v-pre><div>YAML</div></p>

```yaml
volumes:
  - mysql_data:/var/lib/mysql
```

<p v-pre>这表示 MySQL 的数据存储在 Docker 管理的持久化卷中，而不是仅存在容器可写层。</p>

<p v-pre><span><strong>三种数据存储方式对比</strong></span></p>

<p v-pre><span><strong>容器可写层</strong></span></p>

<p v-pre><div>不适合数据库持久化</div></p>

<p v-pre>删除容器后，容器自身的数据层也会被删除。</p>

<p v-pre><span><strong>Docker Volume</strong></span></p>

<p v-pre><div>推荐</div></p>

<p v-pre>由 Docker 管理，适合 MySQL、Redis 等服务的数据持久化。</p>

<p v-pre><span><strong>Bind Mount</strong></span></p>

<p v-pre><div>适合特定场景</div></p>

<p v-pre>将宿主机指定目录映射进容器，方便访问配置、日志和文件。</p>

<p v-pre>最重要的是：</p>

<p v-pre><span><strong>容器生命周期不应该决定数据库数据的生命周期。</strong></span></p>

<p v-pre>但也要记住：Volume 不是备份。服务器损坏、磁盘损坏或误操作仍可能造成数据丢失，因此还需要定期备份到独立存储位置。</p>

### 八、第五步：准备部署环境并启动服务

#### 1. 生成数据库密码

<p v-pre>在服务器上执行：</p>

<p v-pre><div>Bash</div></p>

```text
mkdir -p deploy/secrets

openssl rand -base64 32 \
  > deploy/secrets/db_password.txt

openssl rand -base64 32 \
  > deploy/secrets/mysql_root_password.txt

chmod 600 deploy/secrets/*.txt
```

<p v-pre>这些文件不要提交到 GitHub。</p>

<p v-pre>后端需要读取 Docker Secret 文件，例如：</p>

<p v-pre><div>Python</div></p>

```python
import os
from pathlib import Path

def read_secret(name: str) -> str:
    path = os.getenv(f"{name}_FILE")

    if path:
        return Path(path).read_text().strip()

    return os.getenv(name, "")

DB_PASSWORD = read_secret("DB_PASSWORD")
```

<p v-pre>Celery Beat 如果也需要访问数据库，必须配置相同的数据库连接和 Secret。</p>

#### 2. 启动 Docker Compose

<p v-pre>进入部署目录：</p>

<p v-pre><div>Bash</div></p>

```bash
cd deploy
```

<p v-pre>检查配置：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose config
```

<p v-pre>构建镜像：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose build
```

<p v-pre>启动服务：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose up -d
```

<p v-pre>查看服务状态：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose ps
```

<p v-pre>查看日志：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose logs -f api
```

<p v-pre>数据库迁移：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose run --rm api alembic upgrade head
```

<p v-pre>这里的迁移应该在数据库备份完成后执行。正式部署还需要防止多个发布流程同时执行迁移。</p>

#### 3. 验证服务

<p v-pre>建议后端增加健康检查接口：</p>

<p v-pre><div>Python</div></p>

```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health():
    return {
        "status": "ok"
    }
```

<p v-pre>然后测试：</p>

<p v-pre><div>Bash</div></p>

```bash
curl http://127.0.0.1:8000/health
```

<p v-pre>返回：</p>

<p v-pre><div>JSON</div></p>

```json
{
  "status": "ok"
}
```

<p v-pre>这只能证明 API 进程可以响应。生产环境建议再增加 <code>/ready</code>，检查 MySQL、Redis 等关键依赖是否可用。</p>

#### 4. 常用 Docker 运维命令

<table v-pre><tbody><tr><th><p>命令</p></th><th><p>用途</p></th></tr><tr><td><p><code>docker compose ps</code></p></td><td><p>查看服务状态</p></td></tr><tr><td><p><code>docker compose logs -f</code></p></td><td><p>实时查看日志</p></td></tr><tr><td><p><code>docker compose restart api</code></p></td><td><p>重启 API</p></td></tr><tr><td><p><code>docker compose pull</code></p></td><td><p>拉取新镜像</p></td></tr><tr><td><p><code>docker compose up -d</code></p></td><td><p>更新并启动服务</p></td></tr><tr><td><p><code>docker stats</code></p></td><td><p>查看资源占用</p></td></tr><tr><td><p><code>docker volume ls</code></p></td><td><p>查看数据卷</p></td></tr></tbody></table>

<p v-pre>注意：不要随意执行：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose down -v
```

<p v-pre><code>-v</code> 会删除 Compose 管理的命名卷，可能直接导致 MySQL 和 Redis 数据丢失。</p>

### 九、第八课实战问题1：服务器数据持久化

<p v-pre>现在进行第一道部署实战题。</p>

<p v-pre>假设你已经将售后分析系统部署到云服务器：</p>

<ul v-pre><li><div><div><p>Docker Compose 管理 MySQL。</p></div></div></li><li><div><div><p>MySQL 中保存 100 万条售后订单。</p></div></div></li><li><div><div><p>数据存储使用 Docker Volume。</p></div></div></li><li><div><div><p>现在需要更新后端 API 镜像。</p></div></div></li></ul>

<p v-pre>你准备执行以下命令：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose down
docker compose up -d --build
```

<p v-pre>你认为哪种判断正确？</p>

<p v-pre><div><label>A. 执行 down 后，MySQL 容器被删除，100 万条订单也会全部丢失。</label></div><div><label>B. 正常情况下，MySQL 容器会被删除，但命名 Volume 保留，重新启动后可以继续使用原来的数据。</label></div><div><label>C. Docker Volume 会随着容器一起删除，因此必须重新导入数据。</label></div><div><label>D. 更新 API 镜像必须删除 MySQL 容器和 Volume，再重新初始化数据库。</label></div></p>

<p v-pre><span><strong>请说明你的理由</strong></span></p>

```text
Docker 容器和持久化数据卷的生命周期
```

<p v-pre><span class="interaction"><span>提交答案，进入下一节</span></span></p>

#### 本节学习成果

<p v-pre>生产部署架构设计</p>

<p v-pre>项目目录规划</p>

<p v-pre>后端 Dockerfile</p>

<p v-pre>Docker Compose 服务编排</p>

<p v-pre>Docker Secrets 基础配置</p>

<p v-pre>Volume 数据持久化</p>

<p v-pre>Nginx 反向代理</p>

<p v-pre>HTTPS 与域名配置</p>

<p v-pre>生产环境部署验收</p>

<p v-pre><span><strong>这一课的核心原则：</strong></span></p>

<p v-pre>部署不是简单地把代码放到服务器上，而是要保证应用能够启动、数据不会丢失、服务能够恢复、出现问题能够定位。</p>

<p v-pre>下一节我们将把 React 前端、FastAPI 和域名连接起来，完成 Nginx 反向代理与 HTTPS 配置。</p>

### 原回复中的补充代码与配置

```text
aftersales-analytics/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── etl/
│   │   ├── quality/
│   │   └── tasks/
│   ├── requirements.txt
│   └── Dockerfile
│
├── deploy/
│   ├── nginx/
│   │   └── default.conf
│   ├── secrets/
│   │   ├── mysql_root_password.txt
│   │   └── db_password.txt
│   └── docker-compose.yml
│
├── .dockerignore
├── .gitignore
└── README.md
```

## 第 40 轮　Nginx 反向代理、HTTPS 与前端部署 {#turn-40}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第八课实战问题1，我选择：B。理由：Docker 容器和持久化数据卷的生命周期。请评价我的 Docker 数据持久化理解，并继续指导我完成 Nginx、HTTPS、前端部署和生产环境配置。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第八课 · 实战2：Nginx、HTTPS 与前端生产部署

<p v-pre><div>实战问题1：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：正常情况下，MySQL 容器删除后，命名 Volume 仍然保留，重新启动可以继续使用原来的数据。</strong></span></p>

<p v-pre>你的理由：</p>

<blockquote v-pre><p>Docker 容器和持久化数据卷的生命周期。</p></blockquote>

<p v-pre>完全正确。</p>

<p v-pre>而且你已经掌握了 Docker 部署中非常重要的一个原则：</p>

<p v-pre><span><strong>应用容器可以随时重建，业务数据必须独立于容器生命周期。</strong></span></p>

#### 一、进一步理解 Docker 数据持久化

<p v-pre>我们再看三个命令的区别。</p>

<table v-pre><tbody><tr><th><p>命令</p></th><th><p>容器</p></th><th><p>命名 Volume</p></th></tr><tr><td><p><code>docker compose stop</code></p></td><td><p>保留，只停止</p></td><td><p>保留</p></td></tr><tr><td><p><code>docker compose down</code></p></td><td><p>删除</p></td><td><p>保留</p></td></tr><tr><td><p><code>docker compose down -v</code></p></td><td><p>删除</p></td><td><p>删除 Compose 管理的命名卷</p></td></tr></tbody></table>

<p v-pre>因此，你的方案是正确的。</p>

<p v-pre>不过我建议生产环境更新应用时，尽量不要先执行 <code>down</code>。</p>

<p v-pre>直接执行：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose up -d --build api worker beat
```

<p v-pre>Docker 会按需要重建容器，减少不必要的停机时间。</p>

<p v-pre>正式更新前还应该：</p>

<ol v-pre><li><div><div><p>备份 MySQL。</p></div></div></li><li><div><div><p>确认数据库迁移兼容性。</p></div></div></li><li><div><div><p>构建并检查新镜像。</p></div></div></li><li><div><div><p>更新服务。</p></div></div></li><li><div><div><p>验证 API 和任务运行状态。</p></div></div></li><li><div><div><p>必要时回滚应用版本。</p></div></div></li></ol>

<p v-pre>注意：Docker Volume 只是持久化，不是备份。即使 Volume 还在，磁盘损坏、误删除和数据库损坏仍然可能导致数据丢失。</p>

### 二、理解 Nginx 在系统中的作用

<p v-pre>之前我们设计的系统有：</p>

<ul v-pre><li><div><div><p>React：前端。</p></div></div></li><li><div><div><p>FastAPI：后端。</p></div></div></li><li><div><div><p>MySQL：数据库。</p></div></div></li><li><div><div><p>Redis：任务队列。</p></div></div></li></ul>

<p v-pre>现在增加 Nginx。</p>

<p v-pre>为什么需要 Nginx？</p>

<p v-pre>假设用户访问：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>https://analytics.example.com</span></code></div></p>

<p v-pre>Nginx 负责判断请求应该交给谁。</p>

<table v-pre><tbody><tr><th><p>请求路径</p></th><th><p>处理服务</p></th></tr><tr><td><p><code>/</code></p></td><td><p>React 前端</p></td></tr><tr><td><p><code>/assets/*</code></p></td><td><p>React 静态资源</p></td></tr><tr><td><p><code>/api/*</code></p></td><td><p>FastAPI</p></td></tr><tr><td><p><code>/.well-known/acme-challenge/*</code></p></td><td><p>HTTPS 证书验证</p></td></tr></tbody></table>

#### Nginx 请求转发流程

<p v-pre><span><strong>用户浏览器</strong></span></p>

<p v-pre>analytics.example.com</p>

<p v-pre><span><strong>Nginx</strong></span></p>

<p v-pre>80 / 443 端口 · HTTPS 终止</p>

<p v-pre><span><strong>React</strong></span></p>

<p v-pre>页面和静态资源</p>

<p v-pre><span><strong>FastAPI</strong></span></p>

<p v-pre>REST API</p>

<p v-pre>这里有一个关键设计：</p>

<p v-pre><span><strong>用户只需要访问 Nginx，不应该直接访问 FastAPI、MySQL 和 Redis。</strong></span></p>

<p v-pre>例如：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>用户浏览器     |     | HTTPS :443     v   Nginx     |     | 内部网络     v  FastAPI :8000     |     v  MySQL :3306</span></code></div></p>

<p v-pre>这样可以减少公网暴露面，也方便统一管理 HTTPS、访问日志和请求转发。</p>

### 三、部署 React 前端

<p v-pre>现在开始真正部署前端。</p>

#### 1. 编写前端 Dockerfile

<p v-pre>我们使用 Docker 多阶段构建。</p>

<p v-pre>第一阶段：Node.js 编译 React。</p>

<p v-pre>第二阶段：Nginx 提供静态文件。</p>

<p v-pre><code>frontend/Dockerfile</code></p>

<p v-pre><div>dockerfile</div></p>

```dockerfile

# 第一阶段：构建 React
FROM node:22-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ ./

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build


# 第二阶段：Nginx 提供静态资源
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY deploy/nginx/default.conf \
     /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

```

<p v-pre>这里的构建上下文必须是项目根目录，因此 Compose 中的构建配置要这样写：</p>

<p v-pre><div>YAML</div></p>

```yaml
web:
  build:
    context: ..
    dockerfile: frontend/Dockerfile
    args:
      VITE_API_BASE_URL: /api
```

<p v-pre>这样 Dockerfile 才能同时访问 <code>frontend/</code> 和 <code>deploy/nginx/</code>。</p>

<p v-pre>注意：如果项目使用 pnpm 或其他包管理器，需要相应调整安装命令。Node 版本也应与项目实际开发环境保持一致。</p>

#### 2. 为什么使用 /api？

<p v-pre>React 中建议这样配置：</p>

<p v-pre><div>TypeScript</div></p>

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
});
```

<p v-pre>前端请求：</p>

<p v-pre><div>TypeScript</div></p>

```typescript
api.get("/v1/aftersales/overview");
```

<p v-pre>最终浏览器访问：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>https://analytics.example.com/api/v1/aftersales/overview</span></code></div></p>

<p v-pre>而不是：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>http://服务器IP:8000/api/v1/aftersales/overview</span></code></div></p>

<p v-pre>这样前后端同域，通常不需要额外配置跨域 CORS。</p>

### 四、配置 Nginx 反向代理

<p v-pre>我们先完成 HTTP 配置，再申请 HTTPS 证书。</p>

<p v-pre>这是为了避免一个常见问题：Nginx 启动时引用了尚不存在的证书，导致整个 Web 服务无法启动。</p>

#### 1. 第一次启动：HTTP 配置

<p v-pre><code>deploy/nginx/default.conf</code></p>

<p v-pre><div>nginx</div></p>

<p v-pre><div><code><span> <span><span>server</span> {</span> <span>    <span>listen</span> <span>80</span>;</span> <span>    <span>server_name</span> analytics.example.com;</span>  <span>    <span># Let's Encrypt 域名验证</span></span> <span>    <span>location</span> /.well-known/acme-challenge/ {</span> <span>        <span>root</span> /var/www/certbot;</span> <span>    }</span>  <span>    <span># FastAPI</span></span> <span>    <span>location</span> /api/ {</span> <span>        <span>proxy_pass</span> http://api:8000;</span>  <span>        <span>proxy_set_header</span> Host <span>$host</span>;</span> <span>        <span>proxy_set_header</span> X-Real-IP <span>$remote_addr</span>;</span> <span>        <span>proxy_set_header</span> X-Forwarded-For <span>$proxy_add_x_forwarded_for</span>;</span> <span>        <span>proxy_set_header</span> X-Forwarded-Proto <span>$scheme</span>;</span> <span>    }</span>  <span>    <span># React SPA</span></span> <span>    <span>location</span> / {</span> <span>        <span>root</span> /usr/share/nginx/html;</span> <span>        <span>index</span> index.html;</span> <span>        <span>try_files</span> <span>$uri</span> <span>$uri</span>/ /index.html;</span> <span>    }</span> <span>}</span> </span></code></div></p>

<p v-pre>这里有两个重要知识点。</p>

<p v-pre><span><strong>知识点1：proxy</strong><strong>_</strong><strong>pass</strong></span></p>

<p v-pre><div>nginx</div></p>

<p v-pre><div><code><span><span><span>proxy_pass</span> http://api:8000;</span></span></code></div></p>

<p v-pre>没有在端口后面添加 <code>/</code>，因此 <code>/api/</code> 后面的原始 URI 会保留。</p>

<p v-pre>例如：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>/api/v1/aftersales/overview</span></code></div></p>

<p v-pre>FastAPI 收到的仍然是：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>/api/v1/aftersales/overview</span></code></div></p>

<p v-pre>如果你的 FastAPI 路由本身没有 <code>/api</code> 前缀，则需要调整代理路径或统一 API 路由设计，不能两边都随意增加前缀。</p>

<p v-pre><span><strong>知识点2：try</strong><strong>_</strong><strong>files</strong></span></p>

<p v-pre><div>nginx</div></p>

<p v-pre><div><code><span><span><span>try_files</span> <span>$uri</span> <span>$uri</span>/ /index.html;</span></span></code></div></p>

<p v-pre>React 使用前端路由。</p>

<p v-pre>例如：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>/dashboard /aftersales/orders /quality/alerts</span></code></div></p>

<p v-pre>用户直接刷新这些页面时，Nginx 仍然返回 <code>index.html</code>，由 React Router 解析路由。</p>

<p v-pre>否则可能出现页面首次访问正常，刷新后返回 404 的问题。</p>

#### 2. 将 Nginx 加入 Docker Compose

<p v-pre>在之前的 <code>docker-compose.yml</code> 中增加：</p>

<p v-pre><div>YAML</div></p>

```yaml
web:
  build:
    context: ..
    dockerfile: frontend/Dockerfile
    args:
      VITE_API_BASE_URL: /api

  restart: unless-stopped

  ports:
    - "80:80"
    - "443:443"

  volumes:
    - certbot_web:/var/www/certbot
    - letsencrypt:/etc/letsencrypt

  depends_on:
    - api

  networks:
    - internal
```

<p v-pre>在顶层 volumes 增加：</p>

<p v-pre><div>YAML</div></p>

```yaml
volumes:
  mysql_data:
  redis_data:
  certbot_web:
  letsencrypt:
```

<p v-pre>现在只有 Nginx 对公网发布 80、443 端口，API、MySQL 和 Redis 不配置 <code>ports</code>。</p>

<p v-pre>对于生产环境，建议再把应用内部网络标记为 <code>internal: true</code>，同时给 Nginx 配置一个可对外访问的独立网络，并让 API 同时加入两个网络。这样能进一步限制数据库和任务服务的网络访问范围。</p>

### 五、配置 HTTPS 证书

<p v-pre>我们使用 Let's Encrypt + Certbot。</p>

<p v-pre><div><span class="visual-label">[Logo Let's Encrypt – Logos PNG]</span></div></p>

<p v-pre><span><span><span><strong>Let's Encrypt</strong></span></span></span></p>

<p v-pre>免费 HTTPS 证书颁发机构</p>

<p v-pre>通过域名验证证明服务器控制权</p>

#### 1. 申请证书前检查

<p v-pre>首先确保：</p>

<ul v-pre><li><div><div><p><code>analytics.example.com</code> 已经解析到服务器公网 IP。</p></div></div></li><li><div><div><p>云服务器安全组允许 TCP 80 和 443。</p></div></div></li><li><div><div><p>UFW 防火墙允许 80 和 443。</p></div></div></li><li><div><div><p>域名没有错误指向其他服务器。</p></div></div></li><li><div><div><p>Nginx HTTP 配置已经启动。</p></div></div></li></ul>

<p v-pre>检查 DNS：</p>

<p v-pre><div>Bash</div></p>

```bash
dig +short analytics.example.com
```

<p v-pre>检查服务器：</p>

<p v-pre><div>Bash</div></p>

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

<p v-pre>如果使用 Cloudflare 代理，初次验证时需要确认代理模式与 HTTP-01 验证链路兼容，确保验证请求能到达 Nginx。</p>

#### 2. 启动 HTTP 服务

<p v-pre><div>Bash</div></p>

```bash
docker compose up -d api web
```

<p v-pre>检查：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose ps
```

<p v-pre>浏览器访问：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>http://analytics.example.com</span></code></div></p>

<p v-pre>确认 React 页面能够打开。</p>

#### 3. 增加 Certbot 服务

<p v-pre>在 Compose 中添加：</p>

<p v-pre><div>YAML</div></p>

```yaml
certbot:
  image: certbot/certbot:latest
  volumes:
    - certbot_web:/var/www/certbot
    - letsencrypt:/etc/letsencrypt
```

<p v-pre>申请证书：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose run --rm certbot \
  certonly \
  --webroot \
  -w /var/www/certbot \
  -d analytics.example.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email
```

<p v-pre>这里的域名和邮箱必须替换成你实际使用的值。</p>

<p v-pre>证书申请成功后，证书文件会保存在共享的 <code>letsencrypt</code> Volume 中。</p>

#### 4. 配置最终 HTTPS

<p v-pre>将 Nginx 配置替换为：</p>

<p v-pre><div>nginx</div></p>

<p v-pre><div><code><span> <span><span>server</span> {</span> <span>    <span>listen</span> <span>80</span>;</span> <span>    <span>server_name</span> analytics.example.com;</span>  <span>    <span>location</span> /.well-known/acme-challenge/ {</span> <span>        <span>root</span> /var/www/certbot;</span> <span>    }</span>  <span>    <span>location</span> / {</span> <span>        <span>return</span> <span>301</span> https://<span>$host</span><span>$request_uri</span>;</span> <span>    }</span> <span>}</span>  <span><span>server</span> {</span> <span>    <span>listen</span> <span>443</span> ssl;</span> <span>    <span>server_name</span> analytics.example.com;</span>  <span>    <span>ssl_certificate</span></span> <span>        /etc/letsencrypt/live/analytics.example.com/fullchain.pem;</span>  <span>    <span>ssl_certificate_key</span></span> <span>        /etc/letsencrypt/live/analytics.example.com/privkey.pem;</span>  <span>    <span>ssl_protocols</span> TLSv1.<span>2</span> TLSv1.<span>3</span>;</span>  <span>    <span>ssl_session_cache</span> shared:SSL:<span>10m</span>;</span> <span>    <span>ssl_session_timeout</span> <span>10m</span>;</span>  <span>    <span>root</span> /usr/share/nginx/html;</span> <span>    <span>index</span> index.html;</span>  <span>    <span>location</span> /api/ {</span> <span>        <span>proxy_pass</span> http://api:8000;</span>  <span>        <span>proxy_set_header</span> Host <span>$host</span>;</span> <span>        <span>proxy_set_header</span> X-Real-IP <span>$remote_addr</span>;</span> <span>        <span>proxy_set_header</span> X-Forwarded-For <span>$proxy_add_x_forwarded_for</span>;</span> <span>        <span>proxy_set_header</span> X-Forwarded-Proto <span>$scheme</span>;</span> <span>    }</span>  <span>    <span>location</span> / {</span> <span>        <span>try_files</span> <span>$uri</span> <span>$uri</span>/ /index.html;</span> <span>    }</span> <span>}</span> </span></code></div></p>

<p v-pre>重新构建并启动：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose up -d --build web
```

<p v-pre>检查配置：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose exec web nginx -t
```

<p v-pre>如果配置正确：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose exec web nginx -s reload
```

<p v-pre>现在访问：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>https://analytics.example.com</span></code></div></p>

<p v-pre><div>HTTPS 部署目标</div></p>

#### 5. 证书自动续期

<p v-pre>Let's Encrypt 证书通常需要定期续期，不能只申请一次就不管了。</p>

<p v-pre>建议在宿主机设置定期任务：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose run --rm certbot \
  renew --webroot -w /var/www/certbot
```

<p v-pre>续期成功后，再执行：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose exec -T web nginx -s reload
```

<p v-pre>实际定时任务应检查续期命令执行结果，并且只在证书发生更新时 reload Nginx。可以使用宿主机 cron 或 systemd timer。</p>

### 六、生产环境安全配置

<p v-pre>部署完成不代表可以直接上线。</p>

<p v-pre>我们还需要检查以下几个方面。</p>

#### 1. 端口安全

<p v-pre>建议服务器公网只开放：</p>

<table v-pre><tbody><tr><th><p>端口</p></th><th><p>服务</p></th><th><p>是否开放</p></th></tr><tr><td><p>22</p></td><td><p>SSH</p></td><td><p></p><div>限制 IP 后开放</div></td></tr><tr><td><p>80</p></td><td><p>HTTP</p></td><td><p></p><div>开放</div></td></tr><tr><td><p>443</p></td><td><p>HTTPS</p></td><td><p></p><div>开放</div></td></tr><tr><td><p>3306</p></td><td><p>MySQL</p></td><td><p></p><div>禁止公网访问</div></td></tr><tr><td><p>6379</p></td><td><p>Redis</p></td><td><p></p><div>禁止公网访问</div></td></tr><tr><td><p>8000</p></td><td><p>FastAPI</p></td><td><p></p><div>禁止公网访问</div></td></tr></tbody></table>

<p v-pre>检查：</p>

<p v-pre><div>Bash</div></p>

```bash
sudo ufw status numbered
```

<p v-pre>同时检查云服务器安全组，不能只配置 UFW。</p>

#### 2. 生产环境配置分离

<p v-pre>建议区分：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>.env.development .env.production</span></code></div></p>

<p v-pre>生产环境至少需要：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>APP_ENV=production DEBUG=false  DB_HOST=mysql DB_PORT=3306 DB_NAME=aftersales  REDIS_URL=redis://redis:6379/0  JWT_SECRET_KEY_FILE=/run/secrets/jwt_secret</span></code></div></p>

<p v-pre>注意：</p>

<ul v-pre><li><div><div><p>JWT 密钥不能使用默认值。</p></div></div></li><li><div><div><p>数据库密码不能提交 GitHub。</p></div></div></li><li><div><div><p>Vite 的 <code>VITE_</code> 环境变量会进入浏览器代码，绝不能放数据库密码或 JWT 私钥。</p></div></div></li><li><div><div><p>FastAPI 生产环境关闭调试模式。</p></div></div></li><li><div><div><p>日志不要记录密码、Token 和敏感客户信息。</p></div></div></li></ul>

<p v-pre>另外，FastAPI 应正确处理 Nginx 转发的客户端 IP 和 HTTPS 协议信息，避免盲目信任来自任意来源的 <code>X-Forwarded-*</code> 请求头。</p>

#### 3. 数据库备份

<p v-pre>至少建立每日备份：</p>

<p v-pre><div>Bash</div></p>

```text
docker compose exec -T mysql \
  sh -c 'exec mysqldump -uroot \
  -p"$(cat /run/secrets/mysql_root_password)" \
  --single-transaction aftersales' \
  > backup_$(date +%Y%m%d).sql
```

<p v-pre>这只是基础示例。生产环境还需要：</p>

<ul v-pre><li><div><div><p>将备份上传到独立对象存储。</p></div></div></li><li><div><div><p>设置备份保留周期。</p></div></div></li><li><div><div><p>对备份进行加密。</p></div></div></li><li><div><div><p>定期执行恢复演练。</p></div></div></li><li><div><div><p>根据业务要求配置 Binlog 和时间点恢复。</p></div></div></li></ul>

<p v-pre><span><strong>有备份文件不代表能够恢复，只有成功完成恢复测试才算具备恢复能力。</strong></span></p>

### 七、完整部署验收

<p v-pre>现在我们已经完成了：</p>

<ul v-pre><li><div><div><p>React 前端镜像构建。</p></div></div></li><li><div><div><p>Nginx 反向代理。</p></div></div></li><li><div><div><p>FastAPI API 转发。</p></div></div></li><li><div><div><p>域名和 HTTPS。</p></div></div></li><li><div><div><p>Docker Volume 持久化。</p></div></div></li><li><div><div><p>Docker Secrets。</p></div></div></li><li><div><div><p>生产端口安全规划。</p></div></div></li></ul>

<p v-pre>最后用一份验收清单验证。</p>

<p v-pre><span><strong>生产部署验收清单</strong></span></p>

### 0/17

<p v-pre><span><strong>前端部署</strong></span></p>

<p v-pre><label><span><p>React 页面可以正常打开</p></span></label></p>

<p v-pre><label><span><p>React Router 刷新不会 404</p></span></label></p>

<p v-pre><label><span><p>静态资源加载正常</p></span></label></p>

<p v-pre><span><strong>API 服务</strong></span></p>

<p v-pre><label><span><p>Nginx 能正确转发 API</p></span></label></p>

<p v-pre><label><span><p>FastAPI 健康检查通过</p></span></label></p>

<p v-pre><label><span><p>API 身份认证与权限正常</p></span></label></p>

<p v-pre><span><strong>HTTPS</strong></span></p>

<p v-pre><label><span><p>HTTP 自动跳转 HTTPS</p></span></label></p>

<p v-pre><label><span><p>证书有效且域名匹配</p></span></label></p>

<p v-pre><label><span><p>证书自动续期机制已配置</p></span></label></p>

<p v-pre><span><strong>数据安全</strong></span></p>

<p v-pre><label><span><p>MySQL 使用持久化 Volume</p></span></label></p>

<p v-pre><label><span><p>Redis 使用持久化 Volume</p></span></label></p>

<p v-pre><label><span><p>数据库不暴露公网</p></span></label></p>

<p v-pre><label><span><p>数据库备份与恢复测试通过</p></span></label></p>

<p v-pre><span><strong>运行维护</strong></span></p>

<p v-pre><label><span><p>Celery Worker 正常运行</p></span></label></p>

<p v-pre><label><span><p>Celery Beat 正常调度</p></span></label></p>

<p v-pre><label><span><p>日志能够正常查看</p></span></label></p>

<p v-pre><label><span><p>服务异常可以恢复</p></span></label></p>

<p v-pre><span>实际完成测试后再勾选，不要将配置完成等同于验收通过。</span></p>

### 八、第八课实战问题2：HTTPS 与反向代理

<p v-pre>现在进入下一道实战题。</p>

<p v-pre>假设：</p>

<p v-pre>你的 React + FastAPI 系统已经部署到服务器。</p>

<p v-pre>用户访问：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>https://analytics.example.com</span></code></div></p>

<p v-pre>但是发现：</p>

<ul v-pre><li><div><div><p>React 页面可以正常打开。</p></div></div></li><li><div><div><p>API 请求失败。</p></div></div></li><li><div><div><p>浏览器报错：Mixed Content。</p></div></div></li><li><div><div><p>前端 API 地址配置为 <code>http://服务器IP:8000</code>。</p></div></div></li></ul>

<p v-pre>你认为应该如何处理？</p>

<p v-pre><div><label>A. 允许浏览器访问 HTTP API，忽略 Mixed Content 警告。</label></div></p>

<p v-pre><label><p>B. 将前端 API 地址改为同域 <code>/api</code>，由 Nginx 通过内部网络转发到 FastAPI。</p></label></p>

<p v-pre><div><label>C. 关闭 HTTPS，全部改成 HTTP。</label></div><div><label>D. 直接开放 FastAPI 的 8000 端口，让浏览器访问服务器 IP。</label></div></p>

<p v-pre><span><strong>请说明你的理由</strong></span></p>

```text
浏览器 HTTPS安全策略和 Nginx 反向代理
```

<p v-pre><span class="interaction"><span>提交答案，继续第八课</span></span></p>

#### 九、第八课学习进度

<p v-pre>生产部署架构设计</p>

<p v-pre>Dockerfile 与 Compose</p>

<p v-pre>数据持久化</p>

<p v-pre>Nginx 反向代理方案</p>

<p v-pre>HTTPS 证书配置方案</p>

<p v-pre>React 前端部署方案</p>

<p v-pre>生产环境安全配置</p>

<p v-pre>GitHub Actions CI/CD</p>

<p v-pre>自动部署与回滚</p>

<p v-pre>生产环境最终验收</p>

<p v-pre><span><strong>本课的核心认识：</strong></span></p>

<p v-pre>部署系统不是把服务启动起来就结束了。</p>

<p v-pre>一个真正可以交付的系统，需要：</p>

<ul v-pre><li><div><div><p>用户能够安全访问。</p></div></div></li><li><div><div><p>前后端能够正常通信。</p></div></div></li><li><div><div><p>数据能够持久保存。</p></div></div></li><li><div><div><p>服务异常能够恢复。</p></div></div></li><li><div><div><p>新版本能够自动发布。</p></div></div></li><li><div><div><p>发布失败能够回滚。</p></div></div></li></ul>

<p v-pre>下一阶段我们将学习 GitHub Actions，把你之前学过的 Docker、GitHub 和部署流程真正串联起来，完成售后数据分析系统 V1 的自动化发布。</p>

### 原回复中的补充代码与配置

```text
https://analytics.example.com
```

```text
用户浏览器
    |
    | HTTPS :443
    v
  Nginx
    |
    | 内部网络
    v
 FastAPI :8000
    |
    v
 MySQL :3306
```

```dockerfile

# 第一阶段：构建 React
FROM node:22-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ ./

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# 第二阶段：Nginx 提供静态资源
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY deploy/nginx/default.conf \
     /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```text
https://analytics.example.com/api/v1/aftersales/overview
```

```text
http://服务器IP:8000/api/v1/aftersales/overview
```

```nginx

server {
    listen 80;
    server_name analytics.example.com;

    # Let's Encrypt 域名验证
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # FastAPI
    location /api/ {
        proxy_pass http://api:8000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # React SPA
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

```nginx
proxy_pass http://api:8000;
```

```text
/api/v1/aftersales/overview
```

```text
/api/v1/aftersales/overview
```

```nginx
try_files $uri $uri/ /index.html;
```

```text
/dashboard
/aftersales/orders
/quality/alerts
```

```text
http://analytics.example.com
```

```nginx

server {
    listen 80;
    server_name analytics.example.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name analytics.example.com;

    ssl_certificate
        /etc/letsencrypt/live/analytics.example.com/fullchain.pem;

    ssl_certificate_key
        /etc/letsencrypt/live/analytics.example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    root /usr/share/nginx/html;
    index index.html;

    location /api/ {
        proxy_pass http://api:8000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```text
https://analytics.example.com
```

```text
.env.development
.env.production
```

```text
APP_ENV=production
DEBUG=false

DB_HOST=mysql
DB_PORT=3306
DB_NAME=aftersales

REDIS_URL=redis://redis:6379/0

JWT_SECRET_KEY_FILE=/run/secrets/jwt_secret
```

```text
https://analytics.example.com
```

## 第 41 轮　GitHub Actions CI/CD、自动部署与回滚 {#turn-41}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第八课实战问题2，我选择：B。理由：浏览器 HTTPS安全策略和 Nginx 反向代理。请评价我的 HTTPS 和反向代理设计，并继续带我完成 GitHub Actions CI/CD、自动部署和上线回滚。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第八课 · 实战3：GitHub Actions CI/CD、自动部署与上线回滚

<p v-pre><div>实战问题2：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：将前端 API 地址改为同域 </strong><code>/api</code><strong>，由 Nginx 通过内部网络转发到 FastAPI。</strong></span></p>

<p v-pre>你的理由：</p>

<blockquote v-pre><p>浏览器 HTTPS 安全策略和 Nginx 反向代理。</p></blockquote>

<p v-pre>判断正确，而且你已经理解了生产环境中前后端通信的一个重要原则。</p>

#### 一、评价你的 HTTPS 与反向代理设计

<p v-pre>你的方案解决了三个问题。</p>

##### 1. Mixed Content 混合内容问题

<p v-pre>浏览器访问：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>https://analytics.example.com</span></code></div></p>

<p v-pre>如果 React 请求：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>http://123.123.123.123:8000/api/orders</span></code></div></p>

<p v-pre>就会触发 Mixed Content 问题。</p>

<p v-pre>因为 HTTPS 页面不应该通过不安全的 HTTP 请求加载主动内容，例如 API 请求。</p>

<p v-pre>正确方案：</p>

<p v-pre><div>TypeScript</div></p>

```typescript
const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
});
```

<p v-pre>浏览器最终请求：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>https://analytics.example.com/api/orders</span></code></div></p>

##### 2. Nginx 统一入口

<p v-pre><span><strong>浏览器</strong></span></p>

<p v-pre>HTTPS analytics.example.com</p>

<p v-pre><span><strong>Nginx</strong></span></p>

<p v-pre>统一入口、HTTPS、反向代理</p>

<p v-pre><span><strong>React</strong></span></p>

<p v-pre>静态页面</p>

<p v-pre><span><strong>FastAPI</strong></span></p>

<p v-pre>内部 API</p>

<p v-pre>优点：</p>

<ul v-pre><li><div><div><p>前后端同域，减少 CORS 配置复杂度。</p></div></div></li><li><div><div><p>FastAPI 不需要直接暴露公网。</p></div></div></li><li><div><div><p>HTTPS 证书统一由 Nginx 管理。</p></div></div></li><li><div><div><p>可以统一配置访问日志、限流和请求大小限制。</p></div></div></li></ul>

##### 3. 再补充一个工程细节

<p v-pre>如果 Nginx 在 HTTPS 终止后向 FastAPI 转发请求，需要正确设置：</p>

<p v-pre><div>nginx</div></p>

<p v-pre><div><code><span><span><span>proxy_set_header</span> X-Forwarded-Proto <span>$scheme</span>;</span> <span><span>proxy_set_header</span> X-Forwarded-For <span>$proxy_add_x_forwarded_for</span>;</span> <span><span>proxy_set_header</span> Host <span>$host</span>;</span></span></code></div></p>

<p v-pre>FastAPI 也要正确配置可信代理来源。</p>

<p v-pre>不要无条件信任所有客户端传来的 <code>X-Forwarded-For</code>，否则可能出现客户端伪造 IP 的问题。</p>

### 二、理解 CI/CD：为什么需要自动化部署？

<p v-pre>现在进入一个新的工程阶段。</p>

<p v-pre>假设你修改了售后分析系统的代码：</p>

<ul v-pre><li><div><div><p>修复了一个 KPI 计算错误。</p></div></div></li><li><div><div><p>增加了一个团队筛选功能。</p></div></div></li><li><div><div><p>修改了一个 FastAPI 接口。</p></div></div></li></ul>

<p v-pre>传统部署方式：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>本地修改代码     ↓ Git 提交     ↓ SSH 登录服务器     ↓ 拉取最新代码     ↓ 手动构建 Docker     ↓ 重启服务     ↓ 检查是否正常</span></code></div></p>

<p v-pre>这套方式容易出现：</p>

<ul v-pre><li><div><div><p>忘记执行某个步骤。</p></div></div></li><li><div><div><p>生产服务器代码与本地不一致。</p></div></div></li><li><div><div><p>部署过程中出现人为错误。</p></div></div></li><li><div><div><p>新版本有问题，不知道如何回滚。</p></div></div></li></ul>

<p v-pre>我们要将它变成自动化流程。</p>

#### 1. 什么是 CI？

<p v-pre>CI = Continuous Integration，持续集成。</p>

<p v-pre>每次代码提交或者创建 Pull Request，自动执行：</p>

<ol v-pre><li><div><div><p>代码检查。</p></div></div></li><li><div><div><p>Python 单元测试。</p></div></div></li><li><div><div><p>React 构建测试。</p></div></div></li><li><div><div><p>API 自动化测试。</p></div></div></li><li><div><div><p>Docker 镜像构建检查。</p></div></div></li></ol>

#### 2. 什么是 CD？

<p v-pre>CD = Continuous Delivery / Continuous Deployment。</p>

<p v-pre>当代码通过检查并满足发布条件后：</p>

<ol v-pre><li><div><div><p>构建 Docker 镜像。</p></div></div></li><li><div><div><p>推送到镜像仓库。</p></div></div></li><li><div><div><p>连接生产服务器。</p></div></div></li><li><div><div><p>拉取指定版本镜像。</p></div></div></li><li><div><div><p>执行数据库迁移。</p></div></div></li><li><div><div><p>更新 Docker Compose 服务。</p></div></div></li><li><div><div><p>执行健康检查。</p></div></div></li><li><div><div><p>失败时触发回滚。</p></div></div></li></ol>

#### 售后分析系统 CI/CD 流程

<ol v-pre><li><div><div><p><span><strong>GitHub Push / Pull Request</strong></span></p><p>开发人员提交代码。</p></div></div></li><li><div><div><p><span><strong>CI 自动测试</strong></span></p><p>Python、React、API 测试。</p></div></div></li><li><div><div><p><span><strong>Docker 镜像构建</strong></span></p><p>前端和后端分别构建。</p></div></div></li><li><div><div><p><span><strong>推送镜像仓库</strong></span></p><p>上传到 GitHub Container Registry。</p></div></div></li><li><div><div><p><span><strong>生产环境部署</strong></span></p><p>SSH 连接服务器，执行部署脚本。</p></div></div></li><li><div><div><p><span><strong>上线健康检查</strong></span></p><p>验证前端、API、数据库连接。</p></div></div></li><li><div><div><p><span><strong>成功或回滚</strong></span></p><p>失败则恢复上一稳定版本。</p></div></div></li></ol>

### 三、选择 CI/CD 架构：GitHub Actions + GHCR + SSH

<p v-pre>对于我们的售后分析系统，我建议使用下面的方案。</p>

<p v-pre><div><span class="visual-label">[Phase 5: Setting up CI/CD with Github Actions | Cloud Connections]</span></div></p>

<p v-pre><span><span><span><strong>GitHub Actions</strong></span></span></span></p>

<p v-pre>自动测试、构建、部署工作流</p>

<p v-pre><div><span class="visual-label">[GitHub Actions: Publish Docker Images to GHCR]</span></div></p>

<p v-pre><span><span><span><strong>GitHub Container Registry</strong></span></span></span></p>

<p v-pre>Docker 镜像仓库，简称 GHCR</p>

<p v-pre>为什么不直接让服务器拉取 GitHub 源代码并构建？</p>

<p v-pre>因为我更推荐：</p>

<p v-pre><span><strong>GitHub Actions 构建镜像，服务器只负责拉取镜像和运行。</strong></span></p>

<p v-pre>这样有几个好处：</p>

<ul v-pre><li><div><div><p>生产服务器不需要安装 Node.js 和 Python 开发环境。</p></div></div></li><li><div><div><p>构建环境统一。</p></div></div></li><li><div><div><p>可以保留每次发布的镜像版本。</p></div></div></li><li><div><div><p>能够快速回滚到上一版本。</p></div></div></li><li><div><div><p>服务器不需要持有 GitHub 源代码仓库的写权限。</p></div></div></li></ul>

<p v-pre>架构如下：</p>

#### 推荐 CI/CD 架构

<p v-pre><span><strong>GitHub Repository</strong></span></p>

<p v-pre>源代码、测试、Dockerfile</p>

<p v-pre><span><strong>GitHub Actions</strong></span></p>

<p v-pre>自动测试、构建前端和后端镜像</p>

<p v-pre><span><strong>GHCR 镜像仓库</strong></span></p>

<p v-pre>api:版本号 · web:版本号</p>

<p v-pre><span><strong>SSH 连接生产服务器</strong></span></p>

<p v-pre>部署脚本、拉取镜像、数据库迁移</p>

<p v-pre><span><strong>Docker Compose</strong></span></p>

<p v-pre>更新 API、Worker、Beat、React</p>

<p v-pre><span><strong>健康检查</strong></span></p>

<p v-pre>通过则发布成功，失败则回滚</p>

<p v-pre>这也是 GitHub 官方文档中支持的容器构建、发布和部署模式。<span><span><span><div><span><span>GitHub Docs</span></span><span><span>+1</span></span></div></span></span></span></p>

### 四、第一步：建立 GitHub Actions 工作流

<p v-pre>在项目根目录新增：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>.github/ └── workflows/     └── deploy.yml</span></code></div></p>

<p v-pre>我们的发布规则：</p>

<table v-pre><tbody><tr><th><p>事件</p></th><th><p>执行内容</p></th></tr><tr><td><p>Pull Request</p></td><td><p>代码检查和自动化测试</p></td></tr><tr><td><p>Push 到 main</p></td><td><p>测试、构建、推送镜像、部署</p></td></tr><tr><td><p>手动触发</p></td><td><p>可以手动执行部署流程</p></td></tr></tbody></table>

#### 1. 先配置 CI：自动测试

<p v-pre>后端使用 Python + pytest。</p>

<p v-pre>前端使用 npm + TypeScript。</p>

<p v-pre>示例：</p>

<p v-pre><div>YAML</div></p>

```yaml

name: Aftersales CI/CD

on:
  pull_request:
    branches: [main]

  push:
    branches: [main]

  workflow_dispatch:

permissions:
  contents: read

jobs:
  backend-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Python
        uses: actions/setup-python@v6
        with:
          python-version: "3.12"

      - name: Install dependencies
        working-directory: backend
        run: |
          pip install -r requirements.txt
          pip install pytest

      - name: Run backend tests
        working-directory: backend
        run: |
          pytest -q

  frontend-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: "22"
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: frontend
        run: npm ci

      - name: Type check
        working-directory: frontend
        run: npx tsc --noEmit

      - name: Build frontend
        working-directory: frontend
        run: npm run build
```

<p v-pre>这里有一个关键原则：</p>

<p v-pre><span><strong>测试失败，不能进入生产部署阶段。</strong></span></p>

<p v-pre>另外，正式项目要确保 <code>pytest</code> 有真正的测试用例，不能因为没有测试文件而将测试结果误认为业务测试全部通过。</p>

#### 2. 为什么需要分开测试？

<p v-pre>例如：</p>

<p v-pre>后端测试：</p>

<p v-pre><div>Python</div></p>

```python
def test_aftersales_overview():
    result = calculate_overview(
        total=100,
        resolved=80
    )

    assert result["resolution_rate"] == 0.8
```

<p v-pre>前端测试：</p>

<p v-pre><div>TypeScript</div></p>

```typescript
import { expect, test } from "vitest";

test("计算解决率", () => {
  const rate = 80 / 100;

  expect(rate).toBe(0.8);
});
```

<p v-pre>前后端测试独立运行，能够快速定位问题。</p>

<p v-pre>生产级测试还应该覆盖数据库集成测试、权限测试、数据质量规则测试以及关键页面的端到端测试。</p>

### 五、第二步：自动构建 Docker 镜像

<p v-pre>我们的项目有两个镜像：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>aftersales-api aftersales-web</span></code></div></p>

<p v-pre>镜像统一放到：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>ghcr.io/你的github用户名/aftersales-api ghcr.io/你的github用户名/aftersales-web</span></code></div></p>

#### 1. 为什么镜像需要版本号？

<p v-pre>不建议只使用：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>aftersales-api:latest</span></code></div></p>

<p v-pre>因为 <code>latest</code> 可能随时被覆盖，无法可靠地确定之前运行的是哪个版本。</p>

<p v-pre>推荐使用 Git Commit SHA：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>aftersales-api:8f3a91c aftersales-web:8f3a91c</span></code></div></p>

<p v-pre>这样每次代码提交都有对应镜像版本。</p>

<p v-pre>甚至可以记录镜像 digest，进一步确保部署的是确切的镜像内容，而不是后来被覆盖的标签。</p>

#### 2. 配置 GHCR 构建发布

<p v-pre>下面增加一个构建任务：</p>

<p v-pre><div>YAML</div></p>

```yaml

  build-and-push:
    needs:
      - backend-test
      - frontend-test

    if: github.event_name != 'pull_request'

    runs-on: ubuntu-latest

    permissions:
      contents: read
      packages: write

    env:
      REGISTRY: ghcr.io

    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Set lowercase owner
        run: |
          echo "OWNER=$(echo '${{ github.repository_owner }}' | tr '[:upper:]' '[:lower:]')" >> "$GITHUB_ENV"

      - name: Login to GHCR
        run: |
          echo "${{ secrets.GITHUB_TOKEN }}" |
          docker login ghcr.io \
            -u "${{ github.actor }}" \
            --password-stdin

      - name: Build API image
        run: |
          docker build \
            -f backend/Dockerfile \
            -t ghcr.io/$OWNER/aftersales-api:${GITHUB_SHA} \
            .

      - name: Build Web image
        run: |
          docker build \
            -f frontend/Dockerfile \
            --build-arg VITE_API_BASE_URL=/api \
            -t ghcr.io/$OWNER/aftersales-web:${GITHUB_SHA} \
            .

      - name: Push images
        run: |
          docker push ghcr.io/$OWNER/aftersales-api:${GITHUB_SHA}
          docker push ghcr.io/$OWNER/aftersales-web:${GITHUB_SHA}
```

<p v-pre>这里使用 <code>GITHUB_TOKEN</code>，不需要额外创建一个具有写权限的个人访问令牌。需要给工作流授予 <code>packages: write</code> 权限。<span><span><span><div><span><span>GitHub Docs</span></span><span><span>+1</span></span></div></span></span></span></p>

<p v-pre>注意：这里使用版本标签是为了方便教学，正式项目应把第三方 Actions 固定到经过审核的完整 commit SHA，并定期更新版本。GitHub 官方也建议这样做。<span><span><span><div><span><span>GitHub Docs</span></span><span><span>+1</span></span></div></span></span></span></p>

### 六、第三步：修改 Docker Compose，支持版本化部署

<p v-pre>之前我们的 Compose 文件是在服务器上构建镜像：</p>

<p v-pre><div>YAML</div></p>

```yaml
build:
  context: ../backend
```

<p v-pre>现在改为从 GHCR 拉取已经构建好的镜像。</p>

<p v-pre>建议新增：</p>

<p v-pre><code>deploy/compose.production.yaml</code></p>

<p v-pre><div>YAML</div></p>

```yaml
services:
  api:
    image: ghcr.io/你的用户名/aftersales-api:${IMAGE_TAG}
    build: !reset null

  worker:
    image: ghcr.io/你的用户名/aftersales-api:${IMAGE_TAG}
    build: !reset null

  beat:
    image: ghcr.io/你的用户名/aftersales-api:${IMAGE_TAG}
    build: !reset null

  web:
    image: ghcr.io/你的用户名/aftersales-web:${IMAGE_TAG}
    build: !reset null
```

<p v-pre>这里的 <code>!reset</code> 是 Compose 的特殊覆盖标签，不适用于所有 Compose 版本或配置场景。为了减少部署复杂度，我更推荐直接维护一个独立的生产 Compose 文件，不依赖 <code>!reset</code>。</p>

<p v-pre>例如：</p>

<p v-pre><div>YAML</div></p>

```yaml
services:
  api:
    image: ghcr.io/你的用户名/aftersales-api:${IMAGE_TAG}
    restart: unless-stopped
    env_file:
      - .env.production
    secrets:
      - db_password
    networks:
      - internal

  worker:
    image: ghcr.io/你的用户名/aftersales-api:${IMAGE_TAG}
    command: celery -A app.celery_app worker --loglevel=INFO
    restart: unless-stopped
    env_file:
      - .env.production
    secrets:
      - db_password
    networks:
      - internal

  beat:
    image: ghcr.io/你的用户名/aftersales-api:${IMAGE_TAG}
    command: celery -A app.celery_app beat --loglevel=INFO
    restart: unless-stopped
    env_file:
      - .env.production
    networks:
      - internal

  web:
    image: ghcr.io/你的用户名/aftersales-web:${IMAGE_TAG}
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - certbot_web:/var/www/certbot
      - letsencrypt:/etc/letsencrypt
    networks:
      - internal
```

<p v-pre>这里是核心思路，MySQL、Redis、Secret、Volume、网络等配置应从之前的生产 Compose 文件完整保留，不能因为切换镜像部署而遗漏。</p>

<p v-pre>另外，<code>IMAGE_TAG</code> 应通过独立的 <code>.release.env</code> 提供：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>IMAGE_TAG=8f3a91c</span></code></div></p>

<p v-pre>这样服务器就能明确知道当前运行的镜像版本。</p>

### 七、第四步：实现服务器自动部署脚本

<p v-pre>现在来到真正重要的环节。</p>

<p v-pre>GitHub Actions 不应该直接执行大量 Docker 命令。</p>

<p v-pre>更好的设计是：</p>

<p v-pre><span><strong>GitHub Actions 负责触发，服务器 deploy.sh 负责部署。</strong></span></p>

<p v-pre>这样以后即使不用 GitHub Actions，也可以手动执行同一个部署脚本。</p>

#### 1. 服务器目录

<p v-pre>建议：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>/opt/aftersales/ ├── compose.production.yaml ├── .env.production ├── .release.env ├── deploy.sh ├── rollback.sh └── backup/</span></code></div></p>

<p v-pre><code>.release.env</code>：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>IMAGE_TAG=8f3a91c</span></code></div></p>

<p v-pre>注意 <code>.env.production</code> 和 <code>.release.env</code> 都不能提交到 Git 仓库。</p>

#### 2. 编写 deploy.sh

<p v-pre><div>Bash</div></p>

```bash

#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="/opt/aftersales"
COMPOSE="docker compose -f compose.production.yaml"

NEW_TAG="${1:?请提供新版本 SHA}"

cd "$APP_DIR"

CURRENT_TAG=$(sed -n 's/^IMAGE_TAG=//p' .release.env)

echo "当前版本: $CURRENT_TAG"
echo "准备发布: $NEW_TAG"

# 记录上一版本
printf '%s\n' "$CURRENT_TAG" > .previous_release

# 切换到新版本
printf 'IMAGE_TAG=%s\n' "$NEW_TAG" > .release.env.tmp
mv .release.env.tmp .release.env

# 拉取镜像
$COMPOSE pull

# 执行数据库迁移
$COMPOSE run --rm api alembic upgrade head

# 更新服务
$COMPOSE up -d

# 等待服务启动
sleep 10

# 检查 API 健康状态
if ! curl -fsS \
  https://analytics.example.com/api/health \
  >/dev/null; then

    echo "部署失败，开始回滚"

    ./rollback.sh

    exit 1
fi

echo "部署成功: $NEW_TAG"
```

<p v-pre>这里有几个需要理解的地方：</p>

<ul v-pre><li><div><div><p><code>CURRENT_TAG</code>：保存当前运行版本。</p></div></div></li><li><div><div><p><code>NEW_TAG</code>：本次需要部署的版本。</p></div></div></li><li><div><div><p><code>docker compose pull</code>：拉取指定版本镜像。</p></div></div></li><li><div><div><p><code>alembic upgrade head</code>：执行数据库迁移。</p></div></div></li><li><div><div><p><code>docker compose up -d</code>：更新服务。</p></div></div></li><li><div><div><p><code>curl</code>：验证服务是否正常。</p></div></div></li></ul>

<p v-pre>这是教学版部署脚本，生产环境还要补充文件锁，防止并发部署；对数据库迁移失败进行独立处理；验证前端、API 和关键业务接口；并且不能只依靠固定 <code>sleep 10</code> 判断服务就绪。</p>

<p v-pre><span><strong>一个特别重要的提醒：数据库迁移不能简单地跟着应用版本一起回滚。</strong></span></p>

<p v-pre>例如 V42 新增了字段，V41 可能仍然可以运行；但如果 V42 删除了 V41 依赖的字段，直接回滚应用就可能失败。</p>

<p v-pre>所以生产环境应采用 Expand/Contract 数据库迁移策略：</p>

<ol v-pre><li><div><div><p>先增加兼容字段。</p></div></div></li><li><div><div><p>新旧应用都能正常工作。</p></div></div></li><li><div><div><p>新版本完成切换。</p></div></div></li><li><div><div><p>确认稳定后再清理旧字段。</p></div></div></li></ol>

#### 3. 编写 rollback.sh

<p v-pre><div>Bash</div></p>

```bash

#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="/opt/aftersales"

cd "$APP_DIR"

PREVIOUS_TAG=$(cat .previous_release)

if [[ -z "$PREVIOUS_TAG" ]]; then
    echo "找不到上一版本"
    exit 1
fi

echo "回滚到版本: $PREVIOUS_TAG"

printf 'IMAGE_TAG=%s\n' "$PREVIOUS_TAG" > .release.env.tmp
mv .release.env.tmp .release.env

docker compose -f compose.production.yaml pull

docker compose -f compose.production.yaml up -d

echo "回滚完成"
```

<p v-pre>注意：这里的回滚是应用镜像回滚，不是数据库数据回滚。如果数据库迁移不兼容，必须先制定专门的数据库恢复方案。</p>

#### 4. 一个实际发布例子

<p v-pre>假设：</p>

#### 版本发布记录

<p v-pre><span><strong>当前生产版本</strong></span></p>

<p v-pre><div>V41 · 稳定</div></p>

<p v-pre>Commit: 8f3a91c</p>

<p v-pre><span><strong>新版本</strong></span></p>

<p v-pre><div>V42 · 发布中</div></p>

<p v-pre>Commit: 9a7b21d</p>

<p v-pre><span><strong>发布结果</strong></span></p>

<p v-pre>镜像拉取成功</p>

<p v-pre>数据库迁移成功</p>

<p v-pre>API 健康检查失败</p>

<p v-pre>恢复 V41 应用版本</p>

<p v-pre><div>最终运行版本：V41</div><span>教学模拟发布记录。</span></p>

<p v-pre>这就是自动化回滚的基本思想。</p>

### 八、第五步：让 GitHub Actions 自动连接服务器

<p v-pre>现在我们把 GitHub 和服务器连接起来。</p>

#### 1. 配置 GitHub Secrets

<p v-pre>进入：</p>

<p v-pre><code>GitHub Repository → Settings → Secrets and variables → Actions</code></p>

<p v-pre>添加以下 Secrets：</p>

<table v-pre><tbody><tr><th><p>Secret 名称</p></th><th><p>用途</p></th></tr><tr><td><p><code>DEPLOY_HOST</code></p></td><td><p>服务器公网 IP 或域名</p></td></tr><tr><td><p><code>DEPLOY_USER</code></p></td><td><p>SSH 部署用户</p></td></tr><tr><td><p><code>DEPLOY_SSH_KEY</code></p></td><td><p>专用 SSH 私钥</p></td></tr><tr><td><p><code>DEPLOY_KNOWN_HOSTS</code></p></td><td><p>已验证的 SSH 主机公钥</p></td></tr><tr><td><p><code>DEPLOY_PATH</code></p></td><td><p>服务器项目目录</p></td></tr></tbody></table>

<p v-pre>建议创建专用部署账号，而不是直接使用 root。</p>

<p v-pre>SSH 私钥只保存在 GitHub Secrets 中，服务器只保存对应公钥。</p>

<p v-pre><code>DEPLOY_KNOWN_HOSTS</code> 应提前通过可信渠道核实服务器 SSH 主机指纹，再保存对应的 known_hosts 内容，避免首次连接时盲目信任未知主机。</p>

#### 2. 配置 GHCR 拉取权限

<p v-pre>如果你的 GHCR 镜像是私有的，生产服务器也需要拥有拉取权限。</p>

<p v-pre>建议：</p>

<ul v-pre><li><div><div><p>创建专用的 GitHub 只读拉取凭证。</p></div></div></li><li><div><div><p>只授予 <code>read:packages</code>。</p></div></div></li><li><div><div><p>在服务器上执行一次 <code>docker login ghcr.io</code>。</p></div></div></li><li><div><div><p>凭证妥善保存，不要放进 Git 仓库。</p></div></div></li></ul>

<p v-pre>如果镜像设置为公开，则不需要服务器登录即可拉取。</p>

#### 3. 增加自动部署 Job

<p v-pre>将下面的 Job 接到前面的 <code>deploy.yml</code> 中：</p>

<p v-pre><div>YAML</div></p>

```yaml

  deploy-production:
    needs: build-and-push

    if: github.ref == 'refs/heads/main'

    runs-on: ubuntu-latest

    environment:
      name: production
      url: https://analytics.example.com

    concurrency:
      group: production-deployment
      cancel-in-progress: false

    steps:
      - name: Setup SSH
        env:
          SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
          KNOWN_HOSTS: ${{ secrets.DEPLOY_KNOWN_HOSTS }}
        run: |
          mkdir -p ~/.ssh
          chmod 700 ~/.ssh

          printf '%s\n' "$SSH_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key

          printf '%s\n' "$KNOWN_HOSTS" \
            > ~/.ssh/known_hosts

      - name: Deploy
        env:
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
          DEPLOY_PATH: ${{ secrets.DEPLOY_PATH }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          ssh \
            -i ~/.ssh/deploy_key \
            "$DEPLOY_USER@$DEPLOY_HOST" \
            "cd '$DEPLOY_PATH' && ./deploy.sh '$IMAGE_TAG'"

      - name: Verify deployment
        run: |
          curl --fail --retry 5 \
            --retry-delay 5 \
            https://analytics.example.com/api/health
```

<p v-pre>这里增加了两个重要机制：</p>

<p v-pre><span><strong>第一，生产环境审批。</strong></span></p>

<p v-pre>可以在 GitHub 的 <code>production</code> Environment 中配置部署保护规则，控制哪些分支可以部署、是否需要人工批准，以及生产环境 Secrets 的访问条件。<span><span><span><div><span><span>GitHub Docs</span></span><span><span>+2</span></span></div></span></span></span></p>

<p v-pre><span><strong>第二，防止并发部署。</strong></span></p>

<p v-pre><div>YAML</div></p>

```yaml
concurrency:
  group: production-deployment
  cancel-in-progress: false
```

<p v-pre>避免两个版本同时修改生产环境。</p>

<p v-pre>注意：GitHub Environment 的审批能力会受到仓库可见性和订阅计划限制，配置前应检查当前仓库是否支持。<span><span><span><div><span><span>GitHub Docs</span></span><span><span>+1</span></span></div></span></span></span></p>

#### 4. 完整的发布路径

#### 自动部署执行过程

<ol v-pre><li><div><div><span>开发人员提交代码到 main。</span></div></div></li><li><div><div><span>GitHub Actions 执行 Python 和 React 测试。</span></div></div></li><li><div><div><span>构建 API 和 Web 镜像。</span></div></div></li><li><div><div><span>推送带有 Commit SHA 的镜像到 GHCR。</span></div></div></li><li><div><div><span>进入 Production 部署阶段。</span></div></div></li><li><div><div><span>SSH 登录服务器，执行 deploy.sh。</span></div></div></li><li><div><div><span>拉取新镜像、执行迁移、更新服务。</span></div></div></li><li><div><div><span>执行 API 和前端健康检查。</span></div></div></li><li><div><div><span>失败则恢复上一个稳定应用版本。</span></div></div></li></ol>

### 九、第六步：完善自动回滚机制

<p v-pre>前面我们已经有了 <code>deploy.sh</code> 和 <code>rollback.sh</code>。</p>

<p v-pre>但是生产环境还需要考虑一个情况：</p>

<p v-pre>如果镜像拉取失败、数据库迁移失败，或者新版本启动失败，脚本应该自动恢复旧版本。</p>

<p v-pre>我建议把部署脚本改成带错误处理的版本。</p>

#### 1. 改进 deploy.sh

<p v-pre>先修正一个重要细节：<code>.release.env</code> 不是 Docker Compose 默认读取的 <code>.env</code> 文件，因此所有 Compose 命令都必须显式传入 <code>--env-file .release.env</code>。</p>

<p v-pre><div>Bash</div></p>

```bash

#!/usr/bin/env bash

set -Eeuo pipefail

cd /opt/aftersales

COMPOSE="docker compose --env-file .release.env -f compose.production.yaml"

NEW_TAG="${1:?缺少新版本号}"
OLD_TAG=$(sed -n 's/^IMAGE_TAG=//p' .release.env)

# 保留旧版本
printf '%s\n' "$OLD_TAG" > .previous_release

rollback_on_error() {
    echo "部署失败，恢复旧版本..."

    trap - ERR

    printf 'IMAGE_TAG=%s\n' "$OLD_TAG" > .release.env.tmp
    mv .release.env.tmp .release.env

    docker compose \
      --env-file .release.env \
      -f compose.production.yaml \
      pull

    docker compose \
      --env-file .release.env \
      -f compose.production.yaml \
      up -d

    echo "旧版本恢复完成"
}

trap rollback_on_error ERR

# 设置新版本
printf 'IMAGE_TAG=%s\n' "$NEW_TAG" > .release.env.tmp
mv .release.env.tmp .release.env

# 拉取镜像
$COMPOSE pull

# 数据库迁移
$COMPOSE run --rm api alembic upgrade head

# 更新服务
$COMPOSE up -d

# 健康检查
for i in $(seq 1 12); do
    if curl -fsS \
      https://analytics.example.com/api/health \
      >/dev/null; then
        echo "部署成功: $NEW_TAG"
        trap - ERR
        exit 0
    fi

    sleep 5
done

echo "健康检查失败"
exit 1
```

<p v-pre>这个版本在部署步骤失败时会尝试恢复旧应用版本。</p>

<p v-pre>但还有两个生产级要求：</p>

<ul v-pre><li><div><div><p>回滚过程本身也可能失败，需要单独告警，不能只打印恢复完成。</p></div></div></li><li><div><div><p>数据库迁移可能已经产生结构或数据变化，不能假设恢复旧镜像就能恢复数据库。</p></div></div></li></ul>

<p v-pre>因此，正式上线前必须测试迁移兼容性和回滚过程。</p>

#### 2. 建立版本发布记录

<p v-pre>建议每次发布记录：</p>

<table v-pre><tbody><tr><th><p>字段</p></th><th><p>示例</p></th></tr><tr><td><p>发布编号</p></td><td><p>REL-0042</p></td></tr><tr><td><p>原版本</p></td><td><p>8f3a91c</p></td></tr><tr><td><p>新版本</p></td><td><p>9a7b21d</p></td></tr><tr><td><p>发布人</p></td><td><p>developer</p></td></tr><tr><td><p>发布开始时间</p></td><td><p>02:00</p></td></tr><tr><td><p>发布结果</p></td><td><p>SUCCESS</p></td></tr><tr><td><p>回滚版本</p></td><td><p>8f3a91c</p></td></tr></tbody></table>

<p v-pre>这样以后出现问题，可以快速追溯。</p>

#### 3. 正确理解三种回滚

<table v-pre><tbody><tr><th><p>回滚类型</p></th><th><p>解决的问题</p></th></tr><tr><td><p>应用回滚</p></td><td><p>新版本代码存在 Bug</p></td></tr><tr><td><p>配置回滚</p></td><td><p>环境变量、Nginx 配置错误</p></td></tr><tr><td><p>数据库恢复</p></td><td><p>数据结构或数据发生不可逆错误</p></td></tr></tbody></table>

<p v-pre>尤其要记住：</p>

<p v-pre><span><strong>应用回滚不等于数据库回滚。</strong></span></p>

<p v-pre>如果数据库发生不可逆的数据损坏，需要根据备份、Binlog 和恢复策略进行处理。</p>

### 十、第七步：建立真正的生产发布策略

<p v-pre>我建议你的售后分析系统采用三套环境：</p>

<table v-pre><tbody><tr><th><p>环境</p></th><th><p>用途</p></th><th><p>发布方式</p></th></tr><tr><td><p>Development</p></td><td><p>本地开发</p></td><td><p>手动或自动</p></td></tr><tr><td><p>Staging</p></td><td><p>测试环境</p></td><td><p>自动部署</p></td></tr><tr><td><p>Production</p></td><td><p>正式环境</p></td><td><p>测试通过 + 审批</p></td></tr></tbody></table>

<p v-pre>推荐发布过程：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>开发分支    ↓ Pull Request    ↓ 代码评审    ↓ 自动化测试    ↓ 合并 main    ↓ 构建 Docker 镜像    ↓ 部署 Staging    ↓ 验收测试    ↓ Production 审批    ↓ 正式发布    ↓ 健康检查    ↓ 成功 / 回滚</span></code></div></p>

<p v-pre>GitHub Actions 的 Environment 和部署保护规则可以帮助管理这些环境。<span><span><span><div><span><span>GitHub Docs</span></span><span><span>+1</span></span></div></span></span></span></p>

#### 第八课最终部署架构

#### 售后数据分析系统 V1 · 交付架构

<p v-pre><span><strong>GitHub</strong></span></p>

<p v-pre>代码管理、PR、版本控制</p>

<p v-pre><span><strong>GitHub Actions</strong></span></p>

<p v-pre>CI 测试、Docker 构建、自动发布</p>

<p v-pre><span><strong>GHCR</strong></span></p>

<p v-pre>版本化镜像仓库</p>

<p v-pre><span><strong>Linux 云服务器</strong></span></p>

<p v-pre>Docker Compose / Nginx / HTTPS</p>

<p v-pre><span><strong>React</strong></span></p>

<p v-pre>前端</p>

<p v-pre><span><strong>FastAPI</strong></span></p>

<p v-pre>后端</p>

<p v-pre><span><strong>MySQL</strong></span></p>

<p v-pre>数据存储</p>

<p v-pre><span><strong>Celery</strong></span></p>

<p v-pre>后台任务</p>

<p v-pre><span><strong>监控、日志、备份、自动回滚</strong></span></p>

### 十一、第八课实战问题3：如何设计生产环境回滚？

<p v-pre>现在进行一道综合实战题。</p>

<p v-pre>假设你通过 GitHub Actions 成功发布了 V42。</p>

<p v-pre>但发布后发现：</p>

<ul v-pre><li><div><div><p>React 页面正常。</p></div></div></li><li><div><div><p>FastAPI 可以启动。</p></div></div></li><li><div><div><p>售后总量 KPI 正常。</p></div></div></li><li><div><div><p>平均解决时长计算出现错误。</p></div></div></li><li><div><div><p>数据库已经执行了 V42 的 Alembic 迁移。</p></div></div></li><li><div><div><p>V41 版本此前运行正常。</p></div></div></li></ul>

<p v-pre>你认为最合理的处理方式是什么？</p>

<p v-pre><div><label>A. 直接删除 MySQL 数据库，重新部署 V41。</label></div><div><label>B. 先判断 V42 的数据库迁移是否与 V41 兼容；如果兼容，回滚应用镜像并保留数据库。之后修复指标计算逻辑、测试并重新发布。</label></div><div><label>C. 只要新版本出现问题，就必须把 MySQL 一起恢复到发布前的备份。</label></div><div><label>D. 直接修改生产数据库中的平均解决时长数值，不需要回滚代码。</label></div></p>

<p v-pre><span><strong>请说明你的理由</strong></span></p>

```text
应用版本与数据库版本需要
```

<p v-pre><span class="interaction"><span>提交答案，继续第八课</span></span></p>

#### 十二、第八课最终验收计划

<table v-pre><tbody><tr><th><p>验收模块</p></th><th><p>验收内容</p></th></tr><tr><td><p>Docker</p></td><td><p>容器构建、启动、持久化</p></td></tr><tr><td><p>Nginx</p></td><td><p>前后端反向代理</p></td></tr><tr><td><p>HTTPS</p></td><td><p>域名、证书、续期</p></td></tr><tr><td><p>CI</p></td><td><p>自动测试</p></td></tr><tr><td><p>CD</p></td><td><p>自动构建、推送和部署</p></td></tr><tr><td><p>回滚</p></td><td><p>应用版本恢复</p></td></tr><tr><td><p>数据安全</p></td><td><p>备份与恢复演练</p></td></tr><tr><td><p>运行监控</p></td><td><p>日志、告警、健康检查</p></td></tr></tbody></table>

<p v-pre>官方参考资料：</p>

<ul v-pre><li><div><div><p><span><a href="https://docs.github.com/en/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions?utm_source=chatgpt.com"><span>GitHub Actions 发布 Docker 镜像</span></a></span></p></div></div></li><li><div><div><p><span><a href="https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments?utm_source=chatgpt.com"><span>GitHub Actions 部署环境</span></a></span></p></div></div></li><li><div><div><p><span><a href="https://docs.docker.com/compose/how-tos/production/?utm_source=chatgpt.com"><span>Docker Compose 生产部署</span></a></span></p></div></div></li><li><div><div><p><span><a href="https://docs.github.com/en/actions/reference/security/secure-use?learn=getting_started&amp;learnProduct=Actions&amp;utm_source=chatgpt.com"><span>GitHub Actions 安全最佳实践</span></a></span></p></div></div></li></ul>

<p v-pre><span><strong>这一节最重要的收获：</strong></span></p>

<p v-pre>你正在从「能够开发一个数据分析系统」迈向「能够交付和维护一个生产系统」。</p>

<p v-pre>接下来我们要验证的不是代码写得多漂亮，而是当系统出错时，你是否能够安全地恢复业务。</p>

### 原回复中的补充代码与配置

```text
https://analytics.example.com
```

```text
http://123.123.123.123:8000/api/orders
```

```text
https://analytics.example.com/api/orders
```

```nginx
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header Host $host;
```

```text
本地修改代码
    ↓
Git 提交
    ↓
SSH 登录服务器
    ↓
拉取最新代码
    ↓
手动构建 Docker
    ↓
重启服务
    ↓
检查是否正常
```

```text
.github/
└── workflows/
    └── deploy.yml
```

```text
aftersales-api
aftersales-web
```

```text
ghcr.io/你的github用户名/aftersales-api
ghcr.io/你的github用户名/aftersales-web
```

```text
aftersales-api:latest
```

```text
aftersales-api:8f3a91c
aftersales-web:8f3a91c
```

```text
IMAGE_TAG=8f3a91c
```

```text
/opt/aftersales/
├── compose.production.yaml
├── .env.production
├── .release.env
├── deploy.sh
├── rollback.sh
└── backup/
```

```text
IMAGE_TAG=8f3a91c
```

```text
开发分支
   ↓
Pull Request
   ↓
代码评审
   ↓
自动化测试
   ↓
合并 main
   ↓
构建 Docker 镜像
   ↓
部署 Staging
   ↓
验收测试
   ↓
Production 审批
   ↓
正式发布
   ↓
健康检查
   ↓
成功 / 回滚
```

## 第 42 轮　生产上线验收、监控与运维手册 {#turn-42}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第八课实战问题3，我选择：B。理由：应用版本与数据库版本需要。请评价我的生产环境回滚策略，并继续指导我完成最终上线验收和系统运维。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第八课 · 实战4：生产环境最终上线验收与系统运维

<p v-pre><div>实战问题3：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：先判断数据库迁移是否兼容 V41，如果兼容则回滚应用镜像，保留数据库，修复代码后重新发布。</strong></span></p>

<p v-pre>你的理由：</p>

<blockquote v-pre><p>应用版本与数据库版本需要。</p></blockquote>

<p v-pre>这个判断正确，而且已经触及生产系统发布管理中非常重要的原则：</p>

<p v-pre><span><strong>应用版本和数据库版本是两个独立但相互依赖的生命周期，不能把应用回滚等同于数据库回滚。</strong></span></p>

#### 一、评价你的生产环境回滚策略

<p v-pre>我们复盘一下场景：</p>

<table v-pre><tbody><tr><th><p>项目</p></th><th><p>V41</p></th><th><p>V42</p></th></tr><tr><td><p>React</p></td><td><p>正常</p></td><td><p>正常</p></td></tr><tr><td><p>FastAPI</p></td><td><p>正常</p></td><td><p>正常</p></td></tr><tr><td><p>售后总量 KPI</p></td><td><p>正常</p></td><td><p>正常</p></td></tr><tr><td><p>平均解决时长</p></td><td><p>正常</p></td><td><p>计算错误</p></td></tr><tr><td><p>数据库迁移</p></td><td><p>旧结构</p></td><td><p>已升级</p></td></tr></tbody></table>

<p v-pre>你的处理方式是合理的：</p>

<ol v-pre><li><div><div><p>暂停继续发布。</p></div></div></li><li><div><div><p>定位平均解决时长的计算错误。</p></div></div></li><li><div><div><p>检查 V42 数据库迁移是否向后兼容。</p></div></div></li><li><div><div><p>如果兼容，恢复 V41 应用镜像。</p></div></div></li><li><div><div><p>保留数据库，不做不必要的恢复。</p></div></div></li><li><div><div><p>修复 V42 代码，在测试环境重新验证。</p></div></div></li><li><div><div><p>通过验收后重新发布。</p></div></div></li></ol>

##### 1. 为什么不能直接回滚数据库？

<p v-pre>假设 V42 新增了一个字段：</p>

<p v-pre><div>SQL</div></p>

```sql
ALTER TABLE dwd_aftersales_order
ADD COLUMN resolution_source VARCHAR(32)
DEFAULT NULL COMMENT '解决时长来源';
```

<p v-pre>这是一个新增字段。</p>

<p v-pre>如果 V41 不依赖这个字段，那么即使数据库已经升级，V41 通常仍然可以正常运行。</p>

<p v-pre>但是如果 V42 执行：</p>

<p v-pre><div>SQL</div></p>

```sql
ALTER TABLE dwd_aftersales_order
DROP COLUMN resolution_minutes;
```

<p v-pre>而 V41 仍然依赖这个字段，那么直接恢复 V41 应用就可能失败。</p>

<p v-pre>因此需要采用 Expand/Contract 策略：</p>

#### 数据库兼容迁移策略

<ol v-pre><li><div><div><p><span><strong>Expand：扩展数据库</strong></span></p><p>新增字段、索引或新表，尽量不破坏旧代码。</p></div></div></li><li><div><div><p><span><strong>兼容阶段</strong></span></p><p>新旧应用都能使用当前数据库结构。</p></div></div></li><li><div><div><p><span><strong>切换应用</strong></span></p><p>发布新版本，观察业务指标。</p></div></div></li><li><div><div><p><span><strong>验证稳定</strong></span></p><p>确认没有旧代码继续依赖旧结构。</p></div></div></li><li><div><div><p><span><strong>Contract：收缩数据库</strong></span></p><p>最后才删除废弃字段和旧结构。</p></div></div></li></ol>

##### 2. 再补充一个重要原则：代码回滚不等于数据回滚

<p v-pre>例如 V42 修改了平均解决时长的计算 SQL，但没有破坏数据库结构。</p>

<p v-pre>那么最合理的是回滚应用，不要恢复数据库备份。</p>

<p v-pre>但如果 V42 已经错误地覆盖了历史数据，就需要单独评估数据修复或恢复方案。</p>

<p v-pre>这也是为什么我们之前设计了：</p>

<ul v-pre><li><div><div><p>ETL 批次记录。</p></div></div></li><li><div><div><p>ADS 指标版本。</p></div></div></li><li><div><div><p>数据质量检查。</p></div></div></li><li><div><div><p>历史数据补偿。</p></div></div></li><li><div><div><p>数据库备份。</p></div></div></li></ul>

<p v-pre>这些能力不是孤立的，它们共同支撑生产系统的安全恢复。</p>

### 二、最终上线前：建立生产环境验收标准 {#production-acceptance}

<p v-pre>现在进入第八课最后一个阶段。</p>

<p v-pre>我们不再只检查 Docker 是否启动，而是从五个方面验收：</p>

<ol v-pre><li><div><div><p>功能正确性。</p></div></div></li><li><div><div><p>数据正确性。</p></div></div></li><li><div><div><p>安全性。</p></div></div></li><li><div><div><p>稳定性。</p></div></div></li><li><div><div><p>可恢复性。</p></div></div></li></ol>

#### 1. 功能验收

<table v-pre><tbody><tr><th><p>验收项目</p></th><th><p>通过条件</p></th></tr><tr><td><p>用户登录</p></td><td><p>登录、退出正常</p></td></tr><tr><td><p>RBAC</p></td><td><p>不同角色权限正确</p></td></tr><tr><td><p>数据权限</p></td><td><p>不允许跨团队访问</p></td></tr><tr><td><p>KPI</p></td><td><p>展示正确</p></td></tr><tr><td><p>日期筛选</p></td><td><p>查询范围正确</p></td></tr><tr><td><p>团队筛选</p></td><td><p>图表和明细同步</p></td></tr><tr><td><p>图表下钻</p></td><td><p>查询口径一致</p></td></tr><tr><td><p>异常页面</p></td><td><p>Loading、Error、Empty 正常</p></td></tr><tr><td><p>质量看板</p></td><td><p>告警和发布状态正确</p></td></tr></tbody></table>

#### 2. 数据验收

<p v-pre>这是售后分析系统最重要的验收环节。</p>

<p v-pre>我们选择 20 条真实或脱敏的售后订单，进行人工核对。</p>

<table v-pre><tbody><tr><th><p>验收项目</p></th><th><p>验收方式</p></th></tr><tr><td><p>售后申请量</p></td><td><p>与业务系统核对</p></td></tr><tr><td><p>解决数量</p></td><td><p>与售后明细核对</p></td></tr><tr><td><p>平均解决时长</p></td><td><p>明细独立复算</p></td></tr><tr><td><p>SLA 超时率</p></td><td><p>按 SLA 规则重新计算</p></td></tr><tr><td><p>团队工作量</p></td><td><p>根据历史团队归属复核</p></td></tr><tr><td><p>数据更新时间</p></td><td><p>与 ETL 批次记录核对</p></td></tr></tbody></table>

<p v-pre>例如平均解决时长：</p>

<p v-pre><div><span><span><span>平均解决时长=∑已解决订单的有效解决时长已解决订单数量平均解决时长 = \frac{\sum 已解决订单的有效解决时长} {已解决订单数量}</span></span></span></div></p>

<p v-pre>注意：分子和分母必须使用同一批符合条件的订单，不能把未解决订单纳入分母，也不能重复统计转交事件。</p>

<p v-pre><span><strong>上线前，所有核心指标必须能够从明细数据独立复算。</strong></span></p>

#### 3. 安全验收

<p v-pre>重点检查：</p>

<ul v-pre><li><div><div><p>HTTPS 是否生效。</p></div></div></li><li><div><div><p>JWT 密钥是否安全。</p></div></div></li><li><div><div><p>MySQL 是否暴露公网。</p></div></div></li><li><div><div><p>Redis 是否暴露公网。</p></div></div></li><li><div><div><p>FastAPI 是否只能通过可信网络访问。</p></div></div></li><li><div><div><p>Docker 是否避免使用 root 运行应用。</p></div></div></li><li><div><div><p>SSH 是否使用密钥认证。</p></div></div></li><li><div><div><p>GitHub Secrets 是否存在泄露。</p></div></div></li><li><div><div><p>生产日志是否隐藏敏感数据。</p></div></div></li></ul>

#### 4. 稳定性验收

<p v-pre>建议做以下测试：</p>

<table v-pre><tbody><tr><th><p>测试</p></th><th><p>预期结果</p></th></tr><tr><td><p>API 服务重启</p></td><td><p>自动恢复</p></td></tr><tr><td><p>Worker 重启</p></td><td><p>未完成任务能够恢复或重试</p></td></tr><tr><td><p>Redis 重启</p></td><td><p>队列恢复策略符合设计</p></td></tr><tr><td><p>MySQL 短暂不可用</p></td><td><p>API 返回受控错误</p></td></tr><tr><td><p>ETL 重复执行</p></td><td><p>不产生重复业务数据</p></td></tr><tr><td><p>定时任务重复触发</p></td><td><p>不重复计算或发布</p></td></tr><tr><td><p>大日期范围查询</p></td><td><p>响应时间在约定范围内</p></td></tr></tbody></table>

#### 5. 可恢复性验收

<p v-pre>这部分不能只检查配置。</p>

<p v-pre>必须真正进行演练：</p>

<ul v-pre><li><div><div><p>备份 MySQL。</p></div></div></li><li><div><div><p>在隔离环境恢复备份。</p></div></div></li><li><div><div><p>验证订单数据数量。</p></div></div></li><li><div><div><p>验证核心指标。</p></div></div></li><li><div><div><p>模拟 V42 发布失败。</p></div></div></li><li><div><div><p>恢复 V41 镜像。</p></div></div></li><li><div><div><p>确认数据库没有被破坏。</p></div></div></li></ul>

### 三、建立生产环境监控体系

<p v-pre>系统上线后，不能每天依靠 SSH 登录服务器检查是否正常。</p>

<p v-pre>我们要建立一套主动监控机制。</p>

<p v-pre>建议分成四个层次。</p>

#### 1. 服务器资源监控

<p v-pre>重点监控：</p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>监控内容</p></th></tr><tr><td><p>CPU</p></td><td><p>使用率、负载</p></td></tr><tr><td><p>内存</p></td><td><p>使用率、剩余内存</p></td></tr><tr><td><p>磁盘</p></td><td><p>使用率、剩余空间</p></td></tr><tr><td><p>网络</p></td><td><p>流量、异常连接</p></td></tr><tr><td><p>Docker</p></td><td><p>容器状态、重启次数</p></td></tr></tbody></table>

<p v-pre>常用命令：</p>

<p v-pre><div>Bash</div></p>

```bash
# CPU、内存、进程
htop

# 磁盘
df -h

# 内存
free -h

# Docker 资源占用
docker stats

# 容器状态
docker compose ps
```

<p v-pre>建议初期重点关注磁盘空间和内存，因为 MySQL、Redis、Celery 和应用容器都运行在同一台服务器时，资源竞争会比较明显。</p>

#### 2. 应用服务监控

<p v-pre>建议监控以下指标：</p>

<table v-pre><tbody><tr><th><p>服务</p></th><th><p>监控指标</p></th></tr><tr><td><p>Nginx</p></td><td><p>请求量、5xx 错误率</p></td></tr><tr><td><p>FastAPI</p></td><td><p>响应时间、错误率</p></td></tr><tr><td><p>MySQL</p></td><td><p>连接数、慢 SQL、锁等待</p></td></tr><tr><td><p>Redis</p></td><td><p>内存、连接数、队列状态</p></td></tr><tr><td><p>Celery</p></td><td><p>任务积压、失败数量</p></td></tr><tr><td><p>ETL</p></td><td><p>执行时间、成功率</p></td></tr><tr><td><p>数据质量</p></td><td><p>规则失败数量</p></td></tr></tbody></table>

<p v-pre>特别是 Celery：</p>

<p v-pre>如果每天应该处理 10,000 条售后订单，但队列积压了 50,000 条，就意味着数据分析看板可能已经严重滞后。</p>

#### 3. 建议的监控技术栈

<p v-pre><div><span class="visual-label">[Fichier:Prometheus software logo.svg - Wikisource]</span></div></p>

<p v-pre><span><span><span><strong>Prometheus</strong></span></span></span></p>

<p v-pre>指标采集和监控规则</p>

<p v-pre><div><span class="visual-label">[File:Grafana logo.svg - Wikimedia Commons]</span></div></p>

<p v-pre><span><span><span><strong>Grafana</strong></span></span></span></p>

<p v-pre>监控仪表盘和告警展示</p>

<p v-pre><div><span class="visual-label">[Log Like a Pro: Grafana Loki on Kubernetes | by Achanandhi M | Medium]</span></div></p>

<p v-pre><span><span><span><strong>Grafana Loki</strong></span></span></span></p>

<p v-pre>集中式日志管理</p>

<p v-pre>我建议你的 MVP 分阶段建设：</p>

<ul v-pre><li><div><div><p>第一阶段：Docker 日志、健康检查、基础资源监控。</p></div></div></li><li><div><div><p>第二阶段：Prometheus + Grafana。</p></div></div></li><li><div><div><p>第三阶段：Loki 集中日志和告警。</p></div></div></li><li><div><div><p>第四阶段：业务指标、ETL 和数据质量监控。</p></div></div></li></ul>

<p v-pre>不要一开始就部署大量监控组件，否则小项目的运维复杂度可能超过业务本身。</p>

#### 4. 建立告警规则

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>告警</p></th><th><p>触发条件示例</p></th></tr><tr><td><p>API 不可用</p></td><td><p>连续健康检查失败</p></td></tr><tr><td><p>磁盘空间不足</p></td><td><p>剩余空间低于 15%</p></td></tr><tr><td><p>内存不足</p></td><td><p>持续高于 90%</p></td></tr><tr><td><p>MySQL 不可用</p></td><td><p>数据库连接失败</p></td></tr><tr><td><p>ETL 失败</p></td><td><p>当日批次执行失败</p></td></tr><tr><td><p>数据延迟</p></td><td><p>超过约定的数据 SLA</p></td></tr><tr><td><p>任务积压</p></td><td><p>队列积压超过业务阈值</p></td></tr></tbody></table>

<p v-pre>阈值需要结合服务器规格、业务量和实际运行基线调整，不能把这些示例直接当成所有生产环境的标准。</p>

### 四、建立系统运维手册

<p v-pre>生产系统上线后，最怕的是：</p>

<p v-pre>出现问题时，不知道先检查什么、应该执行什么命令、如何恢复。</p>

<p v-pre>因此需要建立一份 Runbook（运维操作手册）。</p>

<p v-pre>建议至少包含以下六种场景。</p>

#### 场景1：API 无法访问

<p v-pre>排查顺序：</p>

<p v-pre><div>Bash</div></p>

```bash
docker compose ps

docker compose logs --tail=200 api

docker compose logs --tail=200 web

docker compose exec web nginx -t
```

<p v-pre>然后检查：</p>

<ol v-pre><li><div><div><p>Nginx 是否运行。</p></div></div></li><li><div><div><p>FastAPI 是否运行。</p></div></div></li><li><div><div><p>API 是否可以连接 MySQL。</p></div></div></li><li><div><div><p>域名解析是否正常。</p></div></div></li><li><div><div><p>HTTPS 证书是否有效。</p></div></div></li></ol>

#### 场景2：MySQL 无法连接

<p v-pre><div>Bash</div></p>

```bash
docker compose logs --tail=200 mysql

docker compose exec mysql \
  mysqladmin ping -h 127.0.0.1
```

<p v-pre>重点检查：</p>

<ul v-pre><li><div><div><p>数据库容器是否启动。</p></div></div></li><li><div><div><p>数据卷是否挂载正确。</p></div></div></li><li><div><div><p>密码是否发生变化。</p></div></div></li><li><div><div><p>数据库连接数是否耗尽。</p></div></div></li><li><div><div><p>磁盘是否已满。</p></div></div></li></ul>

<p v-pre>不要在没有确认数据安全前删除 MySQL Volume。</p>

#### 场景3：ETL 同步失败

<p v-pre>排查：</p>

<ol v-pre><li><div><div><p>查看 Celery Worker 日志。</p></div></div></li><li><div><div><p>查看失败任务的 batch_id。</p></div></div></li><li><div><div><p>检查源数据库连接。</p></div></div></li><li><div><div><p>检查增量游标。</p></div></div></li><li><div><div><p>检查事务和幂等性。</p></div></div></li><li><div><div><p>修复后执行补偿任务。</p></div></div></li><li><div><div><p>重新进行数据对账。</p></div></div></li></ol>

#### 场景4：数据看板显示错误

<p v-pre>排查：</p>

<ol v-pre><li><div><div><p>确认指标版本。</p></div></div></li><li><div><div><p>确认统计日期口径。</p></div></div></li><li><div><div><p>查看质量检查记录。</p></div></div></li><li><div><div><p>检查 ADS 汇总数据。</p></div></div></li><li><div><div><p>从 DWD 明细独立复算。</p></div></div></li><li><div><div><p>必要时恢复上一个可信指标版本。</p></div></div></li></ol>

#### 场景5：服务器磁盘不足

<p v-pre><div>Bash</div></p>

```bash
df -h

docker system df

docker system ps -a
```

<p v-pre>重点检查：</p>

<ul v-pre><li><div><div><p>Docker 镜像占用。</p></div></div></li><li><div><div><p>容器日志。</p></div></div></li><li><div><div><p>MySQL 数据文件。</p></div></div></li><li><div><div><p>备份文件。</p></div></div></li><li><div><div><p>Redis 持久化文件。</p></div></div></li></ul>

<p v-pre>不要使用 <code>docker system prune -a --volumes</code> 盲目清理生产环境。</p>

#### 场景6：新版本发布失败

<p v-pre>排查：</p>

<ol v-pre><li><div><div><p>查看 GitHub Actions 日志。</p></div></div></li><li><div><div><p>确认 GHCR 镜像是否存在。</p></div></div></li><li><div><div><p>检查服务器拉取权限。</p></div></div></li><li><div><div><p>查看数据库迁移结果。</p></div></div></li><li><div><div><p>检查容器启动日志。</p></div></div></li><li><div><div><p>根据数据库兼容性决定应用回滚或前向修复。</p></div></div></li><li><div><div><p>验证回滚后的服务和数据。</p></div></div></li></ol>

### 五、建立日常运维制度

<p v-pre>建议采用三个时间周期。</p>

<table v-pre><tbody><tr><th><p>周期</p></th><th><p>工作内容</p></th></tr><tr><td><p>每日</p></td><td><p>检查服务状态、ETL、数据质量、告警</p></td></tr><tr><td><p>每周</p></td><td><p>检查磁盘、数据库性能、失败任务、备份</p></td></tr><tr><td><p>每月</p></td><td><p>恢复演练、权限审计、版本升级、安全检查</p></td></tr></tbody></table>

<p v-pre>另外，建议明确几个关键运维指标：</p>

<ul v-pre><li><div><div><p>可用性（Availability）。</p></div></div></li><li><div><div><p>平均故障恢复时间（MTTR）。</p></div></div></li><li><div><div><p>平均故障间隔时间（MTBF）。</p></div></div></li><li><div><div><p>数据新鲜度（Data Freshness）。</p></div></div></li><li><div><div><p>备份恢复点目标（RPO）。</p></div></div></li><li><div><div><p>恢复时间目标（RTO）。</p></div></div></li></ul>

<p v-pre>例如：</p>

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>教学目标</p></th></tr><tr><td><p>系统可用性</p></td><td><p>99.5%</p></td></tr><tr><td><p>RPO</p></td><td><p>不超过 24 小时</p></td></tr><tr><td><p>RTO</p></td><td><p>不超过 4 小时</p></td></tr><tr><td><p>每日数据同步</p></td><td><p>按业务约定时间完成</p></td></tr><tr><td><p>核心指标准确性</p></td><td><p>独立复算一致</p></td></tr></tbody></table>

<p v-pre>这些是建议的初始目标，不是系统目前已经达到的实际指标。正式设定时需要考虑业务容忍度、备份频率、服务器资源和恢复成本。</p>

### 六、第八课最终项目验收

<p v-pre>现在我们把前八课的成果合并，形成正式的项目交付验收清单。</p>

<p v-pre>下面这份清单可以作为真实项目的上线验收依据。</p>

#### 售后数据分析系统 V1 上线验收

<p v-pre>验收完成情况</p>

### 0/24

<p v-pre><span><strong>一、业务功能</strong></span></p>

<p v-pre><label><span><p>用户登录与 RBAC 权限正常</p></span></label></p>

<p v-pre><label><span><p>售后 KPI 计算正确</p></span></label></p>

<p v-pre><label><span><p>日期和团队筛选正常</p></span></label></p>

<p v-pre><label><span><p>图表下钻与明细一致</p></span></label></p>

<p v-pre><label><span><p>数据质量看板正常</p></span></label></p>

<p v-pre><span><strong>二、数据工程</strong></span></p>

<p v-pre><label><span><p>ETL 增量同步正常</p></span></label></p>

<p v-pre><label><span><p>失败重试和补偿正常</p></span></label></p>

<p v-pre><label><span><p>核心指标可以独立复算</p></span></label></p>

<p v-pre><label><span><p>数据质量检查正常</p></span></label></p>

<p v-pre><label><span><p>指标版本发布和回滚正常</p></span></label></p>

<p v-pre><span><strong>三、后端与前端</strong></span></p>

<p v-pre><label><span><p>FastAPI 接口测试通过</p></span></label></p>

<p v-pre><label><span><p>数据权限测试通过</p></span></label></p>

<p v-pre><label><span><p>React 自动化测试通过</p></span></label></p>

<p v-pre><label><span><p>前后端联调通过</p></span></label></p>

<p v-pre><span><strong>四、生产部署</strong></span></p>

<p v-pre><label><span><p>Docker Compose 部署成功</p></span></label></p>

<p v-pre><label><span><p>Nginx 反向代理正常</p></span></label></p>

<p v-pre><label><span><p>HTTPS 证书有效</p></span></label></p>

<p v-pre><label><span><p>MySQL 和 Redis 持久化正常</p></span></label></p>

<p v-pre><label><span><p>GitHub Actions CI/CD 正常</p></span></label></p>

<p v-pre><span><strong>五、生产运维</strong></span></p>

<p v-pre><label><span><p>日志和健康检查正常</p></span></label></p>

<p v-pre><label><span><p>ETL 与数据质量告警正常</p></span></label></p>

<p v-pre><label><span><p>数据库备份成功</p></span></label></p>

<p v-pre><label><span><p>数据库恢复演练通过</p></span></label></p>

<p v-pre><label><span><p>应用回滚演练通过</p></span></label></p>

<p v-pre>完成 0%</p>

<p v-pre>剩余 24 项</p>

<p v-pre><span>这是待执行验收清单。只有真实完成测试的项目才应勾选。</span></p>

#### 七、最终交付物

<p v-pre>完整项目最终应该有以下成果：</p>

<table v-pre><tbody><tr><th><p>交付物</p></th><th><p>文件或内容</p></th></tr><tr><td><p>业务需求</p></td><td><p>PRD.md</p></td></tr><tr><td><p>技术设计</p></td><td><p>architecture.md</p></td></tr><tr><td><p>数据库设计</p></td><td><p>database-design.sql</p></td></tr><tr><td><p>ETL 程序</p></td><td><p>backend/app/etl/</p></td></tr><tr><td><p>API 文档</p></td><td><p>FastAPI OpenAPI</p></td></tr><tr><td><p>前端看板</p></td><td><p>frontend/</p></td></tr><tr><td><p>数据质量规则</p></td><td><p>quality-rules.md</p></td></tr><tr><td><p>Docker 部署</p></td><td><p>compose.production.yaml</p></td></tr><tr><td><p>CI/CD</p></td><td><p>.github/workflows/deploy.yml</p></td></tr><tr><td><p>运维手册</p></td><td><p>RUNBOOK.md</p></td></tr><tr><td><p>上线报告</p></td><td><p>release-report.md</p></td></tr></tbody></table>

<p v-pre>建议把这些文件统一放在 GitHub 项目仓库中，形成可追溯的工程交付记录。</p>

### 八、八课完整学习路线总结

#### 数据分析系统开发能力地图

<ol v-pre><li><div><div><p><span><strong>第一课：业务分析基础</strong></span></p><p>从业务问题理解数据分析系统的价值。</p></div></div></li><li><div><div><p><span><strong>第二课：需求分析与指标设计</strong></span></p><p>访谈、指标体系、统计口径、PRD。</p></div></div></li><li><div><div><p><span><strong>第三课：数据建模</strong></span></p><p>MySQL、事实表、维度表、ER 图。</p></div></div></li><li><div><div><p><span><strong>第四课：ETL 数据开发</strong></span></p><p>Python、SQLAlchemy、Celery、增量同步。</p></div></div></li><li><div><div><p><span><strong>第五课：数据 API</strong></span></p><p>FastAPI、JWT、RBAC、Service/Repository。</p></div></div></li><li><div><div><p><span><strong>第六课：数据可视化</strong></span></p><p>React、TypeScript、ECharts、图表下钻。</p></div></div></li><li><div><div><p><span><strong>第七课：数据质量治理</strong></span></p><p>数据验证、异常隔离、指标版本、质量告警。</p></div></div></li><li><div><div><p><span><strong>第八课：部署与运维</strong></span></p><p>Docker、Nginx、HTTPS、GitHub Actions、回滚和监控。</p></div></div></li></ol>

<p v-pre><div>八课学习路线完成</div></p>

#### 九、接下来建议：不要急着学习第九课

<p v-pre>我更建议进入一个新的阶段：</p>

<p v-pre><span><strong>售后数据分析系统 V1 真实工程实战。</strong></span></p>

<p v-pre>之前八课主要完成了知识学习、方案设计和代码示例。接下来要把这些成果变成真正可以运行的 GitHub 项目。</p>

<p v-pre>建议按这个顺序：</p>

<ol v-pre><li><div><div><p>建立 GitHub 项目仓库。</p></div></div></li><li><div><div><p>初始化 React + FastAPI + MySQL。</p></div></div></li><li><div><div><p>实现一条完整售后数据 ETL 链路。</p></div></div></li><li><div><div><p>完成第一个售后 KPI API。</p></div></div></li><li><div><div><p>完成第一个 React 数据看板。</p></div></div></li><li><div><div><p>接入数据质量检查。</p></div></div></li><li><div><div><p>Docker Compose 部署。</p></div></div></li><li><div><div><p>GitHub Actions 自动发布。</p></div></div></li><li><div><div><p>完成生产环境验收。</p></div></div></li></ol>

<p v-pre><span><strong>我希望你最终具备的能力是：拿到一个业务问题，能够独立完成需求调研、数据建模、数据开发、接口开发、前端展示、部署上线和持续运维。</strong></span></p>

<p v-pre>这才是完整的数据分析系统开发能力。</p>

<p v-pre>下一步，我们可以直接从售后分析系统 V1 的 GitHub 项目初始化开始，进入真实代码实战。</p>
