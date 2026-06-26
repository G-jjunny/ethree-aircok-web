import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

/**
 * 프론트 정적 연혁 데이터(src/shared/config/site.ts의 SITE.about.history.items)를
 * 그대로 복사한 시드 소스. 배열 순서는 site.ts 등장 순서를 유지한다.
 * month는 "01월" 형태의 문자열이며 삽입 시 정수(1~12)로 변환한다.
 * event 문자열은 TimelineItem.content 필드로 매핑한다.
 */
interface TimelineSeedItem {
  year: number;
  month: string;
  event: string;
}

const TIMELINE_ITEMS: TimelineSeedItem[] = [
  {
    year: 2026,
    month: '01월',
    event: '에어셰프 주방·조리실 안심 블랙박스(공기질 측정기) 런칭',
  },
  {
    year: 2026,
    month: '02월',
    event: '에어셰프 주방·조리실 에어쉴드(환기청정시스템) 런칭',
  },
  { year: 2025, month: '01월', event: '이산화질소 성능인증 1등급 획득' },
  { year: 2025, month: '02월', event: '2025 기후공기환경산업전 참가' },
  {
    year: 2025,
    month: '03월',
    event:
      '특허등록 — 실시간 미세먼지 농도를 기반으로 미세먼지 흡입량 정보와 누적 위해도 정보를 제공하는 방법 및 장치',
  },
  { year: 2025, month: '04월', event: '조리흄 모니터링 서비스 런칭' },
  {
    year: 2025,
    month: '07월',
    event: '포름알데히드 시험성적(정확도 95%)',
  },
  {
    year: 2025,
    month: '08월',
    event:
      '한국공기청정협회 학술지 기고 — 급식조리실의 유해물질 관리를 위한 사물인터넷 기반 간이측정기 활용방안',
  },
  {
    year: 2025,
    month: '11월',
    event: '에어셰프 주방·조리실 공기 건강검진서비스(진단서비스) 런칭',
  },
  {
    year: 2024,
    month: '02월',
    event: '클린에어엑스포/건물유지산업전 참가',
  },
  {
    year: 2024,
    month: '04월',
    event: '공단 다중이용시설 요리매연 용역 참가',
  },
  {
    year: 2024,
    month: '05월',
    event: '주방 급배기시설 전문기업 대성기업 MOU 체결',
  },
  {
    year: 2024,
    month: '06월',
    event: '조리흄 오염물질 관리 및 조리자 보호 관련 특허 출원',
  },
  {
    year: 2024,
    month: '06월',
    event: '주방·조리실 공기관리 세미나(월 정기 세미나) 개최',
  },
  {
    year: 2024,
    month: '07월',
    event: '실내공기질 관리 뉴스레터 구독서비스 운영',
  },
  {
    year: 2024,
    month: '09월',
    event: '2024 대한민국 안전산업 박람회 참가',
  },
  { year: 2024, month: '09월', event: '2024 우수 급식·외식 산업전 참가' },
  {
    year: 2023,
    month: '03월',
    event: 'KCL 이산화탄소 성능인증 1등급 획득 (SA-IL2 model)',
  },
  {
    year: 2023,
    month: '04월',
    event: '2023 나라장터엑스포 참가(혁신시제품등록업체 초청)',
  },
  {
    year: 2023,
    month: '04월',
    event: '에어콕 정기 세미나 개최(월례 세미나 운영)',
  },
  { year: 2023, month: '05월', event: '모니터링 시스템 VER2 런칭' },
  {
    year: 2023,
    month: '06월',
    event: '탄소중립 건강한 실내공기 시민참여 이벤트 진행(수원환경사랑축제)',
  },
  {
    year: 2023,
    month: '07월',
    event:
      '특허등록 — 실내 공기질을 기반으로 다수의 공기 관리 장치를 연동하여 자동 관리할 수 있는 스마트 실내공기질 관리 시스템 및 그 방법',
  },
  { year: 2023, month: '07월', event: '공간디자인페어 2023 참가' },
  {
    year: 2023,
    month: '09월',
    event: '독일 베를린 IFA 국제가전제품박람회 참가',
  },
  {
    year: 2023,
    month: '10월',
    event: 'KCL 이산화탄소 성능인증 1등급 획득 (SA-LCD model)',
  },
  {
    year: 2023,
    month: '10월',
    event: '한국대기환경학회 학술대회 주제 발표',
  },
  { year: 2023, month: '12월', event: '(사)한국환기산업협회 회원가입' },
  {
    year: 2022,
    month: '01월',
    event: "환경재단 '맑은학교' 프로젝트 시행",
  },
  {
    year: 2022,
    month: '02월',
    event: '공조기 연동 제어 개발 및 테스트 완료',
  },
  {
    year: 2022,
    month: '03월',
    event: '2022년 클린에어 엑스포 전시회 참가',
  },
  { year: 2022, month: '04월', event: '조달청 혁신시제품 최초 등록' },
  {
    year: 2022,
    month: '05월',
    event: '스마트 에어콕 제품 렌탈 서비스 런칭',
  },
  {
    year: 2022,
    month: '07월',
    event: '학교 실내 공기질 관제 시스템 운영 사업',
  },
  { year: 2022, month: '10월', event: 'AIoT 국제전시회 참가' },
  {
    year: 2022,
    month: '11월',
    event: 'KCL 미세먼지 성능인증 1등급 추가 획득',
  },
  {
    year: 2022,
    month: '12월',
    event: '에어페어 2022 국제공기산업박람회 참가',
  },
  {
    year: 2021,
    month: '01월',
    event: '세계맑은공기연맹 업무협약(MOU) 체결',
  },
  { year: 2021, month: '03월', event: 'CLEAN AIR EXPO 참가' },
  { year: 2021, month: '04월', event: 'KOREA SMART GRID EXPO 참가' },
  { year: 2021, month: '05월', event: 'HVAC KOREA 참가' },
  {
    year: 2021,
    month: '05월',
    event:
      '서울시 교육청 학교 보건 진흥원 유치원, 초·중·고등학교 20곳 공기질 컨설팅',
  },
  {
    year: 2020,
    month: '01월',
    event: '서울로봇고등학교(마이스터고) 산학협력 체결',
  },
  { year: 2020, month: '01월', event: '재향군인회 판매 양해각서 체결' },
  {
    year: 2020,
    month: '02월',
    event: 'KCL 미세먼지 성능인증 1등급 획득',
  },
  {
    year: 2020,
    month: '03월',
    event: '클라우드 플랫폼 시스템 구축/런칭',
  },
  {
    year: 2020,
    month: '04월',
    event: 'KTR 미세먼지 성능인증 1등급 획득',
  },
  { year: 2020, month: '05월', event: '나라장터 벤처나라 제품 선정' },
  {
    year: 2020,
    month: '06월',
    event: '단국대 에너지빅데이터센터 업무협약 체결',
  },
  { year: 2020, month: '07월', event: '에어콕 사옥 이전' },
  {
    year: 2020,
    month: '07월',
    event: '미세먼지 측정 정확도 향상을 위한 센서 자동 보정 방법(특허 등록)',
  },
  {
    year: 2020,
    month: '07월',
    event: '실내오염을 예측하는 실내 공기질제어시스템 및 제어방법(특허 등록)',
  },
  {
    year: 2020,
    month: '08월',
    event: '환경데이터 활용 그린뉴딜 아이디어 공모전(에코톤) 최우수상 수상',
  },
  {
    year: 2020,
    month: '12월',
    event: '2020 건강주택대상 실내공기개선 부문 대상',
  },
  {
    year: 2020,
    month: '12월',
    event: "AIR FAIR 2020 AWARDS 'AIR-TECHNOLOGY' 수상",
  },
  { year: 2019, month: '03월', event: '스마트에어콕 런칭' },
  {
    year: 2019,
    month: '03월',
    event: '세종대 빅데이터 연구센터 업무협약 체결',
  },
  { year: 2019, month: '06월', event: '기업부설연구소 설립' },
  {
    year: 2019,
    month: '07월',
    event: '환경정보 기반 경로 정보 제공 장치 및 방법(특허 등록)',
  },
  {
    year: 2019,
    month: '08월',
    event: '실내외 공기질 측정 및 환기 제어공유 플랫폼 서비스 제공(특허 등록)',
  },
  { year: 2019, month: '08월', event: '한국그린빌딩협의회 회원사(이사)' },
  { year: 2019, month: '09월', event: '프라이머 투자유치' },
  { year: 2019, month: '12월', event: '삼성 판매 공급업체 등록' },
  { year: 2018, month: '01월', event: '(주)에어콕 법인 설립' },
  {
    year: 2018,
    month: '01월',
    event: '영유아 지킴이 서비스 시스템(특허 등록)',
  },
  {
    year: 2018,
    month: '02월',
    event: '휴대형 미세먼지 측정기 출시·판매',
  },
  { year: 2018, month: '09월', event: '벤처기업 등록' },
];

/** "01월" 같은 월 문자열을 1~12 정수로 변환한다. 범위 밖/NaN이면 throw. */
function parseMonth(raw: string): number {
  const match = raw.match(/\d+/);
  const month = match ? parseInt(match[0], 10) : NaN;
  if (Number.isNaN(month) || month < 1 || month > 12) {
    throw new Error(`잘못된 month 값입니다: "${raw}" → ${month}`);
  }
  return month;
}

async function main() {
  const existingCount = await prisma.timelineItem.count();

  if (existingCount > 0) {
    console.log(
      `TimelineItem already seeded (${existingCount} records), skipping.`,
    );
    return;
  }

  const data = TIMELINE_ITEMS.map((item) => ({
    year: item.year,
    month: parseMonth(item.month),
    content: item.event,
  }));

  const result = await prisma.timelineItem.createMany({ data });

  console.log(`TimelineItem seeded: ${result.count} records inserted.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
