/**
 * Next.js静态导出后处理脚本
 * 解决RSC数据文件(.txt)命名不一致的问题
 *
 * 问题：浏览器请求/path/file.html.txt但实际文件是/path/file.txt
 * 解决：将所有.txt文件重命名为.html.txt格式
 */

import fs from 'fs';
import path from 'path';
import * as globModule from 'glob';

// 输出目录
const outDir = path.join(process.cwd(), 'out');

async function run() {
  try {
    console.log('🔄 开始处理RSC数据文件...');

    // 使用 glob.sync 而非 promisify
    const txtFiles = globModule.sync('**/*.txt', { cwd: outDir });
    console.log(`找到 ${txtFiles.length} 个 .txt 文件`);

    let processedCount = 0;

    for (const txtFile of txtFiles) {
      const txtPath = path.join(outDir, txtFile);

      // 创建.html.txt目标路径
      const txtDirname = path.dirname(txtPath);
      const txtBasename = path.basename(txtPath, '.txt');
      const htmlTxtPath = path.join(txtDirname, `${txtBasename}.html.txt`);

      // 检查对应的.html文件是否存在
      const htmlPath = path.join(txtDirname, `${txtBasename}.html`);
      if (fs.existsSync(htmlPath)) {
        console.log(`📄 处理: ${txtFile} -> ${txtBasename}.html.txt`);

        // 复制为新文件而不是重命名
        // 这样可以保留原文件，避免兼容性问题
        fs.copyFileSync(txtPath, htmlTxtPath);
        processedCount++;
      }
    }

    console.log(`✅ 处理完成! 复制了 ${processedCount}/${txtFiles.length} 个文件`);
  } catch (error) {
    console.error('❌ 处理RSC数据文件时出错:', error);
    process.exit(1);
  }
}

run();