import Link from 'next/link';
import { getNewsPost } from '@/entities/news';
import { NewsContent } from './NewsContent';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function formatDate(dateStr: string): string {
  return dateStr.slice(0, 10).replace(/-/g, '.');
}

interface Props {
  id: string;
}

export async function NewsDetailView({ id }: Props) {
  const post = await getNewsPost(id);

  return (
    <main className="min-h-screen bg-surface-white">
      <div className="content-container py-20">
        <Link
          href="/news"
          className="text-secondary-dark text-sm hover:text-body-dark transition-colors"
        >
          ← 뉴스 목록
        </Link>

        <div className="mt-6">
          <time className="text-secondary-dark text-sm font-body">
            {formatDate(post.date)}
          </time>
          {post.location && (
            <span className="text-secondary-dark text-sm ml-3">
              {post.location}
            </span>
          )}
        </div>

        <h1 className="text-heading-dark font-display font-bold text-[40px] leading-tight mt-4">
          {post.title}
        </h1>

        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={
              post.coverImage.startsWith('http')
                ? post.coverImage
                : `${API_BASE}${post.coverImage}`
            }
            alt={post.title}
            className="w-full rounded-xl object-cover mt-8"
          />
        )}

        <hr className="border-t border-border-light my-8" />

        <NewsContent content={post.content} />
      </div>
    </main>
  );
}
