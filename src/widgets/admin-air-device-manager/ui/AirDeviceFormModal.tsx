'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { AirDevice } from '@/entities/air-device'
import {
  airDeviceSchema,
  useCreateAirDeviceMutation,
  useUpdateAirDeviceMutation,
  useUploadAirDeviceImageMutation,
} from '@/features/air-device-editor'
import type { AirDeviceFormValues } from '@/features/air-device-editor'
import { extractUploadError } from '@/shared/api'
import { IMAGE_FILE_ACCEPT, validateImageFile } from '@/shared/lib'
import { Button } from '@/shared/ui'
import {
  AIR_DEVICE_IDENTITY_FIELDS,
  AIR_DEVICE_SPEC_FIELDS,
} from '../model/airDeviceFields'
import { AirDeviceImageField } from './AirDeviceImageField'
import { AirDeviceItemsField } from './AirDeviceItemsField'

type AirDeviceFormModalProps =
  | {
      mode: 'create'
      device?: undefined
      imageWarning?: undefined
      onClose: () => void
      /**
       * 레코드 생성은 성공했지만 사진 업로드만 실패한 **부분 실패** 콜백.
       * 호출부가 수정 화면으로 전환해 재시도를 유도한다.
       */
      onPartialSuccess: (device: AirDevice, message: string) => void
    }
  | {
      mode: 'edit'
      device: AirDevice
      /** 부분 실패 후 전환된 경우 상단에 남기는 경고. */
      imageWarning: string | null
      onClose: () => void
      onPartialSuccess?: undefined
    }

const inputBaseClass =
  'w-full bg-surface rounded-btn px-4 py-3 min-h-11 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:border-transparent transition-shadow'
const inputNormalClass = `${inputBaseClass} border border-hairline focus:ring-brand`
const inputErrorClass = `${inputBaseClass} border border-error focus:ring-error`

/** 서버 응답을 폼 값으로 정규화한다. 신규 등록이면 빈 값(공개=true)으로 시작한다. */
function toFormValues(device?: AirDevice): AirDeviceFormValues {
  if (!device) {
    return {
      name: '',
      subtitle: '',
      badge: '',
      size: '',
      weight: '',
      power: '',
      comm: '',
      storage: '',
      operatingTemp: '',
      published: true,
      items: [],
    }
  }
  return {
    name: device.name,
    subtitle: device.subtitle,
    badge: device.badge,
    size: device.size,
    weight: device.weight,
    power: device.power,
    comm: device.comm,
    storage: device.storage,
    operatingTemp: device.operatingTemp,
    published: device.published,
    // {code,label}만 추린다 — id/deviceId/order를 body에 실으면 400이다.
    items: device.items.map(({ code, label }) => ({ code, label })),
  }
}

/**
 * 측정기 생성/수정 모달.
 *
 * **생성은 2단계다**: ① 레코드 생성(JSON, imageUrl 없음) → ② 사진 업로드(multipart).
 * imageUrl은 JSON body에 넣을 수 없으므로(forbidNonWhitelisted → 400) 사진은
 * 생성 응답의 id를 받아 이어서 올린다. ①은 성공하고 ②만 실패하면 레코드가 남으므로,
 * 조용히 삼키지 않고 `onPartialSuccess`로 수정 화면 전환을 요청해 재시도를 유도한다.
 *
 * 수정 모드에서는 사진이 폼과 분리되어 파일 선택 즉시 업로드된다(AirDeviceImageField).
 *
 * 호출부가 `key`로 마운트를 제어하므로 defaultValues는 마운트 시점에 확정된다.
 * (사진 업로드로 목록이 갱신돼도 편집 중인 입력이 리셋되지 않는다.)
 */
