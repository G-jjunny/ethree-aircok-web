export const SITE = {
  name: '스마트 에어콕',
  nameEn: 'SMART AIRCOK',
  legalName: '(주)에어코크',
  url: 'https://smartaircok.com',

  tagline: '스마트 에어콕은 실내 공기질 관리로 근무자의 생산성 향상과 기업 가치를 향상시킵니다.',
  description:
    '에어콕은 실내 공기질을 측정하고 관리하는 전문 기업입니다. 당신이 거주하는 공간의 눈에 보이지 않는 공기질 정보를 제공하고, 이를 통하여 개선된 공기는 직원들의 건강과 업무 효율성을 향상시킵니다.',
  aboutHeadline: '회사 공기가 바뀌면, 당신의 경쟁력이 향상됩니다.',

  contact: {
    phone: '02-6952-1947',
    email: 'contact@aircok.com',
    address: '서울특별시',
  },

  social: {
    instagram: 'https://www.instagram.com/smartaircok',
    youtube: 'https://youtube.com/@aircok',
    linkedin: 'https://linkedin.com/company/aircok',
    facebook: '',
  },

  nav: {
    cta: '도입 문의',
    links: [
      { label: '에어콕 소개', href: '/about' },
      { label: '서비스', href: '/services' },
      { label: '프로젝트', href: '/projects' },
      { label: '카탈로그', href: '/catalog' },
      { label: 'FAQ', href: '/faq' },
      { label: '연락하기', href: '/contact' },
    ],
  },

  hero: {
    cta: {
      primary: '도입 문의',
      secondary: '제품 보기',
    },
  },

  features: [
    {
      title: '공기질 측정과 관리',
      description: '실시간으로 실내 공기질을 측정하고 데이터를 기반으로 정밀하게 관리합니다.',
    },
    {
      title: '직원 건강 향상',
      description: '깨끗한 공기 환경으로 직원들의 건강을 보호하고 결근율을 낮춥니다.',
    },
    {
      title: '생산성 향상',
      description: '최적화된 공기질은 집중력과 업무 효율을 높여 생산성을 향상시킵니다.',
    },
    {
      title: '운영 최적화',
      description: '스마트 자동화로 에너지 비용을 절감하고 운영 효율을 극대화합니다.',
    },
  ],

  partners: {
    heading: '함께하는 파트너사',
    list: [
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
  },

  cta: {
    headline: '더 나은 공기, 더 나은 비즈니스',
    primary: '도입 문의',
    secondary: '제품 보기',
    catalog: '카탈로그 다운로드',
    report: '건강경영 레포트 신청',
    button: '도입 문의하기',
  },

  footer: {
    copyright: `© ${new Date().getFullYear()} 스마트에어콕. All rights reserved.`,
  },
} as const
