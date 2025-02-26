// app/[...slug]/page.tsx
import { notFound } from 'next/navigation';
import { getLatestPosts } from '@/lib/posts';
import Link from 'next/link';
import { Header } from '@/components/header';

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

  // 查找当前文章在数组中的位置
  const currentIndex = posts.findIndex(p => p.slug === fullSlug);

  // 获取上一篇（较新）和下一篇（较旧）文章
  // 注意：由于posts是按日期从新到旧排序的，所以上一篇是currentIndex-1，下一篇是currentIndex+1
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  // 渲染文章页面
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container max-w-3xl mx-auto px-4 md:px-8 py-12">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <time className="text-md text-muted-foreground">
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-md" />

          {/* 文章导航链接
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