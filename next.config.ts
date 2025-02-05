import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
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
