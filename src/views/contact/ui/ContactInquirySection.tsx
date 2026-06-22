import { SectionHeader } from '@/shared/ui'
import { SITE } from '@/shared/config'
import { InquiryForm } from '@/features/inquiry-form'

// 연락처 안내 4블록 — 이 페이지(우측 칼럼)에서만 사용되므로 로컬 유지(공용 분리 대상 아님)
const infoBlocks = [
  { label: '대표번호', value: SITE.contact.phone },
  { label: 'E-mail', value: SITE.footer.email2 },
  { label: '본사 주소', value: SITE.contact.address },
  // '평일 10시~17시'는 일반 텍스트라 하드코딩 허용(site.ts 상수 대상 아님)
  { label: '상담시간', value: '평일 10시~17시' },
] as const

export function ContactInquirySection() {
  // Embed API 키 불필요한 일반 Google Maps 임베드 (output=embed)
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    SITE.contact.address,
  )}&output=embed`

  return (
    <section className="bg-surface-white">
      <div className="content-container py-20">
        <SectionHeader
          label="문의하기"
          title="저희에게 연락주세요"
          body="고객의 문제 해결을 위해 최선의 노력을 다하겠습니다. 남겨주신 문의는 영업일 기준 24시간 이내에 답변드리겠습니다."
          theme="light"
          titleAs="h2"
        />
        {/* lg 미만: 폼 → 지도 → 연락처 세로 스택 / lg 이상: 좌(폼) · 우(지도+연락처) 2단 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mt-10">
          {/* 폼(좌측) — 진단 폼과 동일하게 카드 없이 배치, 입력 필드(bg-surface-light)가 흰 섹션과 대비 */}
          {/* max-w-[640px]: lg 미만 폼 가독 폭 제한, 1회성 레이아웃 수치 — 토큰 없음 */}
          <div className="max-w-[640px] mx-auto lg:max-w-none lg:mx-0 w-full">
            <InquiryForm />
          </div>

          {/* 우측 칼럼: 지도 + 연락처 안내 세로 스택 — 좌측 폼 칼럼과 높이 균형 */}
          {/* max-w-[640px]: lg 미만에서 폼 카드와 동일 가독 폭 정렬, 1회성 레이아웃 수치 — 토큰 없음 */}
          <div className="flex flex-col gap-8 max-w-[640px] mx-auto lg:max-w-none lg:mx-0 w-full">
            {/* 지도 — 카드 장식(shadow) 없이 절제: 둥근 모서리 + 얇은 보더만 */}
            <div className="rounded-xl overflow-hidden border border-border-light aspect-video">
              <iframe
                title={`${SITE.name} 본사 위치 지도`}
                src={mapSrc}
                loading="lazy"
                className="w-full h-full border-none"
              />
            </div>

            {/* 연락처 안내 — 카드/박스 없이 타이포 위계로만 구분 (홈 WhatYouGet 톤) */}
            <div>
              <p className="text-aircok-blue text-xs font-semibold uppercase tracking-widest">
                Contact Info
              </p>
              {/* Sub-heading(21px) 스케일 — SectionHeader 타이틀보다 한 단계 작은 소제목 */}
              <h3 className="mt-2 text-[21px] font-display font-semibold leading-[1.19] text-heading-dark">
                연락처 안내
              </h3>
              {/* 박스 없는 정의 리스트 — 항목 구분은 얇은 하단 보더로만 절제 */}
              <dl className="mt-6 flex flex-col">
                {infoBlocks.map((block) => (
                  <div
                    key={block.label}
                    className="flex flex-col gap-1 py-4 border-b border-border-light last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    {/* Caption Bold(14px/600) — 한국어 데이터 라벨이라 uppercase·tracking-widest(영문 레이블 전용) 미적용 */}
                    <dt className="text-aircok-blue text-sm font-semibold shrink-0 sm:w-24">
                      {block.label}
                    </dt>
                    {/* Body 토큰(17px / line-height 1.65) — design.md 타이포 표준 표기 */}
                    <dd className="text-[17px] font-body text-body-dark leading-[1.65] [word-break:keep-all]">
                      {block.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
