'use client'

import { useFieldArray } from 'react-hook-form'
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import type { AirDeviceFormValues } from '@/features/air-device-editor'

interface AirDeviceItemsFieldProps {
  control: Control<AirDeviceFormValues>
  register: UseFormRegister<AirDeviceFormValues>
  errors: FieldErrors<AirDeviceFormValues>
  disabled: boolean
}

const inputBaseClass =
  'w-full bg-surface rounded-btn px-4 py-2 min-h-11 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:border-transparent transition-shadow'
const inputNormalClass = `${inputBaseClass} border border-hairline focus:ring-brand`
const inputErrorClass = `${inputBaseClass} border border-error focus:ring-error`

const iconButtonClass =
  'inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-btn text-muted hover:text-ink hover:bg-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'

/**
 * 측정 항목(items) 반복 행 편집 필드.
 *
 * ⚠️ items는 백엔드에서 **replace-all**이므로 이 필드가 곧 저장될 전체 목록이다
 * (행을 모두 지우고 저장하면 항목이 전부 삭제된다).
 *
 * React key는 useFieldArray가 발급하는 `field.id`를 쓴다 — 서버의 `AirDeviceItem.id`는
 * 부모 PATCH마다 재발급되므로 영속 키로 신뢰할 수 없다.
 * 순서 변경은 배열 순서가 곧 서버 order이므로 `move`로 처리한다.
 */
export function AirDeviceItemsField({
  control,
  register,
  errors,
  disabled,
}: AirDeviceItemsFieldProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'items',
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ink">측정 항목</span>
          <span className="text-xs text-muted [word-break:keep-all]">
            위에서부터 표시되는 순서입니다. 저장 시 전체 목록이 교체됩니다.
          </span>
        </div>
        <button
          type="button"
          onClick={() => append({ code: '', label: '' })}
          disabled={disabled}
          className="shrink-0 inline-flex items-center justify-center rounded-btn border border-hairline bg-transparent px-4 py-2 min-h-11 text-xs font-medium text-ink hover:bg-surface active:scale-[0.97] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          항목 추가
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-btn border border-dashed border-hairline bg-surface px-4 py-4 text-center text-xs text-muted [word-break:keep-all]">
          등록된 측정 항목이 없습니다. 이대로 저장하면 이 측정기의 측정 항목은 비어
          있게 됩니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {fields.map((field, index) => {
            const itemErrors = errors.items?.[index]
            return (
              <li
                key={field.id}
                className="flex flex-col gap-2 rounded-btn border border-hairline bg-surface-white p-3 sm:flex-row sm:items-start"
              >
                <span className="shrink-0 pt-3 text-xs font-medium tabular-nums text-faint sm:w-4">
                  {index + 1}
                </span>

                <div className="flex-1 flex flex-col gap-1">
                  <input
                    {...register(`items.${index}.code` as const)}
                    type="text"
                    placeholder="코드 (예: PM2.5)"
                    disabled={disabled}
                    className={itemErrors?.code ? inputErrorClass : inputNormalClass}
                  />
                  {itemErrors?.code && (
                    <p className="text-xs text-error">{itemErrors.code.message}</p>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <input
                    {...register(`items.${index}.label` as const)}
                    type="text"
                    placeholder="항목명 (예: 초미세먼지)"
                    disabled={disabled}
                    className={itemErrors?.label ? inputErrorClass : inputNormalClass}
                  />
                  {itemErrors?.label && (
                    <p className="text-xs text-error">{itemErrors.label.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => move(index, index - 1)}
                    disabled={disabled || index === 0}
                    aria-label={`${index + 1}번 항목 위로 이동`}
                    className={iconButtonClass}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 12.5v-9M4 7.5l4-4 4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, index + 1)}
                    disabled={disabled || index === fields.length - 1}
                    aria-label={`${index + 1}번 항목 아래로 이동`}
                    className={iconButtonClass}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 3.5v9M4 8.5l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={disabled}
                    aria-label={`${index + 1}번 항목 삭제`}
                    className="inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-btn text-error hover:bg-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 4l8 8M12 4l-8 8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
