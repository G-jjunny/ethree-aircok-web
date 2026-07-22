'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { adminLogin, useAdminAuthStore } from '@/entities/admin-auth';
import { SITE } from '@/shared/config/site';
import { Button } from '@/shared/ui';
import { isAxiosError } from 'axios';

const schema = z.object({
  username: z.string().min(1, '아이디를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type FormValues = z.infer<typeof schema>;

// 입력 공통 스타일 — 정상/에러 상태만 분기(border + focus ring)
const INPUT_BASE =
  'w-full min-h-11 rounded-btn border bg-surface px-4 py-3 text-sm text-ink placeholder:text-faint transition-shadow focus:outline-none focus:ring-2 focus:border-transparent';
const INPUT_NORMAL = 'border-hairline focus:ring-brand';
const INPUT_ERROR = 'border-error focus:ring-error';

export function AdminLoginForm() {
  const router = useRouter();
  const setUser = useAdminAuthStore((s) => s.setUser);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: adminLogin,
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await mutateAsync(data);
      setUser(result.user);
      router.push(SITE.admin.basePath);
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 429) {
          setError('root', { message: '잠시 후 다시 시도해주세요' });
        } else {
          setError('root', { message: '아이디 또는 비밀번호가 올바르지 않습니다' });
        }
      } else {
        setError('root', { message: '아이디 또는 비밀번호가 올바르지 않습니다' });
      }
    }
  };

  const hasRootError = !!errors.root;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* username 입력 그룹 */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-medium text-ink">
          아이디
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          placeholder="아이디를 입력하세요"
          {...register('username')}
          className={`${INPUT_BASE} ${errors.username ? INPUT_ERROR : INPUT_NORMAL}`}
        />
        {errors.username && (
          <p role="alert" className="mt-1 text-xs leading-snug text-error">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* password 입력 그룹 */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-ink">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력하세요"
          {...register('password')}
          className={`${INPUT_BASE} ${errors.password ? INPUT_ERROR : INPUT_NORMAL}`}
        />
        {errors.password && (
          <p role="alert" className="mt-1 text-xs leading-snug text-error">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* 폼 레벨 에러 */}
      {hasRootError && (
        <p role="alert" className="-mt-1 text-xs leading-snug text-error">
          {errors.root?.message}
        </p>
      )}

      {/* 제출 버튼 — 공용 primary CTA(그라디언트) 재사용 */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={isPending}
        className="mt-1 w-full"
      >
        {isPending ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  );
}
