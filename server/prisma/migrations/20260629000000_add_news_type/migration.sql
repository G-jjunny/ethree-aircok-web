-- CreateEnum
CREATE TYPE "NewsType" AS ENUM ('BLOG', 'LINK');

-- AlterTable: content nullable로 변경
ALTER TABLE "NewsPost" ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable: type, externalUrl 컬럼 추가
ALTER TABLE "NewsPost" ADD COLUMN "type" "NewsType" NOT NULL DEFAULT 'BLOG';
ALTER TABLE "NewsPost" ADD COLUMN "externalUrl" TEXT;
