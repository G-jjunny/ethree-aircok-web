'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  adminDiagnosisConsultationQueryOptions,
  diagnosisConsultationDetailQueryOptions,
  diagnosisConsultationKeys,
  updateDiagnosisConsultation,
  type DiagnosisConsultationListItem,
  type DiagnosisConsultationStatus,
  type UpdateDiagnosisConsultationBody,
} from '@/entities/diagnosis-consultation'

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatDateForInput(iso: string | null): string {
  if (!iso) return ''
  return iso.slice(0, 10)
}

const STATUS_LABELS: Record<DiagnosisConsultationStatus, string> = {
  NEW: '신규',
  IN_PROGRESS: '진행중',
  DONE: '완료',
}

const STATUS_CLASSES: Record<DiagnosisConsultationStatus, string> = {
  NEW: 'bg-aircok-blue/10 text-aircok-blue',
  IN_PROGRESS: 'bg-warning/10 text-warning',
  DONE: 'bg-success/10 text-success',
}

const STATUS_SELECT_CLASSES: Record<DiagnosisConsultationStatus, string> = {
  NEW: 'bg-aircok-blue/10 text-aircok-blue border-aircok-blue/20',
  IN_PROGRESS: 'bg-warning/10 text-warning border-warning/20',
  DONE: 'bg-success/10 text-success border-success/20',
}

const STATUS_OPTIONS: { value: DiagnosisConsultationStatus; label: string }[] = [
  { value: 'NEW', label: '신규' },
  { value: 'IN_PROGRESS', label: '진행중' },
  { value: 'DONE', label: '완료' },
]

