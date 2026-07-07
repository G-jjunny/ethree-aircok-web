import type { NextConfig } from "next";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  // Enables 'use cache' directive, cacheLife/cacheTag, and Partial Prerendering (PPR) by default.
  cacheComponents: true,

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
