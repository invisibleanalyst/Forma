import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/outfit';
import './globals.css';
import Pwa from '@/components/pwa';
export const metadata: Metadata = {
  title: 'Forma — iPhone Mockup Studio',
  description:
    'Create iPhone-style device mockups in your browser. Choose a frame, add a screenshot, adjust its placement, and export.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/icon-192.png' },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#244B35',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('forma-theme');document.documentElement.dataset.theme=(['light','dark','black'].includes(t)?t:null)||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
        <Pwa />
      </body>
    </html>
  );
}
