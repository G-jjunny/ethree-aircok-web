import type { MetadataRoute } from "next";

// TODO: 실제 도메인으로 변경
const BASE_URL = "https://www.aircok.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // TODO: 크롤링 차단이 필요한 경로 추가 (예: "/admin", "/api")
      disallow: [],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
