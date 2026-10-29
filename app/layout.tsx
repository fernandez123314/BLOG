import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bloc de recuerdosgit remote -v · para nosotros',
  description: 'Un rincón romántico para guardar canciones, mensajes y momentos compartidos.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f1ec',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body>
    </html>
  )
}
