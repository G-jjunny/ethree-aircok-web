import { getNewsPost } from '@/entities/news';
import { NewsDetailHeroSection } from './NewsDetailHeroSection';
import { NewsDetailContentSection } from './NewsDetailContentSection';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface Props {
  params: Promise<{ id: string }>;
}

export async function NewsDetailView({ params }: Props) {
  const { id } = await params;
  const post = await getNewsPost(id);

  return (
    <main className="min-h-screen bg-surface-white">
      <NewsDetailHeroSection post={post} API_BASE={API_BASE} />
      <NewsDetailContentSection content={post.content} />
    </main>
  );
}
