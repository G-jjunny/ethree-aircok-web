'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useUploadCertificationMutation } from '@/features/certification-editor'
import { extractUploadError } from '@/shared/api'
import { IMAGE_FILE_ACCEPT, validateImageFile } from '@/shared/lib'

/**
 * 인증서·특허증 업로드 영역.
 * 파일 선택/드롭으로 여러 이미지를 순차 업로드한다(각 파일이 곧 레코드 1건).
 */
export function CertificationUploadSection() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const uploadMutation = useUploadCertificationMutation()

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return
    let success = 0
    for (const file of files) {
      // 서버 제약(MIME/5MB)을 클라이언트에서 먼저 거른다.
      const validationError = validateImageFile(file)
      if (validationError) {
        toast.error(`"${file.name}": ${validationError}`)
        continue
      }
      try {
        await uploadMutation.mutateAsync(file)
        success += 1
      } catch (error) {
        toast.error(
          extractUploadError(error, `"${file.name}" 업로드에 실패했습니다`),
        )
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
    void uploadFiles(Array.from(e.dataTransfer.files))
  }

  return (
    <section className="bg-surface-white rounded-card border border-hairline p-6 flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-ink">이미지 업로드</h2>
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
          특허증·성능인증서 이미지를 끌어다 놓거나 아래 버튼으로 선택하세요.
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="inline-flex items-center justify-center bg-brand text-white text-sm font-medium rounded-btn px-4 py-2 min-h-11 hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          {uploadMutation.isPending ? '업로드 중...' : '파일 선택'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={IMAGE_FILE_ACCEPT}
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </section>
  )
}
