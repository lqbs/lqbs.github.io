---
title: "第三课　编码实现"
outline: 2
prev:
  text: "第二课　系统设计"
  link: /posts/software-development-workflow/02-system-design
next:
  text: "第四课　测试验证"
  link: /posts/software-development-workflow/04-testing
---

# 第三课　编码实现

[返回总目录](/posts/software-development-workflow)

## 对话 15　项目结构与订单 CRUD {#turn-15}

> **用户**
>
> 第三课编码实现第一道实战题，我选择 A。请评价，并继续教我如何实现完整的订单 CRUD。

**ChatGPT**

回答正确

你选择 A：`service.py`，负责业务规则和业务流程编排。

这是正确的。

你已经理解了分层架构中一个非常重要的原则：

**业务逻辑应该放在 Service 层，而不是让 Router 直接操作数据库。**

例如，创建订单时：

- Router 接收请求。
- Schema 校验请求参数。
- Service 检查业务规则。
- Repository 操作数据库。
- Model 映射数据库表。

不过还要注意：库存模块应该负责库存规则，订单 Service 负责协调订单创建和库存预留，而不是把所有库存计算都写进订单 Service。

### 第三课 · 3.3 实现完整订单 CRUD

编码实现 · 核心实战

CRUD 是软件开发中最基础、最常见的开发模式。

#### 一、什么是 CRUD？

CRUD 是四种基本数据操作的缩写：

**Create（创建）**

新增一笔订单。

POST /orders

**Read（查询）**

查询订单列表和订单详情。

GET /orders

**Update（更新）**

修改订单允许修改的信息。

PATCH /orders/&#123;id&#125;

**Delete（删除）**

删除或取消订单。

DELETE /orders/&#123;id&#125;

注意：真实订单系统通常不允许直接删除已发生业务的订单，而是通过取消订单保留业务记录。这里先学习 CRUD 的通用方法。

#### 二、第一步：设计订单 API 接口

在写代码之前，先定义 API。

| **功能** | **HTTP 方法** | **接口** | **说明** |
| --- | --- | --- | --- |
| 创建订单 | POST | `/api/orders` | 新建订单 |
| 订单列表 | GET | `/api/orders` | 分页查询 |
| 订单详情 | GET | `/api/orders/{id}` | 查询单笔订单 |
| 修改订单 | PATCH | `/api/orders/{id}` | 修改允许编辑的字段 |
| 删除订单 | DELETE | `/api/orders/{id}` | 教学用删除接口 |

例如，查询订单列表：

```http
GET /api/orders?page=1&page_size=20
```

查询结果：

```json
{
  "total": 100,
  "page": 1,
  "page_size": 20,
  "items": [
    {
      "id": 1,
      "order_no": "ORD20261120001",
      "total_amount": "20.00",
      "status": "pending"
    }
  ]
}
```

#### 三、第二步：定义数据库模型 Model

我们使用 SQLAlchemy 2.0 的 ORM 风格。

先创建订单模型：

```python
# modules/order/model.py
from sqlalchemy import (
    BigInteger,
    String,
    Numeric,
    DateTime,
    func
)
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base
class Order(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True
    )
    order_no: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        nullable=False
    )
    customer_id: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False
    )
    total_amount: Mapped[float] = mapped_column(
        Numeric(12, 2),
```

这里有几个重要知识点：

- `__tablename__`：对应数据库表名。
- `Mapped`：声明 ORM 字段类型。
- `mapped_column`：定义数据库字段。
- `primary_key=True`：声明主键。
- `nullable=False`：字段不能为空。
- `unique=True`：建立唯一约束。

实际开发中，金额建议使用 `Decimal`，而不是 Python `float`，避免金额计算精度问题。

#### 四、第三步：定义 Schema

Schema 负责校验前端传入的数据，以及控制 API 返回的数据。

```python
# modules/order/schema.py
from decimal import Decimal
from pydantic import BaseModel, ConfigDict
class OrderCreate(BaseModel):
    customer_id: int
    total_amount: Decimal
class OrderUpdate(BaseModel):
    status: str | None = None
class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    order_no: str
    customer_id: int
    total_amount: Decimal
    status: str
```

为什么 Model 和 Schema 要分开？

| **Model** | **Schema** |
| --- | --- |
| 面向数据库 | 面向 API |
| 描述数据库字段 | 描述请求和响应 |
| SQLAlchemy | Pydantic |
| 负责数据持久化映射 | 负责数据校验和转换 |

例如数据库里可以有内部字段 `deleted_at`，但不一定需要返回给前端。

#### 五、第四步：Repository 数据访问层

Repository 负责封装数据库操作。

```python
# modules/order/repository.py
from sqlalchemy import select
from sqlalchemy.orm import Session
from .model import Order
class OrderRepository:
    def __init__(self, db: Session):
        self.db = db
    def create(self, order: Order):
        self.db.add(order)
        self.db.flush()
        return order
    def get_by_id(self, order_id: int):
        stmt = select(Order).where(
            Order.id == order_id
        )
        return self.db.scalar(stmt)
    def get_list(self, offset: int, limit: int):
        stmt = (
            select(Order)
            .order_by(Order.id.desc())
            .offset(offset)
            .limit(limit)
        )
        return self.db.scalars(stmt).all()
    def delete(self, order: Order):
        self.db.delete(order)
```

这里使用 `flush()` 而不是 `commit()`，是为了让上层 Service 统一控制事务。

这是一个很重要的设计原则：

**事务应该由业务流程协调者统一管理，而不是每个 Repository 自己提交。**

#### 六、第五步：Service 业务逻辑层

Service 负责组织 CRUD 业务。

```python
# modules/order/service.py
from decimal import Decimal
from uuid import uuid4
from .model import Order
from .repository import OrderRepository
class OrderService:
    def __init__(self, db):
        self.db = db
        self.repo = OrderRepository(db)
    def create_order(self, data):
        if data.total_amount <= Decimal("0"):
            raise ValueError("订单金额必须大于零")
        order = Order(
            order_no=f"ORD-{uuid4().hex[:16]}",
            customer_id=data.customer_id,
            total_amount=data.total_amount,
            status="pending"
        )
        try:
            self.repo.create(order)
            self.db.commit()
            self.db.refresh(order)
            return order
        except Exception:
            self.db.rollback()
            raise
```

这里有一个教学上的简化：目前创建订单还没有关联订单明细、库存预留、客户校验；真实系统不能仅靠这段代码完成订单业务闭环。

#### 七、第六步：Router API 层

最后由 FastAPI Router 对外提供接口。

```python
# modules/order/router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from .schema import OrderCreate, OrderResponse
from .service import OrderService
router = APIRouter(prefix="/api/orders", tags=["订单"])
@router.post("", response_model=OrderResponse)
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db)
):
    service = OrderService(db)
    try:
        return service.create_order(data)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    service = OrderService(db)
    try:
```

订单列表、更新和删除接口也应采用相同的分层方式实现。

注意：上面的代码是用于理解分层职责的教学骨架，不是可以直接投入生产的完整 CRUD 项目。正式实现还需要补齐数据库会话配置、分页总数、PATCH 更新、错误处理、权限控制和订单状态规则。

### 八、完整 CRUD 的开发验收标准

我们不能仅仅因为接口能够返回 200，就认为 CRUD 开发完成。

| **测试场景** | **预期结果** |
| --- | --- |
| 创建合法订单 | 创建成功 |
| 创建金额为负数的订单 | 参数校验失败 |
| 查询存在的订单 | 返回订单信息 |
| 查询不存在的订单 | 返回 404 |
| 查询订单列表 | 正确分页 |
| 修改订单 | 只修改允许修改的字段 |
| 删除订单 | 按业务规则执行 |
| 数据库连接失败 | 返回可识别的错误，不泄露内部信息 |

另外，真实订单的修改与删除需要考虑订单状态。例如已发货订单不应该随意删除。

### 九、实战练习：你来判断代码职责

现在我们进行一道实际编码题。

假设前端提交创建订单请求，后端需要完成：

1. 检查商品库存是否充足。
2. 预留库存。
3. 创建订单记录。
4. 创建订单明细。
5. 提交数据库事务。

你认为这段完整业务流程应该放在哪里？

- A. OrderService 负责业务流程协调，InventoryService 负责库存规则，统一事务管理
- B. Router 直接执行全部 SQL 和库存计算
- C. Repository 负责决定订单业务规则和库存预留时机
- D. Model 负责接收请求并提交所有事务

提交答案，继续学习

#### 十、第三课学习进度

#### 编码实现学习路线

1. 项目初始化与代码结构

已学习

2. 分层架构与职责划分

已学习

3. SQLAlchemy ORM 与 CRUD

当前学习

4. 订单创建与库存事务
5. 异常处理与幂等机制
6. 前端 React 页面
7. 前后端联调

**本节最重要的知识：CRUD 不只是四个 API，而是一套有明确分层、数据校验、事务管理和业务规则的开发方法。**

下一步我们将重点攻克订单创建与库存预留，这是整个订单系统最核心的业务流程。

## 对话 16　订单创建与库存事务 {#turn-16}

> **用户**
>
> 第三课订单 CRUD 实战，我选择 A。请评价，并继续教我实现订单创建、库存预留和数据库事务的完整业务流程。

**ChatGPT**

回答正确

你选择 A：由 `OrderService` 负责业务流程协调，`InventoryService` 负责库存规则，并统一管理数据库事务。

这是正确的架构设计。

而且，这道题比之前的 CRUD 更重要，因为它涉及软件开发中的三个核心能力：

1. 模块之间如何协作。
2. 如何保证数据库事务一致性。
3. 如何防止并发情况下库存超卖。

今天我们把这三个知识点结合起来，真正实现一个订单创建流程。

