import type { MetadataRoute } from "next";

// TODO: 실제 도메인으로 변경
const BASE_URL = "https://www.aircok.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // TODO: 실제 라우트 구조에 맞게 추가/수정
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // 예시: 정적 페이지들
    // {
    //   url: `${BASE_URL}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
    // {
    //   url: `${BASE_URL}/contact`,
    //   lastModified: new Date(),
    //   changeFrequency: "yearly",
    //   priority: 0.6,
    // },
  ];
}
