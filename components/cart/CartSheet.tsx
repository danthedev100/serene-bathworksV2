// components/cart/CartSheet.tsx
'use client'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCart, totals } from '@/lib/cart'
import Link from 'next/link'
import Image from 'next/image'

export default function CartSheet() {
  const { items, remove, setQty } = useCart()
  const t = totals(items)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative inline-flex">
          <ShoppingCart />
          {items.length > 0 && (
            <span className="absolute -right-2 -top-2 grid h-5 w-5 place-content-center rounded-full bg-black text-xs text-white">
              {items.reduce((n, i) => n + i.qty, 0)}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[480px]">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-sm text-gray-500">Your cart is empty.</div>
          ) : (
            items.map((it) => (
              <div key={it.variantId} className="flex items-center gap-3">
                 <div className="relative size-16 overflow-hidden rounded">
  <Image
    src={it.image || '/placeholder.jpg'}
    alt={it.name}
    fill
    className="object-cover"
    sizes="64px"
  />
</div>
                <img
                  src={it.image || '/placeholder.jpg'}
                  alt={it.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{it.name}</div>
                  <div className="truncate text-xs text-gray-500">
                    {it.size} • {it.scent}
                  </div>
                  <div className="text-xs">R {(it.priceCents / 100).toFixed(2)} each</div>
                </div>
                <input
                  className="w-16 rounded border px-2 py-1"
                  type="number"
                  min={1}
                  value={it.qty}
                  onChange={(e) => setQty(it.variantId, parseInt(e.target.value || '1'))}
                />
                <Button variant="ghost" onClick={() => remove(it.variantId)}>
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 space-y-1 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R {(t.subtotal / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{t.shipping === 0 ? 'Free' : `R ${(t.shipping / 100).toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>R {(t.total / 100).toFixed(2)}</span>
          </div>
          <Link href="/checkout" className="block pt-2">
            <Button className="w-full">Checkout</Button>
          </Link>
          <Link href="/cart" className="block pt-1 text-center text-gray-600 underline">
            Go to full cart
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
