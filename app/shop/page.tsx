// app/shop/page.tsx
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/shop/ProductCard'
import CategoryChips from '@/components/shop/CategoryChips'
import SortSelect from '@/components/shop/SortSelect'

export const revalidate = 30

export default async function ShopPage({ searchParams }:{ searchParams?: { c?: string; sort?: string } }) {
  const categorySlug = searchParams?.c
  const sort = searchParams?.sort ?? 'new'

  const where = categorySlug ? { category: { slug: categorySlug } } : {}
  const orderBy =
    sort === 'price-asc' ? { variants: { _min: { priceCents: 'asc' } } } :
    sort === 'price-desc' ? { variants: { _max: { priceCents: 'desc' } } } :
    { createdAt: 'desc' as const }

  const products = await prisma.product.findMany({
    where, include: { variants: true, category: true }, orderBy
  })
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <main className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-semibold">Shop</h1>
        <div className="ml-auto flex items-center gap-3">
          <SortSelect />
        </div>
      </div>

      <CategoryChips categories={categories} activeSlug={categorySlug} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </main>
  )
}
