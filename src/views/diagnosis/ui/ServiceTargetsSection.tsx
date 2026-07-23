import {
  Home,
  FlaskConical,
  Building2,
  Store,
  HeartHandshake,
  GraduationCap,
  TrafficCone,
  Hospital,
  ParkingSquare,
  type LucideIcon,
} from 'lucide-react'
import { SectionLabel } from '@/shared/ui'

const COPY = {
  eyebrow: 'WHO IS IT FOR',
  title: '이런 공간이라면, 꼭 진단받으세요',
  body: '공기질이 중요한 환경일수록 진단의 가치는 커집니다. 에어콕이 공간별 특성에 맞춰 정밀하게 분석합니다.',
} as const

const TARGETS: { icon: LucideIcon; title: string; sub: string }[] = [
  { icon: Home, title: '신규 입주공간', sub: '인테리어 · 리모델링' },
  { icon: FlaskConical, title: '특수 목적 공간', sub: '연구실 · 작업실 · 조리실' },
  { icon: Building2, title: '사무 공간', sub: '오피스 · 업무시설' },
  { icon: Store, title: '다중이용시설', sub: '방문객이 많은 공간' },
  { icon: HeartHandshake, title: '취약계층 이용시설', sub: '돌봄 · 복지시설' },
  { icon: GraduationCap, title: '교육시설', sub: '학교 · 학원' },
  { icon: TrafficCone, title: '교통량이 많은 공간', sub: '도로 인접 시설' },
  { icon: Hospital, title: '면역 취약시설', sub: '병원 · 노약자시설' },
  { icon: ParkingSquare, title: '지하 · 밀폐 시설', sub: '주차장 등' },
]

/**
 * 서비스 대상자 9개 카드 — 정적 surface 섹션.
 * 아이콘은 디자인 SVG에 근접한 lucide 아이콘으로 대체(인라인 SVG 금지).
 */
export function ServiceTargetsSection() {
  return (
    <section className="bg-surface py-14 sm:py-24">
      <div className="content-container">
        <div className="flex flex-col items-center text-center">
          <SectionLabel color="brand">{COPY.eyebrow}</SectionLabel>
          <h2 className="mt-3 text-h5 font-extrabold tracking-headline text-ink">
            {COPY.title}
          </h2>
          {/* token 없음: max-w-[600px] 섹션 리드 프로즈 폭(1회성) */}
          <p className="mt-3.5 max-w-[600px] text-lead-sm leading-relaxed text-muted">
            {COPY.body}
          </p>
        </div>

        <div className="mt-13 grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-5.5 lg:grid-cols-3">
          {TARGETS.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-2 rounded-card border border-hairline bg-surface-white px-2 py-4 text-center sm:gap-4 sm:px-7.5 sm:py-9.5"
            >
              <div className="flex size-11 items-center justify-center rounded-full border border-tint-border bg-tint sm:size-19">
                <Icon className="size-5 text-brand sm:size-8.5" strokeWidth={1.6} aria-hidden />
              </div>
              <div>
                <div className="text-xs font-bold text-ink [word-break:keep-all] sm:text-lg sm:font-extrabold">{title}</div>
                <div className="mt-1 hidden text-sm text-muted sm:block">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
