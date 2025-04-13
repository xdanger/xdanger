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
 * 4. 使用 `git mv` 来保持 git 历史记录
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';
import { execSync } from 'child_process';
import childProcess from 'child_process';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// =====================================
// 基础配置
// =====================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// 切换到项目根目录
try {
  process.chdir(projectRoot);
  console.log(`🚀 切换到项目根目录：${process.cwd()}`);
} catch (error) {
  console.error(`❌ 无法切换到项目根目录：${error.message}`);
  process.exit(1);
}

const contentDir = path.join(projectRoot, 'src/content/post');

// Claude CLI 路径
const CLAUDE_CLI_PATH = '/Users/xdanger/.claude/local/claude';

// 缓存配置
const cacheDir = path.join(__dirname, '.cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

const convertedFilesPath = path.join(cacheDir, 'converted-files.json');
const claudeCachePath = path.join(cacheDir, 'claude-cache.json');

// =====================================
// 缓存管理
// =====================================

/**
 * 获取 Claude 响应缓存
 */
function getClaudeCache() {
  if (!fs.existsSync(claudeCachePath)) {
    return { titles: {}, descriptions: {} };
  }

  try {
    return JSON.parse(fs.readFileSync(claudeCachePath, 'utf8'));
  } catch (error) {
    console.warn('无法读取 Claude 缓存，将创建新缓存：', error.message);
    return { titles: {}, descriptions: {} };
  }
}

/**
 * 获取缓存的 Claude 响应
 */
function getCachedClaudeResponse(type, filePath) {
  const cache = getClaudeCache();
  return cache[type]?.[filePath];
}

/**
 * 保存 Claude 响应到缓存
 */
function saveClaudeCache(type, filePath, response) {
  const cache = getClaudeCache();
  if (!cache[type]) cache[type] = {};
  cache[type][filePath] = response;
  fs.writeFileSync(claudeCachePath, JSON.stringify(cache, null, 2), 'utf8');
}

/**
 * 检查文件是否已经转换过
 */
function isFileConverted(filePath) {
  try {
    if (!fs.existsSync(convertedFilesPath)) {
      return false;
    }

    const convertedFiles = JSON.parse(fs.readFileSync(convertedFilesPath, 'utf8'));
    return convertedFiles.includes(filePath);
  } catch (error) {
    console.warn('检查转换记录时出错：', error.message);
    return false;
  }
}

/**
 * 记录已转换的文件
 */
function markFileAsConverted(filePath) {
  try {
    let convertedFiles = [];

    if (fs.existsSync(convertedFilesPath)) {
      convertedFiles = JSON.parse(fs.readFileSync(convertedFilesPath, 'utf8'));
    }

    if (!convertedFiles.includes(filePath)) {
      convertedFiles.push(filePath);
      fs.writeFileSync(convertedFilesPath, JSON.stringify(convertedFiles, null, 2), 'utf8');
    }
  } catch (error) {
    console.error('记录转换文件时出错：', error.message);
  }
}

/**
 * 检查描述是否由 Claude 生成
 */
function isDescriptionFromClaude(filePath) {
  const cache = getClaudeCache();
  return cache.descriptions && cache.descriptions[filePath] !== undefined;
}

// =====================================
// Claude CLI 集成
// =====================================

/**
 * 使用 Claude CLI 获取响应
 */
async function getTextWithClaude(prompt) {
  // 提取文件路径用于调试输出
  const filePathMatch = prompt.match(/将\s+([^\s]+)\s+中的/);
  const filePathForLog = filePathMatch ? filePathMatch[1] : 'unknown file';
  console.log(`🤖 Running Claude for file: ${filePathForLog}`);
  console.log(`🤖 Prompt: ${prompt.replace(/"/g, '\\"')}`);

  try {
    // 检查 Claude CLI 是否存在
    if (!fs.existsSync(CLAUDE_CLI_PATH)) {
      console.error(`❌ Claude CLI not found at ${CLAUDE_CLI_PATH}`);
      process.exit(1);
    }

    // 构建命令，直接使用 -p 参数传递提示文本
    const claudeCommand = `${CLAUDE_CLI_PATH} -p "${prompt.replace(/"/g, '\\"')}"`;
    console.log(`📋 Executing Claude command: ${claudeCommand}`);

    // 执行命令
    const exec = promisify(childProcess.exec);
    try {
      const { stdout, stderr } = await exec(claudeCommand, {
        encoding: 'utf8',
        timeout: 120000, // 2 分钟超时
        maxBuffer: 20 * 1024 * 1024, // 20MB 缓冲区
      });

      if (stderr && stderr.trim().length > 0) {
        console.warn(`⚠️ Claude command warnings: ${stderr}`);
      }

      // 检查输出是否有效
      if (!stdout || stdout.trim().length === 0) {
        console.error('❌ Claude command returned empty output');
        process.exit(1);
      }

      return stdout.trim();
    } catch (execError) {
      // 错误报告
      console.error('\n❌ Claude command execution failed:');
      console.error(`Command: ${claudeCommand}`);
      console.error(`Error: ${execError.message}`);

      if (execError.stderr) {
        console.error(`Stderr: ${execError.stderr}`);
      }

      // 中断执行
      console.error('\n🛑 中断程序执行');
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Claude CLI error: ${error.message}`);
    process.exit(1);
  }
}

// =====================================
// HTML 检测和转换
// =====================================

/**
 * 检查内容是否包含 HTML 标签
 */
function containsHtmlTags(content) {
  const htmlTagRegex = /<\/?(?:p|div|br|font|table|tr|td|th|h\d|small|code|pre|blockquote|li|ul|ol|img|a|b|i|em|strong)\b[^>]*>/i;
  return htmlTagRegex.test(content);
}

/**
 * 使用 Claude 将 HTML 转换为 Markdown
 */
async function convertHtmlToMarkdownWithClaude(filePath, content) {
  console.log(`\n📄 处理文件：${filePath}`);

  try {
    // 检查文件是否已经转换过
    if (isFileConverted(filePath)) {
      console.log(`📋 文件已转换过，跳过：${filePath}`);
      return content;
    }

    // 检查内容是否包含 HTML 标签
    if (!containsHtmlTags(content)) {
      console.log(`⏭️ 内容不包含 HTML 标签，无需转换：${filePath}`);
      markFileAsConverted(filePath);
      return content;
    }

    console.log(`🔍 文件包含 HTML 标签，使用 Claude 转换：${filePath}`);

    // 获取相对路径
    const relativePath = path.relative(process.cwd(), filePath);

    // 根据 MIGRATION.md 中的要求构建提示
    const prompt = `将 ${relativePath} 中的内容按你最佳的理解转换为 Markdown JAX 格式，在符合语法标准的前提下尽量保持原文的排版。只返回最后的内容，无需其他对话。`;

    // 调用 Claude CLI
    const convertedContent = await getTextWithClaude(prompt);

    console.log(`✅ 成功转换为 Markdown: ${filePath}`);

    try {
      // 格式化转换后的内容
      console.log(`🔧 格式化 Markdown: ${filePath}`);
      const tempFilePath = `${filePath}.temp`;
      fs.writeFileSync(tempFilePath, convertedContent, 'utf8');

      // 运行格式化命令
      execSync(`bunx autocorrect --fix "${tempFilePath}" && bunx markdownlint-cli2 --fix "${tempFilePath}"`, {
        stdio: 'pipe'
      });

      // 读取格式化后的内容
      const formattedContent = fs.readFileSync(tempFilePath, 'utf8');

      // 删除临时文件
      fs.unlinkSync(tempFilePath);

      // 记录已转换的文件
      markFileAsConverted(filePath);

      return formattedContent;
    } catch (formatError) {
      console.warn(`⚠️ 格式化内容出错：${formatError.message}`);
      // 如果格式化失败，仍然返回转换后的内容
      markFileAsConverted(filePath);
      return convertedContent;
    }
  } catch (error) {
    console.error(`❌ 转换 HTML 到 Markdown 出错 ${filePath}: ${error.message}`);
    return content;
  }
}

// =====================================
// 标题和描述生成
// =====================================

/**
 * 使用 Claude 生成描述
 */
async function getDescriptionWithClaude(filePath, content, forceRegenerate = false) {
  console.log(`🤖 生成描述：${filePath}`);

  // 检查缓存
  const cachedDescription = getCachedClaudeResponse('descriptions', filePath);

  // 对于已转换的文件，检查内容是否与缓存描述匹配
  if (cachedDescription && !forceRegenerate && isFileConverted(filePath)) {
    console.log(`📋 使用缓存的描述：${filePath}`);
    return cachedDescription;
  }

  try {
    // 获取相对路径
    const relativePath = path.relative(process.cwd(), filePath);

    // 构建提示
    const prompt = `使用最简洁的语言编写 ${relativePath} 中内容的描述，用于放在网页的 <description/> 标签服务于 SEO。描述应该突出内容的主要观点和价值。只返回描述，无需其他对话。`;

    // 调用 Claude
    console.log(`🚀 调用 Claude 生成描述：${filePath}`);
    const description = await getTextWithClaude(prompt);

    // 缓存结果
    if (description) {
      saveClaudeCache('descriptions', filePath, description);
      return description;
    }

    // 应该不会走到这里，因为 getTextWithClaude 会在失败时退出程序
    return '这是一篇博客文章';
  } catch (error) {
    console.error(`❌ 获取描述失败 ${filePath}: ${error.message}`);
    return '这是一篇博客文章';
  }
}

/**
 * 从内容中提取标题
 */
function extractTitleFromContent(content) {
  const lines = content.split('\n');

  // 查找标题 (# Title)
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (line.startsWith('# ')) {
      return line.substring(2).trim();
    }
  }

  // 如果找不到标题，使用第一个有意义的行
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('![') && !line.match(/^[#\s*_-]+$/)) {
      // 去除 markdown 格式
      const cleanLine = line
        .replace(/[#*_\[\]`]/g, '')
        .replace(/\(.*?\)/g, '')
        .trim();

      // 限制标题长度
      if (cleanLine.length > 50) {
        return cleanLine.substring(0, 47) + '...';
      }
      return cleanLine;
    }
  }

  return '未命名文章';
}

