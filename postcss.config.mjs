/**
 * PostCSS 配置文件
 *
 * 配置用于处理CSS的工具链，主要为Tailwind CSS v4
 * - 使用 @tailwindcss/postcss 插件处理Tailwind指令
 * - 指定Tailwind配置文件路径
 *
 * @type {import('postcss-load-config').Config}
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {
      config: './tailwind.config.js',
    },
  },
};

export default config;