### 第三课 · 3.4 订单创建、库存预留与事务管理

#### 一、先理解完整业务流程

客户购买 2 件爆浆芝士猪排。

当前库存：

| **库存项目** | **数量** |
| --- | --- |
| 总库存 | 100 |
| 已预留 | 40 |
| 可用库存 | 60 |
| 本次购买 | 2 |

系统需要完成：

- 检查商品是否存在。
- 检查可用库存。
- 预留 2 件库存。
- 创建订单。
- 创建订单明细。
- 创建库存预留记录。
- 创建库存变更流水。
- 提交事务。

这些操作必须协调完成。

##### 1. 完整业务流程图

**用户提交订单**

React → FastAPI

**OrderService**

开启数据库事务

**InventoryService**

检查库存并预留商品

**OrderRepository**

保存订单和订单明细

**InventoryRepository**

保存预留记录和库存流水

**COMMIT**

全部成功

**ROLLBACK**

任一步骤失败

这里有一个关键原则：

**订单创建和库存预留必须处于同一个数据库事务中。**

否则可能出现订单创建成功，但库存预留失败的情况。

#### 二、什么是数据库事务？

事务（Transaction）可以理解为一组需要整体成功或整体失败的数据库操作。

例如：

```sql
START TRANSACTION;

-- 1. 预留库存
UPDATE inventory
SET reserved_stock = reserved_stock + 2
WHERE product_id = 1001
  AND total_stock - reserved_stock >= 2;

-- 2. 创建订单
INSERT INTO orders (...);

-- 3. 创建订单明细
INSERT INTO order_items (...);

-- 4. 创建库存预留记录
INSERT INTO inventory_reservations (...);

-- 5. 创建库存流水
INSERT INTO inventory_transactions (...);

COMMIT;
```

如果其中某个关键操作失败：

```sql
ROLLBACK;
```

所有本事务中的数据库修改都会撤销。

##### 事务的 ACID 特性

| **特性** | **含义** | **订单场景** |
| --- | --- | --- |
| A 原子性 | 全部成功或全部失败 | 订单和库存一起提交 |
| C 一致性 | 满足业务约束 | 不能出现负库存 |
| I 隔离性 | 并发事务互不破坏 | 避免超卖 |
| D 持久性 | 提交后数据持久保存 | 订单不会无故丢失 |

特别注意：ACID 中的隔离性不等于完全没有并发问题，还需要选择正确的 SQL、锁和事务隔离策略。

### 三、如何使用 SQLAlchemy 实现事务？

这是本节最重要的实战部分。

我们采用 SQLAlchemy 2.0。

#### 1. 数据库连接配置

`database/session.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
DATABASE_URL = (
    "mysql+pymysql://root:password@localhost:3306/order_db"
)
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(
    bind=engine,
    expire_on_commit=False,
)
```

生产环境中，数据库密码应该放在环境变量或密钥管理系统中，而不是写在代码里。

#### 2. 事务由谁管理？

建议由 `OrderService` 统一管理。

```python
def create_order(self, data):
    try:
        # 1. 预留库存
        # 2. 创建订单
        # 3. 创建订单明细
        # 4. 保存库存流水
        self.db.commit()
    except Exception:
        self.db.rollback()
        raise
```

这里有一个非常重要的原则：

- Repository 不负责提交事务。
- InventoryService 不独立提交事务。
- OrderService 负责协调整个业务事务。

这样，所有模块可以共享同一个 SQLAlchemy Session 和事务。

#### 3. 库存预留的核心 SQL

假设购买 2 件商品。

```sql
UPDATE inventory
SET reserved_stock = reserved_stock + 2
WHERE product_id = 1001
  AND total_stock - reserved_stock >= 2;
```

Python 中可以这样执行：

```python
from sqlalchemy import update
stmt = (
    update(Inventory)
    .where(
        Inventory.product_id == product_id,
        Inventory.total_stock
        - Inventory.reserved_stock >= quantity
    )
    .values(
        reserved_stock=
        Inventory.reserved_stock + quantity
    )
)
result = db.execute(stmt)
if result.rowcount != 1:
    raise ValueError("库存不足")
```

为什么这种方式可以防止超卖？

因为数据库执行的是一个原子条件更新。

假设当前只剩 1 件库存：

- 用户 A 购买 1 件，更新成功。
- 用户 B 购买 1 件，更新条件不再满足，更新失败。

两个用户不会同时成功占用最后一件库存。

前提是相关库存操作都遵循一致的事务规则。

### 四、实现 InventoryService

我们先把库存逻辑独立出来。

`modules/inventory/service.py`

```python
from sqlalchemy import update
class InventoryService:
    def __init__(self, db):
        self.db = db
    def reserve(self, product_id, quantity):
        stmt = (
            update(Inventory)
            .where(
                Inventory.product_id == product_id,
                Inventory.total_stock
                - Inventory.reserved_stock >= quantity
            )
            .values(
                reserved_stock=
                Inventory.reserved_stock + quantity
            )
        )
        result = self.db.execute(stmt)
        if result.rowcount != 1:
            raise ValueError(
                f"商品 {product_id} 库存不足"
            )
```

注意：

这个方法只负责库存预留，不提交事务。

另外，还需要在进入这个方法之前验证商品存在、数量大于零，并且确保预留记录和流水记录也在同一个事务中保存。

### 五、实现 OrderService：协调整个订单业务

现在进入核心代码。

`modules/order/service.py`

```python
from decimal import Decimal
from uuid import uuid4
class OrderService:
    def __init__(self, db):
        self.db = db
        self.inventory_service = InventoryService(db)
    def create_order(self, data):
        try:
            total_amount = Decimal("0")
            # 1. 创建订单编号
            order_no = f"ORD-{uuid4().hex}"
            # 2. 查询商品并计算金额
            items = []
            for item in data.items:
                product = self.db.get(
                    Product,
                    item.product_id
                )
                if product is None:
                    raise ValueError("商品不存在")
                if item.quantity <= 0:
                    raise ValueError("购买数量必须大于零")
                subtotal = (
                    product.price * item.quantity
                )
```

这段代码展示了业务编排，但还不是完整生产实现。

实际系统还需要：

- 客户存在性和权限校验。
- 同一商品的重复明细合并。
- 预留记录和库存流水的创建。
- 幂等请求标识。
- 事务隔离和死锁重试。
- 商品价格并发变化时的价格策略。

另外，如果一个订单包含多个商品，应当按固定商品 ID 顺序执行库存更新，减少并发事务之间发生死锁的概率。

### 六、异常处理：如果中途失败怎么办？

这是软件工程非常重要的一部分。

假设：

1. 商品 A 库存预留成功。
2. 商品 B 库存预留成功。
3. 创建订单明细时发生异常。

如果没有事务管理：

- 商品 A 库存已经被占用。
- 商品 B 库存已经被占用。
- 订单却没有创建成功。

这就是数据不一致。

使用事务后：

**事务执行结果**

1. 商品 A 预留成功

成功

2. 商品 B 预留成功

成功

3. 创建订单明细失败

失败

4. 执行 ROLLBACK

回滚

最终结果：商品 A、商品 B 的库存预留都被撤销，订单也不会留下半成品。

这里需要区分：

**数据库事务只能回滚数据库操作，不能自动撤销已经发送的短信、微信通知或外部 API 请求。**

所以外部通知最好在事务提交成功后，通过可靠的消息机制发送，例如 Outbox Pattern。

### 七、进阶：如何防止重复创建订单？

假设用户点击了两次提交按钮。

或者网络超时，前端重新发送请求。

如果不做处理，可能出现两笔重复订单。

这就是幂等性（Idempotency）。

可以让前端提交一个唯一请求编号：

```json
{
  "request_id": "req_20261120_001",
  "customer_id": 1001,
  "items": [
    {
      "product_id": 1001,
      "quantity": 2
    }
  ]
}
```

数据库增加唯一约束：

```sql
ALTER TABLE orders
ADD COLUMN request_id VARCHAR(64) NOT NULL,
ADD UNIQUE KEY uk_request_id (request_id);
```

这样，同一个请求编号只能成功创建一笔订单。

但要注意：遇到重复请求时，系统应该查询并返回原来的订单结果，而不是简单报错。还应校验同一个请求编号对应的请求内容是否一致。

### 八、实战练习：模拟真实订单事务

现在假设：

商品 A 有 10 件库存。

用户下单：

- 商品 A：购买 3 件。
- 商品 B：购买 5 件。

但商品 B 只有 2 件库存。

系统已经成功预留商品 A 的 3 件，此时商品 B 库存不足。

**问题：最终应该发生什么？**

- A. 整个事务回滚，商品 A 的预留也撤销，不创建订单
- B. 商品 A 预留成功，商品 B 失败，仍然创建部分订单
- C. 先创建订单，再忽略商品 B 的库存不足
- D. 只回滚商品 B，保留商品 A 的预留

提交答案，继续学习

#### 九、本节知识总结

| **知识点** | **核心记忆** |
| --- | --- |
| OrderService | 协调订单业务流程 |
| InventoryService | 负责库存业务规则 |
| Repository | 负责数据库访问 |
| Transaction | 保证数据库操作整体成功或失败 |
| COMMIT | 提交事务 |
| ROLLBACK | 回滚事务 |
| 原子更新 | 防止并发超卖 |
| Idempotency | 防止重复请求 |

#### 十、第三课学习进度

#### 编码实现路线

1. 项目初始化与代码结构

已学习

2. 分层架构与职责划分

已学习

3. 订单 CRUD

已学习

4. 订单创建与库存事务

当前学习

5. 订单取消、库存释放与发货扣减
6. 异常处理与幂等机制
7. React 前端开发
8. 前后端联调

