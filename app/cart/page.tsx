// app/cart/page.tsx
'use client'
import { useCart, totals } from '@/lib/cart'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CartPage(){
  const { items, remove, setQty } = useCart()
  const t = totals(items)

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <div>Cart is empty. <Link href="/shop" className="underline">Continue shopping</Link></div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {items.map(it => (
              <div key={it.variantId} className="flex items-center gap-4 border rounded p-3">
                <img src={it.image || '/placeholder.jpg'} className="w-20 h-20 object-cover rounded" alt="" />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-muted-foreground">{it.size} • {it.scent}</div>
                  <div className="text-sm">R {(it.priceCents/100).toFixed(2)} each</div>
                </div>
                <input type="number" value={it.qty} min={1} onChange={(e)=>setQty(it.variantId, parseInt(e.target.value||'1'))} className="w-16 border rounded px-2 py-1"/>
                <Button variant="ghost" onClick={()=>remove(it.variantId)}>Remove</Button>
              </div>
            ))}
          </div>
          <div className="border rounded p-4 space-y-2 h-fit">
            <div className="flex justify-between"><span>Subtotal</span><span>R {(t.subtotal/100).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{t.shipping===0 ? 'Free' : `R ${(t.shipping/100).toFixed(2)}`}</span></div>
            <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>R {(t.total/100).toFixed(2)}</span></div>
            <Link href="/checkout" className="block mt-2"><Button className="w-full">Checkout</Button></Link>
          </div>
        </div>
      )}
    </main>
  )
}
