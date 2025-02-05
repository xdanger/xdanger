// app/[...slug]/page.tsx
import { notFound } from 'next/navigation';
import { getLatestPosts } from '@/lib/posts';

export async function generateStaticParams() {
  const posts = await getLatestPosts();

  return posts.map((post) => {
    const segments = post.slug.replace(/\.html$/, '').split('/');
    return { slug: segments };
  });
}

export default async function PostPage({ params }: { params: { slug: string[] } }) {
  const posts = await getLatestPosts();
  const slugWithHtml = [...params.slug];
  slugWithHtml[slugWithHtml.length - 1] = `${slugWithHtml[slugWithHtml.length - 1]}.html`;
  const fullSlug = slugWithHtml.join('/');

  const post = posts.find(p => p.slug === fullSlug);

  if (!post) {
    notFound();
  }

  return (
    <article className="prose mx-auto p-4">
      <h1>{post.title}</h1>
      <time>{new Date(post.date).toLocaleDateString()}</time>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}