**本节最重要的能力：从会写数据库 CRUD，提升到能够设计和实现具有事务一致性的业务流程。**

下一节，我们将完成订单的完整生命周期：创建、取消、释放库存、发货和库存扣减。

## 对话 17　取消订单与发货扣减 {#turn-17}

> **用户**
>
> 订单创建与事务实战，我选择 A。请评价，并继续教我实现订单取消、库存释放和发货扣减。

**ChatGPT**

回答正确

你选择 A：整个事务回滚，商品 A 已经预留的 3 件库存也撤销，不创建订单。

完全正确！

这说明你已经理解了数据库事务最重要的原则：**一个业务操作中的关键数据库修改必须保持原子性。**

例如：

| **操作** | **执行结果** |
| --- | --- |
| 商品 A 预留 3 件 | 暂时成功 |
| 商品 B 预留 5 件 | 失败 |
| 执行 ROLLBACK | 撤销商品 A 的预留 |
| 创建订单 | 不创建 |

最终库存：

- 商品 A：恢复原来的 10 件。
- 商品 B：保持原来的 2 件。
- 订单：不存在。

接下来，我们把订单生命周期补完整。

### 第三课 · 3.5 订单取消、库存释放与发货扣减

#### 一、先理解订单的完整生命周期

一个订单并不是创建成功就结束了。

它可能经历：

- 创建订单。
- 等待发货。
- 用户取消。
- 仓库发货。
- 订单完成。

我们先定义订单状态。

#### 订单状态流转图

**待发货**

库存已预留

**已取消**

释放预留库存

**已发货**

扣减实际库存

**已完成**

这里需要先明确一个业务假设：

本教学系统中，订单创建时预留库存，发货时才扣减实际库存。

因此：

可用库存 = 总库存 - 预留库存可用库存=总库存−预留库存

发货时：

总库存 = 总库存 - 发货数量总库存=总库存−发货数量

预留库存 = 预留库存 - 发货数量预留库存=预留库存−发货数量

取消时：

预留库存 = 预留库存 - 取消数量预留库存=预留库存−取消数量

注意：取消不会增加总库存，因为订单创建时只是预留，并没有真正扣减总库存。

### 二、第一部分：实现订单取消

#### 1. 订单取消需要做什么？

假设：

商品 A：

| **库存项目** | **数量** |
| --- | --- |
| 总库存 | 100 |
| 预留库存 | 40 |
| 可用库存 | 60 |

订单 10001 预留了 3 件。

用户取消订单后：

| **库存项目** | **取消前** | **取消后** |
| --- | --- | --- |
| 总库存 | 100 | 100 |
| 预留库存 | 40 | 37 |
| 可用库存 | 60 | 63 |

因此，取消订单需要完成：

1. 查询订单。
2. 检查订单是否允许取消。
3. 查询订单库存预留记录。
4. 释放预留库存。
5. 更新预留记录状态。
6. 更新订单状态为已取消。
7. 写入库存流水。
8. 提交事务。

#### 2. 订单取消的代码设计

先实现库存释放。

`inventory/service.py`

```python
from sqlalchemy import update
class InventoryService:
    def __init__(self, db):
        self.db = db
    def release(self, product_id, quantity):
        stmt = (
            update(Inventory)
            .where(
                Inventory.product_id == product_id,
                Inventory.reserved_stock >= quantity
            )
            .values(
                reserved_stock=
                Inventory.reserved_stock - quantity
            )
        )
        result = self.db.execute(stmt)
        if result.rowcount != 1:
            raise ValueError("库存释放失败")
```

这里使用：

```sql
reserved_stock >= quantity
```

是为了避免释放数量超过实际预留数量，导致库存出现负数。

但是，仅有这个判断还不够。

真实业务还必须验证：

- 这笔库存确实由当前订单预留。
- 预留记录状态为 RESERVED。
- 预留记录没有被释放或扣减过。

因此，不能直接拿订单明细数量去释放库存，必须以库存预留记录为依据。

#### 3. 实现 OrderService.cancel\_order()

```python
def cancel_order(self, order_id):
    try:
        # 1. 锁定并查询订单
        order = self.db.execute(
            select(Order)
            .where(Order.id == order_id)
            .with_for_update()
        ).scalar_one_or_none()
        if order is None:
            raise ValueError("订单不存在")
        # 2. 检查订单状态
        if order.status != "pending":
            raise ValueError("当前订单不允许取消")
        # 3. 查询订单的有效库存预留记录
        reservations = self.db.execute(
            select(InventoryReservation)
            .where(
                InventoryReservation.order_id == order_id,
                InventoryReservation.status == "reserved"
            )
            .with_for_update()
        ).scalars().all()
        # 4. 逐个释放库存
        for reservation in reservations:
            self.inventory_service.release(
                reservation.product_id,
                reservation.quantity
            )
            reservation.status = "released"
```

这段代码展示了事务编排方式。实际实现还需要保证库存流水与预留状态更新一并写入同一个事务。

另外，订单状态与预留状态都应采用统一枚举值，避免代码中到处出现不一致的字符串。

### 三、第二部分：实现订单发货与库存扣减

取消订单是释放预留库存。

发货则不同。

**发货意味着商品已经从仓库实际出库，需要减少总库存，同时减少预留库存。**

#### 1. 发货前后的库存变化

假设：

| **项目** | **数量** |
| --- | --- |
| 总库存 | 100 |
| 预留库存 | 40 |
| 可用库存 | 60 |
| 本订单发货 | 3 |

发货后：

| **项目** | **发货前** | **发货后** |
| --- | --- | --- |
| 总库存 | 100 | 97 |
| 预留库存 | 40 | 37 |
| 可用库存 | 60 | 60 |

注意：发货后可用库存没有变化。

因为这 3 件商品之前就已经被预留，发货只是把它们从预留库存转成实际出库。

#### 2. 发货 SQL

```sql
UPDATE inventory
SET
    total_stock = total_stock - 3,
    reserved_stock = reserved_stock - 3
WHERE product_id = 1001
  AND total_stock >= 3
  AND reserved_stock >= 3;
```

同样要检查影响行数。

- 影响 1 行：扣减成功。
- 影响 0 行：库存数据异常或预留不足。

这里还要特别强调：真实实现必须验证这 3 件确实属于当前订单的有效预留，不能只检查商品总预留库存。

#### 3. InventoryService.deduct()

```python
def deduct(self, product_id, quantity):
    stmt = (
        update(Inventory)
        .where(
            Inventory.product_id == product_id,
            Inventory.total_stock >= quantity,
            Inventory.reserved_stock >= quantity
        )
        .values(
            total_stock=Inventory.total_stock - quantity,
            reserved_stock=Inventory.reserved_stock - quantity
        )
    )
    result = self.db.execute(stmt)
    if result.rowcount != 1:
        raise ValueError("库存扣减失败")
```

这个方法只负责库存数字变更。

订单发货逻辑仍由订单模块协调。

#### 4. OrderService.ship\_order()

```python
def ship_order(self, order_id):
    try:
        # 1. 锁定订单
        order = self.db.execute(
            select(Order)
            .where(Order.id == order_id)
            .with_for_update()
        ).scalar_one_or_none()
        if order is None:
            raise ValueError("订单不存在")
        # 2. 检查状态
        if order.status != "pending":
            raise ValueError("当前订单不能发货")
        # 3. 获取有效库存预留记录
        reservations = self.db.execute(
            select(InventoryReservation)
            .where(
                InventoryReservation.order_id == order_id,
                InventoryReservation.status == "reserved"
            )
            .with_for_update()
        ).scalars().all()
        if not reservations:
            raise ValueError("订单没有有效库存预留")
        # 4. 扣减库存
        for reservation in reservations:
            self.inventory_service.deduct(
                reservation.product_id,
                reservation.quantity
```

生产环境还应记录物流单号、发货时间、仓库、操作人和发货明细。多仓库场景还要确保库存预留记录指向正确仓库。

### 四、第三部分：为什么一定要使用锁？

我们再深入一个重要问题。

假设订单 10001 正在被取消，同时仓库人员正在发货。

两个请求几乎同时到达。

可能出现：

- 取消流程准备释放库存。
- 发货流程准备扣减库存。
- 两个流程都认为订单处于待发货状态。

如果不加保护，就可能同时执行。

我们使用：

```python
.with_for_update()
```

它对应 MySQL 的行级锁机制（InnoDB）。

**订单并发状态保护**

**事务 A**

取消订单

先获取订单锁

**事务 B**

发货订单

等待订单锁

**事务 A 提交取消**

**事务 B 获得锁，重新检查订单状态**

发货失败

订单已经取消，不允许发货

这就是悲观锁（Pessimistic Locking）。

注意：

1. 必须在事务中使用 `SELECT ... FOR UPDATE`。
2. 需要使用支持事务的 InnoDB。
3. 所有取消和发货流程必须遵循一致的加锁顺序。
4. 仍然要考虑死锁、超时和失败重试。
5. 在锁定订单后必须重新验证状态。

### 五、订单完整生命周期的库存变化

我们把三种操作放在一起比较。

假设初始状态：

- 总库存：100。
- 预留库存：40。
- 可用库存：60。
- 当前订单预留：3。

**操作一：创建订单**

<table>
<tbody>
<tr><td>总库存</td><td>100</td></tr>
<tr><td>预留库存</td><td>43</td></tr>
<tr><td>可用库存</td><td>57</td></tr>
</tbody>
</table>

**操作二：取消订单**

<table>
<tbody>
<tr><td>总库存</td><td>100</td></tr>
<tr><td>预留库存</td><td>40</td></tr>
<tr><td>可用库存</td><td>60</td></tr>
</tbody>
</table>

**操作三：发货**

