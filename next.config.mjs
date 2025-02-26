/** @type {import('next').NextConfig} */

// 区分开发和生产环境的配置
const nextConfig = {
  // 仅在生产环境使用静态导出
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // rewrites在静态导出时不会自动工作，但在开发环境中有效
  async rewrites() {
    return [
      {
        source: '/:path*.html',
        destination: '/:path*',
      }
    ];
  },
};

export default nextConfig;