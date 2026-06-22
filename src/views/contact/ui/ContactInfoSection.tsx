import { SectionHeader } from '@/shared/ui'
import { SITE } from '@/shared/config'

const blocks = [
  { label: '대표번호', value: SITE.contact.phone },
  { label: 'E-mail', value: SITE.footer.email2 },
  { label: '본사 주소', value: SITE.contact.address },
  // '평일 10시~17시'는 일반 텍스트라 하드코딩 허용(site.ts 상수 대상 아님)
  { label: '상담시간', value: '평일 10시~17시' },
] as const

export function ContactInfoSection() {
  return (
    <section className="bg-surface-white py-20">
      <div className="content-container">
        <SectionHeader
          label="Contact Info"
          title="연락처 안내"
          theme="light"
          titleAs="h2"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
          {blocks.map((block) => (
            <div
              key={block.label}
              className="flex flex-col gap-2 rounded-xl border border-border-light bg-surface-light px-6 py-8"
            >
              <span className="text-aircok-blue text-xs font-semibold uppercase tracking-widest">
                {block.label}
              </span>
              <p className="text-[17px] font-body text-heading-dark leading-[1.65] [word-break:keep-all]">
                {block.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
