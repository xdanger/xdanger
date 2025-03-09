import { getLatestPosts } from '@/lib/posts';
import { Header } from '@/components/header';
import { PostList } from '@/components/post-list';

export default async function Home() {
  const posts = await getLatestPosts();

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container max-w-5xl mx-auto p-4 md:p-8">
        <div className="prose dark:prose-invert text-lg max-w-none mb-12">
          <ul>
            <li>I&apos;m a 👨‍👩‍👦‍👦 father, a 🧑‍💻 software engineer</li>
            <li>Presently as CEO of <a href="https://www.taptap.com" target="_blank" rel="noopener noreferrer">TapTap</a>, Co-founder of <a href="https://www.xd.com" target="_blank" rel="noopener noreferrer">XD</a></li>
            <li>Previously as Co-founder of <a href="https://www.verycd.com" target="_blank" rel="noopener noreferrer">VeryCD</a>.</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-8">Blog posts</h2>

        <PostList initialPosts={posts} />
      </main>
    </div>
  );
}