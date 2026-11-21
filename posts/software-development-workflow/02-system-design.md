---
title: "第二课　系统设计"
outline: 2
prev:
  text: "第一课　需求分析"
  link: /posts/software-development-workflow/01-requirements
next:
  text: "第三课　编码实现"
  link: /posts/software-development-workflow/03-implementation
---

# 第二课　系统设计

[返回总目录](/posts/software-development-workflow)

## 对话 07　需求分析测验与架构设计 {#turn-07}

> **用户**
>
> 需求分析综合测验：1.A，2.B，3.A。请批改并开始第二课系统设计。

**ChatGPT**

### 第二课：系统设计

第一课综合测验：3/3 全部正确

你的答案全部正确：

| **题目** | **你的答案** | **评价** |
| --- | --- | --- |
| 1. 自动同步订单前应该做什么？ | A | 正确，先理解业务和数据来源 |
| 2. 自动同步订单属于什么？ | B | 正确，属于功能需求 |
| 3. 如何编写验收标准？ | A | 正确，描述可验证的业务结果 |

**第一课正式完成！**

你现在已经掌握了从业务问题到功能需求，再到验收标准的基本方法。

接下来进入软件工程中非常重要的一环：系统设计。

#### 一、系统设计到底是什么？

先理解一个概念：

**需求分析回答：系统要做什么？**

**系统设计回答：系统应该如何组织，才能完成这些事情？**

例如，我们已经确定要开发一个订单管理系统，具备：

- 订单登记和查询
- 库存查询与预留
- 订单状态管理
- 发货登记
- 超时提醒

但是这些功能应该放在一个模块中，还是拆分成多个模块？

前端和后端如何通信？

订单和库存数据如何存储？

并发情况下如何防止超卖？

这些都是系统设计需要解决的问题。

#### 二、系统设计的五个层次

第 1 层

**系统架构设计**

整个系统由哪些部分组成？

例如：前端、后端、数据库、缓存、任务调度。

第 2 层

**模块设计**

系统应该拆分成哪些业务模块？

例如：订单模块、库存模块、发货模块。

第 3 层

**数据库设计**

业务数据应该如何组织？

例如：订单表、订单明细表、库存表。

第 4 层

**接口设计**

不同模块如何交换数据？

例如：创建订单 API、查询库存 API。

第 5 层

**技术设计**

每个问题具体采用什么技术解决？

例如：React、FastAPI、MySQL、Redis、Celery。

这五个层次不是严格的先后顺序，实际项目中经常需要反复调整。

#### 三、实战：设计订单管理系统架构

我们采用一个适合小型团队的技术方案：

- 前端：React + TypeScript
- 后端：Python + FastAPI
- 数据库：MySQL
- 缓存：Redis
- 定时任务：Celery + Beat

##### 1. 整体架构图

#### 订单管理系统架构 V1.0

**前端应用**

React + TypeScript

订单页面 / 库存页面 / 发货页面

HTTP / REST API

**后端应用**

Python + FastAPI

订单模块

库存模块

发货模块

用户权限模块

**MySQL**

订单、库存、用户数据

**Redis**

缓存、任务队列

**后台任务系统**

Celery + Beat

定时检查超时订单、发送提醒

##### 2. 用户操作是如何经过系统的？

例如员工点击「创建订单」：

1. **React 前端**

用户填写订单信息，点击提交。

2. **FastAPI 后端**

接收请求，校验订单参数。

3. **订单模块**

检查订单数据和业务规则。

4. **库存模块**

检查并原子性地预留库存。

5. **MySQL**

在事务中保存订单及库存变更。

6. **返回前端**

告知用户订单创建成功或失败。

这里有一个重要知识：

**系统架构不只是选择技术，还要明确每个组件的职责和协作关系。**

##### 3. 为什么不直接采用微服务架构？

对于每天约 200 个订单的小型电商公司，初期更推荐：

推荐

 **模块化单体架构（Modular Monolith）**

它的特点：

- 一个后端应用。
- 内部按业务拆分模块。
- 统一部署和管理。
- 模块之间保持清晰的边界。

相比微服务，它减少了网络通信、分布式事务、服务治理和部署运维的复杂度。

以后业务规模扩大，再考虑拆分服务。

#### 四、第一课时实战：选择合适的架构

假设订单管理系统需要新增一个功能：

> 每隔 5 分钟检查一次所有订单，找出超过 24 小时还未发货的订单，并提醒负责人。

你认为这个功能应该如何设计？

**选择最合理的架构方案：**

- A. 使用 Celery Beat 定时触发 Celery Worker，查询 MySQL 并发送提醒
- B. 用户每次打开订单页面时，前端自动扫描所有订单
- C. 每个用户登录时启动一个定时任务
- D. 每隔 5 分钟重启一次 FastAPI 服务

提交答案，继续第二课

#### 五、第二课的完整学习计划

| **课程** | **学习内容** | **实践成果** |
| --- | --- | --- |
| 2.1 | 整体架构设计 | 系统架构图 |
| 2.2 | 模块拆分 | 模块职责图 |
| 2.3 | 数据库设计 | ER 图、表结构 |
| 2.4 | 接口设计 | API 文档 |
| 2.5 | 技术方案设计 | 技术设计说明书 |
| 2.6 | 架构评审 | 完整系统设计方案 |

**本课最终目标：** 你能够独立拿到一份需求说明书，设计出一套可以交给开发人员实施的软件系统架构。

我们继续采用一题一讲、一步一步实战的学习方式。

## 对话 08　系统架构与模块设计 {#turn-08}

> **用户**
>
> 第二课系统设计第一道实战题，我选择 A。请评价，并继续讲解模块设计。

**ChatGPT**

回答正确

你选择 A：使用 Celery Beat 定时触发 Celery Worker，查询 MySQL 并发送提醒。

这是合理的方案。你已经开始从系统整体角度考虑组件之间的职责分工了。

不过，还需要理解一个重要区别：

- Celery Beat：负责决定什么时候执行任务。
- Celery Worker：负责真正执行任务。
- Redis：可以作为任务消息队列。
- MySQL：保存订单及订单状态。
- FastAPI：提供业务接口。

例如：

**Celery Beat**

每 5 分钟触发一次

**Redis**

传递任务消息

**Celery Worker**

执行超时订单检查任务

**MySQL**

查询订单状态和支付时间

**发送提醒**

通知订单负责人

实际开发还要考虑重复提醒、任务重试、时区、任务执行失败等问题。

### 第二课 · 2.2 模块设计

系统设计 · 第二个知识点

#### 一、什么是模块设计？

假设客户要开发一个订单管理系统。

如果把所有代码都写在一个文件里：

```python
# main.py
def create_order():
    pass
def check_stock():
    pass
def ship_order():
    pass
def send_notification():
    pass
def calculate_profit():
    pass
```

刚开始可能很方便，但随着功能增加，就会出现：

- 代码越来越难维护。
- 不同业务逻辑相互依赖。
- 修改一个功能可能影响其他功能。
- 多人开发时容易产生代码冲突。

因此，我们需要把系统按照业务职责拆分成不同模块。

**模块设计的本质：把复杂系统拆分成职责清晰、边界明确、相互协作的部分。**

#### 二、订单管理系统应该拆分哪些模块？

我们先从业务角度分析。

**订单管理系统**

核心业务系统

**订单模块**

订单创建、查询、状态

**库存模块**

库存查询、预留、释放

**发货模块**

出库、物流、发货

**用户模块**

用户、角色、权限

**通知模块**

超时提醒、消息记录

**统计模块**

订单统计、经营报表

这些模块不是随意拆分的，而是根据业务职责拆分的。

例如：

