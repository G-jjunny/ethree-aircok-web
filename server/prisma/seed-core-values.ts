import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

/**
 * 프론트 정적 핵심가치 데이터(src/shared/config/site.ts의 SITE.about.intro.values)를
 * 그대로 복사한 시드 소스. 배열 순서는 site.ts 등장 순서를 유지하며 그대로 order(0~3)에 매핑한다.
 */
interface CoreValueSeedItem {
  title: string;
  description: string;
}

const CORE_VALUES: CoreValueSeedItem[] = [
  {
    title: '직원 생산성(집중력) 향상',
    description: '최적화된 공기질로 직원의 집중력과 업무 효율을 높입니다.',
  },
  {
    title: '소유빌딩 가치상승',
    description: '건강한 공기 환경은 건물의 자산 가치를 높입니다.',
  },
  {
    title: '에너지 관리비용 개선',
    description: '스마트 연동으로 에너지 비용을 최대 79%까지 절감합니다.',
  },
  {
    title: '공기질 개선',
    description: '실시간 모니터링으로 실내 공기질을 최대 46%까지 개선합니다.',
  },
];

async function main() {
  const existingCount = await prisma.coreValue.count();

  if (existingCount > 0) {
    console.log(
      `CoreValue already seeded (${existingCount} records), skipping.`,
    );
    return;
  }

  const data = CORE_VALUES.map((item, index) => ({
    title: item.title,
    description: item.description,
    order: index,
  }));

  const result = await prisma.coreValue.createMany({ data });

  console.log(`CoreValue seeded: ${result.count} records inserted.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
