---
title: 代码随想录八股文笔记：Java 篇
description: 整理自《代码随想录知识星球精华（最强八股文）第五版》Java 篇：Java 基础、集合、IO、多线程、JVM、Spring 生态、中间件与并发进阶的学习笔记。
date: 2026-11-21T00:00:00+08:00
draft: false
outline: [2, 3]
tags: ["八股文", "Java", "JVM", "Spring", "并发"]
categories: ["面试八股"]
---

# 代码随想录八股文笔记：Java 篇

《代码随想录知识星球精华（最强八股文）第五版》共九册，本篇整理自其中的 Java 篇，从 Java 基础、集合、IO 一路推进到多线程、JVM、Spring 生态、MyBatis 和各类中间件，最后是编译执行与并发进阶的深水区。
原文以面试问答为主，整理时按主题重排为章节，逐题给出答案要点，对比类考点整理成表。原书中仅有外部链接或图片、无正文的小节，已按通用知识补齐并注明；内容为个人学习笔记，仅供学习参考。

::: details 完整目录（点击展开）

- [Java 基础](#javase)
  - [Java 概述](#javase-overview)
  - [基础数据类型](#javase-data-types)
  - [变量和方法](#javase-variable-method)
  - [类和对象](#javase-class-object)
  - [面向对象设计笔记](#javase-oo-notes)
  - [String](#javase-string)
  - [Object](#javase-object)
  - [异常](#javase-exception)
  - [泛型](#javase-generic)
  - [反射](#javase-reflection)
  - [注解](#javase-annotation)
- [集合](#coll)
  - [集合框架总览](#coll-overview)
  - [集合基础](#coll-basics)
  - [List](#coll-list)
  - [Set](#coll-set)
  - [Queue](#coll-queue)
  - [Map【常考】](#coll-map)
- [IO](#io)
  - [IO 流基本认识与分类](#io-basics)
  - [IO 模型](#io-model)
  - [序列化与反序列化](#io-serialize)
- [多线程](#thread)
  - [进程线程基础](#thread-basics)
  - [Java 内存模型（JMM）](#thread-jmm)
  - [线程同步与锁](#thread-lock)
  - [volatile 关键字](#thread-volatile)
  - [线程安全的实现](#thread-safety)
  - [线程锁特点、性能与使用场景](#thread-lock-choice)
  - [并发容器的原理](#thread-container)
  - [线程池](#thread-pool)
- [JVM](#jvm)
  - [JVM 内存结构](#jvm-structure)
  - [堆和栈的区别](#jvm-heap-stack)
  - [OOM](#jvm-oom)
  - [JVM 内存管理](#jvm-mgmt)
  - [G1 收集器](#jvm-g1)
  - [类加载机制](#jvm-classload)
  - [内部类](#jvm-inner)
  - [代理类](#jvm-proxy)
- [新特性](#newfeat)
  - [Lambda 表达式](#newfeat-lambda)
- [Spring](#spring)
  - [Spring、Spring MVC、Spring Boot 的区别](#spring-compare)
  - [Spring 框架体系](#spring-modules)
  - [AOP](#spring-aop)
  - [IoC 和 DI](#spring-ioc)
  - [Bean 的作用域](#spring-scope)
  - [Bean 的生命周期](#spring-bean-lifecycle)
  - [@Autowired 与 @Resource](#spring-autowired)
  - [BeanFactory 与 FactoryBean](#spring-factory)
  - [循环依赖及解决方式](#spring-circular)
  - [多例对象](#spring-prototype)
  - [Spring 中用到的设计模式](#spring-patterns)
  - [事务传播机制与隔离级别](#spring-transaction)
- [Spring MVC](#springmvc)
  - [执行流程](#springmvc-flow)
  - [常用注解](#springmvc-annotation)
  - [组件](#springmvc-component)
  - [拦截器](#springmvc-interceptor)
- [MyBatis](#mybatis)
  - [JDBC 的不足与 MyBatis 的解决](#mybatis-jdbc)
  - [插件（Plugin）机制](#mybatis-plugin)
  - [Dao 接口与 XML 的关联](#mybatis-dao-xml)
  - [结果封装的映射形式](#mybatis-result)
  - [动态 SQL](#mybatis-dynamic-sql)
  - [一级缓存与二级缓存](#mybatis-cache)
  - [接口绑定的实现方式](#mybatis-binding)
  - [与 Hibernate 的区别](#mybatis-hibernate)
  - [初始化过程](#mybatis-init)
  - [延迟加载](#mybatis-lazy)
- [Spring Boot](#springboot)
  - [Starter 的作用](#springboot-starter)
  - [常用注解](#springboot-annotations)
  - [启动流程](#springboot-startup)
  - [自动装配过程](#springboot-autoconfig)
  - [启动时初始化数据](#springboot-runner)
- [RPC 框架](#rpc)
  - [Dubbo 的工作流程](#rpc-dubbo-flow)
  - [Dubbo 支持的协议](#rpc-dubbo-protocol)
  - [RPC 的关键技术](#rpc-key-tech)
- [分布式存储](#diststore)
  - [Redis 单线程为何能支持高并发](#diststore-redis)
  - [缓存穿透、雪崩与击穿](#diststore-cache)
- [消息中间件](#mq)
  - [消息积压及处理](#mq-backlog)
  - [如何保证消息不丢失](#mq-no-loss)
  - [如何保证顺序性](#mq-order)
- [微服务](#micro)
  - [服务熔断与服务降级](#micro-fuse)
  - [Eureka 与 ZooKeeper 的区别](#micro-eureka-zk)
  - [负载均衡策略](#micro-lb)
  - [Ribbon 内置的负载均衡策略](#micro-ribbon)
- [源码学习](#src)
  - [LinkedList](#src-linkedlist)
  - [CopyOnWriteArrayList](#src-cow)
  - [TreeMap](#src-treemap)
  - [PriorityQueue](#src-priority-queue)
  - [HashMap](#src-hashmap)
- [编译与执行](#compile)
  - [执行引擎概述与工作流程](#compile-engine)
  - [指令集：机器码、指令、汇编与字节码](#compile-instruction-set)
  - [Java 代码执行与编译](#compile-exec)
  - [解释器](#compile-interpreter)
  - [JIT 编译器与热点代码](#compile-jit)
  - [提前编译器及优劣](#compile-aot)
  - [编译优化技术与逃逸分析](#compile-optimize)
- [并发进阶](#concurrent)
  - [Synchronized](#concurrent-sync)
  - [Synchronized 反向理解](#concurrent-sync-reverse)
  - [AQS](#concurrent-aqs)
  - [ThreadLocal](#concurrent-threadlocal)
  - [附：思维导图索引](#mindmaps)

:::

## Java 基础 {#javase}

### Java 概述 {#javase-overview}

考点：一句话说清 JVM、JRE、JDK 三者的包含关系与分工，包含关系为 JDK ⊃ JRE ⊃ JVM。

- JVM（Java 虚拟机）：将字节码翻译为机器码在特定平台上执行，是 Java 跨平台的基础。
- JRE（Java 运行环境）：包含运行程序所需的类库、JVM 及其他支持文件，面向部署和运行阶段。
- JDK（开发工具包）：包含 JRE 以及编译、开发程序所需的工具，面向开发阶段。

### 基础数据类型 {#javase-data-types}

考点：8 种基本类型、两种转换方向、基本类型与包装类型的差异及自动装箱拆箱。

Java 有 8 种基本数据类型：整型 `byte`、`short`、`int`、`long`（默认 int），浮点型 `float`、`double`（默认 double），字符型 `char`，布尔型 `boolean`；对应包装类 `Byte`、`Short`、`Integer`、`Long`、`Float`、`Double`、`Character`、`Boolean`。

类型转换方式：

- 自动类型转换（小 → 大）：`byte → short → int → long → float → double`；
- 强制类型转换（大 → 小）：`小类型 变量名 = (小类型) 值`，可能损失精度；
- 注意：`++`、`--`、`+=`、`-=` 等运算符底层做了优化，内部会自动强制类型转换。

| 对比项 | 基本类型 | 包装类型 |
| --- | --- | --- |
| 存储位置 | 栈上分配，直接存值 | 堆上创建的对象 |
| 内存占用 | 固定、较小 | 含对象头、方法等额外信息，更大 |
| null / 泛型 | 不可为 null，不能用于泛型 | 可为 null，可用于泛型与集合 |

自动装箱与自动拆箱：装箱是基本类型 → 包装类型，编译器调用 `valueOf()`；拆箱是包装类型 → 基本类型，编译器调用 `xxxValue()`（如 `intValue()`）。注意：所有整型包装类对象之间值的比较一律使用 `equals()`，避免 `==` 因缓存机制（如 IntegerCache）产生误判。

```java
Integer intValue = 42;         // 自动装箱
int primitiveValue = intValue; // 自动拆箱
```

### 变量和方法 {#javase-variable-method}

考点：成员变量与局部变量的区别、静态变量的共享性、Java 只有值传递。

| 对比项 | 成员变量 | 局部变量 |
| --- | --- | --- |
| 声明位置 | 类中，方法、构造器、代码块之外 | 方法、构造器、代码块内部 |
| 作用域 | 整个类可见 | 仅所在方法/代码块内可见 |
| 生命周期 | 随对象创建与销毁 | 方法调用结束即销毁 |
| 默认值 | 有默认值（0、false、null） | 无，必须显式初始化 |

- 静态变量：被 `static` 修饰，属于类而非实例，无论创建多少对象都共享同一份，通过类名访问。
- 值传递与引用传递：值传递传实参值的副本，方法内修改不影响原始值；引用传递传对象地址，形参修改会影响实参。核心结论：Java 的参数传递始终是值传递——传对象时传的是"引用的副本"，因此方法内可以修改对象状态，但无法让实参指向新对象。

### 类和对象 {#javase-class-object}

考点：面向对象与面向过程的取舍、三大特征、多态的两种形态、接口与抽象类对比、构造方法、访问权限、static/final、重载重写、深浅拷贝。

**面向对象 vs 面向过程**

| 对比项 | 面向对象 | 面向过程 |
| --- | --- | --- |
| 思路 | 先抽象出有状态、有行为的对象，用对象协作解决问题 | 把系统视为一系列过程/函数的调用 |
| 强调 | 封装、继承、多态 | 算法和流程 |
| 扩展维护 | 修改一个对象不影响其他对象，易扩展 | 改一个过程可能影响所有调用方 |
| 适用场景 | 复杂系统 | 简单、线性的任务 |

**三大特征**：封装——隐藏对象内部状态（字段），通过公共方法操作对象，提高安全性；继承——子类复用父类的属性和方法，并可新增或重写方法，提高复用性与扩展性；多态——相同的操作在不同对象上产生不同行为，通过重载与重写实现。

**对多态的理解**：子类对象可直接赋给父类引用（向上转型，系统自动完成）。`BaseClass obj = new SubClass();` 中 obj 的编译时类型是 BaseClass、运行时类型是 SubClass，运行时调用方法总表现出子类的行为特征——同类型变量、同一调用呈现多种行为，即多态。

**编译时多态 vs 运行时多态**

| 对比项 | 编译时多态 | 运行时多态 |
| --- | --- | --- |
| 别名 | 静态多态、早期绑定 | 动态多态、晚期绑定 |
| 实现方式 | 方法重载 | 方法重写 |
| 确定时机 | 编译阶段由编译器确定 | 运行时按对象实际类型确定 |
| 依据 | 方法签名（方法名和参数列表） | 对象实际类型而非引用类型 |

**接口 vs 抽象类**

| 对比项 | 接口 | 抽象类 |
| --- | --- | --- |
| 定义 | 一组方法签名不含实现，只能包含常量和抽象方法 | 可同时包含抽象方法、具体方法与字段 |
| 继承机制 | 支持多实现，一个类可实现多个接口 | 只能单继承 |
| 构造器 | 不能包含 | 可以包含，子类实例化时调用 |
| 成员修饰符 | 方法默认 public abstract，变量默认 public static final | 抽象方法默认 protected，具体方法可 public/protected/private |

**构造方法能否重写**：不能。构造方法必须与类同名，而重写要求子类方法与父类方法同名，两者矛盾；构造方法只能重载。

**访问权限**：四种修饰符从小到大为 `private`（仅同类）→ `default`（同包）→ `protected`（同包 + 所有子类）→ `public`（所有类）。

**static 关键字**：静态变量（类变量，所有实例共享）；静态方法（属于类，类名调用，无 this，不能直接访问非静态成员）；静态代码块（类加载时执行且仅一次）；静态内部类。

| 对比项 | static | final |
| --- | --- | --- |
| 含义 | 类级别，不属于实例 | 不可变 |
| 修饰变量 | 所有实例共享一份 | 赋值后不可再修改（常量） |
| 修饰方法 | 类名直接调用 | 不能被子类重写 |
| 修饰类 | 用于内部类 | 类不能被继承 |

**final / finally / finalize**：final 是不可变关键字，修饰变量（须初始化的常量）、方法（不可重写）、类（不可继承）；finally 是异常处理的一部分，try/catch 后的语句块一定会被执行，常用于释放资源；finalize 是 `Object` 中的方法，对象被回收前由 GC 调用，只调用一次且调用了不一定被回收，不推荐使用。

| 对比项 | 重载 | 重写 |
| --- | --- | --- |
| 发生范围 | 同一个类中 | 父子类之间 |
| 参数列表 | 必须不同（类型、个数、顺序） | 必须相同 |
| 返回类型 / 访问权限 | 均无要求 | 返回类型须相同；权限不能更低 |
| 异常 | 无要求 | 不能抛出比父类更多的异常 |
| 多态类型 | 编译时多态 | 运行时多态 |

**深拷贝 vs 浅拷贝**：浅拷贝创建新对象并复制非静态字段——基本类型复制值，引用类型只复制引用，两对象共享引用对象（`Object.clone()` 默认浅拷贝）；深拷贝递归复制所有引用对象，新旧对象完全独立。实现：浅拷贝实现 `Cloneable` 用 `clone()`；深拷贝可重写 clone 逐字段复制、序列化反序列化（`SerializationUtils.clone()`）或第三方库。

### 面向对象设计笔记 {#javase-oo-notes}

本节为原书面向对象读书笔记的浓缩，可作为系统理解类设计的加分项。

**类与对象**

- 类是构造对象的模板或蓝图；封装 = 数据（实例字段）+ 行为（方法）打包并隐藏实现方式。对象三要素：状态（一组实例字段值）、行为（方法）、唯一标识。
- 对象变量只存储引用，`new` 的返回值也是引用；Java 对象存储在堆中，获得完整副本须用 `clone()`。访问器方法只访问不修改对象（如 `LocalDate.plusDays()` 返回新对象），更改器方法修改对象内容；getter 不要直接返回可变对象引用（如 Date），应先 clone 再返回，否则破坏封装。Java 10 起局部变量可用 `var` 声明，参数和字段必须显式声明类型。
- 类之间的关系：依赖（uses-a，方法中使用另一个类的对象）、聚合（has-a，A 对象包含 B 对象）、继承（is-a，特殊类与一般类的关系）。

**继承与多态**

- 子类构造器用 `super(...)` 调用父类构造器，必须放第一条；未显式调用则自动调用父类无参构造器；父类无无参构造器时必须显式指明，否则编译报错。`this` 可作隐式参数引用并调用本类其他构造器；`super` 可调用父类方法与构造器；this 是对象引用而 super 不是，不能赋给对象变量。
- 父类变量既可引用父类也可引用子类对象（对象变量多态），反之不行；上转型变量只能调用子类重写父类的方法，不能调用子类独有方法。覆盖方法时子类可见性不能低于父类（父类 public 则子类必须 public）；final 修饰引用类型字段只是引用不可变，对象状态仍可变。
- 方法调用过程（以 `x.f(arg)` 为例，x 声明类型为 C）：① 编译器按声明类型列出候选方法 → ② 重载解析确定唯一方法 → ③ private/static/final 方法或构造器静态绑定 → ④ 其余方法运行时按对象实际类型动态绑定。
- 类型转换只能在继承层次内进行，向下转型前用 `instanceof` 检查；应尽量少用强转和 instanceof，需要子类特有方法时优先反思超类设计是否合理。
- 抽象类：abstract 方法不提供实现，子类未实现则自身也须声明为抽象类；抽象类可包含字段和具体方法但不能实例化；"变量声明为抽象父类类型 + new 子类 + 通过父类变量调用"可提高程序清晰度。

**静态字段与方法**

- 静态字段属于类，没有实例也存在且所有对象共享一份；非静态字段每个对象各有一份；静态常量设为 public 是安全的。静态方法没有 this 参数，适用于方法不访问对象状态（Math.pow）或只需访问静态字段的场景。
- 静态工厂方法（如 `LocalDate.now()`）的两个价值：构造器名字必须与类名相同而工厂方法可起有意义的名字；工厂方法可返回子类对象（如 NumberFormat 实际返回 DecimalFormat）。方法参数三条结论：不能修改基本类型参数的值；可以改变对象参数的状态；不能让对象参数引用一个新对象。

**对象构造**：方法签名 = 方法名 + 参数类型，返回类型不是签名的一部分。字段不初始化有默认值（0/false/null），局部变量必须显式初始化；只有类不含任何构造器时才有默认无参构造器。构造器第一条语句形如 `this(...)` 可调用同类另一个构造器，公共构造代码只写一次。初始化块在每次构造对象时执行（不常用）；静态初始化块在类第一次加载时执行一次。

**包**：使用包的主要目的是确保类名唯一性，包名通常用因特网域名逆序书写。访问其他包的公共类：完全限定名或 import 导入；`import java.*` 不能导入以 java 为前缀的所有包；两包同名类冲突时加特定 import 或用完整包名；静态导入（`import static`）省略类名前缀但影响清晰度，建议少用。包作用域：public 任意类可用，private 仅本类，未指定修饰符则同包可见——实例字段必须显式 private，否则默认包可见会破坏封装。JAR 文件基于 zip 格式压缩打包，清单文件位于 META-INF 子目录，可执行 JAR 用 `java -jar` 运行。

**类设计技巧**：保证数据私有，绝不破坏封装；显式初始化所有数据，不依赖默认值；少用过多基本类型，用类封装相关字段；不是所有字段都需要 getter/setter；分解职责过多的类；类名方法名见名知意（类用名词，访问器 get 开头、更改器 set 开头）；优先使用不可变的类——可安全地在多线程间共享，避免并发更新问题。

**内存中的对象**

- 对象实例由三部分组成：对象头、实例数据、对齐填充（Padding）。
- 对象头包含：运行时元数据（哈希值、GC 分代年龄、锁状态标志、线程持有的锁、偏向线程 ID、偏向时间戳——锁信息就在对象头中）+ 类型指针（指向元空间的 InstanceKlass，确定对象类型，部分场景可能不保留）；数组对象还需记录数组长度。
- 实例数据存放规则：父类字段在子类之前；同宽度字段分配在一起；默认参数下子类的窄变量可能插入父类变量空隙。
- 对齐填充：HotSpot 要求对象大小必须是 8 字节的整数倍，对象头已是 8 的倍数，实例数据不足时由对齐填充补全。
- 对象访问定位两种方式：句柄访问（堆中句柄池存指向实例数据和类型数据的两个指针，对象移动时栈中引用无需修改）；直接访问（局部变量表直接存对象地址，访问更快，HotSpot 采用）。

### String {#javase-string}

考点：String 的不可变性与底层实现、三兄弟选型、常量池与创建对象的差异。

**存储原理**：String 不可变；双引号字符串（如 `"abc"`）直接存储在字符串常量池中——因字符串使用极其频繁，常量池复用可提高执行效率、节省内存。

**能否被继承**：不能，String 被 final 修饰，final 类不可被继承（声明形如 `public final class String implements Serializable, Comparable<String>, CharSequence`）。**底层类型**：JDK 1.8 及之前是 `char[]` 数组，JDK 1.9 之后改为 `byte[]`。

**为什么不可变**：① 保存字符串的数组被 `private final` 修饰，且 String 没有暴露修改该数组的方法；② 类被 final 修饰不能被继承，避免子类破坏不可变性。

| 对比项 | String | StringBuffer | StringBuilder |
| --- | --- | --- | --- |
| 可变性 | 不可变 | 可变 | 可变 |
| 线程安全 | 安全（因不可变） | 安全（方法同步） | 不安全（无同步） |
| 性能 | 修改产生新对象 | 有同步开销 | 单线程下最好 |
| 适用场景 | 不常修改 | 多线程频繁修改 | 单线程频繁修改 |

**常见方法**（列举常用）：`charAt(int)`、`substring(int, int)`、`concat(String)`、`equals(Object)`、`contains(CharSequence)`、`indexOf(String)`、`replace(char, char)`、`split(String)`、`toCharArray()`、`toLowerCase()` / `toUpperCase()`、`trim()`。

**字符串常量池**：字符串不可变，因此相同内容的字符串常量可复用——后续创建相同常量时不再新建对象而是直接引用已有常量，多个引用指向同一字符串。`intern()` 可主动入池/指向常量池。

**字符串拼接发生了什么**：`+` 拼接全为字面量时编译期直接优化为完整字符串，效率很高；含变量时编译器自动创建 StringBuilder 调用 `append()`；但拼接在循环中时每次循环都会新建 StringBuilder 实例（相当于 `new StringBuilder().append(str)`），效率很低——应在循环外创建一个 StringBuilder 复用。`concat()` 每次调用都创建新的字符串对象，不修改原对象；StringBuilder / StringBuffer 在同一个可变对象上多次 `append()`，不产生大量中间对象，最后 `toString()` 转为不可变字符串。

**new String("abc") 与 String a = "abc" 的区别**：字面量方式先查常量池，有则直接引用、无则创建；`new String("abc")` 无论常量池是否已存在，都会在堆中创建新对象。推荐字面量方式，避免不必要的对象创建。

```java
String s1 = "Hello";
String s2 = "Hello";
String s3 = new String("Hello").intern();
System.out.println(s1 == s2); // true，引用常量池同一常量
System.out.println(s1 == s3); // true，intern 后指向同一常量
```

### Object {#javase-object}

考点：Object 的方法清单、`==` 与 equals 的区别、hashCode 与 equals 的联动约定。

**Object 类的常见方法**

```java
String toString();             // 默认返回类名@哈希码，通常重写
boolean equals(Object obj);    // 默认比较引用，通常重写为内容比较
int hashCode();                // 返回哈希码，用于哈希表快速定位
Class<?> getClass();           // 返回对象的运行时类
protected Object clone();      // 创建浅拷贝
protected void finalize();     // GC 销毁对象前调用
// 线程通信：notify()、notifyAll()、wait() 及其重载
```

| 对比项 | == | equals() |
| --- | --- | --- |
| 本质 | 运算符，不可重写 | Object 方法，可重写 |
| 比较内容 | 基本类型比值；对象比较引用（是否同一内存位置） | 对象内容；Object 默认仍是引用比较，String、Integer 等多数类已重写为内容比较 |

**hashCode() 与 equals() 的关系**：hashCode 返回对象哈希码，用于确定对象在哈希表（如 HashMap）中的存储位置。约定：两个对象相等（equals 为 true）则哈希码必须相同；哈希码相同则对象未必相等（哈希冲突）。重写 equals 时通常必须同时重写 hashCode 保持一致，否则在 HashMap、HashSet 等容器中会查找异常；Object 中 equals 默认比较引用没有实用价值，所以一般都要重写。

### 异常 {#javase-exception}

考点：异常体系结构、受检与非受检异常、抓抛模型、finally 的执行细节。

**异常体系**：Java 的异常都派生自 `Throwable`，Throwable 分为 `Error` 和 `Exception`；Exception 又分为 `RuntimeException`（运行时异常）和其他异常（编译时异常）。Error 是 JVM 运行时内部错误和资源耗尽错误（OOM、`StackOverflowError`、`VirtualMachineError`、`NoClassDefFoundError`），程序无能为力，不应由应用程序捕获；RuntimeException 由程序逻辑错误导致（数组越界、空指针、类型转换错误、除 0 等）；其他异常由外部环境导致（如打开不存在的文件抛出 `FileNotFoundException`），编译器强制要求捕获或声明——"编译时异常"指编译器要求必须处理，并不是编译期间发生的错误。

| 对比项 | 受检异常（Checked） | 非受检异常（Unchecked） |
| --- | --- | --- |
| 组成 | Exception 中除 RuntimeException 外的部分 | Error + RuntimeException |
| 编译器要求 | 必须捕获或 throws 声明，否则编译错误 | 无强制要求 |
| 典型例子 | IOException、FileNotFoundException | NullPointerException、IndexOutOfBoundsException |

**异常处理机制与抓抛模型**：核心是 try-catch-finally 和 throw、throws。异常实例可由 JVM 产生，也可用 `throw` 手动抛出，对象必须派生自 Throwable；受检异常只有两条出路——被捕获处理（抓），或被 throws 抛给调用者（抛）；方法必须在首部声明所有可能抛出的受检异常。多个 catch 时：异常间无继承关系则顺序不影响；存在继承关系时子类 catch 必须放在父类前，否则子类处理代码永远不可达。catch 中也可抛出新异常实现"异常包装"，抛出高级异常的同时保留原始异常细节。finally 一般用来释放资源——无论是否发生异常都会执行。

**finally 一定会执行吗**

- 一般都会执行（编译器把 finally 代码复制两份，分别追加到 try 和 catch 之后）。两种例外：try/catch 中调用了 `System.exit()` 使 JVM 直接退出；try 中出现死循环等永不结束的操作。
- finally 与 return 的经典陷阱：try 中执行到 return 时返回值先压入操作数栈再执行 finally，因此 finally 中修改基本类型变量不会改变返回值（返回的是"脏数据"）；若 finally 中也有 return，则返回 finally 处理后的值。引用类型不受影响，因为操作的是引用背后的实体。

**Throwable 常用方法**：`getMessage()`（异常详细信息）、`getCause()`（异常原因）、`toString()`（类名+详细信息）、`printStackTrace()`（打印 toString 结果与栈层次到 System.err）、`getStackTrace()`（返回堆栈层次数组，下标 0 为栈顶）、`fillInStackTrace()`（用当前调用栈填充栈层次）。

**自定义异常**：一般继承 `RuntimeException`；编写几个重载构造器；提供 `serialVersionUID` 方便调试；最重要的是类名见名知意，便于判断异常类型。注意：子类重写父类带 throws 的方法时，声明异常范围不能比父类大（只能不变或更精确）；父类没有 throws 则子类也不能有，受检异常须在子类内部捕获。Java 异常是线程独立的，未处理的异常只终止所在线程；异常处理不能代替简单测试——捕获异常的开销远大于预先的条件判断。

### 泛型 {#javase-generic}

考点：泛型解决什么问题、三种使用形式、类型擦除及其影响。

**对泛型的理解**：集合不用泛型时，对象存入后丢失具体类型信息（视为 Object），带来两个问题——集合对元素类型没有限制（想只存 Dog 却能存进 Cat），且取出时必须强转、易引发 `ClassCastException`。Java 5 引入泛型，创建集合时指定元素类型（如 `List<String>`），编译期做类型检查、取出免强转，代码更安全简洁。

**泛型的使用**

```java
public class Box<T> {              // 泛型类
    private T value;
    public void setValue(T value) { this.value = value; }
    public T getValue() { return value; }
}
Box<Integer> box = new Box<>();
public <T> T genericMethod(T[] array) { /* 泛型方法，类型通常可推断 */ }
```

- 泛型接口：声明时引入类型参数并在方法中使用，如 `interface List<T> { void add(T element); T get(int index); }`。

**类型擦除**：Java 泛型在编译期将泛型信息移除以兼容早期版本。主要影响：类型参数被擦除为上界（无上界时为 Object），如 `List<T>` 编译后为 `List<Object>`；编译器生成桥方法（bridge method）保持多态；由于擦除不能直接创建泛型数组，`new T[]` 不合法（运行时无法确定 T 的实际类型）。

### 反射 {#javase-reflection}

考点：反射的入口与能力、优缺点、框架中的实际应用。

**反射机制**：核心类是 `Class`，它是反射机制的入口——通过 Class 对象在运行时获取类的构造函数、方法、字段等信息并操作，无需编译时确定。基本步骤：获取 Class 对象 → 获取类的信息 → 通过 `Constructor`、`Method`、`Field` 等实例执行操作。优点是运行时动态获取和操作类信息、代码灵活；缺点是绕过编译期类型检查可能引发运行时类型安全问题，且有运行时类型检查和动态分派的性能开销。

**应用场景**：Spring/Spring Boot、MyBatis 等框架大量使用反射；动态代理的实现依赖反射；框架从注解/XML 配置解析出的类是字符串，需要反射实例化；Spring 的依赖注入正是通过反射和注解实现。

### 注解 {#javase-annotation}

考点：注解的本质与常见注解、自定义注解方式。

- 注解以 `@` 开头，后跟标识符并可带参数，用于给类、方法、字段等添加元数据，可在编译时、运行时被读取处理。
- 常见注解：`@Override`（标识重写父类方法）、`@Deprecated`（标识过时）、`@FunctionalInterface`（标识函数式接口）。通过 `@interface` 自定义注解：

```java
@interface MyAnnotation {
    String value();
}
@MyAnnotation(value = "My Custom Annotation")
public class MyClass { }
```

## 集合 {#coll}

### 集合框架总览 {#coll-overview}

考点：集合框架的三大组成与三个层次、单列与双列体系、各接口的定位。

- 集合框架三大块内容：接口（代表集合的抽象数据类型，如 Collection、List、Set、Map）、实现（本质是可复用的数据结构，如 ArrayList、HashMap）、算法（实现类中的搜索、排序等计算，同一方法在不同接口上有多态实现）。
- 体系三个层次：顶层接口（Collection、Map、List、Set、Queue、Deque，以及为迭代和比较准备的辅助接口 Iterator、Comparator、Comparable）；中层抽象类（实现大多数接口方法、承上启下——Collection 的实现都继承 `AbstractCollection`，其下派生 AbstractList、AbstractSet、AbstractQueue，Map 的实现派生自 `AbstractMap`）；底层实现类（ArrayList、LinkedList、HashMap、HashSet、TreeMap 等）。所有集合位于 `java.util` 包下；`Collections` 和 `Arrays` 工具类提供便捷方法。
- 单列 vs 双列：Collection 一次存一个元素（单列）；Map 一次存一对元素（双列），键与值有映射关系。Collection 派生三个子接口：List（有序、允许重复，多出 `sort()`、`get()`、`listIterator()` 等方法）；Set（无序、不允许重复，需正确重写 `equals()` 和 `hashCode()`）；Queue（队列，Deque 继承 Queue，可从头部或尾部操作）。Map 独立于 Collection，SortedMap 提供排序选项，常用实现类有 HashMap、TreeMap、Hashtable、LinkedHashMap、ConcurrentHashMap。
- 迭代器：for-each 可与任何实现了 `Iterable` 接口的对象工作；`Iterator` 是单向迭代器（`hasNext()`、`next()`、`remove()`，remove 只能在 next 之后使用且一配一）；`ListIterator` 继承 Iterator 是双向迭代器（增加 `previous()`、`hasPrevious()`），仅 List 可用。注意交叉实现：LinkedList 同时实现 List 和 Queue/Deque，ArrayList 没实现 Queue，PriorityQueue 没实现 List，这类类最容易混淆。

### 集合基础 {#coll-basics}

考点：集合四大接口的划分、各实现类的底层数据结构、线程安全名单。

**Java 集合类有哪些**：集合类主要由 Collection 和 Map 两个接口派生，Collection 又派生出 Set、List、Queue，所有集合类都是这四个接口的实现类——List（有序可重复）：ArrayList、LinkedList；Set（不重复）：HashSet、LinkedHashSet、TreeSet；Queue（队列）：LinkedList、PriorityQueue；Map（键值对）：HashMap、LinkedHashMap、TreeMap。

**底层使用的数据结构**

| 接口 | 实现类 | 底层数据结构 |
| --- | --- | --- |
| List | ArrayList | 动态数组 |
| List | LinkedList | 双向链表 |
| List | Vector | 数组（线程安全） |
| Set | HashSet | 哈希表（数组 + 链表/红黑树） |
| Set | LinkedHashSet | HashSet 基础上加链表，迭代顺序可预测 |
| Set | TreeSet | 红黑树（自平衡二叉搜索树，保持有序） |
| Queue | LinkedList | 双向链表 |
| Queue | ArrayDeque | 动态循环数组（双端队列） |
| Queue | PriorityQueue | 数组表示的二叉堆 |
| Map | HashMap | 哈希表（数组 + 链表/红黑树） |
| Map | LinkedHashMap | HashMap 基础上加链表，迭代顺序可预测 |
| Map | TreeMap | 红黑树，按 key 保持有序 |
| Map | Hashtable | 哈希表（线程安全） |

**线程安全性**：线程安全的有 Vector（方法全同步，古老且较重，建议改用 ArrayList）、Hashtable（方法全同步，建议改用 HashMap 或 ConcurrentHashMap）、ConcurrentHashMap、`Collections.synchronizedList/synchronizedSet/synchronizedMap` 包装类；线程不安全的有 ArrayList、LinkedList、HashSet、HashMap、TreeMap、TreeSet——多线程并发操作而无同步措施时可能导致不确定结果。

### List {#coll-list}

考点：ArrayList 与数组、LinkedList 的对比维度，以及 ArrayList 的 1.5 倍扩容。

**ArrayList vs Array**

| 对比项 | Array（数组） | ArrayList |
| --- | --- | --- |
| 大小 | 创建时必须指定，固定不可变 | 动态增长，添加元素自动扩容 |
| 泛型 | 不支持 | 支持，可指定元素类型 |
| 存储内容 | 可直接存基本类型和对象 | 只能存对象，基本类型需包装类 |
| 功能 | 简单结构，无增删改查方法 | 集合框架一员，方法丰富 |

**ArrayList vs LinkedList**

| 对比项 | ArrayList | LinkedList |
| --- | --- | --- |
| 底层结构 | 动态数组 | 双向链表（节点含数据 + 前后两个指针） |
| 随机访问 | 快，直接按索引访问 | 慢，需从头或尾遍历 |
| 插入删除 | 末尾高效；中间/开头需移动元素 | 中间及头尾插删性能较好 |
| 适用场景 | 频繁随机访问 | 频繁插入删除 |

**ArrayList 扩容机制**

1. 无参构造初始为空数组，添加第一个元素时才扩容并返回最小容量 10（即初始容量 10）；
2. 元素超过当前容量时（如容量 10 添加第 11 个元素）在 `grow()` 中计算新容量：新容量 = 旧容量 +（旧容量右移一位），即原来的 1.5 倍；
3. 若 1.5 倍后仍小于最小容量则取最小容量；通过 `Arrays.copyOf()` 将原数组内容复制到新数组——扩容产生的是新数组对象，再把新数组地址赋给内部数组引用。

### Set {#coll-set}

考点：三种 Set 的排序与复杂度差异、Set 与 Map、List 与 Map 的本质区别。

**HashSet / LinkedHashSet / TreeSet**

| 对比项 | HashSet | LinkedHashSet | TreeSet |
| --- | --- | --- | --- |
| 底层实现 | 哈希表（散列函数存储） | 继承 HashSet，用链表维护插入顺序 | 红黑树 |
| 元素顺序 | 不保证，遍历顺序不确定 | 保留插入顺序 | 自然顺序或指定比较器排序 |
| null | 允许一个 | 允许一个 | 不允许 |
| 增删查复杂度 | 平均 O(1) | 平均 O(1) | O(log n) |

**Map 和 Set 的区别**：Set 是无序、元素不可重复的集合；Map 是 key-value 映射的集合，其所有 key 恰好构成一个 Set——无序且不能重复。

**List 和 Map 的区别**：List 是单列集合，有序且可重复；Map 是双列集合，存储 key-value，key 唯一且与 value 一一映射。（原文该小节答案排版错乱，此处按题意整理。）

### Queue {#coll-queue}

考点：两个双端队列实现的选型、BlockingQueue 的阻塞语义与常见实现。

**ArrayDeque vs LinkedList**

| 对比项 | ArrayDeque | LinkedList |
| --- | --- | --- |
| 底层结构 | 数组（动态调整大小） | 双向链表 |
| 随机访问 | 支持高效索引访问 | 较差，需从头/尾遍历 |
| 空间占用 | 更省（无节点前后引用） | 每个节点多存前、后引用 |
| 头尾插删 | 平均 O(1)，中间操作较慢 | O(1)，但指针操作性能略低 |
| 迭代性能 | 内存连续、缓存友好，更快 | 节点分散，较慢 |
| 线程安全 | 均不安全，需外部同步 | 同左 |

选型：需要高效随机访问和更好空间利用选 ArrayDeque；需要频繁插删且可接受节点开销选 LinkedList。

**BlockingQueue**：用于多线程之间安全传递数据，提供阻塞操作——`put()` 添加元素，队列已满时阻塞直到有空间；`take()` 获取元素，队列为空时阻塞直到有元素；`offer()` / `poll()` 可设超时参数，超时后分别返回 false / null。容量可有界或无界；部分实现支持公平性（按等待时间顺序唤醒线程）。常见实现：`ArrayBlockingQueue`（数组有界队列）、`LinkedBlockingQueue`（链表，有界或无界）、`PriorityBlockingQueue`（优先级无界队列）、`DelayQueue`（延迟任务无界队列）。

### Map【常考】 {#coll-map}

考点：Map 实现类选型、HashMap 全家桶对比、JDK7/8 演进、线程安全与 put 流程。

**实现类与选型**：常用实现类有 HashMap、LinkedHashMap、TreeMap、ConcurrentHashMap。不需要排序优先 HashMap（性能最好）；需要线程安全用 ConcurrentHashMap——其 put 采用分段锁/CAS 机制，性能优于 Hashtable 的全程同步；按插入顺序用 LinkedHashMap，key 按自然或自定义顺序用 TreeMap；也可用 Collections 工具类包装成线程安全的 Map。

**HashMap vs Hashtable**

| 对比项 | HashMap | Hashtable |
| --- | --- | --- |
| 线程安全 | 不同步，非线程安全 | 方法全部同步，线程安全 |
| 性能 | 无同步开销，单线程更快 | 同步开销导致性能下降 |
| null | 键和值都允许 null | 键和值都不允许 null |
| 继承关系 | 继承 AbstractMap，实现 Map | 继承 Dictionary 类 |
| 迭代器 | Iterator 实现 | Enumerator（枚举器）实现 |
| 初始容量/加载因子 | 构造方法可设置 | 固定 |

**HashMap vs HashSet**

| 对比项 | HashMap | HashSet |
| --- | --- | --- |
| 用途 | 存储键值对，每个键唯一并关联一个值 | 存储唯一元素，不允许重复 |
| 内部实现 | 哈希表存储键值对 | 基于 HashMap 实现，只用 key 部分，value 为固定常量 |
| null | 键和值都可为 null | 允许存储一个 null 元素 |
| 性能 | 受 key 哈希分布和冲突影响 | 只存键，通常比 HashMap 略好 |

某些场景可用 HashMap 模拟 HashSet：只用键、值设为固定常量。

**HashMap vs ConcurrentHashMap**：HashMap 非线程安全——多线程同时读写可能数据不一致或抛异常，迭代期间被修改可能抛 `ConcurrentModificationException`；ConcurrentHashMap 线程安全，采用分段锁（Segment Locking）等细粒度锁，将数据分成多个段、每段有自己的锁，不同线程可同时访问不同段，高并发性能好，且迭代时允许并发插删而不抛异常（但不保证迭代顺序）。低并发下 HashMap 可能更好（ConcurrentHashMap 需维护额外并发控制）；高并发下 ConcurrentHashMap 明显占优——多线程高并发用 ConcurrentHashMap，单线程或可外部同步时用 HashMap 更简单。

**JDK7 与 JDK8 的 HashMap 区别**

| 对比项 | JDK 7 | JDK 8 |
| --- | --- | --- |
| 底层结构 | 数组 + 链表（拉链法） | 数组 + 链表 + 红黑树（树化桶 Tree Bins） |
| 插入方式 | 头插法 | 尾插法 |
| 长链表优化 | 无，链表过长时查找退化 | 链表长度超过阈值 8 时树化为红黑树（`TREEIFY_THRESHOLD` 可调） |
| 扩容 | 元素超过容量 75% 时扩为 2 倍 | 阈值同为容量 × 0.75，扩容后节点按原索引或原索引 + oldCap 就位，无需重算 hash |
| 新方法 | 无 | `forEach`、`compute` 系列等；`Map.Entry` 增加 getKey/getValue 默认方法 |

（原文树化阈值小节把"链表超 8 转红黑树"误写在 JDK 7 名下——JDK 7 并无树化机制，此处已按事实修正。）

**哈希冲突如何解决**：主要使用拉链法（链地址法）——冲突元素以链表形式挂在同一桶上；JDK 8 进一步引入红黑树，链表过长时树化以提高查找性能。

**HashMap 为什么线程不安全，如何实现线程安全**：原因是操作不是原子的——一个线程写（插删）时另一个线程读，可能读到不一致数据甚至抛 `ConcurrentModificationException`；"检查是否存在某键再取值"等复合操作存在竞态条件。解决方式：`Collections.synchronizedMap()` 同步包装器、`ConcurrentHashMap` 专用并发实现（推荐）、外部显式锁（如 `ReentrantLock`，lock 后 try-finally 中执行操作并 unlock）。

**循环链表如何产生**：根源在 JDK 1.7 的头插法 + 并发扩容。哈希冲突的多个键按插入顺序形成桶上链表；两个线程同时触发 resize、都用头插法搬运节点时，指针指向交叉形成环形链表，后续 get 落到该桶时陷入死循环（CPU 飙高）。JDK 8 改用尾插法解决了成环问题，但 HashMap 本身依旧线程不安全。

**底层实现原理与扩容机制**：底层是数组 + 链表 + 红黑树（JDK 8）；默认初始容量 16、负载因子 0.75，阈值 threshold = 容量 × 负载因子（默认 12），元素个数超过 threshold 触发 `resize()`，容量扩为 2 倍（容量始终保持 2 的幂，便于用位运算代替取模计算索引）。

**ConcurrentHashMap 的实现**：JDK 7 采用 Segment 分段锁，整表分为多个段、每段独立加锁，不同线程可同时操作不同段；JDK 8 起放弃分段锁，改为 CAS + synchronized 只锁单个桶的头节点，锁粒度更细、并发度更高，读操作基本无锁。

**put 的过程**（以 JDK 8 为例）

1. 首次扩容：数组为空则先执行第一次扩容（resize）；
2. 计算索引：通过 hash 算法计算键值对在数组中的索引；
3. 插入数据：位置为空直接插入；位置非空且 key 已存在则覆盖 value；位置非空且 key 不存在则链到链表末端；链表长度达到 8 则转成红黑树后插入；
4. 再次扩容：元素个数（size）超过 threshold 则再次扩容。

**Map 的遍历方式**（常见 6 种）：迭代器遍历 entrySet（`map.entrySet().iterator()`）；迭代器遍历 keySet；for-each 遍历 entrySet（`for (Map.Entry<K,V> e : map.entrySet())`）；for-each 遍历 keySet 再 `map.get(key)`；Lambda（`map.forEach((k, v) -> ...)`）；Stream API（`map.entrySet().stream()...`）。（原文此处仅以外部链接形式给出"Map 的 6 种遍历方式"，以上按常见用法列出。）

## IO {#io}

### IO 流基本认识与分类 {#io-basics}

考点：流的分类三个维度、四个抽象基类、字节流与字符流的选型。

**基本概念与分类**：几乎所有程序都离不开输入输出（键盘读取、文件读写、显示输出），Java 把不同类型的输入、输出源抽象为流（Stream），流动的数据称为数据流（Data Stream）——一组有顺序、有起点和终点的字节集合，用统一接口表示。输入、输出以程序/内存为参照：

- 按流向：输入流（外部数据读入程序内存）/ 输出流（程序内存中的内容写到磁盘等存储设备）。
- 按处理单位：字节流每次读写一个字节，传输含中文的文件会乱码；字符流每次读写一个字符（Java 的 char 为两个字节），可正确传输显示中文。
- 按角色：节点流直接对特定地方（节点）读写数据，如 `FileInputStream`；处理流（包装流）对已存在的流连接和封装，如 `BufferedReader`，其构造方法总要带一个其他流对象做参数，多次包装称为流的链接。
- 一个流可同时属于多个分类，互不冲突，如 `FileInputStream` 既是输入流、又是字节流、还是文件节点流。

**4 个抽象基类**：`InputStream`（输入字节流）、`OutputStream`（输出字节流）、`Reader`（输入字符流）、`Writer`（输出字符流），其他流都继承自这四大基类。

**字节流**：`InputStream` 主要方法有 `read()`、`read(byte[] b)`、`read(byte[] b, int off, int len)`、`close()`、`available()`、`skip(long)`，支持回推的流还有 `markSupported()`、`mark(int)`、`reset()`；常用子类有 `ByteArrayInputStream`（字节数组读）、`PipedInputStream`（管道流，与 PipedOutputStream 配合实现多线程管道通信）、`FilterInputStream`（装饰者基类）、`BufferedInputStream`（缓冲流，攒满缓冲区再发送效率更高）、`DataInputStream`（读写基本类型）、`FileInputStream`（文件读取）、`ObjectInputStream`（对象输入，用于序列化/反序列化）。`OutputStream` 主要方法有 `write(int)`、`write(byte[])`、`write(byte[], int off, int len)`、`close()`、`flush()`（强制刷出缓冲区中不足一批的数据）。

**字符流**（JDK 1.1 引入，基于 Unicode 字符集，一个字符占两字节）：`Reader` 常用子类有 `CharArrayReader` / `StringReader`（介质流）、`PipedReader`、`BufferedReader`（装饰器，提供缓冲）、`FilterReader` / `PushBackReader`、`InputStreamReader`（最重要的桥梁类，把字节输入流转为字符输入流）、`FileReader`（内部就是 FileInputStream 转变为 Reader 的常用工具类）；`Writer` 常用子类有 `CharArrayWriter` / `StringWriter`、`PipedWriter`、`BufferedWriter`、`PrintWriter`（与 PrintStream 极其类似）、`OutputStreamWriter`（字符转字节的桥梁）、`FileWriter`。

| 对比项 | 字节流 | 字符流 |
| --- | --- | --- |
| 基类 | InputStream / OutputStream | Reader / Writer |
| 处理单位 | 字节（1 字节 = 8 bit） | 字符（1 字符 = 2 字节） |
| 缓冲 | 不使用缓冲区，直接操作文件本身 | 使用缓冲区，通过缓冲区再操作文件 |
| 中文处理 | 可能乱码 | 可正确传输显示中文 |
| 本质 | 底层设备永远只接受字节 | 字节流的包装，内部把字符转成字节再写 |
| 适用文件 | 图像、视频、PPT、Word 等二进制 | 纯文本文件（TXT 等） |

注意：字节流可以处理纯文本文件，但字符流不能处理图像、视频等非文本文件；字符与字节转换时要注意编码问题。**如何选择流（三步）**：① 以程序为参照确定输入流或输出流；② 确定字节流或字符流（存在中文必选字符流），至此选定节点流；③ 需要增强功能再选一个处理流包装（如缓冲流）。

### IO 模型 {#io-model}

考点：BIO/NIO/AIO 的工作方式与适用场景对比、NIO 三大核心组件。

**四种模型概述**

- BIO（Blocking I/O，同步阻塞）：读写时线程一直等待直到完成；高并发下线程被阻塞、无法执行其他任务，可能产生性能问题。
- NIO（Non-blocking I/O，非阻塞）：线程发起 I/O 后不等待、继续执行其他任务，通过轮询或回调检查完成情况；能更好支持并发，但轮询可能浪费 CPU。
- I/O 多路复用：借助操作系统提供的选择器（如 Java 的 Selector），一个线程监听多个通道上的 I/O 事件，在单线程中处理多个连接。
- AIO（Asynchronous I/O，异步）：发起 I/O 后继续执行其他任务，完成时由系统通知并回调；Java 中通过 NIO.2 的 `AsynchronousChannel` 和 `CompletionHandler` 接口实现。

| 对比项 | BIO | NIO | AIO |
| --- | --- | --- | --- |
| 模型 | 同步阻塞 | 同步非阻塞 | 异步非阻塞 |
| 工作方式 | 线程等待 I/O 完成才返回 | 线程不等待，轮询/Selector 检查就绪 | 发起后即返回，完成后系统回调 |
| 适用场景 | 连接少、并发不高（传统 Socket 编程） | 高并发、连接多（Selector/Channel 管理多连接） | 大量并发连接、充分利用系统资源 |

**NIO 的实现原理**（三大核心组件）

- Channel（通道）：类似传统流但可读可写、支持异步；常用 `FileChannel`、`DatagramChannel`、`SocketChannel`、`ServerSocketChannel`，覆盖 TCP/UDP 网络与文件 IO。
- Buffer（缓冲区）：存储数据的容器，Channel 从 Buffer 读数据、把数据写入 Buffer；实现有 ByteBuffer、CharBuffer、IntBuffer 等覆盖基本类型；三个重要属性：capacity（容量）、position（位置）、limit（界限）。
- Selector（选择器）：允许一个线程同时监控多个 Channel，某 Channel 发生读/写事件时通过 Selector 得到通知，一个线程即可管理多个网络连接。

工作步骤：

1. 通过 `open()` 静态方法打开 Channel；
2. 创建一个或多个 Buffer 用于读写数据；
3. 数据先写入 Buffer，再把 Buffer 中的数据写入 Channel（读取则反向）；
4. 将 Channel 注册到 Selector 监听感兴趣的 I/O 事件；
5. 循环调用 Selector 的 `select()`（阻塞直到至少一个 Channel 就绪），迭代 `selectedKeys()` 获取 `SelectionKey` 处理对应事件。

### 序列化与反序列化 {#io-serialize}

考点：序列化的概念、Serializable 标记接口、对象流的使用。

- 概念：序列化（Serialize）是将 Java 对象转换为字节序列写入 IO 流（可存磁盘或在网络中传输）；反序列化（Deserialize）是从 IO 流中恢复该 Java 对象，使字节序列能再次恢复成原来的对象。
- 前提条件：对象的类需实现 `Serializable` 接口——它是一个标记接口，不提供任何方法，仅标明该类可序列化；包装类、String、Date 等 Java 常用类已实现。
- 实现方式：用对象流 `ObjectOutputStream`（序列化调用 `writeObject()` 输出对象序列）和 `ObjectInputStream`（反序列化调用 `readObject()` 恢复对象）。

```java
// 序列化
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("object.dat"));
oos.writeObject(user);
// 反序列化
ObjectInputStream ois = new ObjectInputStream(new FileInputStream("object.dat"));
User user = (User) ois.readObject();
```

## 多线程 {#thread}

### 进程线程基础 {#thread-basics}

核心结论：进程是资源分配的基本单位，线程是 CPU 调度的最小单位，一个进程内的多线程共享内存空间与系统资源。

- **进程**：系统运行程序的基本单位。Java 中启动 main 函数就是启动了一个 JVM 进程，main 函数所在的线程称为**主线程**。
- **线程**：进程中的一个执行单元，负责执行进程中的任务。多线程并发可能引发竞态条件、死锁等问题。

创建线程的三种方式：

```java
// 1. 继承 Thread 类，重写 run()
class MyThread extends Thread {
    public void run() { /* 线程执行逻辑 */ }
}
new MyThread().start();

// 2. 实现 Runnable 接口（Thread 本身也实现了 Runnable）
class MyRunnable implements Runnable {
    public void run() { /* 线程执行逻辑 */ }
}
new Thread(new MyRunnable()).start();

// 3. Executor 框架：把任务提交给线程池，由线程池管理线程生命周期和执行
Executor executor = Executors.newFixedThreadPool(3);
executor.execute(new MyTask());
```

**线程生命周期（7 种状态）**：

1. 新建（New）：`new Thread()` 后尚未启动。
2. 就绪（Runnable）：调用 `start()` 后，等待 CPU 时间片。
3. 运行（Running）：获得 CPU 时间，执行 `run()` 中的代码。
4. 阻塞（Blocked）：因等待资源、等待 I/O、调用 `sleep()` 等放弃 CPU。
5. 等待（Waiting）：通过 `Object.wait()`、`Thread.join()`、`LockSupport.park()` 进入，等待其他线程唤醒。
6. 超时等待（Timed Waiting）：通过 `Thread.sleep()`、`Object.wait(timeout)`、`Thread.join(timeout)`、`LockSupport.parkNanos()` 进入，超时或被唤醒后回到就绪。
7. 终止（Terminated）：run() 执行完毕或因异常退出，不能再进入任何状态。

**Java 线程状态与操作系统进程状态的对应**：Java 把操作系统的就绪/运行合并为一个 Runnable 状态，把阻塞细分为 BLOCKED、WAITING、TIMED_WAITING 三种。

**run 与 start 的区别**：run 方法只是线程的执行体，直接调用 run() 会在**当前线程**上下文中执行，不创建新线程；start() 才会分配系统资源、将线程置于就绪状态，由调度器选择后在新线程中执行 run()。要实现多线程必须调用 start()。

### Java 内存模型（JMM） {#thread-jmm}

核心结论：JMM 屏蔽各硬件和操作系统的内存访问差异，规范主内存与线程工作内存的交互，为多线程提供可见性与有序性保证；注意别与描述内存划分的「运行时数据区」混淆。

**通信与同步**：线程间通信有**共享内存**（隐式通信、显式同步）与**消息传递**（显式通信、隐式同步）两种模型，Java 采用共享内存模型——线程先把主内存数据拷贝到工作内存处理，再写回主内存，完成隐式通信。工作内存是缓存、写缓冲区、寄存器以及编译器优化等的抽象，并非一块真正的内存；堆中的实例域、静态域、数组元素线程间共享，局部变量和方法参数在虚拟机栈上、线程私有。可见性问题的根源是处理器远快于内存而引入的高速缓存：线程 A 修改后未刷回主内存，其他线程看不到。

**重排序与有序性**（为提高性能分三类：编译器优化重排序、指令级重排序、内存系统重排序）：

- **数据依赖性**：两个操作访问同一变量且其一为写（写后读、写后写、读后写）时，重排会改变结果，编译器和处理器不会重排（仅针对单处理器、单线程内的操作）。
- **as-if-serial**：无论怎么重排，单线程程序的执行结果不能被改变；多线程则可能出现可见性问题，需要正确同步。
- **顺序一致性模型**是理想化参考模型：操作按程序顺序执行、所有线程看到同一执行顺序、每个操作原子执行且立刻对所有线程可见。JMM 没有实现它（成本太大），只保证**正确同步的程序**的执行结果与顺序一致性模型下的结果相同；临界区内允许重排序，JMM 在进入/退出临界区两个时间点做特殊处理，使线程在这两点具有相同的内存视图。
- 对未正确同步的程序，JMM 只提供**最小安全性**：线程读到的值要么是默认值（0、null 等），要么是其他线程写入的值。

**happens-before（JMM 最核心的概念）**：A happens-before B，则 A 的执行结果对 B 可见且排在 B 之前；这不要求具体实现必须按该顺序执行——只要重排后的执行结果一致，重排并不非法。规则：

1. 程序顺序规则：一个线程中的每个操作，happens-before 于该线程中的任意后续操作。
2. 监视器锁规则：对一个锁的解锁，happens-before 于随后对这个锁的加锁。
3. volatile 变量规则：对一个 volatile 域的写，happens-before 于任意后续对这个域的读。
4. 传递性：A happens-before B，B happens-before C，则 A happens-before C。
5. start() 规则：线程 A 执行 ThreadB.start()，该操作 happens-before 于线程 B 中的任意操作。
6. join() 规则：线程 A 执行 ThreadB.join() 成功返回，线程 B 中的任意操作 happens-before 于 A 从 join() 成功返回。

**volatile 的内存语义**：对 volatile 变量的读总能看到任意线程对它最后的写入（可见性）；对任意**单个** volatile 变量的读/写具有原子性，但 `volatile++` 这类复合操作不保证（原子性）。volatile 写把该线程本地内存中的共享变量值刷新到主内存（与释放锁内存效果相同）；volatile 读把本地内存置为无效、从主内存读取（与获取锁内存效果相同）——线程 A 写 volatile 后线程 B 读它，实质是 A 通过主内存向 B 发送消息。

**volatile 内存语义的实现**：JMM 规定主内存与工作内存交互的 8 种操作——lock、unlock、read、load、use、assign、store、write（read 与 load、store 与 write 两两成对，不允许单独出现）。volatile 靠限制重排序实现：第二个操作是 volatile 写时，其前的操作不可重排到写后；第一个操作是 volatile 读时，其后的操作不可重排到读前；volatile 写后跟 volatile 读不允许重排。编译器按保守策略插入内存屏障：每个 volatile 写前插 StoreStore、写后插 StoreLoad，每个 volatile 读后插 LoadLoad 和 LoadStore；实际执行中只要不改变写-读的内存语义，可省略不必要的屏障。

**锁的内存语义**：释放锁时把本地内存中的共享变量刷新到主内存，获取锁时把本地内存置为无效，使临界区代码必须从主内存读取共享变量。ReentrantLock 基于 AQS：公平锁加锁首先读 volatile 变量 state、释放锁最后写 state；非公平锁采用 CAS 设置 state，而 CAS 具有 volatile 读和写的内存语义。

**final 的内存语义**：构造函数内对 final 域的写与随后把该对象引用赋给引用变量不能重排序；初次读包含 final 域的对象引用与随后初次读这个 final 域也不能重排序。实现上，写 final 在 final 域写之后、构造函数 return 之前插入 StoreStore 屏障；读 final 在读 final 域操作前插入 LoadLoad 屏障。

### 线程同步与锁 {#thread-lock}

**什么是死锁**：每个线程都持有一些资源并等待其他线程持有的资源，所有线程都无法继续执行，整个程序被阻塞。死锁的四个必要条件：

1. 互斥：至少有一个资源一次只能被一个线程使用。
2. 占有且等待：线程持有至少一个资源，同时等待其他线程持有的资源。
3. 不可抢占：资源只能被线程显式释放，不能被强制抢占。
4. 循环等待：一组线程形成环路，每个线程都在等待下一个线程持有的资源。

**如何预防和避免死锁**（破坏任一必要条件）：一次性申请所有资源（破坏占有且等待）；申请不到就主动释放已占有的资源（破坏不可抢占）；按某一顺序申请资源、反序释放（破坏循环等待）。

**锁的分类**（有的指锁的状态，有的指锁的特性或设计）：

| 锁分类 | 含义 | Java 中的体现 |
| --- | --- | --- |
| 公平锁/非公平锁 | 是否按申请顺序获取锁；非公平锁吞吐量更大，但可能造成优先级反转或饥饿 | ReentrantLock 构造函数指定，默认非公平；synchronized 是非公平锁且无法变为公平锁 |
| 可重入锁 | 同一线程在外层方法获取锁后，进入内层方法自动获取锁，可一定程度避免死锁 | ReentrantLock（Re-entrant）、synchronized |
| 独享锁/共享锁 | 独享锁一次只能被一个线程持有；共享锁可被多个线程持有 | ReentrantLock 是独享锁；ReadWriteLock 读锁共享、写锁独享，均通过 AQS 实现 |
| 互斥锁/读写锁 | 独享/共享说法的具体实现 | 互斥锁：ReentrantLock；读写锁：ReadWriteLock |
| 乐观锁/悲观锁 | 看待并发同步的角度而非具体锁 | 悲观锁适合写多场景（各种锁）；乐观锁适合读多场景，常采用 CAS（原子类自旋更新） |
| 分段锁 | 一种锁的设计，细化锁的粒度 | ConcurrentHashMap 的 Segment（继承 ReentrantLock），put 时只锁对应分段，统计 size 时需获取全部分段锁 |
| 偏向锁/轻量级锁/重量级锁 | synchronized 的锁状态（锁升级），通过对象监视器在对象头中的字段表明 | 偏向锁：一直被一个线程访问则自动获取；轻量级锁：被其他线程访问时升级，其他线程自旋尝试；重量级锁：自旋一定次数仍拿不到则膨胀，其他线程阻塞 |
| 自旋锁 | 尝试获取锁的线程不立即阻塞，循环尝试获取 | 减少线程上下文切换的消耗，缺点是循环消耗 CPU |

### volatile 关键字 {#thread-volatile}

volatile 被比喻为「轻量级的 synchronized」，是变量修饰符，只能修饰变量，无法修饰方法及代码块。三大特性：保证可见性（指示 JVM 该变量共享且不稳定，每次使用都到主存读取）；不保证原子性；禁止指令重排序。

### 线程安全的实现 {#thread-safety}

Java 线程安全的三种实现方式：

1. **阻塞同步**：使用锁，可选内置锁 synchronized 关键字或 JUC 下的锁实现。
2. **非阻塞同步**：基于 CAS 操作（JUC 原子类），避免了频繁阻塞唤醒与用户态/内核态切换的开销，但适用面窄。缺点：自旋消耗 CPU 很高；仅能操作单个共享资源，组合类型仍需加锁；存在 ABA 问题。
3. **无同步方案**：线程本地存储，让一个共享资源尽可能在同一线程内处理。场景：生产者-消费者模型、web 服务中一个请求对应一个服务线程、链路跟踪中动态采集方法执行信息。

### 线程锁特点、性能与使用场景 {#thread-lock-choice}

**多线程的理由**：与进程相比，线程开销小、切换快——线程共享所属进程的地址空间和大部分数据。**多线程的问题**：多线程同时访问同一共享资源时必须维护数据一致性，这是 Java 锁机制的来源。

四种线程锁对比：

| 锁 | 特点 | 适用场景 |
| --- | --- | --- |
| synchronized | JVM 层面实现，使用简单、可靠性高；Java 1.6 后有自适应自旋、锁消除、锁粗化、轻量级锁、偏向锁等优化；等待锁时不能被 interrupt() 中断 | 资源竞争不激烈的场景（优先推荐） |
| ReentrantLock | 基于 AQS；可响应中断、可轮询锁请求、定时锁；lock()/unlock() 需手动解锁，必须在 finally 中 unlock；高并发下性能保持稳定 | 高并发量场景 |
| Semaphore | 信号量，用于控制多个临界资源的访问；acquire()/release()，默认可响应中断，也支持轮询、定时、公平/非公平机制 | 存在多个临界资源需要并发控制的场景 |
| AtomicInteger 等 | 基于 CAS 的原子类，性能通常是 ReentrantLock 的数倍；只能同步一个值，不能在多个 Atomic 变量之间同步 | 单个数值的同步，竞争激烈时优于 ReentrantLock |

结论：写同步优先考虑 synchronized，有特殊需要再优化；高并发下 ReentrantLock 与 Atomic 更能维持常态性能。

### 并发容器的原理 {#thread-container}

核心结论：同步容器靠方法级 synchronized 保证线程安全但并发度低，并发容器用锁分段、CAS 等手段只对操作位置做同步，吞吐量更高。

- 普通集合（ArrayList、LinkedList、HashMap 等）非线程安全。**同步容器**（Vector、Stack、Hashtable、Collections.synchronizedXxx 生成）在需要同步的方法上加 synchronized，同一时刻只能有一个线程访问同步函数，削弱了并发性。**并发容器**（java.util.concurrent 包）专门针对多线程并发设计，只对操作的位置进行同步、其他位置其他线程仍可访问，采用 CAS 算法和部分代码使用 synchronized 锁。

| 并发容器 | 对应非并发容器 | 原理 |
| --- | --- | --- |
| ConcurrentHashMap | HashMap | JDK6 用 Segment 分段锁；JDK8 用 CAS 无锁算法；目标是代替 Hashtable、synchronizedMap，支持复合操作 |
| CopyOnWriteArrayList | ArrayList | 利用读多写少特性：读不加锁；写时复制新集合修改后赋回旧引用，volatile 保证可见性，写操作仍需加锁 |
| CopyOnWriteArraySet | HashSet | 基于 CopyOnWriteArrayList，add 时调用 addIfAbsent 遍历查重 |
| ConcurrentSkipListMap | TreeMap | 跳表（Skip list）代替平衡树，默认按 Key 升序 |
| ConcurrentSkipListSet | TreeSet | 内部基于 ConcurrentSkipListMap |
| ConcurrentLinkedQueue | Queue | 基于链表实现的不阻塞 FIFO 队列（LinkedList 的并发版本） |
| LinkedBlockingQueue、ArrayBlockingQueue、PriorityBlockingQueue | BlockingQueue | 通过 ReentrantLock 实现线程安全，Condition 实现阻塞和唤醒；分别为链表/数组实现的阻塞 FIFO 队列和优先级队列 |

### 线程池 {#thread-pool}

**是什么**：多线程处理形式——将任务添加到队列，创建线程后自动启动这些任务；线程数不超过最大值，超出的任务排队等待其他线程完成后执行。**为什么需要**：直接创建的线程运行结束即被虚拟机销毁，线程数量多时频繁创建销毁浪费时间和内存；线程池让线程运行完后不立即销毁而是复用。**优点**：重用存在的线程，减少对象创建销毁的开销；有效控制最大并发线程数，提高资源利用率、避免资源竞争堵塞；提供定时执行、定期执行、单线程、并发数控制等功能。

**Java 提供的四种线程池及使用场景**：

| 线程池 | 特点 | 适用场景 |
| --- | --- | --- |
| FixedThreadPool | 固定线程数；无空闲线程时新任务暂存任务队列 | 需要限制当前线程数量的应用，负载比较重的服务器 |
| SingleThreadExecutor | 只有一个线程，多余任务按 FIFO 入队 | 需要顺序执行各个任务、任意时刻不会有多个活动线程 |
| CachedThreadPool | 线程数可调整，优先复用空闲线程，无空闲则新建 | 执行很多短期异步任务的小程序，负载较轻的服务器 |
| ScheduledThreadPoolExecutor | 在给定延迟后运行或定期执行任务；分多线程版和 SingleThreadScheduledExecutor 单线程版 | 需要多个/单个后台线程执行周期任务 |

**创建线程池的三种方式**：

1. Executors 工具类：便捷但《阿里巴巴 Java 开发手册》强制不允许使用，规避资源耗尽的风险。
2. ThreadPoolExecutor 构造函数（推荐）：自己创建并给阻塞队列指定容量；提交线程数超过可用线程数且队列满时抛出 RejectedExecutionException——抛异常总比发生错误（Error）要好。
3. 开源类库：如 Guava 提供的 ThreadFactoryBuilder。

## JVM {#jvm}

### JVM 内存结构 {#jvm-structure}

根据 JVM 规范，JVM 内存共分为五部分：虚拟机栈、堆、方法区、程序计数器、本地方法栈。（原 PDF 此处为图示）

### 堆和栈的区别 {#jvm-heap-stack}

| 维度 | 堆 | 栈 |
| --- | --- | --- |
| 大小确定 | 运行时确定 | 编译时即可确定 |
| 管理方式 | 由用户管理（Java 中由 JVM 管理） | 自动释放 |
| 实现结构 | 一块一块的内存 | 数据结构中的栈，先进后出 |
| 分配速度 | 相对慢 | 快得多，分配仅是移动一个指针 |
| 归属 | 线程共享 | 线程私有 |

### OOM {#jvm-oom}

OOM（Out Of Memory）：当 JVM 没有足够内存为对象分配空间，且垃圾回收器也没有空间可回收时抛出的错误。最常见的是堆内存溢出：`java.lang.OutOfMemoryError: java heap space`（最大堆内存由 -Xmx 参数指定）。解决方式：检查程序是否有死循环或不必要地重复创建大量对象，修改程序和算法；增加初始堆（-Xms）和最大堆（-Xmx）大小，如 `-Xms256m -Xmx1024m`。

### JVM 内存管理 {#jvm-mgmt}

**运行时数据区组成**：Java 堆、方法区（共享）；Java 虚拟机栈、本地方法栈、程序计数器（私有）。

私有数据区：

- **程序计数器**：记录正在执行的字节码指令地址，字节码解释器通过改变它的值选取下一条指令；线程切换后可恢复到正确的执行位置。
- **Java 虚拟机栈**：由一个个栈帧组成，方法从调用到执行完毕对应栈帧入栈到出栈；栈帧存储局部变量表、操作数栈、动态连接、方法出口等信息。局部变量表存放编译期可知的基本数据类型、对象引用和 returnAddress（指向一条字节码指令的地址），以局部变量槽表示，空间在编译期分配、运行期槽数量不变。
- **本地方法栈**：为虚拟机使用的 native 方法服务，其余同虚拟机栈。

共享数据区：

- **Java 堆**：虚拟机启动时创建，是垃圾收集器管理的内存区域。
- **方法区**：存储已被加载的类型信息、常量、静态变量、即时编译器编译后的代码缓存等。方法区是规范（接口），永久代是 HotSpot 给出的实现。
- **运行时常量池**：方法区的一部分，包括类的描述信息（版本、字段、方法、接口）和常量池表（编译期生成的字面量与符号引用）；具有动态性，运行期间也可放入新常量。

**对象的创建（五步）**：

1. 类加载检查：new 指令先检查能否在常量池定位到类的符号引用，该类是否已加载、解析和初始化过，没有则先执行类加载。
2. 分配内存：内存规整时用指针碰撞（指针向空闲空间移动对象大小的距离）；内存不规整时用空闲列表（维护可用内存块列表）。并发分配问题用 CAS + 失败重试或 TLAB（线程本地分配缓冲，用完分配新缓冲区时才同步锁定）解决。
3. 初始化内存空间：分配到的空间（对象头除外）全置零值，保证实例字段不赋值也能使用。
4. 设置对象头：保存类实例信息、哈希码、GC 分代年龄等。
5. 执行构造函数：按程序员意愿初始化对象。

**对象的结构**：对象头、实例数据、对齐填充三部分。

- 对象头包括两类数据：Mark Word（哈希码、GC 分代年龄、锁状态标志、线程持有的锁、偏向线程 ID、偏向时间戳等运行时数据，是动态结构以在小空间存储尽量多的数据）和类型指针（指向类元数据，确定对象是哪个类的实例）；数组对象还要有一块记录数组长度的数据。
- 实例数据：对象真正存储的有效信息，即程序中定义的各种字段内容（含父类继承的），存储顺序受分配策略参数和源码定义顺序影响。
- 对齐填充：不必然存在，起占位作用，保证对象起始地址是 8 字节的整数倍（HotSpot 自动内存管理的要求）。

**对象访问定位（两种方式）**：Java 通过栈上的 reference 操作堆上的具体对象。

- 句柄方式：堆中划分句柄池，reference 存句柄地址，句柄中包含对象实例数据指针和对象类型数据指针。优点是稳定——对象被移动时只改句柄中的实例数据指针，reference 本身不变。
- 直接指针：reference 中直接放对象地址。优点是少一次指针定位开销，访问速度更快。

### G1 收集器 {#jvm-g1}

核心结论：G1（Garbage-First）将整个堆划分为多个等大的 Region（内部连续）取代物理分代——之前的收集器把堆物理划分为新生代/老年代，需要两种收集器配合才能全代回收；每个 Region 不同时间代表的角色不固定，整体分为 Eden、Survivor、Old、Humongous（存大对象）四种。整体采用标记-整理算法，从 Region 的角度看采用复制算法。

G1 垃圾收集的四个阶段：

1. 初始标记：标记 GC Roots 直接关联的对象；触发 STW。
2. 并发标记：与用户程序并发执行，标记出所有回收对象。
3. 最终标记：处理并发标记后新产生的对象；触发 STW。
4. 筛选回收：先对 Region 的回收价值排序，再根据期望暂停时间选择性回收 Region；回收采用标记复制，多条收集器线程并发执行；不追求一次全部清理完；触发 STW。

### 类加载机制 {#jvm-classload}

类加载机制：类的数据从 Class 文件加载到内存，并对数据进行校验、转换解析和初始化，最终形成可以被虚拟机直接使用的 Java 类型。

类的生命周期七阶段：加载（Loading）、验证（Verification）、准备（Preparation）、解析（Resolution）、初始化（Initialization）、使用（Using）、卸载（Unloading），其中验证、准备、解析统称连接（Linking）；解析也可以在初始化之后再开始，位置不唯一。

**加载**（三件事；数组类由虚拟机直接在动态内存中构造，其组件类型仍由加载器加载）：

1. 通过类的全限定名获取定义此类的二进制字节流——来源不限，可从 ZIP 包读取、网络获取（Web Applet）、运行时计算生成（动态代理）、其他文件生成（JSP）、加密文件中获取等。
2. 将字节流所代表的静态存储结构转化为方法区的运行时数据结构。
3. 在内存中生成一个代表这个类的 java.lang.Class 对象，作为方法区该类各种数据访问的入口。

**验证**（确保 Class 文件正确、防恶意字节码攻击；重要但非必须，对反复使用的类可关闭验证以缩短加载时间）：

1. 文件格式验证：是否符合 Class 文件格式，如开头魔数、主次版本号、常量池。
2. 元数据验证：类的元数据语义校验，如是否有父类、是否实现了接口或抽象类中的方法。
3. 字节码验证：通过数据流分析和控制流分析确定程序语义合法；很费时间，编译器会生成 StackMapTable 供虚拟机直接检查。
4. 符号引用验证：验证符号引用转直接引用时合法，判断是否缺少或被禁止访问依赖的外部类、方法、字段。

**准备**：为类中静态变量分配内存并设置初始零值（仅 static 变量，不含实例变量；`public static int a = 123` 此时为 0，赋 123 在初始化阶段）。例外：带 ConstantValue 属性的字段（如 `public static final int value = 123`）在准备阶段就直接赋值。

**解析**：将常量池内的符号引用替换为直接引用。符号引用与内存布局无关；直接引用是可以直接指向目标的指针、相对偏移量或间接定位目标的句柄，有直接引用则目标必定已在内存中存在。

**初始化**：类加载的最后一步，执行类构造器 `<clinit>()` 方法——由编译器自动收集类中所有类变量赋值动作和静态语句块合并产生，顺序由语句在源文件中的顺序决定。静态语句块只能访问定义在它之前的变量，之后的变量只能赋值不能访问。父类的 `<clinit>()` 先于子类执行；没有静态语句块和变量赋值的类可以不生成 `<clinit>()`。

**类加载器**：实现「通过全限定名获取二进制字节流」这一功能的代码。任意一个类由加载它的类加载器和类本身共同确立在 JVM 中的唯一性，每个类加载器拥有独立的类名称空间——即使 Class 文件相同，不同加载器加载的也是不同的类。

**双亲委派模型**（四层加载器，除顶层外均有父加载器，通过组合复用父加载器代码而非继承）：

1. 启动类加载器：加载 `<JAVA_HOME>\lib` 目录或 -Xbootclasspath 指定路径中的类。
2. 扩展类加载器：加载 `<JAVA_HOME>\lib\ext` 目录或 java.ext.dirs 系统变量指定路径中的类库。
3. 应用类加载器：加载用户类路径（ClassPath）上的所有类库，未自定义时即为程序默认类加载器。
4. 自定义加载器：用户自行扩展，如增加其他 Class 来源、实现类隔离与重载。

工作方式：收到类加载请求先委派给父加载器，逐层上传至顶层启动类加载器；只有父加载器反馈无法完成（搜索范围中没有所需类）时，子加载器才自己加载。这保证了越基础的类由越上层的加载器加载，各加载器协作时基础类型一致。

**破坏双亲委派**：基础类型需要调用回用户代码时（父加载器请求子加载器）。典型如 JNDI——JNDI 代码由启动类加载器加载，但需要 ClassPath 下的 SPI 服务代码，于是使用线程上下文类加载器加载；OSGi 实现模块化热部署，类加载器从树状结构发展为更复杂的网状结构。

### 内部类 {#jvm-inner}

使用原因：内部类可以对同一个包中的其他类隐藏；内部类方法可以访问定义这个类的作用域中的数据（包括私有数据）。

- **内部类访问对象状态**：内部类对象总有一个隐式引用指向创建它的外围类对象（编译器修改内部类构造器添加外围类引用参数）。只有内部类可以是 private，常规类只有包可见性或 public。内部类是编译器现象，与虚拟机无关——编译为常规类文件，用 `$` 分隔外部类名和内部类名。
- **特殊语法规则**：外围类引用 `OuterClass.this`（如 Person.this）；内部类对象构造器 `outerObject.new InnerClass(params)`；在外围作用域之外引用 `OuterClass.InnerClass`；内部类中声明的所有静态字段必须是 final 并初始化为编译时常量；内部类不能有 static 方法（访问外围静态字段和方法的静态方法除外）。
- **局部内部类**：对象只被一个方法创建一次时在方法内局部定义；不能有访问说明符（private/public），作用域限定在声明块中；优势是对外部世界完全隐藏；可以访问方法中的局部变量，但这些变量必须是 final。
- **匿名内部类**：只创建一个对象、不需为类命名，语法 `new superType(construction params) {...}`，superType 可以是接口（实现它）或类（扩展它）。没有类名所以不能有构造器，构造参数传递给超类构造器；实现接口时不能有构造参数但仍有小括号；可以提供对象初始化块。静态方法中获取当前类名可用 `new Object(){}.getClass().getEnclosingClass()`。
- **双括号初始化**：外层括号建立匿名子类，内层括号是对象初始化块，适合不再使用的集合（Map、Deque、Set 也有类似技巧）。
- **静态内部类**：static 声明，对象没有外围类对象的引用；只要不需要访问外围类对象就应该使用静态内部类；可以有静态字段和方法；接口中声明的内部类自动是 public 和 static。

### 代理类 {#jvm-proxy}

**创建代理对象**：使用 Proxy 类的 newProxyInstance 方法，三个参数——类加载器、Class 对象数组（接口）、调用处理器 InvocationHandler。代理对象调用的所有方法都会触发处理器的 invoke() 方法执行。

```java
Student proxy = (Student) Proxy.newProxyInstance(
        s1.getClass().getClassLoader(),
        s1.getClass().getInterfaces(),
        new InvocationHandler() {
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                if (method.getName().equals("setName")) {
                    return method.invoke(s1, "李四") + "和王五"; // 增强指定方法
                }
                return method.invoke(s1, args); // 其余原样调用
            }
        });
```

**代理类的特性**：代理类在程序运行过程中动态创建，一旦被创建就成为常规类；所有代理类都扩展 Proxy 类，一个代理类只有一个实例字段（调用处理器，在 Proxy 超类中定义），完成代理任务所需的其他数据须存储在调用处理器中；代理类总是 public 或 final——如果代理类实现的所有接口都是 public，它不属于任何特定的包，否则所有非公共接口必须属于同一个包，代理类也属于这个包。

## 新特性 {#newfeat}

### Lambda 表达式 {#newfeat-lambda}

Lambda 表达式用于将代码块传递到某个对象，由该对象在某个时间调用（延迟执行）。

**语法**：无参数时仍要提供空括号 `() -> {...}`；参数类型可推导时可省略类型 `(s1, s2) -> {...}`；只有一个参数且类型可推导时可省略小括号 `a -> {...}`；只在一些分支返回值是不合法的，如 `(int x) -> { if (x > 0) return 1; }`。

**函数式接口**：只有一个抽象方法的接口；在 Java 中对 lambda 表达式所能做的也就是转换为函数式接口。例如 ArrayList 的 removeIf 方法参数是 Predicate，`list.removeIf(e -> e == null)` 可删除所有 null 值。供应者（Supplier）没有参数，调用时生成一个 T 类型的值，用于实现懒计算——只有需要值时才调用供应者。

**方法引用**（用 `::` 运算符分隔方法名与对象或类名，指示编译器生成函数式接口的实例、覆盖抽象方法来调用给定方法）：

- 对象::实例方法（如 `System.out::println`）：lambda 参数作为方法的显式参数传入。
- 类::实例方法（如 `String::trim`）：lambda 表达式会成为隐式对象。
- 类::静态方法（如 `Integer::valueOf`）：lambda 表达式会传递到这个静态方法。

注意：只有 lambda 体只调用一个方法而不做其他操作时才能重写为方法引用；方法引用不是对象、不能独立存在，总是转换为函数式接口的实例；对象为空时方法引用直接抛出异常，而等价 lambda 只在调用时抛出；方法引用中可以使用 this、super 参数。

**构造器引用**：与方法引用类似，方法名为 new。`Person::new` 是 Person 构造器的引用，具体哪一个取决于上下文；数组也有构造器引用 `Integer[]::new`。

**变量作用域**：lambda 可以「捕获」外围作用域中变量的值，但只能引用值不会改变的外部变量，捕获的变量必须是 final；与嵌套块有相同的作用域，在其中声明与局部变量同名的参数或局部变量不合法；lambda 中的 this 含义与外面一致。

## Spring {#spring}

### Spring、Spring MVC、Spring Boot 的区别 {#spring-compare}

- **Spring**：全面的 Java 企业级应用程序开发框架，提供依赖注入、AOP（面向切面编程）、事务管理等广泛功能。
- **Spring MVC**：Spring 中的一个重要模块，赋予 Spring 快速构建 MVC 架构 Web 程序的能力。MVC 即模型（Model）、视图（View）、控制器（Controller），核心思想是通过将业务逻辑、数据、显示分离来组织代码；主要关注处理 Web 请求、管理用户会话、控制应用程序流程。
- **Spring Boot**：基于 Spring 的微服务框架，延续 Spring 的 IoC 和 AOP 核心思想，简化应用的开发和部署；提供约定大于配置的方式，无需过多关注 XML 配置，使构建独立的、自包含的 Spring 应用更加容易。

简言之：Spring 是全面框架，Spring MVC 是其中专注 Web 开发的部分，Spring Boot 旨在简化和加速 Spring 应用的开发。

### Spring 框架体系 {#spring-modules}

Spring 框架至今已集成 20 多个模块，分布在核心容器、数据访问/集成层、Web 层、AOP 模块、植入（Instrumentation）模块、消息传输（Messaging）、测试（Test）模块中。

- **核心容器**：spring-core（框架基本组成，IoC 与 DI）、spring-beans（BeanFactory，工厂模式的经典实现）、spring-context（ApplicationContext，框架式对象访问方式）、spring-context-support（整合第三方库，如 EhCache/JCache 缓存、Quartz 任务调度）、spring-expression（强大的表达式语言 SpEL，支持运行时查询和操作对象图）。
- **AOP 与 Instrumentation**：spring-aop（符合 AOP 要求的面向切面编程实现，定义方法拦截器和切入点）、spring-aspects（与 AspectJ 集成）、spring-instrument（类植入支持和类加载器实现）。
- **消息**：spring-messaging（Spring 4.0 新增），支持消息传递体系结构和协议。
- **数据访问/集成**：spring-jdbc（JDBC 抽象层）、spring-orm（JPA、Hibernate 等 ORM 集成层）、spring-oxm（对象/XML 映射抽象层，如 JAXB、XStream）、spring-jms（Java 消息服务）、spring-tx（编程和声明式事务管理）。
- **Web**：spring-web（基本 Web 集成，如多文件上传、Servlet 监听器初始化 IoC 容器）、spring-webmvc（Spring MVC 与 REST Web Services 实现）、spring-websocket（Spring 4.0 新增）、Portlet 模块。
- **测试**：spring-test，支持 JUnit 或 TestNG 对 Spring 组件做单元测试和集成测试。

### AOP {#spring-aop}

**是什么**：AOP（Aspect Oriented Programming，面向切面编程）是一种编程思想，是 OOP 的补充——OOP 将程序抽象成各个层次的对象，AOP 将程序抽象成各个切面。

**为什么需要**：日志、事务、安全等代码往往横向散布在所有对象层次中，与核心功能无关且导致大量代码重复（称为横切关注点）。AOP 用「横切」技术把影响了多个类的公共行为封装到一个可重用模块「切面」中，减少重复代码、降低模块耦合度、便于维护，并将核心关注点与横切关注点分离。

**实现分类**（按 AOP 框架修改源代码的时机）：静态 AOP（AspectJ）在编译阶段对程序源代码进行修改、生成静态的 AOP 代理类，需要特定的编译器，性能更好；动态 AOP（如 Spring AOP）在运行阶段动态生成代理对象（JDK 动态代理或 CGLIB），无需特定编译器。

**核心概念**：

| 概念 | 说明 |
| --- | --- |
| 横切关注点 | 对哪些方法进行拦截、拦截后怎么处理 |
| 切面（Aspect） | 对横切关注点的抽象 |
| 连接点（Joinpoint） | 被拦截到的点；Spring 只支持方法类型的连接点（实际还可以是字段或构造器） |
| 切入点（Pointcut） | 对连接点进行拦截的定义 |
| 通知（Advice） | 拦截到连接点之后要执行的代码，分前置、后置、异常、最终、环绕五类 |
| 目标对象 | 代理的目标对象 |
| 织入（Weave） | 将切面应用到目标对象并导致代理对象创建的过程 |
| 引入（Introduction） | 不修改代码的前提下，运行期为类动态地添加方法或字段 |

**Spring 对 AOP 的支持**：AOP 代理由 Spring 的 IoC 容器负责生成和管理，依赖关系也由容器注入，代理可直接使用容器中的其他 bean 实例作为目标。创建代理的规则：默认使用 JDK 动态代理（可为任何接口实例创建代理）；当需要代理的类不是代理接口时切换为 CGLIB，也可强制使用 CGLIB。

**动态代理的方式**：

- JDK 动态代理：只提供接口的代理，不支持类的代理。核心是 InvocationHandler 接口和 Proxy 类——InvocationHandler 通过 invoke() 方法反射调用目标类中的代码，动态地将横切逻辑和业务编织在一起；Proxy 利用 InvocationHandler 动态创建符合某一接口的实例，生成目标类的代理对象。
- CGLIB：代码生成类库，运行时动态生成指定类的一个子类对象，覆盖其中特定方法并添加增强代码，通过继承实现 AOP；被标记为 final 的类无法使用 CGLIB 做动态代理。

AOP 编程中程序员只需参与三部分：定义普通业务组件、定义切入点（可横切多个业务组件）、定义增强处理。AOP 框架将自动生成 AOP 代理，即代理对象的方法 = 增强处理 + 被代理对象的方法。

### IoC 和 DI {#spring-ioc}

**IoC（控制反转）**：不是技术而是一种设计思想——将设计好的对象交给容器控制，而不是在对象内部直接控制，目的是解耦各种有依赖关系的业务对象之间的绑定关系。好处：不需要自己创建类的实例，由 IoC 容器创建，需要时直接到容器中获取。IoC 的主要实现方式是依赖注入，注入方式有构造方法注入、setter 注入、接口注入。

**DI（依赖注入）**：容器实例化对象时主动将被调用者注入给调用者。2004 年 Martin Fowler 提出——「依赖注入」明确描述了「被注入对象依赖 IoC 容器配置依赖对象」，比含义模糊的「控制反转」更清楚。IoC 与 DI 是同一个概念的不同角度描述。

**IoC-Provider** 的基础职责：

1. 业务对象的构建管理：业务对象不关心依赖对象如何构建获取，交给 Provider。
2. 业务对象之间的依赖绑定：结合构建管理的所有对象及其可识别的依赖关系注入绑定，保证每个业务对象使用时处于就绪状态。

**Spring 的 IoC 容器**：担任 IoC-Provider 职责，并增加 Bean 生命周期管理、AOP 支持。整体分两个阶段：容器启动阶段（以某种方式将配置的 Bean 信息——XML、注解、Java 编码——加载进应用）、Bean 实例化阶段（将配置信息组装成业务对象）；两个阶段都预留了扩展钩子供自定义拓展。

核心接口与类：

1. Resource：解决配置文件从哪里读取、如何读取。
2. BeanDefinition：解决 Bean 的具体定义（名字、类型、属性值或引用），容器根据定义生成实例。
3. BeanFactory：解决已获取 Bean 定义的情况下如何装配、获取 Bean 实例。
4. ApplicationContext：对上述内容的功能封装，解决根据地址获取 IoC 容器并使用。

从源码看 Bean 的整体流程：

1. BeanDefinitionReader 读取 Bean 配置信息，用 BeanDefinition 表示并注册到 BeanDefinitionRegistry（一个 map）。
2. 通过实现 BeanFactoryPostProcessor 的类自定义修改 BeanDefinition 信息（如果有的话）。
3. Bean 实例化：策略化实例（CGLIB、反射两种方式），然后根据 BeanDefinition 信息填充 Bean 的属性、依赖。
4. 检测各种 Aware 接口（BeanFactory 的、ApplicationContext 的等）。
5. 调用 BeanPostProcessor 的前置处理方法，处理符合要求的 Bean 实例。
6. 如果实现了 InitializingBean 接口，执行 afterPropertiesSet()。
7. 如果定义了 init-method，执行自定义初始化方法。
8. 调用 BeanPostProcessor 的后置处理方法。
9. 使用。
10. 判断 Bean 的 Scope：prototype 类型不再管理；单例类型在容器关闭时，实现了 DisposableBean 接口则执行 destroy 方法，定义了 destroy-method 则执行自定义销毁方法。

两个扩展点：**BeanFactoryPostProcessor** 在 bean 实例化之前修改 bean 的定义信息；**BeanPostProcessor** 在 bean 实例化后修改或替换 bean，是实现 AOP 的关键。Spring 只帮我们管理单例 Bean 的生命周期，prototype 类型的 bean 创建交给使用者后就不再管理。

### Bean 的作用域 {#spring-scope}

Bean 是由 IoC 容器初始化、装配及管理的对象，其定义和依赖关系通过配置元数据描述。注意区分：Spring 的单例基于 BeanFactory（容器内只有一个），Java 的单例基于 JVM（每个 JVM 内只有一个实例）。

| 作用域 | 说明 |
| --- | --- |
| singleton（默认） | IoC 容器中只存在一个共享实例，创建容器时就同时自动创建（非懒加载），所有请求只返回同一实例 |
| prototype（原型） | 每次请求（注入到另一个 bean 或调用 getBean()）都会创建一个新实例，创建容器时并不实例化；根据经验，有状态的 bean 用 prototype，无状态的 bean 用 singleton |
| request | 仅适用于 Web 程序，每次 HTTP 请求产生一个新 bean，仅当前 request 内有效，请求结束后生命周期结束 |
| session | 仅适用于 Web 程序，每次 HTTP 请求产生新 bean，仅当前 HTTP session 内有效，session 废弃时该 bean 也被废弃 |
| globalSession | 仅在基于 Portlet 的 Web 应用中有意义，限定于全局 Portlet Session 的生命周期范围（被构成 portlet 应用的所有 portlet 共享） |

配置方式：XML 中 `scope="singleton"` 或 `@Scope` 注解显式指定。

### Bean 的生命周期 {#spring-bean-lifecycle}

**ApplicationContext 容器中 Bean 的生命周期**：

1. 容器启动后，对 scope 为 singleton 且非懒加载的 bean 进行实例化。
2. 按照 Bean 定义配置信息注入所有属性。
3. 如果实现了 BeanNameAware 接口，回调 setBeanName()，传入该 Bean 的 id。
4. 如果实现了 BeanFactoryAware 接口，回调 setBeanFactory()，传入所在 BeanFactory。
5. 如果实现了 ApplicationContextAware 接口，回调 setApplicationContext()，传入所在 ApplicationContext。
6. 如果有 Bean 实现了 BeanPostProcessor 接口，回调 postProcessBeforeInitialization()。
7. 如果实现了 InitializingBean 接口，回调 afterPropertiesSet()。
8. 如果配置了 init-method，则执行该方法。
9. 如果有 Bean 实现了 BeanPostProcessor 接口，回调 postProcessAfterInitialization()。
10. 经过第 9 步后即可正式使用该 Bean：singleton 的实例会缓存在 IoC 容器中；prototype 的每次被调用都会 new 新对象，生命周期交给调用方管理。
11. 容器关闭后，如果实现了 DisposableBean 接口，回调 destroy()。
12. 如果配置了 destroy-method，则执行该方法，至此 Bean 生命周期结束。

**BeanFactory 中的差异**：ApplicationContext 会利用 Java 反射机制自动识别配置文件中定义的 BeanPostProcessor、InstantiationAwareBeanPostProcessor 和 BeanFactoryPostProcessor 并自动注册到应用上下文；BeanFactory 需要手动调用 addBeanPostProcessor() 注册。

### @Autowired 与 @Resource {#spring-autowired}

- @Autowired 是 Spring 提供的注解，@Resource 是 JDK 提供的注解。
- @Autowired 只能按类型注入，默认要求依赖对象必须存在，允许 null 值时可设置 required 属性为 false；想按名称装配需结合 @Qualifier 注解。
- @Resource 默认按名称注入，也支持按类型注入，有 name 和 type 两个重要属性：未指定 name 时，标注在字段上默认取字段名称作为 bean 名称，标注在 setter 方法上默认取属性名；如果默认名称找不到依赖对象，会回退到按类型装配；但一旦指定了 name 属性，就只能按名称装配。

### BeanFactory 与 FactoryBean {#spring-factory}

一句话总结：BeanFactory 是个 Factory（IoC 容器或对象工厂），FactoryBean 是个 Bean（能生产或修饰对象生成的工厂 Bean），其实现类似工厂模式和装饰器模式。

**BeanFactory**：Spring 容器的顶级接口，为具体 IoC 容器的实现提供规范，职责是实例化、定位、配置应用程序中的对象及建立这些对象间的依赖。常见实现有 DefaultListableBeanFactory、XmlBeanFactory、ApplicationContext 等。原始的 BeanFactory 无法支持 Spring 的许多插件（如 AOP、Web 应用）；ApplicationContext 由 BeanFactory 派生，包含其所有功能，还提供国际化消息访问（MessageSource）、资源访问（URL 和文件）、事件传播、载入多个有继承关系的上下文等，通常建议优先使用。

**FactoryBean**：当实例化 Bean 的过程比较复杂时（`<bean>` 配置灵活性受限），可实现 `FactoryBean<T>` 接口定制实例化逻辑。Spring 自身提供了 70 多个 FactoryBean 实现，从 Spring 3.0 开始支持泛型。关键行为：当 IOC 容器中的 Bean 实现了 FactoryBean 后，通过 getBean(BeanName) 获取到的是该实现类中 getObject() 返回的对象，而不是 FactoryBean 本身；要获取 FactoryBean 实现类本身，要在 id 前加 `&` 符号。

```java
public interface FactoryBean<T> {
    T getObject() throws Exception;      // 返回创建的 Bean 实例
    Class<?> getObjectType();            // 返回创建的 Bean 类型
    boolean isSingleton();               // 创建的 Bean 是 singleton 还是 prototype
}
```

### 循环依赖及解决方式 {#spring-circular}

**什么是循环依赖**：循环引用，两个或两个以上的 bean 互相持有对方形成闭环（如 A 依赖 B，B 依赖 C，C 又依赖 A）。注意这不是函数的循环调用（那是死循环），是对象的相互依赖关系。场景：构造器的循环依赖、field 属性的循环依赖。

**怎么检测**：Bean 创建时给该 Bean 打标，如果递归调用回来发现正在创建中，即存在循环依赖。

**理论依据**：Java 的引用传递——获得对象的引用时，对象的属性可以延后设置，但构造器必须在获取引用之前执行。单例对象的初始化分三步：createBeanInstance（实例化，调用构造方法）、populateBean（填充属性）、initializeBean（调用 init 方法）。循环依赖主要发生在第一、二步之间。

**三级缓存**（解决单例循环依赖的关键）：

| 缓存 | 内容 |
| --- | --- |
| singletonObjects | 单例对象的 cache（一级缓存） |
| earlySingletonObjects | 提前曝光的单例对象的 cache（二级缓存） |
| singletonFactories | 单例对象工厂的 cache（三级缓存，类型 ObjectFactory） |

获取流程：创建 bean 时先从一级缓存 singletonObjects 获取；获取不到且对象正在创建中，从二级缓存 earlySingletonObjects 获取；还获取不到且允许，则通过三级缓存 singletonFactory.getObject() 获取，获取到后从 singletonFactories 移除并放入 earlySingletonObjects。

诀窍在三级缓存：它发生在 createBeanInstance 之后——对象已调用构造器创建出来（虽未完成后续初始化，但根据对象引用已能定位堆中对象），通过 ObjectFactory 提前曝光给大家使用。以 A、B 互相依赖为例：A 完成实例化并提前曝光，填充属性时发现依赖 B 便创建 B；B 初始化时发现自己依赖 A，逐级查缓存后从三级缓存拿到 A 的早期引用，顺利完成初始化并放入一级缓存；随后 A 拿到 B 顺利完成自己的初始化并进入一级缓存——B 持有的 A 引用此时也完成了初始化。

- **基于构造器的循环依赖无法解决**：加入 singletonFactories 的前提是执行了构造器。Spring 将每个正在创建的 Bean 标识符放在「当前创建 Bean 池」中，创建过程中发现自己已在池中则抛出 BeanCurrentlyInCreationException（初始化完成的 Bean 会从池中移除）。
- **基于 setter 属性的循环依赖可以解决**：构造器实例化成功后即将早期对象曝光放到 Map 中并提供获取未完成注入实例引用的方法，属性注入时从 Map 取出依赖对象，不会形成死循环。

### 多例对象 {#spring-prototype}

Spring 中 bean 可定义为 singleton（单例）和 prototype（多例）两种模式：单例是所有请求由一个对象处理（常用的 service、dao 层对象通常单例）；多例是每个请求用一个新对象处理，类似 new，调用 getBean 时就 new 一个新实例。

选择标准：对象含有会改变的状态时用多例，否则用单例。dao 和 service 两层的数据一般不会有属性修改，可以用单例；Controller 层会存储很多需要操作的 vo（值对象），对象状态会被改变，应使用多例。

配置：XML 中 `scope="singleton"`（不写时默认值）或 `scope="prototype"`。

### Spring 中用到的设计模式 {#spring-patterns}

- **工厂模式**：通过 BeanFactory、ApplicationContext 创建 bean 对象。
- **代理模式**：Spring AOP 功能的实现。
- **单例模式**：Spring 中的 Bean 默认都是单例的。
- **模板方法模式**：JdbcTemplate、HibernateTemplate 等以 Template 结尾的对数据库操作的类。
- **包装器模式**：项目需要连接多个数据库、不同客户每次访问不同数据库时，根据需求动态切换不同的数据源。
- **观察者模式**：Spring 事件驱动模型。
- **适配器模式**：Spring AOP 的增强或通知（Advice）；Spring MVC 中用适配器模式适配 Controller。

### 事务传播机制与隔离级别 {#spring-transaction}

事务是逻辑处理原子性的保证手段，可极大避免逻辑处理失败导致的脏数据等问题。两个最重要的特性：**传播级别**定义事务的控制范围，**隔离级别**定义事务在数据库读写方面的控制范围。

**七种事务传播机制**：

| 传播级别 | 行为 |
| --- | --- |
| PROPAGATION_REQUIRED（默认） | 上下文已存在事务则加入执行，不存在则新建事务执行；能满足大多数业务场景 |
| PROPAGATION_SUPPORTS | 存在事务则支持并加入事务，没有事务则以非事务方式执行；适合非原子性的非核心业务 |
| PROPAGATION_MANDATORY | 要求上下文中必须存在事务，否则抛异常；可控制调用代码遗漏添加事务 |
| PROPAGATION_REQUIRES_NEW | 每次都新建事务，并挂起上下文中的事务，新事务完成后恢复原事务；适合子事务不能影响父事务提交回滚的场景（如发送日志要求 100% 准确的红包发送） |
| PROPAGATION_NOT_SUPPORTED | 挂起当前事务，以非事务方式执行，结束后恢复；用于尽可能缩小事务范围，事务越大风险越多 |
| PROPAGATION_NEVER | 要求上下文中不能存在事务，一旦有事务就抛 runtime 异常强制停止 |
| PROPAGATION_NESTED | 上下文中存在事务则嵌套事务执行，不存在则新建事务 |

**四种隔离级别**（由严格到宽松）：

| 隔离级别 | 说明 |
| --- | --- |
| Serializable | 最严格的级别，事务串行执行，资源消耗最大 |
| REPEATABLE READ | 保证一个事务不会修改已由另一个事务读取但未提交（回滚）的数据，避免脏读和不可重复读，性能损失更多 |
| READ COMMITTED | 大多数主流数据库的默认级别，保证不会读到另一个并行事务已修改但未提交的数据，避免脏读，适用于大多数系统 |
| READ UNCOMMITTED | 只保证读取过程中不会读取到非法数据 |

三个术语：**脏读**——读到别的事务回滚前的脏数据（事务 B 修改数据 X 未提交时事务 A 读取了 X，随后 B 回滚）；**不可重复读**——事务 A 首先读取一条数据，事务 B 改变了这条数据，A 再次读取时发现数据不匹配；**幻读**——事务 A 按条件索引得到 10 条数据，事务 B 改变数据使符合 A 搜索条件的记录变成 11 条。

**分布式事务**：分布式高并发环境下，对核心业务逻辑的检查要采用加锁机制（如使用 for update 锁住读取验证的数据），否则读取的数据可能已被其他事务修改，提交后覆盖他人数据导致异常。好的实践：使用编程式事务而非声明式，更精确地控制事务范围；DAO 保持针对一张表的基本操作，业务逻辑放入 manager 和 service；事务内部捕获异常要谨慎，不能随便 catch Exception 导致事务异常被吃掉而无法正常回滚。

## Spring MVC {#springmvc}

### 执行流程 {#springmvc-flow}

SpringMVC 的执行流程（核心是前端控制器 DispatcherServlet 统一调度）：

1. 用户发送请求至前端控制器 DispatcherServlet。
2. DispatcherServlet 收到请求调用 HandlerMapping 处理器映射器。
3. 处理器映射器找到具体的处理器（可根据 xml 配置、注解进行查找），生成处理器对象及处理器拦截器（如果有则生成）一并返回给 DispatcherServlet。
4. DispatcherServlet 调用 HandlerAdapter 处理器适配器。
5. HandlerAdapter 经过适配调用具体的处理器（Controller，也叫后端控制器）。
6. Controller 执行完成返回 ModelAndView。
7. HandlerAdapter 将 Controller 执行结果 ModelAndView 返回给 DispatcherServlet。
8. DispatcherServlet 将 ModelAndView 传给 ViewResolver 视图解析器。
9. ViewResolver 解析后返回具体 View。
10. DispatcherServlet 根据 View 进行渲染视图（即将模型数据填充至视图中）。
11. DispatcherServlet 响应用户。

### 常用注解 {#springmvc-annotation}

| 注解 | 作用 |
| --- | --- |
| @Controller | 注解在类上，表明该类是 Spring MVC 的 Controller 并声明为 Spring 的一个 Bean；DispatcherServlet 自动扫描并映射请求；声明控制器 Bean 只能使用 @Controller |
| @RequestMapping | 映射 Web 请求（访问路径和参数），可注解在类和方法上，方法上的路径继承类上的路径；支持 Servlet 的 request 和 response 作为参数，也支持配置媒体类型 |
| @ResponseBody | 将返回值放在 response 体内而不是返回一个页面，适合 Ajax 异步访问返回数据；可放在返回值或方法上 |
| @RequestBody | 允许 request 的参数在 request 体中而不是链接在地址后面，作用是将 JSON 格式的数据转为 Java 对象；放在参数前 |
| @PathVariable | 接收路径参数，如 /news/001 接收 001 作为参数；放在参数前 |
| @RestController | 组合注解，组合了 @Controller 和 @ResponseBody，适合只开发一个和页面交互数据的控制器 |

### 组件 {#springmvc-component}

| 组件 | 说明 |
| --- | --- |
| 前端控制器 DispatcherServlet | 整个流程控制的中心，相当于 MVC 模式中的 C，由它调用其它组件处理用户请求，降低了组件之间的耦合性 |
| 处理器映射器 HandlerMapping | 根据用户请求找到 Handler，提供不同映射方式（配置文件方式、实现接口方式、注解方式等） |
| 处理器适配器 HandlerAdapter | 通过它对处理器进行执行，是适配器模式的应用，扩展适配器可执行更多类型的处理器 |
| 处理器 Handler | 【开发者编写】具体的业务控制器，由 DispatcherServlet 把用户请求转发过来并处理 |
| 视图解析器 ViewResolver | 将处理结果生成 View 视图：先根据逻辑视图名解析成物理视图名（页面地址），再生成 View 视图对象 |
| 视图 View | 【开发者编写】框架支持 jstlView、freemarkerView、pdfView 等，最常用的是 jsp；需通过页面标签或页面模板技术将模型数据展示给用户 |

### 拦截器 {#springmvc-interceptor}

拦截器对处理器进行拦截，从而增强处理器的功能。Spring MVC 中所有拦截器都需要实现 HandlerInterceptor 接口，该接口包含三个方法：preHandle()、postHandle()、afterCompletion()。

拦截器的执行流程：

1. 执行 preHandle 方法，返回布尔值：false 则结束所有流程，true 则执行下一步。
2. 执行处理器逻辑（包含控制器的功能）。
3. 执行 postHandle 方法。
4. 执行视图解析和视图渲染。
5. 执行 afterCompletion 方法。

拦截器的开发步骤：

1. 开发拦截器：实现 HandlerInterceptor 接口，从三个方法中选择合适的，实现拦截时要执行的具体业务逻辑。
2. 注册拦截器：定义配置类实现 WebMvcConfigurer 接口，在 addInterceptors 方法中注册拦截器，并定义该拦截器匹配哪些请求路径。

## MyBatis {#mybatis}

### JDBC 的不足与 MyBatis 的解决 {#mybatis-jdbc}

逐条说出 JDBC 的四类痛点，并对应 MyBatis 的改进手段。

| JDBC 的不足 | MyBatis 的解决方式 |
| --- | --- |
| 连接创建、释放频繁，浪费系统资源影响性能 | 在 mybatis-config.xml 中配置数据源，用连接池管理数据库连接 |
| SQL 写在 Java 代码中，SQL 变动就要改 Java 代码 | 将 SQL 配置在 Mapper XML 文件中，与 Java 代码分离 |
| 传参麻烦，占位符要与不定的 where 条件一一对应 | 自动将 Java 对象映射至 SQL 语句 |
| 结果集解析麻烦，SQL 变化导致解析代码跟着变 | 自动将 SQL 执行结果映射至 POJO 对象 |

### 插件（Plugin）机制 {#mybatis-plugin}

插件本质是拦截器，借助 JDK 动态代理与责任链模式增强四大核心对象。

- 四大核心对象：Executor（执行器，执行增删改查）、StatementHandler（数据库处理对象，执行 SQL 语句）、ParameterHandler（处理 SQL 参数）、ResultSetHandler（处理返回结果集）。
- 原理：用动态代理包装目标对象达到拦截目的，多个插件按责任链叠加，因此运行期的四大对象都是代理对象；插件接口三个方法：intercept（插件核心方法）、plugin（生成 target 的代理对象）、setProperties（传递插件参数）。

### Dao 接口与 XML 的关联 {#mybatis-dao-xml}

Mapper 接口没有实现类，靠 JDK 动态代理加"全限定名 + 方法名"定位并执行 SQL。

- XML 中每个 SQL 标签被封装成 SqlSource，对应一个 MappedStatement，两个关键属性：id（全限定类名 + 方法名组成的 ID）、sqlSource（当前 SQL 标签对应的 SqlSource 对象）。
- Dao 接口的工作原理是 JDK 动态代理：运行时为接口生成代理对象，代理拦截接口方法，转而执行 MappedStatement 所代表的 SQL 并返回结果；以"接口全限定名 + 方法名"拼接的字符串作为 key，可唯一定位一个 MappedStatement。

### 结果封装的映射形式 {#mybatis-result}

结果映射分 resultMap 手动映射与 resultType 自动映射两类，二者不能同时存在。

1. 使用 resultMap 标签，逐一定义列名和对象属性名之间的映射关系。
2. 使用 SQL 列的别名功能，将列别名写成对象属性名。
3. resultType 直接表示返回类型（自动映射）；resultMap 是对外部 ResultMap 的引用（手动映射）。

### 动态 SQL {#mybatis-dynamic-sql}

动态 SQL 在 XML 映射文件内以标签形式完成逻辑判断与 SQL 动态拼接。

| 标签 | 作用 |
| --- | --- |
| if | 条件满足才拼接对应片段 |
| where | 至少有一个条件符合时才插入 where 语句，并去掉条件前的 and |
| set | 动态包含需要更新的列，舍去其他列 |
| foreach | 遍历集合参数拼接 SQL（如 in 查询） |

- 设计上涉及三种模式：解释器模式（初始化构建抽象语法树，请求处理时按参数对象解释生成 SQL）、工厂模式（SqlTagHandlerFactory 按标签名获取处理方式）、策略模式（标签处理方式抽象为接口，不同标签有相应实现类）。

### 一级缓存与二级缓存 {#mybatis-cache}

一级缓存是 SqlSession 级别，二级缓存是 mapper（namespace）级别、跨 SqlSession 共享。

| 对比项 | 一级缓存 | 二级缓存 |
| --- | --- | --- |
| 级别 | SqlSession 级别 | mapper 级别（按 namespace 划分） |
| 共享范围 | 仅同一 SqlSession 可见，不同 SqlSession 互不影响 | 多个 SqlSession 操作同一 Mapper 时共享 |
| 失效与开启 | 执行 commit（增删改）时清空，避免脏读 | 需在 settings 中开启 cacheEnabled=true |
| 现实意义 | Spring 整合下每次查询的 SqlSession 不同且查询后即关闭，无事务时一级缓存意义不大 | 弥补一级缓存在 Spring 整合场景下的不足 |

### 接口绑定的实现方式 {#mybatis-binding}

接口绑定有注解绑定与 XML 绑定两种，按 SQL 复杂度选择。

1. 注解绑定：在接口方法上加 @Select、@Update 等注解写 SQL，SQL 比较简单时推荐。
2. XML 绑定：XML 映射文件的 namespace 必须为接口的全路径名，SQL 比较复杂时推荐。

### 与 Hibernate 的区别 {#mybatis-hibernate}

MyBatis 不完全算 ORM 框架：SQL 自己写、灵活可控但数据库无关性差；Hibernate 映射能力强、数据库无关性好。

| 对比项 | MyBatis | Hibernate |
| --- | --- | --- |
| 定位 | 不完全的 ORM 框架，程序员自己编写 SQL | 对象/关系映射能力强 |
| SQL 与性能 | 原生 SQL，严格控制执行性能，灵活度高 | 框架生成 SQL |
| 数据库无关性 | 差，支持多种数据库需自定义多套映射文件，工作量大 | 好 |
| 适用场景 | 关系数据模型要求不高、需求变化频繁、要求快速产出 | 关系模型要求高的软件，可节省大量代码、提高效率 |

### 初始化过程 {#mybatis-init}

初始化就是把配置文件、映射文件与接口注解解析进 Configuration 对象，并创建 SqlSessionFactory。

- 总体流程：加载 mybatis-config.xml、Mapper.xml 及 Mapper 接口注解信息，解析后的配置形成对象并全部保存到 Configuration 对象，再创建 DefaultSqlSessionFactory，供执行时创建 SqlSession 供用户操作。
- 三个部分：解析 mybatis-config.xml（SqlSessionFactoryBuilder → XMLConfigBuilder → Configuration）；解析 Mapper.xml（XMLMapperBuilder::parse() → XMLStatementBuilder::parseStatementNode() → XMLLanguageDriver → SqlSource → MappedStatement）；解析 Mapper 接口注解（MapperRegistry → MapperAnnotationBuilder::parse()）。

### 延迟加载 {#mybatis-lazy}

延迟加载（懒加载）推迟对关联对象的 select 查询，前提是关联查询必须是独立 select 而非多表连接。

- 定义：表关联查询时按延迟规则推迟对关联对象的 select，如一对多查询先查一方，程序需要多方数据时再发 SQL，减少数据库压力；主加载对象始终直接执行查询。
- 三种加载时机：直接加载（主加载对象的 select 执行完，马上执行关联对象的 select）；侵入式延迟（访问主加载对象的详情属性时才执行关联查询）；深度延迟（只有真正访问关联对象的详情时才执行）。

## Spring Boot {#springboot}

### Starter 的作用 {#springboot-starter}

Starter 是预配置模块，用于简化和加速项目的配置与依赖管理。

- 封装特定功能的依赖项和配置，开发者引入 Starter 依赖即可，无需手动配置大量参数。
- 管理相关功能的依赖（含其他 Starter 和第三方库），确保协同工作、避免版本冲突；每个 Starter 关注一个特定功能领域（数据库访问、消息队列、Web 开发等），支撑模块化开发。
- 支持自定义 Starter，在项目中共享和复用特定功能的配置与依赖。

### 常用注解 {#springboot-annotations}

高频考点是 @SpringBootApplication 的组合三件套与各分层注解的职责。

| 注解 | 作用 |
| --- | --- |
| @SpringBootApplication | 标识主应用类，包含 @Configuration、@EnableAutoConfiguration、@ComponentScan |
| @Controller / @RestController | 标识 Spring MVC Controller；@RestController 组合 @Controller + @ResponseBody，面向 RESTful 服务 |
| @RequestMapping | 将 HTTP 请求映射到处理方法，可用于类和方法级别 |
| @Autowired / @Qualifier | 自动注入容器中的 Bean（可用于构造方法、字段、Setter）；@Qualifier 配合指定注入的 Bean 名称 |
| @Service / @Repository / @Component | 分别标识服务层、数据访问层、通用托管组件 |
| @Configuration | 定义配置类，类中用 @Bean 定义 Bean |
| @EnableAutoConfiguration | 启用自动配置机制，按项目依赖和配置自动装配 |
| @Value / @ConfigurationProperties | 读取配置：@Value 单值注入成员变量；@ConfigurationProperties 将配置属性批量映射到 Java Bean |
| @Profile | 定义不同环境下的配置，可标识在类或方法上 |
| @Async | 将方法标记为异步执行 |

### 启动流程 {#springboot-startup}

（原 PDF 此处为图示，以下为通用流程要点归纳。）

1. 执行 SpringApplication.run()：创建 SpringApplication 实例，推断应用类型，从 spring.factories 加载 ApplicationContextInitializer 与 ApplicationListener。
2. 准备环境：装配外部化配置（application.properties/yml 等），生成 Environment。
3. 创建并配置 ApplicationContext：按应用类型创建 IOC 容器并准备 BeanFactory。
4. refreshContext 刷新容器：完成 Bean 实例化与依赖注入，自动装配在这一阶段生效。
5. 容器就绪后执行 callRunners()：回调容器中所有 ApplicationRunner / CommandLineRunner。
6. 发布就绪事件，应用启动完成。

### 自动装配过程 {#springboot-autoconfig}

自动装配由 @EnableAutoConfiguration 开启，按 @Conditional 条件加载 spring.factories 中注册的自动配置类。

- 引入 Starter 后，Spring Boot 启动时自动加载相关依赖、配置初始化参数，以最快捷简单的方式集成第三方软件。
- 过程：@EnableAutoConfiguration 开启自动配置 → 加载 spring.factories 中注册的各种 AutoConfiguration 类 → 满足 @Conditional 指定的生效条件（Starter 提供的依赖、配置或 Spring 容器中是否存在某个 Bean 等）时 → 实例化该类中定义的 Bean 并注入 Spring 容器，完成依赖框架的自动配置。

### 启动时初始化数据 {#springboot-runner}

实现 ApplicationRunner 或 CommandLineRunner 接口，是启动时初始化数据的两种标准方式。

- 默认情况下 ApplicationRunner 比 CommandLineRunner 先执行。
- 执行时点：ApplicationContext 完全初始化开始工作之后，是 run() 方法内部最后调用的 callRunners()，可认为是 main 方法执行完成前的最后一步。
- 容器中所有 Runner（手动注册或自动扫描进 IOC 容器）都会被执行；@Order 注解可设置加载顺序；一般使用一个接口加载初始化数据即可。

## RPC 框架 {#rpc}

### Dubbo 的工作流程 {#rpc-dubbo-flow}

一次 RPC 调用由客户端存根与服务端存根配合完成序列化、网络传输与本地调用。

1. 服务消费者（client）以调用本地服务的方式调用需要消费的服务。
2. 客户端存根（client stub）将方法、入参等信息序列化（组装）成可网络传输的消息体。
3. 客户端存根找到远程服务地址，将消息通过网络发送给服务端。
4. 服务端存根（server stub）收到消息后解码（反序列化）。
5. 服务端存根根据解码结果调用本地服务，本地服务执行业务逻辑并返回结果。
6. 服务端存根将返回结果重新序列化打包，经网络发送回消费方。
7. 客户端存根接收消息并解码（反序列化），服务消费方得到最终结果。

### Dubbo 支持的协议 {#rpc-dubbo-protocol}

不同协议在连接方式、传输协议与序列化上各有取舍，按数据量与调用方规模选择。

| 协议 | 特点 | 适用场景与注意点 |
| --- | --- | --- |
| dubbo | 单一长连接和 NIO 异步通讯，TCP 传输，Hessian 序列化 | 大并发小数据量的服务调用，消费者远大于提供者 |
| rmi | JDK 标准 rmi 实现，java 标准序列化，阻塞式短连接，TCP | 参数和返回对象需实现 Serializable；数据包大小混合、消费者与提供者个数差不多、可传文件；依赖低版本 Common-Collections 时 java 序列化存在安全漏洞 |
| webservice | 集成 CXF 实现，多个短连接，基于 HTTP 传输，同步 | 系统集成和跨语言调用，提供与原生 WebService 的互操作 |
| http | 基于 Http 表单提交，Spring 的 HttpInvoke 实现，多个短连接 | 传入参数大小混合，提供者多于消费者，供应用程序和浏览器 JS 调用 |
| hessian | 集成 Hessian 服务，HTTP 通讯，Servlet 暴露服务（Dubbo 内嵌 Jetty 时默认），多个短连接，同步，Hessian 序列化 | 传入参数较大，提供者大于消费者、压力较大，可传文件 |
| memcache | 基于 memcached 实现的 RPC 协议 | 特定缓存场景 |
| redis | 基于 redis 实现的 RPC 协议 | 特定缓存场景 |

### RPC 的关键技术 {#rpc-key-tech}

RPC 框架的四大关键技术：动态代理、序列化、NIO 通信与服务注册中心。

1. 动态代理：生成 client stub 和 server stub 需要 Java 动态代理技术，可用 JDK 原生动态代理，也可用 CGLib、Javassist 字节码生成技术。
2. 序列化与反序列化：网络中所有数据都转为字节传送；序列化即对象转字节序列（编码），反序列化即字节序列恢复为对象（解码）；高效的开源框架有 Kryo、FastJson、Protobuf。
3. NIO 通信：出于并发性能考虑，传统阻塞式 IO 不合适；Java 提供 NIO，Java 7 提供更优的 NIO.2，可选 Netty 或 MINA 解决 NIO 数据传输问题。
4. 服务注册中心：可选 Redis、ZooKeeper、Consul、Etcd；一般用 ZooKeeper 提供服务注册与发现，解决单点故障以及分布式部署问题。

## 分布式存储 {#diststore}

### Redis 单线程为何能支持高并发 {#diststore-redis}

"单线程"仅指网络请求模块的文件事件处理器，高并发靠纯内存操作与 IO 多路复用实现。

- 官方解释：Redis 基于内存操作，CPU 不是 Redis 的瓶颈，瓶颈最有可能是机器内存大小或网络带宽；既然单线程容易实现且 CPU 不会成为瓶颈，就采用单线程方案。
- Redis 内部使用文件事件处理器（file event handler），它才是单线程的；采用 IO 多路复用机制同时监听多个 Socket，根据 Socket 上的事件类型选择对应的事件处理器处理。
- 高性能要点：
  1. 单线程模型保证每个操作的原子性，避免不必要的上下文切换和竞争条件，不用考虑加锁释放锁与死锁的性能消耗。
  2. 灵活多样的数据结构：内部用 redisObject 表示所有 key 和 value（数据类型、编码方式、数据指针等），String、Hash、List、Set、Sorted Set 五种类型按场景选用，减少内存使用并节省网络流量。
  3. 纯内存数据库，多为简单存取操作，时间花费主要集中在 IO 上，读取速度快。
  4. 非阻塞 IO 多路复用：单线程轮询描述符，把数据库的开、关、读、写都转换为事件，减少线程切换时的上下文切换和竞争。

### 缓存穿透、雪崩与击穿 {#diststore-cache}

三者都是请求落到数据库的问题，区别在失效范围：雪崩是大面积失效、穿透是查不存在的 key、击穿是单个热点 key 过期瞬间。

| 问题 | 定义 | 解决方案 |
| --- | --- | --- |
| 缓存雪崩 | 高并发下大量缓存 key 在同一时间失效，大量请求落到数据库 | 过期时间设置随机；分布式部署时将热点数据均匀分布在不同缓存库；热点数据永不过期 |
| 缓存穿透 | 访问一个不存在的 key，缓存不起作用，请求穿透到 DB，流量大时 DB 挂掉 | 接口层校验（鉴权、id <= 0 直接拦截）；缓存取不到且数据库也没有时写入 key-null，过期时间设短（如 30 秒），防止同一 id 反复暴力攻击 |
| 缓存击穿 | 一个存在的 key 在过期瞬间有大量请求，瞬时 DB 请求量骤增、压力变大 | 热点数据永不过期；加互斥锁：缓存失效时先用 SETNX 抢 mutex key，成功者回源加载并回设缓存，失败者重试 |

互斥锁示例（抢到锁才回源查库）：

```java
String value = redis.get(key);
if (value == null) {                            // 缓存值过期
  if (redis.setnx(key_mutex, 1, 3 * 60) == 1) { // 抢互斥锁，3 分钟防死锁
    value = db.get(key);                        // 加载数据库
    redis.set(key, value, expire_secs);         // 回设缓存
    redis.del(key_mutex);
  } else {                                      // 其他线程已回设缓存
    sleep(50);
    return get(key);                            // 重试
  }
}
return value;
```

## 消息中间件 {#mq}

### 消息积压及处理 {#mq-backlog}

积压的处理思路是临时扩容加速消费，必要时引流分流。

- 临时扩容，以更快的速度去消费数据。
- 增加多个消费者，加速消费。
- 新建 topic 引流，将消息引导到别的程序中处理（类似泄洪）。

### 如何保证消息不丢失 {#mq-no-loss}

从生产者、MQ 自身、消费者三个环节分别兜底，即可保证消息全程不丢。

**生产者丢失消息**
- 事务机制：发送前开启事务，消息没有被 RabbitMQ 成功接收则收到异常报错，回滚事务后重试重发，收到消息则提交事务；缺点是事务开启后变为同步阻塞操作，太耗性能，吞吐量下降。
- confirm 模式：开启后每条消息分配唯一 id，写入 RabbitMQ 后回传 ack 告知发送成功；RabbitMQ 未能处理则回调 nack，可进行重试，也可在内存维护每个消息的 id，超过一定时间没收到回调就重发。事务是同步的（提交后阻塞等待），confirm 是异步的（发送后可继续发送下一条），生产者侧一般用 confirm 机制。

**RabbitMQ 自身弄丢数据**
- 设置消息持久化到磁盘，两个步骤必须同时开启：创建 queue 时设置为持久化，保证 RabbitMQ 持久化 queue 的元数据（不会持久化 queue 里的数据）；发送消息时将 deliveryMode 设置为 2，消息才会被持久化到磁盘。
- 持久化可与 confirm 机制配合：只有消息持久化到磁盘之后才通知生产者 ack；若持久化之前 RabbitMQ 挂了导致数据丢失，生产者收不到 ack 也会重发。

**消费者弄丢数据**
- 使用 RabbitMQ 提供的 ack 机制：关闭自动 ack，确保处理完消息之后在代码里手动调用 ack，避免消息还没处理完就被确认。

### 如何保证顺序性 {#mq-order}

顺序错乱源于多消费者并发或单消费者内部多线程，方案是让同一数据的消息串行消费。

**为什么要保证顺序**
- 对同一数据的若干操作具有前后关系，必须按前后顺序执行，否则造成数据异常。例如通过 mysql binlog 同步两个数据库：插入 → 更新 → 删除 的顺序若变成 删除 → 插入 → 更新，原本应该被删除的数据没有被删除，造成数据不一致。

**出现顺序错乱的场景**
1. 一个 queue 对多个 consumer：从 MQ 里读取数据有序，但每个 consumer 的执行时间不固定，无法保证先读到消息的一定先完成操作。
2. 一个 queue 对一个 consumer，但 consumer 内部进行了多线程消费。

**保证消息消费顺序的方案**
1. 拆分多个 queue，每个 queue 一个 consumer（确实麻烦些，且吞吐量下降，可在消费者内部采用多线程消费弥补）。
2. 一个 queue 对应一个 consumer，consumer 内部用内存队列做排队，再分发给底层不同的 worker 处理。

## 微服务 {#micro}

### 服务熔断与服务降级 {#micro-fuse}

熔断与降级是防止服务雪崩的两种手段：熔断截断调用，降级返回兜底值。

- 背景：微服务之间相互调用，高并发场景下服务的阻塞意味着线程的阻塞，服务器线程全部阻塞导致崩溃；调用关系是同步的，会对整个微服务系统造成服务雪崩。
- 服务熔断：类似现实世界中的"保险丝"，当某个异常条件被触发就直接熔断整个服务，而不是一直等到此服务超时；一旦发生雪崩就熔断整个服务，通过维护一个自己的线程池，当线程达到阈值时就启动服务降级，其他请求继续访问则直接返回 fallback 的默认值。

### Eureka 与 ZooKeeper 的区别 {#micro-eureka-zk}

核心区别在 CAP 取向：ZooKeeper 保证 CP，Eureka 保证 AP。

| 对比项 | ZooKeeper | Eureka |
| --- | --- | --- |
| CAP 取向 | CP | AP |
| 节点角色 | 有 Leader 和 Follower | 各节点平等 |
| 可用性 | 选举期间注册服务瘫痪，虽然最终会恢复，但选举期间不可用 | 只要有一台 Eureka 就能保证服务可用，而查询到的数据并不是最新的 |
| 分区问题处理 | 过半数存活原则 | 自我保护机制 |
| 一致性 | — | 最终一致性：网络稳定后，当前实例新的注册信息会同步到其他节点 |
| 形态 | 本质上是一个进程 | 本质上是一个工程 |

- Eureka 的自我保护机制：不再从注册列表移除因长时间没收到心跳而应该过期的服务；期间仍能接受新服务的注册和查询请求（不会被同步到其他节点，高可用），因此能很好应对因网络故障导致部分节点失去联系的情况，而不会像 ZooKeeper 一样使得整个注册系统瘫痪。

### 负载均衡策略 {#micro-lb}

负载均衡既保证宕机时服务继续可用，也让机器使用更均衡。

- 好处：集群里一台或多台服务器宕机时，剩余服务器可保证服务继续使用；更多机器保证良性使用，不会因某一高峰时刻导致系统 CPU 急剧上升。
- 常见策略：随机（Random）；轮询（RoundRobin）；哈希（Hash，ip 信息 % 机器数量）；一致性哈希（ConsistentHash，服务器 ip 信息 % (2^32 - 1) 的结果落在哈希环上，顺时针取最近的节点）。

### Ribbon 内置的负载均衡策略 {#micro-ribbon}

（原 PDF 此处为图示，以下为 Ribbon 内置策略要点。）

- RoundRobinRule（轮询）与 RandomRule（随机）：最基础的两类策略。
- AvailabilityFilteringRule：先过滤掉故障与并发超限的实例，再轮询。
- WeightedResponseTimeRule：按响应时间加权，响应越快权重越大；BestAvailableRule：跳过故障实例，选择并发量最小的。
- RetryRule：先按轮询获取实例，失败则在时限内重试；ZoneAvoidanceRule：复合判断 Zone 性能与可用性。

## 源码学习 {#src}

### LinkedList {#src-linkedlist}

LinkedList 是实现 List 与 Deque 接口的双向链表，插删高效但随机访问慢。

- 底层数据结构是链表，拥有队列（普通队列、双端队列）的特性，可在其基础上实现栈、队列等数据结构；具有 fail-fast 机制。
- 未实现 RandomAccess，以下标访问元素，随机访问不及 ArrayList；双向链表按下标查找可选择从头部或尾部较近一侧，更精确地说是 O(n/2)，源码中绝大多数 CRUD 的 API 都是先按下标找到节点再进行后续操作。
- 默认尾部插入，也可明确指定头部插入、中间插入，remove 同理——多种插删形式正是为了支撑栈、队列等数据结构的实现。

### CopyOnWriteArrayList {#src-cow}

CopyOnWriteArrayList 是 ArrayList 的线程安全版本，写时复制实现读写分离，只保证最终一致性。

- 机制：每次对数组的修改都完全拷贝一份新数组来修改，修改后替换原来的老数组，只阻塞写操作、不阻塞读操作；无法保证实时一致性，只保证最终一致性，适用于实时性要求不高、读多写少的场景（如黑白名单）。
- 实现细节：每次修改先加锁（ReentrantLock，独占的不公平锁），然后 copy 一份新数组在其上修改；整个数组用 volatile 修饰保证可见性，结合锁确保单个 API 操作的线程安全；内部无 size 属性，直接通过当前数组大小得到元素个数；写时会复制近乎等大的数组，需要考虑内存空间与业务场景。
- 相似思想：操作系统 fork 的写时复制——父子进程先共享同一副本，只有写入时数据才被复制，物理内存页的复制被推迟到写入时（fork 后直接 exec 时共享副本甚至不会被写）；fork 的实际开销变为复制父进程的页表和给子进程创建 PCB。

### TreeMap {#src-treemap}

TreeMap 底层是红黑树，log(n) 完成增删改查并维持 key 有序。

- containsKey、get、put、remove 均可在 log(n) 时间复杂度内完成；红黑树结构保证内部元素有序（支持有序性的集合还有 LinkedHashMap）。
- 红黑树相比 AVL 树牺牲部分平衡性，换取删除/插入操作时少量的旋转次数，整体性能优于 AVL 树；AVL 树为维护严苛的平衡条件，失衡后需旋转，共四种：左单旋、右单旋、先左后右旋、先右后左旋。
- 使用树的链式存储结构，无扩容概念；支持范围查找、查找最近的元素；内部按 key 排序，不支持 key 为 null。
- 排序依据：存放对象实现 Comparable 则按其 compareTo，否则需自定义外部比较器 Comparator，两者都没有则报错。
- 相关练习（LeetCode）：285 二叉搜索树中的中序后继、108 将有序数组转换为二叉搜索树、110 平衡二叉树、450 删除二叉搜索树中的节点、270 最接近的二叉搜索树值。

### PriorityQueue {#src-priority-queue}

PriorityQueue 底层是用数组实现的堆（默认小根堆），只保证堆顶元素优先级最高/最低。

- 是 0 个或多个元素构成的集合，按某种排序方式（元素自身权重）排序，不保证内部元素整体有序，但每次弹出的元素优先级最高/最低；内部数据结构是堆，堆底层是完全二叉树，使用 Object[] 顺序存储并利用完全二叉树的性质解决父子节点关系。默认实现是小根堆。
- 未指定初始化容量时默认为 11；扩容比其他集合特殊：数组长度 < 64 时扩容为原先的 2 倍 + 2，超过 64 时扩容为原先的 1.5 倍，同时做防溢出处理，支持最大 Integer.MAX_VALUE 个元素。
- 插入和删除操作均会破坏堆结构，需调用 siftUp、siftDown 动态调整：插入堆末尾后 siftUp 自底向上调整；弹出堆顶元素后将最后一个元素置于堆顶，siftDown 自顶向下调整。同样具有 fail-fast 机制。
- 应用：频率统计（结合 map）、TopK 问题（海量数据处理）、子序列 DP 中优化暴力搜索。

### HashMap {#src-hashmap}

HashMap 基于 Hash 表 + 拉链法，JDK 1.8 引入红黑树、尾插法并优化扩容迁移。

- 宏观：基于 Hash 表实现，hash 冲突用拉链法解决。JDK 1.8 的三处优化：引入红黑树，避免大量冲突导致某个位置链表过长、查询效率变低；链表插入从头插法改为尾插法，保证插入顺序的同时避免并发操作下的异常；优化扩容后的 rehash 过程。
- 内部用 Node 数组表示 Hash 表，数组长度为 2 的幂，主要为通过位运算获取 key 的索引位置，提升计算效率；链表长度 > 8 时树化为红黑树，大前提是 Node 数组容量 > 64，树节点数量小于 6 时又变回链表。
- 扩容默认为原数组长度的 2 倍；初始化未指定容量时直接从 0 扩容为 16，指定容量则取大于指定容量的最小 2 的幂；内部没有 capacity 变量，数组容量在扩容时确定。
- 1.8 之前扩容后对所有元素 rehash 再映射；1.8 巧用"容量扩为 2 倍后，元素位置要么在原位置，要么在原位置再移动 2 次幂的位置"的特点，将 key 的 hash 与 oldCap 相与：为 0 则保持原位，为 1 则放入原位置 + oldCap，免去 rehash。
- 默认负载因子 0.75（与 Redis 相同；ThreadLocal 的取黄金分割点）；对 key 取 hash 采用高低位异或，hash 分布离散性更好。
- 对比：Redis 的 rehash 与 HashMap 1.8 之前的实现很像，但是渐进式的；内部有新旧两个 hash 表，删除、查找、更新操作会同时操作两个表，新增只操作新表。
- 应用：dfs、递归中的缓存操作防止超时；查找、频率统计和查重（需明确 key 和 value 的含义）；映射关系（如判断给定字符是否属于 ABA 格式）。

## 编译与执行 {#compile}

### 执行引擎概述与工作流程 {#compile-engine}

执行引擎负责把字节码解释或编译为对应平台的本地机器指令，是 JVM 的核心组成部分。

- JVM 包含两个子系统和两个组件：类加载子系统（负责将字节码文件装载内存成为对象）、执行引擎（包含解释器、JIT 编译器、垃圾收集器 GC）；两个组件是运行时数据区和本地接口。
- 物理机的执行引擎直接建立在处理器、缓存、指令集和操作系统层面；虚拟机的执行引擎由软件自行实现，因此可不受物理条件制约地定制指令集与执行引擎的结构体系。
- 为什么需要执行引擎与工作流程：字节码不能直接运行在操作系统上（仅包含能被 JVM 识别的字节码指令、符号表等辅助信息），需要执行引擎解释/编译为本机机器指令。执行什么指令依赖于程序计数器（PC 寄存器）中的地址，按地址找到指令，执行完一条后程序计数器更新下一条指令地址；方法执行过程中，还可能根据虚拟机栈局部变量表中存储的对象引用找到堆中对应的对象实例信息，或通过对象头中的元数据指针定位目标对象的类型信息。

### 指令集：机器码、指令、汇编与字节码 {#compile-instruction-set}

从机器码到字节码，是一路为"可读性"与"跨平台"做的抽象。

| 概念 | 说明 |
| --- | --- |
| 机器码 | 各种用二进制编码方式表示的指令，CPU 可以直接读取并运行，速度最快但可读性差 |
| 指令 | 为方便记忆，将机器码的 0/1 序列简化表示为指令；机器指令与 CPU 紧密相关，不同硬件平台同一指令（如 mov）对应的机器码可能不同 |
| 指令集 | 每个平台所支持的指令集合，如 x86 架构支持 x86 指令集、ARM 架构支持 ARM 指令集 |
| 汇编 | 用助记符代替机器指令操作码、地址符号或标号代替地址；不同硬件平台对应不同机器指令集，须翻译成机器指令码计算机才能执行 |
| 字节码 | 一种中间状态的二进制代码，比机器码更抽象，需转译后才能转为机器码；为跨平台而生——编译器将源码编译为字节码，特定平台上的虚拟机将其转译为自己能识别并执行的指令 |

### Java 代码执行与编译 {#compile-exec}

javac 是前端编译器，只负责到字节码为止；解释与 JIT 编译都发生在 JVM 内部。

- 大部分程序代码在转换为物理机器能理解的指令集之前：源码 --javac 编译--> 字节码 --解释器/JIT--> 机器指令。javac 处于编译的前期，又称前端编译器，将 Java 源文件编译成线性的字节码指令；该过程与 JVM 无关——对 JVM 来说实际输入的是字节码文件而不是 Java 文件。
- JVM 启动时会根据预定义的规范对字节码逐行解释执行，将字节码内容"翻译"为操作系统能理解的指令。
- 为什么说 Java 是半解释半编译型语言：JDK 1.0 时 Java 是解释执行的，后来做了优化，执行引擎执行字节码指令时既可以选择解释器也可以选择编译器，解释执行与编译执行相结合。

### 解释器 {#compile-interpreter}

解释器是运行时的"翻译者"，为跨平台而生，分为字节码解释器与模板解释器。

- 为什么需要字节码做中介而不直接编译为机器指令：设计者的初衷是跨平台，避免采用 C、C++ 那种静态编译直接生成机器指令的方式，于是诞生了运行时逐行解释字节码指令执行程序的思路，解释器真正承担的角色就是运行时"翻译者"。
- 分类：字节码解释器（执行时通过纯软件代码模拟字节码的执行，效率十分低）；模板解释器（将每一条字节码和一个模板函数相关联，模板函数直接产生这条字节码执行时的机器码，能提高性能）。HotSpot 中解释器主要由 Interpreter 模块（实现解释器核心功能）和 Code 模块（管理运行时生成的本地机器指令）组成。
- 现状：解释器设计和实现简单，但基于它的执行已沦为低效的代名词，由此催生即时编译技术——避免函数被解释执行，而是将整个函数体编译为机器码，每次函数执行时只执行编译后的机器码。

### JIT 编译器与热点代码 {#compile-jit}

JIT 与解释器并存协作：启动靠解释器，热点代码靠 JIT；判断热点靠计数器。

- 两种执行方式：解释执行（源程序编译为字节码后，解释器逐行将字节码解释成机器指令并执行）；编译执行（JIT 将字节码编译为机器指令，再由 CPU 执行）。
- 为什么有了 JIT 还要保留解释器：JIT 能提高执行效率，但执行机器指令前需要对字节码进行编译，响应时间较长，而解释器可以直接解释执行；HotSpot 采用二者并存、相互协作的方式，权衡编译本地代码的时间和直接解释执行的时间——启动时解释器先发挥作用，不必等 JIT 全部编译完成，随程序运行时间推移，JIT 根据热点探测将有价值的字节码编译为本地机器码，换取更高的执行效率。
- 三种运行模式：混合模式（解释器与编译器搭配使用）、解释模式（仅解释器工作）、编译模式（优先采用编译器，编译器无法进行时采用解释器）。HotSpot 内置客户端编译器（C1）与服务端编译器（C2），配合分层编译：

| 层级 | 编译器 | 性能监控 | 说明 |
| --- | --- | --- | --- |
| 0 | 解释器 | 无 | 程序纯解释执行 |
| 1 | C1 | 无 | 简单可靠的稳定优化 |
| 2 | C1 | 有限 | 仅开启方法及回边次数统计等有限的监控 |
| 3 | C1 | 全部 | 额外收集分支跳转、虚方法调用版本等全部统计信息 |
| 4 | C2 | — | 启用更多编译耗时更长的优化，还会依监控信息做一些不可靠的激进优化 |

- 启动速度：解释器 > C1 > C2；程序执行效率：4 > 1 > 2 > 3 > 0，第 2、3 层基本是为第 4 层服务，减少第 4 层编译执行的时间。常见路径：热点代码通常先被第 3 层 C1 编译再交给第 4 层 C2；字节码较少、监控数据少时直接交第 1 层 C1；C1 繁忙时在第 0 层解释执行并收集状态数据后直接交第 4 层 C2；C2 繁忙时先经第 2、3 层 C1，最后进第 4 层。
- 热点代码：被多次调用的方法、被多次执行的循环体；运行特别频繁的方法或代码块被认定为热点代码，在运行时编译成本地机器码并以各种手段优化。编译的都是整个方法体（循环体只是方法的一部分，只是执行入口不同）；编译发生在方法执行过程中，因此称为栈上替换（OSR）——方法还在方法栈上，具体执行的指令已被替换。
- 热点探测两种方法：基于采样（周期性检查各线程调用栈顶，经常出现在栈顶的方法即热点；实现简单但精度不行，易受线程阻塞等外界因素影响）；基于计数器（为每个方法建立计数器统计执行次数，超过阈值即热点；结果精确但比较麻烦）。HotSpot 采用基于计数器的方法，两类计数器：方法调用计数器（调用时先判断是否存在编译过的版本，没有则计数 +1 并与阈值比较；可选统计绝对次数或相对次数，相对次数超时未触发编译时计数减半，即热度衰减、半衰周期，默认统计相对次数）；回边计数器（统计方法中循环体代码的执行次数，字节码中控制流向后跳转的指令称为回边；只能记录绝对次数，达到阈值触发栈上替换 OSR，一个方法内可能有多个回边计数器）。
- 代码缓存：热点代码编译后放在虚拟机内存中，以后调用直接从内存读取；代码缓存空间用完时，遇到热点代码也不再即时编译，而是启用解释器执行；缓存占满不会抛 OOM，只是等待下一次 GC 清理出空间；程序较大想保存更多编译后本地代码时，应扩大代码缓存空间。

### 提前编译器及优劣 {#compile-aot}

提前编译把运行时的编译工作前置，省资源但失去运行时信息支撑的优化。

- 两种思路：在程序运行之前把程序代码编译成机器码的静态翻译工作；把原本即时编译器在运行时要做的编译工作提前做好并保存，下次运行到这些代码（如公共库代码被同一台机器其他 Java 进程使用）时直接加载进来使用。目前主流虚拟机均支持。
- 优劣：提前编译的好处是省资源，避免在运行时进行优化、节约运算资源；即时编译相对提前编译的优点是性能分析制导优化、激进预测性优化、链接时优化。

### 编译优化技术与逃逸分析 {#compile-optimize}

方法内联是"优化之母"，逃逸分析为栈上分配、标量替换、同步消除提供依据。

- 方法内联：把目标方法的代码原封不动地"复制"到发起调用的方法之中，避免发生真实的方法调用；是编译器最重要的优化手段，被称为优化之母——除消除方法调用成本外，更重要的是为其他优化手段建立基础，没有内联多数其他优化都无法有效进行。内联需要确定目标方法的具体版本，除编译期间解析的非虚方法和 final 修饰的方法外，其他方法都是虚方法，需要类型继承关系分析（CHA）确定某个接口是否有多于一种实现、某个类是否存在子类、某个子类是否覆盖父类虚方法等信息。
- 守护内联：内联非虚方法必然安全；虚方法经 CHA 查询当前只有一个目标版本时，可假设"应用程序的全貌就是现在运行的这个样子"进行内联；若后期加载了导致继承关系变化的新类，必须抛弃已编译的代码，退回解释状态执行或重新编译。
- 内联缓存：CHA 查出确实有多个目标版本时采用；第一次调用方法时记录方法接收者的版本信息，随后每次调用先比较接收者版本，一致则通过缓存调用（单态内联缓存，只比普通内联调用多一次比较，速度仍很快）；不一致则退化为超多态内联缓存，速度相当于真正查找虚方法表进行方法分派。
- 逃逸分析：分析对象的动态作用域。方法里定义的对象可能被外部方法引用（如作为调用参数传递到其他方法），称为方法逃逸；甚至可能被外部线程访问（如赋值给其他线程可访问的实例变量），称为线程逃逸；逃逸程度由低到高：从不逃逸、方法逃逸、线程逃逸。逃逸分析与 CHA 一样不是直接优化代码的手段，而是为其他优化措施提供依据的分析技术。对象不会逃逸出方法和线程、或逃逸程度低时，可实现不同程度的优化：
  1. 栈上分配：对象在栈上分配内存，所占空间随栈帧出栈而销毁，避免在堆上创建浪费 GC 资源；可支持方法逃逸，但不能支持线程逃逸。
  2. 标量替换：无法再分解成更小数据（int、char、long）的称为标量，可以继续分解的（Java 对象）称为聚合量；把对象拆散、根据程序访问情况将用到的成员变量恢复为原始类型来访问，程序真正执行时可能不去创建这个对象；标量替换不允许对象逃逸出方法。
  3. 同步消除：对象不会逃逸出线程时，不必做线程间同步，对这个变量实施的同步措施可以安全地消除。
- 公共子表达式消除：表达式 E 之前已被计算过，且从先前的计算到现在 E 中所有变量的值都没有发生变化，E 的这次出现就无需重新计算，直接用之前的计算结果。
- 数组边界检查消除：Java 访问数组元素会自动进行上下界范围检查，对拥有大量数组访问的代码是性能负担；若编译器通过数据流分析判定循环变量的取值范围永远在区间 [0, length) 之内，就可以把循环中整个数组的上下界检查消除，节省大量条件判断。

## 并发进阶 {#concurrent}

### Synchronized {#concurrent-sync}

synchronized 是 Java 的隐式（内置）锁，依赖对象头的 Mark Word 与监视器实现原子性、可见性、有序性，JDK 1.6 后引入锁升级优化性能。

- 作用：Java 的锁分隐式锁与显式锁，隐式锁由 synchronized 关键字实现，显式锁由实现了 Lock 接口和 AQS 框架等的类实现；synchronized 通过内置锁实现对共享变量的同步操作，解决原子性、保证可见性与有序性，确保并发情况下的线程安全。
- 可重入：同一个线程重复请求自身已经获取的锁时，不会出现死锁问题。
- 三种基础用法（锁的对象不同）：普通同步方法，锁是当前实例对象；静态同步方法，锁是当前类的 Class 对象；同步代码块，锁是 synchronized 括号里配置的对象。
- 内置锁：每个对象都有一把锁，放置于对象头中，用于记录当前对象被哪个线程所持有；对象在堆中的分布是对象头、实例数据、对齐填充，对象头属于额外开销，被设计得极小，其中的 Mark Word 是非结构化的，不同锁状态下能复用相同的 bit 位。
- 实现：synchronized 编译之后使用 monitorenter 和 monitorexit 两个字节码指令（同步代码块），二者实质上依赖操作系统中的 mutex lock（互斥锁）实现；互斥锁需要 CPU 参与线程的唤醒与切换（记录线程私有数据、寄存器等），开销可能远大于线程自身执行的时间，所以 JDK 1.6 开始引入无锁、偏向锁、轻量级锁、重量级锁的锁优化过程。
- 锁的分类：乐观锁对数据冲突持乐观态度，认为不会有其他线程同时修改数据，因此不上锁，只在更新数据时判断是否有其他线程更新，没有则更新、有则放弃并重新读取处理；悲观锁持悲观态度，认为总会发生冲突，以预防的态度先行锁住数据，直到操作完成才释放。其他划分维度还有共享锁与排他锁、可重入锁与不可重入锁等。
- 对象头：数组类型对象头占 12 字节（Mark Word + 类型指针 + 数组长度），非数组类型对象头占 8 字节（Mark Word + 类型指针）；Mark Word 默认存储对象的 HashCode、分代年龄、是否偏向锁以及锁标记位。
- 32 位 JVM 下，Mark Word 的最后 3 位即可判断锁状态：无锁 01（偏向位 0）、偏向锁 01（偏向位 1）、轻量级锁 00、重量级锁 10、GC 标记 11。锁可以升级但不能降级（如偏向锁升级成轻量级锁后不能降级成偏向锁），这种策略的目的是提高获得锁和释放锁的效率。

四种锁状态总体对比：

| 锁状态 | 核心机制 | 适用场景 |
| --- | --- | --- |
| 无锁 | 无同步动作，分可偏与不可偏 | 无竞争 |
| 偏向锁 | 对象头记录线程 ID，首次 CAS 后只做比对 | 单一线程重复获得锁 |
| 轻量级锁 | 栈帧 Lock Record + CAS（可自旋） | 多线程交替访问、竞争不激烈 |
| 重量级锁 | ObjectMonitor + 操作系统互斥量 | 竞争激烈 |

#### 无锁

- 001 状态为无锁不可偏，101 状态为无锁可偏（又称匿名偏向，线程 ID 部分全 0，是偏向锁的起点）；无锁不可偏状态下遇到同步会直接升级为轻量级锁，不会变为偏向锁，只有在可偏状态下才可能变成偏向锁。
- JDK 8 默认启动了偏向锁，但在 JVM 启动几秒（默认 4 秒，可设置更改）之后才会启用：JVM 内部代码大量使用 synchronized 且存在激烈线程竞争，若采用锁升级策略会浪费很多时间，索性先执行完这些库类再开启偏向锁（4 秒是经验值）。

#### 偏向锁

- 场景与结构：大多数情况下锁不仅不存在多线程竞争，而且总是由同一线程多次获得，为了让线程获得锁的代价更低而引入偏向锁，锁永远偏向获得它的线程，没有其他线程竞争时无需同步；偏向状态下对象头不再存放 Hash 值，该位置改存线程 ID（23 bit）+ Epoch（2 bit，判断线程 ID 是否过时的时间戳）。
- 获取流程：只有 Mark Word 最后三位是 101（可偏）才走偏向逻辑，否则直接走其他锁；匿名偏向状态线程 ID 为 0，用 CAS 写入当前线程，成功即获得锁；线程 ID 与当前线程一致则直接进入；不一致则尝试 CAS 替换，成功获得锁，失败说明存在竞争。
- 撤销与重偏向：存在竞争时需等待安全点（STW，暂停所有线程，GC Roots 的确定也在此刻）进行偏向锁撤销——检测持有偏向锁的线程是否存活，存活则升级轻量级锁；线程未存活或已退出同步代码块，则结合 Epoch 判断：进入全局安全点后将 Class 的 Epoch 增加 1 得到新值，扫描所有持有该类实例的线程，仍锁住该对象的更新为新 Epoch；对象的 Epoch 与类相同则不能重偏向，不同则可重偏向到其他线程。
- 释放：线程不会主动释放偏向锁，即使执行完同步代码块也不修改对象头，锁依旧保持偏向；只有其他线程竞争时才做撤销与重偏向处理。
- 批量机制（以 class 而非对象为单位维护撤销计数器）：BiasedLockingBulkRebiasThreshold 批量重偏向阈值默认 20 次；BiasedLockingBulkRevokeThreshold 批量撤销阈值默认 40 次；BiasedLockingDecayTime 重置计数的延迟默认 25000 毫秒（25 秒）。距上次批量重偏向 25 秒内撤销计数达到 40 就发生批量撤销（该类新建对象不再可偏向），超过 25 秒则重置 [20, 40) 内的计数。
- 优缺点：单一线程访问时几乎没有影响，只有第一次需要 CAS，随后只需比较线程 ID，快速；缺点是多线程访问出现竞争时，需要等到安全点并进行一系列分析，比较耗时，且对象头存放线程 ID 和 Epoch 后不存在 Hash 值，程序需要 Hash 值而调用 hashCode() 会导致偏向锁退出，调用 Object 的 wait 等方法会启用对象的 monitor 内置锁，直接由偏向锁进入重量级锁。

#### 轻量级锁

- 初衷：相对于使用操作系统互斥量实现的传统锁（即"重量级"锁）而言，在没有多线程竞争的前提下减少传统重量级锁使用操作系统互斥量产生的性能消耗，并不是用来代替重量级锁的。
- 获取：虚拟机先在当前线程的栈帧中建立锁记录 Lock Record（displaced mark word 存储锁对象目前 Mark Word 的拷贝 + owner 指向锁对象的指针），先将对象的 Mark Word 拷贝到 Lock Record；再用 CAS 尝试把对象的 Mark Word 更新为指向 Lock Record 的指针（前 30 bit 均用来存放指针，仅留最后两位锁标志），成功则拥有锁、锁标志位变为 00；失败则判断对象 Mark Word 中存储的指针是否指向自己（重入），是则执行同步代码，否则说明其他线程抢占、出现激烈竞争，升级为重量级锁。
- 释放：用 CAS 将 Lock Record 中的 displaced mark word 替换回对象头；成功表示没有竞争、锁成功释放；失败则自旋重试，自旋之后仍未获得锁则升级为重量级锁。竞争线程自身会被挂起，因此 CAS 替换失败时，原本持有锁的线程除释放锁外还需唤醒被挂起的线程。
- 重入：每一次重入都会在栈中生成一个 Lock Record；只有第一次会拷贝 Mark Word，随后的加锁 displaced mark word 区域为 NULL、owner 统一指向对象头；Lock Record 的个数即加锁次数，只有解锁次数等于加锁次数才真正释放锁；释放时重入锁直接删掉一个 Lock Record，非重入才用 CAS 替换对象的 Mark Word。
- 自旋：出现竞争后 CPU 空转（线程不挂起），过一段时间再去加锁，避免升级重量级锁带来的内核态和用户态切换开销——若同步代码块执行时间还不如上下文切换花的时间多，直接升级反而得不偿失。以前的默认自旋次数是 10 次，超过说明竞争激烈需要升级重量级锁；JDK 1.6 以后加入自适应自旋：某锁对象自旋等待刚刚成功获得过锁且持有锁的线程正在运行，则允许自旋持续相对更长时间；自旋很少成功过，则以后尝试获取这个锁时可能省略自旋直接阻塞。JVM 还会根据 CPU 负载、Owner 变化、节电模式等动态裁决自旋时长。
- 优缺点：适合多个线程不同时（交替）访问同步对象的场景——偏向锁的撤销必须在安全点进行且要做 Epoch 分析，交替访问下偏向锁效率低，轻量级锁直接 CAS 替换即可，自旋也是为此设计；竞争激烈的场景不适用，自旋是浪费 CPU 资源，其代价比上下文切换还大，因此引入自适应自旋来裁决。

#### 重量级锁

- 实现：重量级锁依赖 ObjectMonitor 实现，而 ObjectMonitor 依赖操作系统底层的 Mutex Lock（互斥锁）。
- ObjectMonitor 的主要组成：Contention List（竞争队列，所有请求锁的线程首先被放在这里）；Entry List（Contention List 中有资格成为候选资源的线程被移入）；Wait Set（调用 wait 方法被阻塞的线程）；OnDeck（任意时刻最多只有一个正在竞争锁资源的线程）；Owner（当前已获取锁资源的线程）；count（计数器，获取锁加 1，释放减 1）。
- 获取流程：
  1. 线程访问同步代码块时，每个线程都被封装成一个 ObjectWaiter 对象进入 monitor。
  2. JVM 每次从竞争队列尾部取出一个数据作为锁竞争候选者（OnDeck）；并发下 ContentionList 会被大量并发线程 CAS 访问，为降低尾部竞争，JVM 会将一部分线程移动到 EntryList 中作为候选竞争线程。
  3. Owner 线程 unlock 时，将 ContentionList 中的部分线程迁移到 EntryList，并指定 EntryList 中的某个线程（一般是最先进去的那个）为 OnDeck。
  4. Owner 并不直接把锁传递给 OnDeck，而是把锁竞争的权利交给 OnDeck，OnDeck 需要重新竞争锁——牺牲一些公平性换取极大的吞吐量提升，JVM 称之为"竞争切换"。
  5. OnDeck 获取到锁资源后变为 Owner；Owner 线程被 wait 方法阻塞则转移到 WaitSet，直到某个时刻通过 notify 或 notifyAll 唤醒，重新进入 EntryList。
- 阻塞与公平性：处于 ContentionList、EntryList、WaitSet 中的线程都处于阻塞状态，该阻塞由操作系统完成（Linux 内核下采用 pthread_mutex_lock 实现）。synchronized 是非公平锁：线程进入 ContentionList 时会先尝试自旋获取锁，获取不到才进入队列，且自旋获取锁的线程还可能直接抢占 OnDeck 线程的锁资源；采用非公平主要考虑性能——下一次获得锁的线程可能还是原来持有锁的线程，避免内核态和用户态的切换。
- 重入与优缺点：线程获取到锁后判断是否重入，重入则 count 计数 +1，释放锁时 count 减 1；重量级锁需要内核态和用户态的切换，代价很大，所以放在锁升级的最后，但只有它能应对竞争激烈的场景，算是 JVM 最后的杀手锏。

### Synchronized 反向理解 {#concurrent-sync-reverse}

从"为什么要有锁升级"倒推：重量级锁是原始形态，其余状态都是针对低竞争场景做的减法。

- 无论何时何地，只要出现两个线程一直争夺同一个锁，必然使用重量级锁（不管原先是无锁、偏向还是轻量级）。
- 竞争少但仍需要加锁：不用重量级的等待阻塞队列，也不做内核态和用户态切换，对象头里直接存线程指针，线程栈帧中放个 Lock Record 方便判断——即轻量级锁。
- 竞争只是短暂出现：切换线程不划算，就自旋多等一会儿（最初限制自旋次数，后来用自适应自旋更灵活地判断）。
- 绝大多数场景连竞争都没有（单个线程访问某个对象）：连 Lock Record 和 CAS 都省掉，直接在对象头写线程 ID，访问时对比一下即可——即偏向锁；锁干脆不主动释放，下次有线程要偏向就把对象头里的线程 ID 改成它的。
- 偏向线程锁了大量对象、其中一部分可以释放、另一部分仍须持有：给个 Epoch 值，进入 STW 时看哪些对象还需要、给它们新的 Epoch，旧的就可以重偏向给其他线程。
- 线程交替访问同一个对象，或线程 A 锁住大量对象后线程 B 也来锁这些对象：这超出偏向锁的设计初衷，引出批量重偏向和批量撤销。
- 竞争的感知是被动的：某线程想加锁却被占有，原先持有锁的线程并不知情；持有轻量级锁的线程释放时才发现锁已变重量级、一堆线程排队等待，释放后还得唤醒队列里睡眠的线程；偏向锁升级轻量级锁需要到 STW 才能撤销，还需要恢复对象的 Mark Word。

### AQS {#concurrent-aqs}

AQS 是用来构建锁和同步器的框架，核心是 volatile 的 int 状态变量 + CAS + CLH 同步队列。

- 核心思想：通过一个被 volatile 修饰的 int 成员变量表示同步状态（共享资源），使用 CAS 对同步状态进行修改以保证线程安全；被请求的共享资源空闲，则将当前请求线程设置为有效的工作线程，并将共享资源设置为锁定状态；共享资源被占用，则通过 CLH 同步队列将暂时用不到的线程封装成节点加入队列，并在适当的时候对其进行阻塞和唤醒。同步队列解决了实现同步器时的细节问题（何时阻塞线程、如何按顺序唤醒线程）。
- 基于 AQS 的典型应用：Lock（区别于 synchronized 的锁，支持更灵活丰富的操作，如可定时的尝试获取锁以避免死锁、可中断的获取锁）；CountDownLatch（一个或一组操作等待其他操作执行结束后再继续）；Semaphore（多个共享资源的互斥使用，或控制并发数量）。
- 内部细节：
  1. waitStatus 标志线程的阻塞、唤醒等状态，但每个节点的 waitStatus 不是通过自身设置的，而是通过其后继节点设置的。
  2. 内部的同步队列是双向链表，Head 节点属于 dummy 节点，不存储信息，仅表示当前持有锁的线程，同时负责后续阻塞线程的唤醒。
  3. exclusiveOwnerThread 变量标志当前持有锁的线程，防止错误的释放锁（这种思想在 Redis 分布式锁中也有体现）。
  4. state 是 volatile 修饰的 int 型变量，除独占锁外还能实现 Semaphore、CountDownLatch 这样的同步工具；对外提供 protected 修饰的 tryAcquire、tryRelease 等方法，子类可通过它们实现自定义内容，如锁的可重入、公平与非公平锁。

### ThreadLocal {#concurrent-threadlocal}

ThreadLocal 通过"本地化资源避免共享"绕开锁竞争，但用完必须 remove 防止内存泄漏。

- 设计动机：多个线程争抢同一个共享变量会产生冲突，程序的解决办法是加锁，但加锁意味着性能消耗；让每个线程各自拥有一份数据，线程之间就无需竞争共享变量。
- 结构与读写：每个线程内部都有一个名为 threadLocals 的成员变量，类型是 ThreadLocalMap；Entry 的 key 为 ThreadLocal 实例本身（this 引用，弱引用），value 为 set 方法设置的值；get 和 set 都要先获取当前线程的 threadLocals，再以 ThreadLocal 为 key 存取 value。
- ThreadLocalMap 与 HashMap 的异同：都使用 hash 表；但 hash 冲突的解决方式是线性探测（非拉链法），装载因子采用黄金分割点，hash 算法使用斐波那契散列，扩容均为原 Entry 数组的 2 倍。
- 内存泄漏：key 是弱引用，只要触发 GC 就会被回收，key 变为 null；但 value 的引用链是 Thread → ThreadLocalMap → Entry → value，只要线程不终止，value 就一直无法回收，可能出现内存泄漏，因此使用完毕要及时调用 remove 方法删除对应线程的本地变量。
- InheritableThreadLocal：想让子线程继承父线程的本地变量时可采用，中间件里使用较多。

### 附：思维导图索引 {#mindmaps}

原书末尾以思维导图对全书知识做了梳理（原图见「代码随想录」知识星球），图题清单如下：

- Java 程序设计基本结构：Java 程序设计的基本结构与语法入门。
- Java 基础总结：Java 基础知识点的体系化总结（多张）。
- volatile 关键字：volatile 的语义（可见性、有序性）与使用场景。
- Java 类和对象：类与对象的创建、结构及面向对象基础。
- Java 容器：Java 容器体系（Collection 与 Map）总览。
- String Table：字符串常量池的结构与 intern 机制。
- List：List 接口及 ArrayList、LinkedList 等实现的特性对比。
- Java 异常：异常体系的分类与处理方式。
- Servlet：Servlet 的生命周期与请求处理流程。
- JVM 内存：JVM 内存区域的划分总览。
- JVM 内存管理：对象分配、垃圾回收与内存管理机制。
- JavaWeb 基础：HTTP、请求响应等 JavaWeb 基础知识。
- Java 类加载子系统（1~3）：类加载的加载、验证、准备、解析、初始化全过程。
- 运行时数据区（1~3）：程序计数器、虚拟机栈、本地方法栈、堆、方法区详解。
- 线程安全：线程安全问题的成因与解决思路。
- 锁优化：JDK 1.6 的锁升级与优化手段。
- Synchronized 关键字：synchronized 的原理与锁升级全流程。
- AQS：AQS 框架的结构与同步器实现。
- ThreadLocal：ThreadLocal 的实现原理与内存泄漏问题。
- Java 工具包（Java.IO、Java.lang、Java.math、Java.net）：JDK 常用工具包梳理。
- Spring：Spring 框架的核心知识体系。
