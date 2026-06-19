'use client';

import DOMPurify from 'dompurify';

interface Props {
  content: string;
}

export function NewsContent({ content }: Props) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      style={{ wordBreak: 'keep-all' }}
      className="font-body text-body-dark text-[17px] leading-[1.65] [&_h2]:text-heading-dark [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-[28px] [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-heading-dark [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-[22px] [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_li]:mb-2 [&_strong]:font-semibold [&_strong]:text-heading-dark [&_img]:rounded-xl [&_img]:w-full [&_img]:my-8 [&_img]:shadow-card [&_a]:text-aircok-blue [&_a]:hover:underline"
    />
  );
}
