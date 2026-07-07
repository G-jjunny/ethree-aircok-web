import Link from 'next/link'
import Image from 'next/image'
import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'
import { SITE } from '@/shared/config'
import { getSiteInfoServer, SITE_INFO_CACHE_TAG, type SiteInfo } from '@/entities/site-info'

function pick(apiValue: string | null | undefined, fallback: string): string {
  return apiValue?.trim() ? apiValue : fallback
}

/**
 * 사이트 정보 조회를 'use cache'로 캐싱한다(cacheTag: 'site-info', cacheLife: static).
 * 'use cache'는 서버 전용이므로 클라이언트 어드민이 barrel로 끌어오지 않도록 entity 페처가
 * 아닌 서버 뷰(여기)에서 래핑한다. 어드민 수정 시 revalidateSiteInfoCache(updateTag)로 무효화.
 */
async function getCachedSiteInfo(): Promise<SiteInfo> {
  'use cache'
  cacheLife('static')
  cacheTag(SITE_INFO_CACHE_TAG)
  return getSiteInfoServer()
}

export async function Footer() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  // getSiteInfoServer는 'use cache' + cacheTag('site-info')로 캐싱되며, 어드민 사이트 정보
  // 수정(useUpdateSiteInfoMutation → revalidateSiteInfoCache/updateTag) 시 온디맨드 무효화된다.
  // connection()은 빌드 안정성을 위한 동적 셸 유지용이고, 데이터 조회 자체는 서버 캐시를 재사용한다.
  await connection()

  let siteInfo: SiteInfo | null = null
  try {
    siteInfo = await getCachedSiteInfo()
  } catch {
    siteInfo = null
  }

  const companyName = pick(siteInfo?.legalName, pick(siteInfo?.companyName, SITE.legalName))
  const ceo = pick(siteInfo?.ceo, SITE.footer.ceo)
  const bizNo = pick(siteInfo?.bizNo, SITE.footer.bizNo)
  const mailOrderNo = pick(siteInfo?.mailOrderNo, SITE.footer.mailOrderNo)
  const address = pick(siteInfo?.address, SITE.contact.address)
  const phone = pick(siteInfo?.phone, SITE.contact.phone)
  const fax = pick(siteInfo?.fax, SITE.footer.fax)
  const email = pick(siteInfo?.email, SITE.footer.email2)

  const instagram = siteInfo?.instagram?.trim() || undefined
  const youtube = siteInfo?.youtube?.trim() || undefined
  const linkedin = siteInfo?.linkedin?.trim() || undefined

  return (
    <footer>
      {/* 파트 B: 법인 정보 블록 */}
      <div className="bg-surface-dark">
        <div className="content-container py-10">
          {/* 상단 행: 법인명 + 소셜 링크 */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <Image
              src="/images/logos/logo-white.png"
              alt={companyName}
              height={28}
              width={100}
              style={{ width: 'auto' }}
            />
            <div className="flex items-center gap-4">
              {instagram && (
                <Link
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-light text-sm hover:text-heading-light transition-colors"
                >
                  Instagram
                </Link>
              )}
              {youtube && (
                <Link
                  href={youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-light text-sm hover:text-heading-light transition-colors"
                >
                  YouTube
                </Link>
              )}
              {linkedin && (
                <Link
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-light text-sm hover:text-heading-light transition-colors"
                >
                  LinkedIn
                </Link>
              )}
            </div>
          </div>

          {/* 법인 정보 그리드 (2열) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
            {/* 좌열: 대표·사업자·통신판매·주소 */}
            <div className="flex flex-col gap-1.5">
              <p className="text-body-light text-xs">
                <span className="opacity-40 mr-2">대표</span>
                {ceo}
              </p>
              <p className="text-body-light text-xs">
                <span className="opacity-40 mr-2">사업자등록번호</span>
                {bizNo}
              </p>
              <p className="text-body-light text-xs">
                <span className="opacity-40 mr-2">통신판매업신고번호</span>
                {mailOrderNo}
              </p>
              <p className="text-body-light text-xs">
                <span className="opacity-40 mr-2">주소</span>
                {address}
              </p>
            </div>
            {/* 우열: 전화·팩스·이메일 */}
            <div className="flex flex-col gap-1.5">
              <p className="text-body-light text-xs">
                <span className="opacity-40 mr-2">전화</span>
                {phone}
              </p>
              <p className="text-body-light text-xs">
                <span className="opacity-40 mr-2">팩스</span>
                {fax}
              </p>
              <p className="text-body-light text-xs">
                <span className="opacity-40 mr-2">이메일</span>
                {email}
              </p>
            </div>
          </div>

          {/* 저작권 */}
          <div className="border-t border-border-dark pt-5">
            <p className="text-body-light opacity-60 text-xs">
              {SITE.footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
