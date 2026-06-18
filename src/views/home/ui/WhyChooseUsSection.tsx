import Image from 'next/image';
import { SITE } from '@/shared/config';
import { SectionHeader } from '@/shared/ui';

export function WhyChooseUsSection() {
  return (
    <section className="relative bg-surface-dark">
      {/* 배경 이미지 */}
      <Image
        src="/images/home/aircok_solution_bg.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      {/* 오버레이 — bg-overlay-dark-60(60%) 배경 이미지 일부 노출용 토큰 */}
      <div className="absolute inset-0 bg-overlay-dark-60" />
      <div className="content-container py-20 relative z-10">
        <SectionHeader
          label={SITE.whyUs.label}
          title={SITE.whyUs.title}
          theme="dark"
        />

        {/* 메인 레이아웃 */}
        <div className="mt-12 flex flex-col lg:flex-row gap-16 items-start">
          {/* 좌측 포인트 리스트 */}
          {/* token 없음: 좌우 60:40 비율 레이아웃 — 텍스트와 인용구 비율 조정용 1회성 수치 */}
          <div className="lg:w-[60%] flex flex-col gap-6">
            {SITE.whyUs.points.map((point, index) => (
              <div key={index} className="border-l-2 border-aircok-blue pl-4">
                <p className="text-body-light text-[17px] leading-[1.65] [word-break:keep-all]">
                  {point}
                </p>
              </div>
            ))}
          </div>

          {/* 우측 강조 인용구 */}
          {/* token 없음: 우측 40% 너비 — 좌우 60:40 비율 레이아웃 1회성 수치 */}
          <div className="lg:w-[40%] flex flex-col items-center text-center gap-4">
            <span
              className="text-aircok-blue-light text-6xl font-display leading-none select-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="text-[40px] font-display font-semibold text-heading-light leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">
              {SITE.whyUs.emphasis}
            </p>
            <p className="text-body-light text-sm mt-2">— {SITE.name}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
