'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useUploadDiagnosisImageMutation } from '@/features/diagnosis-image-editor'

/** 이미지 파일만 허용한다. */
function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * 진단 이미지 업로드 영역.
 * 파일 선택/드롭으로 여러 이미지를 순차 업로드한다.
 */
export function DiagnosisImageUploadSection() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const uploadMutation = useUploadDiagnosisImageMutation()

  const uploadFiles = async (files: File[]) => {
    const allowed = files.filter(isImageFile)
    if (allowed.length === 0) {
      toast.error('이미지 파일만 업로드할 수 있습니다')
      return
    }
    let success = 0
    for (const file of allowed) {
      try {
        await uploadMutation.mutateAsync(file)
        success += 1
      } catch {
        toast.error(`"${file.name}" 업로드에 실패했습니다`)
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
    <section className="bg-surface-white rounded-xl border border-border-light p-6 flex flex-col gap-4">
      <h2 className="text-nav font-semibold text-heading-dark">이미지 업로드</h2>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
          isDragOver
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
          disabled={uploadMutation.isPending}
          className="inline-flex items-center justify-center bg-aircok-blue text-heading-light text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
        >
          {uploadMutation.isPending ? '업로드 중...' : '파일 선택'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </section>
  )
}