<table>
<tbody>
<tr><td>总库存</td><td>97</td></tr>
<tr><td>预留库存</td><td>37</td></tr>
<tr><td>可用库存</td><td>60</td></tr>
</tbody>
</table>

三个场景分别从同一个初始状态独立演示，不是连续执行的库存数据。

记住：

- 创建订单：增加预留库存。
- 取消订单：减少预留库存。
- 发货：同时减少总库存和预留库存。

### 六、进阶知识：如何防止重复取消和重复发货？

假设用户连续点击两次取消按钮。

第一次：

```text
订单：待发货 → 已取消
库存：预留 3 → 释放 3
```

第二次：

```text
订单：已经取消
```

应该直接拒绝第二次取消，不能再释放 3 件库存。

因此，我们需要三层保护：

| **保护措施** | **作用** |
| --- | --- |
| 订单状态检查 | 不允许重复取消或发货 |
| 预留记录状态检查 | 不允许重复释放或扣减 |
| 库存流水唯一业务编号 | 防止重复写入同一业务操作 |

例如库存流水可以增加：

```sql
ALTER TABLE inventory_transactions
ADD COLUMN idempotency_key VARCHAR(100) NOT NULL,
ADD UNIQUE KEY uk_idempotency_key (idempotency_key);
```

不同业务操作使用不同的幂等编号，例如：

```text
ORDER_10001_RESERVE
ORDER_10001_RELEASE
ORDER_10001_DEDUCT
```

这只是示例命名。若支持部分发货、多个商品、多个仓库，就需要把明细或批次标识也纳入幂等编号。

### 七、实战练习：检验你是否理解库存生命周期

现在来一道综合题。

假设某商品：

- 总库存：100 件。
- 预留库存：30 件。
- 可用库存：70 件。

其中订单 A 预留了 5 件。

现在订单 A 已经发货。

**问题：发货之后，库存应该变成多少？**

请选择发货后的总库存、预留库存和可用库存。

- A. 总库存 95，预留库存 25，可用库存 70
- B. 总库存 100，预留库存 25，可用库存 75
- C. 总库存 95，预留库存 30，可用库存 65
- D. 总库存 100，预留库存 30，可用库存 70

提交答案，继续学习

#### 八、第三课学习进度

#### 编码实现学习路线

1. 项目初始化与代码结构

已学习

2. 分层架构与 CRUD

已学习

3. 订单创建与事务

已学习

4. 订单取消、库存释放与发货扣减

当前学习

5. 异常处理与幂等机制
6. React 前端开发
7. 前后端联调

**下一节我们学习：异常处理、幂等机制与业务测试。**

这一步将帮助你从「代码能够运行」，提升到「系统在重复请求、并发操作、数据库异常等情况下依然可靠」。

## 对话 18　异常处理与幂等 {#turn-18}

> **用户**
>
> 订单取消与发货扣减实战，我选择 A。请评价，并继续教我异常处理、幂等机制和业务测试。

**ChatGPT**

回答正确

你选择 A：总库存 95，预留库存 25，可用库存 70。

完全正确！

我们计算一下：

初始库存：

- 总库存：100
- 预留库存：30
- 可用库存：100 - 30 = 70

订单 A 发货 5 件：

- 总库存：100 - 5 = 95
- 预留库存：30 - 5 = 25
- 可用库存：95 - 25 = 70

**核心理解：发货只是把已预留的商品转为实际出库，不会改变可用库存。**

你已经掌握了订单生命周期中的三个重要操作：

| **操作** | **总库存** | **预留库存** | **可用库存** |
| --- | --- | --- | --- |
| 创建订单 | 不变 | 增加 | 减少 |
| 取消订单 | 不变 | 减少 | 增加 |
| 发货 | 减少 | 减少 | 不变 |

接下来学习软件开发中非常重要的三个主题：异常处理、幂等机制和业务测试。

### 第三课 · 3.6 异常处理、幂等机制与业务测试

#### 一、异常处理：系统出错时应该怎么办？

先看一个真实场景。

用户提交订单：

1. 库存预留成功。
2. 创建订单成功。
3. 创建订单明细时，数据库连接突然断开。
4. 事务提交失败。

如果没有异常处理，会发生什么？

可能出现程序报错、数据库连接未正确释放，甚至产生部分数据。

我们需要建立一套完整的异常处理机制。

##### 1. 认识三种常见异常

| **异常类型** | **示例** | **系统处理** |
| --- | --- | --- |
| 参数异常 | 购买数量为负数 | 返回 422 |
| 业务异常 | 库存不足 | 返回 409 |
| 系统异常 | 数据库连接失败 | 返回 500，记录日志 |

这里要理解一个概念：

**业务异常不等于系统异常。**

例如库存不足，是一个正常的业务结果，不应该被当成程序故障。

##### 2. 设计统一异常类型

建议在 `common/exceptions.py` 中定义：

```python
class BusinessException(Exception):
    def __init__(
        self,
        message: str,
        code: str = "BUSINESS_ERROR"
    ):
        self.message = message
        self.code = code
class InsufficientStockException(BusinessException):
    def __init__(self):
        super().__init__(
            "商品库存不足",
            "INSUFFICIENT_STOCK"
        )
class OrderNotFoundException(BusinessException):
    def __init__(self):
        super().__init__(
            "订单不存在",
            "ORDER_NOT_FOUND"
        )
```

这样，不同模块可以使用统一的异常体系。

##### 3. FastAPI 统一处理异常

在 `main.py` 中：

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
app = FastAPI()
@app.exception_handler(BusinessException)
async def business_exception_handler(
    request: Request,
    exc: BusinessException
):
    return JSONResponse(
        status_code=409,
        content={
            "code": exc.code,
            "message": exc.message
        }
    )
```

返回结果：

```json
{
  "code": "INSUFFICIENT_STOCK",
  "message": "商品库存不足"
}
```

实际项目中，建议为不同异常定义对应 HTTP 状态码，而不是所有业务异常都返回 409。

例如：

- 资源不存在：404。
- 参数错误：422。
- 状态冲突、库存不足：409。
- 未预期系统异常：500。

##### 4. 数据库异常如何处理？

在 Service 层：

```python
try:
    # 执行订单业务
    db.commit()
except BusinessException:
    db.rollback()
    raise
except Exception:
    db.rollback()
    logger.exception(
        "订单创建失败"
    )
    raise
```

这里要注意：

- 业务异常原样抛出。
- 系统异常记录完整堆栈。
- 不向前端暴露数据库密码、SQL 和内部堆栈。
- 每次数据库会话使用完毕后都要正确关闭。

### 二、幂等机制：如何防止重复操作？

这是你开发订单系统必须掌握的知识。

#### 1. 什么是幂等？

幂等的意思是：

**同一个业务请求重复执行多次，最终结果与执行一次相同。**

例如：

用户点击创建订单按钮两次。

**用户提交创建订单**

**第一次请求**

创建订单

**第二次请求**

重复提交

**幂等检查**

检查 request\_id 是否已处理

最终只创建一笔订单

第二次请求返回第一次的结果

#### 2. 为什么需要幂等？

常见情况：

| **场景** | **可能出现的问题** |
| --- | --- |
| 用户连续点击提交 | 创建重复订单 |
| 网络超时后重试 | 重复扣减库存 |
| 支付平台重复回调 | 重复更新支付状态 |
| Celery 任务重复执行 | 重复发送通知 |
| 用户重复点击取消 | 重复释放库存 |

特别注意：网络超时不代表服务器一定没有执行成功。

因此，不能简单地让前端重新生成一个请求编号再提交，否则仍可能创建第二笔订单。

#### 3. 使用 request\_id 实现订单幂等

前端请求：

```json
{
  "request_id": "req_20261120_001",
  "customer_id": 1001,
  "items": [
    {
      "product_id": 2001,
      "quantity": 2
    }
  ]
}
```

数据库增加字段：

```sql
ALTER TABLE orders
ADD COLUMN request_id VARCHAR(64) NOT NULL,
ADD UNIQUE KEY uk_request_id (request_id);
```

Service 中：

```python
def create_order(data):
    existing = repository.get_by_request_id(
        data.request_id
    )
    if existing:
        return existing
    # 执行创建订单业务
```

但是这里存在一个并发漏洞：

两个相同请求可能同时查询，发现订单不存在，然后同时创建。

因此，真正可靠的幂等实现需要：

1. 数据库唯一约束作为最终保障。
2. 处理唯一键冲突。
3. 返回已经创建的原订单。
4. 检查相同 request\_id 对应的请求内容是否一致。

##### 4. 幂等不仅仅用于创建订单

还需要考虑取消、发货、库存预留。

例如：

| **操作** | **幂等保护** |
| --- | --- |
| 创建订单 | request\_id 唯一 |
| 预留库存 | 订单和商品预留记录唯一 |
| 取消订单 | 订单状态 + 预留记录状态 |
| 发货 | 发货业务编号唯一 |
| 库存扣减 | 库存流水业务编号唯一 |

特别注意：取消和发货不能只依赖前端按钮禁用，必须由后端和数据库保证操作唯一性。

### 三、业务测试：如何证明系统是正确的？

接下来学习第三个知识点。

**写完代码不代表开发完成，必须通过测试证明业务符合需求。**

我们使用订单系统作为例子。

#### 1. 三种常见测试

**单元测试（Unit Test）**

测试单个功能

例如：库存预留函数是否正确计算可用库存。

**集成测试（Integration Test）**

测试模块协作

例如：订单 Service 是否能调用库存 Service 并正确提交事务。

**端到端测试（E2E Test）**

测试完整业务流程

例如：用户在前端创建订单，后台成功预留库存并返回订单详情。

#### 2. 使用 pytest 编写单元测试

假设库存有 10 件，预留 3 件。

可用库存应该是 7 件。

```python
def test_available_stock():
    total_stock = 10
    reserved_stock = 3
    available = (
        total_stock - reserved_stock
    )
    assert available == 7
