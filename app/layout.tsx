import type { Metadata } from "next";
import { AppProviders } from "@/app/providers";
import { pretendard } from "@/shared/fonts";
import { SITE } from "@/shared/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),

  title: {
    default: `${SITE.name} ${SITE.nameEn}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} ${SITE.nameEn}`,
    description: SITE.description,
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} ${SITE.nameEn}`,
    description: SITE.description,
    images: ["/og-default.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Organization + WebSite 구조화 데이터(JSON-LD).
 * 검색엔진에 회사 정체성·연락처·소셜 프로필을 명시한다. SITE 상수에서 매핑한다.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  legalName: SITE.legalName,
  alternateName: SITE.nameEn,
  url: SITE.url,
  logo: `${SITE.url}/images/logos/logo.png`,
  description: SITE.description,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: SITE.contact.phone,
    email: SITE.contact.email,
    contactType: "customer service",
    areaServed: "KR",
    availableLanguage: ["Korean"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.contact.address,
    addressCountry: "KR",
  },
  sameAs: Object.values(SITE.social).filter(Boolean),
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  alternateName: SITE.nameEn,
  url: SITE.url,
  inLanguage: "ko-KR",
  description: SITE.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd),
          }}
        />
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
