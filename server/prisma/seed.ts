import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!password) {
    throw new Error('ADMIN_SEED_PASSWORD 환경변수가 설정되지 않았습니다.');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      hashedPassword,
    },
  });

  console.log('Admin user created/verified:', admin.username);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
