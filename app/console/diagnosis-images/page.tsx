import { redirect } from 'next/navigation';

export default function AdminDiagnosisImagesPage() {
  // 진단서비스 신청 내역은 통합 콘솔 `/console/diagnosis`의 "신청 내역" 탭으로 흡수됨.
  // 기존 북마크/링크가 깨지지 않도록 해당 탭으로 영구 이동시킨다.
  redirect('/console/diagnosis?tab=applications');
}
