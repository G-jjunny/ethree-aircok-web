'use client'

import { useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { useUploadTeamImageMutation } from '@/features/team-image-editor'

/** 팀 이미지 최대 등록 개수(백엔드 정책과 일치). */
const MAX_TEAM_IMAGES = 3
const MAX_MESSAGE = '팀 이미지는 최대 3개까지 등록할 수 있습니다.'

/** 업로드 가능한 파일인지 판별한다(이미지 전용). */
function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

interface TeamImageUploadSectionProps {
  /** 현재 등록된 팀 이미지 개수(3개 이상이면 업로드 비활성화). */
  count: number
}

/**
 * 팀 이미지 업로드 영역.
 * 파일 선택/드롭으로 이미지를 순차 업로드한다(이미지 전용).
 * 현재 개수가 최대치(3) 이상이면 드롭존/버튼을 비활성화하고 안내 문구를 표시한다.
 */
export function TeamImageUploadSection({ count }: TeamImageUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const uploadMutation = useUploadTeamImageMutation()

  const isFull = count >= MAX_TEAM_IMAGES
  const remaining = Math.max(0, MAX_TEAM_IMAGES - count)

  const uploadFiles = async (files: File[]) => {
    if (isFull) {
      toast.error(MAX_MESSAGE)
      return
    }
    const allowed = files.filter(isImageFile)
    if (allowed.length === 0) return
    // 남은 슬롯만큼만 업로드 시도(초과분은 서버 400을 피해 클라이언트에서 컷)
    const toUpload = allowed.slice(0, remaining)
    let success = 0
    for (const file of toUpload) {
      try {
        await uploadMutation.mutateAsync(file)
        success += 1
      } catch (error) {
        // 개수 초과(400) 등 백엔드 메시지를 그대로 노출
        const data = isAxiosError(error) ? error.response?.data : undefined
        const rawMessage =
          data && typeof data === 'object' && 'message' in data
            ? (data as { message: unknown }).message
            : undefined
        const serverMessage =
          typeof rawMessage === 'string'
            ? rawMessage
            : `"${file.name}" 업로드에 실패했습니다`
        toast.error(serverMessage)
        break
      }
    }
    if (success > 0) toast.success(`${success}개 이미지가 업로드되었습니다`)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    void uploadFiles(files)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (isFull) return
    void uploadFiles(Array.from(e.dataTransfer.files))
  }

  return (
    <section className="bg-surface-white rounded-xl border border-border-light p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-nav font-semibold text-heading-dark">
          팀 이미지 업로드
        </h2>
        <span className="text-xs text-secondary-dark tabular-nums">
          {count} / {MAX_TEAM_IMAGES}
        </span>
      </div>

      {isFull && (
        <p className="rounded-md bg-surface-light px-4 py-3 text-sm text-secondary-dark [word-break:keep-all]">
          {MAX_MESSAGE}
        </p>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!isFull) setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
          isFull
            ? 'border-border-light bg-surface-light opacity-60'
            : isDragOver
              ? 'border-aircok-blue bg-surface-light'
              : 'border-border-light bg-surface-white'
        }`}
      >
        <svg
          className="w-8 h-8 text-secondary-dark"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-sm text-secondary-dark [word-break:keep-all]">
          이미지를 끌어다 놓거나 아래 버튼으로 선택하세요.
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending || isFull}
          className="inline-flex items-center justify-center bg-aircok-blue text-heading-light text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
        >
          {uploadMutation.isPending ? '업로드 중...' : '이미지 선택'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={isFull}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </section>
  )
}
