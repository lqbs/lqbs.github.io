---
title: "第六章　React 与 ECharts 看板"
description: "实现售后总览、异步请求、筛选联动和一致的图表下钻。"
outline: [2, 2]
prev:
  text: "第五章　FastAPI 接口与权限"
  link: "/posts/aftersales-analytics/05-fastapi"
next:
  text: "第七章　数据验证与质量治理"
  link: "/posts/aftersales-analytics/07-data-quality"
---

# 第六章　React 与 ECharts 看板

实现售后总览、异步请求、筛选联动和一致的图表下钻。

[返回完整目录](/posts/aftersales-analytics-from-scratch#完整目录)

## 第 31 轮　总览布局、React 初始化与 ECharts 图表 {#turn-31}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第六课实战问题1，我选择：B。理由：需要先知道总览，然后再知道细节。。请评价我的看板布局设计，并开始指导我学习 React + ECharts 数据看板开发。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第六课：React + ECharts 数据看板开发

<p v-pre><div>实战问题1：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：总览 KPI → 趋势与异常 → 团队对比 → 明细下钻</strong></span>。</p>

<p v-pre>你的理由是：</p>

<blockquote v-pre><p>需要先知道总览，然后再知道细节。</p></blockquote>

<p v-pre>这个判断正确，体现了数据看板设计中的一个重要原则：<span><strong>从宏观到微观，从发现问题到定位原因。</strong></span></p>

<p v-pre>再提升一步：数据看板不只是展示数据，而是帮助业务人员完成决策。</p>

<p v-pre>对于售后主管，应该形成这样的分析路径：</p>

<ol v-pre><li><div><div><p><span><strong>总览：</strong></span> 今天售后表现怎么样？</p></div></div></li><li><div><div><p><span><strong>趋势：</strong></span> 哪个指标开始恶化？</p></div></div></li><li><div><div><p><span><strong>对比：</strong></span> 哪个团队的问题最突出？</p></div></div></li><li><div><div><p><span><strong>下钻：</strong></span> 具体哪些订单需要处理？</p></div></div></li></ol>

<p v-pre>这也叫作 <span><strong>Overview first, details on demand（先总览，按需查看细节）</strong></span>。</p>

#### 一、先看我们要开发的页面

<p v-pre>下面是售后主管看板的教学原型，所有数值都是模拟数据。</p>

#### 售后经营分析

<p v-pre>2026-11-01 至 2026-11-20 · 模拟数据</p>

<p v-pre><div>近20天</div></p>

<p v-pre>新增售后申请</p>

### 1,280

<p v-pre>+8.2%</p>

<p v-pre>较上期</p>

<p v-pre>平均解决时长</p>

### 58.2 分钟

<p v-pre>+12.4%</p>

<p v-pre>较上期</p>

<p v-pre>SLA 超时率</p>

### 12.5%

<p v-pre>+3.1个百分点</p>

<p v-pre>较上期</p>

<p v-pre>投诉数量</p>

### 36

<p v-pre>-5.3%</p>

<p v-pre>较上期</p>

<p v-pre><span><strong>售后申请量趋势</strong></span></p>

<p v-pre>观察业务量变化，识别异常高峰</p>

<ul v-pre><li>11-01: 新增售后申请 48单</li><li>11-03: 新增售后申请 56单</li><li>11-05: 新增售后申请 51单</li><li>11-07: 新增售后申请 67单</li><li>11-09: 新增售后申请 60单</li><li>11-11: 新增售后申请 91单</li><li>11-13: 新增售后申请 78单</li><li>11-15: 新增售后申请 65单</li><li>11-17: 新增售后申请 72单</li><li>11-20: 新增售后申请 84单</li></ul>

<p v-pre>教学模拟数据 · 仅展示部分日期</p>

<p v-pre><span><strong>团队表现对比</strong></span></p>

<p v-pre>各团队平均解决时长（分钟）</p>

<ul v-pre><li>团队A: 平均解决时长 42分钟</li><li>团队B: 平均解决时长 76分钟</li><li>团队C: 平均解决时长 55分钟</li><li>团队D: 平均解决时长 63分钟</li></ul>

<p v-pre><span><strong>异常明细入口</strong></span></p>

<p v-pre>团队 B 解决时长偏高</p>

<p v-pre>建议下钻查看超时订单及处理环节</p>

<p v-pre><span class="interaction"><span>查看分析</span></span></p>

<p v-pre>这张页面原型对应了四层信息：</p>

<ul v-pre><li><div><div><p>KPI 卡片：快速判断整体表现。</p></div></div></li><li><div><div><p>趋势图：发现变化。</p></div></div></li><li><div><div><p>团队对比：定位责任范围。</p></div></div></li><li><div><div><p>明细入口：找到需要核验的售后申请。</p></div></div></li></ul>

### 二、React + ECharts 的职责分工

<p v-pre>在正式开发之前，要先分清楚三个部分。</p>

<table v-pre><tbody><tr><th><p>技术</p></th><th><p>职责</p></th></tr><tr><td><p>React</p></td><td><p>页面结构、组件、状态和交互</p></td></tr><tr><td><p>TypeScript</p></td><td><p>数据类型约束，减少字段错误</p></td></tr><tr><td><p>ECharts</p></td><td><p>折线图、柱状图、图表交互</p></td></tr><tr><td><p>Ant Design</p></td><td><p>日期选择器、卡片、表格、加载状态</p></td></tr><tr><td><p>FastAPI</p></td><td><p>提供经过权限校验的分析数据</p></td></tr></tbody></table>

<p v-pre>推荐技术组合：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>React + TypeScript + Vite          │          ├── Ant Design：页面组件          ├── ECharts：数据图表          └── Axios：请求 FastAPI</span></code></div></p>

#### 1. 创建项目

<p v-pre>在终端执行：</p>

<p v-pre><div>Bash</div></p>

```bash
npm create vite@latest aftersales-dashboard -- --template react-ts

cd aftersales-dashboard

npm install

npm install antd echarts echarts-for-react axios

npm run dev
```

<p v-pre>打开 Vite 输出的本地地址，就可以开始开发。</p>

### 三、设计前端项目结构

<p v-pre>建议先保持简单，不要一开始就引入复杂的状态管理框架。</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>src/ ├── api/ │   └── aftersales.ts ├── components/ │   ├── KpiCard.tsx │   ├── TrendChart.tsx │   └── TeamChart.tsx ├── pages/ │   └── AftersalesDashboard.tsx ├── types/ │   └── aftersales.ts ├── App.tsx └── main.tsx</span></code></div></p>

<p v-pre>每个目录都有明确职责。</p>

<ul v-pre><li><div><div><p><code>api</code>：请求后端数据。</p></div></div></li><li><div><div><p><code>types</code>：定义接口数据结构。</p></div></div></li><li><div><div><p><code>components</code>：可复用的展示组件。</p></div></div></li><li><div><div><p><code>pages</code>：组织页面布局和交互。</p></div></div></li></ul>

### 四、第一步：定义 TypeScript 数据类型

<p v-pre>前面第五课已经设计了 API 数据契约。</p>

<p v-pre>现在前端需要根据后端返回结构定义类型。</p>

<p v-pre><code>src/types/aftersales.ts</code></p>

<p v-pre><div>TypeScript</div></p>

```typescript

export interface OverviewData {
  start_date: string;
  end_date: string;

  created_order_count: number;
  resolved_order_count: number;

  avg_resolution_minutes: number | null;
  sla_overdue_rate: number | null;

  complaint_count: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

```

<p v-pre>注意：</p>

<p v-pre>后端的 <code>sla_overdue_rate = 0.125</code>，前端需要格式化成 <code>12.5%</code>。</p>

<p v-pre><div>TypeScript</div></p>

```typescript
function formatPercent(
  value: number | null
): string {
  if (value === null) {
    return "—";
  }

  return `${(value * 100).toFixed(1)}%`;
}
```

<p v-pre>为什么不能直接写：</p>

<p v-pre><div>TypeScript</div></p>

```typescript
value * 100
```

<p v-pre>因为我们需要考虑：</p>

<ul v-pre><li><div><div><p><code>null</code>：没有可计算结果。</p></div></div></li><li><div><div><p><code>0</code>：确实为零。</p></div></div></li><li><div><div><p>小数位：统一显示一位。</p></div></div></li></ul>

<p v-pre><span><strong>数据展示正确性，是前端开发的一部分。</strong></span></p>

### 五、第二步：封装 FastAPI 请求

<p v-pre><code>src/api/aftersales.ts</code></p>

<p v-pre><div>TypeScript</div></p>

```typescript

import axios from "axios";

import type {
  ApiResponse,
  OverviewData,
} from "../types/aftersales";

const api = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
});

export async function getOverview(
  startDate: string,
  endDate: string
): Promise<OverviewData> {
  const response = await api.get<
    ApiResponse<OverviewData>
  >("/aftersales/overview", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response.data.data;
}

```

<p v-pre>本地开发时，可以在 <code>vite.config.ts</code> 配置代理：</p>

<p v-pre><div>TypeScript</div></p>

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
```

<p v-pre>这里还没有接入真实登录态。正式开发时，请求必须携带合法认证凭证，后端也必须继续执行 RBAC 和 Data Scope 校验。</p>

### 六、第三步：开发 KPI 卡片

<p v-pre>这是第一个可复用 React 组件。</p>

<p v-pre><code>src/components/KpiCard.tsx</code></p>

<p v-pre><div>TypeScript</div></p>

```typescript

import { Card, Statistic } from "antd";

interface KpiCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  loading?: boolean;
}

export function KpiCard({
  title,
  value,
  suffix,
  loading = false,
}: KpiCardProps) {
  return (
    <Card loading={loading}>
      <Statistic
        title={title}
        value={value}
        suffix={suffix}
      />
    </Card>
  );
}

