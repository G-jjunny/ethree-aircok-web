import Link from 'next/link';
import { connection } from 'next/server';
import { cacheLife, cacheTag } from 'next/cache';
import { SITE } from '@/shared/config';
import { Button } from '@/shared/ui';
import { getSiteInfoServer, SITE_INFO_CACHE_TAG, type SiteInfo } from '@/entities/site-info';

// Footer와 동일한 폴백 헬퍼 — API가 빈 문자열/공백을 반환해도 SITE 상수로 폴백한다.
function pick(apiValue: string | null | undefined, fallback: string): string {
  return apiValue?.trim() ? apiValue : fallback;
}

/**
 * 사이트 정보 조회를 'use cache'로 캐싱한다(cacheTag: 'site-info', cacheLife: static).
 * Footer와 동일 패턴 — 'use cache'는 서버 전용이므로 entity 페처가 아닌 서버 뷰에서 래핑한다.
 * 어드민 수정 시 revalidateSiteInfoCache(updateTag)로 무효화된다.
 */
async function getCachedSiteInfo(): Promise<SiteInfo> {
  'use cache';
  cacheLife('static');
  cacheTag(SITE_INFO_CACHE_TAG);
  return getSiteInfoServer();
}

/**
 * 전역 하단 CTA (시안 §10). brand 그라디언트(120°) + 우상단 화이트 글로우.
 * 좌: eyebrow + 헤드라인 + 서브카피 + 메일 연락처, 우: 전화(white 버튼) + 도입 문의(outline).
 *
 * 시각 언어(120° 그라디언트·토큰 기반 글로우·2단 배치·연락처 라인)는 유지하되, 특정 페이지에
 * 특화된 문구(가격/기간 등)는 배제하고 전역에서 재사용 가능한 범용 메시지를 유지한다. 색상·간격·
 * 글로우 치수는 모두 design.md 토큰(var/유틸)이며 하드코딩 없음.
 *
 * 연락처(전화/메일)는 site-info API(우선) → SITE 상수(fallback) 순으로 채운다.
 */
export async function GlobalCta() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다(Footer 패턴).
  await connection();

  let siteInfo: SiteInfo | null = null;
  try {
    siteInfo = await getCachedSiteInfo();
  } catch {
    siteInfo = null;
  }

  const phone = pick(siteInfo?.phone, SITE.contact.phone);
  const email = pick(siteInfo?.email, SITE.footer.email2);

  return (
    <section className="relative overflow-hidden bg-linear-120 from-brand to-brand-hover text-white">
      {/* 우상단 화이트 글로우 (aria-hidden 장식). size-105=420px 스페이싱 토큰 기반 — 하드코딩 치수 제거 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-20 size-105 rounded-full bg-white/18 blur-xl"
      />
      <div className="content-container relative flex flex-wrap items-center justify-between gap-8 py-20">
        <div>
          <p className="font-display text-eyebrow font-semibold uppercase tracking-eyebrow-lg text-white/70">
            Clean air starts here
          </p>
          <h2 className="mt-2.5 text-h3 font-extrabold leading-tight tracking-headline">
            건강한 공기, 지금 시작하세요
          </h2>
          <p className="mt-3.5 text-base text-white/85">
            시설에 맞는 공기질 관리 솔루션을 상담해 드립니다.
          </p>
          <p className="mt-3 text-sm text-white/70">
            메일 문의 <span className="font-semibold text-white/85">{email}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3.5">
          <Button asChild variant="white" size="md">
            <a href={`tel:${phone}`}>{phone}</a>
          </Button>
          <Button asChild variant="outline" size="md">
            <Link href={SITE.bottomCta.ctaHref}>{SITE.cta.button}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