| **模块** | **负责什么** | **不负责什么** |
| --- | --- | --- |
| 订单模块 | 创建、查询、订单状态 | 直接操作库存规则 |
| 库存模块 | 库存预留、释放、扣减 | 订单页面展示 |
| 发货模块 | 出库、物流、发货状态 | 库存报表 |
| 用户模块 | 身份、角色、权限 | 订单业务计算 |
| 通知模块 | 消息发送和记录 | 判断订单是否超时 |

注意：订单模块可以调用库存模块，但不应该绕过库存模块直接修改库存数据。

这叫做**模块职责边界**。

#### 三、模块之间如何协作？

我们以创建订单为例：

#### 订单创建流程

1. **订单模块**

接收创建订单请求。

2. **库存模块**

校验并预留商品库存。

3. **订单模块**

保存订单和订单明细。

4. **通知模块**

根据业务规则发送订单通知。

这里引出一个重要概念：

**高内聚、低耦合。**

- 高内聚：一个模块内部的功能围绕同一业务职责。
- 低耦合：模块之间尽量减少不必要的依赖。

例如，库存模块负责所有库存操作，订单模块通过明确的接口调用它，而不是自己实现一套库存扣减逻辑。

#### 四、模块设计如何落到代码目录？

结合你熟悉的 Python + FastAPI，可以采用这样的项目结构：

```text
order-system/
├── app/
│   ├── main.py
│   ├── modules/
│   │   ├── order/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   └── schemas.py
│   │   ├── inventory/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   └── schemas.py
│   │   ├── shipment/
│   │   ├── user/
│   │   └── notification/
│   ├── tasks/
│   │   └── order_tasks.py
│   ├── common/
│   └── database/
├── tests/
├── requirements.txt
└── README.md
```

每个文件的职责：

| **文件** | **职责** |
| --- | --- |
| router.py | 接收 HTTP 请求 |
| service.py | 实现业务逻辑 |
| repository.py | 负责数据库访问 |
| schemas.py | 定义请求和响应的数据结构 |

这里又有一个概念：分层架构。

例如：

```text
Router → Service → Repository → Database
```

- Router：处理请求。
- Service：处理业务。
- Repository：处理数据访问。
- Database：存储数据。

注意，业务模块划分与代码分层是两个不同维度：前者解决业务职责，后者解决代码职责。

### 五、实战练习：你来设计模块

现在客户提出一个新需求：

> 订单取消后，系统需要自动释放此前预留的商品库存。

请思考：

**你认为释放库存的业务逻辑应该由哪个模块负责？**

- A. 库存模块，统一管理库存预留、释放和扣减
- B. 订单模块，直接修改库存数据库字段
- C. 用户模块，用户取消订单时修改库存
- D. 通知模块，发送取消消息时顺便修改库存

提交答案，继续学习

#### 六、本节需要掌握的知识

完成本节后，你应该能够回答：

1. 为什么需要拆分业务模块？
2. 如何确定一个模块的职责？
3. 什么是高内聚、低耦合？
4. 模块之间应该如何通信？
5. 如何将模块设计映射到代码目录？

下一节我们将学习数据库设计，包括 ER 图、实体关系、主键、外键、索引，以及如何把订单业务转化成 MySQL 表结构。

**最终目标：不仅能写出代码，还能在编码之前规划好整个系统。**

## 对话 09　模块职责与边界 {#turn-09}

> **用户**
>
> 第二课模块设计实战，我选择 A。请评价我的答案，继续讲解模块边界和模块间依赖设计。

**ChatGPT**

回答正确

你选择 A：由库存模块统一管理库存预留、释放和扣减。

这是正确的模块设计思路。

但这道题还有一个更深层次的知识：**订单模块负责决定什么时候释放库存，库存模块负责决定如何释放库存。**

这就是模块边界设计的核心。

### 第二课 · 2.3 模块边界与模块间依赖设计

#### 一、什么是模块边界？

先看一个实际问题。

订单取消时，需要执行两个动作：

1. 将订单状态修改为已取消。
2. 释放订单此前预留的库存。

那么，这两个操作分别属于哪个模块？

**订单模块**

业务职责

- 判断订单是否允许取消
- 修改订单状态
- 发起库存释放请求

**库存模块**

业务职责

- 检查库存预留记录
- 释放预留库存
- 更新库存数据

为什么这样拆分？

因为订单模块应该理解订单规则，库存模块应该理解库存规则。

例如：

- 订单模块不应该关心库存表中哪个字段需要加一。
- 库存模块不应该关心订单取消的业务原因。

**每个模块只负责自己领域内的业务规则。**

这就是模块边界（Module Boundary）。

#### 二、什么是模块间依赖？

模块虽然各自独立，但它们需要协作。

例如：

订单模块需要调用库存模块。

**订单模块**

Order Service

调用库存释放接口

**库存模块**

Inventory Service

**库存数据库**

这里的箭头表示依赖关系。

订单模块依赖库存模块提供的能力。

但我们需要避免另一种情况：

**订单模块**

**库存模块**

循环依赖

两个模块互相依赖对方的内部实现

循环依赖容易导致：

- 修改一个模块影响另一个模块。
- 单元测试困难。
- 代码结构越来越复杂。
- 业务逻辑难以追踪。

因此，设计时应尽量让依赖方向清晰、稳定。

#### 三、如何设计合理的模块依赖？

这里介绍三个重要原则。

##### 1. 单一职责原则（SRP）

一个模块应该围绕一个明确的业务职责组织。

例如：

| **模块** | **职责** |
| --- | --- |
| 订单 | 管理订单生命周期 |
| 库存 | 管理库存数量与预留 |
| 发货 | 管理出库和物流 |
| 通知 | 管理消息发送 |

不要把订单、库存、发货、通知全部写在一个巨大的 OrderService 中。

##### 2. 依赖接口，而不是依赖内部实现

例如，订单模块只需要知道：

```python
inventory_service.release(
    order_id=10001
)
```

它不需要知道库存模块内部如何更新 MySQL。

更规范的设计可以定义一个库存服务接口：

```python
class InventoryService:
    def reserve(self, order_id, items):
        pass
    def release(self, order_id):
        pass
    def deduct(self, order_id):
        pass
```

这样未来即使修改库存内部实现，订单模块也不需要跟着修改。

##### 3. 避免跨模块直接修改数据

例如，下面这种做法不推荐：

```python
# order/service.py
def cancel_order(order_id):
    db.query(Inventory).filter(
        Inventory.sku_id == 1001
    ).update({
        "available_stock": 10
    })
```

问题是订单模块直接操作了库存内部数据。

推荐：

```python
# order/service.py
def cancel_order(order_id):
    # 1. 校验订单是否允许取消
    # 2. 更新订单状态
    # 3. 调用库存模块释放库存
    inventory_service.release(order_id)
```

库存模块自己负责库存数据的一致性。

注意：这个代码是职责划分示意，真实实现还需要事务设计、幂等处理以及失败补偿，不能简单认为调用成功就一定完成了整个取消流程。

#### 四、进阶：模块之间如何处理事务？

这是一个非常重要的工程问题。

假设：

- 订单取消成功。
- 但是库存释放失败。

这时会发生什么？

**订单状态**

已取消

**库存状态**

仍被预留

出现数据不一致

用户已经取消订单，但库存没有释放。

这说明模块拆分之后，还必须考虑跨模块的数据一致性。

对于当前的模块化单体项目，建议先采用：

**同一个 MySQL 数据库 + 统一事务边界 + 明确的模块服务接口。**

如果订单和库存需要在同一事务中完成，就由应用层协调事务，避免各模块私自提交事务。

如果以后采用异步消息或微服务，可以进一步学习：