/**
 * 使用 Claude 生成标题
 */
async function getTitleWithClaude(filePath, content) {
  console.log(`🤖 生成标题：${filePath}`);

  // 检查缓存
  const cachedTitle = getCachedClaudeResponse('titles', filePath);
  if (cachedTitle) {
    console.log(`📋 使用缓存的标题：${filePath}`);
    return cachedTitle;
  }

  try {
    // 获取相对路径
    const relativePath = path.relative(process.cwd(), filePath);

    // 构建提示
    const prompt = `对于 ${relativePath} 中内容编写一个标题，用于放在网页的 <title/> 标签。只返回标题，无需其他对话。`;

    // 调用 Claude
    console.log(`🚀 调用 Claude 生成标题：${filePath}`);
    const title = await getTextWithClaude(prompt);

    // 缓存结果
    if (title) {
      saveClaudeCache('titles', filePath, title);
      return title;
    }

    // 应该不会走到这里，因为 getTextWithClaude 会在失败时退出程序
    const fallbackTitle = extractTitleFromContent(content);
    return fallbackTitle !== '未命名文章' ? fallbackTitle : '未命名文章';
  } catch (error) {
    console.error(`❌ 获取标题失败 ${filePath}: ${error.message}`);

    // 从内容中提取标题作为后备方案
    const contentTitle = extractTitleFromContent(content);
    if (contentTitle !== '未命名文章') {
      return contentTitle;
    }

    // 从文件名中提取
    const nameMatch = filePath.match(/\/([^\/]+)(?:\.html|\.md|\.mdx)$/);
    if (nameMatch) {
      const baseName = nameMatch[1];
      const cleanName = baseName.replace(/^\d+[-_]?/, '');
      return cleanName.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    return '未命名文章';
  }
}

// =====================================
// Frontmatter 处理
// =====================================

/**
 * 处理 frontmatter
 */
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

  // 处理 date 和 publishDate
  if (frontmatter.date && !frontmatter.publishDate) {
    frontmatter.publishDate = frontmatter.date;
    delete frontmatter.date;
  }

  // 处理 category 到 tags 的转换
  if (frontmatter.category) {
    if (!frontmatter.tags) {
      frontmatter.tags = [];
    }

    if (typeof frontmatter.tags === 'string') {
      frontmatter.tags = [frontmatter.tags];
    }

    // 添加 category 到 tags
    if (!frontmatter.tags.includes(frontmatter.category)) {
      frontmatter.tags.push(frontmatter.category);
    }

    delete frontmatter.category;
  }

  // 确保 tags 字段格式正确
  const updatedFrontmatter = ensureTagsArray(frontmatter);

  // 内容（不含 frontmatter）
  const contentWithoutFrontmatter = content.replace(/---\n[\s\S]*?\n---/, '').trim();

  return { frontmatter: updatedFrontmatter, content: contentWithoutFrontmatter };
}

