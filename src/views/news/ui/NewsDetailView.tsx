import { cacheLife, cacheTag } from 'next/cache';
import {
  getNewsPost,
  NEWS_CACHE_TAG,
  newsPostCacheTag,
  type NewsPost,
} from '@/entities/news';
import { SITE } from '@/shared/config';
import { NewsDetailHeroSection } from './NewsDetailHeroSection';
import { NewsDetailContentSection } from './NewsDetailContentSection';

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * 뉴스 상세 조회를 'use cache'로 캐싱한다(cacheTag: 'news' + `news-${id}`, cacheLife: default).
 * id별로 캐시 키가 분리되며, 어드민 수정/삭제 시 revalidateNewsCache(id)로 해당 상세를 무효화한다.
 */
async function getCachedNewsPost(id: string): Promise<NewsPost> {
  'use cache';
  cacheLife('default');
  cacheTag(NEWS_CACHE_TAG, newsPostCacheTag(id));
  return getNewsPost(id);
}

/** 상대 경로 이미지를 절대 URL로 보정한다(JSON-LD image는 절대 URL 요구). */
function toAbsoluteImage(src: string | null | undefined): string | undefined {
  if (!src) return undefined;
  return src.startsWith('http') ? src : `${SITE.url}${src}`;
}

export async function NewsDetailView({ params }: Props) {
  const { id } = await params;
  const post = await getCachedNewsPost(id);

  const articleUrl = `${SITE.url}/news/${id}`;
  const coverImage = toAbsoluteImage(post.coverImage);

  // 뉴스 기사 구조화 데이터(NewsArticle) — 제목/발행일/이미지/발행사.
  const newsArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    ...(post.description ? { description: post.description } : {}),
    ...(post.date ? { datePublished: post.date, dateModified: post.date } : {}),
    ...(coverImage ? { image: [coverImage] } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE.url}/images/logos/logo.png`,
      },
    },
  };

  // 탐색 경로(BreadcrumbList): 홈 → 뉴스 → 기사.
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE.name, item: SITE.url },
      {
        '@type': 'ListItem',
        position: 2,
        name: SITE.pages.news.title,
        item: `${SITE.url}/news`,
      },
      { '@type': 'ListItem', position: 3, name: post.title, item: articleUrl },
    ],
  };

  return (
    <main className="min-h-screen bg-surface-white py-11 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className="content-container">
        <div className="mx-auto max-w-reading">
          <NewsDetailHeroSection post={post} />
          {post.content && <NewsDetailContentSection content={post.content} />}
        </div>
      </article>
    </main>
  );
}