- Outbox Pattern（本地消息表）
- Saga（分布式事务协调）
- 幂等机制
- 补偿机制

现在先不急着引入这些复杂方案。

#### 五、实战：判断模块依赖是否合理

现在有一个新场景：

> 用户在订单管理页面点击取消订单，订单模块需要调用库存模块释放库存。

开发人员提出了两个方案。

**方案 A**

订单模块调用库存模块提供的 release() 方法，由库存模块处理自己的数据。

职责清晰

**方案 B**

订单模块直接查询库存表，自己计算应该增加多少库存并更新数据库。

跨模块侵入

**问题：你认为哪个方案更合理？为什么？**

- A. 方案 A，订单模块通过库存模块提供的接口协作
- B. 方案 B，订单模块直接操作库存数据效率更高

提交答案，继续学习

#### 六、这一节需要记住的知识

| **概念** | **记忆重点** |
| --- | --- |
| 模块边界 | 每个模块有自己的业务职责 |
| 模块依赖 | 模块通过明确接口协作 |
| 高内聚 | 模块内部职责集中 |
| 低耦合 | 模块之间减少不必要依赖 |
| 循环依赖 | 尽量避免相互依赖 |
| 数据一致性 | 跨模块操作必须考虑失败和事务 |

**下一节：数据库设计。**

我们将把订单管理系统真正转换成数据库模型，学习：

1. 什么是实体和属性？
2. 什么是 ER 图？
3. 一对一、一对多、多对多关系。
4. 如何设计订单表、订单明细表、库存表。
5. 如何从业务需求推导 MySQL 表结构。

这一步会把业务设计真正落到数据模型上。

## 对话 10　模块依赖与数据库 ER 图 {#turn-10}

> **用户**
>
> 模块边界与依赖设计练习，我选择 A。请评价，并继续讲解数据库设计（ER图和实体关系）。

**ChatGPT**

回答正确

你选择 A：订单模块通过库存模块提供的接口协作。

这是正确的设计。

你的理解已经从简单的功能拆分，逐渐进入真正的软件架构设计。

这道题最重要的知识是：

**模块可以共享业务能力，但不应该随意侵入其他模块的内部实现。**

例如，订单模块需要释放库存，只需要调用库存模块的 `release()`，不需要知道库存表的字段、SQL 和计算规则。

不过还要补充一个细节：在模块化单体架构中，模块可以共享同一个 MySQL 数据库，但应当通过明确的模块接口访问数据，而不是随意跨模块读写表。

### 第二课 · 2.4 数据库设计：ER 图与实体关系

系统设计 · 第三个知识点

#### 一、数据库设计到底解决什么问题？

我们继续使用订单管理系统。

客户需要：

- 管理客户订单。
- 管理订单中的商品。
- 管理商品库存。
- 记录商品发货。
- 查询订单状态。

现在有一个问题：

这些业务数据应该如何存储？

最简单的方式可能是创建一张大表：

| **订单编号** | **客户** | **商品** | **数量** | **单价** | **库存** |
| --- | --- | --- | --- | --- | --- |
| 10001 | 张三 | 猪排 | 2 | 10 | 100 |
| 10001 | 张三 | 鸡排 | 3 | 12 | 50 |
| 10002 | 李四 | 猪排 | 1 | 10 | 100 |

但这种设计会产生很多问题：

- 相同订单信息重复保存。
- 商品库存重复记录。
- 修改客户信息需要修改多行。
- 订单和商品之间的关系不清晰。

因此，我们需要对数据进行合理拆分。

**数据库设计的核心：识别业务实体，确定实体之间的关系，再转换成数据库表。**

#### 二、什么是实体（Entity）？

实体就是业务中需要独立管理的数据对象。

例如订单管理系统：

*原对话配图*　Free Icons to Download or Edit Online - PNG &amp; SVG \| Magnific (formerly Freepik)

**订单（Order）**

订单编号、金额、状态

*原对话配图*　Inventory Box Icon, Black And White Outline Icon Vector.

**商品（Product）**

商品编号、名称、价格

*原对话配图*　Simple outline person icon white \| Free Photo Illustration - rawpixel

**客户（Customer）**

客户编号、姓名、联系方式

*原对话配图*　Core solution - TMW.Suite TMS Brochure

**库存（Inventory）**

商品编号、可用库存、预留库存

实体通常会映射为数据库中的表。

例如：

| **业务实体** | **数据库表** |
| --- | --- |
| 订单 | orders |
| 商品 | products |
| 客户 | customers |
| 库存 | inventory |

实体具有属性（Attribute）。

例如：

**订单实体：**

| **属性** | **含义** |
| --- | --- |
| id | 主键 |
| order\_no | 订单编号 |
| customer\_id | 客户编号 |
| total\_amount | 订单金额 |
| status | 订单状态 |
| created\_at | 创建时间 |

#### 三、什么是 ER 图？

ER 图，全称 Entity Relationship Diagram，即实体关系图。

它用于描述：

1. 系统有哪些实体。
2. 每个实体有哪些属性。
3. 实体之间是什么关系。

例如我们的订单系统：

#### 订单管理系统 ER 图（简化版）

**customers（客户）**

PK id

name、phone

1 对多

**orders（订单）**

PK id · FK customer\_id

order\_no、total\_amount、status

1 对多

**order\_items（订单明细）**

PK id · FK order\_id · FK product\_id

quantity、unit\_price、subtotal

多 对 1

**products（商品）**

PK id

name、sku、price

这里：

- PK：Primary Key，主键。
- FK：Foreign Key，外键。

订单明细表非常重要，因为一个订单可能包含多个商品，而一个商品也可能出现在多个订单中。

#### 四、三种核心实体关系

这是数据库设计必须掌握的知识。

##### 1. 一对一（1:1）

一个用户对应一份个人资料。

**用户**

1 : 1

**个人资料**

例如：

- users
- user\_profiles

实际开发中，如果两组数据生命周期和访问方式相同，也可以合并到一张表，不一定非要拆表。

##### 2. 一对多（1:N）

一个订单包含多个订单明细。

**订单 10001**

猪排 × 2

鸡排 × 3

牛排 × 1

一个订单对应多个订单明细

实现方式：在多的一方保存外键。

例如 `order_items.order_id` 指向 `orders.id`。

##### 3. 多对多（M:N）

一个订单包含多个商品，一个商品也可以出现在多个订单中。

**订单**

订单 A

订单 B

**商品**

猪排

鸡排

订单与商品之间是多对多关系

在关系型数据库中，通常通过中间表 `order_items` 将多对多拆成两个一对多。

这也是为什么我们需要订单明细表。

#### 五、将 ER 图转换为 MySQL 表

我们先设计四张基础表。

教学示例，省略部分生产环境字段和约束

**1. 客户表 customers**

