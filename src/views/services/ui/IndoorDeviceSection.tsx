import { connection } from 'next/server'
import { getAirDeviceListServer } from '@/entities/air-device/server'
import type { AirDevice } from '@/entities/air-device'
import { PagePlaceholder, SectionLabel } from '@/shared/ui'
import { IndoorDeviceCarousel } from './IndoorDeviceCarousel'

const COPY = {
  eyebrow: 'MEASURING DEVICE',
  title: '공기질 측정기',
  body: '설치 환경과 활용 목적에 맞춘 두 가지 모델. 온도·습도·미세먼지부터 유해가스까지 실시간으로 측정합니다.',
}

/** 모델 무관 공통 사양 — 시안 고정 문구(모델별 스펙은 API 데이터). */
const COMMON_SPECS = [
  '팬 수명 32,000 시간',
  '유량 0.1 L/분 · 자연대류',
  '측정·저장 간격 1분',
  '공인 성능인증 · KCL',
]

/**
 * [실내] 공기질 측정기 섹션 — air-device API 데이터 기반.
 *
 * 서버에서 목록을 조회해 클라이언트 캐러셀 leaf(IndoorDeviceCarousel)에 props 로 내려준다.
 * ('use client' 경계는 활성 인덱스 상태가 필요한 캐러셀에만 존재한다.)
 * 백엔드 미가용 시 빈 배열이 오므로 캐러셀 대신 줄무늬 폴백을 렌더한다 — 섹션 자체는 유지.
 */
export async function IndoorDeviceSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let devices: AirDevice[] = []
  try {
    devices = await getAirDeviceListServer()
  } catch {
    devices = []
  }

  return (
    <section className="bg-surface py-24">
      <div className="content-container">
        <SectionLabel color="brand">{COPY.eyebrow}</SectionLabel>
        <h2 className="mt-3 text-h6 sm:text-h5 font-extrabold tracking-headline text-ink">
          {COPY.title}
        </h2>
        {/* token 없음: max-w-[640px] 섹션 리드 프로즈 폭(1회성) */}
        <p className="mt-3 max-w-[640px] text-lead-sm leading-relaxed text-muted">
          {COPY.body}
        </p>

        {devices.length > 0 ? (
          <IndoorDeviceCarousel devices={devices} />
        ) : (
          <PagePlaceholder
            variant="surface"
            label={COPY.eyebrow}
            rounded="rounded-card-lg"
            className="mt-11 aspect-card w-full"
          />
        )}

        {/* 공통 사양 pill */}
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {COMMON_SPECS.map((spec) => (
            <li
              key={spec}
              className="rounded-pill bg-tint px-4 py-2.5 text-sm font-semibold text-brand"
            >
              {spec}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
