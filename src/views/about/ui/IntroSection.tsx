import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'

export function IntroSection() {
  return (
    <section className="bg-surface-dark py-24">
      <div className="content-container flex flex-col gap-14">
        <SectionHeader
          label={SITE.about.intro.label}
          title={SITE.about.intro.title}
          body={SITE.about.intro.body}
          theme="dark"
          maxWidth="max-w-[760px]"
        />
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.about.intro.values.map((value, index) => (
            <li
              key={value.title}
              className="flex flex-col gap-5 rounded-xl bg-surface-dark-1 p-8 transition-colors duration-200 hover:bg-surface-dark-2"
            >
              {/* 인덱스 숫자: 순서 식별자(sequence 아님) — STEP 레이블 없음 */}
              <span
                aria-hidden="true"
                className="select-none font-display text-5xl font-bold leading-none tracking-[-0.3px] text-aircok-blue"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-3">
                <h3 className="text-subheading font-bold font-display text-heading-light leading-[1.19] [word-break:keep-all]">
                  {value.title}
                </h3>
                <p className="text-[17px] text-body-light leading-[1.65] [word-break:keep-all]">
                  {value.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
