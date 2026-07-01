-- 에어콕 소개(About) 페이지 IntroSection 핵심가치(Core Value) 카드 테이블 추가 (#93)
-- CoreValue: 제목(title) + 설명(description) + 표시순서(order)로 구성.
-- 이전에는 프론트 SITE.about.intro.values 정적 배열로 하드코딩되어 있던 4개 카드를 DB 콘텐츠로 전환.
-- 공개 목록은 order ASC, createdAt ASC(보조) 정렬(서비스 레이어).

-- CreateTable
CREATE TABLE "CoreValue" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoreValue_pkey" PRIMARY KEY ("id")
);
