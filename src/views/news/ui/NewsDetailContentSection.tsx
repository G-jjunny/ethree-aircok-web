import { NewsContent } from './NewsContent';

interface Props {
  content: string;
}

export function NewsDetailContentSection({ content }: Props) {
  return (
    <section className="content-container py-16">
      <div className="max-w-3xl mx-auto">
        <hr className="border-t border-border-light mb-10" />
        <NewsContent content={content} />
      </div>
    </section>
  );
}
