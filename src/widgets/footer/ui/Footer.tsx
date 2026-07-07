import Link from 'next/link'
import Image from 'next/image'
import { connection } from 'next/server'
import { SITE } from '@/shared/config'
import { getSiteInfoServer, type SiteInfo } from '@/entities/site-info'

function pick(apiValue: string | null | undefined, fallback: string): string {
  return apiValue?.trim() ? apiValue : fallback
}

export async function Footer() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  // NewsView·app/sitemap.ts와 동일한 런타임 동적 패턴. <Suspense>가 PPR 스트리밍을 담당한다.
  // cacheTag('site-info')를 통한 캐시/무효화는 백엔드 기동 후 도입으로 이연한다.
  await connection()

  let siteInfo: SiteInfo | null = null
  try {
    siteInfo = await getSiteInfoServer()
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
