---
title: "第五课　上线部署与运维"
outline: 2
prev:
  text: "第四课　测试验证"
  link: /posts/software-development-workflow/04-testing
next:
  text: "第六课　软件运营与持续迭代"
  link: /posts/software-development-workflow/06-operations
---

# 第五课　上线部署与运维

[返回总目录](/posts/software-development-workflow)

## 对话 28　部署环境与 Docker Compose {#turn-28}

> **用户**
>
> 第五课上线部署第一道实战题，我选择 A。请评价，并继续教我使用 Docker 和 Docker Compose 容器化 React + FastAPI + MySQL 项目。

**ChatGPT**

回答正确

你选择 A：建立独立生产环境，使用独立生产数据库和正式配置，不把测试数据直接带入生产环境。

完全正确！

这是软件部署中非常重要的原则：**环境隔离（Environment Isolation）。**

#### 一、评价你的答案

为什么不能让开发、测试、生产环境共用数据库？

假设开发人员正在测试订单取消功能：

- 创建测试订单。
- 修改商品库存。
- 模拟取消订单。
- 测试事务回滚。

如果使用的是生产数据库，就可能直接影响真实用户的订单和库存。

正确的环境设计：

| **环境** | **前端** | **后端** | **数据库** |
| --- | --- | --- | --- |
| DEV | 本地 React | 本地 FastAPI | dev\_db |
| TEST | 测试前端 | 测试 FastAPI | test\_db |
| PROD | 正式前端 | 正式 FastAPI | prod\_db |

另外，生产数据不能简单地从开发数据库复制过去。正式上线前应该通过数据库迁移、初始化脚本和经过审核的数据导入完成准备。

### 第五课 · 5.2 Docker 与 Docker Compose 容器化实战

本节目标：完成四服务容器化

今天我们不只学习 Docker 命令，而是把之前的订单管理系统真正容器化。

最终实现：

- React 前端容器。
- FastAPI 后端容器。
- MySQL 数据库容器。
- Redis 缓存容器。
- Docker Compose 统一管理。

#### 二、第一步：理解 Docker 的工作原理

先看传统部署和 Docker 部署的区别。

**传统部署**

**Linux 服务器**

- 安装 Python
- 安装 Node.js
- 安装 MySQL
- 安装 Redis
- 配置各服务依赖

**Docker 部署**

**Linux 服务器**

React 容器

FastAPI 容器

MySQL 容器

Redis 容器

由 Docker Engine 管理，Compose 统一编排。

Docker 的核心概念：

| **概念** | **解释** |
| --- | --- |
| Dockerfile | 定义如何构建镜像 |
| Image | 应用及运行环境的模板 |
| Container | 镜像运行后的实例 |
| Volume | 持久化存储数据 |
| Network | 容器之间的网络 |
| Compose | 定义和管理多个服务 |

最重要的一点：

**容器是运行环境，镜像是运行模板，Volume 用于保存需要长期存在的数据。**

#### 三、第二步：规划订单系统项目结构

我们使用以下目录结构：

```text
order-system/
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/
│   ├── app/
│   ├── tests/
│   ├── pyproject.toml
│   ├── uv.lock
│   └── Dockerfile
│
├── docker-compose.yml
├── .env
├── .env.example
└── .dockerignore
```

为什么前后端分别有 Dockerfile？

因为它们的运行环境不同：

- React 需要 Node.js 构建静态资源。
- FastAPI 需要 Python 运行环境。
- MySQL 和 Redis 使用官方镜像。

这样每个服务都可以独立构建、升级和部署。

#### 四、第三步：编写 React 前端 Dockerfile

我们采用多阶段构建。

第一阶段使用 Node.js 编译 React，第二阶段使用 Nginx 提供静态文件。

#### 前端镜像构建过程

**Node.js 构建阶段**

安装依赖 → npm run build → 生成 dist

**Nginx 运行阶段**

复制 dist → 提供静态网页服务

创建 `frontend/Dockerfile`：

