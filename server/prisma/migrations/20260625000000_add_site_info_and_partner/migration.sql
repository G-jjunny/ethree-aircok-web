-- 사이트 기본 정보 싱글톤 및 파트너/고객사 목록 추가 (#48)
-- 1) PartnerType enum 신설 (partner | client)
-- 2) SiteInfo 테이블 신설 (id='singleton' 고정 PK 싱글톤)
-- 3) Partner 테이블 신설

-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('partner', 'client');

-- CreateTable: SiteInfo
CREATE TABLE "SiteInfo" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "companyName" TEXT NOT NULL,
    "legalName" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bizNo" TEXT NOT NULL,
    "ceo" TEXT NOT NULL,
    "fax" TEXT,
    "mailOrderNo" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "linkedin" TEXT,
    "facebook" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Partner
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "type" "PartnerType" NOT NULL DEFAULT 'partner',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);
