import { getNewsPost } from '@/entities/news';
import { NewsDetailHeroSection } from './NewsDetailHeroSection';
import { NewsDetailContentSection } from './NewsDetailContentSection';

interface Props {
  params: Promise<{ id: string }>;
}

export async function NewsDetailView({ params }: Props) {
  const { id } = await params;
  const post = await getNewsPost(id);

  return (
    <main className="min-h-screen bg-surface-white">
      <NewsDetailHeroSection post={post} />
      {post.content && (
        <NewsDetailContentSection content={post.content} />
      )}
    </main>
  );
}
