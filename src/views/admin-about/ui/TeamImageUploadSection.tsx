'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useUploadTeamImageMutation } from '@/features/team-image-editor'
import { extractUploadError } from '@/shared/api'

/** 업로드 가능한 파일인지 판별한다(이미지 전용). */
function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * 팀 이미지 업로드 영역.
 * 파일 하나를 선택/드롭하면 서버에 단일 업로드한다.
 * 이미지가 이미 존재하면 기존 레코드가 새 URL로 자동 교체된다(replace).
 */
export function TeamImageUploadSection() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const uploadMutation = useUploadTeamImageMutation()

  const uploadFile = async (file: File) => {
    try {
      await uploadMutation.mutateAsync(file)
      toast.success('이미지가 업로드되었습니다')
    } catch (error) {
      toast.error(extractUploadError(error, `"${file.name}" 업로드에 실패했습니다`))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter(isImageFile)
    if (files.length > 0) void uploadFile(files[0])
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter(isImageFile)
    if (files.length > 0) void uploadFile(files[0])
  }

  return (
    <section className="bg-surface-white rounded-card border border-hairline p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">
          팀 이미지 업로드
        </h2>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed px-6 py-12 text-center transition-colors ${
          isDragOver
            ? 'border-brand bg-surface'
            : 'border-hairline bg-surface-white'
        }`}
      >
        <svg
          className="w-8 h-8 text-muted"
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
        <p className="text-sm text-muted [word-break:keep-all]">
          이미지를 끌어다 놓거나 아래 버튼으로 선택하세요.
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="inline-flex items-center justify-center bg-brand text-white text-sm font-medium rounded-btn px-4 py-2 min-h-11 hover:bg-brand-hover active:scale-[0.97] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          {uploadMutation.isPending ? '업로드 중...' : '이미지 선택'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </section>
  )
}
