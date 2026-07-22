-- 카탈로그 PDF 업로드 지원 (#44)
-- 1) CatalogFileType enum 신설 (image | pdf)
-- 2) CatalogImage 에 fileUrl/fileType 컬럼 추가
-- 3) 기존 imageUrl 값을 fileUrl 로 백필 (image 타입으로 유지)
-- 4) 기존 imageUrl NOT NULL 제약 제거 (하위호환 잔재용으로 유지)

-- CreateEnum
CREATE TYPE "CatalogFileType" AS ENUM ('image', 'pdf');

-- AlterTable: fileUrl/fileType 컬럼 추가 (fileType 은 NOT NULL DEFAULT 'image')
ALTER TABLE "CatalogImage" ADD COLUMN "fileUrl" TEXT,
ADD COLUMN "fileType" "CatalogFileType" NOT NULL DEFAULT 'image';

-- 백필: 기존 행의 imageUrl 값을 fileUrl 로 보존 (fileType 은 기본값 image 유지)
UPDATE "CatalogImage" SET "fileUrl" = "imageUrl" WHERE "fileUrl" IS NULL AND "imageUrl" IS NOT NULL;

-- AlterTable: imageUrl NOT NULL 제약 제거 (하위호환 목적 잔존, 데이터는 유지)
ALTER TABLE "CatalogImage" ALTER COLUMN "imageUrl" DROP NOT NULL;
