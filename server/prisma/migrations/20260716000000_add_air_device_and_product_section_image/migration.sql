-- 공기질 측정기 모델(AirDevice) / 측정 항목(AirDeviceItem) / 섹션 이미지(ProductSectionImage) 추가 (#services 1단계)
-- 순수 추가(additive) 마이그레이션 — 기존 테이블/컬럼을 변경하거나 삭제하지 않는다.
--
-- AirDevice: /services 페이지 측정기 섹션 카드. 이전 정적 하드코딩 배열을 DB 콘텐츠로 전환.
--   공개 목록은 published=true 만 order ASC + createdAt ASC(보조) 정렬(서비스 레이어).
-- AirDeviceItem: AirDevice 종속 측정 항목(값 객체). 부모 삭제 시 Cascade.
--   PATCH /api/air-devices/:id 의 items 는 replace-all 이라 자식 id 는 수정 시마다 재발급된다.
-- ProductSectionImage: 슬롯당 최대 1장인 고정 배치 이미지. slot @unique 로 슬롯당 1행을 DB 레벨 강제.
--   order 컬럼/ reorder 엔드포인트 없음(순서는 프론트 레이아웃이 결정).

-- CreateEnum
CREATE TYPE "ProductImageSlot" AS ENUM ('BRAND_BG_INDOOR', 'BRAND_BG_KITCHEN', 'MONITORING_DASHBOARD', 'MONITORING_STATS', 'MONITORING_DEVICES', 'MONITORING_DID', 'DIAGNOSIS_VISIT', 'DIAGNOSIS_ANALYSIS', 'DIAGNOSIS_REPORT', 'DIAGNOSIS_PROPOSAL');

-- CreateTable
CREATE TABLE "AirDevice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "imageUrl" TEXT,
    "size" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "comm" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "operatingTemp" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AirDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirDeviceItem" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AirDeviceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSectionImage" (
    "id" TEXT NOT NULL,
    "slot" "ProductImageSlot" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSectionImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AirDevice_published_order_idx" ON "AirDevice"("published", "order");

-- CreateIndex
CREATE INDEX "AirDeviceItem_deviceId_order_idx" ON "AirDeviceItem"("deviceId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSectionImage_slot_key" ON "ProductSectionImage"("slot");

-- AddForeignKey
ALTER TABLE "AirDeviceItem" ADD CONSTRAINT "AirDeviceItem_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "AirDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
