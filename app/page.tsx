import { getLatestPosts } from '@/lib/posts';
import { PostPreview } from '@/components/PostPreview';

// Mark the component as async since we need to fetch posts
export default async function Home() {
  // Get the latest posts
  const posts = await getLatestPosts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-4xl mx-auto p-6">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to My Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Thoughts, ideas, and explorations in technology and beyond.
          </p>
        </section>

        {/* Latest Posts Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <PostPreview
                key={post.slug}
                title={post.title}
                date={post.date}
                preview={post.preview}
                slug={post.slug}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
