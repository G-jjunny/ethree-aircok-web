'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  updateMailSetting,
  mailSettingKeys,
  MailSettingApiError,
  type MailSetting,
} from '@/entities/mail-setting';
import {
  mailSettingSchema,
  type MailSettingFormValues,
} from '../model/mailSettingSchema';

/** subject/body 양쪽에서 사용 가능한 치환 변수 안내 */
const TEMPLATE_VARIABLES = [
  { token: '{{company}}', label: '회사명' },
  { token: '{{name}}', label: '담당자명' },
  { token: '{{phone}}', label: '전화번호' },
  { token: '{{email}}', label: '이메일' },
  { token: '{{message}}', label: '요청사항' },
] as const;

interface Props {
  initialData: MailSetting;
}

export function MailSettingForm({ initialData }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MailSettingFormValues>({
    resolver: zodResolver(mailSettingSchema),
    defaultValues: {
      recipientEmail: initialData.recipientEmail,
      subjectTemplate: initialData.subjectTemplate,
      bodyTemplate: initialData.bodyTemplate,
    },
  });

  const onSubmit = async (values: MailSettingFormValues) => {
    try {
      const updated = await updateMailSetting({
        recipientEmail: values.recipientEmail,
        subjectTemplate: values.subjectTemplate,
        bodyTemplate: values.bodyTemplate,
      });
      queryClient.setQueryData(mailSettingKeys.all, updated);
      reset({
        recipientEmail: updated.recipientEmail,
        subjectTemplate: updated.subjectTemplate,
        bodyTemplate: updated.bodyTemplate,
      });
      toast.success('이메일 설정이 저장되었습니다');
    } catch (error) {
      const message =
        error instanceof MailSettingApiError
          ? (error.messages?.[0] ?? error.message)
          : '이메일 설정 저장에 실패했습니다. 다시 시도해 주세요.';
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 max-w-3xl"
    >
      {/* 치환 변수 안내 */}
      <div className="flex flex-col gap-2 rounded-md border border-border-light bg-surface-light px-4 py-3">
        <p className="text-body-dark text-sm font-body font-medium">
          사용 가능한 치환 변수
        </p>
        <p className="text-secondary-dark text-xs font-body [word-break:keep-all]">
          제목·본문 템플릿에 아래 변수를 입력하면 문의 접수 시 실제 값으로
          치환됩니다.
        </p>
        <ul className="flex flex-wrap gap-2">
          {TEMPLATE_VARIABLES.map((v) => (
            <li
              key={v.token}
              className="text-secondary-dark text-xs font-body rounded-md border border-border-light bg-surface-white px-2 py-1"
            >
              <code className="text-body-dark">{v.token}</code>
              <span className="ml-1">{v.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 수신 이메일 */}
      <div className="flex flex-col gap-1">
        <label className="text-body-dark text-sm font-body font-medium">
          수신 이메일 <span className="text-error">*</span>
        </label>
        <input
          type="email"
          {...register('recipientEmail')}
          className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-1 focus:ring-aircok-blue"
          placeholder="알림을 받을 이메일 주소"
        />
        {errors.recipientEmail && (
          <p className="text-error text-xs">{errors.recipientEmail.message}</p>
        )}
      </div>

      {/* 제목 템플릿 */}
      <div className="flex flex-col gap-1">
        <label className="text-body-dark text-sm font-body font-medium">
          제목 템플릿 <span className="text-error">*</span>
        </label>
        <input
          type="text"
          {...register('subjectTemplate')}
          className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-1 focus:ring-aircok-blue"
          placeholder="[문의 접수] {{company}} {{name}}님"
        />
        {errors.subjectTemplate && (
          <p className="text-error text-xs">{errors.subjectTemplate.message}</p>
        )}
      </div>

      {/* 본문 템플릿 */}
      <div className="flex flex-col gap-1">
        <label className="text-body-dark text-sm font-body font-medium">
          본문 템플릿 <span className="text-error">*</span>
        </label>
        <textarea
          {...register('bodyTemplate')}
          rows={8}
          className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-1 focus:ring-aircok-blue resize-none"
          placeholder={
            '회사: {{company}}\n담당자: {{name}}\n전화: {{phone}}\n이메일: {{email}}\n\n{{message}}'
          }
        />
        {errors.bodyTemplate && (
          <p className="text-error text-xs">{errors.bodyTemplate.message}</p>
        )}
      </div>

      {/* 제출 버튼 */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-aircok-blue text-heading-light text-sm font-body rounded-md hover:bg-aircok-blue-dark transition-colors disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : '설정 저장'}
        </button>
      </div>
    </form>
  );
}
