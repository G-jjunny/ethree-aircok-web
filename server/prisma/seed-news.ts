import 'dotenv/config';
import { PrismaClient, NewsType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

function d(str: string): Date {
  return new Date(str.replace(/\//g, '-'));
}

interface NewsSeed {
  title: string;
  description: string;
  date: Date;
  location: string | null;
  type: NewsType;
  externalUrl: string | null;
  content: string | null;
  published: boolean;
  coverImage: string | null;
}

// 유형1 — 세미나/이벤트 (BLOG)
const BLOG_NEWS: NewsSeed[] = [
  { title: '실내공기 기술 세미나', description: '성수 생각공장 2층 대회의실', date: d('2025/05/27'), location: '성수 생각공장 2층 대회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '실내공기 기술세미나 (4월 21차)', description: '성수SK V1 2층', date: d('2025/04/29'), location: '성수SK V1 2층', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '실내공기 기술세미나 (3월 20차)', description: '성수 생각공장 2층', date: d('2025/03/26'), location: '성수 생각공장 2층', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕, IAQ 관리 세미나 개최', description: '성수SK V1 2층', date: d('2025/02/02'), location: '성수SK V1 2층', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '실내공기질 기술세미나', description: '성수 생각공장 2층', date: d('2025/01/22'), location: '성수 생각공장 2층', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕, 1월 8차 정기 세미나 진행', description: '성수 생각공장 2층 대회의실', date: d('2025/01/22'), location: '성수 생각공장 2층 대회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕, 12월 정기 세미나 진행', description: '성수SK V1 2층', date: d('2024/12/20'), location: '성수SK V1 2층', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕, 11월 정기 세미나 진행', description: '성수 생각공장 2층', date: d('2024/11/27'), location: '성수 생각공장 2층', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕, 10월 정기 세미나 진행', description: '성수SK V1 2층', date: d('2024/10/29'), location: '성수SK V1 2층', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕, 9월 정기 세미나 진행', description: '성수 생각공장 2층 대회의실', date: d('2024/09/24'), location: '성수 생각공장 2층 대회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕, 8월 정기 세미나 진행', description: '성수 생각공장 2층', date: d('2024/08/02'), location: '성수 생각공장 2층', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕, 7월 정기 세미나 진행', description: '성수 생각공장 2층 대회의실', date: d('2024/07/23'), location: '성수 생각공장 2층 대회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕, 6월 정기 세미나 진행', description: '성수SK V1센터 2층 대회의실', date: d('2024/06/26'), location: '성수SK V1센터 2층 대회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕, 5월 정기 세미나 진행', description: '성수 생각공장 2층 회의실', date: d('2024/05/29'), location: '성수 생각공장 2층 회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕, 1월 정기 세미나 진행', description: 'SK V1 회의실', date: d('2024/01/16'), location: 'SK V1 회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕, 11월 정기 세미나 진행', description: '성수 생각공장 2층 회의실 (12인 회의실)', date: d('2023/11/21'), location: '성수 생각공장 2층 회의실 (12인 회의실)', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕, 10월 정기 세미나 진행', description: '성수 생각공장 2층 대회의실', date: d('2023/10/26'), location: '성수 생각공장 2층 대회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '한국대기환경학회 학술대회 주제 발표 "IoT 기반 학교 실내환경 개선을 위한 측정 연구"', description: '부산항국제전시컨벤션센터 BPEX', date: d('2023/10/25'), location: '부산항국제전시컨벤션센터 BPEX', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '2023 학교 실내공기질 통합관리 지원단 위탁사업 데이터 분석', description: '에어콕 세미나 및 행사', date: d('2023/09/10'), location: null, type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '한국실내환경학회 연차학술대회 스마트 에어콕 단독 홍보 부스 운영', description: '에어콕 세미나 및 행사', date: d('2023/09/22'), location: null, type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕, 9월 정기 세미나 진행', description: '성수 생각공장 2층 대회의실', date: d('2023/09/15'), location: '성수 생각공장 2층 대회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '산학연계 심포지엄 참석 및 주제 강연 진행', description: '에어콕 세미나 및 행사', date: d('2023/09/05'), location: null, type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕 8월 정기 세미나 진행', description: '성수 생각공장 2층 대회의실', date: d('2023/08/24'), location: '성수 생각공장 2층 대회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕 7월 정기 세미나 진행', description: '성수 생각공장 2층 대회의실', date: d('2023/07/25'), location: '성수 생각공장 2층 대회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕 2분기 컬쳐데이 진행', description: '에어콕 내부 행사', date: d('2023/07/04'), location: null, type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕 6월 정기 세미나 진행', description: '성동 SK V1 2층 대회의실', date: d('2023/06/08'), location: '성동 SK V1 2층 대회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: "탄소중립 '2023 환경사랑축제 함께동행' 에어콕 참가", description: '에어콕 세미나 및 행사', date: d('2023/06/08'), location: null, type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '상명대학교 기업방문 현장실습', description: '성수 생각공장 2층 대회의실', date: d('2023/05/12'), location: '성수 생각공장 2층 대회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕 5월 정기 세미나 진행', description: '성수 생각공장 2층 대회의실', date: d('2023/05/11'), location: '성수 생각공장 2층 대회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '서경대학교 기업방문 현장실습', description: '성동 SK V1 2층 대회의실', date: d('2023/05/02'), location: '성동 SK V1 2층 대회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '에어콕 4월 정기 세미나 진행', description: '성동 SK V1 룸no3 대회의실', date: d('2023/04/14'), location: '성동 SK V1 룸no3 대회의실', type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '2022년 올해의 에어콕인 선정', description: '에어콕 내부 행사', date: d('2022/12/28'), location: null, type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
  { title: '2022 청정대기 국제포럼', description: '에어콕 세미나 및 행사', date: d('2022/09/05'), location: null, type: 'BLOG', externalUrl: null, content: null, published: true, coverImage: null },
];

// 유형2 — 언론보도 (LINK)
const LINK_NEWS: NewsSeed[] = [
  { title: '[조리흄 전문기업] 에어콕', description: 'kharn 이종성 기자', date: d('2025/07/07'), location: null, type: 'LINK', externalUrl: 'https://www.kharn.kr/news/article.html?no=28186', content: null, published: true, coverImage: null },
  { title: '에어콕, 2025기후공기환경산업전(클린에어엑스포) 참가…조리흄 모니터링 솔루션 소개', description: '이투뉴스', date: d('2025/02/07'), location: null, type: 'LINK', externalUrl: 'http://www.e2news.com/news/articleView.html?idxno=316905', content: null, published: true, coverImage: null },
  { title: '에어콕, 실내공기질 관리 인프라로 조리흄 관리 시스템 출사표', description: '뉴스에듀', date: d('2024/09/30'), location: null, type: 'LINK', externalUrl: 'http://press.newsedu.co.kr/newsRead.php?no=997698', content: null, published: true, coverImage: null },
  { title: '에어콕, 2024 대한민국 안전산업 박람회서 주방·조리실 관리 진단 서비스 알린다... "현장서 간편하게 오염 정도 확인·관리"', description: '에이빙 최예원 기자', date: d('2024/09/26'), location: null, type: 'LINK', externalUrl: 'https://kr.aving.net/news/articleView.html?idxno=1793535', content: null, published: true, coverImage: null },
  { title: 'IAQ관리‧사용 편리성 개선 필요', description: 'kharn 이동규 기자', date: d('2024/08/30'), location: null, type: 'LINK', externalUrl: 'https://www.kharn.kr/news/article.html?no=25809', content: null, published: true, coverImage: null },
  { title: "주방·조리실 공기질 관리 위한 '에어콕 기술세미나' 성황리 개최", description: '이슈와 뉴스 생활뉴스팀', date: d('2024/08/28'), location: null, type: 'LINK', externalUrl: 'https://kr.aving.net/news/articleView.html?idxno=1793535', content: null, published: true, coverImage: null },
  { title: '실내공기질 전문업체 에어콕, 발암물질 조리흄 해결방안 모색', description: 'NewsWire', date: d('2024/08/19'), location: null, type: 'LINK', externalUrl: 'https://www.newswire.co.kr/newsRead.php?no=995211', content: null, published: true, coverImage: null },
  { title: '학교 급식실 환기관리 제도화 검토 시급', description: 'kharn', date: d('2024/07/18'), location: null, type: 'LINK', externalUrl: 'https://www.kharn.kr/mobile/article.html?no=25630', content: null, published: true, coverImage: null },
  { title: '에어콕, 학교 조리실 오염 관리·개선에 앞장선다', description: '메디컬투데이 김준수 기자', date: d('2024/07/15'), location: null, type: 'LINK', externalUrl: 'https://mdtoday.co.kr/news/view/1065600670917921', content: null, published: true, coverImage: null },
  { title: '에어콕, 학교 조리실 오염 관리·개선에 앞장선다', description: '메디컬투데이 김준수 기자', date: d('2024/06/11'), location: null, type: 'LINK', externalUrl: 'https://mdtoday.co.kr/news/view/1065601698639332', content: null, published: true, coverImage: null },
  { title: '실내공기를 체계적으로 분석하고 케어하는 기업, 에어콕 에어콕 조흔우 대표', description: '경제인뉴스', date: d('2024/03/22'), location: null, type: 'LINK', externalUrl: 'https://www.newseconomy.kr/news/articleView.html?idxno=15101', content: null, published: true, coverImage: null },
  { title: '에어콕, "2024년 실내공기질 관리 사업 도약 원년 만들 것"', description: '아시아투데이', date: d('2024/02/07'), location: null, type: 'LINK', externalUrl: 'https://www.asiatoday.co.kr/view.php?key=20240207000909449', content: null, published: true, coverImage: null },
  { title: '에어콕, 황사 및 꽃가루 시즌 대비 실내공기질 관리 솔루션 제공', description: 'BusinessKorea 윤영실 기자', date: d('2023/05/03'), location: null, type: 'LINK', externalUrl: 'https://www.businesskorea.co.kr/news/articleView.html?idxno=216458', content: null, published: true, coverImage: null },
  { title: '스마트 에어콕, 독일 베를린 IFA 2023에서 실내공기질관리 시스템 선봬', description: '세계비즈앤스포츠월드', date: d('2023/09/12'), location: null, type: 'LINK', externalUrl: 'http://www.segyebiz.com/newsView/20230912514157?OutUrl=naver', content: null, published: true, coverImage: null },
  { title: '에어콕, 공간디자인페어 참가, 실내 공간 공기질 관리 시스템 소개', description: '아시아투데이 백수원 기자', date: d('2023/09/07'), location: null, type: 'LINK', externalUrl: 'https://www.asiatoday.co.kr/view.php?key=20230808001410301', content: null, published: true, coverImage: null },
  { title: '에어콕, 여름철 사무실 공기 상담 프로모션 진행', description: '아주경제 홍승완 기자', date: d('2023/07/18'), location: null, type: 'LINK', externalUrl: 'https://www.ajunews.com/view/20230718145710091', content: null, published: true, coverImage: null },
  { title: "에어콕, 사무실 '안심 공기질' 컨설팅 진행", description: '아주경제 최오현 기자', date: d('2023/06/01'), location: null, type: 'LINK', externalUrl: 'https://www.ajunews.com/view/20230601093435043', content: null, published: true, coverImage: null },
  { title: "에어콕, '2023 나라장터 엑스포' 실내 공기질 관리 제품으로 참가", description: '뉴스핌', date: d('2023/04/12'), location: null, type: 'LINK', externalUrl: 'https://www.newspim.com/news/view/20230412000291', content: null, published: true, coverImage: null },
  { title: '쉽게 모니터링 가능한 스마트 공기질 측정', description: '환경일보 박선영 기자', date: d('2023/03/08'), location: null, type: 'LINK', externalUrl: 'https://www.hkbs.co.kr/news/articleView.html?idxno=710269', content: null, published: true, coverImage: null },
  { title: "에어콕, 스마트에어콕으로 '2023클린에어엑스포' 참가", description: '아시아투데이 백수원 기자', date: d('2023/02/22'), location: null, type: 'LINK', externalUrl: 'https://www.asiatoday.co.kr/view.php?key=20230222001507103', content: null, published: true, coverImage: null },
  { title: '에어콕, 2023건물유지관리산업전 실시간 공기질 관리 솔루션 스마트 에어콕 출품', description: '매일안전신문 강수진 기자', date: d('2023/02/10'), location: null, type: 'LINK', externalUrl: 'https://idsn.co.kr/news/view/1065576393143756', content: null, published: true, coverImage: null },
  { title: '에어콕, AIR FAIR 2022서 공기질 측정기 \'스마트 에어콕\' 출품... "공기질 관리 의무화 법에 대응 가능!"', description: '에이빙 남승현 기자', date: d('2022/12/16'), location: null, type: 'LINK', externalUrl: 'http://kr.aving.net/news/articleView.html?idxno=1775064', content: null, published: true, coverImage: null },
  { title: '"미세먼지, 무증상 뇌경색 가능성 높인다... MRI로 확인"', description: '메디컬투데이 이재혁 기자', date: d('2022/11/25'), location: null, type: 'LINK', externalUrl: 'https://mdtoday.co.kr/news/view/1065597883554170', content: null, published: true, coverImage: null },
  { title: '에어콕 2023년 출시 모델 미세먼지 1등급 획득', description: '에이빙 이재훈 기자', date: d('2022/10/07'), location: null, type: 'LINK', externalUrl: 'http://kr.aving.net/news/articleView.html?idxno=1772676', content: null, published: true, coverImage: null },
  { title: '에어콕, 2022 AIoT 국제전시회서 스마트 공기질 측정기 선보인다... "미세먼지 1등급 인증!"', description: '에이빙 이재훈 기자', date: d('2022/10/07'), location: null, type: 'LINK', externalUrl: 'http://kr.aving.net/news/articleView.html?idxno=1772676', content: null, published: true, coverImage: null },
  { title: "환경재단, 안심하고 숨쉴 수 있는 '맑은학교 만들기' 사업 진행", description: '뉴스포르테 이종구 기자', date: d('2022/04/22'), location: null, type: 'LINK', externalUrl: 'http://www.newsfortes.com/news/articleView.html?idxno=69935', content: null, published: true, coverImage: null },
  { title: "인공지능으로 관리하는 혁신제품 '실내 공기질 측정기'", description: '조달청 김다온 기자', date: d('2022/07/29'), location: null, type: 'LINK', externalUrl: 'https://blog.naver.com/ppspr/222833670821', content: null, published: true, coverImage: null },
  { title: '에어콕, 공기질 관리제품 실내형·실외형 모델 출시 예정', description: '포춘코리아 이준섭 기자', date: d('2022/07/06'), location: null, type: 'LINK', externalUrl: 'http://www.fortunekorea.co.kr/news/articleView.html?idxno=22847', content: null, published: true, coverImage: null },
  { title: '서울지방조달청, 관내 6개사 혁신시제품에 선정', description: '중소기업뉴스', date: d('2022/04/14'), location: null, type: 'LINK', externalUrl: 'http://www.kbiznews.co.kr/news/articleView.html?idxno=90931', content: null, published: true, coverImage: null },
  { title: "2021클린에어엑스포, ㈜에어콕, '스마트 실내 공기질 측정 및 모니터링 솔루션' 선보여", description: '에너지경제신문 박성준 기자', date: d('2021/03/17'), location: null, type: 'LINK', externalUrl: 'https://m.ekn.kr/view.php?key=20210317001550337', content: null, published: true, coverImage: null },
  { title: '에어콕, 세계맑은공기연맹과 공기질 개선 협력 MOU 체결', description: '세계비즈 박정환 기자', date: d('2021/01/20'), location: null, type: 'LINK', externalUrl: 'http://www.segyebiz.com/newsView/20210120506432?OutUrl=naver', content: null, published: true, coverImage: null },
  { title: "[에어페어 어워즈-AIR-TECHNOLOGY] 에어콕, 공기 질 모니터링하는 '스마트 에어콕' 소개", description: '전자신문인터넷 유은정 기자', date: d('2020/12/24'), location: null, type: 'LINK', externalUrl: 'https://www.etnews.com/20201224000069', content: null, published: true, coverImage: null },
  { title: "[에어페어 2020] 에어콕, 공기 질 모니터링하는 '스마트 에어콕 트리플콤보' 선보인다", description: '전자신문인터넷 유은정 기자', date: d('2020/11/16'), location: null, type: 'LINK', externalUrl: 'https://www.etnews.com/20201117000234', content: null, published: true, coverImage: null },
  { title: "스타트업 액셀러레이터 '프라이머' 16, 17기 데모데이 성료…<시즌6> 예고", description: '손요한 기자', date: d('2020/09/18'), location: null, type: 'LINK', externalUrl: 'http://www.mrepublic.co.kr/news/articleView.html?idxno=53872', content: null, published: true, coverImage: null },
  { title: '㈜에어콕, 초록우산어린이재단에 휴대용 미세먼지측정기 1000개 기부', description: '연합뉴스', date: d('2020/09/17'), location: null, type: 'LINK', externalUrl: 'https://www.yna.co.kr/view/PYH20200917170600004?input=1196m', content: null, published: true, coverImage: null },
  { title: "환경부 주최, '에코톤' 경연 및 시상식 개최", description: '더퍼블릭 김정수 기자', date: d('2020/08/20'), location: null, type: 'LINK', externalUrl: 'https://www.thepublic.kr/news/newsview.php?ncode=1065618223611327', content: null, published: true, coverImage: null },
  { title: '공기는 경쟁력이다', description: '공학저널 박인교 기자', date: d('2020/08/12'), location: null, type: 'LINK', externalUrl: 'http://www.engjournal.co.kr/news/articleView.html?idxno=953', content: null, published: true, coverImage: null },
  { title: "㈜에어콕, IoT 기술 적용 공기질측정기 '스마트에어콕' 출시", description: '머니투데이 더리더 정민규 기자', date: d('2020/08/25'), location: null, type: 'LINK', externalUrl: 'https://theleader.mt.co.kr/articleView.html?no=2020082519037887051', content: null, published: true, coverImage: null },
  { title: "온라인을 통해 더 많은 사람이 지켜본 '프라이머 16기 데모데이'", description: '플래텀 손요한 기자', date: d('2020/02/06'), location: null, type: 'LINK', externalUrl: 'https://platum.kr/archives/135926', content: null, published: true, coverImage: null },
  { title: "국내 최초 액셀러레이터 '프라이머' 10주년 데모데이 신기술 11개 스타트업 선보인다", description: '플래텀', date: d('2020/01/21'), location: null, type: 'LINK', externalUrl: 'https://platum.kr/archives/135271', content: null, published: true, coverImage: null },
  { title: "[에어페어 2019] 에어콕, 실시간 공기측정 데이터 기반 서비스 '스마트 에어콕' 소개", description: '전자신문인터넷 유은정 기자', date: d('2019/09/26'), location: null, type: 'LINK', externalUrl: 'https://www.etnews.com/20190926000205', content: null, published: true, coverImage: null },
  { title: '세종대 인공지능-빅데이터연구센터와 에어콕 업무협약 체결', description: '스타트업4 한상현 기자', date: d('2019/03/10'), location: null, type: 'LINK', externalUrl: 'http://www.usline.kr/news/articleView.html?idxno=12733', content: null, published: true, coverImage: null },
  { title: "(주)에어콕 사회공헌 프로그램 '어린이·청소년 위한 무료 기후·환경 생태체험 교육' 성공 개최!", description: '스포츠한국 장서윤 기자', date: d('2018/05/09'), location: null, type: 'LINK', externalUrl: 'http://sports.hankooki.com/lpage/life/201805/sp20180509113500136800.htm', content: null, published: true, coverImage: null },
  { title: '(주)에어콕, 어린이·청소년을 위한 무료 기후·환경 생태체험 교육 후원', description: '스포츠한국 장서윤 기자', date: d('2018/04/08'), location: null, type: 'LINK', externalUrl: 'http://sports.hankooki.com/lpage/life/201804/sp20180418102704136800.htm', content: null, published: true, coverImage: null },
];

async function seedNews() {
  const SENTINEL_TITLE = BLOG_NEWS[0].title;
  const alreadySeeded = await prisma.newsPost.findFirst({
    where: { title: SENTINEL_TITLE },
  });

  if (alreadySeeded) {
    const total = await prisma.newsPost.count({ where: { published: true } });
    console.log(`News already seeded (${total} published records), skipping.`);
    return;
  }

  const allNews = [...BLOG_NEWS, ...LINK_NEWS];
  const result = await prisma.newsPost.createMany({ data: allNews });

  console.log(
    `News seeded: ${result.count} records (BLOG: ${BLOG_NEWS.length}, LINK: ${LINK_NEWS.length})`,
  );
}

async function main() {
  await seedNews();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
