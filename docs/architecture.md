# 项目架构

本文档详细说明了项目的架构设计、关键组件及其交互方式。

## 整体架构

该项目采用 Next.js 15 的 App Router 架构，这是一种基于文件系统的路由方法：

```plaintext
                  ┌─────────────────┐
                  │     Layout      │
                  │  (app/layout.tsx) │
                  └─────────────────┘
                          │
                 ┌────────┴────────┐
                 │                 │
        ┌────────▼─────┐   ┌───────▼───────┐
        │   Home Page  │   │   Blog Post   │
        │ (app/page.tsx) │   │(app/[...slug]/page.tsx)│
        └────────┬─────┘   └───────┬───────┘
                 │                 │
       ┌─────────┴─────────┐      │
       │                   │      │
┌──────▼──────┐   ┌────────▼────┐ │
│  Header     │   │  Post List  │ │
│(header.tsx)  │   │(post-list.tsx)│ │
└─────────────┘   └──────┬─────┘ │
                         │       │
                  ┌──────▼────┐  │
                  │Post Preview│  │
                  │(post-preview.tsx)│  │
                  └─────────────┘  │
                                   │
                                   │
                            ┌─────▼────┐
                            │ lib/posts │
                            │  (posts.ts) │
                            └─────┬────┘
                                  │
                                  ▼
                            ┌─────────┐
                            │ _posts/ │
                            │ (文章文件) │
                            └─────────┘
```

## 核心组件

### 1. 布局组件 (app/layout.tsx)

提供全局布局框架，包含：

- HTML 和 body 标签配置
- 主题提供者 (ThemeProvider)
- 字体配置
- 全局样式导入

### 2. 页面组件

#### 首页 (app/page.tsx)

- 显示个人简介
- 渲染文章列表组件

#### 博客文章页 (app/[...slug]/page.tsx)

- 动态路由处理各种文章 URL
- 根据 slug 获取并显示对应文章内容
- 处理元数据并设置页面标题

### 3. UI 组件

#### Header (components/header.tsx)

- 网站导航栏
- 主题切换按钮
- 品牌标识

#### PostList (components/post-list.tsx)

- 可滚动的文章列表
- 使用 react-intersection-observer 实现无限滚动
- 分类过滤功能

#### PostPreview (components/post-preview.tsx)

- 显示文章预览信息
- 包含标题、日期和简短描述
- 链接到完整文章页面

### 4. UI 库组件 (components/ui/)

shadcn/ui 组件集合，提供：

- 按钮、卡片、输入框等基本 UI 元素
- 导航组件
- 对话框、抽屉等交互组件
- 表格、数据显示组件

## 数据流

### 博客文章数据流

1. **数据源**: `_posts/` 目录中的 Markdown 和 HTML 文件
2. **处理层**: `lib/posts.ts` 中的函数处理文件
   - `getAllPosts()`: 获取所有文章元数据
   - `getPostBySlug()`: 获取特定文章内容
   - `markdownToHtml()`: 转换 Markdown 到 HTML
3. **显示层**:
   - 主页的 `PostList` 和 `PostPreview` 组件
   - 文章页面渲染完整内容

### 主题数据流

1. **存储**: 使用 localStorage 存储用户主题偏好
2. **管理**: `next-themes` 库处理主题切换逻辑
3. **应用**: `ThemeProvider` 向整个应用提供当前主题
4. **消费**: 各组件通过 CSS 变量和 Tailwind dark 类应用主题样式

## 渲染策略

项目采用混合渲染策略：

### 静态生成 (SSG)

- 博客文章页面使用静态生成提高性能
- 通过 `generateStaticParams()` 预生成所有文章路径
- 构建时生成静态 HTML 文件

### 客户端组件

- 交互组件（如主题切换器）使用客户端渲染
- 使用 'use client' 指令标记客户端组件

## 状态管理

项目采用简单的状态管理方法：

- 使用 React 内置的 useState 和 useReducer 管理组件状态
- 使用 React Context 共享少量全局状态
- 不使用额外的状态管理库

## 路由系统

Next.js App Router 提供基于文件系统的路由：

- `app/page.tsx` → 主页路由 (`/`)
- `app/[...slug]/page.tsx` → 捕获所有博客文章路由
- 动态路由参数从 `params` 对象中提取

## 错误处理

- `app/error.tsx` 提供全局错误边界
- `app/not-found.tsx` 处理 404 错误
- 使用 try/catch 块处理异步操作错误

## 性能优化

- 使用静态生成 (SSG) 优化页面加载时间
- 实现组件懒加载减少初始加载大小
- 图片优化使用 next/image
- 使用 intersection-observer 实现无限滚动优化

## 扩展性考虑

项目架构允许：

- 轻松添加新页面和路由
- 扩展博客功能（分类、标签等）
- 添加新的内容类型
- 集成搜索功能
- 添加国际化支持
