# API 参考

本文档提供项目中主要函数、组件和工具的详细 API 参考。

## 文章处理 API (lib/posts.ts)

### `getAllPosts()`

获取所有博客文章的元数据，按日期排序。

**返回值**:

```typescript
Post[] // 所有文章对象的数组
```

**示例**:

```typescript
import { getAllPosts } from '@/lib/posts';

// 获取所有文章
const allPosts = getAllPosts();

// 获取最近 5 篇文章
const recentPosts = getAllPosts().slice(0, 5);
```

### `getPostBySlug(slug: string[])`

根据 slug 获取特定文章的完整内容。

**参数**:

- `slug: string[]` - 文章的 URL 路径部分，作为字符串数组

**返回值**:

```typescript
{
  title: string;
  date: string;
  content: string;
  slug: string[];
}
```

**示例**:

```typescript
import { getPostBySlug } from '@/lib/posts';

// 获取指定 slug 的文章
const post = getPostBySlug(['2023', '01', '01-hello-world']);
```

### `markdownToHtml(markdown: string)`

将 Markdown 文本转换为 HTML。

**参数**:

- `markdown: string` - 原始 Markdown 内容

**返回值**:

```typescript
string // HTML 字符串
```

**示例**:

```typescript
import { markdownToHtml } from '@/lib/posts';

const htmlContent = await markdownToHtml('# Hello World');
// 返回：'<h1>Hello World</h1>'
```

## 组件 API

### Header

网站顶部导航组件。

**属性**:

```typescript
interface HeaderProps {
  className?: string;
}
```

**示例**:

```tsx
import { Header } from '@/components/header';

<Header className="mb-8" />
```

### PostList

文章列表组件，支持无限滚动。

**属性**:

```typescript
interface PostListProps {
  initialPosts: Post[];
  category?: string;
}
```

**示例**:

```tsx
import { PostList } from '@/components/post-list';
import { getAllPosts } from '@/lib/posts';

const posts = getAllPosts();

<PostList initialPosts={posts} />
```

### PostPreview

文章预览卡片组件。

**属性**:

```typescript
interface PostPreviewProps {
  post: {
    title: string;
    date: string;
    slug: string[];
    excerpt?: string;
  };
  featured?: boolean;
}
```

**示例**:

```tsx
import { PostPreview } from '@/components/post-preview';

<PostPreview
  post={{
    title: "Hello World",
    date: "2023-01-01",
    slug: ["2023", "01", "01-hello-world"]
  }}
  featured={true}
/>
```

### ModeToggle

主题切换按钮组件。

**属性**: 无

**示例**:

```tsx
import { ModeToggle } from '@/components/mode-toggle';

<ModeToggle />
```

## 工具函数 API (lib/utils.ts)

### `cn(...inputs: ClassValue[])`

合并 Tailwind CSS 类名，解决类名冲突。

**参数**:

- `...inputs: ClassValue[]` - 要合并的类名

**返回值**:

```typescript
string // 合并后的类名字符串
```

**示例**:

```typescript
import { cn } from '@/lib/utils';

const className = cn(
  'base-class',
  condition && 'conditional-class',
  'override-class'
);
```

### `formatDate(date: string)`

格式化日期字符串为易读形式。

**参数**:

- `date: string` - ISO 格式的日期字符串

**返回值**:

```typescript
string // 格式化后的日期字符串
```

**示例**:

```typescript
import { formatDate } from '@/lib/utils';

const formattedDate = formatDate('2023-01-01');
// 返回：'January 1, 2023'
```

## 钩子 API (hooks/)

### `useMobile()`

检测当前视口是否为移动设备尺寸。

**返回值**:

```typescript
boolean // 如果是移动设备视口则为 true
```

**示例**:

```typescript
import { useMobile } from '@/hooks/use-mobile';

function ResponsiveComponent() {
  const isMobile = useMobile();

  return (
    <div>
      {isMobile ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  );
}
```

## 字体配置 API (lib/fonts.ts)

### `jetBrainsMono`

JetBrains Mono 字体配置，用于代码显示。

**示例**:

```typescript
import { jetBrainsMono } from '@/lib/fonts';

<pre className={jetBrainsMono.className}>
  const code = 'example';
</pre>
```

### `recursive`

Recursive 字体配置，用于标题。

**示例**:

```typescript
import { recursive } from '@/lib/fonts';

<h1 className={recursive.className}>
  Page Title
</h1>
```

### `lxgwBright`

LXGW Bright 字体配置，用于中文内容。

**示例**:

```typescript
import { lxgwBright } from '@/lib/fonts';

<p className={lxgwBright.className}>
  中文内容示例
</p>
```

## 类型定义

### Post

博客文章对象的类型定义。

```typescript
interface Post {
  slug: string[];
  title: string;
  date: string;
  content?: string;
  excerpt?: string;
}
```

### MDXFrontMatter

Markdown 文件前置元数据的类型定义。

```typescript
interface MDXFrontMatter {
  title: string;
  date: string;
  [key: string]: any;
}
```
