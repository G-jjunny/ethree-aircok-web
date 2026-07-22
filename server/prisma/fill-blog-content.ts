import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 1회성 스크립트: seed-news.ts의 BLOG_NEWS(33개) title+date로 매칭되는 레코드 중
// content가 null인 것만 "<img src="{coverImage}" .../>" 형태의 간단한 HTML로 채운다.
// coverImage는 DB에 이미 저장된 값을 그대로 재사용한다(하드코딩하지 않음).
// LINK_NEWS는 대상이 아니다.

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

function d(str: string): Date {
  return new Date(str.replace(/\//g, '-'));
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface BlogTarget {
  title: string;
  date: Date;
}

// seed-news.ts의 BLOG_NEWS 배열(title+date)과 동일 — 그대로 재사용
const BLOG_TARGETS: BlogTarget[] = [
  { title: '실내공기 기술 세미나', date: d('2025/05/27') },
  { title: '실내공기 기술세미나 (4월 21차)', date: d('2025/04/29') },
  { title: '실내공기 기술세미나 (3월 20차)', date: d('2025/03/26') },
  { title: '에어콕, IAQ 관리 세미나 개최', date: d('2025/02/02') },
  { title: '실내공기질 기술세미나', date: d('2025/01/22') },
  { title: '에어콕, 1월 8차 정기 세미나 진행', date: d('2025/01/22') },
  { title: '에어콕, 12월 정기 세미나 진행', date: d('2024/12/20') },
  { title: '에어콕, 11월 정기 세미나 진행', date: d('2024/11/27') },
  { title: '에어콕, 10월 정기 세미나 진행', date: d('2024/10/29') },
  { title: '에어콕, 9월 정기 세미나 진행', date: d('2024/09/24') },
  { title: '에어콕, 8월 정기 세미나 진행', date: d('2024/08/02') },
  { title: '에어콕, 7월 정기 세미나 진행', date: d('2024/07/23') },
  { title: '에어콕, 6월 정기 세미나 진행', date: d('2024/06/26') },
  { title: '에어콕, 5월 정기 세미나 진행', date: d('2024/05/29') },
  { title: '에어콕, 1월 정기 세미나 진행', date: d('2024/01/16') },
  { title: '에어콕, 11월 정기 세미나 진행', date: d('2023/11/21') },
  { title: '에어콕, 10월 정기 세미나 진행', date: d('2023/10/26') },
  { title: '한국대기환경학회 학술대회 주제 발표 "IoT 기반 학교 실내환경 개선을 위한 측정 연구"', date: d('2023/10/25') },
  { title: '2023 학교 실내공기질 통합관리 지원단 위탁사업 데이터 분석', date: d('2023/09/10') },
  { title: '한국실내환경학회 연차학술대회 스마트 에어콕 단독 홍보 부스 운영', date: d('2023/09/22') },
  { title: '에어콕, 9월 정기 세미나 진행', date: d('2023/09/15') },
  { title: '산학연계 심포지엄 참석 및 주제 강연 진행', date: d('2023/09/05') },
  { title: '에어콕 8월 정기 세미나 진행', date: d('2023/08/24') },
  { title: '에어콕 7월 정기 세미나 진행', date: d('2023/07/25') },
  { title: '에어콕 2분기 컬쳐데이 진행', date: d('2023/07/04') },
  { title: '에어콕 6월 정기 세미나 진행', date: d('2023/06/08') },
  { title: "탄소중립 '2023 환경사랑축제 함께동행' 에어콕 참가", date: d('2023/06/08') },
  { title: '상명대학교 기업방문 현장실습', date: d('2023/05/12') },
  { title: '에어콕 5월 정기 세미나 진행', date: d('2023/05/11') },
  { title: '서경대학교 기업방문 현장실습', date: d('2023/05/02') },
  { title: '에어콕 4월 정기 세미나 진행', date: d('2023/04/14') },
  { title: '2022년 올해의 에어콕인 선정', date: d('2022/12/28') },
  { title: '2022 청정대기 국제포럼', date: d('2022/09/05') },
];

async function fillBlogContent() {
  let updated = 0;
  let notFound = 0;
  let skippedAlreadyFilled = 0;

  for (const target of BLOG_TARGETS) {
    const existing = await prisma.newsPost.findFirst({
      where: { title: target.title, date: target.date },
      select: { id: true, coverImage: true, content: true, description: true },
    });

    if (!existing) {
      console.warn(
        `NOT FOUND: "${target.title}" (${target.date.toISOString().slice(0, 10)})`,
      );
      notFound++;
      continue;
    }

    if (existing.content !== null) {
      skippedAlreadyFilled++;
      continue;
    }

    if (!existing.coverImage) {
      console.warn(
        `[SKIP] coverImage missing for "${target.title}" (${target.date.toISOString().slice(0, 10)})`,
      );
      continue;
    }

    const html = `<p>${escapeHtml(existing.description)}</p>\n<img src="${existing.coverImage}" alt="${escapeHtml(target.title)}" />`;

    const result = await prisma.newsPost.updateMany({
      where: { title: target.title, date: target.date, content: null },
      data: { content: html },
    });

    if (result.count > 0) {
      updated += result.count;
    } else {
      // 동시 실행 등으로 이미 채워진 경우 재확인
      const recheck = await prisma.newsPost.findFirst({
        where: { title: target.title, date: target.date },
        select: { id: true },
      });
      if (!recheck) {
        console.warn(
          `NOT FOUND on recheck: "${target.title}" (${target.date.toISOString().slice(0, 10)})`,
        );
        notFound++;
      } else {
        skippedAlreadyFilled++;
      }
    }
  }

  console.log(
    `Fill blog content complete. Updated: ${updated}, Already filled (skipped): ${skippedAlreadyFilled}, Not found: ${notFound}, Total targets: ${BLOG_TARGETS.length}`,
  );
}

async function main() {
  await fillBlogContent();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
