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

## ⌛️ 转换博客文章的文件路径、文件名、Frontmatter、以及正文格式

编写（或更新）脚本 `scripts/migrate-posts.js`，批量更新 `src/content/post/` 目录下的所有博客文章，以解决或实现：

- **更新文件名**：
  - 将博客文章的文件名从 `YYYY-MM-DD-title.html`, `YYYY/MM/YYYY-MM-DD-title.html` 转换为 `YYYY/MM/DD/title.mdx`，以保持之前已发布的博客的 URL 不变
  - 为了保持文件的 Git 历史记录，使用 `git mv` 而不是直接移动文件
- **更新 Frontmatter**：
  - 因为之前使用 Jekyll 和 Next.js，博客文章的 `.html`, `.md`, `.mdx` 文件的 Frontmatter 里发布日期使用的是 `date`，没有设置 `description` 和 `publishDate`，需要：
    - 将所有文章的 `date` 字段重命名为 `publishDate`
    - 使用命令行 `claude -p "使用最简洁的语言编写 {file_path} 中内容的描述，用于放在网页的 <description/> 标签服务于 SEO"`，让 claude 总结出 `description` 字段。使用缓存文件来记录哪些文件的 description 已经总结过，在重复执行脚本时可以对比 description 是否和缓存文件中的相同，避免重复总结
    - 对于没有设置 `title` 字段的文章，使用命令行 `claude -p "对于 {file_path} 中内容编写一个标题，用于放在网页的 <title/> 标签"`，让 claude 总结出 `title` 字段
  - 将 `category` 字段内的属性放入 `tags` 字段，删除 `category` 字段
  - `tags` 字段的内容全部转成小写字母，并且确保没有重复的 tag、没有空字符 tag
- **更新正文格式**：
  - 将 `html` 格式的正文转换为 `Markdown JAX` 格式
  - 转换后的文件内容格式需要经过 `bunx autocorrect --fix {file_path} && bunx markdownlint-cli2 --fix {file_path}` 格式化
- **幂等性**：`scripts/migrate-posts.js` 应当可以安全地重试而不会导致数据不一致，如果遇到错误，修改相应逻辑后继续执行是安全的

执行 `scripts/migrate-posts.js` 完成上述转换，并仔细检查结果。

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
