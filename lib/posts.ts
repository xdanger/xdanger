import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkMath from 'remark-math';
import rehypeMathJaxChtml from 'rehype-mathjax/chtml';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';

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
        .filter((filePath) => filePath.endsWith(".md") || filePath.endsWith(".html")) // Process both markdown and HTML files
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
                // 使用解构但忽略第一个元素(完整匹配)
                const [, yyyy, mm, dd, title] = dateMatch;
                // 不添加.html后缀，因为Next.js会根据配置自动添加
                slug = `${yyyy}/${mm}/${dd}/${title}`.replace(/\\/g, '/');
            } else {
                // 无论文件类型如何，都不添加.html后缀
                slug = `${dirPath}/${fileName}`.replace(/\\/g, '/');
            }

            // Read file as string
            const fileContents = fs.readFileSync(filePath, "utf8");

            // Use gray-matter to parse the post metadata section
            const { data, content } = matter(fileContents);

            // Extract preview (first 200 characters of content)
            const preview = content.slice(0, 200).trim() + "...";

            let contentHtml;

            // 根据文件类型处理内容
            if (isHtml) {
                // HTML文件直接使用内容，不需要额外渲染
                contentHtml = content;
            } else {
                // Markdown文件需要使用unified处理流程，支持数学公式
                const fileContent = await unified()
                    .use(remarkParse) // 解析Markdown
                    .use(remarkMath) // 解析数学公式
                    .use(remarkRehype, { allowDangerousHtml: true }) // 转换为rehype AST
                    .use(rehypeRaw) // 保留内联HTML
                    .use(rehypeMathJaxChtml, {
                        chtml: {
                            fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2'
                        },
                        tex: {
                            packages: ['base', 'ams', 'noerrors', 'noundefined'],
                            inlineMath: [['$', '$'], ['\\(', '\\)']],
                            displayMath: [['$$', '$$'], ['\\[', '\\]']],
                            processEscapes: true,
                            processEnvironments: true
                        }
                    }) // 将数学公式渲染为MathJax HTML，使用与客户端一致的配置
                    .use(rehypeStringify) // 转换为HTML字符串
                    .process(content);

                contentHtml = fileContent.toString();
            }

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
