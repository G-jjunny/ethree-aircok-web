import Image from 'next/image'
import { PagePlaceholder, type PagePlaceholderVariant } from '@/shared/ui'

/**
 * 백엔드 업로드 이미지 베이스. NewsImage 와 동일 규칙:
 * R2(절대 http URL)는 그대로, 상대 경로(/uploads/...)는 next.config 의 `/uploads` rewrite 로
 * 동일 출처 서빙되므로 그대로 둔다(원격 호스트 화이트리스트 불필요).
 *
 * NOTE: services 슬라이스의 동일 컴포넌트를 diagnosis 로컬로 복제한 것이다.
 * (슬라이스 간 직접 import 금지 — SlotImage 를 shared/ui 로 승격하지 않고 로컬 복제로 격리.)
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export function resolveSrc(src: string): string {
  if (src.startsWith('http')) return src
  return src.startsWith('/') ? src : `${API_BASE}${src}`
}

type SlotImageProps = {
  /** 이미지 URL. **null 이 정상 케이스**다 — 미등록 슬롯이면 폴백을 렌더한다. */
  src: string | null
  alt: string
  /** 폴백 placeholder 의 eyebrow 라벨(짧은 영문 슬롯명). 톤은 variant 가 정한다. */
  label: string
  /** 폴백 톤. 실내=surface/tint/dark. */
  variant?: PagePlaceholderVariant
  /** 비율·크기 등 컨테이너 레이아웃 클래스(예: 'aspect-card w-full'). 이미지/폴백에 동일 적용. */
  className?: string
  /** 라운드 토큰 클래스. 이미지 컨테이너와 폴백에 동일 적용. */
  rounded?: string
  /** 폴백 테두리 표시 여부. 풀블리드 배경 슬롯은 false. */
  bordered?: boolean
  /** next/image sizes. fill 이미지이므로 레이아웃상 실제 표시 폭에 맞춘다. */
  sizes?: string
  /** object-fit. 기본 cover. */
  fit?: 'cover' | 'contain'
  priority?: boolean
}

/**
 * 진단 페이지 이미지 슬롯 렌더러 — 이미지가 있으면 next/image(fill), 없으면 §4 줄무늬 폴백.
 *
 * 폴백과 실제 이미지가 **동일한 컨테이너 클래스(비율/라운드)** 를 쓰므로 이미지 등록 전후로
 * 레이아웃이 흔들리지 않는다(CLS 방지).
 *
 * 순수 UI(서버/클라 양쪽 안전) — 'use client'/서버 전용 import 없음.
 */
export function SlotImage({
  src,
  alt,
  label,
  variant = 'surface',
  className = '',
  rounded = 'rounded-card',
  bordered = true,
  sizes = '100vw',
  fit = 'cover',
  priority = false,
}: SlotImageProps) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${rounded} ${className}`.trim()}>
        <Image
          src={resolveSrc(src)}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={fit === 'contain' ? 'object-contain' : 'object-cover'}
        />
      </div>
    )
  }

  return (
    <PagePlaceholder
      variant={variant}
      label={label}
      rounded={rounded}
      bordered={bordered}
      className={className}
    />
  )
}
