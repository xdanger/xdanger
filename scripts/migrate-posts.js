#!/usr/bin/env node

/**
 * 博客文章迁移脚本
 * 
 * 功能：
 * 1. 将博客文章从 `YYYY-MM-DD-title.html` 转换为 `YYYY/MM/DD/title.mdx`
 * 2. 更新 Frontmatter:
 *    - 将 date 改为 publishDate
 *    - 添加 description（如果没有）
 *    - 添加 title（如果没有）
 *    - 将 category 内容转为 tags
 *    - 确保 tags 为小写
 * 3. 将 HTML 格式的正文转换为 MDX 格式
 * 4. 使用 git mv 来保持 Git 历史记录
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promisify } from 'util';
import childProcess from 'child_process';
import TurndownService from 'turndown';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const contentDir = path.join(__dirname, '../src/content/post');

// 处理记录文件路径
const processedFilesPath = path.join(__dirname, '.processed-files.json');
const claudeCachePath = path.join(__dirname, '.claude-cache.json');

// 不再使用处理记录文件，所有文件每次都重新处理
// 这些函数保留为空实现，以避免修改太多代码
function getProcessedFiles() {
  return {};
}

function saveProcessedFile(originalPath, newPath) {
  // 不再保存处理记录
  return;
}

function isFileProcessed(filePath) {
  // 始终返回 false，表示文件未处理过
  return false;
}

// 获取 Claude 缓存
function getClaudeCache() {
  if (fs.existsSync(claudeCachePath)) {
    try {
      return JSON.parse(fs.readFileSync(claudeCachePath, 'utf8'));
    } catch (error) {
      console.warn('无法读取 Claude 缓存，将创建新缓存:', error);
      return { titles: {}, descriptions: {} };
    }
  }
  return { titles: {}, descriptions: {} };
}

// 获取缓存的 Claude 响应
function getCachedClaudeResponse(type, filePath) {
  const cache = getClaudeCache();
  return cache[type]?.[filePath];
}

// 保存 Claude 响应到缓存
function saveClaudeCache(type, filePath, response) {
  const cache = getClaudeCache();
  if (!cache[type]) cache[type] = {};
  cache[type][filePath] = response;
  fs.writeFileSync(claudeCachePath, JSON.stringify(cache, null, 2), 'utf8');
}

// 初始化 TurndownService 实例
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*'
});

// 添加自定义规则以优化转换
turndownService.addRule('lineBreak', {
  filter: 'br',
  replacement: () => '\n\n'
});

// 增强图片规则
turndownService.addRule('images', {
  filter: 'img',
  replacement: function (content, node) {
    const alt = node.alt || '';
    let src = node.getAttribute('src') || '';
    
    // 如果src为空或无效，尝试查找其他可能的属性
    if (!src) {
      src = node.getAttribute('data-src') || '';
    }
    
    if (src) {
      return `![${alt}](${src})`;
    } else {
      return '';
    }
  }
});

// 优化表格规则
turndownService.addRule('tables', {
  filter: ['table'],
  replacement: function (content, node) {
    // 提取表格行
    const rows = node.querySelectorAll('tr');
    if (rows.length === 0) return '';
    
    let markdownRows = [];
    let isHeader = true;
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.querySelectorAll('th, td');
      if (cells.length === 0) continue;
      
      const markdownCells = [];
      for (let j = 0; j < cells.length; j++) {
        // 处理单元格内容
        let cellContent = turndownService.turndown(cells[j].innerHTML);
        cellContent = cellContent.replace(/\n/g, ' ').trim();
        markdownCells.push(cellContent);
      }
      
      markdownRows.push(`| ${markdownCells.join(' | ')} |`);
      
      // 添加表头分隔行
      if (isHeader && i === 0) {
        markdownRows.push(`|${markdownCells.map(() => ' --- |').join('')}`);
        isHeader = false;
      }
    }
    
    return markdownRows.join('\n') + '\n\n';
  }
});

// HTML to MDX conversion using turndown
function htmlToMdx(html) {
  // 清理 HTML 中的常见问题
  let cleanedHtml = html
    // 处理大写标签
    .replace(/<BR\s*\/?>/g, '<br>')
    .replace(/<DIV/g, '<div')
    .replace(/<\/DIV>/g, '</div>')
    .replace(/<P>/g, '<p>')
    .replace(/<\/P>/g, '</p>')
    .replace(/<FONT/g, '<span')
    .replace(/<\/FONT>/g, '</span>')
    .replace(/<SMALL>/g, '<small>')
    .replace(/<\/SMALL>/g, '</small>')
    .replace(/&nbsp;/g, ' ');

  // 将 HTML 转换为 Markdown
  let markdown = turndownService.turndown(cleanedHtml);
  
  // 清理潜在的多余空行
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  
  return markdown;
}

// Function to extract title from content
function extractTitleFromContent(content) {
  // Try to find a heading in the first few lines
  const lines = content.split('\n');
  
  // First try to find a heading (# Title)
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (line.startsWith('# ')) {
      return line.substring(2).trim();
    }
  }
  
  // If no heading found, use the first significant line
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('![') && !line.match(/^[#\s*_-]+$/)) {
      // Remove any markdown formatting
      const cleanLine = line
        .replace(/[#*_\[\]`]/g, '')
        .replace(/\(.*?\)/g, '')
        .trim();
      
      // Limit to a reasonable length for a title
      if (cleanLine.length > 50) {
        return cleanLine.substring(0, 47) + '...';
      }
      return cleanLine;
    }
  }
  
  return '未命名文章';
}

// Function to generate a title from description or filename
function generateTitle(description, fileName) {
  // If description is available, create a short title from it
  if (description) {
    // Take the first part of the description up to a reasonable length
    const words = description.split(/\s+/);
    let title = words.slice(0, 7).join(' '); // Take first 7 words
    
    // Append ellipsis if truncated
    if (words.length > 7) {
      title += '...';
    }
    
    return title;
  }
  
  // Otherwise use the filename, but clean it up
  if (fileName) {
    // Remove date prefix and extension
    const nameMatch = fileName.match(/^(?:\d{4}-\d{2}-\d{2}-)?(.+?)(?:\.[\w]+)?$/);
    if (nameMatch) {
      // Replace hyphens with spaces and capitalize
      return nameMatch[1].replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize each word
    }
  }
  
  return '未命名文章';
}

// Frontmatter processing
function processFrontmatter(content, filePath) {
  const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return { frontmatter: {}, content };

  const frontmatterText = frontmatterMatch[1];
  const frontmatter = {};
  
  // 检测块标量模式的字段
  const blockScalarFields = new Map();
  let currentBlockField = null;
  let blockContent = '';
  
  // 第一遍扫描 - 识别块标量字段
  const lines = frontmatterText.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // 检查是否是新字段的开始
    const fieldMatch = line.match(/^([^:]+):\s*(.*)$/);
    if (fieldMatch) {
      const [, key, value] = fieldMatch;
      
      // 如果上一个块标量字段还在处理中，完成处理
      if (currentBlockField) {
        blockScalarFields.set(currentBlockField, blockContent.trim());
        blockContent = '';
        currentBlockField = null;
      }
      
      // 检查是否是块标量字段
      if (value.trim() === '|' || value.trim().startsWith('| ')) {
        currentBlockField = key.trim();
        blockContent = value.replace(/^\|\s*/, '').trim(); // 移除块标量指示符
      }
    } else if (currentBlockField) {
      // 如果在处理块标量字段，继续收集内容
      blockContent += (blockContent ? '\n' : '') + line;
    }
  }
  
  // 处理最后一个块标量字段（如果有）
  if (currentBlockField) {
    blockScalarFields.set(currentBlockField, blockContent.trim());
  }
  
  // 第二遍扫描 - 常规解析
  lines.forEach(line => {
    if (!line.trim()) return;
    
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      const keyTrim = key.trim();
      
      // 跳过块标量字段，它们已单独处理
      if (blockScalarFields.has(keyTrim)) return;
      
      // 处理数组（tags）
      if (value.trim().startsWith('[') && value.trim().endsWith(']')) {
        try {
          // 尝试解析 JSON 格式的数组
          const arrayValue = JSON.parse(value.trim());
          frontmatter[keyTrim] = Array.isArray(arrayValue) ? arrayValue.map(String) : 
            value.trim().slice(1, -1).split(',').map(item => item.trim().replace(/^["']|["']$/g, ''));
        } catch (e) {
          // 解析失败，手动拆分
          frontmatter[keyTrim] = value.trim().slice(1, -1).split(',')
            .map(item => item.trim().replace(/^["']|["']$/g, ''));
        }
      } else if (value.trim() === '|' || value.trim().startsWith('| ')) {
        // 块标量字段的开始会在这里跳过，内容已在上面处理
        // 这里跳过是为了避免将块标量指示符作为实际值
      } else {
        frontmatter[keyTrim] = value.trim().replace(/^["']|["']$/g, '');
      }
    }
  });
  
  // 添加块标量字段的内容
  for (const [field, content] of blockScalarFields.entries()) {
    frontmatter[field] = content;
  }

  // Handle publishDate vs date
  if (frontmatter.date && !frontmatter.publishDate) {
    frontmatter.publishDate = frontmatter.date;
    delete frontmatter.date;
  }

  // Move category to tags if present
  if (frontmatter.category) {
    if (!frontmatter.tags) {
      frontmatter.tags = [];
    }
    
    if (typeof frontmatter.tags === 'string') {
      frontmatter.tags = [frontmatter.tags];
    }
    
    // Add category to tags if not already present
    if (!frontmatter.tags.includes(frontmatter.category)) {
      frontmatter.tags.push(frontmatter.category);
    }
    
    delete frontmatter.category;
  }

  // 确保 tags 字段格式正确
  const updatedFrontmatter = ensureTagsArray(frontmatter);

  // Content without frontmatter
  const contentWithoutFrontmatter = content.replace(/---\n[\s\S]*?\n---/, '').trim();

  return { frontmatter: updatedFrontmatter, content: contentWithoutFrontmatter };
}

// 确保 tags 字段为数组格式
function ensureTagsArray(frontmatter) {
  // 如果 frontmatter 不含 tags 字段，添加空数组
  if (!frontmatter.hasOwnProperty('tags')) {
    frontmatter.tags = [];
    return frontmatter;
  }
  
  // 如果 tags 已经是数组，确保里面的值都是字符串，移除空字符串和重复项
  if (Array.isArray(frontmatter.tags)) {
    // 转换为字符串，移除空字符串，然后去重
    frontmatter.tags = [...new Set(frontmatter.tags.map(String).filter(tag => tag.trim() !== ''))];
    return frontmatter;
  }
  
  // 处理 tags 是字符串的情况
  const tagsStr = String(frontmatter.tags).trim();
  
  // 处理带有块标量指示符的情况（例如 "tags: |" 后跟数组）
  if (tagsStr === '|' || tagsStr.startsWith('|')) {
    // 移除块标量指示符号并修剪空白
    const cleanStr = tagsStr.replace(/^\|/, '').trim();
    
    // 如果清理后是数组格式字符串，尝试解析
    if (cleanStr.startsWith('[') && cleanStr.endsWith(']')) {
      try {
        // 尝试解析 JSON 格式的数组
        const tagsArray = JSON.parse(cleanStr);
        frontmatter.tags = Array.isArray(tagsArray) 
          ? [...new Set(tagsArray.map(String).filter(tag => tag.trim() !== ''))]
          : [];
        return frontmatter;
      } catch (e) {
        // 解析失败，手动拆分
        const innerTags = cleanStr.slice(1, -1).split(',')
          .map(t => t.trim().replace(/^["']|["']$/g, ''))
          .filter(tag => tag.trim() !== '');
        frontmatter.tags = [...new Set(innerTags)];
        return frontmatter;
      }
    }
    
    // 如果清理后不是数组格式，但不为空，作为单个标签处理
    if (cleanStr && !cleanStr.startsWith('[')) {
      frontmatter.tags = [cleanStr];
      return frontmatter;
    }
    
    // 默认使用空数组
    frontmatter.tags = [];
    return frontmatter;
  }
  
  // 如果 tags 是数组格式的字符串
  if (tagsStr.startsWith('[') && tagsStr.endsWith(']')) {
    try {
      // 尝试解析 JSON 格式的数组
      const tagsArray = JSON.parse(tagsStr);
      frontmatter.tags = Array.isArray(tagsArray) 
        ? [...new Set(tagsArray.map(String).filter(tag => tag.trim() !== ''))]
        : [];
    } catch (e) {
      // 解析失败，手动拆分
      const innerTags = tagsStr.slice(1, -1).split(',')
        .map(t => t.trim().replace(/^["']|["']$/g, ''))
        .filter(tag => tag.trim() !== '');
      frontmatter.tags = [...new Set(innerTags)];
    }
    return frontmatter;
  }
  
  // 如果 tags 是简单字符串，转换为单元素数组
  if (tagsStr && tagsStr !== '|') {
    frontmatter.tags = [tagsStr];
    return frontmatter;
  }
  
  // 默认情况，设为空数组
  frontmatter.tags = [];
  return frontmatter;
}

// Generate frontmatter string from object
function generateFrontmatter(frontmatter) {
  // 确保 tags 字段为数组
  frontmatter = ensureTagsArray(frontmatter);
  
  let result = '---\n';
  
  // Ensure title is the first field
  if (frontmatter.title) {
    // 使用 fixYamlStringValue 处理标题
    result += `title: ${fixYamlStringValue(frontmatter.title)}\n`;
  }
  
  // Add other fields
  Object.entries(frontmatter).forEach(([key, value]) => {
    if (key === 'title') return; // Already added
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        result += `${key}: []\n`;
      } else {
        // 使用 fixYamlStringValue 处理数组中的每个值
        result += `${key}: [${value.map(v => fixYamlStringValue(v)).join(', ')}]\n`;
      }
    } else if (typeof value === 'string') {
      // 使用 fixYamlStringValue 处理字符串值
      result += `${key}: ${fixYamlStringValue(value)}\n`;
    } else {
      // Other types
      result += `${key}: ${value}\n`;
    }
  });
  
  result += '---\n\n';
  return result;
}

// 修复 YAML 字符串值（从 fix-yaml-quotes.js 合并）
function fixYamlStringValue(value) {
  if (!value) return '""';
  
  // 如果字符串包含引号、特殊字符或过长，使用块样式
  if (value.includes('"') || value.includes("'") || value.includes(':') || 
      value.includes('#') || value.includes('\n') || value.length > 100) {
    return `|\n  ${value.trim().replace(/\n/g, '\n  ')}`;
  } else {
    // 否则，为字符串添加双引号并处理转义
    return `"${value.trim().replace(/"/g, '\\"')}"`;
  }
}

// 检查并修复 MDX 文件中的 YAML 引号问题（从 fix-yaml-quotes.js 合并）
async function checkAndFixYamlQuotes(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 提取 frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return false;
    
    // 解析 frontmatter
    const { frontmatter, content: contentWithoutFrontmatter } = processFrontmatter(content, filePath);
    
    // 重新生成正确格式的 frontmatter
    const newFrontmatter = generateFrontmatter(frontmatter);
    const newContent = `${newFrontmatter}${contentWithoutFrontmatter}`;
    
    // 检查是否有变化
    if (content !== newContent) {
      // 写入修复后的内容
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ 修复了 YAML 引号问题: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`检查 YAML 引号问题时出错 ${filePath}:`, error);
    return false;
  }
}

// Function to get text using Claude CLI
async function getTextWithClaude(prompt) {
  try {
    console.log(`🤖 Running Claude with prompt: ${prompt.substring(0, 50)}...`);
    
    // Execute Claude CLI with the provided prompt
    const exec = promisify(childProcess.exec);
    const { stdout } = await exec(`claude -p "${prompt.replace(/"/g, '\\"')}"`, { 
      encoding: 'utf8',
      timeout: 60000, // 60 second timeout
      maxBuffer: 1024 * 1024 // Increase buffer size to 1MB
    });
    
    // Trim and clean up the result
    return stdout.trim();
  } catch (error) {
    console.error('Error running Claude CLI:', error);
    throw error;
  }
}

// 检查描述是否由 Claude 生成
function isDescriptionFromClaude(filePath) {
  const cache = getClaudeCache();
  return cache.descriptions && cache.descriptions[filePath] !== undefined;
}

// Function to get description using Claude CLI
async function getDescriptionWithClaude(filePath, content, forceRegenerate = false) {
  console.log(`🤖 Getting description for ${filePath}`);
  
  // 先检查缓存，如果不是强制重新生成则使用缓存
  const cachedDescription = getCachedClaudeResponse('descriptions', filePath);
  if (cachedDescription && !forceRegenerate) {
    console.log(`📋 Using cached description for ${filePath}`);
    return cachedDescription;
  }
  
  // Extract the first paragraph of content as fallback
  const firstParagraph = content.split('\n\n')[0].trim();
  const shortDesc = firstParagraph.length > 150 
    ? firstParagraph.substring(0, 150) + '...'
    : firstParagraph;
  
  try {
    // Create prompt for description
    const prompt = `使用最简洁的语言编写 ${filePath} 中内容的描述，用于放在网页的 <description/> 标签服务于 SEO。描述应该突出内容的主要观点和价值。\n\n内容:\n${content.substring(0, 2000)}`;
    
    // Call Claude CLI
    const description = await getTextWithClaude(prompt);
    
    // 缓存结果
    if (description) {
      saveClaudeCache('descriptions', filePath, description);
    }
    
    // Return the description or fallback to the first paragraph
    return description || shortDesc;
  } catch (error) {
    console.error('Error getting description:', error);
    return shortDesc;
  }
}

// Function to get title using Claude CLI
async function getTitleWithClaude(filePath, content) {
  console.log(`🤖 Getting title for ${filePath}`);
  
  // 先检查缓存
  const cachedTitle = getCachedClaudeResponse('titles', filePath);
  if (cachedTitle) {
    console.log(`📋 Using cached title for ${filePath}`);
    return cachedTitle;
  }
  
  // Generate a default title as fallback
  const contentTitle = extractTitleFromContent(content);
  
  try {
    // Create prompt for title
    const prompt = `对于 ${filePath} 中内容编写一个标题，用于放在网页的 <title/> 标签。\n\n内容:\n${content.substring(0, 2000)}`;
    
    // Call Claude CLI
    const title = await getTextWithClaude(prompt);
    
    // 缓存结果
    if (title) {
      saveClaudeCache('titles', filePath, title);
    }
    
    // Return the title or fallback to content-based title
    return title || contentTitle;
  } catch (error) {
    console.error('Error getting title:', error);
    return contentTitle;
  }
}

// Process a single file
async function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  // 检查文件是否已经处理过
  if (isFileProcessed(filePath)) {
    const newPath = getProcessedFiles()[filePath];
    console.log(`⏭️ 文件已处理过，跳过: ${filePath} -> ${newPath}`);
    return newPath;
  }
  
  // MDX 文件主要检查 YAML 格式问题，HTML 问题已在主函数中处理
  if (filePath.endsWith('.mdx')) {
    try {
      // 读取文件内容
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 检查是否存在 YAML 格式问题
      const hasTagsPipeFormat = content.includes('tags: |');
      const hasEmptyTags = content.includes('tags: [,') || content.includes('tags: [ ,') || 
                         content.includes('tags: [],') || content.includes('"",');
      const hasPublishDateIssue = content.includes('publishDate: |');
      
      if (hasTagsPipeFormat || hasEmptyTags || hasPublishDateIssue) {
        console.log(`🔧 修复 YAML 格式问题: ${filePath}`);
        
        // 提取 frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        let frontmatter = {};
        let contentWithoutFrontmatter = content;
        
        if (frontmatterMatch) {
          // 使用更健壮的方式解析 frontmatter
          const { frontmatter: parsedFront, content: parsedContent } = processFrontmatter(content, filePath);
          frontmatter = parsedFront;
          contentWithoutFrontmatter = parsedContent;
        } else {
          contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
        }
        
        // 确保 tags 正确
        frontmatter = ensureTagsArray(frontmatter);
        
        // 确保 publishDate 正确格式
        if (frontmatter.publishDate === '|' || 
            (typeof frontmatter.publishDate === 'string' && frontmatter.publishDate.startsWith('|'))) {
          // 从文件路径中提取日期
          const dateMatch = filePath.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/(?:\d+\.mdx|[^\/]+\.mdx)$/);
          if (dateMatch) {
            frontmatter.publishDate = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]} 00:00:00`;
          } else {
            frontmatter.publishDate = "2000-01-01 00:00:00";
          }
        }
        
        // 生成新的文件内容
        const finalContent = `${generateFrontmatter(frontmatter)}${contentWithoutFrontmatter}`;
        
        // 写入文件
        fs.writeFileSync(filePath, finalContent, 'utf8');
        
        return filePath;
      }
    } catch (error) {
      console.error(`处理 MDX 文件 YAML 格式问题出错 ${filePath}:`, error);
    }
    
    // 检查 YAML 引号问题
    try {
      const needsQuoteFix = await checkAndFixYamlQuotes(filePath);
      
      if (needsQuoteFix) {
        console.log(`🔧 修复了 YAML 引号问题: ${filePath}`);
      }
    } catch (error) {
      console.error(`检查 YAML 引号问题出错 ${filePath}:`, error);
    }
    
    return filePath;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let { frontmatter, content: contentWithoutFrontmatter } = processFrontmatter(content, filePath);
    
    // Extract filename for potential use in title generation
    const fileNameNoExt = path.basename(filePath, path.extname(filePath));
    
    // Add title if missing
    if (!frontmatter.title) {
      console.log(`Adding title to ${filePath}`);
      
      // Use Claude CLI to generate a title
      frontmatter.title = await getTitleWithClaude(filePath, contentWithoutFrontmatter);
      
      console.log(`Generated title with Claude: "${frontmatter.title}"`);
    }
    
    // Add description if missing, or force regenerate if not created by Claude
    const shouldRegenerateDescription = !frontmatter.description || !isDescriptionFromClaude(filePath);
    if (shouldRegenerateDescription) {
      console.log(`需要${frontmatter.description ? '重新' : ''}生成描述: ${filePath}`);
      frontmatter.description = await getDescriptionWithClaude(filePath, contentWithoutFrontmatter, true);
    }
    
    // Convert HTML content to MDX if it's an HTML file
    let processedContent = contentWithoutFrontmatter;
    if (filePath.endsWith('.html')) {
      processedContent = htmlToMdx(contentWithoutFrontmatter);
    }
    
    // Generate the final content with updated frontmatter
    const finalContent = `${generateFrontmatter(frontmatter)}${processedContent}`;
    
    // Determine the new file path
    const fileName = path.basename(filePath);
    const fileExt = path.extname(filePath);
    const newExt = '.mdx';
    
    // Handle different filename patterns
    let newFilePath;
    
    const dateMatch = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-(.*?)(?:\.html|\.md|\.mdx)$/);
    
    if (dateMatch) {
      // Format: YYYY-MM-DD-title.html
      const [, year, month, day, slug] = dateMatch;
      const newDir = path.join(contentDir, year, month, day);
      
      // Create directory if it doesn't exist
      fs.mkdirSync(newDir, { recursive: true });
      
      newFilePath = path.join(newDir, `${slug}${newExt}`);
    } else {
      // Format: YYYY/MM/YYYY-MM-DD-title.html
      const dirYear = path.basename(path.dirname(path.dirname(filePath)));
      const dirMonth = path.basename(path.dirname(filePath));
      
      const fileNameMatch = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-(.*?)(?:\.html|\.md|\.mdx)$/);
      
      if (fileNameMatch) {
        const [, year, month, day, slug] = fileNameMatch;
        
        // Ensure the directory structure exists
        const newDir = path.join(contentDir, year, month, day);
        fs.mkdirSync(newDir, { recursive: true });
        
        newFilePath = path.join(newDir, `${slug}${newExt}`);
      } else {
        // If we can't parse the filename, keep the same structure but change extension
        const newName = fileName.replace(fileExt, newExt);
        newFilePath = path.join(path.dirname(filePath), newName);
      }
    }
    
    // 检查目标文件是否已存在
    if (fs.existsSync(newFilePath) && filePath !== newFilePath) {
      console.log(`⚠️ 目标文件已存在，使用原始路径: ${newFilePath}`);
      newFilePath = filePath.replace(fileExt, newExt);
    }
    
    // Create temp file with new content first
    const tempPath = `${filePath}.temp`;
    fs.writeFileSync(tempPath, finalContent, 'utf8');
    
    // Use git mv to maintain history if the paths are different
    if (filePath !== newFilePath) {
      try {
        // Ensure target directory exists
        fs.mkdirSync(path.dirname(newFilePath), { recursive: true });
        
        // 先检查文件是否在 git 仓库中跟踪
        let isTracked = false;
        try {
          execSync(`git ls-files --error-unmatch "${filePath}"`, { stdio: 'pipe' });
          isTracked = true;
        } catch (e) {
          console.log(`⚠️ 文件不在 git 仓库中跟踪: ${filePath}`);
        }
        
        // First move the temp file to the original location
        fs.renameSync(tempPath, filePath);
        
        if (isTracked) {
          // Then use git mv to move to the new location
          execSync(`git mv "${filePath}" "${newFilePath}"`, { stdio: 'inherit' });
        } else {
          // 如果文件不在 git 仓库中，直接移动
          fs.renameSync(filePath, newFilePath);
        }
      } catch (error) {
        console.error(`无法移动文件 ${filePath} -> ${newFilePath}:`, error);
        // 如果 git mv 失败，尝试直接移动
        if (fs.existsSync(filePath)) {
          fs.renameSync(filePath, newFilePath);
        }
      }
    } else {
      // Just replace the file if paths are the same
      fs.renameSync(tempPath, filePath);
    }
    
    // Run formatters on the new file
    try {
      if (newFilePath.endsWith('.mdx')) {
        console.log(`Formatting ${newFilePath}...`);
        execSync(`bunx autocorrect --fix "${newFilePath}" && bunx markdownlint-cli2 --fix "${newFilePath}"`, { 
          stdio: 'inherit',
          timeout: 30000 // 30 second timeout
        });
      }
    } catch (error) {
      console.warn(`Warning: Formatting failed for ${newFilePath}:`, error);
    }
    
    // 记录已处理的文件
    saveProcessedFile(filePath, newFilePath);
    
    return newFilePath;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return null;
  }
}

// 由于已不再使用处理记录，此函数已不再需要，保留为空实现
function forceReprocessFiles(patterns) {
  console.log('所有文件将被处理，不再需要强制重新处理特定文件。');
  return {};
}

// 确保文件的描述由 Claude 生成
async function ensureClaudeDescriptions() {
  try {
    // 查找所有 MDX 文件
    const mdxFiles = glob.sync(`${contentDir}/**/*.mdx`);
    console.log(`找到 ${mdxFiles.length} 个 MDX 文件需要检查描述。`);
    
    // 获取所有已有 Claude 生成描述的文件
    const cache = getClaudeCache();
    const claudeDescriptionFiles = new Set(
      Object.keys(cache.descriptions || {})
    );
    
    // 找出需要处理的文件
    const filesToProcess = mdxFiles.filter(file => !claudeDescriptionFiles.has(file));
    console.log(`其中 ${filesToProcess.length} 个文件需要生成 Claude 描述。`);
    console.log('所有文件都将被处理，其中需要生成 Claude 描述的文件会更新描述字段。');
    
    return mdxFiles; // 返回所有文件，而不仅仅是需要生成描述的文件
  } catch (error) {
    console.error('检查 Claude 描述时出错:', error);
    return [];
  }
}

// Main function
async function main() {
  try {
    console.log('Starting blog post migration...');
    
    console.log('所有文件都将被处理，确保内容格式符合要求。');
    
    // 确保所有 MDX 文件都有 Claude 生成的描述，并返回所有文件列表
    await ensureClaudeDescriptions();
    
    // 检查所有 MDX 文件中的 tags 字段，记录有问题的文件
    const mdxFiles = glob.sync(`${contentDir}/**/*.mdx`);
    let tagsIssueCount = 0;
    
    for (const file of mdxFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        // 检查是否有问题的 tags 格式
        if (content.includes('tags: [,') || content.includes('tags: [ ,') || 
            content.includes('tags: [],') || content.includes('"",')) {
          console.log(`🔍 发现 tags 格式问题: ${file}`);
          tagsIssueCount++;
        }
      } catch (error) {
        console.error(`检查 tags 时出错 ${file}:`, error);
      }
    }
    
    if (tagsIssueCount > 0) {
      console.log(`发现 ${tagsIssueCount} 个文件存在 tags 格式问题，这些文件将被处理以修复 tags 格式问题。`);
    }
    
    // 添加处理 MDX 文件中 HTML 问题的函数
    async function fixHtmlInMdx(filePath) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 提取 frontmatter 和内容
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) return { fixed: false, message: '无法解析 frontmatter' };
        
        const frontmatterText = frontmatterMatch[0];
        const contentWithoutFrontmatter = content.substring(frontmatterText.length).trim();
        
        // 检查是否包含 HTML 标签
        const htmlTagRegex = /<\/?(?:p|div|br|font|table|tr|td|th|h\d|small|code|pre|blockquote|li|ul|ol|img|a|b|i|em|strong)\b[^>]*>/i;
        if (!htmlTagRegex.test(contentWithoutFrontmatter)) {
          return { fixed: false, message: '无需修复 HTML' };
        }
        
        // 转换 HTML 到 Markdown
        const convertedContent = htmlToMdx(contentWithoutFrontmatter);
        
        // 检查转换结果是否与原始内容不同
        if (convertedContent === contentWithoutFrontmatter) {
          return { fixed: false, message: '转换没有变化' };
        }
        
        // 写入修复后的文件
        fs.writeFileSync(filePath, `${frontmatterText}\n\n${convertedContent}`, 'utf8');
        return { fixed: true, message: '成功修复 HTML' };
      } catch (error) {
        console.error(`修复 HTML 时出错 ${filePath}:`, error);
        return { fixed: false, message: `错误: ${error.message}` };
      }
    }
    
    // 处理所有文件
    const files = glob.sync([
      `${contentDir}/**/*.html`,
      `${contentDir}/**/*.md`,
      `${contentDir}/**/*.mdx`
    ]);
    
    console.log(`找到 ${files.length} 个文件需要处理。`);
    
    // 首先修复所有 MDX 文件中的 HTML 问题
    const mdxFilesToFix = files.filter(file => file.endsWith('.mdx'));
    console.log(`其中 ${mdxFilesToFix.length} 个是 MDX 文件，需要检查 HTML 问题。`);
    
    let fixedHtmlCount = 0;
    for (const file of mdxFilesToFix) {
      const result = await fixHtmlInMdx(file);
      if (result.fixed) {
        console.log(`🔧 HTML 修复成功: ${file}`);
        fixedHtmlCount++;
      }
    }
    
    console.log(`完成 MDX 文件的 HTML 修复，共修复 ${fixedHtmlCount} 个文件。`);
    
    let successCount = 0;
    let failCount = 0;
    
    // 按顺序处理文件，避免 git 冲突
    for (const file of files) {
      const newPath = await processFile(file);
      if (newPath) {
        console.log(`✅ 处理成功: ${file} -> ${newPath}`);
        successCount++;
      } else {
        console.log(`❌ 处理失败: ${file}`);
        failCount++;
      }
    }
    
    console.log('迁移完成!');
    console.log(`总结: 成功处理 ${successCount} 个文件, 失败 ${failCount} 个文件`);
  } catch (error) {
    console.error('迁移过程中出错:', error);
    process.exit(1);
  }
}

// Run the script
main();