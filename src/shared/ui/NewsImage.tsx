/**
 * 백엔드 API 베이스 URL. shared 레이어 내 슬라이스 간(shared/ui → shared/config) import는
 * FSD boundaries 규칙상 금지되므로, env를 직접 읽는다(기존 view/entity와 동일 패턴).
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

type NewsImageProps = {
  /** coverImage (nullable). 없으면 placeholder 렌더 */
  src: string | null
  alt: string
  ratio?: 'video' | 'featured' | 'row-thumb'
  theme?: 'light' | 'dark'
  /** 이미지에 추가할 클래스 (object-position·scale 등) */
  className?: string
}

const ASPECT: Record<NonNullable<NewsImageProps['ratio']>, string> = {
  video: 'aspect-video',
  featured: 'aspect-featured',
  'row-thumb': 'aspect-row-thumb',
}

function resolveSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

/**
 * 뉴스 커버 이미지 + 폴백 placeholder. 이미지 있으면 <img>, 없으면 §4 Image Placeholder.
 * 외부/동적 호스트이므로 next/image 대신 <img> + eslint-disable 유지.
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
}: NewsImageProps) {
  const aspect = ASPECT[ratio]
  const iconSize = ratio === 'featured' ? 'w-10 h-10' : 'w-6 h-6'

  if (src) {
    // row-thumb만 object-contain으로 원본 비율을 보존하고, 레터박스 여백을
    // Image Placeholder와 동일한 테마별 표면 톤으로 채운다(design.md §4/§13.3).
    // video/featured는 큐레이션된 대형 커버 이미지의 의도된 크롭이므로 object-cover 유지.
    const objectFitClass =
      ratio === 'row-thumb'
        ? `object-contain ${theme === 'dark' ? 'bg-surface-dark-1' : 'bg-surface-light'}`
        : 'object-cover'

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolveSrc(src)}
        alt={alt}
        className={`${aspect} w-full ${objectFitClass} ${className}`.trim()}
      />
    )
  }

  const placeholderTone =
    theme === 'dark'
      ? 'bg-surface-dark-1'
      : 'bg-surface-light'
  const iconTone =
    theme === 'dark' ? 'text-body-light opacity-40' : 'text-secondary-dark'

  return (
    <div className={`${aspect} ${placeholderTone} flex items-center justify-center`}>
      <svg
        className={`${iconSize} ${iconTone}`}
        aria-hidden="true"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>
    </div>
  )
}
