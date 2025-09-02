// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import MainNav from '@/components/navigation/MainNav'
import Providers from './providers'
import Footer from '@/components/navigation/Footer'

export const metadata: Metadata = {
  title: 'Serene Bathworks',
  description: 'Handcrafted bath & body essentials made in South Africa',
  metadataBase: new URL('http://localhost:3000'), // change on deploy
  openGraph: { title: 'Serene Bathworks', description: 'Handcrafted bath & body essentials', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MainNav />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
