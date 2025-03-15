import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';

// Get the posts directory path - this is where your markdown files live
const postsDirectory = path.join(process.cwd(), "_posts");

// This function will read all posts and sort them by date
export async function getLatestPosts() {
    // Read all files recursively from the posts directory and its subdirectories
    const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []): string[] => {
        const files = fs.readdirSync(dirPath);

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
            } else {
                arrayOfFiles.push(filePath);
            }
        });

        return arrayOfFiles;
    };

    const allFiles = getAllFiles(postsDirectory);

    // Process all posts with Promise.all
    const allPostsData = await Promise.all(allFiles
        .filter((filePath) => filePath.endsWith(".md") || filePath.endsWith(".html"))
        .map(async (filePath) => {
            // Create slug that preserves the full path structure
            const relativePath = path.relative(postsDirectory, filePath);
            const extension = path.extname(filePath);
            const isHtml = extension === '.html';

            // Extract the filename without extension
            const fileName = path.basename(relativePath, extension);

            let slug = "";
            // Extract the directory path (yyyy/mm/dd)
            const dirPath = path.dirname(relativePath);

            // Extract date components and title from filename (yyyy-mm-dd-title.md/html)
            const dateMatch = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
            if (dateMatch) {
                const [, yyyy, mm, dd, title] = dateMatch;
                slug = `${yyyy}/${mm}/${dd}/${title}`.replace(/\\/g, '/');
            } else {
                slug = `${dirPath}/${fileName}`.replace(/\\/g, '/');
            }

            // Read file as string
            const fileContents = fs.readFileSync(filePath, "utf8");

            // Use gray-matter to parse the post metadata section
            const { data, content } = matter(fileContents);

            // Extract preview (first 200 characters of content)
            const preview = content.slice(0, 200).trim() + "...";

            let contentHtml;
            if (isHtml) {
                contentHtml = content;
            } else {
                // Basic markdown to HTML conversion, preserving all HTML and math formulas
                const processedContent = await unified()
                    .use(remarkParse)
                    .use(remarkRehype, { allowDangerousHtml: true })
                    .use(rehypeRaw)
                    .use(rehypeStringify, { allowDangerousHtml: true })
                    .process(content);
                contentHtml = processedContent.toString();
            }

            return {
                slug,
                title: data.title,
                date: data.date,
                preview,
                content: contentHtml,
            };
        }));

    // Sort posts by date
    return allPostsData.sort((a, b) => (a.date > b.date ? -1 : 1));
}
