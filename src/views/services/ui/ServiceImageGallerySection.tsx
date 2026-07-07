import { connection } from 'next/server'
import { getServiceImageList, type ServiceImage } from '@/entities/service-image'
import { ServiceImageGallery } from './ServiceImageGallery'

/**
 * 서비스(제품군) 소개 이미지 갤러리 섹션.
 * 서버에서 이미지를 조회해 클라이언트 갤러리 leaf(ServiceImageGallery)에 전달한다.
 * 등록된 이미지가 없으면 섹션을 렌더하지 않는다.
 */
export async function ServiceImageGallerySection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let images: ServiceImage[] = []
  try {
    images = await getServiceImageList()
  } catch {
    images = []
  }

  if (images.length === 0) return null

  return (
    <section className="bg-surface-white py-20">
      {/* token 없음: 780px는 세로형 슬라이드 가독성을 위한 1회성 콘텐츠 폭 제한 */}
      <div className="mx-auto w-full max-w-[780px] px-5">
        <ServiceImageGallery images={images} />
      </div>
    </section>
  )
}
