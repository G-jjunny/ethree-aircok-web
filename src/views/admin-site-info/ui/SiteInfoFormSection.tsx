'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { siteInfoQueryOptions } from '@/entities/site-info'
import { useUpdateSiteInfoMutation } from '@/features/site-info-editor'
import type { SiteInfoUpdateBody } from '@/entities/site-info'

const schema = z.object({
  companyName: z.string().min(1, '회사명을 입력하세요'),
  legalName: z.string().optional(),
  address: z.string().min(1, '주소를 입력하세요'),
  phone: z.string().min(1, '전화번호를 입력하세요'),
  fax: z.string().optional(),
  email: z.string().email('올바른 이메일을 입력하세요'),
  bizNo: z.string().min(1, '사업자등록번호를 입력하세요'),
  ceo: z.string().min(1, '대표자명을 입력하세요'),
  mailOrderNo: z.string().optional(),
  instagram: z.string().url('올바른 URL을 입력하세요').optional().or(z.literal('')),
  youtube: z.string().url('올바른 URL을 입력하세요').optional().or(z.literal('')),
  linkedin: z.string().url('올바른 URL을 입력하세요').optional().or(z.literal('')),
  facebook: z.string().url('올바른 URL을 입력하세요').optional().or(z.literal('')),
  kakaoUrl: z.string().url('올바른 URL을 입력하세요').optional().or(z.literal('')),
})
type FormValues = z.infer<typeof schema>

function toOptional(value: string | undefined): string | undefined {
  return value === '' ? undefined : value
}

export function SiteInfoFormSection() {
  const { data: siteInfo } = useQuery(siteInfoQueryOptions())
  const mutation = useUpdateSiteInfoMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: '',
      legalName: '',
      address: '',
      phone: '',
      fax: '',
      email: '',
      bizNo: '',
      ceo: '',
      mailOrderNo: '',
      instagram: '',
      youtube: '',
      linkedin: '',
      facebook: '',
      kakaoUrl: '',
    },
  })

  useEffect(() => {
    if (!siteInfo) return
    reset({
      companyName: siteInfo.companyName,
      legalName: siteInfo.legalName ?? '',
      address: siteInfo.address,
      phone: siteInfo.phone,
      fax: siteInfo.fax ?? '',
      email: siteInfo.email,
      bizNo: siteInfo.bizNo,
      ceo: siteInfo.ceo,
      mailOrderNo: siteInfo.mailOrderNo ?? '',
      instagram: siteInfo.instagram ?? '',
      youtube: siteInfo.youtube ?? '',
      linkedin: siteInfo.linkedin ?? '',
      facebook: siteInfo.facebook ?? '',
      kakaoUrl: siteInfo.kakaoUrl ?? '',
    })
  }, [siteInfo, reset])

  const onSubmit = (values: FormValues) => {
    const body: SiteInfoUpdateBody = {
      companyName: values.companyName,
      address: values.address,
      phone: values.phone,
      email: values.email,
      bizNo: values.bizNo,
      ceo: values.ceo,
      legalName: toOptional(values.legalName),
      fax: toOptional(values.fax),
      mailOrderNo: toOptional(values.mailOrderNo),
      instagram: toOptional(values.instagram),
      youtube: toOptional(values.youtube),
      linkedin: toOptional(values.linkedin),
      facebook: toOptional(values.facebook),
      kakaoUrl: toOptional(values.kakaoUrl),
    }
    mutation.mutate(body, {
      onSuccess: () => toast.success('사이트 정보가 저장되었습니다.'),
      onError: () => toast.error('저장에 실패했습니다. 다시 시도해 주세요.'),
    })
  }

  const fields: Array<{
    name: keyof FormValues
    label: string
    type?: string
    required?: boolean
  }> = [
    { name: 'companyName', label: '회사명', required: true },
    { name: 'legalName', label: '법인명 (선택)' },
    { name: 'ceo', label: '대표자', required: true },
    { name: 'bizNo', label: '사업자등록번호', required: true },
    { name: 'mailOrderNo', label: '통신판매업신고번호 (선택)' },
    { name: 'address', label: '주소', required: true },
    { name: 'phone', label: '전화', required: true },
    { name: 'fax', label: '팩스 (선택)' },
    { name: 'email', label: '이메일', type: 'email', required: true },
    { name: 'instagram', label: 'Instagram URL (선택)', type: 'url' },
    { name: 'youtube', label: 'YouTube URL (선택)', type: 'url' },
    { name: 'linkedin', label: 'LinkedIn URL (선택)', type: 'url' },
    { name: 'facebook', label: 'Facebook URL (선택)', type: 'url' },
    { name: 'kakaoUrl', label: 'KakaoTalk URL (선택)', type: 'url' },
  ]

  return (
    <section className="bg-surface-white rounded-xl border border-border-light p-6">
      <h2 className="text-nav font-display font-semibold text-heading-dark mb-6">기본 정보</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ name, label, type }) => (
            <div key={name} className="flex flex-col gap-1">
              <label htmlFor={name} className="text-sm font-medium text-heading-dark">
                {label}
              </label>
              <input
                id={name}
                type={type ?? 'text'}
                {...register(name)}
                className={
                  errors[name]
                    ? 'w-full bg-surface-light border border-error rounded-md px-4 py-3 text-nav text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent transition-shadow min-h-[44px]'
                    : 'w-full bg-surface-light border border-border-light rounded-md px-4 py-3 text-nav text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue focus:border-transparent transition-shadow min-h-[44px]'
                }
                placeholder={label}
              />
              {errors[name] && (
                <p className="text-xs text-error leading-[1.33] mt-1">{errors[name]?.message}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-aircok-blue text-heading-light rounded-md px-6 py-2.5 min-h-[44px] text-nav font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors"
          >
            {mutation.isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </section>
  )
}
