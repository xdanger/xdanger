# xdanger.com

这是 [xdanger.com](https://www.xdanger.com/) 个人博客网站的源代码仓库，使用 [Astro](https://astro.build/) 框架构建。

## 项目概述

- 基于 [Astro](https://astro.build/) 框架构建的静态博客网站
- 使用 `bun` 作为包管理器和构建工具
- 支持 MDX 格式的博客文章和笔记
- 集成了 Tailwind CSS 进行样式管理
- 包含博客文章、笔记和标签页面

## Specifications

### 系统要求

- [Bun](https://bun.sh/) 1.2.10 或更高版本

### 安装依赖

```bash
bun install
```

### 开发命令

- `bun run dev` - 启动开发服务器
- `bun run build` - 构建生产版本
- `bun run preview` - 预览构建后的网站
- `bun run lint` - 运行代码及文档检查
- `bun run fix` - 格式化代码及文档

### 项目结构

- `_posts/` - 博客文章内容 (MDX 格式)
- `_notes/` - 笔记内容 (MDX 格式)
- `src/components/` - 组件
- `src/layouts/` - 页面布局
- `src/pages/` - 页面和路由
- `src/styles/` - 全局样式
- `src/utils/` - 工具函数
- `public/` - 静态资源文件

### URL 规则

本项目包含三种 URL 格式以保持向后兼容性：

1. MoveableType 时期的文章（发布日期 < `2013-05-31`）：

   - 文件路径：`src/content/post/YYYY/MM/DD/SEQ.mdx`
   - 生成的 URL：`/YYYY/MM/DD/SEQ.html`
   - 注意：不带 `.html` 后缀的 URL 将返回 404，这是预期行为

2. Jekyll 时期的文章 (`2013-05-31` <= 发布日期 < `2025-02-28`)：

   - 文件路径：`src/content/post/YYYY/MM/DD/title.mdx`
   - 生成的 URL：`/YYYY/MM/DD/title.html`（保持与原博客完全一致的 URL 格式）
   - 注意：不带 `.html` 后缀的 URL 将返回 404，这是预期行为

3. Astro 时期的文章 (`2025-02-28` <= 发布日期)：

   - 文件路径：`src/content/post/YYYY/MMDD-title.mdx`
   - 生成的 URL：`/YYYY/MMDD-title`（更简洁的新格式，不带`.html`后缀）

### 代码规范

- **代码文件**：使用 `pretty-quick && biome check --write` 修复并格式化
- **文档文件**：使用 `autocorrect --fix . && prettier --write` 修复并格式化

### 重要文件

- `MIGRATION.md` - 包含从 Next.js 迁移到 Astro 的完整过程记录和待办事项
- `astro.config.ts` - Astro 配置文件
- `src/site.config.ts` - 网站核心配置
- `src/utils/url.ts` - URL 格式处理工具函数

### Deployment

网站通过 GitHub Actions 自动部署，配置位于 `.github/workflows/` 目录。

## TODO

### SSG 模式下仅需改进

- [x] 深入解决 URL 的处理，让生成的 URL 合理，让内链的 URL 符合预期（保持老 URL 不变的情况下，新文章使用新 URL 格式）
- [x] 确保 linter/formatter 正确有效，混合使用 `autocorrect`, `prettier`, `biome`, `astro check`，并让他们各自发挥所长，不互相冲突
- [x] [Use Bun](https://docs.astro.build/en/recipes/bun/) to replace Node.js
  - 🔖 [Build an app with Astro and Bun](https://bun.sh/guides/ecosystem/astro)
  - ⌛️ [`\[...slug\].png.ts`](src/pages/og-image/[...slug].png.ts) ❌
- [x] Upgrade Astro to v5.7.0
  - 🔖 Migrate custom fonts to [v5.7.0 fonts API](https://docs.astro.build/en/reference/experimental-flags/fonts/)
- [ ] Use Cypress/Playwright to establish an e2e tests framework
- [ ] 整理目录结构和代码，让路由更简单合理
- [ ] 重构页面布局相关的 components，需要更合理封装组件，而不是现在大量复制黏贴
- [ ] 尝试改动页面布局，在大尺寸屏幕上尝试居左，右侧空间留给 TOC

### 另建分支探索 SSR

- [ ] 在本地跑通 SSR，确保 URL 处理正确
- [ ] 在 Vercel 上跑通 SSR

## LICENSE

- 代码部分：遵循 Astro 的 MIT 协议
- 文章内容：采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
