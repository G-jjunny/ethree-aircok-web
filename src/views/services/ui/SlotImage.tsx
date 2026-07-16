import Image from 'next/image'
import { PagePlaceholder, type PagePlaceholderVariant } from '@/shared/ui'

/**
 * 백엔드 업로드 이미지 베이스. NewsImage 와 동일 규칙:
 * R2(절대 http URL)는 그대로, 상대 경로(/uploads/...)는 next.config 의 `/uploads` rewrite 로
 * 동일 출처 서빙되므로 그대로 둔다(원격 호스트 화이트리스트 불필요).
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

function resolveSrc(src: string): string {
  if (src.startsWith('http')) return src
  return src.startsWith('/') ? src : `${API_BASE}${src}`
}

type SlotImageProps = {
  /**
   * 이미지 URL. **null 이 정상 케이스**다 — `/services` 의 이미지 슬롯(product-section-image)과
   * 측정기 사진(air-device.imageUrl)은 현재 전부 미등록이라 기본 상태가 폴백이다.
   */
  src: string | null
  alt: string
  /** 폴백 placeholder 의 eyebrow 라벨(짧은 영문 슬롯명). 톤은 variant 가 정한다. */
  label: string
  /** 폴백 톤. 실내=surface/tint/dark · 주방=chef/chef-dark (design.md §2 계열 분리). */
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
 * `/services` 이미지 슬롯 렌더러 — 이미지가 있으면 next/image(fill), 없으면 §4 줄무늬 폴백.
 *
 * 슬롯 이미지·측정기 사진이 전부 미등록인 현재 상태에서 페이지 전역이 이 폴백 경로를 탄다.
 * 폴백과 실제 이미지가 **동일한 컨테이너 클래스(비율/라운드)** 를 쓰므로 이미지 등록 전후로
 * 레이아웃이 흔들리지 않는다(CLS 방지).
 *
 * 순수 UI(서버/클라 양쪽 안전) — 'use client'/서버 전용 import 없음. 측정기 캐러셀(클라이언트)에서도 쓴다.
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
