import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

function d(str: string): Date {
  return new Date(str.replace(/\//g, '-'));
}

// BLOG: index i → /news/image{i+1}.png
// LINK: index i → /news/image{i+34}.png  (image71은 .jpeg)
function blogImage(i: number): string {
  return `/news/image${i + 1}.png`;
}
function linkImage(i: number): string {
  const n = i + 34;
  return n === 71 ? `/news/image71.jpeg` : `/news/image${n}.png`;
}

interface NewsUpdate {
  title: string;
  date: Date;
  coverImage: string;
}

const BLOG_UPDATES: NewsUpdate[] = [
  { title: '실내공기 기술 세미나', date: d('2025/05/27'), coverImage: blogImage(0) },
  { title: '실내공기 기술세미나 (4월 21차)', date: d('2025/04/29'), coverImage: blogImage(1) },
  { title: '실내공기 기술세미나 (3월 20차)', date: d('2025/03/26'), coverImage: blogImage(2) },
  { title: '에어콕, IAQ 관리 세미나 개최', date: d('2025/02/02'), coverImage: blogImage(3) },
  { title: '실내공기질 기술세미나', date: d('2025/01/22'), coverImage: blogImage(4) },
  { title: '에어콕, 1월 8차 정기 세미나 진행', date: d('2025/01/22'), coverImage: blogImage(5) },
  { title: '에어콕, 12월 정기 세미나 진행', date: d('2024/12/20'), coverImage: blogImage(6) },
  { title: '에어콕, 11월 정기 세미나 진행', date: d('2024/11/27'), coverImage: blogImage(7) },
  { title: '에어콕, 10월 정기 세미나 진행', date: d('2024/10/29'), coverImage: blogImage(8) },
  { title: '에어콕, 9월 정기 세미나 진행', date: d('2024/09/24'), coverImage: blogImage(9) },
  { title: '에어콕, 8월 정기 세미나 진행', date: d('2024/08/02'), coverImage: blogImage(10) },
  { title: '에어콕, 7월 정기 세미나 진행', date: d('2024/07/23'), coverImage: blogImage(11) },
  { title: '에어콕, 6월 정기 세미나 진행', date: d('2024/06/26'), coverImage: blogImage(12) },
  { title: '에어콕, 5월 정기 세미나 진행', date: d('2024/05/29'), coverImage: blogImage(13) },
  { title: '에어콕, 1월 정기 세미나 진행', date: d('2024/01/16'), coverImage: blogImage(14) },
  { title: '에어콕, 11월 정기 세미나 진행', date: d('2023/11/21'), coverImage: blogImage(15) },
  { title: '에어콕, 10월 정기 세미나 진행', date: d('2023/10/26'), coverImage: blogImage(16) },
  { title: '한국대기환경학회 학술대회 주제 발표 "IoT 기반 학교 실내환경 개선을 위한 측정 연구"', date: d('2023/10/25'), coverImage: blogImage(17) },
  { title: '2023 학교 실내공기질 통합관리 지원단 위탁사업 데이터 분석', date: d('2023/09/10'), coverImage: blogImage(18) },
  { title: '한국실내환경학회 연차학술대회 스마트 에어콕 단독 홍보 부스 운영', date: d('2023/09/22'), coverImage: blogImage(19) },
  { title: '에어콕, 9월 정기 세미나 진행', date: d('2023/09/15'), coverImage: blogImage(20) },
  { title: '산학연계 심포지엄 참석 및 주제 강연 진행', date: d('2023/09/05'), coverImage: blogImage(21) },
  { title: '에어콕 8월 정기 세미나 진행', date: d('2023/08/24'), coverImage: blogImage(22) },
  { title: '에어콕 7월 정기 세미나 진행', date: d('2023/07/25'), coverImage: blogImage(23) },
  { title: '에어콕 2분기 컬쳐데이 진행', date: d('2023/07/04'), coverImage: blogImage(24) },
  { title: '에어콕 6월 정기 세미나 진행', date: d('2023/06/08'), coverImage: blogImage(25) },
  { title: "탄소중립 '2023 환경사랑축제 함께동행' 에어콕 참가", date: d('2023/06/08'), coverImage: blogImage(26) },
  { title: '상명대학교 기업방문 현장실습', date: d('2023/05/12'), coverImage: blogImage(27) },
  { title: '에어콕 5월 정기 세미나 진행', date: d('2023/05/11'), coverImage: blogImage(28) },
  { title: '서경대학교 기업방문 현장실습', date: d('2023/05/02'), coverImage: blogImage(29) },
  { title: '에어콕 4월 정기 세미나 진행', date: d('2023/04/14'), coverImage: blogImage(30) },
  { title: '2022년 올해의 에어콕인 선정', date: d('2022/12/28'), coverImage: blogImage(31) },
  { title: '2022 청정대기 국제포럼', date: d('2022/09/05'), coverImage: blogImage(32) },
];

const LINK_UPDATES: NewsUpdate[] = [
  { title: '[조리흄 전문기업] 에어콕', date: d('2025/07/07'), coverImage: linkImage(0) },
  { title: '에어콕, 2025기후공기환경산업전(클린에어엑스포) 참가…조리흄 모니터링 솔루션 소개', date: d('2025/02/07'), coverImage: linkImage(1) },
  { title: '에어콕, 실내공기질 관리 인프라로 조리흄 관리 시스템 출사표', date: d('2024/09/30'), coverImage: linkImage(2) },
  { title: '에어콕, 2024 대한민국 안전산업 박람회서 주방·조리실 관리 진단 서비스 알린다... "현장서 간편하게 오염 정도 확인·관리"', date: d('2024/09/26'), coverImage: linkImage(3) },
  { title: 'IAQ관리‧사용 편리성 개선 필요', date: d('2024/08/30'), coverImage: linkImage(4) },
  { title: "주방·조리실 공기질 관리 위한 '에어콕 기술세미나' 성황리 개최", date: d('2024/08/28'), coverImage: linkImage(5) },
  { title: '실내공기질 전문업체 에어콕, 발암물질 조리흄 해결방안 모색', date: d('2024/08/19'), coverImage: linkImage(6) },
  { title: '학교 급식실 환기관리 제도화 검토 시급', date: d('2024/07/18'), coverImage: linkImage(7) },
  { title: '에어콕, 학교 조리실 오염 관리·개선에 앞장선다', date: d('2024/07/15'), coverImage: linkImage(8) },
  { title: '에어콕, 학교 조리실 오염 관리·개선에 앞장선다', date: d('2024/06/11'), coverImage: linkImage(9) },
  { title: '실내공기를 체계적으로 분석하고 케어하는 기업, 에어콕 에어콕 조흔우 대표', date: d('2024/03/22'), coverImage: linkImage(10) },
  { title: '에어콕, "2024년 실내공기질 관리 사업 도약 원년 만들 것"', date: d('2024/02/07'), coverImage: linkImage(11) },
  { title: '에어콕, 황사 및 꽃가루 시즌 대비 실내공기질 관리 솔루션 제공', date: d('2023/05/03'), coverImage: linkImage(12) },
  { title: '스마트 에어콕, 독일 베를린 IFA 2023에서 실내공기질관리 시스템 선봬', date: d('2023/09/12'), coverImage: linkImage(13) },
  { title: '에어콕, 공간디자인페어 참가, 실내 공간 공기질 관리 시스템 소개', date: d('2023/09/07'), coverImage: linkImage(14) },
  { title: '에어콕, 여름철 사무실 공기 상담 프로모션 진행', date: d('2023/07/18'), coverImage: linkImage(15) },
  { title: "에어콕, 사무실 '안심 공기질' 컨설팅 진행", date: d('2023/06/01'), coverImage: linkImage(16) },
  { title: "에어콕, '2023 나라장터 엑스포' 실내 공기질 관리 제품으로 참가", date: d('2023/04/12'), coverImage: linkImage(17) },
  { title: '쉽게 모니터링 가능한 스마트 공기질 측정', date: d('2023/03/08'), coverImage: linkImage(18) },
  { title: "에어콕, 스마트에어콕으로 '2023클린에어엑스포' 참가", date: d('2023/02/22'), coverImage: linkImage(19) },
  { title: '에어콕, 2023건물유지관리산업전 실시간 공기질 관리 솔루션 스마트 에어콕 출품', date: d('2023/02/10'), coverImage: linkImage(20) },
  { title: '에어콕, AIR FAIR 2022서 공기질 측정기 \'스마트 에어콕\' 출품... "공기질 관리 의무화 법에 대응 가능!"', date: d('2022/12/16'), coverImage: linkImage(21) },
  { title: '"미세먼지, 무증상 뇌경색 가능성 높인다... MRI로 확인"', date: d('2022/11/25'), coverImage: linkImage(22) },
  { title: '에어콕 2023년 출시 모델 미세먼지 1등급 획득', date: d('2022/10/07'), coverImage: linkImage(23) },
  { title: '에어콕, 2022 AIoT 국제전시회서 스마트 공기질 측정기 선보인다... "미세먼지 1등급 인증!"', date: d('2022/10/07'), coverImage: linkImage(24) },
  { title: "환경재단, 안심하고 숨쉴 수 있는 '맑은학교 만들기' 사업 진행", date: d('2022/04/22'), coverImage: linkImage(25) },
  { title: "인공지능으로 관리하는 혁신제품 '실내 공기질 측정기'", date: d('2022/07/29'), coverImage: linkImage(26) },
  { title: '에어콕, 공기질 관리제품 실내형·실외형 모델 출시 예정', date: d('2022/07/06'), coverImage: linkImage(27) },
  { title: '서울지방조달청, 관내 6개사 혁신시제품에 선정', date: d('2022/04/14'), coverImage: linkImage(28) },
  { title: "2021클린에어엑스포, ㈜에어콕, '스마트 실내 공기질 측정 및 모니터링 솔루션' 선보여", date: d('2021/03/17'), coverImage: linkImage(29) },
  { title: '에어콕, 세계맑은공기연맹과 공기질 개선 협력 MOU 체결', date: d('2021/01/20'), coverImage: linkImage(30) },
  { title: "[에어페어 어워즈-AIR-TECHNOLOGY] 에어콕, 공기 질 모니터링하는 '스마트 에어콕' 소개", date: d('2020/12/24'), coverImage: linkImage(31) },
  { title: "[에어페어 2020] 에어콕, 공기 질 모니터링하는 '스마트 에어콕 트리플콤보' 선보인다", date: d('2020/11/16'), coverImage: linkImage(32) },
  { title: "스타트업 액셀러레이터 '프라이머' 16, 17기 데모데이 성료…<시즌6> 예고", date: d('2020/09/18'), coverImage: linkImage(33) },
  { title: '㈜에어콕, 초록우산어린이재단에 휴대용 미세먼지측정기 1000개 기부', date: d('2020/09/17'), coverImage: linkImage(34) },
  { title: "환경부 주최, '에코톤' 경연 및 시상식 개최", date: d('2020/08/20'), coverImage: linkImage(35) },
  { title: '공기는 경쟁력이다', date: d('2020/08/12'), coverImage: linkImage(36) },
  { title: "㈜에어콕, IoT 기술 적용 공기질측정기 '스마트에어콕' 출시", date: d('2020/08/25'), coverImage: linkImage(37) },
  { title: "온라인을 통해 더 많은 사람이 지켜본 '프라이머 16기 데모데이'", date: d('2020/02/06'), coverImage: linkImage(38) },
  { title: "국내 최초 액셀러레이터 '프라이머' 10주년 데모데이 신기술 11개 스타트업 선보인다", date: d('2020/01/21'), coverImage: linkImage(39) },
  { title: "[에어페어 2019] 에어콕, 실시간 공기측정 데이터 기반 서비스 '스마트 에어콕' 소개", date: d('2019/09/26'), coverImage: linkImage(40) },
  { title: '세종대 인공지능-빅데이터연구센터와 에어콕 업무협약 체결', date: d('2019/03/10'), coverImage: linkImage(41) },
  { title: "(주)에어콕 사회공헌 프로그램 '어린이·청소년 위한 무료 기후·환경 생태체험 교육' 성공 개최!", date: d('2018/05/09'), coverImage: linkImage(42) },
  { title: '(주)에어콕, 어린이·청소년을 위한 무료 기후·환경 생태체험 교육 후원', date: d('2018/04/08'), coverImage: linkImage(43) },
];

async function updateNewsImages() {
  const allUpdates = [...BLOG_UPDATES, ...LINK_UPDATES];
  let updated = 0;
  let notFound = 0;

  for (const item of allUpdates) {
    const result = await prisma.newsPost.updateMany({
      where: {
        title: item.title,
        date: item.date,
        coverImage: null,
      },
      data: { coverImage: item.coverImage },
    });

    if (result.count > 0) {
      updated += result.count;
    } else {
      // 이미 업데이트됐거나 없는 경우 — title+date로 재확인
      const existing = await prisma.newsPost.findFirst({
        where: { title: item.title, date: item.date },
        select: { id: true, coverImage: true },
      });
      if (!existing) {
        console.warn(`NOT FOUND: "${item.title}" (${item.date.toISOString().slice(0, 10)})`);
        notFound++;
      }
    }
  }

  console.log(`Updated: ${updated} records, Not found: ${notFound}`);
}

async function main() {
  await updateNewsImages();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
