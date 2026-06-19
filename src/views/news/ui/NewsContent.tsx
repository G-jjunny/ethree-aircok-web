'use client';

import DOMPurify from 'dompurify';

interface Props {
  content: string;
}

export function NewsContent({ content }: Props) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      className="font-body text-body-dark leading-relaxed [&_h2]:text-heading-dark [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-heading-dark [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:font-semibold [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4"
    />
  );
}