```

这是最简单的单元测试。

再测试库存预留：

```python
def test_reserve_stock_success(db):
    inventory = Inventory(
        product_id=1001,
        total_stock=10,
        reserved_stock=3
    )
    db.add(inventory)
    db.commit()
    service = InventoryService(db)
    service.reserve(1001, 2)
    db.refresh(inventory)
    assert inventory.reserved_stock == 5
```

这里需要使用独立测试数据库和测试事务，避免污染开发环境。

#### 3. 设计业务测试用例

我们为订单创建设计测试矩阵。

| **测试场景** | **预期结果** |
| --- | --- |
| 库存充足 | 创建成功 |
| 库存不足 | 创建失败 |
| 商品不存在 | 创建失败 |
| 数量为负数 | 参数校验失败 |
| 重复提交 | 只创建一笔订单 |
| 多商品订单部分失败 | 整个事务回滚 |
| 数据库提交失败 | 不留下部分数据 |

取消和发货也需要测试：

| **测试场景** | **预期结果** |
| --- | --- |
| 正常取消 | 释放库存 |
| 重复取消 | 不重复释放 |
| 已发货订单取消 | 拒绝 |
| 正常发货 | 扣减总库存和预留库存 |
| 重复发货 | 不重复扣减 |
| 发货过程中失败 | 整个事务回滚 |

#### 4. 进阶：测试并发超卖

假设库存只剩 1 件。

同时启动两个请求，各购买 1 件。

预期结果：

**请求 A**

成功

**请求 B**

库存不足

**最终结果**

- 创建订单：1 笔
- 库存预留：1 件
- 可用库存：0 件
- 不允许出现负库存

真实并发测试需要使用多个独立数据库连接、独立 Session 和同步启动屏障，不能用同一个 Session 模拟两个并发事务。

### 四、把异常处理、幂等和测试串成一个开发闭环

这三个知识点并不是独立的。

它们应该共同构成一个完整的开发流程：

**业务需求**

创建订单、取消订单、发货

**编码实现**

Service、Repository、事务

**异常处理**

失败怎么办

**幂等机制**

重复怎么办

**业务测试**

如何证明正确

**可靠的软件功能**

### 五、实战练习：订单重复提交

现在模拟一个真实问题。

用户点击创建订单后，服务器已经成功创建订单，但响应返回时网络断开。

用户不知道订单是否创建成功，于是重新提交相同请求。

请问，最合理的处理方式是什么？

- A. 使用相同 request\_id 重试，后端检查幂等记录并返回原订单
- B. 每次重试都生成新的 request\_id，重新创建订单
- C. 直接在前端隐藏提交按钮，不允许重试
- D. 每次请求都先删除之前的订单再重新创建

提交答案，继续学习

#### 六、第三课学习进度

#### 编码实现学习路线

1. 项目初始化与代码结构

已学习

2. 分层架构与 CRUD

已学习

3. 订单创建与事务

已学习

4. 订单取消与发货

已学习

5. 异常处理、幂等与测试

当前学习

6. React 订单管理页面
7. 前后端联调

**本节你需要记住三句话：**

- 异常处理：系统出错时，如何安全地失败。
- 幂等机制：请求重复执行时，如何避免重复产生业务结果。
- 业务测试：如何证明系统在正常、异常和并发情况下都符合要求。

下一节，我们将使用 React + TypeScript 开发订单管理页面，把目前已经设计好的后端能力真正展示给用户。

## 对话 19　React 订单列表与 API {#turn-19}

> **用户**
>
> 异常处理与幂等机制实战，我选择 A。请评价，并继续教我使用 React 开发订单管理前端页面。

**ChatGPT**

回答正确

你选择 A：使用相同 `request_id` 重试，后端检查幂等记录并返回原订单。

完全正确！

这道题考察的是一个非常重要的工程能力：**保证网络不可靠的情况下，业务操作仍然可靠。**

例如：

1. 用户提交订单。
2. 后端成功创建订单。
3. 网络中断，前端没有收到响应。
4. 用户重新提交相同请求。
5. 后端识别相同 `request_id`，返回原订单。

最终只创建一笔订单，不会重复占用库存。

注意：前端必须保留原请求的 `request_id` 和请求内容；后端必须依靠数据库唯一约束实现最终防重，不能只依赖先查询再插入。

### 第三课 · 3.7 React 订单管理前端开发

进入前端实战

前面我们已经完成了：

- 系统架构设计
- 数据库设计
- FastAPI 后端分层
- 订单 CRUD
- 库存事务
- 异常处理与幂等

现在要解决一个新问题：

**如何把后端 API 转化为用户可以操作的订单管理界面？**

我们继续使用你熟悉的技术栈：

#### 前端技术架构

**React**

组件化 UI

**TypeScript**

类型安全

**Ant Design**

表格、表单、弹窗

**Axios**

调用后端 API

#### 一、先理解前端页面需要什么

订单管理系统至少需要三个页面：

#### 订单管理界面规划

*原对话配图*　Order Management Dashboard UI – Logistics SaaS Platform by Ashik Alahe on Dribbble

**订单列表页**

订单编号、客户、金额、状态、创建时间、搜索和分页。

*原对话配图*　Ecomic - Orders Page Dashboard UI Design by Juyed Ahmed on Dribbble

**订单详情页**

订单信息、商品明细、库存预留、物流和操作记录。

*原对话配图*　Create sales order form by Vosidiy on Dribbble

**创建订单页**

选择客户、添加商品、填写数量、提交订单。

我们采用一个原则：

**先开发订单列表，再开发订单详情，最后实现创建订单。**

因为列表页是管理人员最频繁使用的入口。

### 二、第一步：初始化 React 项目

使用 Vite 创建项目。

```bash
npm create vite@latest frontend -- --template react-ts

cd frontend

npm install

npm install antd axios @ant-design/icons

npm run dev
```

项目目录：

```text
frontend/
├── src/
│   ├── api/
│   │   └── order.ts
│   ├── components/
│   ├── pages/
│   │   └── order/
│   │       ├── OrderList.tsx
│   │       ├── OrderDetail.tsx
│   │       └── OrderCreate.tsx
│   ├── types/
│   │   └── order.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

为什么这样组织？

- `api`：统一管理后端请求。
- `types`：统一定义 TypeScript 类型。
- `pages`：存放页面。
- `components`：存放可复用组件。

不要把所有代码都放在 `App.tsx` 中。

### 三、第二步：定义 TypeScript 类型

前端需要知道后端返回的数据是什么结构。

`src/types/order.ts`

```ts
export type OrderStatus =
  | "pending"
  | "shipped"
  | "completed"
  | "cancelled";

export interface Order {
  id: number;
  order_no: string;
  customer_id: number;
  total_amount: string;
  status: OrderStatus;
  created_at: string;
}

export interface OrderListResponse {
  total: number;
  page: number;
  page_size: number;
  items: Order[];
}

export interface OrderCreateRequest {
  request_id: string;
  customer_id: number;
  items: {
    product_id: number;
    quantity: number;
  }[];
}
```

这里使用 `string` 保存金额，是因为后端 Decimal 通常序列化为字符串，可以避免 JavaScript 浮点数精度问题。

TypeScript 类型可以帮助我们：

- 避免字段拼写错误。
- 获得 IDE 自动补全。
- 在编译阶段发现类型不匹配。
- 统一前后端数据契约。

### 四、第三步：封装 Axios 请求

我们不建议每个页面都直接调用 Axios。

应该统一封装 API。

`src/api/request.ts`

```ts
import axios from "axios";

export const request = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.response.use(
  response => response.data,
  error => {
    const message =
      error.response?.data?.message ||
      "网络请求失败";

    return Promise.reject(
      new Error(message)
    );
  }
);
```

这样所有页面都可以使用同一个请求实例。

生产环境还需要配置身份认证、请求取消、错误分类和统一日志。

#### 五、第四步：编写订单 API

`src/api/order.ts`

```ts
import { request } from "./request";
import type {
  Order,
  OrderListResponse,
  OrderCreateRequest,
} from "../types/order";

export const getOrders = (
  page = 1,
  pageSize = 20
) => {
  return request.get<never, OrderListResponse>(
    "/orders",
    {
      params: {
        page,
        page_size: pageSize,
      },
    }
  );
};

export const getOrder = (id: number) => {
  return request.get<never, Order>(
    `/orders/${id}`
  );
};

export const createOrder = (
  data: OrderCreateRequest
) => {
  return request.post(
    "/orders",
    data
  );
};

export const cancelOrder = (id: number) => {
  return request.post(
    `/orders/${id}/cancel`
  );
};
```

这里有一个重要的工程习惯：

**前端 API 定义必须与后端真实接口保持一致。**

例如前面教学版后端使用的删除接口是 `DELETE /orders/{id}`，现在我们建议实际业务改成明确的取消接口 `POST /orders/{id}/cancel`。

不能只因为前端写了 API，就认为后端已经实现了它。

### 六、第五步：开发订单列表页面

现在进入核心页面。

我们使用 Ant Design 的：

- Table：展示订单列表。
- Input：搜索订单编号。
- Select：筛选订单状态。
- Tag：显示订单状态。
- Button：查看详情、取消订单。
- Pagination：分页。

`src/pages/order/OrderList.tsx`

