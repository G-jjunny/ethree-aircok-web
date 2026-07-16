'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminAirDeviceListQueryOptions } from '@/entities/air-device'
import type { AirDevice } from '@/entities/air-device'
import { AdminPageHeader, Button } from '@/shared/ui'
import { AirDeviceListSection } from './AirDeviceListSection'
import { AirDeviceFormModal } from './AirDeviceFormModal'

type FormState = { mode: 'create' } | { mode: 'edit'; id: string }

/**
 * 공기질 측정기 관리 어드민 뷰(섹션 조합 역할).
 *
 * 목록은 어드민 엔드포인트라 미공개 측정기까지 포함한다.
 * 생성 부분 실패(레코드 생성 O · 사진 업로드 X) 시 수정 모달로 전환해 재시도를 유도한다.
 */
export function AdminAirDevicesView() {
  const { data: devices = [], isLoading } = useQuery(adminAirDeviceListQueryOptions())
  const [formState, setFormState] = useState<FormState | null>(null)
  /** 부분 실패로 수정 모달을 연 경우 상단 배너로 남기는 경고 메시지. */
  const [imageWarning, setImageWarning] = useState<string | null>(null)
  /**
   * 생성 직후 목록 refetch가 끝나기 전에도 수정 모달을 띄우기 위한 임시 스냅샷.
   * 목록에 해당 id가 도착하면 서버 데이터가 우선한다.
   */
  const [pendingDevice, setPendingDevice] = useState<AirDevice | null>(null)

  // 수정 대상은 목록에서 다시 찾는다 — 사진 업로드로 캐시가 갱신돼도 최신 imageUrl이 반영된다.
  const editingDevice =
    formState?.mode === 'edit'
      ? (devices.find((device) => device.id === formState.id) ??
        (pendingDevice?.id === formState.id ? pendingDevice : null))
      : null

  const closeForm = () => {
    setFormState(null)
    setImageWarning(null)
    setPendingDevice(null)
  }

  const openCreate = () => {
    setImageWarning(null)
    setPendingDevice(null)
    setFormState({ mode: 'create' })
  }

  const openEdit = (id: string) => {
    setImageWarning(null)
    setPendingDevice(null)
    setFormState({ mode: 'edit', id })
  }

  /** 레코드는 생성됐고 사진만 실패한 경우 — 생성된 측정기의 수정 모달로 전환한다. */
  const handlePartialSuccess = (device: AirDevice, message: string) => {
    setPendingDevice(device)
    setImageWarning(message)
    setFormState({ mode: 'edit', id: device.id })
  }

  return (
    <div>
      <AdminPageHeader
        title="공기질 측정기 관리"
        description="실내 공기질 관리 시스템의 측정기 모델을 등록·수정·정렬합니다."
      >
        <Button size="sm" onClick={openCreate}>
          측정기 등록
        </Button>
      </AdminPageHeader>

      <div className="p-6 lg:p-8">
        <AirDeviceListSection
          devices={devices}
          isLoading={isLoading}
          onEdit={openEdit}
        />
      </div>

      {formState?.mode === 'create' && (
        <AirDeviceFormModal
          mode="create"
          onClose={closeForm}
          onPartialSuccess={handlePartialSuccess}
        />
      )}

      {formState?.mode === 'edit' && editingDevice && (
        // key로 마운트를 고정해 defaultValues를 확정한다(목록 갱신이 입력을 리셋하지 않음).
        <AirDeviceFormModal
          key={editingDevice.id}
          mode="edit"
          device={editingDevice}
          imageWarning={imageWarning}
          onClose={closeForm}
        />
      )}
    </div>
  )
}
