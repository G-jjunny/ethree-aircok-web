import Link from 'next/link';
import { SITE } from '@/shared/config';
import { Button, SectionLabel } from '@/shared/ui';

const PLATFORM_RADIAL =
  'radial-gradient(120% 100% at 20% 0%, var(--color-navy-tint), var(--color-navy) 60%)';

/**
 * 플랫폼 / 무료 레포트 (시안 §7). navy radial 다크 배경, 좌: eyebrow(cyan) + h2 +
 * 체크리스트 3 + pill CTA, 우: 일러스트 플레이스홀더 + FREE REPORT 배지.
 */
export function PlatformSection() {
  const { bullets, title, cta } = SITE.whatYouGet;

  return (
    <section
      className="text-white"
      style={{ backgroundImage: PLATFORM_RADIAL }}
    >
      <div className="content-container grid items-center gap-14 py-24 md:grid-cols-2">
        {/* 좌 */}
        <div>
          <SectionLabel color="cyan">WHAT YOU GET</SectionLabel>
          <h2 className="mt-4 text-h3 font-extrabold leading-tight tracking-headline">
            {title}
          </h2>
          <ul className="mt-6 flex flex-col gap-4">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-cyan/16 text-sm font-bold text-cyan">
                  ✓
                </span>
                <span className="text-lead-sm leading-relaxed text-white/85">{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button asChild pill variant="primary" size="md">
              <Link href="/health-report">{cta}</Link>
            </Button>
          </div>
        </div>

        {/* 우: 일러스트 플레이스홀더 + FREE REPORT 배지 */}
        <div className="relative aspect-row-thumb overflow-hidden rounded-card border border-white/14 bg-white/5">
          <span className="absolute inset-0 flex items-center justify-center font-display text-nano tracking-eyebrow text-white/28">
            [ FREE REPORT 일러스트 자리 ]
          </span>
          <span className="absolute right-5 top-5 rounded-pill bg-cyan/16 px-3.5 py-1.5 font-display text-mini font-bold tracking-eyebrow text-cyan">
            FREE REPORT
          </span>
        </div>
      </div>
    </section>
  );
}
