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
      className="font-body text-ink-soft text-base leading-[1.9] [&_h2]:text-ink [&_h2]:font-display [&_h2]:font-extrabold [&_h2]:text-h6 [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-ink [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_li]:mb-2 [&_strong]:font-semibold [&_strong]:text-ink [&_img]:rounded-card [&_img]:w-full [&_img]:my-8 [&_img]:shadow-card [&_a]:text-brand [&_a]:hover:underline"
    />
  );
}
