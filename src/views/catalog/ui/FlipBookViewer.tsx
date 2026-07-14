"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ComponentType,
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import HTMLFlipBookDefault from "react-pageflip";

/**
 * react-pageflip의 HTMLFlipBook IProps는 모든 설정 필드를 required로 선언하지만
 * 런타임은 누락 필드에 기본값을 채운다. 실사용 가능한 partial props 타입으로
 * 좁혀 캐스팅한다(라이브러리 타입 정의 한계 회피).
 *
 * onFlip/onInit 등 이벤트 콜백은 상위 셸(CatalogViewerSection) 툴바·푸터가
 * 현재 페이지/총 페이지를 바인딩할 수 있도록 추가한다.
 */
type FlipEvent = { data: number };
type FlipBookProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  size?: "fixed" | "stretch";
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  showCover?: boolean;
  mobileScrollSupport?: boolean;
  drawShadow?: boolean;
  flippingTime?: number;
  usePortrait?: boolean;
  maxShadowOpacity?: number;
  onFlip?: (e: FlipEvent) => void;
  onInit?: (e: FlipEvent) => void;
  ref?: unknown;
};

const FlipBook = HTMLFlipBookDefault as unknown as ComponentType<FlipBookProps>;

/** react-pageflip 인스턴스의 명령형 API(실사용 메서드만 좁힌 타입). */
type PageFlipInstance = {
  flipNext: () => void;
  flipPrev: () => void;
  turnToPage: (page: number) => void;
  getCurrentPageIndex: () => number;
  getPageCount: () => number;
};

/**
 * 단일 페이지 폭(px). 양면 스프레드의 한 쪽 페이지 크기 기준값이다.
 * react-pageflip은 width/height를 px 수치로만 받으므로 인라인 수치가 불가피하다.
 */
const PAGE_WIDTH = 480;
const PAGE_HEIGHT = 640;
/** 양면(스프레드) 한 쪽 최소/최대 폭 — landscape 전환 임계값 계산에 사용. */
const PAGE_MIN_WIDTH = 320;
const PAGE_MAX_WIDTH = 560;

/**
 * 줌 한계와 휠 민감도.
 * - MIN=1: 기본(원본) 배율. 이 배율에서는 pan/preventDefault를 걸지 않아
 *   react-pageflip의 드래그 플립이 자연스럽게 동작한다(요구사항 3).
 * - MAX=2.6: 펼침면 세부를 읽기에 충분하면서 화질 저하/과확대를 막는 상한.
 * - WHEEL_ZOOM_STEP: 휠 1틱당 배율 변화량. deltaY(통상 ±100 단위)에 곱해
 *   한 틱이 약 0.1배 안팎으로 부드럽게 변하도록 잡은 계수.
 * - BUTTON_ZOOM_STEP: 툴바 −/+ 버튼 1클릭당 배율 변화량.
 * token 없음: 변환(scale) 수치는 디자인 토큰 대상이 아닌 인터랙션 파라미터.
 */
const ZOOM_MIN = 1;
const ZOOM_MAX = 2.6;
const WHEEL_ZOOM_STEP = 0.0015;
const BUTTON_ZOOM_STEP = 0.2;

/**
 * 페이지 슬롯. 실제 카탈로그 이미지 또는 양면 정렬을 위한 빈 페이지(blank)를 렌더한다.
 * react-pageflip 자식은 ref를 받을 수 있는 컴포넌트여야 하므로 forwardRef로 정의한다.
 */
const Page = forwardRef<
  HTMLDivElement,
  { src: string | null; pageNumber: number; total: number }
>(function Page({ src, pageNumber, total }, ref) {
  return (
    <div
      ref={ref}
      className="bg-surface-white flex items-center justify-center overflow-hidden"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`카탈로그 ${pageNumber}/${total} 페이지`}
          className="w-full h-full object-contain"
        />
      ) : (
        // 양면 정렬용 빈 페이지(뒤표지를 단독 면으로 보내기 위한 패딩)
        <div className="w-full h-full bg-surface-white" aria-hidden />
      )}
    </div>
  );
});

/** 상위 셸이 툴바 %·푸터 인디케이터·슬라이더에 바인딩하는 뷰어 상태 스냅샷. */
export interface FlipBookViewerState {
  currentPage: number;
  totalPages: number;
  zoom: number;
}

