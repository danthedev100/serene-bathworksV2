// components/navigation/MainNav.tsx
'use client'
import Link from 'next/link'
import CartSheet from '@/components/cart/CartSheet'

export default function MainNav(){
  return (
    <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-40">
      <div className="container mx-auto p-4 flex items-center gap-6">
        <Link href="/" className="font-semibold">Serene Bathworks</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/ingredients">Ingredients</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="ml-auto">
          <CartSheet />
        </div>
      </div>
    </header>
  )
}
