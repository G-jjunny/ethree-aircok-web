export const SITE = {
  name: '스마트 에어콕',
  nameEn: 'SMART AIRCOK',
  legalName: '(주)에어코크',
  url: 'https://smartaircok.com',

  description:
    '에어콕은 실내 공기질 관리를 통해 좋은 근무 환경을 제공함으로써 귀사의 브랜드 인지도를 높이고, 경쟁력을 향상 시킵니다.',

  tagline: '스마트 에어콕은 실내 공기질 관리로 근무자의 생산성 향상과 기업 가치를 향상시킵니다.',

  contact: {
    phone: '02-6952-1947',
    email: '',
  },

  social: {
    instagram: 'https://www.instagram.com/smartaircok',
    youtube: '',
    facebook: '',
  },

  nav: [
    { label: '에어콕 소개', href: '/about' },
    { label: '서비스', href: '/services' },
    { label: '프로젝트', href: '/projects' },
    { label: '카탈로그', href: '/catalog' },
    { label: 'FAQ', href: '/faq' },
    { label: '연락하기', href: '/contact' },
  ],

  partners: [
    '삼성 S1',
    '환경산업기술원',
    '대한민국무공수훈자회',
    '한국환경연구원(KEI)',
    '고려대학교',
    '건국대학교',
    '한국화학융합시험연구원',
    '평택대학교',
    'LG화학 오창공장',
    '한국표준협회',
    '인하대학교병원',
    '현대아산병원',
    '동대문역사문화공원역',
    '수유역',
    '광주광역시',
    '농촌진흥청',
    '산림청',
  ],

  cta: {
    primary: '도입 문의',
    secondary: '제품 보기',
    catalog: '카탈로그 다운로드',
    report: '건강경영 레포트 신청',
  },
} as const