/** 상위 셸(CatalogViewerSection)이 툴바/화살표/슬라이더에서 호출하는 명령형 API. */
export interface FlipBookViewerHandle {
  flipPrev: () => void;
  flipNext: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  goToPage: (index: number) => void;
}

interface FlipBookViewerProps {
  /** 평탄화된 페이지 이미지 src 배열(이미지 항목 + PDF 분해 페이지). */
  pages: string[];
  /** 페이지/줌이 바뀔 때마다 호출 — 상위 셸이 툴바·푸터를 바인딩한다. */
  onStateChange?: (state: FlipBookViewerState) => void;
}

/**
 * react-pageflip 기반 2D 플립북 카탈로그 뷰어(순수 캔버스).
 * 이전/다음·줌·전체화면 컨트롤은 상위 셸(CatalogViewerSection)이 소유하고,
 * 이 컴포넌트는 imperative ref(메서드)와 onStateChange(상태)만 노출한다.
 */
export const FlipBookViewer = forwardRef<
  FlipBookViewerHandle,
  FlipBookViewerProps
>(function FlipBookViewer({ pages, onStateChange }, ref) {
  // HTMLFlipBook 인스턴스 ref — 상위 셸 명령을 위임한다.
  const bookRef = useRef<{ pageFlip: () => PageFlipInstance } | null>(null);

  // 휠 zoom의 preventDefault를 위해 non-passive 리스너를 직접 거는 뷰포트 컨테이너
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // 줌 배율(1 = 기본). 1보다 클 때만 pan을 활성화한다.
  const [zoom, setZoom] = useState(ZOOM_MIN);
  // 펼침면 이동량(px). transform translate에 적용.
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  // 현재 페이지(슬롯 인덱스)·총 페이지 — react-pageflip 인스턴스에서 동기화.
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // pan 드래그 상태(렌더 트리거가 불필요하므로 ref로 관리).
  const panState = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  }>({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 });

  // 최신 zoom/offset을 비동기 wheel 리스너에서 읽기 위한 ref 미러.
  const zoomRef = useRef(zoom);
  const offsetRef = useRef(offset);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  // 드래그 중에는 transition을 꺼 펼침면이 포인터를 즉시 따라오게 한다.
  const [isPanning, setIsPanning] = useState(false);

  const isZoomed = zoom > ZOOM_MIN;

  // 페이지/줌 변화를 상위 셸에 통지(툴바 %·푸터 인디케이터·슬라이더 바인딩).
  useEffect(() => {
    onStateChange?.({ currentPage, totalPages, zoom });
  }, [currentPage, totalPages, zoom, onStateChange]);

  const resetZoom = useCallback(() => {
    setZoom(ZOOM_MIN);
    setOffset({ x: 0, y: 0 });
  }, []);

  // 툴바 −/+ 버튼: 기존 setZoom을 스텝으로 감싸 재사용(중심 기준, offset은 축소시 리셋).
  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(ZOOM_MAX, z + BUTTON_ZOOM_STEP));
  }, []);
  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const next = Math.max(ZOOM_MIN, z - BUTTON_ZOOM_STEP);
      if (next === ZOOM_MIN) setOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // 상위 셸에 명령형 API 노출.
  useImperativeHandle(
    ref,
    (): FlipBookViewerHandle => ({
      flipPrev: () => bookRef.current?.pageFlip()?.flipPrev(),
      flipNext: () => bookRef.current?.pageFlip()?.flipNext(),
      zoomIn,
      zoomOut,
      resetZoom,
      goToPage: (index: number) => bookRef.current?.pageFlip()?.turnToPage(index),
    }),
    [zoomIn, zoomOut, resetZoom],
  );

  /**
   * 휠 zoom 핸들러. React onWheel은 passive로 등록되어 preventDefault가 무시되므로
   * useEffect에서 { passive: false }로 직접 등록한다(요구사항 3).
   */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const current = zoomRef.current;
      const next = Math.min(
        ZOOM_MAX,
        Math.max(ZOOM_MIN, current - e.deltaY * WHEEL_ZOOM_STEP),
      );

      // 기본(1배)에서 더 축소하려는 휠은 무시 — 페이지/플립 인터랙션을 통과시킨다.
      if (next === current) return;

      e.preventDefault();

      // 커서를 중심으로 확대: 컨테이너 중심 대비 커서 오프셋을 배율 변화량만큼 보정.
      const rect = el.getBoundingClientRect();
      const cursorX = e.clientX - rect.left - rect.width / 2;
      const cursorY = e.clientY - rect.top - rect.height / 2;
      const ratio = next / current;
      const prevOffset = offsetRef.current;
      const nextOffset =
        next === ZOOM_MIN
          ? { x: 0, y: 0 }
          : {
              x: cursorX - (cursorX - prevOffset.x) * ratio,
              y: cursorY - (cursorY - prevOffset.y) * ratio,
            };

      setZoom(next);
      setOffset(nextOffset);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // pan: zoom>1에서만 포인터로 펼침면을 이동(요구사항 2). 1배에서는 비활성.
  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (zoomRef.current <= ZOOM_MIN) return;
      panState.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        originX: offsetRef.current.x,
        originY: offsetRef.current.y,
      };
      setIsPanning(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const p = panState.current;
      if (!p.active) return;
      setOffset({
        x: p.originX + (e.clientX - p.startX),
        y: p.originY + (e.clientY - p.startY),
      });
    },
    [],
  );

  const endPan = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!panState.current.active) return;
    panState.current.active = false;
    setIsPanning(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  /**
   * 실제 책처럼 보이게 하는 페이지 슬롯 구성.
   * 표지(1) 다음 본문 페이지 수가 홀수이면 마지막 페이지 직전에 빈 페이지를 1장 삽입해
   * 뒤표지가 홀로 떨어지도록 보정한다(전체 슬롯 수를 짝수로 맞춤).
   */
  const slots = useMemo<(string | null)[]>(() => {
    if (pages.length <= 1) return pages;
    if (pages.length % 2 === 1) {
      return [...pages.slice(0, -1), null, pages[pages.length - 1]];
    }
    return pages;
  }, [pages]);

  // react-pageflip 인스턴스에서 현재/총 페이지를 읽어 상태에 반영.
  const syncFromInstance = useCallback(() => {
    const pf = bookRef.current?.pageFlip();
    if (!pf) return;
    setTotalPages(pf.getPageCount());
    setCurrentPage(pf.getCurrentPageIndex());
  }, []);

  return (
    <div
      ref={viewportRef}
      className={`w-full max-w-[1120px] overflow-hidden select-none ${
        // token 없음: 픽셀 폭 — react-pageflip이 부모 offsetWidth로 orientation을 계산하므로 양면 스프레드 임계값 유지를 위한 불가피한 수치
        // 확대 시에만 터치 제스처를 pan으로 전용 — 1배에서는 react-pageflip의 터치 플립을 유지.
        isZoomed ? "touch-none" : ""
      }`}
    >
      {/*
        transform 레이어: scale/translate로 확대·이동을 적용한다.
        token 없음: transform/cursor는 인터랙션 파라미터로 디자인 토큰 대상이 아니다.
      */}
      <div
        onPointerDown={isZoomed ? handlePointerDown : undefined}
        onPointerMove={isZoomed ? handlePointerMove : undefined}
        onPointerUp={isZoomed ? endPan : undefined}
        onPointerCancel={isZoomed ? endPan : undefined}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: isPanning ? "none" : "transform 120ms ease-out",
          cursor: isZoomed ? "grab" : "auto",
        }}
      >
        <FlipBook
          ref={bookRef}
          width={PAGE_WIDTH}
          height={PAGE_HEIGHT}
          size="stretch"
          minWidth={PAGE_MIN_WIDTH}
          maxWidth={PAGE_MAX_WIDTH}
          minHeight={420}
          maxHeight={760}
          showCover
          mobileScrollSupport
          drawShadow
          flippingTime={700}
          usePortrait
          maxShadowOpacity={0.5}
          onInit={syncFromInstance}
          onFlip={(e) => setCurrentPage(e.data)}
          className="catalog-flipbook"
        >
          {slots.map((src, index) => (
            <Page
              key={src ? `${index}-${src.slice(0, 32)}` : `blank-${index}`}
              src={src}
              pageNumber={index + 1}
              total={slots.length}
            />
          ))}
        </FlipBook>
      </div>
    </div>
  );
});
