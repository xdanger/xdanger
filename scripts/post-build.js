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
const docsDir = path.join(process.cwd(), 'docs');

/**
 * 处理RSC数据文件
 */
async function processTxtFiles() {
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

/**
 * 将 out 目录同步到 docs 目录
 * 实现类似 rsync -av --delete ./out/ ./docs/ 的效果
 */
async function syncToDocs() {
  try {
    console.log('🔄 开始将 out 目录同步到 docs 目录...');

    // 确保 docs 目录存在
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
      console.log(`📁 创建 docs 目录`);
    }

    // 1. 获取 out 目录中的所有文件和目录
    const outFiles = getAllFiles(outDir);
    console.log(`📝 out 目录中共有 ${outFiles.length} 个文件`);

    // 2. 获取 docs 目录中的所有文件和目录
    const docsFiles = getAllFiles(docsDir);
    console.log(`📝 docs 目录中共有 ${docsFiles.length} 个文件`);

    // 3. 复制 out 目录中的所有文件到 docs 目录
    let copiedCount = 0;
    for (const file of outFiles) {
      const relativePath = path.relative(outDir, file);
      const targetPath = path.join(docsDir, relativePath);

      // 确保目标目录存在
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 复制文件
      fs.copyFileSync(file, targetPath);
      copiedCount++;
    }
    console.log(`📋 复制了 ${copiedCount} 个文件到 docs 目录`);

    // 4. 删除 docs 目录中有但 out 目录中没有的文件
    let deletedCount = 0;
    for (const file of docsFiles) {
      const relativePath = path.relative(docsDir, file);
      const sourceFile = path.join(outDir, relativePath);

      // 如果文件在 out 目录中不存在，则删除
      if (!fs.existsSync(sourceFile)) {
        fs.unlinkSync(file);
        deletedCount++;
      }
    }
    console.log(`🗑️ 删除了 ${deletedCount} 个多余文件`);

    // 5. 删除空目录
    cleanEmptyDirs(docsDir);

    console.log('✅ 目录同步完成!');
  } catch (error) {
    console.error('❌ 同步目录时出错:', error);
    process.exit(1);
  }
}

/**
 * 递归获取目录中的所有文件
 */
function getAllFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * 递归清理空目录
 */
function cleanEmptyDirs(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // 先递归处理子目录
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name);
      cleanEmptyDirs(fullPath);
    }
  }

  // 再次检查当前目录是否为空
  const afterEntries = fs.readdirSync(dir);
  if (afterEntries.length === 0) {
    // 不删除 docs 根目录
    if (dir !== docsDir) {
      fs.rmdirSync(dir);
    }
  }
}

async function run() {
  // 处理RSC数据文件
  await processTxtFiles();

  // 同步到docs目录
  await syncToDocs();
}

run();