// components/shop/AddToCartButton.tsx
'use client'
import { useCart } from '@/lib/cart'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AddToCartButton({ variant, product, qty }:{ variant:any; product:any; qty:number }) {
  const add = useCart(s => s.add)
  return (
    <Button size="lg" className="w-full" onClick={()=>{
      add({
        variantId: variant.id,
        name: product.name,
        productSlug: product.slug,
        image: variant.image || product.images?.[0],
        priceCents: variant.priceCents,
        qty,
        size: variant.size,
        scent: variant.scent
      })
      toast.success('Added to cart', { description: `${product.name} — ${variant.size} / ${variant.scent}` })
    }}>
      Add to cart — R {(variant.priceCents*qty/100).toFixed(2)}
    </Button>
  )
}
