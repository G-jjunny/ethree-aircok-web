import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

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

  await seedSiteInfo();
  await seedPartners();
  await seedFaq();
}

interface FaqSeedItem {
  question: string;
  answer: string;
}

const PRODUCT_FAQ_ITEMS: FaqSeedItem[] = [
  {
    question: '스마트에어콕은 무엇을 측정할 수 있나요?',
    answer:
      '실내형은 최대 9가지 항목을 측정할 수 있으며 실외형은 최대 12가지 항목을 측정할 수 있습니다. 측정항목은 아래와 같습니다.\n\n실내형 - 미세먼지, 초미세먼지, 이산화탄소, 일산화탄소, 포름알데히드, 휘발성유기화합물, 온도, 습도, 소음\n\n실외형 Type1 - 미세먼지, 초미세먼지, 온도, 습도\n\n실외형 Type2 - 미세먼지, 초미세먼지, 온도, 습도, 풍속, 풍향, 일산화탄소, 이산화질소, 이산화황, 오존, 암모니아, 황화수소, 휘발성유기화합물',
  },
  {
    question: '센서는 정확한 제품인가요? 불안해요!',
    answer:
      '스마트에어콕은 KCL(한국건설생활환경시험연구원) 미세먼지 국가 공인 1등급을 획득한 제품으로 신뢰하고 사용하실 수 있습니다.',
  },
  {
    question: '어떤 통신방식을 사용하나요?',
    answer: 'LTE, 이더넷, WIFI 방식을 사용하여 통신하고 있습니다.',
  },
  {
    question: '환기시설 연동이 가능한가요?',
    answer: '네! 전화, 이메일 문의 바랍니다.',
  },
  {
    question: '공기질 모니터링 시스템이 무엇인가요?',
    answer:
      '스마트에어콕을 통해 측정한 공기질을 Web이나 App으로 관리자와 이용자가 실시간으로 확인하여 공기질을 진단할 수 있는 시스템입니다.',
  },
  {
    question: '렌탈 서비스가 가능한가요?',
    answer: '네! 가능합니다.',
  },
  {
    question: '체험 해보고 싶은데 방법이 있나요?',
    answer: '1개월 무료 체험 서비스가 있습니다. 부담 없이 이용해보세요!',
  },
  {
    question: '공기질 분석보고서가 무엇인가요?',
    answer: '측정한 실내공기질을 진단 분석하여 처방해드리는 서비스입니다.(유/무료)',
  },
  {
    question: '통합공기질지수는 무엇인가요?',
    answer:
      '국가 실내공기질 기준대비 20% 강화된 기준으로 구/신 건물 및 취약계층을 위한 맞춤형 지수입니다.',
  },
  {
    question: '저는 몇 대의 스마트에어콕이 필요할까요?',
    answer:
      '공기질을 관리할 수 있는 스마트에어콕은 약 20평당 기준으로 설치를 추천드립니다. 다만 분리된 공간마다 설치할 것을 추천드립니다.',
  },
];

