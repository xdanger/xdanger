# Next.js 静态导出 URL 和文件命名规则

## 博客简介

本博客使用 Next.js 的静态导出模式，有一系列特定 URL 约定和 HTML 生成规则必须遵守。

## 问题描述

在 Next.js 的静态导出（`output: 'export'`）模式下，存在以下关键问题：

1. **HTML 文件路径**：配置 `trailingSlash: false` 时，生成的 HTML 文件路径为 `/path/file.html` 而非 `/path/file/index.html`
2. **RSC 数据文件不匹配**：客户端请求 `/path/file.html.txt` 但实际生成的是 `/path/file.txt`，导致 404 错误
3. **生成参数挑战**：`generateStaticParams` 需要正确处理 slug，避免双重 `.html` 后缀

## URL 路径结构

- **访问文章的 URL 格式**：文章使用 `/{year}/{month}/{day}/{title}.html` 格式，而不是 `/{year}/{month}/{day}/{title}/`，博客内容按 `年/月/日` 结构组织
- **静态 html 格式**：构建后博客的静态 html 文件应该位于 `out` 目录下，路径结构为 `{year}/{month}/{day}/{title}.html`

## 解决方案

### 1. 配置文件设置

在 `next.config.mjs` 中使用以下配置：

```javascript
const nextConfig = {
  // 静态导出配置
  output: 'export',

  // 关键配置：禁用trailingSlash并启用扩展名
  // 这会生成 /path/file.html 而不是 /path/file/index.html
  trailingSlash: false,

  // 禁用类型检查
  typescript: {
    ignoreBuildErrors: false,
  },

  // 确保我们的链接格式正确
  basePath: '',

  // 其他必要配置...
};
```

### 2. 后处理脚本解决 RSC 数据文件问题

创建后处理脚本 `scripts/post-build.js`：

```javascript
import fs from 'fs';
import path from 'path';
import * as globModule from 'glob';

// 输出目录
const outDir = path.join(process.cwd(), 'out');

async function run() {
  // 查找所有.txt文件
  const txtFiles = globModule.sync('**/*.txt', { cwd: outDir });

  for (const txtFile of txtFiles) {
    const txtPath = path.join(outDir, txtFile);

    // 创建.html.txt目标路径
    const txtDirname = path.dirname(txtPath);
    const txtBasename = path.basename(txtPath, '.txt');
    const htmlTxtPath = path.join(txtDirname, `${txtBasename}.html.txt`);

    // 检查对应的.html文件是否存在
    const htmlPath = path.join(txtDirname, `${txtBasename}.html`);
    if (fs.existsSync(htmlPath)) {
      // 复制为新文件而不是重命名
      fs.copyFileSync(txtPath, htmlTxtPath);
    }
  }
}

run();
```

修改 `package.json` 构建命令：

```json
{
  "scripts": {
    "build": "npm run sync-theme && SKIP_TYPE_CHECK=1 next build && node scripts/post-build.js"
  }
}
```

### 3. 正确处理 generateStaticParams

在动态路由页面（如 `app/[...slug]/page.tsx`）中的`generateStaticParams`函数必须：

1. 接收`getLatestPosts()`数据
2. 为每篇文章添加`.html`后缀以匹配前端链接
3. 分割路径为段落并以正确格式返回

```typescript
export async function generateStaticParams(): Promise<PageParams[]> {
  const posts = await getLatestPosts();

  return posts.map((post) => {
    // 构建与首页链接一致的路径（带.html后缀）
    const fullPath = `${post.slug}.html`;
    // 分割路径段作为slug参数
    const segments = fullPath.split('/');

    return {
      slug: segments,
    };
  });
}
```

### 4. 链接生成规则

在生成内部链接时，确保包含 `.html` 后缀：

1. **主页文章链接**: 必须使用`/${post.slug}.html`格式

```tsx
<Link href={`/${post.slug}.html`}>
  {post.title}
</Link>
```

2. **文章查找逻辑**: 必须处理带有和不带`.html`后缀的情况

```typescript
const cleanSlug = fullSlug.replace(/\.html$/, '');
const post = posts.find(p => p.slug === cleanSlug);
```

## 注意事项

1. 确保一致性：所有内部链接都应遵循相同的格式（`.html` 后缀）
2. 检查路径处理：在读取动态路由参数时，记得清理可能的 `.html` 后缀
3. 两份副本：后处理脚本会保留原始 `.txt` 文件，同时创建 `.html.txt` 文件，确保兼容性
4. 静态文件部署：使用此配置后，静态文件将使用文件扩展名而非目录结构
5. 记住：修改链接格式或路由规则时，必须同时更新`generateStaticParams`函数和组件中的链接生成逻辑
