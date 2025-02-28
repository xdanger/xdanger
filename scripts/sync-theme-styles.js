// 同步主题变量脚本
// 此脚本从 globals.css 提取 CSS 变量并更新 theme-styles.css

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文件路径
const globalsPath = path.join(__dirname, '../app/globals.css');
const themeStylesPath = path.join(__dirname, '../app/theme-styles.css');
// 为了兼容性，仍然保留一份在public目录
const publicThemeStylesPath = path.join(__dirname, '../public/theme-styles.css');

// 读取文件内容
const globalsContent = fs.readFileSync(globalsPath, 'utf8');

// 提取根变量和暗色模式变量
function extractCssVars(content) {
  // 提取 :root {...} 块中的变量
  const rootMatch = content.match(/:root\s*{([^}]*)}/s);
  const rootVars = rootMatch ? rootMatch[1] : '';

  // 提取 .dark {...} 块中的变量
  const darkMatch = content.match(/\.dark\s*{([^}]*)}/s);
  const darkVars = darkMatch ? darkMatch[1] : '';

  return { rootVars, darkVars };
}

// 创建新的 theme-styles.css 内容
function createThemeStylesContent(rootVars, darkVars) {
  return `/**
 * 备份主题样式
 * 这些样式会在静态导出模式下提供基本的亮色/暗色主题支持
 * 由 sync-theme-styles.js 自动生成，请勿手动修改
 */

/* 亮色模式（默认）样式 */
:root {${rootVars}}

.light {${rootVars}}

/* 暗色模式样式 */
.dark {${darkVars}}

/* 基本文本颜色应用 */
body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

/* 常用Tailwind类的直接实现 */
.text-foreground {
  color: hsl(var(--foreground));
}

.bg-background {
  background-color: hsl(var(--background));
}

.text-muted-foreground {
  color: hsl(var(--muted-foreground));
}

/* 文章内容样式 */
.prose {
  color: hsl(var(--foreground));
}

.dark .prose {
  color: hsl(var(--foreground));
}

.prose a {
  color: hsl(var(--primary));
  text-decoration: underline;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: hsl(var(--foreground));
  font-weight: bold;
}

.prose p,
.prose ul,
.prose ol {
  color: hsl(var(--foreground));
}

/* 优化时间显示 */
time {
  color: hsl(var(--muted-foreground));
}

/* 修复一些特定元素在暗色模式下的颜色 */
.dark a:not(.no-underline) {
  color: hsl(var(--foreground));
}`;
}

// 主函数
function syncThemeStyles() {
  try {
    // 提取变量
    const { rootVars, darkVars } = extractCssVars(globalsContent);

    // 创建新内容
    const newContent = createThemeStylesContent(rootVars, darkVars);

    // 写入文件到app目录
    fs.writeFileSync(themeStylesPath, newContent, 'utf8');

    // 同时保留一份到public目录（为了兼容性）
    fs.writeFileSync(publicThemeStylesPath, newContent, 'utf8');

    console.log('✅ 成功同步主题变量到 theme-styles.css');
  } catch (error) {
    console.error('❌ 同步主题变量失败:', error);
    process.exit(1);
  }
}

// 执行
syncThemeStyles();