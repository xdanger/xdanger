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

因为规则较为模糊，不要使用脚本，而是手动更新 `src/content/post/` 目录下的所有博客文章：

- ✅ 将博客文章的文件名从 `YYYY-MM-DD-title.html`, `YYYY/MM/YYYY-MM-DD-title.html` 转换为 `YYYY/MM/DD/title.mdx`，以保持之前已发布的博客的 URL 不变
  - 为了保持文件的 git 历史记录，使用 `git mv` 而不是直接移动文件
  - 已对所有文件完成此项更改，可以跳过
- 将所有文章的 `date` 字段重命名为 `publishDate`
- 将文章正文以你的理解转换为 Markdown JAX 格式
  - 保持文章内容不变，只调整格式以适配 Markdown JAX 的语法标准
  - 按 `.markdownlint.json` 配置文件中的规则，但忽略这些标准：
    - `MD013`：不对行数超过 80 行的行进行换行
    - `MD024`：允许有多个相同内容的标题
    - `MD037`：标记内允许有空格
    - `MD042`：允许空链接
- 对于文章内容，编写一段用于放在网页的 `<description/>` 标签服务于 SEO 的描述，更新在 Frontmatter 的 `description` 字段
- 对于 Frontmatter 里缺少 `title` 的文件，你来编写一个用于放在网页的 `<title/>` 标签内的标题，更新在 Frontmatter 的 `title` 字段
- `tags` 字段：
  - 将 `category` 字段内的属性放入 `tags` 字段，删除 `category` 字段
  - 将 `tags` 字段的内容全部转成小写字母
  - 确保没有重复的 tag、没有空字符 tag
  - 每个 tag 用双引号包裹，多个 tag 用逗号分隔
  - 例如：`tags: ["moveabletype", "jekyll", "tech"]`
- 最后运行 `bunx autocorrect --fix {mxd_file_path} && bunx markdownlint-cli2 --fix {mxd_file_path}` 来格式化处理完的 `.mdx` 文件

需要处理的博客的文件列表如下（已省略相对路径前缀 `src/content/post/` ）：

