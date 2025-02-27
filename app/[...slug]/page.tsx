// app/[...slug]/page.tsx
import { notFound } from 'next/navigation';
import { getLatestPosts } from '@/lib/posts';
import { Header } from '@/components/header';
import * as React from 'react';

// 将配置移到单独的对象中，符合Next.js的静态解析需求
export const dynamic = 'auto';

interface PageParams {
  slug: string[];
}

// 指定正确的返回类型
export async function generateStaticParams(): Promise<PageParams[]> {
  const posts = await getLatestPosts();

  return posts.map((post) => {
    // 由于getLatestPosts现在返回不带.html后缀的slug
    // 直接分割路径段
    const segments = post.slug.split('/');
    return { slug: segments };
  });
}

// 使用 type 类型而不是接口，避免 TypeScript 错误
type PageProps = {
  params: PageParams;
};

// 移除返回类型声明，让 TypeScript 推断它
export default async function PostPage({ params }: PageProps) {
  // 获取所有文章
  const posts = await getLatestPosts();

  // 从params中解构出slug
  const { slug } = params;

  // 构建完整的slug路径
  const fullSlug = slug.join('/');

  // 直接使用fullSlug匹配post.slug
  const post = posts.find(p => p.slug === fullSlug);

  // 如果没有找到文章，显示404页面
  if (!post) {
    console.log('404 Not Found', fullSlug);
    return notFound();
  }

  // 导航链接功能已注释，所以不需要这些变量
  // const currentIndex = posts.findIndex(p => p.slug === fullSlug);
  // const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  // const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  // 渲染文章页面
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container max-w-3xl mx-auto pb-24">
        <article className="prose prose-lg px-4 md:px-8 dark:prose-invert max-w-none">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <time className="text-md text-muted-foreground">
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-lg" />

          {/* 文章导航链接 - 注释掉，不显示
          <div className="mt-10 pt-6 border-t border-border text-sm flex justify-center">
            {nextPost && prevPost ? (
              <p>
                <Link href={`/${nextPost.slug}`} className="hover:underline">&lt; {nextPost.title}</Link> • <Link href={`/${prevPost.slug}`} className="hover:underline">{prevPost.title} &gt;</Link>
              </p>
            ) : nextPost ? (
              <p>
                <Link href={`/${nextPost.slug}`} className="hover:underline">{nextPost.title} &gt;</Link>
              </p>
            ) : prevPost ? (
              <p>
                <Link href={`/${prevPost.slug}`} className="hover:underline">&lt; {prevPost.title}</Link>
              </p>
            ) : null}
          </div>*/}
        </article>
      </main>
    </div>
  );
}