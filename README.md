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

- [Bun](https://bun.sh/) 1.2.5 或更高版本

### 安装依赖

```bash
bun install
```

### 开发命令

- `bun run dev` - 启动开发服务器
- `bun run build` - 构建生产版本
- `bun run preview` - 预览构建后的网站
- `bun run lint` - 运行代码检查
- `bun run format` - 格式化代码
- `bun run check` - 运行类型检查

### 项目结构

- `/src/content/post/` - 博客文章内容 (MDX 格式)
- `/src/content/note/` - 笔记内容 (MDX 格式)
- `/src/components/` - 组件
- `/src/layouts/` - 页面布局
- `/src/pages/` - 页面和路由
- `/src/styles/` - 全局样式
- `/src/utils/` - 工具函数
- `/public/` - 静态资源文件

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

- `.astro`, `.tsx`, `.ts`, `.mjs`, `.jsx`, `.js`, `.json`, `.mdx` 文件需要使用 `bunx biome format --write {file_path} && bunx autocorrect --fix {file_path}` 检查和修复
- `.mdx` 文件需要使用 `bunx markdownlint-cli2 --fix {file_path}` 格式化

### 重要文件

- `MIGRATION.md` - 包含从 Next.js 迁移到 Astro 的完整过程记录和待办事项
- `astro.config.ts` - Astro 配置文件
- `src/site.config.ts` - 网站核心配置
- `src/utils/url.ts` - URL 格式处理工具函数

### Deployment

网站通过 GitHub Actions 自动部署，配置位于 `.github/workflows/` 目录。

## TODO

- [x] 深入解决 URL 的处理
- [ ] 确保 linter/formatter 正确有效
- [ ] 重构页面布局相关的 components，需要更合理封装组件，而不是现在大量复制黏贴
- [ ] 尝试改动页面布局，在大尺寸屏幕上尝试居左，右侧空间留给 TOC

## LICENSE

本项目代码采用 MIT 许可证。
