import { ScrollReveal } from '@/shared/ui';

const CERTS = [
  '미세먼지 성능인증 1등급',
  '이산화탄소 1등급',
  '이산화질소 1등급',
  '조달청 혁신 시제품',
  'AIR-TECHNOLOGY 수상',
];

/**
 * 인증 트러스트 스트립 (시안 §3). 다크 배경, 상단 hairline(white/6),
 * "CERTIFIED & PROVEN"(Sora) + 인증 5항목을 한 줄로 배치.
 */
export function CertifiedSection() {
  return (
    <section className="border-t border-white/6 bg-navy text-white">
      <ScrollReveal
        variant="fade-up"
        className="content-container flex flex-wrap items-center justify-center gap-3.5 py-6"
      >
        <span className="font-display text-eyebrow tracking-eyebrow text-white/40">
          CERTIFIED &amp; PROVEN
        </span>
        <span aria-hidden className="h-4 w-px bg-white/14" />
        {CERTS.map((cert, i) => (
          <span key={cert} className="text-sm font-medium text-white/70">
            {i > 0 && <span className="mr-3.5 text-white/25">·</span>}
            {cert}
          </span>
        ))}
      </ScrollReveal>
    </section>
  );
}