- [x] `2002/12/12/000007.mdx`: Investigative report on the Dalian plane crash caused by arson
- [x] `2002/12/19/000008.mdx`: News report about Ba Jin's donated books found in secondhand bookstores
- [x] `2002/12/26/000009.mdx`: South China Weekend's 2002 special report on Hu Jintao as the new CCP leader
- [x] `2003/01/01/000010.mdx`: Interview with Kang Xiaoguang on elite social responsibility in China
- [x] `2003/01/09/000011.mdx`: Article about forgotten legal elites from Soochow University Law School
- [x] `2003/01/23/000012.mdx`: Analysis on why China is not to blame for Japan's deflation
- [x] `2003/02/13/000013.mdx`: Report on early SARS outbreak in Guangzhou in February 2003
- [x] `2003/03/13/000014.mdx`: In-depth analysis of constitutionalism in China featuring interviews with legal and political experts
- [x] `2003/03/20/000015.mdx`: Essay reflecting on China's historical choices during three "Guiwei" years (1883, 1943, 2003)
- [x] `2003/04/03/000016.mdx`: Investigative report on the Chinese fishing boat sunk by pirates in Sri Lankan waters
- [x] `2003/05/08/000017.mdx`: Behind-the-scenes story about the production of TV series "Towards the Republic"
- [x] `2003/05/08/000018.mdx`: Analysis of the online gaming industry in China, especially disputes between major companies
- [x] `2003/05/15/000019.mdx`: Report on how a SARS-related rumor spread across 14 Chinese provinces in just 4 days
- [x] `2003/05/29/000020.mdx`: In-depth report on property owners' rights movement against government and developer in Guangzhou
- [x] `2003/06/05/000021.mdx`: Report on Three Gorges Dam relocation of Zigui county residents and their struggles
- [x] `2003/06/05/000022.mdx`: In-depth investigation into Zhou Zhengyi's rise and fall as "Shanghai's richest man" and his business empire collapse
- [x] `2003/06/05/000023.mdx`: Comprehensive report on President Hu Jintao's first diplomatic tour to Russia, including meetings with Putin and Koizumi
- [x] `2003/07/03/000024.mdx`: Report on the literary battle between Jin Wenming and Yu Qiuyue over historical inaccuracies in Yu's essays
- [x] `2003/07/10/000025.mdx`: In-depth report on Peking University's radical reform of faculty appointment and promotion system
- [x] `2003/07/17/000026.mdx`: Investigative report on the British Museum's preservation of Chinese artifacts and its funding and staffing issues
- [x] `2003/07/17/000027.mdx`: Essay about Tan Sitong's heroic martyrdom during the Wuxu Reform Movement of 1898
- [x] `2003/07/31/000028.mdx`: Investigative report on the controversial plan to build Yangliuhu Dam 1310 meters upstream from the Dujiangyan UNESCO World Heritage Site
- [x] `2003/08/14/000029.mdx`: In-depth report on China's upcoming judicial system reform and the "three-izations" problems in the current system
- [x] `2003/09/04/000030.mdx`: In-depth analysis of China's urban demolition and relocation policies over a decade, examining how they've evolved from "public welfare" to commercial projects, causing social conflicts
- [ ] `2003/09/18/000031.mdx`
- [ ] `2003/10/09/000032.mdx`
- [ ] `2003/10/09/000033.mdx`
- [ ] `2003/10/16/000034.mdx`
- [ ] `2003/11/06/000035.mdx`
- [ ] `2003/11/06/000036.mdx`
- [ ] `2003/11/13/000037.mdx`
- [ ] `2003/11/23/000005.mdx`
- [ ] `2003/11/26/000006.mdx`
- [ ] `2003/11/27/000038.mdx`
- [ ] `2003/12/04/000001.mdx`
- [ ] `2003/12/05/000003.mdx`
- [ ] `2003/12/05/000004.mdx`
- [ ] `2003/12/07/000039.mdx`
- [ ] `2003/12/08/000040.mdx`
- [ ] `2003/12/08/000041.mdx`
- [ ] `2003/12/09/000042.mdx`
- [ ] `2003/12/12/000043.mdx`
- [ ] `2003/12/13/000044.mdx`
- [ ] `2003/12/13/000045.mdx`
- [ ] `2003/12/14/000047.mdx`
- [ ] `2003/12/15/000048.mdx`
- [ ] `2003/12/15/000049.mdx`
- [ ] `2003/12/16/000050.mdx`
- [ ] `2003/12/18/000046.mdx`
- [ ] `2003/12/18/000051.mdx`
- [ ] `2003/12/19/000051.mdx`
- [ ] `2003/12/20/000052.mdx`
- [ ] `2003/12/21/000053.mdx`
- [ ] `2003/12/21/000054.mdx`
- [ ] `2003/12/23/000055.mdx`
- [ ] `2003/12/24/000056.mdx`
- [ ] `2003/12/25/000057.mdx`
- [ ] `2003/12/27/000058.mdx`
- [ ] `2003/12/28/000059.mdx`
- [ ] `2003/12/29/000060.mdx`
- [ ] `2003/12/29/000061.mdx`
- [ ] `2003/12/29/000062.mdx`
- [ ] `2003/12/29/000063.mdx`
- [ ] `2003/12/29/000064.mdx`
- [ ] `2003/12/31/000065.mdx`
- [ ] `2004/01/02/000066.mdx`
- [ ] `2004/01/04/000067.mdx`
- [ ] `2004/01/05/000068.mdx`
- [ ] `2004/01/06/000069.mdx`
- [ ] `2004/01/07/000070.mdx`
- [ ] `2004/01/08/000071.mdx`
- [ ] `2004/01/09/000072.mdx`
- [ ] `2004/01/10/000073.mdx`
- [ ] `2004/01/11/000074.mdx`
- [ ] `2004/01/12/000075.mdx`
- [ ] `2004/01/13/000076.mdx`
- [ ] `2004/01/14/000077.mdx`
- [ ] `2004/01/14/000078.mdx`
- [ ] `2004/01/15/000079.mdx`
- [ ] `2004/01/16/000080.mdx`
- [ ] `2004/01/17/000081.mdx`
- [ ] `2004/01/18/000082.mdx`
- [ ] `2004/01/19/000083.mdx`
- [ ] `2004/01/20/000085.mdx`
- [ ] `2004/01/21/000086.mdx`
- [ ] `2004/01/22/000087.mdx`
- [ ] `2004/01/23/000088.mdx`
- [ ] `2004/01/25/000089.mdx`
- [ ] `2004/01/26/000090.mdx`
- [ ] `2004/01/28/000091.mdx`
- [ ] `2004/01/29/000092.mdx`
- [ ] `2004/01/30/000093.mdx`
- [ ] `2004/01/31/000094.mdx`
- [ ] `2004/02/03/000095.mdx`
- [ ] `2004/02/04/000096.mdx`
- [ ] `2004/02/10/000098.mdx`
- [ ] `2004/02/11/000097.mdx`
- [ ] `2004/02/12/000099.mdx`
- [ ] `2004/02/13/000100.mdx`
- [ ] `2004/02/14/000101.mdx`
- [ ] `2004/02/14/000102.mdx`
- [ ] `2004/02/15/000102.mdx`
- [ ] `2004/02/20/000103.mdx`
- [ ] `2004/02/24/000104.mdx`
- [ ] `2004/02/28/000105.mdx`
- [ ] `2004/03/05/000106.mdx`
- [ ] `2004/03/08/000107.mdx`
- [ ] `2004/03/09/000108.mdx`
- [ ] `2004/03/10/000109.mdx`
- [ ] `2004/03/11/000110.mdx`
- [ ] `2004/03/12/000111.mdx`
- [ ] `2004/03/13/000112.mdx`
- [ ] `2004/03/14/000110.mdx`
- [ ] `2004/03/18/000113.mdx`
- [ ] `2004/03/20/000114.mdx`
- [ ] `2004/03/21/000115.mdx`
- [ ] `2004/03/21/000116.mdx`
- [ ] `2004/03/21/000117.mdx`
- [ ] `2004/03/23/000118.mdx`
- [ ] `2004/03/30/000119.mdx`
- [ ] `2004/03/30/000120.mdx`
- [ ] `2004/04/10/000122.mdx`
- [ ] `2004/04/10/000123.mdx`
- [ ] `2004/04/12/000124.mdx`
- [ ] `2004/04/23/000125.mdx`
- [ ] `2004/04/30/000126.mdx`
- [ ] `2004/05/02/000127.mdx`
- [ ] `2004/05/03/000128.mdx`
- [ ] `2004/05/07/000129.mdx`
- [ ] `2004/05/08/000130.mdx`
- [ ] `2004/05/15/000131.mdx`
- [ ] `2004/06/06/000132.mdx`
- [ ] `2004/06/24/000133.mdx`
- [ ] `2004/09/03/000134.mdx`
- [ ] `2004/09/05/000136.mdx`
- [ ] `2004/09/06/000135.mdx`
- [ ] `2004/09/07/000137.mdx`
- [ ] `2004/09/08/000138.mdx`
- [ ] `2004/09/09/000139.mdx`
- [ ] `2004/09/11/000140.mdx`
- [ ] `2004/09/21/000141.mdx`
- [ ] `2004/09/22/000142.mdx`
- [ ] `2004/11/14/000143.mdx`
- [ ] `2004/11/16/000144.mdx`
- [ ] `2004/11/18/000145.mdx`
- [ ] `2004/11/19/000146.mdx`
- [ ] `2004/11/20/000147.mdx`
- [ ] `2004/11/22/000148.mdx`
- [ ] `2005/07/10/000001.mdx`
- [ ] `2005/07/11/000002.mdx`
- [ ] `2005/07/12/000004.mdx`
- [ ] `2005/07/13/000003.mdx`
- [ ] `2005/07/14/000005.mdx`
- [ ] `2005/07/15/000006.mdx`
- [ ] `2005/07/16/000007.mdx`
- [ ] `2005/07/17/000008.mdx`
- [ ] `2005/07/19/000009.mdx`
- [ ] `2005/07/22/000010.mdx`
- [ ] `2005/07/26/000011.mdx`
- [ ] `2005/08/18/000013.mdx`
- [ ] `2005/08/21/000014.mdx`
- [ ] `2005/08/22/000015.mdx`
- [ ] `2005/08/24/000016.mdx`
- [ ] `2005/08/28/000017.mdx`
- [ ] `2005/08/28/000018.mdx`
- [ ] `2005/08/31/000020.mdx`
- [ ] `2005/08/31/000022.mdx`
- [ ] `2005/10/17/000023.mdx`
- [ ] `2005/10/17/000024.mdx`
- [ ] `2005/10/18/000025.mdx`
- [ ] `2005/10/19/000026.mdx`
- [ ] `2005/10/22/000027.mdx`
- [ ] `2005/10/23/000028.mdx`
- [ ] `2005/11/17/000029.mdx`
- [ ] `2005/12/28/000030.mdx`
- [ ] `2006/01/05/000031.mdx`
- [ ] `2006/01/17/000032.mdx`
- [ ] `2006/01/18/000033.mdx`
- [ ] `2006/01/20/000034.mdx`
- [ ] `2006/01/28/000035.mdx`
- [ ] `2006/06/07/000046.mdx`
- [x] `2006/07/06/000047.mdx`: Author's experience transitioning from Windows to Linux to Mac OS
- [x] `2006/07/13/000050.mdx`: Critique of blind nationalism and mob mentality in online discussions
- [x] `2006/07/13/000051.mdx`: Numbered responses about nationalism and China-Japan relations
- [x] `2006/09/14/000052.mdx`: Reflections on XML and XSL academic assignment
- [ ] `2006/09/15/000053.mdx`
- [ ] `2006/09/16/000054.mdx`
- [ ] `2006/09/25/000055.mdx`
- [ ] `2006/12/20/000057.mdx`
- [ ] `2006/12/22/000058.mdx`
- [ ] `2007/01/01/000059.mdx`
- [ ] `2007/03/10/000061.mdx`
- [ ] `2007/03/12/000062.mdx`
- [ ] `2007/03/20/000064.mdx`
- [ ] `2007/03/22/000065.mdx`
- [ ] `2007/03/23/000066.mdx`
- [ ] `2007/03/30/000067.mdx`
- [ ] `2007/06/10/000068.mdx`
- [ ] `2007/10/28/000069.mdx`
- [ ] `2009/01/01/000199.mdx`
- [ ] `2009/02/13/000207.mdx`
- [x] `2006/02/15/000036.mdx`: Commentary on internet censorship in China from 2006
- [x] `2006/02/16/000037.mdx`: Exposure of CDN server manipulation in 2006
- [x] `2006/02/17/000039.mdx`: Brief post about Windows Defender from 2006
- [x] `2006/03/07/000040.mdx`: Post about NetEase news from 2006
- [x] `2006/04/12/000043.mdx`: Eyewitness account of Google's Chinese branding event from 2006
- [x] `2006/04/13/000044.mdx`: Analysis of Baidu vs Google in China from 2006
- [x] `2006/04/22/000045.mdx`: Critique of Sony's customer service in China from 2006
- [x] `2006/07/07/000048.mdx`: Analysis of Baidu's community strategy vs Google from 2006
- [x] `2006/07/08/000049.mdx`: Essay warning against chauvinism from 2006
- [x] `2008/03/11/000130.mdx`: School memories post from 2008
- [x] `2008/04/24/000147.mdx`: Article about critique of Chinese state-owned companies from 2008
- [x] `2013/06/23/rebuild-blog-with-jekyll.mdx`
- [x] `2023/01/01/ml-is-the-infra-of-all-industry.mdx`
- [x] `2023/05/15/compression-is-intelligence.mdx`
- [x] `2023/05/18/montanas-ban-on-tiktok-is-unconstitutional.mdx`
- [x] `2023/06/24/wagner-is-helping-putin.mdx`
- [x] `2023/09/12/its-been-12-years-for-tim.mdx`
- [x] `2025/03/15/multiplanet-civilization-v-earth-gravity.mdx`

follow these steps:

1. manually (DO NOT use script) proceed the next unchecked file
2. mark the processed file as checked
3. compact context to reduce token usage
4. repeat step 1 until finishing all the files

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