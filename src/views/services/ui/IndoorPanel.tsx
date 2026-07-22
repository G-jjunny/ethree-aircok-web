import { Suspense } from 'react'
import { IndoorBrandSection } from './IndoorBrandSection'
import { IndoorCloudSection } from './IndoorCloudSection'
import { IndoorDeviceSection } from './IndoorDeviceSection'
import { IndoorFlowSection } from './IndoorFlowSection'

/**
 * [탭 1] 실내 공기질 관리시스템 패널 — 서버 컴포넌트 조합.
 *
 * 데이터에 의존하는 섹션(device / cloud)만 `<Suspense>` 로 감싸 스트리밍하고,
 * 정적 섹션(brand strip / flow)은 경계 밖에 둬서 정적 셸에 프리렌더되게 한다(PPR).
 * 데이터 의존 섹션이 내부에서 `await connection()` 을 호출하므로 빌드 타임(백엔드 미기동)에
 * 빈 셸이 정적으로 굳지 않는다.
 */
export function IndoorPanel() {
  return (
    <>
      <IndoorBrandSection />

      <IndoorFlowSection />

      <Suspense fallback={<div className="min-h-150 bg-surface" />}>
        <IndoorDeviceSection />
      </Suspense>

      <Suspense fallback={<div className="min-h-150 bg-surface-white" />}>
        <IndoorCloudSection />
      </Suspense>
    </>
  )
}
