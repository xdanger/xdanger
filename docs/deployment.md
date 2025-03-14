# 部署指南

本文档详细说明了如何构建和部署项目到各种环境。

## 构建过程

项目使用 Next.js 构建系统，并有自定义的后构建脚本进行额外处理。

### 标准构建

```bash
npm run build
```

这个命令会：
1. 运行 `next build` 生成优化的生产构建
2. 执行 `scripts/post-build.js` 脚本进行后处理
3. 将构建输出放在 `/out` 目录
4. 同步到 `/_sites` 目录用于静态部署

### 带字体重建的构建

```bash
npm run build:fonts
```

当需要重新构建字体资源时使用此命令。这将设置环境变量 `REBUILD_FONTS=true` 并执行完整构建。

### 输出文件说明

构建过程生成的主要文件：

- **HTML 文件**：预渲染的页面
- **JS 文件**：客户端组件和水合逻辑
- **CSS 文件**：样式资源
- **Image 文件**：优化的图像
- **其他静态资源**：从 `/public` 目录复制

## 部署选项

### 1. GitHub Pages 部署

项目配置为使用 GitHub Pages 托管。

**流程**：
1. 将代码推送到 GitHub 仓库
2. GitHub Actions 工作流会自动构建项目
3. 构建输出被发布到 GitHub Pages

**注意事项**：
- GitHub Pages 使用 `_sites` 目录作为静态站点的根目录
- 项目根目录中的 `CNAME` 文件指定自定义域名

### 2. Vercel 部署

项目完全兼容 Vercel 平台。

**流程**：
1. 将项目连接到 Vercel
2. 配置构建命令为 `npm run build`
3. 设置输出目录为 `out`

**优势**：
- 自动预览部署
- 边缘函数支持
- 集成分析和监控

### 3. 其他静态托管

任何支持静态站点的服务都可以托管此项目。

**通用流程**：
1. 运行 `npm run build` 生成静态文件
2. 将 `out` 目录中的文件上传到托管服务
3. 配置任何必要的重定向或自定义域名

## 环境配置

### 环境变量

项目使用以下环境变量：

| 变量名 | 说明 | 默认值 |
|-------|------|-------|
| `REBUILD_FONTS` | 是否重新构建字体 | `false` |
| `NODE_ENV` | 环境模式 | `development`/`production` |

### 域名配置

项目使用 `CNAME` 文件指定自定义域名，默认指向 `xdanger.github.io`。

## 持续集成/持续部署 (CI/CD)

### GitHub Actions

项目可以配置 GitHub Actions 工作流实现自动化部署：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'yarn'
      - run: yarn install
      - run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

### 其他 CI/CD 选项

项目也兼容其他 CI/CD 平台，如 CircleCI, GitLab CI 等。关键是执行相同的构建步骤：

1. 安装依赖
2. 运行构建命令
3. 部署构建输出

## 性能优化

### 缓存策略

构建输出包含具有长期缓存的静态资产：
- JS 文件使用内容哈希命名
- 图像使用优化压缩和适当的缓存头

### CDN 配置

当使用 CDN 时，推荐以下配置：
- 缓存静态资产 (JS, CSS, 图像) 至少 1 年
- HTML 文件不缓存或短期缓存
- 使用内容哈希进行缓存破坏

## 监控和分析

### 错误追踪

可以集成错误追踪服务，如：
- Sentry
- LogRocket
- New Relic

### 性能监控

推荐监控以下指标：
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Time to First Byte (TTFB)

## 回滚策略

在部署出现问题时：

1. **GitHub Pages**：回滚到先前的提交
2. **Vercel**：使用 Vercel 控制台回滚到先前的部署
3. **手动托管**：重新部署先前的构建输出

## 特殊注意事项

### 重定向

对于永久移动的页面，可以添加 `/public/_redirects` 文件（针对 Netlify）或在 `next.config.mjs` 中配置重定向。

### 导出静态站点

如果需要手动导出静态站点：

```bash
npm run export
```

这将生成可部署到任何静态主机服务的静态文件。

### 添加自定义脚本

如需在部署前后添加自定义处理：

1. 在 `/scripts` 目录中创建新脚本
2. 在 `package.json` 中添加引用
3. 在构建过程中集成