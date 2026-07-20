import { redirect } from 'next/navigation';

export default function AdminCertificationsPage() {
  // 특허·인증서는 통합 콘솔 `/console/diagnosis`의 "특허·인증서" 탭으로 흡수됨.
  redirect('/console/diagnosis?tab=certifications');
}
