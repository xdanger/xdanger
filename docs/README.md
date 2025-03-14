# xdanger.xdanger.github.io 项目文档

这个文档提供了对 xdanger.xdanger.github.io 博客网站项目的全面概述。该项目是一个使用 Next.js 15 构建的个人博客网站，采用现代前端技术栈和最佳实践。

## 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [开发指南](#开发指南)
- [部署流程](#部署流程)
- [主要功能](#主要功能)

## 项目概述

这是一个个人博客网站，使用 Next.js 15 的 App Router 架构构建。网站支持多种格式的博客文章（Markdown 和 HTML），并提供响应式设计、暗/亮主题切换等现代功能。

## 技术栈

- **核心框架**：
  - React 19.0.0
  - Next.js 15.2.0 (使用 App Router)
  - TypeScript 5.7.3

- **样式**：
  - Tailwind CSS 4.0.9
  - tailwindcss-animate
  - class-variance-authority

- **UI 组件**：
  - shadcn/ui
  - Radix UI 组件库
  - lucide-react (图标)

- **主题**：
  - next-themes (主题切换)

- **内容处理**：
  - gray-matter (前置元数据解析)
  - remark 和 remark-html (Markdown 处理)

- **其他库**：
  - react-intersection-observer (无限滚动)
  - lxgw-wenkai-screen-webfont (字体)

## 项目结构

```
/
├── _posts/               # 博客文章 (按年份组织)
├── _sites/               # 输出的静态站点
├── app/                  # Next.js App Router 页面和布局
│   ├── [...slug]/        # 动态路由 (博客文章页面)
│   ├── lib/              # 应用特定的库文件
│   ├── error.tsx         # 错误处理组件
│   ├── layout.tsx        # 根布局组件
│   ├── page.tsx          # 主页
│   └── not-found.tsx     # 404 页面
├── components/           # 可复用 UI 组件
│   ├── ui/               # shadcn/ui 组件
│   ├── header.tsx        # 网站头部组件
│   ├── post-list.tsx     # 文章列表组件
│   ├── post-preview.tsx  # 文章预览组件
│   └── ...               # 其他组件
├── hooks/                # 自定义 React Hooks
├── lib/                  # 通用工具函数
│   ├── fonts.ts          # 字体配置
│   ├── posts.ts          # 文章处理函数
│   └── utils.ts          # 实用工具函数
├── public/               # 静态资源
├── scripts/              # 构建脚本
├── types/                # TypeScript 类型定义
└── docs/                 # 项目文档
```

## 开发指南

### 环境配置

1. 克隆仓库
2. 安装依赖:
   ```bash
   yarn install
   ```

### 常用命令

- **开发服务器**:
  ```bash
  npm run dev
  ```
  启动开发服务器，使用 Turbopack 和调试选项

- **构建项目**:
  ```bash
  npm run build
  ```
  构建生产版本的应用并运行 post-build 脚本

- **字体重建**:
  ```bash
  npm run build:fonts
  ```
  重新构建字体资源

- **启动生产服务器**:
  ```bash
  npm run start
  ```
  启动生产环境服务器

- **代码检查**:
  ```bash
  npm run lint
  ```
  运行 ESLint 检查代码质量

- **导出静态文件**:
  ```bash
  npm run export
  ```
  导出静态 HTML 文件

## 代码风格指南

- **导入顺序**: 先外部库，然后内部组件/工具
- **TypeScript**: 使用严格模式，通过接口/类型为 props 添加显式类型
- **命名约定**:
  - 组件: PascalCase
  - 函数/变量: camelCase
  - 文件: 与它们的导出使用相同的大小写 (组件用 PascalCase)
- **组件风格**: 使用带有类型注解的函数组件，在函数参数中解构 props
- **样式**: 使用 Tailwind CSS，结合 class-variance-authority 创建组件
- **错误处理**: 文件系统操作使用 try/catch，添加日志用于调试
- **路径别名**: 使用 `@/*` 导入别名引用项目文件
- **架构**: 遵循 Next.js App Router 模式，使用 page.tsx 组件

## 主要功能

### 博客系统

项目支持多种格式的博客文章，存储在 `_posts` 目录中，按年份组织。系统可以处理:

- Markdown 文章 (.md)
- HTML 文章 (.html)

文章处理流程:
1. 从文件路径生成 slug
2. 使用 gray-matter 提取前置元数据 (标题、日期等)
3. 处理 Markdown 内容 (使用 remark 和 remark-html)
4. 渲染带有适当布局的页面

### 主题切换

网站支持暗色和亮色主题切换，使用 next-themes 库实现。

### 响应式设计

使用 Tailwind CSS 实现移动端友好的响应式设计。

### 无限滚动

博客文章列表使用 react-intersection-observer 实现无限滚动功能。

## 部署流程

该项目可以部署为静态网站或使用 Next.js 服务器渲染。推荐的部署方式是:

1. 运行构建命令:
   ```bash
   npm run build
   ```

2. 静态部署选项:
   - 通过脚本同步到 `_sites` 目录
   - 使用 GitHub Pages 发布静态文件

3. 服务器端渲染部署:
   - 在服务器上运行 `npm run start` 启动生产服务器
   - 或者使用 Vercel/Netlify 等平台简化部署流程