'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRef } from 'react';
import { toast } from 'sonner';
import { uploadNewsImage, useCreateNewsMutation, useUpdateNewsMutation } from '@/features/news-editor';

const NewsEditor = dynamic(
  () => import('@/features/news-editor').then((m) => m.NewsEditor),
  { ssr: false },
);

const schema = z.object({
  type: z.enum(['BLOG', 'LINK']).default('BLOG'),
  title: z.string().min(1, '제목을 입력하세요'),
  description: z.string().min(1, '설명을 입력하세요'),
  content: z.string().optional(),
  externalUrl: z.string().optional(),
  date: z.string(),
  location: z.string().optional(),
  published: z.boolean(),
  coverImage: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'LINK') {
    if (!data.externalUrl || data.externalUrl.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '링크형은 외부 URL이 필수입니다',
        path: ['externalUrl'],
      });
    } else {
      try {
        new URL(data.externalUrl);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '올바른 URL 형식을 입력하세요',
          path: ['externalUrl'],
        });
      }
    }
  }
});

type FormValues = z.infer<typeof schema>;

interface Props {
  initialData?: {
    id: string;
    title: string;
    description: string;
    content?: string | null;
    date: string;
    location?: string | null;
    published: boolean;
    coverImage?: string | null;
    type?: 'BLOG' | 'LINK';
    externalUrl?: string | null;
  };
  onSuccess?: () => void;
}

export function AdminNewsForm({ initialData, onSuccess }: Props) {
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const createMutation = useCreateNewsMutation();
  const updateMutation = useUpdateNewsMutation();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as import('react-hook-form').Resolver<FormValues>,
    defaultValues: {
      type: initialData?.type ?? 'BLOG',
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      content: initialData?.content ?? '',
      externalUrl: initialData?.externalUrl ?? '',
      date: initialData?.date
        ? initialData.date.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      location: initialData?.location ?? '',
      published: initialData?.published ?? false,
      coverImage: initialData?.coverImage ?? '',
    },
  });

  const newsType = useWatch({ control, name: 'type' });
  const coverImageValue = useWatch({ control, name: 'coverImage' });
  const coverImageSrc = coverImageValue ?? '';

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
    const basePayload = {
      title: values.title,
      description: values.description,
      date: values.date,
      published: values.published,
      type: values.type,
      ...(values.location ? { location: values.location } : {}),
      ...(values.coverImage ? { coverImage: values.coverImage } : {}),
    };

    const payload =
      values.type === 'LINK'
        ? { ...basePayload, externalUrl: values.externalUrl ?? null, content: null }
        : { ...basePayload, content: values.content ?? '', externalUrl: null };

    try {
      if (initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      toast.success(
        initialData ? '뉴스가 수정되었습니다' : '뉴스가 등록되었습니다',
      );
      onSuccess?.();
    } catch {
      toast.error(
        initialData
          ? '뉴스 수정에 실패했습니다. 다시 시도해 주세요.'
          : '뉴스 등록에 실패했습니다. 다시 시도해 주세요.',
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 max-w-3xl"
    >
      {/* 뉴스 타입 선택 */}
      <div className="flex flex-col gap-2">
        <label className="text-heading-dark text-[14px] font-medium">
          뉴스 타입 <span className="text-error">*</span>
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="BLOG"
              {...register('type')}
              className="accent-aircok-blue"
            />
            <span className="text-body-dark text-sm font-body">블로그형 (직접 작성)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="LINK"
              {...register('type')}
              className="accent-aircok-blue"
            />
            <span className="text-body-dark text-sm font-body">링크형 (외부 기사)</span>
          </label>
        </div>
      </div>

      {/* 제목 */}
      <div className="flex flex-col gap-1">
        <label className="text-heading-dark text-[14px] font-medium">
          제목 <span className="text-error">*</span>
        </label>
        <input
          {...register('title')}
          className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-2 focus:ring-aircok-blue"
          placeholder="뉴스 제목을 입력하세요"
        />
        {errors.title && (
          <p role="alert" className="text-[13px] text-error leading-[1.33] mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* 설명 */}
      <div className="flex flex-col gap-1">
        <label className="text-heading-dark text-[14px] font-medium">
          설명 <span className="text-error">*</span>
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-2 focus:ring-aircok-blue resize-none"
          placeholder="뉴스 요약 설명을 입력하세요"
        />
        {errors.description && (
          <p role="alert" className="text-[13px] text-error leading-[1.33] mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* 날짜 */}
      <div className="flex flex-col gap-1">
        <label className="text-heading-dark text-[14px] font-medium">
          날짜
        </label>
        <input
          type="date"
          {...register('date')}
          className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-2 focus:ring-aircok-blue w-48"
        />
      </div>

      {/* 장소 */}
      <div className="flex flex-col gap-1">
        <label className="text-heading-dark text-[14px] font-medium">
          장소
        </label>
        <input
          {...register('location')}
          className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-2 focus:ring-aircok-blue"
          placeholder="장소 (선택)"
        />
      </div>

      {/* 커버 이미지 */}
      <div className="flex flex-col gap-2">
        <label className="text-heading-dark text-[14px] font-medium">
          커버 이미지
        </label>
        {coverImageValue && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageSrc}
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

      {/* 본문 에디터 (BLOG 타입만) */}
      {newsType === 'BLOG' && (
        <div className="flex flex-col gap-1">
          <label className="text-heading-dark text-[14px] font-medium">
            본문
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <NewsEditor value={field.value ?? ''} onChange={field.onChange} />
            )}
          />
        </div>
      )}

      {/* 외부 URL (LINK 타입만) */}
      {newsType === 'LINK' && (
        <div className="flex flex-col gap-1">
          <label className="text-heading-dark text-[14px] font-medium">
            외부 뉴스 링크 URL <span className="text-error">*</span>
          </label>
          <input
            {...register('externalUrl')}
            className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-2 focus:ring-aircok-blue"
            placeholder="https://example.com/news/..."
          />
          {errors.externalUrl && (
            <p role="alert" className="text-[13px] text-error leading-[1.33] mt-1">{errors.externalUrl.message}</p>
          )}
        </div>
      )}

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
          className="text-heading-dark text-[14px] font-medium cursor-pointer"
        >
          발행
        </label>
      </div>

      {/* 제출 버튼 */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
          className="px-6 py-2 bg-aircok-blue text-heading-light text-sm font-body rounded-md hover:bg-aircok-blue-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {createMutation.isPending || updateMutation.isPending ? '저장 중...' : initialData ? '수정 저장' : '작성 완료'}
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
