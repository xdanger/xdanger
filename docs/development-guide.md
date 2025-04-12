# 开发指南

本文档提供了在本项目上进行开发的详细指导。

## 开发环境设置

### 前提条件

- Node.js 20+
- Yarn 1.22+
- Git

### 初始设置

克隆仓库：

```bash
git clone https://github.com/xdanger/xdanger.github.io.git
cd xdanger.github.io
```

安装依赖：

```bash
yarn install
```

启动开发服务器：

```bash
npm run dev
```

## 项目结构详解

### 核心目录

- **app/**: Next.js App Router 页面和布局
  - **[...slug]/**: 动态路由处理博客文章页面
  - **layout.tsx**: 全局布局，包含头部、主题提供者等
  - **page.tsx**: 首页，展示个人介绍和文章列表

- **_posts/**: 按年份组织的博客文章
  - 新文章应按 `YYYY/MM/YYYY-MM-DD-title.md` 格式添加

- **components/**: UI 组件
  - **ui/**: shadcn/ui 基础组件
  - 其他自定义组件

- **lib/**: 工具函数
  - **posts.ts**: 文章处理和获取逻辑
  - **fonts.ts**: 字体配置
  - **utils.ts**: 通用工具函数

## 添加新内容

### 创建新博客文章

1. 在 `_posts/{year}/{month}/` 目录中创建新的 Markdown 文件
2. 文件名格式：`YYYY-MM-DD-slug.md`
3. 添加前置元数据：

```markdown
---
title: 文章标题
date: YYYY-MM-DD
---

文章内容...
```

重新构建项目以生成新页面

### 添加新组件

1. 在 `components/` 目录中创建新文件
2. 命名使用 PascalCase (如 `NewComponent.tsx`)
3. 使用类型化的函数组件：

```tsx
interface NewComponentProps {
  // 属性定义
}

export function NewComponent({ prop1, prop2 }: NewComponentProps) {
  // 组件逻辑
  return (
    // JSX
  );
}
```

## 样式指南

项目使用 Tailwind CSS 进行样式设计，结合 shadcn/ui 组件库。

### Tailwind 用法

- 优先使用 Tailwind 类进行样式设计
- 对于重复的类组合，使用 `tailwind-merge` 工具

### 主题设计

- 项目使用 CSS 变量定义主题颜色，可在 `globals.css` 中找到
- 使用 `dark:` 前缀为暗色模式定义样式
- 使用 `next-themes` 提供的钩子获取/设置当前主题

## 博客文章处理

文章处理流程：

1. 从 `_posts` 目录收集所有 Markdown 和 HTML 文件
2. 使用 gray-matter 解析前置元数据
3. 使用 remark 将 Markdown 转换为 HTML
4. 通过动态路由 `[...slug]` 渲染文章页面

### 添加新文章格式支持

如果需要支持新的文章格式，请修改 `lib/posts.ts` 中的处理逻辑。

## 构建与部署

### 构建流程

项目使用 Next.js 构建系统，并有自定义的后构建脚本：

1. `next build` 生成优化的生产构建
2. `scripts/post-build.js` 执行额外的构建后处理
3. 构建输出位于 `/out` 目录，同步到 `/_sites`

### 字体处理

字体处理需特殊注意：

1. 使用 `npm run build:fonts` 重新构建字体资源
2. 项目使用 LXGW Wenkai Screen Webfont 和其他网络字体

## 调试技巧

- 使用 `NODE_OPTIONS='--inspect'` 启用 Node.js 调试器
- 使用 Chrome DevTools 连接到 `chrome://inspect`
- 在代码中添加 `console.log()` 或 `debugger` 语句

## 性能优化

- 使用 `next/image` 优化图片加载
- 对大型列表使用虚拟化或分页
- 利用 Next.js 静态生成功能优化页面加载时间

## 测试

目前项目没有自动化测试。推荐添加：

- Jest 单元测试
- React Testing Library 组件测试
- Cypress 端到端测试
