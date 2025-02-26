import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from 'remark';
import html from 'remark-html';

// This function will read all posts and sort them by date
export async function getLatestPosts() {
    // Get the posts directory path - this is where your markdown files live
    const postsDirectory = path.join(process.cwd(), "_posts");

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

    // 使用Promise.all处理所有文章
    const allPostsData = await Promise.all(allFiles
        .filter((filePath) => filePath.endsWith(".md")) // Only process markdown files
        .map(async (filePath) => {
            // Create slug that preserves the full path structure
            const relativePath = path.relative(postsDirectory, filePath);

            // Extract the filename without extension
            const fileName = path.basename(relativePath, '.md');

            let slug = "";
            // Extract the directory path (yyyy/mm/dd)
            const dirPath = path.dirname(relativePath);

            // Extract date components and title from filename (yyyy-mm-dd-title.md)
            const dateMatch = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
            if (dateMatch) {
                // 使用解构但忽略第一个元素(完整匹配)
                const [, yyyy, mm, dd, title] = dateMatch;
                slug = `${yyyy}/${mm}/${dd}/${title}.html`.replace(/\\/g, '/');
            } else {
                slug = `${dirPath}/${fileName}.html`.replace(/\\/g, '/');
            }

            // Read markdown file as string
            const fileContents = fs.readFileSync(filePath, "utf8");

            // Use gray-matter to parse the post metadata section
            const { data, content } = matter(fileContents);

            // Extract preview (first 200 characters of content)
            const preview = content.slice(0, 200).trim() + "...";

            // 正确处理异步remark处理过程
            const processedContent = await remark()
                .use(html)
                .process(content);
            const contentHtml = processedContent.toString();

            // Combine the data
            return {
                slug,
                title: data.title,
                date: data.date,
                preview,
                content: contentHtml,
                ...(data as { [key: string]: unknown }), // Include all frontmatter data
            };
        }));

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}
