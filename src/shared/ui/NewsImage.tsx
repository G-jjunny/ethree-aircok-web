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

/**
 * 뉴스 커버 이미지 + 폴백 placeholder. 이미지 있으면 next/image(fill), 없으면 §4 Image Placeholder.
 * fill 컨테이너에 ratio별 aspect를 부여해 CLS를 방지한다.
 * ratio별 object-fit 분기: video/featured는 object-cover(의도된 크롭 art-direction),
 * row-thumb은 object-contain + 테마별 레터박스 배경(원본 비율 전체 보존).
 * design.md §4 "News Horizontal Row" 결정 근거 / §13.3 계약.
 */
export function NewsImage({
  src,
  alt,
  ratio = 'video',
  theme = 'light',
  className = '',
  priority = false,
  sizes,
}: NewsImageProps) {
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