function StatusBadge({ status }: { status: DiagnosisConsultationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium font-body ${
        STATUS_CLASSES[status] ?? 'bg-surface-light text-secondary-dark'
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

export function AdminDiagnosisConsultationListView() {
  // TRANSITIONAL(B2): query now returns a paginated envelope { data, total, page, limit }.
  const { data: res, isPending, isError, refetch, isRefetching } = useQuery(
    adminDiagnosisConsultationQueryOptions(),
  )
  const [selected, setSelected] = useState<DiagnosisConsultationListItem | null>(
    null,
  )

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16">
        <p className="text-secondary-dark font-body text-nav leading-[1.43]">
          불러오는 중...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16">
        <p className="text-error font-body text-nav leading-[1.43] [word-break:keep-all]">
          신청 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="inline-flex items-center justify-center bg-surface-light text-heading-dark text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-border-light active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isRefetching ? '다시 시도 중...' : '다시 시도'}
        </button>
      </div>
    )
  }

  if (!res || res.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16">
        <p className="text-body-dark font-body text-nav leading-[1.43]">
          접수된 신청이 없습니다.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="border border-border-light rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-light">
            <tr>
              <th className="text-left px-4 py-3 text-body-dark font-body font-medium whitespace-nowrap">
                신청일시
              </th>
              <th className="text-left px-4 py-3 text-body-dark font-body font-medium whitespace-nowrap">
                성함
              </th>
              <th className="text-left px-4 py-3 text-body-dark font-body font-medium whitespace-nowrap">
                전화번호
              </th>
              <th className="text-left px-4 py-3 text-body-dark font-body font-medium w-28">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {res.data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-surface-light transition-colors cursor-pointer"
                onClick={() => setSelected(item)}
              >
                <td className="px-4 py-3 text-secondary-dark font-body whitespace-nowrap">
                  {formatDateTime(item.createdAt)}
                </td>
                <td className="px-4 py-3 text-body-dark font-body">{item.name}</td>
                <td className="px-4 py-3 text-body-dark font-body">{item.phone}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSelected(null)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-surface-white border-l border-border-light z-50 flex flex-col shadow-card transition-transform duration-300 ${
          selected ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="신청 상세보기"
      >
        {selected && (
          <ConsultationDetailPanel
            key={selected.id}
            item={selected}
            onClose={() => setSelected(null)}
            onUpdated={(updated) => setSelected(updated)}
          />
        )}
      </div>
    </>
  )
}

function ConsultationDetailPanel({
  item,
  onClose,
  onUpdated,
}: {
  item: DiagnosisConsultationListItem
  onClose: () => void
  onUpdated: (updated: DiagnosisConsultationListItem) => void
}) {
  const queryClient = useQueryClient()

  // 목록 응답에는 consultant/notes가 없으므로 상세 조회로만 prefill한다.
  const {
    data: detail,
    isPending: isDetailPending,
    isError: isDetailError,
    refetch: refetchDetail,
    isRefetching: isDetailRefetching,
  } = useQuery(diagnosisConsultationDetailQueryOptions(item.id))

  const [status, setStatus] = useState<DiagnosisConsultationStatus>(item.status)
  const [consultationDate, setConsultationDate] = useState('')
  const [consultant, setConsultant] = useState('')
  const [notes, setNotes] = useState('')

  // 상세 응답 도착 시 최초 1회만 폼을 초기화한다.
  // (panel은 selected.id를 key로 remount되므로 item마다 ref가 새로 시작됨)
  const initializedRef = useRef(false)
  useEffect(() => {
    if (detail && !initializedRef.current) {
      initializedRef.current = true
      setStatus(detail.status)
      setConsultationDate(formatDateForInput(detail.consultationDate))
      setConsultant(detail.consultant ?? '')
      setNotes(detail.notes ?? '')
    }
  }, [detail])

  const { mutate, isPending } = useMutation({
    mutationFn: (body: UpdateDiagnosisConsultationBody) =>
      updateDiagnosisConsultation(item.id, body),
    onSuccess: (updated) => {
      toast.success('저장되었습니다')
      queryClient.invalidateQueries({ queryKey: diagnosisConsultationKeys.all })
      queryClient.setQueryData(
        diagnosisConsultationKeys.detail(item.id),
        updated,
      )
      onUpdated(updated)
    },
    onError: () => {
      toast.error('저장 중 오류가 발생했습니다')
    },
  })

  // 상세 미도착/실패 시 빈칸 저장 사고를 막기 위해 폼과 저장을 잠근다.
  const isFormReady = !!detail
  const isSaveDisabled = isPending || !isFormReady

  const handleSave = () => {
    if (!isFormReady) return
    mutate({
      status,
      consultationDate: consultationDate || undefined,
      consultant: consultant || undefined,
      notes: notes || undefined,
    })
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-light shrink-0">
        <h2 className="text-[17px] font-display font-semibold text-heading-dark [word-break:keep-all] truncate pr-4">
          {item.name}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-2 rounded-md text-secondary-dark hover:text-heading-dark hover:bg-surface-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue"
          aria-label="닫기"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <StatusBadge status={item.status} />
          <span className="text-sm text-secondary-dark font-body">
            {formatDateTime(item.createdAt)}
          </span>
        </div>

        <dl className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-body font-medium text-secondary-dark">성함</dt>
            <dd className="text-nav font-body text-heading-dark">{item.name}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-body font-medium text-secondary-dark">전화번호</dt>
            <dd className="text-nav font-body text-heading-dark">{item.phone}</dd>
          </div>
        </dl>

        <div className="border-t border-border-light pt-6 flex flex-col gap-4">
          <h3 className="text-sm font-display font-semibold text-heading-dark">상담 관리</h3>

          {isDetailPending ? (
            <div className="flex flex-col gap-4" aria-busy="true">
              {/* 상태 (select) */}
              <div className="flex flex-col gap-1">
                <div className="h-3.5 w-8 rounded-sm bg-surface-light animate-pulse" />
                <div className="h-9 w-24 rounded-full bg-surface-light animate-pulse" />
              </div>
              {/* 상담일자 (date) */}
              <div className="flex flex-col gap-1">
                <div className="h-3.5 w-14 rounded-sm bg-surface-light animate-pulse" />
                <div className="h-9 rounded-md bg-surface-light animate-pulse" />
              </div>
              {/* 상담자 (text) */}
              <div className="flex flex-col gap-1">
                <div className="h-3.5 w-12 rounded-sm bg-surface-light animate-pulse" />
                <div className="h-9 rounded-md bg-surface-light animate-pulse" />
              </div>
              {/* 추가내용 (textarea) */}
              <div className="flex flex-col gap-1">
                <div className="h-3.5 w-14 rounded-sm bg-surface-light animate-pulse" />
                <div className="h-24 rounded-md bg-surface-light animate-pulse" />
              </div>
            </div>
          ) : isDetailError ? (
            <div className="flex flex-col items-start gap-4 rounded-lg border border-border-light bg-surface-white p-4">
              <p className="text-error font-body text-sm leading-[1.43] [word-break:keep-all]">
                상담 상세 정보를 불러오지 못했습니다. 덮어쓰기 방지를 위해 저장이
                비활성화되었습니다.
              </p>
              <button
                type="button"
                onClick={() => refetchDetail()}
                disabled={isDetailRefetching}
                className="inline-flex items-center justify-center bg-surface-light text-heading-dark text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-border-light active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDetailRefetching ? '다시 시도 중...' : '다시 시도'}
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-body font-medium text-secondary-dark">상태</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as DiagnosisConsultationStatus)}
                  className={`text-sm font-medium font-body rounded-full px-3 py-2 border focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue ${STATUS_SELECT_CLASSES[status]}`}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-body font-medium text-secondary-dark">상담일자</label>
                <input
                  type="date"
                  value={consultationDate}
                  onChange={(e) => setConsultationDate(e.target.value)}
                  className="bg-surface-light text-body-dark text-sm font-body rounded-md px-3 py-2 border border-border-light focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-body font-medium text-secondary-dark">상담자</label>
                <input
                  type="text"
                  value={consultant}
                  onChange={(e) => setConsultant(e.target.value)}
                  placeholder="담당자 이름"
                  className="bg-surface-light text-body-dark text-sm font-body rounded-md px-3 py-2 border border-border-light focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue placeholder:text-secondary-dark"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-body font-medium text-secondary-dark">추가내용</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="상담 메모"
                  rows={4}
                  className="bg-surface-light text-body-dark text-sm font-body rounded-md px-3 py-2 border border-border-light focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue placeholder:text-secondary-dark resize-none"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-border-light shrink-0">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaveDisabled}
          className="w-full inline-flex items-center justify-center bg-aircok-blue text-heading-light text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? '저장 중...' : isDetailPending ? '불러오는 중...' : '저장'}
        </button>
      </div>
    </>
  )
}
