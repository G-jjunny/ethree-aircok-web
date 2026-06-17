import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/app/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO: 실제 도메인으로 변경 (예: https://www.aircok.com)
const BASE_URL = "https://www.aircok.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    // TODO: 회사명으로 변경
    default: "Aircok",
    template: "%s | Aircok",
  },
  // TODO: 실제 사이트 설명으로 변경
  description: "Aircok 공식 홈페이지입니다.",

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
    // TODO: 회사명으로 변경
    siteName: "Aircok",
    title: "Aircok",
    description: "Aircok 공식 홈페이지입니다.",
    // app/opengraph-image.png 파일을 추가하면 자동 적용됨
  },

  twitter: {
    card: "summary_large_image",
    title: "Aircok",
    description: "Aircok 공식 홈페이지입니다.",
  },

  // 검색엔진 인덱싱 기본 허용
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
