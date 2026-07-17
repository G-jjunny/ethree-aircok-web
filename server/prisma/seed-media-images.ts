import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient, CatalogFileType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

/**
 * seed-data/media-images.json(실DB 덤프)을 읽어 CatalogImage 를 시드한다.
 * JSON 파일은 절대 수정하지 않고 읽기만 한다.
 *
 * - catalog 의 fileUrl 은 로컬 `/uploads/...pdf` 경로를 참조하며, 실제 PDF 파일은
 *   server/public/uploads(gitignore 대상)에 있어야 표시된다. 완전 신규 클론(빈 uploads)
 *   에서는 이 행은 시드되지만 실제 파일이 없어 카탈로그 PDF가 깨질 수 있다.
 *   PDF를 tracked asset으로 커밋하는 것은 이 작업 범위 밖이다.
 */
interface CatalogImageSeed {
  fileUrl: string;
  fileType: string;
  order: number;
}

interface MediaImagesSeed {
  catalogImages: CatalogImageSeed[];
}

const seed: MediaImagesSeed = JSON.parse(
  readFileSync(join(__dirname, 'seed-data', 'media-images.json'), 'utf-8'),
) as MediaImagesSeed;

/** JSON 의 fileType 문자열("pdf"/"image")을 CatalogFileType enum 으로 안전 변환한다. */
function toCatalogFileType(raw: string): CatalogFileType {
  return raw === 'pdf' ? CatalogFileType.pdf : CatalogFileType.image;
}

async function main() {
  // CatalogImage — 테이블별 독립 멱등 처리
  const catalogCount = await prisma.catalogImage.count();
  if (catalogCount > 0) {
    console.log(
      `CatalogImage already seeded (${catalogCount} records), skipping.`,
    );
  } else {
    const result = await prisma.catalogImage.createMany({
      data: seed.catalogImages.map((item) => ({
        fileUrl: item.fileUrl,
        fileType: toCatalogFileType(item.fileType),
        order: item.order,
      })),
    });
    console.log(`CatalogImage seeded: ${result.count} records inserted.`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
