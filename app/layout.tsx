// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import MainNav from '@/components/navigation/MainNav'
import Providers from './providers'
import Footer from '@/components/navigation/Footer'
import { Inter, Cormorant_Garamond } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant" });

export const metadata: Metadata = {
  title: 'Serene Bathworks',
  description: 'Handcrafted bath & body essentials made in South Africa',
  metadataBase: new URL('http://localhost:3000'), // change on deploy
  openGraph: {
    title: 'Serene Bathworks',
    description: 'Handcrafted bath & body essentials',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} font-sans`}>{children}</body>
    </html>
  );
}
