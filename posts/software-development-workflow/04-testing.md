---
title: "第四课　测试验证"
outline: 2
prev:
  text: "第三课　编码实现"
  link: /posts/software-development-workflow/03-implementation
next:
  text: "第五课　上线部署与运维"
  link: /posts/software-development-workflow/05-deployment
---

# 第四课　测试验证

[返回总目录](/posts/software-development-workflow)

## 对话 22　测试类型与测试用例 {#turn-22}

> **用户**
>
> 第四课测试验证第一道实战题，我选择 A。请评价，并继续引导我为订单系统设计完整测试用例。

**ChatGPT**

回答正确

你选择 A：集成测试，验证订单创建、库存预留和事务回滚的完整过程。

完全正确！

这道题考察的是你能否从单个功能转向完整业务链路的质量验证。

为什么不能只测试订单编号是否生成？

因为订单系统真正需要保证的是：

- 库存不足时不能创建订单。
- 订单创建失败时不能留下部分数据。
- 库存预留失败时不能产生错误库存。
- 多个商品中只要一个失败，整个订单事务就应该回滚。

**测试的重点不是代码有没有执行，而是业务结果是否正确。**

### 第四课 · 4.2 为订单系统设计完整测试用例

今天我们完成一个真实的软件测试工作：编写订单管理系统测试用例。

#### 一、第一步：从需求提取测试范围

先回顾订单管理系统的业务需求。

| **模块** | **主要功能** | **测试重点** |
| --- | --- | --- |
| 客户管理 | 客户查询 | 数据是否正确 |
| 商品管理 | 商品查询 | 商品是否存在 |
| 订单管理 | 创建订单 | 参数、金额、状态 |
| 订单管理 | 取消订单 | 库存是否释放 |
| 订单管理 | 发货 | 库存是否扣减 |
| 库存管理 | 库存预留 | 是否超卖 |
| 库存管理 | 库存释放 | 是否重复释放 |
| 库存管理 | 库存扣减 | 是否重复扣减 |

我们将测试范围划分为四类：

1. 功能测试。
2. 异常测试。
3. 并发测试。
4. 数据一致性测试。

#### 二、第二步：学习测试用例的标准结构

一个合格的测试用例应该包含以下信息：

**测试用例模板**

| **字段** | **含义** |
| --- | --- |
| 用例编号 | 唯一标识 |
| 测试模块 | 所属功能 |
| 测试标题 | 测试什么 |
| 前置条件 | 测试前的数据状态 |
| 测试步骤 | 如何执行 |
| 测试数据 | 使用什么数据 |
| 预期结果 | 正确结果是什么 |
| 实际结果 | 执行后观察到什么 |
| 测试状态 | 通过、失败、阻塞 |

我们用一个例子说明。

**TC\_ORDER\_001**

示例用例

**测试标题：库存充足时成功创建订单**

- 测试模块：订单管理
- 前置条件：商品库存 100 件，预留库存 20 件
- 测试数据：购买 2 件
- 操作步骤：

1. 选择客户。
2. 选择商品。
3. 输入数量 2。
4. 提交订单。

**预期结果：**

- 创建订单成功。
- 订单状态为待发货。
- 订单明细数量为 2。
- 预留库存变为 22。
- 可用库存变为 78。
- 库存流水新增一条预留记录。

注意：测试用例中的预期结果必须能够被验证，不能只写「系统运行正常」。

### 三、第三步：设计订单创建测试用例

先从订单创建开始。

我们假设：

- 商品 A 总库存 100。
- 已预留 20。
- 可用库存 80。
- 商品单价 25 元。

以下是第一批测试用例。

| **编号** | **测试场景** | **输入** | **预期结果** |
| --- | --- | --- | --- |
| TC001 | 正常创建订单 | 购买 2 件 | 创建成功 |
| TC002 | 库存不足 | 购买 81 件 | 创建失败 |
| TC003 | 商品不存在 | 无效商品 ID | 创建失败 |
| TC004 | 数量为 0 | quantity=0 | 参数校验失败 |
| TC005 | 数量为负数 | quantity=-1 | 参数校验失败 |
| TC006 | 客户不存在 | 无效 customer\_id | 创建失败 |
| TC007 | 重复提交 | 相同 request\_id | 返回原订单 |
| TC008 | 多商品订单 | A 成功、B 库存不足 | 全部回滚 |

这里特别关注 TC008。

例如：

- 商品 A 库存充足。
- 商品 B 库存不足。
- 用户同时购买 A 和 B。

预期结果：

- 不创建订单。
- 不创建订单明细。
- 商品 A 的预留库存恢复原值。
- 商品 B 库存保持原值。
- 不留下无效库存预留记录。

这就是事务一致性测试。

### 四、第四步：设计订单取消与发货测试用例

订单生命周期需要重点测试。

| **编号** | **测试场景** | **预期结果** |
| --- | --- | --- |
| TC009 | 正常取消订单 | 释放预留库存 |
| TC010 | 重复取消订单 | 不重复释放 |
| TC011 | 取消已发货订单 | 拒绝操作 |
| TC012 | 取消不存在的订单 | 返回 404 |
| TC013 | 正常发货 | 扣减总库存和预留库存 |
| TC014 | 重复发货 | 不重复扣减 |
| TC015 | 发货时预留不足 | 事务回滚 |
| TC016 | 取消与发货并发 | 只有一个合法操作成功 |

这些测试用例主要验证：

- 状态流转。
- 库存一致性。
- 幂等性。
- 并发安全。

### 五、第五步：设计库存专项测试

库存是订单系统中风险最高的模块之一。

假设：

| **项目** | **数值** |
| --- | --- |
| 总库存 | 100 |
| 预留库存 | 30 |
| 可用库存 | 70 |

我们需要验证以下场景：

| **编号** | **测试场景** | **预期结果** |
| --- | --- | --- |
| TC017 | 正常预留 | 预留库存增加 |
| TC018 | 库存刚好够用 | 预留成功 |
| TC019 | 库存刚好不足 | 预留失败 |
| TC020 | 正常释放 | 预留库存减少 |
| TC021 | 重复释放 | 不重复释放 |
| TC022 | 正常扣减 | 总库存和预留库存减少 |
| TC023 | 并发购买最后一件 | 只有一个请求成功 |
| TC024 | 非法库存数据 | 拒绝操作或检测出异常 |

其中 TC023 是一个关键测试。

#### 并发测试模拟

假设只剩 1 件商品。

两个用户同时提交订单：

**用户 A**

购买 1 件

**用户 B**

购买 1 件

**同时执行库存预留**

成功

用户 A

失败

用户 B

**最终断言：**

- 成功订单数：1。
- 预留数量：1。
- 可用库存：0。
- 不存在负库存。

测试时一定要使用两个独立的数据库 Session，才能真实模拟并发事务。

### 六、第六步：整理成完整测试用例库

现在我们已经设计了 24 个核心测试场景。

我建议在实际项目中按照下面的目录管理：

```text
测试管理/
├── 01-测试计划
├── 02-订单创建测试用例
├── 03-订单取消测试用例
├── 04-订单发货测试用例
├── 05-库存专项测试用例
├── 06-接口测试用例
├── 07-并发测试用例
├── 08-缺陷记录
└── 09-测试报告
```

测试执行后，还需要记录：

- 通过数量。
- 失败数量。
- 阻塞数量。
- 缺陷数量。
- 未覆盖的风险。
- 是否满足上线标准。

这就是完整的测试管理过程。

### 七、实战练习：你来设计测试用例

现在假设订单系统有一个需求：

> 用户连续提交两次相同的订单请求，系统只能创建一笔订单，库存也只能预留一次。

请问，这个需求最重要的测试场景是什么？

- A. 使用相同 request\_id 重复提交，检查订单数量、库存预留数量和库存流水是否只产生一次
- B. 只检查第二次请求是否返回 HTTP 200
- C. 只检查订单编号是否不同
- D. 只检查前端按钮是否被禁用

提交答案，继续学习

#### 八、第四课学习进度

#### 测试验证学习路线

1. 测试基础与测试类型

已学习

2. 测试用例设计

当前学习

3. pytest 自动化测试
4. API 与集成测试
5. 并发与异常测试
6. 缺陷管理与回归测试
7. 测试报告与上线验收

**本节最重要的能力转变：**

从「我觉得这个功能应该没问题」，转变为「我有明确的测试条件、执行步骤和可验证的预期结果，能够证明这个功能符合需求」。

这也是软件工程中非常重要的质量意识。

## 对话 23　用例设计与 pytest {#turn-23}

> **用户**
>
> 第四课测试用例设计实战，我选择 A。请评价，并继续教我使用 pytest 编写订单系统自动化测试。

**ChatGPT**

回答正确

你选择 A：使用相同 `request_id` 重复提交，检查订单数量、库存预留数量和库存流水是否只产生一次。

完全正确！

而且，你的答案已经具备比较完整的测试思维了。

