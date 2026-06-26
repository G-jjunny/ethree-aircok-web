-- 에어콕 소개 페이지 연혁(타임라인) 항목 테이블 추가 (#57)
-- TimelineItem: 연도(year) + 월(month) + 내용(content)으로 구성.
-- 공개 목록은 year DESC, month DESC, createdAt DESC 정렬(서비스 레이어). year/month 범위는 DTO 레벨에서 검증.

-- CreateTable
CREATE TABLE "TimelineItem" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimelineItem_pkey" PRIMARY KEY ("id")
);
