/**
 * Next.js 配置文件
 *
 * 本配置专为静态博客网站导出优化，主要特点：
 * 1. 使用静态导出模式 (output: 'export')
 * 2. 生成干净的URL格式 (/path/file.html 而非 /path/file/index.html)
 * 3. 确保RSC数据文件(.txt)与HTML文件命名一致，解决客户端渲染问题
 *
 * @type {import('next').NextConfig}
 */

// 简化配置，专注于静态导出
const nextConfig = {
  // 静态导出配置
  output: 'export',

  // 图片优化配置
  images: {
    unoptimized: true,
  },

  // 禁用类型检查
  typescript: {
    ignoreBuildErrors: false,
  },

  // 关键配置：禁用trailingSlash并启用扩展名
  // 这会生成 /path/file.html 而不是 /path/file/index.html
  trailingSlash: false,

  // 确保我们的链接格式正确
  basePath: '',

  // 确保RSC数据文件(.txt)与HTML文件命名一致
  // 这将修复客户端请求path.html.txt但实际文件是path.txt的问题
  outputFileTracingIncludes: {
    // 包括所有RSC数据文件
    '/**/*.txt': ['/**/*.html.txt'],
  },

  // 其他实验性配置（如果需要）
  experimental: {
    // 未来可能的实验性选项
  },
};

export default nextConfig;