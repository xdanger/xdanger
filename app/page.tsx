import { getLatestPosts } from '@/lib/posts';
import { Header } from '@/components/header';
import Link from 'next/link';

export default async function Home() {
  const posts = await getLatestPosts();
  const recentPosts = posts;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container max-w-3xl mx-auto p-4 md:p-8">
        <div className="prose dark:prose-invert text-lg max-w-none">
          <ul>
            <li>I&apos;m a 👨‍👩‍👦‍👦 father, a 🧑‍💻 software engineer</li>
            <li>Presently as CEO of <a href="https://www.taptap.com" target="_blank" rel="noopener noreferrer">TapTap</a>, Co-founder of <a href="https://www.xd.com" target="_blank" rel="noopener noreferrer">XD</a></li>
            <li>Previously as Co-founder of <a href="https://www.verycd.com" target="_blank" rel="noopener noreferrer">VeryCD</a>.</li>
          </ul>
        </div>
        <h2 className="text-xl font-bold my-6">Blog posts</h2>
        <ul className="list-disc pl-5 space-y-2">
          {recentPosts.map((post) => (
            <li key={post.slug} className="text-lg">
              <Link href={`/${post.slug.replace(/\.html$/, '')}`} className="underline font-medium">
                {post.title}
              </Link> <time className="text-muted-foreground">({new Date(post.date).getFullYear()})</time>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}