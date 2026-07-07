import type { MetadataRoute } from 'next';
import { connection } from 'next/server';
import { SITE } from '@/shared/config';
import { getNewsList } from '@/views/news';

// 정적 라우트 우선순위/변경 빈도 정의. SITE.nav.links와 중복될 수 있으므로
// Set으로 경로를 dedupe한 뒤 메타데이터를 매핑한다.
const STATIC_PATHS = [
  '/about',
  '/services',
  '/diagnosis',
  '/news',
  '/faq',
  '/catalog',
  '/contact',
  '/pricing',
  '/qa',
  '/health-report',
  '/free-trial',
];

// 라우트별 changeFrequency/priority. 미정의 경로는 기본값을 사용한다.
const ROUTE_META: Record<
  string,
  { changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }
> = {
  '/': { changeFrequency: 'monthly', priority: 1 },
  '/news': { changeFrequency: 'weekly', priority: 0.8 },
  '/about': { changeFrequency: 'monthly', priority: 0.8 },
  '/services': { changeFrequency: 'monthly', priority: 0.8 },
  '/diagnosis': { changeFrequency: 'monthly', priority: 0.7 },
  '/catalog': { changeFrequency: 'monthly', priority: 0.7 },
  '/contact': { changeFrequency: 'yearly', priority: 0.6 },
};

const DEFAULT_META = {
  changeFrequency: 'monthly' as const,
  priority: 0.6,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // cacheComponents(PPR) 환경에서 아래 뉴스 목록 fetch가 빌드 타임 프리렌더에
  // 포함되지 않도록 요청 시점으로 미룬다. 빌드 중 백엔드 미기동 시 오류를 방지한다.
  await connection();

  const now = new Date();

  // 경로 dedupe: 홈 + nav.links + STATIC_PATHS
  const paths = new Set<string>(['/']);
  for (const link of SITE.nav.links) {
    // /console/*, /projects(deprecated)는 제외
    const href: string = link.href;
    if (href.startsWith('/console') || href === '/projects') continue;
    paths.add(href);
  }
  for (const path of STATIC_PATHS) {
    paths.add(path);
  }

  const staticEntries: MetadataRoute.Sitemap = Array.from(paths).map((path) => {
    const meta = ROUTE_META[path] ?? DEFAULT_META;
    return {
      url: path === '/' ? SITE.url : `${SITE.url}${path}`,
      lastModified: now,
      changeFrequency: meta.changeFrequency,
      priority: meta.priority,
    };
  });

  // 뉴스 상세 동적 라우트. 실패 시 정적 항목만 반환한다.
  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const { data } = await getNewsList(1, 100);
    dynamicEntries = data.map((item) => ({
      url: `${SITE.url}/news/${item.id}`,
      lastModified: new Date(item.updatedAt ?? item.date),
      changeFrequency: 'monthly',
      priority: 0.5,
    }));
  } catch {
    dynamicEntries = [];
  }

  return [...staticEntries, ...dynamicEntries];
}
