import { redirect } from 'next/navigation'

export default function AdminKitchenImagesPage() {
  // 주방 라우트는 `/console/kitchen`으로 통일됨.
  // 기존 북마크/링크가 깨지지 않도록 새 경로로 영구 이동시킨다.
  redirect('/console/kitchen')
}
