import type { CollectionEntry } from "astro:content";

// 定义历史时期的分界日期
export const JEKYLL_START_DATE = new Date("2013-05-31");
export const ASTRO_START_DATE = new Date("2025-02-28");

/**
 * 判断文章属于哪个历史时期
 * @param publishDate 文章发布日期
 * @returns 文章所属的历史时期
 */
export function getBlogEra(publishDate: Date): "moveabletype" | "jekyll" | "astro" {
  if (publishDate < JEKYLL_START_DATE) {
    return "moveabletype";
  } else if (publishDate < ASTRO_START_DATE) {
    return "jekyll";
  } else {
    return "astro";
  }
}

/**
 * 根据发布日期决定文章的规范 URL 格式
 * 用于canonical和外部链接
 * @param post 文章对象
 * @returns 规范化的 URL 路径
 */
export function getCanonicalUrl(post: CollectionEntry<"post">): string {
  const publishDate = post.data.publishDate;
  const siteUrl = import.meta.env.SITE || "https://xdanger.com";
  const postId = post.id.startsWith("/") ? post.id.substring(1) : post.id;
  
  // Astro现在使用无后缀的URL，但为了SEO、历史链接等，我们提供canonical链接
  // 在网站中我们统一使用无后缀的URL，但canonical URL仍保留历史格式
  const era = getBlogEra(publishDate);
  
  if (era === "moveabletype" || era === "jekyll") {
    // MoveableType 和 Jekyll 时期的文章在canonical中仍显示.html后缀
    return `${siteUrl}/${postId}.html`;
  } else {
    // Astro 时期的文章不带后缀
    return `${siteUrl}/${postId}`;
  }
}

/**
 * 判断是否为新 URL 格式 (Astro 时期的文章)
 */
export function isAstroEraPost(post: CollectionEntry<"post">): boolean {
  return post.data.publishDate >= ASTRO_START_DATE;
}

/**
 * 根据文章 ID 获取正确的路径
 * 用于内部链接、导航等
 * @param post 文章对象
 * @returns 正确格式的路径
 */
export function getPostPath(post: CollectionEntry<"post">): string {
  const postId = post.id.startsWith("/") ? post.id.substring(1) : post.id;
  const era = getBlogEra(post.data.publishDate);
  
  // 在内部导航中应当保持历史连接格式，以保持URL向后兼容
  if (era === "moveabletype" || era === "jekyll") {
    // MoveableType 和 Jekyll 时期的文章链接应当带有.html后缀
    return `/${postId}.html`;
  } else {
    // Astro 时期的文章使用无后缀形式
    return `/${postId}`;
  }
}

/**
 * 生成文件路径，用于构建系统
 * 所有文件实际都是.html后缀，但我们的链接可能是.html或无后缀
 */
export function getOutputFilePath(post: CollectionEntry<"post">): string {
  const postId = post.id.startsWith("/") ? post.id.substring(1) : post.id;
  return `/${postId}.html`;
}