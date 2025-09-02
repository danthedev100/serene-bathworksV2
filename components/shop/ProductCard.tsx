// components/shop/ProductCard.tsx
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function fromCents(c:number){ return (c/100).toFixed(2) }

export default function ProductCard({ product }: { product: any }) {
  const active = product.variants.filter((v: any) => v.active)
  const from = Math.min(...active.map((v: any) => v.priceCents))
  return (
    <Card className="hover:shadow-md transition group">
      <Link href={`/product/${product.slug}`}>
        <div className="relative">
          <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name}
               className="w-full h-64 object-cover rounded-t-xl"/>
          <div className="absolute inset-0 rounded-t-xl ring-1 ring-black/5 pointer-events-none" />
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium group-hover:underline">{product.name}</h3>
            <Badge>from R {fromCents(from)}</Badge>
          </div>
          <div className="text-xs text-gray-500 mt-1">{product.category?.name}</div>
        </CardContent>
      </Link>
    </Card>
  )
}
