import 'dotenv/config';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';

const EXT_TO_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  return EXT_TO_MIME[ext] ?? 'application/octet-stream';
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
    console.error(
      `Missing env vars: ${missing.join(', ')}. Set them in server/.env and retry.`,
    );
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
  const publicUrl = process.env.R2_PUBLIC_URL!;
  // publicUrl 끝 슬래시 제거
  const baseUrl = publicUrl.replace(/\/$/, '');

  const prisma = new PrismaClient();

  try {
    // DB에서 로컬 경로로 저장된 coverImage 레코드 조회
    // 로컬 경로 패턴: /uploads/xxx (http로 시작하지 않는 경우)
    const news = await prisma.newsPost.findMany({
      where: {
        coverImage: {
          not: { startsWith: 'http' },
        },
      },
      select: { id: true, coverImage: true },
    });

    console.log(`Found ${news.length} news records with local image paths.`);

    if (news.length === 0) {
      console.log('No local image paths found. Nothing to migrate.');
      return;
    }

    const publicDir = join(__dirname, '..', 'public');

    let uploaded = 0;
    let skipped = 0;

    for (const item of news) {
      if (!item.coverImage) continue;

      // /uploads/filename 형태의 경로를 로컬 파일 경로로 변환
      const localPath = join(publicDir, item.coverImage);

      if (!existsSync(localPath)) {
        console.warn(`[SKIP] Local file not found: ${localPath}`);
        skipped++;
        continue;
      }

      // R2 키: 로컬 경로의 앞 슬래시를 제거 (예: /uploads/xxx.png → uploads/xxx.png)
      const key = item.coverImage.replace(/^\//, '');
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
      await prisma.newsPost.update({
        where: { id: item.id },
        data: { coverImage: newUrl },
      });

      console.log(`[OK] ${item.coverImage} -> ${newUrl}`);
      uploaded++;
    }

    console.log(
      `\nMigration complete. Uploaded: ${uploaded}, Skipped: ${skipped}`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
