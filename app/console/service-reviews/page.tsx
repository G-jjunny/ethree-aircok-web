import { redirect } from 'next/navigation';

export default function AdminServiceReviewsPage() {
  // 서비스 신청 이유는 통합 콘솔 `/console/diagnosis`의 "신청 이유" 탭으로 흡수됨.
  redirect('/console/diagnosis?tab=reasons');
}
