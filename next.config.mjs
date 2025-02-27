/** @type {import('next').NextConfig} */

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
    ignoreBuildErrors: true,
  },

  // 关键配置：禁用trailingSlash并启用扩展名
  // 这会生成 /path/file.html 而不是 /path/file/index.html
  trailingSlash: false,

  // 确保我们的链接格式正确
  basePath: '',
};

export default nextConfig;