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
        <div className="prose dark:prose-invert text-lg max-w-none mb-12">
          <ul>
            <li>I&apos;m a 👨‍👩‍👦‍👦 father, a 🧑‍💻 software engineer</li>
            <li>Presently as CEO of <a href="https://www.taptap.com" target="_blank" rel="noopener noreferrer">TapTap</a>, Co-founder of <a href="https://www.xd.com" target="_blank" rel="noopener noreferrer">XD</a></li>
            <li>Previously as Co-founder of <a href="https://www.verycd.com" target="_blank" rel="noopener noreferrer">VeryCD</a>.</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mb-8">Blog posts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentPosts.map((post) => {
            const date = new Date(post.date);
            const year = date.getFullYear();
            const month = date.toLocaleString('default', { month: 'short' });
            const day = date.getDate();

            const cleanSlug = post.slug.replace(/\.html$/, '');

            return (
              <Link
                key={post.slug}
                href={`/${cleanSlug}`}
                className="group block"
              >
                <article className="h-full bg-card hover:bg-accent transition-colors rounded-lg border border-border p-6 group-hover:border-border/80">
                  <time className="text-sm text-muted-foreground">
                    {`${month} ${day}, ${year}`}
                  </time>
                  <h3 className="mt-2 text-xl font-semibold group-hover:text-accent-foreground transition-colors">
                    {post.title}
                  </h3>
                  {post.preview && (
                    <p className="mt-3 text-muted-foreground line-clamp-3">
                      {post.preview}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-sm text-muted-foreground">
                    <span className="group-hover:text-accent-foreground transition-colors">
                      Read more →
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}