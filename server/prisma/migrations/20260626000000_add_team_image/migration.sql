-- 에어콕 소개 OUR Team 섹션 이미지 테이블 추가 (#57)
-- TeamImage: 이미지 URL + 표시 순서만 보관(캡션/이름 없음). 최대 3개 제한은 서비스 레이어에서 강제.

-- CreateTable
CREATE TABLE "TeamImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamImage_pkey" PRIMARY KEY ("id")
);
