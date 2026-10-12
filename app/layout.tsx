import type { Metadata, Viewport } from 'next';
import { wedding } from '@/config/wedding';
import './globals.css';
const names = `${wedding.groom.uz} & ${wedding.bride.uz}`;
export const metadata: Metadata = {
  title: `${names} — To‘y taklifnomasi`,
  description: wedding.invitation.uz,
  ...(wedding.siteUrl ? { metadataBase: new URL(wedding.siteUrl) } : {}),
  openGraph: { title: `${names} — To‘y taklifnomasi`, description: wedding.invitation.uz, type: 'website', locale: 'uz_UZ', alternateLocale: 'ru_RU', ...(wedding.siteUrl ? { url: wedding.siteUrl, images: [{ url: `${wedding.siteUrl}/images/wedding-arch.webp`, width: 1024, height: 1536, alt: names }] } : {}) },
  robots: { index: false, follow: false },
  icons: { icon: '/icon.svg' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#f8f6f0' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang={wedding.defaultLanguage}><body>{children}</body></html>;
}