```sql
CREATE TABLE customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**2. 订单表 orders**

```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(64) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer_id (customer_id)
);
```

**3. 商品表 products**

```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(12,2) NOT NULL
);
```

**4. 订单明细表 order\_items**

```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);
```

这里有几个设计细节：

- 金额使用 `DECIMAL`，不要使用浮点类型存储金额。
- `order_no` 使用唯一约束，避免订单编号重复。
- `customer_id` 用来关联客户。
- `unit_price` 保存下单时的商品价格快照，避免商品调价影响历史订单。

生产环境还需要根据业务和数据库规范确定外键约束、删除策略、状态枚举和索引组合。

### 六、实战练习：识别实体关系

现在来检验你是否理解了 ER 图。

客户提出：

> 一个订单可以包含多个商品，一个商品也可以被多个订单购买。

请问，订单和商品之间是什么关系？

- A. 一对一关系（1:1）
- B. 一对多关系（1:N）
- C. 多对多关系（M:N）
- D. 没有直接关系

提交答案，继续学习

#### 七、这一节的知识地图

#### 数据库设计学习路径

1. **识别实体和属性**

已学习

2. **ER 图与实体关系**

当前学习

3. 主键、外键和索引
4. 数据库范式与反范式
5. 库存模型与并发控制
6. 完整 MySQL 数据库设计

**本节最重要的一句话：先理解业务实体和实体关系，再设计数据库表，而不是拿到需求就开始 CREATE TABLE。**

下一步，我们会把库存管理也纳入 ER 图，解决真正的软件系统中非常关键的库存数据建模问题。

## 对话 11　库存表与数据库约束 {#turn-11}

> **用户**
>
> 数据库设计 ER 图练习，我选择 C。请评价，并继续教我如何设计库存表、主键、外键和索引。

**ChatGPT**

回答正确

你选择 C：多对多关系（M:N）。

判断正确！

一个订单可以购买多个商品，一个商品也可以出现在多个订单中，因此订单和商品是多对多关系。

在 MySQL 中，我们通常通过 `order_items`（订单明细表）拆分：

```text
orders (1) ─── (N) order_items (N) ─── (1) products
```

这意味着：

- 一个订单可以有多条订单明细。
- 一个商品可以被多条订单明细引用。
- `order_items` 负责保存订单和商品之间的关系。

接下来，我们学习数据库设计中非常重要的四个知识点：**库存表、主键、外键和索引。**

### 第二课 · 2.5 数据库设计进阶

#### 一、如何设计库存表？

先明确业务需求。

客户需要管理：

- 每个商品有多少库存。
- 有多少库存已经被订单预留。
- 有多少库存可以继续销售。
- 订单取消后能够释放库存。
- 多人同时下单不能超卖。

首先，我们需要明确三个库存概念：

| **名称** | **含义** |
| --- | --- |
| 总库存 | 当前实际拥有的库存 |
| 预留库存 | 已被订单占用、尚未出库的库存 |
| 可用库存 | 可以继续分配给新订单的库存 |

计算关系：

可用库存 = 总库存 - 预留库存可用库存=总库存−预留库存

例如：

**商品：爆浆芝士猪排**

### 100 件

总库存

可用库存

**60 件**

预留库存

**40 件**

因此，我们可以先设计一张库存表。

```sql
CREATE TABLE inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    total_stock INT NOT NULL DEFAULT 0,
    reserved_stock INT NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_product_id (product_id)
);
```

这里的 `product_id` 是商品编号。

为什么增加唯一索引？

因为当前设计假设一个商品只有一条库存记录，不能出现同一个商品重复建立库存记录的情况。

注意：如果以后支持多仓库，唯一约束就需要调整为 `(warehouse_id, product_id)`。

#### 二、什么是主键（Primary Key）？

主键就是用来唯一标识一条数据的字段。

例如：

| **id** | **商品名称** |
| --- | --- |
| 1 | 爆浆芝士猪排 |
| 2 | 香辣鸡排 |
| 3 | 黑椒牛排 |

这里 `id` 就是主键。

主键需要满足：

1. 唯一，不能重复。
2. 非空。
3. 稳定，不应该随业务信息改变。

常见设计：

```sql
id BIGINT PRIMARY KEY AUTO_INCREMENT
```

为什么推荐使用 BIGINT？

因为它比 INT 可以容纳更多的数据，适合长期增长的业务表。

#### 三、什么是外键（Foreign Key）？

外键用于建立两张表之间的数据关联。

例如：

```text
products
---------
id (PK)
name

inventory
---------
id (PK)
product_id (FK)
total_stock
reserved_stock
```

关系：

```text
products.id  ←  inventory.product_id
```

它表达的是：

库存记录中的商品必须对应一个真实存在的商品。

在 MySQL 中，可以使用：

```sql
ALTER TABLE inventory
ADD CONSTRAINT fk_inventory_product
FOREIGN KEY (product_id)
REFERENCES products(id);
```

外键可以帮助维护数据完整性。

但在实际项目中，是否使用数据库物理外键，需要结合团队规范、数据迁移、批量写入和性能需求决定。即使不使用物理外键，也必须在业务逻辑中维护关联关系。

#### 四、什么是索引（Index）？

索引可以帮助数据库更快地找到数据。

假设有 100 万条订单：

```sql
SELECT *
FROM orders
WHERE order_no = 'ORD10001';
```

没有索引时，数据库可能需要扫描大量记录。

如果给 `order_no` 建立索引：

```sql
CREATE UNIQUE INDEX uk_order_no
ON orders(order_no);
```

数据库就可以通过索引更高效地定位订单。

**索引的作用**

**加速查询**

**唯一索引可以防止重复数据**

**增加存储空间和写入维护成本**

常见索引：

| **索引类型** | **作用** |
| --- | --- |
| PRIMARY KEY | 主键索引 |
| UNIQUE | 唯一索引 |
| INDEX | 普通索引 |
| 联合索引 | 多个字段组合查询 |

例如订单表经常按照客户和创建时间查询：

```sql
CREATE INDEX idx_customer_created
ON orders(customer_id, created_at);
```

这就是联合索引。

注意联合索引存在最左前缀原则，字段顺序需要根据真实查询条件设计，而不是索引越多越好。

#### 五、把库存表放进完整 ER 图

现在把之前的订单、商品、订单明细、库存整合起来。

#### 订单系统数据库 ER 图 V1

**products 商品表**

PK id · UK sku

name、price

1 : 1

**inventory 库存表**

PK id

FK product\_id

total\_stock、reserved\_stock

1 : N

**order\_items 订单明细**

PK id

FK order\_id、product\_id

quantity、unit\_price

**orders 订单表**

PK id · UK order\_no · FK customer\_id

total\_amount、status、created\_at

简化关系图：一个商品对应一条库存记录（单仓库假设）；一个商品可以对应多条订单明细。

实际业务中，还建议增加一张库存流水表。

例如 `inventory_transactions`：

| **字段** | **含义** |
| --- | --- |
| id | 流水编号 |
| product\_id | 商品编号 |
| order\_id | 关联订单 |
| change\_type | 预留、释放、扣减、入库 |
| quantity | 变动数量 |
| created\_at | 操作时间 |

为什么需要它？

因为库存表只记录当前状态，而库存流水记录变化过程。

当出现库存不一致时，可以通过流水追溯原因。

#### 六、进阶：如何防止库存超卖？

这是数据库设计与业务逻辑结合的地方。

假设商品只剩 1 件库存，两个员工同时下单。

不能简单采用：

```sql
SELECT total_stock, reserved_stock
FROM inventory
WHERE product_id = 1001;
```

然后在 Python 中判断是否有库存，再执行更新。

因为两个请求可能同时读到库存还有 1 件。

更合理的方式是使用数据库原子条件更新：

```sql
UPDATE inventory
SET reserved_stock = reserved_stock + 1
WHERE product_id = 1001
  AND total_stock - reserved_stock >= 1;
