import { getNewsPost } from '@/entities/news';
import { AdminNewsFormWrapper } from './AdminNewsFormWrapper';

interface Props {
  id?: string;
}

export async function AdminNewsFormView({ id }: Props) {
  const initialData = id ? await getNewsPost(id) : undefined;
  const isEdit = Boolean(id);

  return (
    <div>
      {/* 페이지 헤더 — §15.2 */}
      <div className="bg-surface-white border-b border-border-light px-6 lg:px-8 py-5">
        <h1 className="text-[22px] font-display font-semibold text-heading-dark">
          {isEdit ? '뉴스 수정' : '새 뉴스 작성'}
        </h1>
        <p className="mt-1 text-[15px] text-secondary-dark">
          새 뉴스를 작성하거나 기존 뉴스를 수정합니다
        </p>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-6 lg:p-8">
        <AdminNewsFormWrapper initialData={initialData} />
      </div>
    </div>
  );
}
