# 内容管理指南

本文档详细说明了如何在项目中添加、编辑和管理博客内容。

## 文章目录结构

项目采用基于年份和月份的目录结构组织博客文章：

```plaintext
_posts/
├── 2002/
│   ├── 2002-12-12-000007.html
│   ├── 2002-12-19-000008.html
│   └── ...
├── 2003/
│   ├── 2003-01-01-000010.html
│   └── ...
├── ...
└── 2023/
    ├── 01/
    │   └── 2023-01-01-ml-is-the-infra-of-all-industry.md
    ├── 05/
    │   ├── 2023-05-15-compression-is-intelligence.md
    │   └── 2023-05-18-montanas-ban-on-tiktok-is-unconstitutional.md
    └── ...
```

## 支持的文件格式

系统目前支持两种主要格式：

1. **Markdown 文件 (.md)**
   - 推荐用于所有新文章
   - 支持前置元数据
   - 支持 Markdown 语法功能

2. **HTML 文件 (.html)**
   - 适用于旧文章和需要特殊 HTML 布局的文章
   - 仍需包含 HTML 文档结构

## 创建新文章

### Markdown 文章

1. 在适当的年份和月份目录中创建新文件 (`_posts/YYYY/MM/YYYY-MM-DD-slug.md`)
2. 添加必要的前置元数据
3. 编写文章内容

**示例 Markdown 文件结构**：

```markdown
---
title: 文章标题
date: 2023-12-25
description: 可选描述，将用于预览
categories: [技术，思考]
---

这是文章内容。

## 小标题

这是段落内容。

### 代码示例

```js
const greeting = "Hello, World!";
console.log(greeting);
```

## 前置元数据

Markdown 文章使用 YAML 格式的前置元数据，位于文件顶部的三个短横线之间：

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 文章标题 |
| `date` | 是 | 发布日期 (YYYY-MM-DD 格式) |
| `description` | 否 | 文章简短描述，用于预览 |
| `categories` | 否 | 文章分类，以数组形式 |
| `featured` | 否 | 设为 `true` 使文章在首页突出显示 |

## 添加图片和资源

### 图片存放

1. 将图片文件放入 `/public/images/` 目录
2. 在文章中使用相对路径引用：

```markdown
![图片描述](/images/my-image.jpg)
```

对于需要优化的图像，推荐使用 Next.js Image 组件：

```jsx
<Image
  src="/images/my-image.jpg"
  alt="图片描述"
  width={800}
  height={600}
  priority
/>
```

### 其他资源

其他资源文件（PDF、ZIP 等）应放在 `/public/assets/` 目录，使用类似方式引用：

```markdown
[下载文档](/assets/document.pdf)
```

## 编辑现有文章

1. 找到对应文章文件
2. 进行必要修改
3. 重新构建站点以应用更改

重要：修改文章 slug（文件名）会改变其 URL，这可能破坏现有链接。

## 内容格式指南

### Markdown 格式

项目支持标准 Markdown 语法，包括：

- 标题 (# 一级标题, ## 二级标题, 等)
- 强调 (*斜体*, **粗体**, ***粗斜体***)
- 列表 (有序和无序)
- 链接 `[文本](URL)`
- 图片 `![描述](URL)`
- 代码块 (行内和块级)
- 引用块 (> 引用文本)
- 表格

### 代码语法高亮

使用三个反引号和语言标识符启用语法高亮：

````markdown
```javascript
function hello() {
  console.log("Hello, world!");
}
```
````

支持的语言包括：`javascript`, `typescript`, `jsx`, `tsx`, `html`, `css`, `python`, `bash`, `json` 等。

### HTML 嵌入

Markdown 文件中可以使用 HTML：

```markdown
正常 Markdown 文本

<div className="custom-container">
  <p>这是嵌入的 HTML</p>
</div>

继续 Markdown 文本
```

## 内容预览和发布流程

### 本地预览

1. 运行开发服务器：`npm run dev`
2. 在浏览器中访问 `http://localhost:3000` 预览
3. 实时编辑文章文件，页面会自动更新

### 构建和发布

1. 运行构建：`npm run build`
2. 检查 `_sites` 目录中的输出
3. 将更改推送到主分支触发自动部署

## URL 结构

文章 URL 是基于文件路径自动生成的：

- **文件路径**：`_posts/2023/05/2023-05-15-compression-is-intelligence.md`
- **生成的 URL**：`/2023/05/compression-is-intelligence`

URL 结构遵循 `/{年份}/{月份}/{slug}` 模式，其中 slug 是从文件名中提取的。

## 排序和筛选

文章默认按发布日期降序排列。分类和标签系统正在开发中。

## 内容迁移提示

### 从其他平台迁移

当从 WordPress, Medium 或其他平台迁移内容时：

1. 确保保留原始发布日期
2. 将旧链接添加到前置元数据中以便将来实现重定向
3. 检查并调整格式，确保兼容性
4. 验证图片和嵌入内容是否正确显示

### 批量导入

对于批量导入内容，可以开发简单的脚本将其他格式转换为适当的 Markdown 文件结构，并放入正确的目录。
