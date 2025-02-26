// app/[...slug]/page.tsx
import { notFound } from 'next/navigation';
import { getLatestPosts } from '@/lib/posts';

// 将配置移到单独的对象中，符合Next.js的静态解析需求
export const dynamic = 'auto';
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getLatestPosts();

  return posts.map((post) => {
    console.log(post.slug);
    const segments = post.slug.replace(/\.html$/, '').split('/');
    console.log(segments);
    return { slug: segments };
  });
}

export default async function PostPage({ params }: { params: { slug: string[] } }) {

  // 获取所有文章
  const posts = await getLatestPosts();

  // 从params中解构出slug，需要先await
  const { slug } = await Promise.resolve(params);

  // 构建完整的slug路径
  const slugWithHtml = [...slug];
  slugWithHtml[slugWithHtml.length - 1] = `${slugWithHtml[slugWithHtml.length - 1]}.html`;
  const fullSlug = slugWithHtml.join('/');

  // 查找匹配的文章
  const post = posts.find(p => p.slug === fullSlug);

  // 如果没有找到文章，显示404页面
  if (!post) {
    console.log('404 Not Found', fullSlug);
    return notFound();
  }

  // 渲染文章页面
  return (
    <article className="prose mx-auto p-4">
      <h1>{post.title}</h1>
      <time>{new Date(post.date).toLocaleDateString()}</time>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}