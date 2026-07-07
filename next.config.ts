import type { NextConfig } from "next";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  // Enables 'use cache' directive, cacheLife/cacheTag, and Partial Prerendering (PPR) by default.
  cacheComponents: true,

  // 응답 헤더에서 프레임워크 노출 제거(정보 최소화).
  poweredByHeader: false,

  images: {
    // 최신 포맷 우선 서빙 (원본 대비 용량 절감)
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Cloudflare R2 public bucket — 뉴스/서비스/카탈로그 이미지 원본.
      // 업로드 이미지는 /uploads rewrite로 동일 출처 프록시되므로 별도 패턴 불필요.
      {
        protocol: 'https',
        hostname: 'pub-046c2c24be4d444aaa70d8be1a5cd092.r2.dev',
        pathname: '/**',
      },
    ],
  },

  cacheLife: {
    // 실시간성이 중요한 데이터 (재고, 알림 등)
    realtime: {
      stale: 0,
      revalidate: 10,
      expire: 30,
    },
    // 자주 바뀌는 목록 (피드, 검색 결과 등)
    short: {
      stale: 30,
      revalidate: 60,
      expire: 300,
    },
    // 일반적인 콘텐츠 (기본값으로 주로 사용)
    default: {
      stale: 300,
      revalidate: 900,
      expire: 3600,
    },
    // 거의 바뀌지 않는 데이터 (카테고리, 설정 등)
    static: {
      stale: 3600,
      revalidate: 86400,
      expire: 604800,
    },
  },

  async headers() {
    // 전역 베이스 보안 헤더. self-host 폰트(FE-1)·정적 에셋과 충돌하지 않도록 CSP는 생략한다.
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
    ];
    // 해시 기반 불변 정적 에셋(장기 캐시 + immutable).
    // 주의: /_next/static, /_next/image 등 Next 내부 경로에는 프레임워크가
    // 이미 immutable 캐싱을 부여하므로 커스텀 Cache-Control을 지정하지 않는다
    // (지정 시 "Custom Cache-Control headers ... can break Next.js dev" 경고 발생).
    const immutableCache = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ];

    return [
      { source: '/:path*', headers: securityHeaders },
      // self-host 폰트(next/font는 자체적으로 immutable 헤더를 붙이나, /fonts 직접 서빙분도 커버).
      { source: '/fonts/:path*', headers: immutableCache },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_ORIGIN}/api/:path*`,
      },
      // 정적 업로드(이미지·PDF)를 동일 출처로 프록시한다.
      // pdf.js가 동일 출처 `/uploads/xxx.pdf`로 fetch하면 CORS가 불필요하다.
      {
        source: '/uploads/:path*',
        destination: `${API_ORIGIN}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
