'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { adminLogin, useAdminAuthStore } from '@/entities/admin-auth';
import { SITE } from '@/shared/config/site';
import axios from 'axios';

const schema = z.object({
  username: z.string().min(1, '아이디를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type FormValues = z.infer<typeof schema>;

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
      if (axios.isAxiosError(err)) {
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
        <label htmlFor="username" className="text-[14px] font-medium text-heading-dark">
          아이디
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          placeholder="아이디를 입력하세요"
          {...register('username')}
          className={`w-full bg-surface-light rounded-md px-4 py-3 text-[15px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:border-transparent transition-shadow min-h-[44px] border ${
            errors.username
              ? 'border-error focus:ring-error'
              : 'border-border-light focus:ring-aircok-blue'
          }`}
        />
        {errors.username && (
          <p role="alert" className="text-[13px] text-error leading-[1.33] mt-1">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* password 입력 그룹 */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-[14px] font-medium text-heading-dark">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력하세요"
          {...register('password')}
          className={`w-full bg-surface-light rounded-md px-4 py-3 text-[15px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:border-transparent transition-shadow min-h-[44px] border ${
            errors.password
              ? 'border-error focus:ring-error'
              : 'border-border-light focus:ring-aircok-blue'
          }`}
        />
        {errors.password && (
          <p role="alert" className="text-[13px] text-error leading-[1.33] mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* 폼 레벨 에러 */}
      {hasRootError && (
        <p role="alert" className="text-[13px] text-error leading-[1.33] -mt-1">
          {errors.root?.message}
        </p>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isPending}
        className={`w-full bg-aircok-blue text-heading-light text-[17px] font-medium rounded-md py-3 min-h-[44px] transition-colors focus:outline-none ${
          isPending
            ? 'opacity-60 cursor-not-allowed'
            : 'hover:bg-aircok-blue-dark active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2'
        }`}
      >
        {isPending ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}