```

然后检查影响行数：

- 影响 1 行：预留成功。
- 影响 0 行：库存不足或商品不存在。

这条 SQL 可以避免两个并发请求同时成功占用最后一件库存。

真实订单流程还需要把库存预留记录、订单状态等操作放在合理的事务边界中，并确保重复请求不会重复预留。

这就是为什么数据库设计不能只考虑表结构，还必须考虑并发和业务规则。

### 七、实战练习：检查你的数据库设计能力

现在我们来做一道实际设计题。

假设商品表中有：

| **id** | **name** |
| --- | --- |
| 1001 | 爆浆芝士猪排 |
| 1002 | 香辣鸡排 |

库存表中需要保证一个商品只有一条库存记录。

**问题 1：应该使用什么约束？**

- A. 给 product\_id 建立 UNIQUE 唯一索引
- B. 给 total\_stock 建立普通索引
- C. 给 created\_at 建立唯一索引
- D. 不需要任何约束

**问题 2：库存表中的 product\_id 应该是什么？**

- A. 主键（PK）
- B. 外键（FK），关联 products.id
- C. 普通文本字段
- D. 自增主键

**问题 3：为什么不能先查询库存，再在 Python 中判断后更新？**

- A. 并发请求可能同时读到相同库存，导致超卖
- B. MySQL 不支持查询后更新
- C. Python 无法连接 MySQL
- D. 普通 SELECT 会自动删除库存

提交答案，继续学习

#### 八、本节知识总结

| **知识点** | **你需要掌握的能力** |
| --- | --- |
| 主键 PK | 唯一标识一条数据 |
| 外键 FK | 建立实体之间的关联 |
| 唯一索引 | 保证字段或字段组合不重复 |
| 普通索引 | 提高查询效率 |
| 联合索引 | 优化多字段查询 |
| 库存流水 | 追踪库存变化 |
| 原子更新 | 解决库存并发竞争 |

**本节最终目标：** 不只是会写 `CREATE TABLE`，而是能根据业务需求设计合理的数据模型，并考虑数据一致性、查询效率和并发安全。

下一步，我们会学习数据库范式、索引优化，并最终完成订单管理系统的完整数据库设计。

## 对话 12　数据库范式与订单库设计 {#turn-12}

> **用户**
>
> 数据库设计综合练习：问题1：A；问题2：A；问题3：A。请批改，并继续讲解数据库范式、索引优化和完整订单系统数据库设计。

**ChatGPT**

### 第二课 · 2.6 数据库范式、索引优化与完整数据库设计

先批改你的练习。

**综合练习成绩**

### 2/3

**问题 1：唯一索引**

正确

选择 A。一个商品只有一条库存记录，因此 `inventory.product_id` 应建立 UNIQUE 唯一索引。

**问题 2：product\_id 的属性**

错误

你选择 A，正确答案是 B：外键（FK），关联 `products.id`。

原因：

- `inventory.id` 是库存表的主键。
- `inventory.product_id` 是外键。
- `inventory.product_id` 同时具有 UNIQUE 唯一约束。

注意：一个字段可以同时具有外键约束和唯一约束。

**问题 3：库存并发问题**

正确

选择 A。两个请求可能同时读到相同库存，随后都判断库存充足，造成超卖。

你错的地方很值得理解：**主键、外键、唯一索引是不同概念，它们并不互相排斥。**

例如：

```sql
CREATE TABLE inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    total_stock INT NOT NULL DEFAULT 0,
    reserved_stock INT NOT NULL DEFAULT 0,

    UNIQUE KEY uk_product_id (product_id),

    CONSTRAINT fk_inventory_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
);
```

这里 `product_id` 同时具有唯一约束和外键约束。

### 一、数据库范式：如何避免糟糕的数据结构？

数据库范式（Database Normalization）是一套组织数据的规则。

它主要解决三个问题：

1. 数据重复。
2. 修改数据时容易产生不一致。
3. 删除或新增数据时产生意外影响。

#### 1. 第一范式（1NF）：字段保持原子性

假设订单表设计如下：

| **order\_id** | **products** |
| --- | --- |
| 10001 | 猪排、鸡排、牛排 |
| 10002 | 猪排、鸡排 |

问题：一个字段保存了多个商品。

这不利于查询、统计和维护。

建议拆分为：

**orders**

| **id** | **order\_no** |
| --- | --- |
| 1 | 10001 |
| 2 | 10002 |

**order\_items**

| **id** | **order\_id** | **product\_name** |
| --- | --- | --- |
| 1 | 1 | 猪排 |
| 2 | 1 | 鸡排 |
| 3 | 1 | 牛排 |
| 4 | 2 | 猪排 |
| 5 | 2 | 鸡排 |

核心原则：每个字段保存一个独立的值，不要把多个业务记录塞进一个字段。

#### 2. 第二范式（2NF）：非主键字段依赖完整主键

假设订单明细表使用组合主键：

`(order_id, product_id)`

但表中有：

| **order\_id** | **product\_id** | **product\_name** | **quantity** |
| --- | --- | --- | --- |
| 10001 | 1001 | 猪排 | 2 |
| 10001 | 1002 | 鸡排 | 3 |

这里 `product_name` 只依赖 `product_id`，而不依赖完整的组合主键。

这叫部分依赖。

解决方式：把商品信息放入 products 表，订单明细只保留商品 ID 和订单时的必要快照。

#### 3. 第三范式（3NF）：消除非主键字段之间的传递依赖

例如：

| **order\_id** | **customer\_id** | **customer\_name** |
| --- | --- | --- |
| 10001 | 2001 | 张三 |
| 10002 | 2001 | 张三 |

其中：

- order\_id 决定 customer\_id。
- customer\_id 决定 customer\_name。

因此 customer\_name 不应该作为客户当前资料重复维护在订单表中。

可以拆分为：

- customers：保存客户资料。
- orders：保存客户 ID。

**三种范式快速记忆**

1NF

字段原子化，不在一个字段里塞多个值。

2NF

非主键字段依赖完整主键。

3NF

非主键字段不依赖其他非主键字段。

##### 一个重要的实际开发原则

并不是越符合范式越好。

例如订单明细中的 `unit_price`：

即使商品表已经有商品价格，我们仍然应该在订单明细中保存下单时的价格。

因为商品未来可能涨价，而历史订单金额不能跟着变化。

这属于合理的数据冗余，叫作业务快照。

**数据库设计不是盲目消除重复，而是保证业务数据含义正确。**

### 二、索引优化：如何让数据库查询更快？

#### 1. 为什么需要索引？

假设 orders 表有 100 万条数据。

查询某个订单：

```sql
SELECT *
FROM orders
WHERE order_no = 'ORD10001';
```

如果没有合适的索引，MySQL 可能需要扫描大量记录。

如果建立索引：

```sql
CREATE UNIQUE INDEX uk_order_no
ON orders(order_no);
```

数据库就可以通过索引快速定位数据。

#### 2. 联合索引与最左前缀原则

假设经常执行：

```sql
SELECT *
FROM orders
WHERE customer_id = 1001
  AND created_at >= '2026-11-01';
```

可以建立联合索引：

```sql
CREATE INDEX idx_customer_created
ON orders(customer_id, created_at);
```

这个索引的字段顺序很重要。

**联合索引：**

第一个字段

**customer\_id**

第二个字段

**created\_at**

`customer_id`

可使用

`customer_id + created_at`

可使用

`created_at` 单独查询

通常无法使用该索引定位

这就是最左前缀原则。

注意：实际是否使用索引还受查询条件、数据分布、优化器选择等因素影响，不能只看字段是否匹配。

#### 3. 哪些情况下索引可能失效？

例如：

```sql
SELECT *
FROM orders
WHERE DATE(created_at) = '2026-11-20';
```

对索引字段直接使用函数，可能使普通索引无法有效进行范围定位。

更推荐：

```sql
SELECT *
FROM orders
WHERE created_at >= '2026-11-20 00:00:00'
  AND created_at <  '2026-11-21 00:00:00';