/**
 * 确保 tags 字段为数组格式
 */
function ensureTagsArray(frontmatter) {
  // 如果不含 tags 字段，添加空数组
  if (!frontmatter.hasOwnProperty('tags')) {
    frontmatter.tags = [];
    return frontmatter;
  }

  // 如果 tags 已经是数组，确保内容都是字符串，移除空字符串和重复项
  if (Array.isArray(frontmatter.tags)) {
    frontmatter.tags = [...new Set(frontmatter.tags.map(String).filter(tag => tag.trim() !== ''))];
    return frontmatter;
  }

  // 处理 tags 是字符串的情况
  const tagsStr = String(frontmatter.tags).trim();

  // 处理带有块标量指示符的情况
  if (tagsStr === '|' || tagsStr.startsWith('|')) {
    const cleanStr = tagsStr.replace(/^\|/, '').trim();

    // 如果清理后是数组格式字符串，尝试解析
    if (cleanStr.startsWith('[') && cleanStr.endsWith(']')) {
      try {
        const tagsArray = JSON.parse(cleanStr);
        frontmatter.tags = Array.isArray(tagsArray)
          ? [...new Set(tagsArray.map(String).filter(tag => tag.trim() !== ''))]
          : [];
        return frontmatter;
      } catch (e) {
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
      const tagsArray = JSON.parse(tagsStr);
      frontmatter.tags = Array.isArray(tagsArray)
        ? [...new Set(tagsArray.map(String).filter(tag => tag.trim() !== ''))]
        : [];
    } catch (e) {
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

/**
 * 修复 YAML 字符串值
 */
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

/**
 * 生成 frontmatter 字符串
 */
function generateFrontmatter(frontmatter) {
  // 确保 tags 字段为数组
  frontmatter = ensureTagsArray(frontmatter);

  let result = '---\n';

  // 确保 title 是第一个字段
  if (frontmatter.title) {
    result += `title: ${fixYamlStringValue(frontmatter.title)}\n`;
  }

  // 添加其他字段
  Object.entries(frontmatter).forEach(([key, value]) => {
    if (key === 'title') return; // 已添加

    if (Array.isArray(value)) {
      if (value.length === 0) {
        result += `${key}: []\n`;
      } else {
        result += `${key}: [${value.map(v => fixYamlStringValue(v)).join(', ')}]\n`;
      }
    } else if (typeof value === 'string') {
      result += `${key}: ${fixYamlStringValue(value)}\n`;
    } else {
      // 其他类型
      result += `${key}: ${value}\n`;
    }
  });

  result += '---\n\n';
  return result;
}

/**
 * 检查并修复 MDX 文件中的 YAML 引号问题
 */
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
      console.log(`✅ 修复了 YAML 引号问题：${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`检查 YAML 引号问题时出错 ${filePath}: ${error.message}`);
    return false;
  }
}

// =====================================
// 文件处理
// =====================================

/**
 * 检查 MDX 文件中的 HTML 标签并使用 Claude 转换为 Markdown
 */
async function fixHtmlInMdx(filePath) {
  try {
    // 检查文件是否已经转换过
    if (isFileConverted(filePath)) {
      console.log(`📋 文件已转换过，跳过：${filePath}`);
      return { fixed: false, message: '文件已转换过' };
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // 提取 frontmatter 和内容
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return { fixed: false, message: '无法解析 frontmatter' };

    const frontmatterText = frontmatterMatch[0];
    const contentWithoutFrontmatter = content.substring(frontmatterText.length).trim();

    // 检查是否包含 HTML 标签
    if (containsHtmlTags(contentWithoutFrontmatter)) {
      console.log(`🔍 文件包含 HTML 标签，使用 Claude 转换：${filePath}`);

      // 使用 Claude 转换内容
      const convertedContent = await convertHtmlToMarkdownWithClaude(filePath, contentWithoutFrontmatter);

      // 写入转换后的内容
      fs.writeFileSync(filePath, `${frontmatterText}\n\n${convertedContent}`, 'utf8');

      return { fixed: true, message: '使用 Claude 转换了 HTML 内容' };
    }

    return { fixed: false, message: '无需修复 HTML' };
  } catch (error) {
    console.error(`检查 HTML 标签时出错 ${filePath}: ${error.message}`);
    return { fixed: false, message: `错误：${error.message}` };
  }
}

/**
 * 处理单个文件
 */
async function processFile(filePath) {
  console.log(`Processing: ${filePath}`);

  // MDX 文件主要检查 YAML 格式问题，HTML 问题已在主函数中处理
  if (filePath.endsWith('.mdx')) {
    try {
      // 检查是否存在 YAML 格式问题
      await checkAndFixYamlQuotes(filePath);
      return filePath;
    } catch (error) {
      console.error(`处理 MDX 文件 YAML 格式问题出错 ${filePath}: ${error.message}`);
    }
    return filePath;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let { frontmatter, content: contentWithoutFrontmatter } = processFrontmatter(content, filePath);

    // 添加标题（如果缺失）
    if (!frontmatter.title) {
      console.log(`Adding title to ${filePath}`);
      frontmatter.title = await getTitleWithClaude(filePath, contentWithoutFrontmatter);
      console.log(`Generated title with Claude: "${frontmatter.title}"`);
    }

    // 添加描述（如果缺失或者不是 Claude 生成的）
    const shouldRegenerateDescription = !frontmatter.description || !isDescriptionFromClaude(filePath);
    if (shouldRegenerateDescription) {
      console.log(`需要${frontmatter.description ? '重新' : ''}生成描述：${filePath}`);
      frontmatter.description = await getDescriptionWithClaude(filePath, contentWithoutFrontmatter, true);
    }

    // 使用 Claude 转换 HTML 到 Markdown
    let processedContent = contentWithoutFrontmatter;
    if (filePath.endsWith('.html')) {
      if (!isFileConverted(filePath)) {
        console.log(`🤖 转换 HTML 文件为 Markdown: ${filePath}`);
        processedContent = await convertHtmlToMarkdownWithClaude(filePath, contentWithoutFrontmatter);
      } else {
        console.log(`📋 HTML 文件已转换过，跳过：${filePath}`);
      }
    }

    // 生成最终内容
    const finalContent = `${generateFrontmatter(frontmatter)}${processedContent}`;

    // 确定新的文件路径
    const fileName = path.basename(filePath);
    const fileExt = path.extname(filePath);
    const newExt = '.mdx';

    let newFilePath;
    const dateMatch = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-(.*?)(?:\.html|\.md|\.mdx)$/);

    if (dateMatch) {
      // 格式：YYYY-MM-DD-title.html
      const [, year, month, day, slug] = dateMatch;
      const newDir = path.join(contentDir, year, month, day);

      // 创建目录
      fs.mkdirSync(newDir, { recursive: true });
      newFilePath = path.join(newDir, `${slug}${newExt}`);
    } else {
      // 其他格式
      const dirYear = path.basename(path.dirname(path.dirname(filePath)));
      const dirMonth = path.basename(path.dirname(filePath));
      const fileNameMatch = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-(.*?)(?:\.html|\.md|\.mdx)$/);

      if (fileNameMatch) {
        const [, year, month, day, slug] = fileNameMatch;
        const newDir = path.join(contentDir, year, month, day);
        fs.mkdirSync(newDir, { recursive: true });
        newFilePath = path.join(newDir, `${slug}${newExt}`);
      } else {
        // 无法解析文件名，保持相同结构但更改扩展名
        const newName = fileName.replace(fileExt, newExt);
        newFilePath = path.join(path.dirname(filePath), newName);
      }
    }

    // 检查目标文件是否已存在
    if (fs.existsSync(newFilePath) && filePath !== newFilePath) {
      console.log(`⚠️ 目标文件已存在，使用原始路径：${newFilePath}`);
      newFilePath = filePath.replace(fileExt, newExt);
    }

    // 创建临时文件
    const tempPath = `${filePath}.temp`;
    fs.writeFileSync(tempPath, finalContent, 'utf8');

    // 使用 `git mv` 来保持历史记录
    if (filePath !== newFilePath) {
      try {
        // 确保目标目录存在
        fs.mkdirSync(path.dirname(newFilePath), { recursive: true });

        // 检查文件是否在 git 仓库中跟踪
        let isTracked = false;
        try {
          execSync(`git ls-files --error-unmatch "${filePath}"`, { stdio: 'pipe' });
          isTracked = true;
        } catch (e) {
          console.log(`⚠️ 文件不在 git 仓库中跟踪：${filePath}`);
        }

        // 先移动临时文件到原始位置
        fs.renameSync(tempPath, filePath);

        if (isTracked) {
          // 使用 `git mv` 移动到新位置
          execSync(`git mv "${filePath}" "${newFilePath}"`, { stdio: 'inherit' });
        } else {
          // 如果文件不在 git 仓库中，直接移动
          fs.renameSync(filePath, newFilePath);
        }
      } catch (error) {
        console.error(`无法移动文件 ${filePath} -> ${newFilePath}: ${error.message}`);
        // 如果 `git mv` 失败，尝试直接移动
        if (fs.existsSync(filePath)) {
          fs.renameSync(filePath, newFilePath);
        }
      }
    } else {
      // 如果路径相同，直接替换
      fs.renameSync(tempPath, filePath);
    }

    // 对新文件运行格式化
    try {
      if (newFilePath.endsWith('.mdx')) {
        console.log(`Formatting ${newFilePath}...`);
        execSync(`bunx autocorrect --fix "${newFilePath}" && bunx markdownlint-cli2 --fix "${newFilePath}"`, {
          stdio: 'inherit',
          timeout: 30000 // 30 秒超时
        });
      }
    } catch (error) {
      console.warn(`Warning: Formatting failed for ${newFilePath}: ${error.message}`);
    }

    return newFilePath;
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
    return null;
  }
}

// =====================================
// 主函数
// =====================================

/**
 * 确保 Claude CLI 可用
 */
function ensureClaudeCliAvailable() {
  // 检查 Claude CLI 是否存在
  if (!fs.existsSync(CLAUDE_CLI_PATH)) {
    console.error(`\n❌ Claude CLI not found at ${CLAUDE_CLI_PATH}`);
    console.error(`Please make sure Claude CLI is installed and available at the specified path.`);
    return false;
  }

  // 检查 Claude CLI 是否可执行
  try {
    const versionOutput = execSync(`${CLAUDE_CLI_PATH} --version`, { encoding: 'utf8' }).trim();
    console.log(`✅ Found Claude CLI: ${versionOutput}`);
    return true;
  } catch (error) {
    console.error(`\n❌ Claude CLI exists but cannot be executed: ${error.message}`);
    return false;
  }
}

/**
 * 确保所有 MDX 文件都有 Claude 生成的描述
 */
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

    return mdxFiles;
  } catch (error) {
    console.error('检查 Claude 描述时出错：', error.message);
    return [];
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('Starting blog post migration...');

    // 确保 Claude CLI 可用
    if (!ensureClaudeCliAvailable()) {
      console.error('Migration aborted due to Claude CLI issues.');
      process.exit(1);
    }

    console.log('所有文件都将被处理，确保内容格式符合要求。');

    // 确保所有 MDX 文件都有 Claude 生成的描述
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
          console.log(`🔍 发现 tags 格式问题：${file}`);
          tagsIssueCount++;
        }
      } catch (error) {
        console.error(`检查 tags 时出错 ${file}: ${error.message}`);
      }
    }

    if (tagsIssueCount > 0) {
      console.log(`发现 ${tagsIssueCount} 个文件存在 tags 格式问题，这些文件将被处理以修复 tags 格式问题。`);
    }

    // 查找需要处理的文件
    const files = glob.sync([
      `${contentDir}/**/*.html`,
      `${contentDir}/**/*.md`,
      `${contentDir}/**/*.mdx`
    ]);

    console.log(`找到 ${files.length} 个文件需要处理。`);

    // 检查并使用 Claude 修复所有 MDX 文件中的 HTML 问题
    const mdxFilesToCheck = files.filter(file => file.endsWith('.mdx'));
    console.log(`其中 ${mdxFilesToCheck.length} 个是 MDX 文件，需要检查 HTML 问题。`);

    let htmlFixedCount = 0;

    for (const file of mdxFilesToCheck) {
      const result = await fixHtmlInMdx(file);
      if (result.message === '使用 Claude 转换了 HTML 内容') {
        htmlFixedCount++;
      }
    }

    if (htmlFixedCount > 0) {
      console.log(`✅ 成功使用 Claude 转换了 ${htmlFixedCount} 个含有 HTML 标签的 MDX 文件。`);
    } else {
      console.log('未发现需要转换的 MDX 文件（所有文件已处理或无 HTML 标签）。');
    }

    let successCount = 0;
    let failCount = 0;

    // 按顺序处理文件，避免 git 冲突
    for (const file of files) {
      const newPath = await processFile(file);
      if (newPath) {
        console.log(`✅ 处理成功：${file} -> ${newPath}`);
        successCount++;
      } else {
        console.log(`❌ 处理失败：${file}`);
        failCount++;
      }
    }

    console.log('迁移完成！');
    console.log(`总结：成功处理 ${successCount} 个文件，失败 ${failCount} 个文件`);

    // 显示缓存文件信息
    if (fs.existsSync(convertedFilesPath)) {
      try {
        const convertedFiles = JSON.parse(fs.readFileSync(convertedFilesPath, 'utf8'));
        console.log('\n📋 HTML 内容转换摘要：');
        console.log(`已处理 ${convertedFiles.length} 个文件，记录在 ${convertedFilesPath}`);

        // 统计不同类型的文件
        const htmlCount = convertedFiles.filter(file => file.endsWith('.html')).length;
        const mdxCount = convertedFiles.filter(file => file.endsWith('.mdx')).length;
        const mdCount = convertedFiles.filter(file => file.endsWith('.md')).length;

        console.log(`- 已处理的 HTML 文件数：${htmlCount}`);
        console.log(`- 已处理的 MDX 文件数：${mdxCount}`);
        console.log(`- 已处理的 MD 文件数：${mdCount}`);

        // 检查缓存中描述的情况
        if (fs.existsSync(claudeCachePath)) {
          try {
            const claudeCache = JSON.parse(fs.readFileSync(claudeCachePath, 'utf8'));
            const descriptionCount = Object.keys(claudeCache.descriptions || {}).length;
            const titleCount = Object.keys(claudeCache.titles || {}).length;
            console.log(`- 使用 Claude 生成的文件描述数：${descriptionCount}`);
            console.log(`- 使用 Claude 生成的文件标题数：${titleCount}`);
          } catch (e) {
            console.warn('无法读取 Claude 缓存统计信息');
          }
        }
      } catch (error) {
        console.error('读取转换记录时出错：', error.message);
      }
    }
  } catch (error) {
    console.error('迁移过程中出错：', error);
    process.exit(1);
  }
}

// 执行脚本
main();