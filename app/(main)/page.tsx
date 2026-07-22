import type { Metadata } from "next";
import { SITE } from "@/shared/config";
import { HomeView } from "@/views/home";

export const metadata: Metadata = {
  // 홈은 브랜드를 앞세운 절대 타이틀(템플릿 미적용)로 검색 노출을 최적화한다.
  title: {
    absolute: `${SITE.name} — 실내 공기질 측정·관리 솔루션 | 미세먼지·이산화탄소·조리흄 모니터링`,
  },
  description: SITE.tagline,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE.name} — 실내 공기질 측정·관리 솔루션`,
    description: SITE.tagline,
    url: SITE.url,
  },
};

export default function Home() {
  return <HomeView />;
}