为什么不能只检查第二次请求是否返回 HTTP 200？

因为 HTTP 200 只能说明请求成功返回，不能证明业务数据正确。

真正需要验证的是：

| **验证对象** | **预期结果** |
| --- | --- |
| 订单记录 | 只有 1 笔 |
| 订单明细 | 只创建 1 组 |
| 库存预留 | 只增加 1 次 |
| 库存流水 | 只产生 1 条对应流水 |
| 两次响应 | 返回同一笔订单 |

**记住：自动化测试应该验证业务结果，而不仅仅是接口响应。**

### 第四课 · 4.3 使用 pytest 编写订单系统自动化测试

今天我们开始真正编写测试代码。

本节结束时，你应该能够：

1. 使用 pytest 组织测试项目。
2. 使用 Fixture 准备测试数据。
3. 测试订单创建和库存预留。
4. 测试异常和事务回滚。
5. 测试订单幂等性。
6. 生成测试覆盖率报告。

#### 一、认识 pytest

*原对话配图*　File:Pytest logo.svg - Wikimedia Commons

**pytest**

Python 自动化测试框架，支持单元测试、集成测试、参数化测试和 Fixture。

[官方文档](https://docs.pytest.org/?utm_source=chatgpt.com)

为什么推荐 pytest？

| **能力** | **作用** |
| --- | --- |
| assert | 验证结果 |
| Fixture | 准备测试环境和数据 |
| parametrize | 批量测试不同参数 |
| raises | 验证异常 |
| mock | 模拟外部依赖 |
| coverage | 检查代码覆盖率 |

#### 二、第一步：安装测试环境

在我们的 FastAPI 项目中执行：

```bash
uv add --dev pytest pytest-cov httpx
```

建议目录结构：

```text
backend/
├── app/
│   ├── modules/
│   │   ├── order/
│   │   └── inventory/
│   ├── database/
│   └── main.py
│
├── tests/
│   ├── conftest.py
│   ├── unit/
│   │   ├── test_inventory.py
│   │   └── test_order_service.py
│   ├── integration/
│   │   └── test_order_transaction.py
│   └── api/
│       └── test_order_api.py
│
└── pyproject.toml
```

文件命名有一个规则：

- 测试文件以 `test_` 开头。
- 测试函数以 `test_` 开头。

pytest 会自动发现这些测试。

#### 三、第二步：编写第一个测试

我们先从最简单的库存计算开始。

假设：

- 总库存：100。
- 预留库存：30。
- 可用库存：70。

业务函数：

```python
# app/modules/inventory/utils.py
def calculate_available_stock(
    total_stock: int,
    reserved_stock: int
) -> int:
    if total_stock < 0:
        raise ValueError("总库存不能为负数")
    if reserved_stock < 0:
        raise ValueError("预留库存不能为负数")
    if reserved_stock > total_stock:
        raise ValueError("预留库存不能超过总库存")
    return total_stock - reserved_stock
```

测试代码：

```python
# tests/unit/test_inventory.py
from app.modules.inventory.utils import (
    calculate_available_stock
)
def test_available_stock():
    result = calculate_available_stock(100, 30)
    assert result == 70
```

运行：

```bash
uv run pytest tests/unit/test_inventory.py -v
```

预期输出：

```text
tests/unit/test_inventory.py::test_available_stock PASSED
```

这就是第一个自动化测试。

##### 重点理解 assert

```python
assert result == 70
```

意思是：

如果结果等于 70，测试通过。

如果结果不是 70，测试失败。

pytest 会自动显示失败位置和实际结果。

### 四、第三步：使用参数化测试

现在有一个问题。

我们只测试了 100 - 30 = 70。

但还需要测试：

- 100 - 0。
- 100 - 100。
- 10 - 5。
- 0 - 0。

如果每种情况都写一个测试函数，会非常繁琐。

pytest 提供了 `parametrize`。

```python
import pytest
@pytest.mark.parametrize(
    "total,reserved,expected",
    [
        (100, 30, 70),
        (100, 0, 100),
        (100, 100, 0),
        (10, 5, 5),
        (0, 0, 0),
    ]
)
def test_available_stock(
    total,
    reserved,
    expected
):
    assert calculate_available_stock(
        total,
        reserved
    ) == expected
```

现在一个测试函数就可以覆盖五组测试数据。

异常场景也可以这样测试：

```python
@pytest.mark.parametrize(
    "total,reserved",
    [
        (-1, 0),
        (100, -1),
        (10, 20),
    ]
)
def test_invalid_stock(total, reserved):
    with pytest.raises(ValueError):
        calculate_available_stock(
            total,
            reserved
        )
```

这里的 `pytest.raises()` 用于验证函数是否正确抛出了异常。

**这是测试边界条件和异常输入的常用方法。**

### 五、第四步：使用 Fixture 准备测试数据

现在进入订单系统的真正业务测试。

假设我们需要测试订单创建。

每次测试都需要准备：

- 一个客户。
- 一个商品。
- 一条库存记录。
- 一个数据库 Session。

如果每个测试函数都手动创建这些数据，会产生大量重复代码。

pytest 提供了 Fixture。

#### 1. 什么是 Fixture？

可以把 Fixture 理解为：

**测试开始前自动准备环境和数据，测试结束后负责清理资源。**

例如：

```python
# tests/conftest.py
import pytest
@pytest.fixture
def stock_data():
    return {
        "product_id": 1001,
        "total_stock": 100,
        "reserved_stock": 20
    }
```

使用：

```python
def test_reserve_stock(stock_data):
    available = (
        stock_data["total_stock"]
        - stock_data["reserved_stock"]
    )
    assert available == 80
```

pytest 会自动把 Fixture 返回的数据传给测试函数。

#### 2. 数据库 Fixture

真实订单测试应该使用独立测试数据库。

例如使用 MySQL 测试库：

```text
order_test
```

不要使用生产数据库。

一个简化的 SQLAlchemy 测试 Fixture：

```python
# tests/conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.base import Base
@pytest.fixture
def db():
    engine = create_engine(
        "mysql+pymysql://root:password@localhost/order_test"
    )
    connection = engine.connect()
    transaction = connection.begin()
    TestingSession = sessionmaker(
        bind=connection,
        expire_on_commit=False
    )
    session = TestingSession()
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()
        engine.dispose()
```

这里使用外层事务清理测试数据。

注意：这是基础教学版本。它要求应用内部的 Session 与测试连接正确共享事务；如果业务代码使用独立连接、嵌套事务或不同 Session，必须进一步设计事务隔离 Fixture。并发测试也不能复用这种单连接测试方式。

数据库地址、密码应该通过环境变量配置。

### 六、第五步：测试库存预留

我们已经有了库存预留的业务代码：

```python
class InventoryService:
    def __init__(self, db):
        self.db = db
    def reserve(self, product_id, quantity):
        # 库存预留逻辑
        ...
```

现在测试正常场景。

```python
def test_reserve_stock_success(db):
    inventory = Inventory(
        product_id=1001,
        total_stock=100,
        reserved_stock=20
    )
    db.add(inventory)
    db.flush()
    service = InventoryService(db)
    service.reserve(
        product_id=1001,
        quantity=5
    )
    db.refresh(inventory)
    assert inventory.reserved_stock == 25
```

再测试库存不足：

```python
def test_reserve_stock_insufficient(db):
    inventory = Inventory(
        product_id=1001,
        total_stock=100,
        reserved_stock=95
    )
    db.add(inventory)
    db.flush()
    service = InventoryService(db)
    with pytest.raises(ValueError):
        service.reserve(
            product_id=1001,
            quantity=10
        )
    db.refresh(inventory)
    assert inventory.reserved_stock == 95
```

这里的关键不是只检查异常。

还要检查：

**库存不足时，原有库存数据没有发生变化。**

另外，真实库存 Service 还应验证 `quantity > 0`，不能允许零数量或负数量的预留请求。

### 七、第六步：测试订单创建和事务回滚

这是今天最重要的实战。

业务场景：

商品 A：

- 总库存 100。
- 预留库存 20。

商品 B：

- 总库存 10。
- 预留库存 9。

用户购买：

- 商品 A：5 件。
- 商品 B：5 件。

预期：

- 商品 A 可以预留。
- 商品 B 库存不足。
- 整个订单创建失败。
- 商品 A 的库存预留必须回滚。

测试结构：

```python
def test_create_order_rollback(db):
    # 1. 准备商品 A、B 的库存
    # 2. 构造订单请求
    # 3. 调用 OrderService.create_order()
    # 4. 断言抛出库存不足异常
    # 5. 查询订单数量
    # 6. 查询商品 A 的预留库存
    # 7. 查询商品 B 的预留库存
    assert order_count == 0
    assert product_a_reserved == 20
    assert product_b_reserved == 9
```

这里使用的是测试思路，完整代码要根据你实际的 Model、Schema、Service 和 Repository 实现调整。

为什么要测试这几个数据？

因为仅仅看到 `ValueError`，无法证明事务正确回滚。

必须检查数据库最终状态。

### 八、第七步：测试订单幂等性

回到你刚才选择的测试场景。

同一个 `request_id`，连续提交两次。

示例：

```python
def test_create_order_idempotency(client):
    payload = {
        "request_id": "test_req_001",
        "customer_id": 2001,
        "items": [
            {
                "product_id": 1001,
                "quantity": 2
            }
        ]
    }
    response1 = client.post(
        "/api/orders",
        json=payload
    )
    response2 = client.post(
        "/api/orders",
        json=payload
    )
    assert response1.status_code == 200
    assert response2.status_code == 200
    assert (
        response1.json()["id"]
        == response2.json()["id"]
    )
```

但这还不够。

还要查询数据库：

```python
assert order_count == 1
assert reserved_stock == 22
assert reservation_count == 1
```

还应检查第二次请求的内容与第一次完全一致。

例如同一个 `request_id`，第一次购买 2 件，第二次却要求购买 5 件，后端应该拒绝这种请求编号复用，而不是静默返回原订单。

另外，真实并发重复请求还需要单独测试数据库唯一约束和冲突处理，不能只靠顺序执行两次请求来证明并发幂等。

### 九、第八步：测试覆盖率

我们写了很多测试，但还有一个问题：

究竟测试覆盖了多少代码？

这时可以使用 `pytest-cov`。

运行：

```bash
uv run pytest \
  --cov=app \
  --cov-report=term-missing
```

示例结果：

```text
Name                         Stmts   Miss  Cover

app/modules/order/service.py    80      12    85%
app/modules/inventory/service.py 45       5    89%

TOTAL                          125      17    86%
```

覆盖率的意思：

覆盖率 = (执行过的代码行数) ÷ (总可统计代码行数) × 100%覆盖率=总可统计代码行数执行过的代码行数​×100%

但是需要注意：

**代码覆盖率高，不代表业务一定正确。**

例如一个错误的库存计算函数，即使 100% 被执行，也可能没有正确验证边界条件。

因此，我们要结合：

- 代码覆盖率。
- 测试用例覆盖率。
- 业务风险覆盖率。
- 关键业务断言。

一起判断测试质量。

### 十、本节实战：判断测试代码是否正确

现在给你一个实际场景。

库存数据：

```python
total_stock = 100
reserved_stock = 95
```

用户想购买 10 件商品。

系统执行：

```python
with pytest.raises(ValueError):
    service.reserve(1001, 10)
```

这段测试已经验证了库存不足时会抛出异常。

但是，如果你要证明库存数据没有被错误修改，还需要增加什么？

- A. 重新查询数据库，断言 reserved\_stock 仍然等于 95
- B. 只检查 Python 函数执行时间
- C. 检查接口是否返回 HTTP 200
- D. 重新启动 FastAPI 服务

提交答案，继续学习

#### 十一、第四课学习进度

#### 测试验证学习路线

1. 测试基础与测试类型

已学习

2. 测试用例设计

已学习

3. pytest 自动化测试

当前学习

4. FastAPI API 与集成测试
5. 并发与异常测试
6. 缺陷管理与回归测试
7. 测试报告与上线验收

**本节最重要的三个知识点：**

1. `assert`：验证业务结果。
2. `Fixture`：统一准备测试环境和数据。
3. `pytest.raises`：验证异常行为。

你现在正在从「会编写业务代码」向「能够证明业务代码正确」转变。

下一步，我们会使用 FastAPI TestClient 和 Playwright，分别测试后端 API 和完整用户操作流程。

## 对话 24　接口测试与端到端测试 {#turn-24}

> **用户**
>
> pytest 自动化测试实战，我选择 A。请评价，并继续教我使用 FastAPI TestClient 编写接口测试和 Playwright 编写端到端测试。

**ChatGPT**

回答正确

你选择 A：重新查询数据库，断言 `reserved_stock` 仍然等于 95。

完全正确！

这说明你已经理解了自动化测试中一个非常重要的原则：

**不仅要验证程序有没有报错，还要验证数据库最终状态是否正确。**

例如：

```python
with pytest.raises(ValueError):
    service.reserve(1001, 10)
db.refresh(inventory)
assert inventory.reserved_stock == 95
```

这比单纯检查异常更有价值，因为它验证了业务数据没有被破坏。

今天我们继续第四课，学习两种非常重要的自动化测试工具：

- FastAPI TestClient：测试后端 API。
- Playwright：模拟真实用户操作，测试完整系统。

### 第四课 · 4.4 API 自动化测试与端到端测试

#### 一、先理解两种测试的区别

假设我们有一个订单创建功能。

用户操作流程：

```text
打开订单管理页面
       ↓
选择客户
       ↓
选择商品
       ↓
填写购买数量
       ↓
点击提交
       ↓
后端创建订单
       ↓
预留库存
       ↓
返回订单结果
```

我们可以从两个角度测试。

**API 测试**

FastAPI TestClient

*原对话配图*　路径操作配置 - FastAPI -  FastAPI 框架

[fastapi.org.cn](https://fastapi.org.cn/tutorial/path-operation-configuration/?utm_source=chatgpt.com)

直接发送 HTTP 请求，检查后端接口、参数校验、响应结果和业务数据。

**E2E 测试**

Playwright

*原对话配图*　UI Mode \| Playwright

[playwright.dev](https://playwright.dev/docs/test-ui-mode?utm_source=chatgpt.com)

打开真实浏览器，模拟用户点击、输入、提交，验证前后端完整业务流程。

两者的区别：

| **对比** | **TestClient** | **Playwright** |
| --- | --- | --- |
| 测试对象 | FastAPI API | 完整应用 |
| 是否需要浏览器 | 不需要 | 需要 |
| 是否测试 React | 不直接测试 | 可以 |
| 测试速度 | 通常较快 | 通常较慢 |
| 适合场景 | 接口和后端业务 | 用户操作和业务闭环 |

记住：

**TestClient 测试后端接口，Playwright 测试用户实际使用系统的过程。**

### 二、第一部分：使用 FastAPI TestClient

#### 1. 安装依赖

在后端项目中执行：

```bash
uv add --dev pytest httpx
```

TestClient 是 FastAPI 提供的测试客户端。

官方文档：

[FastAPI Testing 官方教程](https://fastapi.tiangolo.com/tutorial/testing/?utm_source=chatgpt.com)

#### 2. 准备测试项目

建议结构：

```text
backend/
├── app/
│   ├── main.py
│   ├── database/
│   └── modules/
│       └── order/
│           ├── router.py
│           ├── service.py
│           └── schema.py
│
└── tests/
    ├── conftest.py
    └── api/
        └── test_order_api.py
```

#### 3. 理解 TestClient 的工作原理

正常运行时：

```text
React
  ↓ HTTP
FastAPI
  ↓
OrderService
  ↓
MySQL
```

测试时：

```text
pytest
  ↓
TestClient
  ↓
FastAPI
  ↓
OrderService
  ↓
测试数据库
```

TestClient 可以直接调用 FastAPI 应用，不需要真的启动一个 HTTP 服务器。

但数据库仍然应该使用独立测试环境。

#### 4. 编写测试 Fixture

`tests/conftest.py`

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import get_db
@pytest.fixture
def client(test_db):
    def override_get_db():
        yield test_db
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()
```

这里有一个重要知识点：

```python
app.dependency_overrides[get_db] = override_get_db
```

它的作用是：

**将正式运行时的数据库依赖，替换为测试数据库依赖。**

这样就不会意外操作正式数据库。

这里的 `test_db` 需要使用前一节学过的数据库 Fixture 创建，并确保每个测试隔离数据。

#### 5. 测试创建订单 API

`tests/api/test_order_api.py`

```python
def test_create_order_success(client):
    payload = {
        "request_id": "test_order_001",
        "customer_id": 2001,
        "items": [
            {
                "product_id": 1001,
                "quantity": 2
            }
        ]
    }
    response = client.post(
        "/api/orders",
        json=payload
    )
    assert response.status_code == 200
    result = response.json()
    assert result["customer_id"] == 2001
    assert result["status"] == "pending"
    assert result["total_amount"] == "50.00"
```

这里我们验证了三个层面：

1. HTTP 状态码。
2. 响应数据结构。
3. 业务计算结果。

注意：这里假设你的 API 成功响应使用 HTTP 200。如果实际采用 HTTP 201，应按照真实接口契约修改断言。

#### 6. 测试参数校验失败

例如购买数量为负数：

```python
def test_create_order_invalid_quantity(client):
    payload = {
        "request_id": "test_order_002",
        "customer_id": 2001,
        "items": [
            {
                "product_id": 1001,
                "quantity": -1
            }
        ]
    }
    response = client.post(
        "/api/orders",
        json=payload
    )
    assert response.status_code == 422
```

这里验证的是 Pydantic Schema 的参数校验。

#### 7. 测试库存不足

```python
def test_create_order_insufficient_stock(client):
    payload = {
        "request_id": "test_order_003",
        "customer_id": 2001,
        "items": [
            {
                "product_id": 1001,
                "quantity": 999
            }
        ]
    }
    response = client.post(
        "/api/orders",
        json=payload
    )
    assert response.status_code == 409
    assert (
        response.json()["code"]
        == "INSUFFICIENT_STOCK"
    )
```

这里假设库存不足被统一映射成 HTTP 409。

#### 8. 测试重复提交

```python
def test_create_order_idempotency(client):
    payload = {
        "request_id": "test_order_004",
        "customer_id": 2001,
        "items": [
            {
                "product_id": 1001,
                "quantity": 2
            }
        ]
    }
    response1 = client.post(
        "/api/orders",
        json=payload
    )
    response2 = client.post(
        "/api/orders",
        json=payload
    )
    assert response1.status_code == 200
    assert response2.status_code == 200
    assert (
        response1.json()["id"]
        == response2.json()["id"]
    )
```

真实测试还必须查询数据库，验证：

- 订单数量为 1。
- 库存预留只增加 2 件。
- 预留记录只有一条。
- 对应库存流水只有一条。

这一步不能省略。

#### 9. 运行测试

```bash
uv run pytest tests/api -v
```

只运行订单创建测试：

```bash
uv run pytest tests/api/test_order_api.py -v
```

查看覆盖率：

```bash
uv run pytest \
  --cov=app.modules.order \
  --cov-report=term-missing
```

### 三、第二部分：使用 Playwright 编写端到端测试

现在我们从后端转到真正的用户操作。

*原对话配图*　Playwright Logo PNG Vector (SVG) Free Download

**Playwright**

由 Microsoft 开发的浏览器自动化和端到端测试框架。

[官方文档](https://playwright.dev/?utm_source=chatgpt.com)

#### 1. 安装 Playwright

进入前端项目：

```bash
cd frontend

npm install -D @playwright/test

npx playwright install
```

初始化：

```bash
npx playwright init
```

如果当前版本没有该初始化命令，可以直接创建 `playwright.config.ts` 和 `tests/` 目录。

#### 2. 项目目录

```text
frontend/
├── src/
│   ├── pages/
│   └── api/
│
├── tests/
│   └── order.spec.ts
│
├── playwright.config.ts
└── package.json
```

#### 3. 配置 Playwright

`playwright.config.ts`

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

这里的 `webServer` 会在测试前自动启动 React 开发服务器。

注意：FastAPI 也必须启动。可以在 CI 中分别启动前后端，或者通过额外的服务配置管理。

#### 4. 测试订单列表页面

`tests/order.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test("订单列表正常显示", async ({ page }) => {

  await page.goto("/orders");

  await expect(
    page.getByRole("heading", {
      name: "订单管理"
    })
  ).toBeVisible();

  await expect(
    page.getByText("ORD20261120001")
  ).toBeVisible();

});
```

这里的代码会：

1. 打开浏览器。
2. 访问订单列表。
3. 检查标题是否显示。
4. 检查订单编号是否出现。

这是真正模拟用户访问页面。

前提是测试环境中已经准备了对应订单数据。

#### 5. 测试创建订单

假设页面有：

- 客户选择框。
- 商品选择框。
- 数量输入框。
- 提交按钮。

我们可以这样测试：

```ts
test("用户成功创建订单", async ({ page }) => {

  await page.goto("/orders/create");

  await page.getByLabel("客户").click();

  await page.getByText("客户 2001").click();

  await page.getByLabel("商品").click();

  await page.getByText("爆浆芝士猪排").click();

  await page.getByLabel("购买数量").fill("2");

  await page.getByRole("button", {
    name: "提交订单"
  }).click();

  await expect(
    page.getByText("订单创建成功")
  ).toBeVisible();

});
```

Playwright 会真实执行浏览器交互。

注意：Ant Design 的 Select 组件可能需要使用 `getByRole("option")` 或其他更精确的定位方式。实际选择器要以运行页面的 DOM 为准。

#### 6. 测试库存不足

```ts
test("库存不足时创建订单失败", async ({ page }) => {

  await page.goto("/orders/create");

  // 选择测试客户和商品
  // 输入超过可用库存的数量
  // 提交订单

  await expect(
    page.getByText("商品库存不足")
  ).toBeVisible();

});
```

这是业务失败场景的端到端测试。

它不仅测试后端返回错误，还测试前端能否正确展示业务错误。

#### 7. 测试完整订单生命周期

这是一个更有价值的 E2E 测试：

```text
进入订单列表
    ↓
创建订单
    ↓
查看订单详情
    ↓
检查订单状态
    ↓
取消订单
    ↓
检查订单状态
    ↓
检查库存已经释放
```

不过有一点需要注意：

Playwright 负责浏览器操作，而库存是否正确变化，最好同时通过受控测试 API 或测试数据库断言验证。

不要只凭页面提示判断整个业务流程正确。

### 四、TestClient 和 Playwright 如何配合？

在实际项目中，不需要用 Playwright 测试所有业务细节。

建议这样分工：

| **测试内容** | **推荐工具** |
| --- | --- |
| Schema 参数校验 | TestClient |
| 订单金额计算 | pytest |
| 库存预留 | pytest + 测试数据库 |
| 事务回滚 | pytest + 测试数据库 |
| API 返回结构 | TestClient |
| API 权限验证 | TestClient |
| React 页面显示 | Playwright |
| 用户创建订单 | Playwright |
| 完整取消流程 | Playwright + 数据验证 |
| 真实并发超卖 | 独立数据库并发测试 |

**核心原则：底层业务用 pytest，接口边界用 TestClient，真实用户流程用 Playwright。**

### 五、实战：设计一个完整的自动化测试闭环

我们现在给订单系统设计一条端到端测试：

#### 订单自动化测试场景

1. **准备测试数据**

客户 2001，商品 1001，库存 100 件。

2. **Playwright 创建订单**

购买 2 件商品。

3. **验证订单详情**

订单状态为 pending，数量为 2。

4. **验证库存变化**

预留库存增加 2 件。

5. **取消订单**

调用取消接口，释放库存。

6. **验证最终结果**

订单已取消，预留库存恢复原值。

#### 六、测试自动化如何集成到 CI/CD？

以后每次开发人员提交代码，都可以自动执行测试。

例如使用 GitHub Actions：

```yaml
name: Order System Tests

on:
  push:
  pull_request:

jobs:
  backend-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install uv
        uses: astral-sh/setup-uv@v6

      - name: Install dependencies
        run: uv sync

      - name: Run tests
        run: uv run pytest tests -v
```

这是一个基础 CI 示例。真正的项目还需要启动 MySQL 测试服务、设置测试环境变量，并配置前端 E2E 测试任务。

最终工作流：

开发人员提交代码

GitHub Actions 自动执行

**pytest**

单元测试

**TestClient**

接口测试

**Playwright**

E2E 测试

**全部通过 → 允许进入后续发布流程**

### 七、实战练习：你来判断测试工具

现在有一个需求：

用户在 React 订单页面点击「创建订单」，系统需要验证：

1. 页面能否正常打开。
2. 用户能否选择商品。
3. 用户能否填写数量。
4. 提交后订单是否创建成功。
5. 页面是否显示成功提示。

你认为最适合的测试方式是什么？

- A. 使用 Playwright 模拟真实用户操作，执行完整端到端测试
- B. 只使用 pytest 测试一个 Python 函数
- C. 只使用 TestClient 测试后端接口
- D. 只检查 MySQL 是否能够连接

提交答案，继续学习

#### 八、第四课学习进度

#### 测试验证学习路线

1. 测试基础与测试类型

已学习

2. 测试用例设计

已学习

3. pytest 自动化测试

已学习

4. FastAPI TestClient 与 Playwright

当前学习

5. 并发与异常测试
6. 缺陷管理与回归测试
7. 测试报告与上线验收

**本节最重要的知识：**

- pytest：测试业务函数和数据库逻辑。
- TestClient：测试 FastAPI 接口。
- Playwright：测试真实用户操作。
- CI/CD：让测试自动执行，减少人工遗漏。

你现在已经掌握了软件测试自动化的基本工具链。下一步我们要重点攻克更难的问题：并发、异常和系统可靠性测试。

## 对话 25　并发测试与缺陷定位 {#turn-25}

> **用户**
>
> 第四课 API 与 E2E 测试实战，我选择 A。请评价，并继续教我订单系统并发测试、异常测试和缺陷定位。

**ChatGPT**

回答正确

你选择 A：使用 Playwright 模拟真实用户操作，执行完整端到端测试。

完全正确！

你的判断依据是：这次测试不仅涉及后端接口，还涉及 React 页面、用户交互、数据提交和结果展示，因此应该使用 Playwright。

再区分一下三个工具的职责：

| **工具** | **最适合验证什么** |
| --- | --- |
| pytest | Python 业务逻辑是否正确 |
| FastAPI TestClient | HTTP 接口是否正确 |
| Playwright | 用户能否顺利完成真实业务流程 |

例如，Playwright 测试创建订单成功后，还应该验证数据库中订单确实存在，而不只是看到页面显示「创建成功」。

今天进入第四课比较有挑战的一部分：**并发测试、异常测试和缺陷定位。**

### 第四课 · 4.5 并发测试、异常测试与缺陷定位

#### 一、为什么要测试并发？

先看一个真实的订单系统故障。

某商品只剩最后 1 件库存。

两个用户几乎同时下单：

- 用户 A 购买 1 件。
- 用户 B 购买 1 件。

如果系统没有正确处理并发，可能出现：

错误场景：库存超卖

**初始库存：1 件**

**用户 A**

读取库存：1

下单成功

**用户 B**

读取库存：1

下单成功

### 超卖 1 件

两个请求都基于过期的库存读取结果作出判断。

这就是并发安全问题。

##### 1. 理解竞态条件（Race Condition）

假设原始代码是：

```python
inventory = db.get(Inventory, product_id)
if inventory.total_stock - inventory.reserved_stock >= quantity:
    inventory.reserved_stock += quantity
    db.commit()
```

问题在于：

两个请求可能同时读取到相同库存，然后都认为库存充足。

这属于典型的竞态条件。

##### 2. 正确的库存预留方式

我们之前学过原子条件更新：

```sql
UPDATE inventory
SET reserved_stock = reserved_stock + 1
WHERE product_id = 1001
  AND total_stock - reserved_stock >= 1;
```

通过检查受影响行数：

```python
if result.rowcount != 1:
    raise InsufficientStockException()
```

数据库负责原子地判断和更新。

这是避免库存超卖的重要方法。

注意：它需要配合正确的事务、库存约束和统一的库存操作规则。仅仅加一个 Python 锁，不能保证多进程、多服务器环境下的并发安全。

#### 二、如何使用 pytest 测试并发？

现在我们实际编写并发测试。

测试目标：

- 初始库存 1 件。
- 两个请求同时购买 1 件。
- 只能有一个请求成功。
- 不能产生负库存。
- 只能有一笔有效库存预留。

##### 1. 编写并发测试代码

```python
import threading
from concurrent.futures import ThreadPoolExecutor
def test_concurrent_reserve(db_factory):
    barrier = threading.Barrier(2)
    def reserve_stock():
        # 每个线程创建独立 Session
        db = db_factory()
        try:
            service = InventoryService(db)
            barrier.wait()
            service.reserve(
                product_id=1001,
                quantity=1
            )
            db.commit()
            return "success"
        except InsufficientStockException:
            db.rollback()
            return "failed"
        finally:
            db.close()
    with ThreadPoolExecutor(max_workers=2) as executor:
        results = list(
            executor.map(
                lambda _: reserve_stock(),
                range(2)
```

这里有几个重要知识点：

| **技术** | **作用** |
| --- | --- |
| ThreadPoolExecutor | 并发执行任务 |
| Barrier | 让两个线程尽量同时开始 |
| 独立 Session | 模拟独立数据库事务 |
| commit | 提交各自事务 |
| rollback | 失败时撤销事务 |

注意：这个测试还需要在测试开始前将库存初始化为 1，并在结束后查询数据库验证 `reserved_stock == 1`。

另外，两个线程同时开始并不保证每次都能复现所有竞态。对于关键并发逻辑，应该重复执行测试，并结合数据库事务隔离级别、锁和真实 MySQL 环境验证。

##### 2. 并发测试的验收标准

**并发测试结果**

请求总数
**2**

成功预留

1 次

库存不足

1 次

最终预留库存
**1 件**

超卖数量

0 件

#### 三、异常测试：系统出错时是否还能保持正确？

并发测试解决的是多个请求同时执行的问题。

异常测试解决的是：**当某个环节失败时，系统能否安全地处理失败。**

订单系统常见异常可以分为五类。

| **异常类型** | **示例** | **重点检查** |
| --- | --- | --- |
| 参数异常 | 数量为负数 | 是否拒绝请求 |
| 业务异常 | 库存不足 | 是否正确返回业务错误 |
| 数据库异常 | 数据库连接断开 | 是否回滚事务 |
| 网络异常 | 请求超时 | 是否支持安全重试 |
| 并发异常 | 重复取消订单 | 是否重复释放库存 |

##### 1. 测试数据库操作失败

假设创建订单的过程中：

1. 商品 A 预留成功。
2. 订单记录写入成功。
3. 创建订单明细时数据库报错。
4. 整个事务应该回滚。

可以使用 Mock 模拟订单明细保存失败。

```python
from unittest.mock import patch
import pytest
def test_order_creation_rollback(db, order_data):
    service = OrderService(db)
    with patch.object(
        service.order_item_repository,
        "create",
        side_effect=RuntimeError("模拟数据库写入失败")
    ):
        with pytest.raises(RuntimeError):
            service.create_order(order_data)
    # 重新查询数据库，不能只检查内存对象
    assert get_order_count(db) == 0
    assert get_reserved_stock(db, 1001) == 20
```

这段代码是教学示例，具体 Repository 属性需要按照项目实际实现调整。

这里有一个重要区别：

- Mock 测试：验证代码遇到异常时是否调用回滚。
- 数据库集成测试：验证真实数据库事务是否真的回滚。

两者都需要，不能只依靠 Mock 证明事务可靠。

##### 2. 测试网络超时

假设用户提交订单，后端已经创建成功，但是响应过程中网络超时。

此时不能直接认为订单创建失败。

正确的测试流程：

用户提交订单

后端创建订单成功

响应超时

前端没有收到结果

使用原 request\_id 重试

返回原订单

不重复预留库存

测试时需要验证：

- 原订单仍然存在。
- 重试不会创建新订单。
- 库存不会重复预留。
- 两次请求返回同一个订单 ID。

##### 3. 测试取消与发货并发

这是一个很容易被忽视的问题。

订单当前状态为 `pending`。

两个操作同时执行：

- 用户请求取消。
- 仓库人员请求发货。

预期结果：

| **场景** | **结果** |
| --- | --- |
| 取消先成功 | 发货被拒绝 |
| 发货先成功 | 取消被拒绝 |
| 两个请求同时到达 | 只有一个状态转换成功 |

不能出现：

- 订单状态是已取消，但库存已经扣减。
- 订单状态是已发货，但库存又被释放。
- 同一笔订单既释放库存又扣减库存。

这里应该重点测试订单行锁、状态校验、预留记录状态以及事务一致性。

##### 4. 建立异常测试矩阵

建议实际项目采用下面的测试矩阵：

| **测试编号** | **异常场景** | **预期结果** |
| --- | --- | --- |
| EX001 | 参数缺失 | 422 |
| EX002 | 库存不足 | 409 |
| EX003 | 商品不存在 | 404 |
| EX004 | 数据库写入失败 | 回滚 |
| EX005 | 数据库连接中断 | 失败且不产生部分数据 |
| EX006 | 重复提交 | 返回原订单 |
| EX007 | 重复取消 | 不重复释放 |
| EX008 | 重复发货 | 不重复扣减 |
| EX009 | 取消与发货并发 | 只允许一个成功 |
| EX010 | 多商品订单部分失败 | 全部回滚 |

### 四、缺陷定位：发现 Bug 后如何找到根因？

这是测试工程师和开发工程师都必须掌握的能力。

假设测试人员反馈：

> 用户取消订单后，库存没有恢复。

很多初级开发人员会直接修改库存 SQL。

但这可能不是根因。

我们应该先定位问题发生在哪一层。

#### 1. 建立分层排查方法

#### 订单缺陷定位流程

**第一层：前端**

是否正确发起取消请求？请求参数是否正确？

**第二层：API**

接口是否成功接收？HTTP 状态码和响应是什么？

**第三层：Service**

是否执行了库存释放？订单状态判断是否正确？

**第四层：Repository / SQL**

SQL 是否正确？影响行数是多少？

**第五层：数据库**

事务是否提交？库存预留记录和流水是否正确？

这个排查过程可以避免没有证据就修改代码。

#### 2. 学会查看关键日志

例如订单取消失败：

```python
logger.info(
    "开始取消订单",
    extra={
        "order_id": order_id,
        "request_id": request_id
    }
)
logger.info(
    "库存释放完成",
    extra={
        "order_id": order_id,
        "product_id": product_id,
        "quantity": quantity
    }
)
logger.info(
    "订单事务提交成功",
    extra={
        "order_id": order_id
    }
)
```

发生异常时：

```python
logger.exception(
    "订单取消失败",
    extra={
        "order_id": order_id
    }
)
```

日志应包含：

- 请求 ID。
- 订单 ID。
- 操作类型。
- 商品 ID。
- 操作数量。
- 数据库影响行数。
- 异常类型。

不要记录密码、访问令牌等敏感信息。

#### 3. 使用 SQL 定位数据问题

假设订单取消后库存不正确。

先查询订单：

```sql
SELECT id, order_no, status
FROM orders
WHERE id = 10001;
```

查询库存：

```sql
SELECT
    product_id,
    total_stock,
    reserved_stock,
    total_stock - reserved_stock AS available_stock
FROM inventory
WHERE product_id = 1001;
```

查询预留记录：

```sql
SELECT *
FROM inventory_reservations
WHERE order_id = 10001;
```

查询库存流水：

```sql
SELECT *
FROM inventory_transactions
WHERE order_id = 10001
ORDER BY created_at;
```

通过这些数据，我们可以判断：

- 订单状态是否更新。
- 库存是否释放。
- 预留记录是否更新。
- 流水是否重复写入。

#### 4. 缺陷定位的完整案例

假设发现：

缺陷 BUG-002

**订单取消成功，但库存没有恢复**

初始状态：

- 总库存：100
- 预留库存：30
- 订单预留：5

取消后：

- 订单状态：cancelled
- 预留库存：30
- 预留记录：released

我们发现：

订单已经取消，预留记录也已经释放，但库存数字没有变化。

这说明可能出现了：

1. 库存释放 SQL 没有执行。
2. SQL 更新影响行数为 0。
3. 库存修改后发生事务回滚。
4. 订单取消和库存释放使用了不同的数据库事务。

这里不能直接断定是哪一种，需要通过 SQL 日志、事务日志和测试复现进一步确认。

**真正的缺陷定位，是根据证据找到根因，而不是猜测代码哪里有问题。**

### 五、建立一套标准的缺陷处理流程

以后你开发商用软件或者企业内部系统，可以直接使用这个流程。

#### 缺陷处理闭环

1. **发现问题**

测试人员发现异常现象。

2. **记录缺陷**

记录环境、数据、步骤、预期和实际结果。

3. **定位根因**

从前端、API、Service、SQL、数据库逐层排查。

4. **修复问题**

修改代码，并补充能够复现缺陷的自动化测试。

5. **回归测试**

验证修复效果及相关功能没有受到影响。

6. **关闭缺陷**

确认测试通过，记录最终修复版本。

### 六、实战练习：分析一个真实的并发 Bug

现在给你一道综合题。

某商品：

- 总库存：100 件。
- 预留库存：99 件。
- 可用库存：1 件。

两个用户同时购买 1 件。

系统最终出现：

- 用户 A 创建订单成功。
- 用户 B 创建订单成功。
- 预留库存变成 101 件。

你认为最可能的根本原因是什么？

- A. 库存检查和库存更新不是原子操作，两个请求同时读取到相同的可用库存
- B. React 页面没有使用 useState
- C. 订单编号生成方式不正确
- D. pytest 没有安装成功

提交答案，继续学习

### 七、本节学习成果

你今天学习了三个重要能力：

| **能力** | **你需要掌握的内容** |
| --- | --- |
| 并发测试 | 发现超卖、重复操作、竞态条件 |
| 异常测试 | 验证事务回滚、网络超时、数据库异常 |
| 缺陷定位 | 根据日志、SQL 和数据状态寻找根因 |

#### 第四课学习进度

#### 测试验证学习路线

1. 测试基础与测试类型

已学习

2. 测试用例设计

已学习

3. pytest 自动化测试

已学习

4. FastAPI TestClient 与 Playwright

已学习

5. 并发与异常测试、缺陷定位

当前学习

6. 缺陷管理与回归测试
7. 测试报告与上线验收

**下一步：** 我们将学习如何管理缺陷、制定回归测试计划，以及编写正式的软件测试报告。

这一步完成后，你就能把测试从单纯的代码验证，提升到完整的软件质量管理。

## 对话 26　缺陷管理与回归测试 {#turn-26}

> **用户**
>
> 第四课并发与缺陷定位实战，我选择 A。请评价，并继续教我缺陷管理、回归测试和测试报告。

**ChatGPT**

回答正确 · 并发问题分析通过

你选择 A：库存检查和库存更新不是原子操作，两个请求同时读取到了相同的可用库存。

完全正确！

#### 一、评价：你已经能够识别典型并发缺陷

初始库存：

- 总库存：100 件。
- 已预留：99 件。
- 可用库存：1 件。

两个请求同时执行：

#### 错误的并发执行过程

**用户 A**

读取可用库存：1

**判断：可以购买**

**用户 B**

读取可用库存：1

**判断：可以购买**

### 预留库存 = 101

两个请求都成功，发生超卖

正确的修复思路是：

1. 使用数据库原子条件更新，或者行锁。
2. 检查数据库实际更新行数。
3. 在同一个事务中完成库存预留和订单创建。
4. 使用独立数据库 Session 测试并发。
5. 验证最终库存和订单数据。

例如：

```sql
UPDATE inventory
SET reserved_stock = reserved_stock + 1
WHERE product_id = 1001
  AND total_stock - reserved_stock >= 1;
```

如果影响行数为 0，说明库存不足，不能创建订单。

你已经理解了一个重要的软件工程原则：

**不能只验证正常情况下功能能否运行，还要验证多个请求同时执行时，系统是否仍然正确。**

### 第四课 · 4.6 缺陷管理、回归测试与测试报告

今天我们要把前面学过的测试知识整合起来。

本节结束后，你应该能够独立完成：

- 缺陷记录与分级。
- 缺陷生命周期管理。
- 回归测试计划。
- 测试结果统计。
- 软件测试报告。

#### 二、第一部分：缺陷管理

##### 1. 什么是缺陷管理？

缺陷管理不是简单地记录 Bug，而是建立一套从发现问题到确认修复的管理机制。

例如：

某用户反馈：

> 取消订单后，商品库存没有恢复。

如果只是把这句话发给开发人员，很难高效解决。

我们需要记录完整信息。

##### 2. 缺陷报告的标准结构

**BUG-003：取消订单后库存未恢复**

严重程度：高

| **字段** | **内容** |
| --- | --- |
| 缺陷编号 | BUG-003 |
| 所属模块 | 订单管理 |
| 缺陷类型 | 数据一致性 |
| 严重程度 | 高 |
| 优先级 | P1 |
| 发现环境 | 测试环境 |
| 发现版本 | v1.0.0 |
| 当前状态 | 待修复 |

**复现步骤**

1. 创建一笔订单，购买商品 5 件。
2. 确认库存预留增加 5 件。
3. 取消订单。
4. 查询商品库存。

**实际结果**

订单状态变成 cancelled，但预留库存没有减少。

**预期结果**

订单取消成功，预留库存减少 5 件，库存流水产生一条释放记录。

**初步排查方向**

检查库存释放 SQL、数据库事务和预留记录状态。

这里要特别区分两个概念：

| **概念** | **含义** |
| --- | --- |
| 严重程度 Severity | Bug 对系统造成多大影响 |
| 优先级 Priority | 应该多快处理 |

例如：

- 库存超卖：严重程度高，通常优先级也高。
- 页面按钮颜色错误：严重程度低，通常优先级低。
- 某个低频报表显示错误：严重程度可能中等，但如果影响财务结算，优先级可能很高。

不要把严重程度和优先级混为一谈。

##### 3. 缺陷等级如何划分？

| **等级** | **说明** | **订单系统示例** |
| --- | --- | --- |
| P0 | 阻断核心业务或重大数据风险 | 大面积库存超卖 |
| P1 | 核心功能严重异常 | 订单无法创建 |
| P2 | 部分功能异常，有替代方案 | 订单筛选失效 |
| P3 | 轻微问题 | 页面文字或样式错误 |

这是项目管理中的一种常见划分方式，具体定义应由团队统一。

##### 4. 缺陷生命周期

#### Bug 生命周期

**New**

发现缺陷

**Assigned**

分配开发负责人

**Fixed**

开发修复完成

**Retest**

测试人员重新验证

**Closed**

验证通过，关闭缺陷

如果重新测试失败，应重新打开缺陷（Reopened），继续修复。

管理缺陷时，必须确保每个 Bug 都有负责人、状态、复现步骤和验证结果。

#### 三、第二部分：回归测试（Regression Testing）

这是软件开发中非常重要的一项能力。

##### 1. 什么是回归测试？

假设开发人员修复了一个问题：

> 取消订单后库存没有恢复。

修改了库存释放逻辑。

问题是：这次修改会不会影响其他功能？

例如：

- 正常创建订单是否还正常？
- 库存预留是否还正常？
- 重复取消是否会重复释放？
- 发货扣减是否受到影响？
- 多商品订单是否还正常？

这些就是回归测试需要验证的内容。

**回归测试的核心：修复一个问题后，重新验证相关功能没有被破坏。**

##### 2. 如何制定回归测试范围？

不要每次修改代码都重新测试整个系统。

应该根据修改范围和影响范围确定回归范围。

例如：

**本次代码修改：库存释放逻辑**

必须回归

- 正常取消订单
- 重复取消订单
- 取消已发货订单
- 库存预留记录状态
- 库存流水

建议回归

- 正常创建订单
- 多商品订单
- 发货扣减库存
- 库存不足场景

视影响范围决定

- 订单列表展示
- 订单详情展示
- 客户管理

##### 3. 学习影响分析

例如：

开发人员修改了：

```text
InventoryService.release()
```

我们需要找到所有调用这个方法的业务流程。

```text
InventoryService.release()
       ↑
       ├── OrderService.cancel()
       ├── AfterSalesService.refund()
       └── AdminService.adjust_inventory()
```

那么这三个调用方都应该纳入影响分析。

这就是为什么软件架构中的模块边界和依赖关系很重要。

模块之间的依赖关系越清晰，回归测试范围就越容易确定。

##### 4. 建立自动化回归测试集

建议订单系统维护一组固定的自动化测试：

| **测试编号** | **测试场景** | **自动化方式** |
| --- | --- | --- |
| REG001 | 正常创建订单 | TestClient |
| REG002 | 库存不足 | TestClient |
| REG003 | 多商品事务回滚 | pytest |
| REG004 | 重复提交 | TestClient |
| REG005 | 正常取消订单 | TestClient |
| REG006 | 重复取消 | TestClient |
| REG007 | 正常发货 | TestClient |
| REG008 | 并发购买最后一件 | pytest + MySQL |
| REG009 | 创建订单页面 | Playwright |
| REG010 | 完整订单生命周期 | Playwright |

##### 5. 回归测试什么时候执行？

| **时间点** | **是否建议执行** |
| --- | --- |
| 修改核心业务代码后 | 是 |
| 修改数据库结构后 | 是 |
| 修改 API 契约后 | 是 |
| 修复线上 Bug 后 | 是 |
| 发布新版本前 | 是 |
| 修改纯文案后 | 根据影响范围决定 |

对于核心订单系统，建议每次提交执行快速自动化测试，在合并代码和发布前执行完整回归测试。

#### 四、第三部分：编写软件测试报告

现在我们已经知道：

- 测什么。
- 怎么测试。
- 如何发现 Bug。
- 如何管理 Bug。
- 如何进行回归测试。

接下来要回答一个管理问题：

**老板如何知道系统是否已经达到上线标准？**

这就需要测试报告。

##### 1. 测试报告包含什么？

一份标准的软件测试报告，通常包含：

1. 测试基本信息。
2. 测试范围。
3. 测试环境。
4. 测试执行情况。
5. 缺陷统计。
6. 测试覆盖情况。
7. 遗留风险。
8. 上线建议。

##### 2. 订单系统测试报告示例

**订单管理系统测试报告**

示例报告

版本：V1.0.0 · 测试阶段：系统测试

**测试执行情况**

### 100

测试用例总数

### 92

通过用例

### 5

失败用例

### 3

阻塞用例

**测试通过率**

### 92%

**缺陷统计**

| **严重程度** | **数量** |
| --- | --- |
| P0 | 0 |
| P1 | 1 |
| P2 | 3 |
| P3 | 2 |
| 合计 | 6 |

**主要测试结论**

- 订单创建和查询功能基本正常。
- 订单取消存在一个高优先级缺陷。
- 并发库存测试仍有失败场景。
- 还有 3 条测试用例因环境问题阻塞。

暂不建议上线

**上线建议：** 先修复 P1 缺陷，解决并发库存问题，完成阻塞用例，再进行回归测试。

注意：这是教学用的虚构测试数据，不是实际项目测试结果。

##### 3. 学会计算测试指标

**测试通过率**

通过率=(通过用例数) ÷ (已执行用例数) × 100%通过率=已执行用例数通过用例数​×100%

上面示例中：

(92) ÷ (92+5)=94.85%92+592​=94.85%

这里要特别注意：阻塞的 3 条用例没有执行，所以不能把它们直接算作失败。

因此，示例卡片中的 92% 如果定义为总用例通过比例，与标准的已执行用例通过率并不一致。实际报告应明确指标口径。

建议使用：

| **指标** | **计算方法** |
| --- | --- |
| 已执行用例数 | 通过数 + 失败数 |
| 通过率 | 通过数 / 已执行数 |
| 失败率 | 失败数 / 已执行数 |
| 阻塞率 | 阻塞数 / 总用例数 |
| 缺陷修复率 | 已修复缺陷数 / 已确认缺陷数 |

**测试覆盖率**

还需要关注：

- 需求覆盖率：有多少需求具备测试用例。
- 功能覆盖率：有多少功能被测试。
- 代码覆盖率：测试执行过多少代码。
- 风险覆盖率：关键风险是否被验证。

不要只用一个 92% 就判断系统质量。

##### 4. 如何判断能不能上线？

建议建立明确的上线准入条件。

**订单系统上线准入标准**

必须满足

- P0 缺陷数量为 0。
- 阻断上线的 P1 缺陷数量为 0。
- 核心业务流程测试通过。
- 订单、库存数据一致性验证通过。
- 关键并发测试通过。
- 数据库事务回滚测试通过。

需要评估

- P2、P3 遗留缺陷。
- 非核心功能未覆盖范围。
- 性能和容量风险。
- 监控、备份及回滚准备情况。

一个重要原则：

**上线不是由测试通过率单独决定，而是由关键业务风险、缺陷严重程度、测试证据和业务负责人共同决定。**

### 五、把测试工作形成闭环

现在我们把第四课的知识串联起来。

#### 软件测试完整闭环

1. **需求分析**：明确测试范围和验收标准
2. **测试设计**：编写测试用例
3. **自动化测试**：pytest、TestClient、Playwright
4. **异常与并发测试**：验证可靠性
5. **缺陷管理**：记录、分级、分配和修复
6. **回归测试**：验证修改没有引入新问题
7. **测试报告**：汇总测试结果和遗留风险
8. **上线验收**：根据准入条件作出发布决策

这就是一个完整的软件质量保证流程。

### 六、综合实战：你来判断缺陷管理策略

现在假设订单系统正在准备上线。

测试人员发现三个问题：

| **缺陷** | **问题描述** |
| --- | --- |
| BUG-001 | 并发下单出现库存超卖 |
| BUG-002 | 订单列表筛选按钮颜色不正确 |
| BUG-003 | 取消订单后库存没有恢复 |

你是项目负责人，需要安排处理优先级。

你认为应该如何处理？

- A. 优先修复 BUG-001 和 BUG-003，完成库存相关回归测试；BUG-002 根据发布要求安排修复
- B. 优先修复按钮颜色，因为最容易修复
- C. 三个 Bug 都不处理，只要测试通过率超过 90% 就上线
- D. 只修复 BUG-001，其他问题不需要测试

提交答案，继续学习

### 七、第四课学习进度

#### 测试验证学习路线

1. 测试基础与测试类型

已学习

2. 测试用例设计

已学习

3. pytest 自动化测试

已学习

4. FastAPI TestClient 与 Playwright

已学习

5. 并发与异常测试、缺陷定位

已学习

6. 缺陷管理、回归测试与测试报告

当前学习

7. 测试综合验收

#### 八、第四课最终交付成果

完成第四课后，你应该能独立产出以下六份成果：

| **交付物** | **用途** |
| --- | --- |
| 测试计划 | 明确测试范围 |
| 测试用例库 | 记录测试场景 |
| 自动化测试代码 | 自动验证功能 |
| 缺陷清单 | 管理发现的问题 |
| 回归测试记录 | 验证修复效果 |
| 测试报告 | 支持上线决策 |

**我希望你重点建立一个工作习惯：**

以后开发任何软件功能，不要只问自己「代码写完了吗？」

还要问：

1. 需求是否满足？
2. 正常场景是否通过？
3. 异常场景是否通过？
4. 数据是否一致？
5. 修改是否影响其他功能？
6. 有没有足够的测试证据支持上线？

这六个问题能够帮助你建立真正的软件工程质量意识。

下一步完成综合实战后，我们进入第五课：**上线部署与运维**，学习 Docker、Linux、Nginx、CI/CD、日志监控、数据库备份和线上故障处理，最终把订单系统从本地开发环境真正部署到生产环境。

## 对话 27　测试总结与部署准备 {#turn-27}

> **用户**
>
> 第四课缺陷管理与回归测试综合实战，我选择 A。请评价我的判断，并总结第四课，带我进入第五课上线部署与运维。

**ChatGPT**

回答正确 · 第四课完成

你选择 A：优先修复 BUG-001 和 BUG-003，完成库存相关回归测试；BUG-002 根据发布要求安排修复。

完全正确！这是一个具有风险意识的项目管理决策。

#### 一、评价你的判断

三个缺陷的风险不同：

| **缺陷** | **业务影响** | **处理建议** |
| --- | --- | --- |
| BUG-001 库存超卖 | 造成库存数据错误、超额销售 | 最高优先级 |
| BUG-003 取消订单库存未恢复 | 造成库存不一致 | 最高优先级 |
| BUG-002 按钮颜色错误 | 主要影响视觉体验 | 低优先级 |

你的判断正确，因为你抓住了软件质量管理的核心：

**优先解决影响业务正确性、数据一致性和资金安全的问题，而不是优先解决最容易修复的问题。**

不过还有一个细节：

BUG-002 虽然通常不阻断业务，但如果它导致用户误操作，也可能升级为较高优先级。缺陷优先级不能只看表面现象，还要看实际影响。

### 二、第四课总结：测试验证

阶段完成

经过第四课，你已经学习了从测试设计到上线验收的完整流程。

#### 1. 第四课知识地图

#### 软件测试验证体系

1. **测试基础**

单元测试、集成测试、API 测试、E2E 测试

2. **测试用例设计**

正常、异常、边界、等价类、并发场景

3. **自动化测试**

pytest、Fixture、TestClient、Playwright

4. **可靠性测试**

事务回滚、幂等、超卖、网络异常

5. **缺陷管理**

缺陷分级、生命周期、根因分析

6. **回归测试**

影响分析、自动化回归测试

7. **测试报告与验收**

测试指标、遗留风险、上线准入条件

#### 2. 第四课最重要的五个工程原则

| **原则** | **具体含义** |
| --- | --- |
| 需求可验证 | 每个需求都应该有测试标准 |
| 风险优先 | 优先测试核心业务和高风险场景 |
| 自动化优先 | 重复测试尽量自动执行 |
| 缺陷闭环 | 每个问题都要记录、修复、回归 |
| 证据驱动 | 根据测试结果决定是否上线 |

#### 3. 第四课最终交付物

一个合格的软件测试阶段应该形成：

- 测试计划。
- 测试用例库。
- pytest 自动化测试代码。
- API 测试代码。
- E2E 测试代码。
- 缺陷清单。
- 回归测试记录。
- 测试报告。

注意：我们已经学习了这些交付物的编写方法，但还没有在真实订单项目中全部执行并形成正式报告。

### 第五课：上线部署与运维（Deployment &amp; Operations）

正式开始 · 第 5/6 阶段

前面四课，我们已经完成了软件系统的：

1. 需求分析。
2. 系统设计。
3. 编码实现。
4. 测试验证。

现在进入一个新的阶段：

**如何把本地开发完成的软件，部署到服务器，让真实用户能够稳定使用？**

这是从开发者走向独立软件工程师的重要一步。

#### 一、第五课学习目标

我们继续使用订单管理系统作为实战项目。

技术栈：

#### 订单系统部署架构

**前端**

React + TypeScript

**后端**

Python + FastAPI

**数据库**

MySQL

**缓存与任务**

Redis + Celery（按需）

**容器**

Docker + Docker Compose

**Web 服务**

Nginx

本课分为七个部分：

| **课程** | **学习内容** | **最终成果** |
| --- | --- | --- |
| 5.1 | 部署基础与环境规划 | 部署架构图 |
| 5.2 | Docker 与 Docker Compose | 容器化项目 |
| 5.3 | Linux 服务器与 Nginx | 服务器环境 |
| 5.4 | 数据库部署与备份 | 数据安全方案 |
| 5.5 | CI/CD 自动化发布 | 自动部署流程 |
| 5.6 | 日志、监控与告警 | 运维监控体系 |
| 5.7 | 故障处理与版本回滚 | 生产运维方案 |

### 二、第一课：理解软件部署

##### 1. 什么是软件部署？

我们之前的开发环境：

```text
你的 Mac
  │
  ├── React：localhost:5173
  ├── FastAPI：localhost:8000
  └── MySQL：localhost:3306
```

只有你的电脑可以访问。

如果老板、同事或者客户需要使用，就必须把软件部署到一台能够提供服务的服务器上。

例如：

```text
用户浏览器
    │
    ▼
公网域名
    │
    ▼
Nginx（80 / 443）
    │
    ├────────── React 静态页面
    │
    ▼
FastAPI（8000）
    │
    ├────────── MySQL
    │
    └────────── Redis
```

部署之后：

- 用户通过域名访问系统。
- Nginx 负责接收请求和转发。
- React 提供前端页面。
- FastAPI 处理业务逻辑。
- MySQL 保存订单和库存。
- Redis 提供缓存、任务队列等能力。

这就是一个典型的 Web 软件部署架构。

##### 2. 开发环境、测试环境和生产环境

实际项目不能只有一个运行环境。

我们通常划分为三个环境：

**开发环境 Development**

DEV

开发人员本地编写和调试代码。

- 本地数据库
- 热更新
- 测试数据

**测试环境 Testing**

TEST

测试人员验证功能、性能和异常场景。

- 独立测试数据库
- 自动化测试
- 模拟业务数据

**生产环境 Production**

PROD

真实用户使用的正式环境。

- 正式业务数据
- 权限与安全控制
- 监控、备份、告警

最重要的一条规则：

**开发、测试、生产环境的数据和配置必须隔离。**

尤其不能让自动化测试直接连接生产数据库。

##### 3. 软件从开发到上线的流程

#### 标准软件发布流程

1. 开发人员提交代码到 GitHub
2. CI 自动执行代码检查和自动化测试
3. 构建 Docker 镜像
4. 发布到镜像仓库
5. 部署到测试服务器
6. 完成测试验收
7. 发布到生产服务器
8. 监控运行状态和业务指标

这就是 CI/CD 的基本思想：

- CI：持续集成，自动检查代码质量。
- CD：持续交付或持续部署，自动完成发布流程。

### 三、第二课预习：为什么要使用 Docker？

先理解一个实际问题。

你的电脑可以运行项目，但换一台 Linux 服务器可能出现：

- Python 版本不同。
- Node.js 版本不同。
- 依赖包版本不同。
- 系统环境不同。
- 配置文件不同。

最终导致：

「本地能运行，服务器运行不了。」

Docker 就是为了解决这类环境一致性问题的重要工具。

*原对话配图*　How to Run AdventureWorks Using Azure Data Studio on Mac \| by Lauren Esser \| Analytics Vidhya \| Medium

**Docker**

将应用及其运行依赖打包为镜像，通过容器运行。

[Docker 官方文档](https://docs.docker.com/?utm_source=chatgpt.com)

Docker 中有三个重要概念：

| **概念** | **含义** | **类比** |
| --- | --- | --- |
| Image 镜像 | 应用运行环境的模板 | 安装包 |
| Container 容器 | 镜像运行后的实例 | 正在运行的程序 |
| Dockerfile | 描述如何构建镜像 | 安装说明书 |

例如：

```text
Dockerfile
    │
    ▼
Docker Image
    │
    ▼
Docker Container
    │
    ▼
运行 FastAPI
```

如果订单系统需要四个服务：

- frontend
- backend
- mysql
- redis

我们可以使用 Docker Compose 统一管理。

例如：

```bash
docker compose up -d
```

就可以启动整个服务组合。

但要注意，生产环境不能只依赖容器启动成功，还需要持久化存储、健康检查、资源限制、密码管理和备份策略。

### 四、实战：为订单系统设计部署架构

现在假设你负责将订单管理系统部署到一台 Linux 云服务器。

我们先设计部署结构，不急着执行命令。

#### 订单系统生产部署架构

**用户**

浏览器访问 order.example.com

**Nginx**

HTTPS、静态资源、反向代理

**React**

静态页面

**FastAPI**

业务 API

**MySQL**

业务数据

**Redis**

缓存与任务

**Docker Compose**

统一管理服务

生产部署还需要考虑：

- MySQL 数据持久化，不能随容器删除而丢失。
- 数据库端口不直接暴露公网。
- 使用 HTTPS。
- 敏感配置放在安全的环境变量或密钥管理系统中。
- 定期备份数据库，并实际演练恢复。
- 配置健康检查、日志和告警。
- 发布失败时能够回滚应用版本。

#### 五、第一道实战题：环境规划

现在假设你负责一个订单管理系统。

开发人员在本地测试时创建了 100 笔测试订单。

准备正式上线时，你认为应该如何处理？

- A. 建立独立生产环境，使用独立生产数据库和正式配置，不把测试数据直接带入生产环境
- B. 直接将本地数据库复制到生产服务器
- C. 开发、测试、生产共用一个数据库，方便管理
- D. 只部署 React 前端，不需要部署后端和数据库

提交答案，继续学习

#### 六、第五课学习进度

#### 上线部署与运维学习路线

1. 部署基础与环境规划

当前学习

2. Docker 与 Docker Compose
3. Linux 服务器与 Nginx
4. 数据库部署与备份
5. CI/CD 自动化发布
6. 日志、监控与告警
7. 故障处理与版本回滚

**第五课最终目标：** 你不仅能在本地开发订单管理系统，还能独立完成服务器部署、自动发布、数据库备份、故障排查和版本回滚。

我们继续采用「知识讲解 → 实战选择题 → 代码练习 → 项目验收」的学习方式。下一步正式开始 Docker 容器化实战。
