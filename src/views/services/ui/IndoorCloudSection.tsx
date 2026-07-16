import { connection } from 'next/server'
import { getProductSectionImageListServer } from '@/entities/product-section-image/server'
import {
  toSlotImageMap,
  type ProductImageSlot,
  type ProductSectionImage,
  type ProductSectionImageMap,
} from '@/entities/product-section-image'
import { SectionLabel } from '@/shared/ui'
import { SlotImage } from './SlotImage'

const COPY = {
  eyebrow: 'CLOUD MONITORING',
  title: '클라우드 기반 모니터링 시스템',
  body: '관리자용 대시보드부터 데이터 통계·다운로드, 장비 리스트 모니터링, 세부 장비 상세보기(DID)까지 — 하나의 클라우드에서 공기질 관리 전 과정을 확인합니다.',
}

/** 4블록 정적 콘텐츠. 이미지만 슬롯(API)에서 오고 제목·설명·태그는 고정이다. */
const BLOCKS: {
  index: string
  slot: ProductImageSlot
  /** 브라우저 크롬 목업 타이틀바 문구. DID 블록은 크롬이 없어 null. */
  chrome: string | null
  title: string
  body: string
  tags: string[]
  /** 폴백 placeholder 라벨(짧은 영문 슬롯명). */
  label: string
}[] = [
  {
    index: '01',
    slot: 'MONITORING_DASHBOARD',
    chrome: 'SMART AIRCOK · Admin Dashboard',
    title: '관리자용 대시보드',
    body: '여러 지점의 공기질 지수와 핵심 지표를 한 화면에 모아 실시간으로 확인합니다. 이상 상황은 즉시 알림으로 전달됩니다.',
    tags: ['종합 공기질 지수', '실시간 알림', '멀티 지점'],
    label: 'DASHBOARD',
  },
  {
    index: '02',
    slot: 'MONITORING_STATS',
    chrome: 'SMART AIRCOK · Statistics & Export',
    title: '데이터 통계 및 다운로드',
    body: '일·주·월 단위 추이와 통계를 그래프로 분석하고, 측정 데이터를 CSV·리포트 파일로 언제든 내려받아 관리 이력으로 활용합니다.',
    tags: ['기간별 통계', 'CSV 다운로드', '자동 리포트'],
    label: 'STATS',
  },
  {
    index: '03',
    slot: 'MONITORING_DEVICES',
    chrome: 'SMART AIRCOK · Device List',
    title: '장비 리스트 모니터링',
    body: '연결된 모든 측정기를 목록으로 관리하며 지점·설치 위치·연결 상태를 한눈에 파악합니다. 오프라인·점검 필요 장비를 빠르게 선별합니다.',
    tags: ['연결 상태', '지점별 필터', '점검 알림'],
    label: 'DEVICES',
  },
  {
    index: '04',
    slot: 'MONITORING_DID',
    chrome: null,
    title: '세부장비 상세보기 (DID)',
    body: '현장 디스플레이(DID)에 개별 장비의 12종 공기질 지표와 상태를 크게 표시해, 방문객과 이용자가 그 공간의 공기질을 직관적으로 확인합니다.',
    tags: ['12종 지표', '현장 게시', '직관적 UI'],
    label: 'DID DISPLAY',
  },
]

/** 브라우저 크롬 목업 신호등 — 시안의 traffic light 3점을 AQI 상태 토큰으로 재사용한다. */
function ChromeDots() {
  return (
    <>
      <span className="h-2.5 w-2.5 rounded-full bg-aqi-bad" />
      <span className="h-2.5 w-2.5 rounded-full bg-aqi-warning" />
      <span className="h-2.5 w-2.5 rounded-full bg-aqi-good" />
    </>
  )
}

