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

/**
 * 전역 푸터 (시안 §11). bg-navy-deep, 좌: 로고 + 소개문, 우: 법인 정보.
 * 하단: hairline(white/8) 위 카피라이트 + 브랜드 슬로건(Sora).
 * 회사 메타는 site-info API(우선) → SITE 상수(fallback) 순으로 채운다.
 */
export async function Footer() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
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
    <footer className="bg-navy-deep text-white">
      <div className="content-container py-14">
        <div className="flex flex-wrap items-start justify-between gap-11">
          {/* 좌: 로고 + 소개문 */}
          <div className="max-w-[360px]">
            {/* width/height 는 에셋 고유 크기(200x71) — 두 값이 고유비와 일치해야 next/image
                종횡비 경고가 발생하지 않는다. 표시 크기는 CSS 로만 제어한다.
                h-8.5 = 34px (기본 4px 그리드 파생: 8.5 × 4). ⚠️ globals.css 의 구 커스텀
                스케일(--spacing-5~10, 8=64px)은 정수 스텝만 덮으므로 8.5 는 오염되지 않고,
                해당 블록 제거 후에도 34px 로 유지된다. */}
            <Image
              src="/images/logos/logo-white.png"
              alt={companyName}
              width={200}
              height={71}
              className="h-8.5 w-auto"
            />
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              보이지 않는 공기를 콕콕 집어 알려주는 측정·모니터링 기술로 고객에게 건강과
              안심을 제공합니다.
            </p>
            {(instagram || youtube || linkedin) && (
              <div className="mt-5 flex items-center gap-4">
                {instagram && (
                  <Link
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/55 hover:text-white transition-colors duration-fast"
                  >
                    Instagram
                  </Link>
                )}
                {youtube && (
                  <Link
                    href={youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/55 hover:text-white transition-colors duration-fast"
                  >
                    YouTube
                  </Link>
                )}
                {linkedin && (
                  <Link
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/55 hover:text-white transition-colors duration-fast"
                  >
                    LinkedIn
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* 우: 법인 정보 */}
          <div className="text-sm leading-loose text-white/55">
            <div className="mb-1.5 font-bold text-white/85">{companyName}</div>
            <div>대표 {ceo}</div>
            <div>사업자등록번호 {bizNo}</div>
            <div>통신판매업신고 {mailOrderNo}</div>
            <div>{address}</div>
            <div>
              TEL {phone} · FAX {fax}
            </div>
            <div>{email}</div>
          </div>
        </div>

        {/* 하단: 카피라이트 + 브랜드 슬로건 */}
        <div className="mt-11 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-6 text-xs text-white/35">
          <span>{SITE.footer.copyright}</span>
          <span className="font-display tracking-label">CLEAN AIR · SMART SPACE</span>
        </div>
      </div>
    </footer>
  )
}
