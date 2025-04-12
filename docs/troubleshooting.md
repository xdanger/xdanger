# 故障排除指南

本文档提供了常见问题和解决方案，帮助开发者解决在开发和部署过程中可能遇到的问题。

## 开发环境问题

### 安装依赖失败

**问题**: 运行 `yarn install` 或 `npm install` 时出现错误。

**解决方案**:

1. 确保你使用的 Node.js 版本兼容（推荐 Node.js 20+）

   ```bash
   node --version
   ```

2. 清除缓存后重试

   ```bash
   yarn cache clean
   yarn install
   ```

3. 如果特定包出错，尝试单独安装它

   ```bash
   yarn add <问题包名>
   ```

### 开发服务器启动失败

**问题**: 运行 `npm run dev` 时出错。

**解决方案**:

1. 检查端口冲突

   ```bash
   lsof -i :3000
   ```

   如有冲突，终止占用端口的进程或修改端口。

2. 检查 Next.js 版本兼容性

   ```bash
   npx next --version
   ```

3. 尝试使用调试模式启动

   ```bash
   NODE_OPTIONS='--inspect' next dev
   ```

### 热重载不工作

**问题**: 修改文件后页面不自动刷新。

**解决方案**:

1. 确认文件保存后有变化
2. 重启开发服务器
3. 检查文件路径是否正确
4. 确保使用 Turbopack 开发服务器

### TypeScript 错误

**问题**: TypeScript 编译错误或类型检查失败。

**解决方案**:

1. 运行类型检查

   ```bash
   npx tsc --noEmit
   ```

2. 更新依赖的类型定义

   ```bash
   yarn upgrade @types/react @types/node
   ```

3. 检查 `tsconfig.json` 配置是否正确

## 构建问题

### 构建失败

**问题**: `npm run build` 命令失败。

**解决方案**:

1. 检查构建日志中的具体错误信息

2. 验证所有导入的模块和资源是否存在

   ```bash
   grep -r "import.*from" --include="*.tsx" --include="*.ts" ./app ./components ./lib
   ```

3. 检查是否有未捕获的运行时错误

   ```bash
   NODE_ENV=production next build
   ```

### 字体构建问题

**问题**: 字体资源无法正确加载或构建。

**解决方案**:

1. 使用专用命令重建字体

   ```bash
   npm run build:fonts
   ```

2. 检查 `public/assets/webfonts/` 目录中的字体文件是否存在

3. 验证 `lib/fonts.ts` 中的字体配置是否正确

### 静态导出问题

**问题**: 静态导出 (`npm run export`) 失败。

**解决方案**:

1. 确保没有使用不支持静态导出的 API
   - 检查所有 API 路由
   - 确认没有使用服务器组件中的动态功能

2. 验证 `next.config.mjs` 中的输出配置

3. 检查 `scripts/post-build.js` 是否有错误

## 内容渲染问题

### Markdown 渲染错误

**问题**: Markdown 内容无法正确渲染。

**解决方案**:

1. 检查 Markdown 文件的前置元数据格式

   ```bash
   grep -A 10 "^---" _posts/**/*.md
   ```

2. 验证 remark 插件链配置

   ```bash
   cat lib/markdown.ts
   ```

3. 确保文件使用 UTF-8 编码并没有 BOM 标记

   ```bash
   file -I _posts/**/*.md
   ```

### 博客文章找不到

**问题**: 特定博客文章 URL 返回 404。

**解决方案**:

1. 确认文件路径和命名格式正确

   ```bash
   find _posts -name "*-slug-name.md"
   ```

2. 检查 `getAllPosts()` 方法是否正确读取该文件

   ```bash
   grep -r "getAllPosts" ./lib
   ```

3. 验证 slug 生成逻辑与 URL 模式匹配

   ```bash
   cat app/[...slug]/page.tsx
   ```

### 样式问题

**问题**: 样式不一致或显示错误。