```ts
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Tag,
  Space,
  message,
} from "antd";

import type { ColumnsType } from "antd/es/table";

import { getOrders } from "../../api/order";
import type { Order } from "../../types/order";

export default function OrderList() {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadOrders = async () => {
    setLoading(true);

    try {
      const result = await getOrders(page, 20);

      setData(result.items);
      setTotal(result.total);
    } catch (error) {
      message.error("订单加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page]);

  const columns: ColumnsType<Order> = [
    {
      title: "订单编号",
      dataIndex: "order_no",
    },
    {
      title: "客户编号",
      dataIndex: "customer_id",
    },
    {
      title: "订单金额",
      dataIndex: "total_amount",
    },
    {
      title: "订单状态",
      dataIndex: "status",
      render: (status) => {
        const colorMap = {
          pending: "processing",
          shipped: "blue",
          completed: "success",
          cancelled: "default",
        } as const;

        return (
          <Tag color={colorMap[status as keyof typeof colorMap]}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "操作",
      render: (_, record) => (
        <Space>
          <Button type="link">
            查看详情
          </Button>

          {record.status === "pending" && (
            <Button danger type="link">
              取消订单
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>订单管理</h2>

      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="搜索订单编号" />
        <Button type="primary">
          查询
        </Button>
        <Button onClick={loadOrders}>
          刷新
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: page,
          pageSize: 20,
          total,
          onChange: setPage,
        }}
      />
    </div>
  );
}
```

这段代码已经具备订单列表页面的基本结构。

注意：搜索框和操作按钮目前只是界面骨架，下一步还需要接入对应状态、查询接口和确认操作。

### 七、理解 React 的核心：状态管理

现在重点讲一个 React 的核心概念。

假设订单数据发生变化：

```ts
const [data, setData] = useState<Order[]>([]);
```

`data` 表示当前订单列表。

当接口返回新数据：

```ts
setData(result.items);
```

React 会根据状态变化重新渲染界面。

这就是 React 的声明式开发思想：

**你负责描述当前状态下应该显示什么，React 负责更新界面。**

例如：

```ts
{record.status === "pending" && (
  <Button danger>
    取消订单
  </Button>
)}
```

只有待发货订单才显示取消按钮。

这就是通过业务状态控制 UI。

但是，前端隐藏按钮只是用户体验控制，后端仍必须验证订单状态和操作权限。

### 八、订单管理页面应该如何验收？

| **验收项目** | **预期结果** |
| --- | --- |
| 打开订单列表 | 成功获取后端数据 |
| 加载中 | 显示 Loading |
| 接口失败 | 显示错误提示 |
| 切换分页 | 获取对应页数据 |
| 查看详情 | 进入订单详情页 |
| 取消订单 | 调用后端取消接口 |
| 取消成功 | 刷新订单状态 |
| 创建订单 | 成功提交订单信息 |

### 九、实战练习：理解 React 状态管理

现在来一道基础题。

假设订单列表从后端获取了 20 条数据。

用户点击第 2 页时，你希望 React 自动重新请求第 2 页的数据。

下面哪种方式更合理？

- A. 使用 useState 保存 page，useEffect 监听 page 变化并调用接口
- B. 每次点击都直接修改 DOM 元素
- C. 将分页数据写死在组件中
- D. 使用 setTimeout 定时刷新页面

提交答案，继续学习

#### 十、第三课学习进度

#### 编码实现学习路线

1. 项目初始化与代码结构

已学习

2. 后端分层与 CRUD

已学习

3. 订单创建与事务

已学习

4. 异常处理、幂等与测试

已学习

5. React 订单列表与 API

当前学习

6. 订单详情与创建表单
7. 前后端联调

**本节的核心目标：** 理解前端不是单纯画页面，而是通过组件、状态、API 和业务规则，构建一个可以与后端协作的软件界面。

下一步，我们将把订单列表扩展成真正可用的订单管理系统。

## 对话 20　订单详情与创建表单 {#turn-20}

> **用户**
>
> React 订单管理页面实战，我选择 A。请评价，并继续教我开发订单详情页、创建订单表单和前后端联调。

**ChatGPT**

回答正确

你选择 A：使用 `useState` 保存当前页码，使用 `useEffect` 监听页码变化并重新调用接口。

完全正确！

这体现了 React 最重要的开发思想之一：**状态驱动视图，状态变化触发界面更新。**

例如：

```ts
const [page, setPage] = useState(1);

useEffect(() => {
  loadOrders();
}, [page]);
```

当用户点击第二页：

```ts
setPage(2);
```

React 发现 `page` 发生变化，执行 `useEffect`，重新请求第二页的数据。

注意，实际项目还应处理请求竞态、组件卸载和筛选条件变化，避免旧请求覆盖新数据。

接下来，我们完成三个实战任务：

1. 开发订单详情页。
2. 开发创建订单表单。
3. 完成 React 与 FastAPI 前后端联调。

### 第三课 · 3.8 订单详情、创建表单与前后端联调

#### 一、先明确页面之间的关系

我们已经有订单列表，现在需要形成完整的操作流程。

#### 订单管理前端业务流程

**订单列表页**

查询、搜索、分页

**查看详情**

订单信息、商品明细

**创建订单**

选择客户、商品、数量

**FastAPI 后端**

业务校验、库存预留、事务提交

**MySQL**

订单、订单明细、库存和库存流水

#### 二、开发订单详情页

##### 1. 先定义详情页的数据结构

一个订单详情不仅需要订单主表信息，还需要订单商品明细。

例如：

```json
{
  "id": 10001,
  "order_no": "ORD20261120001",
  "customer_id": 2001,
  "total_amount": "50.00",
  "status": "pending",
  "created_at": "2026-11-20T10:00:00",
  "items": [
    {
      "product_id": 1001,
      "product_name": "爆浆芝士猪排",
      "quantity": 2,
      "unit_price": "25.00",
      "subtotal": "50.00"
    }
  ]
}
```

注意：详情页应该使用独立的响应 Schema，而不是简单返回订单主表。

##### 2. 定义 TypeScript 类型

`src/types/order.ts`

```ts
export interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface OrderDetail {
  id: number;
  order_no: string;
  customer_id: number;
  total_amount: string;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
}
```

##### 3. 增加订单详情 API

`src/api/order.ts`

```ts
import type { OrderDetail } from "../types/order";

export const getOrderDetail = (id: number) => {
  return request.get<never, OrderDetail>(
    `/orders/${id}`
  );
};
```

##### 4. 编写订单详情页面

`src/pages/order/OrderDetail.tsx`

```ts
import { useEffect, useState } from "react";

import {
  Card,
  Descriptions,
  Table,
  Tag,
  Spin,
  message,
} from "antd";

import { useParams } from "react-router-dom";

import { getOrderDetail } from "../../api/order";
import type { OrderDetail as OrderDetailType } from "../../types/order";

export default function OrderDetailPage() {
  const { id } = useParams();

  const [data, setData] =
    useState<OrderDetailType | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);

      try {
        const result = await getOrderDetail(
          Number(id)
        );

        setData(result);
      } catch {
        message.error("订单详情加载失败");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <Spin />;

  if (!data) return <div>订单不存在</div>;

  return (
    <Card title="订单详情">
      <Descriptions column={2}>
        <Descriptions.Item label="订单编号">
          {data.order_no}
        </Descriptions.Item>

        <Descriptions.Item label="客户编号">
          {data.customer_id}
        </Descriptions.Item>

        <Descriptions.Item label="订单金额">
          ¥{data.total_amount}
        </Descriptions.Item>

        <Descriptions.Item label="订单状态">
          <Tag color="processing">
            {data.status}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      <h3>商品明细</h3>

      <Table
        rowKey="product_id"
        pagination={false}
        dataSource={data.items}
        columns={[
          {
            title: "商品名称",
            dataIndex: "product_name",
          },
          {
            title: "数量",
            dataIndex: "quantity",
          },
          {
            title: "单价",
            dataIndex: "unit_price",
          },
          {
            title: "小计",
            dataIndex: "subtotal",
          },
        ]}
      />
    </Card>
  );
}
```

这里我们使用了 `useParams()`，它可以从 URL 中获取订单 ID。

例如：

```text
/orders/10001
```

那么：

```ts
const { id } = useParams();
```

得到的就是 `"10001"`。

注意：如果同一个订单可能有多条相同商品明细，表格的 `rowKey` 应使用明细自身的唯一 ID，而不是 `product_id`。

#### 三、开发创建订单表单

创建订单是整个前端最重要的业务页面。

用户需要完成：

1. 选择客户。
2. 选择商品。
3. 填写商品数量。
4. 计算订单金额。
5. 提交订单。
6. 显示创建结果。

##### 1. 页面原型

**创建订单**

页面原型

客户

选择客户

例如：客户 2001

**商品明细**

商品名称

**爆浆芝士猪排**

数量

**2**

单价

**¥25**

**订单总金额**

### ¥50.00

提交订单（示意）

这是页面布局示意，实际页面将由 React 和 Ant Design 实现。

##### 2. 创建订单表单代码

`src/pages/order/OrderCreate.tsx`

```ts
import { useState } from "react";

import {
  Form,
  InputNumber,
  Select,
  Button,
  Card,
  Table,
  message,
} from "antd";

import { createOrder } from "../../api/order";

interface FormValues {
  customer_id: number;
  product_id: number;
  quantity: number;
}

export default function OrderCreate() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const price = 25;

  const [quantity, setQuantity] = useState(1);

  const total = price * quantity;

  const onFinish = async (values: FormValues) => {
    setLoading(true);

    const requestId = crypto.randomUUID();

    const payload = {
      request_id: requestId,
      customer_id: values.customer_id,
      items: [
        {
          product_id: values.product_id,
          quantity: values.quantity,
        },
      ],
    };

    try {
      const result = await createOrder(payload);

      message.success("订单创建成功");

      console.log(result);

      form.resetFields();
      setQuantity(1);

    } catch (error) {
      message.error("订单创建失败");

      // 真实实现应保留本次 request_id 和 payload，
      // 网络超时后使用相同请求内容重试。
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="创建订单">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="customer_id"
          label="客户"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="请选择客户"
            options={[
              {
                label: "客户 2001",
                value: 2001,
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="product_id"
          label="商品"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="请选择商品"
            options={[
              {
                label: "爆浆芝士猪排",
                value: 1001,
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="购买数量"
          initialValue={1}
          rules={[{ required: true }]}
        >
          <InputNumber
            min={1}
            max={100}
            onChange={(value) =>
              setQuantity(value ?? 1)
            }
          />
        </Form.Item>

        <h3>订单金额：¥{total.toFixed(2)}</h3>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          提交订单
        </Button>
      </Form>
    </Card>
  );
}
```

