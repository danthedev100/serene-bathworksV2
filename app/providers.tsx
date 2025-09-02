// app/providers.tsx
'use client'
import { Toaster } from '@/components/ui/sonner'
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-center" />
    </>
  )
}
