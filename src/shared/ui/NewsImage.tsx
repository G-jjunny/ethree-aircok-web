import Image from 'next/image'
import { PagePlaceholder } from './PagePlaceholder'

/**
 * 백엔드 API 베이스 URL. shared 레이어 내 슬라이스 간(shared/ui → shared/config) import는
 * FSD boundaries 규칙상 금지되므로, env를 직접 읽는다(기존 view/entity와 동일 패턴).
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

type NewsImageProps = {
  /** coverImage (nullable). 없으면 placeholder 렌더 */
  src: string | null
  alt: string
  ratio?: 'video' | 'featured' | 'row-thumb' | 'card'
  theme?: 'light' | 'dark'
  /**
   * 표시 모드.
   * - `'crop'`(기본): `ratio`별 고정비율 컨테이너 + object-cover/contain 크롭. 목록 카드·썸네일용.
   * - `'natural'`: 원본 비율을 그대로 유지하는 인트린식 렌더(크롭 없음). 뉴스 상세 히어로 전용.
   *   세로 포스터/가로 배너 등 비율이 제각각인 커버 이미지를 잘림 없이 전체 노출한다.
   *   `natural` 모드에서는 `ratio`가 무시된다.
   */
  fit?: 'crop' | 'natural'
  /** 이미지 컨테이너에 추가할 클래스 (object-position·scale·max-h 등) */
  className?: string
  /** LCP 후보(뉴스 목록 featured 히어로·상세 히어로)일 때만 true. 기본 lazy. */
  priority?: boolean
  /** next/image sizes 오버라이드. 미지정 시 ratio별 기본값 사용. */
  sizes?: string
}

const ASPECT: Record<NonNullable<NewsImageProps['ratio']>, string> = {
  video: 'aspect-video',
  featured: 'aspect-featured',
  'row-thumb': 'aspect-row-thumb',
  card: 'aspect-card',
}

/** ratio별 반응형 sizes 기본값(레이아웃상 실제 표시 폭에 근접). */
const DEFAULT_SIZES: Record<NonNullable<NewsImageProps['ratio']>, string> = {
  featured: '100vw',
  video: '(min-width: 768px) 50vw, 100vw',
  'row-thumb': '(min-width: 640px) 280px, 100vw',
  card: '(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw',
}

/**
 * R2(절대 http URL)는 그대로 쓰고, 그 외 상대 경로(/uploads/...)는 상대 경로로 둔다.
 * 상대 경로는 next.config의 `/uploads` rewrite로 동일 출처에서 서빙되므로 next/image가
 * 별도 remotePatterns 없이 최적화할 수 있다(백엔드 절대 호스트 화이트리스트 불필요).
 */
function resolveSrc(src: string): string {
  if (src.startsWith('http')) return src
  return src.startsWith('/') ? src : `${API_BASE}${src}`
}

/** natural 모드 nominal 치수 — 운영 DB 커버 실측(세로 포스터 720x960 = 3:4).
 * next/image intrinsic 요건 충족 + 초기 CLS 최소화용 placeholder 값일 뿐,
 * 실제 렌더는 w-full/h-auto(style width:100%/height:auto)로 원본 비율을 따른다. */
const NATURAL_NOMINAL = { width: 720, height: 960 } as const

/**
 * 뉴스 커버 이미지 + 폴백 placeholder.
 *
 * - `fit="crop"`(기본): 이미지 있으면 next/image(fill), 없으면 §4 Image Placeholder.
 *   fill 컨테이너에 ratio별 aspect를 부여해 CLS를 방지한다.
 *   ratio별 object-fit 분기: video/featured는 object-cover(의도된 크롭 art-direction),
 *   row-thumb은 object-contain + 테마별 레터박스 배경(원본 비율 전체 보존).
 *   design.md §4 "News Horizontal Row" 결정 근거 / §13.3 계약.
 * - `fit="natural"`(뉴스 상세 히어로 전용): 고정비율 크롭 컨테이너를 쓰지 않고
 *   원본 비율 그대로 인트린식 렌더. 비율을 강제하지 않으므로 세로/가로 어떤 커버든
 *   잘림 없이 전체가 보인다. 세로 포스터가 화면을 다 먹지 않도록 reading 칼럼 폭
 *   (`max-w-reading` = 760px 토큰)으로 가운데 정렬 제한한다. overflow-x 발생 없음.
 *
 * 순수 UI(서버/클라 양쪽 안전) — 'use client'/서버 전용 import 없음.
 */
export function NewsImage({
  src,
  alt,
  ratio = 'video',
  theme = 'light',
  className = '',
  priority = false,
  sizes,
  fit = 'crop',
}: NewsImageProps) {
  // ── 상세 히어로 전용: 원본 비율 인트린식(크롭 없음) ──
  // ratio/aspect 컨테이너를 쓰지 않고 이미지 자체를 반응형 인트린식으로 렌더한다.
  if (fit === 'natural') {
    if (src) {
      return (
        <Image
          src={resolveSrc(src)}
          alt={alt}
          width={NATURAL_NOMINAL.width}
          height={NATURAL_NOMINAL.height}
          sizes={sizes ?? '(min-width: 800px) 760px, 100vw'}
          priority={priority}
          // style: next/image 기본 치수 스타일보다 우선 적용해 원본 비율(height:auto)을 보장.
          style={{ width: '100%', height: 'auto' }}
          className={`mx-auto block h-auto w-full max-w-reading rounded-image ${className}`.trim()}
        />
      )
    }
    // 이미지 미확보 폴백 — 원본 비율을 알 수 없으므로 카드 비율 placeholder를
    // 동일한 reading 칼럼 폭으로 가운데 정렬해 레이아웃을 유지한다.
    return (
      <PagePlaceholder
        variant={theme === 'dark' ? 'dark' : 'surface'}
        rounded="rounded-image"
        className={`mx-auto aspect-card w-full max-w-reading ${className}`.trim()}
        label="Aircok News"
      />
    )
  }

  const aspect = ASPECT[ratio]

  if (src) {
    // row-thumb만 object-contain으로 원본 비율을 보존하고, 레터박스 여백을
    // Image Placeholder와 동일한 테마별 표면 톤으로 채운다(design.md §4/§13.3).
    // video/featured는 큐레이션된 대형 커버 이미지의 의도된 크롭이므로 object-cover 유지.
    const isRowThumb = ratio === 'row-thumb'
    const objectFitClass = isRowThumb ? 'object-contain' : 'object-cover'
    const letterboxTone = isRowThumb
      ? theme === 'dark'
        ? 'bg-navy'
        : 'bg-surface'
      : ''

    return (
      <div
        className={`relative ${aspect} w-full overflow-hidden ${letterboxTone} ${className}`.trim()}
      >
        <Image
          src={resolveSrc(src)}
          alt={alt}
          fill
          sizes={sizes ?? DEFAULT_SIZES[ratio]}
          priority={priority}
          className={objectFitClass}
        />
      </div>
    )
  }

  // 이미지 미확보 폴백 — §4 표준 줄무늬 플레이스홀더(다크 섹션=dark, 라이트=surface).
  return (
    <PagePlaceholder
      variant={theme === 'dark' ? 'dark' : 'surface'}
      bordered={false}
      rounded="rounded-none"
      className={`${aspect} w-full ${className}`.trim()}
      label="Aircok News"
    />
  )
}