/** 블록 텍스트 칼럼 — 큰 인덱스 넘버 + 제목 + 설명 + 태그 pill. */
function BlockCopy({ block }: { block: (typeof BLOCKS)[number] }) {
  return (
    <div>
      <div className="font-display text-display font-light leading-none text-hairline">
        {block.index}
      </div>
      <h3 className="mt-3.5 text-subtitle font-extrabold tracking-headline text-ink">
        {block.title}
      </h3>
      <p className="mt-3.5 text-base leading-relaxed text-muted">{block.body}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {block.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-pill bg-tint px-3.5 py-1.5 text-eyebrow font-semibold text-brand"
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** 블록 비주얼 칼럼 — 01~03은 브라우저 크롬 목업, 04(DID)는 네이비 디스플레이 프레임. */
function BlockVisual({
  block,
  src,
}: {
  block: (typeof BLOCKS)[number]
  src: string | null
}) {
  // DID — 현장 디스플레이를 형상화한 네이비 프레임(크롬 없음)
  if (block.chrome === null) {
    return (
      // 스크린 목업 호버(design.md §4): 리프트 + shadow-float — "화면이 지면에서 떠오른다".
      // 보더가 없는 프레임이라 보더 강조는 생략하고 그림자만 승격한다.
      <div className="overflow-hidden rounded-card bg-navy p-4 shadow-card transition-all duration-fast ease-out hover:-translate-y-1 hover:shadow-float">
        <SlotImage
          src={src}
          alt={block.title}
          label={block.label}
          variant="dark"
          rounded="rounded-btn"
          bordered={false}
          className="aspect-video w-full"
          sizes="(min-width: 1024px) 700px, 100vw"
        />
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="h-1.5 w-11 rounded-pill bg-white/18" />
          <span className="font-display text-mini tracking-eyebrow text-white/40">
            DID DISPLAY
          </span>
          <span className="h-1.5 w-11 rounded-pill bg-white/18" />
        </div>
      </div>
    )
  }

  return (
    // 스크린 목업 호버 — DID 프레임과 동일 레시피. 보더가 있으므로 brand 계열(tint-border)로 함께 강조한다.
    <div className="overflow-hidden rounded-image border border-hairline shadow-card transition-all duration-fast ease-out hover:-translate-y-1 hover:border-tint-border hover:shadow-float">
      <div className="flex items-center gap-2 bg-navy px-4 py-3">
        <ChromeDots />
        <span className="ml-3 font-display text-mini tracking-label-sm text-white/50">
          {block.chrome}
        </span>
      </div>
      <SlotImage
        src={src}
        alt={block.title}
        label={block.label}
        variant="surface"
        rounded="rounded-none"
        bordered={false}
        className="aspect-card w-full"
        sizes="(min-width: 1024px) 700px, 100vw"
      />
    </div>
  )
}

/**
 * [실내] 클라우드 모니터링 섹션 — 4블록 좌우 교차 레이아웃.
 *
 * 슬롯 이미지 4장(MONITORING_*)을 서버에서 한 번만 조회해 `toSlotImageMap` 으로 정규화한다
 * (슬롯마다 `.find()` 를 반복하지 않는다). 전 슬롯 미등록이 현재 기본 상태이며 이때 폴백이 렌더된다.
 */
export async function IndoorCloudSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let images: ProductSectionImage[] = []
  try {
    images = await getProductSectionImageListServer()
  } catch {
    images = []
  }

  const slotImages: ProductSectionImageMap = toSlotImageMap(images)

  return (
    <section className="bg-surface-white py-24">
      <div className="content-container">
        <SectionLabel color="brand">{COPY.eyebrow}</SectionLabel>
        <h2 className="mt-3 text-h5 font-extrabold tracking-headline text-ink">
          {COPY.title}
        </h2>
        {/* token 없음: max-w-[660px] 섹션 리드 프로즈 폭(1회성) */}
        <p className="mt-3 max-w-[660px] text-lead-sm leading-relaxed text-muted">
          {COPY.body}
        </p>

        <div className="mt-16 flex flex-col gap-22">
          {BLOCKS.map((block, i) => {
            // 짝수 인덱스(01·03)는 텍스트-비주얼, 홀수(02·04)는 비주얼-텍스트로 좌우 교차.
            const visualFirst = i % 2 === 1
            const visual = <BlockVisual block={block} src={slotImages[block.slot]} />
            const copy = <BlockCopy block={block} />

            return (
              <div
                key={block.slot}
                // token 없음: 0.82fr/1.18fr 은 시안의 텍스트:비주얼 칼럼 비율(레이아웃 분수 — 색·간격 토큰 아님)
                className={`grid items-center gap-14 ${
                  visualFirst
                    ? 'lg:grid-cols-[1.18fr_0.82fr]'
                    : 'lg:grid-cols-[0.82fr_1.18fr]'
                }`}
              >
                {visualFirst ? (
                  <>
                    {visual}
                    {copy}
                  </>
                ) : (
                  <>
                    {copy}
                    {visual}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
