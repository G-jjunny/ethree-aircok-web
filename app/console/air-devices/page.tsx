import { redirect } from 'next/navigation';

export default function AdminAirDevicesPage() {
  // 공기질 측정기 관리는 통합 콘솔 `/console/indoor`의 "측정기" 탭으로 흡수됨.
  // 기존 북마크/링크가 깨지지 않도록 해당 탭으로 영구 이동시킨다.
  redirect('/console/indoor?tab=devices');
}
