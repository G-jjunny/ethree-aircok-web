import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

/**
 * /services 재설계 디자인 원본의 정적 `models` 배열을 그대로 복사한 시드 소스 (#services 1단계).
 * 배열 순서는 원본 등장 순서를 유지하며 그대로 order(0~1)에 매핑한다.
 * items 의 order 도 배열 인덱스를 그대로 사용한다(전달 순서 = 표시 순서).
 *
 * imageUrl 은 시드하지 않는다(nullable). 제품 사진은 어드민이
 * POST /api/air-devices/:id/image 로 업로드한다.
 */
interface AirDeviceSeedItem {
  code: string;
  label: string;
}

interface AirDeviceSeed {
  name: string;
  subtitle: string;
  badge: string;
  size: string;
  weight: string;
  power: string;
  comm: string;
  storage: string;
  operatingTemp: string;
  items: AirDeviceSeedItem[];
}

const AIR_DEVICES: AirDeviceSeed[] = [
  {
    name: 'SA-IL2 / SA-IEW',
    subtitle: '조달청 혁신제품 선정 모델',
    badge: '조달청 혁신제품',
    size: '180 × 130 × 30 mm',
    weight: '270 g (LTE 포함 300 g)',
    power: '12V / 200mA',
    comm: 'LTE / Ethernet / Wi-Fi 중 선택',
    storage: 'micro SD · 최장 3년',
    operatingTemp: '-10℃ ~ 60℃',
    items: [
      { code: 'TEMP', label: '온도' },
      { code: 'HUM', label: '습도' },
      { code: 'PM2.5', label: '초미세먼지' },
      { code: 'PM10', label: '미세먼지' },
      { code: 'CO₂', label: '이산화탄소' },
      { code: 'TVOC', label: '총휘발성유기화합물' },
      { code: 'HCHO', label: '폼알데히드' },
      { code: 'CO', label: '일산화탄소' },
    ],
  },
  {
    name: 'SA-LCD',
    subtitle: 'LCD 디스플레이 · 데이터 활용 특화',
    badge: '데이터 활용 특화',
    size: '180 × 130 × 30 mm',
    weight: '305 g (LTE 포함 335 g)',
    power: '12V / 200mA',
    comm: 'LTE / Wi-Fi / 비통신 모드 중 선택',
    storage: 'micro SD · 최장 3년',
    operatingTemp: '-10℃ ~ 60℃',
    items: [
      { code: 'TEMP', label: '온도' },
      { code: 'HUM', label: '습도' },
      { code: 'PM2.5', label: '초미세먼지' },
      { code: 'PM10', label: '미세먼지' },
      { code: 'CO₂', label: '이산화탄소' },
      { code: 'TVOC', label: '총휘발성유기화합물' },
      { code: 'HCHO', label: '폼알데히드' },
      { code: 'NO₂', label: '이산화질소' },
    ],
  },
];

async function main() {
  const existingCount = await prisma.airDevice.count();

  if (existingCount > 0) {
    console.log(
      `AirDevice already seeded (${existingCount} records), skipping.`,
    );
    return;
  }

  // createMany 는 중첩 items 생성을 지원하지 않으므로 레코드별 create 로 처리한다.
  // 멱등 가드(count > 0)가 테이블 단위이므로, 부분 삽입 후 실패하면 count > 0 이 되어
  // 재실행이 영구 skip 되고 불완전 데이터가 고착된다. 전체 create 를 단일 $transaction 으로
  // 묶어 전부 성공하거나 전부 롤백되게 하고, 실패 시 count 가 0 으로 남아 재실행이 복구되게 한다.
  await prisma.$transaction(
    AIR_DEVICES.map((device, index) =>
      prisma.airDevice.create({
        data: {
          name: device.name,
          subtitle: device.subtitle,
          badge: device.badge,
          size: device.size,
          weight: device.weight,
          power: device.power,
          comm: device.comm,
          storage: device.storage,
          operatingTemp: device.operatingTemp,
          order: index,
          items: {
            create: device.items.map((item, itemIndex) => ({
              code: item.code,
              label: item.label,
              order: itemIndex,
            })),
          },
        },
      }),
    ),
  );

  console.log(`AirDevice seeded: ${AIR_DEVICES.length} records inserted.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