export function AirDeviceFormModal(props: AirDeviceFormModalProps) {
  const { mode, device, onClose } = props
  const fileInputRef = useRef<HTMLInputElement>(null)
  /** 생성 모드에서 "레코드 생성 후" 올릴 파일. 폼 값이 아니라 별도 상태다(multipart 전용). */
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AirDeviceFormValues>({
    resolver: zodResolver(airDeviceSchema),
    defaultValues: toFormValues(device),
  })

  const createMutation = useCreateAirDeviceMutation()
  const updateMutation = useUpdateAirDeviceMutation()
  const uploadMutation = useUploadAirDeviceImageMutation()

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || uploadMutation.isPending

  const handlePendingFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const validationError = validateImageFile(file)
    if (validationError) {
      toast.error(validationError)
      return
    }
    setPendingFile(file)
  }

  const handleCreate = async (values: AirDeviceFormValues) => {
    // ── 1단계: 레코드 생성(JSON). imageUrl은 절대 넣지 않는다.
    let created: AirDevice
    try {
      created = await createMutation.mutateAsync(values)
    } catch (error) {
      toast.error(extractUploadError(error, '측정기 등록에 실패했습니다'))
      return
    }

    if (!pendingFile) {
      toast.success('측정기가 등록되었습니다')
      onClose()
      return
    }

    // ── 2단계: 사진 업로드(multipart). 생성된 id로 이어서 올린다.
    try {
      await uploadMutation.mutateAsync({ id: created.id, file: pendingFile })
      toast.success('측정기가 등록되었습니다')
      onClose()
    } catch (error) {
      // 부분 실패: 레코드는 이미 생성됐다(롤백하지 않는다).
      // 사용자에게 상태를 정확히 알리고 수정 화면에서 재시도하도록 유도한다.
      const message = extractUploadError(error, '사진 업로드에 실패했습니다')
      toast.error(`측정기는 등록됐지만 사진 업로드에 실패했습니다. ${message}`)
      props.onPartialSuccess?.(created, message)
    }
  }

  const handleUpdate = async (values: AirDeviceFormValues) => {
    if (!device) return
    try {
      // items는 replace-all이므로 항상 전체 목록을 보낸다(부분 전송 시 나머지가 유실된다).
      await updateMutation.mutateAsync({ id: device.id, body: values })
      toast.success('측정기가 수정되었습니다')
      onClose()
    } catch (error) {
      toast.error(extractUploadError(error, '측정기 수정에 실패했습니다'))
    }
  }

  const onSubmit = (values: AirDeviceFormValues) =>
    mode === 'create' ? handleCreate(values) : handleUpdate(values)

  return (
    <div
      className="fixed inset-0 z-50 bg-overlay-dark flex items-center justify-center px-5 py-5"
      onClick={() => {
        if (!isSubmitting) onClose()
      }}
    >
      {/* token 없음: max-h-[90vh] — 뷰포트 상대값(긴 폼 스크롤 확보), 토큰 스케일 대상 아님 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'create' ? '측정기 등록' : '측정기 수정'}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-white rounded-card shadow-card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5"
      >
        <h2 className="text-xl font-bold text-ink [word-break:keep-all]">
          {mode === 'create' ? '측정기 등록' : '측정기 수정'}
        </h2>

        {mode === 'edit' && props.imageWarning && (
          <p className="rounded-btn border border-error/30 bg-surface px-4 py-3 text-xs text-error [word-break:keep-all]">
            측정기는 등록됐지만 제품 사진 업로드에 실패했습니다({props.imageWarning}).
            아래 &ldquo;사진 업로드&rdquo;에서 다시 시도해 주세요.
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* 모델 식별 정보 */}
          <div className="flex flex-col gap-4">
            {AIR_DEVICE_IDENTITY_FIELDS.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label
                  htmlFor={`air-device-${field.name}`}
                  className="text-sm font-medium text-ink"
                >
                  {field.label}
                </label>
                <input
                  {...register(field.name)}
                  id={`air-device-${field.name}`}
                  type="text"
                  placeholder={field.placeholder}
                  disabled={isSubmitting}
                  className={errors[field.name] ? inputErrorClass : inputNormalClass}
                />
                {errors[field.name] && (
                  <p className="text-xs text-error">{errors[field.name]?.message}</p>
                )}
              </div>
            ))}
          </div>

          {/* 제품 사양 */}
          <div className="flex flex-col gap-3 border-t border-hairline pt-5">
            <span className="text-sm font-medium text-ink">제품 사양</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AIR_DEVICE_SPEC_FIELDS.map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={`air-device-${field.name}`}
                    className="text-xs font-medium text-muted"
                  >
                    {field.label}
                  </label>
                  <input
                    {...register(field.name)}
                    id={`air-device-${field.name}`}
                    type="text"
                    placeholder={field.placeholder}
                    disabled={isSubmitting}
                    className={errors[field.name] ? inputErrorClass : inputNormalClass}
                  />
                  {errors[field.name] && (
                    <p className="text-xs text-error">{errors[field.name]?.message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 측정 항목 */}
          <div className="border-t border-hairline pt-5">
            <AirDeviceItemsField
              control={control}
              register={register}
              errors={errors}
              disabled={isSubmitting}
            />
          </div>

          {/* 제품 사진 — 생성은 저장 후 업로드(2단계), 수정은 즉시 업로드 */}
          <div className="flex flex-col gap-3 border-t border-hairline pt-5">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-ink">제품 사진</span>
              <span className="text-xs text-muted [word-break:keep-all]">
                {mode === 'create'
                  ? '지금 선택해 두면 측정기가 등록된 직후 이어서 업로드됩니다. 나중에 수정 화면에서 올려도 됩니다.'
                  : '파일을 선택하면 저장을 기다리지 않고 바로 업로드됩니다.'}
              </span>
            </div>

            {mode === 'edit' && device ? (
              // token 없음: max-w-xs — 모달 내 사진 미리보기 폭 제한(1회성 레이아웃 수치)
              <AirDeviceImageField device={device} className="max-w-xs" />
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-btn border border-hairline bg-transparent px-4 py-2 min-h-11 text-xs font-medium text-ink hover:bg-surface active:scale-[0.97] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  >
                    {pendingFile ? '다른 사진 선택' : '사진 선택 (선택 사항)'}
                  </button>
                  {pendingFile && (
                    <button
                      type="button"
                      onClick={() => setPendingFile(null)}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center rounded-btn px-4 py-2 min-h-11 text-xs font-medium text-muted hover:text-ink hover:bg-surface transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                    >
                      선택 해제
                    </button>
                  )}
                </div>
                {pendingFile && (
                  <p className="text-xs text-muted [word-break:keep-all]">
                    선택됨: {pendingFile.name}
                  </p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={IMAGE_FILE_ACCEPT}
                  onChange={handlePendingFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* 공개 여부 */}
          <div className="flex items-center gap-2 border-t border-hairline pt-5">
            <input
              {...register('published')}
              id="air-device-published"
              type="checkbox"
              disabled={isSubmitting}
              className="w-4 h-4 accent-brand cursor-pointer"
            />
            <label
              htmlFor="air-device-published"
              className="text-sm text-ink cursor-pointer"
            >
              공개 (체크 해제 시 사이트에 노출되지 않습니다)
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-hairline pt-5">
            <button
              type="button"
              onClick={() => {
                if (!isSubmitting) onClose()
              }}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-btn bg-surface px-5 py-2.5 min-h-11 text-sm font-medium text-ink hover:bg-hairline active:scale-[0.97] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              취소
            </button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '저장'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
