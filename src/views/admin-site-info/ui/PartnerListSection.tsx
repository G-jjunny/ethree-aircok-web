'use client'
import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { partnerListQueryOptions } from '@/entities/partner'
import type { Partner } from '@/entities/partner'
import {
  useDeletePartnerMutation,
  useReorderPartnersMutation,
  useUploadPartnerLogoMutation,
} from '@/features/partner-editor'
import { ConfirmDialog } from '@/shared/ui'
import { extractUploadError } from '@/shared/api'
import { PartnerFormModal } from './PartnerFormModal'

type TabType = 'partner' | 'client'

export function PartnerListSection() {
  const { data: partners = [] } = useQuery(partnerListQueryOptions())
  const [activeTab, setActiveTab] = useState<TabType>('partner')
  const [editingPartner, setEditingPartner] = useState<Partner | undefined>(undefined)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const deleteMutation = useDeletePartnerMutation()
  const reorderMutation = useReorderPartnersMutation()
  const uploadLogoMutation = useUploadPartnerLogoMutation()

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const tabPartners = partners
    .filter((p) => p.type === activeTab)
    .sort((a, b) => a.order - b.order)

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const reordered = [...tabPartners]
    const temp = reordered[index - 1]
    reordered[index - 1] = reordered[index]
    reordered[index] = temp
    const items = reordered.map((p, i) => ({ id: p.id, order: i }))
    reorderMutation.mutate(items)
  }

  const handleMoveDown = (index: number) => {
    if (index === tabPartners.length - 1) return
    const reordered = [...tabPartners]
    const temp = reordered[index + 1]
    reordered[index + 1] = reordered[index]
    reordered[index] = temp
    const items = reordered.map((p, i) => ({ id: p.id, order: i }))
    reorderMutation.mutate(items)
  }

  const handleLogoChange = (id: string, file: File | undefined) => {
    if (!file) return
    uploadLogoMutation.mutate({ id, file }, {
      onError: (error) => {
        toast.error(extractUploadError(error, '로고 업로드에 실패했습니다'))
      },
    })
  }

  const handleDeleteConfirm = () => {
    if (!deletingId) return
    deleteMutation.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
      onError: (error) => {
        toast.error(extractUploadError(error, '파트너 삭제에 실패했습니다'))
        setDeletingId(null)
      },
    })
  }

  const tabLabel = activeTab === 'partner' ? '파트너사' : '고객사'

  return (
    <section className="bg-surface-white rounded-card border border-hairline p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-sm font-display font-semibold text-ink">파트너 & 고객사</h2>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand text-white rounded-btn px-4 py-2 min-h-11 text-sm font-medium hover:bg-brand-hover active:scale-[0.97] transition-colors"
        >
          {tabLabel} 추가
        </button>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-5">
        {(['partner', 'client'] as TabType[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={[
              'px-4 py-2 rounded-btn text-sm font-medium transition-colors',
              activeTab === tab
                ? 'bg-brand text-white'
                : 'bg-surface text-ink-soft hover:bg-hairline',
            ].join(' ')}
          >
            {tab === 'partner' ? '파트너사' : '고객사'}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {tabPartners.length === 0 ? (
        <p className="text-muted text-sm py-6 text-center">등록된 {tabLabel}이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {tabPartners.map((partner, index) => (
            <li
              key={partner.id}
              className="flex items-center gap-3 p-3 rounded-btn border border-hairline bg-surface"
            >
              {/* 로고 */}
              <div className="w-12 h-12 rounded-btn overflow-hidden flex-shrink-0 bg-surface-white border border-hairline flex items-center justify-center">
                {partner.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-muted text-xs">로고 없음</span>
                )}
              </div>

              {/* 이름 + 순서 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{partner.name}</p>
                <p className="text-xs text-muted">순서 {partner.order}</p>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* 위/아래 */}
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0 || reorderMutation.isPending}
                  className="p-1.5 rounded-btn text-ink-soft hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                  aria-label="위로 이동"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === tabPartners.length - 1 || reorderMutation.isPending}
                  className="p-1.5 rounded-btn text-ink-soft hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                  aria-label="아래로 이동"
                >
                  ▼
                </button>

                {/* 로고 업로드 */}
                <input
                  ref={(el) => { fileInputRefs.current[partner.id] = el }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleLogoChange(partner.id, e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[partner.id]?.click()}
                  disabled={uploadLogoMutation.isPending}
                  className="px-2.5 py-1 rounded-btn text-xs font-medium text-ink-soft bg-surface-white border border-hairline hover:bg-surface disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  로고
                </button>

                {/* 수정 */}
                <button
                  type="button"
                  onClick={() => setEditingPartner(partner)}
                  className="px-2.5 py-1 rounded-btn text-xs font-medium text-ink-soft bg-surface-white border border-hairline hover:bg-surface transition-colors"
                >
                  수정
                </button>

                {/* 삭제 */}
                <button
                  type="button"
                  onClick={() => setDeletingId(partner.id)}
                  className="px-2.5 py-1 rounded-btn text-xs font-medium text-error bg-surface-white border border-hairline hover:bg-surface transition-colors"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 추가 모달 */}
      <PartnerFormModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* 수정 모달 */}
      <PartnerFormModal
        open={editingPartner !== undefined}
        onClose={() => setEditingPartner(undefined)}
        partner={editingPartner}
      />

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={deletingId !== null}
        title="파트너 삭제"
        description="이 파트너를 삭제하면 복구할 수 없습니다. 계속하시겠습니까?"
        confirmLabel="삭제"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </section>
  )
}
