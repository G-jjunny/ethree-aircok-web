import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables 'use cache' directive, cacheLife/cacheTag, and Partial Prerendering (PPR) by default.
  cacheComponents: true,

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
};

export default nextConfig;
