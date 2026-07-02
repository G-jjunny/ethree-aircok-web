import 'dotenv/config';
import { join } from 'path';
import AdmZip from 'adm-zip';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// 1회성 스크립트: docs/aircok_news_seed_data_v5.xlsx(zip) 내부의 원본 고해상도 이미지
// (xl/media/image1.png ~ image77.png, image71은 .jpeg)를 추출 -> sharp로 리사이즈/재인코딩
// -> 기존 R2 버킷의 동일 key(news/imageN.png|jpeg)로 덮어쓴다.
//
// seed-news.ts의 BLOG_NEWS(33개, image1~33)/LINK_NEWS(44개, image34~77) 배열과
// 1:1 순서 대응하므로, 엑셀에서 imageN을 순서대로 추출하면 코드베이스 번호 규칙과 일치한다.

const TOTAL_IMAGES = 77;
const JPEG_INDEX = 71;
const UPLOAD_DELAY_MS = 200;
const RESIZE_MAX = 1920;

interface ImageTarget {
  index: number;
  ext: 'png' | 'jpeg';
  entryName: string;
  r2Key: string;
  contentType: string;
}

function buildTargets(): ImageTarget[] {
  const targets: ImageTarget[] = [];
  for (let i = 1; i <= TOTAL_IMAGES; i++) {
    const ext: 'png' | 'jpeg' = i === JPEG_INDEX ? 'jpeg' : 'png';
    targets.push({
      index: i,
      ext,
      entryName: `xl/media/image${i}.${ext}`,
      r2Key: `news/image${i}.${ext}`,
      contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
    });
  }
  return targets;
}

async function optimizeImage(buffer: Buffer, ext: 'png' | 'jpeg'): Promise<Buffer> {
  const pipeline = sharp(buffer).resize({
    width: RESIZE_MAX,
    height: RESIZE_MAX,
    fit: 'inside',
    withoutEnlargement: true,
  });

  if (ext === 'png') {
    // 주의: sharp의 png() 옵션 중 quality/effort/colours/dither는 모두 내부적으로
    // palette:true(lossy 색상 양자화)를 암묵 활성화한다. 순수 무손실 압축을 원하면
    // compressionLevel(zlib 압축 레벨)만 지정해야 한다.
    return pipeline.png({ compressionLevel: 9 }).toBuffer();
  }
  return pipeline.jpeg({ quality: 82 }).toBuffer();
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

  const xlsxPath = join(__dirname, '..', '..', 'docs', 'aircok_news_seed_data_v5.xlsx');

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  const bucket = process.env.R2_BUCKET_NAME!;
  const publicUrl = process.env.R2_PUBLIC_URL!.replace(/\/$/, '');

  console.log(`Reading xlsx (zip) from: ${xlsxPath}`);
  const zip = new AdmZip(xlsxPath);

  const targets = buildTargets();
  let succeeded = 0;
  let failed = 0;
  const failedKeys: string[] = [];

  for (const target of targets) {
    try {
      const entry = zip.getEntry(target.entryName);
      if (!entry) {
        throw new Error(`Zip entry not found: ${target.entryName}`);
      }
      const rawBuffer = entry.getData();

      const optimizedBuffer = await optimizeImage(rawBuffer, target.ext);

      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: target.r2Key,
          Body: optimizedBuffer,
          ContentType: target.contentType,
        }),
      );

      console.log(
        `[OK] ${target.entryName} (${rawBuffer.length}B) -> ${bucket}/${target.r2Key} (${optimizedBuffer.length}B) -> ${publicUrl}/${target.r2Key}`,
      );
      succeeded++;
    } catch (err) {
      console.error(`[FAIL] ${target.entryName} -> ${target.r2Key}:`, err);
      failed++;
      failedKeys.push(target.r2Key);
    }

    await new Promise((r) => setTimeout(r, UPLOAD_DELAY_MS));
  }

  console.log(
    `\nReplace news seed images complete. Succeeded: ${succeeded}/${targets.length}, Failed: ${failed}`,
  );
  if (failedKeys.length) {
    console.log(`Failed keys: ${failedKeys.join(', ')}`);
  }

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
