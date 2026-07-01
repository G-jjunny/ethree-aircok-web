'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { diagnosisImageListQueryOptions } from '@/entities/diagnosis-image'
import { AdminDiagnosisConsultationListView } from '@/widgets/admin-diagnosis-consultation-list'
import { AdminPageHeader } from '@/shared/ui'
import { DiagnosisImageUploadSection } from './DiagnosisImageUploadSection'
import { DiagnosisImageGridSection } from './DiagnosisImageGridSection'

type Tab = 'images' | 'consultations'

const TABS: { key: Tab; label: string }[] = [
  { key: 'images', label: '진단서비스 이미지 관리' },
  { key: 'consultations', label: '진단서비스 신청현황' },
]

export function AdminDiagnosisImagesView() {
  const [activeTab, setActiveTab] = useState<Tab>('images')
  const { data: images = [], isLoading } = useQuery(diagnosisImageListQueryOptions())

  return (
    <div>
      <AdminPageHeader
        title="진단서비스 신청 관리"
        description="진단서비스 페이지의 이미지와 상담 신청 내역을 관리합니다."
      />

      {/* 탭 네비게이션 */}
      <div className="border-b border-border-light px-6 lg:px-8">
        <nav className="flex gap-0" aria-label="진단서비스 관리 탭">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={[
                'px-4 py-3 text-sm font-medium font-body border-b-2 transition-colors',
                activeTab === tab.key
                  ? 'border-aircok-blue text-aircok-blue'
                  : 'border-transparent text-secondary-dark hover:text-heading-dark',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 lg:p-8 flex flex-col gap-8">
        {activeTab === 'images' ? (
          <>
            <DiagnosisImageUploadSection />
            <DiagnosisImageGridSection images={images} isLoading={isLoading} />
          </>
        ) : (
          <AdminDiagnosisConsultationListView />
        )}
      </div>
    </div>
  )
}
