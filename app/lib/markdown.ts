// lib/markdown.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';

// Directory where your blog posts are stored
const postsDirectory = path.join(process.cwd(), "posts");

export async function getPostBySlug(slug: string) {
  // Read markdown file as string
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Parse frontmatter and content
  const { data, content } = matter(fileContents);

  // Basic markdown to HTML conversion, preserving all HTML and math formulas
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    content: contentHtml,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt || "",
  };
}

export async function getAllPosts() {
  // Get all post slugs
  const slugs = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));

  // Get post data
  const posts = await Promise.all(
    slugs.map(async (slug) => getPostBySlug(slug)),
  );

  // Sort posts by date
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}
