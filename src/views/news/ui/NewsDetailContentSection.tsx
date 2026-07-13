import Link from 'next/link';
import { Button } from '@/shared/ui';
import { NewsContent } from './NewsContent';

interface Props {
  content: string;
}

/**
 * 뉴스 상세 본문 + 하단 문의 CTA.
 * content(HTML)는 NewsContent(prose 렌더러)로 sanitize 후 렌더한다.
 */
export function NewsDetailContentSection({ content }: Props) {
  return (
    <div className="mt-8">
      <NewsContent content={content} />

      {/* 하단 문의 CTA */}
      <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted [word-break:keep-all]">
          더 궁금한 점이 있으신가요? 스마트 에어콕에 문의해 주세요.
        </p>
        <Button asChild variant="primary" size="sm">
          <Link href="/contact">문의하기</Link>
        </Button>
      </div>
    </div>
  );
}
