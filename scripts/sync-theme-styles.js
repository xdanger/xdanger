// 同步主题变量脚本
// 此脚本仅用于兼容构建流程，实际上不会生成theme-styles.css文件
// 原始功能是从 globals.css 提取 CSS 变量并更新 theme-styles.css

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文件路径
const globalsPath = path.join(__dirname, '../app/globals.css');
// 删除了对theme-styles.css路径的定义，因为我们不再使用这些文件

// 仅为了保持兼容性的空函数
function extractCssVars() {
  // 返回空对象，不再提取实际内容
  return { rootVars: '', darkVars: '' };
}

// 更新主函数，不再实际创建文件
function syncThemeStyles() {
  try {
    // 检查文件是否存在
    if (fs.existsSync(globalsPath)) {
      console.log(`✅ 已确认globals.css文件存在: ${globalsPath}`);
    }

    // 调用函数但不使用返回值
    extractCssVars();

    console.log('✅ 主题变量同步操作已被跳过，所有样式已整合到globals.css');
    return true;
  } catch (error) {
    console.error('❌ 同步主题变量时出现错误:', error);
    return false;
  }
}

// 执行同步操作
const success = syncThemeStyles();

// 返回适当的退出码
process.exit(success ? 0 : 1);