```

其他需要注意的情况：

- 对索引列进行计算。
- 隐式类型转换。
- 使用不合适的联合索引顺序。
- 对低选择性字段建立大量单列索引。
- 建立太多重复索引。

#### 4. 如何验证索引是否有效？

使用 MySQL 的 `EXPLAIN`：

```sql
EXPLAIN
SELECT *
FROM orders
WHERE customer_id = 1001;
```

重点关注：

| **字段** | **作用** |
| --- | --- |
| type | 访问类型 |
| possible\_keys | 可能使用的索引 |
| key | 实际选择的索引 |
| rows | 估算扫描行数 |
| Extra | 额外执行信息 |

可以进一步使用 `EXPLAIN ANALYZE` 检查实际执行情况（MySQL 8.0.18 及以上）。

**记住：索引优化不是索引越多越好，而是根据真实 SQL 查询模式设计。**

### 三、完整订单管理系统数据库设计

现在把前面学过的知识整合起来。

我们确定本期系统需要管理：

- 客户
- 商品
- 订单
- 订单明细
- 库存
- 库存流水

#### 1. 确定数据库实体

#### 订单系统核心数据模型

**customers**

客户资料

**products**

商品基础信息

**orders**

订单主信息

**order\_items**

订单商品明细与价格快照

**inventory**

商品当前库存

**inventory\_transactions**

库存变化流水

#### 2. 完整 ER 关系

**customers**

PK id

1 : N

**orders**

PK id · FK customer\_id

1 : N

**order\_items**

PK id · FK order\_id · FK product\_id

N : 1

**products**

PK id

1 : 1

**inventory**

FK product\_id

1 : N

**inventory\_transactions**

FK product\_id

这里的库存流水与商品关联；实际还可以关联订单、仓库、操作人等。

#### 3. 推荐的表结构

以下采用 MySQL 8.0，作为教学版 MVP 数据模型。

**表一：客户表**

```sql
CREATE TABLE customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**表二：商品表**

```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(64) NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    status TINYINT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_sku (sku)
);
```

**表三：订单表**

```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(64) NOT NULL,
    customer_id BIGINT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    paid_at DATETIME,
    shipped_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_order_no (order_no),
    KEY idx_customer_created (customer_id, created_at),
    KEY idx_status_created (status, created_at),

    CONSTRAINT fk_order_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

**表四：订单明细表**

```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,

    KEY idx_order_id (order_id),
    KEY idx_product_id (product_id),

    CONSTRAINT fk_item_order
        FOREIGN KEY (order_id) REFERENCES orders(id),

    CONSTRAINT fk_item_product
        FOREIGN KEY (product_id) REFERENCES products(id)
);
```

**表五：库存表**

```sql
CREATE TABLE inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    total_stock INT NOT NULL DEFAULT 0,
    reserved_stock INT NOT NULL DEFAULT 0,
    updated_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_product_id (product_id),

    CONSTRAINT fk_inventory_product
        FOREIGN KEY (product_id) REFERENCES products(id),

    CHECK (total_stock >= 0),
    CHECK (reserved_stock >= 0),
    CHECK (reserved_stock <= total_stock)
);
```

**表六：库存流水表**

```sql
CREATE TABLE inventory_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    order_id BIGINT,
    change_type VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    KEY idx_product_created (product_id, created_at),
    KEY idx_order_id (order_id),

    CONSTRAINT fk_transaction_product
        FOREIGN KEY (product_id) REFERENCES products(id),

    CONSTRAINT fk_transaction_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

这里有几个需要特别注意的设计点：

1. 订单明细保存商品名称和成交价格快照。
2. 订单编号和商品 SKU 必须唯一。
3. 库存表保存当前状态，库存流水保存历史变化。
4. 库存流水应当追加记录，不应该随意修改历史流水。
5. 实际生产环境还需要增加操作人、业务幂等号、备注等字段。

另外，库存流水需要明确 `quantity` 的正负号或变更类型语义。例如预留、释放、扣减分别如何记录，必须制定统一规则。

#### 4. 设计完成后，必须检查业务闭环

我们用一个实际场景验证数据库模型。

假设：

- 商品总库存 100 件。
- 用户购买 3 件。
- 订单创建成功。
- 随后订单取消。

**库存变化过程**

<table>
<tbody>
<tr><td>初始状态</td><td>100</td><td>0</td></tr>
<tr><td>订单预留 3 件</td><td>100</td><td>3</td></tr>
<tr><td>订单取消</td><td>100</td><td>0</td></tr>
</tbody>
</table>

左侧数字为总库存，右侧数字为预留库存。

对应的业务动作：

- 创建订单：预留 3 件。
- 取消订单：释放 3 件。
- 最终可用库存仍然是 100 件。

如果订单发货，则应当完成实际库存扣减，并释放相应预留量。

这样，我们才真正把订单、库存和流水关联起来。

### 四、实战练习：检查数据库设计能力

现在你是这个订单系统的数据库设计负责人。

客户提出一个新需求：

> 管理员需要查询某个商品最近 30 天的库存变化记录，并按照时间倒序展示。

你需要为这个查询设计索引。

假设 SQL 是：

```sql
SELECT *
FROM inventory_transactions
WHERE product_id = 1001
  AND created_at >= '2026-10-20'
ORDER BY created_at DESC;
```

你认为最合适的索引是什么？

- A. (product\_id, created\_at) 联合索引
- B. (created\_at, product\_id) 联合索引
- C. 只给 product\_id 建立索引
- D. 只给 quantity 建立索引

提交答案，继续学习

#### 五、第二课目前的学习进度

#### 系统设计学习路线

1. **整体架构设计**

已学习

2. **模块设计与依赖**

已学习

3. **ER 图与实体关系**

已学习

4. **数据库范式、索引与表结构**

已学习

5. **数据库设计评审**

待学习

6. **API 接口设计**

后续课程

7. **完整系统设计方案**

最终成果

**这一阶段最重要的能力转变：**

从过去的「接到需求 → 开始写 SQL」，变成：

「理解业务 → 识别实体 → 设计关系 → 设计表结构 → 设计索引 → 验证数据一致性」。

这才是软件系统设计需要具备的完整思维。

## 对话 13　联合索引与数据库设计评审 {#turn-13}

> **用户**
>
> 数据库索引优化实战，我选择 B。请评价，并带我完成第二课最后一步：数据库设计评审。

**ChatGPT**

这道题你选择了 B：`(created_at, product_id)` 联合索引。

需要纠正

 正确答案是 **A：**`(product_id, created_at)` **联合索引**。

不要担心，这道题考察的是 MySQL 索引设计中非常重要的知识：**联合索引的字段顺序**。

### 一、为什么 A 更合适？

原始 SQL：

```sql
SELECT *
FROM inventory_transactions
WHERE product_id = 1001
  AND created_at >= '2026-10-20'
ORDER BY created_at DESC;
```

我们的查询条件是：

- `product_id = 1001`：等值查询。
- `created_at >= ...`：范围查询。
- `ORDER BY created_at DESC`：按照时间倒序。

推荐索引：

```sql
CREATE INDEX idx_product_created
ON inventory_transactions(product_id, created_at);
```

原因：

**联合索引结构**

**第一列：product\_id**

等值查询

**第二列：created\_at**

范围查询 + 排序

先定位指定商品，再按照该商品的时间顺序查找记录。

为什么 B 不够理想？

`(created_at, product_id)` 首先按照时间组织索引，而查询首先限定某个商品，可能需要扫描更多时间范围内的记录，再过滤商品。

**记忆口诀：等值条件通常优先于范围条件，但最终必须根据真实查询和执行计划验证。**

### 二、第二课最后一步：数据库设计评审

进入最后阶段

现在我们不再学习孤立的数据库知识，而是站在软件架构师的角度，审查整个订单管理系统的数据库设计。

#### 1. 什么是数据库设计评审？

数据库设计完成，不代表设计合格。

我们需要检查：