```

<p v-pre>这个组件只负责展示，不负责请求 API。</p>

<p v-pre>这是 React 组件设计的重要原则之一：</p>

<p v-pre><span><strong>让通用展示组件尽量独立于具体的数据来源。</strong></span></p>

<p v-pre>这样它可以在不同页面中复用。</p>

### 七、第四步：开发 ECharts 趋势图

<p v-pre><code>src/components/TrendChart.tsx</code></p>

<p v-pre><div>TypeScript</div></p>

```typescript

import ReactECharts from "echarts-for-react";

interface TrendItem {
  date: string;
  count: number;
}

interface TrendChartProps {
  data: TrendItem[];
}

export function TrendChart({
  data,
}: TrendChartProps) {
  const option = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: 48,
      right: 24,
      top: 30,
      bottom: 36,
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.date),
    },
    yAxis: {
      type: "value",
      minInterval: 1,
    },
    series: [
      {
        name: "新增售后申请",
        type: "line",
        smooth: true,
        data: data.map((item) => item.count),
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: 320 }}
    />
  );
}

```

<p v-pre>你需要理解 ECharts 的三个核心概念：</p>

<table v-pre><tbody><tr><th><p>属性</p></th><th><p>作用</p></th></tr><tr><td><p><code>xAxis</code></p></td><td><p>横坐标，例如日期</p></td></tr><tr><td><p><code>yAxis</code></p></td><td><p>纵坐标，例如售后申请量</p></td></tr><tr><td><p><code>series</code></p></td><td><p>实际绘制的数据序列</p></td></tr></tbody></table>

<p v-pre>只要掌握这三个概念，你就能理解大多数基础折线图和柱状图。</p>

### 八、第五步：组装第一个 React 页面

<p v-pre>我们先用模拟数据，把 KPI 和趋势图组合起来。</p>

<p v-pre><code>src/pages/AftersalesDashboard.tsx</code></p>

<p v-pre><div>TypeScript</div></p>

```typescript

import { Col, Row, Typography } from "antd";

import { KpiCard } from "../components/KpiCard";
import { TrendChart } from "../components/TrendChart";

const mockTrend = [
  { date: "11-01", count: 48 },
  { date: "11-02", count: 56 },
  { date: "11-03", count: 51 },
  { date: "11-04", count: 67 },
  { date: "11-05", count: 60 },
];

export default function AftersalesDashboard() {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>
        售后经营分析
      </Typography.Title>

      <Row gutter={[16, 16]}>
        <Col xs={12} lg={6}>
          <KpiCard
            title="新增售后申请"
            value={1280}
          />
        </Col>

        <Col xs={12} lg={6}>
          <KpiCard
            title="平均解决时长"
            value={58.2}
            suffix="分钟"
          />
        </Col>

        <Col xs={12} lg={6}>
          <KpiCard
            title="SLA 超时率"
            value="12.5%"
          />
        </Col>

        <Col xs={12} lg={6}>
          <KpiCard
            title="投诉数量"
            value={36}
          />
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Typography.Title level={5}>
          售后申请趋势
        </Typography.Title>

        <TrendChart data={mockTrend} />
      </div>
    </div>
  );
}

```

<p v-pre>在 <code>App.tsx</code> 中引用：</p>

<p v-pre><div>TypeScript</div></p>

```typescript
import AftersalesDashboard from "./pages/AftersalesDashboard";

export default function App() {
  return <AftersalesDashboard />;
}
```

<p v-pre>至此，你已经有了一个基本的 React 数据看板页面。</p>

<p v-pre>不过目前仍然使用模拟数据，还没有实现真实 API 加载、日期筛选、团队对比和明细下钻。</p>

### 九、下一步：把静态看板变成动态看板

<p v-pre>真实项目不能一直使用写死的数据。</p>

<p v-pre>下一步我们要学习 React 的状态管理。</p>

<p v-pre>例如：</p>

<p v-pre><div>TypeScript</div></p>

```typescript
const [loading, setLoading] = useState(false);
const [data, setData] = useState<OverviewData | null>(null);
const [error, setError] = useState<string | null>(null);
```

<p v-pre>这三个状态非常重要。</p>

<table v-pre><tbody><tr><th><p>状态</p></th><th><p>页面应该显示什么</p></th></tr><tr><td><p>Loading</p></td><td><p>骨架屏或加载提示</p></td></tr><tr><td><p>Success</p></td><td><p>KPI 与图表</p></td></tr><tr><td><p>Empty</p></td><td><p>无数据提示，不伪造零值</p></td></tr><tr><td><p>Error</p></td><td><p>错误信息与重试入口</p></td></tr></tbody></table>

<p v-pre>此外，还需要处理一个实际问题：用户快速切换日期时，旧请求可能比新请求更晚返回，从而覆盖新数据。后续我们会使用请求取消或查询库解决这个竞态。</p>

### 十、第六课实战问题2：React 应该如何处理 API 数据？

<p v-pre>假设售后主管打开看板：</p>

<ol v-pre><li><div><div><p>React 开始请求 <code>/api/v1/aftersales/overview</code>。</p></div></div></li><li><div><div><p>网络响应需要 2 秒。</p></div></div></li><li><div><div><p>请求完成后返回 KPI 数据。</p></div></div></li></ol>

<p v-pre>你认为最合理的前端实现是什么？</p>

<p v-pre><div><label>A. 页面直接显示 0，等数据返回后再修改，不需要区分加载状态。</label></div><div><label>B. 使用 React 状态管理加载、成功、空数据和错误状态，数据返回后更新组件。</label></div><div><label>C. 使用同步循环等待 API 返回，阻止页面其他操作。</label></div><div><label>D. 把 KPI 数值固定写在组件中，避免 API 请求影响性能。</label></div></p>

<p v-pre><span><strong>请说明你的理由</strong></span></p>

```text
异步请求期间，页面应该展示等待状态。
```

<p v-pre><span class="interaction"><span>提交答案，继续第六课</span></span></p>

#### 本课学习进度

<p v-pre>看板信息层次设计</p>

<p v-pre>React + TypeScript 项目搭建</p>

<p v-pre>API 数据类型定义</p>

<p v-pre>KPI 卡片组件</p>

<p v-pre>ECharts 趋势图组件</p>

<p v-pre>页面基础布局</p>

<p v-pre>API 异步数据加载</p>

<p v-pre>日期筛选与图表联动</p>

<p v-pre>明细下钻与异常处理</p>

<p v-pre>看板测试与验收</p>

<p v-pre><span><strong>本节最重要的知识点：</strong></span></p>

<p v-pre>React 负责页面结构和状态，ECharts 负责可视化，FastAPI 负责提供经过权限校验的数据。</p>

<p v-pre>下一步，我们会让看板真正连接后端 API，并处理真实业务系统中不可避免的加载、失败和无数据情况。</p>

## 第 32 轮　异步请求、页面状态和日期筛选 {#turn-32}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第六课实战问题2，我选择：B。理由：异步请求期间，页面应该展示等待状态。。请评价，并继续指导我实现 React useEffect、API 异步请求、Loading/Error/Empty 状态，以及日期筛选与图表联动。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第六课 · 实战3：React 异步请求、状态管理与图表联动

<p v-pre><div>实战问题2：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：使用 React 状态管理加载、成功、空数据和错误状态。</strong></span></p>

<p v-pre>你的理由是：</p>

<blockquote v-pre><p>异步请求期间，页面应该展示等待状态。</p></blockquote>

<p v-pre>判断正确。你已经理解了异步 UI 的基本思想。</p>

<p v-pre>不过还需要补充一点：<span><strong>异步请求不仅要考虑等待，还要考虑失败、空数据和请求竞态。</strong></span></p>

<p v-pre>例如用户先查询 11 月 1 日，再迅速切换到 11 月 20 日，如果第一次请求返回得更晚，就可能把第二次查询的结果覆盖。</p>

<p v-pre>今天我们完成一个能够处理这些问题的 React 数据看板。</p>

#### 一、先理解 React 的异步数据流

<p v-pre><span><strong>用户选择日期范围</strong></span></p>

<p v-pre>例如 2026-11-01 至 2026-11-20</p>

<p v-pre><span><strong>React 更新查询条件</strong></span></p>

<p v-pre>useState 保存 startDate / endDate</p>

<p v-pre><span><strong>useEffect 发起 API 请求</strong></span></p>

<p v-pre>Axios 请求 FastAPI</p>

<p v-pre><span><strong>更新页面状态</strong></span></p>

<p v-pre>Loading / Success / Empty / Error</p>

<p v-pre><span><strong>重新渲染 KPI 与图表</strong></span></p>

<p v-pre>React 根据新状态自动更新界面</p>

<p v-pre>这里有两个重要的 React Hook：</p>

<table v-pre><tbody><tr><th><p>Hook</p></th><th><p>作用</p></th></tr><tr><td><p><code>useState</code></p></td><td><p>保存查询条件和页面数据</p></td></tr><tr><td><p><code>useEffect</code></p></td><td><p>在依赖变化后执行数据请求，并清理旧请求</p></td></tr></tbody></table>

### 二、第一步：定义页面状态

<p v-pre>我们不建议只用一个 <code>loading</code> 布尔值。</p>

<p v-pre>因为 <code>loading=false</code> 可能表示成功、失败，也可能表示没有数据。</p>

<p v-pre>更清晰的方式是定义状态类型。</p>

<p v-pre><code>src/types/request.ts</code></p>

<p v-pre><div>TypeScript</div></p>

```typescript

export type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "empty" }
  | { status: "error"; message: string };

