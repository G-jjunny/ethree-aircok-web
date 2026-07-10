import { SITE } from '@/shared/config';
import { SectionLabel } from '@/shared/ui';

// 마퀴 페이드 마스크(양끝 투명). 색/간격 토큰이 아닌 마스킹 기법 → inline 처리.
const MARQUEE_MASK =
  'linear-gradient(to right, transparent, black 12%, black 88%, transparent)';

/**
 * Clients / 로고 마퀴 (시안 §9). 흰 배경, eyebrow + h2, 파트너 로고 무한 마퀴.
 * animate-marquee-left(globals 토큰)로 CSS-only 순환, 좌우 페이드 마스크.
 * 로고 에셋 미확보 → 텍스트 칩 플레이스홀더.
 */
export function ClientsSection() {
  // 끊김 없는 순환을 위해 목록을 2배 복제(-50% 이동 기법).
  const logos = [...SITE.partners.list, ...SITE.partners.list];

  return (
    <section className="bg-surface-white py-24">
      <div className="content-container text-center">
        <SectionLabel color="brand">CLIENTS</SectionLabel>
        <h2 className="mt-4 text-h5 font-extrabold tracking-headline text-ink">
          {SITE.partners.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lead-sm text-muted">{SITE.partners.body}</p>
      </div>

      <div
        className="mt-12 overflow-hidden"
        style={{ maskImage: MARQUEE_MASK, WebkitMaskImage: MARQUEE_MASK }}
      >
        <div className="flex w-max animate-marquee-left gap-4">
          {logos.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex h-16 w-40 flex-none items-center justify-center rounded-btn border border-hairline bg-surface px-4 text-center text-sm font-medium text-faint"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
