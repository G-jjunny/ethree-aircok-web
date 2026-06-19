import Link from 'next/link';
import { getAdminNewsList } from '@/entities/news';
import { DeleteButton } from './DeleteButton';

function formatDate(dateStr: string): string {
  return dateStr.slice(0, 10).replace(/-/g, '.');
}

export async function AdminNewsListView() {
  let newsData;
  try {
    newsData = await getAdminNewsList(1, 100);
  } catch {
    newsData = { data: [], total: 0, page: 1, limit: 100 };
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading-dark font-display font-semibold text-2xl">
          뉴스 관리
        </h1>
        <Link
          href="/console/news/new"
          className="px-4 py-2 bg-aircok-blue text-heading-light text-sm font-body rounded-md hover:bg-aircok-blue-dark transition-colors"
        >
          새 뉴스 작성
        </Link>
      </div>

      {newsData.data.length === 0 ? (
        <p className="text-body-dark font-body">등록된 뉴스가 없습니다.</p>
      ) : (
        <div className="border border-border-light rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-light">
              <tr>
                <th className="text-left px-4 py-3 text-body-dark font-body font-medium">
                  제목
                </th>
                <th className="text-left px-4 py-3 text-body-dark font-body font-medium w-28">
                  날짜
                </th>
                <th className="text-left px-4 py-3 text-body-dark font-body font-medium w-20">
                  발행
                </th>
                <th className="text-left px-4 py-3 text-body-dark font-body font-medium w-24">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {newsData.data.map((item) => (
                <tr key={item.id} className="hover:bg-surface-light transition-colors">
                  <td className="px-4 py-3 text-body-dark font-body">
                    {item.title}
                  </td>
                  <td className="px-4 py-3 text-secondary-dark font-body">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-4 py-3 font-body">
                    {item.published ? (
                      <span className="text-success">발행됨</span>
                    ) : (
                      <span className="text-secondary-dark">미발행</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/console/news/${item.id}/edit`}
                        className="text-link-on-light text-sm hover:opacity-70 transition-opacity"
                      >
                        수정
                      </Link>
                      <DeleteButton id={item.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
