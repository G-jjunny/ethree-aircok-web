-- 공기질 관리 제품군(서비스) / 진단 서비스 신청 이미지 테이블 추가 (#83)
-- ServiceImage / DiagnosisImage: 이미지 URL + 표시 순서만 보관(캡션/제목 없음).
-- 가변 이미지 목록(추가/삭제/드래그앤드롭 정렬), R2 업로드. order 오름차순 + createdAt 보조 정렬.

-- CreateTable
CREATE TABLE "ServiceImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosisImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiagnosisImage_pkey" PRIMARY KEY ("id")
);
