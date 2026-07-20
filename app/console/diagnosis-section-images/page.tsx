import { redirect } from 'next/navigation';

export default function AdminDiagnosisSectionImagesPage() {
  // 구성·비교 이미지는 통합 콘솔 `/console/diagnosis`의 "구성·비교 이미지" 탭으로 흡수됨.
  redirect('/console/diagnosis?tab=section-images');
}
