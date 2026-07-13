import { SITE } from '@/shared/config';
import { SectionLabel, LogoMarquee } from '@/shared/ui';

/**
 * Clients / 로고 마퀴 (시안 §9). 흰 배경, eyebrow + h2, 파트너 로고 무한 마퀴.
 * 마퀴는 공용 LogoMarquee 컴포넌트로 위임(CSS-only 순환, 좌우 페이드, hover 정지).
 * 로고 에셋 미확보 → 이름 텍스트 칩으로 폴백.
 */
export function ClientsSection() {
  const items = SITE.partners.list.map((name) => ({ name }));

  return (
    <section className="bg-surface-white py-24">
      <div className="content-container text-center">
        <SectionLabel color="brand">CLIENTS</SectionLabel>
        <h2 className="mt-4 text-h5 font-extrabold tracking-headline text-ink">
          {SITE.partners.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lead-sm text-muted">{SITE.partners.body}</p>
      </div>

      <div className="mt-12">
        <LogoMarquee items={items} rows={1} ariaLabel="협력사 로고" />
      </div>
    </section>
  );
}
