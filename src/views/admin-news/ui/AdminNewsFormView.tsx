import { getNewsPost } from '@/entities/news';
import { AdminNewsFormWrapper } from './AdminNewsFormWrapper';

interface Props {
  id?: string;
}

export async function AdminNewsFormView({ id }: Props) {
  const initialData = id ? await getNewsPost(id) : undefined;
  const isEdit = Boolean(id);

  return (
    <div className="p-8">
      <h1 className="text-heading-dark font-display font-semibold text-2xl mb-6">
        {isEdit ? '뉴스 수정' : '새 뉴스 작성'}
      </h1>
      <AdminNewsFormWrapper initialData={initialData} />
    </div>
  );
}
