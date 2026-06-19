'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRef } from 'react';
import { toast } from 'sonner';
import { uploadNewsImage } from '@/features/news-editor';

const NewsEditor = dynamic(
  () => import('@/features/news-editor').then((m) => m.NewsEditor),
  { ssr: false },
);

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const schema = z.object({
  title: z.string().min(1, '제목을 입력하세요'),
  description: z.string().min(1, '설명을 입력하세요'),
  content: z.string(),
  date: z.string(),
  location: z.string().optional(),
  published: z.boolean(),
  coverImage: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  initialData?: {
    id: string;
    title: string;
    description: string;
    content: string;
    date: string;
    location?: string | null;
    published: boolean;
    coverImage?: string | null;
  };
  onSuccess?: () => void;
}

export function AdminNewsForm({ initialData, onSuccess }: Props) {
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as import('react-hook-form').Resolver<FormValues>,
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      content: initialData?.content ?? '',
      date: initialData?.date
        ? initialData.date.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      location: initialData?.location ?? '',
      published: initialData?.published ?? false,
      coverImage: initialData?.coverImage ?? '',
    },
  });

  const coverImageValue = useWatch({ control, name: 'coverImage' });

  const handleCoverImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadNewsImage(file);
      setValue('coverImage', url);
    } catch {
      toast.error('커버 이미지 업로드에 실패했습니다.');
    } finally {
      if (coverImageInputRef.current) coverImageInputRef.current.value = '';
    }
  };

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('content', values.content);
    formData.append('date', values.date);
    if (values.location) formData.append('location', values.location);
    formData.append('published', String(values.published));
    if (values.coverImage) formData.append('coverImage', values.coverImage);

    const url = initialData
      ? `${API_BASE}/api/news/${initialData.id}`
      : `${API_BASE}/api/news`;
    const method = initialData ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      credentials: 'include',
      body: formData,
    });

    if (!res.ok) {
      toast.error(
        initialData
          ? '뉴스 수정에 실패했습니다. 다시 시도해 주세요.'
          : '뉴스 등록에 실패했습니다. 다시 시도해 주세요.',
      );
      return;
    }

    toast.success(
      initialData ? '뉴스가 수정되었습니다' : '뉴스가 등록되었습니다',
    );
    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 max-w-3xl"
    >
      {/* 제목 */}
      <div className="flex flex-col gap-1">
        <label className="text-body-dark text-sm font-body font-medium">
          제목 <span className="text-error">*</span>
        </label>
        <input
          {...register('title')}
          className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-1 focus:ring-aircok-blue"
          placeholder="뉴스 제목을 입력하세요"
        />
        {errors.title && (
          <p className="text-error text-xs">{errors.title.message}</p>
        )}
      </div>

      {/* 설명 */}
      <div className="flex flex-col gap-1">
        <label className="text-body-dark text-sm font-body font-medium">
          설명 <span className="text-error">*</span>
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-1 focus:ring-aircok-blue resize-none"
          placeholder="뉴스 요약 설명을 입력하세요"
        />
        {errors.description && (
          <p className="text-error text-xs">{errors.description.message}</p>
        )}
      </div>

      {/* 날짜 */}
      <div className="flex flex-col gap-1">
        <label className="text-body-dark text-sm font-body font-medium">
          날짜
        </label>
        <input
          type="date"
          {...register('date')}
          className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-1 focus:ring-aircok-blue w-48"
        />
      </div>

      {/* 장소 */}
      <div className="flex flex-col gap-1">
        <label className="text-body-dark text-sm font-body font-medium">
          장소
        </label>
        <input
          {...register('location')}
          className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-1 focus:ring-aircok-blue"
          placeholder="장소 (선택)"
        />
      </div>

      {/* 커버 이미지 */}
      <div className="flex flex-col gap-2">
        <label className="text-body-dark text-sm font-body font-medium">
          커버 이미지
        </label>
        {coverImageValue && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageValue}
            alt="커버 이미지 미리보기"
            className="w-48 h-28 object-cover rounded-md border border-border-light"
          />
        )}
        <button
          type="button"
          onClick={() => coverImageInputRef.current?.click()}
          className="px-4 py-2 rounded-md border border-border-light text-body-dark text-sm hover:bg-surface-light transition-colors w-fit"
        >
          이미지 선택
        </button>
        <input
          ref={coverImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverImageChange}
        />
        <input type="hidden" {...register('coverImage')} />
      </div>

      {/* 본문 에디터 */}
      <div className="flex flex-col gap-1">
        <label className="text-body-dark text-sm font-body font-medium">
          본문
        </label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <NewsEditor value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      {/* 발행 여부 */}
      <div className="flex items-center gap-2">
        <Controller
          name="published"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id="published"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="w-4 h-4 accent-aircok-blue"
            />
          )}
        />
        <label
          htmlFor="published"
          className="text-body-dark text-sm font-body cursor-pointer"
        >
          발행
        </label>
      </div>

      {/* 제출 버튼 */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-aircok-blue text-heading-light text-sm font-body rounded-md hover:bg-aircok-blue-dark transition-colors disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : initialData ? '수정 저장' : '작성 완료'}
        </button>
        <Link
          href="/console/news"
          className="bg-surface-light text-heading-dark rounded-md px-6 py-2 font-semibold text-sm font-body hover:bg-border-light transition-colors"
        >
          목록으로
        </Link>
      </div>
    </form>
  );
}
