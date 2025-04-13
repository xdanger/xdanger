#!/usr/bin/env node

/**
 * 自动修复博客文章的 Frontmatter
 * 
 * 功能：
 * 1. 将 date 字段重命名为 publishDate
 * 2. 添加必需的 description 字段（如果没有）
 * 
 * 使用方法:
 * node fix-frontmatter.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const { glob } = require('glob');

// 主要内容目录
const contentDir = path.join(__dirname, '..', 'src', 'content', 'post');

// 找出所有的 .md, .mdx, .html 文件
async function findMarkdownFiles() {
  return await glob('**/*.{md,mdx,html}', { cwd: contentDir });
}

// 从 HTML 内容中提取第一段有意义的文本作为描述
function extractDescriptionFromHtml(content) {
  // 删除 HTML 标签，保留文本
  const textContent = content
    .replace(/<br\s*\/?>/gi, ' ')  // Replace <br> with spaces
    .replace(/<[^>]*>/g, '')       // Remove HTML tags
    .replace(/\s+/g, ' ')          // Normalize whitespace
    .trim();

  // 尝试找到第一个有意义的段落（至少 20 个字符）
  const paragraphs = textContent.split(/\n\n+/);
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (trimmed.length >= 20 && trimmed.length <= 160) {
      return trimmed;
    }
  }

  // 如果找不到合适的段落，截取前 160 个字符
  return textContent.slice(0, 160).trim() + (textContent.length > 160 ? '...' : '');
}

// 从 Markdown 内容中提取第一段有意义的文本作为描述
function extractDescriptionFromMarkdown(content) {
  // 移除 YAML frontmatter
  const contentWithoutFrontmatter = content
    .replace(/^---[\s\S]*?---/, '')
    .trim();
  
  // 查找第一个段落
  const paragraphs = contentWithoutFrontmatter.split(/\n\n+/);
  for (const para of paragraphs) {
    const trimmed = para.trim();
    // 跳过太短或者是代码块、标题等的段落
    if (trimmed.length >= 20 && 
        trimmed.length <= 160 && 
        !trimmed.startsWith('#') &&
        !trimmed.startsWith('```')) {
      return trimmed;
    }
  }

  // 如果找不到合适的段落，截取前 160 个字符
  return contentWithoutFrontmatter
    .replace(/\n+/g, ' ')
    .slice(0, 160)
    .trim() + (contentWithoutFrontmatter.length > 160 ? '...' : '');
}

// 修复文件的 frontmatter
async function fixFrontmatter(filePath) {
  const fullPath = path.join(contentDir, filePath);
  console.log(`处理: ${filePath}`);

  try {
    const content = await readFile(fullPath, 'utf8');
    const isHtml = path.extname(filePath) === '.html';

    // 检查文件是否包含 Frontmatter
    if (!content.startsWith('---')) {
      console.log(`  跳过: 没有 Frontmatter - ${filePath}`);
      return;
    }

    // 提取 Frontmatter
    const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
    if (!frontmatterMatch) {
      console.log(`  跳过: 无法解析 Frontmatter - ${filePath}`);
      return;
    }

    const frontmatter = frontmatterMatch[1];
    const contentAfterFrontmatter = content.slice(frontmatterMatch[0].length);

    // 解析现有 Frontmatter
    const frontmatterLines = frontmatter.trim().split('\n');
    const parsedFrontmatter = {};
    let dateValue = null;
    let hasDescription = false;

    frontmatterLines.forEach(line => {
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match) {
        const [, key, value] = match;
        parsedFrontmatter[key] = value;

        if (key === 'date') {
          dateValue = value;
        } else if (key === 'description') {
          hasDescription = true;
        }
      }
    });

    // 修改 Frontmatter
    let newFrontmatter = '---\n';
    for (const [key, value] of Object.entries(parsedFrontmatter)) {
      if (key === 'date') {
        // 跳过 date 字段，因为我们会将其转换为 publishDate
        continue;
      }
      newFrontmatter += `${key}: ${value}\n`;
    }

    // 如果没有描述，从内容中提取
    if (!hasDescription) {
      let description;
      if (isHtml) {
        description = extractDescriptionFromHtml(contentAfterFrontmatter);
      } else {
        description = extractDescriptionFromMarkdown(contentAfterFrontmatter);
      }
      
      // 确保描述是有效的并用引号包裹
      description = description
        .replace(/"/g, '\\"')  // Escape quotes
        .replace(/\n/g, ' ');  // Remove newlines
      
      newFrontmatter += `description: "${description}"\n`;
    }

    // 添加 publishDate
    if (dateValue) {
      newFrontmatter += `publishDate: ${dateValue}\n`;
    } else {
      console.log(`  警告: 没有找到日期 - ${filePath}`);
      // 从文件名提取日期 (例如 2023-01-01-title.md)
      const dateFromFilename = filePath.match(/(\d{4}[-/]\d{2}[-/]\d{2})/);
      if (dateFromFilename) {
        newFrontmatter += `publishDate: "${dateFromFilename[1]} 00:00:00"\n`;
      } else {
        // 使用文件的修改时间作为 publishDate
        const stats = fs.statSync(fullPath);
        newFrontmatter += `publishDate: "${new Date(stats.mtime).toISOString()}"\n`;
      }
    }

    newFrontmatter += '---';

    // 创建新内容
    const newContent = newFrontmatter + contentAfterFrontmatter;

    // 写入文件
    await writeFile(fullPath, newContent, 'utf8');
    console.log(`  已修复: ${filePath}`);
  } catch (error) {
    console.error(`  错误处理 ${filePath}: ${error.message}`);
  }
}

// 主函数
async function main() {
  try {
    const files = await findMarkdownFiles();
    console.log(`找到 ${files.length} 个文件需要处理`);

    // 按批次处理文件，避免一次处理太多
    const batchSize = 50;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      await Promise.all(batch.map(file => fixFrontmatter(file)));
      console.log(`已处理 ${Math.min(i + batchSize, files.length)}/${files.length} 文件`);
    }

    console.log('全部文件处理完成！');
  } catch (error) {
    console.error(`执行错误: ${error.message}`);
    process.exit(1);
  }
}

main();
