// components/shop/SortSelect.tsx
'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SortSelect() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const value = params.get('sort') || 'new'

  function setSort(v: string) {
    const q = new URLSearchParams(params.toString())
    q.set('sort', v)
    router.push(`${pathname}?${q.toString()}`)
  }

  return (
    <Select value={value} onValueChange={setSort}>
      <SelectTrigger className="w-44"><SelectValue placeholder="Sort" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="new">Newest</SelectItem>
        <SelectItem value="price-asc">Price: Low → High</SelectItem>
        <SelectItem value="price-desc">Price: High → Low</SelectItem>
      </SelectContent>
    </Select>
  )
}
