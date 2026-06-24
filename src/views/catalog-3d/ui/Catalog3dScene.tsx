'use client'

import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import type { CatalogImage } from '@/entities/catalog'

/** 상대 경로 이미지 URL을 백엔드 절대 URL로 보정한다(NewsImage 패턴). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

/**
 * three / @react-three/fiber / @react-three/drei 의존을 catalog-3d 슬라이스 내부에
 * 완전히 격리하는 3D 씬 컴포넌트.
 * WebGL Canvas는 SSR이 불가하므로 이 파일은 next/dynamic(ssr:false)로만 로드된다.
 */

/** 한 장의 카탈로그 이미지를 텍스처로 입힌 평면 메시(한 페이지). */
function CatalogPlane({
  image,
  position,
  rotationY,
}: {
  image: CatalogImage
  position: [number, number, number]
  rotationY: number
}) {
  const texture = useTexture(resolveSrc(image.url))
  // 이미지 비율을 유지하기 위해 텍스처 종횡비로 평면 크기 산출
  const { width, height } = useMemo(() => {
    const img = texture.image as { width?: number; height?: number } | undefined
    const ratio = img?.width && img?.height ? img.width / img.height : 0.75
    const h = 4
    return { width: h * ratio, height: h }
  }, [texture])

  return (
    <mesh position={position} rotation={[0, rotationY, 0]}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.85}
        metalness={0.05}
      />
    </mesh>
  )
}

/** 펼쳐진 두 페이지(스프레드)를 살짝 회전하며 떠 있게 만드는 그룹. */
function BookSpread({
  left,
  right,
}: {
  left?: CatalogImage
  right?: CatalogImage
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    // 마우스 위치에 따라 미세하게 기울이는 패럴랙스 효과
    const targetY = state.pointer.x * 0.3
    const targetX = -state.pointer.y * 0.15
    groupRef.current.rotation.y +=
      (targetY - groupRef.current.rotation.y) * 0.05
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * 0.05
  })

  return (
    <group ref={groupRef}>
      {left && (
        <Suspense fallback={null}>
          <CatalogPlane image={left} position={[-1.6, 0, 0]} rotationY={0.12} />
        </Suspense>
      )}
      {right && (
        <Suspense fallback={null}>
          <CatalogPlane image={right} position={[1.6, 0, 0]} rotationY={-0.12} />
        </Suspense>
      )}
    </group>
  )
}

interface Catalog3dSceneProps {
  images: CatalogImage[]
}

export default function Catalog3dScene({ images }: Catalog3dSceneProps) {
  // 두 페이지씩 스프레드 단위로 묶어 넘긴다.
  const [spreadIndex, setSpreadIndex] = useState(0)
  const spreadCount = Math.ceil(images.length / 2)

  const left = images[spreadIndex * 2]
  const right = images[spreadIndex * 2 + 1]

  const goPrev = () => setSpreadIndex((i) => Math.max(0, i - 1))
  const goNext = () => setSpreadIndex((i) => Math.min(spreadCount - 1, i + 1))

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* token 없음: max-w-[900px] aspect-[16/10] — 3D 카탈로그 캔버스 고정 폭·비율(WebGL 뷰포트 전용 1회성 수치) */}
      <div className="w-full max-w-[900px] aspect-[16/10] rounded-xl overflow-hidden border border-border-light bg-surface-dark">
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.1} />
          <Suspense fallback={null}>
            <BookSpread left={left} right={right} />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls
            enablePan={false}
            minDistance={4}
            maxDistance={11}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(Math.PI * 3) / 4}
          />
        </Canvas>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={spreadIndex === 0}
          className="inline-flex items-center justify-center rounded-md border border-border-light bg-surface-white px-4 py-2 min-h-[44px] text-sm font-medium text-heading-dark hover:bg-surface-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
        >
          이전
        </button>
        <span className="text-sm text-secondary-dark tabular-nums">
          {spreadCount === 0 ? 0 : spreadIndex + 1} / {spreadCount}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={spreadIndex >= spreadCount - 1}
          className="inline-flex items-center justify-center rounded-md border border-border-light bg-surface-white px-4 py-2 min-h-[44px] text-sm font-medium text-heading-dark hover:bg-surface-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
        >
          다음
        </button>
      </div>
    </div>
  )
}
