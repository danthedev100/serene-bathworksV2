// components/shop/ProductGridSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {Array.from({length:6}).map((_,i)=>(
        <div key={i} className="rounded-xl border p-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
