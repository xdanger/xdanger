// app/[...slug]/page.tsx
import { notFound } from 'next/navigation';
import { getLatestPosts } from '@/lib/posts';
import { Header } from '@/components/header';
import * as React from 'react';
import type { PageProps } from 'next';
import type { Metadata } from 'next';

// 将配置移到单独的对象中，符合Next.js的静态解析需求
export const dynamic = 'auto';

// 定义generateStaticParams的返回类型
type StaticParams = { slug: string[] };

/**
 * 生成页面元数据，包括标题
 */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  // 获取所有文章
  const posts = await getLatestPosts();

  // 处理params对象，获取slug
  const slug = await processParams(params);
  const fullSlug = slug.join('/');
  const cleanSlug = fullSlug.replace(/\.html$/, '');

  // 查找当前文章
  const post = posts.find(p => p.slug === cleanSlug);

  // 如果没有找到文章，返回默认标题
  if (!post) {
    return {
      title: 'Not Found',
    };
  }

  // 返回以文章标题为主的元数据
  return {
    title: `${post.title} - xdanger's Blog`,
    description: post.title,
  };
}

// 指定正确的返回类型
export async function generateStaticParams(): Promise<StaticParams[]> {
  const posts = await getLatestPosts();

  return posts.map((post) => {
    // 完全移除.html后缀，让Next.js自己处理文件扩展名
    const cleanSlug = post.slug.replace(/\.html$/, '');

    // 分割路径段作为 slug 参数
    const segments = cleanSlug.split('/');

    return { slug: segments };
  });
}

// 创建一个辅助函数来处理参数解包，避免直接处理Promise
async function processParams(params: PageProps['params']): Promise<string[]> {
  // 解析params对象
  const resolvedParams = await params;
  return resolvedParams.slug as string[];
}

// 使用我们在类型声明文件中定义的PageProps类型
export default async function PostPage({ params }: PageProps) {
  // 获取所有文章
  const posts = await getLatestPosts();

  // 处理params对象，解析Promise获取slug
  const slug = await processParams(params);

  // 构建完整的slug路径
  const fullSlug = slug.join('/');

  // 移除可能的.html后缀以进行匹配
  const cleanSlug = fullSlug.replace(/\.html$/, '');

  // 使用cleanSlug匹配post.slug
  const post = posts.find(p => p.slug === cleanSlug);

  // 如果没有找到文章，显示404页面
  if (!post) {
    console.log('404 Not Found', cleanSlug);
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