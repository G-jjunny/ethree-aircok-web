import { SITE } from '@/shared/config';
import { SectionHeader } from '@/shared/ui';

export function WhyChooseUsSection() {
  return (
    <section className="bg-surface-dark">
      <div className="content-container py-20">
        <SectionHeader
          label={SITE.whyUs.label}
          title={SITE.whyUs.title}
          theme="dark"
        />

        {/* 메인 레이아웃 */}
        <div className="mt-12 flex flex-col lg:flex-row gap-16 items-start">
          {/* 좌측 포인트 리스트 */}
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
