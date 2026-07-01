import 'dotenv/config';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { randomUUID } from 'crypto';

/**
 * 일회성 시드 스크립트 (#83).
 *
 * 프론트 정적 이미지(public/images/services, public/images/diagnosis)를
 * Cloudflare R2 로 업로드한 뒤, ServiceImage / DiagnosisImage 레코드를
 * order 순서대로 생성한다.
 *
 * 실행:
 *   server 디렉토리에서
 *   npx ts-node prisma/migrate-service-diagnosis-images-to-r2.ts
 *
 * 멱등성: 각 테이블에 레코드가 이미 1건 이상 존재하면 해당 테이블은 스킵한다.
 * (중복 시드 방지)
 *
 * 주의: R2 자격증명/운영 DB 에 직접 쓰기 때문에 자동 실행하지 말 것.
 */

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

// 시드 대상 정의. order 는 배열 인덱스 기준 0..n-1.
// __dirname 은 server/prisma 이므로 '..','..' 두 번 올라가면 프론트 루트(aircok),
// 그 아래 public/images/... 가 정적 이미지 위치다.
const SERVICE_FILES = [
  'aircok_products.png',
  'aircok_service_1.png',
  'aircok_service_2.png',
];

const DIAGNOSIS_FILES = Array.from(
  { length: 12 },
  (_, i) => `slide-${String(i + 1).padStart(2, '0')}.png`,
);

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
  const baseUrl = process.env.R2_PUBLIC_URL!.replace(/\/$/, '');

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  // server/prisma -> ../../public/images
  const imagesDir = join(__dirname, '..', '..', 'public', 'images');
  const servicesDir = join(imagesDir, 'services');
  const diagnosisDir = join(imagesDir, 'diagnosis');

  /**
   * 파일을 R2 에 PUT 하고 공개 URL 을 반환한다.
   */
  async function uploadToR2(localPath: string, folder: string): Promise<string> {
    const ext = extname(localPath);
    const key = `${folder}/${randomUUID()}${ext}`;
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

    return `${baseUrl}/${key}`;
  }

  try {
    // ---- ServiceImage ----
    const serviceCount = await prisma.serviceImage.count();
    if (serviceCount > 0) {
      console.warn(
        `[SKIP] ServiceImage 레코드가 이미 ${serviceCount}건 존재합니다. 서비스 이미지 시드를 건너뜁니다.`,
      );
    } else {
      let order = 0;
      for (const fileName of SERVICE_FILES) {
        const localPath = join(servicesDir, fileName);
        if (!existsSync(localPath)) {
          console.warn(`[SKIP] 파일 없음: ${localPath}`);
          continue;
        }

        const url = await uploadToR2(localPath, 'services');
        await prisma.serviceImage.create({
          data: { imageUrl: url, order },
        });

        console.log(`[OK] service[${order}] ${fileName} -> ${url}`);
        order++;

        await new Promise((r) => setTimeout(r, UPLOAD_DELAY_MS));
      }
      console.log(`서비스 이미지 시드 완료: ${order}건`);
    }

    // ---- DiagnosisImage ----
    const diagnosisCount = await prisma.diagnosisImage.count();
    if (diagnosisCount > 0) {
      console.warn(
        `[SKIP] DiagnosisImage 레코드가 이미 ${diagnosisCount}건 존재합니다. 진단 이미지 시드를 건너뜁니다.`,
      );
    } else {
      let order = 0;
      for (const fileName of DIAGNOSIS_FILES) {
        const localPath = join(diagnosisDir, fileName);
        if (!existsSync(localPath)) {
          console.warn(`[SKIP] 파일 없음: ${localPath}`);
          continue;
        }

        const url = await uploadToR2(localPath, 'diagnosis');
        await prisma.diagnosisImage.create({
          data: { imageUrl: url, order },
        });

        console.log(`[OK] diagnosis[${order}] ${fileName} -> ${url}`);
        order++;

        await new Promise((r) => setTimeout(r, UPLOAD_DELAY_MS));
      }
      console.log(`진단 이미지 시드 완료: ${order}건`);
    }

    console.log('\n시드 스크립트 완료.');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
