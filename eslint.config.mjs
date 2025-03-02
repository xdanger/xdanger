/**
 * ESLint 配置文件 (新的平面配置格式)
 *
 * 使用 ESLint 新的平面配置格式，结合 @eslint/eslintrc 的兼容层
 * 扩展 Next.js 推荐的核心 Web Vitals 和 TypeScript 规则
 */
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
