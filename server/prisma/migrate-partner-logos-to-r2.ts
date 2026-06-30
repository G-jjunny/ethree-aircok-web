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
};

function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  return EXT_TO_MIME[ext] ?? 'image/png';
}

async function main() {
  const required = [
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

  try {
    const partners = await prisma.partner.findMany({
      where: {
        logoUrl: {
          startsWith: '/uploads/',
        },
      },
      select: { id: true, name: true, logoUrl: true },
    });

    console.log(`파트너 로고 마이그레이션 대상: ${partners.length}건`);

    if (partners.length === 0) {
      console.log('마이그레이션할 로고가 없습니다.');
      return;
    }

    let uploaded = 0;
    let skipped = 0;

    for (const partner of partners) {
      if (!partner.logoUrl) continue;

      const localPath = join(uploadsDir, partner.logoUrl.replace('/uploads/', ''));

      if (!existsSync(localPath)) {
        console.warn(`[SKIP] 파일 없음: ${localPath} (파트너: ${partner.name})`);
        skipped++;
        continue;
      }

      const ext = extname(localPath);
      const key = `partners/${randomUUID()}${ext}`;
      const body = readFileSync(localPath);
      const contentType = getMimeType(localPath);

      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      );

      const newUrl = `${baseUrl}/${key}`;
      await prisma.partner.update({
        where: { id: partner.id },
        data: { logoUrl: newUrl },
      });

      console.log(`[OK] ${partner.name}: ${partner.logoUrl} -> ${newUrl}`);
      uploaded++;

      await new Promise((r) => setTimeout(r, UPLOAD_DELAY_MS));
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