1. 业务是否覆盖完整？
2. 表之间的关系是否正确？
3. 主键、外键、唯一约束是否合理？
4. 索引是否匹配实际查询？
5. 并发情况下是否保证数据一致性？
6. 是否考虑数据增长和后续扩展？

数据库评审的目标是：尽量在开发之前发现设计缺陷。

#### 2. 评审一：业务完整性

我们先检查现有六张表。

| **表名** | **评审结果** | **说明** |
| --- | --- | --- |
| customers | 通过 | 基本客户资料 |
| products | 通过 | 商品基础信息 |
| orders | 待完善 | 需要明确订单状态流转 |
| order\_items | 通过 | 保存商品和价格快照 |
| inventory | 待完善 | 需要支持预留和扣减规则 |
| inventory\_transactions | 待完善 | 需要业务幂等和操作追踪 |

这里发现三个问题。

**问题 A：订单状态不够完整**

订单可能经历：

```text
待支付
  ↓
待发货
  ↓
已发货
  ↓
已完成
```

也可能：

```text
待发货 → 已取消
```

因此不能只定义几个状态值，还需要明确哪些状态可以转换到哪些状态。

**问题 B：库存缺少预留记录**

仅靠 `reserved_stock` 无法回答：

- 哪个订单预留了库存？
- 每个订单预留了多少？
- 是否已经释放？
- 是否已经扣减？

建议增加：

`inventory_reservations` 库存预留表。

**问题 C：库存流水缺少幂等标识**

例如，某订单取消请求重复执行两次，可能导致库存重复释放。

建议增加唯一业务操作编号，例如 `idempotency_key`，并建立唯一约束。

#### 3. 评审二：完善库存数据模型

这是订单系统中最重要的部分之一。

原来的库存表只保存当前库存状态，现在增加一张库存预留表。

#### 库存模型 V2

**inventory**

库存当前状态

- id
- product\_id
- total\_stock
- reserved\_stock

**inventory\_reservations**

订单库存预留记录

- id
- order\_id
- product\_id
- quantity
- status
- expires\_at

**inventory\_transactions**

库存变动历史记录

- id
- product\_id
- order\_id
- change\_type
- quantity
- idempotency\_key

三张表分别负责：

- `inventory`：当前库存是多少？
- `inventory_reservations`：哪些订单占用了库存？
- `inventory_transactions`：库存发生过哪些变化？

这三者不能混为一谈。

##### 库存预留表 SQL

```sql
CREATE TABLE inventory_reservations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    expires_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_order_product (order_id, product_id),
    KEY idx_status_expires (status, expires_at),

    CONSTRAINT fk_reservation_order
        FOREIGN KEY (order_id) REFERENCES orders(id),

    CONSTRAINT fk_reservation_product
        FOREIGN KEY (product_id) REFERENCES products(id),

    CHECK (quantity > 0)
);
```

这里的唯一约束假设一个订单中的同一商品已经在订单明细中合并，不会出现多条重复商品明细。

如果允许同一商品在订单中存在多条独立明细，就需要调整唯一键设计。

#### 4. 评审三：检查并发安全

假设库存只有 1 件。

两个用户同时购买。

#### 并发库存预留

**用户 A**

购买 1 件

**用户 B**

购买 1 件

**MySQL 原子条件更新**

检查可用库存并增加预留数量

成功

**A 预留 1 件**

失败

**B 库存不足**

这需要配合数据库事务：

```sql
START TRANSACTION;

UPDATE inventory
SET reserved_stock = reserved_stock + 1
WHERE product_id = 1001
  AND total_stock - reserved_stock >= 1;

-- 应用程序检查影响行数
-- 影响 1 行才继续创建预留记录
-- 影响 0 行则回滚

COMMIT;
```

实际执行时，预留记录插入、订单状态校验、幂等处理也要纳入事务设计；订单创建和库存预留的整体一致性必须有明确的失败回滚策略。

#### 5. 评审四：数据库设计检查清单

这是以后你做真实项目时可以重复使用的评审模板。

**数据库设计评审清单**

### 0/10

**业务实体完整**订单、商品、客户、库存、流水均已建模

**主键设计合理**每张表都有稳定的主键

**关联关系正确**外键或应用层关联规则明确

**唯一约束明确**订单编号、SKU、业务幂等号不重复

**数据类型合理**金额使用 DECIMAL，时间类型统一

**索引匹配查询**根据实际 SQL 设计索引

**并发安全**库存预留使用原子更新和事务

**幂等处理**重复请求不会重复预留或释放库存

**历史追踪**库存变化可以通过流水追溯

**扩展性**考虑多仓库、数据增长等后续需求

重置评审清单

### 三、第二课最终综合实战

现在你已经学习了：

- 整体架构设计
- 模块拆分和职责边界
- 模块间依赖
- ER 图和实体关系
- 主键、外键和索引
- 数据库范式
- 并发控制和数据库评审

我们进行最后一次架构师视角的实战。

**场景：**

一家电商公司准备从单仓库扩展到多个仓库。

例如：

- 杭州仓：100 件商品。
- 上海仓：200 件商品。
- 同一个商品在不同仓库有不同库存。

目前的库存表只有：

```text
inventory
---------
id
product_id
total_stock
reserved_stock
```

请问，你认为应该如何修改库存表的唯一约束？

**选择最合理的设计：**

- A. 新增 warehouse\_id，将唯一索引改为 (warehouse\_id, product\_id)
- B. 继续使用 product\_id 唯一索引，不需要调整
- C. 将 product\_id 从库存表中删除
- D. 每增加一个仓库就创建一张新的库存表

提交答案，完成第二课

#### 四、第二课完成后的能力目标

#### 系统设计阶段成果

系统架构设计图

业务模块与依赖关系图

数据库 ER 图

MySQL 表结构设计

数据库评审清单

**下一课：第三课 · 编码实现**

我们将把设计真正变成可以运行的软件：

1. 搭建 React + FastAPI 项目。
2. 设计代码目录和分层结构。
3. 使用 SQLAlchemy 实现数据模型。
4. 开发订单 CRUD。
5. 实现库存预留和事务。
6. 编写测试并运行完整业务流程。

**学习目标不只是会写 SQL，而是能够独立完成一套系统从需求到架构、再到数据库的设计。**

## 对话 14　系统设计综合实战 {#turn-14}

> **用户**
>
> 第二课系统设计最终综合实战，我选择 A。请评价我的答案，并总结第二课，进入第三课编码实现。

**ChatGPT**

回答正确 · 第二课完成

你选择 A：新增 `warehouse_id`，将唯一索引修改为 `(warehouse_id, product_id)`。

这是正确的设计！

你已经开始理解数据库设计中的一个重要原则：**唯一约束必须反映真实的业务关系。**

#### 一、为什么 A 正确？

原来的库存表：

```text
inventory
---------
id
product_id
total_stock
reserved_stock
```

原来的约束：

```sql
UNIQUE KEY uk_product_id (product_id)
```

这意味着一个商品只能有一条库存记录。

但现在存在多个仓库：

| **仓库** | **商品** | **总库存** |
| --- | --- | --- |
| 杭州仓 | 猪排 | 100 |
| 上海仓 | 猪排 | 200 |
| 杭州仓 | 鸡排 | 50 |

因此，一个商品可以在不同仓库分别拥有库存。

新的库存表：

```sql
CREATE TABLE inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    warehouse_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    total_stock INT NOT NULL DEFAULT 0,
    reserved_stock INT NOT NULL DEFAULT 0,

    UNIQUE KEY uk_warehouse_product (
        warehouse_id,
        product_id
    )
);
```

这样就能保证：

- 同一个仓库，同一个商品只能有一条库存记录。
- 不同仓库可以拥有同一个商品。
- 不同商品可以存放在同一个仓库。

