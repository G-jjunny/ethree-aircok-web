-- 진단서비스 후기 카드(ServiceReview) / 특허·인증서 갤러리(Certification) 추가 +
-- ProductImageSlot enum 에 진단서비스 구성/비교 섹션 슬롯 4종 추가 (#124 진단서비스 재설계 1단계)
-- 순수 추가(additive) 마이그레이션 — 기존 테이블/컬럼/enum 값을 변경하거나 삭제하지 않는다.
--
-- ServiceReview: /diagnosis ServiceReviews 섹션 고객 후기 카드(신청 이유).
--   공개 목록은 published=true 만 order ASC + createdAt ASC(보조) 정렬(서비스 레이어).
--   아바타(imageUrl)는 nullable — 미등록 시 프론트 폴백. 생성 후 POST /:id/image 로 업로드.
-- Certification: /diagnosis ServiceCerts 섹션 가변 이미지 갤러리(특허증·성능인증서).
--   공개 목록은 order ASC + createdAt ASC(보조) 정렬. 드래그앤드롭 순서변경 지원.
-- ProductImageSlot: 진단서비스 구성(측정기/모니터링)·도입 전후 비교 섹션 이미지 슬롯 4종 추가.
--   PostgreSQL 17: ALTER TYPE ... ADD VALUE 는 PG12+ 부터 트랜잭션 블록 내 실행이 가능하다.
--   (같은 트랜잭션에서 새 값을 *사용*할 수 없다는 제약만 있으며, 이 마이그레이션은 값을 사용하지 않는다.)

-- CreateTable
CREATE TABLE "ServiceReview" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceReview_published_order_idx" ON "ServiceReview"("published", "order");

-- CreateIndex
CREATE INDEX "Certification_order_idx" ON "Certification"("order");

-- AlterEnum
ALTER TYPE "ProductImageSlot" ADD VALUE 'DIAGNOSIS_COMPOSE_DEVICE';
ALTER TYPE "ProductImageSlot" ADD VALUE 'DIAGNOSIS_COMPOSE_MONITOR';
ALTER TYPE "ProductImageSlot" ADD VALUE 'DIAGNOSIS_COMPARE_BEFORE';
ALTER TYPE "ProductImageSlot" ADD VALUE 'DIAGNOSIS_COMPARE_AFTER';