```

<p v-pre>这样可以避免出现矛盾状态，例如：</p>

<p v-pre><div>TypeScript</div></p>

```typescript
loading = true;
error = "请求失败";
data = oldData;
```

<p v-pre>在联合类型中，同一时刻只能处于一种明确状态。</p>

#### 四种状态的页面表现

<p v-pre><span><strong>Loading</strong></span></p>

<p v-pre>展示骨架屏或 Spin</p>

<p v-pre><span><strong>Success</strong></span></p>

### 1,280

<p v-pre>展示真实指标数据</p>

<p v-pre><span><strong>Empty</strong></span></p>

<p v-pre>当前筛选条件下暂无数据</p>

<p v-pre>不要伪造零值</p>

<p v-pre><span><strong>Error</strong></span></p>

<p v-pre>数据加载失败</p>

<p v-pre>提供重试操作</p>

### 三、第二步：封装支持取消的 API 请求

<p v-pre>之前我们已经有 <code>getOverview()</code>，现在需要支持 <code>AbortSignal</code>。</p>

<p v-pre><code>src/api/aftersales.ts</code></p>

<p v-pre><div>TypeScript</div></p>

```typescript

import axios from "axios";

import type {
  ApiResponse,
  OverviewData,
} from "../types/aftersales";

const api = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
});

export async function getOverview(
  startDate: string,
  endDate: string,
  signal?: AbortSignal
): Promise<OverviewData> {
  const response = await api.get<
    ApiResponse<OverviewData>
  >("/aftersales/overview", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
    signal,
  });

  return response.data.data;
}

export { api };

```

<p v-pre><code>AbortSignal</code> 的作用是允许我们取消已经不再需要的请求。</p>

<p v-pre>例如：</p>

<ul v-pre><li><div><div><p>用户修改日期。</p></div></div></li><li><div><div><p>组件卸载。</p></div></div></li><li><div><div><p>新请求取代旧请求。</p></div></div></li></ul>

<p v-pre>这可以减少无效网络请求，也能帮助避免旧响应覆盖新数据。</p>

### 四、第三步：使用 useEffect 加载数据

<p v-pre>这是本节最重要的代码。</p>

<p v-pre><code>src/hooks/useAftersalesOverview.ts</code></p>

<p v-pre><div>TypeScript</div></p>

```typescript

import { useEffect, useState } from "react";
import axios from "axios";

import { getOverview } from "../api/aftersales";
import type { OverviewData } from "../types/aftersales";
import type { RequestState } from "../types/request";

export function useAftersalesOverview(
  startDate: string,
  endDate: string
) {
  const [state, setState] = useState<
    RequestState<OverviewData>
  >({ status: "idle" });

  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setState({ status: "loading" });

      try {
        const data = await getOverview(
          startDate,
          endDate,
          controller.signal
        );

        if (controller.signal.aborted) {
          return;
        }

        // 这里用 null 判断整个数据对象是否缺失。
        // 单个 KPI 为 0 不代表没有数据。
        if (data == null) {
          setState({ status: "empty" });
        } else {
          setState({
            status: "success",
            data,
          });
        }
      } catch (error) {
        if (
          controller.signal.aborted ||
          axios.isCancel(error)
        ) {
          return;
        }

        setState({
          status: "error",
          message: "数据加载失败，请稍后重试",
        });
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, [startDate, endDate, retryKey]);

  const retry = () => {
    setRetryKey((value) => value + 1);
  };

  return { state, retry };
}

```

#### 逐行理解关键逻辑

##### 1. 为什么要把日期放进依赖数组？

<p v-pre><div>TypeScript</div></p>

```typescript
}, [startDate, endDate, retryKey]);
```

<p v-pre>因为当日期发生变化时，React 应该重新请求数据。</p>

##### 2. 为什么要 return cleanup？

<p v-pre><div>TypeScript</div></p>

```typescript
return () => {
  controller.abort();
};
```

<p v-pre>当依赖变化或组件卸载时，取消旧请求。</p>

<p v-pre>这对于用户快速切换日期尤其重要。</p>

##### 3. 为什么需要 retryKey？

<p v-pre>因为用户点击“重试”时，日期可能没有变化。</p>

<p v-pre>如果只依赖日期，<code>useEffect</code> 不会因为重试按钮而重新运行。</p>

<p v-pre>通过更新 <code>retryKey</code>，可以主动触发重新请求。</p>

### 五、第四步：实现日期筛选

<p v-pre>使用 Ant Design 的 <code>RangePicker</code>。</p>

<p v-pre>建议区分两个概念：</p>

<ul v-pre><li><div><div><p>正在选择的日期。</p></div></div></li><li><div><div><p>已经提交并用于查询的日期。</p></div></div></li></ul>

<p v-pre>这样用户还没选完日期时，不会不断触发 API 请求。</p>

<p v-pre><code>src/components/DateFilter.tsx</code></p>

<p v-pre><div>TypeScript</div></p>

```typescript

import { useState } from "react";
import { Button, DatePicker, Space } from "antd";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface DateFilterProps {
  onSearch: (
    startDate: string,
    endDate: string
  ) => void;
}

export function DateFilter({
  onSearch,
}: DateFilterProps) {
  const [dates, setDates] = useState<
    [Dayjs, Dayjs] | null
  >([
    dayjs("2026-11-01"),
    dayjs("2026-11-20"),
  ]);

  function handleSearch() {
    if (!dates) return;

    onSearch(
      dates[0].format("YYYY-MM-DD"),
      dates[1].format("YYYY-MM-DD")
    );
  }

  return (
    <Space>
      <RangePicker
        value={dates}
        onChange={(values) => {
          if (!values || !values[0] || !values[1]) {
            setDates(null);
            return;
          }

          setDates([
            values[0],
            values[1],
          ]);
        }}
      />

      <Button
        type="primary"
        disabled={!dates}
        onClick={handleSearch}
      >
        查询
      </Button>
    </Space>
  );
}

```

<p v-pre>这段代码中，只有点击“查询”才会调用 <code>onSearch()</code>。</p>

<p v-pre>在正式项目中，还应增加日期跨度限制，并与 FastAPI 的参数校验规则保持一致。</p>

### 六、第五步：把日期筛选和 KPI 联动起来

<p v-pre>现在组合：</p>

<ul v-pre><li><div><div><p>日期筛选。</p></div></div></li><li><div><div><p>API 请求。</p></div></div></li><li><div><div><p>Loading。</p></div></div></li><li><div><div><p>Error。</p></div></div></li><li><div><div><p>Empty。</p></div></div></li><li><div><div><p>KPI 卡片。</p></div></div></li></ul>

<p v-pre><code>src/pages/AftersalesDashboard.tsx</code></p>

<p v-pre><div>TypeScript</div></p>

```typescript

import { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Empty,
  Row,
  Spin,
  Typography,
} from "antd";

import { DateFilter } from "../components/DateFilter";
import { KpiCard } from "../components/KpiCard";
import { useAftersalesOverview } from "../hooks/useAftersalesOverview";