还需要新增 `warehouses` 仓库表，并为 `warehouse_id`、`product_id` 建立相应的关联约束。

**第二课最终评价**

### 系统设计能力进阶

你已经完成了从业务需求到系统架构、模块、数据库设计的学习。

目前需要继续巩固的知识：

- 主键与外键的区别
- 联合索引字段顺序
- 跨模块事务与库存幂等

### 第二课总结：系统设计

课程完成

#### 1. 你学到了什么？

| **知识模块** | **核心能力** |
| --- | --- |
| 架构设计 | 确定系统整体结构 |
| 模块设计 | 按业务职责拆分系统 |
| 模块边界 | 明确模块负责什么、不负责什么 |
| 模块依赖 | 通过接口协作，避免循环依赖 |
| ER 图 | 识别实体和实体关系 |
| 数据库设计 | 设计表、字段、主键和外键 |
| 索引优化 | 根据 SQL 查询设计索引 |
| 数据库范式 | 减少不合理的数据冗余 |
| 数据库评审 | 检查完整性、一致性和扩展性 |

#### 2. 第二课最终交付物

**系统架构图**

React、FastAPI、MySQL、Redis、Celery

**模块设计图**

订单、库存、发货、通知、用户

**模块依赖关系**

明确服务接口和事务边界

**数据库 ER 图**

客户、订单、商品、库存、流水

**数据库表结构**

MySQL 建表语句、约束和索引

**数据库评审清单**

数据一致性、并发、幂等和扩展性

一个重要的认识：

**设计不是为了画出漂亮的架构图，而是为了让后续开发有明确的依据。**

现在我们进入第三课。

### 第三课：编码实现

正式开始 · 第 3/6 阶段

这一课我们要解决一个核心问题：

**如何把系统设计方案，转化为真正可以运行、可以测试的软件代码？**

结合你熟悉的技术栈，我们继续使用：

#### 订单管理系统技术栈

**前端**

React + TypeScript

**后端**

Python + FastAPI

**数据库**

MySQL + SQLAlchemy

**异步任务**

Redis + Celery

#### 一、编码实现的正确顺序

很多初学者拿到设计方案后，会直接开始写前端页面。

实际上，软件开发应该有明确的实施顺序。

1. **项目初始化**

创建前后端项目，配置开发环境和依赖。

2. **代码结构设计**

按照业务模块和代码分层组织目录。

3. **数据库模型实现**

使用 SQLAlchemy 定义 ORM 模型，建立数据库表。

4. **后端业务开发**

开发 API、Service、Repository 和业务规则。

5. **前端页面开发**

开发订单列表、订单创建、订单详情等页面。

6. **前后端联调**

让页面真正调用后端接口，完成业务操作。

7. **代码集成**

整合各个模块，验证完整业务流程。

这里有一个更重要的开发原则：

**优先完成一个完整的业务闭环，而不是先把所有页面或所有 API 分别开发完。**

例如先实现：

创建订单 → 检查库存 → 保存订单 → 查询订单。

这样可以尽早发现设计和实现中的问题。

### 二、3.1 项目初始化与代码结构

我们先设计代码目录。

##### 1. 后端项目结构

```text
order-system/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── modules/
│   │   │   ├── order/
│   │   │   │   ├── router.py
│   │   │   │   ├── service.py
│   │   │   │   ├── repository.py
│   │   │   │   ├── model.py
│   │   │   │   └── schema.py
│   │   │   │
│   │   │   └── inventory/
│   │   │       ├── router.py
│   │   │       ├── service.py
│   │   │       ├── repository.py
│   │   │       ├── model.py
│   │   │       └── schema.py
│   │   │
│   │   ├── database/
│   │   ├── common/
│   │   └── tasks/
│   │
│   ├── tests/
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── services/
    │   ├── hooks/
    │   └── types/
    └── package.json
```

这套目录结构体现了两个维度：

- 按业务拆分：订单模块、库存模块。
- 按技术职责分层：Router、Service、Repository、Model、Schema。

##### 2. 后端五个核心文件分别负责什么？

| **文件** | **主要职责** |
| --- | --- |
| router.py | 接收 HTTP 请求 |
| service.py | 执行业务逻辑 |
| repository.py | 访问数据库 |
| model.py | 定义数据库 ORM 模型 |
| schema.py | 定义 API 输入输出结构 |

我们看一个实际例子。

用户请求：

```http
POST /api/orders
```

后端执行：

**router.py**

接收创建订单请求

**service.py**

校验业务规则、协调库存预留

**repository.py**

保存和查询订单数据

**model.py**

映射 MySQL 数据表

注意：`schema.py` 会在请求进入和响应返回时参与数据校验与转换，不是上述执行链路中的一个数据库操作层。

### 三、3.2 理解分层架构：用代码实现创建订单

假设前端提交：

```json
{
  "customer_id": 1001,
  "items": [
    {
      "product_id": 2001,
      "quantity": 2
    }
  ]
}
```

首先，Schema 定义请求结构：

```python
from pydantic import BaseModel, Field
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate]
```

然后 Router 接收请求：

```python
@router.post("/orders")
def create_order(
    data: OrderCreate,
    service: OrderService = Depends(get_order_service)
):
    return service.create_order(data)
```

Service 负责业务逻辑：

```python
class OrderService:
    def create_order(self, data):
        # 1. 检查客户是否存在
        # 2. 检查商品是否存在
        # 3. 预留商品库存
        # 4. 创建订单
        # 5. 创建订单明细
        # 6. 返回订单结果
        pass
```

Repository 负责数据库访问：

```python
class OrderRepository:
    def create(self, order):
        self.db.add(order)
        self.db.flush()
        return order
```

以上是结构示意，实际开发需要处理依赖注入、事务、异常、数据返回以及库存预留的并发安全。

#### 四、一个非常重要的原则：不要把所有逻辑写在 Router 中

例如：

不推荐

**胖 Controller / Router**

Router 里面同时处理：

- 参数验证
- 订单业务判断
- 库存计算
- SQL 查询
- 数据库更新
- 消息发送

推荐

**分层实现**

- Router：接收请求。
- Service：协调业务。
- Repository：操作数据。
- Model：描述数据结构。
- Schema：校验输入输出。

这样做的好处是：业务变化时，可以更容易定位和修改代码，也更容易编写单元测试。

### 五、第一道编码实现实战题

现在我们来做一个实际开发决策。

客户提出：

> 创建订单时，需要先检查商品库存是否充足，如果库存不足，则返回库存不足的错误信息；如果库存充足，则创建订单。

你认为这段业务逻辑应该主要写在哪个文件？

- A. service.py，负责业务规则和业务流程编排
- B. router.py，负责处理全部业务逻辑
- C. model.py，负责执行订单业务判断
- D. schema.py，负责检查数据库库存

提交答案，继续第三课

#### 六、第三课完整学习计划

| **课程** | **内容** | **最终成果** |
| --- | --- | --- |
| 3.1 | 项目初始化与代码结构 | 项目骨架 |
| 3.2 | 分层架构与职责 | 清晰的代码组织 |
| 3.3 | SQLAlchemy ORM | 数据模型 |
| 3.4 | 订单 CRUD | 完整订单 API |
| 3.5 | 库存业务实现 | 安全的库存预留与释放 |
| 3.6 | 前端开发 | 订单管理页面 |
| 3.7 | 前后端联调 | 可运行的订单系统 |

**本课最终目标：** 你能够根据系统设计文档，独立组织项目代码，完成前后端开发，并实现一个真正可运行的订单管理系统。

我们继续采用之前的学习方式：每次学习一个知识点，通过一道实战题检验理解，再进入下一步。
