# xdanger.com

- package manager: `bun`, DO NOT use `npm`, `yarn` or `pnpm`
- 使用 `bun run build` 构建和测试
- `.astro`, `.tsx`, `.ts`, `.mjs`, `.jsx`, `.js`, `.json`, `.mdx` 文件需要经过 `bunx biome format --write {file_path} && bunx autocorrect --fix {file_path}` 检查和修复
- `.mdx` 文件需要经过 `bunx markdownlint-cli2 --fix {file_path}` 格式化