```dockerfile
# 第一阶段：构建 React
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# 第二阶段：运行 Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

为什么分成两个阶段？

因为生产环境只需要 React 构建后的静态文件，不需要携带 Node.js、npm 和完整源码。

这样可以减小最终镜像体积。

##### 配置 Nginx

创建 `frontend/nginx.conf`：

```nginx
server {
    listen 80;

    server_name _;

    root /usr/share/nginx/html;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

这里有一个关键点：

```nginx
proxy_pass http://backend:8000;
```

`backend` 是 Docker Compose 中后端服务的名称。

容器之间可以通过服务名称通信，不需要写服务器的固定 IP。

而：

```nginx
try_files $uri $uri/ /index.html;
```

用于支持 React Router 的前端路由。

例如用户直接访问 `/orders/10001`，Nginx 仍然返回 React 的 `index.html`，由 React Router 处理页面路由。

#### 五、第四步：编写 FastAPI 后端 Dockerfile

创建 `backend/Dockerfile`：

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# 安装 uv
RUN pip install --no-cache-dir uv

# 先复制依赖文件，利用 Docker 构建缓存
COPY pyproject.toml uv.lock ./

# 安装生产依赖
RUN uv sync --frozen --no-dev

# 复制应用代码
COPY app ./app

EXPOSE 8000

CMD [
  "uv",
  "run",
  "uvicorn",
  "app.main:app",
  "--host",
  "0.0.0.0",
  "--port",
  "8000"
]
```

这里有三个重要知识点：

**1. 为什么监听** `0.0.0.0`**？**

```bash
--host 0.0.0.0
```

如果只监听 `127.0.0.1`，服务可能只能在容器内部访问，其他容器无法正常访问。

**2. 为什么先复制依赖文件？**

```dockerfile
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
```

Docker 可以缓存依赖安装层。

如果只是修改 Python 业务代码，不必每次重新安装全部依赖。

**3. 为什么使用** `--no-dev`**？**

生产环境不需要 pytest 等开发测试依赖，可以减少安装内容。

注意：这个示例假设项目依赖声明完整，且 `uv.lock` 已提交。如果你的项目使用 `src/` 目录或需要安装本地 Python 项目包，还需要根据实际 `pyproject.toml` 调整构建步骤。

#### 六、第五步：配置 Docker Compose

这是今天最核心的内容。

前面我们分别定义了前端和后端，现在要将它们与 MySQL、Redis 组合起来。

创建项目根目录的 `docker-compose.yml`：

```yaml
services:

  # React + Nginx
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  # FastAPI
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: mysql+pymysql://${MYSQL_USER}:${MYSQL_PASSWORD}@mysql:3306/${MYSQL_DATABASE}
      REDIS_URL: redis://redis:6379/0
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  # MySQL
  mysql:
    image: mysql:8.4
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test:
        - CMD-SHELL
        - mysqladmin ping -h 127.0.0.1 -p"$${MYSQL_ROOT_PASSWORD}" --silent
      interval: 10s
      timeout: 5s
      retries: 10
    restart: unless-stopped

  # Redis
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  mysql_data:
  redis_data:
```

##### 理解 Compose 的关键配置

| **配置** | **作用** |
| --- | --- |
| services | 定义应用服务 |
| build | 构建本地 Docker 镜像 |
| image | 使用现有镜像 |
| ports | 映射主机端口 |
| environment | 注入环境变量 |
| volumes | 持久化数据 |
| depends\_on | 控制启动依赖 |
| healthcheck | 检查服务健康状态 |
| restart | 配置容器重启策略 |

特别注意：

`depends_on` 的健康检查配置可以等待 MySQL 和 Redis 达到健康状态，但不代表业务连接永远不会失败。FastAPI 仍然应该实现数据库连接重试和异常处理。

另外，示例中 Redis 使用了 AOF 持久化，但这不能代替 Redis 备份，也不代表订单数据应该存储在 Redis 中。

#### 七、第六步：配置环境变量

创建根目录 `.env.example`：

dotenv

`MYSQL_ROOT_PASSWORD=change_this_root_password
MYSQL_DATABASE=order_db
MYSQL_USER=order_user
MYSQL_PASSWORD=change_this_app_password`

复制为 `.env`：

```bash
cp .env.example .env
```

修改 `.env` 中的密码。

同时创建 `.gitignore`：

gitignore

`.env
.env.*
!.env.example`

这样可以避免把真实数据库密码提交到 GitHub。

生产环境建议进一步使用 Docker Secrets 或云平台的密钥管理服务，不要把真实密码写入 Dockerfile 或提交到代码仓库。

#### 八、第七步：配置 .dockerignore

这一步很多初学者容易忽略。

创建根目录的 `.dockerignore`，分别给前后端创建也可以。

`frontend/.dockerignore`：

```text
node_modules
dist
.git
.env
*.log
```

`backend/.dockerignore`：

```text
.venv
__pycache__
.pytest_cache
.coverage
.git
.env
*.pyc
```

为什么需要？

避免把本地开发环境、缓存、测试文件和敏感配置打包进镜像。

#### 九、第八步：启动整个订单系统

现在进入实战。

在项目根目录执行：

##### 1. 检查 Compose 配置

```bash
docker compose config
```

检查 YAML 语法和变量是否正确。

##### 2. 构建镜像

```bash
docker compose build
```

##### 3. 启动服务

```bash
docker compose up -d
```

##### 4. 查看容器状态

```bash
docker compose ps
```

预期看到：

| **服务** | **状态** |
| --- | --- |
| frontend | running |
| backend | running |
| mysql | healthy |
| redis | healthy |

注意：`running` 只代表容器正在运行，不代表应用业务一定正常。还要检查后端日志和健康接口。

##### 5. 查看日志

```bash
# 所有服务
docker compose logs -f

# 只看后端
docker compose logs -f backend

# 只看 MySQL
docker compose logs -f mysql
```

##### 6. 进入容器

```bash
docker compose exec backend sh
```

进入 MySQL：

```bash
docker compose exec mysql \
  mysql -u order_user -p order_db
```

##### 7. 访问系统

**订单管理系统**

本地部署地址

http://localhost `http://localhost?utm_source=chatgpt.com`

FastAPI Swagger 文档 `http://localhost/api/docs?utm_source=chatgpt.com`

需要先在你的电脑上成功启动 Docker Compose 服务，这些地址才可以访问。

#### 十、理解 Docker Volume：为什么数据库不能丢？

这是非常重要的生产知识。

假设 MySQL 容器运行着 1000 笔订单。

如果执行：

```bash
docker compose down
```

容器会停止并删除，但命名 Volume 中的数据仍然保留。

重新执行：

```bash
docker compose up -d
```

数据库可以重新使用原有数据。

但如果执行：

```bash
docker compose down -v
```

就会删除 Compose 管理的命名 Volume，数据库数据可能随之丢失。

危险命令

生产环境不要随意执行 `docker compose down -v`。

另外，Volume 也不是备份。生产数据库仍然需要定期备份，并验证能够恢复。

#### 十一、生产环境还需要考虑的三个问题

##### 1. 数据库迁移

不要依靠应用启动时自动创建所有生产表。

建议使用 Alembic 管理数据库版本：

```bash
docker compose run --rm backend \
  uv run alembic upgrade head
```

每次发布前执行经过审核的数据库迁移，并提前做好备份和回滚方案。

##### 2. 端口安全

当前示例只有前端映射了：

```yaml
ports:
  - "80:80"
```

MySQL 和 Redis 没有映射到宿主机公网端口。

这是更安全的默认方式。

生产环境还应该：

- 使用 HTTPS。
- 限制服务器防火墙规则。
- 不向公网暴露 MySQL 和 Redis。
- 限制容器权限和资源使用。
- 保护 Docker Socket 和服务器管理权限。

##### 3. Mac Apple Silicon 与 Linux 服务器架构

你在 Apple Silicon Mac 上开发时，默认可能构建 ARM64 镜像，而部分云服务器使用 AMD64。

可以使用：

```bash
docker buildx build \
  --platform linux/amd64 \
  -t order-backend:latest \
  ./backend
```

如果需要同时支持两种架构，可以构建多架构镜像。

建议以生产服务器的 CPU 架构为准，避免本地构建成功、服务器运行失败。

### 十二、Docker 容器化实战验收

现在检查你是否真正掌握了 Docker Compose。

#### Docker 部署验收清单

验收进度

**0/10**

前端 Dockerfile 能够成功构建

后端 Dockerfile 能够成功构建

docker-compose.yml 配置检查通过

React 容器正常运行

FastAPI 容器正常运行

MySQL 健康检查通过

Redis 健康检查通过

前端能够通过 Nginx 调用后端 API

重启容器后 MySQL 数据仍然存在

确认没有将真实密码提交到 Git

### 十三、实战练习：理解 Docker Volume

现在有一个场景：

订单系统已经使用 Docker Compose 部署。

MySQL 容器中有 1000 笔真实订单。

管理员执行：

```bash
docker compose down
docker compose up -d
```

重新启动后，订单数据应该是什么状态？

- A. 如果使用命名 Volume 持久化 MySQL 数据，1000 笔订单仍然存在
- B. 所有订单都会被删除
- C. Docker 会自动从代码中重新生成订单
- D. 必须重新构建 MySQL 镜像才能恢复订单

提交答案，继续学习

#### 十四、第五课学习进度

#### 上线部署与运维学习路线

1. 部署基础与环境规划

已学习

2. Docker 与 Docker Compose

当前学习

3. Linux 服务器与 Nginx
4. 数据库部署与备份
5. CI/CD 自动化发布
6. 日志、监控与告警
7. 故障处理与版本回滚

**本节最重要的三个知识点：**

1. Dockerfile：定义如何构建应用镜像。
2. Docker Compose：统一管理多个容器。
3. Volume：保证容器重建后持久化数据不会丢失。

下一节我们会把 Docker 部署到真正的 Linux 服务器上，配置 Nginx、域名和 HTTPS，让订单管理系统能够通过公网安全访问。

## 对话 29　Linux Nginx 与 HTTPS {#turn-29}

> **用户**
>
> 第五课 Docker 容器化实战，我选择 A。请评价，并继续教我 Linux 服务器部署、Nginx 反向代理和 HTTPS 配置。

**ChatGPT**

回答正确 · Docker 基础通过

你选择 A：使用命名 Volume 持久化 MySQL 数据，执行 `docker compose down` 后，1000 笔订单仍然存在。

完全正确！

你已经理解 Docker 部署中一个非常重要的概念：**容器生命周期不等于数据生命周期。**

#### 一、评价你的答案

这两个命令有本质区别：

| **命令** | **容器** | **命名 Volume** |
| --- | --- | --- |
| `docker compose down` | 删除 | 保留 |
| `docker compose up -d` | 重新创建 | 继续挂载 |
| `docker compose down -v` | 删除 | 删除 Compose 管理的 Volume |

所以：

- 应用容器可以随时重建。
- 数据库数据必须独立持久化。
- Volume 不能替代数据库备份。

这是生产环境部署必须掌握的基础知识。

### 第五课 · 5.3 Linux 服务器部署、Nginx 反向代理与 HTTPS

本节目标：让订单系统通过公网域名访问

上一节我们已经使用 Docker Compose 在本地运行：

```text
React
FastAPI
MySQL
Redis
```

但现在还有一个问题：

本地的 `http://localhost` 只有你自己的电脑可以访问。

今天我们要把系统部署到 Linux 云服务器，并配置：

1. Linux 服务器。
2. Docker 运行环境。
3. Nginx 反向代理。
4. 域名解析。
5. HTTPS 证书。
6. 公网访问。

#### 二、第一步：理解 Linux 生产服务器架构

先看部署完成后的架构。

#### 订单系统生产环境架构

**用户浏览器**

[https://order.example.com](https://order.example.com?utm_source=chatgpt.com)

**DNS 域名解析**

域名解析到服务器公网 IP

**Nginx / HTTPS**

443 端口，证书终止，反向代理

**Docker Compose**

React

FastAPI

MySQL

Redis

这里有一个架构选择：

**Nginx 可以直接安装在 Linux 宿主机，也可以运行在 Docker 容器中。**

本节我们采用 Docker 化 Nginx，统一由 Compose 管理。这样更方便复现部署环境。

#### 三、第二步：准备 Linux 云服务器

我们以 Ubuntu Server 24.04 LTS 为例。

建议初期测试配置：

| **配置** | **建议** |
| --- | --- |
| CPU | 2 核 |
| 内存 | 4 GB 起步 |
| 磁盘 | 40 GB SSD 起步 |
| 系统 | Ubuntu 24.04 LTS |
| 网络 | 公网 IPv4 |
| 安全组 | 22、80、443 按需开放 |

如果只是个人学习和低流量测试，2 核 4 GB 可以作为起点；生产容量要根据实际并发、数据库规模和任务负载评估。

##### 1. 连接服务器

在 Mac 终端执行：

```bash
ssh ubuntu@你的服务器公网IP
```

建议使用 SSH 密钥登录，而不是长期依赖密码登录。

##### 2. 更新系统

```bash
sudo apt update

sudo apt upgrade -y
```

##### 3. 安装常用工具

```bash
sudo apt install -y \
  curl \
  wget \
  git \
  vim \
  unzip \
  ca-certificates
```

##### 4. 安装 Docker

建议使用 Docker 官方 Ubuntu 安装仓库。

官方安装文档：

[Docker Engine 官方 Ubuntu 安装指南](https://docs.docker.com/engine/install/ubuntu/?utm_source=chatgpt.com)

安装完成后检查：

```bash
docker --version

docker compose version
```

##### 5. 检查 Docker 服务

```bash
sudo systemctl status docker
```

启动并设置开机启动：

```bash
sudo systemctl enable --now docker
```

生产环境不要为了方便就随意给普通用户授予 Docker 管理权限，因为 Docker 管理权限基本等同于宿主机高权限。

#### 四、第三步：配置服务器防火墙

生产环境不能把所有端口都暴露给公网。

订单系统需要的端口：

| **端口** | **服务** | **公网开放** |
| --- | --- | --- |
| 22 | SSH | 限制来源 IP |
| 80 | HTTP | 开放 |
| 443 | HTTPS | 开放 |
| 8000 | FastAPI | 不开放 |
| 3306 | MySQL | 不开放 |
| 6379 | Redis | 不开放 |

Ubuntu 可以使用 UFW：

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

sudo ufw enable

sudo ufw status
```

注意：还需要在云服务器安全组中配置相同的入站规则。启用防火墙之前，要确认 SSH 访问规则正确，否则可能把自己锁在服务器外面。

#### 五、第四步：理解 Nginx 反向代理

*原对话配图*　NGINX RTMP module - NGINX Extras Documentation

**Nginx**

高性能 Web 服务器和反向代理服务器。

[官方文档](https://nginx.org/en/docs/?utm_source=chatgpt.com)

##### 1. 什么是反向代理？

假设 FastAPI 运行在：

```text
http://backend:8000
```

React 运行在：

```text
http://frontend:80
```

用户不应该记住这些内部地址。

Nginx 可以统一接收请求，然后转发给对应服务。

例如：

```text
https://order.example.com/
           ↓
         Nginx
           │
           ├── /       → React
           │
           └── /api/   → FastAPI
```

它解决了三个问题：

1. 统一访问入口。
2. 隐藏后端服务地址和端口。
3. 统一处理 HTTPS、请求转发和访问日志。

##### 2. Nginx 配置示例

我们采用 Docker 化 Nginx 作为统一入口。

先调整之前的架构：

- `frontend`：只提供 React 静态页面。
- `backend`：提供 FastAPI。
- `nginx`：负责公网入口、HTTPS 和反向代理。
- `mysql`、`redis`：只在内部网络通信。

`frontend/nginx.conf` 改为只处理静态文件：

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

新建 `deploy/nginx/default.conf`：

```nginx
upstream frontend_app {
    server frontend:80;
}

upstream backend_app {
    server backend:8000;
}

server {
    listen 80;
    server_name order.example.com;

    location / {
        proxy_pass http://frontend_app;
    }

    location /api/ {
        proxy_pass http://backend_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

注意：这里假设 FastAPI 的 API 路由本身包含 `/api/` 前缀。`proxy_pass` 不带尾部路径，因此会保留原始请求路径。如果你的后端路由设计不同，需要调整路径转发规则。

##### 3. 理解 proxy\_pass

```nginx
location /api/ {
    proxy_pass http://backend_app;
}
```

用户请求：

```text
/api/orders
```

Nginx 转发到：

```text
http://backend:8000/api/orders
```

这就是反向代理。

另外，生产环境还应配置合理的超时时间、请求体大小限制、访问日志和错误日志。

#### 六、第五步：使用 Docker Compose 部署 Nginx

我们把原来的 Compose 文件调整一下。

下面是部署入口相关的配置示例：

```yaml
services:
  frontend:
    build: ./frontend
    expose:
      - "80"
    restart: unless-stopped

  backend:
    build: ./backend
    expose:
      - "8000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: redis://redis:6379/0
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./deploy/nginx:/etc/nginx/conf.d:ro
      - ./certbot/www:/var/www/certbot:ro
      - ./certbot/conf:/etc/letsencrypt:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

  mysql:
    image: mysql:8.4
    # 保留之前的环境变量、健康检查和持久化配置

  redis:
    image: redis:7-alpine
    # 保留之前的持久化配置

volumes:
  mysql_data:
  redis_data:
```

这里展示的是入口服务的调整，MySQL 和 Redis 的配置需要保留上一节的完整配置。

生产环境建议将数据库连接密码从 `.env` 改为安全的 Secrets 管理方式，并为所有服务设置专用网络和健康检查。

启动：

```bash
docker compose up -d --build
```

检查：

```bash
docker compose ps

docker compose logs -f nginx
```

#### 七、第六步：配置域名解析

现在我们需要让域名指向 Linux 服务器。

假设：

```text
域名：order.example.com
服务器公网 IP：203.0.113.10
```

这里的域名和 IP 都是教学示例。

登录你的域名 DNS 管理平台，添加：

| **类型** | **主机记录** | **记录值** |
| --- | --- | --- |
| A | order | 服务器公网 IPv4 |

最终：

```text
order.example.com
        ↓
203.0.113.10
        ↓
Linux 云服务器
```

检查 DNS：

```bash
dig +short order.example.com
```

返回服务器公网 IP，说明解析基本正确。

如果使用 IPv6，还要确认 AAAA 记录指向正确的 IPv6 地址，否则部分用户可能通过错误的 IPv6 地址访问。

### 八、第七步：配置 HTTPS 证书

现在进入本节最重要的内容。

HTTP：

```text
http://order.example.com
```

HTTPS：

```text
https://order.example.com
```

HTTPS 可以加密浏览器和服务器之间的通信，并验证服务器证书身份。

我们使用免费的 Let's Encrypt 证书。

*原对话配图*　Logo Let's Encrypt – Logos PNG

**Let's Encrypt**

提供免费的自动化 TLS 证书。

[官方入门文档](https://letsencrypt.org/getting-started/?utm_source=chatgpt.com)

#### 1. 什么是 SSL/TLS 证书？

可以简单理解：

- 证书用于证明服务器域名身份。
- TLS 用于加密通信。
- 浏览器通过证书验证服务器。

证书有效期有限，因此必须配置自动续期。

#### 2. 使用 Certbot 获取证书

*原对话配图*　Tor-Projekt \| Onion-Dienste

**Certbot**

自动申请和续期 HTTPS 证书的工具。

[Certbot 官方网站](https://certbot.eff.org/?utm_source=chatgpt.com)

这里使用 Webroot 验证方式，不需要停止 Nginx。

首先确保目录存在：

```bash
mkdir -p deploy/nginx
mkdir -p certbot/www
mkdir -p certbot/conf
```

先在 HTTP 配置中增加证书验证路径：

```nginx
server {
    listen 80;
    server_name order.example.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://frontend:80;
    }

    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

然后重新加载 Nginx：

```bash
docker compose up -d nginx
```

增加 Certbot 服务：

```yaml
  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/www:/var/www/certbot
      - ./certbot/conf:/etc/letsencrypt
```

执行证书申请：

```bash
docker compose run --rm certbot certonly \
  --webroot \
  -w /var/www/certbot \
  -d order.example.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email
```

将示例域名和邮箱替换成你自己的信息。

成功后，证书文件通常位于：

```text
certbot/conf/live/order.example.com/
├── fullchain.pem
└── privkey.pem
```

其中：

- `fullchain.pem`：服务器证书和证书链。
- `privkey.pem`：私钥，必须严格保护。

如果证书申请失败，优先检查：

1. 域名是否解析正确。
2. 服务器公网 80 端口是否开放。
3. Nginx 是否正常运行。
4. `/.well-known/acme-challenge/` 是否能够访问。
5. 是否存在 CDN 或其他代理影响验证。

#### 3. 配置 HTTPS

证书申请成功后，将 Nginx 配置改成：

```nginx
server {
    listen 80;
    server_name order.example.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name order.example.com;

    ssl_certificate
        /etc/letsencrypt/live/order.example.com/fullchain.pem;

    ssl_certificate_key
        /etc/letsencrypt/live/order.example.com/privkey.pem;

    location / {
        proxy_pass http://frontend:80;
    }

    location /api/ {
        proxy_pass http://backend:8000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

重新检查配置：

```bash
docker compose exec nginx nginx -t
```

重新加载：

```bash
docker compose exec nginx nginx -s reload
```

现在访问：

```text
https://order.example.com
```

就可以使用 HTTPS 访问订单系统。

#### 4. 配置证书自动续期

这是非常容易被忽略的一步。

证书不会永久有效。

可以通过定时任务执行：

```bash
docker compose run --rm certbot renew
```

但这条命令执行后，如果证书发生更新，还需要通知 Nginx 重新加载证书。

例如在宿主机定时任务中：

```bash
#!/bin/bash

cd /opt/order-system

docker compose run --rm certbot renew

docker compose exec -T nginx nginx -s reload
```

这只是基础方案。更完善的实现应该检查续期命令是否成功、证书是否实际更新，再执行 Nginx reload，并监控续期失败。

还要定期运行：

```bash
docker compose run --rm certbot renew --dry-run
```

用于验证续期流程。

#### 九、第八步：验证部署是否成功

部署完成后，不能只看网页能否打开，还要进行完整检查。

##### 1. 检查 HTTPS

```bash
curl -I https://order.example.com
```

预期返回：

```text
HTTP/2 200
```

如果 HTTP 自动跳转 HTTPS：

```bash
curl -I http://order.example.com
```

预期返回：

```text
HTTP/1.1 301 Moved Permanently
Location: https://order.example.com/
```

##### 2. 检查 API

```bash
curl https://order.example.com/api/health
```

假设 FastAPI 已经实现健康检查接口，预期：

```json
{
  "status": "ok"
}
```

##### 3. 检查容器

```bash
docker compose ps
```

##### 4. 检查日志

```bash
docker compose logs --tail=100 nginx

docker compose logs --tail=100 backend
```

##### 5. 检查 HTTPS 证书

```bash
echo | openssl s_client \
  -connect order.example.com:443 \
  -servername order.example.com 2>/dev/null \
  | openssl x509 -noout -dates
```

可以查看证书有效期。

#### 十、生产环境的几个重要注意事项

这些是从教学环境走向真实生产环境时必须补充的知识。

**1. 正确处理代理请求头**

FastAPI 如果需要识别 HTTPS、客户端 IP 等信息，需要正确处理 Nginx 转发的请求头。

Uvicorn 可以配置：

```bash
uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --proxy-headers \
  --forwarded-allow-ips="可信代理地址"
```

不要在不可信网络环境下直接信任所有来源的转发请求头。

**2. 正确处理 CORS**

如果 React 和 API 使用同一个域名：

```text
https://order.example.com/
https://order.example.com/api/
```

通常可以避免跨域问题。

如果使用不同域名，就需要在 FastAPI 中配置明确的允许来源。

**3. 不要暴露内部服务**

生产环境应该保持：

```text
公网：
80、443

限制来源：
22

内部：
8000、3306、6379
```

**4. 数据库要有独立备份**

Docker Volume 不是备份。

建议配置：

- 每日数据库备份。
- 备份异地保存。
- 备份完整性检查。
- 定期恢复演练。

### 十一、本节综合实战：你来判断部署问题

现在假设：

订单系统已经部署到 Linux 服务器。

你可以通过：

```text
http://order.example.com
```

正常访问。

但浏览器显示：

Not Secure

你希望实现 HTTPS 安全访问。

你认为正确的处理方式是什么？

- A. 配置域名 DNS 解析，申请 Let's Encrypt TLS 证书，在 Nginx 配置 HTTPS，并将 HTTP 请求重定向到 HTTPS
- B. 只修改 React 前端代码，把 HTTP 改成 HTTPS
- C. 只开放服务器 443 端口，不需要证书
- D. 在 MySQL 中开启 SSL 就可以让整个网站使用 HTTPS

提交答案，继续学习

#### 十二、第五课学习进度

#### 上线部署与运维学习路线

1. 部署基础与环境规划

已学习

2. Docker 与 Docker Compose

已学习

3. Linux 服务器、Nginx 与 HTTPS

当前学习

4. 数据库部署与备份
5. CI/CD 自动化发布
6. 日志、监控与告警
7. 故障处理与版本回滚

**本节需要真正掌握的三个能力：**

1. 能够通过 SSH 管理 Linux 服务器。
2. 能够使用 Nginx 实现反向代理。
3. 能够使用 Let's Encrypt 配置 HTTPS 和证书续期。

下一节我们进入数据库部署与备份，重点学习 MySQL 数据持久化、定时备份、数据恢复和生产数据安全。

最终目标不是让网站能够打开，而是让它在服务器重启、数据库异常、证书到期和程序升级时，仍然能够安全可靠地运行。

## 对话 30　数据库备份与恢复 {#turn-30}

> **用户**
>
> 第五课 Linux、Nginx 和 HTTPS 实战，我选择 A。请评价，并继续教我数据库部署、备份和恢复。

**ChatGPT**

回答正确 · Linux 部署基础通过

你选择 A：配置域名 DNS 解析，申请 Let's Encrypt TLS 证书，在 Nginx 配置 HTTPS，并将 HTTP 请求重定向到 HTTPS。

完全正确！

你的思路已经覆盖 HTTPS 部署的完整链路：

1. DNS：让域名指向服务器。
2. TLS 证书：证明服务器身份。
3. Nginx：配置 443 端口和证书。
4. HTTP 重定向：让用户自动使用 HTTPS。
5. 自动续期：避免证书到期导致服务异常。

这里再补充一个重要概念：

**HTTPS 不只是打开 443 端口，而是 DNS、证书、TLS 配置和反向代理共同工作的结果。**

### 第五课 · 5.4 数据库部署、备份与恢复

本节目标：保障生产数据安全

今天我们解决一个比网站能不能打开更重要的问题：

**如果服务器突然损坏、数据库误删、程序发布出错，订单数据还能恢复吗？**

假设订单系统已经上线，MySQL 中保存了：

- 10000 笔订单。
- 50000 条订单明细。
- 1000 条商品库存记录。
- 大量库存预留记录和库存流水。

如果数据库丢失，软件即使可以重新部署，也无法恢复业务。

因此，数据库备份和恢复是生产运维最重要的能力之一。

#### 一、第一步：理解数据库部署架构

先回顾我们之前的 Docker Compose：

```text
Linux 服务器
    │
    └── Docker
          │
          ├── Nginx
          │
          ├── FastAPI
          │
          ├── React
          │
          ├── MySQL
          │     └── mysql_data
          │
          └── Redis
                └── redis_data
```

MySQL 的数据存储在 Docker Volume 中。

例如：

```yaml
mysql:
  image: mysql:8.4
  volumes:
    - mysql_data:/var/lib/mysql
```

这里：

```yaml
mysql_data:/var/lib/mysql
```

意味着 MySQL 数据文件保存在独立的持久化存储中。

但是需要记住：

- 容器删除不一定导致数据丢失。
- Volume 损坏仍然可能导致数据丢失。
- 服务器硬盘损坏可能导致 Volume 和数据库一起丢失。
- 误执行 SQL 也可能删除真实业务数据。

所以，**Volume 解决的是持久化问题，备份解决的是数据恢复问题。**

#### 二、第二步：认识 MySQL 备份的三种方式

数据库备份主要有三种思路。

**1. 逻辑备份**

适合入门与中小型项目

*原对话配图*　The Complete mysqldump Guide (with examples) \| SimpleBackups

[medium.com](https://medium.com/simplebackups/the-complete-mysqldump-guide-with-examples-d490807021bb?utm_source=chatgpt.com)

将数据库导出成 SQL 文件，恢复时重新执行 SQL。

典型工具：`mysqldump`

**2. 物理备份**

适合较大数据库

*原对话配图*　Demystifying InnoDB Physical Files: A Guide to MySQL 8.0 Data Storage

[mydbops.com](https://www.mydbops.com/blog/innodb-physical-files-on-mysql-80?utm_source=chatgpt.com)

备份数据库物理文件，恢复时还原数据库文件。

典型工具：MySQL Enterprise Backup、Percona XtraBackup（需匹配版本和配置）。

**3. 增量与时间点恢复**

适合生产环境

*原对话配图*　备份原理\_数据备份\_用户指南\_云数据库 RDS\_云数据库 RDS for MySQL-华为云

[support.huaweicloud.com](https://support.huaweicloud.com/usermanual-rds-mysql/rds_08_0047.html?utm_source=chatgpt.com)

结合全量备份和 Binary Log，将数据恢复到指定时间点。

典型工具：MySQL Binary Log。

我们先从最容易掌握、最适合订单系统入门的 `mysqldump` 开始。

#### 三、第三步：使用 mysqldump 备份数据库

##### 1. 认识 mysqldump

`mysqldump` 是 MySQL 自带的逻辑备份工具。

官方文档：

[MySQL mysqldump 官方文档](https://dev.mysql.com/doc/refman/8.4/en/mysqldump.html?utm_source=chatgpt.com)

它可以将数据库导出为 SQL 文件。

例如：

```bash
mysqldump -u root -p order_db > order_db.sql
```

执行后：

```text
order_db.sql
```

就包含数据库结构和数据。

##### 2. 备份 Docker 中的 MySQL

我们之前的 MySQL 服务名称是 `mysql`。

在项目根目录执行：

```bash
mkdir -p backups

docker compose exec -T mysql sh -c \
  'exec mysqldump \
    -uroot \
    -p"$MYSQL_ROOT_PASSWORD" \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --databases "$MYSQL_DATABASE"' \
  > backups/order_$(date +%Y%m%d_%H%M%S).sql
```

参数解释：

| **参数** | **作用** |
| --- | --- |
| `-u root` | 指定数据库用户 |
| `-p` | 使用密码认证 |
| `--single-transaction` | 对 InnoDB 使用一致性快照 |
| `--routines` | 备份存储过程和函数 |
| `--triggers` | 备份触发器 |
| `--events` | 备份事件 |
| `--databases` | 包含数据库创建语句 |

注意：

- `--single-transaction` 主要适用于 InnoDB 表。
- 备份期间应避免执行影响表结构的 DDL 操作。
- 非事务型表需要额外考虑一致性。
- 生产环境建议使用专门的备份账号，而不是长期使用 root。
- 密码不要写进脚本或 Git 仓库。上面是教学示例，生产环境应使用安全的凭据注入方式。

##### 3. 检查备份文件

```bash
ls -lh backups/
```

检查文件是否有内容：

```bash
head -n 20 backups/order_*.sql
```

也可以查看文件大小：

```bash
du -sh backups/
```

建议在备份完成后检查退出码、文件大小和 SQL 可读性，而不只是看到文件存在就认为备份成功。

##### 4. 压缩备份文件

订单数据越来越多，SQL 文件可能很大。

可以使用 gzip：

```bash
gzip backups/order_20261120_180000.sql
```

得到：

```text
order_20261120_180000.sql.gz
```

压缩率取决于数据内容。

#### 四、第四步：设计自动备份任务

手动备份不够可靠。

真正的生产系统应该自动备份。

例如：

- 每天凌晨 02:00 全量备份。
- 保留最近 7 天本地备份。
- 每周上传一份到异地存储。
- 定期检查备份是否可恢复。

##### 1. 编写备份脚本

创建：

```text
scripts/backup_mysql.sh
```

示例：

```bash
#!/bin/bash

set -Eeuo pipefail

PROJECT_DIR="/opt/order-system"
BACKUP_DIR="/data/mysql-backups"

DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

cd "$PROJECT_DIR"

BACKUP_FILE="$BACKUP_DIR/order_${DATE}.sql.gz"

docker compose exec -T mysql sh -c \
  'exec mysqldump \
    -uroot \
    -p"$MYSQL_ROOT_PASSWORD" \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --databases "$MYSQL_DATABASE"' \
  | gzip > "$BACKUP_FILE"

test -s "$BACKUP_FILE"

gzip -t "$BACKUP_FILE"

echo "Backup completed: $BACKUP_FILE"
```

赋予执行权限：

```bash
chmod +x scripts/backup_mysql.sh
```

执行：

```bash
./scripts/backup_mysql.sh
```

这个基础脚本还应在正式使用前补充备份日志、失败告警、磁盘空间检查和备份完整性验证。

##### 2. 使用 Linux Crontab 定时执行

编辑定时任务：

```bash
crontab -e
```

添加：

cron

`0 2 * * * /opt/order-system/scripts/backup_mysql.sh >> /var/log/order-backup.log 2>&1`

含义：

```text
每天凌晨 02:00 执行数据库备份
```

查看定时任务：

```bash
crontab -l
```

查看备份日志：

```bash
tail -f /var/log/order-backup.log
```

##### 3. 配置备份保留策略

例如保留本地最近 7 天：

```bash
find /data/mysql-backups \
  -type f \
  -name "order_*.sql.gz" \
  -mtime +7 \
  -delete
```

注意：删除策略必须和异地备份策略配套。不要在唯一一份备份上执行自动清理。

#### 五、第五步：异地备份

这是从个人项目走向生产项目必须建立的意识。

假设：

**备份存储架构**

**Linux 生产服务器**

MySQL 全量备份

**压缩、加密**

gzip + 加密密钥管理

**异地对象存储**

例如阿里云 OSS、AWS S3

为什么要异地备份？

假设服务器硬盘损坏：

- 本地 MySQL 数据丢失。
- 本地 Docker Volume 丢失。
- 本地备份文件也可能丢失。

但异地备份还在，就可以重新部署服务器并恢复数据。

建议遵循 3-2-1 备份原则：

- 至少 3 份数据副本。
- 使用 2 种不同的存储介质或存储类型。
- 至少 1 份异地保存。

另外，备份文件中包含客户和订单信息，应加密存储，限制访问权限，并设置对象存储的版本控制、生命周期和防误删策略。

#### 六、第六步：学习数据库恢复

备份只是第一步。

真正重要的是：**出现故障时，你能不能恢复数据？**

我们使用一个场景：

订单系统原本有 10000 笔订单。

管理员误执行了：

```sql
DELETE FROM orders;
```

导致订单数据被删除。

现在我们需要通过备份恢复。

##### 1. 准备恢复环境

强烈建议先在独立恢复环境中演练，不要直接覆盖生产数据库。

创建测试数据库：

```sql
CREATE DATABASE order_restore;
```

##### 2. 恢复 SQL 文件

如果备份使用了 `--databases`，文件中已经包含数据库创建和选择语句。

例如：

```bash
gunzip -c backups/order_backup.sql.gz \
  | docker compose exec -T mysql \
    mysql -uroot -p
```

这里是示意命令，实际执行时应通过安全凭据方式提供密码。

如果要恢复到 `order_restore`，需要先检查或调整备份 SQL 中的数据库名称，不能直接假设文件会自动恢复到新库。

##### 3. 验证恢复结果

执行：

```sql
SELECT COUNT(*) FROM orders;

SELECT COUNT(*) FROM order_items;

SELECT COUNT(*) FROM inventory;
```

再检查业务数据：

```sql
SELECT
    order_no,
    status,
    total_amount
FROM orders
ORDER BY id DESC
LIMIT 10;
```

检查订单和库存关系是否正常。

**恢复成功不能只看数据库启动了，还要验证表、数据、约束和业务关系。**

#### 七、第七步：MySQL Binary Log 与时间点恢复

前面的 mysqldump 可以恢复到备份时刻。

但如果每天只备份一次，会出现一个问题：

假设：

- 凌晨 02:00 完成备份。
- 上午 10:00 误删订单。
- 这期间产生了 500 笔新订单。

直接恢复凌晨备份，会丢失这 8 小时内的正常业务数据。

有没有办法恢复到上午 09:59？

有，这就是 **PITR（Point-in-Time Recovery，时间点恢复）**。

##### 1. 什么是 Binary Log？

MySQL Binary Log（binlog）记录数据库发生的变更事件。

例如：

```text
02:00 全量备份
   ↓
03:00 创建订单 10001
   ↓
04:00 创建订单 10002
   ↓
05:00 取消订单 10001
   ↓
09:59 创建订单 10500
   ↓
10:00 误删订单
```

通过全量备份和 binlog，可以恢复全量备份之后发生的数据库变更。

##### 2. 开启 MySQL binlog

在 Docker Compose 的 MySQL 服务中增加：

```yaml
mysql:
  image: mysql:8.4

  command:
    - --server-id=1
    - --log-bin=mysql-bin
    - --binlog-format=ROW
    - --binlog-expire-logs-seconds=604800

  volumes:
    - mysql_data:/var/lib/mysql
```

参数解释：

| **参数** | **含义** |
| --- | --- |
| server-id | MySQL 实例唯一标识 |
| log-bin | 开启 Binary Log |
| binlog-format=ROW | 记录行级变更 |
| binlog-expire-logs-seconds | 设置 binlog 保留时间，示例为 7 天 |

注意：生产环境增加 binlog 配置前，需要检查已有 MySQL 配置和版本兼容性。不要为了启用 binlog 随意重建数据库 Volume。

##### 3. 查看 binlog

进入 MySQL：

```sql
SHOW VARIABLES LIKE 'log_bin';

SHOW BINARY LOGS;

SHOW MASTER STATUS;
```

MySQL 8.4 中也可以使用：

```sql
SHOW BINARY LOG STATUS;
```

查看当前 binlog 文件和位置。

##### 4. 时间点恢复原理

#### PITR 恢复流程

**恢复最近一次全量备份**

恢复到凌晨 02:00

**回放 Binary Log**

重放 02:00 之后的数据库变更

**停止在误删之前**

恢复到上午 09:59 的状态

实际操作需要：

1. 全量备份时记录 binlog 文件和位置。
2. 保存备份之后产生的所有 binlog。
3. 在隔离恢复环境还原全量备份。
4. 使用 `mysqlbinlog` 按时间或位置回放日志。
5. 在误操作发生前停止回放。
6. 检查恢复数据，再决定如何切换业务。

官方文档：

[MySQL 8.4 时间点恢复官方教程](https://dev.mysql.com/doc/refman/8.4/en/point-in-time-recovery.html?utm_source=chatgpt.com)

特别注意：binlog 本身也必须备份到异地。如果 binlog 和数据库都在同一块损坏的磁盘上，就无法依靠它恢复。

#### 八、第八步：理解 RPO 和 RTO

这是数据库备份设计中非常重要的两个指标。

##### 1. RPO：最多能接受丢失多少数据？

RPO（Recovery Point Objective）表示恢复点目标。

例如：

| **RPO** | **含义** |
| --- | --- |
| 24 小时 | 最多接受丢失一天数据 |
| 1 小时 | 最多接受丢失一小时数据 |
| 5 分钟 | 最多接受丢失五分钟数据 |

RPO 越小，通常意味着需要更频繁地备份或持续归档日志。

##### 2. RTO：最多允许停机多久？

RTO（Recovery Time Objective）表示恢复时间目标。

例如：

| **RTO** | **含义** |
| --- | --- |
| 24 小时 | 允许一天内恢复 |
| 4 小时 | 需要在四小时内恢复 |
| 30 分钟 | 需要在半小时内恢复 |

**订单系统恢复目标示例**

### 15 分钟

RPO 目标

### 2 小时

RTO 目标

这是教学示例，不是所有订单系统都必须采用的标准。要根据业务损失、预算和技术能力制定。

对于真实的订单系统，建议至少先确定：

- 每天全量备份。
- 持续归档 binlog。
- 备份异地保存。
- 定期恢复演练。
- 明确业务可以接受的数据丢失时间和停机时间。

#### 九、建立订单系统数据库备份策略

现在将前面的知识整理成一个可以用于项目的方案。

| **项目** | **建议策略** |
| --- | --- |
| 全量备份 | 每天凌晨执行 |
| Binlog | 持续开启并归档 |
| 本地备份 | 保留最近 7 天 |
| 异地备份 | 对象存储 |
| 备份加密 | 开启 |
| 恢复演练 | 每月至少一次 |
| 备份监控 | 失败告警 |
| 恢复目标 | 明确 RPO、RTO |

可以进一步采用：

- 每周进行完整恢复演练。
- 每天检查最近一次备份。
- 监控 binlog 磁盘占用。
- 定期检查备份存储是否可访问。
- 限制备份文件的读取和删除权限。

这里要注意，恢复演练不能只测试 `mysql` 能否启动，还要验证订单数量、订单明细、库存余额和库存流水是否符合业务逻辑。

### 十、本节实战：数据库故障恢复

现在假设订单系统发生了以下故障：

- 每天凌晨 02:00 自动备份。
- 上午 10:00 管理员误执行了 `DELETE FROM orders`。
- 上午 09:59 的订单数据是正确的。
- 系统已经开启 MySQL Binary Log。
- 02:00 之后的 binlog 文件都完整保存。

你认为最合理的恢复方案是什么？

- A. 在独立恢复环境恢复凌晨全量备份，再回放 02:00 至 09:59 的 binlog，验证数据后恢复业务
- B. 直接删除 MySQL 容器并重新创建
- C. 只恢复凌晨 02:00 的全量备份，不考虑之后的数据
- D. 重新构建 FastAPI Docker 镜像

提交答案，继续学习

### 十一、本节学习成果

#### 数据库运维能力清单

理解 MySQL Docker Volume 持久化

掌握 mysqldump 全量备份

编写自动备份脚本

配置 Linux Crontab 定时任务

理解异地备份与 3-2-1 原则

掌握数据库恢复流程

理解 MySQL Binary Log

理解 PITR 时间点恢复

掌握 RPO 和 RTO

#### 十二、第五课学习进度

#### 上线部署与运维学习路线

1. 部署基础与环境规划

已学习

2. Docker 与 Docker Compose

已学习

3. Linux、Nginx 与 HTTPS

已学习

4. 数据库部署、备份与恢复

当前学习

5. CI/CD 自动化发布
6. 日志、监控与告警
7. 故障处理与版本回滚

**这一节最重要的认知：**

软件可以重新部署，数据库可以重新安装，但真实业务数据不能随意丢失。

你需要从「会部署数据库」升级为「能够保障数据库安全，并且在故障后恢复业务」。

下一节我们将使用 GitHub Actions，把之前学过的 GitHub、Docker、Linux 和部署知识连接起来，实现代码提交后自动测试、构建镜像、部署到服务器。

## 对话 31　GitHub Actions 与 CI CD {#turn-31}

> **用户**
>
> 第五课数据库备份与恢复实战，我选择 A。请评价，并继续教我使用 GitHub Actions 实现 CI/CD 自动化部署。

**ChatGPT**

回答正确 · 数据库恢复实战通过

你选择 A：在独立恢复环境恢复凌晨全量备份，再回放 02:00 至 09:59 的 binlog，验证数据后恢复业务。

**完全正确！**

#### 一、评价你的答案

你选择的是 MySQL 的 **PITR（时间点恢复）** 方案。

为什么 A 最合理？

| **方案** | **结果** | **评价** |
| --- | --- | --- |
| A. 全量备份 + Binlog | 尽可能恢复误删前的数据 | 正确 |
| B. 重建 MySQL 容器 | 无法恢复误删的数据 | 错误 |
| C. 只恢复 02:00 备份 | 丢失后续正常业务数据 | 不完整 |
| D. 重建 FastAPI 镜像 | 不影响数据库中的误删记录 | 错误 |

还有一个生产环境细节：不能简单按 `09:59` 这个时间字符串盲目截断日志。实际需要核对误删事务的准确位置、时区和事务边界，避免漏掉 09:59 之后、误删之前的正常订单。

你的回答体现了三个正确的工程思维：

- **数据安全优先**：不直接覆盖生产数据库。
- **减少数据损失**：利用 Binlog 尽量缩小 RPO。
- **验证后恢复**：确认订单、库存、订单明细一致，再切换业务。

接下来进入第五课的自动化发布部分。

### 第五课 · 5.5 使用 GitHub Actions 实现 CI/CD 自动化部署

本节目标：代码提交后自动测试、构建、发布

前面我们已经学过：

- React + FastAPI 编码实现。
- pytest + Playwright 测试。
- Docker Compose 容器化。
- Linux + Nginx + HTTPS 部署。
- MySQL 数据备份与恢复。

现在要解决一个新问题：

**每次修改代码，都需要手动登录服务器、拉取代码、构建镜像、重启容器。能不能自动完成？**

答案是：使用 CI/CD。

#### 二、先理解 CI/CD 的工作流程

#### 订单系统自动化发布流水线

**开发人员提交代码**

Push / Pull Request

**CI：持续集成**

代码检查 → pytest → 构建检查

**Build：镜像构建**

React / FastAPI Docker Image

**Registry：镜像仓库**

GitHub Container Registry（GHCR）

**CD：部署**

SSH → Docker Compose Pull → Up

**发布后验证**

健康检查 → 业务冒烟测试 → 监控

##### CI 和 CD 有什么区别？

| **概念** | **主要任务** | **示例** |
| --- | --- | --- |
| CI 持续集成 | 确保新代码可以安全合并 | 自动运行 pytest |
| CD 持续交付 | 构建可发布版本 | 生成 Docker 镜像 |
| CD 持续部署 | 自动将合格版本发布 | 自动更新服务器容器 |

对于个人或小团队，我建议采用：

**PR 自动测试 → 合并 main 自动构建 → 生产环境人工审批 → 自动部署。**

这样既减少重复操作，又避免每次提交都直接影响生产环境。

#### 三、认识 GitHub Actions

*原对话配图*　Phase 5: Setting up CI/CD with Github Actions \| Cloud Connections

**GitHub Actions**

GitHub 提供的自动化工作流服务，可执行测试、构建、部署等任务。

[GitHub Actions 官方文档](https://docs.github.com/en/actions?utm_source=chatgpt.com)

GitHub Actions 的五个核心概念：

| **概念** | **解释** |
| --- | --- |
| Workflow | 一个完整自动化流程 |
| Event | 触发条件，例如 push |
| Job | 一个独立执行任务 |
| Step | Job 内的一步操作 |
| Runner | 实际执行任务的机器 |

例如：

```yaml
name: CI

on:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run tests
        run: echo "Running tests"
```

把文件保存为：

```text
.github/workflows/ci.yml
```

当有人提交 Pull Request，GitHub 就会自动运行这个 Workflow。

### 四、第一步：设计项目 CI/CD 目录

沿用之前的订单系统：

```text
order-system/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── backend/
│   ├── Dockerfile
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── app/
│   └── tests/
├── deploy/
│   └── compose.prod.yml
└── docker-compose.yml
```

这里我们把工作流分为两个文件：

- `ci.yml`：代码质量检查和自动化测试。
- `deploy.yml`：构建镜像并部署生产环境。

这样可以独立定位测试失败和部署失败。

#### 五、第二步：编写 CI 自动化测试

创建 `.github/workflows/ci.yml`：

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  backend-test:
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: backend

    steps:
      - uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v6
        with:
          python-version: "3.12"

      - name: Install dependencies
        run: uv sync --frozen

      - name: Run unit tests
        run: uv run pytest tests/unit -v

  frontend-build:
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: frontend

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Build React
        run: npm run build
```

这份配置先实现最基本的两项自动检查。

#### CI 执行流程

**后端**

Python 3.12

安装依赖

pytest

**前端**

Node.js 22

npm ci

npm run build

注意：这份入门 CI 只运行单元测试和前端构建。订单事务集成测试需要额外启动 MySQL 测试服务，Playwright 还需要浏览器和测试应用。上线前必须补齐这些检查。

##### 如何查看测试结果？

进入 GitHub 仓库：

`Actions → CI → 选择一次运行记录`

可以查看：

- 哪个 Job 成功或失败。
- 哪一步出现错误。
- pytest 的失败信息。
- React 构建日志。

如果测试失败，应该先修复问题，而不是绕过 CI 检查。

### 六、第三步：将 Docker 镜像发布到 GHCR

前面我们是在服务器上执行：

```bash
docker compose build
```

但这种方式存在一个问题：服务器还需要下载源码和构建依赖。

更推荐的方式是：

**GitHub Actions 构建镜像 → 上传 GHCR → 服务器拉取镜像。**

#### 镜像构建与分发

**GitHub Actions**

构建 React / FastAPI 镜像

**GHCR 镜像仓库**

保存指定版本的 Docker 镜像

**Linux 服务器**

拉取镜像并运行

##### 为什么需要镜像版本？

不要长期依赖：

```text
order-backend:latest
```

因为 `latest` 不能明确表示当前运行的是哪一版代码。

建议使用 Git Commit SHA 标记镜像：

```text
ghcr.io/example/order-backend:a1b2c3d
```

这样每次发布都能追踪到具体代码版本，也方便回滚。

##### 构建和推送镜像

下面是 GitHub Actions 中的一个示例 Job：

```yaml
build-images:
  runs-on: ubuntu-latest

  permissions:
    contents: read
    packages: write

  steps:
    - uses: actions/checkout@v4

    - uses: docker/setup-buildx-action@v3

    - name: Login to GHCR
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Build and push backend
      uses: docker/build-push-action@v6
      with:
        context: ./backend
        push: true
        tags: ghcr.io/example/order-backend:${{ github.sha }}

    - name: Build and push frontend
      uses: docker/build-push-action@v6
      with:
        context: ./frontend
        push: true
        tags: ghcr.io/example/order-frontend:${{ github.sha }}
```

把 `example` 替换为实际的 GitHub 组织或用户名，并统一使用仓库允许的镜像名称。

这里还有一个安全要点：真实生产项目应将第三方 Actions 固定到经过验证的完整 Commit SHA，并使用最小权限配置。

### 七、第四步：配置 Linux 生产部署

现在服务器不需要每次重新构建镜像，只需要拉取指定版本。

创建 `deploy/compose.prod.yml`：

```yaml
services:
  frontend:
    image: ${FRONTEND_IMAGE}
    restart: unless-stopped

  backend:
    image: ${BACKEND_IMAGE}
    environment:
      DATABASE_URL: ${DATABASE_URL}
    restart: unless-stopped
```

这是应用服务的简化示例，实际部署还需要保留前面已经配置的 Nginx、MySQL、Redis、网络、Volume 和健康检查。

例如发布时指定：

dotenv

`FRONTEND_IMAGE=ghcr.io/example/order-frontend:a1b2c3d
BACKEND_IMAGE=ghcr.io/example/order-backend:a1b2c3d`

在服务器上执行：

```bash
docker compose \
  -f deploy/compose.prod.yml \
  pull frontend backend
```

然后更新应用：

```bash
docker compose \
  -f deploy/compose.prod.yml \
  up -d --no-deps frontend backend
```

这里有一个重要的安全原则：

**部署时只更新前后端服务，不要随意删除或重建生产 MySQL Volume。**

如果镜像是私有的，服务器还需要使用具有最小 `read:packages` 权限的凭据登录 GHCR。

### 八、第五步：实现自动部署

现在把 CI 和部署连接起来。

我们希望实现：

```text
代码合并 main
      ↓
自动测试
      ↓
构建镜像
      ↓
上传 GHCR
      ↓
等待生产审批
      ↓
SSH 登录服务器
      ↓
拉取镜像
      ↓
更新容器
      ↓
健康检查
```

#### 1. 配置 GitHub Environment

进入仓库：

`Settings → Environments → New environment`

创建：

```text
production
```

建议配置：

- Required reviewers：生产发布审批人。
- Environment secrets：生产部署专用密钥。
- Deployment branches：只允许 `main` 发布。

其中审批保护规则的可用性取决于 GitHub 仓库类型和计划。

#### 2. 配置部署凭据

建议使用独立的部署账号和 SSH 密钥。

需要配置的内容：

| **Secret** | **作用** |
| --- | --- |
| `SSH_HOST` | 服务器地址 |
| `SSH_USER` | 部署账号 |
| `SSH_PRIVATE_KEY` | SSH 私钥 |
| `SSH_KNOWN_HOSTS` | 已验证的服务器主机密钥 |

不要关闭 SSH 主机密钥校验。应通过可信渠道验证服务器的主机密钥指纹，再保存到 GitHub Secret。

部署账号应限制权限，避免给予不必要的 root 权限。

#### 3. 自动部署的核心命令

服务器端可以使用一个部署脚本，接收两个镜像版本：

```bash
#!/usr/bin/env bash
set -Eeuo pipefail

cd /opt/order-system

export FRONTEND_IMAGE="$1"
export BACKEND_IMAGE="$2"

docker compose \
  -f deploy/compose.prod.yml \
  pull frontend backend

docker compose \
  -f deploy/compose.prod.yml \
  up -d --no-deps frontend backend
```

真实部署脚本还应该保存上一版本镜像、执行健康检查，并在发布失败时终止流程。

##### 4. 一个重要的 CI/CD 设计原则

不要让部署 Job 仅仅因为 `main` 有新提交就直接发布。

应该确保：

- CI 已经通过。
- 构建镜像成功。
- 镜像版本和本次提交一致。
- 生产审批通过。
- 生产数据库迁移已经评估。
- 部署后健康检查通过。

在 GitHub Actions 中，可以通过 `needs` 建立 Job 依赖，例如：

```yaml
deploy:
  needs:
    - backend-test
    - frontend-build
    - build-images

  environment: production

  runs-on: ubuntu-latest
```

注意：这些 Job 必须位于同一个 Workflow，或者通过受控的可复用工作流、工作流结果校验进行关联。不同文件中的同名 Job 不会自动形成依赖。

### 九、第六步：发布失败怎么办？

这是 CI/CD 最容易被忽视的部分。

假设：

- 旧版本：V1.0.0。
- 新版本：V1.1.0。
- 新版本部署后，订单创建 API 返回 500。

我们应该如何处理？

#### 发布失败处理流程

**部署 V1.1.0**

**健康检查失败**

订单 API 无法正常工作

**停止后续发布**

记录失败版本和日志

**恢复上一稳定版本**

重新部署 V1.0.0 镜像

**重新验证核心业务**

订单创建、库存预留、取消、发货

这里需要特别注意：

**应用镜像回滚，不等于数据库回滚。**

如果 V1.1.0 修改了数据库结构，旧版本可能无法兼容新结构。

因此生产环境通常采用向后兼容的数据库迁移策略，例如 Expand–Migrate–Contract，避免应用回滚时数据库不兼容。

### 十、本节实战：你来设计 CI/CD 发布策略

假设订单管理系统已经上线，每天都有真实用户创建订单。

开发人员完成了一个新功能，并将代码合并到 `main` 分支。

你作为项目负责人，希望提高发布效率，同时降低生产事故风险。

你认为哪种发布策略最合理？

- A. 自动测试 → 构建版本化镜像 → 发布审批 → 部署 → 健康检查 → 失败时按预案回滚
- B. 每次提交代码后，立即重启生产服务器，不需要测试
- C. 直接登录服务器修改 Python 代码，避免使用 GitHub
- D. 只要 Docker 镜像构建成功，就认为新版本一定可以上线

提交答案，继续学习

#### 十一、第五课学习进度

#### 上线部署与运维学习路线

1. 部署基础与环境规划

已学习

2. Docker 与 Docker Compose

已学习

3. Linux、Nginx 与 HTTPS

已学习

4. 数据库部署、备份与恢复

已学习

5. CI/CD 自动化发布

当前学习

6. 日志、监控与告警
7. 故障处理与版本回滚

#### 本节最重要的四个知识点

1. **CI**：自动检查代码，减少缺陷进入主分支。
2. **镜像版本化**：每次发布都有明确、可追踪的版本。
3. **CD**：将经过验证的镜像自动部署到服务器。
4. **发布回滚**：新版本失败时能够恢复服务，而不是直接修改线上代码。

下一节，我们将学习生产环境日志、Prometheus、Grafana 和告警机制。

重点解决一个真实的运维问题：

> 订单系统已经部署成功，但凌晨突然出现大量订单创建失败。如何在用户投诉之前发现问题，并快速定位是 FastAPI、MySQL、Redis，还是库存业务逻辑出了故障？

这将帮助你从「能够发布软件」进一步提升到「能够持续稳定地运营软件」。

## 对话 32　生产日志监控与告警 {#turn-32}

> **用户**
>
> 第五课 CI/CD 自动化部署实战，我选择 A。请评价，并继续教我生产环境日志、监控、告警和可观测性设计。

**ChatGPT**

回答正确 · CI/CD 实战通过

你选择 A：自动测试 → 构建版本化镜像 → 发布审批 → 部署 → 健康检查 → 失败时按预案回滚。

**完全正确！**

你的判断体现了软件发布的三个核心原则：

- **质量前置**：先测试，再发布。
- **过程可控**：使用明确的镜像版本和发布审批。
- **故障可恢复**：发布失败时有回滚预案。

再补充一点：健康检查通过不代表所有业务都正常。生产发布后，还需要检查订单创建成功率、库存一致性等关键业务指标。

这正是今天要学习的内容。

### 第五课 · 5.6 生产环境日志、监控、告警与可观测性

本节目标：能够发现、定位和解释生产故障

#### 一、先从真实业务问题开始

假设订单管理系统已经上线。

今天凌晨 02:15，发生了以下情况：

- 用户可以正常打开 React 页面。
- FastAPI 服务仍然运行。
- MySQL 数据库可以连接。
- 但是大量用户无法创建订单。
- 订单创建 API 返回 HTTP 500。

这时候：

```bash
docker compose ps
```

可能显示所有容器都在运行。

问题来了：

**容器运行正常，为什么业务仍然失败？**

因为系统正常运行至少包含三个层次：

| **层次** | **要回答的问题** | **示例** |
| --- | --- | --- |
| 基础设施 | 服务器是否正常？ | CPU、内存、磁盘 |
| 应用服务 | API 是否正常？ | 请求量、延迟、错误率 |
| 业务运行 | 用户能否完成操作？ | 订单成功率、库存异常 |

因此，我们不能只监控服务器，还必须监控业务。

#### 二、什么是可观测性？

可观测性（Observability）是指：通过系统产生的数据，理解系统内部正在发生什么。

通常由三个核心部分组成。

**Logs**

日志

**Metrics**

指标

**Traces**

链路追踪

日志告诉你发生了什么；指标告诉你问题有多严重；链路追踪帮助你定位问题发生在哪个环节。

##### 1. Logs：日志

例如：

```json
{
  "timestamp": "2026-11-20T02:15:30Z",
  "level": "ERROR",
  "service": "order-api",
  "request_id": "req-001",
  "event": "order_create_failed",
  "error_code": "DB_LOCK_TIMEOUT",
  "duration_ms": 3200
}
```

从这条日志可以知道：

- 哪个服务出错。
- 什么时间发生。
- 哪个请求出错。
- 错误类型是什么。
- 请求耗时多久。

注意：生产日志不要记录密码、Token、完整支付信息或不必要的用户隐私。

##### 2. Metrics：指标

例如：

```text
订单创建请求数：1000 次/分钟
订单创建失败数：150 次/分钟
失败率：15%
```

指标适合观察趋势、设置阈值和触发告警。

##### 3. Traces：链路追踪

一次订单创建请求可能经过：

```text
React
  ↓
Nginx
  ↓
FastAPI Router
  ↓
OrderService
  ↓
InventoryService
  ↓
MySQL
```

如果请求总耗时 3200ms，我们希望知道时间消耗在哪里。

#### 一次订单请求的耗时分布（示例）

Nginx

20ms

FastAPI

60ms

库存服务

120ms

MySQL

3000ms

教学示例：MySQL 耗时占比最高，应优先调查慢查询、锁等待和连接池。

### 三、第一步：建立订单系统监控指标

监控不是指标越多越好，而是要先回答业务问题。

对于订单系统，建议分为三个层次。

#### 1. 基础设施指标

| **指标** | **作用** |
| --- | --- |
| CPU 使用率 | 发现计算资源瓶颈 |
| 内存使用率 | 发现内存不足 |
| 磁盘使用率 | 避免磁盘写满 |
| 容器重启次数 | 发现进程异常 |
| MySQL 连接数 | 发现数据库连接压力 |

#### 2. 应用指标

| **指标** | **作用** |
| --- | --- |
| HTTP 请求量 | 观察流量 |
| HTTP 5xx 错误率 | 发现服务异常 |
| API P95 延迟 | 发现性能退化 |
| 数据库连接池等待时间 | 发现连接瓶颈 |
| MySQL 锁等待 | 发现事务竞争 |

P95 延迟是什么意思？

假设有 100 次 API 请求，按照耗时从小到大排序。

P95 大致表示 95% 的请求耗时不超过这个值。

如果：

```text
订单创建 API P95 = 3000ms
```

意味着大部分请求在 3 秒内完成，但仍有一部分请求更慢。

#### 3. 业务指标

这是订单系统最重要的一层。

| **指标** | **计算方法** |
| --- | --- |
| 订单创建成功率 | 成功创建请求数 / 有效创建请求数 |
| 库存预留失败率 | 库存预留失败数 / 库存预留尝试数 |
| 订单取消成功率 | 成功取消请求数 / 有效取消请求数 |
| 库存异常数量 | 库存一致性校验发现的异常数 |
| 支付成功率 | 成功支付数 / 有效支付尝试数（如有支付模块） |

这里需要区分：

- 用户库存不足：通常是预期的业务失败。
- 数据库超时：属于系统故障。
- 用户重复提交但幂等处理成功：不应该重复计算为新订单。

因此，业务成功率不能简单等同于 HTTP 2xx 比例。

### 四、第二步：使用 Prometheus + Grafana

我们采用一套常见的开源监控组合。

*原对话配图*　Prometheusとは？詳細情報を解説 \| OSSサポートのOpenStandia™【NRI】

**Prometheus**

定期抓取和存储指标，支持 PromQL 查询和告警规则。

[官方文档](https://prometheus.io/docs/introduction/overview/?utm_source=chatgpt.com)

*原对话配图*　File:Grafana logo.svg - Wikimedia Commons

**Grafana**

将指标、日志和链路数据可视化，并配置告警。

[官方文档](https://grafana.com/docs/grafana/latest/?utm_source=chatgpt.com)

整体架构：

#### 订单系统监控架构

**FastAPI**

业务与 HTTP 指标

**Node Exporter**

服务器指标

**Prometheus**

采集、存储、查询指标

**Grafana**

监控大盘与告警

#### 1. 在 FastAPI 中暴露指标

安装：

```bash
uv add prometheus-fastapi-instrumentator
```

在 `app/main.py` 中：

```python
from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
app = FastAPI()
Instrumentator().instrument(app).expose(
    app,
    endpoint="/metrics"
)
```

启动后访问：

```text
http://backend:8000/metrics
```

会得到 Prometheus 格式的指标。

生产环境应限制 `/metrics` 的访问范围，只允许内部监控服务访问，不要直接暴露到公网。

#### 2. 配置 Prometheus

创建 `deploy/prometheus/prometheus.yml`：

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "order-api"
    metrics_path: /metrics
    static_configs:
      - targets: ["backend:8000"]
```

含义：

每 15 秒从 FastAPI 采集一次指标。

#### 3. Docker Compose 增加监控服务

以下配置添加到现有 Compose 文件的 `services` 中：

```yaml
  prometheus:
    image: prom/prometheus
    volumes:
      - ./deploy/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.path=/prometheus
    restart: unless-stopped

  grafana:
    image: grafana/grafana
    volumes:
      - grafana_data:/var/lib/grafana
    restart: unless-stopped
```

并在顶层 `volumes` 中补充：

```yaml
volumes:
  prometheus_data:
  grafana_data:
```

这里故意没有把 Prometheus 和 Grafana 的端口映射到公网。可以通过 SSH 隧道、VPN 或受身份认证保护的入口访问 Grafana。

实际生产环境还需要固定镜像版本、配置 Grafana 管理员凭据、监控存储保留周期和访问权限。

### 五、第三步：设计订单监控大盘

我们先不追求复杂图表，而是围绕一个核心问题：

**用户现在能否正常创建订单？**

#### 订单系统运行监控

模拟数据 · 最近 15 分钟

异常示例

订单创建成功率

### 85.0%

目标 ≥ 99.5%

API P95 延迟

### 3.2s

目标 ≤ 1s

HTTP 5xx 错误率

### 15%

目标 ≤ 0.5%

库存一致性异常

### 0

目标 = 0

订单 API 请求与失败趋势（模拟）

每分钟请求量与失败数

请求数

失败数

这些数值仅用于演示如何阅读监控大盘，不代表真实系统状态。

你应该首先观察：

- 失败率是否突然升高。
- P95 延迟是否同时升高。
- 问题发生在什么时间。
- 是否与某次版本发布相关。
- 是否存在 MySQL 锁等待或连接池耗尽。

### 六、第四步：设计告警规则

监控大盘需要人主动查看。

但真正的生产运维不能依赖人工一直盯着屏幕。

因此需要告警。

#### 1. 告警分级

| **级别** | **触发条件示例** | **处理方式** |
| --- | --- | --- |
| P0 | 核心订单功能大面积不可用 | 立即响应 |
| P1 | 订单失败率持续升高 | 尽快处理 |
| P2 | API 延迟持续升高 | 工作时段排查 |
| P3 | 资源使用率接近阈值 | 观察并规划容量 |

#### 2. Prometheus 告警规则

例如 HTTP 5xx 错误率持续 5 分钟超过 5%。

```yaml
groups:
  - name: order-api-alerts
    rules:
      - alert: OrderApiHighErrorRate
        expr: |
          (
            sum(rate(http_requests_total{job="order-api",status=~"5.."}[5m]))
            /
            clamp_min(
              sum(rate(http_requests_total{job="order-api"}[5m])),
              1
            )
          ) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "订单 API 5xx 错误率超过 5%"
```

这是示意规则：指标名称和标签必须与实际 FastAPI 指标库暴露的内容匹配。上面的 `http_requests_total` 并不是所有库都会生成的名称。

此外，应增加最小请求量判断，避免低流量时一次失败就触发高错误率告警。

#### 3. 告警通知渠道

常见渠道：

- 邮件。
- 企业微信机器人。
- 飞书机器人。
- Slack。
- PagerDuty 等值班系统。

例如：

```text
[生产告警] 订单创建失败率异常

时间：02:15
环境：Production
服务：order-api
失败率：15%
阈值：5%
持续时间：5 分钟

建议检查：
1. 最近部署记录
2. FastAPI 错误日志
3. MySQL 锁等待
4. 数据库连接池
```

一个好的告警不仅告诉你「出问题了」，还应该告诉你「应该先检查什么」。

### 七、第五步：如何定位真实生产故障？

现在回到开头的场景：

凌晨 02:15，订单创建 API 大量返回 500。

我们按照以下顺序排查。

#### 订单故障排查流程

1. **确认影响范围**

只有创建订单失败，还是所有 API 都失败？

2. **查看监控指标**

错误率、延迟、请求量是否异常？

3. **定位错误日志**

通过 request\_id 找到失败请求和异常信息

4. **查看链路耗时**

问题发生在 FastAPI、库存服务还是 MySQL？

5. **核对最近变更**

是否刚发布版本或执行数据库迁移？

6. **恢复业务并复盘**

修复或回滚，验证核心业务，记录根因

##### 常用排查命令

查看后端日志：

```bash
docker compose logs --since=15m backend
```

查看 MySQL 日志：

```bash
docker compose logs --since=15m mysql
```

查看容器资源：

```bash
docker stats
```

查看 MySQL 当前事务：

```sql
SELECT *
FROM information_schema.innodb_trx;
```

查看正在执行的 SQL：

```sql
SHOW FULL PROCESSLIST;
```

查看 InnoDB 状态：

```sql
SHOW ENGINE INNODB STATUS;
```

这些命令可以帮助发现锁等待、长事务和连接压力。

但不要仅凭某一条日志就认定根因，要结合指标、链路和数据库证据交叉验证。

### 八、本节实战：判断应该优先检查什么

现在有一个生产故障：

- React 页面正常。
- Nginx 正常。
- FastAPI `/health` 返回 200。
- 订单创建成功率从 99.9% 下降到 70%。
- API P95 延迟从 200ms 升高到 3000ms。
- MySQL 锁等待数量明显上升。

你认为最合理的排查方向是什么？

- A. 优先排查 MySQL 锁等待、长事务、订单与库存更新 SQL，并结合日志和链路追踪定位原因
- B. 优先修改 React 页面颜色
- C. 直接重装 Linux 服务器
- D. 因为 /health 返回 200，所以系统一定正常，无需处理

提交答案，继续学习

#### 九、第五课学习进度

#### 上线部署与运维学习路线

1. 部署基础与环境规划

已学习

2. Docker 与 Docker Compose

已学习

3. Linux、Nginx 与 HTTPS

已学习

4. 数据库部署、备份与恢复

已学习

5. CI/CD 自动化发布

已学习

6. 日志、监控、告警与可观测性

当前学习

7. 故障处理与版本回滚

**本节最重要的知识：**

- Logs：定位具体错误。
- Metrics：发现异常趋势。
- Traces：定位跨服务的性能瓶颈。
- Alerts：在用户投诉前发现问题。
- 业务监控：判断真实用户是否能够正常完成操作。

下一节我们将完成第五课最后一部分：**生产故障处理、版本回滚和事故复盘**。

届时，你将把需求、开发、测试、部署、监控和故障处理连接成一个完整的软件工程闭环。

## 对话 33　故障处理与版本回滚 {#turn-33}

> **用户**
>
> 第五课生产监控与可观测性实战，我选择 A。请评价，并继续教我生产故障处理、版本回滚和事故复盘。

**ChatGPT**

回答正确 · 监控与故障定位实战通过

你选择 A：优先排查 MySQL 锁等待、长事务、订单与库存更新 SQL，并结合日志和链路追踪定位原因。

**完全正确！**

你的判断已经不只是看「哪个服务挂了」，而是开始根据监控证据定位故障。

#### 一、评价你的答案

我们回顾题目中的证据：

| **监控现象** | **说明** |
| --- | --- |
| React 页面正常 | 前端可以访问 |
| Nginx 正常 | 代理入口基本可用 |
| FastAPI `/health` 返回 200 | 应用进程仍然可以响应 |
| 订单成功率从 99.9% 降到 70% | 核心业务严重异常 |
| API P95 从 200ms 升到 3000ms | 请求性能明显下降 |
| MySQL 锁等待明显上升 | 数据库事务竞争值得优先调查 |

你选择 MySQL 作为优先排查方向，是因为**多项证据同时指向数据库事务问题**。

但注意：

MySQL 锁等待上升不一定意味着数据库本身有缺陷，也可能是 FastAPI 中的事务设计不合理，例如：

- 事务执行时间过长。
- 多个请求同时更新相同库存。
- SQL 缺少合适索引。
- 事务中执行了不必要的外部 API 调用。

因此要从业务代码、SQL 和数据库运行状态三个层面共同分析。

### 第五课 · 5.7 生产故障处理、版本回滚与事故复盘

第五课最后一节

#### 二、学习目标

假设你负责的订单管理系统已经上线。

今天上午 10:00，发布了 V1.1.0 版本。

10:05，监控系统触发告警：

- 订单创建失败率达到 30%。
- MySQL 锁等待时间明显上升。
- 大量订单创建 API 返回 500。
- 客户开始反馈无法下单。

这时你应该做什么？

很多开发人员的第一反应是：

「赶紧找到 Bug，修改代码，再发布一个版本。」

但生产事故处理的正确思路通常是：

**先控制影响、恢复业务，再深入调查根因。**

这是今天最重要的原则。

#### 三、第一步：建立生产事故处理流程

#### 生产事故应急处理流程

1. **发现事故**

监控告警、用户反馈、业务指标异常

2. **确认影响**

影响哪些功能、多少用户、是否涉及数据错误

3. **控制影响**

暂停发布、限流、关闭故障功能或隔离异常流量

4. **恢复服务**

回滚应用、修复配置或采取经过验证的缓解措施

5. **验证恢复**

检查技术指标和核心业务流程

6. **事故复盘**

分析根因、改进测试和监控、跟踪整改

这个流程不要求所有步骤严格串行。例如，在控制影响的同时就可以收集日志和证据。

关键是不要为了追求根因分析的完整性，延误业务恢复。

#### 四、第二步：如何判断事故等级？

事故等级一般由影响范围、持续时间、数据损失和业务重要性共同决定。

下面是一套教学用分级标准。

| **等级** | **典型情况** | **响应方式** |
| --- | --- | --- |
| P0 | 核心业务全面不可用、严重数据损坏 | 立即启动最高级别应急 |
| P1 | 大量用户下单失败、核心功能明显受损 | 立即处理 |
| P2 | 部分功能异常、影响有限 | 尽快修复 |
| P3 | 轻微问题、不影响核心业务 | 纳入正常迭代 |

对于本次事故：

订单失败率达到 30%，且发生在正式生产环境，通常至少应按 **P1 严重事故** 处理。

如果还发现库存超卖、订单丢失或资金数据错误，则可能需要升级为 P0。

实际等级应遵循团队事先制定的事故响应标准，而不是仅凭单一百分比决定。

### 五、第三步：故障发生后，前 15 分钟做什么？

我们用一条模拟时间线理解。

#### 订单系统事故响应时间线

1. **10:05 · 收到告警**

P1

确认订单失败率 30%，记录事故开始时间。

2. **10:07 · 确认影响**

检查订单创建、库存预留、取消订单是否异常，核对数据一致性风险。

3. **10:09 · 暂停发布**

冻结新的生产部署，避免其他变更干扰排查。

4. **10:11 · 评估回滚**

确认故障是否与 V1.1.0 发布相关，检查旧版本与当前数据库结构是否兼容。

5. **10:15 · 执行恢复措施**

若确认可安全回滚，恢复 V1.0.0；否则采用限流、功能开关或其他安全缓解措施。

6. **10:20 · 验证业务恢复**

检查订单成功率、API 延迟、库存一致性和错误日志。

时间均为模拟示例，不代表所有事故必须在相同时间内完成。

这里要理解一个重要区别：

**恢复服务不等于事故结束。**

如果 API 恢复了，但已经产生 100 笔异常订单，仍然需要核对和修复这些业务数据。

### 六、第四步：使用 Docker Compose 回滚应用版本

前面我们学习了使用 Git Commit SHA 标记 Docker 镜像。

例如：

| **版本** | **镜像标签** | **状态** |
| --- | --- | --- |
| V1.0.0 | `a1b2c3d` | 上一稳定版本 |
| V1.1.0 | `e4f5g6h` | 当前故障版本 |

假设我们的生产 Compose 文件使用：

```yaml
services:
  frontend:
    image: ${FRONTEND_IMAGE}

  backend:
    image: ${BACKEND_IMAGE}
```

生产环境通过部署配置文件指定镜像版本。

#### 1. 查看当前版本

```bash
docker compose \
  -f deploy/compose.prod.yml \
  ps
```

查看容器镜像：

```bash
docker inspect \
  --format='{{.Config.Image}}' \
  "$(docker compose -f deploy/compose.prod.yml ps -q backend)"
```

#### 2. 恢复上一稳定版本

假设已确认 V1.0.0 与当前数据库兼容。

在部署目录中设置旧镜像：

```bash
export BACKEND_IMAGE=ghcr.io/example/order-backend:a1b2c3d

export FRONTEND_IMAGE=ghcr.io/example/order-frontend:a1b2c3d
```

拉取旧镜像：

```bash
docker compose \
  -f deploy/compose.prod.yml \
  pull frontend backend
```

重新创建应用容器：

```bash
docker compose \
  -f deploy/compose.prod.yml \
  up -d --no-deps --force-recreate frontend backend
```

这里 `--no-deps` 可以避免顺带重新创建 MySQL、Redis 等依赖服务。

但仍需要确认部署配置中的网络、Volume、环境变量等与上一稳定版本兼容。

##### 3. 回滚后验证

检查健康接口：

```bash
curl -fsS https://order.example.com/api/health
```

查看错误日志：

```bash
docker compose \
  -f deploy/compose.prod.yml \
  logs --tail=100 backend
```

然后验证：

- 订单创建是否恢复。
- 库存预留是否正确。
- 订单取消是否恢复库存。
- 是否仍然存在异常订单。
- 错误率和延迟是否回到正常范围。

需要特别注意：**不要为了回滚应用，直接执行** `docker compose down -v` **或恢复旧数据库备份。** 这可能导致真实订单数据丢失。

### 七、第五步：为什么数据库迁移会让回滚变复杂？

假设 V1.1.0 发布时执行：

```sql
ALTER TABLE orders
DROP COLUMN status;
```

但是 V1.0.0 的代码仍然依赖：

```python
order.status
```

此时即使回滚 Docker 镜像，旧代码也可能无法运行。

这说明：

**应用版本和数据库结构之间存在兼容性关系。**

推荐采用 Expand–Migrate–Contract 迁移策略。

#### 安全数据库变更流程

1. **Expand：扩展**

先增加新字段或新表，保留旧结构。

2. **Migrate：迁移**

让新旧版本兼容，逐步迁移历史数据和读写逻辑。

3. **Contract：收缩**

确认不再依赖旧结构后，再删除旧字段。

例如将 `orders.status` 改为 `orders.order_status`：

不要第一步就删除 `status`。

可以先增加 `order_status`，让代码在过渡期兼容，再逐步迁移数据和读取逻辑，最后在确认回滚窗口结束后删除旧字段。

对于订单、库存等核心业务表，删除字段前必须评估数据备份、回滚和兼容性。

### 八、第六步：如何做事故复盘？

生产故障恢复后，不能只说一句：

「Bug 已经修好了。」

必须分析为什么发生、为什么没提前发现、以后如何避免。

这就是事故复盘（Postmortem）。

#### 1. 一份完整的事故复盘报告

#### 订单创建失败事故复盘示例

INC-20261120-001

模拟案例

**事故概况**

- 事故等级：P1。
- 开始时间：10:05。
- 恢复时间：10:20。
- 持续时间：15 分钟。
- 影响功能：订单创建。

**事故现象**

订单创建失败率升至 30%，MySQL 锁等待明显增加。

**根因分析（假设经证据确认）**

V1.1.0 在库存预留事务中增加了耗时操作，导致事务持锁时间增加，并发请求大量等待。

**恢复措施**

- 暂停后续发布。
- 回滚到 V1.0.0。
- 检查异常订单和库存数据。
- 确认核心业务恢复正常。

**后续整改**

- 缩短库存事务范围。
- 增加并发下单性能测试。
- 增加 MySQL 锁等待告警。
- 增加发布后订单成功率验证。

##### 2. 使用 5 Whys 分析根因

5 Whys 是一种通过连续追问「为什么」寻找系统性原因的方法。

1. **为什么用户无法创建订单？**

因为订单创建请求大量超时。

2. **为什么订单创建请求超时？**

因为库存更新等待数据库锁。

3. **为什么数据库锁等待严重？**

因为新版本事务持锁时间过长。

4. **为什么新版本事务时间变长？**

因为事务内部增加了耗时操作。

5. **为什么上线前没有发现？**

因为缺少足够真实的并发测试和数据库锁等待监控。

注意：这些是用于教学的假设性结论。真实事故中，每一层原因都应有日志、SQL、Trace、变更记录等证据支持。

事故复盘的目的不是寻找某个人承担责任，而是改进系统和流程。

### 九、第七步：把事故复盘转化为改进任务

一次事故如果没有形成整改闭环，就很容易重复发生。

建议将复盘结果拆成可执行任务。

| **整改任务** | **验收标准** | **优先级** |
| --- | --- | --- |
| 优化库存事务 | 不在持锁事务中执行外部耗时调用 | P1 |
| 增加并发测试 | 目标并发下无超卖、无异常死锁 | P1 |
| 增加锁等待监控 | 异常持续时自动告警 | P1 |
| 增加发布后冒烟测试 | 自动验证订单创建和库存预留 | P1 |
| 完善回滚脚本 | 能在演练环境恢复上一稳定版本 | P2 |

这样就形成一个完整的工程闭环：

#### 软件工程持续改进闭环

需求分析

系统设计

编码实现

测试验证

上线部署

监控与事故处理

复盘改进 → 下一轮需求

### 十、第五课综合实战题

现在你作为订单系统负责人，遇到了以下情况：

上午 10:00 发布 V1.1.0。

10:05，订单创建失败率达到 30%。

排查发现，新版本存在严重事务问题。

同时，V1.1.0 已经执行数据库迁移，删除了 V1.0.0 依赖的字段。

你认为最合理的处理方式是什么？

- A. 先控制影响，检查数据库兼容性，选择安全恢复方案；恢复后验证业务并完成事故复盘
- B. 直接回滚 Docker 镜像到 V1.0.0，不需要考虑数据库结构
- C. 直接恢复昨天的数据库备份，覆盖所有新订单
- D. 不处理事故，等待用户重新提交订单

提交答案，完成第五课

#### 十一、第五课学习进度

#### 上线部署与运维学习路线

1. 部署基础与环境规划

已学习

2. Docker 与 Docker Compose

已学习

3. Linux、Nginx 与 HTTPS

已学习

4. 数据库部署、备份与恢复

已学习

5. CI/CD 自动化发布

已学习

6. 日志、监控、告警与可观测性

已学习

7. 故障处理、版本回滚与事故复盘

当前学习

**本节最重要的三个原则：**

1. **先恢复业务，再深入调查根因。**
2. **应用回滚前，必须确认数据库和配置兼容性。**
3. **每次事故都应该转化为可验证的工程改进。**

完成这道题后，我们就可以总结第五课，进入软件开发生命周期的最后一个阶段：**软件运营与持续迭代**。

## 对话 34　部署运维综合实战 {#turn-34}

> **用户**
>
> 第五课生产故障处理综合实战，我选择 A。请评价我的判断，总结第五课，并带我进入第六课软件运营与持续迭代。

**ChatGPT**

回答正确 · 第五课综合实战通过

你选择 A：先控制影响，检查数据库兼容性，选择安全恢复方案；恢复后验证业务并完成事故复盘。

**完全正确！第五课全部核心知识点已经学习完成。**

#### 一、评价你的判断

这道题比之前的回滚题更复杂，因为它同时涉及两个问题：

1. V1.1.0 的应用代码存在严重事务问题。
2. V1.1.0 已经修改数据库结构，删除了旧版本依赖的字段。

因此，不能直接把 Docker 镜像回滚到 V1.0.0。

你的思路正确，主要体现在三个方面：

| **判断** | **评价** |
| --- | --- |
| 先控制事故影响 | 正确，避免影响继续扩大 |
| 检查数据库兼容性 | 非常关键，避免回滚后旧代码无法运行 |
| 恢复后验证和复盘 | 正确，确保业务真正恢复并防止复发 |

这里再深入一步：

如果数据库字段已经被删除，可以考虑：

- 从备份或其他可靠数据源恢复字段及数据。
- 编写兼容性修复迁移。
- 修复 V1.1.0 的事务问题，发布紧急修复版本。
- 在必要时使用经过验证的兼容版本，而不是盲目回滚。

如果数据库变更涉及数据丢失，还要评估 Binlog 时间点恢复、数据补偿和业务对账。

**你的进步：你已经开始从单纯的技术操作，转向考虑系统整体的可恢复性。**

### 二、第五课总结：上线部署与运维

这一课我们以 React + FastAPI + MySQL 订单系统为案例，完成了从本地开发到生产运行的学习。

#### 1. 完整知识地图

#### 第五课知识体系

1. **部署基础与环境规划**

开发环境、测试环境、生产环境、部署架构

2. **Docker 与 Docker Compose**

镜像、容器、网络、Volume、多服务编排

3. **Linux、Nginx 与 HTTPS**

SSH、服务器、防火墙、反向代理、TLS 证书

4. **数据库部署、备份与恢复**

mysqldump、Volume、Binlog、PITR、RPO、RTO

5. **CI/CD 自动化发布**

GitHub Actions、GHCR、自动测试、镜像构建、部署、回滚

6. **监控与可观测性**

Logs、Metrics、Traces、Prometheus、Grafana、告警

7. **生产故障处理**

事故分级、故障定位、版本回滚、事故复盘

#### 2. 你现在应该具备的能力

| **能力** | **学习成果** |
| --- | --- |
| 软件部署 | 理解如何将应用部署到 Linux |
| 容器化 | 理解如何使用 Docker 管理服务 |
| 网络配置 | 理解 Nginx、DNS、HTTPS |
| 数据安全 | 理解数据库备份和恢复 |
| 自动发布 | 理解 GitHub Actions CI/CD |
| 运行监控 | 理解指标、日志、链路追踪 |
| 故障恢复 | 理解回滚和事故复盘 |

需要区分：目前你已经完成了这些主题的学习和设计练习，但还需要在真实项目中实际执行、验证，才能算具备独立生产运维能力。

#### 3. 第五课最重要的工程认知

我希望你记住一句话：

**软件上线不是开发工作的终点，而是软件进入真实业务环境的起点。**

一个合格的软件系统不仅需要：

- 能运行。
- 能处理业务。
- 能通过测试。

还需要：

- 能部署。
- 能持续运行。
- 能发现异常。
- 能恢复故障。
- 能不断改进。

这也是为什么我们要进入第六课。

### 第六课：软件运营与持续迭代

正式进入第六课

第一课：运营基础与指标体系

前五课，我们学习的是如何把一个软件系统开发出来并成功上线。

第六课，我们要解决一个新的问题：

**软件上线之后，如何知道它是否真正解决了用户的问题？又应该如何根据用户反馈持续改进？**

这是从软件开发工程师走向具备产品思维的软件系统负责人的重要一步。

#### 三、第六课学习路线

本课程仍然使用订单管理系统作为贯穿案例。

#### 软件运营与持续迭代路线

1. **运营基础与指标体系**

当前学习

用户价值、业务目标、KPI、使用数据

2. **用户反馈与需求收集**

用户访谈、反馈分类、问题识别

3. **数据分析与问题诊断**

使用行为、转化率、异常分析、根因定位

4. **需求优先级与迭代规划**

MoSCoW、RICE、版本规划

5. **软件版本迭代与灰度发布**

A/B 测试、灰度发布、效果验证

6. **运营复盘与持续改进**

PDCA、目标达成率、迭代复盘

### 四、第一课：理解软件运营

#### 1. 软件开发和软件运营有什么区别？

假设我们开发了一套订单管理系统。

开发阶段，我们关注：

- 订单能不能创建？
- 库存能不能正确扣减？
- 页面能不能正常显示？
- 接口有没有 Bug？

但是系统上线后，用户可能提出：

- 创建订单太麻烦。
- 查找订单需要很多步骤。
- 库存经常不准确。
- 每天需要手工统计订单。
- 系统虽然能用，但没有提高工作效率。

你会发现：

**软件功能正常，不代表软件真正创造了业务价值。**

对比一下：

| **软件开发** | **软件运营** |
| --- | --- |
| 实现订单创建功能 | 提高订单创建效率 |
| 实现订单查询功能 | 降低订单查询时间 |
| 实现库存管理功能 | 降低库存错误率 |
| 实现数据统计功能 | 帮助管理者发现经营问题 |
| 修复系统 Bug | 持续提升用户满意度 |

软件开发解决的是「功能能不能实现」。

软件运营解决的是「功能有没有产生价值」。

#### 2. 软件运营的核心闭环

我们可以把软件运营理解为一个循环：

#### 软件运营闭环

**用户使用软件**

产生真实业务行为

**收集数据和反馈**

行为数据、用户意见、异常记录

**分析问题**

发现使用障碍和业务损失

**制定迭代方案**

功能优化、流程调整、性能改善

**验证改进效果**

判断是否真正解决问题

进入下一轮迭代

这个闭环可以用 PDCA 思想来理解：

- Plan：制定改进计划。
- Do：执行改进。
- Check：检查效果。
- Act：标准化有效做法，继续改进。

### 五、第二步：建立软件运营指标体系

这是本节最重要的知识。

假设订单管理系统已经上线一个月。

老板问你：

「这个系统上线之后，效果怎么样？」

如果你回答：

「系统运行正常，没有什么 Bug。」

这个回答是不够的。

因为老板真正关心的是：

- 工作效率有没有提升？
- 订单处理是否更快？
- 库存错误是否减少？
- 用户是否愿意继续使用？

因此，我们需要建立 KPI 指标体系。

#### 1. 从业务目标提炼 KPI

我们先确定一个业务目标：

**提高订单处理效率。**

然后拆解成可以衡量的指标。

| **业务目标** | **KPI** | **计算方法** |
| --- | --- | --- |
| 提高处理效率 | 平均订单处理时长 | 总处理耗时 / 完成订单数 |
| 降低人工成本 | 人均订单处理量 | 完成订单数 / 人数 |
| 降低错误 | 订单错误率 | 错误订单数 / 总订单数 |
| 提升使用效果 | 功能使用率 | 使用某功能的用户数 / 活跃用户数 |
| 提升体验 | 任务完成率 | 成功完成任务数 / 开始任务数 |

注意：每个指标都要明确统计口径、时间范围、分母和数据来源，否则不同人计算出来的 KPI 可能不一致。

#### 2. 建立四层指标体系

我建议将订单管理系统的运营指标分为四层。

**第一层：业务结果指标**

### 业务效率、成本、质量

最终是否创造业务价值

**第二层：用户行为指标**

#### 活跃用户、功能使用率、任务完成率

用户是否真正使用系统

**第三层：产品体验指标**

#### 操作时长、错误率、满意度

用户使用是否顺畅

**第四层：技术运行指标**

#### 可用性、响应时间、异常率

系统是否稳定可靠

这里要注意：四层指标之间不是简单的因果关系。技术稳定是业务价值的基础，但技术指标改善并不必然意味着业务效率提升。

#### 3. 什么是北极星指标？

北极星指标（North Star Metric）是用来衡量产品是否持续创造核心价值的关键指标。

对于订单管理系统，可以考虑：

**每周成功完成的有效订单处理量。**

为什么不是简单看登录次数？

因为用户登录系统，不代表真正完成了业务工作。

我们更关注用户是否通过系统成功完成了核心任务。

例如：

#### 订单系统核心运营指标示例

每周有效完成订单

### 2,500

订单任务完成率

### 96%

平均处理时长

### 2.5 分钟

订单错误率

### 0.8%

教学模拟数据，非真实系统数据。

北极星指标也不能单独使用。例如完成订单量上升，但错误率也大幅上升，就不能简单认为产品变好了。

### 六、第三步：从指标发现运营问题

现在进入真正的分析环节。

假设订单管理系统上线一个月后，出现以下情况：

| **指标** | **上线前** | **上线后** |
| --- | --- | --- |
| 平均订单处理时长 | 8 分钟 | 5 分钟 |
| 订单错误率 | 3% | 2% |
| 每周活跃用户 | 50 人 | 45 人 |
| 订单创建成功率 | 99% | 99.5% |

我们可以发现：

- 订单处理效率提升了。
- 订单错误率下降了。
- 但活跃用户减少了。

这说明什么？

可能存在几种情况：

1. 一部分用户不习惯新系统。
2. 用户仍然使用 Excel 或其他工具。
3. 某些功能不符合实际业务流程。
4. 部分用户的工作职责发生了变化。

不能直接认定用户减少就是产品失败，也不能因为效率提升就忽略采用率下降。

我们需要继续收集用户反馈和使用行为数据。

这就是下一节要学习的内容。

### 七、第一课实战：你来分析运营问题

现在给你一个真实业务场景。

某企业上线订单管理系统，运营一个月后，发现：

**运营数据**

| **指标** | **上线前** | **上线后** |
| --- | --- | --- |
| 平均订单处理时间 | 10 分钟 | 6 分钟 |
| 订单错误率 | 4% | 2% |
| 每周活跃用户 | 100 人 | 60 人 |
| 系统可用性 | — | 99.9% |

需要分析

**老板提出的问题：**

「订单处理效率提高了，错误率也下降了，但为什么使用系统的人越来越少？这个系统到底算不算成功？」

请判断你认为最合理的分析思路。

- A. 先确认用户减少的原因，分析用户行为、功能使用情况和实际业务流程，再判断是否需要优化产品
- B. 系统可用性达到 99.9%，说明系统成功，不需要进一步分析
- C. 直接增加更多功能，吸引用户使用
- D. 因为用户减少，所以立即认定系统失败，重新开发

提交答案，继续学习

#### 八、本课学习成果检查

这一课希望你建立三个认知：

1. 软件上线不等于产品成功。
2. 运营需要从业务目标提炼可衡量的指标。
3. 指标异常只是问题线索，还需要结合用户行为和业务场景分析原因。

#### 第六课学习进度

1. 运营基础与指标体系

当前学习

2. 用户反馈与需求收集
3. 数据分析与问题诊断
4. 需求优先级与迭代规划
5. 版本迭代与灰度发布
6. 运营复盘与持续改进

**接下来的学习重点：从技术交付思维转向业务价值思维。**

不仅要知道软件有没有运行，还要知道用户为什么使用、为什么不使用，以及下一次应该改进什么。
