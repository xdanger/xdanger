import { getCollection } from "astro:content";
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";
import { getCanonicalUrl } from "@/utils/url";

export async function GET() {
  const posts = await getAllPosts();
  const notes = await getCollection("note");

  // 生成博客文章的URL条目
  const postEntries = posts.map((post) => {
    const canonicalUrl = getCanonicalUrl(post);
    const lastmod = post.data.updatedDate || post.data.publishDate;

    // URL 条目
    return `
      <url>
        <loc>${canonicalUrl}</loc>
        <lastmod>${lastmod.toISOString().split("T")[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
    `;
  });

  // 生成笔记的URL条目
  const noteEntries = notes.map((note) => {
    const noteUrl = `${siteConfig.url}/notes/${note.id}`;
    const lastmod = note.data.publishDate;

    return `
      <url>
        <loc>${noteUrl}</loc>
        <lastmod>${lastmod.toISOString().split("T")[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>
    `;
  });

  // 添加静态页面
  const staticPages = [
    {
      url: siteConfig.url,
      priority: 1.0,
      changefreq: "daily",
    },
    {
      url: `${siteConfig.url}/about`,
      priority: 0.8,
      changefreq: "monthly",
    },
    {
      url: `${siteConfig.url}/posts`,
      priority: 0.9,
      changefreq: "daily",
    },
    {
      url: `${siteConfig.url}/notes`,
      priority: 0.8,
      changefreq: "weekly",
    },
    {
      url: `${siteConfig.url}/tags`,
      priority: 0.7,
      changefreq: "weekly",
    },
  ];

  const staticEntries = staticPages.map(
    (page) => `
    <url>
      <loc>${page.url}</loc>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>
  `,
  );

  // 合并所有条目
  const allEntries = [...staticEntries, ...postEntries, ...noteEntries];

  // 生成完整的 sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allEntries.join("")}
</urlset>
  `;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
