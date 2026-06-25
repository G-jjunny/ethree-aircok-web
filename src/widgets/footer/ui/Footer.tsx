'use client'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { SITE } from '@/shared/config'
import { siteInfoQueryOptions } from '@/entities/site-info'

export function Footer() {
  const { data: siteInfo } = useQuery(siteInfoQueryOptions())

  const companyName = siteInfo?.legalName ?? siteInfo?.companyName ?? SITE.legalName
  const ceo = siteInfo?.ceo ?? SITE.footer.ceo
  const bizNo = siteInfo?.bizNo ?? SITE.footer.bizNo
  const mailOrderNo = siteInfo?.mailOrderNo ?? SITE.footer.mailOrderNo
  const address = siteInfo?.address ?? SITE.contact.address
  const phone = siteInfo?.phone ?? SITE.contact.phone
  const fax = siteInfo?.fax ?? SITE.footer.fax
  const email = siteInfo?.email ?? SITE.footer.email2

  const instagram = siteInfo?.instagram ?? SITE.social.instagram
  const youtube = siteInfo?.youtube ?? SITE.social.youtube
  const linkedin = siteInfo?.linkedin ?? SITE.social.linkedin

  return (
    <footer>
      {/* 파트 B: 법인 정보 블록 */}
      <div className="bg-surface-dark">
        <div className="content-container py-10">
          {/* 상단 행: 법인명 + 소셜 링크 */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <p className="text-heading-light font-display font-semibold text-base">
              {companyName}
            </p>
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