const AIR_QUALITY_FAQ_ITEMS: FaqSeedItem[] = [
  {
    question: "'사무실오염물질'이 무엇인가요?",
    answer:
      '산업안전보건법 제24조 제1항 제1호에 따른 가스-증기-분진 등과 곰팡이-세균-바이러스 등 사무실의 공기 중에 떠다니면서 근무자에게 건강장해를 유발할 수 있는 물질을 말합니다.',
  },
  {
    question: "'공기정화설비'가 무엇인가요?",
    answer:
      '산업안전보건기준에 관한 규칙 제646조에 따르면 사무실 오염물질을 바깥으로 내보내거나 바깥의 신선한 공기를 실내로 끌어들이는 급-배기장치, 오염물질을 제거하거나 줄이는 여과제나 온도-습도-기류 등을 조절하여 공급할 수 있는 냉-난방장치, 그 밖에 이에 상응하는 장치 등을 말합니다.',
  },
  {
    question: '근로자의 안전과 건강을 위한 사업주의 의무가 있을까요?',
    answer:
      '산업안전보건법 제5조 제1항에 의하면 사업주는 근로자의 신체적 피로와 정신적 스트레스 등을 줄일 수 있는 쾌적한 작업환경을 조성하고 근로조건을 개선해야 한다고 하고 있습니다. 이밖에 산업안전보건법 시행규칙 제99조에 따라 2년에 1회 이상 일반건강진단을 실시하여야 합니다.',
  },
  {
    question: '사무실에만 오면 아프고 나가면 바로 괜찮아지는데 왜 그런 걸까요?',
    answer:
      '근무를 시작하고 수 시간 내에 증상이 나타나는 반면, 사무실을 벗어나거나 주말 또는 휴가 후 증상이 나아지면 실내공기질 조사가 필요할 수 있습니다. 빌딩증후군(SBS, sick building syndromes)일 가능성이 있습니다. 빌딩증후군은 두통, 메스꺼움, 피부염, 눈·코·목·호흡기계 자극, 기침, 집중력 장애, 냄새에 대한 과민, 근육통, 피로 등의 증상을 호소하며 특정 오염물질이나 낮은 농도의 오염물질에 대한 개인의 민감성에 영향을 받습니다.',
  },
  {
    question: '실내공기질에 영향을 미치는 요인은 어떤 것이 있을까요?',
    answer:
      '크게 화학적 요인, 생물학적 요인, 물리적 요인으로 구분할 수 있습니다. 건축설비, 내장 마무리재, 상주자의 활동 등을 통해 오염물질이 발생할 수 있습니다.',
  },
  {
    question: '실내 오염물질에는 어떤 것이 있을까요?',
    answer:
      '미세먼지, 이산화탄소, 포름알데히드, 휘발성유기화합물, 일산화탄소, 이산화질소, 아황산가스, 오존, 라돈, 석면 등을 들 수 있습니다.',
  },
  {
    question: '미세먼지의 발생원과 건강에 미치는 영향이 궁금해요',
    answer:
      '입자크기에 따라 PM10과 PM2.5로 구분되며 주요 발생원은 자동차, 발전소, 나무 연소, 산업공정, 디젤차량 등과 담배연기, 스프레이 제품 등을 들 수 있습니다. 미세먼지는 목의 통증, 천식, 아토피, 두통, 기침, 호흡곤란, 흉부압박감 등 호흡기 증상을 초래합니다. 폐와 혈액에 침투하여 DNA 돌연변이를 일으켜 폐암이 발생할 수 있습니다. 혈관을 손상시켜 심장병을 일으키며 사망률을 증가시킵니다.',
  },
  {
    question: '이산화탄소 농도 조절은 어떻게 하면 되나요? 이산화탄소 농도가 높으면 어떤 문제가 생기나요?',
    answer:
      '이산화탄소 농도는 적절한 환기로 가능합니다. 상주자 수가 많을수록, 근무시간이 경과할수록 실내 이산화탄소 농도는 점점 증가합니다. 이산화탄소 농도가 높으면 집중력 저하, 졸음, 의식혼탁, 경련 등이 올 수 있습니다.',
  },
  {
    question: '포름알데히드의 발생원과 건강에 미치는 영향이 궁금해요',
    answer:
      '담배연기, 연소가스, 가구, 건축자재, 섬유류 등에서 방출됩니다. 과민 또는 알레르기 반응을 일으킬 수 있으며 피부 발진, 눈·호흡기·점막 자극, 화끈거림, 구역질, 현기증, 냄새로 인한 고통 등을 유발할 수 있습니다.',
  },
  {
    question: '휘발성유기화합물의 발생원과 건강에 미치는 영향이 궁금해요',
    answer:
      '페인트, 세척제, 접착제, 코팅제, 마감재, 살충제, 제초제, 가솔린 증기, 담배연기, 화장품 등이 주요 발생원입니다. 메스꺼움, 어지러움, 졸음, 눈·호흡기관·피부·점막 자극, 두통, 피로, 불안감, 마취증상, 호흡곤란 등의 증상이 있을 수 있습니다.',
  },
  {
    question: "'쾌적함'에 영향을 미치는 주요 요인은 어떤 것이 있을까요?",
    answer:
      '열적으로 쾌적함이란 정상적인 정도의 옷을 입었을 때 너무 춥지도 너무 덥지도 않은 정도로 건강이나 업무 효율성을 위해서도 매우 중요합니다. 너무 더운 사무실은 근무자를 피곤하게 만들고 반면 너무 추우면 집중력이 떨어지고 쉽게 산만해집니다. 일반적으로 사무실에서 유지되어야 하는 온도는 21~23도로 외기 온도가 높은 여름철에는 실내온도를 약간 높게 하여 실내외 온도차가 많이 나지 않도록 유지하는 것이 중요합니다.',
  },
  {
    question: '사무실에서 이상적인 소음수준은 어느 정도로 보면 될까요?',
    answer:
      '사무실 근무자가 가장 많이 호소하는 불편이 소음이라는 연구가 있으며, 사무실 근무자들이 이상적인 작업조건이라고 생각하는 소음수준은 48~52dBA라는 연구결과(FAN,1989)가 있습니다. 이는 속삭임과 대화 사이 소음수준으로 볼 수 있습니다.',
  },
  {
    question: '사무실에 공기정화설비가 설치되어 있으면 공기질 관리 잘 되고 있는 거죠?',
    answer:
      '공기정화설비는 설치 못지 않게 최적 조건에서 작동되고 있는지를 확인하는 등의 지속적인 관리가 더 중요합니다. 적절한 환기방법과 환기범위 등도 매우 중요합니다. 또한 실내 화학물질로부터도 많은 영향을 받으므로 실내에서 사용되는 제품 또는 화학물질이 관리되지 않으면 공기정화설비가 제대로 작동되고 있어도 실내공기질 문제가 야기될 수 있습니다.',
  },
];

