// components/shop/CategoryChips.tsx
'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function CategoryChips({ categories, activeSlug }:{ categories: any[]; activeSlug?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  function setCategory(slug?: string) {
    const q = new URLSearchParams(params.toString())
    if (!slug) q.delete('c'); else q.set('c', slug)
    router.push(`${pathname}?${q.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <Chip active={!activeSlug} onClick={()=>setCategory(undefined)}>All</Chip>
      {categories.map(c => (
        <Chip key={c.id} active={activeSlug===c.slug} onClick={()=>setCategory(c.slug)}>{c.name}</Chip>
      ))}
    </div>
  )
}

function Chip({ active, onClick, children }:{ active?: boolean; onClick?: ()=>void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={cn('px-3 py-1 rounded-full border whitespace-nowrap', active ? 'bg-black text-white' : 'bg-white')}>
      {children}
    </button>
  )
}
