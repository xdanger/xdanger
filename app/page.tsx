import { getLatestPosts } from '@/lib/posts';
import { Header } from '@/components/header';
import Link from 'next/link';

export default async function Home() {
  const posts = await getLatestPosts();
  const recentPosts = posts.slice(0, 5); // 获取最新的20篇文章

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container max-w-3xl mx-auto px-4 md:px-8 py-12">
        <div className="prose dark:prose-invert max-w-none mb-12">
          <p className="text-lg">
            Yunjie Dai is a software engineer and researcher specializing in web technologies and artificial intelligence.
            Currently working on building innovative solutions that bridge the gap between theoretical research and practical applications.
          </p>

          <p className="text-lg">
            Previously, Yunjie worked at various tech companies, developing scalable applications and contributing to open-source projects.
            He holds a Master&apos;s degree in Computer Science from a prestigious university.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Short posts</h2>
          <ul className="list-disc pl-5 space-y-3">
            {recentPosts.map((post) => (
              <li key={post.slug} className="text-lg">
                <Link href={`/${post.slug}`} className="underline font-medium">
                  {post.title}
                </Link> ({new Date(post.date).getFullYear()})
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}