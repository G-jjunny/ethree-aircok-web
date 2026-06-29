import 'dotenv/config';
import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3';

async function checkR2Connection() {
  const required = ['CLOUDFLARE_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME', 'R2_PUBLIC_URL'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('❌ 누락된 환경변수:', missing.join(', '));
    process.exit(1);
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  console.log(`버킷 연결 확인 중: ${process.env.R2_BUCKET_NAME}...`);

  await client.send(new HeadBucketCommand({ Bucket: process.env.R2_BUCKET_NAME! }));
  console.log('✅ R2 연결 성공!');
  console.log(`   버킷: ${process.env.R2_BUCKET_NAME}`);
  console.log(`   Public URL: ${process.env.R2_PUBLIC_URL}`);
}

checkR2Connection().catch((err) => {
  console.error('❌ 연결 실패:', err.message ?? err);
  process.exit(1);
});
