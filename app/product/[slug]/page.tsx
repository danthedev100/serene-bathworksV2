// app/product/[slug]/page.tsx
import { prisma } from '@/lib/prisma'
import PDPClient from './pdp-client'

export default async function PDP({ params }:{ params:{ slug:string }}) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug }, include: { variants: true } })
  if (!product) return <div className="p-6">Not found</div>

  const sizes = Array.from(new Set(product.variants.map(v => v.size)))
  const scents = Array.from(new Set(product.variants.map(v => v.scent)))

  return <PDPClient product={product} sizes={sizes} scents={scents} />
}