这是单商品的教学版本。真正的多商品订单，需要把商品明细改成可动态添加、删除的列表，并从商品 API 获取实时商品价格。

**重要：前端计算的金额只用于展示，后端必须根据商品价格重新计算金额。不能信任前端提交的订单总金额。**

另外，`request_id` 必须在一次逻辑提交的重试期间保持不变。上面示例每次点击都会生成新 ID，所以生产版本需要将它和原始请求一起保存，只有明确开始一笔新订单时才生成新 ID。

### 四、配置前端路由

现在需要把订单列表、详情、创建三个页面连接起来。

安装 React Router：

```bash
npm install react-router-dom
```

`src/App.tsx`

```ts
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import OrderList from "./pages/order/OrderList";
import OrderDetail from "./pages/order/OrderDetail";
import OrderCreate from "./pages/order/OrderCreate";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/orders"
          element={<OrderList />}
        />

        <Route
          path="/orders/create"
          element={<OrderCreate />}
        />

        <Route
          path="/orders/:id"
          element={<OrderDetail />}
        />
      </Routes>
    </BrowserRouter>
  );
}
```

然后在订单列表页面加入跳转：

```ts
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// 查看详情
navigate(`/orders/${record.id}`);

// 创建订单
navigate("/orders/create");
```

这样就形成了页面之间的导航关系。

### 五、前后端联调：让页面真正运行起来

这是本节最重要的部分。

前端代码写完，不代表系统已经完成。

必须让 React 真正调用 FastAPI。

#### 1. 配置 Vite 代理

假设：

- React：`localhost:5173`
- FastAPI：`localhost:8000`

修改 `vite.config.ts`：

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
```

这样前端请求：

```text
/api/orders
```

会自动转发到：

```text
http://localhost:8000/api/orders
```

开发环境下通常不需要额外处理跨域 CORS。

#### 2. 启动前后端

终端一：启动 FastAPI。

```bash
cd backend

uv run uvicorn app.main:app --reload --port 8000
```

终端二：启动 React。

```bash
cd frontend

npm run dev
```

打开：

本地订单管理页面 `http://localhost:5173/orders?utm_source=chatgpt.com`

如果服务没有在你的电脑上运行，这个地址暂时无法打开；它是本地开发地址。

#### 3. 联调时如何定位问题？

建议按照下面的顺序排查：

| **检查位置** | **检查内容** |
| --- | --- |
| 浏览器 Network | 请求是否发出、URL 是否正确 |
| HTTP Status | 返回 200、404、422 还是 500 |
| Response | 后端返回的数据结构是否正确 |
| FastAPI 日志 | 后端是否出现异常 |
| MySQL | 数据是否真正写入 |
| 前端状态 | 是否正确展示响应数据 |

例如：

前端出现：

```text
GET /api/orders 404
```

应该检查：

- FastAPI 是否注册了订单 Router。
- API 路径是否一致。
- Vite 代理是否正确。
- 是否多拼接了一次 `/api`。

#### 4. 前后端接口契约非常重要

我们之前的教学代码有一些简化，现在正式联调前，应该统一接口约定：

| **接口** | **方法** | **返回内容** |
| --- | --- | --- |
| `/api/orders` | GET | 分页订单列表 |
| `/api/orders` | POST | 创建后的订单 |
| `/api/orders/{id}` | GET | 订单详情及明细 |
| `/api/orders/{id}/cancel` | POST | 取消结果 |
| `/api/products` | GET | 商品选择列表 |
| `/api/customers` | GET | 客户选择列表 |

前端和后端必须使用相同的字段名、数据类型和状态枚举。

建议后端使用 FastAPI 自动生成的 OpenAPI 文档：

FastAPI Swagger API 文档 `http://localhost:8000/docs?utm_source=chatgpt.com`

可以直接在 Swagger 中测试接口，再回到 React 页面验证。

### 六、实战验收：完整订单业务闭环

现在我们已经有三个前端页面，需要验证它们能否真正协作。

#### 订单管理系统验收清单

完成情况

**0/10**

进入订单列表，能够查看后端订单数据

能够分页查询订单

能够进入订单详情，查看商品明细

能够选择客户和商品

能够填写购买数量并计算金额

能够成功创建订单

库存不足时展示友好的业务错误

重复提交不会创建重复订单

创建成功后可以在订单列表看到新订单

取消订单后状态和库存正确更新

### 七、实战练习：检查你对前后端联调的理解

现在遇到一个真实问题：

前端创建订单时，Network 显示：

```text
POST /api/orders

HTTP 422 Unprocessable Entity
```

FastAPI 返回：

```json
{
  "detail": [
    {
      "loc": ["body", "customer_id"],
      "msg": "Field required"
    }
  ]
}
```

你认为最可能的原因是什么？

- A. 前端提交的数据缺少 customer\_id，未满足后端 Schema 要求
- B. MySQL 数据库连接断开
- C. Vite 代理一定配置错误
- D. React 的 useState 无法保存数据

提交答案，继续学习

#### 八、第三课学习成果

核心编码知识已学习

| **学习模块** | **完成情况** |
| --- | --- |
| 项目初始化 | 已学习 |
| 分层架构 | 已学习 |
| SQLAlchemy ORM | 已学习 |
| 订单 CRUD | 已学习 |
| 事务和库存 | 已学习 |
| 异常与幂等 | 已学习 |
| React 订单列表 | 已学习 |
| React 订单详情 | 已学习 |
| React 创建订单 | 已学习 |
| 前后端联调 | 已学习 |

这里的「已学习」代表知识讲解和代码示例已经完成，实际项目运行与验收还需要通过上面的清单验证。

**第三课的核心能力：** 从系统设计文档出发，组织前后端代码，实现业务接口、界面和完整业务流程。

下一课我们将学习第四课：测试验证，重点掌握单元测试、集成测试、接口测试、自动化测试和缺陷管理，让软件不仅能运行，而且能够稳定运行。

## 对话 21　前后端联调与编码实现总结 {#turn-21}

> **用户**
>
> React 前后端联调实战，我选择 A。请评价，并总结第三课编码实现，进入第四课测试验证。

**ChatGPT**

回答正确 · 第三课完成

你选择 A：前端提交的数据缺少 `customer_id`，不符合后端 Pydantic Schema 的要求。

完全正确！

#### 一、为什么会出现 HTTP 422？

前端提交的数据可能是：

```json
{
  "product_id": 1001,
  "quantity": 2
}
```

但是后端定义的是：

```python
class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate]
```

后端要求必须提供 `customer_id` 和 `items`，前端却没有提供 `customer_id`，因此请求校验失败。

正确请求应该是：

```json
{
  "customer_id": 2001,
  "items": [
    {
      "product_id": 1001,
      "quantity": 2
    }
  ]
}
```

这里需要记住一个开发原则：

**前后端联调出现问题，先检查接口契约和实际请求数据，不要一看到报错就怀疑数据库。**

### 二、第三课总结：编码实现

课程完成

你已经完成了从系统设计到代码实现的学习。

#### 1. 第三课知识地图

#### 编码实现知识体系

1. **项目初始化与代码结构**

React、FastAPI、MySQL 项目组织

2. **后端分层架构**

Router、Service、Repository、Model、Schema

3. **数据库与 CRUD**

SQLAlchemy ORM、创建、查询、修改、删除

4. **业务事务**

订单创建、库存预留、取消、发货

5. **可靠性设计**

异常处理、幂等、并发安全

6. **前端开发**

React、TypeScript、Ant Design、Axios

7. **前后端联调**

API 契约、Vite 代理、Network 排错

#### 2. 第三课最重要的五个工程原则

| **原则** | **具体含义** |
| --- | --- |
| 职责分离 | 不把所有代码写在一个文件 |
| 业务闭环 | 优先完成完整业务流程 |
| 事务一致性 | 相关数据库操作统一提交或回滚 |
| 接口契约 | 前后端字段、类型、状态保持一致 |
| 可测试性 | 代码应便于单元测试和集成测试 |

#### 3. 第三课最终交付成果

一个可运行的订单管理系统，至少应该具备：

- 订单列表。
- 订单详情。
- 创建订单。
- 取消订单。
- 库存预留和发货扣减。
- 后端业务接口。
- 数据库事务。
- 前后端联调。

目前我们已经学习了这些功能的实现方法，但还没有在真实运行环境中完成整个项目的代码集成和验收。这正是第四课要解决的问题。

### 第四课：测试验证（Testing &amp; Validation）

正式开始 · 第 4/6 阶段

这一课我们要解决一个非常重要的问题：

**软件已经开发完成，如何证明它真的符合需求，并且在各种异常情况下仍然可靠？**

很多开发人员会写代码，却不太会系统地测试代码。

例如订单管理系统：

- 正常情况下可以创建订单。
- 库存不足时会不会超卖？
- 用户连续点击两次会不会重复创建订单？
- 订单取消失败时库存会不会错误释放？
- 数据库连接断开后会不会留下脏数据？

这些都属于测试验证需要解决的问题。

