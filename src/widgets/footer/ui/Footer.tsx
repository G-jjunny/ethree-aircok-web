import Link from 'next/link';
import { SITE } from '@/shared/config';

export function Footer() {
  return (
    <footer>
      {/* 파트 B: 법인 정보 블록 */}
      <div className="bg-surface-dark">
        <div className="max-w-[1200px] mx-auto px-5 py-10">
          {/* 상단 행: 법인명 + 소셜 링크 */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <p className="text-heading-light font-display font-semibold text-base">
              {SITE.legalName}
            </p>
            <div className="flex items-center gap-4">
              {SITE.social.instagram && (
                <Link
                  href={SITE.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-light text-sm hover:text-heading-light transition-colors"
                >
                  Instagram
                </Link>
              )}
              {SITE.social.youtube && (
                <Link
                  href={SITE.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-light text-sm hover:text-heading-light transition-colors"
                >
                  YouTube
                </Link>
              )}
              {SITE.social.linkedin && (
                <Link
                  href={SITE.social.linkedin}
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
                {SITE.footer.ceo}
              </p>
              <p className="text-body-light text-xs">
                <span className="opacity-40 mr-2">사업자등록번호</span>
                {SITE.footer.bizNo}
              </p>
              <p className="text-body-light text-xs">
                <span className="opacity-40 mr-2">통신판매업신고번호</span>
                {SITE.footer.mailOrderNo}
              </p>
              <p className="text-body-light text-xs">
                <span className="opacity-40 mr-2">주소</span>
                {SITE.contact.address}
              </p>
            </div>
            {/* 우열: 전화·팩스·이메일 */}
            <div className="flex flex-col gap-1.5">
              <p className="text-body-light text-xs">
                <span className="opacity-40 mr-2">전화</span>
                {SITE.contact.phone}
              </p>
              <p className="text-body-light text-xs">
                <span className="opacity-40 mr-2">팩스</span>
                {SITE.footer.fax}
              </p>
              <p className="text-body-light text-xs">
                <span className="opacity-40 mr-2">이메일</span>
                {SITE.footer.email2}
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
  );
}
