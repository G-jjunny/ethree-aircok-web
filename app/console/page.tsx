import Link from 'next/link';

const DASHBOARD_CARDS = [
  {
    href: '/console/news',
    title: '뉴스 관리',
    description: '뉴스 게시글을 작성하고 관리합니다',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
        />
      </svg>
    ),
  },
  {
    href: '/console/inquiries',
    title: '문의 관리',
    description: '고객 문의를 확인하고 설정을 관리합니다',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
    ),
  },
  {
    href: '/console/faq',
    title: 'FAQ 관리',
    description: '자주 묻는 질문 카테고리와 항목을 관리합니다',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>
    ),
  },
  {
    href: '/console/catalog',
    title: '카탈로그 관리',
    description: '카탈로그 이미지를 업로드하고 순서를 관리합니다',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
        />
      </svg>
    ),
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="bg-surface-white border-b border-border-light px-6 lg:px-8 py-5">
        <h1 className="text-[22px] font-display font-semibold text-heading-dark">
          어드민 대시보드
        </h1>
        <p className="mt-1 text-[15px] text-secondary-dark">
          콘텐츠를 관리하고 사이트를 운영하세요
        </p>
      </div>

      {/* 카드 그리드 */}
      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DASHBOARD_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-surface-white rounded-xl border border-border-light p-6 flex flex-col gap-4 hover:border-aircok-blue/40 hover:shadow-card transition-all"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-aircok-blue/10 text-aircok-blue">
                {card.icon}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[16px] font-display font-semibold text-heading-dark group-hover:text-aircok-blue transition-colors">
                  {card.title}
                </span>
                <span className="text-[13px] text-secondary-dark leading-[1.5]">
                  {card.description}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
