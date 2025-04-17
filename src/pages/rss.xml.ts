import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";
import { getCanonicalUrl } from "@/utils/url";
import rss from "@astrojs/rss";

export const GET = async () => {
  const posts = await getAllPosts();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: import.meta.env.SITE,
    trailingSlash: false,
    items: posts.map((post) => {
      // 获取文章的规范 URL（会自动根据发布日期添加或省略.html 后缀）
      const fullUrl = getCanonicalUrl(post);
      // 移除网站域名部分，只保留路径
      const urlObj = new URL(fullUrl);
      const path = urlObj.pathname;

      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publishDate,
        link: path.startsWith("/") ? path.substring(1) : path,
      };
    }),
  });
};