**解决方案**:

1. 检查 Tailwind 类名是否正确

   ```bash
   npx tailwindcss-cli build -i ./app/globals.css -o ./tailwind-check.css
   ```

2. 验证组件使用正确的样式变体

   ```bash
   grep -r "className.*dark:" --include="*.tsx" ./
   ```

3. 确保主题切换逻辑工作正常

   ```bash
   cat components/mode-toggle.tsx
   ```

## 部署问题

### GitHub Pages 部署失败

**问题**: GitHub Pages 自动部署失败。

**解决方案**:

1. 检查 GitHub Actions 日志中的具体错误

2. 验证 `_sites` 目录是否正确同步

   ```bash
   ls -la _sites/
   ```

3. 确认 `CNAME` 文件存在且内容正确

   ```bash
   cat public/CNAME
   ```

### 静态站点链接错误

**问题**: 部署后的站点链接点击导致 404。

**解决方案**:

1. 检查链接是否使用正确的基本路径

   ```bash
   grep -r "href=" --include="*.tsx" ./components ./app
   ```

2. 确认部署环境的路径配置与开发环境一致

3. 验证 `next.config.mjs` 中的 `basePath` 设置

### 静态资源加载失败

**问题**: 图像、字体或其他静态资源无法加载。

**解决方案**:

1. 检查资源路径是否正确

   ```bash
   grep -r "src=" --include="*.tsx" ./
   ```

2. 确认资源文件已正确复制到构建输出目录

   ```bash
   find out/ -type f -name "*.jpg" -o -name "*.png"
   ```

3. 验证 CDN 或托管服务的缓存设置

## 性能问题

### 首次加载慢

**问题**: 网站首次加载时间过长。

**解决方案**:

1. 检查并优化大型依赖项

   ```bash
   npx next build --debug
   ```

2. 确保使用图像优化

   ```bash
   grep -r "next/image" --include="*.tsx" ./
   ```

3. 验证是否使用了代码分割

   ```bash
   grep -r "dynamic\(" --include="*.tsx" ./
   ```

### 客户端交互延迟

**问题**: 交互（如点击、滚动）反应迟钝。

**解决方案**:

1. 使用性能分析工具找出瓶颈

   ```bash
   NODE_OPTIONS='--inspect' next dev
   ```

   然后在 Chrome DevTools 中分析性能

2. 优化大型渲染组件

   ```bash
   grep -r "return.*<.*>.*<\/.*>" --include="*.tsx" ./components
   ```

3. 确保使用了适当的记忆化技术

   ```bash
   grep -r "useCallback\|useMemo" --include="*.tsx" ./
   ```

## 调试技巧

### 启用详细日志

```bash
NODE_OPTIONS='--inspect' next dev --turbopack
```

打开 Chrome 浏览器，访问 `chrome://inspect` 以连接 Node.js 调试器。

### 检查构建输出

```bash
find out/ -type f | sort > build-files.txt
cat build-files.txt
```

### 验证网络请求

使用浏览器开发者工具的网络面板检查所有网络请求，特别关注：

- 资源加载错误 (404, 500)
- 慢请求
- 过大文件

### 检查 JavaScript 控制台错误

浏览器控制台中的错误通常提供有用的诊断信息。检查：

- 组件渲染错误
- 未捕获异常
- 资源加载错误

## 获取帮助

如果上述解决方案无法解决问题：

1. 查阅相关库的文档：
   - [Next.js 文档](https://nextjs.org/docs)
   - [React 文档](https://react.dev/reference/react)
   - [Tailwind CSS 文档](https://tailwindcss.com/docs)

2. 搜索 GitHub Issues:
   - [Next.js Issues](https://github.com/vercel/next.js/issues)
   - [shadcn/ui Issues](https://github.com/shadcn/ui/issues)

3. 寻求社区帮助：
   - Stack Overflow 上标记相关技术
   - Next.js 和 React Discord 社区