export default function AftersalesDashboard() {
  const [query, setQuery] = useState({
    startDate: "2026-11-01",
    endDate: "2026-11-20",
  });

  const { state, retry } = useAftersalesOverview(
    query.startDate,
    query.endDate
  );

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>
        售后经营分析
      </Typography.Title>

      <DateFilter
        onSearch={(startDate, endDate) => {
          setQuery({ startDate, endDate });
        }}
      />

      <div style={{ marginTop: 24 }}>
        {state.status === "loading" && (
          <Spin tip="正在加载数据">
            <div style={{ minHeight: 160 }} />
          </Spin>
        )}

        {state.status === "error" && (
          <Alert
            type="error"
            showIcon
            message={state.message}
            action={
              <Button onClick={retry}>
                重试
              </Button>
            }
          />
        )}

        {state.status === "empty" && (
          <Empty description="暂无数据" />
        )}

        {state.status === "success" && (
          <Row gutter={[16, 16]}>
            <Col xs={12} lg={6}>
              <KpiCard
                title="新增售后申请"
                value={
                  state.data.created_order_count
                }
              />
            </Col>

            <Col xs={12} lg={6}>
              <KpiCard
                title="平均解决时长"
                value={
                  state.data.avg_resolution_minutes
                    ?? "—"
                }
                suffix="分钟"
              />
            </Col>

            <Col xs={12} lg={6}>
              <KpiCard
                title="SLA 超时率"
                value={
                  state.data.sla_overdue_rate === null
                    ? "—"
                    : `${(
                        state.data.sla_overdue_rate * 100
                      ).toFixed(1)}%`
                }
              />
            </Col>

            <Col xs={12} lg={6}>
              <KpiCard
                title="投诉数量"
                value={state.data.complaint_count}
              />
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}

```

<p v-pre>到这里，页面已经能够根据日期变化重新请求 KPI 数据。</p>

### 七、第六步：实现 KPI 与趋势图联动

<p v-pre>接下来我们让 KPI 卡片和趋势图使用相同的查询条件。</p>

<p v-pre>推荐设计：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>Dashboard    │    ├── DateFilter    │      │    │      ▼    │   查询条件    │      │    ├──────┼────────────┐    ▼      ▼            ▼ Overview API      Trends API    │                  │    ▼                  ▼ KPI Cards        TrendChart</span></code></div></p>

#### 1. 趋势接口数据结构

<p v-pre><div>TypeScript</div></p>

```typescript
export interface TrendItem {
  date: string;
  created_order_count: number;
}

export interface TrendsData {
  items: TrendItem[];
}
```

<p v-pre>后端返回示例：</p>

<p v-pre><div>JSON</div></p>

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "date": "2026-11-01",
        "created_order_count": 48
      },
      {
        "date": "2026-11-02",
        "created_order_count": 56
      },
      {
        "date": "2026-11-03",
        "created_order_count": 51
      }
    ]
  }
}
```

#### 2. 查询条件统一管理

<p v-pre>不要让 KPI 和趋势图各自维护独立的日期。</p>

<p v-pre>推荐在 Dashboard 父组件中统一管理：</p>

<p v-pre><div>TypeScript</div></p>

```typescript
const [query, setQuery] = useState({
  startDate: "2026-11-01",
  endDate: "2026-11-20",
  teamId: undefined as number | undefined,
});
```

<p v-pre>然后将同一个 <code>query</code> 传给：</p>

<ul v-pre><li><div><div><p><code>useAftersalesOverview(query)</code></p></div></div></li><li><div><div><p><code>useAftersalesTrends(query)</code></p></div></div></li><li><div><div><p><code>useAftersalesTeams(query)</code></p></div></div></li></ul>

<p v-pre>这样用户修改日期或团队后，所有图表都使用相同的查询条件。</p>

<p v-pre>但要注意：<span><strong>统一查询条件不等于所有指标采用相同统计日期口径。</strong></span> 各指标仍应遵守第五课定义的创建日期、解决日期、SLA 到期日期等规则。</p>

### 八、交互演示：筛选条件如何影响看板

<p v-pre>下面使用模拟数据演示日期筛选、KPI 和趋势图联动的效果。</p>

#### 售后分析看板 · 交互示例

<p v-pre><div>模拟数据</div></p>

<p v-pre><label>统计周期</label></p>

<p v-pre><div><span class="interaction"><span>近7天</span></span><span class="interaction"><span>近14天</span></span></div></p>

<p v-pre><label>团队筛选</label></p>

<p v-pre><div><label>全部</label></div><div><label>团队 A</label></div><div><label>团队 B</label></div></p>

<p v-pre>新增售后申请</p>

### 182

<p v-pre>日均申请量</p>

### 26.0

<p v-pre><span><strong>售后申请趋势</strong></span></p>

<p v-pre>随着上方条件变化，图表同步更新</p>

<p v-pre><span>该演示仅模拟前端状态联动，没有连接真实 FastAPI 或数据库。</span></p>

### 九、本节开发验收标准

<table v-pre><tbody><tr><th><p>验收项目</p></th><th><p>通过标准</p></th></tr><tr><td><p>初次加载</p></td><td><p>显示 Loading，成功后展示数据</p></td></tr><tr><td><p>API 失败</p></td><td><p>显示错误信息和重试按钮</p></td></tr><tr><td><p>无数据</p></td><td><p>显示 Empty，不把 null 当作0</p></td></tr><tr><td><p>日期筛选</p></td><td><p>点击查询后重新加载数据</p></td></tr><tr><td><p>图表联动</p></td><td><p>KPI、趋势图使用同一筛选条件</p></td></tr><tr><td><p>请求取消</p></td><td><p>快速切换日期不会被旧响应覆盖</p></td></tr><tr><td><p>数据格式</p></td><td><p>百分比、时长、空值显示正确</p></td></tr><tr><td><p>权限控制</p></td><td><p>不显示无权限的数据，后端仍强制授权</p></td></tr></tbody></table>

<p v-pre>目前这些是验收标准和示例实现，尚未在真实项目中执行测试。</p>

### 十、第六课实战问题3：如何处理图表联动中的请求竞态？

<p v-pre>假设用户连续切换日期：</p>

<ul v-pre><li><div><div><p>第一次请求：查询 11 月 1 日，耗时 3 秒。</p></div></div></li><li><div><div><p>第二次请求：查询 11 月 20 日，耗时 1 秒。</p></div></div></li><li><div><div><p>第二次请求先返回。</p></div></div></li><li><div><div><p>第一次请求后返回。</p></div></div></li></ul>

<p v-pre>如果没有额外处理，页面可能最终显示 11 月 1 日的数据。</p>

<p v-pre>你认为应该如何解决？</p>

<p v-pre><div><label>A. 不处理，因为 API 请求最终都会成功。</label></div><div><label>B. 使用 AbortController 取消旧请求，并确保只有当前查询对应的响应能够更新状态。</label></div><div><label>C. 禁止用户修改日期，直到所有请求结束。</label></div><div><label>D. 把 API 超时时间改成30秒即可。</label></div></p>

<p v-pre><span><strong>请说明你的理由</strong></span></p>

```text
因为旧请求可能覆盖新请求的数据。
```

<p v-pre><span class="interaction"><span>提交答案，继续第六课</span></span></p>

<p v-pre><span><strong>本节核心收获：</strong></span> React 数据看板不仅要把 API 数据显示出来，还要保证用户在加载、失败、无数据、快速切换筛选条件时，始终看到与当前查询条件一致的结果。</p>

## 第 33 轮　请求竞态、图表下钻和自动化测试 {#turn-33}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第六课实战问题3，我选择：B。理由：因为旧请求可能覆盖新请求的数据。。请评价，并继续指导我实现请求竞态保护、图表点击下钻、团队筛选联动和 React 看板自动化测试。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第六课 · 实战4：请求竞态、图表下钻与自动化测试

<p v-pre><div>实战问题3：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：取消旧请求，并确保只有当前查询的响应可以更新页面。</strong></span></p>

<p v-pre>你的理由是：</p>

<blockquote v-pre><p>旧请求可能覆盖新请求的数据。</p></blockquote>

<p v-pre>完全正确。你已经识别出 React 异步开发中一个典型的 <span><strong>Race Condition（竞态条件）</strong></span>。</p>

<p v-pre>我再帮你完善一个工程层面的认识：</p>

<p v-pre><span><strong>取消旧请求是性能优化和资源管理手段；阻止旧响应更新状态才是正确性保障。</strong></span></p>

<p v-pre>即使请求已经取消，也不能完全依赖网络层取消成功。我们还需要在 React 中判断响应是否仍属于当前查询。</p>

<p v-pre>本节我们继续开发售后分析看板，完成四项能力：</p>

<table v-pre><tbody><tr><th><p>能力</p></th><th><p>业务价值</p></th></tr><tr><td><p>请求竞态保护</p></td><td><p>快速切换筛选条件时，不显示过期数据</p></td></tr><tr><td><p>团队筛选联动</p></td><td><p>所有指标和图表使用一致的查询条件</p></td></tr><tr><td><p>图表点击下钻</p></td><td><p>从异常团队定位到具体售后申请</p></td></tr><tr><td><p>自动化测试</p></td><td><p>证明页面行为符合预期</p></td></tr></tbody></table>

#### 一、先体验目标交互

<p v-pre>下面用模拟数据展示本节要实现的看板交互。</p>

#### 售后经营分析

<p v-pre>团队分析 · 教学模拟数据</p>

<p v-pre><div>演示</div></p>

<p v-pre><label>统计周期</label></p>

<p v-pre><div><span class="interaction"><span>近7天</span></span><span class="interaction"><span>近14天</span></span></div></p>

<p v-pre><label>团队筛选</label></p>

<p v-pre><div><label>全部</label></div><div><label>团队 A</label></div><div><label>团队 B</label></div><div><label>团队 C</label></div></p>

<p v-pre>处理订单量</p>

### 589

<p v-pre>团队平均解决时长</p>

### 59分钟

<p v-pre><span><strong>团队解决时长对比</strong></span></p>

<p v-pre>选择团队可筛选看板；点击下方团队可查看明细</p>

<p v-pre>团队 A</p>

<p v-pre>42 分钟</p>

<p v-pre>团队 B</p>

<p v-pre>76 分钟</p>

<p v-pre>团队 C</p>

<p v-pre>55 分钟</p>

<p v-pre>你刚才操作的过程，正是我们要用 React 实现的：</p>

<p v-pre><span><strong>筛选条件变化 → KPI 和图表同步更新 → 点击异常团队 → 查看授权范围内的售后明细。</strong></span></p>

#### 二、实现可靠的请求竞态保护

<p v-pre>先看一个常见错误：</p>

<p v-pre><div>TypeScript</div></p>

```typescript
useEffect(() => {
  getOverview(startDate, endDate).then(setData);
}, [startDate, endDate]);
```

<p v-pre>问题是：每次请求返回后都会调用 <code>setData</code>，不检查它是否属于最新的筛选条件。</p>

##### 改进方案：AbortController + 请求序号

<p v-pre>我们在上一节已经实现了 <code>AbortSignal</code>，现在再增加请求序号，形成双重保护。</p>

<p v-pre><code>src/hooks/useAftersalesOverview.ts</code></p>

<p v-pre><div>TypeScript</div></p>

```typescript

import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { getOverview } from "../api/aftersales";
import type { OverviewData } from "../types/aftersales";
import type { RequestState } from "../types/request";

interface OverviewQuery {
  startDate: string;
  endDate: string;
  teamId?: number;
}

export function useAftersalesOverview(
  query: OverviewQuery
) {
  const [state, setState] = useState<
    RequestState<OverviewData>
  >({ status: "idle" });

  const [retryKey, setRetryKey] = useState(0);
  const requestIdRef = useRef(0);

  const { startDate, endDate, teamId } = query;

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestIdRef.current;
    let active = true;

    async function load() {
      setState({ status: "loading" });

      try {
        const data = await getOverview(
          startDate,
          endDate,
          teamId,
          controller.signal
        );

        if (
          !active ||
          controller.signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setState(
          data == null
            ? { status: "empty" }
            : { status: "success", data }
        );
      } catch (error) {
        if (
          !active ||
          controller.signal.aborted ||
          requestId !== requestIdRef.current ||
          axios.isCancel(error)
        ) {
          return;
        }

        setState({
          status: "error",
          message: "数据加载失败，请重试",
        });
      }
    }

    void load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [startDate, endDate, teamId, retryKey]);

  return {
    state,
    retry: () => setRetryKey(v => v + 1),
  };
}

```

<p v-pre>同时把上一节的 API 方法改成支持 <code>teamId</code>：</p>

<p v-pre><div>TypeScript</div></p>

```typescript
export async function getOverview(
  startDate: string,
  endDate: string,
  teamId?: number,
  signal?: AbortSignal
): Promise<OverviewData> {
  const response = await api.get<ApiResponse<OverviewData>>(
    "/aftersales/overview",
    {
      params: {
        start_date: startDate,
        end_date: endDate,
        ...(teamId !== undefined
          ? { team_id: teamId }
          : {}),
      },
      signal,
    }
  );

  return response.data.data;
}
```

<p v-pre>这里有三个防护机制：</p>

<table v-pre><tbody><tr><th><p>机制</p></th><th><p>解决什么问题</p></th></tr><tr><td><p><code>controller.abort()</code></p></td><td><p>取消不再需要的请求</p></td></tr><tr><td><p><code>active</code></p></td><td><p>阻止已清理的 Effect 更新状态</p></td></tr><tr><td><p><code>requestId</code></p></td><td><p>只有当前请求可以提交结果</p></td></tr></tbody></table>

<p v-pre>注意一个边界：这个 Hook 在新查询的 Effect 开始执行后，会阻止旧请求提交；在 React 提交新筛选条件到 Effect 执行之间，旧数据可能短暂仍在页面上。对于需要严格避免显示过期数据的页面，还应让渲染结果与当前查询 Key 绑定，或者使用 TanStack Query 按查询 Key 管理状态。</p>

<p v-pre><span><strong>工程建议：</strong></span> 先理解手写 Hook 的工作原理，正式项目中可以使用 TanStack Query 减少重复的请求状态和缓存代码。</p>

#### 三、实现团队筛选联动

<p v-pre>核心原则：<span><strong>查询条件由 Dashboard 统一管理，子组件不各自维护一套筛选条件。</strong></span></p>

<p v-pre>我们先定义一个共享类型。</p>

<p v-pre><code>src/types/query.ts</code></p>

<p v-pre><div>TypeScript</div></p>

```typescript

export interface DashboardQuery {
  startDate: string;
  endDate: string;
  teamId?: number;
}

```

<p v-pre>在父组件中：</p>

<p v-pre><div>TypeScript</div></p>

```typescript

import { useState } from "react";
import { Select } from "antd";

import type { DashboardQuery } from "../types/query";
import { useAftersalesOverview } from "../hooks/useAftersalesOverview";

export function DashboardContainer() {
  const [query, setQuery] = useState<DashboardQuery>({
    startDate: "2026-11-01",
    endDate: "2026-11-20",
  });

  const overview = useAftersalesOverview(query);

  return (
    <div>
      <Select
        style={{ width: 180 }}
        placeholder="全部授权团队"
        value={query.teamId}
        allowClear
        options={[
          { label: "团队 A", value: 101 },
          { label: "团队 B", value: 102 },
        ]}
        onChange={(teamId: number | undefined) => {
          setQuery(prev => ({
            ...prev,
            teamId,
          }));
        }}
      />

      <div>
        当前状态：{overview.state.status}
      </div>
    </div>
  );
}

```

<p v-pre>这里的团队选项仅为演示。正式项目应该从后端获取当前用户有权查看的团队列表，不能把团队 101、102 写死。</p>

<p v-pre>而且前端只展示授权团队，并不等于后端可以省略权限检查。</p>

<p v-pre>当 <code>teamId</code> 为空时，后端必须返回当前用户<span><strong>全部授权团队范围内</strong></span>的数据，而不是默认全公司数据。</p>

##### 图表之间如何联动？

<p v-pre>例如主管点击团队 B：</p>

<p v-pre><span><strong>团队柱状图点击：teamId = 102</strong></span></p>

<p v-pre><span><strong>Dashboard 更新共享 query</strong></span></p>

<p v-pre><span><strong>KPI 重新请求</strong></span></p>

<p v-pre>团队 B 总览</p>

<p v-pre><span><strong>趋势重新请求</strong></span></p>

<p v-pre>团队 B 趋势</p>

#### 四、ECharts 点击事件与明细下钻

<p v-pre>ECharts 支持 <code>click</code> 事件。</p>

<p v-pre>我们可以让用户点击团队柱状图，打开该团队的售后明细。</p>

##### 1. 团队图表组件

<p v-pre><code>src/components/TeamChart.tsx</code></p>

<p v-pre><div>TypeScript</div></p>

```typescript

import ReactECharts from "echarts-for-react";

interface TeamItem {
  team_id: number;
  team_name: string;
  avg_resolution_minutes: number | null;
}

interface TeamChartProps {
  data: TeamItem[];
  onTeamClick: (teamId: number) => void;
}

export function TeamChart({
  data,
  onTeamClick,
}: TeamChartProps) {
  const chartData = data.filter(
    (item): item is TeamItem & {
      avg_resolution_minutes: number;
    } => item.avg_resolution_minutes !== null
  );

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    xAxis: {
      type: "category",
      data: chartData.map(item => item.team_name),
    },
    yAxis: {
      type: "value",
      name: "分钟",
    },
    series: [
      {
        name: "平均解决时长",
        type: "bar",
        data: chartData.map(
          item => item.avg_resolution_minutes
        ),
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      onEvents={{
        click: (params: { dataIndex: number }) => {
          const team = chartData[params.dataIndex];

          if (team) {
            onTeamClick(team.team_id);
          }
        },
      }}
      style={{ height: 320 }}
    />
  );
}

```

<p v-pre>注意，我们没有通过 <code>team_name</code> 查询团队。</p>

<p v-pre>原因是：</p>

<ul v-pre><li><div><div><p>团队名称可能重复。</p></div></div></li><li><div><div><p>团队名称可能修改。</p></div></div></li><li><div><div><p>团队 ID 才是稳定的业务标识。</p></div></div></li></ul>

##### 2. 点击后打开明细抽屉

<p v-pre>使用 Ant Design 的 <code>Drawer</code>。</p>

<p v-pre><div>TypeScript</div></p>

```typescript

import { useState } from "react";
import { Drawer } from "antd";

import { TeamChart } from "./TeamChart";

interface TeamItem {
  team_id: number;
  team_name: string;
  avg_resolution_minutes: number | null;
}

export function TeamAnalysis({
  teams,
}: {
  teams: TeamItem[];
}) {
  const [selectedTeamId, setSelectedTeamId] =
    useState<number | null>(null);

  return (
    <>
      <TeamChart
        data={teams}
        onTeamClick={setSelectedTeamId}
      />

      <Drawer
        title={`团队 ${selectedTeamId ?? ""} 售后明细`}
        open={selectedTeamId !== null}
        onClose={() => setSelectedTeamId(null)}
        width={720}
        destroyOnHidden
      >
        {selectedTeamId !== null && (
          <div>
            当前团队：{selectedTeamId}
            {/* 这里挂载真实的订单明细组件 */}
          </div>
        )}
      </Drawer>
    </>
  );
}

```

<p v-pre>到这里，我们已经完成了“点击柱状图 → 打开抽屉”的交互骨架。</p>

<p v-pre>但真实明细还需要调用：</p>

<p v-pre><code>GET /api/v1/aftersales/orders</code></p>

<p v-pre>例如：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>/api/v1/aftersales/orders   ?team_id=102   &amp;start_date=2026-11-01   &amp;end_date=2026-11-20   &amp;date_basis=resolved_at   &amp;page=1   &amp;page_size=20</span></code></div></p>

<p v-pre>这里特意增加了 <code>date_basis=resolved_at</code>。</p>

<p v-pre>因为我们点击的是“平均解决时长”图表，必须下钻到<span><strong>同一统计日期口径</strong></span>下的已解决售后申请。</p>

<p v-pre>如果图表按解决日期统计，明细却按创建日期查询，就可能出现图表和明细数量对不上的问题。</p>

<p v-pre>这个 <code>date_basis</code> 参数属于建议扩展的 API 契约，需要后端明确允许值并实现校验，不能只在前端增加参数。</p>

<p v-pre>另外，若团队指标是按照处理事件、责任时长或多团队参与口径计算，明细必须遵循相同的归属规则，不能简单按订单当前所属团队筛选。</p>

#### 五、React 看板自动化测试

<p v-pre>我们使用：</p>

<ul v-pre><li><div><div><p>Vitest：运行测试。</p></div></div></li><li><div><div><p>React Testing Library：测试组件行为。</p></div></div></li><li><div><div><p>MSW：模拟 HTTP 接口。</p></div></div></li></ul>

<p v-pre>安装依赖：</p>

<p v-pre><div>Bash</div></p>

```bash
npm install -D vitest jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  msw
```

##### 1. 配置测试环境

<p v-pre>在 <code>vite.config.ts</code> 中添加测试配置：</p>

<p v-pre><div>TypeScript</div></p>

```typescript

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8000",
    },
  },
});

```

<p v-pre><code>src/test/setup.ts</code>：</p>

<p v-pre><div>TypeScript</div></p>

```typescript
import "@testing-library/jest-dom/vitest";
```

<p v-pre>在 <code>package.json</code> 中增加：</p>

<p v-pre><div>JSON</div></p>

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

<p v-pre>将这些脚本合并进已有的 <code>scripts</code>，不要覆盖原有的 <code>dev</code> 和 <code>build</code>。</p>

##### 2. 测试团队筛选是否更新

<p v-pre>先从最简单、最稳定的组件测试开始。</p>

<p v-pre><code>src/components/TeamFilter.tsx</code></p>

<p v-pre><div>TypeScript</div></p>

```typescript

import { Select } from "antd";

interface TeamFilterProps {
  value?: number;
  onChange: (teamId?: number) => void;
}

export function TeamFilter({
  value,
  onChange,
}: TeamFilterProps) {
  return (
    <Select
      aria-label="团队筛选"
      value={value}
      onChange={onChange}
      style={{ width: 200 }}
      placeholder="全部授权团队"
      options={[
        { value: 101, label: "团队 A" },
        { value: 102, label: "团队 B" },
      ]}
    />
  );
}

```

<p v-pre>对应测试：</p>

<p v-pre><div>TypeScript</div></p>

```typescript

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TeamFilter } from "./TeamFilter";

describe("TeamFilter", () => {
  it("选择团队B时返回团队ID 102", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TeamFilter onChange={onChange} />
    );

    await user.click(
      screen.getByRole("combobox", {
        name: "团队筛选",
      })
    );

    await user.click(
      await screen.findByText("团队 B")
    );

    expect(onChange).toHaveBeenCalledWith(
      102,
      expect.anything()
    );
  });
});

```

<p v-pre>这里要注意，Ant Design 的 Select 是封装组件，具体事件参数和测试环境行为需要按所用版本验证。上面的示例用于说明测试思路。</p>

##### 3. 请求竞态测试应该验证什么？

<p v-pre>这是本节最有价值的测试。</p>

<p v-pre>我们不应该只测试“是否调用了 <code>abort()</code>”。</p>

<p v-pre>真正要验证的是：</p>

<p v-pre><span><strong>即使旧请求最终返回，页面仍然只能显示最新筛选条件对应的数据。</strong></span></p>

<p v-pre>推荐构造两个可控的 Promise：</p>

<p v-pre><span><strong>模拟请求时序</strong></span></p>

<p v-pre>测试场景</p>

<p v-pre>请求 A：团队 101</p>

<p v-pre><div>先发出，后返回</div></p>

<p v-pre>请求 B：团队 102</p>

<p v-pre><div>后发出，先返回</div></p>

<p v-pre><span><strong>最终页面必须显示团队 102</strong></span></p>

<p v-pre>即使请求 A 在请求 B 之后才完成，也不能覆盖 B 的结果。</p>

<p v-pre>使用 <code>vi.mock()</code> 模拟 <code>getOverview</code>，并通过 <code>rerender()</code> 切换 Hook 的查询参数。测试过程中先让 B 的 Promise 完成，再让 A 完成，最后断言仍然是 B 的数据。</p>

<p v-pre>这样比单纯检查取消函数更接近真实业务要求。</p>

#### 六、最终自动化测试矩阵

<table v-pre><tbody><tr><th><p>编号</p></th><th><p>测试场景</p></th><th><p>预期结果</p></th></tr><tr><td><p>FE01</p></td><td><p>首次进入页面</p></td><td><p>显示 Loading</p></td></tr><tr><td><p>FE02</p></td><td><p>API 正常返回</p></td><td><p>KPI 显示正确</p></td></tr><tr><td><p>FE03</p></td><td><p>API 返回空数据</p></td><td><p>显示 Empty</p></td></tr><tr><td><p>FE04</p></td><td><p>API 请求失败</p></td><td><p>显示 Error</p></td></tr><tr><td><p>FE05</p></td><td><p>点击重试</p></td><td><p>重新请求 API</p></td></tr><tr><td><p>FE06</p></td><td><p>快速切换团队</p></td><td><p>旧响应不覆盖新数据</p></td></tr><tr><td><p>FE07</p></td><td><p>日期筛选变化</p></td><td><p>KPI 和图表同步更新</p></td></tr><tr><td><p>FE08</p></td><td><p>点击团队柱状图</p></td><td><p>打开对应团队明细</p></td></tr><tr><td><p>FE09</p></td><td><p>关闭明细抽屉</p></td><td><p>清除当前下钻状态</p></td></tr><tr><td><p>FE10</p></td><td><p>无权限团队</p></td><td><p>不展示受限数据，API 返回 403</p></td></tr><tr><td><p>FE11</p></td><td><p>平均时长为 null</p></td><td><p>显示“—”</p></td></tr><tr><td><p>FE12</p></td><td><p>SLA 超时率为 0</p></td><td><p>正确显示 0.0%</p></td></tr></tbody></table>

<p v-pre>特别提醒：FE10 的前端测试不能替代后端权限测试。真正的数据隔离必须由 FastAPI 和 SQL 查询保证。</p>

#### 七、第六课阶段总结

<p v-pre>React 异步状态管理</p>

<p v-pre>useEffect 数据请求</p>

<p v-pre>Loading / Error / Empty 处理</p>

<p v-pre>AbortController 请求取消</p>

<p v-pre>请求序号竞态保护</p>

<p v-pre>团队筛选与共享查询条件</p>

<p v-pre>ECharts 点击事件与明细下钻</p>

<p v-pre>Vitest 自动化测试设计</p>

<p v-pre>真实接口联调</p>

<p v-pre>实际执行测试与验收</p>

<p v-pre>目前完成的是<span><strong>核心原理学习和代码示例设计</strong></span>。真实 API 联调、完整测试用例和浏览器验收仍需要在项目环境中执行。</p>

### 八、第六课实战问题4：如何保证图表下钻数据一致？

<p v-pre>假设：</p>

<p v-pre>售后主管查看团队 B 在 11 月 1 日至 11 月 20 日的平均解决时长。</p>

<p v-pre>图表显示：</p>

<p v-pre><span><strong>团队 B：平均解决时长 76 分钟。</strong></span></p>

<p v-pre>主管点击柱状图后，打开售后订单明细。</p>

<p v-pre>但是他发现，明细里有一些订单是在 10 月创建、11 月解决的。</p>

<p v-pre>你认为系统应该怎么处理？</p>

<p v-pre><div><label>A. 排除这些订单，因为它们不是11月创建的。</label></div><div><label>B. 保留这些订单，因为平均解决时长按解决日期统计，下钻也应该使用相同口径。</label></div><div><label>C. 把所有订单的创建日期改成11月，方便统计。</label></div><div><label>D. 不需要保证图表和明细口径一致，只要都能展示数据即可。</label></div></p>

<p v-pre><span><strong>请说明你的理由</strong></span></p>

```text
图表与明细应该遵守相同的统计口径
```

<p v-pre><span class="interaction"><span>提交答案，进入第六课验收</span></span></p>

<p v-pre>这道题不仅考察 React 和 ECharts，还会把你前面学过的 <span><strong>业务指标口径、ADS 数据建模、API 契约和前端下钻</strong></span> 串联起来。</p>

<p v-pre>真正成熟的数据看板，需要做到：<span><strong>图表看得懂、数据查得准、问题追得下去。</strong></span></p>

## 第 34 轮　看板评审、前后端联调与项目验收 {#turn-34}

**你的提问或作答**

<div v-pre><div><div><div><div><div><div><div><div><div>第六课实战问题4，我选择：B。理由：图表与明细应该遵守相同的统计口径。请评价我的图表下钻口径设计，并带我完成第六课最终看板设计评审、前后端联调方案与验收。</div></div></div></div></div></div></div></div></div></div>

**讲解与讲评**

### 第六课收官：数据看板设计评审、前后端联调与项目验收

<p v-pre><div>实战问题4：回答正确</div></p>

<p v-pre>你选择 <span><strong>B：保留这些订单，因为平均解决时长按解决日期统计，下钻也使用相同口径。</strong></span></p>

<p v-pre>你的理由是：</p>

<blockquote v-pre><p>图表与明细应该遵守相同的统计口径。</p></blockquote>

<p v-pre>这个判断非常正确，而且这是数据分析系统中非常重要的设计原则：</p>

<p v-pre><span><strong>图表中的指标必须能够追溯到构成该指标的明细数据。</strong></span></p>

#### 一、评价你的图表下钻设计 {#dashboard-drilldown-review}

<p v-pre>假设团队 B 在 11 月 1 日至 11 月 20 日：</p>

<ul v-pre><li><div><div><p>解决订单：100 单。</p></div></div></li><li><div><div><p>总解决时长：7,600 分钟。</p></div></div></li><li><div><div><p>平均解决时长：76 分钟。</p></div></div></li></ul>

<p v-pre>计算公式：</p>

<p v-pre><div><span><span><span>平均解决时长=总解决时长已解决订单数平均解决时长 = \frac{总解决时长}{已解决订单数}</span></span></span></div><div><span><span><span>76=760010076 = \frac{7600}{100}</span></span></span></div></p>

<p v-pre>现在主管点击图表，查看这 100 单。</p>

<p v-pre>其中可能存在：</p>

<table v-pre><tbody><tr><th><p>售后单号</p></th><th><p>创建日期</p></th><th><p>解决日期</p></th><th><p>解决时长</p></th></tr><tr><td><p>AS001</p></td><td><p>10月28日</p></td><td><p>11月2日</p></td><td><p>60分钟</p></td></tr><tr><td><p>AS002</p></td><td><p>11月1日</p></td><td><p>11月3日</p></td><td><p>80分钟</p></td></tr><tr><td><p>AS003</p></td><td><p>11月5日</p></td><td><p>11月8日</p></td><td><p>90分钟</p></td></tr><tr><td><p>AS004</p></td><td><p>10月30日</p></td><td><p>11月10日</p></td><td><p>120分钟</p></td></tr></tbody></table>

<p v-pre>AS001 和 AS004 虽然在 10 月创建，但在 11 月解决，因此应该进入 11 月的解决时长统计。</p>

<p v-pre>如果下钻时按照创建日期过滤，就会出现：</p>

<ul v-pre><li><div><div><p>图表统计了 100 单。</p></div></div></li><li><div><div><p>明细只能找到 80 单。</p></div></div></li><li><div><div><p>主管无法核对剩余 20 单。</p></div></div></li><li><div><div><p>图表和明细失去一致性。</p></div></div></li></ul>

<p v-pre>这就是典型的统计口径不一致。</p>

##### 需要进一步掌握的一个概念：指标可追溯性

<table v-pre><tbody><tr><th><p>指标</p></th><th><p>图表统计条件</p></th><th><p>明细下钻条件</p></th></tr><tr><td><p>新增售后申请量</p></td><td><p><code>created_at</code></p></td><td><p><code>created_at</code></p></td></tr><tr><td><p>已解决申请量</p></td><td><p><code>resolved_at</code></p></td><td><p><code>resolved_at</code></p></td></tr><tr><td><p>平均解决时长</p></td><td><p><code>resolved_at</code></p></td><td><p><code>resolved_at</code></p></td></tr><tr><td><p>SLA 超时率</p></td><td><p>SLA 到期日期</p></td><td><p>SLA 到期日期</p></td></tr><tr><td><p>投诉数量</p></td><td><p><code>complaint_at</code></p></td><td><p><code>complaint_at</code></p></td></tr></tbody></table>

<p v-pre>另外，平均解决时长的明细还要使用与汇总指标完全相同的时长计算规则，例如是否扣除暂停等待时间、是否计算重复打开的处理周期。</p>

<p v-pre><span><strong>我的评价：你的思路已经从页面展示层上升到了数据产品设计层。</strong></span></p>

### 二、第六课最终看板设计评审

<p v-pre>我们正式确定售后分析系统 V1 首页结构。</p>

#### 售后经营分析

<p v-pre>Aftersales Analytics Dashboard</p>

<p v-pre><div>V1 页面方案</div></p>

<p v-pre>统计日期：11月1日—11月20日</p>

<p v-pre>模拟数据</p>

<p v-pre>新增售后申请</p>

### 1,280

<p v-pre>+8.2% · 较上期</p>

<p v-pre>已解决申请</p>

### 1,150

<p v-pre>+5.6% · 较上期</p>

<p v-pre>平均解决时长</p>

### 58.2分钟

<p v-pre>+12.4% · 较上期</p>

<p v-pre>SLA超时率</p>

### 12.5%

<p v-pre>+3.1个百分点 · 较上期</p>

<p v-pre><span><strong>售后申请趋势</strong></span></p>

<p v-pre><div><span class="interaction"><span>新增申请</span></span><span class="interaction"><span>已解决</span></span></div></p>

<ul v-pre><li>11-01: 新增申请 48, 已解决 42</li><li>11-03: 新增申请 56, 已解决 49</li><li>11-05: 新增申请 51, 已解决 48</li><li>11-07: 新增申请 67, 已解决 58</li><li>11-09: 新增申请 60, 已解决 55</li><li>11-11: 新增申请 91, 已解决 73</li><li>11-13: 新增申请 78, 已解决 75</li><li>11-15: 新增申请 65, 已解决 68</li><li>11-17: 新增申请 72, 已解决 70</li><li>11-20: 新增申请 84, 已解决 76</li></ul>

<p v-pre><span><strong>团队平均解决时长</strong></span></p>

<ul v-pre><li>团队A: 平均解决时长 42分钟</li><li>团队B: 平均解决时长 76分钟</li><li>团队C: 平均解决时长 55分钟</li><li>团队D: 平均解决时长 63分钟</li></ul>

<p v-pre><span>点击团队柱形可进入对应团队明细分析。此处为静态展示。</span></p>

<p v-pre><span><strong>异常问题入口</strong></span></p>

<p v-pre><span><strong>团队 B 解决时长偏高</strong></span></p>

<p v-pre>平均解决时长 76 分钟</p>

<p v-pre><div>待核查</div></p>

<p v-pre><span><strong>SLA 超时率上升</strong></span></p>

<p v-pre>较上一统计周期增加 3.1 个百分点</p>

<p v-pre><div>待核查</div></p>

<p v-pre><span>页面结构示意。图表数据为教学模拟数据，不代表真实业务结果。</span></p>

#### 1. 页面布局评审

<table v-pre><tbody><tr><th><p>页面区域</p></th><th><p>主要目的</p></th><th><p>设计评审</p></th></tr><tr><td><p>页面顶部</p></td><td><p>日期、团队、筛选条件</p></td><td><p>通过</p></td></tr><tr><td><p>第一层 KPI</p></td><td><p>整体经营表现</p></td><td><p>通过</p></td></tr><tr><td><p>第二层趋势</p></td><td><p>发现指标变化</p></td><td><p>通过</p></td></tr><tr><td><p>第三层团队对比</p></td><td><p>定位异常团队</p></td><td><p>通过</p></td></tr><tr><td><p>第四层异常入口</p></td><td><p>引导业务行动</p></td><td><p>通过</p></td></tr><tr><td><p>明细下钻</p></td><td><p>核验问题原因</p></td><td><p>通过</p></td></tr></tbody></table>

#### 2. 我建议增加三个设计细节

<p v-pre><span><strong>第一：显示数据更新时间。</strong></span></p>

<p v-pre>例如：</p>

<p v-pre><code>数据截至：2026-11-21 17:00</code></p>

<p v-pre>避免用户把每天更新一次的汇总数据误认为实时数据。</p>

<p v-pre><span><strong>第二：显示指标解释。</strong></span></p>

<p v-pre>鼠标悬停在平均解决时长上时，展示：</p>

<blockquote v-pre><p>统计期间内已解决售后申请的平均解决时长，按照解决时间归属统计日期。</p></blockquote>

<p v-pre><span><strong>第三：保留筛选条件。</strong></span></p>

<p v-pre>从团队 B 下钻到订单明细，再返回看板时，日期和团队筛选条件应该保留。</p>

<p v-pre>这会明显改善实际使用体验。</p>

### 三、前后端联调方案

<p v-pre>现在进入真正的工程环节：让 React 页面连接 FastAPI，再连接 MySQL ADS。</p>

#### 1. 确定前后端接口契约

<p v-pre>建议最终确定以下接口。</p>

<table v-pre><tbody><tr><th><p>API</p></th><th><p>用途</p></th><th><p>查询数据</p></th></tr><tr><td><p><code>GET /api/v1/aftersales/overview</code></p></td><td><p>KPI 总览</p></td><td><p>ADS</p></td></tr><tr><td><p><code>GET /api/v1/aftersales/trends</code></p></td><td><p>业务趋势</p></td><td><p>ADS</p></td></tr><tr><td><p><code>GET /api/v1/aftersales/teams</code></p></td><td><p>团队对比</p></td><td><p>ADS</p></td></tr><tr><td><p><code>GET /api/v1/aftersales/orders</code></p></td><td><p>售后订单下钻</p></td><td><p>DWD</p></td></tr></tbody></table>

##### 统一查询参数

<p v-pre><div>HTTP</div></p>

<p v-pre><div><code><span><span>start_date=2026-11-01</span> <span>end_date=2026-11-20</span> <span>team_id=102</span></span></code></div></p>

<p v-pre>其中 <code>team_id</code> 是可选参数。</p>

<p v-pre>正式开发还需要统一分页参数：</p>

<p v-pre><div>HTTP</div></p>

<p v-pre><div><code><span><span>page=1</span> <span>page_size=20</span></span></code></div></p>

<p v-pre>明细接口增加统计口径参数：</p>

<p v-pre><div>HTTP</div></p>

<p v-pre><div><code><span><span>date_basis=resolved_at</span></span></code></div></p>

<p v-pre>建议支持以下值：</p>

<table v-pre><tbody><tr><th><p>date_basis</p></th><th><p>对应时间字段</p></th></tr><tr><td><p><code>created_at</code></p></td><td><p>售后申请创建时间</p></td></tr><tr><td><p><code>resolved_at</code></p></td><td><p>售后解决时间</p></td></tr><tr><td><p><code>sla_due_at</code></p></td><td><p>SLA 到期时间</p></td></tr><tr><td><p><code>complaint_at</code></p></td><td><p>投诉发生时间</p></td></tr></tbody></table>

<p v-pre>后端必须对白名单参数进行校验，不能允许前端传入任意数据库字段名称。</p>

#### 2. 统一响应格式

<p v-pre>建议所有接口统一返回：</p>

<p v-pre><div>JSON</div></p>

```json

{
  "code": 0,
  "message": "success",
  "data": {
    "items": [],
    "total": 0,
    "data_as_of": "2026-11-21T17:00:00+08:00"
  }
}

```

<p v-pre>这里：</p>

<ul v-pre><li><div><div><p><code>code</code>：业务响应码。</p></div></div></li><li><div><div><p><code>message</code>：响应说明。</p></div></div></li><li><div><div><p><code>data</code>：业务数据。</p></div></div></li><li><div><div><p><code>total</code>：分页记录数，仅适用于分页接口。</p></div></div></li><li><div><div><p><code>data_as_of</code>：数据统计截至时间。</p></div></div></li></ul>

<p v-pre>实际项目中，KPI 总览和明细列表可以有不同的 <code>data</code> 结构，但外层协议保持一致。</p>

#### 3. 四个接口的数据流

<p v-pre><span><strong>React Dashboard</strong></span></p>

<p v-pre>共享日期、团队筛选状态</p>

<p v-pre><span><strong>Overview API</strong></span></p>

<p v-pre>KPI 卡片</p>

<p v-pre><span><strong>Trends API</strong></span></p>

<p v-pre>趋势图</p>

<p v-pre><span><strong>Teams API</strong></span></p>

<p v-pre>团队对比</p>

<p v-pre><span><strong>Orders API</strong></span></p>

<p v-pre>明细下钻</p>

<p v-pre><span><strong>FastAPI</strong></span></p>

<p v-pre>认证、授权、参数校验、指标查询</p>

<p v-pre><span><strong>MySQL ADS / DWD</strong></span></p>

<p v-pre>汇总指标与订单明细</p>

#### 4. 前端联调顺序

<p v-pre>不要一次性把四个接口全部接入。</p>

<p v-pre>建议按以下顺序推进：</p>

<ol v-pre><li><div><div><p><span><strong>先接入 Overview</strong></span></p><p>验证日期参数、KPI 字段、空值和权限。</p></div></div></li><li><div><div><p><span><strong>再接入 Trends</strong></span></p><p>验证日期连续性、趋势指标和图表数据映射。</p></div></div></li><li><div><div><p><span><strong>再接入 Teams</strong></span></p><p>验证团队 ID、平均值加权计算和团队筛选。</p></div></div></li><li><div><div><p><span><strong>最后接入 Orders</strong></span></p><p>验证点击图表、统计口径、分页和数据权限。</p></div></div></li></ol>

<p v-pre>这样一旦出现问题，可以快速判断是接口、数据还是前端映射导致的。</p>

### 四、图表下钻的完整业务流程

<p v-pre>我们把刚才的团队 B 场景完整串起来。</p>

<p v-pre>假设售后主管点击团队 B 的柱状图。</p>

#### 团队 B 下钻流程

<ol v-pre><li><div><div><p><span><strong>用户点击团队 B</strong></span></p><p>React 获取 <code>team_id=102</code>。</p></div></div></li><li><div><div><p><span><strong>保存下钻上下文</strong></span></p><p>保存开始日期、结束日期、团队 ID、指标类型。</p></div></div></li><li><div><div><p><span><strong>请求订单明细 API</strong></span></p><p>使用 <code>date_basis=resolved_at</code>。</p></div></div></li><li><div><div><p><span><strong>FastAPI 进行权限校验</strong></span></p><p>检查用户是否拥有团队 102 的访问权限。</p></div></div></li><li><div><div><p><span><strong>Repository 查询 DWD</strong></span></p><p>根据解决日期、团队归属和指标规则查询明细。</p></div></div></li><li><div><div><p><span><strong>Drawer 展示明细</strong></span></p><p>展示订单号、创建时间、解决时间、解决时长、处理状态。</p></div></div></li><li><div><div><p><span><strong>用户核验数据</strong></span></p><p>可以进一步进入单个售后申请的处理事件记录。</p></div></div></li></ol>

#### 一个重要的工程细节：统计快照

<p v-pre>假设团队 B 的平均解决时长是 76 分钟。</p>

<p v-pre>但是 10 分钟后，ETL 重新计算了历史数据，结果变成 72 分钟。</p>

<p v-pre>此时可能出现图表显示 76 分钟、明细计算结果为 72 分钟的问题。</p>

<p v-pre>建议为指标数据增加版本或快照标识，例如：</p>

<p v-pre><div>纯文本</div></p>

<p v-pre><div><code><span>data_version = 42</span></code></div></p>

<p v-pre>图表查询时返回：</p>

<p v-pre><div>JSON</div></p>

```json
{
  "data_version": 42
}
```

<p v-pre>下钻时传入：</p>

<p v-pre><div>HTTP</div></p>

<p v-pre><div><code><span><span>data_version=42</span></span></code></div></p>

<p v-pre>但这里不能仅仅让前端传入版本号就信任它。后端需要验证该版本仍可用，并且能够查询对应的明细快照。</p>

<p v-pre>如果系统不保留历史明细快照，就应该明确采用当前数据重算，并在页面显示数据更新时间，而不是承诺历史快照级别的一致性。</p>

<p v-pre>对于售后分析 MVP，我建议先做到：</p>

<ul v-pre><li><div><div><p>汇总和明细采用同一统计口径。</p></div></div></li><li><div><div><p>统一展示数据更新时间。</p></div></div></li><li><div><div><p>对账时能够定位 ADS 对应的明细集合。</p></div></div></li><li><div><div><p>后续再考虑完整的历史快照能力。</p></div></div></li></ul>

### 五、第六课最终开发验收

<p v-pre>下面是正式的项目验收清单。</p>

<p v-pre><span><strong>售后分析看板 V1 验收</strong></span></p>

### 0/20

<p v-pre><span><strong>页面设计</strong></span></p>

<p v-pre><label><span><p>D01 · KPI 总览布局完成</p></span></label></p>

<p v-pre><label><span><p>D02 · 趋势图与团队图表完成</p></span></label></p>

<p v-pre><label><span><p>D03 · 异常入口和下钻入口完成</p></span></label></p>

<p v-pre><label><span><p>D04 · 指标解释和数据更新时间完成</p></span></label></p>

<p v-pre><span><strong>前后端联调</strong></span></p>

<p v-pre><label><span><p>I01 · Overview API 联调成功</p></span></label></p>

<p v-pre><label><span><p>I02 · Trends API 联调成功</p></span></label></p>

<p v-pre><label><span><p>I03 · Teams API 联调成功</p></span></label></p>

<p v-pre><label><span><p>I04 · Orders API 联调成功</p></span></label></p>

<p v-pre><span><strong>交互与权限</strong></span></p>

<p v-pre><label><span><p>U01 · 日期筛选联动正常</p></span></label></p>

<p v-pre><label><span><p>U02 · 团队筛选联动正常</p></span></label></p>

<p v-pre><label><span><p>U03 · 旧请求不能覆盖新请求</p></span></label></p>

<p v-pre><label><span><p>U04 · 图表点击正确打开明细</p></span></label></p>

<p v-pre><label><span><p>U05 · 未授权团队无法访问</p></span></label></p>

<p v-pre><label><span><p>U06 · 返回看板后保留筛选条件</p></span></label></p>

<p v-pre><span><strong>质量与验收</strong></span></p>

<p v-pre><label><span><p>Q01 · Loading / Error / Empty 正常</p></span></label></p>

<p v-pre><label><span><p>Q02 · 指标与 SQL 计算结果一致</p></span></label></p>

<p v-pre><label><span><p>Q03 · 图表和明细数量可核对</p></span></label></p>

<p v-pre><label><span><p>Q04 · 分页及排序正确</p></span></label></p>

<p v-pre><label><span><p>Q05 · 浏览器兼容与响应式布局通过</p></span></label></p>

<p v-pre><label><span><p>Q06 · 自动化测试全部通过</p></span></label></p>

<p v-pre><span>这是一份项目验收记录工具。只有在实际开发、联调和测试通过后，才应勾选对应项目。</span></p>

#### 六、项目最终评审结果

#### 售后数据分析看板 V1

<p v-pre><span><strong>需求与页面设计</strong></span></p>

<p v-pre><div>学习评审通过</div></p>

<p v-pre><span><strong>React 组件方案</strong></span></p>

<p v-pre><div>学习评审通过</div></p>

<p v-pre><span><strong>前后端接口契约</strong></span></p>

<p v-pre><div>方案已确定</div></p>

<p v-pre><span><strong>图表下钻设计</strong></span></p>

<p v-pre><div>方案已确定</div></p>

<p v-pre><span><strong>实际开发联调</strong></span></p>

<p v-pre><div>待执行</div></p>

<p v-pre><span><strong>自动化测试</strong></span></p>

<p v-pre><div>待执行</div></p>

<p v-pre><span><strong>上线验收</strong></span></p>

<p v-pre><div>待执行</div></p>

<p v-pre>我的建议是：现在不要继续无限扩展首页功能。先把 V1 的四个核心页面能力做出来，并通过验收。</p>

### 七、六课完整学习成果回顾

<p v-pre>你已经完成了从业务需求到前端看板的六个阶段。</p>

<table v-pre><tbody><tr><th><p>课程</p></th><th><p>核心学习内容</p></th><th><p>主要成果</p></th></tr><tr><td><p>第一课</p></td><td><p>数据分析系统基础</p></td><td><p>业务分析目标</p></td></tr><tr><td><p>第二课</p></td><td><p>售后业务与指标设计</p></td><td><p>指标体系、PRD</p></td></tr><tr><td><p>第三课</p></td><td><p>数据架构与数据建模</p></td><td><p>ER 图、MySQL 表结构</p></td></tr><tr><td><p>第四课</p></td><td><p>ETL 数据开发</p></td><td><p>Python、SQLAlchemy、Celery</p></td></tr><tr><td><p>第五课</p></td><td><p>数据分析 API</p></td><td><p>FastAPI、JWT、RBAC</p></td></tr><tr><td><p>第六课</p></td><td><p>数据看板开发</p></td><td><p>React、TypeScript、ECharts</p></td></tr></tbody></table>

#### 你已经建立的数据分析系统完整思维

<p v-pre><span><strong>业务问题</strong></span></p>

<p v-pre>发现问题、定位原因、改善问题</p>

<p v-pre><span><strong>指标与数据模型</strong></span></p>

<p v-pre>事实表、维度表、统计口径</p>

<p v-pre><span><strong>ETL 数据加工</strong></span></p>

<p v-pre>增量同步、数据清洗、指标汇总</p>

<p v-pre><span><strong>FastAPI 数据服务</strong></span></p>

<p v-pre>身份认证、权限控制、指标查询</p>

<p v-pre><span><strong>React 数据看板</strong></span></p>

<p v-pre>KPI、趋势、对比、下钻</p>

<p v-pre><span><strong>业务决策与改善</strong></span></p>

<p v-pre>核验问题、制定措施、持续跟踪</p>

#### 八、第七课：数据验证、测试与质量保障

<p v-pre>下一课不再重点学习新框架，而是学习如何证明系统是正确的。</p>

<p v-pre>主要内容：</p>

<ol v-pre><li><div><div><p>如何验证 ETL 数据完整性。</p></div></div></li><li><div><div><p>如何核对 ADS 指标与 SQL 计算结果。</p></div></div></li><li><div><div><p>如何设计数据质量规则。</p></div></div></li><li><div><div><p>如何测试 API 权限与业务口径。</p></div></div></li><li><div><div><p>如何测试 React 图表和交互。</p></div></div></li><li><div><div><p>如何建立端到端测试。</p></div></div></li><li><div><div><p>如何设计上线验收标准。</p></div></div></li></ol>

<p v-pre><span><strong>我特别建议你把第七课作为重点。</strong></span></p>

<p v-pre>因为你已经学会了如何设计系统、加工数据和展示图表。下一步需要具备的是：能够证明数据可信、系统可靠、业务结果正确。</p>

<p v-pre>最终目标不是做出一个漂亮的售后看板，而是做出一个售后主管可以真正依赖它来发现问题、定位原因和改善业务的数据分析系统。</p>
