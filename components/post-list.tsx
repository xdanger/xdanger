'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  date: string;
  preview: string;
}

interface PostListProps {
  initialPosts: Post[];
  postsPerPage?: number;
}

export function PostList({ initialPosts, postsPerPage = 10 }: PostListProps) {
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // 初始化显示的文章
  useEffect(() => {
    setDisplayedPosts(initialPosts.slice(0, postsPerPage));
    setHasMore(initialPosts.length > postsPerPage);
  }, [initialPosts, postsPerPage]);

  // 当加载更多触发器进入视图时加载更多文章
  useEffect(() => {
    if (inView && hasMore) {
      const nextPosts = initialPosts.slice(
        0,
        (currentPage + 1) * postsPerPage
      );
      setDisplayedPosts(nextPosts);
      setCurrentPage(prev => prev + 1);
      setHasMore(nextPosts.length < initialPosts.length);
    }
  }, [inView, hasMore, currentPage, initialPosts, postsPerPage]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedPosts.map((post) => {
          const date = new Date(post.date);
          const year = date.getFullYear();
          const month = date.toLocaleString('default', { month: 'short' });
          const day = date.getDate();

          const cleanSlug = post.slug.replace(/\.html$/, '');

          return (
            <Link
              key={post.slug}
              href={`/${cleanSlug}.html`}
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

      {/* 加载更多触发器 */}
      {hasMore && (
        <div
          ref={ref}
          className="w-full h-20 flex items-center justify-center mt-8"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </>
  );
}