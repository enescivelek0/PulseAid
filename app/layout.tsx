import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/components/AppProvider';
import { AppShell } from '@/components/AppShell';

const manrope = Manrope({ subsets: ['latin', 'latin-ext'], weight: ['400', '600', '700', '800'], display: 'swap', variable: '--font-manrope' });

const SITE = 'https://pulse-aid-pearl.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'PulseAid – Acil Müdahale Paneli', template: '%s · PulseAid' },
  description:
    'PulseAid; kanama, boğulma, yanık ve kalp krizi gibi acil durumlarda adım adım görsel, sesli ve ritmik yönlendirme sunan, müdahaleyi zaman damgasıyla kaydeden çevrimdışı ilk yardım paneli.',
  keywords: ['ilk yardım', 'cpr', 'kalp masajı', 'heimlich', 'kanama', 'yanık', 'first aid', 'pwa'],
  authors: [{ name: 'Enes Civelek', url: 'https://github.com/enescivelek0' }],
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE,
    title: 'PulseAid – Acil Müdahale Paneli',
    description: 'Adım adım görsel, sesli ve ritmik ilk yardım rehberi. Çevrimdışı çalışır.',
  },
  twitter: { card: 'summary' },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'PulseAid' },
};

export const viewport: Viewport = {
  themeColor: '#0f1a30',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={manrope.variable} suppressHydrationWarning>
      <body className="min-h-[100dvh] selection:bg-crimson/30 selection:text-white">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
