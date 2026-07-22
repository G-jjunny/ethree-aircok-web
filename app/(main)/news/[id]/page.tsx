import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getNewsPost, NewsDetailView } from '@/views/news';
import { SITE } from '@/shared/config';

const NEWS_FALLBACK_TITLE = `${SITE.pages.news.title} | ${SITE.name}`;

/** HTML 태그를 제거하고 공백을 정리한 뒤 지정 길이로 자른다. */
function toExcerpt(source: string, maxLength = 150): string {
  const text = source
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const post = await getNewsPost(id);

    const description = post.description
      ? toExcerpt(post.description)
      : post.content
        ? toExcerpt(post.content)
        : SITE.pages.news.description;

    const url = `${SITE.url}/news/${id}`;

    return {
      title: post.title,
      description,
      alternates: {
        canonical: `/news/${id}`,
      },
      openGraph: {
        type: 'article',
        title: post.title,
        description,
        url,
        ...(post.coverImage ? { images: [post.coverImage] } : {}),
        ...(post.date ? { publishedTime: post.date } : {}),
      },
    };
  } catch {
    return {
      title: NEWS_FALLBACK_TITLE,
    };
  }
}

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-white" />}>
      <NewsDetailView params={params} />
    </Suspense>
  );
}
