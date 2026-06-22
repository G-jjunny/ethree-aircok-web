import { redirect } from 'next/navigation';

export default function AdminMailSettingsPage() {
  // 이메일 설정은 문의 관리 페이지의 서브탭으로 흡수됨.
  // 기존 북마크/링크가 깨지지 않도록 해당 탭으로 영구 이동시킨다.
  redirect('/console/inquiries?tab=mail');
}
