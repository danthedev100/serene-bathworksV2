// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-emerald-50 my-8">
        <div className="px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Serene Bathworks</h1>
            <p className="mt-4 text-balance text-gray-600">
              Small-batch bath salts, bombs, and shower steamers — blended with pure essential oils.
            </p>
            <div className="mt-6 flex gap-3">
              <Link className="inline-flex items-center rounded-lg bg-black px-5 py-3 text-white" href="/shop">
                Shop now
              </Link>
              <Link className="inline-flex items-center rounded-lg border px-5 py-3" href="/about">
                Learn more
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-xl bg-white/60 ring-1 ring-black/5" />
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-xl font-semibold mb-4">Popular</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <CategoryTile title="Bath Salts" href="/product/bath-salts" />
          <CategoryTile title="Bath Bombs" href="/product/bath-bombs" />
          <CategoryTile title="Shower Steamers" href="/product/shower-steamers" />
          <CategoryTile title="Gift Sets" href="/product/relax-gift-set" />
        </div>
      </section>
    </main>
  )
}

function CategoryTile({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href} className="rounded-xl border p-5 hover:shadow-sm transition bg-white">
      <div className="h-28 rounded-lg bg-gray-100 mb-3" />
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-500">Explore</div>
    </Link>
  )
}
