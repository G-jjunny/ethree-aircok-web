/**
 * 레거시 로컬 업로드(/uploads/*) → Cloudflare R2 1회성 이관 스크립트.
 *
 * 대상:
 *   - CatalogImage.fileUrl / CatalogImage.imageUrl 가 '/uploads/' 로 시작하는 레코드 → R2 `catalog/`
 *   - TeamImage.imageUrl 가 '/uploads/' 로 시작하는 레코드                          → R2 `team/`
 *
 * 실행:
 *   npm run migrate:catalog-team-to-r2
 *
 * ⚠ 주의
 *   - 배포 시작 커맨드(docker-entrypoint.sh)에 절대 포함하지 말 것. 수동 1회 실행 전용이다.
 *   - server/public/uploads 원본 파일이 존재하는 환경(로컬)에서 프로덕션 DATABASE_URL 을
 *     지정해 실행해야 한다. Render 무료 티어 디스크는 휘발성이라 원본 파일이 없다.
 *   - 파일이 없으면 SKIP 경고 후 계속 진행한다(DB 값은 그대로 유지).
 */
import 'dotenv/config';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { randomUUID } from 'crypto';

const UPLOAD_DELAY_MS = 200;

const EXT_TO_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  // 카탈로그는 PDF 를 포함한다.
  '.pdf': 'application/pdf',
};

function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  return EXT_TO_MIME[ext] ?? 'application/octet-stream';
}

async function main() {
  const required = [
    'DATABASE_URL',
    'CLOUDFLARE_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME',
    'R2_PUBLIC_URL',
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing env vars: ${missing.join(', ')}`);
    process.exit(1);
  }

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  const bucket = process.env.R2_BUCKET_NAME!;
  const baseUrl = process.env.R2_PUBLIC_URL!.replace(/\/$/, '');

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  const uploadsDir = join(__dirname, '..', 'public', 'uploads');

  let uploaded = 0;
  let skipped = 0;

  /** 로컬 /uploads/* URL 을 R2 로 올리고 새 절대 URL 을 반환. 파일이 없으면 null. */
  async function uploadLegacy(
    legacyUrl: string,
    folder: string,
    label: string,
  ): Promise<string | null> {
    const localPath = join(uploadsDir, legacyUrl.replace('/uploads/', ''));

    if (!existsSync(localPath)) {
      console.warn(`[SKIP] 파일 없음: ${localPath} (${label})`);
      skipped++;
      return null;
    }

    const ext = extname(localPath);
    const key = `${folder}/${randomUUID()}${ext}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: readFileSync(localPath),
        ContentType: getMimeType(localPath),
      }),
    );

    const newUrl = `${baseUrl}/${key}`;
    console.log(`[OK] ${label}: ${legacyUrl} -> ${newUrl}`);
    uploaded++;

    await new Promise((r) => setTimeout(r, UPLOAD_DELAY_MS));
    return newUrl;
  }

  try {
    // ---------------------------------------------------------------- catalog
    const catalogImages = await prisma.catalogImage.findMany({
      where: {
        OR: [
          { fileUrl: { startsWith: '/uploads/' } },
          { imageUrl: { startsWith: '/uploads/' } },
        ],
      },
      select: { id: true, fileUrl: true, imageUrl: true },
    });

    console.log(`카탈로그 마이그레이션 대상: ${catalogImages.length}건`);

    for (const item of catalogImages) {
      const data: { fileUrl?: string; imageUrl?: string } = {};

      if (item.fileUrl?.startsWith('/uploads/')) {
        const url = await uploadLegacy(
          item.fileUrl,
          'catalog',
          `CatalogImage(${item.id}).fileUrl`,
        );
        if (url) data.fileUrl = url;
      }

      if (item.imageUrl?.startsWith('/uploads/')) {
        const url = await uploadLegacy(
          item.imageUrl,
          'catalog',
          `CatalogImage(${item.id}).imageUrl`,
        );
        if (url) data.imageUrl = url;
      }

      if (Object.keys(data).length > 0) {
        await prisma.catalogImage.update({ where: { id: item.id }, data });
      }
    }

    // ------------------------------------------------------------------- team
    const teamImages = await prisma.teamImage.findMany({
      where: { imageUrl: { startsWith: '/uploads/' } },
      select: { id: true, imageUrl: true },
    });

    console.log(`팀 이미지 마이그레이션 대상: ${teamImages.length}건`);

    for (const item of teamImages) {
      const url = await uploadLegacy(
        item.imageUrl,
        'team',
        `TeamImage(${item.id}).imageUrl`,
      );
      if (url) {
        await prisma.teamImage.update({
          where: { id: item.id },
          data: { imageUrl: url },
        });
      }
    }

    console.log(`\n완료. 업로드: ${uploaded}건, 스킵: ${skipped}건`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