#### 一、测试验证到底是什么？

测试验证不是简单地打开页面，点击几个按钮，看看有没有报错。

它是一个系统化的质量保证过程。

我们先区分两个概念：

| **概念** | **核心问题** | **订单系统示例** |
| --- | --- | --- |
| 验证 Verification | 产品是否按照设计正确实现？ | 库存计算公式是否正确 |
| 确认 Validation | 产品是否真正满足用户需求？ | 管理员是否能准确管理订单 |

简单记忆：

- Verification：我们有没有把产品正确地做出来？
- Validation：我们做出来的产品是不是用户真正需要的？

### 二、第一课：认识软件测试的类型

软件测试通常分为四个层次。

#### 软件测试金字塔

**E2E**

端到端测试：完整业务流程

**Integration**

集成测试：多个模块协作

**Unit Test**

单元测试：单个函数和模块

这是测试金字塔的简化示意：通常单元测试数量最多，端到端测试数量相对较少。

#### 1. 单元测试（Unit Test）

测试一个独立函数或业务方法是否正确。

例如：

```python
def calculate_available_stock(
    total_stock: int,
    reserved_stock: int
):
    return total_stock - reserved_stock
```

测试：

```python
def test_available_stock():
    result = calculate_available_stock(100, 30)
    assert result == 70
```

测试目的：

- 函数计算是否正确。
- 参数异常是否处理。
- 边界条件是否正确。

单元测试一般使用 `pytest`。

#### 2. 集成测试（Integration Test）

测试多个模块组合后能否正常工作。

例如：

```text
OrderService
     ↓
InventoryService
     ↓
SQLAlchemy
     ↓
MySQL
```

测试：

- 创建订单能否成功预留库存。
- 创建订单失败是否正确回滚。
- 取消订单是否释放库存。
- 发货是否正确扣减库存。

这类测试通常需要真实的测试数据库，而不是完全依赖 Mock。

#### 3. 接口测试（API Test）

测试 HTTP API 是否符合接口约定。

例如：

```http
POST /api/orders
```

检查：

- HTTP 状态码。
- 请求参数校验。
- 返回 JSON 结构。
- 错误信息。
- 数据库是否产生正确变化。

FastAPI 可以使用 `TestClient`：

```python
from fastapi.testclient import TestClient
def test_create_order(client):
    response = client.post(
        "/api/orders",
        json={
            "customer_id": 2001,
            "items": [
                {
                    "product_id": 1001,
                    "quantity": 2
                }
            ]
        }
    )
    assert response.status_code == 200
```

这里的 `client` 应该来自测试环境的 Fixture，并连接独立测试数据库。

#### 4. 端到端测试（E2E Test）

模拟真实用户操作。

例如：

```text
打开订单管理页面
       ↓
点击创建订单
       ↓
选择客户
       ↓
选择商品
       ↓
填写购买数量
       ↓
提交订单
       ↓
查看订单详情
       ↓
验证库存变化
```

常见工具：

- Playwright
- Cypress

对于 React + FastAPI 项目，可以使用 Playwright 测试整个业务流程。

### 三、第二课：如何设计测试用例？

这是软件测试最重要的基础能力之一。

测试人员不能只凭感觉测试，而应该根据需求和风险设计测试用例。

我们继续使用订单创建功能。

#### 1. 正常场景测试

需求：

> 用户选择商品，填写数量，在库存充足时可以成功创建订单。

测试用例：

| **项目** | **内容** |
| --- | --- |
| 用例编号 | TC\_ORDER\_001 |
| 测试功能 | 创建订单 |
| 前置条件 | 商品库存 100 件 |
| 操作步骤 | 购买 2 件商品 |
| 预期结果 | 创建订单成功 |
| 库存预期 | 预留库存增加 2 件 |

#### 2. 异常场景测试

假设库存只有 2 件，用户购买 5 件。

| **项目** | **内容** |
| --- | --- |
| 用例编号 | TC\_ORDER\_002 |
| 测试功能 | 库存不足 |
| 前置条件 | 商品可用库存 2 件 |
| 操作步骤 | 购买 5 件 |
| 预期结果 | 返回库存不足 |
| 数据预期 | 不创建订单，不改变库存 |

#### 3. 边界场景测试

例如购买数量：

| **输入数量** | **预期结果** |
| --- | --- |
| -1 | 拒绝 |
| 0 | 拒绝 |
| 1 | 允许 |
| 100 | 根据业务上限判断 |
| 101 | 如果上限是 100，则拒绝 |

这就是边界值分析法。

#### 4. 等价类划分

例如购买数量要求：

1 ≤ quantity ≤ 1001≤quantity≤100

我们可以把输入划分为三个等价类：

- 无效类：小于 1。
- 有效类：1～100。
- 无效类：大于 100。

每类选择代表值进行测试，可以减少重复工作。

### 四、第三课：使用 pytest 测试订单业务

我们现在把测试理论应用到实际项目。

#### 1. 安装测试依赖

```bash
uv add --dev pytest pytest-cov httpx
```

建议测试目录：

```text
backend/
├── app/
│   ├── modules/
│   │   ├── order/
│   │   └── inventory/
│   └── database/
│
└── tests/
    ├── conftest.py
    ├── unit/
    │   ├── test_order_service.py
    │   └── test_inventory_service.py
    ├── integration/
    │   └── test_order_transaction.py
    └── api/
        └── test_order_api.py
```

#### 2. 测试库存计算

```python
def calculate_available_stock(total, reserved):
    if total < 0 or reserved < 0:
        raise ValueError("库存不能为负数")
    if reserved > total:
        raise ValueError("预留库存不能超过总库存")
    return total - reserved
```

测试：

```python
import pytest
def test_available_stock():
    assert calculate_available_stock(100, 30) == 70
def test_zero_stock():
    assert calculate_available_stock(0, 0) == 0
def test_negative_stock():
    with pytest.raises(ValueError):
        calculate_available_stock(-1, 0)
```

运行：

```bash
uv run pytest tests/unit -v
```

#### 3. 测试事务回滚

这是订单系统最值得重点测试的功能。

假设：

- 商品 A 预留成功。
- 商品 B 库存不足。
- 整个订单创建失败。

测试目标：

```python
def test_order_rollback_when_stock_insufficient(db):
    # 1. 准备商品 A、商品 B 的库存
    # 2. 创建包含两个商品的订单请求
    # 3. 执行创建订单
    # 4. 预期抛出库存不足异常
    # 5. 验证订单没有创建
    # 6. 验证商品 A 的预留库存已回滚
    # 7. 验证商品 B 的库存没有变化
    pass
```

这里先不急着写完整代码。

你需要先理解：**测试不仅检查程序有没有报错，还要检查失败后数据库是否保持正确状态。**

### 五、第四课：如何进行缺陷管理？

测试发现问题后，不能只是告诉开发人员：

「这里有 Bug，修一下。」

应该形成规范的缺陷记录。

例如：

**缺陷报告示例**

严重

**BUG-001：取消订单后库存重复释放**

| **字段** | **内容** |
| --- | --- |
| 模块 | 订单管理 |
| 优先级 | P0 |
| 环境 | 测试环境 |
| 复现条件 | 同一个订单连续取消两次 |
| 实际结果 | 预留库存被扣减两次 |
| 预期结果 | 只能释放一次 |
| 影响 | 库存数据不一致 |

**修复建议：**

- 增加订单状态检查。
- 锁定订单和预留记录。
- 使用事务。
- 增加幂等约束。
- 增加重复取消测试。

缺陷处理流程：

发现缺陷

记录缺陷并分配责任人

开发修复

重新测试

验证通过，关闭缺陷

这里还有一个重要概念：回归测试（Regression Testing）。

修复一个问题后，需要重新检查相关功能，防止修复引入新的问题。

例如修改库存释放逻辑后，应该重新测试：

- 正常取消。
- 重复取消。
- 正常发货。
- 重复发货。
- 库存不足。
- 并发取消和发货。

### 六、第四课综合知识地图

#### 测试验证能力体系

#### 1

**测试策略**

决定测什么、如何测试

#### 2

**测试用例**

正常、异常、边界、并发场景

#### 3

**自动化测试**

pytest、TestClient、Playwright

#### 4

**集成测试**

数据库、事务、模块协作

#### 5

**缺陷管理**

缺陷记录、修复、回归

#### 6

**测试报告**

通过率、缺陷率、覆盖率

### 七、第一道实战题：你来设计测试策略

现在假设你负责订单管理系统的测试工作。

产品经理提出：

> 用户创建订单时，如果库存不足，系统不能创建订单，也不能改变任何商品的库存。

你认为最重要的测试方式是什么？

- A. 集成测试：验证订单创建、库存预留和事务回滚的完整过程
- B. 只测试 React 页面是否正常显示
- C. 只测试订单编号是否生成
- D. 只测试数据库是否可以连接

提交答案，继续学习

#### 八、第四课学习计划

| **课程** | **学习内容** | **最终成果** |
| --- | --- | --- |
| 4.1 | 测试基础与测试类型 | 测试策略 |
| 4.2 | 测试用例设计 | 测试用例文档 |
| 4.3 | pytest 自动化测试 | 单元测试 |
| 4.4 | API 与集成测试 | 接口测试 |
| 4.5 | 并发与异常测试 | 可靠性验证 |
| 4.6 | 缺陷管理与回归测试 | 缺陷清单 |
| 4.7 | 测试报告与验收 | 测试报告 |

**第四课的最终目标：** 你能够独立为一个软件系统制定测试方案、设计测试用例、编写自动化测试、定位缺陷，并判断系统是否达到上线标准。

我们继续采用之前的学习方式：每次学习一个知识点，通过实战题检验，再逐步完成整个订单系统的测试方案。
