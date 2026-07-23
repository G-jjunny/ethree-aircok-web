'use client';

import { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  content: string;
}

export function NewsContent({ content }: Props) {
  const sanitized = useMemo(() => DOMPurify.sanitize(content), [content]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitized }}
      suppressHydrationWarning
      style={{ wordBreak: 'keep-all' }}
      className="font-body text-ink-soft text-base leading-[1.9] [&_h2]:text-ink [&_h2]:font-display [&_h2]:font-extrabold [&_h2]:text-h6 [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-ink [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_li]:mb-2 [&_strong]:font-semibold [&_strong]:text-ink [&_em]:italic [&_img]:rounded-card [&_img]:w-full [&_img]:my-8 [&_img]:shadow-card [&_a]:text-brand [&_a]:hover:underline [&_blockquote]:border-l-4 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted [&_blockquote]:my-6 [&_code]:bg-surface-2 [&_code]:text-ink [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_pre]:bg-navy [&_pre]:text-white [&_pre]:rounded-card [&_pre]:p-4 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre_code]:bg-transparent [&_pre_code]:text-white [&_pre_code]:p-0 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_iframe]:max-w-full"
    />
  );
}
