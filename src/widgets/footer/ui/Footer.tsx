import Link from 'next/link';
import { SITE } from '@/shared/config';

export function Footer() {
  return (
    <footer className="bg-surface-dark">
      <div className="max-w-[1200px] mx-auto px-5 py-7">
        {/* 상단: 회사 정보 + 소셜 링크 */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6">
          {/* 좌측: 회사명 + 연락처 */}
          <div className="flex flex-col gap-1.5">
            <p className="text-heading-light font-display font-semibold text-base">
              {SITE.name}
            </p>
            <p className="text-body-light text-sm">{SITE.contact.phone}</p>
            <p className="text-body-light text-sm">{SITE.contact.email}</p>
          </div>

          {/* 우측: 소셜 링크 */}
          <div className="flex items-start gap-4">
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

        {/* 하단: 저작권 */}
        <div className="border-t border-border-dark pt-5">
          <p className="text-body-light text-sm">{SITE.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