async function seedFaqCategoryItems(
  categoryId: string,
  categoryName: string,
  items: FaqSeedItem[],
): Promise<number> {
  // 멱등성: 기대 개수만큼 이미 존재하면 skip
  const existingCount = await prisma.faqItem.count({
    where: { categoryId },
  });

  if (existingCount >= items.length) {
    console.log(
      `FAQ items for "${categoryName}" already seeded (${existingCount} items), skipping.`,
    );
    return 0;
  }

  const result = await prisma.faqItem.createMany({
    data: items.map((item, index) => ({
      categoryId,
      question: item.question,
      answer: item.answer,
      order: index,
    })),
  });

  return result.count;
}

async function seedFaq() {
  const productCategory = await prisma.faqCategory.upsert({
    where: { name: '제품 관련' },
    update: {},
    create: { name: '제품 관련', order: 0 },
  });

  const airQualityCategory = await prisma.faqCategory.upsert({
    where: { name: '실내공기질' },
    update: {},
    create: { name: '실내공기질', order: 1 },
  });

  console.log(
    'FAQ categories created/verified:',
    productCategory.name,
    airQualityCategory.name,
  );

  const productItemsCreated = await seedFaqCategoryItems(
    productCategory.id,
    productCategory.name,
    PRODUCT_FAQ_ITEMS,
  );

  const airQualityItemsCreated = await seedFaqCategoryItems(
    airQualityCategory.id,
    airQualityCategory.name,
    AIR_QUALITY_FAQ_ITEMS,
  );

  console.log(
    `FAQ items created: 제품 관련 ${productItemsCreated}, 실내공기질 ${airQualityItemsCreated} (total ${
      productItemsCreated + airQualityItemsCreated
    })`,
  );
}

const PARTNERS: { name: string; order: number }[] = [
  { name: '삼성 S1', order: 0 },
  { name: '환경산업기술원', order: 1 },
  { name: '대한민국무공수훈자회', order: 2 },
  { name: '한국환경연구원(KEI)', order: 3 },
  { name: '고려대학교', order: 4 },
  { name: '건국대학교', order: 5 },
  { name: '한국화학융합시험연구원', order: 6 },
  { name: '평택대학교', order: 7 },
  { name: 'LG화학 오창공장', order: 8 },
  { name: '한국표준협회', order: 9 },
  { name: '인하대학교병원', order: 10 },
  { name: '현대아산병원', order: 11 },
  { name: '동대문역사문화공원역', order: 12 },
  { name: '수유역', order: 13 },
  { name: '광주광역시', order: 14 },
  { name: '농촌진흥청', order: 15 },
  { name: '산림청', order: 16 },
];

const SITE_INFO_SEED = {
  companyName: '스마트 에어콕',
  legalName: '(주)에어콕',
  address: '서울특별시 성동구 아차산로17길 49 성수 생각공장 데시앙플렉스 815호',
  phone: '02-6952-1947',
  email: 'contact@aircok.com',
  bizNo: '689-87-00920',
  ceo: '조흔우',
  fax: '02-552-1948',
  mailOrderNo: '2020-서울성동-02120',
  instagram: 'https://www.instagram.com/smartaircok',
  youtube: 'https://youtube.com/@aircok',
  linkedin: 'https://linkedin.com/company/aircok',
  facebook: null,
  kakaoUrl: null,
} satisfies Prisma.SiteInfoUpdateInput;

async function seedSiteInfo() {
  const siteInfo = await prisma.siteInfo.upsert({
    where: { id: 'singleton' },
    update: SITE_INFO_SEED,
    create: { id: 'singleton', ...SITE_INFO_SEED },
  });

  console.log('SiteInfo created/verified:', siteInfo.companyName);
}

async function seedPartners() {
  const existingCount = await prisma.partner.count();

  if (existingCount >= PARTNERS.length) {
    console.log(
      `Partners already seeded (${existingCount} records), skipping.`,
    );
    return;
  }

  const result = await prisma.partner.createMany({
    data: PARTNERS.map((p) => ({
      name: p.name,
      logoUrl: null,
      type: 'partner' as const,
      order: p.order,
    })),
  });

  console.log(`Partners created: ${result.count}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
