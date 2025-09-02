// components/shop/ProductCard.tsx
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

function fromCents(c: number) {
  return (c / 100).toFixed(2)
}

export default function ProductCard({ product }: { product: any }) {
  const active = product.variants.filter((v: any) => v.active)
  const from = Math.min(...active.map((v: any) => v.priceCents))
  return (
    <Card className="group transition hover:shadow-md">
      <Link href={`/product/${product.slug}`}>
        <div className="relative">
          <div className="relative h-64 rounded-t-xl overflow-hidden">
  <Image
    src={product.images?.[0] || '/placeholder.jpg'}
    alt={product.name}
    fill
    className="object-cover"
    sizes="(min-width: 768px) 33vw, 100vw"
    priority={false}
  />
</div>
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="h-64 w-full rounded-t-xl object-cover"
          />
          <div className="pointer-events-none absolute inset-0 rounded-t-xl ring-1 ring-black/5" />
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium group-hover:underline">{product.name}</h3>
            <Badge>from R {fromCents(from)}</Badge>
          </div>
          <div className="mt-1 text-xs text-gray-500">{product.category?.name}</div>
        </CardContent>
      </Link>
    </Card>
  )
}
