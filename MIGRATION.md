# 将博客从 Next.js 迁移到 Astro

步骤：

## ✅ 清除 Next.js 相关配置

- 删除本地所有和 Next.js 相关的文件
- 删除本地 `node_modules`, `.next`, `.out` 等目录

## ✅ 创建空白 Astro 项目

- 在其他目录使用 [cactus](https://github.com/chrismwilliams/astro-theme-cactus) 模版新起一个空白 Astro 项目

  ```bash
  bun create astro@latest -- --template chrismwilliams/astro-theme-cactus
  bun install
  ```

- 确保可以正常运行

## ✅ 修改 URL 路由

所有页面：

- 为了 URL 更简洁现代，不要以 `/` 结尾
- 同时为了 SEO 向后兼容，页面都要支持 `.html` 结尾来访问（但不是正式 URL）
- 为了保持博客之前 URL 的路径，需要去掉 `/posts` 前缀
  这个路由的优先级应为最低：仅当其他路径策略都没找到相应应该显示的页面内容后，才在 `src/content/post` 里找有没有对应的 markdown 文件，如果也没有再显示 404 页面 —— 优先级仅在 404 页面之前。目前来说，路由优先级应当为：
  - `src/pages/` 目录下的 `.astro` 文件
  - `src/content/note/` 目录下的 `.mdx`, `.md` 文件
  - `src/content/post/` 目录下的 `.mdx`, `.md` 文件

例如：

- `src/pages/about.astro`：URL 为 `/about`，也支持 `/about.html`
- `src/content/note/welcome.mdx`：URL 为 `/notes/welcome`，也支持 `/notes/welcome.html`
- `src/content/post/testing/long-title.mdx`：URL 为 `/testing/long-title`，也支持 `/testing/long-title.html`

## ✅ 迁移程序和配置

- 将新目录的根目录下的 `package.json`, `astro.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.ts`, `bun.lockb` 拷贝到本地项目根目录
- 将 `src/` 拷贝到本地项目根目录

## ✅ 确保可正常运行

目标：可以正常运行 `bun run dev` 和 `bun run build`

问题：

```bash
bun run dev
$ astro dev
22:29:40 [types] Generated 1ms
22:29:40 [content] Syncing content
22:29:40 [content] Astro config changed
22:29:40 [content] Astro version changed
22:29:40 [content] Clearing content store
[InvalidContentEntryDataError] post → 2013/06/2013-06-23-rebuild-blog-with-jekyll data does not match collection schema.
description: Required
publishDate: Did not match union.
> Required
  Hint:
    See https://docs.astro.build/en/guides/content-collections/ for more information on content schemas.
  Error reference:
    https://docs.astro.build/en/reference/errors/invalid-content-entry-data-error/
  Location:
    /Users/xdanger/Repositories/gh.xdanger.xdanger/src/content/post/2013/06/2013-06-23-rebuild-blog-with-jekyll.md:0:0
  Stack trace:
    at getEntryDataAndImages (file:///Users/xdanger/Repositories/gh.xdanger.xdanger/node_modules/astro/dist/content/utils.js:163:26)
    at async syncData (/Users/xdanger/Repositories/gh.xdanger.xdanger/node_modules/astro/dist/content/loaders/glob.js:93:28)
error: script "dev" exited with code 1
```

问题是之前使用 Jekyll 和 Next.js 时

- ✅ **Frontmatter 不匹配**：博客文章的 `.html`, `.md`, `.mdx` 文件的 Frontmatter 里发布日期使用的是 `date`，没有设置 `description` 和 `publishDate`
  - 使用脚本 `scripts/fix-frontmatter.js` 将所有文章的 `date` 字段重命名为 `publishDate`，并自动从文章内容提取 `description` 字段。

## ⌛️ 转换博客文章的文件名和文件格式

- 将博客文章的文件名从 `src/content/post/YYYY-MM-DD-title.html` 转换为 `src/content/post/YYYY/MM/DD/title.mdx`，以保持 URL 不变
- 将博客文章的文件格式从 `.html`, `.md` 转换为 `.mdx`，对于 HTML 文件需要转换内容正文

## ⌛️ 修改 cactus 主题

- 像 GitHub 那样优先使用系统字体
- 增加页面在宽屏上的宽度

## ⌛️ 强化 SEO

- 使用 `@astrojs/sitemap` 生成 sitemap
- 使用 `@astrojs/robots` 生成 robots.txt
- 使用 `@astrojs/rss` 生成 RSS 订阅
- 使用 `@astrojs/image` 生成图片
- 使用 `@astrojs/seo` 生成 SEO 元数据

## ⌛️ 使用 Netlify 部署
