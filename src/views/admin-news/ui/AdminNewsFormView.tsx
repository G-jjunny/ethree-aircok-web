import { getNewsPost } from '@/entities/news/server';
import { AdminPageHeader } from '@/shared/ui';
import { AdminNewsFormWrapper } from './AdminNewsFormWrapper';

interface Props {
  id?: string;
}

export async function AdminNewsFormView({ id }: Props) {
  const initialData = id ? await getNewsPost(id) : undefined;
  const isEdit = Boolean(id);

  return (
    <div>
      <AdminPageHeader
        title={isEdit ? '뉴스 수정' : '새 뉴스 작성'}
        description="새 뉴스를 작성하거나 기존 뉴스를 수정합니다"
      />

      {/* 콘텐츠 영역 */}
      <div className="p-6 lg:p-8">
        <AdminNewsFormWrapper initialData={initialData} />
      </div>
    </div>
  );
}
