// lib/markdown.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// Directory where your blog posts are stored
const postsDirectory = path.join(process.cwd(), "posts");

export async function getPostBySlug(slug: string) {
  // console.log("slug: ", slug);
  // Read markdown file as string
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Parse frontmatter and content
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    content: contentHtml,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt || "",
    // Add other frontmatter fields you use in Jekyll
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
